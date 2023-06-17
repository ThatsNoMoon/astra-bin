import { Component, ReactiveValue, css, html } from "destiny-ui";
import { Resolvable } from "../util";

export class TextInput extends Component<{
	content: ReactiveValue<string>;
	passInner?: Resolvable<HTMLInputElement>;
}> {
	static override styles = css`
		:host {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.5rem;
		}

		input {
			flex: 1;
			min-width: 0;
			font-family: inherit;
			font-size: inherit;
			background-color: inherit;
			color: inherit;
			border: none;
			padding: 0.5rem;
			margin: 5px;
			box-shadow: 0 2px var(--fg-3);
			transition: box-shadow var(--transition-time),
				border-radius var(--transition-time);
		}

		input:focus {
			outline: none;
			border-radius: 0.5rem;
			box-shadow: 0 0 0 5px var(--fg-1);
		}
	`;

	#inner = this.passInner ?? new Resolvable();

	#contentListener = async (content: string) => {
		const input = await this.#inner;
		input.value = content;
	};

	async connectedCallback() {
		this.content.bind(this.#contentListener);
	}

	override template = html`
		<slot />
		<input
			part="inner"
			destiny:mount=${this.#inner.resolve}
			on:input=${(event: Event) => {
				const value = (event.target as HTMLInputElement).value;
				this.content.set(value, { noUpdate: [this.#contentListener] });
			}}
		/>
	`;
}
