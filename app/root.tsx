import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import type { LinksFunction, MetaFunction } from "@remix-run/node";

import "./tailwind.css";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const meta: MetaFunction = () => {
  return [
    { title: "UI Explorer - Discover Libraries and Frameworks" },
    { name: "description", content: "Explore the best UI libraries and frameworks for your next project" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Layout>
        <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">{error.status} {error.statusText}</h1>
          <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">{error.data}</p>
          <a href="/" className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Go back home
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">Something went wrong</h1>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          An unexpected error occurred. Please try again later.
        </p>
        <a href="/" className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Go back home
        </a>
      </div>
    </Layout>
  );
}
