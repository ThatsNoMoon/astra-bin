import {
	Component,
	ReactiveValue,
	computed,
	css,
	xml as html,
} from "destiny-ui";
import {
	type FontSpec,
	addFont,
	fontPresets,
	fontVars,
} from "../../config/font";
import type { Config } from "../../config";

const presetList = Object.values(fontPresets);

export class FontSettings extends Component<{ config: Config }> {
	static override styles = css`
		:host {
			display: grid;
			grid-auto-flow: column;
			grid-template-columns: 1fr 1fr;
			grid-template-rows: 3rem repeat(var(--preset-count), 1fr);
			column-gap: 3rem;
			max-width: 800px;
		}

		.divider {
			grid-column: 1 / span 2;
			border-top: 1px solid var(--fg-3);
			height: 1px;
			box-sizing: border-box;
		}

		.grid-heading {
			font-size: var(--fs-3);
			font-weight: var(--fw-3);
			font-variation-settings: "wght" var(--fw-3);
		}
	`;

	#bodyFonts = presetList.map(({ body }) => body);

	#monoFonts = presetList.map(({ mono }) => mono);

	connectedCallback() {
		this.style.setProperty("--preset-count", String(presetList.length));
	}

	override template = html`
		<div class="grid-heading">Body font</div>
		${this.#bodyFonts.map((body) => {
			return html`
				<${FontSelector}
					prop:font=${body}
					prop:configReactive=${this.config.fonts.body.pass}
				/>
			`;
		})}
		<div class="grid-heading">Code font</div>
		${this.#monoFonts.map((mono) => {
			return html`
				<${FontSelector}
					prop:font=${mono}
					prop:configReactive=${this.config.fonts.mono.pass}
				/>
			`;
		})}
	`;
}

const demoText = "The quick brown fox jumps over the lazy dog";

class FontSelector<Spec extends FontSpec> extends Component<{
	font: Spec;
	configReactive: ReactiveValue<Spec>;
}> {
	static override styles = [
		fontVars,
		css`
			:host {
				display: contents;
			}

			#inner {
				position: relative;
				box-sizing: content-box;
				height: 5rem;
				border-radius: 0;
				background-color: transparent;
				color: inherit;
				border: none;
				padding: 0.5rem;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: space-evenly;
				gap: 1.2rem;
				padding: 1.2rem;
				border-top: 1px solid var(--fg-3);
				overflow: hidden;
				white-space: nowrap;
				-webkit-mask-image: linear-gradient(
					90deg,
					var(--bg-3) 90%,
					transparent
				);
				mask-image: linear-gradient(
					90deg,
					var(--bg-3) 90%,
					transparent
				);
				font-family: var(--font);
				transition: background-color var(--transition-time);
			}

			#inner:not(:disabled) {
				cursor: pointer;
			}

			#inner:hover {
				background-color: var(--bg-2);
			}

			#inner::before {
				content: "";
				--width: 4px;
				--padding: 1rem;
				position: absolute;
				left: 0;
				top: var(--padding);
				height: calc(100% - var(--padding) * 2);
				width: var(--width);
				border-top-left-radius: var(--width);
				border-bottom-left-radius: var(--width);
				background-color: var(--bg-5);
				transition: background-color var(--transition-time);
			}

			#inner:disabled::before {
				background-color: var(--accent-1-4);
			}

			#inner:not(:disabled):hover::before {
				background-color: var(--accent-1-2);
			}

			.name,
			.demo-text {
				height: 1.3em;
			}

			.name {
				text-align: left;
				font-size: var(--fs-4);
				font-weight: var(--fw-4);
				font-variation-settings: "wght" var(--fw-4);
			}

			.demo-text {
				font-size: var(--fs-2);
			}
		`,
	];

	connectedCallback() {
		addFont(this.font);
		this.style.setProperty("--font", this.font.family);
		if ("scale" in this.font) {
			this.style.setProperty("--fs-scale", String(this.font.scale));
		} else {
			this.style.setProperty("--fs-scale", "1");
		}
	}

	override template = html`
		<button
			id="inner"
			tabindex="0"
			prop:disabled=${computed(
				() => this.configReactive.value.family === this.font.family,
			)}
			on:click=${() => (this.configReactive.value = this.font)}
		>
			<div class="name">${this.font.label}</div>
			<div class="demo-text">${demoText}</div>
		</button>
	`;
}
