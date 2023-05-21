import { Component, css, html } from "destiny-ui";

export class Link extends Component<{ to: string }> {
	static override styles = css`
		:host {
			display: contents;
		}

		a {
			text-decoration: none;
		}

		a:hover {
			text-decoration: underline;
		}

		a, a:visited {
			color: var(--accent-1-3);
		}
	`;

	override template = html`
		<a href=${this.to}>
			<slot />
		</a>
	`;
}
