import { useState, useEffect } from 'react';
import { ArrowUp, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowBackToTop(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string, sectionId?: string) => {
    if (path === '/' && sectionId) {
      // If we're already on home and have a section, scroll to it
      if (location.pathname === '/') {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Navigate to home then scroll to section
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      window.location.href = path;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Rules', path: '/rules' },
    { label: 'Past Editions', path: '/', sectionId: 'past-editions' },
    { label: 'Become a Setter', path: '/become-setter' },
    { label: 'Community', path: '/community' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-aicc-dark/95 backdrop-blur-md border-b border-aicc-violet/30 shadow-lg shadow-aicc-purple/20'
        : 'bg-aicc-dark/90 backdrop-blur-sm'
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => { handleNavigation('/', 'hero'); setMobileMenuOpen(false); }}
              className="text-xl font-bold bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent hover:from-aicc-purple-light hover:to-aicc-red transition-all duration-300"
            >
              AICC
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path, item.sectionId)}
                  className="relative text-aicc-white/80 hover:text-aicc-white transition-colors duration-300 font-medium"
                >
                  {item.label}
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-aicc-purple to-aicc-orange transition-all duration-300 group-hover:w-full transform -translate-x-1/2" />
                </button>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg bg-aicc-violet/20 hover:bg-aicc-violet/30 focus:outline-none focus:ring-2 focus:ring-aicc-purple transition-colors"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-aicc-white" /> : <Menu className="w-6 h-6 text-aicc-white" />}
            </button>

            <button
              onClick={() => handleNavigation('https://discord.gg/7GfxrqRreY')}
              className="bg-gradient-to-r from-aicc-purple to-aicc-orange text-aicc-white hover:from-aicc-purple-light hover:to-aicc-red transition-all duration-300 font-semibold text-sm px-6 py-2 hidden md:inline-block rounded-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              Join Discord
            </button>
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-aicc-dark/95 backdrop-blur-md border-b border-aicc-violet/30 shadow-lg px-6 pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => { handleNavigation(item.path, item.sectionId); setMobileMenuOpen(false); }}
                  className="text-aicc-white/80 hover:text-aicc-white transition-colors duration-300 font-medium text-left w-full py-2"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { handleNavigation('https://discord.gg/7GfxrqRreY'); setMobileMenuOpen(false); }}
                className="bg-gradient-to-r from-aicc-purple to-aicc-orange text-aicc-white hover:from-aicc-purple-light hover:to-aicc-red transition-all duration-300 font-semibold text-sm px-6 py-2 w-full rounded-lg shadow-lg hover:shadow-xl hover:scale-105 mt-2"
              >
                Join Discord
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-gradient-to-r from-aicc-purple to-aicc-orange text-aicc-white rounded-full shadow-lg hover:shadow-xl hover:shadow-aicc-purple/30 transition-all duration-300 hover:scale-110 animate-pulse hover:from-aicc-purple-light hover:to-aicc-red"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 mx-auto" />
        </button>
      )}
    </>
  );
};

export default Navigation;
