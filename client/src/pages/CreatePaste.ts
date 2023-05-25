import { Component, css, html } from "destiny-ui";
import { Editor } from "../components/editor/Editor";

export class CreatePaste extends Component {
	static override styles = css`
		:host {
			height: 100%;
			display: flex;
			flex-direction: column;
		}

		#container {
			flex-grow: 1;
			width: 100%;
		}
	`;
	override template = html`
		<div id="container">
			<${Editor} />
		</div>
	`;
}

