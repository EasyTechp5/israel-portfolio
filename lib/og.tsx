import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared renderer for social share cards (LinkedIn, WhatsApp, X, Slack...).
 *
 * Assets are read once at module scope. Fonts live in /assets and are committed
 * so the build never depends on a network call. The image renderer supports
 * flexbox only (no grid) and has a ~500KB budget for JSX + fonts + images.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const bold = await readFile(join(process.cwd(), "assets/Sora-Bold.ttf"));
const regular = await readFile(join(process.cwd(), "assets/Sora-Regular.ttf"));
const portraitB64 = (await readFile(join(process.cwd(), "assets/og-portrait.jpg"))).toString("base64");
const portraitSrc = `data:image/jpeg;base64,${portraitB64}`;

type Card = {
  kicker?: string;
  title: string;
  subtitle?: string;
  portrait?: boolean;
};

export function renderOg({ kicker, title, subtitle, portrait = true }: Card) {
  // With the portrait the column is narrow; without it the headline can use the full width.
  const titleSize = portrait
    ? title.length > 46 ? 58 : 68
    : title.length <= 45 ? 82 : title.length <= 70 ? 70 : title.length <= 95 ? 60 : 54;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "linear-gradient(135deg, #0b5ed7 0%, #003a96 52%, #06090f 100%)",
          fontFamily: "Sora",
          color: "#ffffff",
        }}
      >
        {/* soft decorative glows */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 560,
            height: 560,
            borderRadius: 560,
            background: "rgba(77,159,255,0.28)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -220,
            left: -140,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: "rgba(255,255,255,0.06)",
            display: "flex",
          }}
        />

        {/* left column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "62px 0 56px 72px",
            width: portrait ? 700 : 1100,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {kicker ? (
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  padding: "9px 20px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.16)",
                  border: "1px solid rgba(255,255,255,0.28)",
                  fontSize: 22,
                  fontWeight: 400,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 30,
                }}
              >
                {kicker}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                fontSize: titleSize,
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: -1.5,
              }}
            >
              {title}
            </div>

            {subtitle ? (
              <div
                style={{
                  display: "flex",
                  marginTop: 26,
                  fontSize: 28,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  color: "rgba(255,255,255,0.82)",
                  maxWidth: portrait ? 600 : 900,
                }}
              >
                {subtitle}
              </div>
            ) : null}
          </div>

          {/* signature */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 14,
                background: "#ffffff",
                color: "#0b5ed7",
                fontSize: 26,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 18,
              }}
            >
              IA
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", fontSize: 26, fontWeight: 700 }}>Israel Afolabi</div>
              <div
                style={{
                  display: "flex",
                  fontSize: 20,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.72)",
                  marginTop: 3,
                }}
              >
                AI Automation Engineer · israel.easytech365.com
              </div>
            </div>
          </div>
        </div>

        {/* portrait */}
        {portrait ? (
          <div
            style={{
              position: "absolute",
              right: 64,
              top: 62,
              width: 388,
              height: 506,
              display: "flex",
              borderRadius: 28,
              overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.45)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={portraitSrc}
              width={388}
              height={506}
              style={{ objectFit: "cover", objectPosition: "50% 22%" }}
              alt=""
            />
          </div>
        ) : null}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Sora", data: bold, weight: 700, style: "normal" },
        { name: "Sora", data: regular, weight: 400, style: "normal" },
      ],
    }
  );
}
