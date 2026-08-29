import { Trophy } from "lucide-react";

/** Brasão estilizado da Copa PMVR: escudo com troféu, inspirado na identidade oficial. */
export function Emblem({
  size = 64,
  tone = "lime",
}: {
  size?: number;
  tone?: "lime" | "dark" | "white";
}) {
  const stroke =
    tone === "lime" ? "#D7EF2A" : tone === "white" ? "#FFFFFF" : "#0A0A0A";
  const fillBg = tone === "lime" ? "#0A0A0A" : "transparent";

  return (
    <svg
      width={size}
      height={size * 1.08}
      viewBox="0 0 100 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M50 3
           C 30 3 12 10 12 26
           C 12 26 7 32 12 38
           C 16 43 20 39 23 43
           C 27 55 36 63 50 100
           C 64 63 73 55 77 43
           C 80 39 84 43 88 38
           C 93 32 88 26 88 26
           C 88 10 70 3 50 3 Z"
        fill={fillBg}
        stroke={stroke}
        strokeWidth={3.5}
        strokeLinejoin="round"
      />
      <path
        d="M50 12
           C 34 12 21 17 21 28
           C 21 28 17 33 21 37
           C 24 40 27 38 29 41
           C 33 51 40 58 50 86
           C 60 58 67 51 71 41
           C 73 38 76 40 79 37
           C 83 33 79 28 79 28
           C 79 17 66 12 50 12 Z"
        stroke={stroke}
        strokeWidth={1.6}
        strokeOpacity={0.55}
      />
      <foreignObject x="32" y="26" width="36" height="36">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Trophy size={22} color={stroke} strokeWidth={2.4} />
        </div>
      </foreignObject>
      <circle cx="50" cy="20" r="2.4" fill={stroke} />
    </svg>
  );
}
