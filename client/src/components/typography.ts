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
			font-weight: 150;
			font-variation-settings: "wght" 150;
		}

		h3 {
			font-size: var(--fs-6);
			font-weight: 175;
			font-variation-settings: "wght" 175;
		}

		h4 {
			font-size: var(--fs-5);
			font-weight: 200;
			font-variation-settings: "wght" 200;
		}

		h5 {
			font-size: var(--fs-4);
			font-weight: 300;
			font-variation-settings: "wght" 300;
		}

		h6 {
			font-size: var(--fs-3);
			font-weight: 300;
			font-variation-settings: "wght" 300;
		}
	`;

	override template = html`
		<${`h${this.level}`} id="inner" part="inner">
			<slot />
		</${`h${this.level}`}>
	`;
}
