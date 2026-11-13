import { ImageResponse } from "next/og";
import { getSkillGroups } from "@/data";
import { SITE } from "./site";
import { STACK_COMMAND, buildStackOutput } from "./terminal/static-output";

/**
 * Open Graph images and icons (F4-03), drawn with next/og at build time (static, no runtime cost).
 * Satori cannot read CSS variables, so the hex values mirror the @theme tokens in globals.css.
 * The default font is used (no network fetch at build).
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const C = {
  bg: "#09090b",
  surface: "#111113",
  border: "#27272a",
  text: "#fafafa",
  muted: "#a1a1aa",
  accent: "#67e8f9",
} as const;

const MINI_GROUPS = ["Backend", "Data", "Cloud & DevOps"];

function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** The share card: kicker, big title, a line of context and the mini terminal. */
export function ogImage({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  const rows = buildStackOutput(getSkillGroups()).filter((r) =>
    MINI_GROUPS.map((g) => g.toLowerCase()).includes(r.label),
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: C.bg,
        color: C.text,
        padding: 64,
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: C.muted }}
      >
        <span style={{ color: C.accent }}>{kicker}</span>
        <span>sebastiannino.me</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
          {title}
        </div>
        <div style={{ fontSize: 34, color: C.muted, lineHeight: 1.3 }}>{subtitle}</div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          background: C.surface,
          border: `2px solid ${C.border}`,
          borderRadius: 20,
          padding: "22px 28px",
          fontSize: 24,
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          {/* ASCII ">": the default font has no ❯ glyph and would draw an empty box */}
          <span style={{ color: C.accent }}>{">"}</span>
          <span>{STACK_COMMAND}</span>
        </div>
        {rows.map((row) => (
          <div key={row.label} style={{ display: "flex", gap: 16, color: C.muted }}>
            <span style={{ width: 215, whiteSpace: "nowrap" }}>{row.label}</span>
            <span style={{ whiteSpace: "nowrap" }}>{clip(row.text, 52)}</span>
          </div>
        ))}
      </div>
    </div>,
    { ...OG_SIZE },
  );
}

/** The "sn." mark used as favicon and Apple touch icon. */
export function iconImage(size: number) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
        border: `${Math.max(1, Math.round(size / 16))}px solid ${C.border}`,
        borderRadius: Math.round(size / 5),
        color: C.accent,
        fontSize: Math.round(size * 0.52),
        fontWeight: 700,
        letterSpacing: -1,
      }}
    >
      sn
    </div>,
    { width: size, height: size },
  );
}

export const OG_ALT = `${SITE.name} — portfolio`;
