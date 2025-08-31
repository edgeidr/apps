import vue3GoogleSignIn from "vue3-google-signin";

export default defineNuxtPlugin((nuxtApp) => {
	const config = useRuntimeConfig();

	nuxtApp.vueApp.use(vue3GoogleSignIn, {
		clientId: config.public.googleClientId,
	});
});
