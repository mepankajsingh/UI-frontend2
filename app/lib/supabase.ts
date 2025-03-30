import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tcblwrhrgeaxfpcvmema.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjYmx3cmhyZ2VheGZwY3ZtZW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NzIxMTIsImV4cCI6MjA1NjM0ODExMn0.8bqwiq5uNZqA6aOxFAox4RsJ3SvJ1XyFmSKf2QWkuDQ';

export type Database = {
  public: {
    tables: {
      libraries: {
        Row: {
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
        };
      };
      frameworks: {
        Row: {
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
        };
      };
      library_frameworks: {
        Row: {
          library_id: number;
          framework_id: number;
          is_primary: boolean;
        };
      };
    };
  };
};

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
