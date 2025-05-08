This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev


To Run in production mode

```bash
npm run build

npm run start

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

---

## 🧱 Frontend Architecture

The project is structured for scalability and modular development. Below is a high-level overview of the frontend architecture based on the codebase structure:

```
src/
│
├── app/                      # Application routing structure (Next.js App Router)
│   ├── (admin)/              # Admin-specific routes
│   ├── (user)/               # User-specific routes
│   ├── about/                # About page route
│   ├── layout.tsx           # Global layout wrapper
│   ├── page.tsx             # Default landing page
│   ├── page.test.tsx        # Test file for page.tsx
│   ├── signin.css           # Styles specific to signin
│   └── globals.css          # Global CSS styles
│
├── components/              # Reusable UI components
│   ├── Footer/
│   └── Header/
│
├── contexts/                # React context providers for global state management
│   ├── apiProvider/
│   ├── authProvider/
│   └── index.tsx
│
├── types/                   # Custom TypeScript type definitions
│   └── type.ts
│
├── utils/                   # Utility functions
│   ├── api.ts
│   ├── apiBaseOrigin.ts
│   └── isLoggedin.ts
│
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker orchestration
├── env.d.ts                 # Environment variable type definitions
├── jest.config.js           # Jest configuration
├── jest.setup.ts            # Jest setup file
├── next.config.js           # Next.js configuration
├── next-env.d.ts            # Next.js type declarations
├── tsconfig.json            # TypeScript configuration
├── README.md                # Project documentation
└── package.json             # Project dependencies and scripts
```

---

## 🐳 Docker Note

If you are running the application inside a Docker container, make sure to update the `NEXT_PUBLIC_API_URL` environment variable in the **Dockerfile** to match the backend service URL inside the Docker network.