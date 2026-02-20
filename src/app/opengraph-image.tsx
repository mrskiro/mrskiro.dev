import { ImageResponse } from "next/og";

export const alt = "mrskiro.dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ fontSize: 32, fontFamily: "monospace", color: "#aa26ff" }}>mrskiro.dev</span>
    </div>,
    { ...size },
  );
}
