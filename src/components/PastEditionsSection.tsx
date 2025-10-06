import { useState } from 'react';
import { Calendar, Trophy, Download, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';

const PastEditionsSection = () => {
  const [selectedContest, setSelectedContest] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pastContests = [
    // {
    //   id: 1,
    //   month: "December",
    //   year: "2024",
    //   title: "Neural Networks Fundamentals",
    //   difficulty: "Intermediate",
    //   participants: 156,
    //   winner: "Alice Chen",
    //   problems: 4,
    //   image: "",
    //   description: "Focus on understanding neural network architectures and optimization techniques."
    // },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success bg-success/10';
      case 'Intermediate': return 'text-accent bg-accent/10';
      case 'Advanced': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <section id="past-editions" className="section-padding bg-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-semibold text-gradient mb-6 font-display">
            Past Contest Editions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-light">
            Explore previous challenges and see how our community has grown
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <p className="text-gray-800 dark:text-gray-200">No contests yet! </p>
        </div>

        {/* Contest Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {pastContests.map((contest) => (
            <div key={contest.id} className="feature-card group hover:border-primary/50 cursor-pointer"
              onClick={() => setSelectedContest(contest)}>
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 ${contest.image} rounded-xl flex items-center justify-center`}>
                    <Calendar className="w-8 h-8 text-background" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {contest.month} {contest.year}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(contest.difficulty)}`}>
                      {contest.difficulty}
                    </span>
                  </div>
                  <p className="text-lg text-gray-800 dark:text-gray-200 mb-2">{contest.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{contest.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-primary" />
                    {contest.winner}
                  </span>
                  <span>{contest.participants} participants</span>
                  <span>{contest.problems} problems</span>
                </div>
                <div className="flex gap-2">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-primary hover:text-primary-glow flex items-center gap-1 text-xs">
                    <Eye className="w-3 h-3" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedContest && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-gradient mb-2">
                  {selectedContest.month} {selectedContest.year}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">{selectedContest.title}</p>
              </div>
              <button onClick={() => setSelectedContest(null)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 text-gray-800 dark:text-gray-200">
              <p>{selectedContest.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="font-semibold">Difficulty</div><div>{selectedContest.difficulty}</div>
                <div className="font-semibold">Participants</div><div>{selectedContest.participants}</div>
                <div className="font-semibold">Winner</div><div>{selectedContest.winner}</div>
                <div className="font-semibold">Problems</div><div>{selectedContest.problems}</div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border">
                <button className="btn-secondary w-full flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Problems
                </button>
                <button className="btn-secondary w-full flex items-center justify-center gap-2">
                  <Trophy className="w-4 h-4" />
                  View Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PastEditionsSection;