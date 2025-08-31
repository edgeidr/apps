import { definePreset } from "@primeuix/themes";
import Lara from "@primeuix/themes/lara";
import { type LaraBaseTokenSections } from "@primeuix/themes/lara/base";
import type { Preset } from "@primeuix/themes/types";

const MyPreset = definePreset(Lara, <Preset>{
	semantic: <LaraBaseTokenSections.Semantic>{
		primary: {
			50: "{sky.50}",
			100: "{sky.100}",
			200: "{sky.200}",
			300: "{sky.300}",
			400: "{sky.400}",
			500: "{sky.500}",
			600: "{sky.600}",
			700: "{sky.700}",
			800: "{sky.800}",
			900: "{sky.900}",
			950: "{sky.950}",
		},
	},
});

export default {
	preset: MyPreset,
	options: {
		darkModeSelector: ".p-dark",
		cssLayer: {
			order: "theme, base, primevue",
		},
	},
};
