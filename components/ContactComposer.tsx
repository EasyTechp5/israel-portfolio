"use client";

import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";

const TOPICS = ["Automate a process", "Train my team", "AI consultation", "Something else"];
const WA = "https://wa.me/2348139464398?text=";
const EMAIL = "afolabiisraelolajide@gmail.com";

/**
 * Write the first message here, then send it on WhatsApp or by email. Nothing is
 * stored: the text goes straight into the chat or mail app, so it needs no server.
 */
export default function ContactComposer() {
  const [name, setName] = useState("");
  const [topic, setTopic] = useState(TOPICS[0]);
  const [note, setNote] = useState("");

  const intro = name.trim() ? `Hi Israel, I'm ${name.trim()}.` : "Hi Israel,";
  const message = `${intro} I'd like help with: ${topic.toLowerCase()}.${note.trim() ? `\n\n${note.trim()}` : ""}`;

  return (
    <div className="card composer">
      <div className="composer-head">
        <p className="mono-label">Prefer to write it down?</p>
        <h3>Start the conversation here</h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Fill in a line or two and send it on WhatsApp or email. It opens in your own app, ready to send.
        </p>
      </div>

      <label className="composer-label" htmlFor="c-name">Your name</label>
      <input id="c-name" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" autoComplete="name" />

      <span className="composer-label" id="c-topic">What do you need?</span>
      <div className="chips" role="group" aria-labelledby="c-topic">
        {TOPICS.map((t) => (
          <button key={t} type="button" className="topic-chip" aria-pressed={topic === t} onClick={() => setTopic(t)}>
            {t}
          </button>
        ))}
      </div>

      <label className="composer-label" htmlFor="c-note">A few details (optional)</label>
      <textarea id="c-note" className="field" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What takes up your week? What would you like to stop doing by hand?" />

      <div className="composer-preview" aria-live="polite">
        <span className="mono-label">Your message</span>
        <p>{message}</p>
      </div>

      <div className="composer-actions">
        <a href={`${WA}${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp btn-lg">
          <MessageCircle className="h-[18px] w-[18px]" /> Send on WhatsApp
        </a>
        <a href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Enquiry: ${topic}`)}&body=${encodeURIComponent(message)}`} className="btn-secondary btn-lg">
          <Mail className="h-[18px] w-[18px]" /> Send by email
        </a>
      </div>
    </div>
  );
}
