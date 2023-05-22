import {
	Component,
	ReadonlyReactiveValue,
	css,
	html,
	reactive,
} from "destiny-ui";

type ButtonType = {
	color: string;
	disabledColor?: string;
	bg?: {
		base: string;
		hover: string;
		active: string;
		disabled: string;
	};
	weight?: string;
};

export const types = Object.freeze({
	neutral: Object.freeze({
		color: "var(--fg-1)",
	}),
	primary: Object.freeze({
		color: "black",
		disabledColor: "var(--palette-primary-6)",
		bg: {
			base: "var(--palette-primary-4)",
			hover: "var(--palette-primary-2)",
			active: "var(--palette-primary-1)",
			disabled: "var(--palette-primary-1)",
		},
		weight: "500",
	}),
	"primary-alt": Object.freeze({
		color: "var(--primary-1)",
	}),
	"accent-1": Object.freeze({
		color: "white",
		disabledColor: "var(--palette-accent-1-3)",
		bg: {
			base: "var(--palette-accent-1-4)",
			hover: "var(--palette-accent-1-2)",
			active: "var(--palette-accent-1-1)",
			disabled: "var(--palette-accent-1-1)",
		},
		weight: "500",
	}),
	"accent-1-alt": Object.freeze({
		color: "var(--accent-1-1)",
	}),
	"accent-2": Object.freeze({
		color: "white",
		disabledColor: "var(--palette-accent-2-4)",
		bg: {
			base: "var(--palette-accent-2-4)",
			hover: "var(--palette-accent-2-2)",
			active: "var(--palette-accent-2-1)",
			disabled: "var(--palette-accent-2-1)",
		},
		weight: "500",
	}),
	"accent-2-alt": Object.freeze({
		color: "var(--accent-2-2)",
	}),
	danger: Object.freeze({
		color: "white",
		disabledColor: "var(--palette-danger-3)",
		bg: {
			base: "var(--palette-danger-4)",
			hover: "var(--palette-danger-2)",
			active: "var(--palette-danger-1)",
			disabled: "var(--palette-danger-1)",
		},
		weight: "500",
	}),
	"danger-alt": Object.freeze({
		color: "var(--danger-2)",
	}),
});

export class Button extends Component<{
	type?: keyof typeof types;
}> {
	static override styles = css`
		:host {
			display: contents;
		}

		button {
			font-family: inherit;
			font-size: inherit;
			border: none;
			padding: 1rem;
			border-radius: 0.5rem;
			color: var(--button-color);
			background-color: var(--button-base);
			font-weight: var(--button-weight);
			transition: background-color 0.2s;
		}

		button:not(:disabled) {
			cursor: pointer;
		}

		button:disabled {
			color: var(--button-disabled-color);
			background-color: var(--button-disabled);
		}

		button:hover:not(:disabled) {
			background-color: var(--button-hover);
		}

		button:active:not(:disabled) {
			background-color: var(--button-active);
		}
	`;

	#disabled = reactive(this.disabled);
	set disabled(value: boolean) {
		if ((value as unknown) instanceof ReadonlyReactiveValue) {
			value = (value as unknown as ReadonlyReactiveValue<boolean>).value;
		}
		this.#disabled.value = value;
	}

	constructor() {
		super();
		const type: Readonly<ButtonType> = types[this.type ?? "primary"];
		this.style.setProperty("--button-color", type.color);
		const bg = type.bg ?? {
			base: "var(--bg-3)",
			hover: "var(--bg-2)",
			active: "var(--bg-1)",
			disabled: "var(--bg-1)",
		};
		this.style.setProperty("--button-base", bg.base);
		this.style.setProperty("--button-hover", bg.hover);
		this.style.setProperty("--button-active", bg.active);
		this.style.setProperty("--button-disabled", bg.disabled);
		this.style.setProperty("--button-weight", type.weight ?? "400");
		this.style.setProperty(
			"--button-disabled-color",
			type.disabledColor ?? "var(--fg-2)"
		);
	}

	override template = html`
		<button prop:disabled=${this.#disabled}><slot /></button>
	`;
}
