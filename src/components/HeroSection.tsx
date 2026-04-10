import { ExternalLink, Trophy, Users } from "lucide-react";
import { contests } from "../data/contests.json";

const filteredContests = contests.sort((a, b) => a.id - b.id).filter((a) =>
  !a.disabled
);

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.10),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.08),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(239,68,68,0.06),transparent_36%)]" />

        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.10]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.18) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage:
              "radial-gradient(circle at center, black 45%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 45%, transparent 100%)",
          }}
        />

        <div className="absolute -top-28 -left-28 h-[28rem] w-[28rem] rounded-full bg-aicc-purple/20 blur-3xl animate-blob-slow" />
        <div className="absolute top-1/3 -right-28 h-[24rem] w-[24rem] rounded-full bg-aicc-orange/18 blur-3xl animate-blob-slower" />
        <div className="absolute bottom-[-10rem] left-1/2 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-aicc-red/10 blur-3xl animate-blob-slow" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 text-center max-w-5xl my-auto mx-auto px-6">
        {/* Badge */}
        {
          /*<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-aicc-purple/10 to-aicc-orange/10 border border-aicc-purple/20 mb-8">
          <Sparkles className="w-4 h-4 text-aicc-purple" />
          <span className="text-sm font-medium bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent">
            Monthly AI Competitions
          </span>
        </div>-->*/
        }

        {/*<h1 className="text-6xl md:text-7xl bg-gradient-to-r from-aicc-purple via-aicc-orange to-aicc-purple bg-clip-text text-transparent font-bold mb-6 animate-gradient bg-[length:200%_auto]">
          AI Community Contest
        </h1>*/}

        <img
          src="/assets/aicc_long_black.png"
          alt="AICC Logo"
          className="opacity-100 max-h-24 inline-flex mb-5"
          
        />

        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 font-medium">
          Contests to prepare for AI Olympiads
        </p>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
          Join IOAI alumni and AI enthusiasts in challenging monthly contests on
          Kaggle. Sharpen your skills, learn from the community, and prepare for
          the international level.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          <div className="text-center">
            <div className="text-3xl font-bold text-aicc-purple bg-clip-text">
              {filteredContests.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Contests Held
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-aicc-orange bg-clip-text">
              {filteredContests.length * 3}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tasks
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-aicc-red bg-clip-text">
              350+
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Discord Members
            </div>
          </div>
        </div>
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() =>
              window.open("https://discord.gg/7GfxrqRreY", "_blank")}
            className="btn-gradient font-medium px-8 py-4 flex items-center gap-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
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
