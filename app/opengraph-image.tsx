import { renderOg, OG_SIZE, OG_TYPE } from "@/lib/og";

export const alt = "Israel Afolabi — AI Automation Engineer";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return renderOg({
    kicker: "AI Automation · Agentic AI",
    title: "I build AI systems that make your business run itself",
    subtitle: "Automation, AI agents and training for businesses that want their time back.",
  });
}
