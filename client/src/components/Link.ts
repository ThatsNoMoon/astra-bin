import { Component, classNames, computed, css, html } from "destiny-ui";
import { location } from "../routing/location";

type LinkProps = {
	to: string;
	color?: string;
	underline?: "none" | "hover" | "always";
	disabledHere?: boolean;
};

export class Link extends Component<LinkProps> {
	static override styles = css`
		:host {
			display: contents;
		}

		a.none,
		a.hover {
			text-decoration: none;
		}

		a.hover:hover {
			text-decoration: underline;
		}

		a,
		a:visited {
			color: var(--link-color);
			transition: var(--color-transition);
		}

		a:focus-visible {
			box-shadow: none;
			outline: var(--focus-outline);
			outline-offset: var(--focus-outline-offset);
		}

		a.no-target {
			pointer-events: none;
		}
	`;

	#disabled = computed(() => {
		return Boolean(this.disabledHere) && location.value === this.to;
	});

	connectedCallback() {
		this.style.setProperty(
			"--link-color",
			this.color ?? "var(--accent-1-3)"
		);
	}

	override template = html`
		<a
			part="inner"
			class=${classNames({
				[this.underline ?? "hover"]: true,
				"no-target": this.#disabled,
			})}
			href=${this.to}
		>
			<slot />
		</a>
	`;
}
