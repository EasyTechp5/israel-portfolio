import { MessageCircle, Calendar, ArrowRight } from "lucide-react";

const CAL = "https://calendar.app.google/6EJ6aPfh3ScRUw6V9";

/**
 * End-of-article call to action. The WhatsApp link is pre-filled with the
 * post title so Israel can see which article the enquiry came from.
 */
export default function PostCta({ postTitle }: { postTitle: string }) {
  const wa = `https://wa.me/2348139464398?text=${encodeURIComponent(
    `Hi Israel, I just read your article "${postTitle}" and I am interested in your AI automation services.`
  )}`;

  return (
    <aside
      className="rounded-2xl p-8 sm:p-10 mt-14"
      style={{
        background: "linear-gradient(135deg, var(--primary-fill) 0%, #003a96 100%)",
        boxShadow: "var(--shadow-lg)",
      }}
    >
      <div
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-5"
        style={{ backgroundColor: "rgba(255,255,255,0.16)", color: "#fff" }}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        Work with me
      </div>

      <h2 className="mb-4" style={{ color: "#fff", fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}>
        Want this built for your business?
      </h2>

      <p className="mb-8 max-w-2xl leading-relaxed" style={{ color: "rgba(255,255,255,0.86)" }}>
        I design and build AI automation systems that remove manual work — invoicing,
        customer support, lead qualification, reporting and more. If any of this sounded
        like your business, <strong style={{ color: "#fff" }}>send me a DM</strong> and tell
        me what is eating your week. I will tell you honestly whether automation is worth
        it for your situation.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lg inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-transform hover:-translate-y-0.5"
          style={{ backgroundColor: "#fff", color: "var(--primary-text)", boxShadow: "var(--shadow-md)" }}
        >
          <MessageCircle className="w-[18px] h-[18px]" /> DM me on WhatsApp
          <ArrowRight className="w-4 h-4" />
        </a>
        <a
          href={CAL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lg inline-flex items-center justify-center gap-2 rounded-xl font-semibold"
          style={{
            backgroundColor: "rgba(255,255,255,0.14)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <Calendar className="w-[18px] h-[18px]" /> Book a free 20-min call
        </a>
      </div>

      <p className="mt-5 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
        No pitch, no obligation — just a straight answer.
      </p>
    </aside>
  );
}
