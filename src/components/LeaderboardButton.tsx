import { BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

interface LeaderboardButtonProps {
    roundNumber: number;
}

const LeaderboardButton = ({ roundNumber }: LeaderboardButtonProps) => (
    <Link
        to={`/contests/round-${roundNumber}/leaderboard`}
        aria-label={`View Round ${roundNumber} leaderboard`}
        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-gray-100 px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aicc-purple/50 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
    >
        <BarChart3 className="h-4 w-4" />
        <span>Leaderboard</span>
    </Link>
);

export default LeaderboardButton;
