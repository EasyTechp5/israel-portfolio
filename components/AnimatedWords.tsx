import { Fragment } from "react";

/**
 * Splits a headline into words that rise in one after another.
 * Pure CSS (see .word-in), so it plays on first paint with no JavaScript.
 */
export default function AnimatedWords({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <span className="word-in" style={{ "--w": i + offset } as React.CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
