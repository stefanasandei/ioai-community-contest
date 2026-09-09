import { ArrowUpRight, ChartNoAxesColumnIncreasing } from 'lucide-react';
import { Link } from 'react-router-dom';

export function RatingsEntryPreview() {
  return <Link to="/ratings" className="ml-auto inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-purple-50 hover:text-purple-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-500 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-purple-300"><ChartNoAxesColumnIncreasing size={15} aria-hidden="true" />View Elo rankings<ArrowUpRight size={14} aria-hidden="true" /></Link>;
}
