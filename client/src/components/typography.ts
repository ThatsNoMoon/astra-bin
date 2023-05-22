import { Component, css, html } from "destiny-ui";

export class Heading extends Component<{ level: number }> {
	static override styles = css`
		:host {
			display: contents;
		}

		#inner {
			font-weight: 300;
			margin: 1.5em 0 0.5em;
		}

		h1#inner {
			font-size: var(--fs-5);
			margin: 0;
			flex-grow: 1;
		}

		h2#inner {
			font-size: var(--fs-9);
			font-weight: 150;
		}

		h3#inner {
			font-size: var(--fs-8);
			font-weight: 200;
		}

		h4#inner {
			font-size: var(--fs-7);
			font-weight: 200;
		}

		h5 {
			font-size: var(--fs-6);
		}

		h6 {
			font-size: var(--fs-5);
		}
	`;
	override template = html`<${`h${this.level}`} id="inner"><slot /></${`h${this.level}`}>`;
}
