<script lang="ts">
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	const formatDate = (date: Date) => {
		return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
	};

	let editingPostId = $state<string | null>(null);
</script>

<h1>Blog Posts Admin</h1>
<h4>Create New Post</h4>
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

<h4>Manage Posts</h4>
{#if data.blogPosts.length === 0}
	<p>No blog posts found.</p>
{:else}
	<ul>
		{#each data.blogPosts as post (post.id)}
			<li>
				<form method="POST" action="?/delete">
					<input type="hidden" name="id" value={post.id} />
					{#if editingPostId === post.id}
						<label style="margin-top: 1rem;">
							Title
							<input name="title" value={post?.title ?? ''} required />
						</label>
						<label>
							Content
							<textarea name="content" value={post?.content ?? ''} rows="6" required></textarea>
						</label>
						<button formaction="?/update">Save</button>
						<button formaction="" onclick={() => (editingPostId = null)}>Cancel</button>
					{:else}
						<h5>{post.title}</h5>
						<p>
							<strong>Author:</strong>
							{post.authorName}
							&nbsp;
							<strong>Created:</strong>
							{formatDate(post.createdAt)}
							&nbsp;
							<strong>Updated:</strong>
							{formatDate(post.updatedAt)}
						</p>
						<p>{post.content}</p>
						<button formaction="" onclick={() => (editingPostId = post.id)}>Edit</button>
						<button>Delete</button>
					{/if}
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
		margin-top: 2rem;
	}

	h5 {
		margin: 1rem 0 0.5rem;
	}
</style>
