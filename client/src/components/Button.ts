import {
	CSSTemplate,
	Component,
	ReactiveValue,
	classNames,
	computed,
	css,
	html,
	reactive,
	sideEffect,
} from "destiny-ui";
import { deepFreeze } from "../util";

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

export const types = deepFreeze({
	neutral: {
		color: "var(--fg-1)",
	},
	primary: {
		color: "black",
		disabledColor: "var(--palette-primary-6)",
		bg: {
			base: "var(--palette-primary-4)",
			hover: "var(--palette-primary-2)",
			active: "var(--palette-primary-1)",
			disabled: "var(--palette-primary-1)",
		},
		weight: "450",
	},
	"primary-alt": {
		color: "var(--primary-1)",
	},
	"accent-1": {
		color: "white",
		disabledColor: "var(--palette-accent-1-3)",
		bg: {
			base: "var(--palette-accent-1-4)",
			hover: "var(--palette-accent-1-3)",
			active: "var(--palette-accent-1-1)",
			disabled: "var(--palette-accent-1-1)",
		},
		weight: "500",
	},
	"accent-1-alt": {
		color: "var(--accent-1-1)",
	},
	"accent-2": {
		color: "white",
		disabledColor: "var(--palette-accent-2-4)",
		bg: {
			base: "var(--palette-accent-2-4)",
			hover: "var(--palette-accent-2-2)",
			active: "var(--palette-accent-2-1)",
			disabled: "var(--palette-accent-2-1)",
		},
		weight: "500",
	},
	"accent-2-alt": {
		color: "var(--accent-2-2)",
	},
	danger: {
		color: "white",
		disabledColor: "var(--palette-danger-3)",
		bg: {
			base: "var(--palette-danger-4)",
			hover: "var(--palette-danger-2)",
			active: "var(--palette-danger-1)",
			disabled: "var(--palette-danger-1)",
		},
		weight: "500",
	},
	"danger-alt": {
		color: "var(--danger-2)",
	},
	transparent: {
		color: "var(--fg-1)",
		bg: {
			base: "transparent",
			hover: "var(--bg-2)",
			active: "var(--bg-1)",
			disabled: "var(--bg-1)",
		},
	},
});

export type ButtonTypeName = keyof typeof types;

type ButtonSize = {
	font: string;
	padding: string;
	weight?: string | undefined;
};

export const sizes = {
	s: {
		font: "var(--fs-1)",
		padding: "0.4rem",
		weight: undefined,
	},
	m: {
		font: "var(--fs-2)",
		padding: "0.6rem",
	},
	l: {
		font: "var(--fs-3)",
		padding: "0.7rem",
	},
};

export type ButtonSizeName = keyof typeof sizes;

export class Button extends Component<{
	tag?: string;
}> {
	static override styles: CSSTemplate[] & { [0]: CSSTemplate } = [
		css`
			:host {
				display: contents;
			}

			#inner {
				display: flex;
				flex-direction: row;
				gap: var(--button-padding);
				align-items: center;
				font-family: inherit;
				font-size: var(--button-size);
				border: none;
				padding: var(--button-padding) calc(var(--button-padding) * 2);
				border-radius: 0.5rem;
				color: var(--button-color);
				background-color: var(--button-base);
				font-weight: var(--button-weight);
				font-variation-settings: "wght" var(--button-weight);
				transition:
					var(--color-transition),
					box-shadow var(--transition-time);
			}

			#inner:not(.disabled, .selected) {
				cursor: pointer;
			}

			#inner.disabled {
				color: var(--button-disabled-color);
				background-color: var(--button-disabled);
			}

			#inner:hover:not(.disabled, .selected),
			#inner:focus-visible:not(.disabled, .selected) {
				background-color: var(--button-hover);
				box-shadow: var(--elevation-3);
			}

			#inner:focus-visible:not(.disabled, .selected) {
				outline: var(--focus-outline);
				outline-offset: var(--focus-outline-offset);
				z-index: 12;
			}

			#inner:active:not(.disabled, .selected) {
				background-color: var(--button-active);
				box-shadow: none;
			}
		`,
	];

	#disabled = reactive(this.disabled);
	set disabled(value: boolean) {
		this.#disabled.value = value;
	}

	get _disabled() {
		return this.#disabled.value;
	}

	#selected = reactive(this.selected);
	set selected(value: boolean) {
		this.#selected.value = value;
	}

	static defaultType: ButtonTypeName = "primary";

	#type: ReactiveValue<ButtonType> = new ReactiveValue(
		types[
			this.type ??
				(Object.getPrototypeOf(this).constructor
					.defaultType as ButtonTypeName)
		],
	);
	set type(type: ButtonTypeName | undefined) {
		if (type === undefined) {
			return;
		}
		this.#type.value = types[type];
	}

	static defaultSize: ButtonSizeName = "m";

	#size: ReactiveValue<ButtonSize> = new ReactiveValue(
		sizes[
			this.size ??
				(Object.getPrototypeOf(this).constructor
					.defaultSize as ButtonSizeName)
		],
	);
	set size(size: ButtonSizeName | undefined) {
		if (size === undefined) {
			return;
		}
		this.#size.value = sizes[size];
	}

	#tag = this.tag ?? "button";

	connectedCallback() {
		sideEffect(
			() => {
				const size: Readonly<ButtonSize> = this.#size.value;

				this.style.setProperty("--button-size", size.font);
				this.style.setProperty("--button-padding", size.padding);
			},
			{ dependents: [this] },
		);

		sideEffect(
			() => {
				const type: Readonly<ButtonType> = this.#type.value;

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
				this.style.setProperty(
					"--button-disabled-color",
					type.disabledColor ?? "var(--fg-2)",
				);
			},
			{ dependents: [this] },
		);

		sideEffect(
			() => {
				const size: Readonly<ButtonSize> = this.#size.value;
				const type: Readonly<ButtonType> = this.#type.value;

				if ("weight" in size) {
					if (size.weight !== undefined) {
						this.style.setProperty("--button-weight", size.weight);
					}
				} else if (type.weight !== undefined) {
					this.style.setProperty("--button-weight", type.weight);
				}
			},
			{ dependents: [this] },
		);
	}

	override template = html`
		<${this.#tag}
			id="inner"
			part="inner"
			class=${classNames({ disabled: this.#disabled, selected: this.#selected })}
			prop:disabled=${computed(() => this.#disabled.value || this.#selected.value)}
		>
			<slot />
		</${this.#tag}>
	`;
}
