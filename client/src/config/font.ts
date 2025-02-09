import { Type as T, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { ReactiveValue, css } from "destiny-ui";

const storage = "https://storage.thatsnomoon.dev/fonts";

export const bodyFontSpecs: Readonly<Record<BodyFontName, BodyFontSpec>> = {
	outfit: {
		family: `"Outfit"`,
		label: "Outfit",
		variants: [
			{
				family: "Outfit",
				source: `url(${storage}/Outfit-Variable.woff2)`,
				descriptors: {
					display: "swap",
				},
			},
		],
		scale: 1.1,
	},
	inter: {
		family: `"Inter"`,
		label: "Inter",
		variants: [
			{
				family: "Inter",
				source: `url(${storage}/Inter-Variable.woff2)`,
				descriptors: {
					display: "swap",
				},
			},
		],
		scale: 1,
	},
	sourceSans: {
		family: `"Source Sans"`,
		label: "Source Sans",
		variants: [
			{
				family: "Source Sans",
				source: `url(${storage}/SourceSans3-Variable-Upright.woff2)`,
				descriptors: {
					display: "swap",
				},
			},
			{
				family: "Source Sans",
				source: `url(${storage}/SourceSans3-Variable-Italic.woff2)`,
				descriptors: {
					style: "italic",
					display: "swap",
				},
			},
		],
		scale: 1.18,
	},
	firava: {
		family: `"Firava"`,
		label: "Firava",
		variants: [
			{
				family: "Firava",
				source: `url(${storage}/Firava.woff2)`,
				descriptors: {
					display: "swap",
				},
			},
		],
		scale: 1.05,
	},
	plexSans: {
		family: `"IBM Plex Sans"`,
		label: "IBM Plex Sans",
		variants: [
			{
				family: "IBM Plex Sans",
				source: `url(${storage}/IBMPlexSans-Variable.woff2)`,
				descriptors: {
					display: "swap",
				},
			},
			{
				family: "IBM Plex Sans",
				source: `url(${storage}/IBMPlexSans-Variable-Italic.woff2)`,
				descriptors: {
					style: "italic",
					display: "swap",
				},
			},
		],
		scale: 1.05,
	},
	spaceGrotesk: {
		family: `"Space Grotesk"`,
		label: "Space Grotesk",
		variants: [
			{
				family: "Space Grotesk",
				source: `url(${storage}/SpaceGrotesk-Variable.woff2`,
				descriptors: {
					display: "swap",
				},
			},
		],
		scale: 1,
	},
	systemUi: {
		family: "var(--system-ui)",
		label: "System UI",
		scale: 1,
	},
};

export const monoFontSpecs: Readonly<Record<MonoFontName, FontSpec>> = {
	fragment: {
		family: `"Fragment Mono"`,
		label: "Fragment Mono",
		variants: [
			{
				family: "Fragment Mono",
				source: `url(${storage}/FragmentMono-Regular.woff2`,
				descriptors: {
					display: "swap",
				},
			},
			{
				family: "Fragment Mono",
				source: `url(${storage}/FragmentMono-Italic.woff2`,
				descriptors: {
					display: "swap",
					style: "italic",
				},
			},
		],
	},
	jetbrainsMono: {
		family: `"JetBrains Mono"`,
		label: "JetBrains Mono",
		variants: [
			{
				family: "JetBrains Mono",
				source: `url(${storage}/JetBrainsMono-Variable.woff2)`,
				descriptors: {
					display: "swap",
				},
			},
			{
				family: "JetBrains Mono",
				source: `url(${storage}/JetBrainsMono-Variable-Italic.woff2)`,
				descriptors: {
					style: "italic",
					display: "swap",
				},
			},
		],
	},

	sourceCode: {
		family: `"Source Code Pro"`,
		label: "Source Code Pro",
		variants: [
			{
				family: "Source Code Pro",
				source: `url(${storage}/SourceCodePro-Variable-Upright.woff2)`,
				descriptors: {
					display: "swap",
				},
			},
			{
				family: "Source Code Pro",
				source: `url(${storage}/SourceCodePro-Variable-Italic.woff2)`,
				descriptors: {
					style: "italic",
					display: "swap",
				},
			},
		],
	},

	firaCode: {
		family: `"Fira Code"`,
		label: "Fira Code",
		variants: [
			{
				family: "Fira Code",
				source: `url(${storage}/FiraCode-Variable.woff2)`,
				descriptors: {
					display: "swap",
				},
			},
		],
	},
	plexMono: {
		family: `"IBM Plex Mono"`,
		label: "IBM Plex Mono",
		variants: [
			{
				family: "IBM Plex Mono",
				source: `url(${storage}/IBMPlexMono-Regular.woff2)`,
				descriptors: {
					display: "swap",
				},
			},
			{
				family: "IBM Plex Mono",
				source: `url(${storage}/IBMPlexMono-Italic.woff2)`,
				descriptors: {
					style: "italic",
					display: "swap",
				},
			},
		],
	},
	spaceMono: {
		family: `"Space Mono"`,
		label: "Space Mono",
		variants: [
			{
				family: "Space Mono",
				source: `url(${storage}/SpaceMono-Regular.woff2`,
				descriptors: {
					display: "swap",
				},
			},
			{
				family: "Space Mono",
				source: `url(${storage}/SpaceMono-Italic.woff2`,
				descriptors: {
					style: "italic",
					display: "swap",
				},
			},
		],
	},
	monospace: {
		family: "var(--monospace)",
		label: "Monospace",
	},
};

export const fontSpecs: Readonly<Record<FontSpecName, FontSpec>> = {
	...bodyFontSpecs,
	...monoFontSpecs,
};

const FontDisplay = T.Union([
	T.Literal("auto"),
	T.Literal("block"),
	T.Literal("fallback"),
	T.Literal("optional"),
	T.Literal("swap"),
]);

export const FontFaceData = T.Object({
	family: T.String(),
	source: T.String(),
	descriptors: T.Optional(
		T.Object({
			ascentOverride: T.Optional(T.String()),
			descentOverride: T.Optional(T.String()),
			display: T.Optional(FontDisplay),
			featureSettings: T.Optional(T.String()),
			lineGapOverride: T.Optional(T.String()),
			stretch: T.Optional(T.String()),
			style: T.Optional(T.String()),
			unicodeRange: T.Optional(T.String()),
			weight: T.Optional(T.String()),
		}),
	),
});

export const FontSpec = T.Object({
	family: T.String(),
	label: T.String(),
	variants: T.Optional(
		T.Unsafe<ReadonlyArray<FontFaceData>>(T.Array(FontFaceData)),
	),
	scale: T.Optional(T.Number()),
});

export const BodyFontSpec = T.Intersect(
	[
		FontSpec,
		T.Object({
			scale: T.Number(),
		}),
	],
	{ default: bodyFontSpecs.outfit },
);

export const MonoFontSpec = T.Intersect([FontSpec], {
	default: monoFontSpecs.fragment,
});

export type FontFaceData = Static<typeof FontFaceData>;

export type FontSpec = Static<typeof FontSpec>;

export type BodyFontSpec = FontSpec & {
	scale: number;
};

export type MonoFontSpec = FontSpec;

export const FontConfig = T.Object(
	{
		body: BodyFontSpec,
		mono: MonoFontSpec,
	},
	{
		default: () => ({
			body: Value.Default(BodyFontSpec, {}),
			mono: Value.Default(MonoFontSpec, {}),
		}),
	},
);

export type FontConfig = {
	body: ReactiveValue<BodyFontSpec>;
	mono: ReactiveValue<MonoFontSpec>;
};

export type FontPreset = {
	body: BodyFontSpec;
	mono: MonoFontSpec;
};

type BodyFontName =
	| "outfit"
	| "inter"
	| "sourceSans"
	| "firava"
	| "plexSans"
	| "spaceGrotesk"
	| "systemUi";

type MonoFontName =
	| "fragment"
	| "jetbrainsMono"
	| "sourceCode"
	| "firaCode"
	| "plexMono"
	| "spaceMono"
	| "monospace";

type FontSpecName = BodyFontName | MonoFontName;

export const fontPresets = {
	outfit: {
		body: bodyFontSpecs.outfit,
		mono: monoFontSpecs.fragment,
	},
	jetbrains: {
		body: bodyFontSpecs.inter,
		mono: monoFontSpecs.jetbrainsMono,
	},
	source: {
		body: bodyFontSpecs.sourceSans,
		mono: monoFontSpecs.sourceCode,
	},
	fira: {
		body: bodyFontSpecs.firava,
		mono: monoFontSpecs.firaCode,
	},
	plex: {
		body: bodyFontSpecs.plexSans,
		mono: monoFontSpecs.plexMono,
	},
	space: {
		body: bodyFontSpecs.spaceGrotesk,
		mono: monoFontSpecs.spaceMono,
	},
	system: {
		body: bodyFontSpecs.systemUi,
		mono: monoFontSpecs.monospace,
	},
} satisfies Record<string, FontPreset>;

export function addFont(font: FontSpec) {
	if (font.variants === undefined || font.label === "Outfit") {
		return;
	}

	for (const { family, source, descriptors } of font.variants) {
		document.fonts.add(new FontFace(family, source, descriptors));
	}
}

export const fontVars = css`
	:host {
		--fs-scale: 1;

		${[16, 18, 20, 24, 30, 36, 48, 60, 72]
			.map(
				(v, i) => `
					--fs-${i + 1}: calc(${v}px * var(--fs-scale));
				`,
			)
			.join("\n")}

		${[300, 300, 200, 175, 150]
			.map(
				(v, i) => `
					--fw-${i + 3}: ${v};
				`,
			)
			.join("\n")}

		--system-ui: -apple-system, BlinkMacSystemFont, avenir next, avenir,
			segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto,
			arial, sans-serif;
		--monospace: Menlo, Consolas, Monaco, Liberation Mono, Lucida Console,
			monospace;
	}
`;
