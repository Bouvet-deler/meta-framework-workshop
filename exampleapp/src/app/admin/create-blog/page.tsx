'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createBlog } from './createBlog';

export default function CreateBlogPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setFormMessage(null);

    const result = await createBlog(formData);

    setIsSubmitting(false);
    if (result.success) {
      setFormMessage({ type: 'success', message: result.message });
      router.refresh();
    } else {
      setFormMessage({ type: 'error', message: result.message });
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Blog</CardTitle>
          <CardDescription>Fill in the details to create a new blog post.</CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" required />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="published" name="published" />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Blog'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      {formMessage && (
        <div
          className={`mt-4 p-4 rounded-md ${
            formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
          {formMessage.message}
        </div>
      )}
    </div>
  );
}
