import { Component, css, html } from "destiny-ui";

export class Heading extends Component<{ level: number }> {
	static override styles = css`
		:host {
			display: contents;
		}

		#inner:not(h1) {
			margin: 3rem 0 1rem;
		}

		h1 {
			font-size: var(--fs-4);
			font-weight: 300;
			font-variation-settings: "wght" 300;
		}

		h2 {
			font-size: var(--fs-7);
			font-weight: var(--fw-7);
			font-variation-settings: "wght" var(--fw-7);
		}

		h3 {
			font-size: var(--fs-6);
			font-weight: var(--fw-6);
			font-variation-settings: "wght" var(--fw-6);
		}

		h4 {
			font-size: var(--fs-5);
			font-weight: var(--fw-5);
			font-variation-settings: "wght" var(--fw-5);
		}

		h5 {
			font-size: var(--fs-4);
			font-weight: var(--fw-4);
			font-variation-settings: "wght" var(--fw-4);
		}

		h6 {
			font-size: var(--fs-3);
			font-weight: var(--fw-3);
			font-variation-settings: "wght" var(--fw-3);
		}
	`;

	override template = html`
		<${`h${this.level}`} id="inner" part="inner">
			<slot />
		</${`h${this.level}`}>
	`;
}
