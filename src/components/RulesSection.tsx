import { BookOpen, Shield, Users, AlertCircle } from 'lucide-react';

const RulesSection = () => {
  const ruleCategories = [
    {
      id: 'rules',
      icon: BookOpen,
      title: 'Contest Rules',
      color: 'from-purple-500 to-violet-500',
      items: [
        'Use of LLMs for writing code or getting task ideas is strictly forbidden',
        'Use of the internet is forbidden except for reading official library documentation',
        'Communicating with anyone during the contest is forbidden',
        'Only ask questions regarding task statements using official methods'
      ]
    },
    {
      id: 'fairness',
      icon: Shield,
      title: 'Fair Play Policy',
      color: 'from-orange-500 to-amber-500',
      items: [
        'We cannot enforce these rules, but fair play ensures accurate IOAI simulation',
        'Following rules is in the best interest of all contestants',
        'Violations may result in disqualification from rankings',
        'Report suspected violations to organizers confidentially'
      ]
    },
    {
      id: 'conduct',
      icon: Users,
      title: 'Code of Conduct',
      color: 'from-teal-500 to-cyan-500',
      items: [
        'Respect fellow participants and organizers at all times',
        'No sharing of solutions during active contests',
        'Provide constructive feedback when reviewing others\' work',
        'Help newcomers learn and grow within the community'
      ]
    }
  ];

  return (
    <section id="rules" className="relative py-24 bg-gradient-to-b from-white to-gray-50 dark:from-[#0a0a0f] dark:to-[#0f0f15] overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full max-w-7xl mx-auto">
          <div className="absolute top-40 right-0 w-96 h-96 bg-aicc-purple/5 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-0 w-80 h-80 bg-aicc-orange/5 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aicc-orange/10 border border-aicc-orange/20 mb-6">
            <AlertCircle className="w-4 h-4 text-aicc-orange" />
            <span className="text-sm font-medium text-aicc-orange">Important Guidelines</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gray-900 dark:text-white">Contest</span>{' '}
            <span className="text-gradient">Rules</span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light">
            Simple, fair guidelines to ensure everyone has the best experience possible.
            Following these rules helps create a fair competition that accurately simulates the IOAI.
          </p>
        </div>

        {/* Cards - all open by default, no dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ruleCategories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 overflow-hidden"
            >
              <div className="px-6 py-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${category.color}`}>
                    <category.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                </div>

                <div className="space-y-3">
                  {category.items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-aicc-purple mt-2 flex-shrink-0" />
                      <span className="font-light text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/30">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Note</h4>
              <p className="text-sm text-amber-700 dark:text-amber-300 font-light">
                We cannot enforce these rules technically, but following them ensures fair play and a more accurate simulation of the IOAI.
                It is in the best interest of all contestants to follow the rules honestly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
