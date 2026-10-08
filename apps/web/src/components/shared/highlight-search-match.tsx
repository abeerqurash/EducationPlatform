/**
 * Highlight literal, case-insensitive search terms in already authorized result text.
 * React escapes every text segment; no HTML injection or browser DOM manipulation.
 */
export function HighlightSearchMatch({ text, query }: { text: string; query: string }) {
  const needle = query.trim();
  if (!needle || !text) return <>{text}</>;

  // Escape regex operators so punctuation is searched literally, not interpreted.
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(escaped, "gi");
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <mark key={`${match.index}-${parts.length}`} className="rounded-[3px] bg-amber-100 px-0.5 text-inherit decoration-clone">
        {match[0]}
      </mark>,
    );
    lastIndex = match.index + match[0].length;
    if (match[0].length === 0) pattern.lastIndex++;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts.length ? parts : text}</>;
}
