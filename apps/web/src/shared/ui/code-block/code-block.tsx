import { useState } from "react";
import { Button } from "@omni/core/react";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { highlight, type CodeLanguage } from "@/shared/lib/highlight";

export function CodeBlock(props: { code: string; label?: string; language?: CodeLanguage }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const code = props.code.trim();
  const lines = highlight(code, props.language ?? "tsx");

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      // clipboard is unavailable outside secure contexts or when permission is denied
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 2000);
  }

  return (
    <div className="code-block">
      {/* focusable so keyboard users can scroll long lines (WCAG 2.1.1) */}
      <pre tabIndex={0} aria-label={props.label ?? "Code"}>
        <code>
          {lines.map((tokens, line) => (
            <span key={line} className="code-block-line">
              {tokens.map((token, index) => (
                <span key={index} style={token.color ? { color: token.color } : undefined}>
                  {token.content}
                </span>
              ))}
              {line < lines.length - 1 && "\n"}
            </span>
          ))}
        </code>
      </pre>
      <Button variant="ghost" size="xs" class="code-block-copy" aria-label="Copy code" onClick={copy}>
        {status === "copied" ? <CheckIcon aria-hidden="true" size={14} weight="bold" /> : <CopyIcon aria-hidden="true" size={14} />}
      </Button>
      <span role="status" className="visually-hidden">
        {status === "copied" ? "Copied to clipboard" : status === "failed" ? "Copy failed" : ""}
      </span>
    </div>
  );
}
