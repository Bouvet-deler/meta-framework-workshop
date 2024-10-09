// Once use client has been used on a parent, all children will be client components unless explicitly declared as server components
'use server';
export async  function handleClick() {
    console.log('Button clicked');
}
