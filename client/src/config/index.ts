import { ReactiveValue } from "destiny-ui";
import type { ThemeConfig } from "./style";
import type { FontPair } from "./font";

export type Config = {
	theme: ThemeConfig;
	fonts: ReactiveValue<FontPair>;
};
