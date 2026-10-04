import { renderOg, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "Israel Afolabi — AI Automation Blog";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return renderOg({
    kicker: "The Blog · AI Automation",
    title: "Practical guides on AI automation and AI agents",
    subtitle: "Written by a working AI automation engineer.",
  });
}
