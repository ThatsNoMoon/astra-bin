import {
	Component,
	computed,
	css,
	html,
	reactive,
	ReactiveValue,
} from "destiny-ui";
import type { TemplateResult } from "destiny-ui";
import { Link } from "./components/Link";

export type View = (args: ReadonlyArray<string>) => TemplateResult;
export type Route = {
	target: View;
	type: "page" | "modal";
};
export type Routes = Record<string, Route> & { "/": Route & { type: "page" } };

class Modal extends Component {
	static override styles = css`
		:host {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			min-height: 100vh;
			overflow-x: hidden;
		}

		#shade {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			backdrop-filter: blur(3px) brightness(40%) saturate(70%);
			z-index: 10;
		}

		#container {
			position: relative;
			border-radius: 3rem;
			margin: 4rem;
			padding: 2rem;
			background-color: var(--bg-4);
			z-index: 12;
		}
	`;

	connectedCallback() {
		window.addEventListener("keydown", this.keyDownListener);
	}

	disconnectedCallback() {
		window.removeEventListener("keydown", this.keyDownListener);
	}

	keyDownListener(event: KeyboardEvent) {
		if (event.key === "Escape") {
			history.back();
		}
	}

	override template = html`
		<div id="shade" />
		<div id="container">
			<slot />
		</div>
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
		historyState.bind(this.#update, { dependents: [this] });
	}

	#routerKey = `${Router}-${routerNumber++}`;

	#currentViews = {
		page: new ReactiveValue(this.routes["/"].target([])),
		pageLocation: "/",
		modal: new ReactiveValue<TemplateResult | undefined>(undefined),
	};

	override template = html`
		${this.#currentViews.page}
		${computed(() => {
			if (this.#currentViews.modal.value === undefined) {
				return undefined;
			}

			return html`
				<${Modal}>
					${this.#currentViews.modal.value}
				</${Modal}>
			`;
		})}
	`;

	#update = () => {
		const [currentView, args] = this.#destructurePath(location.value);
		let pageLocation = historyState.value[this.#routerKey] as string;
		if (currentView.type === "page") {
			if (pageLocation !== location.value) {
				pageLocation = location.value;
				this.#currentViews.page.value = currentView.target(args);
			}
			this.#currentViews.modal.value = undefined;
		} else {
			if (pageLocation !== this.#currentViews.pageLocation) {
				this.#currentViews.pageLocation = pageLocation;
				const [page, args] = this.#destructurePath(pageLocation);
				this.#currentViews.page.value = page.target(args);
			}

			this.#currentViews.modal.value = currentView.target(args);
		}

		historyState.set(
			{
				[this.#routerKey]: pageLocation,
				...historyState.value,
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

export const location = reactive(new URL(window.location.href).pathname);

export const historyState: ReactiveValue<Record<string, unknown>> =
	new ReactiveValue({});

type StoredState = { location: string; state: Record<string, unknown> };

window.addEventListener("popstate", (event) => {
	const { state, location: newLocation }: StoredState = event.state;
	location.value = newLocation;
	historyState.set(state, { noUpdate: [updateHistory] });
});

historyState.bind(updateHistory);
function updateHistory(newState: Record<string, unknown>) {
	const state: StoredState = {
		location: location.value,
		state: newState,
	};
	history.pushState(state, "", state.location);
}
