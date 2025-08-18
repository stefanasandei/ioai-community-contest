import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Trophy, Calendar, User, Code, Download } from 'lucide-react';

const Community = () => {
  const bestSolutions = [
    {
      contest: "December 2024",
      problem: "Neural Networks Fundamentals",
      student: "Alice Chen",
      score: 100,
      downloadUrl: "#"
    },
    {
      contest: "December 2024",
      problem: "CNN Architecture Design",
      student: "David Rodriguez",
      score: 95,
      downloadUrl: "#"
    },
    {
      contest: "November 2024",
      problem: "Computer Vision Challenge",
      student: "Sarah Kim",
      score: 98,
      downloadUrl: "#"
    },
    {
      contest: "November 2024",
      problem: "Object Detection Pipeline",
      student: "Michael Zhang",
      score: 92,
      downloadUrl: "#"
    },
    {
      contest: "October 2024",
      problem: "NLP Text Classification",
      student: "Emily Johnson",
      score: 96,
      downloadUrl: "#"
    },
    {
      contest: "October 2024",
      problem: "Sentiment Analysis",
      student: "James Wilson",
      score: 89,
      downloadUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-0">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6 font-display">
                Community Solutions
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Explore the best solutions from our talented community members across past contests
              </p>
            </div>

            {/* Best Solutions Table */}
            <div className="bg-card rounded-2xl p-8 border border-border shadow-elegant">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-primary" />
                Best Solutions Archive
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-2 text-muted-foreground font-medium">Contest</th>
                      <th className="text-left py-4 px-2 text-muted-foreground font-medium">Problem</th>
                      <th className="text-left py-4 px-2 text-muted-foreground font-medium">Student</th>
                      <th className="text-left py-4 px-2 text-muted-foreground font-medium">Score</th>
                      <th className="text-left py-4 px-2 text-muted-foreground font-medium">Solution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bestSolutions.map((solution, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-2 text-sm text-muted-foreground">{solution.contest}</td>
                        <td className="py-4 px-2 font-medium text-foreground">{solution.problem}</td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-foreground">{solution.student}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${solution.score >= 95 ? 'bg-success/10 text-success' :
                            solution.score >= 90 ? 'bg-accent/10 text-accent' :
                              'bg-secondary/10 text-secondary'
                            }`}>
                            {solution.score}%
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <button className="inline-flex items-center gap-2 text-primary hover:text-primary-glow transition-colors text-sm">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Discord Community CTA */}
            <div className="text-center mt-16">
              <div className="feature-card max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-foreground mb-4">Join Our Discord Community</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with fellow AI enthusiasts, discuss solutions, and stay updated on upcoming contests.
                </p>
                <button className="btn-hero">
                  Join Discord Server
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Community;