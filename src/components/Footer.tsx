import { ExternalLink, Github, Twitter, Mail, Users } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Mission', id: 'mission' },
    { label: 'Rules', id: 'rules' },
    { label: 'Past Editions', id: 'past-editions' },
    { label: 'Become a Setter', id: 'become-setter' },
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
    <footer id="community" className="bg-aicc-dark text-aicc-white relative overflow-hidden">
      {/* Gradient overlay background */}
      <div className="absolute inset-0 bg-gradient-to-br from-aicc-purple/10 via-transparent to-aicc-orange/10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-aicc-white/80 hover:text-aicc-white transition-colors hover:translate-x-1 transform duration-200 hover:text-aicc-teal"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent">
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
                    className="flex items-center gap-3 text-aicc-white/80 hover:text-aicc-white transition-all duration-300 group hover:text-aicc-teal"
                  >
                    <div className="w-10 h-10 bg-aicc-violet/20 rounded-lg flex items-center justify-center group-hover:bg-aicc-purple/30 transition-colors group-hover:shadow-lg group-hover:shadow-aicc-purple/20">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {social.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent">
              Stay Updated
            </h3>
            <p className="text-aicc-white/80 mb-6">
              Join our Discord for updates.
            </p>
            <button
              onClick={() => window.open('https://discord.gg/7GfxrqRreY', '_blank')}
              className="bg-gradient-to-r from-aicc-purple to-aicc-orange text-aicc-white hover:from-aicc-purple-light hover:to-aicc-red transition-all duration-300 font-semibold px-8 py-4 rounded-lg flex items-center gap-3 group shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Join Discord
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-aicc-violet/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-aicc-purple to-aicc-orange bg-clip-text text-transparent">
                AI Community Contest
              </div>
              <div className="text-aicc-white/60">
                Unofficial practice contest for IOAI
              </div>
            </div>

            <div className="text-aicc-white/60 text-sm">
              © 2024 AI Community Contest.{' '}
              <span className="hover:text-aicc-teal transition-colors cursor-pointer hover:underline">
                Made with ❤️ for the AI community
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
