import { GraduationCap, Brain, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PhaseTable - A 3-card visualization of the training curriculum.
 *
 * Typography hierarchy:
 *   - Phase number:  text-[10px] / font-bold / uppercase / tracking-[0.18em] / chip
 *   - Phase title:   text-base  / font-bold / tracking-tight
 *   - Objective:     text-sm   / font-normal / leading-relaxed / muted-strong
 *   - Metric label:  text-[11px] / font-semibold / uppercase / tracking-wider / muted
 *   - Metric value:  font-mono / text-sm / font-bold / accent
 *   - Connector:     small pill describing transition
 */

type Accent = "purple" | "orange" | "sky";

interface Phase {
    id: number;
    title: string;
    objective: string;
    input: string;
    epochs: number;
    lr: string;
    batch: number;
    icon: typeof GraduationCap;
    accent: Accent;
}

const PHASES: Phase[] = [
    {
        id: 1,
        title: "Autoencoding Pretrain",
        objective:
            "Predict misspelled text from correct text. The model learns the statistical structure of English before any correction mapping.",
        input: "labels (correct text)",
        epochs: 3,
        lr: "4e-3",
        batch: 1024,
        icon: GraduationCap,
        accent: "sky",
    },
    {
        id: 2,
        title: "Chunked Correction",
        objective:
            "Primary supervised task on overlapping 256-character chunks. The model learns local correction patterns.",
        input: "misspell (chunks)",
        epochs: 15,
        lr: "4e-3",
        batch: 1024,
        icon: Brain,
        accent: "purple",
    },
    {
        id: 3,
        title: "Full-Length Fine-Tune",
        objective:
            "Adapt to long sequences (768 chars) with a reduced learning rate. The model learns to handle the longest inputs.",
        input: "misspell (full)",
        epochs: 5,
        lr: "1e-3",
        batch: 256,
        icon: Wrench,
        accent: "orange",
    },
];

const ACCENT: Record<Accent, { ring: string; text: string; chip: string; bg: string; divider: string; icon: string }> = {
    sky: {
        ring: "border-sky-400/40 hover:border-sky-400/60",
        text: "text-sky-700 dark:text-sky-300",
        chip: "bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-200",
        bg: "bg-sky-50/50 dark:bg-sky-950/20",
        divider: "border-sky-200/50 dark:border-sky-800/30",
        icon: "text-sky-600 dark:text-sky-400",
    },
    purple: {
        ring: "border-aicc-purple/40 hover:border-aicc-purple/60",
        text: "text-aicc-purple",
        chip: "bg-aicc-purple/15 text-aicc-purple",
        bg: "bg-aicc-purple/[0.03] dark:bg-aicc-purple/[0.06]",
        divider: "border-aicc-purple/20",
        icon: "text-aicc-purple",
    },
    orange: {
        ring: "border-aicc-orange/40 hover:border-aicc-orange/60",
        text: "text-aicc-orange",
        chip: "bg-aicc-orange/15 text-aicc-orange",
        bg: "bg-aicc-orange/[0.03] dark:bg-aicc-orange/[0.06]",
        divider: "border-aicc-orange/20",
        icon: "text-aicc-orange",
    },
};

const PhaseTable = () => {
    return (
        <div className="not-prose my-10">
            <div className="mb-5 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-aicc-purple">
                    Training Curriculum
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-aicc-purple/30 to-transparent" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    3 phases, 23 epochs
                </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {PHASES.map((phase, i) => (
                    <PhaseCard key={phase.id} phase={phase} isLast={i === PHASES.length - 1} />
                ))}
            </div>
        </div>
    );
};

const PhaseCard = ({ phase, isLast }: { phase: Phase; isLast: boolean }) => {
    const a = ACCENT[phase.accent];
    const Icon = phase.icon;

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-all hover:shadow-md dark:bg-white/5",
                a.ring,
                a.bg
            )}
        >
            <div className="p-5">
                {/* Header: number + icon */}
                <div className="mb-4 flex items-start justify-between">
                    <span
                        className={cn(
                            "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em]",
                            a.chip
                        )}
                    >
                        Phase {phase.id}
                    </span>
                    <div
                        className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-black/30",
                            a.icon
                        )}
                    >
                        <Icon className="h-5 w-5" />
                    </div>
                </div>

                {/* Title */}
                <h4 className={cn("mb-2 text-base font-bold tracking-tight", a.text)}>
                    {phase.title}
                </h4>

                {/* Objective */}
                <p className="mb-5 text-sm font-normal leading-relaxed text-gray-700 dark:text-gray-300">
                    {phase.objective}
                </p>

                {/* Metrics */}
                <dl
                    className={cn(
                        "grid grid-cols-2 gap-x-3 gap-y-3 border-t pt-4 text-[11px]",
                        a.divider
                    )}
                >
                    <Metric label="Input" value={phase.input} accent={a.text} />
                    <Metric label="Epochs" value={String(phase.epochs)} accent={a.text} />
                    <Metric label="LR" value={phase.lr} accent={a.text} />
                    <Metric label="Batch" value={String(phase.batch)} accent={a.text} />
                </dl>
            </div>

        </div>
    );
};

const Metric = ({ label, value, accent }: { label: string; value: string; accent: string }) => (
    <div>
        <dt className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {label}
        </dt>
        <dd className={cn("font-mono text-sm font-bold leading-tight", accent)}>
            {value}
        </dd>
    </div>
);

export default PhaseTable;
