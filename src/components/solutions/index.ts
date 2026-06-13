/**
 * Central export for all MDX editorial components.
 * Each component is registered with the MDXProvider in `src/pages/Solution.tsx`
 * so it can be used directly inside `.mdx` files.
 */

import ModelArchitecture from "./ModelArchitecture";
import PhaseTable from "./PhaseTable";
import {
    MDXTable,
    MDXThead,
    MDXTbody,
    MDXTr,
    MDXTh,
    MDXTd,
} from "./MDXTable";

/**
 * Component map passed to <MDXProvider components={mdxComponents} />.
 * Using `MDXTable` as the default `table` element also catches raw
 * pipe-style tables written without our wrapper.
 */
export const mdxComponents = {
    // Styled table pieces
    MDXTable,
    MDXThead,
    MDXTbody,
    MDXTr,
    MDXTh,
    MDXTd,

    // Aliases for the common short names
    Table: MDXTable,
    Thead: MDXThead,
    Tbody: MDXTbody,
    Tr: MDXTr,
    Th: MDXTh,
    Td: MDXTd,

    // Custom editorial components
    ModelArchitecture,
    PhaseTable,
} as const;

export { ModelArchitecture, PhaseTable, MDXTable };
