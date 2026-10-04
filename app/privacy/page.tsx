import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Israel Afolabi",
  description:
    "What personal information this website collects, why, who handles it, how long it is kept, and how to access, correct or delete it.",
  alternates: { canonical: "https://israel.easytech365.com/privacy" },
};

const EMAIL = "afolabiisraelolajide@gmail.com";
const UPDATED = "4 October 2026";

export default function PrivacyPage() {
  return (
    <>
      <header className="relative overflow-hidden" style={{ paddingTop: "9rem", paddingBottom: "2.5rem" }}>
        <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
        <div className="container-narrow relative hero-in">
          <span className="eyebrow">Legal</span>
          <h1 className="mb-4" style={{ fontSize: "clamp(2.2rem, 4.6vw, 3.2rem)", fontWeight: 800 }}>
            Privacy Policy
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Plain-language, and specific to this website. Last updated {UPDATED}.
          </p>
        </div>
      </header>

      <div className="container-narrow" style={{ paddingBottom: "6rem" }}>
        <article className="prose">
          <p className="lead">
            This website, <strong>israel.easytech365.com</strong>, is run by Israel Afolabi from Lagos,
            Nigeria. I collect as little personal information as I can, and this page explains exactly what
            I do collect and why.
          </p>

          <h2 id="who">Who is responsible</h2>
          <p>
            I am the person responsible for your information on this site. You can reach me at{" "}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a> about anything on this page.
          </p>

          <h2 id="what">What I collect</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>When</th>
                  <th>What</th>
                  <th>Why</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>You fill in the signup popup</td>
                  <td>Your name and email address</td>
                  <td>To send you updates and practical emails on AI and automation, if you asked for them</td>
                </tr>
                <tr>
                  <td>You contact me (WhatsApp, email, booking a call)</td>
                  <td>Whatever you choose to send, such as your name, number and the details of your enquiry</td>
                  <td>To reply to you and discuss working together</td>
                </tr>
                <tr>
                  <td>You visit the site</td>
                  <td>
                    Which pages were viewed, the site you came from, and your approximate country, browser and
                    device type
                  </td>
                  <td>To understand which content is useful and to keep the site working well</td>
                </tr>
                <tr>
                  <td>You use the site</td>
                  <td>
                    Small settings saved in your own browser: your light or dark theme, and whether you have
                    seen or dismissed the signup popup
                  </td>
                  <td>To remember your choices. These never leave your device</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            I do not collect payment details on this site, and I do not ask for sensitive personal
            information. Please do not send any in a message.
          </p>

          <h2 id="analytics">Analytics and cookies</h2>
          <p>
            Visit statistics come from Vercel Web Analytics, which does not use cookies and does not follow
            you around other websites or build a profile of you. I do not use advertising trackers or sell
            data to anyone.
          </p>
          <p>
            If you press play on the intro video, it loads from YouTube using its privacy-enhanced mode. YouTube
            only loads when you choose to play, and YouTube&apos;s own privacy policy applies from that point.
          </p>

          <h2 id="basis">Why I am allowed to use your information</h2>
          <ul>
            <li>
              <strong>Your consent</strong>, for the signup popup. You can withdraw it at any time.
            </li>
            <li>
              <strong>Responding to you</strong>, when you contact me or ask about working together.
            </li>
            <li>
              <strong>My legitimate interest</strong> in understanding how the site is used so I can improve it,
              in a way that is not intrusive.
            </li>
          </ul>

          <h2 id="shared">Who handles your information</h2>
          <p>I use a small number of services to run this site. They process information on my behalf:</p>
          <ul>
            <li>
              <strong>Vercel</strong>: hosts the website and provides the visit statistics.
            </li>
            <li>
              <strong>Supabase</strong>: the database where signups are stored.
            </li>
            <li>
              <strong>An email delivery service</strong> (currently Resend): sends emails if you have subscribed.
            </li>
            <li>
              <strong>Google</strong>: provides the booking calendar and, if you email me, Gmail.
            </li>
            <li>
              <strong>WhatsApp (Meta)</strong>: if you message me there.
            </li>
            <li>
              <strong>YouTube (Google)</strong>: if you play the intro video.
            </li>
          </ul>
          <p>
            I do not sell your information, and I do not share it with anyone else unless the law requires
            it.
          </p>

          <h2 id="transfers">Where it is processed</h2>
          <p>
            These providers operate internationally, so your information may be processed outside Nigeria,
            including in Europe and the United States. I choose providers that protect data to a recognised
            standard.
          </p>

          <h2 id="retention">How long I keep it</h2>
          <ul>
            <li>
              <strong>Signups</strong>: until you unsubscribe or ask me to delete them.
            </li>
            <li>
              <strong>Enquiries</strong>: only as long as needed to deal with your request and any working
              relationship that follows.
            </li>
            <li>
              <strong>Visit statistics</strong>: in a form that does not identify you, for as long as the
              analytics provider retains them.
            </li>
          </ul>

          <h2 id="rights">Your rights</h2>
          <p>
            Under the Nigeria Data Protection Act 2023, and the GDPR or UK GDPR where they apply to you, you
            can ask me to:
          </p>
          <ul>
            <li>tell you what I hold about you and give you a copy;</li>
            <li>correct anything that is wrong;</li>
            <li>delete your information;</li>
            <li>stop using it for a particular purpose, including email;</li>
            <li>withdraw your consent at any time, without affecting anything done before.</li>
          </ul>
          <p>
            Email me and I will respond promptly. If you are not happy with how I handle your information,
            you also have the right to complain to the Nigeria Data Protection Commission, or to the data
            protection authority where you live.
          </p>

          <h2 id="unsubscribe">Unsubscribing</h2>
          <p>
            Every email I send includes an unsubscribe link. You can also email me and ask to be removed, and
            it will be done.
          </p>

          <h2 id="children">Children</h2>
          <p>
            This site is for professionals and businesses. It is not aimed at anyone under 18, and I do not
            knowingly collect their information.
          </p>

          <h2 id="links">Other websites</h2>
          <p>
            The site links to other websites such as LinkedIn, GitHub and YouTube. I am not responsible for
            their privacy practices, so please read theirs.
          </p>

          <h2 id="changes">Changes to this page</h2>
          <p>
            If I change how I handle information, I will update this page and the date at the top.
          </p>

          <h2 id="contact">Contact</h2>
          <p>
            Questions or requests about your information: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. You can
            also <Link href="/contact">use the contact page</Link>.
          </p>
        </article>
      </div>
    </>
  );
}
