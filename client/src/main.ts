import { Component, css, html, reactive, register } from "destiny-ui";
import { Router } from "./routing/Router";
import { CreatePaste } from "./pages/CreatePaste";
import { ViewPaste } from "./pages/ViewPaste";
import { NotFound } from "./components/NotFound";
import { rootRules, themeRules } from "./style";
import type { ThemeName } from "./style";
import { Settings } from "./pages/Settings";
import { Navbar } from "./components/Navbar";
import { About } from "./pages/About";

document.adoptedStyleSheets = [rootRules.styleSheet];

register(
	class AppRoot extends Component {
		#theme = reactive<ThemeName>("auto");
		static override styles = [
			themeRules,
			css`
				:host {
					font-family: "Inter", system-ui, "Helvetica", "Arial",
						sans-serif;
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
			this.#theme.bind((theme) => {
				this.classList.remove("auto", "dark", "dim", "pale", "light");
				this.classList.add(theme);
			});
		}

		override template = html`
			<${Navbar} />
			<main>
				<${Router}
					prop:routes=${{
						"/": () => html`<${CreatePaste} />`,
						"/p": ([key]: [string]) =>
							html`<${ViewPaste} prop:key=${key} />`,
						"/settings": () =>
							html`<${Settings}
								prop:theme=${this.#theme.pass}
							/>`,
						"/about": () => html`<${About} />`,
					}}
					prop:notFound=${() => html`<${NotFound} />`}
				/>
			</main>
		`;
	}
);
