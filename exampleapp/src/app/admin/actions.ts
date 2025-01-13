'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function publishBlog(formData: FormData) {
  const id = formData.get('id') as string;
  const blog = await prisma.post.findUnique({ where: { id: parseInt(id) } });

  if (!blog) {
    throw new Error('Blog not found');
  }

  await prisma.post.update({
    where: { id: parseInt(id) },
    data: { published: !blog.published },
  });

  revalidatePath('/admin/blogs');
  revalidatePath('/');
}

export async function deleteBlog(formData: FormData) {
  const id = formData.get('id') as string;

  await prisma.post.delete({ where: { id: parseInt(id) } });

  revalidatePath('/admin/blogs');
  revalidatePath('/');
}
