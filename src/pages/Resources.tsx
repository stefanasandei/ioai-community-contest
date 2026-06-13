import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Resources = () => {
  return (
    <div className="min-h-screen py-14 bg-gray-50 dark:bg-[#0a0a0f]">
      <Navigation />

      <div className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10 pt-4">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-gray-900 dark:text-white">Useful </span>
            <span className="text-gradient">Resources</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-light max-w-3xl">
            A curated set of links to help you prepare for AICC contests — from
            official IOAI material to the libraries you'll use most.
          </p>
        </div>
      </div>

      <div className="max-w-7xl text-black mx-auto px-4 pt-10 pb-24 space-y-12">
        hello wwrlds
      </div>

      <Footer />
    </div>
  );
};

export default Resources;
