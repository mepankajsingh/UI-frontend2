import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Badge } from "~/components/ui/badge";
import { supabase } from "~/lib/supabase";
import type { Framework, Library } from "~/lib/types";
import { formatDate, formatNumber } from "~/lib/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { slug } = params;

  if (!slug) {
    throw new Response("Library slug is required", { status: 400 });
  }

  // Get library by slug
  const { data: library, error } = await supabase
    .from('libraries')
    .select('*, frameworks(*)')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error("Error fetching library:", error);
    throw new Response("Library not found", { status: 404 });
  }

  // Process library to include related frameworks
  const relatedFrameworks = library.frameworks as unknown as Framework[];
  const processedLibrary = {
    ...library,
    frameworks: relatedFrameworks || [],
  };

  return json(
    { library: processedLibrary },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=43200", // 12 hours for CDN
      },
    }
  );
};

export default function LibraryDetail() {
  const { library } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-4">
        {library.icon_url && (
          <img 
            src={library.icon_url} 
            alt={library.name} 
            className="h-16 w-16 rounded-lg object-contain"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{library.name}</h1>
          {library.website_url && (
            <a 
              href={library.website_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Visit Website
            </a>
          )}
        </div>
      </div>

      <div className="mb-8 grid gap-8 md:grid-cols-3">
        <div className="col-span-2">
          <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-xl font-semibold">About</h2>
            <p className="text-gray-700 dark:text-gray-300">
              {library.description || "No description available"}
            </p>
          </div>

          {library.installation_command && (
            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="mb-4 text-xl font-semibold">Installation</h2>
              <div className="overflow-x-auto rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                <code className="text-sm text-gray-800 dark:text-gray-200">{library.installation_command}</code>
              </div>
            </div>
          )}

          {library.frameworks && library.frameworks.length > 0 && (
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="mb-4 text-xl font-semibold">Compatible Frameworks</h2>
              <div className="flex flex-wrap gap-2">
                {library.frameworks.map((framework) => (
                  <Badge key={framework.id} variant="primary">
                    {framework.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-xl font-semibold">Stats</h2>
            <div className="space-y-4">
              {library.github_stars !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">GitHub Stars</span>
                  <span className="font-medium">{formatNumber(library.github_stars)}</span>
                </div>
              )}
              {library.github_forks !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">GitHub Forks</span>
                  <span className="font-medium">{formatNumber(library.github_forks)}</span>
                </div>
              )}
              {library.npm_downloads !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">NPM Downloads</span>
                  <span className="font-medium">{formatNumber(library.npm_downloads)}</span>
                </div>
              )}
              {library.latest_version && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Latest Version</span>
                  <span className="font-medium">{library.latest_version}</span>
                </div>
              )}
              {library.last_update && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="font-medium">{formatDate(library.last_update)}</span>
                </div>
              )}
              {library.total_components !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Components</span>
                  <span className="font-medium">{library.total_components}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {library.github_url && (
              <a 
                href={library.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                View on GitHub
              </a>
            )}
            {library.npm_url && (
              <a 
                href={library.npm_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 0v24h24V0H0zm19.2 19.2H4.8V4.8h14.4v14.4z" />
                </svg>
                View on NPM
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function meta({ data }: { data: { library: Library } | undefined }) {
  if (!data) {
    return [
      { title: "Library Not Found" },
      { name: "description", content: "The requested library could not be found." },
    ];
  }

  const { library } = data;
  return [
    { title: library.meta_title || `${library.name} - UI Explorer` },
    { name: "description", content:

 library.meta_description || library.description || `Learn about ${library.name} UI library` },
  ];
}
