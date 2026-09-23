import { ImageResponse } from "next/og";

import { SITE_URL } from "./lib/site";

export const alt = "Walid Idrissi — Software Engineering Student";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          color: "#f4efe6",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, letterSpacing: 6, color: "#8f8b84" }}>
          SOFTWARE ENGINEERING · MARRAKECH
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 86, fontWeight: 700, letterSpacing: -3 }}>
            Walid Idrissi
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 34, color: "#aaa49a" }}>
            Full-stack applications · AWS cloud infrastructure · developer tools
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#6f6b65" }}>
          {new URL(SITE_URL).host}
        </div>
      </div>
    ),
    size,
  );
}
