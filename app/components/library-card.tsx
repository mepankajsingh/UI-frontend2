import { Link } from "@remix-run/react";
import { Library } from "~/lib/types";
import { formatNumber } from "~/lib/utils";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface LibraryCardProps {
  library: Library;
}

export function LibraryCard({ library }: LibraryCardProps) {
  return (
    <Link to={`/libraries/${library.slug}`} prefetch="intent">
      <Card className="h-full hover:border-blue-500">
        <CardHeader className="flex flex-row items-center gap-2">
          {library.icon_url && (
            <img 
              src={library.icon_url} 
              alt={library.name} 
              className="h-8 w-8 rounded-md object-contain"
            />
          )}
          <CardTitle className="line-clamp-1">{library.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
            {library.description || "No description available"}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            {library.github_stars !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
                {formatNumber(library.github_stars)}
              </Badge>
            )}
            {library.npm_downloads !== null && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                </svg>
                {formatNumber(library.npm_downloads)}
              </Badge>
            )}
          </div>
          {library.frameworks && library.frameworks.length > 0 && (
            <Badge variant="primary">
              {library.frameworks[0].name}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
