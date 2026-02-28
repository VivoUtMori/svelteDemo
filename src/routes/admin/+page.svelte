<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const formatDate = (date: Date) => {
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	};
</script>

<h1>Blog Posts</h1>
<form method="post" action="?/create">
	<label>
		Title
		<input name="title" value={form?.title ?? ''} required />
	</label>
	<label>
		Content
		<textarea name="content" value={form?.content ?? ''} rows="6" required></textarea>
	</label>
	<button>Create Post</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>

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
				<form method="POST" action="?/delete">
					<input type="hidden" name="id" value={post.id} />
					<button>Delete</button>
				</form>
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
