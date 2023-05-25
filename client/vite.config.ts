import { defineConfig } from "vite";
import monacoEditorPlugin, {
	type IMonacoEditorOpts,
} from "vite-plugin-monaco-editor";

const monacoEditorPluginDefault = (monacoEditorPlugin as any).default as (
	options: IMonacoEditorOpts
) => any;

export default defineConfig({
	esbuild: {
		keepNames: true,
	},
	plugins: [monacoEditorPluginDefault({
		languageWorkers: ["typescript", "editorWorkerService"],
	})],
});
