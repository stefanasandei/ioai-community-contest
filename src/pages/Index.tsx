import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import RulesSection from '@/components/RulesSection';
import Footer from '@/components/Footer';
import ContestCard from '@/components/ContestCard';
import { ChevronRight } from 'lucide-react';
import { contests } from '@/data/contests.json';

const latestContest = contests
  .slice()
  .sort((a, b) => a.id - b.id)
  .filter((a) => !a.disabled)
  .at(-1);

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <RulesSection />

        <section className="relative py-24 bg-gray-50 dark:bg-[#0a0a0f] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full max-w-7xl mx-auto">
              <div className="absolute top-20 left-20 w-72 h-72 bg-aicc-purple/5 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-aicc-orange/5 rounded-full blur-3xl" />
            </div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-gray-900 dark:text-white">Check Out Our</span>{' '}
                <span className="text-gradient">Latest Contest</span>
              </h2>
            </div>

            {latestContest && (
              <ContestCard
                month={latestContest.month}
                year={latestContest.year}
                title={latestContest.title}
                tasks={latestContest.tasks}
                roundId={latestContest.id}
              />
            )}

            {/* See All Link */}
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/contests')}
                className="bg-background text-primary font-medium px-8 py-4 rounded-lg flex items-center gap-3 border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all inline-flex"
              >
                See All Past Contests
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
