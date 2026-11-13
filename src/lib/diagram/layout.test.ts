import { describe, expect, it } from "vitest";
import { managerappDiagram } from "@/content/work/diagrams/managerapp";
import { tuConjuntoDiagram } from "@/content/work/diagrams/tu-conjunto";
import { describeEdges, layoutDiagram, validateDiagram, type DiagramDefinition } from ".";

const sample: DiagramDefinition = {
  nodes: [
    { id: "a", label: "Client", kind: "client", col: 0, row: 0 },
    { id: "b", label: "App", sublabel: "Next.js", kind: "app", col: 1, row: 0 },
    { id: "c", label: "DB", kind: "db", col: 2, row: 0 },
    { id: "d", label: "CI", kind: "ci", col: 1, row: 1 },
    { id: "e", label: "Auth", kind: "external", col: 2, row: 1 },
  ],
  edges: [
    { from: "a", to: "b", label: "HTTPS" },
    { from: "b", to: "c", label: "SQL", detail: "Queries" },
    { from: "d", to: "b", label: "deploy", style: "dashed" },
    { from: "b", to: "e", label: "OAuth" }, // elbow (different column and row)
  ],
  groups: [{ label: "Hosting", nodeIds: ["b"] }],
};

const overlap = (a: { x: number; y: number; w: number; h: number }, b: typeof a) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

describe("layoutDiagram", () => {
  it("is deterministic", () => {
    expect(layoutDiagram(sample, "horizontal")).toEqual(layoutDiagram(sample, "horizontal"));
    expect(layoutDiagram(sample, "vertical")).toEqual(layoutDiagram(sample, "vertical"));
  });

  it("places nodes on the grid: flow left to right (horizontal), top to bottom (vertical)", () => {
    const h = layoutDiagram(sample, "horizontal");
    const x = (id: string) => h.nodes.find((n) => n.id === id)!.x;
    expect(x("a")).toBeLessThan(x("b"));
    expect(x("b")).toBeLessThan(x("c"));

    const v = layoutDiagram(sample, "vertical");
    const y = (id: string) => v.nodes.find((n) => n.id === id)!.y;
    expect(y("a")).toBeLessThan(y("b"));
    expect(y("b")).toBeLessThan(y("c"));
  });

  it("never overlaps node boxes and keeps everything inside the viewBox", () => {
    for (const o of ["horizontal", "vertical"] as const) {
      const { nodes, width, height } = layoutDiagram(sample, o);
      for (const [i, a] of nodes.entries()) {
        expect(a.x).toBeGreaterThanOrEqual(0);
        expect(a.y).toBeGreaterThanOrEqual(0);
        expect(a.x + a.w).toBeLessThanOrEqual(width);
        expect(a.y + a.h).toBeLessThanOrEqual(height);
        for (const b of nodes.slice(i + 1)) expect(overlap(a, b), `${a.id}/${b.id}`).toBe(false);
      }
    }
  });

  it("gives every edge an orthogonal path that ends on its target node", () => {
    for (const o of ["horizontal", "vertical"] as const) {
      const { nodes, edges } = layoutDiagram(sample, o);
      expect(edges).toHaveLength(sample.edges.length);
      for (const e of edges) {
        for (let i = 0; i < e.points.length - 1; i++) {
          const [p, q] = [e.points[i], e.points[i + 1]];
          expect(p[0] === q[0] || p[1] === q[1], `${e.from}->${e.to} segment ${i}`).toBe(true);
        }
        const target = nodes.find((n) => n.id === e.to)!;
        const [x, y] = e.points[e.points.length - 1];
        const onBoundary =
          (x === target.x || x === target.x + target.w) && y >= target.y && y <= target.y + target.h
            ? true
            : (y === target.y || y === target.y + target.h) &&
              x >= target.x &&
              x <= target.x + target.w;
        expect(onBoundary, `${e.from}->${e.to} ends on ${e.to}`).toBe(true);
        expect(e.d.startsWith("M")).toBe(true);
      }
    }
  });

  it("wraps groups around their members only", () => {
    const { nodes, groups } = layoutDiagram(sample, "horizontal");
    const b = nodes.find((n) => n.id === "b")!;
    expect(groups).toHaveLength(1);
    expect(groups[0].x).toBeLessThan(b.x);
    expect(groups[0].x + groups[0].w).toBeGreaterThan(b.x + b.w);
    expect(groups[0].y).toBeGreaterThanOrEqual(0);
  });

  it("keeps the vertical variant within a 375px phone's content width for the real diagrams", () => {
    for (const def of [managerappDiagram, tuConjuntoDiagram]) {
      const { width } = layoutDiagram(def, "vertical");
      // 375px minus the 16px gutters and figure padding: near 1:1 scale, so text stays legible
      expect(width).toBeLessThanOrEqual(356);
    }
  });
});

