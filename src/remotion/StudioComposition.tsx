import { useEffect, useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  Sequence,
  Video,
  getRemotionEnvironment,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { gsap } from "gsap";
import type { Clip, Project } from "../types";

const palette = {
  clay: {
    paper: "#ede8de",
    ink: "#34362d",
    accent: "#cc785c",
    second: "#b7b8a2",
  },
  sage: {
    paper: "#e5e8dd",
    ink: "#343e34",
    accent: "#7a8869",
    second: "#c5b7a0",
  },
  ink: {
    paper: "#252b27",
    ink: "#f1eee4",
    accent: "#cc785c",
    second: "#697564",
  },
};

function useClipMotion(clip: Clip) {
  const frame = useCurrentFrame() + clip.sourceStart;
  const { fps } = useVideoConfig();
  const animation = useMemo(() => {
    const state = {
      alpha: clip.motion === "none" ? 1 : 0,
      y: clip.motion === "rise" ? 52 : 0,
      scale: clip.motion === "drift" ? 1.075 : 1,
    };
    const timeline = gsap.timeline({ paused: true });
    timeline.to(
      state,
      {
        alpha: 1,
        y: 0,
        scale: 1,
        duration: clip.motion === "drift" ? 2.2 : 0.72,
        ease: "power3.out",
      },
      0,
    );
    return { state, timeline };
  }, [clip.motion]);
  useEffect(
    () => () => {
      animation.timeline.kill();
    },
    [animation],
  );
  animation.timeline.seek(frame / fps, false);
  return {
    opacity: animation.state.alpha * clip.opacity,
    transform: `translate(${clip.x}%, ${clip.y}%) translateY(${animation.state.y}px) scale(${animation.state.scale * clip.scale})`,
  };
}

function Title({ clip, overlay }: { clip: Clip; overlay: boolean }) {
  const frame = useCurrentFrame() + clip.sourceStart;
  const { fps, width, height } = useVideoConfig();
  const motion = useClipMotion(clip);
  const theme = palette[clip.tone];
  const portrait = height > width;
  const phase = frame / fps;
  const baseScale = width / 1920;
  const fontSize = clip.fontSize * (portrait ? 1.9 : 1) * baseScale;
  return (
    <AbsoluteFill
      style={{
        background: overlay ? undefined : theme.paper,
        color: theme.ink,
        overflow: "hidden",
        fontFamily: '"PingFang SC", "Hiragino Sans GB", sans-serif',
      }}
    >
      {!overlay && (
        <>
          <svg
            viewBox={portrait ? "0 0 1080 1920" : "0 0 1920 1080"}
            preserveAspectRatio="xMidYMid slice"
            style={{ position: "absolute", width: "100%", height: "100%" }}
            aria-hidden="true"
          >
            <defs>
              <pattern
                id={`grid-${clip.id}`}
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M80 0H0V80"
                  fill="none"
                  stroke={theme.ink}
                  strokeOpacity=".065"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect
              width={portrait ? 1080 : 1920}
              height={portrait ? 1920 : 1080}
              fill={`url(#grid-${clip.id})`}
            />
            <g
              transform={`translate(${portrait ? "660 1320" : "1370 540"}) rotate(${phase * 3})`}
            >
              <circle
                r="323"
                fill="none"
                stroke={theme.ink}
                strokeWidth="1"
                strokeOpacity=".27"
              />
              <circle r="257" fill={theme.accent} />
              <path d="M-257 0a257 257 0 0 0 514 0Z" fill={theme.second} />
              {Array.from({ length: 22 }, (_, i) => (
                <line
                  key={i}
                  x1="-290"
                  x2="290"
                  y1={i * 14 - 145}
                  y2={i * 14 - 145}
                  stroke={theme.paper}
                  strokeWidth="2"
                  transform={`rotate(-32)`}
                />
              ))}
              <circle r="118" fill={theme.paper} />
              <circle r="90" fill={theme.ink} />
              <circle cx="258" cy="-190" r="14" fill={theme.ink} />
            </g>
            <path
              d={portrait ? "M65 1660H1015" : "M110 890H1810"}
              stroke={theme.ink}
              strokeOpacity=".25"
            />
            <path
              d={portrait ? "M65 260H365" : "M110 170H410"}
              stroke={theme.accent}
              strokeWidth="5"
            />
          </svg>
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "6%",
              letterSpacing: ".2em",
              fontSize: width * 0.012,
              fontFamily: "monospace",
            }}
          >
            FRAME / STUDIES
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "9.5%",
              left: "6%",
              fontSize: width * 0.012,
              letterSpacing: ".12em",
            }}
          >
            A LITTLE IDEA. A WHOLE NEW WORLD.
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "9.5%",
              right: "6%",
              fontSize: width * 0.012,
              fontFamily: "monospace",
            }}
          >
            FILM NO. 001
          </div>
        </>
      )}
      <div
        style={{
          ...motion,
          position: "absolute",
          inset: overlay ? "20% 8%" : portrait ? "21% 9% 43%" : "30% 6% 25%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: overlay ? "center" : "flex-start",
          textAlign: overlay ? "center" : "left",
        }}
      >
        {!overlay && (
          <div
            style={{
              fontSize: width * 0.013,
              marginBottom: width * 0.018,
              letterSpacing: ".18em",
              color: theme.accent,
            }}
          >
            THE ART OF MAKING
          </div>
        )}
        <div
          style={{
            maxWidth: overlay ? "100%" : portrait ? "100%" : "64%",
            fontFamily: '"Songti SC", "STSong", Georgia, serif',
            fontSize,
            fontWeight: 600,
            lineHeight: 1.32,
            letterSpacing: "-.03em",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            textShadow: overlay ? "0 2px 15px #0009" : undefined,
            color: overlay ? "#f9f9f7" : theme.ink,
          }}
        >
          {clip.text}
        </div>
        {!overlay && (
          <div
            style={{
              marginTop: width * 0.028,
              width: width * 0.045,
              height: Math.max(2, width * 0.003),
              background: theme.accent,
            }}
          />
        )}
      </div>
    </AbsoluteFill>
  );
}

