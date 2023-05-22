import { Component, css, html } from "destiny-ui";

type LinkProps = {
	to: string;
	color?: string;
	underline?: "none" | "hover" | "always";
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
	`;

	connectedCallback() {
		this.style.setProperty(
			"--link-color",
			this.color ?? "var(--accent-1-3)"
		);
	}

	override template = html`
		<a class=${this.underline ?? "hover"} href=${this.to}>
			<slot />
		</a>
	`;
}
