import type { Metadata } from "next";
import Link from "next/link";
import AuditTool from "@/components/AuditTool";

export const metadata: Metadata = {
  title: "Free Automation Audit: Is This Process Worth Automating?",
  description:
    "Score any business process in three minutes against ten questions and find out whether it is worth automating, and what to fix first if it is not ready.",
  keywords: [
    "automation audit",
    "is it worth automating",
    "process automation checklist",
    "automation readiness assessment",
  ],
  alternates: { canonical: "https://israel.easytech365.com/automation-audit" },
};

export default function AutomationAuditPage() {
  return (
    <>
      <section className="relative overflow-hidden" style={{ paddingTop: "9rem", paddingBottom: "2.5rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div
          className="glow"
          style={{ top: "-6rem", left: "50%", transform: "translateX(-50%)", width: "30rem", height: "20rem", background: "var(--primary)" }}
          aria-hidden
        />
        <div className="container-narrow relative text-center hero-in">
          <span className="eyebrow justify-center">Free tool</span>
          <h1 className="mb-5 mx-auto" style={{ fontSize: "clamp(2.2rem, 4.8vw, 3.4rem)", fontWeight: 800 }}>
            Is this process <span style={{ color: "var(--primary-text)" }}>worth automating?</span>
          </h1>
          <p className="section-lead mx-auto text-center">
            Ten questions, three minutes. Pick one process that eats your time, answer honestly, and get a clear
            verdict plus the first things to fix. It will sometimes tell you not to bother, and that is the point.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: "4rem" }}>
        <div className="container-narrow">
          <AuditTool />
        </div>
      </section>

      <section className="section-padding section-alt" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="container-narrow">
          <h2 className="mb-5" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}>
            Why these ten questions
          </h2>
          <div className="prose">
            <p>
              Most automation projects that fail were never good candidates. They ran too rarely, changed too
              often, or relied on rules nobody had written down. These questions test for exactly those problems
              before any money is spent.
            </p>
            <p>
              A high score does not guarantee success, and a low one is not a verdict on your business. It tells you
              where the risk sits so you can deal with it first.
            </p>
            <p>If you want to go deeper, these are the guides I would read next:</p>
            <ul>
              <li>
                <Link href="/blog/ai-automation-for-small-business">AI automation for small business: where to actually start</Link>
              </li>
              <li>
                <Link href="/blog/ai-automation-mistakes">9 AI automation mistakes that quietly kill projects</Link>
              </li>
              <li>
                <Link href="/blog/measure-automation-roi">How to measure the ROI of an automation project</Link>
              </li>
              <li>
                <Link href="/blog/what-ai-automation-costs">What AI automation actually costs</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
