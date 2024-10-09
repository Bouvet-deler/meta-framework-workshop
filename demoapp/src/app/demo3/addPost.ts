"use server"

import { db } from "@/lib/db";

export const addPost = async () => {
  await db.post.create({
    data: {
      title: 'New Post',
      content: 'This is a new post.',
    },
  });
};
