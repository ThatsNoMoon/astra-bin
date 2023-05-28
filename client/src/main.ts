import {
	Component,
	ReactiveValue,
	computed,
	css,
	html,
	reactive,
	register,
} from "destiny-ui";
import { Router } from "./routing/Router";
import { CreatePaste } from "./pages/CreatePaste";
import { ViewPaste } from "./pages/ViewPaste";
import { NotFound } from "./components/NotFound";
import { type ThemeName, rootRules, themeRules, type DarkTheme, type LightTheme } from "./config/style";
import { Settings } from "./pages/Settings";
import { Navbar } from "./components/Navbar";
import { About } from "./pages/About";
import type { Config } from "./config";
import {
	presets as fontPresets,
	type FontPair,
	addFont,
	fontVars,
} from "./config/font";

document.adoptedStyleSheets = [rootRules.styleSheet];

register(
	class AppRoot extends Component {
		#config: Config = {
			theme: {
				autoDark: new ReactiveValue<DarkTheme>("dark"),
				autoLight: new ReactiveValue<LightTheme>("light"),
				static: new ReactiveValue<ThemeName>("dark"),
				auto: reactive(true),
			},
			fonts: new ReactiveValue<FontPair>(fontPresets.outfit),
		};

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
			computed(() => {
				this.classList.remove("auto", "dark", "dim", "pale", "light");
				if (theme.auto.value) {
					this.classList.add("auto");
					this.updateAutoDark();
					this.updateAutoLight();
				} else {
					this.classList.remove("auto-dark", "auto-dim", "auto-light", "auto-pale")
					this.classList.add(theme.static.value);
				}
			}, { dependents: [this] });

			theme.autoDark.bind(() => {
				this.updateAutoDark();
			});
			theme.autoLight.bind(() => {
				this.updateAutoLight();
			});

			computed(
				() => {
					const { body, mono, scale } = this.#config.fonts.value;

					this.style.setProperty(
						"font-family",
						`${body.value.family}, var(--system-ui)`
					);
					this.style.setProperty("--fs-scale", String(scale));

					addFont(body.value);
					addFont(mono.value);
				},
				{ dependents: [this] }
			);
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
