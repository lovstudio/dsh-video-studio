import type { CaptionSegment, Project } from "../types";
export function parseSrt(text: string): CaptionSegment[] {
  const stamp = (s: string) => {
    const [h, m, rest] = s.replace(",", ".").split(":");
    if (Number(m) > 59 || Number(rest) >= 60)
      throw new Error("字幕分钟和秒数必须小于 60");
    return Number(h) * 3600 + Number(m) * 60 + Number(rest);
  };
  const segments = text
    .replace(/^\uFEFF/, "")
    .replace(/\r/g, "")
    .trim()
    .split(/\n\s*\n/)
    .flatMap((block) => {
      const lines = block.split("\n");
      const line = lines.findIndex((s) => s.includes("-->"));
      if (line < 0) return [];
      const times = lines[line].match(
        /(\d{2,}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2,}:\d{2}:\d{2}[,.]\d{3})/,
      );
      if (!times) throw new Error("字幕时间码无效，请使用 SRT 格式");
      const start = stamp(times[1]);
      const end = stamp(times[2]);
      const content = lines
        .slice(line + 1)
        .join("\n")
        .trim();
      if (
        !Number.isFinite(start) ||
        !Number.isFinite(end) ||
        end <= start ||
        !content
      )
        throw new Error("字幕必须包含有效的起止时间和文本");
      return [{ start, end, text: content }];
    });
  if (!segments.length) throw new Error("未找到有效的 SRT 字幕");
  return segments;
}
export function exportSrt(project: Project): string {
  const stamp = (f: number) => {
    const ms = Math.round((f / project.fps) * 1000);
    return `${String(Math.floor(ms / 3600000)).padStart(2, "0")}:${String(Math.floor(ms / 60000) % 60).padStart(2, "0")}:${String(Math.floor(ms / 1000) % 60).padStart(2, "0")},${String(ms % 1000).padStart(3, "0")}`;
  };
  return project.clips
    .filter((c) => c.kind === "caption")
    .sort((a, b) => a.start - b.start)
    .map(
      (c, i) =>
        `${i + 1}\n${stamp(c.start)} --> ${stamp(c.start + c.duration)}\n${c.text}\n`,
    )
    .join("\n");
}
