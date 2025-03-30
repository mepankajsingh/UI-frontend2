export interface Library {
  id: number;
  name: string;
  slug: string;
  title: string;
  icon_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  description: string | null;
  website_url: string | null;
  pricing: string | null;
  gallery_images: string[] | null;
  customization: string | null;
  installation_command: string | null;
  github_url: string | null;
  npm_url: string | null;
  github_stars: number | null;
  github_forks: number | null;
  latest_version: string | null;
  last_update: string | null;
  npm_downloads: number | null;
  styling: string | null;
  total_components: number | null;
  created_at: string;
  updated_at: string;
  npm_package_name: string | null;
  temp_framework_id: number | null;
  user_id: string | null;
  frameworks?: Framework[];
}

export interface Framework {
  id: number;
  name: string;
  slug: string;
  title: string;
  icon_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  description: string | null;
  website_url: string | null;
  installation_command: string | null;
  github_url: string | null;
  npm_url: string | null;
  docs_url: string | null;
  npm_downloads: number | null;
  github_stars: number | null;
  github_forks: number | null;
  latest_version: string | null;
  last_update: string | null;
  type: string | null;
  rendering_type: string | null;
  language: string | null;
  created_at: string;
  updated_at: string;
  npm_package_name: string | null;
  user_id: string | null;
  libraries?: Library[];
}

export interface LibraryFramework {
  library_id: number;
  framework_id: number;
  is_primary: boolean;
}
