import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MDXProvider } from '@mdx-js/react';
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChevronDown, ExternalLink, FileText, ListChecks } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { mdxComponents } from '@/components/solutions';
import { allTheoryTopics, syllabusUrl, theorySections, topicCount, type TheoryTopic } from '@/data/theory';
import 'katex/dist/katex.min.css';
import '@/styles/prism.css';
import './theory.css';

const COOKIE = 'aicc_theory_progress';
const lessons = import.meta.glob<{ default: ComponentType<{ components?: typeof mdxComponents }> }>('../theory/*.mdx');
const modeClass: Record<string, string> = {
  Theory: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800',
  Practice: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
  Both: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800',
};
const accentClass: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600', purple: 'from-purple-500 to-purple-600', orange: 'from-orange-500 to-orange-600', teal: 'from-teal-500 to-teal-600', pink: 'from-pink-500 to-pink-600',
};
const sectionShortNames = ['Foundations', 'Neural networks', 'Computer vision', 'Language & audio', 'Reinforcement learning'];
const allEntries = theorySections.flatMap(section => section.categories.flatMap(category => category.topics.map(topic => ({ section, category, topic }))));
const topicPath = (sectionId: string, topic: TheoryTopic) => `/theory/${sectionId}/${topic.id}`;

function readProgress(): Set<number> {
  if (typeof document === 'undefined') return new Set();
  const raw = document.cookie.split('; ').find(part => part.startsWith(`${COOKIE}=`))?.split('=')[1] ?? '';
  if (!/^(?:[0-9a-f]{6}(?:-[0-9a-f]{6})*)?$/i.test(raw)) return new Set();
  const saved = new Set(raw.split('-'));
  const done = new Set<number>();
  for (let i = 0; i < topicCount; i += 1) if (saved.has(progressKey(allEntries[i].section.id, allEntries[i].topic.id))) done.add(i);
  return done;
}

function progressKey(sectionId: string, topicId: string) {
  let hash = 2166136261;
  for (const char of `${sectionId}/${topicId}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return ((hash >>> 0) & 0xffffff).toString(16).padStart(6, '0');
}

function useProgress() {
  const [done, setDone] = useState(readProgress);
  const toggle = (topic: TheoryTopic) => {
    const index = allTheoryTopics.indexOf(topic);
    if (index < 0) return;
    const next = new Set(done);
    if (next.has(index)) next.delete(index); else next.add(index);
    const keys = Array.from(next).sort((a, b) => a - b).map(i => progressKey(allEntries[i].section.id, allEntries[i].topic.id)).join('-');
    document.cookie = `${COOKIE}=${keys}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
    setDone(next);
  };
  return { done, toggle };
}

function Progress({ count, total }: { count: number; total: number }) {
  return <div className="flex items-center gap-3" aria-label={`${count} of ${total} topics completed`}>
    <div className="theory-progress-track h-2.5 flex-1 overflow-hidden rounded-full"><div className="theory-progress-fill h-full rounded-full bg-gradient-to-r from-aicc-purple to-purple-500 transition-[width] duration-500" style={{ width: `${total ? count / total * 100 : 0}%` }} /></div>
    <span className="text-sm font-semibold tabular-nums text-gray-600 dark:text-gray-300">{count}/{total}</span>
  </div>;
}

