import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { blogPost, user } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const load = (async () => {
	const blogPosts = await db
		.select({
			id: blogPost.id,
			title: blogPost.title,
			content: blogPost.content,
			authorId: blogPost.authorId,
			createdAt: blogPost.createdAt,
			updatedAt: blogPost.updatedAt,
			authorName: user.name,
		})
		.from(blogPost)
		.leftJoin(user, eq(blogPost.authorId, user.id))
		.orderBy(desc(blogPost.createdAt));
	return { blogPosts };
}) satisfies PageServerLoad;

export const actions: Actions = {
	create: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/auth/login');
		}

		const formData = await event.request.formData();
		const title = (formData.get('title')?.toString() ?? '').trim();
		const content = (formData.get('content')?.toString() ?? '').trim();

		if (!title || !content) {
			return fail(400, { error: 'Title and content are required', title, content });
		}

		const slug = makeSlug(title);

		try {
			await db.insert(blogPost).values({
				title,
				slug,
				content,
				authorId: event.locals.user.id,
			});
		} catch (err) {
			console.error('Failed to insert blog post', err);
			return fail(500, { error: 'Unable to create post', title, content });
		}

		return redirect(303, '/admin');
	},
};

function makeSlug(title: string) {
	return title
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}
