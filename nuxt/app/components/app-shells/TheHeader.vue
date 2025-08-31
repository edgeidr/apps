<template>
	<header :class="['fixed inset-x-0 duration-200', { 'bg-surface-0 shadow': !isAtTop }]">
		<div class="container mx-auto">
			<nav :class="['flex items-center justify-between gap-8 duration-200', isAtTop ? 'py-8' : 'py-4']">
				<NuxtLink :to="{ name: 'index' }">
					<span class="text-lg font-bold">edgeidr.dev</span>
				</NuxtLink>

				<ul class="flex items-center gap-8">
					<li v-for="(link, index) in navLinks" :key="index">
						<NuxtLink :to="link.to" active-class="underline underline-offset-4">
							{{ link.label }}
						</NuxtLink>
					</li>

					<li>
						<NuxtLink v-if="!user" :to="{ name: 'login' }">
							<Button size="small" :label="$t('header.nav.login')" />
						</NuxtLink>
					</li>
				</ul>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
	import { useWindowScroll } from "@vueuse/core";

	const { t } = useI18n();
	const { y } = useWindowScroll();
	const user = useLocalStorage<User>("user", null);
	const navLinks = [
		{ to: { name: "index" }, label: t("header.nav.home") },
		{ to: { name: "about" }, label: t("header.nav.about") },
		{ to: { name: "support" }, label: t("header.nav.support") },
	];

	const isAtTop = computed(() => y.value <= 50);
</script>
