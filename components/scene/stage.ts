import type { MutableRefObject } from "react";
import type { SceneId } from "@/lib/scene";

/** What the shell can ask a stage (2D drawing or 3D room) to do. */
export type StageApi = { zoomBy: (factor: number) => void; fit: () => void; /** Glide in through the doorway (3D only). */ enter?: () => void };

export type StageProps = {
  lamp: boolean;
  dark: boolean;
  open: SceneId | null;
  onOpen: (id: SceneId) => void;
  onLamp: () => void;
  /** Is the music playing, and a way to switch it (the turntable). */
  /** True when the doors will play, so the 3D stage waits to glide in. */
  intro?: boolean;
  music?: boolean;
  onMusic?: () => void;
  onReady: () => void;
  /** The 3D stage calls this if it cannot start, so the shell can fall back to the drawing. */
  onFail?: () => void;
  apiRef: MutableRefObject<StageApi | null>;
};
