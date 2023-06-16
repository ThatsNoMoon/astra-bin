import {
	Component,
	ReactiveValue,
	Ref,
	css,
	html,
	sideEffect,
} from "destiny-ui";
import type { Ace } from "ace-builds";
import type { Config } from "../../config";

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
			font-size: 16px;
			font-family: inherit;
		}

		#container.loading {
			display: none;
		}
	`;

	#container = new Ref();
	async connectedCallback() {
		sideEffect(() => {
			const mono = this.config.fonts.value.mono.value.family;
			this.style.setProperty("font-family", `${mono}, var(--monospace)`);
		});

		const container = await this.#container;
		const { default: ace } = await import("./ace");
		const editor: Ace.Editor = ace.edit(container);
		editor.setTheme("astra/theme/auto", () =>
			container.classList.remove("loading")
		);
		editor.session.setMode("ace/mode/typescript");
		editor.renderer.attachToShadowRoot();
		if (document.activeElement === null) {
			editor.focus();
		}
		this.editor.value = editor;
	}

	override template = html`
		<div id="container" class="loading" destiny:ref=${this.#container} />
	`;
}
