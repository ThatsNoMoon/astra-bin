import {
	ReactiveValue,
	ReadonlyReactiveValue,
	css,
	reactive,
} from "destiny-ui";

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

export type FontPair = {
	builtinKey: string | undefined;
	body: ReadonlyReactiveValue<FontSpec>;
	scale: ReadonlyReactiveValue<number>;
	mono: ReadonlyReactiveValue<FontSpec>;
};

const storage = "https://storage.thatsnomoon.dev/fonts";

const outfit: FontSpec = {
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
};

const fragment: FontSpec = {
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
};

export const presets = {
	outfit: {
		builtinKey: "outfit",
		scale: new ReadonlyReactiveValue(1.1),
		body: new ReadonlyReactiveValue(outfit),
		mono: new ReadonlyReactiveValue(fragment),
	},
	jetbrains: {
		builtinKey: "jetbrains",
		scale: new ReadonlyReactiveValue(1),
		body: new ReadonlyReactiveValue({
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
		}),
		mono: new ReadonlyReactiveValue({
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
		}),
	},
	source: {
		builtinKey: "source",
		scale: new ReadonlyReactiveValue(1.18),
		body: new ReadonlyReactiveValue({
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
		}),
		mono: new ReadonlyReactiveValue({
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
		}),
	},
	fira: {
		builtinKey: "fira",
		scale: new ReadonlyReactiveValue(1.05),
		body: new ReadonlyReactiveValue({
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
		}),
		mono: new ReadonlyReactiveValue({
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
		}),
	},
	plex: {
		builtinKey: "plex",
		scale: new ReadonlyReactiveValue(1.05),
		body: new ReadonlyReactiveValue({
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
					source: `url(${storage}/IBMPlexSans-Variable.woff2)`,
					descriptors: {
						style: "italic",
						display: "swap",
					},
				},
			],
		}),
		mono: new ReadonlyReactiveValue({
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
		}),
	},
	space: {
		builtinKey: "space",
		scale: new ReadonlyReactiveValue(1),
		body: new ReadonlyReactiveValue({
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
		}),
		mono: new ReadonlyReactiveValue({
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
		}),
	},
	system: {
		builtinKey: "system",
		scale: new ReadonlyReactiveValue(1),
		body: new ReadonlyReactiveValue({
			family: "var(--system-ui)",
			label: "System UI",
		}),
		mono: new ReadonlyReactiveValue({
			family: "var(--monospace)",
			label: "Monospace",
		}),
	},
	custom: {
		builtinKey: undefined,
		scale: reactive(1),
		body: new ReactiveValue(outfit),
		mono: new ReactiveValue(fragment),
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
				`
			)
			.join("\n")}

		--system-ui: -apple-system, BlinkMacSystemFont, avenir next, avenir,
			segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto,
			arial, sans-serif;
		--monospace: Menlo, Consolas, Monaco, Liberation Mono, Lucida Console,
			monospace;
	}
`;
