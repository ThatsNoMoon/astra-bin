import { reactive, ReactiveValue, sideEffect } from "destiny-ui";
import { DarkTheme, LightTheme, type ThemeConfig, ThemeName } from "./style";
import {
	bodyFontSpecs,
	BuiltinFontPair,
	CustomFontPair,
	type FontPair,
	fontPresets,
	fontSpecs,
	monoFontSpecs,
} from "./font";
import { Type as T, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export type Config = {
	theme: ThemeConfig;
	fonts: ReactiveValue<FontPair>;
	customFonts: FontPair;
	showMoreModes: ReactiveValue<boolean>;
	showAllForBodyFonts: ReactiveValue<boolean>;
};

const SerializedConfig = T.Object({
	theme: T.Object({
		autoDark: DarkTheme,
		autoLight: LightTheme,
		static: ThemeName,
		auto: T.Boolean(),
	}),
	fonts: T.Union([BuiltinFontPair, CustomFontPair]),
	customFonts: CustomFontPair,
	showMoreModes: T.Boolean(),
	showAllForBodyFonts: T.Boolean(),
});

type SerializedConfig = Static<typeof SerializedConfig>;

const defaultConfig: Config = {
	theme: {
		autoDark: new ReactiveValue<DarkTheme>("dark"),
		autoLight: new ReactiveValue<LightTheme>("light"),
		static: new ReactiveValue<ThemeName>("dark"),
		auto: reactive(true),
	},
	fonts: new ReactiveValue<FontPair>(fontPresets.outfit),
	customFonts: {
		builtinKey: undefined,
		body: new ReactiveValue(bodyFontSpecs.outfit),
		mono: new ReactiveValue(monoFontSpecs.fragment),
	},
	showMoreModes: reactive(false),
	showAllForBodyFonts: reactive(false),
};

function realizeFonts(config: SerializedConfig): {
	selected: FontPair;
	custom: FontPair;
} {
	const custom: FontPair = {
		builtinKey: undefined,
		body: new ReactiveValue(
			config.customFonts?.body ?? bodyFontSpecs.outfit,
		),
		mono: new ReactiveValue(config.customFonts?.mono ?? fontSpecs.fragment),
	};

	if (!("builtinKey" in config.fonts) || config.fonts.builtinKey == null) {
		return { selected: custom, custom };
	}

	const fontRecord: Record<string, FontPair> = fontPresets;
	const selected: FontPair =
		fontRecord[config.fonts.builtinKey] ?? fontPresets.outfit;

	return { selected, custom };
}

function deserializeConfig(json: string | null): Config {
	if (json == null) {
		return defaultConfig;
	}

	let raw;
	try {
		raw = Value.Parse(SerializedConfig, JSON.parse(json));
	} catch (e) {
		console.error("Error deserializing config:", e);
		return defaultConfig;
	}

	const { selected, custom } = realizeFonts(raw);
	return {
		theme: {
			auto: reactive(raw.theme.auto),
			static: new ReactiveValue<ThemeName>(raw.theme.static),
			autoDark: new ReactiveValue<DarkTheme>(raw.theme.autoDark),
			autoLight: new ReactiveValue<LightTheme>(raw.theme.autoLight),
		},
		fonts: new ReactiveValue(selected),
		customFonts: custom,
		showMoreModes: reactive(raw.showMoreModes),
		showAllForBodyFonts: reactive(
			raw.showAllForBodyFonts ?? defaultConfig.showAllForBodyFonts.value,
		),
	};
}

export function loadConfig(): Config {
	const stored = localStorage.getItem("astra-config");
	const config = deserializeConfig(stored);

	sideEffect(() => {
		localStorage.setItem("astra-config", JSON.stringify(config));
	});

	return config;
}
