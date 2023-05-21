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
				prop:type=${"accent-one"}
				prop:disabled=${computed(() => this.theme.value === "dark").pass}
				on:click=${() => this.theme.value = "dark"}
			>
				Dark theme
			</${Button}>
			<${Button}
				prop:type=${"accent-one"}
				prop:disabled=${computed(() => this.theme.value === "dim").pass}
				on:click=${() => this.theme.value = "dim"}
			>
				Dim theme
			</${Button}>
			<${Button}
				prop:type=${"accent-two"}
				prop:disabled=${computed(() => this.theme.value === "auto").pass}
				on:click=${() => this.theme.value = "auto"}
			>
				Automatic theme
			</${Button}>
			<${Button}
				prop:type=${"primary"}
				prop:disabled=${computed(() => this.theme.value === "pale").pass}
				on:click=${() => this.theme.value = "pale"}
			>
				Pale theme
			</${Button}>
			<${Button}
				prop:type=${"primary"}
				prop:disabled=${computed(() => this.theme.value === "light").pass}
				on:click=${() => this.theme.value = "light"}
			>
				Light theme
			</${Button}>
		</div>
	`;
}
