import { useState, useEffect } from 'react';
import {
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Target,
  Lightbulb,
  Users,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const BecomeSetterSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('become-setter');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const guidelines = [
    { icon: Users, color: 'from-purple-500 to-violet-500', text: 'Anyone can submit tasks via Discord tickets or other channels' },
    { icon: Sparkles, color: 'from-orange-500 to-amber-500', text: 'Tasks must be original, not reused from other competitions' },
    { icon: CheckCircle2, color: 'from-teal-500 to-cyan-500', text: 'Instructions must be clear with unambiguous evaluation criteria' },
    { icon: Target, color: 'from-pink-500 to-rose-500', text: 'Appropriate for top high school students' },
    { icon: Lightbulb, color: 'from-indigo-500 to-violet-500', text: 'Should align with the IOAI Syllabus' },
  ];

  const materials = [
    { title: 'Task Description', format: 'Markdown or PDF', items: ['Problem statement', 'Task type (CV, NLP, etc.)', 'Input/output format', 'Scoring method and formula', 'Any restrictions for contestants'] },
    { title: 'Datasets', format: 'CSV, JSON, or other formats', items: ['Training dataset', 'Test sets (public and private)', 'Ground truth for final evaluation', 'Grading script (if custom metric)'] },
  ];

  const optional = [
    'Baseline Notebook',
    'Solution Notebook - the problem review team can otherwise work it out',
  ];

  const criteria = [
    { icon: Target, color: 'from-purple-500 to-violet-500', text: 'not easily solved with off-the-shelf methods' },
    { icon: CheckCircle2, color: 'from-orange-500 to-amber-500', text: 'multiple insights and partial solutions rewarded' },
    { icon: Lightbulb, color: 'from-teal-500 to-cyan-500', text: 'educational value and originality' },
    { icon: Target, color: 'from-pink-500 to-rose-500', text: 'fast iteration cycles (minimal training time)' },
  ];

  const process = [
    'Organizers review and select tasks for quality and diversity',
    'Selected tasks may be refined in collaboration with authors',
    'Tasks should be self-contained and focus on problem solving over computational power',
    "If your task is accepted, it will be released in a contest when we find fit.",
  ];

  return (
    <section id="become-setter" className="relative py-24 bg-white dark:bg-[#0a0a0f] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full max-w-7xl mx-auto">
          <div className="absolute top-40 left-0 w-72 h-72 bg-aicc-purple/10 rounded-full blur-3xl" />
          <div className="absolute bottom-40 right-0 w-96 h-96 bg-aicc-orange/10 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Submit a Task to the</span>{' '}
            <span className="text-gradient">AI Community Contest</span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Read the guidelines below and join our Discord to submit your task.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column - Content */}
          <div className="lg:col-span-8">
            <Accordion type="single" collapsible defaultValue="guidelines" className="space-y-4">
              {/* Guidelines Section */}
              <AccordionItem value="guidelines" className="rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6">
                <AccordionTrigger className="hover:no-underline py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 text-white font-semibold text-sm">
                      1
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Task Submission Guidelines</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="pl-14 space-y-4">
                    {guidelines.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex-shrink-0`}>
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 font-light">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Submission Materials */}
              <AccordionItem value="materials" className="rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6">
                <AccordionTrigger className="hover:no-underline py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-semibold text-sm">
                      2
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Required Submission Materials</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="pl-14 space-y-6">
                    {materials.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{item.title}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400">
                            {item.format}
                          </span>
                        </div>
                        <ul className="space-y-1 ml-4">
                          {item.items.map((subItem, subIndex) => (
                            <li key={subIndex} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-light">
                              <span className="w-1.5 h-1.5 rounded-full bg-aicc-purple flex-shrink-0" />
                              {subItem}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="pt-2">
                      <span className="font-semibold text-gray-900 dark:text-white mb-2 block">Optional but Highly Recommended</span>
                      <ul className="space-y-1 ml-4">
                        {optional.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 font-light">
                            <span className="w-1.5 h-1.5 rounded-full bg-aicc-orange flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Selection Criteria */}
              <AccordionItem value="criteria" className="rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6">
                <AccordionTrigger className="hover:no-underline py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 text-white font-semibold text-sm">
                      3
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Task Selection Criteria</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="pl-14 space-y-4">
                    {criteria.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex-shrink-0`}>
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-gray-600 dark:text-gray-300 font-light">{item.text}</span>
                      </div>
                    ))}

                    <p className='text-gray-600'>We recommend studying IOAI 2025 and NEOAI 2025 tasks, to understand their type and style - this is what we are looking for.</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Review Process */}
              <AccordionItem value="process" className="rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6">
                <AccordionTrigger className="hover:no-underline py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 text-white font-semibold text-sm">
                      4
                    </div>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Review Process</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5">
                  <div className="pl-14 space-y-3">
                    {process.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-400 font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-aicc-orange flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Right Column - Sticky CTA */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              {/* CTA Card */}
              <div className="rounded-2xl bg-gradient-to-br from-aicc-purple/10 to-aicc-orange/10 border border-aicc-purple/20 p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-aicc-purple to-aicc-orange">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ready to Submit?</h3>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-light">
                  Join our Discord server and create a thread (on #task-suggestions) with your task details.
                </p>

                <a
                  href="https://discord.gg/7GfxrqRreY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gradient w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-medium rounded-lg mb-4"
                >
                  <MessageCircle className="w-5 h-5" />
                  Join Discord
                  <ExternalLink className="w-4 h-4" />
                </a>

                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 font-light flex-1">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-aicc-purple flex-shrink-0" />
                    <span>Create a thread with your task</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-aicc-purple flex-shrink-0" />
                    <span>Share materials via Google Drive or Discord</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-aicc-purple flex-shrink-0" />
                    <span>Be open to review</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeSetterSection;
