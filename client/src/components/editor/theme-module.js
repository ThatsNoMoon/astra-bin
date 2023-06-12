const cssText = `
	.astra-auto {
		color: var(--fg-1);
		background-color: var(--bg-4);
	}

	.astra-auto .ace_gutter {
		color: var(--fg-3);
		background-color: var(--bg-3);
	}

	.astra-auto .ace_gutter-active-line {
		background-color: var(--bg-2);
		color: var(--fg-1);
	}

	.astra-auto .ace_fold-widget {
		text-align: center;
	}

	.astra-auto .ace_fold-widget:hover {
		color: var(--fg-2);
	}

	.astra-auto .ace_fold-widget.ace_start,
	.astra-auto .ace_fold-widget.ace_end,
	.astra-auto .ace_fold-widget.ace_closed{
		background: none !important;
		border: none;
		box-shadow: none;
	}

	.astra-auto .ace_fold-widget.ace_start:after {
		content: '▾'
	}

	.astra-auto .ace_fold-widget.ace_end:after {
		content: '▴'
	}

	.astra-auto .ace_fold-widget.ace_closed:after {
		content: '‣'
	}

	.astra-auto .ace_cursor {
		border-left: 1px solid var(--accent-1-1);
	}

	.astra-auto .ace_overwrite-cursors .ace_cursor {
		border: 1px solid var(--primary-4);
		background: var(--primary-8);
	}

	.astra-auto.normal-mode .ace_cursor-layer {
		z-index: 0;
	}
	 
	.astra-auto .ace_marker-layer .ace_selection {
		background: rgba(221, 240, 255, 0.20);
	}

	.astra-auto .ace_marker-layer .ace_selected-word {
		border-radius: 4px;
		border: 8px solid var(--bg-2);
		box-shadow: 0 0 4px black;
	}

	.astra-auto .ace_marker-layer .ace_step {
		background: var(--primary-1);
	}

	.astra-auto .ace_marker-layer .ace_bracket {
		margin: -1px 0 0 -1px;
		border: 1px solid rgba(255, 255, 255, 0.25);
	}

	.astra-auto .ace_marker-layer .ace_active-line {
		background: rgba(255, 255, 255, 0.031);
	}

	.astra-auto .ace_invisible {
		color: var(--fg-5);
	}

	.astra-auto .ace_paren {
		color: var(--fg-3);
	}

	.astra-auto .ace_keyword {
		color: var(--primary-1);
	}

	.astra-auto .ace_operator {
		color: var(--accent-1-2);
	}

	.astra-auto .ace_identifier {
	}

	.astra-auto .ace-statement {
		color: var(--danger-2);
	}

	.astra-auto .ace_constant {
		color: var(--accent-2-3);
	}

	.astra-auto .ace_constant.ace_language {
		color: var(--accent-2-3);
	}

	.astra-auto .ace_constant.ace_library {
		
	}

	.astra-auto :is(.ace_constant.ace_numeric, .ace_string) {
		color: var(--accent-1-1);
	}

	.astra-auto .ace_invalid {
		text-decoration: underline;
	}

	.astra-auto .ace_invalid.ace_illegal {
		color: white;
		background-color: var(--palette-danger-3);
	}

	.astra-auto .ace_invalid,
	.astra-auto .ace_deprecated {
		text-decoration: underline;
		font-style: italic;
		color: var(--danger-1);
	}

	.astra-auto .ace_support {
		color: var(--accent-2-1);
	}

	.astra-auto .ace_support.ace_function {
		font-style: italic;
		color: var(--danger-1);
	}

	.astra-auto .ace_function.ace_buildin {
		color: var(--accent-2-1);
	}

	.astra-auto .ace_comment:not(.ace_doc) {
		font-style: italic;
	}

	.astra-auto :is(.ace_comment, .ace_doc) {
		color: var(--fg-3);
	}

	.astra-auto .ace_comment.ace_doc.ace_tag {
		color: var(--accent-1-2);
		font-style: normal;
	}

	.astra-auto .ace_definition,
	.astra-auto .ace_type {
		color: var(--primary-1);
		font-style: italic;
	}

	.astra-auto .ace_variable {
		color: var(--danger-1);
	}

	.astra-auto .ace_variable.ace_language {
		color: #9b859d;
	}

	.astra-auto .ace_xml-pe {
		color: #494949;
	}*/

	.astra-auto .ace_indent-guide {
		background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWNQUFD4z6Crq/sfAAuYAuYl+7lfAAAAAElFTkSuQmCC") right repeat-y;
	}

	.astra-auto .ace_indent-guide-active {
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQIW2PQ1dX9zzBz5sz/ABCcBFFentLlAAAAAElFTkSuQmCC) right repeat-y;
	}
`;

ace.define(
	"astra/theme/auto",
	["require", "exports", "module", "ace/lib/dom"],
	function (require, exports, module) {
		exports.isDark = true;
		exports.cssClass = "astra-auto";
		exports.cssText = cssText;
	}
);
