import type { ReactiveValue } from "destiny-ui";

export async function ensure<T>(v: ReactiveValue<T | undefined>): Promise<T> {
	let value = v.value;
	while (value === undefined) {
		value = await v.nextUpdate;
	}
	return value;
}
