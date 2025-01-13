// import { PrismaClient } from '@prisma/client';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { publishBlog, deleteBlog } from './actions';

// const prisma = new PrismaClient();

// export default async function AdminBlogsPage() {
//   const blogs = await prisma.post.findMany({
//     orderBy: { createdAt: 'desc' },
//   });

//   return (
//     <div className="container mx-auto py-10">
//       <Card className="w-full mb-6">
//         <CardHeader>
//           <CardTitle>Manage Blogs</CardTitle>
//           <CardDescription>View, edit, publish, and delete blog posts</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Link href="/admin/create-blog">
//             <Button>Create New Blog</Button>
//           </Link>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Title</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Created At</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {blogs.map((blog) => (
//                 <TableRow key={blog.id}>
//                   <TableCell>{blog.title}</TableCell>
//                   <TableCell>{blog.published ? 'Published' : 'Draft'}</TableCell>
//                   <TableCell>{new Date(blog.createdAt).toLocaleDateString()}</TableCell>
//                   <TableCell>
//                     <div className="flex space-x-2">
//                       <Link href={`/admin/blogs/edit/${blog.id}`}>
//                         <Button variant="outline" size="sm">
//                           Edit
//                         </Button>
//                       </Link>
//                       <form action={publishBlog}>
//                         <input type="hidden" name="id" value={blog.id} />
//                         <Button type="submit" variant="outline" size="sm">
//                           {blog.published ? 'Unpublish' : 'Publish'}
//                         </Button>
//                       </form>
//                       <form action={deleteBlog}>
//                         <input type="hidden" name="id" value={blog.id} />
//                         <Button type="submit" variant="destructive" size="sm">
//                           Delete
//                         </Button>
//                       </form>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
