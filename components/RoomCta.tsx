import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * A band above the footer that sends visitors back to the room: the home page
 * is the interactive desk, and the inner pages are its drawers.
 */
export default function RoomCta() {
  return (
    <section className="room-cta" aria-label="Back to the room">
      <div className="container-wide room-cta-inner">
        <span className="room-door" aria-hidden>
          <i />
          <i />
        </span>
        <div>
          <p className="mono-label" style={{ color: "rgba(255,255,255,0.7)" }}>The desk is still open</p>
          <h2 className="room-cta-title">Step back into the room.</h2>
        </div>
        <Link href="/" className="room-cta-btn">
          Enter <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
