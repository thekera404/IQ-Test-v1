import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;

  const manifest: Record<string, any> = {
    name: "IQ Test",
    description: "Test your IQ",
    version: "1",
    miniapp: {
      version: "1",
      name: "IQ Test",
      iconUrl: `${origin}/icon.png`,
      homeUrl: `${origin}/`,
      imageUrl: `${origin}/og`,
      buttonTitle: "Start IQ Test",
      splashImageUrl: `${origin}/icon.png`,
      splashBackgroundColor: "#4F46E5",
    },
    display: {
      recommended_frame_height: "tall",
    },
    capabilities: {
      frames: {
        status: "supported",
      },
    },
    icons: {
      "192x192": `${origin}/icon.png`,
    },
  };

  // Optionally include Farcaster account association if provided via env
  const header = process.env.FARCASTER_ACCOUNT_ASSOCIATION_HEADER;
  const payload = process.env.FARCASTER_ACCOUNT_ASSOCIATION_PAYLOAD;
  const signature = process.env.FARCASTER_ACCOUNT_ASSOCIATION_SIGNATURE;
  if (header && payload && signature) {
    manifest.accountAssociation = {
      header,
      payload,
      signature,
    };
  }

  const res = NextResponse.json(manifest);
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Cache-Control", "public, max-age=3600, immutable");
  res.headers.set("Content-Type", "application/json");
  return res;
}


