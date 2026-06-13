import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * MDXTable - A stylized wrapper for tabular data inside MDX editorials.
 * Designed to fit the AICC design system: clean cards, gradient accents,
 * generous spacing, and refined typography.
 *
 * Typography hierarchy:
 *   - Caption:     text-xs / font-medium / uppercase / tracking-wider / muted
 *   - Header:      text-xs / font-bold  / uppercase / tracking-wider / strong
 *   - Body cell:   text-sm / font-normal / leading-relaxed
 *   - Highlighted: text-sm / font-semibold
 */

type Align = "left" | "center" | "right";

const alignClass = (align: Align) =>
    align === "center"
        ? "text-center"
        : align === "right"
            ? "text-right"
            : "text-left";

interface MDXTableProps extends React.HTMLAttributes<HTMLDivElement> {
    caption?: string;
}

const MDXTable = React.forwardRef<HTMLDivElement, MDXTableProps>(
    ({ caption, className, children, ...props }, _ref) => (
        <figure
            className={cn(
                "not-prose my-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/5",
                className
            )}
            {...props}
        >
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                    {children}
                </table>
            </div>
            {caption && (
                <figcaption className="border-t border-gray-200 bg-gray-50/60 px-5 py-3 text-center text-xs font-medium tracking-wide text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-400">
                    {caption}
                </figcaption>
            )}
        </figure>
    )
);
MDXTable.displayName = "MDXTable";

const MDXThead = ({ children }: { children: React.ReactNode }) => (
    <thead className="border-b-2 border-gray-200 bg-gradient-to-r from-aicc-purple/[0.06] via-aicc-orange/[0.04] to-aicc-purple/[0.06] dark:border-white/10 dark:from-aicc-purple/[0.12] dark:via-aicc-orange/[0.08] dark:to-aicc-purple/[0.12]">
        {children}
    </thead>
);
MDXThead.displayName = "MDXThead";

const MDXTbody = ({ children }: { children: React.ReactNode }) => (
    <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
);
MDXTbody.displayName = "MDXTbody";

interface MDXTrProps {
    children: React.ReactNode;
    highlight?: "winner" | "loser";
}

const MDXTr = ({ children, highlight }: MDXTrProps) => {
    const highlightClass =
        highlight === "winner"
            ? "bg-gradient-to-r from-emerald-50/80 to-emerald-100/40 font-semibold text-emerald-950 dark:from-emerald-900/20 dark:to-emerald-900/5 dark:text-emerald-50"
            : highlight === "loser"
                ? "bg-gray-50/40 text-gray-600 dark:bg-white/[0.02] dark:text-gray-400"
                : "";

    return (
        <tr
            className={cn(
                "border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50/60 dark:border-white/5 dark:hover:bg-white/[0.03]",
                highlightClass
            )}
        >
            {children}
        </tr>
    );
};
MDXTr.displayName = "MDXTr";

const MDXTh = ({
    children,
    align = "left",
    className,
}: {
    children: React.ReactNode;
    align?: Align;
    className?: string;
}) => (
    <th
        className={cn(
            "h-12 px-5 align-middle text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300",
            alignClass(align),
            className
        )}
    >
        {children}
    </th>
);
MDXTh.displayName = "MDXTh";

const MDXTd = ({
    children,
    align = "left",
    className,
}: {
    children: React.ReactNode;
    align?: Align;
    className?: string;
}) => (
    <td
        className={cn(
            "px-5 py-3.5 align-middle text-sm leading-relaxed text-gray-800 dark:text-gray-200",
            alignClass(align),
            className
        )}
    >
        {children}
    </td>
);
MDXTd.displayName = "MDXTd";

export { MDXTable, MDXThead, MDXTbody, MDXTr, MDXTh, MDXTd };
export default MDXTable;