describe("vertical layout (the transposed grid)", () => {
  it("lays out the same nodes and edges as the horizontal one", () => {
    const h = layoutDiagram(sample, "horizontal");
    const v = layoutDiagram(sample, "vertical");
    expect(v.nodes.map((n) => n.id)).toEqual(h.nodes.map((n) => n.id));
    expect(v.edges.map((e) => `${e.from}>${e.to}`)).toEqual(
      h.edges.map((e) => `${e.from}>${e.to}`),
    );
    expect(v.groups.map((g) => g.label)).toEqual(h.groups.map((g) => g.label));
  });

  it("swaps the axes: a node's column drives y, its row drives x", () => {
    const h = layoutDiagram(sample, "horizontal");
    const v = layoutDiagram(sample, "vertical");
    const hd = h.nodes.find((n) => n.id === "d")!; // col 1, row 1
    const vd = v.nodes.find((n) => n.id === "d")!;
    const va = v.nodes.find((n) => n.id === "a")!; // col 0, row 0
    expect(vd.x).toBeGreaterThan(va.x); // row 1 is right of row 0
    expect(vd.y).toBeGreaterThan(va.y); // col 1 is below col 0
    expect(hd.y).toBeGreaterThan(h.nodes.find((n) => n.id === "a")!.y);
  });
});

describe("validation", () => {
  const withEdge = (from: string, to: string): DiagramDefinition => ({
    ...sample,
    edges: [{ from, to }],
  });

  it("accepts the sample and the two real diagrams", () => {
    expect(() => validateDiagram(sample)).not.toThrow();
    for (const def of [managerappDiagram, tuConjuntoDiagram]) {
      expect(() => layoutDiagram(def, "horizontal")).not.toThrow();
      expect(() => layoutDiagram(def, "vertical")).not.toThrow();
    }
  });

  it("throws for an edge that points to an unknown node", () => {
    expect(() => layoutDiagram(withEdge("a", "zzz"), "horizontal")).toThrow(/unknown node "zzz"/);
    expect(() => layoutDiagram(withEdge("nope", "b"), "horizontal")).toThrow(/unknown node "nope"/);
  });

  it("throws for two nodes on the same cell", () => {
    const def: DiagramDefinition = {
      nodes: [
        { id: "a", label: "A", kind: "app", col: 0, row: 0 },
        { id: "b", label: "B", kind: "app", col: 0, row: 0 },
      ],
      edges: [],
    };
    expect(() => layoutDiagram(def, "horizontal")).toThrow(/same cell/);
  });

  it("throws for duplicate ids, bad cells, empty diagrams and over-long text", () => {
    const node = { id: "a", label: "A", kind: "app", col: 0, row: 0 } as const;
    expect(() => validateDiagram({ nodes: [], edges: [] })).toThrow(/no nodes/);
    expect(() => validateDiagram({ nodes: [node, { ...node, col: 1 }], edges: [] })).toThrow(
      /Duplicate/,
    );
    expect(() => validateDiagram({ nodes: [{ ...node, col: -1 }], edges: [] })).toThrow(
      /non-negative/,
    );
    expect(() =>
      validateDiagram({ nodes: [{ ...node, label: "x".repeat(40) }], edges: [] }),
    ).toThrow(/label/);
    expect(() =>
      validateDiagram({ nodes: [{ ...node, sublabel: "x".repeat(40) }], edges: [] }),
    ).toThrow(/sublabel/);
    expect(() =>
      validateDiagram({
        nodes: [node, { ...node, id: "b", col: 1 }],
        edges: [{ from: "a", to: "b", label: "x".repeat(20) }],
      }),
    ).toThrow(/label/);
    expect(() => validateDiagram({ nodes: [node], edges: [{ from: "a", to: "a" }] })).toThrow(
      /itself/,
    );
  });

  it("throws when an edge would run through another node", () => {
    const def: DiagramDefinition = {
      nodes: [
        { id: "a", label: "A", kind: "client", col: 0, row: 0 },
        { id: "b", label: "B", kind: "app", col: 1, row: 0 },
        { id: "c", label: "C", kind: "db", col: 2, row: 0 },
      ],
      edges: [{ from: "a", to: "c" }],
    };
    expect(() => layoutDiagram(def, "horizontal")).toThrow(/would cross node "b"/);
  });

  it("throws when a group would enclose a non-member", () => {
    const def: DiagramDefinition = {
      ...sample,
      edges: [],
      groups: [{ label: "Bad", nodeIds: ["a", "c"] }],
    };
    expect(() => layoutDiagram(def, "horizontal")).toThrow(/would enclose node "b"/);
  });
});

describe("describeEdges (text version)", () => {
  it("lists every edge with the detail, falling back to the label", () => {
    const lines = describeEdges(sample);
    expect(lines).toHaveLength(sample.edges.length);
    expect(lines).toContain("Client → App: HTTPS");
    expect(lines).toContain("App → DB: Queries");
    expect(lines).toContain("CI → App: deploy");
  });

  it("covers every edge of the real diagrams", () => {
    for (const def of [managerappDiagram, tuConjuntoDiagram]) {
      expect(describeEdges(def)).toHaveLength(def.edges.length);
    }
  });
});

describe("real diagrams", () => {
  it("use unique ids and only technologies from context/01", () => {
    const text = JSON.stringify([managerappDiagram, tuConjuntoDiagram]);
    expect(managerappDiagram.id).not.toBe(tuConjuntoDiagram.id);
    // The unverified claims of the Tu Conjunto cover (Q-07) must not leak into the draft diagram
    expect(JSON.stringify(tuConjuntoDiagram)).not.toMatch(
      /Vite|conjunto_id|:tenant|cross-tenant|role guards|porteria/i,
    );
    expect(text).not.toMatch(/@|https?:\/\//);
  });
});
