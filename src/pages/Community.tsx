import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Trophy, User, Code, Download } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { bestSolutions } from '@/lib/best-solutions';

const Community = () => {
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
                Explore the best solutions from <span className="font-bold">our community members</span> across past contests. Our <span className="font-bold">official solutions</span> are published <a href="https://github.com/stefanasandei/roai-solved/tree/main/international-contests/aicc" className='underline hover:cursor-pointer' target='_blank'>here</a>.
              </p>
            </div>

            {/* Best Solutions Table */}
            <BestSolutions />

            {/* Discord Community CTA */}
            <div className="text-center mt-16">
              <div className="feature-card max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-foreground mb-4">Join Our Discord Community</h3>
                <p className="text-muted-foreground mb-6">
                  Connect with fellow AI enthusiasts, discuss solutions, and stay updated on upcoming contests.
                </p>
                <a href=" https://discord.gg/7GfxrqRreY" target='_blank' className="btn-gradient inline-block px-8 py-3 rounded-md">
                  Join Discord Server
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const BestSolutions = () => {
  return <div className="bg-card rounded-2xl p-8 border border-border shadow-elegant">
    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
      <Trophy className="hidden lg:inline w-6 h-6 text-primary" />
      Best Solutions Archive
    </h2>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-4 px-2 text-muted-foreground font-medium">Contest</th>
            <th className="text-left py-4 px-2 text-muted-foreground font-medium">Task</th>
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
                <span className={`px-3 py-2 rounded-full text-sm font-bold bg-success/10 text-success`}>
                  {solution.score}
                </span>
              </td>
              <td className="py-4 px-2">
                {/* Dialog trigger opens a modal with the write-up and download action */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="inline-flex items-center gap-2 text-primary hover:text-primary-glow transition-colors text-sm">
                      <Code className="w-4 h-4" />
                      View Write-up
                    </button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-primary" />
                        {solution.problem} — Write-up
                      </DialogTitle>
                      <DialogDescription>
                        <div className="text-sm text-muted-foreground mt-1">
                          <strong className="text-foreground">Author:</strong> {solution.student} • <strong className="text-foreground">Contest:</strong> {solution.contest}
                        </div>
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 px-3 max-h-[60vh] overflow-auto">
                      <pre className="prose prose-lg px-2 prose-neutral text-foreground whitespace-pre-wrap break-words text-justify bg-transparent border-none shadow-none p-0 m-0">
                        {solution.writeup}
                      </pre>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-2 py-1 rounded bg-muted/30 text-xs">Score: {solution.score}</span>
                        <span className="px-2 py-1 rounded bg-muted/30 text-xs">File: {solution.fileName}</span>
                      </div>
                    </div>

                    <DialogFooter>
                      <div className="flex w-full items-center justify-between gap-4">
                        <div className="flex gap-2">
                          <Button asChild>
                            <a href={solution.downloadUrl} download={solution.fileName} className="inline-flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Download
                            </a>
                          </Button>
                        </div>

                        <div className="ml-auto">
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                        </div>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
}

export default Community;