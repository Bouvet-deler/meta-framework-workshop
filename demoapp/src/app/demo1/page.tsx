// Use Client must be used if you want the page to be stateful, e.g. use of hooks such as UseState
// In the absence of "use client", all components by default will be server components
'use client';

import { handleClick } from './handleClick';

export default function Demo1() {
  console.log('Demo1');

  return (
    <div>
      <h1>Demo1</h1>
      <p>Client Side Rendering (CSR) vs React Server Component (RSC)</p>

      <button className="bg-blue-400 rounded p-8" onClick={() => handleClick()}>
        Click me to trigger a response on the server
      </button>
    </div>
  );
}
