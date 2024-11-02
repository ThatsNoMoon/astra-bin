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

class MenuItem extends Button {
	declare key: string;
	declare index: number;
	declare selectedKey: ReactiveValue<string | undefined>;
	declare focusedIndex: ReactiveValue<number>;
	declare dropdownOpen: ReactiveValue<boolean>;

	constructor() {
		super();

		this.type = "neutral";

		this.onclick = () => {
			this.selectedKey.value = this.key;
			this.dropdownOpen.value = false;
		};

		sideEffect(() => {
			void this.focusedIndex.value;
			const button = this.shadowRoot?.getElementById("inner");
			if (button == null || !(button instanceof HTMLElement)) return;
			if (this.index === this.focusedIndex.value) {
				button.tabIndex = 0;
				button.focus();
			} else {
				button.tabIndex = -1;
			}
		});
	}
}

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

			dialog {
				flex-direction: column;
				position: absolute;
				top: 100%;
				overflow: hidden;
				z-index: 10;
				width: 100%;
				max-height: calc(min(100vh - 150px, 450px));
				background-color: var(--bg-4);
				padding: 0;
				margin: calc(var(--button-padding) * 2) 0
					calc(var(--button-padding) * 2);
				border-radius: 0.5rem;
				border: none;
				transition:
					outline var(--transition-time),
					box-shadow var(--transition-time);
			}

			dialog[open] {
				display: flex;
			}

			dialog.outlined {
				outline: var(--focus-outline-width) solid
					var(--palette-accent-1-4);
				/* adjusted version of var(--elevation-4) to spread past outline */
				box-shadow:
					0 15px 25px var(--focus-outline-width) hsla(0, 0%, 0%, 0.15),
					0 5px 10px var(--focus-outline-width) hsla(0, 0%, 0%, 0.05);
			}

			dialog.flipped {
				top: unset;
				bottom: 100%;
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
				padding: calc(
						var(--focus-outline-width) + var(--focus-outline-offset)
					)
					0;
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

			dialog ${Button}::part(inner),
			${MenuItem}::part(inner) {
				border-radius: 0;
				width: 100%;
				box-shadow: none;
				--button-base: transparent;
			}

			dialog ${Button}::part(inner):focus-visible,
			${MenuItem}::part(inner):focus-visible {
				outline-offset: 0;
			}

			${MenuItem}::part(inner) {
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

	#focusedIndex = reactive<number>(0);

	#dialog = new ReactiveValue<HTMLDialogElement | undefined>(undefined);

	#searchInput = new Resolvable<HTMLInputElement>();

	#searchTerm = reactive("");

	#filteredOptions = computed(() =>
		Object.keys(this.#options.value).filter((key) =>
			key.toLowerCase().includes(this.#searchTerm.value.toLowerCase()),
		),
	);

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

	override onblur = () => {
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

		this.onkeydown = (event: KeyboardEvent) => {
			if (event.key === "ArrowDown") {
				this.#focusedIndex.value = Math.min(
					this.#filteredOptions.value.length - 1,
					this.#focusedIndex.value + 1,
				);
				event.stopPropagation();
				event.preventDefault();
			} else if (event.key === "ArrowUp") {
				this.#focusedIndex.value = Math.max(
					0,
					this.#focusedIndex.value - 1,
				);
				event.stopPropagation();
				event.preventDefault();
			} else if (event.key === "Escape") {
				this.#dialog.value?.close();
			}
		};

		sideEffect(() => {
			const dialog = this.#dialog.value;
			if (dialog === undefined) {
				return;
			}

			if (this.#dropdownOpen.value) {
				dialog.show();
				if (this.searchBar) {
					this.#searchInput.then((e) => e.focus());
				}

				queueMicrotask(() => {
					dialog.classList.add("outlined");
				});
			} else {
				dialog.close();
				this.#searchTerm.value = "";
			}
		});

		sideEffect(
			() => {
				void this.#searchTerm.value;
				this.#focusedIndex.value = 0;
				queueMicrotask(() => {
					if (this.searchBar) {
						this.#searchInput.then((e) => e.focus());
					}
				});
			},
			{ dependents: [this] },
		);
	}

	disconnectedCallback() {
		window.removeEventListener("click", this.#windowClickListener);
	}

	override template = html`
		<button
			part="button"
			id="inner"
			class=${classNames({ disabled: computed(() => this._disabled) })}
			prop:disabled=${computed(() => this._disabled)}
			on:click=${async () => {
				this.#dropdownOpen.value = !this.#dropdownOpen.value;
				if (this.#dropdownOpen.value) {
				}
			}}
		>
			<div id="button-text">
				<span class=${classNames({
					hidden: computed(
						() => this.#selectedKey.value === undefined,
					),
				})}>${this.#selectedKey}</span>
				<span
					class=${classNames({
						hidden: computed(
							() => this.#selectedKey.value !== undefined,
						),
					})}
				>
					<slot name="default-label" />
				</span>
			</div>
			<${Expand} />
		</button>

		<dialog
			part="dialog"
			destiny:ref=${this.#dialog}
			class=${classNames({
				flipped: computed(() => {
					const dialog = this.#dialog.value;
					if (!this.#dropdownOpen.value || !dialog) {
						return false;
					}

					const dialogRect = dialog.getBoundingClientRect();

					const spaceBelow = window.innerHeight - dialogRect.bottom;
					const spaceAbove = dialogRect.top;
					const height = dialog.offsetHeight;

					if (spaceBelow < height && spaceAbove > height) {
						return true;
					} else {
						return false;
					}
				}),
			})}
		>
			${
				this.searchBar
					? html`<${TextInput}
						on:click=${(e: Event) => e.stopPropagation()}
						prop:passInner=${this.#searchInput}
						prop:content=${this.#searchTerm.pass}
						on:keydown=${(event: KeyboardEvent) => {
							if (event.key === "ArrowDown") {
								// run side effects on focusedIndex to make the focused menu item steal focus
								this.#focusedIndex.update();
								event.stopPropagation();
								event.preventDefault();
							} else if (event.key === "Enter") {
								const topResult =
									this.#filteredOptions.value[0];
								if (topResult == null) {
									return;
								}
								this.#selectedKey.value = topResult;
								this.#dropdownOpen.value = false;
								event.stopPropagation();
								event.preventDefault();
							}
						}}
					>
						<${Search} />
					</${TextInput}>`
					: undefined
			}
			
			<menu
				part="menu"
				prop:tabIndex="-1"
			>
				${computed(() => {
					return this.#filteredOptions.value.map(
						(key, index) =>
							html`<${MenuItem}
									prop:size=${this.size}
									prop:key=${key}
									prop:index=${index}
									prop:selectedKey=${this.#selectedKey.pass}
									prop:focusedIndex=${this.#focusedIndex.pass}
									prop:dropdownOpen=${this.#dropdownOpen.pass}
								>
									${key}
								</${MenuItem}>
								`,
					);
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
