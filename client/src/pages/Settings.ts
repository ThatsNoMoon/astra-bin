import { Component, ReactiveValue, computed, css, html } from "destiny-ui";
import { themeRules } from "../config/style";
import type { ThemeName } from "../config/style";
import { Heading } from "../components/typography";
import type { Config } from "../config";
import { presets, type FontPair, addFont } from "../config/font";

const themeLabels: Record<ThemeName, string> = {
	dark: "Deep space",
	dim: "Asteroid",
	auto: "Sync with system",
	pale: "Moonlight",
	light: "Supernova",
};

const fontPresetLabels: Record<keyof typeof presets, string> = {
	outfit: "Outfit",
	jetbrains: "Jetbrains",
	source: "Source",
	fira: "Fira",
	plex: "IBM Plex",
	space: "Space",
	system: "System UI",
	custom: "Custom",
};

export class Settings extends Component<{ config: Config }> {
	static override styles = css`
		:host {
			display: flex;
			flex-direction: column;
			gap: 2rem;
		}

		@media (width >= 500px) {
			:host {
				margin: 2rem;
			}

			#theme {
				border-radius: 1rem;
			}
		}

		section {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 2rem;
		}

		#theme {
			background-color: var(--bg-5);
			transition: var(--color-transition);
			padding: 2.5rem;
		}

		.demo-section {
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 2rem;
		}

		${Heading}::part(inner) {
			margin: 0;
		}
	`;

	override template = html`
		<${Heading} prop:level=${2}>Settings</${Heading}>
		<section id="theme">
			<${Heading} prop:level=${3}>UI Theme</${Heading}>
			<div class="demo-section">
				<${ThemeSelector}
					prop:theme=${this.config.theme.pass}
					prop:demoTheme=${"dark"}
				/>
				<${ThemeSelector}
					prop:theme=${this.config.theme.pass}
					prop:demoTheme=${"dim"}
				/>
			</div>
			<div class="demo-section">
				<${ThemeSelector}
					prop:theme=${this.config.theme.pass}
					prop:demoTheme=${"auto"}
				/>
			</div>
			<div class="demo-section">
				<${ThemeSelector}
					prop:theme=${this.config.theme.pass}
					prop:demoTheme=${"light"}
				/>
				<${ThemeSelector}
					prop:theme=${this.config.theme.pass}
					prop:demoTheme=${"pale"}
				/>
			</div>
		</section>
		<section>
			<${Heading} prop:level=${3}>Fonts</${Heading}>
			<div class="demo-section">
				${Object.keys(presets).map(
					(preset) =>
						html`<${FontSelector}
							prop:fonts=${this.config.fonts.pass}
							prop:demoPreset=${preset}
						/>`
				)}
			</div>
		</section>
	`;
}

class Demo extends Component<{}> {
	static override captureProps = true;
	static override styles = css`
		:host {
			display: contents;
		}

		label {
			display: inline-block;
			margin: 0 0 0.5rem;
			font-size: var(--fs-2);
			font-weight: 325;
			font-variation-settings: "wght" 325;
		}

		#inner {
			color: inherit;
			width: 10rem;
			height: 10rem;
			border-radius: 1rem;
			border: none;
			padding: 0;
			display: flex;
			flex-direction: column;
			background-color: var(--bg-4);
			overflow: hidden;
			--skeleton-radius: 0.5rem;
			transition: box-shadow 0.2s;
		}

		#inner:not(:disabled) {
			cursor: pointer;
		}

		#inner:disabled {
			box-shadow: 0 0 0 5px var(--palette-accent-1-4);
			color: inherit;
		}

		#inner:hover:not(:disabled) {
			box-shadow: 0 0 16px 0 var(--palette-accent-1-4);
		}
	`;

	override template = html`
		<label for="inner"><slot name="label" /></label>
		<button id="inner" part="inner" destiny:data=${this.elementData}>
			<slot />
		</button>
	`;
}

const demoText = "The quick brown fox jumped over the lazy dog";

