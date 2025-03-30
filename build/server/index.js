import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, Link, Outlet, Meta, Links, ScrollRestoration, Scripts, useRouteError, isRouteErrorResponse, useLoaderData } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@supabase/supabase-js";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function Footer() {
  return /* @__PURE__ */ jsx("footer", { className: "border-t border-gray-200 bg-white py-6 dark:border-gray-800 dark:bg-gray-950", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400", children: /* @__PURE__ */ jsxs("p", { children: [
    "© ",
    (/* @__PURE__ */ new Date()).getFullYear(),
    " UI Explorer. All rights reserved."
  ] }) }) });
}
function Header() {
  return /* @__PURE__ */ jsx("header", { className: "border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex h-16 items-center justify-between px-4", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 font-bold text-gray-900 dark:text-white", children: [
      /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-6 w-6 text-blue-500", children: /* @__PURE__ */ jsx("path", { d: "M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" }) }),
      /* @__PURE__ */ jsx("span", { children: "UI Explorer" })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsx(Link, { to: "/libraries", className: "text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400", children: "Libraries" }),
      /* @__PURE__ */ jsx(Link, { to: "/frameworks", className: "text-sm font-medium text-gray-700 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400", children: "Frameworks" })
    ] })
  ] }) });
}
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
const meta$2 = () => {
  return [
    { title: "UI Explorer - Discover Libraries and Frameworks" },
    { name: "description", content: "Explore the best UI libraries and frameworks for your next project" },
    { name: "viewport", content: "width=device-width, initial-scale=1" }
  ];
};
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-1", children }),
      /* @__PURE__ */ jsx(Footer, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center", children: [
      /* @__PURE__ */ jsxs("h1", { className: "mb-4 text-4xl font-bold", children: [
        error.status,
        " ",
        error.statusText
      ] }),
      /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg text-gray-600 dark:text-gray-400", children: error.data }),
      /* @__PURE__ */ jsx("a", { href: "/", className: "rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600", children: "Go back home" })
    ] }) });
  }
  return /* @__PURE__ */ jsx(Layout, { children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "mb-4 text-4xl font-bold", children: "Something went wrong" }),
    /* @__PURE__ */ jsx("p", { className: "mb-8 text-lg text-gray-600 dark:text-gray-400", children: "An unexpected error occurred. Please try again later." }),
    /* @__PURE__ */ jsx("a", { href: "/", className: "rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600", children: "Go back home" })
  ] }) });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: App,
  links,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function formatNumber(num) {
  if (num === null || num === void 0) return "0";
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + "M";
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + "K";
  }
  return num.toString();
}
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}
function Badge({
  className,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-gray-900 text-gray-50 hover:bg-gray-900/80 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/80": variant === "default",
          "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80": variant === "secondary",
          "border-gray-200 bg-transparent hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50": variant === "outline",
          "border-transparent bg-blue-500 text-white hover:bg-blue-500/80": variant === "primary"
        },
        className
      ),
      ...props
    }
  );
}
function Card({ className, href, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "rounded-lg border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-950 dark:border-gray-800",
        className
      ),
      ...props
    }
  );
}
function CardHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("flex flex-col space-y-1.5 p-4", className),
      ...props
    }
  );
}
function CardTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "h3",
    {
      className: cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      ),
      ...props
    }
  );
}
function CardContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx("div", { className: cn("p-4 pt-0", className), ...props });
}
function CardFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn("flex items-center p-4 pt-0", className),
      ...props
    }
  );
}
function FrameworkCard({ framework }) {
  return /* @__PURE__ */ jsx(Link, { to: `/frameworks/${framework.slug}`, prefetch: "intent", children: /* @__PURE__ */ jsxs(Card, { className: "h-full hover:border-blue-500", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center gap-2", children: [
      framework.icon_url && /* @__PURE__ */ jsx(
        "img",
        {
          src: framework.icon_url,
          alt: framework.name,
          className: "h-8 w-8 rounded-md object-contain"
        }
      ),
      /* @__PURE__ */ jsx(CardTitle, { className: "line-clamp-1", children: framework.name })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "line-clamp-2 text-sm text-gray-500 dark:text-gray-400", children: framework.description || "No description available" }) }),
    /* @__PURE__ */ jsxs(CardFooter, { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        framework.github_stars !== null && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-3 w-3", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z", clipRule: "evenodd" }) }),
          formatNumber(framework.github_stars)
        ] }),
        framework.npm_downloads !== null && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-3 w-3", children: [
            /* @__PURE__ */ jsx("path", { d: "M12 15a3 3 0 100-6 3 3 0 000 6z" }),
            /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z", clipRule: "evenodd" })
          ] }),
          formatNumber(framework.npm_downloads)
        ] })
      ] }),
      framework.type && /* @__PURE__ */ jsx(Badge, { variant: "primary", children: framework.type })
    ] })
  ] }) });
}
const supabaseUrl = "https://tcblwrhrgeaxfpcvmema.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYmx3cmhyZ2VheGZwY3ZtZW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NzIxMTIsImV4cCI6MjA1NjM0ODExMn0.8bqwiq5uNZqA6aOxFAox4RsJ3SvJ1XyFmSKf2QWkuDQ";
const supabase = createClient(supabaseUrl, supabaseAnonKey);
const loader$4 = async () => {
  const { data: frameworks, error } = await supabase.from("frameworks").select("*").order("github_stars", { ascending: false });
  if (error) {
    console.error("Error fetching frameworks:", error);
    throw new Response("Error fetching frameworks", { status: 500 });
  }
  return json(
    { frameworks },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=43200"
        // 12 hours for CDN
      }
    }
  );
};
function Frameworks() {
  const { frameworks } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsxs("section", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl", children: "UI Frameworks" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-2xl text-gray-600 dark:text-gray-400", children: "Discover modern UI frameworks to build beautiful and responsive web applications." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: frameworks.map((framework) => /* @__PURE__ */ jsx(FrameworkCard, { framework }, framework.id)) })
  ] });
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Frameworks,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
function LibraryCard({ library }) {
  return /* @__PURE__ */ jsx(Link, { to: `/libraries/${library.slug}`, prefetch: "intent", children: /* @__PURE__ */ jsxs(Card, { className: "h-full hover:border-blue-500", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "flex flex-row items-center gap-2", children: [
      library.icon_url && /* @__PURE__ */ jsx(
        "img",
        {
          src: library.icon_url,
          alt: library.name,
          className: "h-8 w-8 rounded-md object-contain"
        }
      ),
      /* @__PURE__ */ jsx(CardTitle, { className: "line-clamp-1", children: library.name })
    ] }),
    /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("p", { className: "line-clamp-2 text-sm text-gray-500 dark:text-gray-400", children: library.description || "No description available" }) }),
    /* @__PURE__ */ jsxs(CardFooter, { className: "flex justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        library.github_stars !== null && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-3 w-3", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z", clipRule: "evenodd" }) }),
          formatNumber(library.github_stars)
        ] }),
        library.npm_downloads !== null && /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "currentColor", className: "h-3 w-3", children: [
            /* @__PURE__ */ jsx("path", { d: "M12 15a3 3 0 100-6 3 3 0 000 6z" }),
            /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z", clipRule: "evenodd" })
          ] }),
          formatNumber(library.npm_downloads)
        ] })
      ] }),
      library.frameworks && library.frameworks.length > 0 && /* @__PURE__ */ jsx(Badge, { variant: "primary", children: library.frameworks[0].name })
    ] })
  ] }) });
}
const loader$3 = async ({ params }) => {
  const { slug } = params;
  if (!slug) {
    throw new Response("Framework slug is required", { status: 400 });
  }
  const { data: framework, error } = await supabase.from("frameworks").select("*").eq("slug", slug).single();
  if (error) {
    console.error("Error fetching framework:", error);
    throw new Response("Framework not found", { status: 404 });
  }
  const { data: libraryFrameworks, error: relatedError } = await supabase.from("library_frameworks").select("library_id").eq("framework_id", framework.id);
  if (relatedError) {
    console.error("Error fetching related libraries:", relatedError);
  }
  let relatedLibraries = [];
  if (libraryFrameworks && libraryFrameworks.length > 0) {
    const libraryIds = libraryFrameworks.map((lf) => lf.library_id);
    const { data: libraries, error: librariesError } = await supabase.from("libraries").select("*").in("id", libraryIds);
    if (librariesError) {
      console.error("Error fetching libraries:", librariesError);
    } else {
      relatedLibraries = libraries || [];
    }
  }
  return json(
    { framework, relatedLibraries },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=43200"
        // 12 hours for CDN
      }
    }
  );
};
function FrameworkDetail() {
  const { framework, relatedLibraries } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center gap-4", children: [
      framework.icon_url && /* @__PURE__ */ jsx(
        "img",
        {
          src: framework.icon_url,
          alt: framework.name,
          className: "h-16 w-16 rounded-lg object-contain"
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: framework.name }),
        framework.website_url && /* @__PURE__ */ jsx(
          "a",
          {
            href: framework.website_url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 hover:underline",
            children: "Visit Website"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 grid gap-8 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-semibold", children: "About" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300", children: framework.description || "No description available" })
        ] }),
        framework.installation_command && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-semibold", children: "Installation" }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md bg-gray-100 p-3 dark:bg-gray-800", children: /* @__PURE__ */ jsx("code", { className: "text-sm text-gray-800 dark:text-gray-200", children: framework.installation_command }) })
        ] }),
        framework.type && framework.rendering_type && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-semibold", children: "Framework Details" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            framework.type && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "Type" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1", children: framework.type })
            ] }),
            framework.rendering_type && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "Rendering" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1", children: framework.rendering_type })
            ] }),
            framework.language && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-medium text-gray-500 dark:text-gray-400", children: "Language" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1", children: framework.language })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-semibold", children: "Stats" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            framework.github_stars !== null && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "GitHub Stars" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatNumber(framework.github_stars) })
            ] }),
            framework.github_forks !== null && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "GitHub Forks" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatNumber(framework.github_forks) })
            ] }),
            framework.npm_downloads !== null && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "NPM Downloads" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatNumber(framework.npm_downloads) })
            ] }),
            framework.latest_version && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Latest Version" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: framework.latest_version })
            ] }),
            framework.last_update && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Last Updated" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatDate(framework.last_update) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-3", children: [
          framework.github_url && /* @__PURE__ */ jsxs(
            "a",
            {
              href: framework.github_url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z", clipRule: "evenodd" }) }),
                "View on GitHub"
              ]
            }
          ),
          framework.npm_url && /* @__PURE__ */ jsxs(
            "a",
            {
              href: framework.npm_url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M0 0v24h24V0H0zm19.2 19.2H4.8V4.8h14.4v14.4z" }) }),
                "View on NPM"
              ]
            }
          ),
          framework.docs_url && /* @__PURE__ */ jsxs(
            "a",
            {
              href: framework.docs_url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
              children: [
                /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" }) }),
                "Documentation"
              ]
            }
          )
        ] })
      ] })
    ] }),
    relatedLibraries.length > 0 && /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-6 text-2xl font-bold text-gray-900 dark:text-white", children: "Compatible Libraries" }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: relatedLibraries.map((library) => /* @__PURE__ */ jsx(LibraryCard, { library: { ...library, frameworks: [framework] } }, library.id)) })
    ] })
  ] });
}
function meta$1({ data }) {
  if (!data) {
    return [
      { title: "Framework Not Found" },
      { name: "description", content: "The requested framework could not be found." }
    ];
  }
  const { framework } = data;
  return [
    { title: framework.meta_title || `${framework.name} - UI Explorer` },
    { name: "description", content: framework.meta_description || framework.description || `Learn about ${framework.name} framework` }
  ];
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: FrameworkDetail,
  loader: loader$3,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = async () => {
  const { data: libraries, error } = await supabase.from("libraries").select("*, frameworks(*)").order("github_stars", { ascending: false });
  if (error) {
    console.error("Error fetching libraries:", error);
    throw new Response("Error fetching libraries", { status: 500 });
  }
  const processedLibraries = libraries == null ? void 0 : libraries.map((library) => {
    const relatedFrameworks = library.frameworks;
    return {
      ...library,
      frameworks: relatedFrameworks || []
    };
  });
  return json(
    { libraries: processedLibraries },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=43200"
        // 12 hours for CDN
      }
    }
  );
};
function Libraries() {
  const { libraries } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsxs("section", { className: "mb-8 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl", children: "UI Libraries" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-2xl text-gray-600 dark:text-gray-400", children: "Explore our collection of UI libraries to enhance your web development projects." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", children: libraries.map((library) => /* @__PURE__ */ jsx(LibraryCard, { library }, library.id)) })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Libraries,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async ({ params }) => {
  const { slug } = params;
  if (!slug) {
    throw new Response("Library slug is required", { status: 400 });
  }
  const { data: library, error } = await supabase.from("libraries").select("*, frameworks(*)").eq("slug", slug).single();
  if (error) {
    console.error("Error fetching library:", error);
    throw new Response("Library not found", { status: 404 });
  }
  const relatedFrameworks = library.frameworks;
  const processedLibrary = {
    ...library,
    frameworks: relatedFrameworks || []
  };
  return json(
    { library: processedLibrary },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=43200"
        // 12 hours for CDN
      }
    }
  );
};
function LibraryDetail() {
  const { library } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center gap-4", children: [
      library.icon_url && /* @__PURE__ */ jsx(
        "img",
        {
          src: library.icon_url,
          alt: library.name,
          className: "h-16 w-16 rounded-lg object-contain"
        }
      ),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 dark:text-white", children: library.name }),
        library.website_url && /* @__PURE__ */ jsx(
          "a",
          {
            href: library.website_url,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "text-blue-500 hover:underline",
            children: "Visit Website"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8 grid gap-8 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-semibold", children: "About" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-700 dark:text-gray-300", children: library.description || "No description available" })
        ] }),
        library.installation_command && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-semibold", children: "Installation" }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-md bg-gray-100 p-3 dark:bg-gray-800", children: /* @__PURE__ */ jsx("code", { className: "text-sm text-gray-800 dark:text-gray-200", children: library.installation_command }) })
        ] }),
        library.frameworks && library.frameworks.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-semibold", children: "Compatible Frameworks" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: library.frameworks.map((framework) => /* @__PURE__ */ jsx(Badge, { variant: "primary", children: framework.name }, framework.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-semibold", children: "Stats" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            library.github_stars !== null && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "GitHub Stars" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatNumber(library.github_stars) })
            ] }),
            library.github_forks !== null && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "GitHub Forks" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatNumber(library.github_forks) })
            ] }),
            library.npm_downloads !== null && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "NPM Downloads" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatNumber(library.npm_downloads) })
            ] }),
            library.latest_version && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Latest Version" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: library.latest_version })
            ] }),
            library.last_update && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Last Updated" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: formatDate(library.last_update) })
            ] }),
            library.total_components !== null && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-600 dark:text-gray-400", children: "Components" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: library.total_components })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-col gap-3", children: [
          library.github_url && /* @__PURE__ */ jsxs(
            "a",
            {
              href: library.github_url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", fill: "currentColor", viewBox: "0 0 24 24", "aria-hidden": "true", children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z", clipRule: "evenodd" }) }),
                "View on GitHub"
              ]
            }
          ),
          library.npm_url && /* @__PURE__ */ jsxs(
            "a",
            {
              href: library.npm_url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
              children: [
                /* @__PURE__ */ jsx("svg", { className: "h-5 w-5", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M0 0v24h24V0H0zm19.2 19.2H4.8V4.8h14.4v14.4z" }) }),
                "View on NPM"
              ]
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function meta({ data }) {
  if (!data) {
    return [
      { title: "Library Not Found" },
      { name: "description", content: "The requested library could not be found." }
    ];
  }
  const { library } = data;
  return [
    { title: library.meta_title || `${library.name} - UI Explorer` },
    { name: "description", content: library.meta_description || library.description || `Learn about ${library.name} UI library` }
  ];
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: LibraryDetail,
  loader: loader$1,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const loader = async () => {
  const { data: libraries, error: librariesError } = await supabase.from("libraries").select("*, frameworks(*)").order("github_stars", { ascending: false }).limit(6);
  const { data: frameworks, error: frameworksError } = await supabase.from("frameworks").select("*").order("github_stars", { ascending: false }).limit(6);
  if (librariesError || frameworksError) {
    console.error("Error fetching data:", librariesError || frameworksError);
    throw new Response("Error fetching data", { status: 500 });
  }
  const processedLibraries = libraries == null ? void 0 : libraries.map((library) => {
    const relatedFrameworks = library.frameworks;
    return {
      ...library,
      frameworks: relatedFrameworks || []
    };
  });
  return json(
    { libraries: processedLibraries, frameworks },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=43200"
        // 12 hours for CDN
      }
    }
  );
};
function Index() {
  const { libraries, frameworks } = useLoaderData();
  return /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-12", children: [
    /* @__PURE__ */ jsxs("section", { className: "mb-16 text-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl", children: "Discover the Best UI Libraries and Frameworks" }),
      /* @__PURE__ */ jsx("p", { className: "mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400", children: "Explore a curated collection of UI libraries and frameworks to find the perfect tools for your next project." })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mb-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Popular Libraries" }),
        /* @__PURE__ */ jsx("a", { href: "/libraries", className: "text-sm font-medium text-blue-500 hover:underline", children: "View all libraries" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: libraries.map((library) => /* @__PURE__ */ jsx(LibraryCard, { library }, library.id)) })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-8 flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-gray-900 dark:text-white", children: "Popular Frameworks" }),
        /* @__PURE__ */ jsx("a", { href: "/frameworks", className: "text-sm font-medium text-blue-500 hover:underline", children: "View all frameworks" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: frameworks.map((framework) => /* @__PURE__ */ jsx(FrameworkCard, { framework }, framework.id)) })
    ] })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DLX5NWf7.js", "imports": ["/assets/components-B86AklyY.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-BFuiYGzO.js", "imports": ["/assets/components-B86AklyY.js"], "css": ["/assets/root-BqyHG590.css"] }, "routes/frameworks._index": { "id": "routes/frameworks._index", "parentId": "root", "path": "frameworks", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/frameworks._index-BQiqW_NE.js", "imports": ["/assets/components-B86AklyY.js", "/assets/framework-card-Bv5D-TZf.js", "/assets/badge-CcsJjdzG.js", "/assets/card-Du5dFZB0.js"], "css": [] }, "routes/frameworks.$slug": { "id": "routes/frameworks.$slug", "parentId": "root", "path": "frameworks/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/frameworks._slug-BTRiAfEr.js", "imports": ["/assets/components-B86AklyY.js", "/assets/library-card-DbIO4KrV.js", "/assets/badge-CcsJjdzG.js", "/assets/card-Du5dFZB0.js"], "css": [] }, "routes/libraries._index": { "id": "routes/libraries._index", "parentId": "root", "path": "libraries", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/libraries._index-BYuF4st4.js", "imports": ["/assets/components-B86AklyY.js", "/assets/library-card-DbIO4KrV.js", "/assets/badge-CcsJjdzG.js", "/assets/card-Du5dFZB0.js"], "css": [] }, "routes/libraries.$slug": { "id": "routes/libraries.$slug", "parentId": "root", "path": "libraries/:slug", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/libraries._slug-BgAe5Mor.js", "imports": ["/assets/components-B86AklyY.js", "/assets/badge-CcsJjdzG.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-CZ19lqCF.js", "imports": ["/assets/components-B86AklyY.js", "/assets/framework-card-Bv5D-TZf.js", "/assets/library-card-DbIO4KrV.js", "/assets/badge-CcsJjdzG.js", "/assets/card-Du5dFZB0.js"], "css": [] } }, "url": "/assets/manifest-d756bcbd.js", "version": "d756bcbd" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/frameworks._index": {
    id: "routes/frameworks._index",
    parentId: "root",
    path: "frameworks",
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/frameworks.$slug": {
    id: "routes/frameworks.$slug",
    parentId: "root",
    path: "frameworks/:slug",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/libraries._index": {
    id: "routes/libraries._index",
    parentId: "root",
    path: "libraries",
    index: true,
    caseSensitive: void 0,
    module: route3
  },
  "routes/libraries.$slug": {
    id: "routes/libraries.$slug",
    parentId: "root",
    path: "libraries/:slug",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
