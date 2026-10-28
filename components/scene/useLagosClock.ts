"use client";

import { useSyncExternalStore } from "react";

const lagos = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZone: "Africa/Lagos",
  hourCycle: "h23",
});
const lagosKey = () => lagos.format(new Date());
const subscribeSecond = (cb: () => void) => {
  const id = window.setInterval(cb, 1000);
  return () => window.clearInterval(id);
};

/** The real time in Lagos, ticking every second. Null on the server. */
export function useLagosClock() {
  const key = useSyncExternalStore(subscribeSecond, lagosKey, () => "");
  if (!key) return null;
  const [h, m, s] = key.split(":").map(Number);
  return { h, m, s };
}
