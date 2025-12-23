import { useEffect, useState } from 'react';
import { Target, BookOpen, Users, Award, TrendingUp, Globe, Zap, Sparkles } from 'lucide-react';

const MissionSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('mission');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Features from hero section (Monthly Challenges, Active Community, IOAI Preparation)
  const features = [
    { icon: Zap, title: 'Monthly Challenges', desc: 'Fresh AI problems every month', color: 'from-purple-500 to-violet-500' },
    { icon: Users, title: 'Active Community', desc: 'Learn from fellow enthusiasts', color: 'from-teal-500 to-cyan-500' },
    { icon: Sparkles, title: 'IOAI Preparation', desc: 'Practice for the real competition', color: 'from-orange-500 to-amber-500' },
    {
      icon: Target,
      title: 'Practice',
      desc: 'Regular challenges to keep your skills sharp and stay competitive',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: BookOpen,
      title: 'Learn',
      desc: 'Discover new techniques and approaches from experts',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Users,
      title: 'Connect',
      desc: 'Build relationships with fellow AI enthusiasts worldwide',
      color: 'from-teal-500 to-cyan-500'
    }]
    ;

  // Only first 3 values
  const values = [

  ];

  return (
    <section id="mission" className="relative py-24 bg-white dark:bg-[#0a0a0f] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-aicc-purple/5 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
        <div className="absolute top-20 left-20 w-72 h-72 bg-aicc-purple/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-aicc-orange/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Our mission</span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            The IOAI Community Contest bridges the gap between learning and mastery.
            We create a supportive environment where AI enthusiasts can practice, learn,
            and grow together through carefully crafted monthly challenges.
          </p>
        </div>

        {/* Features from hero */}
        <div className={`mb-16 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col p-6 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 h-full"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 shrink-0`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Values grid - only first 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className={`flex flex-col relative p-8 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 transition-all duration-500 h-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Icon background */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${value.color} opacity-[0.03]`} />

              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} mb-6 shrink-0`}>
                <value.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
