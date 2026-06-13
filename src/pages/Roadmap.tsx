import { CheckCircle2, Rocket, Compass, type LucideIcon } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Roadmap = () => {
  return (
    <div className="min-h-screen py-14 bg-gray-50 dark:bg-[#0a0a0f]">
      <Navigation />

      <div className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10 pt-4">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-gray-900 dark:text-white">Our </span>
            <span className="text-gradient">Roadmap</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-light max-w-3xl">
            learning resources to help u get from zero to hero in your AI knowledge
          </p>
        </div>
      </div>

      <div className="max-w-7xl text-black mx-auto px-4 pt-10 pb-24 space-y-12">
        hello world
      </div>

      <Footer />
    </div>
  );
};

export default Roadmap;
