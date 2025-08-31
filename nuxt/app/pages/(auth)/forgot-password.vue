<template>
	<Card>
		<template #title>
			<h1 class="text-color text-2xl font-semibold">{{ $t("auth.forgotPassword.title") }}</h1>
		</template>

		<template #subtitle>
			<p class="mb-4">{{ $t("auth.forgotPassword.subtitle") }}</p>
		</template>

		<template #content>
			<form @submit.prevent="onSubmit">
				<div class="space-y-4">
					<div>
						<label>{{ $t("auth.forgotPassword.labels.email") }}</label>
						<InputText
							v-model="form.email"
							:invalid="hasError('email')"
							class="mt-1"
							inputmode="email"
							fluid />
						<FieldErrors field="email" :formErrors />
					</div>

					<Button
						type="submit"
						:label="$t('auth.forgotPassword.buttons.submit')"
						:loading="sendCodeStatus === 'pending'"
						fluid />

					<div class="flex justify-center">
						<Button
							@click="navigateTo({ name: 'login' })"
							:label="$t('auth.forgotPassword.buttons.back')"
							variant="link"
							class="!p-0"
							size="small" />
					</div>
				</div>
			</form>
		</template>
	</Card>
</template>

<script lang="ts" setup>
	definePageMeta({ layout: "auth" });

	const resetPasswordToken = useState<string>("resetPasswordToken", () => "");
	const forgotPasswordCodeExpiry = useState<Date | null>("forgotPasswordCodeExpiry", () => null);
	const forgotPasswordEmail = useState<string>("forgotPasswordEmail", () => "");
	const forgotPasswordResendExpiry = useState<Date | null>("forgotPasswordResendExpiry", () => null);
	const formErrors = ref<FormError[]>([]);
	const { hasError, clearAllErrors } = useFormErrors(formErrors);
	const form = ref({
		email: "",
	});

	const { execute: sendCode, status: sendCodeStatus } = await useCustomFetch("/auth/forgot-password", {
		immediate: false,
		watch: false,
		method: "POST",
		body: form,
		onResponse: async ({ response }) => {
			if (!response.ok) return;

			const { expiresAt } = response._data as Otp;

			forgotPasswordCodeExpiry.value = new Date(expiresAt);
			forgotPasswordEmail.value = form.value.email;
			navigateTo({ name: "verify-code" });
		},
		onResponseError: ({ response }) => {
			const { message } = response._data;

			if (message && Array.isArray(message)) {
				formErrors.value = message;
			}
		},
	});

	const onSubmit = () => {
		clearAllErrors();
		sendCode();
	};

	onMounted(() => {
		forgotPasswordEmail.value = "";
		forgotPasswordCodeExpiry.value = null;
		forgotPasswordResendExpiry.value = null;
		resetPasswordToken.value = "";
	});
</script>
