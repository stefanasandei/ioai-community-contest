import CountryFlag, { type CountryCode } from '@/components/CountryFlag';
import { Users, Wrench, Eye } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

enum TeamRole {
  ProblemSetter = 'Problem Setter',
  ProblemReview = 'Problem Review',
  Logistics = 'Logistics',
  Contributor = 'Contributor',
}

interface TeamMember {
  name: string;
  username?: string;
  country: CountryCode;
  description?: string;
  teams: TeamRole[];
}

const teamMembers: TeamMember[] = [
  { name: 'Georgios Tzovairis', username: 'Gior', country: 'GR', description: 'IOAI \'26 Silver, EUROAI \'26 Bronze, IOAI \'25, HS student class of \'27', teams: [TeamRole.ProblemSetter, TeamRole.ProblemReview, TeamRole.Logistics] },
  { name: 'Stefan Asandei', username: 'Stefan', country: 'RO', description: 'Math and CS at Ecole Polytechnique, EUROAI \'26 Silver, IOAI \'25 Bronze', teams: [TeamRole.ProblemSetter, TeamRole.ProblemReview, TeamRole.Logistics] },
  { name: 'Yue Heng Wong', username: 'Walnit', country: 'SG', description: "IOAI '25 (Silver), Singapore NOAI '25 (Gold), 6/13 Hackathons Won, NUS CS '32", teams: [TeamRole.ProblemSetter, TeamRole.ProblemReview] },
  { name: 'Antony Ingorokva', username: 'Cowile', country: 'GE', description: "IOAI '26 Silver, EUROAI '26 Bronze, Honourable Mention at IOAI '25", teams: [TeamRole.ProblemSetter, TeamRole.ProblemReview] },
  { name: 'Nikoloz Gegenava', username: 'Nikoloz', country: 'GE', description: "IOAI '26 Gold, IOAI '25, EUCYS '25 Special Jury Award, IYNT '25 Bronze Medal", teams: [TeamRole.ProblemSetter, TeamRole.ProblemReview] },
  { name: 'Henry Ho', username: 'Convexhulltrick', country: 'AU', description: 'Bronze medal at IOAI \'25', teams: [TeamRole.ProblemReview, TeamRole.Logistics] },
  { name: 'Apostolidis Charalampos', username: 'bl4ck', country: 'GR', description: 'Hellenic NOI Top 12, Hellenic NOAI Top 25', teams: [TeamRole.Logistics] },
  { name: 'Zerui', username: 'iamnumber4', country: 'SG', description: 'IOAI \'25', teams: [TeamRole.Logistics] },
  { name: 'Dauzhan Beketov', username: 'Megazhan', country: 'KZ', description: 'IOAI \'26 Gold (2nd overall), IOAI \'25 Bronze, IOI \'25 Bronze, EUROAI \'26 Silver', teams: [TeamRole.ProblemSetter] },
  { name: 'Luvidi Pranawa Alghari', username: 'Luvidi', country: 'ID', description: 'IOAI \'26 Gold, IOAI \'25 Silver', teams: [TeamRole.ProblemSetter] },
  { name: 'Wang Jiayu', username: 'Sabkx', country: 'SG', description: 'IOAI \'25 Gold (3rd overall), IOAI \'24 Gold', teams: [TeamRole.ProblemSetter, TeamRole.Contributor] },
  { name: 'Carson Cheng', country: 'HK', teams: [TeamRole.Contributor] },
  { name: 'Malo Tessé', country: 'FR', teams: [TeamRole.Contributor] },
  { name: 'Theo Bustamante', country: 'PH', teams: [TeamRole.Contributor] },
  { name: 'Elison Ang', country: 'PH', teams: [TeamRole.Contributor] },
  { name: 'Chon Feng Qi', country: 'MY', teams: [TeamRole.Contributor] },
  { name: 'Gheorghiță Istrate David', country: 'RO', teams: [TeamRole.Contributor] },
  { name: 'Jithun Methusahan', country: 'LK', teams: [TeamRole.Contributor] },
  { name: 'Martin Haoxuan Zhang', country: 'SE', teams: [TeamRole.Contributor] },
  { name: 'Low Yu Xuan', country: 'MY', teams: [TeamRole.Contributor] },
  { name: 'Zane Kumar', country: 'GB', teams: [TeamRole.Contributor] },
];

const problemSetters = teamMembers.filter(m => m.teams.includes(TeamRole.ProblemSetter));
const problemReview = teamMembers.filter(m => m.teams.includes(TeamRole.ProblemReview));
const logistics = teamMembers.filter(m => m.teams.includes(TeamRole.Logistics));

const contributors = teamMembers.filter(m => m.teams.includes(TeamRole.Contributor));

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

const TeamCard = ({ member, color }: { member: TeamMember; color: 'purple' | 'orange' | 'red' | 'blue' }) => {
  return (
    <div className="border border-gray-200 dark:border-white/10 bg-white dark:bg-card">
      <div className={`px-5 pt-5 ${!member.description ? 'pb-5' : ''}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 flex items-center justify-center text-white font-bold text-sm shrink-0 ${color === 'purple' ? 'bg-purple-600' : color === 'orange' ? 'bg-orange-600 dark:bg-orange-700' : color === 'blue' ? 'bg-blue-600' : 'bg-aicc-red dark:bg-red-700'
            }`}>
            {getInitials(member.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {member.name}<CountryFlag country={member.country} />
            </h3>
            {member.username && <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
              {member.username}
            </p>}
            {member.description && <p className="text-sm text-gray-600 dark:text-gray-300 font-light">
              {member.description}
            </p>}
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
    ...logistics.map(m => m.name),
    ...contributors.map(m => m.name)
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
        <div className="mb-12">
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

        {/* Problem Setters Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-none bg-purple-600">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Problem Authors</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problemSetters.map((member, index) => (
              <TeamCard key={index} member={member} color="purple" />
            ))}
          </div>
        </div>

        {/* Contributors Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Contributors</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8">
            {contributors.map(member => (
              <li key={member.name} className="flex items-center gap-3 border-b border-gray-200 py-4 dark:border-gray-800">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-xs font-semibold text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                  {getInitials(member.name)}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{member.name}<CountryFlag country={member.country} /></span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Team;
