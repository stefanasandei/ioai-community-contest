/// <reference types="vite/client" />
declare module 'virtual:blog-index' {
  const posts: import('./lib/blogs').BlogSummary[];
  export default posts;
}
declare module 'virtual:blog-loaders' {
  const files: Record<string, () => Promise<{ default: import('./lib/blogs').BlogPost }>>;
  export default files;
}
