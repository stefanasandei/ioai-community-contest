import Navigation from '@/components/Navigation';
import BecomeSetterSection from '@/components/BecomeSetterSection';
import Footer from '@/components/Footer';

const BecomeSetter = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        <BecomeSetterSection />
      </main>
      <Footer />
    </div>
  );
};

export default BecomeSetter;