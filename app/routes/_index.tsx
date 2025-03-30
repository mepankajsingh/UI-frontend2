import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FrameworkCard } from "~/components/framework-card";
import { LibraryCard } from "~/components/library-card";
import { supabase } from "~/lib/supabase";
import type { Framework, Library } from "~/lib/types";

export const loader = async () => {
  // Get top libraries by GitHub stars
  const { data: libraries, error: librariesError } = await supabase
    .from('libraries')
    .select('*, frameworks(*)')
    .order('github_stars', { ascending: false })
    .limit(6);

  // Get top frameworks by GitHub stars
  const { data: frameworks, error: frameworksError } = await supabase
    .from('frameworks')
    .select('*')
    .order('github_stars', { ascending: false })
    .limit(6);

  if (librariesError || frameworksError) {
    console.error("Error fetching data:", librariesError || frameworksError);
    throw new Response("Error fetching data", { status: 500 });
  }

  // Process libraries to include related frameworks
  const processedLibraries = libraries?.map((library) => {
    const relatedFrameworks = library.frameworks as unknown as Framework[];
    return {
      ...library,
      frameworks: relatedFrameworks || [],
    };
  });

  return json(
    { libraries: processedLibraries, frameworks },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=43200", // 12 hours for CDN
      },
    }
  );
};

export default function Index() {
  const { libraries, frameworks } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Discover the Best UI Libraries and Frameworks
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Explore a curated collection of UI libraries and frameworks to find the perfect tools for your next project.
        </p>
      </section>

      <section className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Libraries</h2>
          <a href="/libraries" className="text-sm font-medium text-blue-500 hover:underline">
            View all libraries

          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {libraries.map((library: Library) => (
            <LibraryCard key={library.id} library={library} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Frameworks</h2>
          <a href="/frameworks" className="text-sm font-medium text-blue-500 hover:underline">
            View all frameworks
          </a>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {frameworks.map((framework: Framework) => (
            <FrameworkCard key={framework.id} framework={framework} />
          ))}
        </div>
      </section>
    </div>
  );
}
