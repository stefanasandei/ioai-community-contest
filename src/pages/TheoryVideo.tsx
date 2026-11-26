import { ArrowLeft, ExternalLink, Youtube } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function TheoryVideo() {
  const [params] = useSearchParams();
  const videoId = params.get('video') ?? '';
  const title = params.get('title') || 'Learning resource';
  const source = params.get('source') || `https://www.youtube.com/watch?v=${videoId}`;
  const validVideoId = /^[a-zA-Z0-9_-]{11}$/.test(videoId);

  if (!validVideoId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 px-5 text-center text-white">
        <div className="max-w-md">
          <Youtube className="mx-auto h-10 w-10 text-red-500" />
          <h1 className="mt-4 text-2xl font-bold">Invalid YouTube video</h1>
          <p className="mt-2 text-sm text-gray-400">This video link is missing or not supported.</p>
          <Link to="/theory" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-purple-300 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to Theory
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#09090d] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/theory" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-300 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Theory Roadmap
          </Link>
          <a href={source} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-white sm:text-sm">
            Watch on YouTube <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="mb-5 flex items-start gap-3">
          <span className="mt-1 rounded-lg bg-red-500/10 p-2 text-red-500"><Youtube className="h-5 w-5" /></span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-300">Theory resource</p>
            <h1 className="mt-1 text-xl font-bold leading-snug sm:text-2xl">{title}</h1>
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/30">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">Video provided by YouTube. Playback and availability are controlled by the video owner.</p>
      </section>
    </main>
  );
}
