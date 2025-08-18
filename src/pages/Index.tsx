import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import MissionSection from '@/components/MissionSection';
import RulesSection from '@/components/RulesSection';
import PastEditionsSection from '@/components/PastEditionsSection';
import BecomeSetterSection from '@/components/BecomeSetterSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <MissionSection />
        <RulesSection />
        <PastEditionsSection />
        <BecomeSetterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
