import {
	Component,
	ReactiveValue,
	computed,
	css,
	html,
	register,
} from "destiny-ui";
import { Router } from "./routing/Router";
import { CreatePaste } from "./pages/CreatePaste";
import { ViewPaste } from "./pages/ViewPaste";
import { NotFound } from "./components/NotFound";
import { rootRules, themeRules, type ThemeName } from "./config/style";
import { Settings } from "./pages/Settings";
import { Navbar } from "./components/Navbar";
import { About } from "./pages/About";
import type { Config } from "./config";
import { presets as fontPresets, type FontPair, addFont } from "./config/font";

document.adoptedStyleSheets = [rootRules.styleSheet];

register(
	class AppRoot extends Component {
		#config: Config = {
			theme: new ReactiveValue<ThemeName>("auto"),
			fonts: new ReactiveValue<FontPair>(fontPresets.outfit),
		};

		static override styles = [
			themeRules,
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
				}

				main {
					overflow-y: auto;
					scrollbar-color: var(--bg-1) var(--bg-4);
					flex-grow: 1;
				}
			`,
		];

		connectedCallback() {
			this.#config.theme.bind((theme) => {
				this.classList.remove("auto", "dark", "dim", "pale", "light");
				this.classList.add(theme);
			});

			computed(
				() => {
					const fonts = this.#config.fonts.value;
					this.style.setProperty(
						"font-family",
						`${fonts.body.value.family}, var(--system-ui)`
					);
					addFont(fonts.body.value);
					addFont(fonts.mono.value);
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
