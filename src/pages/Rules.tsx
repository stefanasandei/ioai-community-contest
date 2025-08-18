import Navigation from '@/components/Navigation';
import RulesSection from '@/components/RulesSection';
import Footer from '@/components/Footer';

const Rules = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-6 font-display">
                Contest Rules & Guidelines
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Complete rules and guidelines for participating in IOAI Community Contests
              </p>
            </div>
          </div>
        </div>
        <RulesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Rules;