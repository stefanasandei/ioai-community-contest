import Navigation from '@/components/Navigation';
import RulesSection from '@/components/RulesSection';
import Footer from '@/components/Footer';

const Rules = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <RulesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Rules;