/**
 * Builds the web video for the pinned journey section.
 *
 *   source : public/cake.mp4          (10.01s client master, 1280x720, has audio)
 *   output : public/video/cake.mp4    (seamless loop, silent, web-optimised)
 *
 * Two things this has to deal with:
 *
 * 1. SHOT SELECTION. The master is a 10s montage: a wide sauce-pour shot, then
 *    tight close-ups from other angles. Only the opening wide shot suits this
 *    layout, which sets copy on the left and the plate on the right. Verified
 *    by psnr against public/Exquisite/ezgif-frame-001.jpg: 53.3 dB at t=0, i.e.
 *    the frame sequence is literally the head of this file. t=2.4s is still the
 *    same shot; the dissolve to the close-ups starts after that.
 *
 * 2. THE LOOP DOES NOT CLOSE. Measured with ffmpeg's psnr filter, the master's
 *    last frame vs its first is ~10.4 dB, well below a normal step, and the
 *    060 -> 001 wrap in the extracted sequence is ~12 dB below normal. Encoding
 *    it straight would jump the moment it loops.
 *
 *    So the clip is built to end on the frame it begins from:
 *      L = 2.5s (the wide shot)     N = 10 frames @ 24fps = 0.4167s
 *      body = [N .. L]  -> 2.0833s      head = [0 .. N] -> 0.4167s
 *      xfade offset = L - 2N = 1.6667s
 *    Output runs the body, then crossfades its tail into `head`, so it finishes
 *    on frame 10 and wraps to frame 11: a one-frame step.
 *
 * Audio is dropped entirely — it is decorative, and an unmuted autoplaying
 * video is blocked by every browser anyway.
 *
 * Usage:  npm run video
 */
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import ffmpegPath from "ffmpeg-static";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "public/cake.mp4");
const outDir = resolve(root, "public/video");
const outFile = resolve(outDir, "cake.mp4");

const FPS = 24;
const SHOT_END = 2.5; // end of the wide shot, seconds
const XFADE_FRAMES = 10;

const L = SHOT_END; // 2.5s
const N = XFADE_FRAMES / FPS; // 0.4167s
const offset = L - 2 * N; // 1.6667s

if (!ffmpegPath) {
  console.error("ffmpeg-static did not provide a binary path.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

// An explicit `split` is required. Referencing [0:v] twice looks like it works
// on an image sequence, but on a real video stream both branches get the full
// untrimmed input and xfade then emits a clip twice as long as intended.
const filter = [
  `[0:v]split=2[src1][src2]`,
  `[src1]trim=start=${N.toFixed(6)}:end=${L.toFixed(6)},setpts=PTS-STARTPTS[body]`,
  `[src2]trim=start=0:end=${N.toFixed(6)},setpts=PTS-STARTPTS[head]`,
  `[body][head]xfade=transition=fade:duration=${N.toFixed(6)}:offset=${offset.toFixed(6)},format=yuv420p[out]`,
].join(";");

console.log(`source : public/cake.mp4  (wide shot only, 0 -> ${L}s)`);
console.log(`xfade  : duration=${N.toFixed(3)}s offset=${offset.toFixed(3)}s`);
console.log(`output : ${outFile.replace(root + "/", "")}`);

execFileSync(
  ffmpegPath,
  [
    "-y",
    "-hide_banner",
    "-loglevel", "error",
    "-i", source,
    "-filter_complex", filter,
    "-map", "[out]",
    "-an", // no audio: decorative, and autoplay requires muted anyway
    "-c:v", "libx264",
    "-profile:v", "high",
    "-level", "4.0",
    "-pix_fmt", "yuv420p", // broadest device support
    "-crf", "24",
    // Short GOP on purpose. The default keyframe interval would leave any
    // scroll-driven seek landing far from the requested time.
    "-g", "12",
    "-keyint_min", "12",
    "-sc_threshold", "0",
    "-movflags", "+faststart", // moov atom first so playback can start early
    "-r", String(FPS),
    outFile,
  ],
  { stdio: "inherit" }
);

console.log("done.");
