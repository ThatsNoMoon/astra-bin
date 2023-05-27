import { css } from "destiny-ui";

export type ThemeName = "auto" | "dark" | "dim" | "pale" | "light";

const palette = {
	bg: {
		dark: [
			"hsl(235, 23%, 33%)",
			"hsl(238, 28%, 25%)",
			"hsl(236, 41%, 14%)",
			"hsl(235, 56%, 8%)",
			"hsl(240, 79%, 4%)",
		],
		dim: [
			"hsl(229, 12%, 35%)",
			"hsl(230, 12%, 29%)",
			"hsl(231, 12%, 23%)",
			"hsl(234, 11%, 18%)",
			"hsl(234, 14%, 15%)",
		],
		light: [
			"hsl(240, 13%, 76%)",
			"hsl(236, 17%, 82%)",
			"hsl(238, 63%, 92%)",
			"hsl(236, 100%, 97%)",
			"hsl(240, 100%, 99%)",
		],
		pale: [
			"hsl(240, 11%, 65%)",
			"hsl(240, 13%, 71%)",
			"hsl(240, 14%, 77%)",
			"hsl(240, 13%, 83%)",
			"hsl(240, 12%, 89%)",
		],
	},
	fg: [
		"hsl(235, 85%, 92%)",
		"hsl(236, 24%, 78%)",
		"hsl(236, 18%, 67%)",
		"hsl(240, 10%, 55%)",
		"hsl(240, 10%, 44%)",
		"hsl(240, 11%, 33%)",
		"hsl(240, 12%, 23%)",
		"hsl(240, 12%, 13%)",
		"hsl(235, 100%, 3%)",
	],
	primary: [
		"hsl(41, 68%, 76%)",
		"hsl(39, 78%, 71%)",
		"hsl(39, 100%, 66%)",
		"hsl(39, 100%, 58%)",
		"hsl(38, 99%, 53%)",
		"hsl(38, 89%, 47%)",
		"hsl(38, 84%, 43%)",
		"hsl(37, 95%, 32%)",
		"hsl(35, 93%, 24%)",
	],
	accentOne: [
		"hsl(226, 100%, 82%)",
		"hsl(225, 84%, 75%)",
		"hsl(224, 82%, 63%)",
		"hsl(224, 100%, 58%)",
		"hsl(225, 91%, 43%)",
		"hsl(225, 90%, 37%)",
		"hsl(225, 92%, 28%)",
		"hsl(223, 94%, 19%)",
		"hsl(223, 100%, 12%)",
	],
	accentTwo: [
		"hsl(318, 100%, 83%)",
		"hsl(318, 100%, 79%)",
		"hsl(319, 100%, 73%)",
		"hsl(318, 100%, 67%)",
		"hsl(318, 99%, 62%)",
		"hsl(318, 82%, 56%)",
		"hsl(318, 71%, 51%)",
		"hsl(319, 74%, 45%)",
		"hsl(319, 79%, 35%)",
	],
	danger: [
		"hsl(0, 98%, 80%)",
		"hsl(0, 99%, 74%)",
		"hsl(0, 99%, 69%)",
		"hsl(0, 99%, 64%)",
		"hsl(0, 99%, 60%)",
		"hsl(0, 72%, 52%)",
		"hsl(0, 72%, 43%)",
		"hsl(0, 74%, 37%)",
		"hsl(0, 76%, 31%)",
	],
};

function generateCssVars(
	prefix: string,
	values: ReadonlyArray<string>
): string {
	return values.map((v, i) => `--${prefix}-${i + 1}: ${v};`).join("\n");
}

const paletteRules = [
	generateCssVars("palette-fg", palette.fg),
	generateCssVars("palette-primary", palette.primary),
	generateCssVars("palette-accent-1", palette.accentOne),
	generateCssVars("palette-accent-2", palette.accentTwo),
	generateCssVars("palette-danger", palette.danger),
].join("\n");

const darkerRules = [
	generateCssVars("fg", palette.fg),
	generateCssVars("primary", palette.primary),
	generateCssVars("accent-1", palette.accentOne),
	generateCssVars("accent-2", palette.accentTwo),
	generateCssVars("danger", palette.danger),
].join("\n");

const darkRules = [generateCssVars("bg", palette.bg.dark), darkerRules].join(
	"\n"
);

const dimRules = [generateCssVars("bg", palette.bg.dim), darkerRules].join(
	"\n"
);

const lighterRules = [
	generateCssVars("fg", palette.fg.reverse()),
	generateCssVars("primary", palette.primary.reverse()),
	generateCssVars("accent-1", palette.accentOne.reverse()),
	generateCssVars("accent-2", palette.accentTwo.reverse()),
	generateCssVars("danger", palette.danger.reverse()),
].join("\n");

const lightRules = [generateCssVars("bg", palette.bg.light), lighterRules].join(
	"\n"
);

const paleRules = [generateCssVars("bg", palette.bg.pale), lighterRules].join(
	"\n"
);

export const themeRules = css`
	:host {
		${paletteRules}
	}

	:host(.auto) {
		${darkRules}
	}

	:host(.auto.auto-dim) {
		${dimRules}
	}

	@media (prefers-color-scheme: light) {
		:host(.auto),
		:host(.auto.auto-dim) {
			${lightRules}
		}

		:host(.auto.auto-pale) {
			${paleRules}
		}
	}

	:host(.dark) {
		${darkRules}
	}

	:host(.dim) {
		${dimRules}
	}

	:host(.light) {
		${lightRules}
	}

	:host(.pale) {
		${paleRules}
	}
`;

export const rootRules = css`
	* {
		box-sizing: border-box;
	}

	body,
	html {
		margin: 0;
		padding: 0;
		height: 100%;
		width: 100%;
		min-height: 100%;
		min-width: 100%;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
	}
`;
