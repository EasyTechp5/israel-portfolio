"use client";

type Clock = { h: number; m: number; s: number } | null;

/**
 * The room, drawn as one SVG on a 1600 x 900 canvas. Everything is flat vector
 * art in the brand blue with cream paper and oak, so it is a few KB instead of
 * megabytes of 3D models. Small touches move (steam, cloud, the workflow on the
 * laptop, the clock hands) and the lamp changes the light.
 *
 * Positions here must match lib/scene.ts, which places the clickable hotspots.
 */
export default function SceneArt({ lamp, clock }: { lamp: boolean; clock: Clock }) {
  const hourDeg = clock ? ((clock.h % 12) + clock.m / 60) * 30 : 0;
  const minDeg = clock ? (clock.m + clock.s / 60) * 6 : 0;
  const secDeg = clock ? clock.s * 6 : 0;

  return (
    <svg
      viewBox="0 0 1600 900"
      width="1600"
      height="900"
      className="scene-art"
      role="img"
      aria-label="An illustrated desk in a blue room: a window, a framed portrait, a calendar, a whiteboard, a laptop, a phone, a lamp, a bookshelf and a filing cabinet."
    >
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#1665ec" />
          <stop offset="1" stopColor="#0a3b9c" />
        </linearGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a8d1ff" />
          <stop offset="1" stopColor="#e8f3ff" />
        </linearGradient>
        <linearGradient id="winlight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="oak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2bf8a" />
          <stop offset="1" stopColor="#c99a62" />
        </linearGradient>
        <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d2a6e" />
          <stop offset="1" stopColor="#081a47" />
        </linearGradient>
        <radialGradient id="lampGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#ffd77a" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffd77a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lampCone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe9a8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffe9a8" stopOpacity="0" />
        </linearGradient>
        <pattern id="boards" width="120" height="44" patternUnits="userSpaceOnUse">
          <rect width="120" height="44" fill="#ecdfc6" />
          <rect width="120" height="2" fill="#d6c6a4" />
          <rect x="58" y="0" width="2" height="44" fill="#d6c6a4" />
          <rect x="0" y="22" width="120" height="1.5" fill="#e0d2b3" />
          <rect x="28" y="22" width="1.5" height="22" fill="#e0d2b3" />
        </pattern>
        <clipPath id="portraitClip">
          <rect x="583" y="158" width="104" height="132" />
        </clipPath>
        <clipPath id="screenClip">
          <rect x="793" y="480" width="114" height="96" rx="3" />
        </clipPath>
      </defs>

      {/* ───────── Room ───────── */}
      {/* wall and floor run far past the canvas so a zoomed-out phone view never shows an edge */}
      <rect x="-3000" y="-3000" width="7600" height="3650" fill="url(#wall)" />
      {[0, 2, 4, 6].map((i) => (
        <rect key={i} x={i * 200 + 100} y="0" width="200" height="650" fill="#fff" opacity="0.035" />
      ))}
      {/* picture rail and skirting */}
      <rect x="-3000" y="86" width="7600" height="5" fill="#fff" opacity="0.14" />
      <rect x="-3000" y="632" width="7600" height="20" fill="#f6efdc" />
      <rect x="-3000" y="650" width="7600" height="3400" fill="url(#boards)" />
      <rect x="-3000" y="650" width="7600" height="6" fill="#000" opacity="0.08" />

      {/* light from the window falling across the floor */}
      <polygon points="150,470 360,470 700,900 200,900" fill="url(#winlight)" opacity="0.55" />

      {/* Wall decor sits a little lower so the controls at the top never cover it */}
      <g transform="translate(0 56)">
      {/* ───────── Window ───────── */}
      <g>
        <rect x="104" y="122" width="262" height="344" rx="6" fill="#f6efdc" />
        <rect x="118" y="136" width="234" height="316" fill="url(#sky)" />
        <path d="M118 380 C 160 340, 200 362, 240 336 S 320 340, 352 322 L352 452 L118 452 Z" fill="#8fbcf2" />
        <path d="M118 410 C 170 384, 220 404, 270 380 S 330 392, 352 380 L352 452 L118 452 Z" fill="#6fa2e6" />
        <g className="scene-cloud">
          <ellipse cx="190" cy="196" rx="44" ry="14" fill="#fff" opacity="0.9" />
          <ellipse cx="218" cy="186" rx="30" ry="14" fill="#fff" opacity="0.9" />
          <ellipse cx="300" cy="244" rx="34" ry="11" fill="#fff" opacity="0.8" />
        </g>
        <rect x="233" y="136" width="6" height="316" fill="#f6efdc" />
        <rect x="118" y="290" width="234" height="6" fill="#f6efdc" />
        <rect x="96" y="460" width="278" height="14" rx="3" fill="#efe5cc" />
      </g>

      {/* ───────── Portrait (About) ───────── */}
      <g>
        <rect x="560" y="136" width="150" height="178" rx="4" fill="#f6ecd2" stroke="#cdb98a" strokeWidth="3" />
        <rect x="572" y="148" width="126" height="154" fill="#fffdf6" />
        <image
          href="/images/israel-logo.jpg"
          x="583"
          y="156"
          width="104"
          height="136"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#portraitClip)"
        />
        <rect x="583" y="158" width="104" height="132" fill="none" stroke="#0a3b9c" strokeOpacity="0.25" />
        <rect x="598" y="322" width="74" height="14" rx="2" fill="#e8c872" />
        <text x="635" y="332.5" textAnchor="middle" fontSize="8.5" fontFamily="var(--font-mono), monospace" letterSpacing="1.5" fill="#4a3a12">
          ABOUT
        </text>
      </g>

      {/* ───────── Calendar (Book a call) ───────── */}
      <g>
        <rect x="764" y="142" width="124" height="156" rx="8" fill="#fffdf7" />
        <path d="M764 150 a8 8 0 0 1 8 -8 h108 a8 8 0 0 1 8 8 v34 h-124 z" fill="#0055da" />
        <circle cx="796" cy="142" r="5" fill="#f6efdc" />
        <circle cx="856" cy="142" r="5" fill="#f6efdc" />
        <text x="826" y="172" textAnchor="middle" fontSize="12" fontFamily="var(--font-mono), monospace" letterSpacing="2.5" fill="#fff">
          FREE CALL
        </text>
        <text x="826" y="246" textAnchor="middle" fontSize="58" fontFamily="var(--font-display), Georgia, serif" fill="#14161b">
          20
        </text>
        <circle cx="826" cy="232" r="38" fill="none" stroke="#e24d4d" strokeWidth="3" strokeDasharray="5 4" />
        <text x="826" y="278" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono), monospace" letterSpacing="2" fill="#5f636b">
          MINUTES
        </text>
      </g>

      {/* ───────── Whiteboard (Services) ───────── */}
      <g>
        <rect x="936" y="118" width="326" height="218" rx="6" fill="#f6efdc" />
        <rect x="946" y="128" width="306" height="190" rx="3" fill="#fbfdff" />
        <rect x="940" y="322" width="318" height="14" rx="3" fill="#e6dcc2" />
        <text x="966" y="166" fontSize="26" fontStyle="italic" fontFamily="var(--font-display), Georgia, serif" fill="#0a47b0">
          Show your working.
        </text>
        <path d="M968 176 C 1040 183, 1110 172, 1180 178" stroke="#f3dc72" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.9" />
        {[
          ["Discover", 962],
          ["Design", 1038],
          ["Deploy", 1114],
          ["Support", 1190],
        ].map(([label, x]) => (
          <g key={label as string}>
            <rect x={x as number} y="214" width="62" height="34" rx="7" fill="#e9f0ff" stroke="#0055da" strokeWidth="1.6" />
            <text x={(x as number) + 31} y="235" textAnchor="middle" fontSize="11" fontFamily="var(--font-mono), monospace" fill="#0a47b0">
              {label as string}
            </text>
          </g>
        ))}
        {[1024, 1100, 1176].map((x) => (
          <path key={x} d={`M${x} 231 h12`} stroke="#0055da" strokeWidth="1.6" />
        ))}
        <circle className="scene-packet" cx="962" cy="231" r="4.5" fill="#0055da" />
        <text x="966" y="288" fontSize="12" fontFamily="var(--font-mono), monospace" letterSpacing="1.5" fill="#5f636b">
          PROBLEM → METHOD → ANSWER
        </text>
      </g>

      {/* ───────── Clock (live Lagos time) ───────── */}
      <g>
        <circle cx="1410" cy="196" r="62" fill="#f6efdc" />
        <circle cx="1410" cy="196" r="54" fill="#fffdf7" stroke="#14161b" strokeWidth="2" />
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="1410"
            y1="148"
            x2="1410"
            y2={i % 3 === 0 ? 158 : 154}
            stroke="#14161b"
            strokeWidth={i % 3 === 0 ? 3 : 1.5}
            transform={`rotate(${i * 30} 1410 196)`}
          />
        ))}
        <text x="1410" y="222" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono), monospace" letterSpacing="2" fill="#5f636b">
          LAGOS
        </text>
        <g style={{ opacity: clock ? 1 : 0, transition: "opacity .4s" }}>
          <line x1="1410" y1="196" x2="1410" y2="168" stroke="#14161b" strokeWidth="4.5" strokeLinecap="round" transform={`rotate(${hourDeg} 1410 196)`} />
          <line x1="1410" y1="196" x2="1410" y2="156" stroke="#14161b" strokeWidth="3" strokeLinecap="round" transform={`rotate(${minDeg} 1410 196)`} />
          <line x1="1410" y1="206" x2="1410" y2="154" stroke="#e24d4d" strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${secDeg} 1410 196)`} />
        </g>
        <circle cx="1410" cy="196" r="4.5" fill="#14161b" />
      </g>

      {/* ───────── Sticky notes (Track record) ───────── */}
      <g>
        <g transform="rotate(-6 1300 290)">
          <rect x="1268" y="256" width="68" height="68" fill="#f3dc72" />
          <text x="1302" y="296" textAnchor="middle" fontSize="19" fontFamily="var(--font-display), Georgia, serif" fill="#14161b">1,500+</text>
          <text x="1302" y="312" textAnchor="middle" fontSize="7.5" fontFamily="var(--font-mono), monospace" letterSpacing="1" fill="#5a4a10">TRAINED</text>
        </g>
        <g transform="rotate(5 1352 300)">
          <rect x="1320" y="272" width="64" height="64" fill="#ffb3c4" />
          <text x="1352" y="306" textAnchor="middle" fontSize="22" fontFamily="var(--font-display), Georgia, serif" fill="#14161b">10+</text>
          <text x="1352" y="322" textAnchor="middle" fontSize="7.5" fontFamily="var(--font-mono), monospace" letterSpacing="1" fill="#6a2a3a">ORGS</text>
        </g>
        <g transform="rotate(-3 1370 262)">
          <rect x="1340" y="226" width="60" height="58" fill="#a8e6ff" />
          <text x="1370" y="258" textAnchor="middle" fontSize="22" fontFamily="var(--font-display), Georgia, serif" fill="#14161b">3+</text>
          <text x="1370" y="273" textAnchor="middle" fontSize="7.5" fontFamily="var(--font-mono), monospace" letterSpacing="1" fill="#1b4a63">YEARS</text>
        </g>
        <circle cx="1302" cy="262" r="3.5" fill="#e24d4d" />
        <circle cx="1352" cy="278" r="3.5" fill="#2b7bff" />
        <circle cx="1370" cy="232" r="3.5" fill="#14161b" />
      </g>

      </g>

      {/* ───────── Bookshelf (Writing) ───────── */}
      <g>
        <rect x="1436" y="262" width="136" height="392" rx="4" fill="#0a2d73" />
        <rect x="1446" y="272" width="116" height="372" fill="#0c3688" />
        {[400, 520].map((y) => (
          <rect key={y} x="1446" y={y} width="116" height="8" fill="#0a2d73" />
        ))}
        {/* books, top shelf */}
        {[
          [1452, 328, 14, "#f6efdc"], [1468, 316, 12, "#f3dc72"], [1482, 332, 16, "#9cc3ff"], [1500, 322, 12, "#ffb3c4"],
          [1514, 330, 14, "#f6efdc"], [1530, 318, 18, "#2b7bff"],
        ].map(([x, y, w, c], i) => (
          <rect key={`a${i}`} x={x as number} y={y as number} width={w as number} height={400 - (y as number)} fill={c as string} />
        ))}
        {/* middle shelf */}
        {[
          [1452, 436, 16, "#9cc3ff"], [1470, 424, 12, "#f6efdc"], [1484, 440, 14, "#f3dc72"], [1500, 430, 16, "#ffb3c4"], [1518, 438, 12, "#f6efdc"],
        ].map(([x, y, w, c], i) => (
          <rect key={`b${i}`} x={x as number} y={y as number} width={w as number} height={520 - (y as number)} fill={c as string} />
        ))}
        <rect x="1536" y="446" width="20" height="74" fill="#f6efdc" transform="rotate(12 1546 520)" />
        {/* lower shelf: a box and a trophy-like plant pot */}
        <rect x="1456" y="560" width="46" height="68" fill="#f6efdc" />
        <rect x="1456" y="560" width="46" height="10" fill="#e6dcc2" />
        <rect x="1512" y="590" width="38" height="38" rx="4" fill="#f3dc72" />
        {/* plant on top */}
        <rect x="1484" y="228" width="40" height="34" rx="4" fill="#f6efdc" />
        <g className="scene-sway" style={{ transformOrigin: "1504px 230px" }}>
          <path d="M1504 230 C 1488 200, 1480 184, 1470 176 C 1494 180, 1504 200, 1504 230Z" fill="#2fa86a" />
          <path d="M1504 230 C 1512 196, 1524 182, 1542 172 C 1530 196, 1516 210, 1504 230Z" fill="#37c27a" />
          <path d="M1504 230 C 1500 206, 1502 192, 1506 168 C 1514 192, 1512 210, 1504 230Z" fill="#26905a" />
        </g>
      </g>

      {/* ───────── Filing cabinet (Résumé) ───────── */}
      <g>
        <rect x="1214" y="528" width="174" height="170" rx="4" fill="#f6efdc" />
        <rect x="1214" y="528" width="174" height="12" rx="4" fill="#e6dcc2" />
        {[546, 622].map((y) => (
          <g key={y}>
            <rect x="1224" y={y} width="154" height="66" rx="3" fill="#fffdf7" stroke="#d9c9a4" />
            <rect x="1281" y={y + 22} width="40" height="9" rx="4.5" fill="#0055da" />
            <rect x="1250" y={y + 40} width="102" height="14" rx="2" fill="#eef2ff" stroke="#c9d6f5" />
            <text x="1301" y={y + 50.5} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono), monospace" letterSpacing="1.6" fill="#0a47b0">
              {y === 546 ? "RÉSUMÉ" : "CASES"}
            </text>
          </g>
        ))}
        {/* papers and tray on top */}
        <rect x="1232" y="508" width="70" height="20" rx="2" fill="#fffdf7" stroke="#d9c9a4" />
        <rect x="1238" y="500" width="62" height="10" rx="2" fill="#fff" stroke="#d9c9a4" />
        <rect x="1330" y="504" width="40" height="24" rx="3" fill="#0055da" />
        <rect x="1330" y="504" width="40" height="7" rx="3" fill="#2b7bff" />
      </g>

      {/* ───────── Rug and shadows ───────── */}
      <ellipse cx="800" cy="812" rx="470" ry="64" fill="#f6efdc" />
      <ellipse cx="800" cy="812" rx="470" ry="64" fill="none" stroke="#0a3b9c" strokeWidth="8" opacity="0.55" />
      <ellipse cx="800" cy="812" rx="420" ry="52" fill="none" stroke="#0a3b9c" strokeWidth="2" opacity="0.4" />
      <ellipse cx="800" cy="790" rx="380" ry="22" fill="#000" opacity="0.14" />
      <ellipse cx="1300" cy="704" rx="108" ry="10" fill="#000" opacity="0.12" />
      <ellipse cx="1504" cy="660" rx="90" ry="9" fill="#000" opacity="0.12" />

      {/* ───────── Desk ───────── */}
      <g>
        <rect x="462" y="620" width="14" height="150" fill="#0a2d73" />
        <rect x="1124" y="620" width="14" height="150" fill="#0a2d73" />
        <rect x="462" y="758" width="52" height="12" rx="3" fill="#0a2d73" />
        <rect x="1086" y="758" width="52" height="12" rx="3" fill="#0a2d73" />
        <rect x="440" y="586" width="720" height="26" rx="5" fill="url(#oak)" />
        <rect x="440" y="606" width="720" height="8" rx="3" fill="#b9894f" />
        <rect x="476" y="614" width="648" height="26" fill="#0a2d73" opacity="0.92" />
      </g>

      {/* notebook and pen */}
      <g>
        <rect x="622" y="571" width="94" height="15" rx="2" fill="#fffdf7" stroke="#d9c9a4" />
        <rect x="622" y="571" width="14" height="15" rx="2" fill="#0055da" />
        <line x1="650" y1="578" x2="704" y2="578" stroke="#c9d6f5" strokeWidth="1.5" />
        <line x1="650" y1="582" x2="690" y2="582" stroke="#c9d6f5" strokeWidth="1.5" />
        <rect x="690" y="564" width="42" height="4" rx="2" fill="#f3dc72" transform="rotate(-8 690 566)" />
      </g>

      {/* ───────── Laptop (Selected work) ───────── */}
      <g>
        <path d="M758 586 L942 586 L958 602 L742 602 Z" fill="#dfe3ea" />
        <rect x="742" y="600" width="216" height="4" rx="2" fill="#bcc3cf" />
        <rect x="782" y="468" width="136" height="118" rx="7" fill="#14161b" />
        <rect x="793" y="480" width="114" height="96" rx="3" fill="url(#screen)" />
        <g clipPath="url(#screenClip)">
          <rect x="800" y="488" width="46" height="5" rx="2.5" fill="#9cc3ff" opacity="0.7" />
          <rect x="800" y="498" width="70" height="4" rx="2" fill="#9cc3ff" opacity="0.35" />
          {[800, 828, 856, 884].map((x, i) => (
            <rect key={x} x={x} y="524" width="18" height="16" rx="4" fill={i === 3 ? "#37c27a" : "#2b7bff"} />
          ))}
          {[818, 846, 874].map((x) => (
            <line key={x} x1={x} y1="532" x2={x + 10} y2="532" stroke="#9cc3ff" strokeWidth="1.5" />
          ))}
          <circle className="scene-packet-sm" cx="800" cy="532" r="3.2" fill="#fff" />
          <rect x="800" y="554" width="26" height="4" rx="2" fill="#37c27a" opacity="0.8" />
          <rect x="800" y="562" width="48" height="3" rx="1.5" fill="#9cc3ff" opacity="0.3" />
        </g>
        <circle cx="850" cy="474" r="1.8" fill="#3a3f4b" />
      </g>

      {/* ───────── Phone (Contact) ───────── */}
      <g>
        <rect x="1000" y="582" width="48" height="6" rx="3" fill="#0a2d73" />
        <rect x="1002" y="508" width="44" height="78" rx="8" fill="#14161b" />
        <rect x="1006" y="514" width="36" height="66" rx="5" fill="#0d1f4d" />
        <rect x="1010" y="524" width="22" height="11" rx="4" fill="#2fbf71" />
        <rect x="1016" y="540" width="22" height="11" rx="4" fill="#fffdf7" />
        <rect x="1010" y="556" width="18" height="9" rx="4" fill="#2fbf71" />
        <circle className="scene-ping" cx="1040" cy="516" r="3.2" fill="#e24d4d" />
      </g>

      {/* ───────── Mug with steam ───────── */}
      <g>
        <rect x="1086" y="556" width="34" height="30" rx="5" fill="#fffdf7" stroke="#d9c9a4" />
        <rect x="1086" y="566" width="34" height="6" fill="#0055da" />
        <path d="M1120 564 q14 2 12 12 q-2 8 -12 8" fill="none" stroke="#d9c9a4" strokeWidth="4" strokeLinecap="round" />
        <g stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.7">
          <path className="scene-steam" d="M1096 548 q-5 -8 0 -14 q5 -6 0 -14" />
          <path className="scene-steam s2" d="M1105 548 q-5 -8 0 -14 q5 -6 0 -14" />
          <path className="scene-steam s3" d="M1114 548 q-5 -8 0 -14 q5 -6 0 -14" />
        </g>
      </g>

      {/* ───────── Small desk plant ───────── */}
      <g>
        <path d="M978 586 l4 -26 h26 l4 26 z" fill="#f6efdc" />
        <path d="M995 560 C 984 542, 980 532, 976 522 C 992 528, 998 542, 995 560Z" fill="#2fa86a" />
        <path d="M995 560 C 1002 540, 1010 530, 1022 524 C 1014 542, 1004 552, 995 560Z" fill="#37c27a" />
      </g>

      {/* ───────── Desk lamp (toggles the light) ───────── */}
      <g>
        <ellipse cx="540" cy="585" rx="30" ry="6" fill="#0a2d73" />
        <rect x="534" y="574" width="12" height="12" rx="3" fill="#0a2d73" />
        <polyline points="540,576 560,516 606,486" fill="none" stroke="#f6efdc" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="560" cy="516" r="6" fill="#e8c872" />
        <path d="M588 470 L640 478 L628 514 L584 500 Z" fill={lamp ? "#fff1c2" : "#f6efdc"} stroke="#d9c9a4" />
        {lamp && <circle cx="612" cy="502" r="6" fill="#fff6d6" />}
      </g>

      {/* ───────── Chair (pulled out at the left end of the desk) ───────── */}
      <g transform="translate(-248 0)">
        <rect x="570" y="626" width="132" height="22" rx="10" fill="#0a2d73" />
        <rect x="610" y="648" width="12" height="96" fill="#14161b" />
        <path d="M548 760 H 740 L 720 776 H 568 Z" fill="#14161b" />
        <circle cx="560" cy="780" r="9" fill="#14161b" />
        <circle cx="730" cy="780" r="9" fill="#14161b" />
        <circle cx="646" cy="786" r="9" fill="#14161b" />
        <rect x="560" y="520" width="146" height="132" rx="42" fill="#0b3a8f" />
        <rect x="574" y="534" width="118" height="104" rx="34" fill="#134fc2" />
        <rect x="596" y="500" width="76" height="26" rx="13" fill="#f6efdc" />
      </g>

      {/* ───────── Light ───────── */}
      {/* soft night tint, only shown in dark mode (see .sc-night in CSS) */}
      <rect className="sc-night" x="-3000" y="-3000" width="7600" height="7000" fill="#020a26" />
      {/* lamp light: always a hint of warmth when on, strong at night */}
      <g className={`sc-lamp ${lamp ? "on" : ""}`} style={{ mixBlendMode: "screen" }}>
        <polygon points="588,476 640,484 800,640 470,640" fill="url(#lampCone)" />
        <circle cx="612" cy="496" r="260" fill="url(#lampGlow)" />
      </g>
    </svg>
  );
}
