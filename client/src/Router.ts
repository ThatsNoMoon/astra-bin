import { Component, css, html, reactive, ReactiveValue } from "destiny-ui";
import type { ReactiveArray, TemplateResult } from "destiny-ui";
import { Link } from "./components/Link";

export type View = (args: ReadonlyArray<string>) => TemplateResult;
// type ViewLocation = {
// 	view: View;
// 	location: string;
// };
export type Route = {
	target: View;
	type: "page" | "modal";
};
export type Routes = Record<string, Route> & { "/": Route & { type: "page" } };

// type ViewState = {
// 	page: ViewLocation;
// 	renderedPage: TemplateResult;
// 	modals: Array<ViewLocation>;
// 	renderedModal: TemplateResult | undefined;
// };

class Modal extends Component<{ modalStack: ReactiveArray<Route> }> {
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
		this.onkeydown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				this.modalStack.pop();
				history.back();
			}
		};
	}

	override template = html`
		<div id="shade" />
		<div id="container">
			<slot />
		</div>
	`;
}

type CurrentViews = {
	page: TemplateResult;
	pageLocation: string;
	modal: TemplateResult | undefined;
};

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
		// const [currentView, args] = this.#destructurePath(location.value);
		// let page: ViewLocation;
		// let renderedPage: TemplateResult;
		// let renderedModal: TemplateResult | undefined;

		// if (currentView.type === "page") {
		// 	page = { view: currentView.target, location: location.value }
		// 	renderedPage = currentView.target(args);
		// } else {
		// 	page = { view: this.routes["/"].target, location: "/" }
		// 	renderedPage = page.view([]);
		// 	renderedModal = currentView.target(args);
		// }

		// historyState.value[this.#routerKey] = page.location;

		// this.#currentViews = new ReactiveValue({ page: renderedPage, pageLocation: page.location, modal: renderedModal });

		// const [page, modal] =
		// 	view.type === "page"
		// 		? [view.target, undefined]
		// 		: [this.routes["/"].target, view.target];
		// const modals =
		// 	modal === undefined
		// 		? []
		// 		: [{ view: modal, location: location.value }];
		// this.#viewState = reactive({
		// 	page: { view: page, location: location.value },
		// 	renderedPage: page(args),
		// 	modals,
		// 	renderedModal: modal === undefined ? undefined : modal(args),
		// });

		// sideEffect(() => {
		// 	const [route, args] = this.#destructurePath(location.value);
		// 	if (route.type === "page") {
		// 		this.#viewState.page.view.value = route.target;
		// 		this.#viewState.page.location.value = location.value;
		// 		this.#viewState.renderedPage.value = route.target(args);
		// 		this.#viewState.modals.value = [];
		// 		this.#viewState.renderedModal.value = undefined;
		// 		return;
		// 	}
		// 	this.#viewState.modals.push({
		// 		view: route.target,
		// 		location: location.value,
		// 	});
		// 	this.#viewState.renderedModal.value = route.target(args);
		// });
		location.bind(this.#update, { dependents: [this] });
		historyState.bind(this.#update, { dependents: [this] });
	}

	#routerKey = `${Router}-${routerNumber++}`;

	// #viewState: TReactiveValueType<ViewState>;

	// #currentViews: ReadonlyReactiveValue<CurrentViews> = computed(() => {
	// 	const [component, args] = this.#destructurePath(location.value);
	// 	if (component.type === "page") {
	// 		return {
	// 			page: component.target(args),
	// 		};
	// 	}

	// 	return {
	// 		page: page.target.value([]),
	// 		modal: modal.target.value(args),
	// 	};
	// });

	#currentViews: ReactiveValue<CurrentViews> = new ReactiveValue({
		page: this.routes["/"].target([]),
		pageLocation: "/",
		modal: undefined,
	});

	override template = html`
		${this.#currentViews.value.page}
		${!this.#currentViews.value.modal
			? undefined
			: html`
			<${Modal} prop:modalStack>
				${this.#currentViews.value.modal}
			</${Modal}>
		`}
	`;

	#update = () => {
		const [currentView, args] = this.#destructurePath(location.value);
		console.log(location.value, currentView);
		let pageLocation = historyState.value[this.#routerKey] as string;
		if (currentView.type === "page") {
			pageLocation = location.value;
			this.#currentViews.value = {
				page: currentView.target(args),
				pageLocation,
				modal: undefined,
			};
		} else {
			const currentViews = this.#currentViews.value;

			if (pageLocation !== currentViews.pageLocation) {
				currentViews.pageLocation = pageLocation;
				const [page, args] = this.#destructurePath(pageLocation);
				currentViews.page = page.target(args);
			}

			currentViews.modal = currentView.target(args);

			this.#currentViews.value = { ...currentViews };
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
