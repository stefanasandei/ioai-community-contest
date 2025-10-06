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
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-x-0 top-0 h-24 navbar-glow-effect" />
        <nav className={`relative transition-all duration-300 ${isScrolled
          ? 'bg-background border-b border-border shadow-soft'
          : 'bg-background'
          }`}>
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <button
                onClick={() => { handleNavigation('/', 'hero'); setMobileMenuOpen(false); }}
                className="text-xl font-bold text-primary transition-colors"
              >
                <img src="/assets/AICCCC.png" alt="AICC Logo" className="h-10" />
              </button>

              {/* Desktop nav */}
              <div className="hidden md:flex space-x-8">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.path, item.sectionId)}
                    className="relative text-foreground font-normal"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden p-2 rounded-lg focus:outline-none"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
              </button>

              <button
                onClick={() => handleNavigation('https://discord.gg/7GfxrqRreY')}
                className="hidden md:inline-block btn-gradient font-medium text-sm px-6 py-2 rounded-md"
              >
                Join the Discord
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-background ${mobileMenuOpen ? 'block' : 'hidden'}`}
      >
        <div className="flex flex-col h-full justify-center items-center space-y-8 p-8">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => { handleNavigation(item.path, item.sectionId); setMobileMenuOpen(false); }}
              className="text-2xl text-foreground font-normal"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { handleNavigation('https://discord.gg/7GfxrqRreY'); setMobileMenuOpen(false); }}
            className="mt-8 btn-gradient font-medium px-8 py-3 rounded-md"
          >
            Join the Discord
          </button>
        </div>
      </div>

      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-30 p-3 rounded-full bg-primary text-primary-foreground ${showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </>
  );
};

export default Navigation;
