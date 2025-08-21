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
      className="hero-background min-h-screen flex items-center justify-center relative"
    >
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="hero-title mb-6 animate-fade-in">
          AI Community Contest
        </h1>

        <p className="text-xl md:text-2xl text-aicc-white mb-4 font-medium animate-slide-up">
          Unofficial practice contest for IOAI; work in progress
        </p>

        <p className="text-lg md:text-xl text-aicc-white/90 mb-12 max-w-2xl mx-auto animate-slide-up">
          Join IOAI alumni and AI enthusiasts in challenging monthly contests.
          Sharpen your skills, learn from the community, and prepare for the next level.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
          <button
            onClick={() => window.open('https://discord.gg/7GfxrqRreY', '_blank')}
            className="bg-gradient-primary text-aicc-white hover:bg-gradient-sparkle transition-all duration-300 font-semibold px-8 py-4 rounded-lg flex items-center gap-3 group shadow-lg hover:shadow-2xl hover:scale-105"
          >
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Join Discord
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => scrollToSection('past-editions')}
            className="bg-aicc-white text-aicc-purple hover:bg-aicc-purple-light hover:text-aicc-white transition-all duration-300 font-semibold px-8 py-4 rounded-lg flex items-center gap-3 group border-2 border-aicc-purple hover:border-aicc-purple-light shadow-lg hover:shadow-2xl hover:scale-105"
          >
            View Past Contests
            <div className="w-4 h-4 group-hover:translate-x-1 transition-transform">→</div>
          </button>
        </div>
      </div>

      {/* Floating particles effect with AICC colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-aicc-purple/40 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-aicc-orange/50 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-aicc-teal/60 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-aicc-pink/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 right-1/2 w-1.5 h-1.5 bg-aicc-violet/50 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>
    </section>
  );
};

export default HeroSection;
