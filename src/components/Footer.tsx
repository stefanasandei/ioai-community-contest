import { ExternalLink, Github, Twitter, Mail } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string, sectionId?: string) => {
    if (path === '/' && sectionId) {
      if (location.pathname === '/') {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Rules', path: '/rules' },
    { label: 'Past Editions', path: '/contests', },
    { label: 'Become a Setter', path: '/become-setter' },
    { label: 'Community', path: '/community' },
  ];

  const resources = [
    { label: 'IOAI Official', href: 'https://ioai.org' },
    { label: 'Kaggle', href: 'https://www.kaggle.com' },
    // { label: 'Documentation', href: '#' },
    // { label: 'API Reference', href: '#' },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/AI-Community-Contest',
    },
    {
      icon: ExternalLink,
      label: 'Discord',
      href: 'https://discord.gg/7GfxrqRreY',
    },
    // {
    //   icon: Twitter,
    //   label: 'Twitter',
    //   href: '#',
    // },
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:asandei.stefanel@gmail.com',
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 dark:from-[#0a0a0f] dark:to-[#0f0f15] border-t border-gray-200 dark:border-white/10">
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-aicc-purple via-aicc-orange to-aicc-teal" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/AICCCC.png" alt="AICC Logo" className="h-8" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Building a community of AI enthusiasts through monthly competitions.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-aicc-purple hover:text-white transition-all duration-300 hover:-translate-y-1"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(link.path, link.sectionId)}
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-aicc-purple dark:hover:text-aicc-purple-light transition-colors hover:translate-x-1 transform duration-200"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <nav className="space-y-3">
              {resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-aicc-purple dark:hover:text-aicc-purple-light transition-colors hover:translate-x-1 transform duration-200 flex items-center gap-1"
                >
                  {resource.label}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get notified about new contests and challenges.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:border-aicc-purple transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-aicc-purple to-aicc-orange text-white text-sm font-medium hover:shadow-lg hover:shadow-aicc-purple/25 transition-all duration-300"
              >
                Join
              </button>
            </form>
          </div> */}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              &copy; {new Date().getFullYear()} AI Community Contest. All rights reserved.
            </p>
            {/* <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 dark:text-gray-500 hover:text-aicc-purple transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-500 hover:text-aicc-purple transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-500 hover:text-aicc-purple transition-colors">
                Code of Conduct
              </a>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
