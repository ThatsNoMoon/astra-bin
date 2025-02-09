import { reactive, ReactiveValue, sideEffect } from "destiny-ui";
import { DarkTheme, LightTheme, ThemeConfig, ThemeName } from "./style";
import { FontConfig } from "./font";
import { Type as T, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export type Config = {
	theme: ThemeConfig;
	fonts: FontConfig;
	showMoreModes: ReactiveValue<boolean>;
	showAllForBodyFonts: ReactiveValue<boolean>;
};

const SerializedConfig = T.Object({
	theme: ThemeConfig,
	fonts: FontConfig,
	showMoreModes: T.Boolean({ default: false }),
	showAllForBodyFonts: T.Boolean({ default: false }),
});

type SerializedConfig = Static<typeof SerializedConfig>;

const defaultConfig = makeDefaultConfig();

function makeDefaultConfig(): SerializedConfig {
	const config = Value.Default(SerializedConfig, {});
	Value.Assert(SerializedConfig, config);
	return config;
}

function getSerializedConfig(): SerializedConfig {
	const json = localStorage.getItem("astra-config");
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

	return raw;
}

function makeConfigReactive(raw: SerializedConfig): Config {
	return {
		theme: {
			auto: reactive(raw.theme.auto),
			static: new ReactiveValue<ThemeName>(raw.theme.static),
			autoDark: new ReactiveValue<DarkTheme>(raw.theme.autoDark),
			autoLight: new ReactiveValue<LightTheme>(raw.theme.autoLight),
		},
		fonts: {
			body: new ReactiveValue(raw.fonts.body),
			mono: new ReactiveValue(raw.fonts.mono),
		},
		showMoreModes: reactive(raw.showMoreModes),
		showAllForBodyFonts: reactive(raw.showAllForBodyFonts),
	};
}

export function loadConfig(): Config {
	const config = makeConfigReactive(getSerializedConfig());

	sideEffect(() => {
		localStorage.setItem("astra-config", JSON.stringify(config));
	});

	return config;
}
