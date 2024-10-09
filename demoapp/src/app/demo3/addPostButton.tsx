'use client';

import { useRouter } from 'next/navigation';
import { addPost } from './addPost';

export default function AddPostButton() {
  console.log('Add post button');

  const router = useRouter();

  function addPostHandler() {
    addPost();
    router.refresh();
  }

  return (
    <button className="bg-blue-400 rounded p-8" onClick={addPostHandler}>
      Click me to add a post in the db
    </button>
  );
}
