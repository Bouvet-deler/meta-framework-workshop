# Next.js Workshop

## Workshop Overview

- **Duration**: Roughly 2 hours
- **Objective**: Build a simple blog application using Next.js and Prisma with a local database.
- **Prerequisites**: Basic knowledge of JavaScript/Typescript, React

---

## Step 1: Introduction to Next.js

- **Objective**: Understand what Next.js is and its benefits.
- **Content**:
  - Presentation
  - Setting up the development environment.

---

## Step 2: Setting Up the Project

- **Objective**: Create a new Next.js project and understand the project structure.
- **Content**:
  - Install Node.js and npm.
  - Create a new Next.js project (we recommend answering the default (just press enter) to every question that pops up):
    ```bash
    npx create-next-app@latest my-blog
    cd my-blog
    npm run dev
    ```
  - Overview of the project structure:
    - `app/`: Contains the application components and pages.
    - `public/`: Static assets like images.
    - `styles/`: CSS files.
  - Set correct tsconfig for more linting help (optional)
    - Make sure a typescript file is open while opening command palette
    - Make sure tsconfig is at the root of the Visual Studio Code project open
    - In Visual Studio Code, open command palette (SHIFT+CTRL+P), type "select typescript version" and select it, and chose "Use workspace version"
    - This adds some specific rules relevant to Next.js that can warn about errors before compiling

---

## Step 3: Setting Up Prisma

- **Objective**: Integrate Prisma with the Next.js project and set up a local SQLite database.
- **Content**:

  - Install Prisma and initialize it:

    ```bash
    npm install @prisma/client
    npx prisma init
    ```
  - This will create a Prisma folder and a new .env file.
  - Configure the database connection in `.env`:

    ```env
    DATABASE_URL="file:./dev.db"
    ```
  - Define the data model in `prisma/schema.prisma`:

    ```prisma
    datasource db {
      provider = "sqlite"
      url      = env("DATABASE_URL")
    }

    generator client {
      provider = "prisma-client-js"
    }

    model Post {
      id        Int      @id @default(autoincrement())
      title     String
      content   String
      published Boolean  @default(false)
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
    }
    ```
  - Migrate the database:

    ```bash
    npx prisma migrate dev
    ```
  - Generate Prisma Client: (if not already done by the migration command above)

    ```bash
    npx prisma generate
    ```
  - Notice the changes in the Prisma folder, there is now a local db file and .sql migrations files
  - It is recommended to set these commands as scripts in package.json

    - Requires Prisma as a dev-dependency
    - ```
        "scripts": {
          "dev": "next dev --turbopack",
          "build": "next build",
          "start": "next start",
          "lint": "next lint",
          "migrate": "prisma migrate dev"
        },

      ```
  - It is recommended to use the Prisma Client as a singleton, e.g /src/lib/db.ts:

    ```typescript
    import { PrismaClient } from '@prisma/client'

    const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

    export const prisma =
      globalForPrisma.prisma || new PrismaClient()

    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
    ```

    [Database connections | Prisma Documentation
    ](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections)

---

## Step 4: Creating Pages

- **Objective**: Become accustomed to folder based routing in Nextjs.
- **Content**:

  - Create a homepage (`app/page.tsx`):
  - This already exists, but it can be nice to overwrite the HTML contents to see the changes live

    ```javascript
    export default function Home() {
      return <h1>Welcome to My Blog</h1>;
    }
    ```
  - Create an about page (`app/about/page.tsx`):

    ```javascript
    export default function About() {
      return <h1>About Me</h1>;
    }
    ```
  - Link between pages using `next/link`:

    ```javascript
    import Link from 'next/link';

    export default function Home() {
      return (
        <div>
          <h1>Welcome to My Blog</h1>
          <Link href="/about">About Me</Link>
        </div>
      );
    }
    ```
  - Or programmatically using the useRouter hook in a client component or redirect in a server component

    - More can be found here: [Routing: Linking and Navigating | Next.js](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating)
  - There exists a number of file conventions in Next.js that serve different purpose: (you can find more information about a specific file in the Next.js documentation)

    ```
    1. page.js / page.tsx: This file defines the unique UI of a route .
    2. layout.js / layout.tsx: This file defines UI that is shared between multiple pages .
    3. loading.js / loading.tsx: This file creates a loading UI that is shown while page content is loading .
    4. error.js / error.tsx: This file defines an error UI boundary for a route segment .
    5. not-found.js / not-found.tsx: This file creates a UI to show when the notFound function is thrown within a route segment or when a URL is not matched by any route .
    6. route.js / route.ts: This file is used to create API endpoints and is the equivalent of API Routes in the pages directory .
    7. template.js / template.tsx: Similar to layout, but creates a new instance for each of their children on navigation .
    8. default.js / default.tsx: This file defines fallback UI for Parallel Routes .


    These files are part of what Next.js calls "Special Files" in the App Router. They have reserved names and specific purposes within the routing system.

    Additionally, there are other conventions:

    9. global-error.js / global-error.tsx: This provides a global error UI at the root of your application .
    10. middleware.ts: This file allows you to run code before a request is completed .
    11. _components, _lib, _styles, etc.: Folders starting with an underscore are private folders, used to colocate files with routes without affecting routing .
    ```

