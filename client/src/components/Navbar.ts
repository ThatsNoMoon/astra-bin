import { Component, css, html } from "destiny-ui";
import { Button } from "./Button";
import { RouterLink } from "../routing/Router";

export class Navbar extends Component {
	static override styles = css`
		:host {
			padding: 1rem;
			background-color: var(--bg-3);
			transition: var(--color-transition);
			display: flex;
			align-items: center;
			gap: 1rem;
		}

		h1 {
			margin: 0;
			font-size: var(--fs-7);
			flex-grow: 1;
		}
	`;

	override template = html`
		<h1>
			<${RouterLink}
				prop:to=${"/"}
				prop:color=${"inherit"}
				prop:underline=${"none"}
			>
				Bin Star
			</${RouterLink}>
		</h1>
		<${RouterLink}
			prop:to=${"/"}
			prop:color=${"inherit"}
			prop:underline=${"none"}
		>
			<${Button}>
				New paste
			</${Button}>
		</${RouterLink}>
		<${RouterLink}
			prop:to=${"/settings"}
			prop:color=${"inherit"}
			prop:underline=${"none"}
		>
			<${Button} prop:type=${"neutral"}>
				Settings
			</${Button}>
		</${RouterLink}>
	`;
}
