'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { editBlog } from './edit-blog';
import { Prisma } from '@prisma/client';

// We can type the blog object using Prisma's generated types so we always have one source of truth
type Post = Prisma.PostGetPayload<object>;

export function EditBlogForm({ blogPost }: { blogPost: Post }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setFormMessage(null);

    const result = await editBlog(formData);

    setIsSubmitting(false);
    if (result.success) {
      setFormMessage({ type: 'success', message: result.message });
      router.refresh();
    } else {
      setFormMessage({ type: 'error', message: result.message });
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <form action={handleSubmit}>
        <input type="hidden" name="id" value={blogPost.id} />
        <CardHeader>
          <CardTitle>Edit Blog Post</CardTitle>
          <CardDescription>Make changes to your blog post. You can use Markdown for the content.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={blogPost.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content (Markdown supported)</Label>
            <Textarea id="content" name="content" defaultValue={blogPost.content} required className="min-h-[200px]" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="published" name="published" defaultChecked={blogPost.published} />
            <Label htmlFor="published">Published</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
      {formMessage && (
        <div
          className={`mt-4 p-4 rounded-md ${
            formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
          {formMessage.message}
        </div>
      )}
    </Card>
  );
}
