"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copyText}
      className="rounded-md border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-200 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300/60"
      aria-label="Copy request example"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
