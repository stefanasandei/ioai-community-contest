import { Component, type ReactNode } from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import { recoverPageLoad } from '@/lib/recoverPageLoad';

export function PageLoading() {
  return <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
    <Navigation />
    <main className="min-h-[70vh] px-6 pt-36 text-center" role="status" aria-live="polite">
      <p className="text-gray-600 dark:text-gray-300">Loading page…</p>
    </main>
    <Footer />
  </div>;
}

// Keep navigation available for errors that cannot be recovered automatically.
export default class RouteBoundary extends Component<{ children: ReactNode; resetKey: string }, { failed: boolean; recovering: boolean }> {
  state = { failed: false, recovering: false };

  static getDerivedStateFromError() { return { failed: true }; }

  componentDidCatch(error: Error) {
    if (recoverPageLoad(error)) this.setState({ recovering: true });
  }

  componentDidUpdate(previous: Readonly<{ children: ReactNode; resetKey: string }>) {
    // Reset errors when navigating, without remounting healthy pages on parameter
    // changes (resource tabs keep their scroll-restoration state this way).
    if (this.state.failed && previous.resetKey !== this.props.resetKey) {
      this.setState({ failed: false, recovering: false });
    }
  }

  render() {
    if (this.state.recovering) return <PageLoading />;
    if (!this.state.failed) return this.props.children;
    return <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
      <Navigation />
      <main className="min-h-[70vh] px-6 pt-36 text-center">
        <h1 className="text-2xl font-bold">This page could not load</h1>
        <p role="alert" className="mt-3 text-gray-600 dark:text-gray-300">Reload to try again.</p>
        <button onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600">Reload page</button>
        <a href="/" className="ml-5 text-purple-600 dark:text-purple-400 underline">Go to home</a>
      </main>
      <Footer />
    </div>;
  }
}
