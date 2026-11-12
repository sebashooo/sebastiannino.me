"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";

type Status = "idle" | "copied" | "fallback";

type CopyEmailButtonProps = {
  email: string;
  /** id of the element that shows the email text; it gets selected if the Clipboard API fails. */
  targetId: string;
};

/**
 * Copies the email to the clipboard. The only client component in the page body.
 * - Success: "Copied" for ~2s, announced through a polite live region (text, not color alone).
 * - Clipboard API missing or rejected (insecure context, denied permission, old browser): the email
 *   text is selected and the message says to press Ctrl+C; it never throws.
 * The mailto link next to it keeps working without JavaScript.
 */
export function CopyEmailButton({ email, targetId }: CopyEmailButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function selectEmailText() {
    const node = document.getElementById(targetId);
    const selection = window.getSelection();
    if (!node || !selection) return;
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  async function copy() {
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(email);
      setStatus("copied");
      timer.current = setTimeout(() => setStatus("idle"), 2000);
    } catch {
      selectEmailText();
      setStatus("fallback");
      timer.current = setTimeout(() => setStatus("idle"), 6000);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="secondary" onClick={copy}>
        Copy<span className="sr-only"> email address</span>
      </Button>
      {/* Always in the DOM so screen readers announce changes to it */}
      <span role="status" aria-live="polite" className="font-mono text-sm text-text-body">
        {status === "copied" ? "Copied" : null}
        {status === "fallback" ? "Press Ctrl+C to copy" : null}
      </span>
    </div>
  );
}
