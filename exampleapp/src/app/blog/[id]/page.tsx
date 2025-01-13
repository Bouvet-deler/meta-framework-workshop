import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const blog = await prisma.post.findUnique({
    where: { id: parseInt(id) },
  });

  if (!blog || !blog.published) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/">
        <Button variant="outline" className="mb-6">
          ← Back to Home
        </Button>
      </Link>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{blog.title}</CardTitle>
          <CardDescription>
            Created: {new Date(blog.createdAt).toLocaleString()}
            {blog.updatedAt > blog.createdAt && <> | Last modified: {new Date(blog.updatedAt).toLocaleString()}</>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {blog.content}
            {/* <ReactMarkdown>{blog.content}</ReactMarkdown> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
