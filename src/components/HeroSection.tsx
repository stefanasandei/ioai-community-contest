import { ExternalLink, Users, Trophy, Target, Sparkles } from 'lucide-react';
import { contests } from "../data/contests.json"

const filteredContests = contests.sort((a, b) => a.id - b.id).filter((a) => !a.disabled)

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-aicc-purple/5 via-background to-aicc-orange/5 animate-gradient-shift" />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-aicc-purple/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-aicc-orange/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-aicc-purple/10 to-aicc-orange/10 border border-aicc-purple/20 mb-8">
          <Sparkles className="w-4 h-4 text-aicc-purple" />
          <span className="text-sm font-medium bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent">
            Monthly AI Competitions
          </span>
        </div>

        <h1 className="text-6xl md:text-7xl bg-gradient-to-r from-aicc-purple via-aicc-orange to-aicc-purple bg-clip-text text-transparent font-bold mb-6 animate-gradient bg-[length:200%_auto]">
          AI Community Contest
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-4 font-medium">
          Codeforces rounds, but for IOAI
          <span className="text-gray-500 dark:text-gray-500 text-base ml-2">(community-organized, not affiliated with official IOAI)</span>
        </p>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join IOAI alumni and AI enthusiasts in challenging monthly contests on Kaggle.
          Sharpen your skills, learn from the community, and prepare for the international level.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-12">

          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent">
              {filteredContests.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Contests Held
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent">
              {filteredContests.length * 3}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tasks
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent">
              250+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Discord Members
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.open('https://discord.gg/7GfxrqRreY', '_blank')}
            className="btn-gradient font-medium px-8 py-4 flex items-center gap-3 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <Users className="w-5 h-5" />
            Join Discord to Participate
            <ExternalLink className="w-4 h-4" />
          </button>

          <a href="/contests">
            <button className="bg-background text-primary font-medium px-8 py-4 rounded-lg flex items-center gap-3 border-2 border-primary/20 hover:border-primary hover:bg-primary/5 transition-all">
              View Past Contests
              <Trophy className="w-4 h-4" />
            </button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;