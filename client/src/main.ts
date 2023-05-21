import { Component, css, html, reactive, register } from 'destiny-ui'
import { Router, RouterLink } from './routing/Router';
import { CreatePaste } from './components/CreatePaste';
import { ViewPaste } from './components/ViewPaste';
import { NotFound } from './components/NotFound';
import { ThemeName, themeRules } from './theme';

import "./root.css";
import { Settings } from './components/Settings';
import { Button, types as buttonTypes } from './components/Button';

register(class AppRoot extends Component {
	#theme = reactive<ThemeName>("auto");
	static override styles = [themeRules, css`
		@font-face {
			font-family: 'Inter';
			font-style: normal;
			font-weight: normal;
			font-stretch: normal;
			src: url('https://storage.thatsnomoon.dev/fonts/Inter-Regular.woff2') format('woff2');
		}

		:host {		
			font-family: 'Inter', system-ui, 'Helvetica', 'Arial', sans-serif;
			min-height: 100%;
			min-width: 100%;
			padding: 1rem;
			display: flex;
			flex-direction: column;
			background-color: var(--bg-4);
			color: var(--fg-1);
		}

		.buttons {
			display: grid;
			grid-template-columns: repeat(2, 10rem);
			gap: 1rem;
		}
	`];

	constructor() {
		super();
		this.#theme.bind((theme) => {
			this.classList.remove("auto", "dark", "dim", "pale", "light");
			this.classList.add(theme);
		})
	}

	override template = html`
		<${Settings} prop:theme=${this.#theme.pass} />
		<ul>
			<li>
				<${RouterLink} prop:to=${"/"}>Create paste</${RouterLink}>
			</li>
			<li>
				<${RouterLink} prop:to=${"/p/1"}>View paste</${RouterLink}>
			</li>
			<li>
				<${RouterLink} prop:to=${"/unknown"}>Unknown</${RouterLink}>
			</li>
		</ul>
		<${Router}
			prop:routes=${{
				"/": () => html`<${CreatePaste} />`,
				"/p": ([id]: [string]) => html`<${ViewPaste} prop:paste=${id} />`,
			}}
			prop:notFound=${() => html`<${NotFound} />`}
		/>
		<div class="buttons">
			${Object.keys(buttonTypes).map(type =>
				html`<${Button} prop:type=${type}>${type}</${Button}>`
			)}
		</div>
	`;
})
