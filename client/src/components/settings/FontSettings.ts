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
		@media screen and (width >= 750px) {
			:host {
				max-width: 900px;
				display: grid;
				grid-auto-flow: column;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				grid-template-rows: 3rem repeat(var(--preset-count), 1fr);
				column-gap: 6rem;
			}
		}

		@media screen and (width < 750px) {
			:host {
				width: 100%;
				max-width: 375px;
				display: grid;
				grid-template-columns: 100%;
				grid-template-rows:
					3rem repeat(var(--preset-count), 1fr)
					6rem repeat(var(--preset-count), 1fr);
			}
		}

		.grid-heading {
			padding: 1rem 0;
			align-self: end;
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
				width: 100%;
				border-radius: 0;
				background-color: transparent;
				color: inherit;
				border: none;
				border-top: 1px solid var(--fg-3);
				transition: background-color var(--transition-time);
			}

			#content {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: space-evenly;
				box-sizing: border-box;
				height: 100%;
				width: 100%;
				padding: 1.2rem;
				gap: 1.2rem;
				overflow: hidden;
				white-space: nowrap;
				mask-image: linear-gradient(
					90deg,
					var(--bg-3) 90%,
					transparent
				);
				font-family: var(--font);
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
				left: calc(-3 * var(--width));
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
			<div id="content">
				<div class="name">${this.font.label}</div>
				<div class="demo-text">${demoText}</div>
			</div>
		</button>
	`;
}
