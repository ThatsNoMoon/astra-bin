use std::{borrow::Cow, future::ready, iter::repeat_with};

use futures_util::{stream, StreamExt, TryFutureExt, TryStreamExt};
use rand::{seq::SliceRandom, thread_rng};
use serde::{Deserialize, Serialize};
use worker::{
	console_log, event, Context, Env, Error, Headers, Request, Response,
	RouteContext, Router,
};

use crate::utils::{supported_languages, Context as _};

mod utils;

type Result<T, E = Error> = std::result::Result<T, E>;

#[derive(Debug, Deserialize, Serialize)]
struct PasteMetadata<'s> {
	language: Cow<'s, str>,
}

#[event(fetch)]
pub async fn main(req: Request, env: Env, _ctx: Context) -> Result<Response> {
	utils::set_panic_hook();

	let router = Router::new();

	router
		.post_async("/p", create_paste)
		.options("/p", create_options)
		.get_async("/p/:id", get_paste)
		.run(req, env)
		.await
}

async fn create_paste(
	mut req: Request,
	ctx: RouteContext<()>,
) -> Result<Response> {
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
		.context("Invalid paste TTL")?;

	let kv = ctx.kv("pastes")?;

	let key = stream::iter(gen_keys(key_len).take(1000))
		.then(|key| kv.get(&key).bytes().map_ok(|v| (key, v)))
		.try_filter(|(_, value)| ready(value.is_none()))
		.map_ok(|(key, _)| key)
		.boxed_local()
		.next()
		.await
		.context("Failed to generate unique key")?
		.context("Failed to check for unique key")?;

	let content_type_prefix = ctx.var("CONTENT_TYPE_PREFIX")?.to_string();

	let content_type = req
		.headers()
		.get("Content-Type")
		.context("Failed to get content type header")?
		.unwrap_or(format!("{content_type_prefix}text"));

	let language = match content_type.strip_prefix(&content_type_prefix) {
		Some(language) => {
			if !supported_languages().contains(&language) {
				return Response::error(
					format!(
						"Unknown language {language}. Supported languages:\n{}",
						supported_languages().join("\n")
					),
					415,
				);
			}

			language
		}
		None => {
			return Response::error(
				format!(
					"Unknown content type {content_type}. \
					Expected `{content_type_prefix}<language>`. \
					Supported languages:\n{}",
					supported_languages().join("\n")
				),
				415,
			);
		}
	};

	let metadata = PasteMetadata {
		language: language.into(),
	};

	console_log!("metadata: {metadata:?}");

	kv.put(&key, contents)
		.context("Failed to create paste")?
		.expiration_ttl(paste_ttl)
		.metadata(metadata)
		.context("Failed to add metadata")?
		.execute()
		.await
		.context("Failed to create paste")?;

	let client_host = ctx.var("CLIENT_ORIGIN")?.to_string();
	let mut headers = Headers::new();
	headers.set("Access-Control-Allow-Origin", &client_host)?;

	Response::ok(key).map(|resp| resp.with_headers(headers))
}

fn create_options(_: Request, ctx: RouteContext<()>) -> Result<Response> {
	let resp = Response::empty();

	resp.and_then(|resp| {
		let client_host = ctx.var("CLIENT_ORIGIN")?.to_string();
		let mut headers = Headers::new();
		headers.set("Access-Control-Allow-Origin", &client_host)?;
		headers.set("Access-Control-Allow-Headers", "Content-Type")?;
		Ok(resp.with_headers(headers))
	})
}

async fn get_paste(_: Request, ctx: RouteContext<()>) -> Result<Response> {
	console_log!("Retrieving paste");

	let id = ctx.param("id").context("No ID param")?;

	let kv = ctx.kv("pastes")?;

	let (paste, metadata) = kv
		.get(id)
		.text_with_metadata::<PasteMetadata>()
		.await
		.context("Failed to retrieve paste")?;

	console_log!("metadata: {metadata:?}");

	let language = metadata.map_or("text".into(), |meta| meta.language);

	let resp = match paste {
		Some(p) => Response::ok(p),
		None => Response::error("Paste not found", 404),
	};

	resp.and_then(|resp| {
		let client_host = ctx.var("CLIENT_ORIGIN")?.to_string();
		let content_type_prefix = ctx.var("CONTENT_TYPE_PREFIX")?.to_string();
		let mut headers = Headers::new();
		headers.set("Access-Control-Allow-Origin", &client_host)?;
		headers
			.set("Content-Type", &format!("{content_type_prefix}{language}"))?;
		Ok(resp.with_headers(headers))
	})
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
