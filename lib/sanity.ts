import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2025-03-25',
  token: process.env.NEXT_PUBLIC_SANITY_WRITE_TOKEN,
  useCdn: process.env.NODE_ENV === 'production'
});
