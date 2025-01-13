'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function editBlog(formData: FormData) {
  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  const published = formData.get('published') === 'on';

  try {
    await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        published,
      },
    });

    revalidatePath('/admin/blogs');
    revalidatePath('/');
    revalidatePath(`/blog/${id}`);
    return { success: true, message: 'Blog updated successfully' };
  } catch (error) {
    console.error('Failed to update blog:', error);
    return { success: false, message: 'Failed to update blog' };
  }
}