class FontSelector extends Component<{
	demoPreset: keyof typeof presets;
	fonts: ReactiveValue<FontPair>;
}> {
	static override styles = css`
		${Demo}::part(inner) {
			background-color: var(--bg-3);
			width: 20rem;
			height: 15rem;
		}

		.name {
			font-size: var(--fs-8);
			height: var(--fs-8);
		}

		.demo-text {
			font-size: var(--fs-2);
			height: var(--fs-2);
		}

		#contents {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: space-evenly;
			overflow: hidden;
			white-space: nowrap;
			-webkit-mask-image: linear-gradient(90deg, var(--bg-3) 90%, transparent);
			mask-image: linear-gradient(90deg, var(--bg-3) 90%, transparent);
		}
	`;

	#preset = presets[this.demoPreset];

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
			prop:disabled=${computed(() => this.fonts.value === this.#preset)}
			on:click=${() => (this.fonts.value = this.#preset)}>
			<span slot="label">${fontPresetLabels[this.demoPreset]}</span>
			<div id="contents">
				<div class="sans name">${computed(() => this.#preset.body.value.label)}</div>
				<div class="sans demo-text">${demoText}</div>
				<div class="mono name">${computed(() => this.#preset.mono.value.label)}</div>
				<div class="mono demo-text">${demoText}</div>
			</div>
		</${Demo}>
	`;
}

class ThemeSelector extends Component<{
	demoTheme: ThemeName;
	theme: ReactiveValue<ThemeName>;
}> {
	static override styles = [
		themeRules,
		css`
			#nav {
				background-color: var(--bg-3);
				height: 1.5rem;
				width: 100%;
			}

			#container {
				box-sizing: border-box;
				padding: 0.5rem;
				height: 100%;
				width: 100%;
			}

			#content {
				display: grid;
				height: 100%;
				width: 100%;
				grid-template-rows: repeat(6, calc(100% / 6));
			}

			.row {
			}

			.fg {
				background-color: var(--fg-1);
			}

			.bg-1 {
				background-color: var(--bg-1);
			}

			.bg-3 {
				background-color: var(--bg-3);
			}

			.bg-4 {
				background-color: var(--bg-4);
			}

			.primary {
				background-color: var(--palette-primary-4);
			}

			.accent-1 {
				background-color: var(--palette-accent-1-4);
			}

			.accent-2 {
				background-color: var(--palette-accent-2-4);
			}

			.danger {
				background-color: var(--palette-danger-4);
			}
		`,
	];

	connectedCallback() {
		this.classList.add(this.demoTheme);
	}

	override template = html`
		<${Demo}
			tabindex="0"
			prop:disabled=${computed(() => this.theme.value === this.demoTheme)}
			on:click=${() => (this.theme.value = this.demoTheme)}>
			<span slot="label">${themeLabels[this.demoTheme]}</span>
			<div id="nav" />
			<div id="container">
				<div id="content">
					<${SkeletonRow} prop:width=${"80%"}>
						<${Skeleton} class="fg" prop:grow=${3} />
						<${Skeleton} class="fg" prop:grow=${1.5} />
						<${Skeleton} class="fg" prop:grow=${2.5} />
					</${SkeletonRow}>
					<${SkeletonRow} prop:width=${"100%"}>
						<${Skeleton} class="fg" prop:grow=${1} />
						<${Skeleton} class="fg" prop:grow=${4} />
						<${Skeleton} class="fg" prop:grow=${1.5} />
					</${SkeletonRow}>
					<${SkeletonRow} prop:width=${"75%"}>
						<${Skeleton} class="accent-1" />
						<${Skeleton} class="bg-3" />
						<${Skeleton} class="primary" />
					</${SkeletonRow}>
					<${SkeletonRow} prop:width=${"100%"}>
						<${Skeleton} class="bg-4" />
					</${SkeletonRow}>
					<${SkeletonRow} prop:width=${"100%"}>
						<${Skeleton} class="fg" prop:grow=${2} />
						<${Skeleton} class="fg" prop:grow=${1.5} />
						<${Skeleton} class="fg" prop:grow=${2} />
					</${SkeletonRow}>
					<${SkeletonRow} prop:width=${"90%"}>
						<${Skeleton} class="bg-1" />
						<${Skeleton} class="accent-2" />
						<${Skeleton} class="danger" />
					</${SkeletonRow}>
				</div>
			</div>
		</${Demo}>
	`;
}

class SkeletonRow extends Component<{ width: string }> {
	static override styles = css`
		:host {
			box-sizing: border-box;
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;
			padding: 0.25rem;
		}
	`;

	connectedCallback() {
		this.style.setProperty("width", this.width);
	}
}

class Skeleton extends Component<{ grow?: number }> {
	static override styles = css`
		:host {
			display: block;
			box-sizing: border-box;
			border-radius: var(--skeleton-radius);
			height: 100%;
		}
	`;

	connectedCallback() {
		this.style.setProperty("flex-grow", String(this.grow ?? 1));
	}
}
