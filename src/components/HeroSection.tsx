import { ExternalLink, Users } from 'lucide-react';
import heroBackground from '@/assets/hero-background.jpg';

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
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 via-secondary/70 to-secondary/90" />
      
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="hero-title mb-6 animate-fade-in">
          IOAI Community Contest
        </h1>
        
        <p className="text-xl md:text-2xl text-background mb-4 font-medium animate-slide-up">
          Monthly practice competitions for AI enthusiasts
        </p>
        
        <p className="text-lg md:text-xl text-background/90 mb-12 max-w-2xl mx-auto animate-slide-up">
          Join IOAI alumni and AI enthusiasts in challenging monthly contests. 
          Sharpen your skills, learn from the community, and prepare for the next level.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in">
          <button
            onClick={() => window.open('https://discord.gg/ioai', '_blank')}
            className="btn-hero flex items-center gap-3 group"
          >
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Join Discord
            <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => scrollToSection('past-editions')}
            className="btn-outline flex items-center gap-3 group"
          >
            View Past Contests
            <div className="w-4 h-4 group-hover:translate-x-1 transition-transform">→</div>
          </button>
        </div>
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-accent/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-primary/50 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-accent/30 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
      </div>
    </section>
  );
};

export default HeroSection;