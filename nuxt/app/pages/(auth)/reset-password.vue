<template>
	<Card>
		<template #title>
			<h1 class="text-color text-2xl font-semibold">{{ $t("auth.resetPassword.title") }}</h1>
		</template>

		<template #subtitle>
			<p class="mb-4">{{ $t("auth.resetPassword.subtitle") }}</p>
		</template>

		<template #content>
			<form @submit.prevent="onSubmit">
				<div class="space-y-4">
					<div>
						<label>{{ $t("auth.resetPassword.labels.password") }}</label>
						<Password
							v-model="form.password"
							autocomplete="new-password"
							:invalid="hasError('password')"
							:promptLabel="passwordHintLabel"
							:weakLabel="passwordHintLabel"
							:mediumLabel="passwordHintLabel"
							:strongLabel="passwordHintLabel"
							strongRegex="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])(?=.{8,})"
							class="mt-1"
							fluid>
							<template #footer>
								<span class="text-sm">{{ $t("auth.resetPassword.labels.passwordFeedbackLabel") }}</span>
								<ul class="mt-1 mb-0 list-none text-sm leading-normal">
									<li
										v-for="(rule, index) in passwordRules"
										:key="index"
										:class="[{ 'text-green-500': rule.condition }, 'flex items-center gap-1']">
										<Icon name="radix-icons:dot-filled" />
										{{ rule.label }}
									</li>
								</ul>
							</template>
						</Password>

						<FieldErrors field="password" :formErrors />
					</div>

					<div>
						<label>{{ $t("auth.resetPassword.labels.confirmPassword") }}</label>
						<Password
							v-model="form.confirmPassword"
							autocomplete="new-password"
							:invalid="hasError('confirmPassword')"
							:feedback="false"
							class="mt-1"
							fluid />
						<FieldErrors field="confirmPassword" :formErrors />
					</div>

					<Button
						type="submit"
						:label="$t('auth.resetPassword.buttons.submit')"
						:loading="resetPasswordStatus === 'pending'"
						fluid />

					<div class="flex justify-center">
						<Button
							@click="navigateTo({ name: 'login' })"
							:label="$t('auth.resetPassword.buttons.back')"
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
	definePageMeta({
		layout: "auth",
		middleware: "require-reset-password-token",
	});

	const { t } = useI18n();
	const toast = useToast();
	const passwordHintLabel = " ";
	const resetPasswordToken = useState<string>("resetPasswordToken");
	const formErrors = ref<FormError[]>([]);
	const { hasError, clearAllErrors } = useFormErrors(formErrors);
	const form = ref({
		password: "",
		confirmPassword: "",
		token: resetPasswordToken.value,
	});
	const passwordRules = ref([
		{
			label: t("auth.resetPassword.labels.passwordRequireUppercase"),
			condition: computed(() => hasUppercase.value),
		},
		{
			label: t("auth.resetPassword.labels.passwordRequireLowercase"),
			condition: computed(() => hasLowercase.value),
		},
		{
			label: t("auth.resetPassword.labels.passwordRequireNumber"),
			condition: computed(() => hasNumber.value),
		},
		{
			label: t("auth.resetPassword.labels.passwordRequireSymbol"),
			condition: computed(() => hasSymbol.value),
		},
		{
			label: t("auth.resetPassword.labels.passwordRequireMinCharacters"),
			condition: computed(() => hasMinLength.value),
		},
	]);

	const { execute: resetPassword, status: resetPasswordStatus } = await useCustomFetch("/auth/reset-password", {
		immediate: false,
		watch: false,
		method: "POST",
		body: form,
		onResponse: async ({ response }) => {
			if (!response.ok) return;

			resetPasswordToken.value = "";
			navigateTo({ name: "login" });

			toast.add({
				summary: t("apiStatus.success"),
				detail: t("messages.passwordChangedSuccessful"),
				severity: "success",
				life: useRuntimeConfig().public.toastLife,
			});
		},
		onResponseError: ({ response }) => {
			const { message } = response._data;

			if (message && Array.isArray(message)) {
				formErrors.value = message;
			}
		},
	});

	const hasUppercase = computed(() => /[A-Z]/.test(form.value.password));
	const hasLowercase = computed(() => /[a-z]/.test(form.value.password));
	const hasNumber = computed(() => /[0-9]/.test(form.value.password));
	const hasSymbol = computed(() => /[^a-zA-Z0-9]/.test(form.value.password));
	const hasMinLength = computed(() => form.value.password.length >= 8);

	const onSubmit = () => {
		clearAllErrors();
		resetPassword();
	};
</script>
