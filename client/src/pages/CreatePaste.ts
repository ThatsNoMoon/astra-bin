import {
	Component,
	ReactiveValue,
	css,
	html,
	reactive,
	sideEffect,
} from "destiny-ui";
import { Editor } from "../components/editor/Editor";
import { Button } from "../components/Button";
import type { Ace } from "ace-builds";
import { ensure } from "../util";
import { location } from "../Router";
import type { Config } from "../config";
import { Save } from "../icons";
import {
	aceModes,
	moreAceModes,
	type Mode,
} from "../components/editor/mode-list";
import { Select } from "../components/Select";
import { EditorControls } from "../components/EditorControls";

export class CreatePaste extends Component<{ config: Config }> {
	static override styles = css`
		:host {
			position: relative;
			display: block;
			height: 100%;
		}

		#language-select {
			width: 220px;
		}
	`;

	#editor = new ReactiveValue<Ace.Editor | undefined>(undefined);
	#mode = new ReactiveValue<Mode>(aceModes["Plain Text"]!);
	#modes = this.config.showMoreModes.truthy(moreAceModes, aceModes);
	#saveDisabled = reactive(false);

	#submit = async () => {
		this.#saveDisabled.value = true;
		try {
			const editor = await ensure(this.#editor);

			const contents = editor.getValue();
			const key = await fetch(`${import.meta.env.VITE_API_ROOT}/p`, {
				method: "POST",
				body: contents,
				headers: {
					"Content-Type":
						import.meta.env.VITE_CONTENT_TYPE_PREFIX +
						this.#mode.value.name,
				},
			}).then((res) => res.text());

			location.value = `/p/${key}`;
		} finally {
			this.#saveDisabled.value = false;
		}
	};

	#onKeyDown = (event: KeyboardEvent) => {
		if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
			event.preventDefault();
			event.stopPropagation();
			this.#submit();
		}
	};

	connectedCallback() {
		document.addEventListener("keydown", this.#onKeyDown);

		sideEffect(() => {
			const mode = this.#mode.value.name;
			(async () => {
				const editor = await ensure(this.#editor);
				editor.session.setMode(`ace/mode/${mode}`);
			})();
		});
	}

	disconnectedCallback() {
		document.removeEventListener("keydown", this.#onKeyDown);
	}

	override template = html`
		<${EditorControls}>
			<${Button}
				on:click=${this.#submit}
				prop:disabled=${this.#saveDisabled}
			>
				<${Save} />
				Save
			</${Button}>
			<${Select}
				id="language-select"
				prop:options=${this.#modes}
				prop:selected=${this.#mode.pass}
				prop:selectedKey="Plain Text"
				prop:searchBar=${true}
				prop:showMore=${this.config.showMoreModes.falsy(
					() => (this.config.showMoreModes.value = true),
				)}
				prop:showLess=${this.config.showMoreModes.truthy(
					() => (this.config.showMoreModes.value = false),
				)}
			>
				<span slot="show-more">Show niche options</span>
				<span slot="show-less">Hide niche options</span>
			</${Select}>
		</${EditorControls}>
		<${Editor}
			prop:editor=${this.#editor.pass}
			prop:config=${this.config}
		/>
	`;
}
