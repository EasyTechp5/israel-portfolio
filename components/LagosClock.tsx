"use client";

import { useSyncExternalStore } from "react";

const fmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
  hourCycle: "h23",
});

const subscribe = (notify: () => void) => {
  const id = window.setInterval(notify, 10_000);
  return () => window.clearInterval(id);
};

/**
 * The actual time in Lagos, ticking. It is the one live fact on the site that
 * is always true, and it tells a visitor in another time zone when to expect a reply.
 * Renders just "Lagos" on the server and fills in the time once it is in the browser.
 */
export default function LagosClock({ dot = true }: { dot?: boolean }) {
  const time = useSyncExternalStore(
    subscribe,
    () => fmt.format(new Date()),
    () => ""
  );

  return (
    <span suppressHydrationWarning>
      {dot && <span className="live-dot" aria-hidden />}
      Lagos{time ? ` ${time}` : ""}
    </span>
  );
}
