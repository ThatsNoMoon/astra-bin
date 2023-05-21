import { reactive } from "destiny-ui";

export const location = reactive(new URL(window.location.href).pathname);
location.bind(updateHistory);
window.addEventListener("popstate", event => {
	location.set(event.state, { noUpdate: [updateHistory] });
});

function updateHistory(newValue: string) {
	const url = new URL(window.location.href);
	url.pathname = newValue;
	history.pushState(newValue, "", url);
}
