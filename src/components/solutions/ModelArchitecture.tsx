/**
 * ModelArchitecture - An academic-style diagram of the BiGRU forward pass.
 *
 * Reads top-to-bottom like a paper figure:
 *   Input chars → Embedding → Bidirectional GRU (fwd + bwd paths)
 *   → Concat → Linear → Argmax → Output char
 *
 * Typography hierarchy:
 *   - Eyebrow:  text-[10px] / font-bold / uppercase / tracking-[0.18em]
 *   - Section:  text-xs    / font-bold / uppercase / tracking-wider
 *   - Label:    font-mono  / text-sm   / font-bold
 *   - Caption:  text-xs    / font-normal / leading-relaxed / muted
 */

import { Layers, ArrowDown, Split, Merge, Braces, Sigma, Type } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Color palette ─────────────────────────────────── */

type Tone = "input" | "embed" | "gru-fwd" | "gru-bwd" | "concat" | "linear" | "output";

interface ToneDef {
    box: string;            // border + bg (light)
    boxDark: string;        // border + bg (dark)
    text: string;           // label + subtext
    icon: string;           // icon color
}

const TONES: Record<Tone, ToneDef> = {
    input: {
        box: "border-gray-300 bg-gray-100 dark:border-gray-600 dark:bg-gray-800",
        boxDark: "",
        text: "text-gray-800 dark:text-gray-100",
        icon: "text-gray-500",
    },
    embed: {
        box: "border-sky-400 bg-sky-50 dark:border-sky-600 dark:bg-sky-950/40",
        boxDark: "",
        text: "text-sky-800 dark:text-sky-200",
        icon: "text-sky-500",
    },
    "gru-fwd": {
        box: "border-violet-400 bg-violet-50 dark:border-violet-600 dark:bg-violet-950/40",
        boxDark: "",
        text: "text-violet-800 dark:text-violet-200",
        icon: "text-violet-500",
    },
    "gru-bwd": {
        box: "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/40",
        boxDark: "",
        text: "text-amber-800 dark:text-amber-200",
        icon: "text-amber-500",
    },
    concat: {
        box: "border-indigo-400 bg-indigo-50 dark:border-indigo-600 dark:bg-indigo-950/40",
        boxDark: "",
        text: "text-indigo-800 dark:text-indigo-200",
        icon: "text-indigo-500",
    },
    linear: {
        box: "border-rose-400 bg-rose-50 dark:border-rose-600 dark:bg-rose-950/40",
        boxDark: "",
        text: "text-rose-800 dark:text-rose-200",
        icon: "text-rose-500",
    },
    output: {
        box: "border-emerald-400 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40",
        boxDark: "",
        text: "text-emerald-800 dark:text-emerald-200",
        icon: "text-emerald-500",
    },
};

/* ── Component ─────────────────────────────────────── */

