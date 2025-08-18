import { useState } from 'react';
import { Calendar, Trophy, Download, Eye, ChevronLeft, ChevronRight, X } from 'lucide-react';

const PastEditionsSection = () => {
  const [selectedContest, setSelectedContest] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pastContests = [
    {
      id: 1,
      month: "December",
      year: "2024",
      title: "Neural Networks Fundamentals",
      difficulty: "Intermediate",
      participants: 156,
      winner: "Alice Chen",
      problems: 4,
      image: "bg-gradient-to-br from-primary/20 to-accent/20",
      description: "Focus on understanding neural network architectures and optimization techniques."
    },
    {
      id: 2,
      month: "November",
      year: "2024",
      title: "Computer Vision Challenge",
      difficulty: "Advanced",
      participants: 134,
      winner: "David Rodriguez",
      problems: 5,
      image: "bg-gradient-to-br from-accent/20 to-secondary/20",
      description: "Image classification and object detection problems using modern CV techniques."
    },
    {
      id: 3,
      month: "October",
      year: "2024",
      title: "NLP & Text Processing",
      difficulty: "Beginner",
      participants: 189,
      winner: "Sarah Kim",
      problems: 3,
      image: "bg-gradient-to-br from-secondary/20 to-primary/20",
      description: "Natural language processing fundamentals and text analysis challenges."
    },
    {
      id: 4,
      month: "September",
      year: "2024",
      title: "Reinforcement Learning",
      difficulty: "Advanced",
      participants: 112,
      winner: "Michael Zhang",
      problems: 4,
      image: "bg-gradient-to-br from-primary/30 to-accent/30",
      description: "Game theory and RL algorithms applied to strategic decision making."
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % pastContests.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + pastContests.length) % pastContests.length);
  };

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
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6 font-display">
            Past Contest Editions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore previous challenges and see how our community has grown
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <select className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary">
            <option>All Years</option>
            <option>2024</option>
            <option>2023</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary">
            <option>All Difficulties</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {pastContests.map((contest) => (
                <div key={contest.id} className="w-full flex-shrink-0">
                  <div className={`${contest.image} relative h-80 rounded-2xl p-8 flex flex-col justify-end cursor-pointer group overflow-hidden`}
                       onClick={() => setSelectedContest(contest)}>
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-secondary/40 to-transparent" />
                    
                    <div className="relative z-10 text-background">
                      <div className="flex items-center gap-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(contest.difficulty)}`}>
                          {contest.difficulty}
                        </span>
                        <span className="text-sm opacity-80">
                          {contest.participants} participants
                        </span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 group-hover:text-primary-glow transition-colors">
                        {contest.month} {contest.year}
                      </h3>
                      
                      <p className="text-xl mb-4 opacity-90">
                        {contest.title}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4" />
                          <span className="text-sm">Winner: {contest.winner}</span>
                        </div>
                        
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-glow flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
          >
            <ChevronLeft className="w-6 h-6 text-foreground" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-foreground" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {pastContests.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedContest && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-border">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gradient mb-2">
                  {selectedContest.month} {selectedContest.year}
                </h3>
                <p className="text-xl text-muted-foreground">
                  {selectedContest.title}
                </p>
              </div>
              <button 
                onClick={() => setSelectedContest(null)}
                className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-muted-foreground mb-6">
              {selectedContest.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Difficulty</div>
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(selectedContest.difficulty)}`}>
                  {selectedContest.difficulty}
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Participants</div>
                <div className="font-semibold">{selectedContest.participants}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Problems</div>
                <div className="font-semibold">{selectedContest.problems}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Winner</div>
                <div className="font-semibold flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-primary" />
                  {selectedContest.winner}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="btn-hero flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Problems
              </button>
              <button className="btn-outline flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                View Solutions
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PastEditionsSection;