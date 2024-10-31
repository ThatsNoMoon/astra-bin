import {
	Component,
	ReactiveValue,
	css,
	html,
	reactive,
	register,
	sideEffect,
} from "destiny-ui";
import { Router, type Routes } from "./Router";
import { CreatePaste } from "./pages/CreatePaste";
import { ViewPaste } from "./pages/ViewPaste";
import { NotFound } from "./components/NotFound";
import {
	type ThemeName,
	rootRules,
	themeRules,
	type DarkTheme,
	type LightTheme,
} from "./config/style";
import { Settings } from "./pages/Settings";
import { Navbar } from "./components/Navbar";
import { About } from "./pages/About";
import type { Config } from "./config";
import {
	addFont,
	fontVars,
	type FontSpec,
	type FontPair,
	fontPresets,
	fontSpecs,
} from "./config/font";

document.adoptedStyleSheets = [rootRules.styleSheet];

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

function loadConfig(): Config {
	const stored = localStorage.getItem("astra-config");
	const config: Config =
		stored !== null ? deserializeConfig(stored) : defaultConfig;

	sideEffect(() => {
		localStorage.setItem("astra-config", JSON.stringify(config));
	});

	return config;
}

register(
	class AppRoot extends Component {
		#config: Config = loadConfig();

		static override styles = [
			themeRules,
			fontVars,
			css`
				:host {
					position: relative;
					width: 100%;
					min-height: 100%;
					display: flex;
					flex-direction: column;
					background-color: var(--bg-4);
					color: var(--fg-1);
					--transition-time: 0.2s;
					--color-transition: color var(--transition-time),
						background-color var(--transition-time);
					transition: var(--color-transition);
					font-size: var(--fs-1);
					--focus-outline-width: 5px;
					--focus-outline: var(--focus-outline-width) solid
						var(--fg-1);
					--focus-outline-offset: 2px;
				}

				main {
					overflow-y: auto;
					scrollbar-color: var(--bg-1) var(--bg-4);
					flex-grow: 1;
				}
			`,
		];

		updateAutoDark() {
			this.classList.remove("auto-dark", "auto-dim");
			this.classList.add(`auto-${this.#config.theme.autoDark.value}`);
		}

		updateAutoLight() {
			this.classList.remove("auto-light", "auto-pale");
			this.classList.add(`auto-${this.#config.theme.autoLight.value}`);
		}

		connectedCallback() {
			const { theme } = this.#config;

			sideEffect(() => {
				this.classList.remove("auto", "dark", "dim", "pale", "light");
				if (theme.auto.value) {
					this.classList.add("auto");
					this.updateAutoDark();
					this.updateAutoLight();
				} else {
					this.classList.remove(
						"auto-dark",
						"auto-dim",
						"auto-light",
						"auto-pale",
					);
					this.classList.add(theme.static.value);
				}
			});

			sideEffect(() => {
				this.updateAutoDark();
			});

			sideEffect(() => {
				this.updateAutoLight();
			});

			sideEffect(() => {
				const { body, mono, scale } = this.#config.fonts.value;

				this.style.setProperty(
					"font-family",
					`${body.value.family}, var(--system-ui)`,
				);
				this.style.setProperty("--fs-scale", String(scale));

				addFont(body.value);
				addFont(mono.value);
			});
		}

		override template = html`
			<${Navbar} />
			<main>
				<${Router}
					prop:routes=${{
						"/": {
							type: "page",
							target: () =>
								html`<${CreatePaste}
									prop:config=${this.#config}
								/>`,
						},
						"/p": {
							type: "page",
							target: ([key]: ReadonlyArray<string>) =>
								html`<${ViewPaste}
									prop:key=${key}
									prop:config=${this.#config}
								/>`,
						},
						"/settings": {
							type: "modal",
							target: () =>
								html`<${Settings}
									prop:config=${this.#config}
								/>`,
						},
						"/about": {
							type: "modal",
							target: () => html`<${About} />`,
						},
					} satisfies Routes}
					prop:notFound=${() => html`<${NotFound} />`}
				/>
			</main>
		`;
	},
);
