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

class Modal extends Component<{
	contents: ReadonlyReactiveValue<TemplateResult | undefined>;
}> {
	static override styles = css`
		:host {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			min-height: 100vh;
			overflow-y: auto;
		}

		dialog {
			padding: 4rem;
			box-sizing: border-box;
			overflow-x: hidden;
			background: none;
			backdrop-filter: blur(3px) brightness(40%) saturate(70%);
			z-index: 10;
		}

		#container {
			border-radius: 3rem;
			padding: 2rem;
			background-color: var(--bg-4);
			z-index: 12;
		}
	`;

	connectedCallback() {
		window.addEventListener("keydown", this.#keyDownListener);
		window.addEventListener("click", this.#clickListener);

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
		window.removeEventListener("click", this.#clickListener);
	}

	#keyDownListener(event: KeyboardEvent) {
		if (event.key === "Escape") {
			history.back();
		}
	}

	#clickListener = (event: MouseEvent) => {
		const path = event.composedPath();
		if (path[0] === this.#dialog.value) {
			history.back();
		}
	};

	#dialog = new Ref<HTMLDialogElement>();

	override template = html`
		<dialog destiny:ref=${this.#dialog}>
			<div id="container">${this.contents}</div>
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
		<${Modal} prop:contents=${this.#currentViews.modal.readonly.pass} />
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
