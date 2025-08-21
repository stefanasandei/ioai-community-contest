import { MessageCircle } from 'lucide-react';
import setterIllustration from '@/assets/setter-illustration.jpg';

const BecomeSetterSection = () => {
  return (
    <section id="become-setter">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6 font-display">
            Submit a Task to the IOAI Community Contest
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your creativity and help shape the next generation of AI challenges! Read the guidelines below and join our Discord to submit your task.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10 items-start mb-12">
          {/* Guidelines */}
          <div className="flex-1 bg-card p-8 rounded-2xl shadow-lg border border-border">
            <h3 className="text-2xl font-semibold mb-4 text-foreground">Task Submission Guidelines</h3>
            <ul className="list-disc pl-6 mb-4 text-muted-foreground space-y-2">
              <li>Anyone can submit tasks via Discord tickets or other channels.</li>
              <li>Tasks must be original, not reused from other competitions, and unseen by IOAI contestants.</li>
              <li>Instructions must be clear with unambiguous evaluation criteria.</li>
              <li>Appropriate for top high school students, balancing theory and practical application.</li>
              <li>Should align with the IOAI 2025 Syllabus (subject to updates).</li>
            </ul>

            <h4 className="font-semibold mt-6 mb-2 text-foreground">Required Submission Materials</h4>
            <ol className="list-decimal pl-6 mb-4 space-y-2">
              <li>
                <span className="font-medium">Task Description</span> (Jupyter Notebook or PDF preferred):
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Problem statement</li>
                  <li>Input/output format</li>
                  <li>Scoring method and formula</li>
                  <li>Allowed models/architectures restrictions</li>
                </ul>
              </li>
              <li>
                <span className="font-medium">Datasets</span>:
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Training set for model development</li>
                  <li>Validation set for testing</li>
                  <li>Test set for final evaluation</li>
                </ul>
              </li>
            </ol>

            <h4 className="font-semibold mt-6 mb-2 text-foreground">Optional but Highly Recommended</h4>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Baseline solution (Python implementation)</li>
              <li>Documentation: author details, resource limits, motivation, educational goals, expected difficulty</li>
            </ul>

            <h4 className="font-semibold mt-6 mb-2 text-foreground">Task Selection Criteria</h4>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Hammer resistance: not easily solved with off-the-shelf methods</li>
              <li>Multiple insights and partial solutions rewarded</li>
              <li>Educational value and originality</li>
              <li>Fast iteration cycles (minimal training time)</li>
            </ul>

            <h4 className="font-semibold mt-6 mb-2 text-foreground">Review Process</h4>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Organizers review and select tasks for quality and diversity</li>
              <li>Selected tasks may be refined in collaboration with authors</li>
              <li>Tasks should be self-contained and focus on problem solving over computational power</li>
              <li>Authors' and participants' best solutions will be released within 1 week after the contest</li>
            </ul>

            <div className="mt-8 flex flex-col items-center">
              <a
                href="https://discord.gg/7GfxrqRreY"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow hover:bg-primary/90 transition mb-2"
              >
                <MessageCircle className="w-5 h-5" />
                Join our Discord to Submit a Task
              </a>
              <span className="text-xs text-muted-foreground">Create a ticket with your task title, materials (Google Drive or GitHub links), and any timing preferences.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeSetterSection;