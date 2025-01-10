# Next.js Workshop

## Workshop Overview

- **Duration**: Roughly 2 hours
- **Objective**: Build a simple blog application using Next.js and Prisma with a local database, and deploy it using Podman (if we have time).
- **Prerequisites**: Basic knowledge of JavaScript/Typescript, React, SQL, (podman).

---

## TODO - Add the following sections

- Security
  - SRC is just a normal HTTP call, need proper security
  - Authentication with Clerk, can mention
    - If time, we can add role based authentication with Clerk.....???
    - Or with Authjs and Azure...
- Middleware (can demonstrate this with a simple auth check and an admin panel)
  - Add middleware to check if the user is authenticated
    - Create a new step on this
- Forms!
  - Add a form to create a new post
  - Type checking with zod, full stack type checking

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
  - Create a new Next.js project (we recommend answering yes to every question that pops up, workshop alias can be anything):
    ```bash
    npx create-next-app@latest my-blog
    cd my-blog
    npm run dev
    ```
  - Overview of the project structure:
    - `app/`: Contains the application components and pages.
    - `public/`: Static assets like images.
    - `styles/`: CSS files.
  - Set correct tsconfig for more linting help
    - In Visual Studio Code, open command palette (SHIFT+CTRL+P), type "select typescript version" and select it, and chose "Use workspace version"
      - Make sure a typescript file is open while opening command palette
      - Make sure tsconfig is at the root of the Visual Studio Code project open
    - This adds some specific rules relevant to Next.js

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
  - Generate Prisma Client:

    ```bash
    npx prisma generate
    ```
  - Notice the changes in the Prisma folder, there is now a local db file and .sql migrations files
  - It is recommended to set these commands as scripts in package.json*

    - Requires Prisma as a dev-dependency

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

---

## Step 5: Creating new blogs and storing to the database

- **Objective:** Create a UI where the user can create content to be stored in the database
- **Content:**
  - Create a new page or re-use the same page from step 5
    - An example is to create a new file /admin/page.tsx (authentication can be added on this path)
  - 

---

## Step 6: Fetching the blogs from the database

- **Objective**: Fetch data from the local database using Prisma.
- **Content**:

  - Fetch data at build time using server components (this can be placed in any page you want to):

    ```javascript
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    export default async function Home() {
      const posts = await prisma.post.findMany();

      return (
        <div>
          <h1>Welcome to My Blog</h1>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>
      );
    }
    ```

---

## Step 7: Dynamic Routes with Prisma

- **Objective**: Create dynamic routes for individual blog posts.
- **Content**:

  - Create a dynamic route (`app/posts/[id]/page.js`):

    ```javascript
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    export async function generateStaticParams() {
      const posts = await prisma.post.findMany();
      return posts.map((post) => ({
        id: post.id.toString(),
      }));
    }

    export default async function Post({ params }) {
      const post = await prisma.post.findUnique({
        where: { id: parseInt(params.id) },
      });

      return (
        <div>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </div>
      );
    }
    ```

---

## Step 8: Creating API Routes with Server Components

- **Objective**: Create server components to handle CRUD operations.
- **Content**:

  - Create a server component to fetch all posts (`app/posts/page.js`):

    ```javascript
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    export default async function Posts() {
      const posts = await prisma.post.findMany();
      return (
        <div>
          <h1>All Posts</h1>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>
      );
    }
    ```
  - Create a server component to create a new post (`app/posts/new/page.js`):

    ```javascript
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    export default function NewPost() {
      async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const title = formData.get('title');
        const content = formData.get('content');

        await prisma.post.create({
          data: { title, content },
        });

        // Redirect or update UI
      }

      return (
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" required />
          <textarea name="content" placeholder="Content" required />
          <button type="submit">Create Post</button>
        </form>
      );
    }
    ```

---

## Step 9: Deploying the Application with Podman

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

---

## Future work

- Can swap out the DB with a CMS, like Payload (with integrated Nextjs support in v3)

## Resources

NextJS open source github repo: [vercel/next.js: The React Framework](https://github.com/vercel/next.js/)
