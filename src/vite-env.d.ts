/// <reference types="vite/client" />
declare module 'virtual:blog-index' {
  const posts: import('./lib/blogs').BlogSummary[];
  export default posts;
}
