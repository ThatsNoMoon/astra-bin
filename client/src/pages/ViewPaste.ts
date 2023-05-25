import { Component, ReactiveValue, html } from "destiny-ui";
import { Editor } from "../components/editor/Editor";
import type { Ace } from "ace-builds";
import { ensure } from "../util";

export class ViewPaste extends Component<{ key: string }> {
	#editor = new ReactiveValue<Ace.Editor | undefined>(undefined);

	async connectedCallback() {
		const paste = await fetch(`${import.meta.env.VITE_API_ROOT}/p/${this.key}`)
			.then((res) => res.text());

		const editor = await ensure(this.#editor);
		editor.setValue(paste);
		editor.selection.clearSelection();
		editor.setReadOnly(true);
	}
	override template = html`
		<${Editor} prop:editor=${this.#editor.pass} />
	`;
}
