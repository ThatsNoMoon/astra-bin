import { Component, ReactiveValue, Ref, css, html } from "destiny-ui";
import type { Ace } from "ace-builds";
const aceModule = import("./ace");

export class Editor extends Component<{ editor: ReactiveValue<Ace.Editor> }> {
	static override styles = css`
		:host {
			display: contents;
		}

		#container {
			position: relative;
			min-width: 100%;
			min-height: 100%;
			width: 100%;
			height: 100%;
			font-size: var(--fs-3);
			font-family: "Fantasque Sans Mono", "Monaco", "Menlo", "Ubuntu Mono",
				"Consolas", "Source Code Pro", "source-code-pro", monospace;
		}
	`;

	#container = new Ref();
	async connectedCallback() {
		const container = await this.#container;
		const { ace } = await aceModule;
		const editor = ace.edit(container);
		editor.setTheme("ace/theme/cobalt");
		editor.session.setMode("ace/mode/javascript");
		editor.renderer.attachToShadowRoot();
		this.editor.value = editor;
	}

	override template = html`
		<div id="container" destiny:ref=${this.#container} />
	`;
}
