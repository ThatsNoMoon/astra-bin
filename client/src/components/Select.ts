import {
	CSSTemplate,
	ReactiveValue,
	classNames,
	computed,
	css,
	html,
	reactive,
	sideEffect,
} from "destiny-ui";
import { Button } from "./Button";
import { Expand, Search } from "../icons";
import { TextInput } from "./TextInput";
import { Resolvable } from "../util";

export class Select<T> extends Button {
	static override styles: CSSTemplate[] & [CSSTemplate, CSSTemplate] = [
		Button.styles[0],
		css`
			:host {
				display: block;
				position: relative;
			}

			.hidden {
				display: none;
			}

			button {
				width: 100%;
			}

			#button-text {
				flex-grow: 1;
				text-align: left;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			${Expand}::part(inner) {
				flex-shrink: 0;
			}

			dialog[open] {
				display: flex;
				flex-direction: column;
				position: absolute;
				top: 100%;
				overflow: hidden;
				z-index: 10;
				width: 100%;
				max-height: calc(min(100vh - 150px, 450px));
				background-color: var(--bg-4);
				padding: 0;
				margin-top: calc(var(--button-padding) * 2);
				border-radius: 0.5rem;
				border: none;
				outline: 5px solid var(--palette-accent-1-4);
				/* adjusted version of var(--elevation-4) to spread past outline */
				box-shadow: 0 15px 25px 5px hsla(0, 0%, 0%, 0.15),
					0 5px 10px 5px hsla(0, 0%, 0%, 0.05);
			}

			${TextInput} {
				font-size: var(--button-size);
				padding: var(--button-padding) calc(var(--button-padding) * 2);
				gap: var(--button-padding);
				color: var(--button-color);
			}

			menu {
				display: flex;
				flex-direction: column;
				min-height: 0;
				width: 100%;
				padding: 0;
				margin: 0;
				overflow-y: auto;
				scrollbar-width: none;
				background-color: var(--bg-3);
			}

			menu::-webkit-scrollbar {
				display: none;
			}

			menu:focus-visible {
				box-shadow: none;
				outline: var(--focus-outline);
			}

			li {
				display: block;
				width: 100%;
			}

			dialog ${Button}::part(inner) {
				border-radius: 0;
				width: 100%;
				box-shadow: none;
				--button-base: transparent;
			}

			dialog ${Button}::part(inner):focus-visible {
				outline-offset: 0;
			}

			menu ${Button}::part(inner) {
				--button-base: transparent;
				text-align: left;
			}

			${Button}.length-control::part(inner) {
				justify-content: center;
				font-style: italic;
			}
		`,
	];

	declare selected: ReactiveValue<T | undefined>;
	declare searchBar?: boolean;

	#options = new ReactiveValue<Record<string, T>>(this.options ?? {});
	set options(options: Record<string, T>) {
		this.#options.value = options;
	}

	#selectedKey = reactive<string | undefined>(this.selectedKey ?? undefined);
	set selectedKey(key: string) {
		this.#selectedKey.value = key;
	}

	#showLess = reactive<(() => void) | undefined>(this.showLess);
	set showLess(callback: (() => void) | undefined) {
		this.#showLess.value = callback;
	}

	#showMore = reactive<(() => void) | undefined>(this.showMore);
	set showMore(callback: (() => void) | undefined) {
		this.#showMore.value = callback;
	}

	#dropdownOpen = reactive(false);

	#dialog = new ReactiveValue<HTMLDialogElement | undefined>(undefined);

	#searchInput = new Resolvable<HTMLInputElement>();

	#searchTerm = reactive("");

	constructor() {
		super();
		this.type ??= "neutral";
		if (this.type !== "neutral") {
			throw new Error("Select cannot use types other than neutral");
		}
	}

	#windowClickListener = (event: MouseEvent) => {
		if (!this.#dropdownOpen.value) {
			return;
		}

		if (event.composedPath().includes(this)) {
			return;
		}

		this.#dropdownOpen.value = false;
	};

	override connectedCallback() {
		super.connectedCallback();
		sideEffect(() => {
			const key = this.#selectedKey.value;
			if (key === undefined) {
				return;
			}
			const value = this.#options.value[key];
			if (value === undefined) {
				return;
			}
			this.selected.value = value;
		});

		window.addEventListener("click", this.#windowClickListener);

		sideEffect(() => {
			if (this.#dialog.value === undefined) {
				return;
			}

			if (this.#dropdownOpen.value) {
				this.#dialog.value.show();
				if (this.searchBar) {
					this.#searchInput.then((e) => e.focus());
				}
			} else {
				this.#dialog.value.close();
				this.#searchTerm.value = "";
			}
		});
	}

	disconnectedCallback() {
		window.removeEventListener("click", this.#windowClickListener);
	}

	#menuItem = (key: string) =>
		html`<li>
			<${Button}
				prop:disabled=${computed(() => key === this.#selectedKey.value)}
				prop:type="neutral"
				prop:size=${this.size}
				on:click=${() => {
					this.#selectedKey.value = key;
					this.#dropdownOpen.value = false;
				}}
			>
				${key}
			</${Button}>
		</li>`;

	override template = html`
		<button
			part="button"
			id="inner"
			class=${classNames({ disabled: this._disabled })}
			prop:disabled=${this._disabled}
			on:click=${async () => {
				this.#dropdownOpen.value = !this.#dropdownOpen.value;
				if (this.#dropdownOpen.value) {
				}
			}}
		>
			<div id="button-text">
				<span class=${classNames({
					hidden: computed(
						() => this.#selectedKey.value === undefined
					),
				})}>${this.#selectedKey}</span>
				<span
					class=${classNames({
						hidden: computed(
							() => this.#selectedKey.value !== undefined
						),
					})}
				>
					<slot name="default-label" />
				</span>
			</div>
			<${Expand} />
		</button>

		<dialog part="dialog" destiny:ref=${this.#dialog}>
			${
				this.searchBar
					? html`<${TextInput}
						on:click=${(e: Event) => e.stopPropagation()}
						prop:passInner=${this.#searchInput}
						prop:content=${this.#searchTerm.pass}
					>
						<${Search} />
					</${TextInput}>`
					: undefined
			}
			
			<menu part="menu">
				${computed(() => {
					return Object.keys(this.#options.value)
						.filter((key) =>
							key
								.toLowerCase()
								.includes(this.#searchTerm.value.toLowerCase())
						)
						.map(this.#menuItem);
				})}
			</menu>
			<${Button}
				prop:type="neutral"
				prop:size=${this.size}
				class=${classNames({
					hidden: this.#showMore.truthy(false, true),
					"length-control": true,
				})}
				on:click=${() => this.#showMore.value?.()}
			>
				<slot name="show-more">Show more</slot>
			</${Button}>
			<${Button}
				prop:type="neutral"
				prop:size=${this.size}
				class=${classNames({
					hidden: this.#showLess.truthy(false, true),
					"length-control": true,
				})}
				on:click=${() => this.#showLess.value?.()}
			>
				<slot name="show-less">Show less</slot>
			</${Button}>
		</dialog>
	`;
}
