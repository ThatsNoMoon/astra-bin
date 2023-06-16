import {
	Component,
	ReactiveValue,
	ReadonlyReactiveValue,
	css,
	html,
	reactive,
	register,
	sideEffect,
} from "destiny-ui";
import { Router } from "./routing/Router";
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
	presets as fontPresets,
	addFont,
	fontVars,
	type FontSpec,
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
		body: FontSpec;
		scale: number;
		mono: FontSpec;
	};
};

function deserializeConfig(json: string): Config {
	const raw: SerializedConfig = JSON.parse(json);
	return {
		theme: reactive(raw.theme),
		fonts: new ReactiveValue({
			builtinKey: raw.fonts.builtinKey,
			body: new ReadonlyReactiveValue(raw.fonts.body),
			scale: new ReadonlyReactiveValue(raw.fonts.scale),
			mono: new ReadonlyReactiveValue(raw.fonts.mono),
		}),
	};
}

function loadConfig(): Config {
	const stored = localStorage.getItem("astra-config");
	const config: Config =
		stored !== null
			? deserializeConfig(stored)
			: {
					theme: {
						autoDark: new ReactiveValue("dark"),
						autoLight: new ReactiveValue("light"),
						static: new ReactiveValue("dark"),
						auto: reactive(true),
					},
					fonts: new ReactiveValue(fontPresets.outfit),
			  };

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
					--focus-outline: 5px solid var(--fg-1);
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
						"auto-pale"
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
					`${body.value.family}, var(--system-ui)`
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
						"/": () =>
							html`<${CreatePaste}
								prop:config=${this.#config}
							/>`,
						"/p": ([key]: [string]) =>
							html`<${ViewPaste}
								prop:key=${key}
								prop:config=${this.#config}
							/>`,
						"/settings": () =>
							html`<${Settings} prop:config=${this.#config} />`,
						"/about": () => html`<${About} />`,
					}}
					prop:notFound=${() => html`<${NotFound} />`}
				/>
			</main>
		`;
	}
);
