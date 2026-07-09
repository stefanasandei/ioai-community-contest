import { Users, Wrench, Eye } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

enum TeamRole {
  ProblemSetter = 'Problem Setter',
  ProblemReview = 'Problem Review',
  Logistics = 'Logistics',
}

interface TeamMember {
  name: string;
  username: string;
  emoji?: string;
  description: string;
  teams: TeamRole[];
}

const teamMembers: TeamMember[] = [
  { name: 'Georgios Tzovairis', username: 'Gior', emoji: '🇬🇷', description: 'IOAI \'25, HS student class of \'27', teams: [TeamRole.ProblemSetter, TeamRole.ProblemReview, TeamRole.Logistics] },
  { name: 'Stefan Asandei', username: 'Stefan', emoji: '🇷🇴', description: 'Math and CS student at Ecole Polytechnique, Bronze medal at IOAI \'25', teams: [TeamRole.ProblemSetter, TeamRole.ProblemReview, TeamRole.Logistics] },
  { name: 'Yue Heng Wong', username: 'Walnit', emoji: '🇸🇬', description: "IOAI '25 (Silver), Singapore NOAI '25 (Gold), 6/13 Hackathons Won, NUS CS '32", teams: [TeamRole.ProblemSetter, TeamRole.ProblemReview] },
  { name: 'Antony Ingorokva', username: 'Cowile', emoji: '🇬🇪', description: "Honourable Mention at IOAI '25", teams: [TeamRole.ProblemSetter, TeamRole.ProblemReview] },
  { name: 'Nikoloz Gegenava', username: 'Nikoloz', emoji: '🇬🇪', description: "IOAI '25, EUCYS '25 Special Jury Award, IYNT '25 Bronze Medal", teams: [TeamRole.ProblemSetter, TeamRole.ProblemReview] },
  { name: 'Henry Ho', username: 'Convexhulltrick', emoji: '🇦🇺', description: 'Bronze medal at IOAI \'25', teams: [TeamRole.ProblemReview, TeamRole.Logistics] },
  { name: 'Apostolidis Charalampos', username: 'Bl4ck', emoji: '🇬🇷', description: 'Hellenic NOI Top 12, Hellenic NOAI Top 25', teams: [TeamRole.Logistics] },
  { name: 'Zerui', username: 'iamnumber4', emoji: '🇸🇬', description: 'IOAI \'25', teams: [TeamRole.Logistics] },
];

const problemSetters = teamMembers.filter(m => m.teams.includes(TeamRole.ProblemSetter));
const problemReview = teamMembers.filter(m => m.teams.includes(TeamRole.ProblemReview));
const logistics = teamMembers.filter(m => m.teams.includes(TeamRole.Logistics));

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const TeamCard = ({ member, color }: { member: TeamMember; color: 'purple' | 'orange' | 'red' }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="px-5 pt-5">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 flex items-center justify-center text-white font-bold text-sm shrink-0 ${color === 'purple' ? 'bg-purple-600' : color === 'orange' ? 'bg-orange-600' : 'bg-aicc-red'
            }`}>
            {getInitials(member.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {member.name} {member.emoji}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
              {member.username}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-light">
              {member.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Team = () => {
  const allNames = [
    ...problemSetters.map(m => m.name),
    ...problemReview.map(m => m.name),
    ...logistics.map(m => m.name)
  ];
  const uniqueMembers = new Set(allNames).size;

  return (
    <div className="min-h-screen py-14 bg-gray-50 dark:bg-[#0a0a0f]">
      <Navigation />

      <div className="bg-white dark:bg-[#0a0a0f] border-b border-gray-200 dark:border-white/10 pt-4">
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-gray-900 dark:text-white">Our </span>
            <span className="text-gradient">Team</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-light">
            Our team is composed of {uniqueMembers} people. The dedicated individuals who make this contest possible.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 pb-24">
        {/* Problem Setters Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-none bg-purple-600">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Problem Setters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problemSetters.map((member, index) => (
              <TeamCard key={index} member={member} color="purple" />
            ))}
          </div>
        </div>

        {/* Problem Review Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-none bg-orange-600">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Problem Review</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problemReview.map((member, index) => (
              <TeamCard key={index} member={member} color="orange" />
            ))}
          </div>
        </div>

        {/* Logistics Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-none bg-aicc-red">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Logistics</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {logistics.map((member, index) => (
              <TeamCard key={index} member={member} color="red" />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Team;