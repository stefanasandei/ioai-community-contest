import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  ArrowUp,
  Menu,
  X,
  Home,
  Trophy,
  ListChecks,
  Users,
  BookOpen,
  Map,
  UserPlus,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Github,
  type LucideIcon,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  sectionId?: string;
}

interface DropdownItem {
  label: string;
  path: string;
  icon: LucideIcon;
  external?: boolean;
  description?: string;
}

interface PillRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

const primaryNavItems: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Contests', path: '/contests', icon: Trophy },
  // { label: 'Tasks', path: '/tasks', icon: ListChecks },
  { label: 'Roadmap', path: '/roadmap', icon: Map },
  { label: 'Resources', path: '/resources', icon: BookOpen },
  {
    label: 'Team',
    path: '/team',
    icon: Users,
    // description: 'Meet the people behind AICC',
  },
  {
    label: 'Become a Setter',
    path: '/become-setter',
    icon: UserPlus,
    // description: 'Help create future contests',
  },
];

const moreNavItems: DropdownItem[] = [

];

const MORE_INDEX = primaryNavItems.length;

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [activePill, setActivePill] = useState<PillRect | null>(null);
  const [hoverPill, setHoverPill] = useState<PillRect | null>(null);
  const [pillsAnimated, setPillsAnimated] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [moreOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const measureRect = (idx: number): PillRect | null => {
    const el = itemRefs.current[idx];
    if (!el || !navRef.current) return null;
    const ir = el.getBoundingClientRect();
    const nr = navRef.current.getBoundingClientRect();
    return {
      left: ir.left - nr.left,
      top: ir.top - nr.top,
      width: ir.width,
      height: ir.height,
    };
  };

  useLayoutEffect(() => {
    const t = window.setTimeout(() => setPillsAnimated(true), 60);
    return () => window.clearTimeout(t);
  }, []);

  useLayoutEffect(() => {
    const pathname = location.pathname;
    const isPathActive = (path: string) =>
      path === '/'
        ? pathname === '/'
        : pathname === path || pathname.startsWith(`${path}/`);
    let idx = primaryNavItems.findIndex((item) => isPathActive(item.path));
    if (idx === -1 && moreNavItems.some((item) => isPathActive(item.path))) {
      idx = MORE_INDEX;
    }
    setActiveIndex(idx);
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (activeIndex < 0) {
      setActivePill(null);
      return;
    }
    setActivePill(measureRect(activeIndex));
  }, [activeIndex, pillsAnimated]);

  useLayoutEffect(() => {
    if (hoverIndex === null || hoverIndex === activeIndex) {
      setHoverPill(null);
      return;
    }
    setHoverPill(measureRect(hoverIndex));
  }, [hoverIndex, activeIndex, pillsAnimated]);

  useEffect(() => {
    const handleResize = () => {
      if (activeIndex >= 0) setActivePill(measureRect(activeIndex));
      if (hoverIndex !== null && hoverIndex !== activeIndex) {
        setHoverPill(measureRect(hoverIndex));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex, hoverIndex]);

  const handleNavigation = (path: string, sectionId?: string) => {
    setMoreOpen(false);
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

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pillStyle = (rect: PillRect): React.CSSProperties => ({
    transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
    width: rect.width,
    height: rect.height,
  });

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <nav
          className={`relative bg-white dark:bg-[#0a0a0f] border-b transition-colors duration-300 ${isScrolled
            ? 'border-gray-200 dark:border-white/10 shadow-sm'
            : 'border-transparent'
            }`}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => {
                  handleNavigation('/');
                  setMobileMenuOpen(false);
                }}
                className="relative group shrink-0"
                aria-label="Go to home"
              >
                <img
                  src="/assets/AICCCC.png"
                  alt="AICC Logo"
                  className="h-9 transition-transform group-hover:scale-105"
                />
              </button>

              <div className="hidden md:flex items-center">
                <div ref={navRef} className="relative flex items-center gap-3">
                  {hoverPill && (
                    <span
                      aria-hidden
                      className={`absolute rounded-lg pointer-events-none bg-aicc-purple/10 dark:bg-aicc-purple/20 ${pillsAnimated
                        ? 'transition-all duration-200 ease-out'
                        : ''
                        }`}
                      style={pillStyle(hoverPill)}
                    />
                  )}
                  {activePill && (
                    <span
                      aria-hidden
                      className={`absolute rounded-lg pointer-events-none bg-aicc-purple ${pillsAnimated
                        ? 'transition-all duration-300 ease-out'
                        : ''
                        }`}
                      style={pillStyle(activePill)}
                    />
                  )}

                  {primaryNavItems.map((item, i) => {
                    const active = isActive(item.path);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.path}
                        ref={(el) => {
                          itemRefs.current[i] = el;
                        }}
                        onClick={() => handleNavigation(item.path, item.sectionId)}
                        onMouseEnter={() => setHoverIndex(i)}
                        onMouseLeave={() => setHoverIndex(null)}
                        className={`relative z-10 flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${active
                          ? 'text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:text-aicc-purple dark:hover:text-aicc-purple-light'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}

                  {/* <div ref={moreRef} className="relative ml-1">
                    <button
                      ref={(el) => {
                        itemRefs.current[MORE_INDEX] = el;
                      }}
                      onClick={() => setMoreOpen((open) => !open)}
                      onMouseEnter={() => setHoverIndex(MORE_INDEX)}
                      onMouseLeave={() => setHoverIndex(null)}
                      className={`relative z-10 flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${activeIndex === MORE_INDEX
                          ? 'text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:text-aicc-purple dark:hover:text-aicc-purple-light'
                        }`}
                      aria-expanded={moreOpen}
                      aria-haspopup="true"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>More</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {moreOpen && (
                      <div
                        className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0f0f15] shadow-xl shadow-black/5 dark:shadow-black/30 overflow-hidden"
                        role="menu"
                      >
                        <div className="p-2">
                          {moreNavItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.path);
                            return (
                              <button
                                key={item.path}
                                onClick={() => {
                                  handleNavigation(item.path);
                                  setMoreOpen(false);
                                }}
                                className={`group w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${active
                                    ? 'bg-aicc-purple/5 dark:bg-aicc-purple/10'
                                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                  }`}
                                role="menuitem"
                              >
                                <div
                                  className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${active
                                      ? 'bg-aicc-purple text-white'
                                      : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 group-hover:bg-aicc-purple/10 group-hover:text-aicc-purple'
                                    }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div
                                    className={`text-sm font-semibold ${active
                                        ? 'text-aicc-purple dark:text-aicc-purple-light'
                                        : 'text-gray-900 dark:text-white'
                                      }`}
                                  >
                                    {item.label}
                                  </div>
                                  {item.description && (
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                                      {item.description}
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        <div className="px-3 py-2.5 border-t border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.02]">
                          <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400">
                            Quick Links
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <a
                              href="https://github.com/AI-Community-Contest"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-aicc-purple hover:bg-white dark:hover:bg-white/5 rounded-md transition-colors"
                            >
                              <Github className="w-3.5 h-3.5" />
                              GitHub
                            </a>
                            <a
                              href="https://discord.gg/7GfxrqRreY"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-aicc-purple hover:bg-white dark:hover:bg-white/5 rounded-md transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                              </svg>
                              Discord
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div> */}
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 shrink-0">
                <a
                  href="https://github.com/AI-Community-Contest"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 text-gray-700 dark:text-gray-300 hover:text-aicc-purple hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleNavigation('https://discord.gg/7GfxrqRreY')}
                  className="inline-flex items-center gap-2 px-4 py-2 btn-gradient text-white text-sm font-medium rounded-lg transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span className="hidden lg:inline">Join Discord</span>
                  <span className="lg:hidden">Join</span>
                </button>
              </div>

              <button
                className="md:hidden p-2 -mr-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-white/95 dark:bg-[#0a0a0f]/95 backdrop-blur-xl transition-opacity duration-300 md:hidden ${mobileMenuOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
          }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="h-full overflow-y-auto pt-20 pb-8 px-6">
          <div className="max-w-md mx-auto space-y-1">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 px-2 pb-1">
              Navigate
            </div>
            {primaryNavItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    handleNavigation(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`group w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${active
                    ? 'bg-aicc-purple/5 dark:bg-aicc-purple/10'
                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                >
                  <div
                    className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${active
                      ? 'bg-aicc-purple text-white'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 group-hover:bg-aicc-purple/10 group-hover:text-aicc-purple'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-base font-semibold ${active
                        ? 'text-aicc-purple dark:text-aicc-purple-light'
                        : 'text-gray-900 dark:text-white'
                        }`}
                    >
                      {item.label}
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="text-[11px] uppercase tracking-wider font-semibold text-gray-500 dark:text-gray-400 px-2 pt-6 pb-1">
              More
            </div>
            {moreNavItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    handleNavigation(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`group w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${active
                    ? 'bg-aicc-purple/5 dark:bg-aicc-purple/10'
                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                >
                  <div
                    className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${active
                      ? 'bg-aicc-purple text-white'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 group-hover:bg-aicc-purple/10 group-hover:text-aicc-purple'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-base font-semibold ${active
                        ? 'text-aicc-purple dark:text-aicc-purple-light'
                        : 'text-gray-900 dark:text-white'
                        }`}
                    >
                      {item.label}
                    </div>
                    {item.description && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}

            <div className="pt-6 space-y-2">
              <button
                onClick={() => {
                  handleNavigation('https://discord.gg/7GfxrqRreY');
                  setMobileMenuOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 btn-gradient text-white font-medium rounded-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Join Discord
              </button>
              <a
                href="https://github.com/AI-Community-Contest"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                <Github className="w-5 h-5" />
                View on GitHub
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/*
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-30 p-3 rounded-full bg-gradient-to-r from-aicc-purple to-aicc-orange text-white shadow-lg shadow-aicc-purple/25 transition-all duration-300 ${showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        aria-label="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>*/}
    </>
  );
};

export default Navigation;
