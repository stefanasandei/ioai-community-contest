import { useParams } from 'react-router-dom';
import { ExternalLink, Github, Calendar, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MDXProvider } from '@mdx-js/react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import contestsData from '@/data/contests.json';
import '@/styles/prism.css';

const Solution = () => {
    const { round, taskSlug } = useParams<{
        round: string;
        taskSlug: string;
    }>();
    const [MDXContent, setMDXContent] = useState<React.ComponentType | null>(
        null
    );

    const findTask = () => {
        if (!round || !taskSlug) return null;
        const roundNumber = parseInt(round.replace('round-', ''));

        for (const contest of contestsData.contests) {
            const task = contest.tasks.find((t) => {
                const slug = t.name
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .trim();
                return slug === taskSlug;
            });

            if (task && contest.id === roundNumber + 1) {
                return { task, contest };
            }
        }
        return null;
    };

    const result = findTask();

    useEffect(() => {
        const loadMDX = async () => {
            if (!round || !taskSlug) return;
            try {
                const mdxModule = await import(
                    `@/solutions/${round}/${taskSlug}.mdx`
                );
                setMDXContent(() => mdxModule.default);
            } catch (err) {
                // Silently fail if MDX doesn't exist
            }
        };
        loadMDX();
    }, [round, taskSlug]);

    if (!result) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
                <Navigation />
                <div className="pt-[72px] max-w-4xl mx-auto px-6 py-16 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Solution Not Found
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        The solution you're looking for doesn't exist.
                    </p>
                </div>
                <Footer />
            </div>
        );
    }

    const { task, contest } = result;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
            <Navigation />

            <div className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10 pt-[72px]">
                <div className="max-w-6xl mx-auto px-6 pt-8 pb-6">
                    <div className="flex items-start justify-between gap-6 mb-4">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex-1">
                            {task.name}
                        </h1>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href={task.kaggle}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
                            >
                                Kaggle
                                <ExternalLink className="w-4 h-4" />
                            </a>
                            <a
                                href={task.solution}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Github className="w-4 h-4" />
                                Solution
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="px-2.5 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium">
                            {task.type}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            {contest.month} {contest.year}
                        </span>
                        {task.author && (
                            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                <User className="w-4 h-4" />
                                {task.author}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-8">
                {MDXContent ? (
                    <article className="prose text-justify prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline">
                        <div className="syntax-highlighter-wrapper">
                            <MDXProvider>
                                <MDXContent />
                            </MDXProvider>
                        </div>
                    </article>
                ) : (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Solution explanation not available, but
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            We have the solution notebook on GitHub
                        </p>
                        <a
                            href={task.solution}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            View Solution
                        </a>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Solution;