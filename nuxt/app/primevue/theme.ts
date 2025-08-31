import { definePreset } from "@primeuix/themes";
import Lara from "@primeuix/themes/lara";
import { type LaraBaseTokenSections } from "@primeuix/themes/lara/base";
import type { Preset } from "@primeuix/themes/types";

const MyPreset = definePreset(Lara, <Preset>{
	semantic: <LaraBaseTokenSections.Semantic>{
		primary: {
			50: "{orange.50}",
			100: "{orange.100}",
			200: "{orange.200}",
			300: "{orange.300}",
			400: "{orange.400}",
			500: "{orange.500}",
			600: "{orange.600}",
			700: "{orange.700}",
			800: "{orange.800}",
			900: "{orange.900}",
			950: "{orange.950}",
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