function Media({ clip, project }: { clip: Clip; project: Project }) {
  const asset = project.assets.find((a) => a.id === clip.assetId);
  const motion = useClipMotion(clip);
  if (!asset) return null;
  if (asset.kind === "audio")
    return (
      <Audio
        src={asset.src}
        startFrom={clip.sourceStart}
        volume={clip.volume}
      />
    );
  const style = {
    width: "100%",
    height: "100%",
    objectFit: "contain" as const,
  };
  const video = {
    src: asset.src,
    startFrom: clip.sourceStart,
    volume: clip.volume,
    style,
  };
  return (
    <AbsoluteFill style={motion}>
      {asset.kind === "image" ? (
        <Img src={asset.src} style={style} />
      ) : getRemotionEnvironment().isRendering ? (
        <OffthreadVideo {...video} />
      ) : (
        <Video {...video} />
      )}
    </AbsoluteFill>
  );
}

function Caption({ clip }: { clip: Clip }) {
  const { width, height } = useVideoConfig();
  const motion = useClipMotion(clip);
  return (
    <AbsoluteFill
      style={{
        ...motion,
        justifyContent: "flex-end",
        alignItems: "center",
        padding: `0 6% ${height > width ? "24%" : "6%"}`,
        fontFamily: '"PingFang SC", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: "90%",
          background: "#181818d9",
          color: "#f9f9f7",
          padding: ".24em .6em",
          borderRadius: ".18em",
          fontSize:
            ((clip.fontSize * width) / 1920) * (height > width ? 1.5 : 1),
          fontWeight: 550,
          lineHeight: 1.5,
          textAlign: "center",
          whiteSpace: "pre-wrap",
        }}
      >
        {clip.text}
      </div>
    </AbsoluteFill>
  );
}

export function StudioComposition({ project }: { project: Project }) {
  const frame = useCurrentFrame();
  const hasVideo = project.clips.some(
    (c) =>
      c.trackId === "video" && c.start <= frame && c.start + c.duration > frame,
  );
  const ordered = [...project.clips].sort(
    (a, b) =>
      ["video", "titles", "captions", "audio"].indexOf(a.trackId) -
      ["video", "titles", "captions", "audio"].indexOf(b.trackId),
  );
  return (
    <AbsoluteFill style={{ background: "#181818" }}>
      {ordered.map((clip) => (
        <Sequence
          key={clip.id}
          from={clip.start}
          durationInFrames={clip.duration}
          premountFor={project.fps}
        >
          {clip.kind === "media" ? (
            <Media clip={clip} project={project} />
          ) : clip.kind === "caption" ? (
            <Caption clip={clip} />
          ) : (
            <Title clip={clip} overlay={hasVideo} />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}
