import { Component, html, reactive } from "destiny-ui";

export class ViewPaste extends Component<{ key: string }> {
	#paste = reactive("Loading...");

	connectedCallback() {
		fetch(`${import.meta.env.VITE_API_ROOT}/p/${this.key}`)
			.then((res) => res.text())
			.then((contents) => (this.#paste.value = contents));
	}
	override template = html`
		<pre><code>${this.#paste}</code></pre>
	`;
}
