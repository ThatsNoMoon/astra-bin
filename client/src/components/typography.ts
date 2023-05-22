import { Component, css, html } from "destiny-ui";

export class Heading extends Component<{ level: number }> {
	static override styles = css`
		:host {
			display: contents;
		}

		#inner:not(h1) {
			margin: 1.5em 0 0.5em;
		}

		h1 {
			font-size: var(--fs-5);
			font-weight: 300;
			margin: 0;
			flex-grow: 1;
		}

		h2 {
			font-size: var(--fs-9);
			font-weight: 150;
		}

		h3 {
			font-size: var(--fs-8);
			font-weight: 175;
		}

		h4 {
			font-size: var(--fs-7);
			font-weight: 200;
		}

		h5 {
			font-size: var(--fs-6);
			font-weight: 300;
		}

		h6 {
			font-size: var(--fs-5);
			font-weight: 300;
		}
	`;
	
	override template = html`
		<${`h${this.level}`} id="inner" part="inner">
			<slot />
		</${`h${this.level}`}>
	`;
}
