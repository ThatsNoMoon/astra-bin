use std::iter::repeat_with;

use futures_util::{stream, StreamExt};
use rand::{seq::SliceRandom, thread_rng};
use worker::{
	console_log, event, Context, Env, Error, Headers, Request, Response, Router,
};

use crate::utils::Context as _;

mod utils;

type Result<T, E = Error> = std::result::Result<T, E>;

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: Context) -> Result<Response> {
	utils::set_panic_hook();

	let router = Router::new();

	router
		.post_async("/p", |mut req, ctx| async move {
			console_log!("Creating paste");
			let contents = req.text().await?;

			if contents.len()
				> ctx
					.var("MAX_PASTE_LENGTH")?
					.to_string()
					.parse::<usize>()
					.context("Invalid maximum paste length")?
			{
				return Response::error("Paste too long", 413);
			}

			let key_len = ctx
				.var("KEY_LENGTH")?
				.to_string()
				.parse::<usize>()
				.context("Invalid key length")?;

			let paste_ttl = ctx
				.var("PASTE_TTL")?
				.to_string()
				.parse::<u64>()
				.context("Invalid key length")?;

			let kv = ctx.kv("pastes")?;

			let key = stream::iter(gen_keys(key_len))
				.filter(|key| {
					let key = key.clone();
					let kv = &kv;
					async move { matches!(kv.get(&key).bytes().await, Ok(None)) }
				})
				.boxed_local()
				.next()
				.await
				.expect("Failed to generate key");

			kv.put(&key, contents)
				.context("Failed to create paste")?
				.expiration_ttl(paste_ttl)
				.execute()
				.await
				.context("Failed to create paste")?;

			let client_host = ctx.var("CLIENT_ORIGIN")?.to_string();
			let mut headers = Headers::new();
			headers.set("Access-Control-Allow-Origin", &client_host)?;

			Response::ok(key).map(|resp| resp.with_headers(headers))
		})
		.get_async("/p/:id", |_, ctx| async move {
			console_log!("Retrieving paste");

			let id = ctx.param("id").context("No ID param")?;

			let kv = ctx.kv("pastes")?;

			let paste = kv
				.get(id)
				.text()
				.await
				.context("Failed to retrieve paste")?;

			let resp = match paste {
				Some(p) => Response::ok(p),
				None => Response::error("Paste not found", 404),
			};

			resp.and_then(|resp| {
				let client_host = ctx.var("CLIENT_ORIGIN")?.to_string();
				let mut headers = Headers::new();
				headers.set("Access-Control-Allow-Origin", &client_host)?;
				Ok(resp.with_headers(headers))
			})
		})
		.run(req, env)
		.await
}

fn gen_key(len: usize) -> String {
	const KEY_CHARSET: &str = "abcdefghkmprstuwxyz1234567890";

	KEY_CHARSET
		.as_bytes()
		.choose_multiple(&mut thread_rng(), len)
		.map(|&c| c as char)
		.collect()
}

fn gen_keys(len: usize) -> impl Iterator<Item = String> {
	repeat_with(move || gen_key(len))
}
