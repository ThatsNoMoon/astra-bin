import {
	Component,
	computed,
	css,
	xml as html,
	ReactiveValue,
} from "destiny-ui";
import type { Config } from "../../config";
import { Button } from "../Button";
import {
	themeRules,
	type ThemeConfig,
	type ThemeName,
} from "../../config/style";
import { Demo } from "./Demo";

export class ThemeSettings extends Component<{ config: Config }> {
	static override styles = css`
		:host {
			display: grid;
			grid-template-columns: min-content 1fr 1fr min-content;
			grid-template-areas:
				"none  none  none  none"
				"dark  dark  light light"
				"dim   dim   pale  pale";
			gap: 0.5rem;
			justify-items: center;
		}

		.hr-container {
			display: flex;
			flex-direction: column;
			justify-content: center;
			min-width: 3rem;
		}

		.hr-container hr {
			width: 100%;
		}

		${Button}::part(inner) {
			justify-self: stretch;
		}

		#auto-button::part(inner) {
			justify-content: end;
			border-top-left-radius: 1000rem;
			border-bottom-left-radius: 1000rem;
		}

		#static-button::part(inner) {
			border-top-right-radius: 1000rem;
			border-bottom-right-radius: 1000rem;
		}

		#dark-selector {
			grid-area: dark;
		}

		#light-selector {
			grid-area: light;
		}

		#dim-selector {
			grid-area: dim;
		}

		#pale-selector {
			grid-area: pale;
		}
	`;

	override template = html`
		<div class="hr-container">
			<hr />
		</div>
		<${Button}
			id="auto-button"
			prop:type=${this.config.theme.auto.truthy("accent-1", "accent-1-alt")}
			prop:selected=${this.config.theme.auto}
			on:click=${() => (this.config.theme.auto.value = true)}
		>
			Auto
		</${Button}>
		<${Button}
			id="static-button"
			prop:type=${this.config.theme.auto.falsy("accent-1", "accent-1-alt")}
			prop:selected=${this.config.theme.auto.falsy(true, false)}
			on:click=${() => (this.config.theme.auto.value = false)}
		>
			Static
		</${Button}>
		<div class="hr-container">
			<hr />
		</div>

		<${ThemeSelector}
			id="dark-selector"
			prop:theme=${this.config.theme}
			prop:demoTheme="dark"
			prop:autoTheme=${this.config.theme.autoDark.pass}
		/>
		<${ThemeSelector}
			id="light-selector"
			prop:theme=${this.config.theme}
			prop:demoTheme="light"
			prop:autoTheme=${this.config.theme.autoLight.pass}
		/>
		<${ThemeSelector}
			id="dim-selector"
			prop:theme=${this.config.theme}
			prop:demoTheme="dim"
			prop:autoTheme=${this.config.theme.autoDark.pass}
		/>
		<${ThemeSelector}
			id="pale-selector"
			prop:theme=${this.config.theme}
			prop:demoTheme="pale"
			prop:autoTheme=${this.config.theme.autoLight.pass}
		/>
	`;
}

export class ThemeSelector<Section extends ThemeName> extends Component<{
	demoTheme: Section;
	theme: ThemeConfig;
	autoTheme: ReactiveValue<Section>;
}> {
	static override styles = css`
		:host {
			margin: 1rem;
		}
	`;

	override template = html`
		<${Demo}
			tabindex="0"
			prop:disabled=${computed(() => {
				const appliedTheme = this.theme.auto.value
					? this.autoTheme.value
					: this.theme.static.value;
				return appliedTheme === this.demoTheme;
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

export class ThemeSkeleton extends Component {
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
				<${SkeletonRow} prop:width="75%">
					<${Skeleton} class="fg" prop:grow=${3} />
					<${Skeleton} class="fg" prop:grow=${1.5} />
					<${Skeleton} class="fg" prop:grow=${2.5} />
				</${SkeletonRow}>
				<${SkeletonRow} prop:width="100%">
					<${Skeleton} class="fg" prop:grow=${1} />
					<${Skeleton} class="fg" prop:grow=${4} />
					<${Skeleton} class="fg" prop:grow=${1.5} />
				</${SkeletonRow}>
				<${SkeletonRow} prop:width="80%">
					<${Skeleton} class="accent-1" prop:grow=${1} />
					<${Skeleton} class="bg-3" prop:grow=${0.8} />
					<${Skeleton} class="primary" prop:grow=${1} />
				</${SkeletonRow}>
				<${SkeletonRow} prop:width="100%">
					<${Skeleton} class="bg-4" />
				</${SkeletonRow}>
				<${SkeletonRow} prop:width="100%">
					<${Skeleton} class="fg" prop:grow=${2} />
					<${Skeleton} class="fg" prop:grow=${1.5} />
					<${Skeleton} class="fg" prop:grow=${2} />
				</${SkeletonRow}>
				<${SkeletonRow} prop:width="90%">
					<${Skeleton} class="bg-1" />
					<${Skeleton} class="accent-2" />
					<${Skeleton} class="danger" />
				</${SkeletonRow}>
			</div>
		</div>
	`;
}
export class SkeletonRow extends Component<{ width: string }> {
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
export class Skeleton extends Component<{ grow?: number }> {
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
const themeLabels: Record<ThemeName, string> = {
	dark: "Deep space",
	dim: "Asteroid",
	pale: "Moonlight",
	light: "Supernova",
};
