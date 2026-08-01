<script lang="ts">
	import { page } from '$app/stores';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'Today', match: (path: string) => path === '/' },
		{
			href: '/appliances/',
			label: 'Appliances',
			match: (path: string) => path.startsWith('/appliances')
		},
		{ href: '/add/', label: 'Add', match: (path: string) => path.startsWith('/add') }
	];
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Appliance Keeper</title>
	<meta
		name="description"
		content="Local-first appliance, filter, warranty, and service tracker for the whole household."
	/>
</svelte:head>

<div class="app-shell">
	{@render children()}
</div>

<nav class="nav-bar" aria-label="Main">
	{#each links as link}
		<a
			class="nav-link"
			href={link.href}
			aria-current={link.match($page.url.pathname) ? 'page' : undefined}
		>
			{link.label}
		</a>
	{/each}
</nav>
