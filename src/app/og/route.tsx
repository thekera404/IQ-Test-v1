import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const width = 1200;
  const height = 630;

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #eef2ff, #e0e7ff)",
          color: "#111827",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 800, marginBottom: 16 }}>IQ Test</div>
        <div style={{ fontSize: 34, opacity: 0.8 }}>Test your cognitive abilities</div>
      </div>
    ),
    { width, height }
  );

  return new Response(image.body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}


