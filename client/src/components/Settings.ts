import {
	Component,
	ReactiveValue,
	computed,
	css,
	html,
} from "destiny-ui";
import { themeRules } from "../style";
import type { ThemeName } from "../style";
import { Heading } from "./typography";
import { Button } from "./Button";

const themeLabels: Record<ThemeName, string> = {
	dark: "Deep space",
	dim: "Asteroid",
	auto: "Sync with system",
	pale: "Moonlight",
	light: "Supernova",
};

export class Settings extends Component<{ theme: ReactiveValue<ThemeName> }> {
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

		.theme-section {
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
			<div class="theme-section">
				<${ThemeSelector}
					prop:theme=${this.theme.pass}
					prop:demoTheme=${"dark"}
				/>
				<${ThemeSelector}
					prop:theme=${this.theme.pass}
					prop:demoTheme=${"dim"}
				/>
			</div>
			<div class="theme-section">
				<${ThemeSelector}
					prop:theme=${this.theme.pass}
					prop:demoTheme=${"auto"}
				/>
			</div>
			<div class="theme-section">
				<${ThemeSelector}
					prop:theme=${this.theme.pass}
					prop:demoTheme=${"light"}
				/>
				<${ThemeSelector}
					prop:theme=${this.theme.pass}
					prop:demoTheme=${"pale"}
				/>
			</div>
		</section>
		<section>
			<${Heading} prop:level=${3}>Another section</${Heading}>
			<${Button} prop:type=${"accent-1-alt"}>Settings</${Button}>
			<${Button} prop:type=${"accent-2-alt"}>Lots of settings</${Button}>
		</section>
	`;
}

class ThemeSelector extends Component<{
	demoTheme: ThemeName;
	theme: ReactiveValue<ThemeName>;
}> {
	static override styles = [
		themeRules,
		css`
			label {
				display: inline-block;
				margin: 0 0 0.5em;
				font-size: var(--fs-4);
				font-weight: 325;
			}

			#demo {
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
				transition: outline 0.2s;
			}

			#demo:not(:disabled) {
				cursor: pointer;
			}

			#demo:disabled {
				outline: 5px solid var(--palette-accent-1-4);
			}

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
		<label for="demo">${themeLabels[this.demoTheme]}</label>
		<button
			id="demo"
			tabindex="0"
			prop:disabled=${computed(() => this.theme.value === this.demoTheme)}
			on:click=${() => (this.theme.value = this.demoTheme)}
		>
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
						<${Skeleton} class="accent-1" prop:grow=${1} />
						<${Skeleton} class="bg-3" prop:grow=${1} />
						<${Skeleton} class="primary" prop:grow=${1} />
					</${SkeletonRow}>
					<${SkeletonRow} prop:width=${"100%"}>
						<${Skeleton} class="bg-4" prop:grow=${1} />
					</${SkeletonRow}>
					<${SkeletonRow} prop:width=${"100%"}>
						<${Skeleton} class="fg" prop:grow=${2} />
						<${Skeleton} class="fg" prop:grow=${1.5} />
						<${Skeleton} class="fg" prop:grow=${2} />
					</${SkeletonRow}>
					<${SkeletonRow} prop:width=${"90%"}>
						<${Skeleton} class="bg-1" prop:grow=${1} />
						<${Skeleton} class="accent-2" prop:grow=${1} />
						<${Skeleton} class="danger" prop:grow=${1} />
					</${SkeletonRow}>
				</div>
			</div>
		</button>
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
