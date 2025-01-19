import { Component, css, xml as html } from "destiny-ui";

export class Demo extends Component {
	static override captureProps = true;
	static override styles = css`
		:host {
			display: contents;
		}

		label {
			display: inline-block;
			width: 100%;
			margin: 0 0 0.5rem;
			font-size: var(--fs-2);
			font-weight: 325;
			font-variation-settings: "wght" 325;
			text-align: center;
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
