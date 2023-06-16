import type { ReactiveValue } from "destiny-ui";

export async function ensure<T>(v: ReactiveValue<T | undefined>): Promise<T> {
	let value = v.value;
	while (value === undefined) {
		value = await v.nextUpdate;
	}
	return value;
}

export function deepFreeze<O>(obj: O): O {
	if (typeof obj !== "object" || obj == null) {
		return obj;
	}

	return Object.fromEntries(
		Object.entries(obj).map(([k, v]) => [k, deepFreeze(v)])
	) as any;
}
