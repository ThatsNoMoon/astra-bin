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

export class Resolvable<T> implements PromiseLike<T> {
	promise: Promise<T>;
	resolve!: (value: T | PromiseLike<T>) => void;
	reject!: (reason: Error) => void;
	constructor() {
		this.promise = new Promise<T>((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	then<U = T, V = never>(
		resolved?: ((value: T) => U | PromiseLike<U>) | undefined | null,
		rejected?: ((reason: any) => V | PromiseLike<V>) | undefined | null
	) {
		return this.promise.then(resolved, rejected);
	}

	catch<U = never>(
		rejected?: ((reason: any) => U | PromiseLike<U>) | undefined | null
	): Promise<T | U> {
		return this.promise.catch(rejected);
	}
}
