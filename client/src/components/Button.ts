import { Component, ReactiveValue, css, html } from "destiny-ui";

type ButtonType = {
	color: string;
	bg: string;
	weight?: string;
}

export const types = Object.freeze({
	primary: Object.freeze({
		color: "black",
		bg: "var(--primary-4)",
		weight: "500",
	}),
	"primary-alt": Object.freeze({
		color: "var(--primary-0)",
		bg: "var(--bg-2)",
	}),
	"accent-one": Object.freeze({
		color: "white",
		bg: "var(--accent-1-4)",
		weight: "500",
	}),
	"accent-one-alt": Object.freeze({
		color: "var(--accent-1-0)",
		bg: "var(--bg-2)",
	}),
	"accent-two": Object.freeze({
		color: "white",
		bg: "var(--accent-2-4)",
		weight: "500",
	}),
	"accent-two-alt": Object.freeze({
		color: "var(--accent-2-1)",
		bg: "var(--bg-2)",
	}),
	danger: Object.freeze({
		color: "white",
		bg: "var(--danger-4)",
		weight: "500",
	}),
	"danger-alt": Object.freeze({
		color: "var(--danger-1)",
		bg: "var(--bg-2)",
	}),
});

export class Button extends Component<{
	type?: keyof typeof types,
	disabled?: boolean | ReactiveValue<boolean>
}> {
	static override styles = css`
		:host {
			display: contents;
		}

		button {
			font-family: inherit;
			border: none;
			padding: 1rem;
			border-radius: 0.5rem;
			color: var(--button-color);
			background-color: var(--button-bg);
			font-weight: var(--button-weight);
		}

		button:not(:disabled) {
			cursor: pointer;
		}
	`;

	constructor() {
		super();
		const type: Readonly<ButtonType> = types[this.type ?? "primary"];
		this.style.setProperty("--button-color", type.color);
		this.style.setProperty("--button-bg", type.bg);
		this.style.setProperty("--button-weight", type.weight ?? "400");
	}

	override template = html`
		<button prop:disabled=${this.disabled}><slot /></button>
	`;
}
