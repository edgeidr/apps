<template>
	<Card>
		<template #title>
			<h1 class="text-color text-2xl font-semibold">{{ $t("auth.login.title") }}</h1>
		</template>

		<template #subtitle>
			<p class="mb-4">{{ $t("auth.login.subtitle") }}</p>
		</template>

		<template #content>
			<form @submit.prevent="onSubmit">
				<div class="space-y-4">
					<div>
						<label>{{ $t("auth.login.labels.email") }}</label>
						<InputText
							v-model="form.email"
							:invalid="hasError('email')"
							class="mt-1"
							inputmode="email"
							fluid />
						<FieldErrors field="email" :formErrors />
					</div>

					<div>
						<label>{{ $t("auth.login.labels.password") }}</label>
						<Password
							v-model="form.password"
							:invalid="hasError('password')"
							:feedback="false"
							class="mt-1"
							fluid />
						<FieldErrors field="password" :formErrors />
					</div>

					<div class="flex items-center justify-between gap-4 whitespace-nowrap">
						<div class="flex items-center gap-2">
							<Checkbox v-model="staySignedIn" inputId="staySignedIn" size="small" binary />
							<label for="staySignedIn" class="text-sm">{{ $t("auth.login.labels.staySignedIn") }}</label>
						</div>

						<Button
							@click="navigateTo({ name: 'forgot-password' })"
							:label="$t('auth.login.buttons.forgotPassword')"
							variant="link"
							class="!p-0"
							size="small" />
					</div>

					<Button
						type="submit"
						:label="$t('auth.login.buttons.signIn')"
						:loading="signInStatus === 'pending'"
						fluid />
				</div>
			</form>

			<div class="mt-4 space-y-4">
				<div class="flex items-center">
					<div class="border-surface-300 h-px flex-1 border-t"></div>
					<span class="text-muted-color px-2 text-sm">{{ $t("auth.login.buttons.continueWith") }}</span>
					<div class="border-surface-300 h-px flex-1 border-t"></div>
				</div>

				<div class="flex gap-4">
					<Button
						:label="$t('auth.login.buttons.google')"
						severity="secondary"
						variant="outlined"
						:disabled="!isGoogleSignInReady"
						@click="() => signInWithGoogle()"
						fluid>
						<template #icon>
							<Icon name="logos:google-icon" />
						</template>
					</Button>
				</div>
			</div>
		</template>
	</Card>
</template>

<script setup lang="ts">
	import {
		useTokenClient,
		type AuthCodeFlowErrorResponse,
		type AuthCodeFlowSuccessResponse,
	} from "vue3-google-signin";

	definePageMeta({ layout: "auth" });

	const user = useLocalStorage<User>("user", null);
	const formErrors = ref<FormError[]>([]);
	const { hasError, clearAllErrors } = useFormErrors(formErrors);
	const staySignedIn = ref(false);
	const form = ref({
		email: "",
		password: "",
		staySignedIn: staySignedIn.value,
	});
	const googleSignInForm = ref({
		accessToken: "",
		staySignedIn: staySignedIn.value,
	});

	const { execute: signIn, status: signInStatus } = await useCustomFetch("/auth/signin", {
		immediate: false,
		watch: false,
		method: "POST",
		body: form,
		onResponse: async ({ response }) => {
			if (!response.ok) return;

			const { user: userData } = response._data as { user: User };

			user.value = userData;
			navigateTo({ name: "index" });
		},
		onResponseError: ({ response }) => {
			const { message } = response._data;

			if (message && Array.isArray(message)) {
				formErrors.value = message;
			}
		},
	});

	const { execute: googleSignIn } = await useCustomFetch("/auth/google", {
		immediate: false,
		watch: false,
		method: "POST",
		body: googleSignInForm,
		onResponse: async ({ response }) => {
			if (!response.ok) return;

			const { user: userData } = response._data as { user: User };

			user.value = userData;
			navigateTo({ name: "index" });
		},
	});

	const onSubmit = () => {
		clearAllErrors();
		signIn();
	};

	const { isReady: isGoogleSignInReady, login: signInWithGoogle } = useTokenClient({
		onSuccess: (response: AuthCodeFlowSuccessResponse) => {
			googleSignInForm.value.accessToken = response.access_token;
			googleSignIn();
		},
		onError: (error: AuthCodeFlowErrorResponse) => {
			console.error("Error: ", error);
		},
	});
</script>
