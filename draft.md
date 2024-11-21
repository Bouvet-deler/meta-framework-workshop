# Next.js Workshop Format with Prisma and Podman Deployment

## Workshop Overview

- **Duration**: 4 hours
- **Objective**: Build a simple blog application using Next.js and Prisma with a local database, and deploy it using Podman.
- **Prerequisites**: Basic knowledge of JavaScript, React, SQL, and Podman.

---

## TODO - Add the following sections

- Security
  - SRC is just a normal HTTP call, need proper security
- Middleware (can demonstrate this with a simple auth check and an admin panel)
  - Add middleware to check if the user is authenticated
- Forms!
  - Add a form to create a new post
  - Type checking with zod, full stack type checking

---

## Step 1: Introduction to Next.js (30 minutes)

- **Objective**: Understand what Next.js is and its benefits.
- **Content**:
  - What is Next.js?
  - Key features: Server-side rendering, Static site generation, Server Components, performance
  - Full-stack type-security
  - Comparison with React, Svelte(Kit), Angular and .NET.
  - Setting up the development environment.

---

## Step 2: Setting Up the Project (30 minutes)

- **Objective**: Create a new Next.js project and understand the project structure.
- **Content**:
  - Install Node.js and npm.
  - Create a new Next.js project:
    ```bash
    npx create-next-app@latest my-blog
    cd my-blog
    npm run dev
    ```
  - Overview of the project structure:
    - `app/`: Contains the application components and pages.
    - `public/`: Static assets like images.
    - `styles/`: CSS files.

---

## Step 3: Setting Up Prisma (45 minutes)

- **Objective**: Integrate Prisma with the Next.js project and set up a local SQLite database.
- **Content**:
  - Install Prisma and initialize it:
    ```bash
    npm install @prisma/client
    npx prisma init
    ```
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
      createdAt DateTime @default(now())
    }
    ```
  - Migrate the database:
    ```bash
    npx prisma migrate dev --name init
    ```
  - Generate Prisma Client:
    ```bash
    npx prisma generate
    ```

---

## Step 4: Creating Pages (45 minutes)

- **Objective**: Create and navigate between pages.
- **Content**:
  - Create a homepage (`app/page.js`):
    ```javascript
    export default function Home() {
      return <h1>Welcome to My Blog</h1>;
    }
    ```
  - Create an about page (`app/about/page.js`):
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

---

## Step 5: Styling the Application (30 minutes)

- **Objective**: Apply global and component-specific styles.
- **Content**:
  - Create a global stylesheet (`styles/globals.css`):
    ```css
    body {
      font-family: Arial, sans-serif;
    }
    ```
  - Import the global stylesheet in `app/layout.js`:
    ```javascript
    import '../styles/globals.css';

    export default function RootLayout({ children }) {
      return (
        <html>
          <body>{children}</body>
        </html>
      );
    }
    ```
  - Add component-specific styles using CSS Modules:
    - Create a CSS Module (`styles/Home.module.css`):
      ```css
      .title {
        color: blue;
      }
      ```
    - Use the CSS Module in a component:
      ```javascript
      import styles from '../styles/Home.module.css';

      export default function Home() {
        return <h1 className={styles.title}>Welcome to My Blog</h1>;
      }
      ```

---

## Step 6: Fetching Data with Prisma (45 minutes)

- **Objective**: Fetch data from the local database using Prisma.
- **Content**:
  - Fetch data at build time using server components:
    ```javascript
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    export default async function Home() {
      const posts = await prisma.post.findMany();

      return (
        <div>
          <h1>Welcome to My Blog</h1>
          <ul>
            {posts.map(post => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </div>
      );
    }
    ```

---

## Step 7: Dynamic Routes with Prisma (45 minutes)

- **Objective**: Create dynamic routes for individual blog posts.
- **Content**:
  - Create a dynamic route (`app/posts/[id]/page.js`):
    ```javascript
    import { PrismaClient } from '@prisma/client';

    const prisma = new PrismaClient();

    export async function generateStaticParams() {
      const posts = await prisma.post.findMany();
      return posts.map(post => ({
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

## Step 8: Creating API Routes with Server Components (45 minutes)

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
            {posts.map(post => (
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

## Step 9: Deploying the Application with Podman (45 minutes)

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
          - "3000:3000"
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

* Can swap out the DB with a CMS, like Payload (with integrated Nextjs support in v3)

## Resources

NextJS open source github repo: https://github.com/vercel/next.js/
