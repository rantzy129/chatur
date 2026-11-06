import { ImageResponse } from "next/og";
import { logoBase64 } from "@/lib/logo-base64";

export const runtime = "edge";

export const alt = "Red Line VIP - Undetected Assault Fire Cheat & Wallhack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          backgroundColor: "#0A0A0B",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background accent glow */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(229,57,53,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(229,57,53,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Top section: Real Web Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Logo container matching website styling */}
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              backgroundColor: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoBase64}
              alt="Red Line VIP Logo"
              width="48"
              height="48"
              style={{ objectFit: "contain" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: "1px",
                textTransform: "uppercase" as const,
              }}
            >
              RED LINE VIP
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "#71717A",
                letterSpacing: "2px",
                textTransform: "uppercase" as const,
              }}
            >
              ASSAULT FIRE CHEAT SUITE
            </span>
          </div>
        </div>

        {/* Center: Main headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "58px",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1.05,
              letterSpacing: "-2px",
              textTransform: "uppercase" as const,
              maxWidth: "900px",
            }}
          >
            UNDETECTED ASSAULT FIRE
          </div>
          <div
            style={{
              fontSize: "58px",
              fontWeight: 900,
              color: "#E53935",
              lineHeight: 1.05,
              letterSpacing: "-2px",
              textTransform: "uppercase" as const,
            }}
          >
            CHEAT & WALLHACK
          </div>
        </div>

        {/* Bottom: Feature pills */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            "WALLHACK ESP",
            "BONE SKELETON AIM",
            "DEVICE UNBAN",
            "STREAM-PROOF",
            "UNDETECTED",
          ].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 18px",
                borderRadius: "12px",
                backgroundColor: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: "13px",
                fontWeight: 700,
                color: "#D4D4D8",
                letterSpacing: "1px",
              }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#E53935",
                }}
              />
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
