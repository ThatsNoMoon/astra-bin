import { Component, ReactiveValue, Ref, computed, css, html } from "destiny-ui";
import type { Ace } from "ace-builds";
import type { Config } from "../../config";
const aceModule = import("./ace");

export class Editor extends Component<{
	editor: ReactiveValue<Ace.Editor>;
	config: Config;
}> {
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
			font-family: inherit;
		}
	`;

	#container = new Ref();
	async connectedCallback() {
		computed(
			() => {
				const mono = this.config.fonts.value.mono.value.family;
				this.style.setProperty(
					"font-family",
					`${mono}, var(--monospace)`
				);
			},
			{ dependents: [this] }
		);

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
