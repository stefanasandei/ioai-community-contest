import { ExternalLink, Users } from 'lucide-react';

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative bg-background"
    >
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-6xl font-semibold text-gray-900 dark:text-white mb-6">
          IOAI Community Contest
        </h1>

        <p className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 mb-4 font-normal">
          Unofficial practice contest for IOAI.
        </p>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto font-light">
          Join IOAI alumni and AI enthusiasts in challenging monthly contests.
          Sharpen your skills, learn from the community, and prepare for the next level.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => window.open('https://discord.gg/7GfxrqRreY', '_blank')}
            className="btn-gradient font-medium px-8 py-4 flex items-center gap-3 rounded-md"
          >
            <Users className="w-5 h-5" />
            Join Discord
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollToSection('past-editions')}
            className="bg-background text-primary font-normal px-8 py-4 rounded-md flex items-center gap-3 border border-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            View Past Contests
            <div className="w-4 h-4">→</div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
