/**
 * Everything the home scene needs to know about the clickable objects.
 * Coordinates are on the same 1600 x 900 canvas as components/scene/SceneArt.tsx.
 */

export type SceneId = "work" | "call" | "about" | "services" | "record" | "writing" | "resume" | "contact";

export type Hotspot = {
  id: SceneId;
  /** Where the object is, for the small "On the laptop" label in the panel. */
  object: string;
  /** Short label on the hotspot and in the contents list. */
  label: string;
  title: string;
  x: number;
  y: number;
};

export const hotspots: Hotspot[] = [
  { id: "work", object: "On the laptop", label: "Selected work", title: "Selected work", x: 850, y: 526 },
  { id: "call", object: "On the calendar", label: "Book a call", title: "Book a free call", x: 868, y: 212 },
  { id: "about", object: "In the frame", label: "About", title: "About me", x: 688, y: 360 },
  { id: "services", object: "On the whiteboard", label: "Services & pricing", title: "What I do, and what it costs", x: 1236, y: 202 },
  { id: "record", object: "On the sticky notes", label: "Track record", title: "Track record", x: 1334, y: 348 },
  { id: "writing", object: "On the bookshelf", label: "Writing", title: "Writing", x: 1504, y: 450 },
  { id: "resume", object: "In the cabinet", label: "Résumé", title: "Résumé", x: 1301, y: 604 },
  { id: "contact", object: "On the phone", label: "Contact", title: "Contact", x: 1024, y: 548 },
];

export const lampSpot = { x: 596, y: 500 };

export const isSceneId = (v: string | null): v is SceneId => !!v && hotspots.some((h) => h.id === v);

export const services = [
  { title: "AI & automation systems", desc: "Custom workflows in n8n, Make.com and AI agents that run around the clock without anyone watching them." },
  { title: "AI training & consulting", desc: "Programmes that help a team use AI tools with confidence, with hands-on labs and a roadmap for adoption." },
  { title: "Personal AI coaching", desc: "One-to-one sessions built around your role, whether you lead a team or run the whole business." },
  { title: "End-to-end delivery", desc: "From scoping and design through deployment, documentation and handover." },
];

export const stats = [
  { value: "1,500+", label: "Professionals trained" },
  { value: "10+", label: "Organizations served" },
  { value: "3+", label: "Years automating" },
  { value: "Worldwide", label: "Clients served remotely" },
];

export const links = {
  cal: "https://calendar.app.google/8Pfj98atpuSk14RH9",
  wa: "https://wa.me/2348139464398?text=Hi%20Israel%2C%20I%20will%20love%20to%20have%20conversations%20with%20you",
  email: "mailto:afolabiisraelolajide@gmail.com",
  linkedin: "https://www.linkedin.com/in/helloisrael/",
  github: "https://github.com/EasyTechp5",
};
