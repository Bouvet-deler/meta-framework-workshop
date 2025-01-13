import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { EditBlogForm } from './edit-blog-form';

const prisma = new PrismaClient();

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const blog = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });

  if (!blog) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Blog Post</h1>
      <EditBlogForm blogPost={blog} />
    </div>
  );
}
