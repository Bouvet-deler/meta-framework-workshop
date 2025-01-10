import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/db';

export default async function HomePage() {
  const blogPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  return (
    <div className="container mx-auto p-16">
      <h1 className="text-4xl font-bold mb-8">Welcome to my Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((blog) => (
          <Link href={`/blog/${blog.id}`} key={blog.id} className="no-underline">
            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                <CardDescription>{new Date(blog.createdAt).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-muted-foreground">
                  {blog.content.split(' ').slice(0, 20).join(' ')}...
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

