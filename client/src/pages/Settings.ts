import {
	Component,
	ReactiveValue,
	ReadonlyReactiveValue,
	computed,
	css,
	html,
} from "destiny-ui";
import {
	themeRules,
	type ThemeConfig,
	type DarkTheme,
	type LightTheme,
} from "../config/style";
import type { ThemeName } from "../config/style";
import { Heading } from "../components/typography";
import type { Config } from "../config";
import { presets, type FontPair, addFont } from "../config/font";

const themeLabels: Record<ThemeName, string> = {
	dark: "Deep space",
	dim: "Asteroid",
	pale: "Moonlight",
	light: "Supernova",
};

const fontPresetLabels: Record<keyof typeof presets, string> = {
	outfit: "Outfit",
	jetbrains: "JetBrains",
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
				<${AutoSelector}
					prop:theme=${this.config.theme}
				/>
				<${StaticSelector}
					prop:theme=${this.config.theme}
				/>
			</div>
			<div class="demo-section">
				<${ThemeSelector}
					prop:theme=${this.config.theme}
					prop:demoTheme=${"dark"}
					prop:autoTheme=${this.config.theme.autoDark.pass}
				/>
				<${ThemeSelector}
					prop:theme=${this.config.theme}
					prop:demoTheme=${"dim"}
					prop:autoTheme=${this.config.theme.autoDark.pass}
				/>
			</div>
			<div class="demo-section">
				<${ThemeSelector}
					prop:theme=${this.config.theme}
					prop:demoTheme=${"light"}
					prop:autoTheme=${this.config.theme.autoLight.pass}
				/>
				<${ThemeSelector}
					prop:theme=${this.config.theme}
					prop:demoTheme=${"pale"}
					prop:autoTheme=${this.config.theme.autoLight.pass}
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

class Demo extends Component {
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
			overflow: hidden;
			display: flex;
			flex-direction: column;
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

		:is(.sans, .name) > div {
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
			prop:disabled=${computed(() => this.fonts.value.builtinKey === this.#preset.builtinKey)}
			on:click=${() => (this.fonts.value = this.#preset)}>
			<span slot="label">${fontPresetLabels[this.demoPreset]}</span>
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

class AutoSelector extends Component<{ theme: ThemeConfig }> {
	static override styles = css`
		#slices {
			position: relative;
			height: 100%;
			width: 100%;
		}

		.slice {
			height: 100%;
			width: 100%;
		}

		#dark {
			clip-path: polygon(0% 0%, 100% 0%, 0% 100%);
		}

		#light {
			position: absolute;
			bottom: 0;
			right: 0;
			clip-path: polygon(100% 100%, 100% 0%, 0% 100%);
		}
	`;

	override template = html`
		<${Demo}
			tabindex="0"
			prop:disabled=${computed(() => this.theme.auto.value)}
			on:click=${() => (this.theme.auto.value = true)}>
			<span slot="label">Sync with system</span>
			<div id="slices">
				<div class="slice" id="dark">
					<${ThemeSkeleton}
						class=${this.theme.autoDark} />
				</div>
				<div class="slice" id="light">
					<${ThemeSkeleton}
						class=${this.theme.autoLight} />
				</div>
			</div>
		</${Demo}>
	`;
}

class StaticSelector extends Component<{ theme: ThemeConfig }> {
	override template = html`
		<${Demo}
			tabindex="0"
			prop:disabled=${computed(() => !this.theme.auto.value)}
			on:click=${() => (this.theme.auto.value = false)}>
			<span slot="label">Static theme</span>
			<${ThemeSkeleton} class=${this.theme.static} />
		</${Demo}>
	`;
}

class ThemeSelector<Section extends ThemeName> extends Component<{
	demoTheme: Section;
	theme: ThemeConfig;
	autoTheme: ReactiveValue<Section>;
}> {
	override template = html`
		<${Demo}
			tabindex="0"
			prop:disabled=${computed(() => {
				return this.theme.auto
					.truthy(this.autoTheme.value, this.theme.static.value)
					.pipe((selected) => selected === this.demoTheme).value;
			})}
			on:click=${() =>
				((this.theme.auto.value
					? this.autoTheme
					: this.theme.static
				).value = this.demoTheme)}>
			<span slot="label">${themeLabels[this.demoTheme]}</span>
			<${ThemeSkeleton} class=${this.demoTheme} />
		</${Demo}>
	`;
}

class ThemeSkeleton extends Component {
	static override styles = [
		themeRules,
		css`
			:host {
				display: flex;
				flex-direction: column;
				width: 100%;
				height: 100%;
			}

			#nav {
				background-color: var(--bg-3);
				transition: var(--color-transition);
				height: 1.5rem;
				width: 100%;
			}

			#container {
				box-sizing: border-box;
				padding: 0.5rem;
				height: 100%;
				width: 100%;
				background-color: var(--bg-4);
				transition: var(--color-transition);
			}

			#content {
				display: grid;
				height: 100%;
				width: 100%;
				grid-template-rows: repeat(6, calc(100% / 6));
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

	override template = html`
		<div id="nav" />
		<div id="container">
			<div id="content">
				<${SkeletonRow} prop:width=${"75%"}>
					<${Skeleton} class="fg" prop:grow=${3} />
					<${Skeleton} class="fg" prop:grow=${1.5} />
					<${Skeleton} class="fg" prop:grow=${2.5} />
				</${SkeletonRow}>
				<${SkeletonRow} prop:width=${"100%"}>
					<${Skeleton} class="fg" prop:grow=${1} />
					<${Skeleton} class="fg" prop:grow=${4} />
					<${Skeleton} class="fg" prop:grow=${1.5} />
				</${SkeletonRow}>
				<${SkeletonRow} prop:width=${"80%"}>
					<${Skeleton} class="accent-1" prop:grow=${1} />
					<${Skeleton} class="bg-3" prop:grow=${0.8} />
					<${Skeleton} class="primary" prop:grow=${1} />
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
			transition: var(--color-transition);
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
			transition: var(--color-transition);
		}
	`;

	connectedCallback() {
		this.style.setProperty("flex-grow", String(this.grow ?? 1));
	}
}
