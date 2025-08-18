import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
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
      navigate(path);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', path: '/', sectionId: 'hero' },
    { label: 'Rules', path: '/rules' },
    { label: 'Past Editions', path: '/', sectionId: 'past-editions' },
    { label: 'Become a Setter', path: '/become-setter' },
    { label: 'Community', path: '/community' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-md' 
          : 'bg-background/20 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => handleNavigation('/', 'hero')}
              className="text-xl font-bold text-gradient hover:opacity-80 transition-opacity"
            >
              IOAI Contest
            </button>
            
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

            <button
              onClick={() => handleNavigation('/community')}
              className="btn-hero text-sm px-6 py-2"
            >
              Join Discord
            </button>
          </div>
        </div>
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