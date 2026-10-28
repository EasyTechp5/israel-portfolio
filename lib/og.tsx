import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared renderer for social share cards (LinkedIn, WhatsApp, X, Slack...).
 *
 * The card is the home scene in miniature: the blue wall, the cream floor, your
 * portrait framed on the wall and a serif headline, so a shared link looks like
 * the site it leads to.
 *
 * Assets are read once at module scope. Fonts live in /assets and are committed
 * so the build never depends on a network call. The image renderer supports
 * flexbox only (no grid) and has a ~500KB budget for JSX + fonts + images.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const serif = await readFile(join(process.cwd(), "assets/Newsreader-Medium.ttf"));
const mono = await readFile(join(process.cwd(), "assets/PlexMono-Medium.ttf"));
const portraitB64 = (await readFile(join(process.cwd(), "assets/og-portrait.jpg"))).toString("base64");
const portraitSrc = `data:image/jpeg;base64,${portraitB64}`;

type Card = {
  kicker?: string;
  title: string;
  subtitle?: string;
  portrait?: boolean;
};

const FLOOR = 124;

export function renderOg({ kicker, title, subtitle, portrait = true }: Card) {
  // With the framed portrait the headline column is narrower.
  const titleSize = portrait
    ? title.length > 46 ? 62 : 76
    : title.length <= 45 ? 92 : title.length <= 70 ? 80 : title.length <= 95 ? 68 : 60;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(160deg, #1665ec 0%, #0a3b9c 100%)",
          fontFamily: "Newsreader",
          color: "#ffffff",
        }}
      >
        {/* paper-light stripes on the wall */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: 150 + i * 400,
              width: 200,
              height: 630 - FLOOR,
              background: "rgba(255,255,255,0.035)",
              display: "flex",
            }}
          />
        ))}

        {/* floor with skirting board */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: FLOOR,
            background: "#eadfc8",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: FLOOR,
            height: 16,
            background: "#f6efdc",
            display: "flex",
          }}
        />

        {/* masthead */}
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 72,
            right: 72,
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: 14,
            borderBottom: "1px solid rgba(255,255,255,0.32)",
            fontFamily: "Plex Mono",
            fontSize: 17,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <div style={{ display: "flex" }}>Show your working</div>
          <div style={{ display: "flex" }}>israel.easytech365.com</div>
        </div>

        {/* headline column */}
        <div
          style={{
            position: "absolute",
            top: 110,
            left: 72,
            width: portrait ? 640 : 1056,
            height: 630 - FLOOR - 110 - 28,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          {kicker ? (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                marginBottom: 24,
                padding: "6px 14px",
                background: "#f3dc72",
                color: "#14161b",
                fontFamily: "Plex Mono",
                fontSize: 19,
                letterSpacing: 2.5,
                textTransform: "uppercase",
              }}
            >
              {kicker}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              fontSize: titleSize,
              fontWeight: 500,
              lineHeight: 1.06,
              letterSpacing: -2,
            }}
          >
            {title}
          </div>

          {subtitle ? (
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: 30,
                lineHeight: 1.3,
                color: "rgba(255,255,255,0.86)",
                maxWidth: portrait ? 600 : 900,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        {/* portrait, framed on the wall like the one in the room */}
        {portrait ? (
          <div
            style={{
              position: "absolute",
              right: 84,
              top: 88,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                padding: 16,
                background: "#f6ecd2",
                border: "4px solid #cdb98a",
                boxShadow: "0 22px 40px rgba(2,14,46,0.35)",
              }}
            >
              <div style={{ display: "flex", padding: 12, background: "#fffdf6" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={portraitSrc}
                  width={252}
                  height={292}
                  style={{ objectFit: "cover", objectPosition: "50% 22%" }}
                  alt=""
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 14,
                padding: "5px 22px",
                background: "#e8c872",
                color: "#4a3a12",
                fontFamily: "Plex Mono",
                fontSize: 15,
                letterSpacing: 3,
              }}
            >
              ABOUT
            </div>
          </div>
        ) : null}

        {/* signature, standing on the floor */}
        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 0,
            height: FLOOR,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={portraitSrc}
            width={64}
            height={64}
            style={{ borderRadius: 32, objectFit: "cover", objectPosition: "50% 18%", border: "3px solid #0055da" }}
            alt=""
          />
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 18 }}>
            <div style={{ display: "flex", fontSize: 32, fontWeight: 500, color: "#0a2d73", letterSpacing: -0.5 }}>
              Israel Afolabi
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 2,
                fontFamily: "Plex Mono",
                fontSize: 16,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: "#3a4a6b",
              }}
            >
              AI automation engineer
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Newsreader", data: serif, weight: 500, style: "normal" },
        { name: "Plex Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}
