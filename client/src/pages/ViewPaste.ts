import { Component, ReactiveValue, css, html } from "destiny-ui";
import { Editor } from "../components/editor/Editor";
import type { Ace } from "ace-builds";
import { ensure } from "../util";
import type { Config } from "../config";
import { EditorControls } from "../components/EditorControls";
import { Button } from "../components/Button";
import { Copy } from "../icons";

const modeRegex = new RegExp(
	`${import.meta.env.VITE_CONTENT_TYPE_PREFIX}(\\w+)`,
);

export class ViewPaste extends Component<{ key: string; config: Config }> {
	static override styles = css`
		:host {
			position: relative;
			display: block;
			height: 100%;
		}

		#copy {
			width: max-content;
		}
	`;

	#editor = new ReactiveValue<Ace.Editor | undefined>(undefined);

	async connectedCallback() {
		const response = await fetch(
			`${import.meta.env.VITE_API_ROOT}/p/${this.key}`,
		);
		const contentType = response.headers.get("Content-Type");
		const mode = contentType?.match(modeRegex)?.[1] ?? "text";
		const paste = await response.text();

		const editor = await ensure(this.#editor);
		editor.setValue(paste);
		editor.selection.clearSelection();
		editor.setReadOnly(true);
		editor.session.setMode(`ace/mode/${mode}`);
	}
	override template = html`
		<${EditorControls}>
			<${Button}
				id="copy"
				on:click=${() => {
					const editor = this.#editor.value;
					if (editor == null) { return; }
					navigator.clipboard.writeText(editor.getValue());
				}}
			>
				<${Copy} />
				Copy all
			</${Button}>
		</${EditorControls}>
		<${Editor}
			prop:editor=${this.#editor.pass}
			prop:config=${this.config}
		/>
	`;
}
