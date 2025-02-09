import { Component, css, html } from "destiny-ui";
import { Heading } from "../components/typography";
import type { Config } from "../config";
import { Modal } from "../components/Modal";
import { FontSettings } from "../components/settings/FontSettings";
import { ThemeSettings } from "../components/settings/ThemeSettings";

export class Settings extends Component<{ config: Config }> {
	static override styles = css`
		${Modal} {
			display: flex;
			flex-direction: column;
			gap: 2rem;
		}

		section {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 1rem;
		}

		${Heading}::part(inner) {
			margin: 0;
			display: flex;
			align-items: center;
		}
	`;

	override template = html`
		<${Modal}>
			<span slot="header">Settings</span>
			<section id="theme">
				<${Heading} prop:level=${3}>Theme</${Heading}>
				<${ThemeSettings} prop:config=${this.config} />
			</section>
			<section>
				<${Heading} prop:level=${3}>Fonts</${Heading}>
				<${FontSettings} prop:config=${this.config} />
			</section>
		</${Modal}>
	`;
}
