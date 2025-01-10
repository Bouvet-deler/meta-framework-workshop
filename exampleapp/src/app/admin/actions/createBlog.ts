'use server';

import { prisma } from '@/lib/db';

export async function createBlog(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const published = formData.get('published') === 'on';

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        published,
      },
    });

    return { success: true, message: 'Blog created successfully' };
  } catch (error) {
    console.error('Failed to create blog:', error);
    return { success: false, message: 'Failed to create blog' };
  }
}
