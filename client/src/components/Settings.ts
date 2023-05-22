import { Component, ReactiveValue, computed, css, html } from "destiny-ui";
import type { ThemeName } from "../theme";
import { Button } from "./Button";

export class Settings extends Component<{ theme: ReactiveValue<ThemeName> }> {
	static override styles = css`
		.container {
			display: flex;
			gap: 1rem;
		}
	`;
	override template = html`
		<div class="container">
			<${Button}
				prop:type=${"accent-1-alt"}
				prop:disabled=${computed(() => this.theme.value === "dark")}
				on:click=${() => (this.theme.value = "dark")}
			>
				Dark theme
			</${Button}>
			<${Button}
				prop:type=${"accent-1-alt"}
				prop:disabled=${computed(() => this.theme.value === "dim")}
				on:click=${() => (this.theme.value = "dim")}
			>
				Dim theme
			</${Button}>
			<${Button}
				prop:type=${"accent-2-alt"}
				prop:disabled=${computed(() => this.theme.value === "auto")}
				on:click=${() => (this.theme.value = "auto")}
			>
				Automatic theme
			</${Button}>
			<${Button}
				prop:type=${"primary-alt"}
				prop:disabled=${computed(() => this.theme.value === "pale")}
				on:click=${() => (this.theme.value = "pale")}
			>
				Pale theme
			</${Button}>
			<${Button}
				prop:type=${"primary-alt"}
				prop:disabled=${computed(() => this.theme.value === "light")}
				on:click=${() => (this.theme.value = "light")}
			>
				Light theme
			</${Button}>
		</div>
	`;
}
