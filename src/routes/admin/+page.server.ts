import type { PageServerLoad } from './$types';
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