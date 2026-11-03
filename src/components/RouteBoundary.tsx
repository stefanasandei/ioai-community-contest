import { Component, type ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';

export function PageLoading() {
  return <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
    <Navigation />
    <main className="min-h-[70vh] px-6 pt-36 text-center" role="status" aria-live="polite">
      <p className="text-gray-600 dark:text-gray-300">Loading page…</p>
    </main>
    <Footer />
  </div>;
}

// Keep navigation available after a failed download. Reloading also clears
// React.lazy's rejected promise and picks up files from a newer deployment.
export default class RouteBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  render() {
    if (!this.state.failed) return this.props.children;
    return <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      <Navigation />
      <main className="min-h-[70vh] px-6 pt-36 text-center">
        <h1 className="text-2xl font-bold">This page could not load</h1>
        <p role="alert" className="mt-3 text-gray-600 dark:text-gray-300">Check your connection and reload to try again.</p>
        <button onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600">Reload page</button>
        <a href="/" className="ml-5 text-purple-600 dark:text-purple-400 underline">Go to home</a>
      </main>
      <Footer />
    </div>;
  }
}
