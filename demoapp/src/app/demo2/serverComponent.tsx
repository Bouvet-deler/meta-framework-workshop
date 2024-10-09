'use server';

import { ReactNode } from 'react';

// Do note that explicitly declared server components must be async
export default async function ServerComponent(props: { children: ReactNode }) {
  console.log('Server component');

  return (
    <div className="bg-indigo-400">
      Server component
      <div className="p-8">{props.children}</div>
    </div>
  );
}
