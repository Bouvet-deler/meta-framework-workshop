import { db } from '@/lib/db';
import AddPostButton from './addPostButton';
import ServerComponent from '../demo2/serverComponent';
import ClientComponent from '../demo2/clientComponent';

export default async function Demo3() {
  console.log(await db.post.findMany());
  // await db.post.deleteMany();

  return (
    <div>
      {/* You can comment in the server and client components to get a better understanding of the boundaries */}
      {/* <ServerComponent> */}
      <h1>Demo3</h1>
      <pre>
        <code>{JSON.stringify(await db.post.findMany(), null, 2)}</code>
      </pre>
      {/* </ServerComponent> */}

      {/* <ClientComponent> */}
      <AddPostButton />
      {/* </ClientComponent> */}
    </div>
  );
}
