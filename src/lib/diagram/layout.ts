import type { DiagramDefinition, DiagramNode, NodeKind, Orientation } from "./types";

/**
 * Pure layout for ArchitectureDiagram: grid cells -> node boxes -> orthogonal edge paths.
 * No React, no DOM: deterministic, so it is unit-tested. The same definition is laid out twice:
 * "horizontal" (flow left to right, md+) and "vertical" (the grid transposed, flow top to bottom,
 * below md). All sizes are SVG user units; the SVG scales to its container, so a viewBox close to
 * the phone's content width keeps the text near 1:1 at 375px.
 */

/** Max characters per line (the box fits 17 bold 13px or 18 mono 12px characters). */
export const MAX_LABEL = 17;
export const MAX_SUBLABEL = 18;
/** Labels and sublabels wrap onto at most this many lines each. */
export const MAX_LINES = 2;
export const MAX_EDGE_LABEL = 9;

const PAD = 8;
const TOP = 28; // room for a group label above the first row
const GROUP_PAD = 8;
const EDGE_LABEL_CHAR_WIDTH = 6.6; // 11px mono

const LABEL_LINE = 17; // line heights inside a node
const SUBLABEL_LINE = 15;
const NODE_VPAD = 24; // total top and bottom padding inside a node
const MIN_NODE_H = 60;

const METRICS = {
  // flow = main axis of the arrows, cross = the other one
  horizontal: { w: 144, flowGap: 64, crossGap: 56 },
  vertical: { w: 146, flowGap: 44, crossGap: 44 },
} as const;

const NBSP = " ";

/**
 * Greedy word wrap for node text. A "·" separator stays glued to the word after it, so a line never
 * ends with a dangling dot. Throws if a single word is longer than `max`.
 */
export function wrapText(text: string, max: number): string[] {
  const words = text.replaceAll(" · ", ` ·${NBSP}`).split(" ").filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (word.length > max) throw new Error(`"${word}" is longer than ${max} characters`);
    const next = line ? `${line} ${word}` : word;
    if (next.length <= max) {
      line = next;
    } else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines.map((l) => l.replaceAll(NBSP, " "));
}

type TextLine = { text: string; kind: "label" | "sublabel"; y: number };

export type LaidOutNode = DiagramNode & {
  x: number;
  y: number;
  w: number;
  h: number;
  /** Wrapped text, each line with its baseline y (absolute), vertically centered in the box. */
  textLines: TextLine[];
};

export type LaidOutEdge = {
  from: string;
  to: string;
  label?: string;
  style: "solid" | "dashed";
  /** Path polyline in SVG units; the last point touches the target node. */
  points: [number, number][];
  d: string;
  /** Where the label goes. `above`: sits over a horizontal line; otherwise centered on the line. */
  labelAt?: { x: number; y: number; above: boolean };
};

export type LaidOutGroup = { label: string; x: number; y: number; w: number; h: number };

export type Layout = {
  orientation: Orientation;
  width: number;
  height: number;
  nodes: LaidOutNode[];
  edges: LaidOutEdge[];
  groups: LaidOutGroup[];
};

const KINDS: NodeKind[] = ["client", "app", "api", "db", "external", "ci"];

/** Throws a clear Error for anything the layout cannot draw. */
export function validateDiagram(def: DiagramDefinition): void {
  if (def.nodes.length === 0) throw new Error("Diagram has no nodes");

  const ids = new Set<string>();
  const cells = new Map<string, string>();
  for (const n of def.nodes) {
    if (ids.has(n.id)) throw new Error(`Duplicate node id "${n.id}"`);
    ids.add(n.id);
    if (!KINDS.includes(n.kind)) throw new Error(`Node "${n.id}" has unknown kind "${n.kind}"`);
    if (!Number.isInteger(n.col) || !Number.isInteger(n.row) || n.col < 0 || n.row < 0) {
      throw new Error(`Node "${n.id}" needs non-negative integer col/row (got ${n.col},${n.row})`);
    }
    if (n.label.trim().length === 0) throw new Error(`Node "${n.id}" has an empty label`);
    for (const [what, text, max] of [
      ["label", n.label, MAX_LABEL],
      ["sublabel", n.sublabel, MAX_SUBLABEL],
    ] as const) {
      if (text === undefined) continue;
      let lines: string[];
      try {
        lines = wrapText(text, max);
      } catch (e) {
        throw new Error(`Node "${n.id}" ${what}: ${(e as Error).message} ("${text}")`);
      }
      if (lines.length > MAX_LINES) {
        throw new Error(
          `Node "${n.id}" ${what} needs ${lines.length} lines (max ${MAX_LINES} of ${max} characters): "${text}"`,
        );
      }
    }
    const cell = `${n.col},${n.row}`;
    const other = cells.get(cell);
    if (other) {
      throw new Error(
        `Nodes "${other}" and "${n.id}" are on the same cell (col ${n.col}, row ${n.row})`,
      );
    }
    cells.set(cell, n.id);
  }

  for (const e of def.edges) {
    for (const end of [e.from, e.to]) {
      if (!ids.has(end))
        throw new Error(`Edge "${e.from}" -> "${e.to}" points to unknown node "${end}"`);
    }
    if (e.from === e.to) throw new Error(`Edge "${e.from}" points to itself`);
    if (e.label !== undefined && e.label.length > MAX_EDGE_LABEL) {
      throw new Error(
        `Edge "${e.from}" -> "${e.to}" label is over ${MAX_EDGE_LABEL} characters ("${e.label}")`,
      );
    }
  }

  for (const g of def.groups ?? []) {
    if (g.nodeIds.length === 0) throw new Error(`Group "${g.label}" has no nodes`);
    for (const id of g.nodeIds) {
      if (!ids.has(id)) throw new Error(`Group "${g.label}" points to unknown node "${id}"`);
    }
  }
}

