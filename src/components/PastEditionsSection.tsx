import { useState } from 'react';
import { Calendar, Trophy, Download, X } from 'lucide-react';
import { BestSolutions } from '@/pages/Community';

const PastEditionsSection = () => {
  const [selectedContest, setSelectedContest] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pastContests = [
    {
      id: 1,
      month: "October",
      year: "2025",
      title: "Round 0",
      // difficulty: "Intermediate",
      // participants: 156,
      winner: "Nikoloz Gegenava",
      problems: 3,
      tasks: [
        {
          name: 'Deceptive Points',
          type: 'ML',
          kaggle: 'https://www.kaggle.com/competitions/deceptive-points-aicc-round-0',
          solution: 'https://github.com/stefanasandei/roai-solved/blob/main/international-contests/aicc/round-0/deceptive_points.ipynb'
        },
        {
          name: 'Find Brain Tumors',
          type: 'CV',
          kaggle: 'https://www.kaggle.com/competitions/aicc-round-0-brain-tumor',
          solution: 'https://github.com/stefanasandei/roai-solved/blob/main/international-contests/aicc/round-0/brain_tumors_byol.ipynb'
        },
        {
          name: 'Latent Model Classification',
          type: 'ML',
          kaggle: 'https://www.kaggle.com/competitions/latent-model-classification-aicc-round-0/',
          solution: 'https://github.com/stefanasandei/roai-solved/blob/main/international-contests/aicc/round-0/latent-model-classification.ipynb'
        },
      ]
    },
  ];

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

        {/* Contest Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-card rounded-lg border border-border">
            <thead>
              <tr className="text-left text-sm text-gray-600 dark:text-gray-400">
                <th className="px-6 py-3">Contest</th>
                <th className="px-6 py-3">Task Name</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Kaggle</th>
                <th className="px-6 py-3">Solution</th>
              </tr>
            </thead>
            <tbody>
              {pastContests.flatMap((contest) =>
                contest.tasks.map((task, idx) => (
                  <tr key={`${contest.id}-${idx}`} className="border-t text-gray-600 dark:text-gray-400 border-border hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold">{contest.month} {contest.year}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{contest.title}</div>
                    </td>
                    <td className="px-6 py-4 align-top text-gray-600 dark:text-gray-400">{task.name}</td>
                    <td className="px-6 py-4 align-top text-gray-600 dark:text-gray-400">{task.type}</td>
                    <td className="px-6 py-4 align-top">
                      {task.kaggle ? (
                        <a href={task.kaggle} target="_blank" rel="noreferrer" className="text-primary hover:underline">Kaggle</a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      {task.solution ? (
                        <a href={task.solution} target="_blank" rel="noreferrer" className="text-primary hover:underline">Solution</a>
                      ) : (
                        <button
                          onClick={() => {/* placeholder to fill later */ }}
                          className="text-sm text-muted-foreground hover:text-primary"
                        >
                          Add
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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