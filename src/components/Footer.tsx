import { ExternalLink, Github, Twitter, Mail } from 'lucide-react';
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
      href: 'https://discord.gg/ioai',
      color: 'hover:text-primary'
    },
    {
      icon: Twitter,
      label: 'Twitter',
      href: 'https://twitter.com/ioai_community',
      color: 'hover:text-accent'
    },
    {
      icon: Github,
      label: 'GitHub',
      href: 'https://github.com/ioai-community',
      color: 'hover:text-secondary'
    },
    {
      icon: Mail,
      label: 'Email',
      href: 'mailto:contest@ioai.community',
      color: 'hover:text-primary'
    },
  ];

  return (
    <footer id="community" className="bg-secondary/95 text-secondary-foreground relative overflow-hidden">
      {/* Binary code pattern background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="text-xs font-mono leading-none transform rotate-12 scale-150">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="whitespace-nowrap">
              {'01010101 11001010 00110011 10101010 '.repeat(20)}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-background">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-secondary-foreground/80 hover:text-background transition-colors hover:translate-x-1 transform duration-200"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-background">
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
                    className={`flex items-center gap-3 text-secondary-foreground/80 transition-all duration-300 group`}
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:shadow-glow">
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
            <h3 className="text-xl font-bold mb-6 text-background">
              Stay Updated
            </h3>
            <p className="text-secondary-foreground/80 mb-6">
              Get notified about upcoming contests and community updates.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-background/10 border border-primary/20 text-background placeholder-secondary-foreground/60 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                required
              />
              <button
                type="submit"
                disabled={isSubscribed}
                className="w-full btn-hero disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold">
                IOAI Community Contest
              </div>
              <div className="text-secondary-foreground/60">
                Unofficial practice contest for IOAI
              </div>
            </div>

            <div className="text-secondary-foreground/60 text-sm">
              © 2024 IOAI Community Contest.{' '}
              <span className="hover:text-primary transition-colors cursor-pointer hover:underline">
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