function Index({ done, toggle }: ReturnType<typeof useProgress>) {
  return <>
    <header className="theory-index-hero border-b border-gray-200 pt-24 dark:border-white/10">
      <div className="mx-auto max-w-6xl px-5 pb-8 sm:px-6 sm:pb-10">
        <div className="theory-hero-grid">
          <div>
            <span className="theory-eyebrow"><BookOpen className="h-3.5 w-3.5" /> AICC learning library</span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl"><span className="text-gray-900 dark:text-white">Theory </span><span className="text-gradient">Roadmap</span></h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-600 dark:text-gray-300">Study the official <a href={syllabusUrl} target="_blank" rel="noreferrer" className="font-semibold text-aicc-purple underline-offset-4 hover:underline dark:text-purple-300">IOAI 2027 syllabus</a> and AICC mathematics foundations topic by topic. Follow the <Link to="/roadmap" className="font-semibold text-aicc-purple underline-offset-4 hover:underline dark:text-purple-300">learning roadmap</Link> to put it into practice.</p>
          </div>
          <div className="theory-overview" aria-label={`${done.size} of ${topicCount} topics completed`}>
            <div className="theory-overview-top"><span>Your journey</span><span>{Math.round(done.size / topicCount * 100)}% complete</span></div>
            <div className="theory-overview-number"><strong>{done.size}</strong><span>of {topicCount} topics</span></div>
            <Progress count={done.size} total={topicCount} />
            <p>Each topic you complete brings the full syllabus into focus.</p>
          </div>
        </div>
      </div>
      <nav className="theory-section-nav" aria-label="Syllabus sections"><div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 sm:px-6">
        {theorySections.map((section, index) => <a key={section.id} href={`#${section.id}`} className="theory-section-link"><span>{String(index + 1).padStart(2, '0')}</span>{sectionShortNames[index] ?? section.title}</a>)}
      </div></nav>
    </header>
    <main className="mx-auto max-w-6xl space-y-8 px-5 py-8 sm:px-6 sm:py-10">
      {theorySections.map((section, sectionIndex) => {
        const topics = section.categories.flatMap(group => group.topics);
        const complete = topics.filter(topic => done.has(allTheoryTopics.indexOf(topic))).length;
        return <section key={section.id} id={section.id} className="theory-section-card overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-white/5">
          <div className="theory-section-heading p-5 sm:p-7">
            <div className="flex flex-wrap items-start gap-4 sm:flex-nowrap sm:items-center">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accentClass[section.accent]} text-lg font-bold text-white shadow-sm`}>{String(sectionIndex + 1).padStart(2, '0')}</div>
              <div className="min-w-0 flex-1"><p className="theory-section-kicker">Section {String(sectionIndex + 1).padStart(2, '0')} <span aria-hidden="true">·</span> {topics.length} topics</p><h2 className="mt-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">{section.title}</h2></div>
              <div className="theory-section-progress"><Progress count={complete} total={topics.length} /></div>
            </div>
          </div>
          <div className="theory-categories">
            {section.categories.map((category, categoryIndex) => <div key={category.title} className="theory-category min-w-0 px-4 py-5 sm:px-7 sm:py-6">
              <div className="theory-category-heading"><span className="theory-category-number">{String(categoryIndex + 1).padStart(2, '0')}</span><h3 className="text-base font-bold text-gray-800 dark:text-gray-100">{category.title}</h3>{category.supplementary && <span className="theory-foundation-tag">AICC foundation</span>}<span className="theory-category-count">{category.topics.length} topics</span></div>
              <div className="theory-topic-grid mt-4 grid min-w-0 gap-2" style={{ '--theory-rows': Math.ceil(category.topics.length / 2) } as CSSProperties}>
                {category.topics.map(topic => {
                  const finished = done.has(allTheoryTopics.indexOf(topic));
                  return <div key={topic.id} className={`theory-topic flex min-w-0 items-center gap-2 rounded-lg border px-3 py-3 ${finished ? 'is-complete' : ''}`}>
                    <button type="button" onClick={() => toggle(topic)} aria-label={`${finished ? 'Mark incomplete' : 'Mark complete'}: ${topic.title}`} aria-pressed={finished} className={`theory-topic-check flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aicc-purple ${finished ? 'border-aicc-purple bg-aicc-purple text-white' : 'border-gray-300 text-transparent hover:border-aicc-purple dark:border-gray-600'}`}><Check className="h-3.5 w-3.5" strokeWidth={3} /></button>
                    <Link to={topicPath(section.id, topic)} className="min-w-0 flex-1 text-sm font-medium text-gray-800 hover:text-aicc-purple dark:text-gray-100 dark:hover:text-purple-300">{topic.title}</Link>
                    <span className={`hidden shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold sm:inline-flex ${modeClass[topic.mode]}`}>{topic.mode}</span>
                    <Link to={topicPath(section.id, topic)} aria-label={`Read ${topic.title}`} className="theory-topic-arrow shrink-0 text-gray-400 hover:text-aicc-purple"><ArrowRight className="h-4 w-4" /></Link>
                  </div>;
                })}
              </div>
            </div>)}
          </div>
        </section>;
      })}
      <a href={syllabusUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-aicc-purple hover:underline">Read the official IOAI 2027 syllabus <ExternalLink className="h-4 w-4" /></a>
    </main>
  </>;
}

function LessonTools({ topic, finished, toggle, mobile = false }: { topic: TheoryTopic; finished: boolean; toggle: (topic: TheoryTopic) => void; mobile?: boolean }) {
  const resourceLinks = topic.resources?.length ? topic.resources.map(resource => <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-purple-300 hover:text-aicc-purple dark:border-white/10 dark:text-gray-200">{resource.label}<ExternalLink className="h-3.5 w-3.5 shrink-0" /></a>) : <p className="text-sm text-gray-500 dark:text-gray-400">Curated links will appear here.</p>;
  const taskLink = topic.task ? <a href={topic.task.url} className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-aicc-purple dark:border-white/10">{topic.task.label}<ArrowRight className="h-4 w-4" /></a> : <p className="text-sm text-gray-500 dark:text-gray-400">A recommended problem will appear here.</p>;
  const markButton = <button type="button" onClick={() => toggle(topic)} aria-pressed={finished} className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aicc-purple ${finished ? 'border border-purple-300 bg-purple-50 text-aicc-purple hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-200' : 'bg-aicc-purple text-white shadow-sm hover:bg-purple-700 hover:shadow-md'}`}><Check className="h-4 w-4" />{finished ? 'Completed · Undo' : 'Mark as completed'}</button>;
  if (mobile) return <div className="theory-mobile-tools mt-5 space-y-2 lg:hidden">
    {markButton}
    <div className="grid grid-cols-2 gap-2">
      <details className="theory-mobile-details rounded-lg border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-1 px-3 text-sm font-semibold text-gray-800 dark:text-gray-100"><span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-aicc-purple" /> Resources</span><ChevronDown className="h-4 w-4" /></summary><div className="space-y-2 border-t border-gray-200 p-3 dark:border-white/10">{resourceLinks}</div></details>
      <details className="theory-mobile-details rounded-lg border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-1 px-3 text-sm font-semibold text-gray-800 dark:text-gray-100"><span className="flex items-center gap-1.5"><ListChecks className="h-4 w-4 text-aicc-purple" /> Practice</span><ChevronDown className="h-4 w-4" /></summary><div className="border-t border-gray-200 p-3 dark:border-white/10">{taskLink}</div></details>
    </div>
  </div>;
  return <div className="theory-lesson-tools space-y-3">
    <div className={`theory-tool-card theory-tool-progress rounded-xl border p-4 ${finished ? 'is-complete' : ''}`}><h2 className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"><CheckCircle2 className={`h-4 w-4 ${finished ? 'text-aicc-purple' : 'text-gray-400'}`} /> Your progress</h2><p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{finished ? 'You marked this topic complete.' : 'Mark this topic when you feel ready.'}</p>{markButton}</div>
    <div className="theory-tool-card rounded-xl border p-4"><h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"><BookOpen className="h-4 w-4 text-aicc-purple" /> Resources</h2><div className="space-y-2">{resourceLinks}</div></div>
    <div className="theory-tool-card rounded-xl border p-4"><h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white"><ListChecks className="h-4 w-4 text-aicc-purple" /> Test your knowledge</h2>{taskLink}</div>
  </div>;
}

function Lesson({ done, toggle, sectionId, topicId }: ReturnType<typeof useProgress> & { sectionId: string; topicId: string }) {
  const entryIndex = allEntries.findIndex(entry => entry.section.id === sectionId && entry.topic.id === topicId);
  const entry = allEntries[entryIndex];
  const [Content, setContent] = useState<ComponentType<{ components?: typeof mdxComponents }> | null>(null);
  const articleRef = useRef<HTMLElement>(null);
  const [readPercent, setReadPercent] = useState(0);
  useEffect(() => {
    let active = true;
    setContent(null);
    const loader = lessons[`../theory/${topicId}.mdx`];
    if (loader) loader().then(module => { if (active) setContent(() => module.default); });
    return () => { active = false; };
  }, [topicId]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const article = articleRef.current;
        if (!article) return;
        const start = article.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.55;
        const end = article.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.75;
        setReadPercent(Math.round(Math.max(0, Math.min(100, (window.scrollY - start) / Math.max(1, end - start) * 100))));
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [topicId, Content]);
  if (!entry) return <main className="mx-auto max-w-5xl px-6 py-40 text-center"><h1 className="text-3xl font-bold dark:text-white">Topic not found</h1><Link to="/theory" className="mt-4 inline-block text-aicc-purple">Back to Theory</Link></main>;
  const { section, category, topic } = entry;
  const finished = done.has(allTheoryTopics.indexOf(topic));
  const prev = allEntries[entryIndex - 1]; const next = allEntries[entryIndex + 1];
  return <>
    <div className="theory-reading-indicator" role="progressbar" aria-label="Reading progress" aria-valuenow={readPercent} aria-valuemin={0} aria-valuemax={100}><div style={{ width: `${readPercent}%` }} /></div>
    <header className="theory-lesson-header border-b border-gray-200 pt-24 pb-7 dark:border-white/10"><div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex items-center justify-between gap-3"><Link to="/theory" className="inline-flex items-center gap-1.5 text-sm font-semibold text-aicc-purple hover:underline"><ArrowLeft className="h-4 w-4" /> Theory Roadmap</Link><span className="theory-lesson-position">Topic {entryIndex + 1} of {topicCount}</span></div>
      <p className="mt-5 text-sm font-medium text-gray-500 dark:text-gray-400">{section.title} <span className="mx-1 text-gray-300" aria-hidden="true">/</span> {category.title}</p>
      <h1 className="mt-2 max-w-4xl text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">{topic.title}</h1>
      <div className="mt-5 flex flex-wrap items-center gap-3"><span className={`rounded-full border px-3 py-1 text-xs font-bold ${modeClass[topic.mode]}`}>{category.supplementary ? 'AICC foundation' : `${topic.mode} in syllabus`}</span><a href={syllabusUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-aicc-purple dark:text-gray-400">Official syllabus <ExternalLink className="h-3.5 w-3.5" /></a></div>
      <LessonTools topic={topic} finished={finished} toggle={toggle} mobile />
      <nav aria-label="Adjacent topics" className="theory-mobile-nav mt-4 flex gap-2 lg:hidden">{prev && <Link to={topicPath(prev.section.id, prev.topic)} className="inline-flex min-w-0 flex-1 items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 dark:border-white/10 dark:text-gray-200"><ArrowLeft className="h-4 w-4 shrink-0" /><span className="truncate">Previous</span></Link>}{next && <Link to={topicPath(next.section.id, next.topic)} className="inline-flex min-w-0 flex-1 items-center justify-end gap-1 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-semibold text-aicc-purple dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-300"><span className="truncate">Next: {next.topic.title}</span><ArrowRight className="h-4 w-4 shrink-0" /></Link>}</nav>
    </div></header>
    <main className="theory-lesson-layout mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[13.5rem_minmax(0,1fr)_15rem] lg:gap-7 lg:items-start">
      <nav aria-label="Topics in this section" className="theory-lesson-rail hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2">
        <Link to="/theory" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-aicc-purple dark:text-gray-400"><ArrowLeft className="h-4 w-4" /> All topics</Link>
        {section.categories.map(group => <div key={group.title} className="mb-4"><h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">{group.title}</h2><div className="space-y-0.5">{group.topics.map(item => {
          const current = item.id === topic.id;
          const itemDone = done.has(allTheoryTopics.indexOf(item));
          return <Link key={item.id} to={topicPath(section.id, item)} aria-current={current ? 'page' : undefined} className={`theory-rail-topic flex items-start gap-2 rounded-lg px-2 py-2 text-xs leading-snug ${current ? 'is-current font-semibold text-aicc-purple dark:text-purple-300' : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}><span className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${itemDone ? 'border-aicc-purple bg-aicc-purple text-white' : 'border-gray-300 dark:border-gray-600'}`}>{itemDone && <Check className="h-2.5 w-2.5" strokeWidth={3} />}</span><span>{item.title}</span></Link>;
        })}</div></div>)}
      </nav>
      <article ref={articleRef} className="theory-lesson-article min-w-0">
        {Content ? <div className="prose prose-lg max-w-none text-left dark:prose-invert prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-a:font-semibold dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline prose-headings:tracking-tight"><div className="syntax-highlighter-wrapper"><MDXProvider components={mdxComponents}><Content components={mdxComponents} /></MDXProvider></div></div> : <div className="max-w-2xl"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-aicc-purple dark:bg-purple-900/20"><FileText className="h-5 w-5" /></div><h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lesson in preparation</h2><p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-300">{category.supplementary ? `This AICC mathematics foundation supports the IOAI 2027 syllabus under ${section.title}.` : `This topic appears in the official IOAI 2027 syllabus under ${category.title}. Its classification is ${topic.mode}.`} Detailed theory and examples will be added here. You can still track your progress if you study it elsewhere.</p><Link to="/roadmap" className="mt-5 inline-flex items-center gap-2 font-semibold text-aicc-purple hover:underline">Explore the roadmap <ArrowRight className="h-4 w-4" /></Link></div>}
      </article>
      <aside className="theory-lesson-aside hidden lg:sticky lg:top-24 lg:block"><LessonTools topic={topic} finished={finished} toggle={toggle} /></aside>
      <nav aria-label="Adjacent topics" className="theory-desktop-nav hidden flex-wrap justify-between gap-3 lg:col-start-2 lg:flex">{prev ? <Link to={topicPath(prev.section.id, prev.topic)} className="inline-flex max-w-full items-center gap-2 text-sm font-semibold text-aicc-purple hover:underline"><ArrowLeft className="h-4 w-4 shrink-0" /> {prev.topic.title}</Link> : <span />}{next && <Link to={topicPath(next.section.id, next.topic)} className="inline-flex max-w-full items-center gap-2 text-right text-sm font-semibold text-aicc-purple hover:underline">{next.topic.title} <ArrowRight className="h-4 w-4 shrink-0" /></Link>}</nav>
    </main>
  </>;
}

export default function Theory() {
  const { sectionId, topicId } = useParams();
  const progress = useProgress();
  useEffect(() => { document.title = topicId ? `${allEntries.find(entry => entry.section.id === sectionId && entry.topic.id === topicId)?.topic.title ?? 'Theory'} | AICC` : 'Theory | AICC'; }, [sectionId, topicId]);
  return <div className="theory-page min-h-screen bg-gray-50 dark:bg-[#0a0a0f]"><Navigation />{sectionId && topicId ? <Lesson {...progress} sectionId={sectionId} topicId={topicId} /> : <Index {...progress} />}<Footer /></div>;
}
