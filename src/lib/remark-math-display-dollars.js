/**
 * remark plugin: upgrades `$$...$$` math written on a single line to
 * display (block/centered) math, matching how most authors expect `$$`.
 * micromark-extension-math only treats `$$` as flow math when the fences
 * sit on their own lines, so one-liners like `$$x = y$$` parse as inline.
 */

function walk(node, cb) {
  if (node.type === "inlineMath") cb(node);
  if (Array.isArray(node.children)) {
    node.children.forEach((child) => walk(child, cb));
  }
}

export default function remarkMathDisplayDollars() {
  return (tree, file) => {
    const source = typeof file.value === "string" ? file.value : "";
    walk(tree, (node) => {
      const start = node.position?.start?.offset;
      const end = node.position?.end?.offset;
      if (start == null || end == null) return;
      const isDoubleDollar =
        source[start] === "$" &&
        source[start + 1] === "$" &&
        source[end - 1] === "$" &&
        source[end - 2] === "$";
      if (!isDoubleDollar) return;
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      node.data.hProperties.className = ["language-math", "math-display"];
    });
  };
}