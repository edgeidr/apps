import type { UseFetchOptions } from "nuxt/app";

export const useCustomFetch = <T>(url: string | (() => string), options?: UseFetchOptions<T>) => {
	const { t, te } = useI18n();
	const toast = useToast();
	const runtimeConfig = useRuntimeConfig();

	return useFetch(url, {
		...options,
		$fetch: useNuxtApp().$api as typeof $fetch,
		lazy: true,
		credentials: "include",
		baseURL: useRuntimeConfig().public.apiBaseUrl,
		onRequestError: () => {
			toast.add({
				summary: t("apiStatus.serverError"),
				detail: t("messages.tryAgain"),
				severity: "error",
				life: runtimeConfig.public.toastLife,
			});
		},
		onResponseError: (ctx) => {
			if (typeof options?.onResponseError === "function") {
				options.onResponseError(ctx);
			}

			const { response } = ctx;
			const { message, payload } = response._data;
			const defaultDetail = t("messages.tryAgain");
			let summary;

			if (response.status >= 100 && response.status < 200) {
				summary = t("apiStatus.info");
			} else if (response.status >= 200 && response.status < 300) {
				summary = t("apiStatus.success");
			} else if (response.status >= 300 && response.status < 400) {
				summary = t("apiStatus.info");
			} else if (response.status >= 400 && response.status < 500) {
				summary = t("apiStatus.error");
			} else {
				summary = t("apiStatus.serverError");
			}

			if (message) {
				if (Array.isArray(message)) {
					const detail = t("messages.fixForm");

					toast.add({
						summary,
						detail,
						severity: "error",
						life: runtimeConfig.public.toastLife,
					});
				} else {
					const detail = te(message) ? t(message, payload || {}) : defaultDetail;

					toast.add({
						summary,
						detail,
						severity: "error",
						life: runtimeConfig.public.toastLife,
					});
				}
			} else {
				toast.add({
					summary: summary,
					detail: defaultDetail,
					severity: "error",
					life: runtimeConfig.public.toastLife,
				});
			}
		},
	});
};