---

## Step 5: Creating new blogs and storing to the database

- **Objective:** Create a UI where the user can create content to be stored in the database
- **Content:**
  - Create a new page under /app/admin
    - An example is to create a new file /admin/page.tsx (we will apply simple authentication to all admin routes later)
  - Create a simple form that can take a title, content and a checkbox for published.
    - Tips if you are stuck: Use generative AI, such as Github Copilot, v0.dev, bolt, etc.. or you can take inspiration from the exampleapp branch
  - You will need both a client component and a server action to do this. The client component is interactive so the user can input data, and the server action is so we can securely add the data to the database.
    - Implementation of the server action can look something like this:
    - ```typescript
      'use server';

      import { prisma } from '@/lib/db';

      export async function createBlog(formData: FormData) {
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const published = formData.get('published') === 'on';

        try {
          await prisma.post.create({
            data: {
              title,
              content,
              published,
            },
          });

          return { success: true, message: 'Blog created successfully' };
        } catch (error) {
          console.error('Failed to create blog:', error);
          return { success: false, message: 'Failed to create blog' };
        }
      }

      ```

---

## Step 6: Fetching the blogs from the database

- **Objective**: Fetch data from the local database using Prisma.
- **Content**:

  - Fetch data at build time using server components (this can be placed in any page you want to):
    The blogposts can be retrieved as such: (you can exclude the selectors and where clauses, this is taken from the exampleapp branch to highlight its existence)

    ```typescript
    import { prisma } from '@/lib/db';

    const blogPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    ```
  - blogPosts is an array of posts, typed correctly adhering to schema.prisma. You can use blogPosts.map(post => `<h1>{post.title}</h1>` to display every blog's title in the database
  - The post should be in a `<Link>` tag, as clicking on it should navigate to a dynamic route in step 7.
  - Use Tailwind or shadcn components for styling if you want to

    - Tools like Github Copilot can be useful here!

---

## Step 7: Dynamic Routes

- **Objective**: Create dynamic routes for individual blog posts.
- **Content**:

  - Let's assume the post only contains the first 10 words of the content, and that the user can click the blog post to open it.
  - Create a new file at /src/app/blog/[id]/page.tsx
    - [id] will create a dynamic route. The id will also be consumable as a query parameter in the react component
    - This file will hold the complete information the user needs for the post, e.g. the entire post content, modified date, creation date etc..
    - The implementation for getting 1 blog post can look something like this:
    - ```typescript
      export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
        const { id } = await params;

        const blog = await prisma.post.findUnique({
          where: { id: parseInt(id) },
        });

        if (!blog || !blog.published) {
          notFound();
        }
      }
      ```
  - (Optional) Add a not-found.tsx file to catch users that trigger the notFound function, [File Conventions: not-found.js | Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/not-found)

---

## Step 8: Modifying existing blog posts

- **Objective**: Create a UI where admins can modify existing blog posts.
- **Content**:
  - Create a new page under the /admin route that will display every blog posts, even if they are unpublished, e.g. /app/admin/page.tsx can be an index page for the admin interface
  - Clicking on a blog post should navigate to a new page where the user can edit the blog post
    - The admin user should be able to edit, publish and delete the blog post
    - The edit page can be created at /app/admin/edit/[id]/page.tsx
    - Use prisma.post.update|delete|create method to alter the data in database
    - Use the revalidatePath in server actions to update the UI after the database transaction have completed.
    - The type for the blogPost can be inferred from Prisma, e.g. `type Post = Prisma.PostGetPayload<object>;`

---

## Step 9: Adding simple authentication to our admin routes

- **Objective**: Prompt the user to log in before they can access the admin routes.
- **Content**:
  - We can add a simple authentication check to the admin routes by using a middleware function

    - Middlewares must be at the root of the project, /src/middleware.ts
  - A simple middleware that checks the HTTP header for authentication can look something like this:
  - ```typescript
    import { NextRequest, NextResponse } from 'next/server';

    export async function middleware(req: NextRequest) {
      if ((await isAuthenticated(req)) === false) {
        return new NextResponse('Unauthorized', {
          status: 401,
          headers: { 'WWW-Authenticate': 'Basic' },
        });
      }
    }

    async function isAuthenticated(req: NextRequest) {
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');

      if (authHeader == null) return false;

      const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

      return (
        username === process.env.ADMIN_USERNAME &&
        (await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD as string))
      );
    }

    export const config = {
      matcher: '/admin/:path*',
    };

    ```

    This requires 2 environment variables in a .env file, "ADMIN_USERNAME" and "HASHED_ADMIN_PASSWORD". If these were prefixed with NEXT_PUBLIC, they could also be used in a client component (used for public secrets) [Configuring: Environment Variables | Next.js](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

    Take note of the config object, that uses a matcher to apply this middleware to just routes under the /admin route.

    These helper functions using in-built crypto libraries in JS can help you authenticate

    ```typescript
    export async function isValidPassword(password: string, hashedPassword: string) {
      return (await hashPassword(password)) === hashedPassword;
    }

    async function hashPassword(password: string) {
      const arrayBuffer = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(password));

      return Buffer.from(arrayBuffer).toString('base64');
    }

    ```

    In this example, the password stored in the .env file is hashed. You can hash your password using SHA-512, or using the hashPassword function, e.g. `let hashedPassword = hashPassword("myPassword");`
  - Disclaimer: In a real project, we do not recommend rolling your own auth. This is to demonstrate middleware capabilities and the interaction between client and server. There are plenty of open source options that provide compatibility with auth providers, such as Azure AD (Entra ID), BankID, Firebase....

    - Some examples for Next.js are [NextAuth.js](https://next-auth.js.org/) (which will soon become [Auth.js | Authentication for the Web](https://authjs.dev/)), [Clerk | Authentication and User Management](https://clerk.com/)
  - For project structuring reasons, you can use route groups to group e.g. public facing and admin routes

    - E.g. /app/(public) and /app/(admin)/admin/page.tsx
    - [Route groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)

---

<!-- Hidden step because we might not have time -->

<!-- ## Step 10: Deploying the Application with Podman 

- **Objective**: Deploy the Next.js application using Podman.
- **Content**:

  - Create a `Containerfile` in the root of the project:

    ```dockerfile
    # Use the official Node.js image as the base image
    FROM node:14-alpine

    # Set the working directory
    WORKDIR /app

    # Copy package.json and package-lock.json
    COPY package*.json ./

    # Install dependencies
    RUN npm install

    # Copy the rest of the application code
    COPY . .

    # Build the application
    RUN npm run build

    # Expose the port the app runs on
    EXPOSE 3000

    # Start the application
    CMD ["npm", "start"]
    ```
  - Create a `podman-compose.yml` file to manage the services:

    ```yaml
    version: '3.8'

    services:
      app:
        build: .
        ports:
          - '3000:3000'
        environment:
          - DATABASE_URL=file:./dev.db
        volumes:
          - .:/app
          - /app/node_modules
        command: npm run dev
    ```
  - Build and run the Podman container:

    ```bash
    podman-compose up --build
    ```

--- -->

## Future work

- Add not found and error pages/boundaries.
- Add a complex form, and validate using e.g. zod. Use this to use the same code to validate both on the client and the server for better ease of use, security and maintenability.
- Add authentication to server actions.
- Add authentication implementation with an auth library, e.g. next-auth, authjs, Clerk..
- Deploy the application to a cloud provider like Vercel, AWS or Azure, or look at self-hosting options
- Can swap out the DB with a CMS, like Payload (with integrated Nextjs support in v3)

## Resources

NextJS open source github repo: [vercel/next.js: The React Framework](https://github.com/vercel/next.js/)
