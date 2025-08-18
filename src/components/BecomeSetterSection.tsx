import { Lightbulb, FileText, Rocket, Quote } from 'lucide-react';
import setterIllustration from '@/assets/setter-illustration.jpg';

const BecomeSetterSection = () => {
  const steps = [
    {
      number: 1,
      title: "Submit Your Idea",
      description: "Share your problem concept with detailed specifications and expected difficulty level.",
      cta: "Start Proposal",
      icon: Lightbulb,
      color: "bg-primary"
    },
    {
      number: 2,
      title: "Collaborate & Refine",
      description: "Work with our review committee to polish your problem and ensure quality standards.",
      cta: "Read Guidelines",
      icon: FileText,
      color: "bg-accent"
    },
    {
      number: 3,
      title: "Launch & Engage",
      description: "See your problem come to life as participants tackle your challenge during the contest.",
      cta: "View Examples",
      icon: Rocket,
      color: "bg-secondary"
    }
  ];

  const testimonials = [
    {
      quote: "Contributing problems to the IOAI contest was incredibly rewarding. Seeing participants engage with my challenge was amazing!",
      author: "Dr. Emily Watson",
      role: "AI Research Scientist",
      company: "TechCorp"
    },
    {
      quote: "The review process helped me create a much better problem than I initially imagined. The feedback was invaluable.",
      author: "Alex Kumar",
      role: "PhD Student",
      company: "MIT AI Lab"
    },
    {
      quote: "Being a problem setter connected me with incredible minds in the AI community. Highly recommend the experience!",
      author: "Maria Santos",
      role: "ML Engineer",
      company: "DeepTech Industries"
    }
  ];

  return (
    <section id="become-setter" className="section-padding">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6 font-display">
            Become a Problem Setter
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Share your expertise and contribute to the growth of our AI community
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left side - Illustration */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={setterIllustration}
                alt="Person creating problems"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              
              {/* Floating elements */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-primary/20 rounded-xl backdrop-blur-sm flex items-center justify-center animate-float">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <div className="absolute bottom-6 left-6 w-16 h-16 bg-accent/20 rounded-2xl backdrop-blur-sm flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                <FileText className="w-8 h-8 text-accent" />
              </div>
            </div>
          </div>

          {/* Right side - Steps */}
          <div className="relative">
            {/* Timeline line */}
            <div className="timeline-line" />
            
            <div className="space-y-12">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="relative flex gap-6">
                    <div className="flex-shrink-0">
                      <div className={`timeline-number ${step.color} text-white`}>
                        {step.number}
                      </div>
                    </div>
                    
                    <div className="flex-1 pb-8">
                      <div className="feature-card">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                              {step.title}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {step.description}
                            </p>
                            <button className="btn-outline text-sm px-6 py-2">
                              {step.cta}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <h3 className="text-2xl font-bold text-center text-gradient mb-12">
            What Our Problem Setters Say
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-border/50">
                <Quote className="w-8 h-8 text-primary/40 mb-4" />
                <p className="text-muted-foreground mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BecomeSetterSection;