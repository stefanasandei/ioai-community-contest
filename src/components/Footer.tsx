import { ExternalLink, Github } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

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

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Rules', path: '/rules' },
    { label: 'Past Editions', path: '/', sectionId: 'past-editions' },
    { label: 'Become a Setter', path: '/become-setter' },
    { label: 'Community', path: '/community' },
  ];

  const socialLinks = [
    {
      icon: ExternalLink,
      label: 'Discord',
      href: 'https://discord.gg/7GfxrqRreY',
      color: 'hover:text-primary'
    },
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/stefanasandei/ioai-community-contest',
      color: 'hover:text-secondary'
    }
  ];

  return (
    <footer id="community" className="bg-background text-foreground border-t border-border">

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(link.path, link.sectionId)}
                  className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:translate-x-1 transform duration-200 font-light"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              Connect With Us
            </h3>
            <div className="space-y-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 text-gray-600 dark:text-gray-400 transition-colors ${social.color} font-light`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{social.label}</span>
                  </a>
                );
              })}
            </div>
          </div>


        </div>

        {/* Copyright */}
        <div className="border-t border-border/50 pt-8 text-center text-gray-500 dark:text-gray-500">
          <p className="font-light">&copy; {new Date().getFullYear()} IOAI Community Contest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
