import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "public/images/reservation-dining.jpg");
const outDir = resolve(root, "public/video");
const outFile = resolve(outDir, "dining-motion.mp4");

if (!ffmpegPath) {
  console.error("ffmpeg-static not found");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

console.log("Generating dining-motion.mp4 from", source);

const complexFilter = [
  "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.00035,1.08)':d=240:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080:fps=30,split=2[fwd][rev_in]",
  "[rev_in]reverse[rev]",
  "[fwd][rev]concat=n=2:v=1[v]"
].join(";");

execFileSync(ffmpegPath, [
  "-y",
  "-loop", "1",
  "-i", source,
  "-filter_complex", complexFilter,
  "-map", "[v]",
  "-c:v", "libx264",
  "-t", "16",
  "-pix_fmt", "yuv420p",
  "-preset", "medium",
  "-crf", "20",
  outFile
], { stdio: "inherit" });

console.log("Created", outFile);
