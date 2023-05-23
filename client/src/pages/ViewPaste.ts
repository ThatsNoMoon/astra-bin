import { Component, html } from "destiny-ui";

export class ViewPaste extends Component<{ paste: string }> {
	override template = html`Viewing paste ${this.paste}`;
}