const ModelArchitecture = ({ caption }: { caption?: string }) => {
    return (
        <figure className="not-prose my-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5">
            {/* Header bar */}
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-amber-50 px-5 py-2.5 dark:border-white/10 dark:from-violet-950/30 dark:to-amber-950/30">
                <Layers className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
                    Architecture
                </span>
                <span className="ml-auto text-sm font-semibold text-gray-900 dark:text-white">
                    BiGRU Character-Level Autocorrect
                </span>
            </div>

            {/* Body */}
            <div className="flex flex-col items-center gap-0 px-6 py-8">
                {/* 1. Input sequence */}
                <StageGroup label="Input characters" tone="input" icon={<Type className="h-3.5 w-3.5" />}>
                    <div className="flex items-center justify-center gap-2">
                        {["t", "e", "h", " "].map((ch, i) => (
                            <span
                                key={i}
                                className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-gray-300 bg-white font-mono text-sm font-bold text-gray-800 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100"
                            >
                                {ch}
                            </span>
                        ))}
                        <span className="text-xs font-mono text-gray-400 dark:text-gray-500">...</span>
                    </div>
                </StageGroup>

                <ArrowDown className="my-1 h-4 w-4 text-gray-400" />

                {/* 2. Embedding lookup */}
                <StageGroup label="Character embedding" tone="embed" icon={<Sigma className="h-3.5 w-3.5" />}>
                    <div className="flex items-center justify-center gap-3">
                        {["v0", "v1", "v2", "v3"].map((v, i) => (
                            <span
                                key={i}
                                className="flex h-7 items-center justify-center rounded-md border-2 border-sky-400 bg-sky-50 px-2 font-mono text-xs font-bold text-sky-800 dark:border-sky-600 dark:bg-sky-950/40 dark:text-sky-200"
                            >
                                {v}
                            </span>
                        ))}
                    </div>
                    <div className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                        each char → 128-d vector
                    </div>
                </StageGroup>

                <ArrowDown className="my-1 h-4 w-4 text-gray-400" />

                {/* 3. Bidirectional GRU - split into two paths */}
                <div className="grid w-full max-w-md grid-cols-2 gap-4">
                    {/* Forward */}
                    <StageGroup label="Forward GRU" tone="gru-fwd" icon={<ArrowDown className="h-3.5 w-3.5" />}>
                        <div className="flex flex-col items-center gap-1.5">
                            <span className="text-[10px] font-mono font-semibold text-violet-600 dark:text-violet-400">
                                left → right
                            </span>
                            {["h0", "h1", "h2", "h3"].map((h, i) => (
                                <span
                                    key={i}
                                    className="inline-block rounded-md border-2 border-violet-400 bg-violet-50 px-2 py-0.5 font-mono text-xs font-bold text-violet-800 dark:border-violet-600 dark:bg-violet-950/40 dark:text-violet-200"
                                >
                                    {h}_fwd
                                </span>
                            ))}
                        </div>
                    </StageGroup>

                    {/* Backward */}
                    <StageGroup label="Backward GRU" tone="gru-bwd" icon={<ArrowDown className="h-3.5 w-3.5 rotate-180" />}>
                        <div className="flex flex-col items-center gap-1.5">
                            <span className="text-[10px] font-mono font-semibold text-amber-600 dark:text-amber-400">
                                right ← left
                            </span>
                            {["h0", "h1", "h2", "h3"].reverse().map((h, i) => (
                                <span
                                    key={i}
                                    className="inline-block rounded-md border-2 border-amber-400 bg-amber-50 px-2 py-0.5 font-mono text-xs font-bold text-amber-800 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-200"
                                >
                                    {h}_bwd
                                </span>
                            ))}
                        </div>
                    </StageGroup>
                </div>

                <ArrowDown className="my-1 h-4 w-4 text-gray-400" />

                {/* 4. Concat */}
                <StageGroup label="Concatenate" tone="concat" icon={<Merge className="h-3.5 w-3.5" />}>
                    <div className="flex items-center justify-center gap-3">
                        <span className="rounded-md border-2 border-indigo-400 bg-indigo-50 px-2.5 py-1 font-mono text-xs font-bold text-indigo-800 dark:border-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-200">
                            [h_fwd ; h_bwd]
                        </span>
                    </div>
                    <div className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        256 + 256 = 512-d per position
                    </div>
                </StageGroup>

                <ArrowDown className="my-1 h-4 w-4 text-gray-400" />

                {/* 5. Linear projection */}
                <StageGroup label="Linear projection" tone="linear" icon={<Braces className="h-3.5 w-3.5" />}>
                    <div className="flex items-center justify-center gap-2">
                        <span className="rounded-md border-2 border-rose-400 bg-rose-50 px-3 py-1 font-mono text-xs font-bold text-rose-800 dark:border-rose-600 dark:bg-rose-950/40 dark:text-rose-200">
                            512 → 1000
                        </span>
                    </div>
                    <div className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        scores per vocabulary token
                    </div>
                </StageGroup>

                <ArrowDown className="my-1 h-4 w-4 text-gray-400" />

                {/* 6. Argmax output */}
                <StageGroup label="Decode" tone="output" icon={<Split className="h-3.5 w-3.5" />}>
                    <div className="flex items-center justify-center gap-2">
                        <span className="rounded-md border-2 border-emerald-400 bg-emerald-50 px-3 py-1 font-mono text-xs font-bold text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200">
                            argmax
                        </span>
                    </div>
                    <div className="mt-1 text-center text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        most likely character
                    </div>
                </StageGroup>

                <ArrowDown className="my-1 h-4 w-4 text-gray-400" />

                {/* Output preview */}
                <StageGroup label="Corrected output" tone="input" icon={<Type className="h-3.5 w-3.5" />}>
                    <div className="flex items-center justify-center gap-2">
                        {["t", "h", "e", " "].map((ch, i) => (
                            <span
                                key={i}
                                className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-emerald-400 bg-emerald-50 font-mono text-sm font-bold text-emerald-700 dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300"
                            >
                                {ch}
                            </span>
                        ))}
                        <span className="text-xs font-mono text-gray-400 dark:text-gray-500">...</span>
                    </div>
                </StageGroup>
            </div>

            {caption && (
                <figcaption className="border-t border-gray-200 bg-gray-50/60 px-5 py-3 text-center text-xs leading-relaxed text-gray-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-gray-400">
                    {caption}
                </figcaption>
            )}
        </figure>
    );
};

/* ── Stage group wrapper ────────────────────────────── */

const StageGroup = ({
    label,
    tone,
    icon,
    children,
}: {
    label: string;
    tone: Tone;
    icon: React.ReactNode;
    children: React.ReactNode;
}) => {
    const t = TONES[tone];
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5">
                <span className={cn("opacity-70", t.icon)}>{icon}</span>
                <span className={cn("text-[10px] font-bold uppercase tracking-[0.18em]", t.text)}>
                    {label}
                </span>
            </div>
            <div
                className={cn(
                    "rounded-lg border-2 px-4 py-2.5",
                    t.box,
                )}
            >
                {children}
            </div>
        </div>
    );
};

export default ModelArchitecture;
