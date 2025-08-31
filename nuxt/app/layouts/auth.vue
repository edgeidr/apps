<template>
	<div class="flex min-h-screen flex-col">
		<TheMain class="flex items-center justify-center py-8">
			<div class="w-full max-w-md">
				edgeidr

				<slot />
			</div>
		</TheMain>

		<TheFooter />
	</div>
</template>

<script lang="ts" setup>
	import TheMain from "~/components/app-shells/TheMain.vue";
	import TheFooter from "~/components/app-shells/TheFooter.vue";
</script>
