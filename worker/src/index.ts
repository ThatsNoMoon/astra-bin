import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { KVNamespace } from '@cloudflare/workers-types';
import { genUniqueKey, SUPPORTED_LANGUAGES } from './utils';

type Bindings = {
	pastes: KVNamespace;
	MAX_PASTE_LENGTH: string;
	KEY_LENGTH: string;
	PASTE_TTL: string;
	CLIENT_ORIGIN: string;
	CONTENT_TYPE_PREFIX: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	'*',
	cors({
		origin(_, c) {
			return c.env.CLIENT_ORIGIN;
		},
		allowHeaders: ['Content-Type'],
	}),
);

app.get('/p/:key', async (c) => {
	const key = c.req.param('key');

	if (key == null) {
		return c.notFound();
	}

	const { value: paste, metadata } = await c.env.pastes.getWithMetadata(key);

	if (paste == null) {
		return c.notFound();
	}

	if (metadata != null && typeof metadata === 'object' && 'language' in metadata) {
		c.header('Content-Type', `${c.env.CONTENT_TYPE_PREFIX}${metadata.language}`);
	}

	return c.body(paste);
});

app.post('/p', async (c) => {
	const contents = await c.req.text();
	const contentType = c.req.header('Content-Type');
	let language;
	if (contentType == null) {
		language = 'text';
	} else {
		const [beforePrefix, lang, afterLanguage] = contentType.split(c.env.CONTENT_TYPE_PREFIX);
		if (beforePrefix !== '' || lang == null || lang === '' || afterLanguage !== undefined) {
			c.status(400);
			return c.text(`Invalid content type ${contentType}`);
		}
		if (!SUPPORTED_LANGUAGES.includes(lang)) {
			c.status(400);
			return c.text(
				`Invalid language ${lang}\n\
				Supported languages:\n\
				${SUPPORTED_LANGUAGES.join('\n')}`,
			);
		}

		language = lang;
	}

	const key = genUniqueKey(Number(c.env.KEY_LENGTH), c.env.pastes);

	await c.env.pastes.put(key, contents, {
		metadata: { language },
		expirationTtl: Number(c.env.PASTE_TTL),
	});

	return c.text(key);
});

app.options('/p', (c) => c.newResponse(null));

export default app;
