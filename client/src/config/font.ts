import {
	ReactiveValue,
	ReadonlyReactiveValue,
	css,
	reactive,
} from "destiny-ui";

export type FontSpec = {
	family: string;
	label: string;
	variants?: ReadonlyArray<FontFace>;
};

export type FontPair = {
	builtinKey: string | undefined;
	body: ReadonlyReactiveValue<FontSpec>;
	scale: ReadonlyReactiveValue<number>;
	mono: ReadonlyReactiveValue<FontSpec>;
};

const storage = "https://storage.thatsnomoon.dev/fonts";

const outfit = {
	family: `"Outfit"`,
	label: "Outfit",
	variants: [
		new FontFace("Outfit", `url(${storage}/Outfit-Variable.woff2`, {
			display: "swap",
		}),
	],
};

const fragment = {
	family: `"Fragment Mono"`,
	label: "Fragment Mono",
	variants: [
		new FontFace(
			"Fragment Mono",
			`url(${storage}/FragmentMono-Regular.woff2`,
			{
				display: "swap",
			}
		),
		new FontFace(
			"Fragment Mono",
			`url(${storage}/FragmentMono-Italic.woff2`,
			{
				display: "swap",
				style: "italic",
			}
		),
	],
};

export const presets = {
	outfit: {
		builtinKey: "outfit",
		scale: new ReadonlyReactiveValue(1.1),
		body: new ReadonlyReactiveValue<FontSpec>(outfit),
		mono: new ReadonlyReactiveValue<FontSpec>(fragment),
	},
	jetbrains: {
		builtinKey: "jetbrains",
		scale: new ReadonlyReactiveValue(1),
		body: new ReadonlyReactiveValue<FontSpec>({
			family: `"Inter"`,
			label: "Inter",
			variants: [
				new FontFace("Inter", `url(${storage}/Inter-Variable.woff2)`, {
					display: "swap",
				}),
			],
		}),
		mono: new ReadonlyReactiveValue<FontSpec>({
			family: `"JetBrains Mono"`,
			label: "JetBrains Mono",
			variants: [
				new FontFace(
					"JetBrains Mono",
					`url(${storage}/JetBrainsMono-Variable.woff2)`,
					{
						display: "swap",
					}
				),
				new FontFace(
					"JetBrains Mono",
					`url(${storage}/JetBrainsMono-Variable-Italic.woff2)`,
					{
						style: "italic",
						display: "swap",
					}
				),
			],
		}),
	},
	source: {
		builtinKey: "source",
		scale: new ReadonlyReactiveValue(1.18),
		body: new ReadonlyReactiveValue<FontSpec>({
			family: `"Source Sans"`,
			label: "Source Sans",
			variants: [
				new FontFace(
					"Source Sans",
					`url(${storage}/SourceSans3-Variable-Upright.woff2)`,
					{
						display: "swap",
					}
				),
				new FontFace(
					"Source Sans",
					`url(${storage}/SourceSans3-Variable-Italic.woff2)`,
					{
						display: "swap",
						style: "italic",
					}
				),
			],
		}),
		mono: new ReadonlyReactiveValue<FontSpec>({
			family: `"Source Code Pro"`,
			label: "Source Code Pro",
			variants: [
				new FontFace(
					"Source Code Pro",
					`url(${storage}/SourceCodePro-Variable-Upright.woff2)`,
					{
						display: "swap",
					}
				),
				new FontFace(
					"Source Code Pro",
					`url(${storage}/SourceCodePro-Variable-Italic.woff2)`,
					{
						display: "swap",
						style: "italic",
					}
				),
			],
		}),
	},
	fira: {
		builtinKey: "fira",
		scale: new ReadonlyReactiveValue(1.05),
		body: new ReadonlyReactiveValue<FontSpec>({
			family: `"Firava"`,
			label: "Firava",
			variants: [
				new FontFace("Firava", `url(${storage}/Firava.woff2)`, {
					display: "swap",
				}),
			],
		}),
		mono: new ReadonlyReactiveValue<FontSpec>({
			family: `"Fira Code"`,
			label: "Fira Code",
			variants: [
				new FontFace(
					"Fira Code",
					`url(${storage}/FiraCode-Variable.woff2)`,
					{
						display: "swap",
					}
				),
			],
		}),
	},
	plex: {
		builtinKey: "plex",
		scale: new ReadonlyReactiveValue(1.05),
		body: new ReadonlyReactiveValue<FontSpec>({
			family: `"IBM Plex Sans"`,
			label: "IBM Plex Sans",
			variants: [
				new FontFace(
					"IBM Plex Sans",
					`url(${storage}/IBMPlexSans-Variable.woff2)`,
					{
						display: "swap",
					}
				),
				new FontFace(
					"IBM Plex Sans",
					`url(${storage}/IBMPlexSans-Variable-Italic.woff2)`,
					{
						display: "swap",
						style: "italic",
					}
				),
			],
		}),
		mono: new ReadonlyReactiveValue<FontSpec>({
			family: `"IBM Plex Mono"`,
			label: "IBM Plex Mono",
			variants: [
				new FontFace(
					"IBM Plex Mono",
					`url(${storage}/IBMPlexMono-Regular.woff2)`,
					{
						display: "swap",
					}
				),
				new FontFace(
					"IBM Plex Mono",
					`url(${storage}/IBMPlexMono-Italic.woff2)`,
					{
						display: "swap",
						style: "italic",
					}
				),
			],
		}),
	},
	space: {
		builtinKey: "space",
		scale: new ReadonlyReactiveValue(1),
		body: new ReadonlyReactiveValue<FontSpec>({
			family: `"Space Grotesk"`,
			label: "Space Grotesk",
			variants: [
				new FontFace(
					"Space Grotesk",
					`url(${storage}/SpaceGrotesk-Variable.woff2`,
					{
						display: "swap",
					}
				),
			],
		}),
		mono: new ReadonlyReactiveValue<FontSpec>({
			family: `"Space Mono"`,
			label: "Space Mono",
			variants: [
				new FontFace(
					"Space Mono",
					`url(${storage}/SpaceMono-Regular.woff2`,
					{
						display: "swap",
					}
				),
				new FontFace(
					"Space Mono",
					`url(${storage}/SpaceMono-Italic.woff2`,
					{
						display: "swap",
						style: "italic",
					}
				),
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
		body: new ReactiveValue<FontSpec>(outfit),
		mono: new ReactiveValue<FontSpec>(fragment),
	},
} satisfies Record<string, FontPair>;

export function addFont(font: FontSpec) {
	if (font.variants === undefined || font.label === "Outfit") {
		return;
	}

	for (const variant of font.variants) {
		document.fonts.add(variant);
	}
}

export const fontVars = css`
	:host {
		--fs-scale: 1;
		--fs-1: calc(16px * var(--fs-scale));
		--fs-2: calc(18px * var(--fs-scale));
		--fs-3: calc(20px * var(--fs-scale));
		--fs-4: calc(24px * var(--fs-scale));
		--fs-5: calc(30px * var(--fs-scale));
		--fs-6: calc(36px * var(--fs-scale));
		--fs-7: calc(48px * var(--fs-scale));
		--fs-8: calc(60px * var(--fs-scale));
		--fs-9: calc(72px * var(--fs-scale));

		--system-ui: -apple-system, BlinkMacSystemFont, avenir next, avenir,
			segoe ui, helvetica neue, helvetica, Cantarell, Ubuntu, roboto, noto,
			arial, sans-serif;
		--monospace: Menlo, Consolas, Monaco, Liberation Mono, Lucida Console,
			monospace;
	}
`;
