"use client";

import { useSyncExternalStore } from "react";
import { startAmbient, stopAmbient } from "@/lib/ambient";

const KEY = "scene_muted_v1";

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("scene-muted", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("scene-muted", cb);
  };
}
const read = () => {
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

/** The room's soundtrack follows you through the inner pages: one small button to silence it. */
export default function MusicToggle() {
  const muted = useSyncExternalStore(subscribe, read, () => true);
  const toggle = () => {
    const next = !muted;
    try {
      window.localStorage.setItem(KEY, next ? "1" : "0");
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event("scene-muted"));
    if (next) stopAmbient();
    else startAmbient();
  };
  return (
    <button type="button" className="music-fab" onClick={toggle} aria-pressed={!muted} aria-label={muted ? "Turn the music on" : "Turn the music off"}>
      <span className="eq" data-on={!muted} aria-hidden><i /><i /><i /><i /></span>
    </button>
  );
}
