import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LibraryCard } from "~/components/library-card";
import { Badge } from "~/components/ui/badge";
import { supabase } from "~/lib/supabase";
import type { Framework, Library } from "~/lib/types";
import { formatDate, formatNumber } from "~/lib/utils";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { slug } = params;

  if (!slug) {
    throw new Response("Framework slug is required", { status: 400 });
  }

  // Get framework by slug
  const { data: framework, error } = await supabase
    .from('frameworks')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error("Error fetching framework:", error);
    throw new Response("Framework not found", { status: 404 });
  }

  // Get libraries related to this framework
  const { data: libraryFrameworks, error: relatedError } = await supabase
    .from('library_frameworks')
    .select('library_id')
    .eq('framework_id', framework.id);

  if (relatedError) {
    console.error("Error fetching related libraries:", relatedError);
  }

  let relatedLibraries: Library[] = [];
  if (libraryFrameworks && libraryFrameworks.length > 0) {
    const libraryIds = libraryFrameworks.map(lf => lf.library_id);
    const { data: libraries, error: librariesError } = await supabase
      .from('libraries')
      .select('*')
      .in('id', libraryIds);

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
        "Cache-Control": "public, max-age=60, s-maxage=43200", // 12 hours for CDN
      },
    }
  );
};

export default function FrameworkDetail() {
  const { framework, relatedLibraries } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-center gap-4">
        {framework.icon_url && (
          <img 
            src={framework.icon_url} 
            alt={framework.name} 
            className="h-16 w-16 rounded-lg object-contain"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{framework.name}</h1>
          {framework.website_url && (
            <a 
              href={framework.website_url} 
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
              {framework.description || "No description available"}
            </p>
          </div>

          {framework.installation_command && (
            <div className="mb-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="mb-4 text-xl font-semibold">Installation</h2>
              <div className="overflow-x-auto rounded-md bg-gray-100 p-3 dark:bg-gray-800">
                <code className="text-sm text-gray-800 dark:text-gray-200">{framework.installation_command}</code>
              </div>
            </div>
          )}

          {framework.type && framework.rendering_type && (
            <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="mb-4 text-xl font-semibold">Framework Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {framework.type && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</h3>
                    <p className="mt-1">{framework.type}</p>
                  </div>
                )}
                {framework.rendering_type && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Rendering</h3>
                    <p className="mt-1">{framework.rendering_type}</p>
                  </div>
                )}
                {framework.language && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Language</h3>
                    <p className="mt-1">{framework.language}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-4 text-xl font-semibold">Stats</h2>
            <div className="space-y-4">
              {framework.github_stars !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">GitHub Stars</span>
                  <span className="font-medium">{formatNumber(framework.github_stars)}</span>
                </div>
              )}
              {framework.github_forks !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">GitHub Forks</span>
                  <span className="font-medium">{formatNumber(framework.github_forks)}</span>
                </div>
              )}
              {framework.npm_downloads !== null && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">NPM Downloads</span>
                  <span className="font-medium">{formatNumber(framework.npm_downloads)}</span>
                </div>
              )}
              {framework.latest_version && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Latest Version</span>
                  <span className="font-medium">{framework.latest_version}</span>
                </div>
              )}
              {framework.last_update && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
                  <span className="font-medium">{formatDate(framework.last_update)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {framework.github_url && (
              <a 
                href={framework.github_url} 
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
            {framework.npm_url && (
              <a 
                href={framework.npm_url} 
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
            {framework.docs_url && (
              <a 
                href={framework.docs_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Documentation
              </a>
            )}
          </div>
        </div>
      </div>

      {relatedLibraries.length > 0 && (
        <section>
          <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Compatible Libraries</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedLibraries.map((library: Library) => (
              <LibraryCard key={library.id} library={{...library, frameworks: [framework]}} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function meta({ data }: { data: { framework: Framework } | undefined }) {
  if (!data) {
    return [
      { title: "Framework Not Found" },
      { name: "description", content: "The requested framework could not be found." },
    ];
  }

  const { framework } = data;
  return [
    { title: framework.meta_title || `${framework.name} - UI Explorer` },
    { name: "description", content: framework.meta_description || framework.description || `Learn about ${framework.name} framework` },
  ];
}
