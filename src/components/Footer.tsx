import { ExternalLink, Github, Mail, Twitter } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string, sectionId?: string) => {
    if (path === "/" && sectionId) {
      if (location.pathname === "/") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else if (path.startsWith("http")) {
      window.open(path, "_blank");
    } else {
      navigate(path);
    }
  };

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "Contests", path: "/contests" },
    { label: "Tasks", path: "/tasks" },
    { label: "Team", path: "/team" },
    { label: "Resources", path: "/resources" },
    { label: "Roadmap", path: "/roadmap" },
    { label: "Become a Setter", path: "/become-setter" },
    //{ label: "Community", path: "/community" },
  ];

  const resources = [
    { label: "IOAI Official", href: "https://ioai-official.org/" },
    { label: "Kaggle", href: "https://www.kaggle.com" },
    { label: "Hugging Face", href: "https://huggingface.co" },
    { label: "All resources", href: "/resources" },
  ];

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: "https://github.com/AI-Community-Contest",
    },
    {
      icon: ExternalLink,
      label: "Discord",
      href: "https://discord.gg/7GfxrqRreY",
    },
    {
      icon: Mail,
      label: "Email",
      href: "mailto:ai.community.contest@gmail.com",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 dark:from-[#0a0a0f] dark:to-[#0f0f15] border-t border-gray-200 dark:border-white/10">
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/AICCCC.png" alt="AICC Logo" className="h-8" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              AICC (AI Community Contest) - Monthly IOAI practice rounds and
              competitive AI challenges. Community-organized, not affiliated
              with official IOAI.
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
                    className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-aicc-purple hover:text-white transition-all duration-150"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigation(link.path)}
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-aicc-purple dark:hover:text-aicc-purple-light transition-colors transform duration-200"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

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
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-aicc-purple dark:hover:text-aicc-purple-light transition-colors transform duration-200 flex items-center gap-1"
                >
                  {resource.label}
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              &copy; {new Date().getFullYear()}{" "}
              AI Community Contest. All rights reserved.
            </p>
            {
              /* <div className="flex gap-6">
              <a href="#" className="text-sm text-gray-500 dark:text-gray-500 hover:text-aicc-purple transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-500 hover:text-aicc-purple transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-500 hover:text-aicc-purple transition-colors">
                Code of Conduct
              </a>
            </div> */
            }
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
