import {
	Component,
	ReactiveValue,
	css,
	xml as html,
	computed,
	sideEffect,
} from "destiny-ui";
import {
	type FontPair,
	type FontSpec,
	addFont,
	bodyFontSpecs,
	fontPresets,
	monoFontSpecs,
} from "../../config/font";
import { Demo } from "./Demo";
import type { Config } from "../../config";
import { Select } from "../Select";
import { Heading } from "../typography";

export class FontSettings extends Component<{ config: Config }> {
	#fontOptions: FontOptions = {
		...fontPresets,
		custom: this.config.customFonts,
	};

	static override styles = css`
		.demo-section {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;
			gap: 2rem;
		}
	`;

	override template = html`
		<div class="demo-section">
			${Object.keys(this.#fontOptions).map(
				(preset) =>
					html`<${FontSelector}
						prop:fonts=${this.config.fonts.pass}
						prop:fontOptions=${this.#fontOptions}
						prop:demoFontOption=${preset}
					/>`,
			)}
		</div>
		<${CustomFontSettings} prop:config=${this.config} />
	`;
}

export class FontSelector extends Component<{
	fontOptions: FontOptions;
	demoFontOption: keyof FontOptions;
	fonts: ReactiveValue<FontPair>;
}> {
	static override styles = css`
		${Demo}::part(inner) {
			background-color: var(--bg-3);
			transition: var(--color-transition);
			width: 20rem;
			height: auto;
		}

		.name {
			text-align: left;
		}

		.sans > .name {
			font-size: var(--fs-7);
			font-weight: 150;
			font-variation-settings: "wght" 150;
		}

		:is(.sans, .mono) > div {
			height: 1.3em;
		}

		.mono > .name {
			font-size: var(--fs-4);
		}

		.demo-text {
			font-size: var(--fs-2);
		}

		#contents {
			box-sizing: border-box;
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-evenly;
			gap: 1.2rem;
			padding: 1.2rem;
			overflow: hidden;
			white-space: nowrap;
			-webkit-mask-image: linear-gradient(
				90deg,
				var(--bg-3) 90%,
				transparent
			);
			mask-image: linear-gradient(90deg, var(--bg-3) 90%, transparent);
		}
	`;

	#preset = this.fontOptions[this.demoFontOption];

	connectedCallback() {
		addFont(this.#preset.body.value);
		addFont(this.#preset.mono.value);
		this.shadowRoot!.adoptedStyleSheets =
			this.shadowRoot!.adoptedStyleSheets!.concat([
				css`
					.sans {
						font-family: ${this.#preset.body.value.family};
					}

					.mono {
						font-family: ${this.#preset.mono.value.family};
					}
				`.styleSheet,
			]);
	}

	override template = html`
		<${Demo}
			tabindex="0"
			prop:disabled=${computed(
				() => this.fonts.value.builtinKey === this.#preset.builtinKey,
			)}
			on:click=${() => (this.fonts.value = this.#preset)}>
			<span slot="label">${fontOptionsLabels[this.demoFontOption]}</span>
			<div id="contents">
				<div class="sans">
					<div class="name">${computed(() => this.#preset.body.value.label)}</div>
					<div class="demo-text">${demoText}</div>
				</div>
				<div class="mono">
					<div class="name">${computed(() => this.#preset.mono.value.label)}</div>
					<div class="demo-text">${demoText}</div>
				</div>
			</div>
		</${Demo}>
	`;
}
export class CustomFontSettings extends Component<{ config: Config }> {
	static override styles = css`
		:host {
			transition: var(--color-transition);
		}

		#select-container {
			display: flex;
			flex-direction: column;
			gap: 1.25rem;
		}
		:host(.disabled) {
			color: var(--fg-4);
		}

		label {
			color: inherit;
			display: inline-block;
			margin: 0 0 0.5rem;
			font-size: var(--fs-2);
			font-weight: 325;
			font-variation-settings: "wght" 325;
		}
	`;

	static fontSpecsToFontOptions(
		fontSpecs: Readonly<Record<string, FontSpec>>,
	): Readonly<Record<string, FontSpec>> {
		return Object.fromEntries(
			Object.values(fontSpecs).map((spec) => [spec.label, spec]),
		);
	}

	static bodyFontOptions = this.fontSpecsToFontOptions(bodyFontSpecs);

	static monoFontOptions = this.fontSpecsToFontOptions(monoFontSpecs);

	static allFontOptions = this.fontSpecsToFontOptions({
		...bodyFontSpecs,
		...monoFontSpecs,
	});

	#bodyOptions = computed(() => {
		if (this.config.showAllForBodyFonts.value) {
			return CustomFontSettings.allFontOptions;
		} else {
			return CustomFontSettings.bodyFontOptions;
		}
	});

	#disabled = computed(
		() => this.config.fonts.value.builtinKey !== undefined,
	);

	connectedCallback() {
		sideEffect(() => {
			if (this.#disabled.value) {
				this.classList.add("disabled");
			} else {
				this.classList.remove("disabled");
			}
		});
	}

	override template = html`
		<${Heading} prop:level=${4}>Custom Font Settings</${Heading}>
		<div id="select-container">
			<div>
				<label for="body">Body font</label>
				<${Select}
					id="body"
					prop:disabled=${this.#disabled}
					prop:options=${this.#bodyOptions}
					prop:selectedValue=${this.config.customFonts.body.pass}
					prop:selectedKey=${this.config.customFonts.body.value.label}
					prop:searchBar=${true}
					prop:showMore=${this.config.showAllForBodyFonts.falsy(
						() => (this.config.showAllForBodyFonts.value = true),
					)}
					prop:showLess=${this.config.showAllForBodyFonts.truthy(
						() => (this.config.showAllForBodyFonts.value = false),
					)}
				>
					<span slot="show-more">Show monospace fonts</span>
					<span slot="show-less">Hide monospace fonts</span>
				</${Select}>
			</div>
			<div>
				<label for="mono">Monospace font</label>
				<${Select}
					id="body"
					prop:disabled=${this.#disabled}
					prop:options=${CustomFontSettings.monoFontOptions}
					prop:selectedValue=${this.config.customFonts.mono.pass}
					prop:selectedKey=${this.config.customFonts.mono.value.label}
					prop:searchBar=${true}
				/>
			</div>
		</div>
	`;
}

export type FontOptions = Record<keyof typeof fontPresets | "custom", FontPair>;

export const fontOptionsLabels: Record<keyof FontOptions, string> = {
	outfit: "Outfit",
	jetbrains: "JetBrains",
	source: "Source",
	fira: "Fira",
	plex: "IBM Plex",
	space: "Space",
	system: "System UI",
	custom: "Custom",
};

const demoText = "The quick brown fox jumped over the lazy dog";
