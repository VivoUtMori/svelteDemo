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
			return fail(400, { message: 'Title and content are required', title, content });
		}

		const slug = makeSlug(title);

		try {
			await db.insert(blogPost).values({
				title,
				slug,
				content,
				authorId: event.locals.user.id,
			});
		} catch (error) {
			return fail(400, { message: (error as any)?.cause?.detail || 'Unable to create post', title, content });
		}

		return redirect(303, '/admin');
	},
	delete: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/auth/login');
		}
		const formData = await event.request.formData();
		const id = (formData.get('id')?.toString() ?? '').trim();
		if (!id) {
			return fail(400, { message: 'Missing post ID' });
		}
		try {
			await db.delete(blogPost).where(eq(blogPost.id, id));
		} catch (error) {
			return fail(400, { message: (error as any)?.cause?.detail || 'Unable to delete post' });
		}
		return redirect(303, '/admin');
	},
	update: async (event) => {
		if (!event.locals.user) {
			return redirect(302, '/auth/login');
		}
		const formData = await event.request.formData();
		const id = (formData.get('id')?.toString() ?? '').trim();
		const title = (formData.get('title')?.toString() ?? '').trim();
		const content = (formData.get('content')?.toString() ?? '').trim();
		if (!id || !title || !content) {
			return fail(400, { message: 'Missing required fields' });
		}
		try {
			await db.update(blogPost).set({
				title,
				content,
				updatedAt: new Date(),
			}).where(eq(blogPost.id, id));
		} catch (error) {
			return fail(400, { message: (error as any)?.cause?.detail || 'Unable to update post' });
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
