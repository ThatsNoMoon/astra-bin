import { Component, css, html } from "destiny-ui";
import { Button } from "./Button";
import { RouterLink } from "../routing/Router";
import { Heading } from "./typography";

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
			font-size: var(--fs-5);
			color: var(--fg-2);
			font-weight: 300;
			font-variation-settings: "wght" 300;
			flex-grow: 1;
		}
	`;

	override template = html`
		<${Heading} prop:level=${1}>
			<${RouterLink}
				prop:to=${"/"}
				prop:color=${"inherit"}
				prop:underline=${"none"}
			>
				Astra Bin
			</${RouterLink}>
		</${Heading}>
		<${RouterLink}
			prop:to=${"/"}
			prop:type=${"button"}
			prop:color=${"inherit"}
			prop:underline=${"none"}
		>
			<${Button} prop:size=${"s"} prop:tag=${"span"}>
				New paste
			</${Button}>
		</${RouterLink}>
		<${RouterLink}
			prop:to=${"/settings"}
			prop:color=${"inherit"}
			prop:underline=${"none"}
		>
			<${Button} prop:type=${"neutral"} prop:size=${"s"} prop:tag=${"span"}>
				Settings
			</${Button}>
		</${RouterLink}>
		<${RouterLink}
			prop:to=${"/about"}
			prop:color=${"inherit"}
			prop:underline=${"none"}
		>
			<${Button} prop:type=${"neutral"} prop:size=${"s"} prop:tag=${"span"}>
				About
			</${Button}>
		</${RouterLink}>
	`;
}
