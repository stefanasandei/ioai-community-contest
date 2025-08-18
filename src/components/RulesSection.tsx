import { Clock, Users, Trophy, BookOpen, Code, Zap } from 'lucide-react';

const RulesSection = () => {
  const rules = [
    {
      icon: Clock,
      title: "Monthly Schedule",
      description: "Contests run on the first Saturday of each month, lasting 4 hours.",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Open to All",
      description: "IOAI alumni, students, and AI enthusiasts of all skill levels welcome.",
      color: "text-accent"
    },
    {
      icon: Trophy,
      title: "Fair Competition",
      description: "Individual participation only. No collaboration during contest hours.",
      color: "text-secondary"
    },
    {
      icon: BookOpen,
      title: "Problem Format",
      description: "3-5 problems ranging from beginner to advanced difficulty levels.",
      color: "text-primary"
    },
    {
      icon: Code,
      title: "Submission Format",
      description: "Solutions submitted as code with detailed explanations and documentation.",
      color: "text-accent"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live leaderboard updates and instant feedback on submissions.",
      color: "text-secondary"
    }
  ];

  return (
    <section id="rules" className="section-padding">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6 font-display">
            Contest Rules
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Simple, fair guidelines to ensure everyone has the best experience possible
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rules.map((rule, index) => {
            const IconComponent = rule.icon;
            return (
              <div 
                key={index} 
                className="feature-card group hover:border-primary/50 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <IconComponent className={`w-6 h-6 ${rule.color}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {rule.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {rule.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => window.open('/rules-detailed', '_blank')}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-glow font-medium transition-colors group"
          >
            Read Full Rules Documentation
            <div className="w-0 h-0.5 bg-primary group-hover:w-4 transition-all duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;