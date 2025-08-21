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
        ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-md'
        : 'bg-background/90 backdrop-blur-sm'
        }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => { handleNavigation('/', 'hero'); setMobileMenuOpen(false); }}
              className="text-xl font-bold text-gradient hover:opacity-80 transition-opacity"
            >
              IOAI Contest
            </button>

            {/* Desktop nav */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.path, item.sectionId)}
                  className="nav-link"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => handleNavigation('https://discord.gg/7GfxrqRreY')}
              className="btn-hero text-sm px-6 py-2 hidden md:inline-block"
            >
              Join Discord
            </button>
          </div>
        </div>
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border shadow-md px-6 pb-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => { handleNavigation(item.path, item.sectionId); setMobileMenuOpen(false); }}
                  className="nav-link text-left w-full"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { handleNavigation('https://discord.gg/7GfxrqRreY'); setMobileMenuOpen(false); }}
                className="btn-hero text-sm px-6 py-2 w-full"
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
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-110 animate-pulse"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 mx-auto" />
        </button>
      )}
    </>
  );
};

export default Navigation;