import { ReadonlyReactiveValue, css } from "destiny-ui";

export type FontFaceData = {
	family: string;
	source: string;
	descriptors?: FontFaceDescriptors;
};

export type FontSpec = {
	family: string;
	label: string;
	variants?: ReadonlyArray<FontFaceData>;
};

export type BodyFontSpec = FontSpec & {
	scale: number;
};

export type FontPair = {
	builtinKey: string | undefined;
	body: ReadonlyReactiveValue<BodyFontSpec>;
	mono: ReadonlyReactiveValue<FontSpec>;
};

const storage = "https://storage.thatsnomoon.dev/fonts";

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

export const bodyFontSpecs: Readonly<Record<BodyFontName, BodyFontSpec>> = {
	outfit: {
		family: `"Outfit"`,
		label: "Outfit",
		variants: [
			{
				family: "Outfit",
				source: `url(${storage}/Outfit-Variable.woff2`,
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

export const fontPresets = {
	outfit: {
		builtinKey: "outfit",
		body: new ReadonlyReactiveValue(bodyFontSpecs.outfit),
		mono: new ReadonlyReactiveValue(monoFontSpecs.fragment),
	},
	jetbrains: {
		builtinKey: "jetbrains",
		body: new ReadonlyReactiveValue(bodyFontSpecs.inter),
		mono: new ReadonlyReactiveValue(monoFontSpecs.jetbrainsMono),
	},
	source: {
		builtinKey: "source",
		body: new ReadonlyReactiveValue(bodyFontSpecs.sourceSans),
		mono: new ReadonlyReactiveValue(monoFontSpecs.sourceCode),
	},
	fira: {
		builtinKey: "fira",
		body: new ReadonlyReactiveValue(bodyFontSpecs.firava),
		mono: new ReadonlyReactiveValue(monoFontSpecs.firaCode),
	},
	plex: {
		builtinKey: "plex",
		body: new ReadonlyReactiveValue(bodyFontSpecs.plexSans),
		mono: new ReadonlyReactiveValue(monoFontSpecs.plexMono),
	},
	space: {
		builtinKey: "space",
		body: new ReadonlyReactiveValue(bodyFontSpecs.spaceGrotesk),
		mono: new ReadonlyReactiveValue(monoFontSpecs.spaceMono),
	},
	system: {
		builtinKey: "system",
		body: new ReadonlyReactiveValue(bodyFontSpecs.systemUi),
		mono: new ReadonlyReactiveValue(monoFontSpecs.monospace),
	},
} satisfies Record<string, FontPair>;

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

		--system-ui: -apple-system, BlinkMacSystemFont, avenir next, avenir,
			segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto,
			arial, sans-serif;
		--monospace: Menlo, Consolas, Monaco, Liberation Mono, Lucida Console,
			monospace;
	}
`;
