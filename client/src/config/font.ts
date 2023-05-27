import { ReactiveValue, ReadonlyReactiveValue } from "destiny-ui";

export type FontSpec = {
	family: string;
	label: string;
	variants?: ReadonlyArray<FontFace>;
};

export type FontPair = {
	body: ReadonlyReactiveValue<FontSpec>;
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
		body: new ReadonlyReactiveValue<FontSpec>(outfit),
		mono: new ReadonlyReactiveValue<FontSpec>(fragment),
	},
	jetbrains: {
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
