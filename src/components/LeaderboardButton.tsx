import { BarChart3, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface LeaderboardButtonProps {
    roundNumber: number;
}

const LeaderboardButton = ({ roundNumber }: LeaderboardButtonProps) => (
    <Link
        to={"/contests/round-" + roundNumber + "/leaderboard"}
        className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-aicc-purple/20 bg-gradient-to-r from-aicc-purple/10 via-white to-aicc-orange/10 px-3.5 py-2 text-sm font-semibold text-aicc-purple shadow-sm transition-all hover:-translate-y-0.5 hover:border-aicc-purple/40 hover:shadow-md dark:from-aicc-purple/20 dark:via-white/5 dark:to-aicc-orange/10 dark:text-aicc-purple-light"
        aria-label={"View Round " + roundNumber + " leaderboard"}
    >
        <BarChart3 className="h-4 w-4" />
        <span>Leaderboard</span>
        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </Link>
);

export default LeaderboardButton;
