import { Component, css, html, register, sideEffect } from "destiny-ui";
import { Router, type Routes } from "./Router";
import { CreatePaste } from "./pages/CreatePaste";
import { ViewPaste } from "./pages/ViewPaste";
import { NotFound } from "./components/NotFound";
import { rootRules, themeRules } from "./config/style";
import { Settings } from "./pages/Settings";
import { Navbar } from "./components/Navbar";
import { About } from "./pages/About";
import { loadConfig, type Config } from "./config";
import { addFont, fontVars } from "./config/font";

document.adoptedStyleSheets = [rootRules.styleSheet];

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
			const { theme: theme } = this.#config;

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
				const fonts = this.#config.fonts.value;
				const body = fonts.body.value;
				const mono = fonts.mono.value;

				this.style.setProperty(
					"font-family",
					`${body.family}, var(--system-ui)`,
				);
				this.style.setProperty("--fs-scale", String(body.scale));

				addFont(body);
				addFont(mono);
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