type Rect = { x: number; y: number; w: number; h: number };

/** Open-interior overlap: touching edges do not count. */
function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

/** Does an axis-aligned segment pass through the open interior of the rect? Touching the border is fine. */
function segmentHitsRect(p: [number, number], q: [number, number], r: Rect): boolean {
  if (p[1] === q[1]) {
    const y = p[1];
    const overlap = Math.min(Math.max(p[0], q[0]), r.x + r.w) - Math.max(Math.min(p[0], q[0]), r.x);
    return y > r.y && y < r.y + r.h && overlap > 0;
  }
  const x = p[0];
  const overlap = Math.min(Math.max(p[1], q[1]), r.y + r.h) - Math.max(Math.min(p[1], q[1]), r.y);
  return x > r.x && x < r.x + r.w && overlap > 0;
}

export function layoutDiagram(def: DiagramDefinition, orientation: Orientation): Layout {
  validateDiagram(def);
  const horizontal = orientation === "horizontal";

  // One box height for the whole grid: tall enough for the node with the most text lines.
  const wrapped = new Map(
    def.nodes.map((n) => [
      n.id,
      {
        label: wrapText(n.label, MAX_LABEL),
        sublabel: n.sublabel ? wrapText(n.sublabel, MAX_SUBLABEL) : [],
      },
    ]),
  );
  const textHeight = (id: string) => {
    const t = wrapped.get(id)!;
    return t.label.length * LABEL_LINE + t.sublabel.length * SUBLABEL_LINE;
  };
  const nodeH = Math.max(
    MIN_NODE_H,
    NODE_VPAD + Math.max(...def.nodes.map((n) => textHeight(n.id))),
  );
  const m = { ...METRICS[orientation], h: nodeH };

  // Abstract frame: f = along the flow, c = across it. Horizontal: f is x. Vertical: f is y.
  const flowSize = horizontal ? m.w : m.h;
  const crossSize = horizontal ? m.h : m.w;
  const flowPad = horizontal ? PAD : TOP;
  const crossPad = horizontal ? TOP : PAD;
  const xy = (f: number, c: number): [number, number] => (horizontal ? [f, c] : [c, f]);

  // The flow index is always the column: the vertical layout only maps it to y instead of x
  // (the transposed grid), so a left-to-right chain becomes a top-to-bottom one.
  const primary = (n: DiagramNode) => n.col;
  const secondary = (n: DiagramNode) => n.row;

  const frames = def.nodes.map((n) => {
    const f0 = flowPad + primary(n) * (flowSize + m.flowGap);
    const c0 = crossPad + secondary(n) * (crossSize + m.crossGap);
    return { n, p: primary(n), q: secondary(n), f0, c0 };
  });
  const byId = new Map(frames.map((fr) => [fr.n.id, fr]));

  const nodes: LaidOutNode[] = frames.map(({ n, f0, c0 }) => {
    const [x, y] = xy(f0, c0);
    const t = wrapped.get(n.id)!;
    // Center the text block vertically; baselines sit ~75% down each line box
    let cursor = y + (m.h - textHeight(n.id)) / 2;
    const textLines: TextLine[] = [];
    for (const text of t.label) {
      textLines.push({ text, kind: "label", y: cursor + LABEL_LINE * 0.75 });
      cursor += LABEL_LINE;
    }
    for (const text of t.sublabel) {
      textLines.push({ text, kind: "sublabel", y: cursor + SUBLABEL_LINE * 0.75 });
      cursor += SUBLABEL_LINE;
    }
    return { ...n, x, y, w: m.w, h: m.h, textLines };
  });

  const maxP = Math.max(...frames.map((f) => f.p));
  const maxQ = Math.max(...frames.map((f) => f.q));
  const flowExtent = flowPad + maxP * (flowSize + m.flowGap) + flowSize + PAD;
  const crossExtent = crossPad + maxQ * (crossSize + m.crossGap) + crossSize + PAD;
  const [width, height] = xy(flowExtent, crossExtent);

  const edges: LaidOutEdge[] = def.edges.map((e) => {
    const A = byId.get(e.from)!;
    const B = byId.get(e.to)!;
    const aFc = A.f0 + flowSize / 2;
    const aCc = A.c0 + crossSize / 2;
    const bCc = B.c0 + crossSize / 2;
    let abstract: [number, number][];

    if (A.p === B.p) {
      // Same flow position: straight across
      abstract =
        B.q > A.q
          ? [
              [aFc, A.c0 + crossSize],
              [aFc, B.c0],
            ]
          : [
              [aFc, A.c0],
              [aFc, B.c0 + crossSize],
            ];
    } else if (A.q === B.q) {
      // Same cross position: straight along the flow
      abstract =
        B.p > A.p
          ? [
              [A.f0 + flowSize, aCc],
              [B.f0, aCc],
            ]
          : [
              [A.f0, aCc],
              [B.f0 + flowSize, aCc],
            ];
    } else {
      // Elbow: leave along the flow, turn in the gap right before the target, enter the target
      const forward = B.p > A.p;
      const midF = forward ? B.f0 - m.flowGap / 2 : B.f0 + flowSize + m.flowGap / 2;
      abstract = [
        [forward ? A.f0 + flowSize : A.f0, aCc],
        [midF, aCc],
        [midF, bCc],
        [forward ? B.f0 : B.f0 + flowSize, bCc],
      ];
    }

    const points = abstract.map(([f, c]) => xy(f, c));

    for (let i = 0; i < points.length - 1; i++) {
      for (const node of nodes) {
        if (segmentHitsRect(points[i], points[i + 1], node)) {
          throw new Error(
            `Edge "${e.from}" -> "${e.to}" would cross node "${node.id}"; move the nodes so the path is clear`,
          );
        }
      }
    }

    let labelAt: LaidOutEdge["labelAt"];
    if (e.label) {
      let best = 0;
      let bestLen = -1;
      for (let i = 0; i < points.length - 1; i++) {
        const len =
          Math.abs(points[i][0] - points[i + 1][0]) + Math.abs(points[i][1] - points[i + 1][1]);
        if (len > bestLen) {
          bestLen = len;
          best = i;
        }
      }
      const [p, q] = [points[best], points[best + 1]];
      const isHorizontal = p[1] === q[1];
      const fitsAbove = isHorizontal && bestLen >= e.label.length * EDGE_LABEL_CHAR_WIDTH + 4;
      labelAt = {
        x: (p[0] + q[0]) / 2,
        y: (p[1] + q[1]) / 2 + (fitsAbove ? -6 : 4),
        above: fitsAbove,
      };
    }

    return {
      from: e.from,
      to: e.to,
      label: e.label,
      style: e.style ?? "solid",
      points,
      d: points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" "),
      labelAt,
    };
  });

  const groups: LaidOutGroup[] = (def.groups ?? []).map((g) => {
    const members = nodes.filter((n) => g.nodeIds.includes(n.id));
    const minX = Math.min(...members.map((n) => n.x));
    const minY = Math.min(...members.map((n) => n.y));
    const maxX = Math.max(...members.map((n) => n.x + n.w));
    const maxY = Math.max(...members.map((n) => n.y + n.h));
    const inner: Rect = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    for (const n of nodes) {
      if (!g.nodeIds.includes(n.id) && overlaps(inner, n)) {
        throw new Error(`Group "${g.label}" would enclose node "${n.id}", which is not a member`);
      }
    }
    return {
      label: g.label,
      x: minX - GROUP_PAD,
      y: minY - GROUP_PAD - 12,
      w: inner.w + 2 * GROUP_PAD,
      h: inner.h + 2 * GROUP_PAD + 12,
    };
  });

  return { orientation, width, height, nodes, edges, groups };
}

const KIND_NAME: Record<NodeKind, string> = {
  client: "client",
  app: "application",
  api: "API",
  db: "database",
  external: "external service",
  ci: "CI/CD",
};

export function kindName(kind: NodeKind): string {
  return KIND_NAME[kind];
}

/** One line per edge, "From -> To: detail", for the text version of the diagram. */
export function describeEdges(def: DiagramDefinition): string[] {
  const label = new Map(def.nodes.map((n) => [n.id, n.label]));
  return def.edges.map((e) => {
    const text = e.detail ?? e.label;
    return `${label.get(e.from)} → ${label.get(e.to)}${text ? `: ${text}` : ""}`;
  });
}
