<template>
	<div class="flex min-h-screen flex-col">
		<TheHeader />

		<TheMain class="pt-14">
			<slot />
		</TheMain>

		<TheFooter />
	</div>
</template>

<script lang="ts" setup>
	import TheFooter from "~/components/app-shells/TheFooter.vue";
	import TheHeader from "~/components/app-shells/TheHeader.vue";
	import TheMain from "~/components/app-shells/TheMain.vue";
</script>
