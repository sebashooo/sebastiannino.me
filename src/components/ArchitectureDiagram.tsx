import type { ReactNode } from "react";
import {
  describeEdges,
  kindName,
  layoutDiagram,
  type ArchitectureDiagramProps,
  type LaidOutNode,
  type Layout,
  type NodeKind,
} from "@/lib/diagram";

/**
 * Architecture diagram for the case studies (D-45): inline SVG built on the server from typed data,
 * zero client JS. Two layouts are rendered and CSS shows one: horizontal from md up, vertical
 * (flow top to bottom) below md, so the text stays near 1:1 at 375px with no horizontal scroll.
 *
 * Accessibility: <figure> + <figcaption>; each SVG is role="img" named by its <title> and described
 * by its <desc>; a <details> "Text version" lists the components and every arrow in words
 * (a <details> rather than visually hidden text: it is available to everyone, including people
 * who zoom or copy text, and screen-reader users still get the description from <desc>).
 *
 * Styling uses only the design tokens (Tailwind theme utilities). Node kinds differ by shape and
 * border pattern, not only by color: client = rounded, app = accent border, API = accent bar,
 * database = drum line, external = dashed, CI = dotted.
 */

function NodeShape({ node }: { node: LaidOutNode }) {
  const { x, y, w, h, kind } = node;
  const base = "fill-surface";
  const kinds: Record<NodeKind, ReactNode> = {
    client: (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={16}
        strokeWidth={1.5}
        className={`${base} stroke-text-subtle`}
      />
    ),
    app: (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        strokeWidth={2}
        className={`${base} stroke-accent`}
      />
    ),
    api: (
      <>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={6}
          strokeWidth={1.5}
          className={`${base} stroke-text-subtle`}
        />
        <rect x={x} y={y} width={5} height={h} rx={2} className="fill-accent" />
      </>
    ),
    db: (
      <>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={6}
          strokeWidth={1.5}
          className={`${base} stroke-text-subtle`}
        />
        <path
          d={`M${x} ${y + 12} H${x + w}`}
          strokeWidth={1.5}
          className="stroke-text-subtle"
          fill="none"
        />
      </>
    ),
    external: (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        strokeWidth={1.5}
        strokeDasharray="6 4"
        className={`${base} stroke-text-muted`}
      />
    ),
    ci: (
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        strokeWidth={1.5}
        strokeDasharray="2 4"
        strokeLinecap="round"
        className={`${base} stroke-text-muted`}
      />
    ),
  };
  return <>{kinds[kind]}</>;
}

function Svg({
  layout,
  id,
  title,
  description,
}: {
  layout: Layout;
  id: string;
  title: string;
  description: string;
}) {
  const prefix = `${id}-${layout.orientation === "horizontal" ? "h" : "v"}`;
  const titleId = `${prefix}-title`;
  const descId = `${prefix}-desc`;
  const arrowId = `${prefix}-arrow`;
  const variant = layout.orientation === "horizontal" ? "hidden md:block" : "md:hidden";

  return (
    <svg
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descId}
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      width={layout.width}
      height={layout.height}
      data-diagram-orientation={layout.orientation}
      className={`mx-auto h-auto w-full ${variant}`}
      style={{ maxWidth: layout.width }}
    >
      <title id={titleId}>{title}</title>
      <desc id={descId}>{description}</desc>
      <defs>
        <marker
          id={arrowId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M0 1 L9 5 L0 9 z" className="fill-text-muted" />
        </marker>
      </defs>

      {layout.groups.map((g) => (
        <g key={g.label}>
          <rect
            x={g.x}
            y={g.y}
            width={g.w}
            height={g.h}
            rx={10}
            strokeWidth={1}
            strokeDasharray="3 3"
            className="fill-none stroke-text-subtle"
          />
        </g>
      ))}

      {layout.edges.map((e) => (
        <g key={`${e.from}-${e.to}`}>
          <path
            d={e.d}
            fill="none"
            strokeWidth={1.5}
            strokeDasharray={e.style === "dashed" ? "5 4" : undefined}
            markerEnd={`url(#${arrowId})`}
            className="stroke-text-muted"
          />
          {e.label && e.labelAt ? (
            <text
              x={e.labelAt.x}
              y={e.labelAt.y}
              textAnchor="middle"
              // A halo in the page color keeps the label readable where it sits on the line
              style={{ paintOrder: "stroke" }}
              strokeWidth={4}
              className="fill-text-body stroke-surface font-mono text-[11px]"
            >
              {e.label}
            </text>
          ) : null}
        </g>
      ))}

      {/* Group labels sit above the edges, with a halo, so an arrow entering the group never cuts them */}
      {layout.groups.map((g) => (
        <text
          key={g.label}
          x={g.x + 10}
          y={g.y + 14}
          style={{ paintOrder: "stroke" }}
          strokeWidth={4}
          className="fill-text-muted stroke-surface font-mono text-[11px]"
        >
          {g.label}
        </text>
      ))}

      {layout.nodes.map((n) => (
        <g key={n.id} data-node-kind={n.kind}>
          <NodeShape node={n} />
          {n.textLines.map((line, i) => (
            <text
              key={i}
              x={n.x + n.w / 2}
              y={line.y}
              textAnchor="middle"
              className={
                line.kind === "label"
                  ? "fill-text font-sans text-[13px] font-semibold"
                  : "fill-text-muted font-mono text-[12px]"
              }
            >
              {line.text}
            </text>
          ))}
        </g>
      ))}
    </svg>
  );
}

export function ArchitectureDiagram(props: ArchitectureDiagramProps) {
  const { id, title, description } = props;
  const horizontal = layoutDiagram(props, "horizontal");
  const vertical = layoutDiagram(props, "vertical");
  const flow = describeEdges(props);

  return (
    <figure className="my-8 flex flex-col gap-3 rounded-card border border-border bg-surface p-2 sm:p-4">
      <Svg layout={horizontal} id={id} title={title} description={description} />
      <Svg layout={vertical} id={id} title={title} description={description} />
      <figcaption className="m-0 font-mono text-xs text-text-muted">{title}</figcaption>
      <details className="text-sm text-text-body">
        <summary className="w-fit cursor-pointer font-mono text-xs text-text">Text version</summary>
        <div className="mt-3 flex flex-col gap-3">
          <p className="m-0">{description}</p>
          <div>
            <p className="m-0 mb-1 font-mono text-xs text-text-muted">Components</p>
            <ul className="m-0 list-disc space-y-1 pl-5">
              {props.nodes.map((n) => (
                <li key={n.id}>
                  {n.label}
                  {n.sublabel ? ` (${n.sublabel})` : ""} — {kindName(n.kind)}
                </li>
              ))}
            </ul>
          </div>
          {flow.length > 0 ? (
            <div>
              <p className="m-0 mb-1 font-mono text-xs text-text-muted">Flow</p>
              <ol className="m-0 list-decimal space-y-1 pl-5">
                {flow.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            </div>
          ) : null}
        </div>
      </details>
    </figure>
  );
}
