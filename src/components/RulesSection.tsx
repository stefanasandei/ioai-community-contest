import { Clock, Users, Trophy, BookOpen, Code, Zap } from 'lucide-react';

const RulesSection = () => {
  const rules = [
    {
      icon: Users,
      title: "Prepare for IOAI",
      description: "Our contest should simulate in best ways the IOAI",
      color: "text-primary"
    },
    {
      icon: Clock,
      title: "Monthly Schedule",
      description: "To be decided.",
      color: "text-primary"
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
      description: "3 problems, similar to IOAI",
      color: "text-primary"
    },
    {
      icon: Code,
      title: "No ChatGPT or Internet",
      description: "Try your best solving the tasks on your own!",
      color: "text-accent"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live leaderboard updates and instant feedback on submissions, on Kaggle.",
      color: "text-secondary"
    }
  ];

  return (
    <section id="rules">
      <div className="max-w-7xl pt-10 mx-auto px-6">
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

        {/* Detailed Rules Text */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-border shadow-elegant">
            <h3 className="text-2xl font-bold text-foreground mb-6">Detailed Contest Guidelines (WORK IN PROGRESS)</h3>
            <div className="prose prose-gray max-w-none text-muted-foreground space-y-4">
              <h4 className="text-xl font-semibold text-foreground">Rules</h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Use of LLMs for writing code or getting task ideas is <strong>forbidden</strong> (because we can't control what LLM they use; like in the actual IOAI, they allow 4o-mini, which is dumb enough to not solve the whole task).
                </li>
                <li>
                  Use of the internet is <strong>forbidden</strong> except for reading official library documentation and accessing the contest platform.
                </li>
                <li>
                  Communicating with anyone during the contest is <strong>forbidden</strong>.
                </li>
                <li>
                  Only ask questions regarding task statements using the official methods we provide (e.g., our Discord channel for clarifications).
                </li>
              </ul>
              <p>
                <strong>Note:</strong> We can't enforce these rules, but following them ensures fair play and a more accurate simulation of the IOAI. It is in the best interest of all contestants to follow the rules.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;