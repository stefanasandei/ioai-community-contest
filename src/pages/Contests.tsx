import { useState, useMemo } from 'react';
import { Search, Calendar, Trophy, ExternalLink, ChevronRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ContestCard from '@/components/ContestCard';
import contestsData from '@/data/contests.json';

// Extended contest data with all contests from latest to first
const allContests = contestsData.contests;

const Contests = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredContests = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();

        return allContests.filter(contest => {
            if (contest.disabled) return false;

            const contestMatch =
                contest.title.toLowerCase().includes(query) ||
                `${contest.month} ${contest.year}`.toLowerCase().includes(query);

            const taskMatch = contest.tasks.some(task =>
                task.name.toLowerCase().includes(query) ||
                task.type.toLowerCase().includes(query)
            );

            return contestMatch || taskMatch;
        });
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0f]">
            <Navigation />

            {/* Header - with top padding to account for fixed navbar */}
            <div className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10 pt-[72px]">
                <div className="max-w-7xl mx-auto px-4 py-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        <span className="text-gray-900 dark:text-white">Past Contest</span>{' '}
                        <span className="text-gradient">Editions</span>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 font-light">
                        Explore all past contests and tasks. Search by contest name, task name, or winner.
                    </p>
                </div>
            </div>

            {/* Search Bar - with top padding to account for fixed navbar */}
            <div className="sticky top-[72px] z-30 bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10 shadow-sm pt-0">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search contests, tasks, winners..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-aicc-purple/50 focus:border-aicc-purple/50 transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredContests.length} contest{filteredContests.length !== 1 ? 's' : ''}
                    {searchQuery && ` for "${searchQuery}"`}
                </p>
            </div>

            {/* Contest Grid - 2 columns on desktop, 1 on mobile */}
            <div className="max-w-7xl mx-auto px-6 pb-24">
                {filteredContests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredContests.map(contest => (
                            <ContestCard
                                key={contest.id}
                                month={contest.month}
                                year={contest.year}
                                title={contest.title}
                                winner={contest.winner}
                                tasks={contest.tasks}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Search className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No contests found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Try adjusting your search
                        </p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="px-6 py-3 rounded-xl bg-aicc-purple text-white font-medium hover:bg-aicc-purple-light transition-colors"
                        >
                            Clear Search
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

// X icon component
const X = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export default Contests;
