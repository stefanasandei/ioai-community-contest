import missionIllustration from '@/assets/mission-illustration.jpg';

const MissionSection = () => {
  return (
    <section id="mission" className="bg-muted/30">
      <div className="max-w-7xl py-14 mx-auto px-6">
        <div className="relative">
          {/* Background illustration */}
          <div className="absolute inset-0 opacity-20">
            <img
              src={missionIllustration}
              alt="AI brain illustration"
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl" />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 bg-background/95 backdrop-blur-sm rounded-2xl p-12 md:p-16 border border-border/50">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-1 h-16 bg-primary mx-auto mb-8 rounded-full" />

              <h2 className="text-4xl md:text-5xl font-bold mb-8 font-display bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent">
                Our Mission
              </h2>

              <p className="text-lg md:text-xl text-slate-700 leading-relaxed mb-8">
                The IOAI Community Contest bridges the gap between learning and mastery.
                We create a supportive environment where AI enthusiasts can practice, learn,
                and grow together through carefully crafted monthly challenges.
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-primary rounded-lg animate-pulse" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Practice</h3>
                  <p className="text-sm text-muted-foreground">
                    Regular challenges to keep your skills sharp
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-accent rounded-lg animate-pulse" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Learn</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover new techniques and approaches
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-secondary rounded-lg animate-pulse" style={{ animationDelay: '1s' }} />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Connect</h3>
                  <p className="text-sm text-muted-foreground">
                    Build relationships with fellow AI enthusiasts
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
