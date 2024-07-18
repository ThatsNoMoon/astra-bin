import { Component, ReactiveValue, html } from "destiny-ui";
import { Editor } from "../components/editor/Editor";
import type { Ace } from "ace-builds";
import { ensure } from "../util";
import type { Config } from "../config";

const modeRegex = new RegExp(
	`${import.meta.env.VITE_CONTENT_TYPE_PREFIX}(\\w+)`
);

export class ViewPaste extends Component<{ key: string; config: Config }> {
	#editor = new ReactiveValue<Ace.Editor | undefined>(undefined);

	async connectedCallback() {
		const response = await fetch(
			`${import.meta.env.VITE_API_ROOT}/p/${this.key}`
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
		<${Editor}
			prop:editor=${this.#editor.pass}
			prop:config=${this.config}
		/>
	`;
}
