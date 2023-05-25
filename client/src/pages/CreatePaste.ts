import { Component, Ref, css, html } from "destiny-ui";

const monacoModule = import("monaco-editor");

// monacoModule.then(() => {
// 	self.MonacoEnvironment = {
// 		getWorker: function (_workerId, label) {
// 			const getWorkerModule = (moduleUrl: string, label: string) => {
// 				return new Worker(
// 					self.MonacoEnvironment!.getWorkerUrl!(moduleUrl, label),
// 					{
// 						name: label,
// 						type: "module",
// 					}
// 				);
// 			};

// 			switch (label) {
// 				case "json":
// 					return getWorkerModule(
// 						"/monaco-editor/esm/vs/language/json/json.worker?worker",
// 						label
// 					);
// 				case "css":
// 				case "scss":
// 				case "less":
// 					return getWorkerModule(
// 						"/monaco-editor/esm/vs/language/css/css.worker?worker",
// 						label
// 					);
// 				case "html":
// 				case "handlebars":
// 				case "razor":
// 					return getWorkerModule(
// 						"/monaco-editor/esm/vs/language/html/html.worker?worker",
// 						label
// 					);
// 				case "typescript":
// 				case "javascript":
// 					return getWorkerModule(
// 						"/monaco-editor/esm/vs/language/typescript/ts.worker?worker",
// 						label
// 					);
// 				default:
// 					return getWorkerModule(
// 						"/monaco-editor/esm/vs/editor/editor.worker?worker",
// 						label
// 					);
// 			}
// 		},
// 	};
// });

export class CreatePaste extends Component {
	static override styles = css`
		#container {
			width: 100%;
			height: 500px;
		}
	`;
	#container = new Ref;
	async connectedCallback() {
		const container = await this.#container;
		const monaco = await monacoModule;
		const style = document.querySelector(
			"link[rel='stylesheet'][data-name='vs/editor/editor.main']"
		);
		this.shadowRoot!.appendChild(style!.cloneNode(true));
		monaco.editor.create(container, {
			value : "",
			language: "javascript",
		});
	}

	override template = html`<div id="container" destiny:ref=${this.#container} />`;
}
