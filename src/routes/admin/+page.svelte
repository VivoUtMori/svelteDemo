<script lang="ts">
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';

	let { data }: PageProps = $props();

	function resetFormOnSuccesfulCreation() {
		return async ({ formElement, result }: { formElement: HTMLFormElement; result: any }) => {
			if (result?.type === 'success') {
				formElement.reset();
			} else if (result instanceof Response && result.ok) {
				formElement.reset();
			}
		};
	}

	const formatDate = (date: Date) => {
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	};
</script>

<h1>Blog Posts</h1>
<form method="post" action="?/create" use:enhance={resetFormOnSuccesfulCreation}>
	<label>
		Title
		<input name="title" required />
	</label>
	<label>
		Content
		<textarea name="content" rows="6" required></textarea>
	</label>
	<button>Create Post</button>
</form>

{#if data.blogPosts.length === 0}
	<p>No blog posts found.</p>
{:else}
	<ul>
		{#each data.blogPosts as post (post.id)}
			<li>
				<h3>{post.title}</h3>
				<p><strong>Created:</strong> {formatDate(post.createdAt)}</p>
				<p><strong>Author:</strong> {post.authorName}</p>
				<p>{post.content}</p>
			</li>
		{/each}
	</ul>
{/if}

<style>
	ul {
		list-style: none;
	}

	ul li + li {
		border-top: 1px solid var(--totl-primate-font-descolor);
		margin-top: 3rem;
	}
</style>
