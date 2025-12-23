import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import MissionSection from '@/components/MissionSection';
import RulesSection from '@/components/RulesSection';
import BecomeSetterSection from '@/components/BecomeSetterSection';
import Footer from '@/components/Footer';
import ContestCard from '@/components/ContestCard';
import { Calendar, ChevronRight } from 'lucide-react';
import contestsData from '@/data/contests.json';

// Get the latest contest (first one in the array)
const latestContest = contestsData.contests[0];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <MissionSection />
        <RulesSection />

        {/* Latest Contest Section */}
        <section className="relative py-24 bg-gray-50 dark:bg-[#0a0a0f] overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full max-w-7xl mx-auto">
              <div className="absolute top-20 left-20 w-72 h-72 bg-aicc-purple/5 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-20 w-96 h-96 bg-aicc-orange/5 rounded-full blur-3xl" />
            </div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aicc-teal/10 border border-aicc-teal/20 mb-6">
                <Calendar className="w-4 h-4 text-aicc-teal" />
                <span className="text-sm font-medium text-aicc-teal">Latest Contest</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-gray-900 dark:text-white">Check Out Our</span>{' '}
                <span className="text-gradient">Latest Challenge</span>
              </h2>
            </div>

            {/* Latest Contest Card */}
            <ContestCard
              month={latestContest.month}
              year={latestContest.year}
              title={latestContest.title}
              winner={latestContest.winner}
              tasks={latestContest.tasks}
            />

            {/* See All Link */}
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/contests')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-aicc-purple to-aicc-orange text-white font-medium rounded-xl hover:shadow-lg hover:shadow-aicc-purple/25 transition-all duration-300"
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
