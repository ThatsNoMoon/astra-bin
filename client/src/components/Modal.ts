import { Component, css, html } from "destiny-ui";
import { Heading } from "./typography";
import { Button } from "./Button";
import { CloseLarge } from "../icons";

class ModalCloseButton extends Component {
	static override styles = css`
		:host {
			display: contents;
		}

		${Button}::part(inner) {
			border-radius: 50%;
			padding: var(--button-padding);
			align-self: end;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	`;

	override template = html`
        <${Button} part="inner" prop:type="transparent" on:click=${() => history.back()}>
            <${CloseLarge}/>
        </${Button}>
    `;
}

export class Modal extends Component {
	static override styles = css`
		#header-bar {
			display: grid;
			justify-content: space-between;
			align-items: stretch;
			justify-items: end;
			margin-bottom: 1rem;
			height: min-content;
			grid-template-columns: 1fr max-content 1fr;
			justify-content: space-between;
		}

		${Heading}::part(inner) {
			grid-column: 2;
			margin: 0;
		}
	`;

	override template = html`
        <div id="header-bar">
            <${Heading} prop:level=${2}><slot name="header" /></${Heading}>
            <${ModalCloseButton} />
        </div>
        <slot />
    `;
}
