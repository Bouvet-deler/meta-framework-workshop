'use client';

export default function ClientComponent(props: { children?: React.ReactNode }) {
  console.log('Client component');

  return (
    <div className="bg-rose-400">
      Client component
      <div className="p-8">{props.children}</div>
    </div>
  );
}
