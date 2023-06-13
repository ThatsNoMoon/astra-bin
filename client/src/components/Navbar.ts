import { Component, computed, css, html, reactive } from "destiny-ui";
import { Button } from "./Button";
import { RouterLink } from "../routing/Router";
import { Heading } from "./typography";
import { AddCircle, Info, Settings } from "../icons";
import { location } from "../routing/location";

export class Navbar extends Component {
	static override styles = css`
		:host {
			padding: 0.75rem 1rem;
			background-color: var(--bg-3);
			transition: var(--color-transition);
			display: flex;
			align-items: center;
			gap: 1rem;
		}

		${Heading}::part(inner) {
			margin: 0;
			color: var(--fg-2);
			flex-grow: 1;
		}
	`;

	#narrowButtons = reactive(false);

	connectedCallback() {
		const observer = new ResizeObserver(([me]) => {
			if (me === undefined) {
				return;
			}

			this.#narrowButtons.value =
				window.matchMedia("(width < 550px)").matches;
		});

		observer.observe(this);
	}

	override template = html`
		<${Heading} prop:level=${1}>
			<${RouterLink}
				prop:to="/"
				prop:color="inherit"
				prop:underline="none"
			>
				Astra Bin
			</${RouterLink}>
		</${Heading}>
		<${RouterLink}
			prop:to="/"
			prop:type="button"
			prop:color="inherit"
			prop:underline="none"
		>
			<${Button} prop:size="s" prop:tag="div">
				<${AddCircle} />
				${this.#narrowButtons.truthy("New", "New paste")}
			</${Button}>
		</${RouterLink}>
		<${RouterLink}
			prop:to="/settings"
			prop:color="inherit"
			prop:underline="none"
			prop:disabledHere=${true}
		>
			<${Button}
				prop:type="neutral"
				prop:size="s"
				prop:tag="div"
				prop:disabled=${computed(() => location.value === "/settings")}
			>
				<${Settings} />
				${this.#narrowButtons.falsy("Settings")}
			</${Button}>
		</${RouterLink}>
		<${RouterLink}
			prop:to="/about"
			prop:color="inherit"
			prop:underline="none"
			prop:disabledHere=${true}
		>
			<${Button}
				prop:type="neutral"
				prop:size="s"
				prop:tag="div"
				prop:disabled=${computed(() => location.value === "/about")}
			>
				<${Info} />
				${this.#narrowButtons.falsy("About")}
			</${Button}>
		</${RouterLink}>
	`;
}
