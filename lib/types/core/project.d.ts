import { z } from "zod";
import type { Asset, CaptionSegment, Clip, Project, TrackId } from "../types";
export declare const assetSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    kind: z.ZodEnum<{
        video: "video";
        audio: "audio";
        image: "image";
    }>;
    src: z.ZodString;
    duration: z.ZodNumber;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    waveform: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export declare const clipSchema: z.ZodObject<{
    id: z.ZodString;
    trackId: z.ZodEnum<{
        video: "video";
        audio: "audio";
        titles: "titles";
        captions: "captions";
    }>;
    kind: z.ZodEnum<{
        media: "media";
        title: "title";
        caption: "caption";
    }>;
    name: z.ZodString;
    assetId: z.ZodOptional<z.ZodString>;
    start: z.ZodNumber;
    duration: z.ZodNumber;
    sourceStart: z.ZodNumber;
    text: z.ZodString;
    motion: z.ZodEnum<{
        none: "none";
        fade: "fade";
        rise: "rise";
        drift: "drift";
    }>;
    volume: z.ZodNumber;
    opacity: z.ZodNumber;
    scale: z.ZodNumber;
    x: z.ZodNumber;
    y: z.ZodNumber;
    fontSize: z.ZodNumber;
    tone: z.ZodEnum<{
        clay: "clay";
        sage: "sage";
        ink: "ink";
    }>;
}, z.core.$strip>;
export declare const projectSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    id: z.ZodString;
    name: z.ZodString;
    fps: z.ZodUnion<readonly [z.ZodLiteral<24>, z.ZodLiteral<25>, z.ZodLiteral<30>, z.ZodLiteral<60>]>;
    width: z.ZodNumber;
    height: z.ZodNumber;
    assets: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        kind: z.ZodEnum<{
            video: "video";
            audio: "audio";
            image: "image";
        }>;
        src: z.ZodString;
        duration: z.ZodNumber;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        waveform: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    }, z.core.$strip>>;
    clips: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        trackId: z.ZodEnum<{
            video: "video";
            audio: "audio";
            titles: "titles";
            captions: "captions";
        }>;
        kind: z.ZodEnum<{
            media: "media";
            title: "title";
            caption: "caption";
        }>;
        name: z.ZodString;
        assetId: z.ZodOptional<z.ZodString>;
        start: z.ZodNumber;
        duration: z.ZodNumber;
        sourceStart: z.ZodNumber;
        text: z.ZodString;
        motion: z.ZodEnum<{
            none: "none";
            fade: "fade";
            rise: "rise";
            drift: "drift";
        }>;
        volume: z.ZodNumber;
        opacity: z.ZodNumber;
        scale: z.ZodNumber;
        x: z.ZodNumber;
        y: z.ZodNumber;
        fontSize: z.ZodNumber;
        tone: z.ZodEnum<{
            clay: "clay";
            sage: "sage";
            ink: "ink";
        }>;
    }, z.core.$strip>>;
    updatedAt: z.ZodString;
}, z.core.$strip>;
export declare const uid: () => `${string}-${string}-${string}-${string}-${string}`;
export declare const tracks: {
    id: TrackId;
    name: string;
    short: string;
}[];
export declare const durationInFrames: (project: Project) => number;
export declare function createClip(overrides?: Partial<Clip>): Clip;
export declare function createProject(demo?: boolean): Project;
export declare function addAssetClip(project: Project, asset: Asset, start?: number): Project;
export declare function splitClip(project: Project, clipId: string, at: number): Project;
export declare function updateClip(project: Project, clipId: string, patch: Partial<Clip>): Project;
export declare function captionsToClips(segments: CaptionSegment[], fps: number, offset?: number): Clip[];
export declare function formatTime(frames: number, fps?: number): string;
