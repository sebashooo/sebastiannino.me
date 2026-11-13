/**
 * Typed definition of an architecture diagram (D-45). Pure data: the layout module turns it into
 * coordinates and the ArchitectureDiagram component renders them. Definitions live in
 * src/content/work/diagrams/<slug>.ts.
 */

export type NodeKind = "client" | "app" | "api" | "db" | "external" | "ci";

export type DiagramNode = {
  id: string;
  label: string; // max 17 characters (fits the node box)
  sublabel?: string; // max 18 characters, mono
  kind: NodeKind;
  /** Grid cell in the horizontal (md+) layout; the vertical layout transposes it. */
  col: number;
  row: number;
};

export type DiagramEdge = {
  from: string; // node id
  to: string; // node id; the arrowhead points here
  /** Short label drawn on the arrow (max 9 characters). */
  label?: string;
  /** Longer wording used only in the text version; falls back to `label`. */
  detail?: string;
  style?: "solid" | "dashed";
};

/** Optional boundary box around some nodes, e.g. a hosting platform. */
export type DiagramGroup = {
  label: string;
  nodeIds: string[];
};

export type DiagramDefinition = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
};

export type ArchitectureDiagramProps = DiagramDefinition & {
  /** Unique per page: used to derive the SVG element ids (title, desc, arrowhead markers). */
  id: string;
  /** Visible caption and accessible name. */
  title: string;
  /** Accessible description of what the diagram shows. */
  description: string;
};

export type Orientation = "horizontal" | "vertical";
