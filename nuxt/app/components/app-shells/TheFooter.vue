<template>
	<footer class="bg-surface-800">
		<div class="container mx-auto py-8">
			<div class="text-surface-0 grid grid-cols-12 gap-8">
				<div class="col-span-6 flex flex-col gap-4">
					<span class="text-sm font-bold">edgeidr.dev</span>
					<p class="max-w-prose text-xs leading-relaxed">{{ $t("footer.description") }}</p>

					<span class="text-xs">&copy; {{ currentYear }} edgeidr.dev {{ $t("footer.rights") }}</span>
				</div>

				<div class="col-span-2">
					<nav class="text-xs">
						<ul class="flex flex-col gap-2">
							<li v-for="navLink in navLinks" :key="navLink.label">
								<NuxtLink :to="navLink.to" class="underline-offset-2 hover:underline">
									{{ navLink.label }}
								</NuxtLink>
							</li>
						</ul>
					</nav>
				</div>

				<div class="col-span-2">
					<nav class="text-xs">
						<ul class="flex flex-col gap-2">
							<li v-for="legalLink in legalLinks" :key="legalLink.label">
								<NuxtLink :to="legalLink.to" class="underline-offset-2 hover:underline">
									{{ legalLink.label }}
								</NuxtLink>
							</li>
						</ul>
					</nav>
				</div>

				<div class="col-span-2">
					<div class="flex flex-wrap justify-end gap-2 text-lg">
						<NuxtLink
							v-for="(social, index) in socials"
							:key="index"
							:to="social.url"
							target="_blank"
							rel="noopener noreferrer">
							<Icon :name="social.icon" />
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup lang="ts">
	import socials from "@/assets/json/socials.json";

	const { t } = useI18n();
	const currentYear = ref(new Date().getFullYear());

	const navLinks = ref([
		{ label: t("footer.nav.about"), to: { name: "about" } },
		{ label: t("footer.nav.contact"), to: { name: "contact" } },
	]);

	const legalLinks = ref([
		{ label: t("footer.nav.terms"), to: { name: "legal-terms" } },
		{ label: t("footer.nav.privacy"), to: { name: "legal-privacy" } },
		{ label: t("footer.nav.cookies"), to: { name: "legal-cookies" } },
	]);
</script>
