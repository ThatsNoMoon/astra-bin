import { reactive, ReactiveValue, sideEffect } from "destiny-ui";
import type { DarkTheme, LightTheme, ThemeConfig, ThemeName } from "./style";
import { fontPresets, fontSpecs, type FontPair, type FontSpec } from "./font";

export type Config = {
	theme: ThemeConfig;
	fonts: ReactiveValue<FontPair>;
	customFonts: FontPair;
	showMoreModes: ReactiveValue<boolean>;
	showAllForBodyFonts: ReactiveValue<boolean>;
};

type SerializedConfig = {
	theme: {
		autoDark: DarkTheme;
		autoLight: LightTheme;
		static: ThemeName;
		auto: boolean;
	};
	fonts: {
		builtinKey: string | undefined;
		scale: number;
		body: FontSpec;
		mono: FontSpec;
	};
	customFonts?: {
		builtinKey: undefined;
		body?: FontSpec;
		mono?: FontSpec;
	};
	showMoreModes: boolean;
	showAllForBodyFonts: boolean;
};

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
		scale: reactive(1),
		body: new ReactiveValue(fontSpecs.outfit),
		mono: new ReactiveValue(fontSpecs.fragment),
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
		scale: reactive(1),
		body: new ReactiveValue(config.customFonts?.body ?? fontSpecs.outfit),
		mono: new ReactiveValue(config.customFonts?.mono ?? fontSpecs.fragment),
	};
	const key = config.fonts.builtinKey;
	if (key == null) {
		return { selected: custom, custom };
	}

	const fontRecord: Record<string, FontPair> = fontPresets;
	const selected: FontPair = fontRecord[key] ?? fontPresets.outfit;

	return { selected, custom };
}

function deserializeConfig(json: string): Config {
	const raw: SerializedConfig = JSON.parse(json);
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
	const config: Config =
		stored !== null ? deserializeConfig(stored) : defaultConfig;

	sideEffect(() => {
		localStorage.setItem("astra-config", JSON.stringify(config));
	});

	return config;
}
