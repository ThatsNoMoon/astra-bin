import { Component, css, html, ReactiveValue, Ref } from "destiny-ui";
import type { ReadonlyReactiveValue, TemplateResult } from "destiny-ui";
import { Link } from "./components/Link";

export const location = new ReactiveValue(
	new URL(window.location.href).pathname,
);

type StoredState = { location: string; state: Record<string, unknown> };

const history = new (class RouterHistory {
	constructor() {
		this.state.bind(this.#updateHistory);

		window.addEventListener("popstate", this.#updateStateOnHistoryChange);
	}

	#state: ReactiveValue<Record<string, unknown>> = new ReactiveValue({});

	get state(): ReactiveValue<Record<string, unknown>> {
		return this.#state;
	}

	#updateHistory = (newState: Record<string, unknown>) => {
		const toStore: StoredState = {
			location: location.value,
			state: newState,
		};
		const currentState: StoredState | null = window.history.state;

		if (currentState === null) {
			this.#replaceState({ location: "/", state: {} });
			this.#pushState(toStore);
		} else if (toStore.location === currentState.location) {
			this.#replaceState(toStore);
		} else {
			this.#pushState(toStore);
		}
	};

	#updateStateOnHistoryChange = (event: PopStateEvent) => {
		const { state, location: newLocation }: StoredState = event.state;
		location.value = newLocation;
		this.state.set(state, { noUpdate: [this.#updateHistory] });
	};

	#replaceState(toStore: StoredState) {
		window.history.replaceState(toStore, "", toStore.location);
	}

	#pushState(toStore: StoredState) {
		window.history.pushState(toStore, "", toStore.location);
	}

	back() {
		window.history.back();
	}
})();

export type View = (args: ReadonlyArray<string>) => TemplateResult;
export type Route = {
	target: View;
	type: "page" | "modal";
};
export type Routes = Record<string, Route> & { "/": Route & { type: "page" } };

class ModalDialog extends Component<{
	contents: ReadonlyReactiveValue<TemplateResult | undefined>;
}> {
	static override styles = css`
		:host {
			display: contents;
		}

		dialog {
			position: absolute;
			top: -10rem;
			left: 0;
			width: 100vw;
			height: calc(100vh + 20rem);
			border: none;
			margin: 0;
			padding: 0;
			overflow-y: auto;
			overscroll-behavior: contain;
			background: none;
			z-index: 10;
			color: inherit;
		}

		#shade {
			box-sizing: border-box;
			width: 100%;
			min-height: 100%;
			padding: 14rem 4rem;
			overflow-x: hidden;
			backdrop-filter: blur(3px) brightness(40%) saturate(70%);
		}

		#container {
			border-radius: 3rem;
			padding: 4rem;
			z-index: 12;
			background-color: var(--bg-5);
			transition: var(--color-transition);
		}

		@media screen and (width < 1000px) {
			#shade {
				padding: 10rem 0;
				backdrop-filter: none;
				background-color: var(--bg-4);
			}

			#container {
				border-radius: 0;
			}
		}
	`;

	connectedCallback() {
		window.addEventListener("keydown", this.#keyDownListener);

		this.contents.bind(
			async (contents) => {
				if (contents !== undefined) {
					(await this.#dialog).show();
				} else {
					(await this.#dialog).close();
				}
			},
			{ dependents: [this] },
		);
	}

	disconnectedCallback() {
		window.removeEventListener("keydown", this.#keyDownListener);
	}

	#keyDownListener(event: KeyboardEvent) {
		if (event.key === "Escape") {
			history.back();
		}
	}

	#dialog = new Ref<HTMLDialogElement>();

	override template = html`
		<dialog destiny:ref=${this.#dialog}>
			<div
				id="shade"
				on:click=${function (this: HTMLDivElement, event: MouseEvent) {
					if (event.composedPath()[0] === this) history.back();
				}}
			>
				<div id="container">${this.contents}</div>
			</div>
		</dialog>
	`;
}

let routerNumber = 0;

export class Router extends Component<{
	routes: Routes;
	notFound: View;
}> {
	static override styles = css`
		:host {
			display: contents;
		}
	`;

	constructor() {
		super();
		location.bind(this.#update, { dependents: [this] });
		history.state.bind(this.#update, { dependents: [this] });
	}

	#routerKey = `${Router}-${routerNumber++}`;

	#currentViews = {
		page: new ReactiveValue(this.routes["/"].target([])),
		pageLocation: "/",
		modal: new ReactiveValue<TemplateResult | undefined>(undefined),
	};

	override template = html`
		${this.#currentViews.page}
		<${ModalDialog}
			prop:contents=${this.#currentViews.modal.readonly.pass}
		/>
	`;

	#update = () => {
		const [currentView, args] = this.#destructurePath(location.value);
		let pageLocation = history.state.value[this.#routerKey] as
			| string
			| undefined;
		if (currentView.type === "page") {
			this.#currentViews.modal.value = undefined;

			if (pageLocation !== location.value) {
				pageLocation = location.value;
				this.#currentViews.page.value = currentView.target(args);
			}
		} else {
			this.#currentViews.modal.value = currentView.target(args);

			if (pageLocation === undefined) {
				pageLocation = "/";
				this.#currentViews.pageLocation = "/";
				this.#currentViews.page.value = this.routes["/"].target([]);
			} else if (pageLocation !== this.#currentViews.pageLocation) {
				this.#currentViews.pageLocation = pageLocation;
				const [page, args] = this.#destructurePath(pageLocation);
				this.#currentViews.page.value = page.target(args);
			}
		}

		history.state.set(
			{
				[this.#routerKey]: pageLocation,
				...history.state.value,
			},
			{ noUpdate: [this.#update] },
		);
	};

	#destructurePath(path: string): [Route, Array<string>] {
		path = path.replaceAll(/(?<!^)\/(?=$|\/)/g, "");
		let found = this.routes[path];
		const args: Array<string> = [];
		while (found === undefined && path.length > 0) {
			path = path.replace(/\/([^\/]*)$/, (_, arg) => {
				args.unshift(arg);
				return "";
			});
			found = this.routes[path];
		}

		if (found) {
			return [found, args];
		} else {
			return [{ type: "page", target: this.notFound }, []];
		}
	}
}

export class RouterLink extends Link {
	override connectedCallback(): void {
		super.connectedCallback();
		this.addEventListener("click", (event) => {
			location.value = this.to;
			event.preventDefault();
		});
	}
}
