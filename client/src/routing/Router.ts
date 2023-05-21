import { Component, TemplateResult, computed, html } from "destiny-ui";
import { location } from "./location";
import { Link } from "../components/Link";

export type RouteTarget = (args: ReadonlyArray<string>) => TemplateResult
export type Routes = Record<string, RouteTarget>;

export class Router extends Component<{ routes: Routes, notFound: RouteTarget }> {
	override template = computed(() => {
		const [component, args] = this.#destructurePath(location.value);
		return component(args);
	});

	#destructurePath(path: string): [RouteTarget, Array<string>] {
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
			return [this.notFound, []];
		}
	}
}

export class RouterLink extends Link {
	override template = html`
		<a href=${this.to} on:click=${(event: Event) => {
			location.value = this.to;
			event.preventDefault();
		}}>
			<slot />
		</a>
	`;
}
