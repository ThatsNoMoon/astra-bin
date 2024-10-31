import { Component, css } from "destiny-ui";

export class EditorControls extends Component {
    static override styles = css`
		:host {
			position: absolute;
			top: 0;
			right: 0;
			z-index: 3;
			display: flex;
			flex-wrap: wrap;
			padding: 1rem;
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
			background-color: var(--bg-3);
			border-bottom-left-radius: 1rem;
			box-shadow: var(--elevation-1);
		}
    `;
}