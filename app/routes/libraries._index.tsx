import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LibraryCard } from "~/components/library-card";
import { supabase } from "~/lib/supabase";
import type { Framework, Library } from "~/lib/types";

export const loader = async () => {
  const { data: libraries, error } = await supabase
    .from('libraries')
    .select('*, frameworks(*)')
    .order('github_stars', { ascending: false });

  if (error) {
    console.error("Error fetching libraries:", error);
    throw new Response("Error fetching libraries", { status: 500 });
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
    { libraries: processedLibraries },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=43200", // 12 hours for CDN
      },
    }
  );
};

export default function Libraries() {
  const { libraries } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          UI Libraries
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
          Explore our collection of UI libraries to enhance your web development projects.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {libraries.map((library: Library) => (
          <LibraryCard key={library.id} library={library} />
        ))}
      </div>
    </div>
  );
}
