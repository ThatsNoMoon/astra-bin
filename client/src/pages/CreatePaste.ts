import { Component, ReactiveValue, css, html } from "destiny-ui";
import { Editor } from "../components/editor/Editor";
import { Button } from "../components/Button";
import type { Ace } from "ace-builds";
import { ensure } from "../util";
import { location } from "../routing/location";
import type { Config } from "../config";

export class CreatePaste extends Component<{ config: Config }> {
	static override styles = css`
		:host {
			height: 100%;
			display: flex;
			flex-direction: column;
		}

		#controls {
			padding: 1rem;
		}

		#container {
			flex-grow: 1;
			width: 100%;
		}
	`;

	#editor = new ReactiveValue<Ace.Editor | undefined>(undefined);

	submit = async () => {
		const editor = await ensure(this.#editor);

		const contents = editor.getValue();
		const key = await fetch(`${import.meta.env.VITE_API_ROOT}/p`, {
			method: "POST",
			body: contents,
		}).then((res) => res.text());

		location.value = `/p/${key}`;
	};

	override template = html`
		<div id="controls">
			<${Button} on:click=${this.submit} prop:size=${"m"}>Save</${Button}>
		</div>
		<div id="container">
			<${Editor} prop:editor=${this.#editor.pass} prop:config=${this.config}/>
		</div>
	`;
}
