import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FrameworkCard } from "~/components/framework-card";
import { supabase } from "~/lib/supabase";
import type { Framework } from "~/lib/types";

export const loader = async () => {
  const { data: frameworks, error } = await supabase
    .from('frameworks')
    .select('*')
    .order('github_stars', { ascending: false });

  if (error) {
    console.error("Error fetching frameworks:", error);
    throw new Response("Error fetching frameworks", { status: 500 });
  }

  return json(
    { frameworks },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=43200", // 12 hours for CDN
      },
    }
  );
};

export default function Frameworks() {
  const { frameworks } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          UI Frameworks
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
          Discover modern UI frameworks to build beautiful and responsive web applications.
        </p>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {frameworks.map((framework: Framework) => (
          <FrameworkCard key={framework.id} framework={framework} />
        ))}
      </div>
    </div>
  );
}
