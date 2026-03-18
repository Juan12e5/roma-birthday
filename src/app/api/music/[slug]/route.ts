import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";

const TRACKS: Record<string, string> = {
  main: "I Wanna Be Yours.mp3",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const filename = TRACKS[slug];

  if (!filename) {
    return new Response("Track not found", { status: 404 });
  }

  try {
    const absolutePath = path.join(
      process.cwd(),
      "src",
      "assets",
      "music",
      filename,
    );
    const fileBuffer = await fs.readFile(absolutePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Unable to load track", { status: 500 });
  }
}

