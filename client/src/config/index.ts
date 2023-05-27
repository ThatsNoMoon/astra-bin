import { ReactiveValue } from "destiny-ui";
import type { ThemeName } from "./style";
import type { FontPair } from "./font";

export type Config = {
	theme: ReactiveValue<ThemeName>;
	fonts: ReactiveValue<FontPair>;
};
