"use strict";
(self["webpackChunk_lovstudio_dsh_video_studio"] =
  self["webpackChunk_lovstudio_dsh_video_studio"] || []).push([
  [325],
  {
    /***/
    4325(
      __unused_webpack___webpack_module__,
      __unused_webpack___webpack_exports__,
      __webpack_require__,
    ) {
      var mediabunny__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4117);
      var mediabunny__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4456);
      var mediabunny__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6014);
      var mediabunny__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6324);
      var TARGET_SAMPLE_RATE = 100;
      var getAudioSampleStartFrameAtTimelineZero = (sample) => {
        if (sample.timestamp + sample.duration <= 0) {
          return null;
        }
        if (sample.timestamp >= 0) {
          return 0;
        }
        return Math.min(
          sample.numberOfFrames,
          Math.ceil(-sample.timestamp * sample.sampleRate),
        );
      };
      var emitWaveformProgress = ({
        completedPeaks,
        final,
        onProgress,
        peaks,
        totalPeaks,
      }) => {
        onProgress?.({
          peaks,
          completedPeaks,
          totalPeaks,
          final,
        });
      };
      var createWaveformPeakProcessor = ({
        totalPeaks,
        samplesPerPeak,
        onProgress,
        progressIntervalInMs,
        now,
      }) => {
        const peaks = new Float32Array(totalPeaks);
        let peakIndex = 0;
        let peakMax = 0;
        let sampleInPeak = 0;
        let lastProgressAt = 0;
        let lastProgressPeak = 0;
        const emitProgress = (force) => {
          const timestamp = now();
          if (!force && peakIndex === lastProgressPeak && sampleInPeak === 0) {
            return;
          }
          if (!force && timestamp - lastProgressAt < progressIntervalInMs) {
            return;
          }
          lastProgressAt = timestamp;
          lastProgressPeak = peakIndex;
          emitWaveformProgress({
            peaks,
            completedPeaks: peakIndex,
            totalPeaks,
            final: force,
            onProgress,
          });
        };
        return {
          peaks,
          processSampleChunk: (floats, channels) => {
            const frameCount = Math.floor(
              floats.length / Math.max(1, channels),
            );
            for (let frame = 0; frame < frameCount; frame++) {
              let framePeak = 0;
              for (let channel = 0; channel < channels; channel++) {
                const sampleIndex = frame * channels + channel;
                const abs = Math.abs(floats[sampleIndex] ?? 0);
                if (abs > framePeak) {
                  framePeak = abs;
                }
              }
              if (framePeak > peakMax) {
                peakMax = framePeak;
              }
              sampleInPeak++;
              if (sampleInPeak >= samplesPerPeak) {
                if (peakIndex < totalPeaks) {
                  peaks[peakIndex] = peakMax;
                }
                peakIndex++;
                peakMax = 0;
                sampleInPeak = 0;
              }
            }
            emitProgress(false);
          },
          finalize: () => {
            if (sampleInPeak > 0 && peakIndex < totalPeaks) {
              peaks[peakIndex] = peakMax;
              peakIndex++;
            }
            emitProgress(true);
          },
        };
      };
      var DEFAULT_PROGRESS_INTERVAL_IN_MS = 50;
      var peaksCache = /* @__PURE__ */ new Map();
      async function loadWaveformPeaks(url, signal, options) {
        const waveformSampleRate =
          options?.waveformSampleRate ?? TARGET_SAMPLE_RATE;
        if (!Number.isFinite(waveformSampleRate) || waveformSampleRate <= 0) {
          throw new Error(
            "The waveform sample rate must be a positive number.",
          );
        }
        const cacheKey = "".concat(waveformSampleRate, ":").concat(url);
        const cached = peaksCache.get(cacheKey);
        if (cached) {
          emitWaveformProgress({
            peaks: cached,
            completedPeaks: cached.length,
            totalPeaks: cached.length,
            final: true,
            onProgress: options?.onProgress,
          });
          return cached;
        }
        const input = new mediabunny__WEBPACK_IMPORTED_MODULE_2__.pd({
          formats: mediabunny__WEBPACK_IMPORTED_MODULE_1__.XE,
          source: new mediabunny__WEBPACK_IMPORTED_MODULE_0__.Ts(url),
        });
        try {
          const audioTrack = await input.getPrimaryAudioTrack();
          if (!audioTrack) {
            return new Float32Array(0);
          }
          if (await audioTrack.isLive()) {
            throw new Error(
              "Live streams are not currently supported by Remotion. Sorry! Source: " +
                url,
            );
          }
          if (await audioTrack.isRelativeToUnixEpoch()) {
            throw new Error(
              "Streams with UNIX timestamps are not currently supported by Remotion. Sorry! Source: " +
                url,
            );
          }
          const audioSampleRate = await audioTrack.getSampleRate();
          const durationInSeconds =
            (await audioTrack.getDurationFromMetadata({
              skipLiveWait: true,
            })) ?? (await audioTrack.computeDuration({ skipLiveWait: true }));
          const totalPeaks = Math.ceil(durationInSeconds * waveformSampleRate);
          const samplesPerPeak = Math.max(
            1,
            Math.floor(audioSampleRate / waveformSampleRate),
          );
          const sink = new mediabunny__WEBPACK_IMPORTED_MODULE_3__.qw(
            audioTrack,
          );
          const processor = createWaveformPeakProcessor({
            totalPeaks,
            samplesPerPeak,
            onProgress: options?.onProgress,
            progressIntervalInMs:
              options?.progressIntervalInMs ??
              DEFAULT_PROGRESS_INTERVAL_IN_MS *
                Math.max(1, waveformSampleRate / TARGET_SAMPLE_RATE),
            now: () => Date.now(),
          });
          for await (const sample of sink.samples()) {
            if (signal.aborted) {
              sample.close();
              return new Float32Array(0);
            }
            const startFrame = getAudioSampleStartFrameAtTimelineZero(sample);
            if (startFrame === null) {
              sample.close();
              continue;
            }
            const frameCount = sample.numberOfFrames - startFrame;
            if (frameCount <= 0) {
              sample.close();
              continue;
            }
            const bytesNeeded = sample.allocationSize({
              format: "f32",
              planeIndex: 0,
              frameOffset: startFrame,
              frameCount,
            });
            const floats = new Float32Array(bytesNeeded / 4);
            sample.copyTo(floats, {
              format: "f32",
              planeIndex: 0,
              frameOffset: startFrame,
              frameCount,
            });
            const channels = Math.max(1, sample.numberOfChannels);
            sample.close();
            processor.processSampleChunk(floats, channels);
          }
          processor.finalize();
          const { peaks } = processor;
          peaksCache.set(cacheKey, peaks);
          return peaks;
        } finally {
          input.dispose();
        }
      }
      var postPeaks = (requestId, peaks, final) => {
        const payload = {
          type: "peaks",
          requestId,
          peaks,
          final,
        };
        self.postMessage(payload);
      };
      var postError = (requestId, error) => {
        const message =
          error instanceof Error ? error.message : "Failed to load waveform";
        const payload = {
          type: "error",
          requestId,
          message,
        };
        self.postMessage(payload);
      };
      self.addEventListener("message", (event) => {
        const message = event.data;
        const controller = new AbortController();
        loadWaveformPeaks(message.src, controller.signal, {
          waveformSampleRate: message.waveformSampleRate,
          onProgress: ({ peaks, final }) => {
            if (!final) {
              postPeaks(message.requestId, peaks, false);
            }
          },
        })
          .then((peaks) => {
            postPeaks(message.requestId, peaks, true);
          })
          .catch((error) => {
            postError(message.requestId, error);
          });
      });
    },
    /***/
    4691(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        Im: () =>
          /* binding */
          aacFrequencyTable,
        /* harmony export */
        Ti: () =>
          /* binding */
          aacChannelMap,
        /* harmony export */
        zF: () =>
          /* binding */
          parseAacAudioSpecificConfig,
        /* harmony export */
      });
      var Bitstream;
      var _bitstream_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(3486);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const aacFrequencyTable = [
        96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025,
        8e3, 7350,
      ];
      const aacChannelMap = [-1, 1, 2, 3, 4, 5, 6, 8];
      const parseAacAudioSpecificConfig = (bytes) => {
        if (!bytes || bytes.byteLength < 2) {
          throw new TypeError("AAC description must be at least 2 bytes long.");
        }
        const bitstream = new _bitstream_js__WEBPACK_IMPORTED_MODULE_0__._(
          bytes,
        );
        const objectType = readAacObjectType(bitstream);
        const { frequencyIndex, sampleRate } =
          readAacSamplingFrequency(bitstream);
        const channelConfiguration = bitstream.readBits(4);
        let numberOfChannels = null;
        if (channelConfiguration >= 1 && channelConfiguration <= 7) {
          numberOfChannels = aacChannelMap[channelConfiguration];
        }
        let coreObjectType = objectType;
        let psPresent = false;
        let outputSampleRate = sampleRate;
        if (objectType === 5 || objectType === 29) {
          psPresent = objectType === 29;
          outputSampleRate = readAacSamplingFrequency(bitstream).sampleRate;
          coreObjectType = readAacObjectType(bitstream);
          if (coreObjectType === 22) {
            bitstream.skipBits(4);
          }
        } else {
          while (bitstream.getBitsLeft() > 15) {
            const searchStart = bitstream.pos;
            if (bitstream.readBits(11) !== 695) {
              bitstream.pos = searchStart + 1;
              continue;
            }
            if (readAacObjectType(bitstream) === 5 && bitstream.readBits(1)) {
              outputSampleRate = readAacSamplingFrequency(bitstream).sampleRate;
              if (
                bitstream.getBitsLeft() > 11 &&
                bitstream.readBits(11) === 1352
              ) {
                psPresent = !!bitstream.readBits(1);
              }
            }
            break;
          }
        }
        if (numberOfChannels !== null && numberOfChannels > 1) {
          psPresent = false;
        }
        return {
          objectType,
          coreObjectType,
          frequencyIndex,
          channelConfiguration,
          outputSampleRate,
          outputNumberOfChannels:
            psPresent && numberOfChannels === 1 ? 2 : numberOfChannels,
        };
      };
      const readAacObjectType = (bitstream) => {
        const objectType = bitstream.readBits(5);
        return objectType === 31 ? 32 + bitstream.readBits(6) : objectType;
      };
      const readAacSamplingFrequency = (bitstream) => {
        const frequencyIndex = bitstream.readBits(4);
        if (frequencyIndex === 15) {
          return {
            frequencyIndex,
            sampleRate: bitstream.readBits(24),
          };
        }
        return {
          frequencyIndex,
          sampleRate:
            frequencyIndex < aacFrequencyTable.length
              ? aacFrequencyTable[frequencyIndex]
              : null,
        };
      };
      const buildAacAudioSpecificConfig = (config) => {
        const usesSbr = config.objectType === 5 || config.objectType === 29;
        const usesPs = config.objectType === 29;
        const coreSampleRate = usesSbr
          ? config.outputSampleRate / 2
          : config.outputSampleRate;
        const coreNumberOfChannels = usesPs ? 1 : config.outputNumberOfChannels;
        const channelConfiguration =
          aacChannelMap.indexOf(coreNumberOfChannels);
        if (channelConfiguration === -1) {
          throw new TypeError(
            "Unsupported number of channels: ".concat(
              config.outputNumberOfChannels,
            ),
          );
        }
        let bitCount = 5 + 4 + 4 + 3;
        if (config.objectType >= 32) {
          bitCount += 6;
        }
        if (findAacFrequencyIndex(coreSampleRate) === 15) {
          bitCount += 24;
        }
        if (usesSbr) {
          bitCount += 4 + 5;
          if (findAacFrequencyIndex(config.outputSampleRate) === 15) {
            bitCount += 24;
          }
        }
        const byteCount = Math.ceil(bitCount / 8);
        const bytes = new Uint8Array(byteCount);
        const bitstream = new Bitstream(bytes);
        writeAacObjectType(bitstream, config.objectType);
        writeAacSamplingFrequency(bitstream, coreSampleRate);
        bitstream.writeBits(4, channelConfiguration);
        if (usesSbr) {
          writeAacSamplingFrequency(bitstream, config.outputSampleRate);
          writeAacObjectType(bitstream, 2);
        }
        bitstream.writeBits(3, 0);
        return bytes;
      };
      const writeAacObjectType = (bitstream, objectType) => {
        if (objectType < 32) {
          bitstream.writeBits(5, objectType);
        } else {
          bitstream.writeBits(5, 31);
          bitstream.writeBits(6, objectType - 32);
        }
      };
      const writeAacSamplingFrequency = (bitstream, sampleRate) => {
        const frequencyIndex = findAacFrequencyIndex(sampleRate);
        bitstream.writeBits(4, frequencyIndex);
        if (frequencyIndex === 15) {
          bitstream.writeBits(24, sampleRate);
        }
      };
      const findAacFrequencyIndex = (sampleRate) => {
        const index = aacFrequencyTable.indexOf(sampleRate);
        return index === -1 ? 15 : index;
      };
      const buildAdtsHeaderTemplate = (config) => {
        const header = new Uint8Array(7);
        const bitstream = new Bitstream(header);
        const { coreObjectType, frequencyIndex, channelConfiguration } = config;
        const profile = coreObjectType - 1;
        bitstream.writeBits(12, 4095);
        bitstream.writeBits(1, 0);
        bitstream.writeBits(2, 0);
        bitstream.writeBits(1, 1);
        bitstream.writeBits(2, profile);
        bitstream.writeBits(4, frequencyIndex);
        bitstream.writeBits(1, 0);
        bitstream.writeBits(3, channelConfiguration);
        bitstream.writeBits(1, 0);
        bitstream.writeBits(1, 0);
        bitstream.writeBits(1, 0);
        bitstream.writeBits(1, 0);
        bitstream.skipBits(13);
        bitstream.writeBits(11, 2047);
        bitstream.writeBits(2, 0);
        return { header, bitstream };
      };
      const writeAdtsFrameLength = (bitstream, frameLength) => {
        bitstream.pos = 30;
        bitstream.writeBits(13, frameLength);
      };
    },
    /***/
    1604(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        D_: () =>
          /* binding */
          MP3_FRAME_HEADER_SIZE,
        /* harmony export */
        EZ: () =>
          /* binding */
          getXingOffset,
        /* harmony export */
        Fm: () =>
          /* binding */
          decodeSynchsafe,
        /* harmony export */
        MJ: () =>
          /* binding */
          XingFlags,
        /* harmony export */
        P8: () =>
          /* binding */
          readMp3FrameHeader,
        /* harmony export */
        fX: () =>
          /* binding */
          getMp3ChannelCount,
        /* harmony export */
        hD: () =>
          /* binding */
          computeAverageMp3FrameSize,
        /* harmony export */
        hY: () =>
          /* binding */
          XING,
        /* harmony export */
        rD: () =>
          /* binding */
          INFO,
        /* harmony export */
      });
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const MP3_FRAME_HEADER_SIZE = 4;
      const SAMPLING_RATES = [44100, 48e3, 32e3];
      const KILOBIT_RATES = [
        // lowSamplingFrequency === 0
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        // layer = 0
        -1, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, -1,
        // layer 1
        -1, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, -1,
        // layer = 2
        -1, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448,
        -1,
        // layer = 3
        // lowSamplingFrequency === 1
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
        // layer = 0
        -1, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, -1,
        // layer = 1
        -1, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, -1,
        // layer = 2
        -1, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256, -1,
        // layer = 3
      ];
      const XING = 1483304551;
      const INFO = 1231971951;
      const computeMp3FrameSize = (
        lowSamplingFrequency,
        layer,
        bitrate,
        sampleRate,
        padding,
      ) => {
        if (layer === 0) {
          return 0;
        } else if (layer === 1) {
          return (
            Math.floor((144 * bitrate) / (sampleRate << lowSamplingFrequency)) +
            padding
          );
        } else if (layer === 2) {
          return Math.floor((144 * bitrate) / sampleRate) + padding;
        } else {
          return (Math.floor((12 * bitrate) / sampleRate) + padding) * 4;
        }
      };
      const computeAverageMp3FrameSize = (
        lowSamplingFrequency,
        layer,
        bitrate,
        sampleRate,
      ) => {
        if (layer === 0) {
          return 0;
        } else if (layer === 1) {
          return (144 * bitrate) / (sampleRate << lowSamplingFrequency);
        } else if (layer === 2) {
          return (144 * bitrate) / sampleRate;
        } else {
          return ((12 * bitrate) / sampleRate) * 4;
        }
      };
      const getXingOffset = (mpegVersionId, channel) => {
        return mpegVersionId === 3
          ? channel === 3
            ? 21
            : 36
          : channel === 3
            ? 13
            : 21;
      };
      const readMp3FrameHeader = (word, remainingBytes) => {
        const firstByte = word >>> 24;
        const secondByte = (word >>> 16) & 255;
        const thirdByte = (word >>> 8) & 255;
        const fourthByte = word & 255;
        if (
          firstByte !== 255 &&
          secondByte !== 255 &&
          thirdByte !== 255 &&
          fourthByte !== 255
        ) {
          return {
            header: null,
            bytesAdvanced: 4,
          };
        }
        if (firstByte !== 255) {
          return { header: null, bytesAdvanced: 1 };
        }
        if ((secondByte & 224) !== 224) {
          return { header: null, bytesAdvanced: 1 };
        }
        let lowSamplingFrequency = 0;
        let mpeg25 = 0;
        if (secondByte & (1 << 4)) {
          lowSamplingFrequency = secondByte & (1 << 3) ? 0 : 1;
        } else {
          lowSamplingFrequency = 1;
          mpeg25 = 1;
        }
        const mpegVersionId = (secondByte >> 3) & 3;
        const layer = (secondByte >> 1) & 3;
        const bitrateIndex = (thirdByte >> 4) & 15;
        const frequencyIndex = ((thirdByte >> 2) & 3) % 3;
        const padding = (thirdByte >> 1) & 1;
        const channel = (fourthByte >> 6) & 3;
        const modeExtension = (fourthByte >> 4) & 3;
        const copyright = (fourthByte >> 3) & 1;
        const original = (fourthByte >> 2) & 1;
        const emphasis = fourthByte & 3;
        const kilobitRate =
          KILOBIT_RATES[
            lowSamplingFrequency * 16 * 4 + layer * 16 + bitrateIndex
          ];
        if (kilobitRate === -1) {
          return { header: null, bytesAdvanced: 1 };
        }
        const bitrate = kilobitRate * 1e3;
        const sampleRate =
          SAMPLING_RATES[frequencyIndex] >> (lowSamplingFrequency + mpeg25);
        const frameLength = computeMp3FrameSize(
          lowSamplingFrequency,
          layer,
          bitrate,
          sampleRate,
          padding,
        );
        if (remainingBytes !== null && remainingBytes < frameLength) {
          return { header: null, bytesAdvanced: 1 };
        }
        let audioSamplesInFrame;
        if (mpegVersionId === 3) {
          audioSamplesInFrame = layer === 3 ? 384 : 1152;
        } else {
          if (layer === 3) {
            audioSamplesInFrame = 384;
          } else if (layer === 2) {
            audioSamplesInFrame = 1152;
          } else {
            audioSamplesInFrame = 576;
          }
        }
        return {
          header: {
            totalSize: frameLength,
            mpegVersionId,
            lowSamplingFrequency,
            layer,
            bitrate,
            frequencyIndex,
            sampleRate,
            channel,
            modeExtension,
            copyright,
            original,
            emphasis,
            audioSamplesInFrame,
          },
          bytesAdvanced: 1,
        };
      };
      const encodeSynchsafe = (unsynchsafed) => {
        let mask = 127;
        let synchsafed = 0;
        let unsynchsafedRest = unsynchsafed;
        while ((mask ^ 2147483647) !== 0) {
          synchsafed = unsynchsafedRest & ~mask;
          synchsafed <<= 1;
          synchsafed |= unsynchsafedRest & mask;
          mask = ((mask + 1) << 8) - 1;
          unsynchsafedRest = synchsafed;
        }
        return synchsafed;
      };
      const decodeSynchsafe = (synchsafed) => {
        let mask = 2130706432;
        let unsynchsafed = 0;
        while (mask !== 0) {
          unsynchsafed >>= 1;
          unsynchsafed |= synchsafed & mask;
          mask >>= 8;
        }
        return unsynchsafed;
      };
      var XingFlags;
      (function (XingFlags2) {
        XingFlags2[(XingFlags2["FrameCount"] = 1)] = "FrameCount";
        XingFlags2[(XingFlags2["FileSize"] = 2)] = "FileSize";
        XingFlags2[(XingFlags2["Toc"] = 4)] = "Toc";
      })(XingFlags || (XingFlags = {}));
      const getMp3ChannelCount = (channel) => {
        return channel === 3 ? 1 : 2;
      };
    },
    /***/
    9705(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        $N: () =>
          /* binding */
          DTS_EXSS_MAX_HEADER_SIZE,
        /* harmony export */
        $m: () =>
          /* binding */
          vp9CodecInfoHasColorInfo,
        /* harmony export */
        A3: () =>
          /* binding */
          FlacBlockType,
        /* harmony export */
        BE: () =>
          /* binding */
          sanitizeHevcPacketForChromium,
        /* harmony export */
        BP: () =>
          /* binding */
          deserializeAvcDecoderConfigurationRecord,
        /* harmony export */
        CX: () =>
          /* binding */
          parseDtsFrame,
        /* harmony export */
        Co: () =>
          /* binding */
          parseModesFromVorbisSetupPacket,
        /* harmony export */
        D5: () =>
          /* binding */
          extractHevcDecoderConfigurationRecord,
        /* harmony export */
        FY: () =>
          /* binding */
          EAC3_NUMBLKS_TABLE,
        /* harmony export */
        Ir: () =>
          /* binding */
          AC3_SAMPLES_PER_FRAME,
        /* harmony export */
        LM: () =>
          /* binding */
          parseAc3SyncFrame,
        /* harmony export */
        O9: () =>
          /* binding */
          extractNalUnitTypeForHevc,
        /* harmony export */
        Oc: () =>
          /* binding */
          readVorbisComments,
        /* harmony export */
        PK: () =>
          /* binding */
          getEac3SampleRate,
        /* harmony export */
        PR: () =>
          /* binding */
          determineVideoPacketType,
        /* harmony export */
        Pl: () =>
          /* binding */
          AC3_FRAME_SIZES,
        /* harmony export */
        Qf: () =>
          /* binding */
          parseOpusIdentificationHeader,
        /* harmony export */
        RF: () =>
          /* binding */
          iterateHevcNalUnits,
        /* harmony export */
        RO: () =>
          /* binding */
          iterateAvcNalUnits,
        /* harmony export */
        RU: () =>
          /* binding */
          extractProresCodecInfoFromPacket,
        /* harmony export */
        Sd: () =>
          /* binding */
          parseEac3Config,
        /* harmony export */
        UU: () =>
          /* binding */
          extractAv1CodecInfoFromPacket,
        /* harmony export */
        Wt: () =>
          /* binding */
          parseDtsCoreFrameHeader,
        /* harmony export */
        Xc: () =>
          /* binding */
          DTS_SPECIFIC_BOX_SIZE,
        /* harmony export */
        Zi: () =>
          /* binding */
          concatAvcNalUnits,
        /* harmony export */
        Zt: () =>
          /* binding */
          parseDtsExssHeader,
        /* harmony export */
        bs: () =>
          /* binding */
          extractVp9CodecInfoFromPacket,
        /* harmony export */
        eM: () =>
          /* binding */
          parseAvcSps,
        /* harmony export */
        et: () =>
          /* binding */
          av1CodecInfoHasColorInfo,
        /* harmony export */
        fH: () =>
          /* binding */
          extractAvcDecoderConfigurationRecord,
        /* harmony export */
        gT: () =>
          /* binding */
          parseHevcSps,
        /* harmony export */
        hf: () =>
          /* binding */
          deserializeHevcDecoderConfigurationRecord,
        /* harmony export */
        iJ: () =>
          /* binding */
          HevcNalUnitType,
        /* harmony export */
        ix: () =>
          /* binding */
          parseDtsSpecificBox,
        /* harmony export */
        l9: () =>
          /* binding */
          DTS_EXSS_HEADER_PREFIX_SIZE,
        /* harmony export */
        ls: () =>
          /* binding */
          parseOpusTocByte,
        /* harmony export */
        mB: () =>
          /* binding */
          DTS_CORE_FRAME_HEADER_SIZE,
        /* harmony export */
        mY: () =>
          /* binding */
          AvcNalUnitType,
        /* harmony export */
        n$: () =>
          /* binding */
          extractDtsFourCcFromPacket,
        /* harmony export */
        oL: () =>
          /* binding */
          parseEac3SyncFrame,
        /* harmony export */
        uN: () =>
          /* binding */
          extractNalUnitTypeForAvc,
        /* harmony export */
        ux: () =>
          /* binding */
          AC3_ACMOD_CHANNEL_COUNTS,
        /* harmony export */
        zV: () =>
          /* binding */
          getEac3ChannelCount,
        /* harmony export */
      });
      var assert;
      var textEncoder;
      var keyValueIterator;
      var toDataView;
      var bytesToBase64;
      var assertNever;
      var Bitstream;
      var _codec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8276);
      var _misc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6760);
      var _logging_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9815);
      var _shared_ac3_misc_js__WEBPACK_IMPORTED_MODULE_3__ =
        __webpack_require__(9745);
      var _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__ =
        __webpack_require__(3486);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      var AvcNalUnitType;
      (function (AvcNalUnitType2) {
        AvcNalUnitType2[(AvcNalUnitType2["NON_IDR_SLICE"] = 1)] =
          "NON_IDR_SLICE";
        AvcNalUnitType2[(AvcNalUnitType2["SLICE_DPA"] = 2)] = "SLICE_DPA";
        AvcNalUnitType2[(AvcNalUnitType2["SLICE_DPB"] = 3)] = "SLICE_DPB";
        AvcNalUnitType2[(AvcNalUnitType2["SLICE_DPC"] = 4)] = "SLICE_DPC";
        AvcNalUnitType2[(AvcNalUnitType2["IDR"] = 5)] = "IDR";
        AvcNalUnitType2[(AvcNalUnitType2["SEI"] = 6)] = "SEI";
        AvcNalUnitType2[(AvcNalUnitType2["SPS"] = 7)] = "SPS";
        AvcNalUnitType2[(AvcNalUnitType2["PPS"] = 8)] = "PPS";
        AvcNalUnitType2[(AvcNalUnitType2["AUD"] = 9)] = "AUD";
        AvcNalUnitType2[(AvcNalUnitType2["SPS_EXT"] = 13)] = "SPS_EXT";
      })(AvcNalUnitType || (AvcNalUnitType = {}));
      var HevcNalUnitType;
      (function (HevcNalUnitType2) {
        HevcNalUnitType2[(HevcNalUnitType2["RASL_N"] = 8)] = "RASL_N";
        HevcNalUnitType2[(HevcNalUnitType2["RASL_R"] = 9)] = "RASL_R";
        HevcNalUnitType2[(HevcNalUnitType2["BLA_W_LP"] = 16)] = "BLA_W_LP";
        HevcNalUnitType2[(HevcNalUnitType2["RSV_IRAP_VCL23"] = 23)] =
          "RSV_IRAP_VCL23";
        HevcNalUnitType2[(HevcNalUnitType2["VPS_NUT"] = 32)] = "VPS_NUT";
        HevcNalUnitType2[(HevcNalUnitType2["SPS_NUT"] = 33)] = "SPS_NUT";
        HevcNalUnitType2[(HevcNalUnitType2["PPS_NUT"] = 34)] = "PPS_NUT";
        HevcNalUnitType2[(HevcNalUnitType2["AUD_NUT"] = 35)] = "AUD_NUT";
        HevcNalUnitType2[(HevcNalUnitType2["PREFIX_SEI_NUT"] = 39)] =
          "PREFIX_SEI_NUT";
        HevcNalUnitType2[(HevcNalUnitType2["SUFFIX_SEI_NUT"] = 40)] =
          "SUFFIX_SEI_NUT";
      })(HevcNalUnitType || (HevcNalUnitType = {}));
      const iterateNalUnitsInAnnexB = function* (packetData) {
        let i = 0;
        let nalStart = -1;
        while (i < packetData.length - 2) {
          const zeroIndex = packetData.indexOf(0, i);
          if (zeroIndex === -1 || zeroIndex >= packetData.length - 2) {
            break;
          }
          i = zeroIndex;
          let startCodeLength = 0;
          if (
            i + 3 < packetData.length &&
            packetData[i + 1] === 0 &&
            packetData[i + 2] === 0 &&
            packetData[i + 3] === 1
          ) {
            startCodeLength = 4;
          } else if (packetData[i + 1] === 0 && packetData[i + 2] === 1) {
            startCodeLength = 3;
          }
          if (startCodeLength === 0) {
            i++;
            continue;
          }
          if (nalStart !== -1 && i > nalStart) {
            yield {
              offset: nalStart,
              length: i - nalStart,
            };
          }
          nalStart = i + startCodeLength;
          i = nalStart;
        }
        if (nalStart !== -1 && nalStart < packetData.length) {
          yield {
            offset: nalStart,
            length: packetData.length - nalStart,
          };
        }
      };
      const iterateNalUnitsInLengthPrefixed = function* (
        packetData,
        lengthSize,
      ) {
        let offset = 0;
        const dataView = new DataView(
          packetData.buffer,
          packetData.byteOffset,
          packetData.byteLength,
        );
        while (offset + lengthSize <= packetData.length) {
          let nalUnitLength;
          if (lengthSize === 1) {
            nalUnitLength = dataView.getUint8(offset);
          } else if (lengthSize === 2) {
            nalUnitLength = dataView.getUint16(offset, false);
          } else if (lengthSize === 3) {
            nalUnitLength = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.dq)(
              dataView,
              offset,
              false,
            );
          } else {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.vA)(lengthSize === 4);
            nalUnitLength = dataView.getUint32(offset, false);
          }
          offset += lengthSize;
          yield {
            offset,
            length: nalUnitLength,
          };
          offset += nalUnitLength;
        }
      };
      const iterateAvcNalUnits = (packetData, decoderConfig) => {
        if (decoderConfig.description) {
          const bytes = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Fo)(
            decoderConfig.description,
          );
          const lengthSizeMinusOne = bytes[4] & 3;
          const lengthSize = lengthSizeMinusOne + 1;
          return iterateNalUnitsInLengthPrefixed(packetData, lengthSize);
        } else {
          return iterateNalUnitsInAnnexB(packetData);
        }
      };
      const extractNalUnitTypeForAvc = (byte) => {
        return byte & 31;
      };
      const removeEmulationPreventionBytes = (data) => {
        const result = [];
        const len = data.length;
        for (let i = 0; i < len; i++) {
          if (
            i + 2 < len &&
            data[i] === 0 &&
            data[i + 1] === 0 &&
            data[i + 2] === 3
          ) {
            result.push(0, 0);
            i += 2;
          } else {
            result.push(data[i]);
          }
        }
        return new Uint8Array(result);
      };
      const ANNEX_B_START_CODE = new Uint8Array([0, 0, 0, 1]);
      const concatNalUnitsInAnnexB = (nalUnits) => {
        const totalLength = nalUnits.reduce(
          (a, b) => a + ANNEX_B_START_CODE.byteLength + b.byteLength,
          0,
        );
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const nalUnit of nalUnits) {
          result.set(ANNEX_B_START_CODE, offset);
          offset += ANNEX_B_START_CODE.byteLength;
          result.set(nalUnit, offset);
          offset += nalUnit.byteLength;
        }
        return result;
      };
      const concatNalUnitsInLengthPrefixed = (nalUnits, lengthSize) => {
        const totalLength = nalUnits.reduce(
          (a, b) => a + lengthSize + b.byteLength,
          0,
        );
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const nalUnit of nalUnits) {
          const dataView = new DataView(
            result.buffer,
            result.byteOffset,
            result.byteLength,
          );
          switch (lengthSize) {
            case 1:
              dataView.setUint8(offset, nalUnit.byteLength);
              break;
            case 2:
              dataView.setUint16(offset, nalUnit.byteLength, false);
              break;
            case 3:
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.jD)(
                dataView,
                offset,
                nalUnit.byteLength,
                false,
              );
              break;
            case 4:
              dataView.setUint32(offset, nalUnit.byteLength, false);
              break;
          }
          offset += lengthSize;
          result.set(nalUnit, offset);
          offset += nalUnit.byteLength;
        }
        return result;
      };
      const concatAvcNalUnits = (nalUnits, decoderConfig) => {
        if (decoderConfig.description) {
          const bytes = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Fo)(
            decoderConfig.description,
          );
          const lengthSizeMinusOne = bytes[4] & 3;
          const lengthSize = lengthSizeMinusOne + 1;
          return concatNalUnitsInLengthPrefixed(nalUnits, lengthSize);
        } else {
          return concatNalUnitsInAnnexB(nalUnits);
        }
      };
      const extractAvcDecoderConfigurationRecord = (packetData) => {
        try {
          const spsUnits = [];
          const ppsUnits = [];
          const spsExtUnits = [];
          for (const loc of iterateNalUnitsInAnnexB(packetData)) {
            const nalUnit = packetData.subarray(
              loc.offset,
              loc.offset + loc.length,
            );
            const type = extractNalUnitTypeForAvc(nalUnit[0]);
            if (type === AvcNalUnitType.SPS) {
              spsUnits.push(nalUnit);
            } else if (type === AvcNalUnitType.PPS) {
              ppsUnits.push(nalUnit);
            } else if (type === AvcNalUnitType.SPS_EXT) {
              spsExtUnits.push(nalUnit);
            }
          }
          if (spsUnits.length === 0) {
            return null;
          }
          if (ppsUnits.length === 0) {
            return null;
          }
          const spsData = spsUnits[0];
          const spsInfo = parseAvcSps(spsData);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.vA)(spsInfo !== null);
          const hasExtendedData =
            spsInfo.profileIdc === 100 ||
            spsInfo.profileIdc === 110 ||
            spsInfo.profileIdc === 122 ||
            spsInfo.profileIdc === 144;
          return {
            configurationVersion: 1,
            avcProfileIndication: spsInfo.profileIdc,
            profileCompatibility: spsInfo.constraintFlags,
            avcLevelIndication: spsInfo.levelIdc,
            lengthSizeMinusOne: 3,
            // Typically 4 bytes for length field
            sequenceParameterSets: spsUnits,
            pictureParameterSets: ppsUnits,
            chromaFormat: hasExtendedData ? spsInfo.chromaFormatIdc : null,
            bitDepthLumaMinus8: hasExtendedData
              ? spsInfo.bitDepthLumaMinus8
              : null,
            bitDepthChromaMinus8: hasExtendedData
              ? spsInfo.bitDepthChromaMinus8
              : null,
            sequenceParameterSetExt: hasExtendedData ? spsExtUnits : null,
          };
        } catch (error) {
          _logging_js__WEBPACK_IMPORTED_MODULE_2__.y._error(
            "Error building AVC Decoder Configuration Record:",
            error,
          );
          return null;
        }
      };
      const serializeAvcDecoderConfigurationRecord = (record) => {
        const bytes = [];
        bytes.push(record.configurationVersion);
        bytes.push(record.avcProfileIndication);
        bytes.push(record.profileCompatibility);
        bytes.push(record.avcLevelIndication);
        bytes.push(252 | (record.lengthSizeMinusOne & 3));
        bytes.push(224 | (record.sequenceParameterSets.length & 31));
        for (const sps of record.sequenceParameterSets) {
          const length = sps.byteLength;
          bytes.push(length >> 8);
          bytes.push(length & 255);
          for (let i = 0; i < length; i++) {
            bytes.push(sps[i]);
          }
        }
        bytes.push(record.pictureParameterSets.length);
        for (const pps of record.pictureParameterSets) {
          const length = pps.byteLength;
          bytes.push(length >> 8);
          bytes.push(length & 255);
          for (let i = 0; i < length; i++) {
            bytes.push(pps[i]);
          }
        }
        if (
          record.avcProfileIndication === 100 ||
          record.avcProfileIndication === 110 ||
          record.avcProfileIndication === 122 ||
          record.avcProfileIndication === 144
        ) {
          assert(record.chromaFormat !== null);
          assert(record.bitDepthLumaMinus8 !== null);
          assert(record.bitDepthChromaMinus8 !== null);
          assert(record.sequenceParameterSetExt !== null);
          bytes.push(252 | (record.chromaFormat & 3));
          bytes.push(248 | (record.bitDepthLumaMinus8 & 7));
          bytes.push(248 | (record.bitDepthChromaMinus8 & 7));
          bytes.push(record.sequenceParameterSetExt.length);
          for (const spsExt of record.sequenceParameterSetExt) {
            const length = spsExt.byteLength;
            bytes.push(length >> 8);
            bytes.push(length & 255);
            for (let i = 0; i < length; i++) {
              bytes.push(spsExt[i]);
            }
          }
        }
        return new Uint8Array(bytes);
      };
      const deserializeAvcDecoderConfigurationRecord = (data) => {
        try {
          const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(data);
          let offset = 0;
          const configurationVersion = view.getUint8(offset++);
          const avcProfileIndication = view.getUint8(offset++);
          const profileCompatibility = view.getUint8(offset++);
          const avcLevelIndication = view.getUint8(offset++);
          const lengthSizeMinusOne = view.getUint8(offset++) & 3;
          const numOfSequenceParameterSets = view.getUint8(offset++) & 31;
          const sequenceParameterSets = [];
          for (let i = 0; i < numOfSequenceParameterSets; i++) {
            const length = view.getUint16(offset, false);
            offset += 2;
            sequenceParameterSets.push(data.subarray(offset, offset + length));
            offset += length;
          }
          const numOfPictureParameterSets = view.getUint8(offset++);
          const pictureParameterSets = [];
          for (let i = 0; i < numOfPictureParameterSets; i++) {
            const length = view.getUint16(offset, false);
            offset += 2;
            pictureParameterSets.push(data.subarray(offset, offset + length));
            offset += length;
          }
          const record = {
            configurationVersion,
            avcProfileIndication,
            profileCompatibility,
            avcLevelIndication,
            lengthSizeMinusOne,
            sequenceParameterSets,
            pictureParameterSets,
            chromaFormat: null,
            bitDepthLumaMinus8: null,
            bitDepthChromaMinus8: null,
            sequenceParameterSetExt: null,
          };
          if (
            (avcProfileIndication === 100 ||
              avcProfileIndication === 110 ||
              avcProfileIndication === 122 ||
              avcProfileIndication === 144) &&
            offset + 4 <= data.length
          ) {
            const chromaFormat = view.getUint8(offset++) & 3;
            const bitDepthLumaMinus8 = view.getUint8(offset++) & 7;
            const bitDepthChromaMinus8 = view.getUint8(offset++) & 7;
            const numOfSequenceParameterSetExt = view.getUint8(offset++);
            record.chromaFormat = chromaFormat;
            record.bitDepthLumaMinus8 = bitDepthLumaMinus8;
            record.bitDepthChromaMinus8 = bitDepthChromaMinus8;
            const sequenceParameterSetExt = [];
            for (let i = 0; i < numOfSequenceParameterSetExt; i++) {
              const length = view.getUint16(offset, false);
              offset += 2;
              sequenceParameterSetExt.push(
                data.subarray(offset, offset + length),
              );
              offset += length;
            }
            record.sequenceParameterSetExt = sequenceParameterSetExt;
          }
          return record;
        } catch (error) {
          _logging_js__WEBPACK_IMPORTED_MODULE_2__.y._error(
            "Error deserializing AVC Decoder Configuration Record:",
            error,
          );
          return null;
        }
      };
      const AVC_HEVC_ASPECT_RATIO_IDC_TABLE = {
        1: { num: 1, den: 1 },
        2: { num: 12, den: 11 },
        3: { num: 10, den: 11 },
        4: { num: 16, den: 11 },
        5: { num: 40, den: 33 },
        6: { num: 24, den: 11 },
        7: { num: 20, den: 11 },
        8: { num: 32, den: 11 },
        9: { num: 80, den: 33 },
        10: { num: 18, den: 11 },
        11: { num: 15, den: 11 },
        12: { num: 64, den: 33 },
        13: { num: 160, den: 99 },
        14: { num: 4, den: 3 },
        15: { num: 3, den: 2 },
        16: { num: 2, den: 1 },
      };
      const parseAvcSps = (sps) => {
        try {
          const bitstream =
            new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(
              removeEmulationPreventionBytes(sps),
            );
          bitstream.skipBits(1);
          bitstream.skipBits(2);
          const nalUnitType = bitstream.readBits(5);
          if (nalUnitType !== 7) {
            return null;
          }
          const profileIdc = bitstream.readAlignedByte();
          const constraintFlags = bitstream.readAlignedByte();
          const levelIdc = bitstream.readAlignedByte();
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          let chromaFormatIdc = 1;
          let bitDepthLumaMinus8 = 0;
          let bitDepthChromaMinus8 = 0;
          let separateColourPlaneFlag = 0;
          if (
            profileIdc === 100 ||
            profileIdc === 110 ||
            profileIdc === 122 ||
            profileIdc === 244 ||
            profileIdc === 44 ||
            profileIdc === 83 ||
            profileIdc === 86 ||
            profileIdc === 118 ||
            profileIdc === 128
          ) {
            chromaFormatIdc = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(
              bitstream,
            );
            if (chromaFormatIdc === 3) {
              separateColourPlaneFlag = bitstream.readBits(1);
            }
            bitDepthLumaMinus8 = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(
              bitstream,
            );
            bitDepthChromaMinus8 = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            bitstream.skipBits(1);
            const seqScalingMatrixPresentFlag = bitstream.readBits(1);
            if (seqScalingMatrixPresentFlag) {
              for (let i = 0; i < (chromaFormatIdc !== 3 ? 8 : 12); i++) {
                const seqScalingListPresentFlag = bitstream.readBits(1);
                if (seqScalingListPresentFlag) {
                  const sizeOfScalingList = i < 6 ? 16 : 64;
                  let lastScale = 8;
                  let nextScale = 8;
                  for (let j = 0; j < sizeOfScalingList; j++) {
                    if (nextScale !== 0) {
                      const deltaScale = (0,
                      _misc_js__WEBPACK_IMPORTED_MODULE_1__.OO)(bitstream);
                      nextScale = (lastScale + deltaScale + 256) % 256;
                    }
                    lastScale = nextScale === 0 ? lastScale : nextScale;
                  }
                }
              }
            }
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          const picOrderCntType = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(
            bitstream,
          );
          if (picOrderCntType === 0) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          } else if (picOrderCntType === 1) {
            bitstream.skipBits(1);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.OO)(bitstream);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.OO)(bitstream);
            const numRefFramesInPicOrderCntCycle = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            for (let i = 0; i < numRefFramesInPicOrderCntCycle; i++) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.OO)(bitstream);
            }
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          bitstream.skipBits(1);
          const picWidthInMbsMinus1 = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          const picHeightInMapUnitsMinus1 = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          const codedWidth = 16 * (picWidthInMbsMinus1 + 1);
          const codedHeight = 16 * (picHeightInMapUnitsMinus1 + 1);
          let displayWidth = codedWidth;
          let displayHeight = codedHeight;
          const frameMbsOnlyFlag = bitstream.readBits(1);
          if (!frameMbsOnlyFlag) {
            bitstream.skipBits(1);
          }
          bitstream.skipBits(1);
          const frameCroppingFlag = bitstream.readBits(1);
          if (frameCroppingFlag) {
            const frameCropLeftOffset = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            const frameCropRightOffset = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            const frameCropTopOffset = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            const frameCropBottomOffset = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            let cropUnitX;
            let cropUnitY;
            const chromaArrayType =
              separateColourPlaneFlag === 0 ? chromaFormatIdc : 0;
            if (chromaArrayType === 0) {
              cropUnitX = 1;
              cropUnitY = 2 - frameMbsOnlyFlag;
            } else {
              const subWidthC = chromaFormatIdc === 3 ? 1 : 2;
              const subHeightC = chromaFormatIdc === 1 ? 2 : 1;
              cropUnitX = subWidthC;
              cropUnitY = subHeightC * (2 - frameMbsOnlyFlag);
            }
            displayWidth -=
              cropUnitX * (frameCropLeftOffset + frameCropRightOffset);
            displayHeight -=
              cropUnitY * (frameCropTopOffset + frameCropBottomOffset);
          }
          let colourPrimaries = 2;
          let transferCharacteristics = 2;
          let matrixCoefficients = 2;
          let fullRangeFlag = 0;
          let pixelAspectRatio = { num: 1, den: 1 };
          let numReorderFrames = null;
          let maxDecFrameBuffering = null;
          const vuiParametersPresentFlag = bitstream.readBits(1);
          if (vuiParametersPresentFlag) {
            const aspectRatioInfoPresentFlag = bitstream.readBits(1);
            if (aspectRatioInfoPresentFlag) {
              const aspectRatioIdc = bitstream.readBits(8);
              if (aspectRatioIdc === 255) {
                pixelAspectRatio = {
                  num: bitstream.readBits(16),
                  den: bitstream.readBits(16),
                };
              } else {
                const aspectRatio =
                  AVC_HEVC_ASPECT_RATIO_IDC_TABLE[aspectRatioIdc];
                if (aspectRatio) {
                  pixelAspectRatio = aspectRatio;
                }
              }
            }
            const overscanInfoPresentFlag = bitstream.readBits(1);
            if (overscanInfoPresentFlag) {
              bitstream.skipBits(1);
            }
            const videoSignalTypePresentFlag = bitstream.readBits(1);
            if (videoSignalTypePresentFlag) {
              bitstream.skipBits(3);
              fullRangeFlag = bitstream.readBits(1);
              const colourDescriptionPresentFlag = bitstream.readBits(1);
              if (colourDescriptionPresentFlag) {
                colourPrimaries = bitstream.readBits(8);
                transferCharacteristics = bitstream.readBits(8);
                matrixCoefficients = bitstream.readBits(8);
              }
            }
            const chromaLocInfoPresentFlag = bitstream.readBits(1);
            if (chromaLocInfoPresentFlag) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            }
            const timingInfoPresentFlag = bitstream.readBits(1);
            if (timingInfoPresentFlag) {
              bitstream.skipBits(32);
              bitstream.skipBits(32);
              bitstream.skipBits(1);
            }
            const nalHrdParametersPresentFlag = bitstream.readBits(1);
            if (nalHrdParametersPresentFlag) {
              skipAvcHrdParameters(bitstream);
            }
            const vclHrdParametersPresentFlag = bitstream.readBits(1);
            if (vclHrdParametersPresentFlag) {
              skipAvcHrdParameters(bitstream);
            }
            if (nalHrdParametersPresentFlag || vclHrdParametersPresentFlag) {
              bitstream.skipBits(1);
            }
            bitstream.skipBits(1);
            const bitstreamRestrictionFlag = bitstream.readBits(1);
            if (bitstreamRestrictionFlag) {
              bitstream.skipBits(1);
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
              numReorderFrames = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(
                bitstream,
              );
              maxDecFrameBuffering = (0,
              _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            }
          }
          if (numReorderFrames === null) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.vA)(
              maxDecFrameBuffering === null,
            );
            const constraintSet3Flag = constraintFlags & 16;
            if (
              (profileIdc === 44 ||
                profileIdc === 86 ||
                profileIdc === 100 ||
                profileIdc === 110 ||
                profileIdc === 122 ||
                profileIdc === 244) &&
              constraintSet3Flag
            ) {
              numReorderFrames = 0;
              maxDecFrameBuffering = 0;
            } else {
              const picWidthInMbs = picWidthInMbsMinus1 + 1;
              const picHeightInMapUnits = picHeightInMapUnitsMinus1 + 1;
              const frameHeightInMbs =
                (2 - frameMbsOnlyFlag) * picHeightInMapUnits;
              const levelInfo =
                _codec_js__WEBPACK_IMPORTED_MODULE_0__.$3.find(
                  (x) => x.level >= levelIdc,
                ) ??
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__._g)(
                  _codec_js__WEBPACK_IMPORTED_MODULE_0__.$3,
                );
              const maxDpbFrames = Math.min(
                Math.floor(
                  levelInfo.maxDpbMbs / (picWidthInMbs * frameHeightInMbs),
                ),
                16,
              );
              numReorderFrames = maxDpbFrames;
              maxDecFrameBuffering = maxDpbFrames;
            }
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.vA)(
            maxDecFrameBuffering !== null,
          );
          return {
            profileIdc,
            constraintFlags,
            levelIdc,
            frameMbsOnlyFlag,
            chromaFormatIdc,
            bitDepthLumaMinus8,
            bitDepthChromaMinus8,
            codedWidth,
            codedHeight,
            displayWidth,
            displayHeight,
            pixelAspectRatio,
            colourPrimaries,
            matrixCoefficients,
            transferCharacteristics,
            fullRangeFlag,
            numReorderFrames,
            maxDecFrameBuffering,
          };
        } catch (error) {
          _logging_js__WEBPACK_IMPORTED_MODULE_2__.y._error(
            "Error parsing AVC SPS:",
            error,
          );
          return null;
        }
      };
      const skipAvcHrdParameters = (bitstream) => {
        const cpb_cnt_minus1 = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(
          bitstream,
        );
        bitstream.skipBits(4);
        bitstream.skipBits(4);
        for (let i = 0; i <= cpb_cnt_minus1; i++) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          bitstream.skipBits(1);
        }
        bitstream.skipBits(5);
        bitstream.skipBits(5);
        bitstream.skipBits(5);
        bitstream.skipBits(5);
      };
      const concatHevcNalUnits = (nalUnits, decoderConfig) => {
        if (decoderConfig.description) {
          const bytes = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Fo)(
            decoderConfig.description,
          );
          const lengthSizeMinusOne = bytes[21] & 3;
          const lengthSize = lengthSizeMinusOne + 1;
          return concatNalUnitsInLengthPrefixed(nalUnits, lengthSize);
        } else {
          return concatNalUnitsInAnnexB(nalUnits);
        }
      };
      const iterateHevcNalUnits = (packetData, decoderConfig) => {
        if (decoderConfig.description) {
          const bytes = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Fo)(
            decoderConfig.description,
          );
          const lengthSizeMinusOne = bytes[21] & 3;
          const lengthSize = lengthSizeMinusOne + 1;
          return iterateNalUnitsInLengthPrefixed(packetData, lengthSize);
        } else {
          return iterateNalUnitsInAnnexB(packetData);
        }
      };
      const extractNalUnitTypeForHevc = (byte) => {
        return (byte >> 1) & 63;
      };
      const parseHevcSps = (sps) => {
        try {
          const bitstream =
            new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(
              removeEmulationPreventionBytes(sps),
            );
          bitstream.skipBits(16);
          bitstream.readBits(4);
          const spsMaxSubLayersMinus1 = bitstream.readBits(3);
          const spsTemporalIdNestingFlag = bitstream.readBits(1);
          const {
            general_profile_space,
            general_tier_flag,
            general_profile_idc,
            general_profile_compatibility_flags,
            general_constraint_indicator_flags,
            general_level_idc,
          } = parseProfileTierLevel(bitstream, spsMaxSubLayersMinus1);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          const chromaFormatIdc = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(
            bitstream,
          );
          let separateColourPlaneFlag = 0;
          if (chromaFormatIdc === 3) {
            separateColourPlaneFlag = bitstream.readBits(1);
          }
          const picWidthInLumaSamples = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          const picHeightInLumaSamples = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          let displayWidth = picWidthInLumaSamples;
          let displayHeight = picHeightInLumaSamples;
          if (bitstream.readBits(1)) {
            const confWinLeftOffset = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            const confWinRightOffset = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            const confWinTopOffset = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            const confWinBottomOffset = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            let subWidthC = 1;
            let subHeightC = 1;
            const chromaArrayType =
              separateColourPlaneFlag === 0 ? chromaFormatIdc : 0;
            if (chromaArrayType === 1) {
              subWidthC = 2;
              subHeightC = 2;
            } else if (chromaArrayType === 2) {
              subWidthC = 2;
              subHeightC = 1;
            }
            displayWidth -=
              (confWinLeftOffset + confWinRightOffset) * subWidthC;
            displayHeight -=
              (confWinTopOffset + confWinBottomOffset) * subHeightC;
          }
          const bitDepthLumaMinus8 = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          const bitDepthChromaMinus8 = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          const spsSubLayerOrderingInfoPresentFlag = bitstream.readBits(1);
          const startI = spsSubLayerOrderingInfoPresentFlag
            ? 0
            : spsMaxSubLayersMinus1;
          let spsMaxNumReorderPics = 0;
          for (let i = startI; i <= spsMaxSubLayersMinus1; i++) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            spsMaxNumReorderPics = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          if (bitstream.readBits(1)) {
            if (bitstream.readBits(1)) {
              skipScalingListData(bitstream);
            }
          }
          bitstream.skipBits(1);
          bitstream.skipBits(1);
          if (bitstream.readBits(1)) {
            bitstream.skipBits(4);
            bitstream.skipBits(4);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            bitstream.skipBits(1);
          }
          const numShortTermRefPicSets = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          skipAllStRefPicSets(bitstream, numShortTermRefPicSets);
          if (bitstream.readBits(1)) {
            const numLongTermRefPicsSps = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            for (let i = 0; i < numLongTermRefPicsSps; i++) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
              bitstream.skipBits(1);
            }
          }
          bitstream.skipBits(1);
          bitstream.skipBits(1);
          let colourPrimaries = 2;
          let transferCharacteristics = 2;
          let matrixCoefficients = 2;
          let fullRangeFlag = 0;
          let minSpatialSegmentationIdc = 0;
          let pixelAspectRatio = { num: 1, den: 1 };
          if (bitstream.readBits(1)) {
            const vui = parseHevcVui(bitstream, spsMaxSubLayersMinus1);
            pixelAspectRatio = vui.pixelAspectRatio;
            colourPrimaries = vui.colourPrimaries;
            transferCharacteristics = vui.transferCharacteristics;
            matrixCoefficients = vui.matrixCoefficients;
            fullRangeFlag = vui.fullRangeFlag;
            minSpatialSegmentationIdc = vui.minSpatialSegmentationIdc;
          }
          return {
            displayWidth,
            displayHeight,
            pixelAspectRatio,
            colourPrimaries,
            transferCharacteristics,
            matrixCoefficients,
            fullRangeFlag,
            maxDecFrameBuffering: spsMaxNumReorderPics + 1,
            spsMaxSubLayersMinus1,
            spsTemporalIdNestingFlag,
            generalProfileSpace: general_profile_space,
            generalTierFlag: general_tier_flag,
            generalProfileIdc: general_profile_idc,
            generalProfileCompatibilityFlags:
              general_profile_compatibility_flags,
            generalConstraintIndicatorFlags: general_constraint_indicator_flags,
            generalLevelIdc: general_level_idc,
            chromaFormatIdc,
            bitDepthLumaMinus8,
            bitDepthChromaMinus8,
            minSpatialSegmentationIdc,
          };
        } catch (error) {
          _logging_js__WEBPACK_IMPORTED_MODULE_2__.y._error(
            "Error parsing HEVC SPS:",
            error,
          );
          return null;
        }
      };
      const extractHevcDecoderConfigurationRecord = (packetData) => {
        try {
          const vpsUnits = [];
          const spsUnits = [];
          const ppsUnits = [];
          const seiUnits = [];
          for (const loc of iterateNalUnitsInAnnexB(packetData)) {
            const nalUnit = packetData.subarray(
              loc.offset,
              loc.offset + loc.length,
            );
            const type = extractNalUnitTypeForHevc(nalUnit[0]);
            if (type === HevcNalUnitType.VPS_NUT) {
              vpsUnits.push(nalUnit);
            } else if (type === HevcNalUnitType.SPS_NUT) {
              spsUnits.push(nalUnit);
            } else if (type === HevcNalUnitType.PPS_NUT) {
              ppsUnits.push(nalUnit);
            } else if (
              type === HevcNalUnitType.PREFIX_SEI_NUT ||
              type === HevcNalUnitType.SUFFIX_SEI_NUT
            ) {
              seiUnits.push(nalUnit);
            }
          }
          if (spsUnits.length === 0 || ppsUnits.length === 0) return null;
          const spsInfo = parseHevcSps(spsUnits[0]);
          if (!spsInfo) return null;
          let parallelismType = 0;
          if (ppsUnits.length > 0) {
            const pps = ppsUnits[0];
            const ppsBitstream =
              new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(
                removeEmulationPreventionBytes(pps),
              );
            ppsBitstream.skipBits(16);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(ppsBitstream);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(ppsBitstream);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(3);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(ppsBitstream);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(ppsBitstream);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.OO)(ppsBitstream);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            if (ppsBitstream.readBits(1)) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(ppsBitstream);
            }
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.OO)(ppsBitstream);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.OO)(ppsBitstream);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            ppsBitstream.skipBits(1);
            const tiles_enabled_flag = ppsBitstream.readBits(1);
            const entropy_coding_sync_enabled_flag = ppsBitstream.readBits(1);
            if (!tiles_enabled_flag && !entropy_coding_sync_enabled_flag)
              parallelismType = 0;
            else if (tiles_enabled_flag && !entropy_coding_sync_enabled_flag)
              parallelismType = 2;
            else if (!tiles_enabled_flag && entropy_coding_sync_enabled_flag)
              parallelismType = 3;
            else parallelismType = 0;
          }
          const arrays = [
            ...(vpsUnits.length
              ? [
                  {
                    arrayCompleteness: 1,
                    nalUnitType: HevcNalUnitType.VPS_NUT,
                    nalUnits: vpsUnits,
                  },
                ]
              : []),
            ...(spsUnits.length
              ? [
                  {
                    arrayCompleteness: 1,
                    nalUnitType: HevcNalUnitType.SPS_NUT,
                    nalUnits: spsUnits,
                  },
                ]
              : []),
            ...(ppsUnits.length
              ? [
                  {
                    arrayCompleteness: 1,
                    nalUnitType: HevcNalUnitType.PPS_NUT,
                    nalUnits: ppsUnits,
                  },
                ]
              : []),
            ...(seiUnits.length
              ? [
                  {
                    arrayCompleteness: 1,
                    nalUnitType: extractNalUnitTypeForHevc(seiUnits[0][0]),
                    nalUnits: seiUnits,
                  },
                ]
              : []),
          ];
          const record = {
            configurationVersion: 1,
            generalProfileSpace: spsInfo.generalProfileSpace,
            generalTierFlag: spsInfo.generalTierFlag,
            generalProfileIdc: spsInfo.generalProfileIdc,
            generalProfileCompatibilityFlags:
              spsInfo.generalProfileCompatibilityFlags,
            generalConstraintIndicatorFlags:
              spsInfo.generalConstraintIndicatorFlags,
            generalLevelIdc: spsInfo.generalLevelIdc,
            minSpatialSegmentationIdc: spsInfo.minSpatialSegmentationIdc,
            parallelismType,
            chromaFormatIdc: spsInfo.chromaFormatIdc,
            bitDepthLumaMinus8: spsInfo.bitDepthLumaMinus8,
            bitDepthChromaMinus8: spsInfo.bitDepthChromaMinus8,
            avgFrameRate: 0,
            constantFrameRate: 0,
            numTemporalLayers: spsInfo.spsMaxSubLayersMinus1 + 1,
            temporalIdNested: spsInfo.spsTemporalIdNestingFlag,
            lengthSizeMinusOne: 3,
            arrays,
          };
          return record;
        } catch (error) {
          _logging_js__WEBPACK_IMPORTED_MODULE_2__.y._error(
            "Error building HEVC Decoder Configuration Record:",
            error,
          );
          return null;
        }
      };
      const parseProfileTierLevel = (bitstream, maxNumSubLayersMinus1) => {
        const general_profile_space = bitstream.readBits(2);
        const general_tier_flag = bitstream.readBits(1);
        const general_profile_idc = bitstream.readBits(5);
        let general_profile_compatibility_flags = 0;
        for (let i = 0; i < 32; i++) {
          general_profile_compatibility_flags =
            (general_profile_compatibility_flags << 1) | bitstream.readBits(1);
        }
        const general_constraint_indicator_flags = new Uint8Array(6);
        for (let i = 0; i < 6; i++) {
          general_constraint_indicator_flags[i] = bitstream.readBits(8);
        }
        const general_level_idc = bitstream.readBits(8);
        const sub_layer_profile_present_flag = [];
        const sub_layer_level_present_flag = [];
        for (let i = 0; i < maxNumSubLayersMinus1; i++) {
          sub_layer_profile_present_flag.push(bitstream.readBits(1));
          sub_layer_level_present_flag.push(bitstream.readBits(1));
        }
        if (maxNumSubLayersMinus1 > 0) {
          for (let i = maxNumSubLayersMinus1; i < 8; i++) {
            bitstream.skipBits(2);
          }
        }
        for (let i = 0; i < maxNumSubLayersMinus1; i++) {
          if (sub_layer_profile_present_flag[i]) bitstream.skipBits(88);
          if (sub_layer_level_present_flag[i]) bitstream.skipBits(8);
        }
        return {
          general_profile_space,
          general_tier_flag,
          general_profile_idc,
          general_profile_compatibility_flags,
          general_constraint_indicator_flags,
          general_level_idc,
        };
      };
      const skipScalingListData = (bitstream) => {
        for (let sizeId = 0; sizeId < 4; sizeId++) {
          for (
            let matrixId = 0;
            matrixId < (sizeId === 3 ? 2 : 6);
            matrixId++
          ) {
            const scaling_list_pred_mode_flag = bitstream.readBits(1);
            if (!scaling_list_pred_mode_flag) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            } else {
              const coefNum = Math.min(64, 1 << (4 + (sizeId << 1)));
              if (sizeId > 1) {
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.OO)(bitstream);
              }
              for (let i = 0; i < coefNum; i++) {
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.OO)(bitstream);
              }
            }
          }
        }
      };
      const skipAllStRefPicSets = (bitstream, num_short_term_ref_pic_sets) => {
        const NumDeltaPocs = [];
        for (
          let stRpsIdx = 0;
          stRpsIdx < num_short_term_ref_pic_sets;
          stRpsIdx++
        ) {
          NumDeltaPocs[stRpsIdx] = skipStRefPicSet(
            bitstream,
            stRpsIdx,
            num_short_term_ref_pic_sets,
            NumDeltaPocs,
          );
        }
      };
      const skipStRefPicSet = (
        bitstream,
        stRpsIdx,
        num_short_term_ref_pic_sets,
        NumDeltaPocs,
      ) => {
        let NumDeltaPocsThis = 0;
        let inter_ref_pic_set_prediction_flag = 0;
        let RefRpsIdx = 0;
        if (stRpsIdx !== 0) {
          inter_ref_pic_set_prediction_flag = bitstream.readBits(1);
        }
        if (inter_ref_pic_set_prediction_flag) {
          if (stRpsIdx === num_short_term_ref_pic_sets) {
            const delta_idx_minus1 = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            RefRpsIdx = stRpsIdx - (delta_idx_minus1 + 1);
          } else {
            RefRpsIdx = stRpsIdx - 1;
          }
          bitstream.readBits(1);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          const numDelta = NumDeltaPocs[RefRpsIdx] ?? 0;
          for (let j = 0; j <= numDelta; j++) {
            const used_by_curr_pic_flag = bitstream.readBits(1);
            if (!used_by_curr_pic_flag) {
              bitstream.readBits(1);
            }
          }
          NumDeltaPocsThis = NumDeltaPocs[RefRpsIdx];
        } else {
          const num_negative_pics = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          const num_positive_pics = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          for (let i = 0; i < num_negative_pics; i++) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            bitstream.readBits(1);
          }
          for (let i = 0; i < num_positive_pics; i++) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            bitstream.readBits(1);
          }
          NumDeltaPocsThis = num_negative_pics + num_positive_pics;
        }
        return NumDeltaPocsThis;
      };
      const parseHevcVui = (bitstream, sps_max_sub_layers_minus1) => {
        let colourPrimaries = 2;
        let transferCharacteristics = 2;
        let matrixCoefficients = 2;
        let fullRangeFlag = 0;
        let minSpatialSegmentationIdc = 0;
        let pixelAspectRatio = { num: 1, den: 1 };
        if (bitstream.readBits(1)) {
          const aspect_ratio_idc = bitstream.readBits(8);
          if (aspect_ratio_idc === 255) {
            pixelAspectRatio = {
              num: bitstream.readBits(16),
              den: bitstream.readBits(16),
            };
          } else {
            const aspectRatio =
              AVC_HEVC_ASPECT_RATIO_IDC_TABLE[aspect_ratio_idc];
            if (aspectRatio) {
              pixelAspectRatio = aspectRatio;
            }
          }
        }
        if (bitstream.readBits(1)) {
          bitstream.readBits(1);
        }
        if (bitstream.readBits(1)) {
          bitstream.readBits(3);
          fullRangeFlag = bitstream.readBits(1);
          if (bitstream.readBits(1)) {
            colourPrimaries = bitstream.readBits(8);
            transferCharacteristics = bitstream.readBits(8);
            matrixCoefficients = bitstream.readBits(8);
          }
        }
        if (bitstream.readBits(1)) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
        }
        bitstream.readBits(1);
        bitstream.readBits(1);
        bitstream.readBits(1);
        if (bitstream.readBits(1)) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
        }
        if (bitstream.readBits(1)) {
          bitstream.readBits(32);
          bitstream.readBits(32);
          if (bitstream.readBits(1)) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          }
          if (bitstream.readBits(1)) {
            skipHevcHrdParameters(bitstream, true, sps_max_sub_layers_minus1);
          }
        }
        if (bitstream.readBits(1)) {
          bitstream.readBits(1);
          bitstream.readBits(1);
          bitstream.readBits(1);
          minSpatialSegmentationIdc = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
        }
        return {
          pixelAspectRatio,
          colourPrimaries,
          transferCharacteristics,
          matrixCoefficients,
          fullRangeFlag,
          minSpatialSegmentationIdc,
        };
      };
      const skipHevcHrdParameters = (
        bitstream,
        commonInfPresentFlag,
        maxNumSubLayersMinus1,
      ) => {
        let nal_hrd_parameters_present_flag = false;
        let vcl_hrd_parameters_present_flag = false;
        let sub_pic_hrd_params_present_flag = false;
        if (commonInfPresentFlag) {
          nal_hrd_parameters_present_flag = bitstream.readBits(1) === 1;
          vcl_hrd_parameters_present_flag = bitstream.readBits(1) === 1;
          if (
            nal_hrd_parameters_present_flag ||
            vcl_hrd_parameters_present_flag
          ) {
            sub_pic_hrd_params_present_flag = bitstream.readBits(1) === 1;
            if (sub_pic_hrd_params_present_flag) {
              bitstream.readBits(8);
              bitstream.readBits(5);
              bitstream.readBits(1);
              bitstream.readBits(5);
            }
            bitstream.readBits(4);
            bitstream.readBits(4);
            if (sub_pic_hrd_params_present_flag) {
              bitstream.readBits(4);
            }
            bitstream.readBits(5);
            bitstream.readBits(5);
            bitstream.readBits(5);
          }
        }
        for (let i = 0; i <= maxNumSubLayersMinus1; i++) {
          const fixed_pic_rate_general_flag = bitstream.readBits(1) === 1;
          let fixed_pic_rate_within_cvs_flag = true;
          if (!fixed_pic_rate_general_flag) {
            fixed_pic_rate_within_cvs_flag = bitstream.readBits(1) === 1;
          }
          let low_delay_hrd_flag = false;
          if (fixed_pic_rate_within_cvs_flag) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          } else {
            low_delay_hrd_flag = bitstream.readBits(1) === 1;
          }
          let CpbCnt = 1;
          if (!low_delay_hrd_flag) {
            const cpb_cnt_minus1 = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            CpbCnt = cpb_cnt_minus1 + 1;
          }
          if (nal_hrd_parameters_present_flag) {
            skipSubLayerHrdParameters(
              bitstream,
              CpbCnt,
              sub_pic_hrd_params_present_flag,
            );
          }
          if (vcl_hrd_parameters_present_flag) {
            skipSubLayerHrdParameters(
              bitstream,
              CpbCnt,
              sub_pic_hrd_params_present_flag,
            );
          }
        }
      };
      const skipSubLayerHrdParameters = (
        bitstream,
        CpbCnt,
        sub_pic_hrd_params_present_flag,
      ) => {
        for (let i = 0; i < CpbCnt; i++) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          if (sub_pic_hrd_params_present_flag) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
          }
          bitstream.readBits(1);
        }
      };
      const serializeHevcDecoderConfigurationRecord = (record) => {
        const bytes = [];
        bytes.push(record.configurationVersion);
        bytes.push(
          ((record.generalProfileSpace & 3) << 6) |
            ((record.generalTierFlag & 1) << 5) |
            (record.generalProfileIdc & 31),
        );
        bytes.push((record.generalProfileCompatibilityFlags >>> 24) & 255);
        bytes.push((record.generalProfileCompatibilityFlags >>> 16) & 255);
        bytes.push((record.generalProfileCompatibilityFlags >>> 8) & 255);
        bytes.push(record.generalProfileCompatibilityFlags & 255);
        bytes.push(...record.generalConstraintIndicatorFlags);
        bytes.push(record.generalLevelIdc & 255);
        bytes.push(240 | ((record.minSpatialSegmentationIdc >> 8) & 15));
        bytes.push(record.minSpatialSegmentationIdc & 255);
        bytes.push(252 | (record.parallelismType & 3));
        bytes.push(252 | (record.chromaFormatIdc & 3));
        bytes.push(248 | (record.bitDepthLumaMinus8 & 7));
        bytes.push(248 | (record.bitDepthChromaMinus8 & 7));
        bytes.push((record.avgFrameRate >> 8) & 255);
        bytes.push(record.avgFrameRate & 255);
        bytes.push(
          ((record.constantFrameRate & 3) << 6) |
            ((record.numTemporalLayers & 7) << 3) |
            ((record.temporalIdNested & 1) << 2) |
            (record.lengthSizeMinusOne & 3),
        );
        bytes.push(record.arrays.length & 255);
        for (const arr of record.arrays) {
          bytes.push(
            ((arr.arrayCompleteness & 1) << 7) |
              (0 << 6) |
              (arr.nalUnitType & 63),
          );
          bytes.push((arr.nalUnits.length >> 8) & 255);
          bytes.push(arr.nalUnits.length & 255);
          for (const nal of arr.nalUnits) {
            bytes.push((nal.length >> 8) & 255);
            bytes.push(nal.length & 255);
            for (let i = 0; i < nal.length; i++) {
              bytes.push(nal[i]);
            }
          }
        }
        return new Uint8Array(bytes);
      };
      const deserializeHevcDecoderConfigurationRecord = (data) => {
        try {
          const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(data);
          let offset = 0;
          const configurationVersion = view.getUint8(offset++);
          const byte1 = view.getUint8(offset++);
          const generalProfileSpace = (byte1 >> 6) & 3;
          const generalTierFlag = (byte1 >> 5) & 1;
          const generalProfileIdc = byte1 & 31;
          const generalProfileCompatibilityFlags = view.getUint32(
            offset,
            false,
          );
          offset += 4;
          const generalConstraintIndicatorFlags = data.subarray(
            offset,
            offset + 6,
          );
          offset += 6;
          const generalLevelIdc = view.getUint8(offset++);
          const minSpatialSegmentationIdc =
            ((view.getUint8(offset++) & 15) << 8) | view.getUint8(offset++);
          const parallelismType = view.getUint8(offset++) & 3;
          const chromaFormatIdc = view.getUint8(offset++) & 3;
          const bitDepthLumaMinus8 = view.getUint8(offset++) & 7;
          const bitDepthChromaMinus8 = view.getUint8(offset++) & 7;
          const avgFrameRate = view.getUint16(offset, false);
          offset += 2;
          const byte21 = view.getUint8(offset++);
          const constantFrameRate = (byte21 >> 6) & 3;
          const numTemporalLayers = (byte21 >> 3) & 7;
          const temporalIdNested = (byte21 >> 2) & 1;
          const lengthSizeMinusOne = byte21 & 3;
          const numOfArrays = view.getUint8(offset++);
          const arrays = [];
          for (let i = 0; i < numOfArrays; i++) {
            const arrByte = view.getUint8(offset++);
            const arrayCompleteness = (arrByte >> 7) & 1;
            const nalUnitType = arrByte & 63;
            const numNalus = view.getUint16(offset, false);
            offset += 2;
            const nalUnits = [];
            for (let j = 0; j < numNalus; j++) {
              const nalUnitLength = view.getUint16(offset, false);
              offset += 2;
              nalUnits.push(data.subarray(offset, offset + nalUnitLength));
              offset += nalUnitLength;
            }
            arrays.push({
              arrayCompleteness,
              nalUnitType,
              nalUnits,
            });
          }
          return {
            configurationVersion,
            generalProfileSpace,
            generalTierFlag,
            generalProfileIdc,
            generalProfileCompatibilityFlags,
            generalConstraintIndicatorFlags,
            generalLevelIdc,
            minSpatialSegmentationIdc,
            parallelismType,
            chromaFormatIdc,
            bitDepthLumaMinus8,
            bitDepthChromaMinus8,
            avgFrameRate,
            constantFrameRate,
            numTemporalLayers,
            temporalIdNested,
            lengthSizeMinusOne,
            arrays,
          };
        } catch (error) {
          _logging_js__WEBPACK_IMPORTED_MODULE_2__.y._error(
            "Error deserializing HEVC Decoder Configuration Record:",
            error,
          );
          return null;
        }
      };
      var HevcNaluOrderState;
      (function (HevcNaluOrderState2) {
        HevcNaluOrderState2[(HevcNaluOrderState2["audAllowed"] = 0)] =
          "audAllowed";
        HevcNaluOrderState2[(HevcNaluOrderState2["beforeFirstVcl"] = 1)] =
          "beforeFirstVcl";
        HevcNaluOrderState2[(HevcNaluOrderState2["afterFirstVcl"] = 2)] =
          "afterFirstVcl";
        HevcNaluOrderState2[(HevcNaluOrderState2["eoBitstreamAllowed"] = 3)] =
          "eoBitstreamAllowed";
        HevcNaluOrderState2[(HevcNaluOrderState2["noMoreDataAllowed"] = 4)] =
          "noMoreDataAllowed";
      })(HevcNaluOrderState || (HevcNaluOrderState = {}));
      const sanitizeHevcPacketForChromium = (packetData, decoderConfig) => {
        const removedNalUnits = /* @__PURE__ */ new Set();
        let orderState = HevcNaluOrderState.audAllowed;
        for (const loc of iterateHevcNalUnits(packetData, decoderConfig)) {
          if (orderState === HevcNaluOrderState.noMoreDataAllowed) {
            removedNalUnits.add(loc.offset);
            continue;
          }
          const type = extractNalUnitTypeForHevc(packetData[loc.offset]);
          if (
            orderState === HevcNaluOrderState.eoBitstreamAllowed &&
            type !== 37
          ) {
            removedNalUnits.add(loc.offset);
            continue;
          }
          let remove = false;
          if (type === 35) {
            if (orderState > HevcNaluOrderState.audAllowed) {
              remove = true;
            } else {
              orderState = HevcNaluOrderState.beforeFirstVcl;
            }
          } else if (type <= 31) {
            if (orderState > HevcNaluOrderState.afterFirstVcl) {
              remove = true;
            } else {
              orderState = HevcNaluOrderState.afterFirstVcl;
            }
          } else if (type === 36) {
            if (orderState !== HevcNaluOrderState.afterFirstVcl) {
              remove = true;
            } else {
              orderState = HevcNaluOrderState.eoBitstreamAllowed;
            }
          } else if (type === 37) {
            if (orderState < HevcNaluOrderState.afterFirstVcl) {
              remove = true;
            } else {
              orderState = HevcNaluOrderState.noMoreDataAllowed;
            }
          } else if (
            type === 32 ||
            type === 33 ||
            type === 34 ||
            type === 39 ||
            (type >= 41 && type <= 44) ||
            (type >= 48 && type <= 55)
          ) {
            if (orderState > HevcNaluOrderState.beforeFirstVcl) {
              remove = true;
            } else {
              orderState = HevcNaluOrderState.beforeFirstVcl;
            }
          } else if (
            type === 38 ||
            type === 40 ||
            (type >= 45 && type <= 47) ||
            (type >= 56 && type <= 63)
          ) {
            if (orderState < HevcNaluOrderState.afterFirstVcl) {
              remove = true;
            }
          }
          if (remove) {
            removedNalUnits.add(loc.offset);
          }
        }
        if (removedNalUnits.size === 0) {
          return null;
        }
        const filteredNalUnits = [];
        for (const loc of iterateHevcNalUnits(packetData, decoderConfig)) {
          if (!removedNalUnits.has(loc.offset)) {
            filteredNalUnits.push(
              packetData.subarray(loc.offset, loc.offset + loc.length),
            );
          }
        }
        return concatHevcNalUnits(filteredNalUnits, decoderConfig);
      };
      const VP9_COLOR_SPACE_TABLE = {
        1: {
          colourPrimaries: 5,
          transferCharacteristics: 6,
          matrixCoefficients: 5,
        },
        // CS_BT_601
        2: {
          colourPrimaries: 1,
          transferCharacteristics: 1,
          matrixCoefficients: 1,
        },
        // CS_BT_709
        3: {
          colourPrimaries: 6,
          transferCharacteristics: 6,
          matrixCoefficients: 6,
        },
        // CS_SMPTE_170
        4: {
          colourPrimaries: 7,
          transferCharacteristics: 7,
          matrixCoefficients: 7,
        },
        // CS_SMPTE_240
        5: {
          colourPrimaries: 9,
          transferCharacteristics: 14,
          matrixCoefficients: 9,
        },
        // CS_BT_2020
        7: {
          colourPrimaries: 1,
          transferCharacteristics: 13,
          matrixCoefficients: 0,
        },
        // CS_RGB (sRGB)
      };
      const extractVp9CodecInfoFromPacket = (packet) => {
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(packet);
        const frameMarker = bitstream.readBits(2);
        if (frameMarker !== 2) {
          return null;
        }
        const profileLowBit = bitstream.readBits(1);
        const profileHighBit = bitstream.readBits(1);
        const profile = (profileHighBit << 1) + profileLowBit;
        if (profile === 3) {
          bitstream.skipBits(1);
        }
        const showExistingFrame = bitstream.readBits(1);
        if (showExistingFrame === 1) {
          return null;
        }
        const frameType = bitstream.readBits(1);
        if (frameType !== 0) {
          return null;
        }
        bitstream.skipBits(2);
        const syncCode = bitstream.readBits(24);
        if (syncCode !== 4817730) {
          return null;
        }
        let bitDepth = 8;
        if (profile >= 2) {
          const tenOrTwelveBit = bitstream.readBits(1);
          bitDepth = tenOrTwelveBit ? 12 : 10;
        }
        const colorSpace = bitstream.readBits(3);
        let chromaSubsampling = 0;
        let videoFullRangeFlag = 0;
        if (colorSpace !== 7) {
          const colorRange = bitstream.readBits(1);
          videoFullRangeFlag = colorRange;
          if (profile === 1 || profile === 3) {
            const subsamplingX = bitstream.readBits(1);
            const subsamplingY = bitstream.readBits(1);
            chromaSubsampling =
              !subsamplingX && !subsamplingY
                ? 3
                : subsamplingX && !subsamplingY
                  ? 2
                  : 1;
            bitstream.skipBits(1);
          } else {
            chromaSubsampling = 1;
          }
        } else {
          chromaSubsampling = 3;
          videoFullRangeFlag = 1;
        }
        const widthMinusOne = bitstream.readBits(16);
        const heightMinusOne = bitstream.readBits(16);
        const width = widthMinusOne + 1;
        const height = heightMinusOne + 1;
        const pictureSize = width * height;
        let level = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__._g)(
          _codec_js__WEBPACK_IMPORTED_MODULE_0__.ye,
        ).level;
        for (const entry of _codec_js__WEBPACK_IMPORTED_MODULE_0__.ye) {
          if (pictureSize <= entry.maxPictureSize) {
            level = entry.level;
            break;
          }
        }
        const colorSpaceValues = VP9_COLOR_SPACE_TABLE[colorSpace];
        const colourPrimaries = colorSpaceValues?.colourPrimaries ?? 2;
        const transferCharacteristics =
          colorSpaceValues?.transferCharacteristics ?? 2;
        const matrixCoefficients = colorSpaceValues?.matrixCoefficients ?? 2;
        return {
          profile,
          level,
          bitDepth,
          chromaSubsampling,
          videoFullRangeFlag,
          colourPrimaries,
          transferCharacteristics,
          matrixCoefficients,
        };
      };
      const vp9CodecInfoHasColorInfo = (info) => {
        return (
          info.colourPrimaries !== 2 ||
          info.transferCharacteristics !== 2 ||
          info.matrixCoefficients !== 2
        );
      };
      const iterateAv1PacketObus = function* (packet) {
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(packet);
        const readLeb128 = () => {
          let value = 0;
          for (let i = 0; i < 8; i++) {
            const byte = bitstream.readAlignedByte();
            value += (byte & 127) * 2 ** (i * 7);
            if (!(byte & 128)) {
              break;
            }
            if (i === 7 && byte & 128) {
              return null;
            }
          }
          if (value > 2 ** 32 - 1) {
            return null;
          }
          return value;
        };
        while (bitstream.getBitsLeft() >= 8) {
          bitstream.skipBits(1);
          const obuType = bitstream.readBits(4);
          const obuExtension = bitstream.readBits(1);
          const obuHasSizeField = bitstream.readBits(1);
          bitstream.skipBits(1);
          if (obuExtension) {
            bitstream.skipBits(8);
          }
          let obuSize;
          if (obuHasSizeField) {
            const obuSizeValue = readLeb128();
            if (obuSizeValue === null) return;
            obuSize = obuSizeValue;
          } else {
            obuSize = Math.floor(bitstream.getBitsLeft() / 8);
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.vA)(
            bitstream.pos % 8 === 0,
          );
          yield {
            type: obuType,
            data: packet.subarray(
              bitstream.pos / 8,
              bitstream.pos / 8 + obuSize,
            ),
          };
          bitstream.skipBits(obuSize * 8);
        }
      };
      const extractAv1CodecInfoFromPacket = (packet) => {
        for (const { type, data } of iterateAv1PacketObus(packet)) {
          if (type !== 1) {
            continue;
          }
          const bitstream =
            new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(data);
          const seqProfile = bitstream.readBits(3);
          const stillPicture = bitstream.readBits(1);
          const reducedStillPictureHeader = bitstream.readBits(1);
          let seqLevel = 0;
          let seqTier = 0;
          let bufferDelayLengthMinus1 = 0;
          if (reducedStillPictureHeader) {
            seqLevel = bitstream.readBits(5);
          } else {
            const timingInfoPresentFlag = bitstream.readBits(1);
            let decoderModelInfoPresentFlag = 0;
            if (timingInfoPresentFlag) {
              bitstream.skipBits(32);
              bitstream.skipBits(32);
              const equalPictureInterval = bitstream.readBits(1);
              if (equalPictureInterval) {
                let leadingZeros = 0;
                while (leadingZeros < 32 && !bitstream.readBits(1)) {
                  leadingZeros++;
                }
                if (leadingZeros < 32) {
                  bitstream.skipBits(leadingZeros);
                }
              }
              decoderModelInfoPresentFlag = bitstream.readBits(1);
              if (decoderModelInfoPresentFlag) {
                bufferDelayLengthMinus1 = bitstream.readBits(5);
                bitstream.skipBits(32);
                bitstream.skipBits(5);
                bitstream.skipBits(5);
              }
            }
            const initialDisplayDelayPresentFlag = bitstream.readBits(1);
            const operatingPointsCntMinus1 = bitstream.readBits(5);
            for (let i = 0; i <= operatingPointsCntMinus1; i++) {
              bitstream.skipBits(12);
              const seqLevelIdx = bitstream.readBits(5);
              if (i === 0) {
                seqLevel = seqLevelIdx;
              }
              if (seqLevelIdx > 7) {
                const seqTierTemp = bitstream.readBits(1);
                if (i === 0) {
                  seqTier = seqTierTemp;
                }
              }
              if (decoderModelInfoPresentFlag) {
                const decoderModelPresentForThisOp = bitstream.readBits(1);
                if (decoderModelPresentForThisOp) {
                  const n = bufferDelayLengthMinus1 + 1;
                  bitstream.skipBits(n);
                  bitstream.skipBits(n);
                  bitstream.skipBits(1);
                }
              }
              if (initialDisplayDelayPresentFlag) {
                const initialDisplayDelayPresentForThisOp =
                  bitstream.readBits(1);
                if (initialDisplayDelayPresentForThisOp) {
                  bitstream.skipBits(4);
                }
              }
            }
          }
          const frameWidthBitsMinus1 = bitstream.readBits(4);
          const frameHeightBitsMinus1 = bitstream.readBits(4);
          const n1 = frameWidthBitsMinus1 + 1;
          bitstream.skipBits(n1);
          const n2 = frameHeightBitsMinus1 + 1;
          bitstream.skipBits(n2);
          let frameIdNumbersPresentFlag = 0;
          if (reducedStillPictureHeader) {
            frameIdNumbersPresentFlag = 0;
          } else {
            frameIdNumbersPresentFlag = bitstream.readBits(1);
          }
          if (frameIdNumbersPresentFlag) {
            bitstream.skipBits(4);
            bitstream.skipBits(3);
          }
          bitstream.skipBits(1);
          bitstream.skipBits(1);
          bitstream.skipBits(1);
          if (!reducedStillPictureHeader) {
            bitstream.skipBits(1);
            bitstream.skipBits(1);
            bitstream.skipBits(1);
            bitstream.skipBits(1);
            const enableOrderHint = bitstream.readBits(1);
            if (enableOrderHint) {
              bitstream.skipBits(1);
              bitstream.skipBits(1);
            }
            const seqChooseScreenContentTools = bitstream.readBits(1);
            let seqForceScreenContentTools = 0;
            if (seqChooseScreenContentTools) {
              seqForceScreenContentTools = 2;
            } else {
              seqForceScreenContentTools = bitstream.readBits(1);
            }
            if (seqForceScreenContentTools > 0) {
              const seqChooseIntegerMv = bitstream.readBits(1);
              if (!seqChooseIntegerMv) {
                bitstream.skipBits(1);
              }
            }
            if (enableOrderHint) {
              bitstream.skipBits(3);
            }
          }
          bitstream.skipBits(1);
          bitstream.skipBits(1);
          bitstream.skipBits(1);
          const highBitdepth = bitstream.readBits(1);
          let bitDepth = 8;
          if (seqProfile === 2 && highBitdepth) {
            const twelveBit = bitstream.readBits(1);
            bitDepth = twelveBit ? 12 : 10;
          } else if (seqProfile <= 2) {
            bitDepth = highBitdepth ? 10 : 8;
          }
          let monochrome = 0;
          if (seqProfile !== 1) {
            monochrome = bitstream.readBits(1);
          }
          let colourPrimaries = 2;
          let transferCharacteristics = 2;
          let matrixCoefficients = 2;
          const colorDescriptionPresentFlag = bitstream.readBits(1);
          if (colorDescriptionPresentFlag) {
            colourPrimaries = bitstream.readBits(8);
            transferCharacteristics = bitstream.readBits(8);
            matrixCoefficients = bitstream.readBits(8);
          }
          let videoFullRangeFlag = 0;
          let chromaSubsamplingX = 1;
          let chromaSubsamplingY = 1;
          let chromaSamplePosition = 0;
          if (monochrome) {
            videoFullRangeFlag = bitstream.readBits(1);
          } else if (
            colourPrimaries === 1 &&
            transferCharacteristics === 13 &&
            matrixCoefficients === 0
          ) {
            videoFullRangeFlag = 1;
            chromaSubsamplingX = 0;
            chromaSubsamplingY = 0;
          } else {
            videoFullRangeFlag = bitstream.readBits(1);
            if (seqProfile === 0) {
              chromaSubsamplingX = 1;
              chromaSubsamplingY = 1;
            } else if (seqProfile === 1) {
              chromaSubsamplingX = 0;
              chromaSubsamplingY = 0;
            } else {
              if (bitDepth === 12) {
                chromaSubsamplingX = bitstream.readBits(1);
                chromaSubsamplingY = chromaSubsamplingX
                  ? bitstream.readBits(1)
                  : 0;
              } else {
                chromaSubsamplingX = 1;
                chromaSubsamplingY = 0;
              }
            }
            if (chromaSubsamplingX && chromaSubsamplingY) {
              chromaSamplePosition = bitstream.readBits(2);
            }
          }
          return {
            profile: seqProfile,
            level: seqLevel,
            tier: seqTier,
            bitDepth,
            monochrome,
            chromaSubsamplingX,
            chromaSubsamplingY,
            chromaSamplePosition,
            videoFullRangeFlag,
            colourPrimaries,
            transferCharacteristics,
            matrixCoefficients,
          };
        }
        return null;
      };
      const av1CodecInfoHasColorInfo = (info) => {
        return (
          info.colourPrimaries !== 2 ||
          info.transferCharacteristics !== 2 ||
          info.matrixCoefficients !== 2
        );
      };
      const extractProresCodecInfoFromPacket = (packet) => {
        const frameHeaderStart = 8;
        if (packet.length < frameHeaderStart + 28) {
          return null;
        }
        const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(packet);
        if (view.getUint32(4) !== 1768124518) {
          return null;
        }
        const headerSize = view.getUint16(frameHeaderStart);
        if (headerSize < 28) {
          return null;
        }
        return {
          fullRange: false,
          // ProRes is always limited range
          colourPrimaries: view.getUint8(frameHeaderStart + 14),
          transferCharacteristics: view.getUint8(frameHeaderStart + 15),
          matrixCoefficients: view.getUint8(frameHeaderStart + 16),
        };
      };
      const parseOpusIdentificationHeader = (bytes) => {
        const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(bytes);
        const outputChannelCount = view.getUint8(9);
        const preSkip = view.getUint16(10, true);
        const inputSampleRate = view.getUint32(12, true);
        const outputGain = view.getInt16(16, true);
        const channelMappingFamily = view.getUint8(18);
        let channelMappingTable = null;
        if (channelMappingFamily) {
          channelMappingTable = bytes.subarray(19, 19 + 2 + outputChannelCount);
        }
        return {
          outputChannelCount,
          preSkip,
          inputSampleRate,
          outputGain,
          channelMappingFamily,
          channelMappingTable,
        };
      };
      const OPUS_FRAME_DURATION_TABLE = [
        480, 960, 1920, 2880, 480, 960, 1920, 2880, 480, 960, 1920, 2880, 480,
        960, 480, 960, 120, 240, 480, 960, 120, 240, 480, 960, 120, 240, 480,
        960, 120, 240, 480, 960,
      ];
      const parseOpusTocByte = (packet) => {
        const config = packet[0] >> 3;
        const code = packet[0] & 3;
        let frameCount;
        if (code === 0) {
          frameCount = 1;
        } else if (code === 1 || code === 2) {
          frameCount = 2;
        } else {
          frameCount = packet[1] & 63;
        }
        return {
          durationInSamples: OPUS_FRAME_DURATION_TABLE[config] * frameCount,
        };
      };
      const parseModesFromVorbisSetupPacket = (setupHeader) => {
        if (setupHeader.length < 7) {
          throw new Error("Setup header is too short.");
        }
        if (setupHeader[0] !== 5) {
          throw new Error("Wrong packet type in Setup header.");
        }
        const signature = String.fromCharCode(...setupHeader.slice(1, 7));
        if (signature !== "vorbis") {
          throw new Error("Invalid packet signature in Setup header.");
        }
        const bufSize = setupHeader.length;
        const revBuffer = new Uint8Array(bufSize);
        for (let i = 0; i < bufSize; i++) {
          revBuffer[i] = setupHeader[bufSize - 1 - i];
        }
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(revBuffer);
        let gotFramingBit = 0;
        while (bitstream.getBitsLeft() > 97) {
          if (bitstream.readBits(1) === 1) {
            gotFramingBit = bitstream.pos;
            break;
          }
        }
        if (gotFramingBit === 0) {
          throw new Error("Invalid Setup header: framing bit not found.");
        }
        let modeCount = 0;
        let gotModeHeader = false;
        let lastModeCount = 0;
        while (bitstream.getBitsLeft() >= 97) {
          const tempPos = bitstream.pos;
          const a = bitstream.readBits(8);
          const b = bitstream.readBits(16);
          const c = bitstream.readBits(16);
          if (a > 63 || b !== 0 || c !== 0) {
            bitstream.pos = tempPos;
            break;
          }
          bitstream.skipBits(1);
          modeCount++;
          if (modeCount > 64) {
            break;
          }
          const bsClone = bitstream.clone();
          const candidate = bsClone.readBits(6) + 1;
          if (candidate === modeCount) {
            gotModeHeader = true;
            lastModeCount = modeCount;
          }
        }
        if (!gotModeHeader) {
          throw new Error("Invalid Setup header: mode header not found.");
        }
        if (lastModeCount > 63) {
          throw new Error(
            "Unsupported mode count: ".concat(lastModeCount, "."),
          );
        }
        const finalModeCount = lastModeCount;
        bitstream.pos = 0;
        bitstream.skipBits(gotFramingBit);
        const modeBlockflags = Array(finalModeCount).fill(0);
        for (let i = finalModeCount - 1; i >= 0; i--) {
          bitstream.skipBits(40);
          modeBlockflags[i] = bitstream.readBits(1);
        }
        return { modeBlockflags };
      };
      const determineVideoPacketType = (codec, decoderConfig, packetData) => {
        switch (codec) {
          case "avc": {
            for (const loc of iterateAvcNalUnits(packetData, decoderConfig)) {
              const nalTypeByte = packetData[loc.offset];
              const type = extractNalUnitTypeForAvc(nalTypeByte);
              if (
                type >= AvcNalUnitType.NON_IDR_SLICE &&
                type <= AvcNalUnitType.SLICE_DPC
              ) {
                return "delta";
              }
              if (type === AvcNalUnitType.IDR) {
                return "key";
              }
              if (
                type === AvcNalUnitType.SEI &&
                !(0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.F2)()
              ) {
                const nalUnit = packetData.subarray(
                  loc.offset,
                  loc.offset + loc.length,
                );
                const bytes = removeEmulationPreventionBytes(nalUnit);
                let pos = 1;
                do {
                  let payloadType = 0;
                  while (true) {
                    const nextByte = bytes[pos++];
                    if (nextByte === void 0) break;
                    payloadType += nextByte;
                    if (nextByte < 255) {
                      break;
                    }
                  }
                  let payloadSize = 0;
                  while (true) {
                    const nextByte = bytes[pos++];
                    if (nextByte === void 0) break;
                    payloadSize += nextByte;
                    if (nextByte < 255) {
                      break;
                    }
                  }
                  const PAYLOAD_TYPE_RECOVERY_POINT = 6;
                  if (payloadType === PAYLOAD_TYPE_RECOVERY_POINT) {
                    const bitstream =
                      new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(
                        bytes,
                      );
                    bitstream.pos = 8 * pos;
                    const recoveryFrameCount = (0,
                    _misc_js__WEBPACK_IMPORTED_MODULE_1__.IP)(bitstream);
                    const exactMatchFlag = bitstream.readBits(1);
                    if (recoveryFrameCount === 0 && exactMatchFlag === 1) {
                      return "key";
                    }
                  }
                  pos += payloadSize;
                } while (pos < bytes.length - 1);
              }
            }
            return "delta";
          }
          // removed by dead control flow
          case "hevc": {
            for (const loc of iterateHevcNalUnits(packetData, decoderConfig)) {
              const type = extractNalUnitTypeForHevc(packetData[loc.offset]);
              if (type < HevcNalUnitType.BLA_W_LP) {
                return "delta";
              }
              if (type <= HevcNalUnitType.RSV_IRAP_VCL23) {
                return "key";
              }
            }
            return "delta";
          }
          // removed by dead control flow
          case "vp8": {
            const frameType = packetData[0] & 1;
            return frameType === 0 ? "key" : "delta";
          }
          // removed by dead control flow
          case "vp9": {
            const bitstream =
              new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(
                packetData,
              );
            if (bitstream.readBits(2) !== 2) {
              return null;
            }
            const profileLowBit = bitstream.readBits(1);
            const profileHighBit = bitstream.readBits(1);
            const profile = (profileHighBit << 1) + profileLowBit;
            if (profile === 3) {
              bitstream.skipBits(1);
            }
            const showExistingFrame = bitstream.readBits(1);
            if (showExistingFrame) {
              return null;
            }
            const frameType = bitstream.readBits(1);
            return frameType === 0 ? "key" : "delta";
          }
          // removed by dead control flow
          case "av1": {
            let reducedStillPictureHeader = false;
            for (const { type, data } of iterateAv1PacketObus(packetData)) {
              if (type === 1) {
                const bitstream =
                  new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(data);
                bitstream.skipBits(4);
                reducedStillPictureHeader = !!bitstream.readBits(1);
              } else if (type === 3 || type === 6 || type === 7) {
                if (reducedStillPictureHeader) {
                  return "key";
                }
                const bitstream =
                  new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(data);
                const showExistingFrame = bitstream.readBits(1);
                if (showExistingFrame) {
                  return null;
                }
                const frameType = bitstream.readBits(2);
                return frameType === 0 ? "key" : "delta";
              }
            }
            return null;
          }
          // removed by dead control flow
          case "prores": {
            return "key";
          }
          // removed by dead control flow
          default: {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.xb)(codec);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.vA)(false);
          }
        }
      };
      var FlacBlockType;
      (function (FlacBlockType2) {
        FlacBlockType2[(FlacBlockType2["STREAMINFO"] = 0)] = "STREAMINFO";
        FlacBlockType2[(FlacBlockType2["VORBIS_COMMENT"] = 4)] =
          "VORBIS_COMMENT";
        FlacBlockType2[(FlacBlockType2["PICTURE"] = 6)] = "PICTURE";
      })(FlacBlockType || (FlacBlockType = {}));
      const readVorbisComments = (bytes, metadataTags) => {
        const commentView = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(
          bytes,
        );
        let commentPos = 0;
        const vendorStringLength = commentView.getUint32(commentPos, true);
        commentPos += 4;
        const vendorString = _misc_js__WEBPACK_IMPORTED_MODULE_1__.su.decode(
          bytes.subarray(commentPos, commentPos + vendorStringLength),
        );
        commentPos += vendorStringLength;
        if (vendorStringLength > 0) {
          metadataTags.raw ??= {};
          metadataTags.raw["vendor"] ??= vendorString;
        }
        const listLength = commentView.getUint32(commentPos, true);
        commentPos += 4;
        for (let i = 0; i < listLength; i++) {
          const stringLength = commentView.getUint32(commentPos, true);
          commentPos += 4;
          const string = _misc_js__WEBPACK_IMPORTED_MODULE_1__.su.decode(
            bytes.subarray(commentPos, commentPos + stringLength),
          );
          commentPos += stringLength;
          const separatorIndex = string.indexOf("=");
          if (separatorIndex === -1) {
            continue;
          }
          const key = string.slice(0, separatorIndex).toUpperCase();
          const value = string.slice(separatorIndex + 1);
          metadataTags.raw ??= {};
          metadataTags.raw[key] ??= value;
          switch (key) {
            case "TITLE":
              {
                metadataTags.title ??= value;
              }
              break;
            case "DESCRIPTION":
              {
                metadataTags.description ??= value;
              }
              break;
            case "ARTIST":
              {
                metadataTags.artist ??= value;
              }
              break;
            case "ALBUM":
              {
                metadataTags.album ??= value;
              }
              break;
            case "ALBUMARTIST":
              {
                metadataTags.albumArtist ??= value;
              }
              break;
            case "COMMENT":
              {
                metadataTags.comment ??= value;
              }
              break;
            case "LYRICS":
              {
                metadataTags.lyrics ??= value;
              }
              break;
            case "TRACKNUMBER":
              {
                const parts = value.split("/");
                const trackNum = Number.parseInt(parts[0], 10);
                const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
                if (Number.isInteger(trackNum) && trackNum > 0) {
                  metadataTags.trackNumber ??= trackNum;
                }
                if (
                  tracksTotal &&
                  Number.isInteger(tracksTotal) &&
                  tracksTotal > 0
                ) {
                  metadataTags.tracksTotal ??= tracksTotal;
                }
              }
              break;
            case "TRACKTOTAL":
              {
                const tracksTotal = Number.parseInt(value, 10);
                if (Number.isInteger(tracksTotal) && tracksTotal > 0) {
                  metadataTags.tracksTotal ??= tracksTotal;
                }
              }
              break;
            case "DISCNUMBER":
              {
                const parts = value.split("/");
                const discNum = Number.parseInt(parts[0], 10);
                const discsTotal = parts[1] && Number.parseInt(parts[1], 10);
                if (Number.isInteger(discNum) && discNum > 0) {
                  metadataTags.discNumber ??= discNum;
                }
                if (
                  discsTotal &&
                  Number.isInteger(discsTotal) &&
                  discsTotal > 0
                ) {
                  metadataTags.discsTotal ??= discsTotal;
                }
              }
              break;
            case "DISCTOTAL":
              {
                const discsTotal = Number.parseInt(value, 10);
                if (Number.isInteger(discsTotal) && discsTotal > 0) {
                  metadataTags.discsTotal ??= discsTotal;
                }
              }
              break;
            case "DATE":
              {
                const date = new Date(value);
                if (!Number.isNaN(date.getTime())) {
                  metadataTags.date ??= date;
                }
              }
              break;
            case "GENRE":
              {
                metadataTags.genre ??= value;
              }
              break;
            case "METADATA_BLOCK_PICTURE":
              {
                const decoded = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Kp)(
                  value,
                );
                const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(
                  decoded,
                );
                const pictureType = view.getUint32(0, false);
                const mediaTypeLength = view.getUint32(4, false);
                const mediaType = String.fromCharCode(
                  ...decoded.subarray(8, 8 + mediaTypeLength),
                );
                const descriptionLength = view.getUint32(
                  8 + mediaTypeLength,
                  false,
                );
                const description =
                  _misc_js__WEBPACK_IMPORTED_MODULE_1__.su.decode(
                    decoded.subarray(
                      12 + mediaTypeLength,
                      12 + mediaTypeLength + descriptionLength,
                    ),
                  );
                const dataLength = view.getUint32(
                  mediaTypeLength + descriptionLength + 28,
                );
                const data = decoded.subarray(
                  mediaTypeLength + descriptionLength + 32,
                  mediaTypeLength + descriptionLength + 32 + dataLength,
                );
                metadataTags.images ??= [];
                metadataTags.images.push({
                  data,
                  mimeType: mediaType,
                  kind:
                    pictureType === 3
                      ? "coverFront"
                      : pictureType === 4
                        ? "coverBack"
                        : "unknown",
                  name: void 0,
                  description: description || void 0,
                });
              }
              break;
          }
        }
      };
      const createVorbisComments = (headerBytes, tags, writeImages) => {
        const commentHeaderParts = [headerBytes];
        const vendorString = "Mediabunny";
        const encodedVendorString = textEncoder.encode(vendorString);
        let currentBuffer = new Uint8Array(4 + encodedVendorString.length);
        let currentView = new DataView(currentBuffer.buffer);
        currentView.setUint32(0, encodedVendorString.length, true);
        currentBuffer.set(encodedVendorString, 4);
        commentHeaderParts.push(currentBuffer);
        const writtenTags = /* @__PURE__ */ new Set();
        const addCommentTag = (key, value) => {
          const joined = "".concat(key, "=").concat(value);
          const encoded = textEncoder.encode(joined);
          currentBuffer = new Uint8Array(4 + encoded.length);
          currentView = new DataView(currentBuffer.buffer);
          currentView.setUint32(0, encoded.length, true);
          currentBuffer.set(encoded, 4);
          commentHeaderParts.push(currentBuffer);
          writtenTags.add(key);
        };
        for (const { key, value } of keyValueIterator(tags)) {
          switch (key) {
            case "title":
              {
                addCommentTag("TITLE", value);
              }
              break;
            case "description":
              {
                addCommentTag("DESCRIPTION", value);
              }
              break;
            case "artist":
              {
                addCommentTag("ARTIST", value);
              }
              break;
            case "album":
              {
                addCommentTag("ALBUM", value);
              }
              break;
            case "albumArtist":
              {
                addCommentTag("ALBUMARTIST", value);
              }
              break;
            case "genre":
              {
                addCommentTag("GENRE", value);
              }
              break;
            case "date":
              {
                const rawVersion = tags.raw?.["DATE"] ?? tags.raw?.["date"];
                if (rawVersion && typeof rawVersion === "string") {
                  addCommentTag("DATE", rawVersion);
                } else {
                  addCommentTag("DATE", value.toISOString().slice(0, 10));
                }
              }
              break;
            case "comment":
              {
                addCommentTag("COMMENT", value);
              }
              break;
            case "lyrics":
              {
                addCommentTag("LYRICS", value);
              }
              break;
            case "trackNumber":
              {
                addCommentTag("TRACKNUMBER", value.toString());
              }
              break;
            case "tracksTotal":
              {
                addCommentTag("TRACKTOTAL", value.toString());
              }
              break;
            case "discNumber":
              {
                addCommentTag("DISCNUMBER", value.toString());
              }
              break;
            case "discsTotal":
              {
                addCommentTag("DISCTOTAL", value.toString());
              }
              break;
            case "images":
              {
                if (!writeImages) {
                  break;
                }
                for (const image of value) {
                  const pictureType =
                    image.kind === "coverFront"
                      ? 3
                      : image.kind === "coverBack"
                        ? 4
                        : 0;
                  const encodedMediaType = new Uint8Array(
                    image.mimeType.length,
                  );
                  for (let i = 0; i < image.mimeType.length; i++) {
                    encodedMediaType[i] = image.mimeType.charCodeAt(i);
                  }
                  const encodedDescription = textEncoder.encode(
                    image.description ?? "",
                  );
                  const buffer = new Uint8Array(
                    4 +
                      4 +
                      encodedMediaType.length +
                      4 +
                      encodedDescription.length +
                      16 +
                      4 +
                      image.data.length,
                  );
                  const view = toDataView(buffer);
                  view.setUint32(0, pictureType, false);
                  view.setUint32(4, encodedMediaType.length, false);
                  buffer.set(encodedMediaType, 8);
                  view.setUint32(
                    8 + encodedMediaType.length,
                    encodedDescription.length,
                    false,
                  );
                  buffer.set(encodedDescription, 12 + encodedMediaType.length);
                  view.setUint32(
                    28 + encodedMediaType.length + encodedDescription.length,
                    image.data.length,
                    false,
                  );
                  buffer.set(
                    image.data,
                    32 + encodedMediaType.length + encodedDescription.length,
                  );
                  const encoded = bytesToBase64(buffer);
                  addCommentTag("METADATA_BLOCK_PICTURE", encoded);
                }
              }
              break;
            case "raw":
              {
              }
              break;
            default:
              assertNever(key);
          }
        }
        if (tags.raw) {
          for (const key in tags.raw) {
            const value = tags.raw[key] ?? tags.raw[key.toLowerCase()];
            if (key === "vendor" || value == null || writtenTags.has(key)) {
              continue;
            }
            if (typeof value === "string") {
              addCommentTag(key, value);
            }
          }
        }
        const listLengthBuffer = new Uint8Array(4);
        toDataView(listLengthBuffer).setUint32(0, writtenTags.size, true);
        commentHeaderParts.splice(2, 0, listLengthBuffer);
        const commentHeaderLength = commentHeaderParts.reduce(
          (a, b) => a + b.length,
          0,
        );
        const commentHeader = new Uint8Array(commentHeaderLength);
        let pos = 0;
        for (const part of commentHeaderParts) {
          commentHeader.set(part, pos);
          pos += part.length;
        }
        return commentHeader;
      };
      const AC3_ACMOD_CHANNEL_COUNTS = [2, 1, 2, 3, 3, 4, 4, 5];
      const parseAc3SyncFrame = (data) => {
        if (data.length < 7) {
          return null;
        }
        if (data[0] !== 11 || data[1] !== 119) {
          return null;
        }
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(data);
        bitstream.skipBits(16);
        bitstream.skipBits(16);
        const fscod = bitstream.readBits(2);
        if (fscod === 3) {
          return null;
        }
        const frmsizecod = bitstream.readBits(6);
        const bsid = bitstream.readBits(5);
        if (bsid > 8) {
          return null;
        }
        const bsmod = bitstream.readBits(3);
        const acmod = bitstream.readBits(3);
        if ((acmod & 1) !== 0 && acmod !== 1) {
          bitstream.skipBits(2);
        }
        if ((acmod & 4) !== 0) {
          bitstream.skipBits(2);
        }
        if (acmod === 2) {
          bitstream.skipBits(2);
        }
        const lfeon = bitstream.readBits(1);
        const bitRateCode = Math.floor(frmsizecod / 2);
        return { fscod, bsid, bsmod, acmod, lfeon, bitRateCode };
      };
      const AC3_FRAME_SIZES = [
        // frmsizecod, [48kHz, 44.1kHz, 32kHz] in bytes
        64 * 2,
        69 * 2,
        96 * 2,
        64 * 2,
        70 * 2,
        96 * 2,
        80 * 2,
        87 * 2,
        120 * 2,
        80 * 2,
        88 * 2,
        120 * 2,
        96 * 2,
        104 * 2,
        144 * 2,
        96 * 2,
        105 * 2,
        144 * 2,
        112 * 2,
        121 * 2,
        168 * 2,
        112 * 2,
        122 * 2,
        168 * 2,
        128 * 2,
        139 * 2,
        192 * 2,
        128 * 2,
        140 * 2,
        192 * 2,
        160 * 2,
        174 * 2,
        240 * 2,
        160 * 2,
        175 * 2,
        240 * 2,
        192 * 2,
        208 * 2,
        288 * 2,
        192 * 2,
        209 * 2,
        288 * 2,
        224 * 2,
        243 * 2,
        336 * 2,
        224 * 2,
        244 * 2,
        336 * 2,
        256 * 2,
        278 * 2,
        384 * 2,
        256 * 2,
        279 * 2,
        384 * 2,
        320 * 2,
        348 * 2,
        480 * 2,
        320 * 2,
        349 * 2,
        480 * 2,
        384 * 2,
        417 * 2,
        576 * 2,
        384 * 2,
        418 * 2,
        576 * 2,
        448 * 2,
        487 * 2,
        672 * 2,
        448 * 2,
        488 * 2,
        672 * 2,
        512 * 2,
        557 * 2,
        768 * 2,
        512 * 2,
        558 * 2,
        768 * 2,
        640 * 2,
        696 * 2,
        960 * 2,
        640 * 2,
        697 * 2,
        960 * 2,
        768 * 2,
        835 * 2,
        1152 * 2,
        768 * 2,
        836 * 2,
        1152 * 2,
        896 * 2,
        975 * 2,
        1344 * 2,
        896 * 2,
        976 * 2,
        1344 * 2,
        1024 * 2,
        1114 * 2,
        1536 * 2,
        1024 * 2,
        1115 * 2,
        1536 * 2,
        1152 * 2,
        1253 * 2,
        1728 * 2,
        1152 * 2,
        1254 * 2,
        1728 * 2,
        1280 * 2,
        1393 * 2,
        1920 * 2,
        1280 * 2,
        1394 * 2,
        1920 * 2,
      ];
      const AC3_SAMPLES_PER_FRAME = 1536;
      const AC3_REGISTRATION_DESCRIPTOR = new Uint8Array([
        5, 4, 65, 67, 45, 51,
      ]);
      const EAC3_REGISTRATION_DESCRIPTOR = new Uint8Array([
        5, 4, 69, 65, 67, 51,
      ]);
      const EAC3_NUMBLKS_TABLE = [1, 2, 3, 6];
      const parseEac3SyncFrame = (data) => {
        if (data.length < 6) {
          return null;
        }
        if (data[0] !== 11 || data[1] !== 119) {
          return null;
        }
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(data);
        bitstream.skipBits(16);
        const strmtyp = bitstream.readBits(2);
        bitstream.skipBits(3);
        if (strmtyp !== 0 && strmtyp !== 2) {
          return null;
        }
        const frmsiz = bitstream.readBits(11);
        const fscod = bitstream.readBits(2);
        let fscod2 = 0;
        let numblkscod;
        if (fscod === 3) {
          fscod2 = bitstream.readBits(2);
          numblkscod = 3;
        } else {
          numblkscod = bitstream.readBits(2);
        }
        const acmod = bitstream.readBits(3);
        const lfeon = bitstream.readBits(1);
        const bsid = bitstream.readBits(5);
        if (bsid < 11 || bsid > 16) {
          return null;
        }
        const numblks = EAC3_NUMBLKS_TABLE[numblkscod];
        let fs;
        if (fscod < 3) {
          fs = _shared_ac3_misc_js__WEBPACK_IMPORTED_MODULE_3__.N[fscod] / 1e3;
        } else {
          fs = _shared_ac3_misc_js__WEBPACK_IMPORTED_MODULE_3__.P[fscod2] / 1e3;
        }
        const dataRate = Math.round(((frmsiz + 1) * fs) / (numblks * 16));
        const bsmod = 0;
        const numDepSub = 0;
        const chanLoc = 0;
        const substream = {
          fscod,
          fscod2,
          bsid,
          bsmod,
          acmod,
          lfeon,
          numDepSub,
          chanLoc,
        };
        return {
          dataRate,
          substreams: [substream],
        };
      };
      const parseEac3Config = (data) => {
        if (data.length < 2) {
          return null;
        }
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(data);
        const dataRate = bitstream.readBits(13);
        const numIndSub = bitstream.readBits(3);
        const substreams = [];
        for (let i = 0; i <= numIndSub; i++) {
          if (Math.ceil(bitstream.pos / 8) + 3 > data.length) {
            break;
          }
          const fscod = bitstream.readBits(2);
          const bsid = bitstream.readBits(5);
          bitstream.skipBits(1);
          bitstream.skipBits(1);
          const bsmod = bitstream.readBits(3);
          const acmod = bitstream.readBits(3);
          const lfeon = bitstream.readBits(1);
          bitstream.skipBits(3);
          const numDepSub = bitstream.readBits(4);
          let chanLoc = 0;
          if (numDepSub > 0) {
            chanLoc = bitstream.readBits(9);
          } else {
            bitstream.skipBits(1);
          }
          substreams.push({
            fscod,
            fscod2: null,
            bsid,
            bsmod,
            acmod,
            lfeon,
            numDepSub,
            chanLoc,
          });
        }
        if (substreams.length === 0) {
          return null;
        }
        return { dataRate, substreams };
      };
      const getEac3SampleRate = (config) => {
        const sub = config.substreams[0];
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.vA)(sub);
        if (sub.fscod < 3) {
          return _shared_ac3_misc_js__WEBPACK_IMPORTED_MODULE_3__.N[sub.fscod];
        } else if (sub.fscod2 !== null && sub.fscod2 < 3) {
          return _shared_ac3_misc_js__WEBPACK_IMPORTED_MODULE_3__.P[sub.fscod2];
        }
        return null;
      };
      const getEac3ChannelCount = (config) => {
        const sub = config.substreams[0];
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.vA)(sub);
        let channels = AC3_ACMOD_CHANNEL_COUNTS[sub.acmod] + sub.lfeon;
        if (sub.numDepSub > 0) {
          const CHAN_LOC_COUNTS = [2, 2, 1, 1, 2, 2, 2, 1, 1];
          for (let bit = 0; bit < 9; bit++) {
            if (sub.chanLoc & (1 << (8 - bit))) {
              channels += CHAN_LOC_COUNTS[bit];
            }
          }
        }
        return channels;
      };
      const DTS_CORE_SYNC_WORD = 2147385345;
      const DTS_EXSS_SYNC_WORD = 1683496997;
      const DTS_CORE_FRAME_HEADER_SIZE = 18;
      const DTS_EXSS_HEADER_PREFIX_SIZE = 10;
      const DTS_EXSS_MAX_HEADER_SIZE = 4096;
      const DTS_PCM_BLOCK_SAMPLES = 32;
      const DTS_SPECIFIC_BOX_SIZE = 20;
      const DTS_SUBBAND_SAMPLES = 8;
      const DTS_CORE_SAMPLE_RATES = [
        0, 8e3, 16e3, 32e3, 0, 0, 11025, 22050, 44100, 0, 0, 12e3, 24e3, 48e3,
        96e3, 192e3,
      ];
      const DTS_CORE_BIT_RATES = [
        32e3, 56e3, 64e3, 96e3, 112e3, 128e3, 192e3, 224e3, 256e3, 32e4, 384e3,
        448e3, 512e3, 576e3, 64e4, 768e3, 96e4, 1024e3, 1152e3, 128e4, 1344e3,
        1408e3, 1411200, 1472e3, 1536e3, 192e4, 2048e3, 3072e3, 384e4, 0, 0, 0,
      ];
      const DTS_PCM_RESOLUTIONS = [16, 16, 20, 20, 0, 24, 24, 0];
      const DTS_AMODE_CHANNEL_COUNTS = [
        1, 2, 2, 2, 2, 3, 3, 4, 4, 5, 6, 6, 6, 7, 8, 8,
      ];
      const DTS_AMODE_CHANNEL_LAYOUTS = [
        1, 2, 2, 2, 2, 3, 18, 19, 6, 7, 518, 323, 83, 519, 582, 535,
      ];
      const DTS_CHANNEL_LAYOUT_LFE1 = 8;
      const DTS_CHANNEL_LAYOUT_PAIR_MASK = 44646;
      const DTS_EXSS_REF_CLOCKS = [32e3, 44100, 48e3, 0];
      const DTS_EXSS_SAMPLE_RATES = [
        8e3, 16e3, 32e3, 64e3, 128e3, 22050, 44100, 88200, 176400, 352800, 12e3,
        24e3, 48e3, 96e3, 192e3, 384e3,
      ];
      const DTS_SPECIFIC_BOX_FRAME_DURATIONS = [512, 1024, 2048, 4096];
      const parseDtsFrame = (data) => {
        const core = parseDtsCoreFrameHeader(data);
        const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(data);
        let offset = core ? Math.ceil(core.frameSize / 4) * 4 : 0;
        let firstExss = null;
        while (
          offset + 4 <= data.length &&
          view.getUint32(offset) === DTS_EXSS_SYNC_WORD
        ) {
          const exss = parseDtsExssHeader(data.subarray(offset));
          if (!exss) {
            break;
          }
          firstExss ??= exss;
          offset += exss.frameSize;
        }
        if (core) {
          return {
            frameSize: firstExss ? offset : core.frameSize,
            sampleRate: core.sampleRate,
            numberOfChannels: core.numberOfChannels,
            sampleCount: core.sampleCount,
            channelLayout: core.channelLayout,
            pcmResolution: core.pcmResolution,
            bitRate: core.bitRate,
            core,
            hasExtensions: firstExss !== null,
          };
        }
        if (!firstExss?.asset) {
          return null;
        }
        const { asset } = firstExss;
        return {
          frameSize: offset,
          sampleRate: asset.sampleRate,
          numberOfChannels: asset.numberOfChannels,
          sampleCount: asset.sampleCount,
          channelLayout: asset.channelLayout,
          pcmResolution: asset.pcmResolution,
          bitRate: 0,
          core: null,
          hasExtensions: true,
        };
      };
      const extractDtsFourCcFromPacket = (data) => {
        const frameInfo = parseDtsFrame(data);
        if (!frameInfo?.core) {
          return null;
        }
        return frameInfo.hasExtensions ? "dtsh" : "dtsc";
      };
      const parseDtsCoreFrameHeader = (data) => {
        if (data.length < DTS_CORE_FRAME_HEADER_SIZE) {
          return null;
        }
        if (
          data[0] !== 127 ||
          data[1] !== 254 ||
          data[2] !== 128 ||
          data[3] !== 1
        ) {
          return null;
        }
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(data);
        bitstream.skipBits(32);
        bitstream.skipBits(1);
        if (bitstream.readBits(5) !== DTS_PCM_BLOCK_SAMPLES - 1) {
          return null;
        }
        const cpf = bitstream.readBits(1);
        const npcmblocks = bitstream.readBits(7) + 1;
        if (npcmblocks % DTS_SUBBAND_SAMPLES !== 0) {
          return null;
        }
        const frameSize = bitstream.readBits(14) + 1;
        if (frameSize < 96) {
          return null;
        }
        const amode = bitstream.readBits(6);
        if (amode >= DTS_AMODE_CHANNEL_COUNTS.length) {
          return null;
        }
        const sampleRate = DTS_CORE_SAMPLE_RATES[bitstream.readBits(4)];
        if (sampleRate === 0) {
          return null;
        }
        const bitRate = DTS_CORE_BIT_RATES[bitstream.readBits(5)];
        if (bitstream.readBits(1) !== 0) {
          return null;
        }
        bitstream.skipBits(1 + 1 + 1 + 1);
        bitstream.skipBits(3 + 1 + 1);
        const lff = bitstream.readBits(2);
        if (lff === 3) {
          return null;
        }
        bitstream.skipBits(1);
        if (cpf) {
          bitstream.skipBits(16);
        }
        bitstream.skipBits(1 + 4 + 2);
        const pcmResolution = DTS_PCM_RESOLUTIONS[bitstream.readBits(3)];
        if (pcmResolution === 0) {
          return null;
        }
        const lfePresent = lff !== 0;
        return {
          frameSize,
          sampleRate,
          numberOfChannels:
            DTS_AMODE_CHANNEL_COUNTS[amode] + (lfePresent ? 1 : 0),
          sampleCount: npcmblocks * DTS_PCM_BLOCK_SAMPLES,
          channelLayout:
            DTS_AMODE_CHANNEL_LAYOUTS[amode] |
            (lfePresent ? DTS_CHANNEL_LAYOUT_LFE1 : 0),
          amode,
          lfePresent,
          bitRate,
          pcmResolution,
        };
      };
      const parseDtsExssHeader = (data) => {
        if (data.length < DTS_EXSS_HEADER_PREFIX_SIZE) {
          return null;
        }
        if (
          data[0] !== 100 ||
          data[1] !== 88 ||
          data[2] !== 32 ||
          data[3] !== 37
        ) {
          return null;
        }
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(data);
        bitstream.skipBits(32);
        bitstream.skipBits(8);
        const extSsIndex = bitstream.readBits(2);
        const wideHeader = bitstream.readBits(1);
        const headerSizeBits = 8 + 4 * wideHeader;
        const frameSizeBits = 16 + 4 * wideHeader;
        bitstream.skipBits(headerSizeBits);
        const frameSize = bitstream.readBits(frameSizeBits) + 1;
        const incomplete = { frameSize, asset: null };
        if (!bitstream.readBits(1)) {
          return incomplete;
        }
        const refClock = DTS_EXSS_REF_CLOCKS[bitstream.readBits(2)];
        const frameDurationCycles = 512 * (bitstream.readBits(3) + 1);
        if (bitstream.readBits(1)) {
          bitstream.skipBits(32 + 4);
        }
        const numAudioPresentations = bitstream.readBits(3) + 1;
        const numAssets = bitstream.readBits(3) + 1;
        const activeExssMasks = [];
        for (let i = 0; i < numAudioPresentations; i++) {
          activeExssMasks.push(bitstream.readBits(extSsIndex + 1));
        }
        for (const mask of activeExssMasks) {
          bitstream.skipBits(
            8 * (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.pf)(mask),
          );
        }
        if (bitstream.readBits(1)) {
          bitstream.skipBits(2);
          const spkrMaskBits = (bitstream.readBits(2) + 1) << 2;
          const numMixOutConfigs = bitstream.readBits(2) + 1;
          bitstream.skipBits(numMixOutConfigs * spkrMaskBits);
        }
        for (let i = 0; i < numAssets; i++) {
          bitstream.skipBits(frameSizeBits);
        }
        bitstream.skipBits(9);
        bitstream.skipBits(3);
        if (bitstream.readBits(1)) {
          bitstream.skipBits(4);
        }
        if (bitstream.readBits(1)) {
          bitstream.skipBits(24);
        }
        if (bitstream.readBits(1)) {
          bitstream.skipBits(8 * (bitstream.readBits(10) + 1));
        }
        const pcmResolution = bitstream.readBits(5) + 1;
        const sampleRate = DTS_EXSS_SAMPLE_RATES[bitstream.readBits(4)];
        const numberOfChannels = bitstream.readBits(8) + 1;
        let channelLayout = 0;
        if (bitstream.readBits(1)) {
          if (numberOfChannels > 2) {
            bitstream.skipBits(1);
          }
          if (numberOfChannels > 6) {
            bitstream.skipBits(1);
          }
          if (bitstream.readBits(1)) {
            const spkrMaskBits = (bitstream.readBits(2) + 1) << 2;
            channelLayout = bitstream.readBits(spkrMaskBits);
          }
        }
        if (refClock === 0 || bitstream.getBitsLeft() < 0) {
          return incomplete;
        }
        return {
          frameSize,
          asset: {
            sampleRate,
            numberOfChannels,
            sampleCount: Math.round(
              (frameDurationCycles * sampleRate) / refClock,
            ),
            channelLayout,
            pcmResolution,
          },
        };
      };
      const parseDtsSpecificBox = (data) => {
        if (data.length < DTS_SPECIFIC_BOX_SIZE) {
          return null;
        }
        const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(data);
        const sampleRate = view.getUint32(0);
        if (sampleRate === 0) {
          return null;
        }
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_4__._(data);
        bitstream.seekToByte(13);
        const frameDuration = bitstream.readBits(2);
        bitstream.skipBits(5);
        const coreLfePresent = bitstream.readBits(1);
        const coreLayout = bitstream.readBits(6);
        bitstream.skipBits(14);
        bitstream.skipBits(1);
        bitstream.skipBits(3);
        const channelLayout = bitstream.readBits(16);
        let numberOfChannels = null;
        if (channelLayout !== 0) {
          numberOfChannels = getDtsChannelCount(channelLayout);
        } else if (coreLayout < DTS_AMODE_CHANNEL_COUNTS.length) {
          numberOfChannels =
            DTS_AMODE_CHANNEL_COUNTS[coreLayout] + coreLfePresent;
        }
        return {
          sampleRate,
          maxBitrate: view.getUint32(4),
          avgBitrate: view.getUint32(8),
          pcmSampleDepth: data[12],
          sampleCount: DTS_SPECIFIC_BOX_FRAME_DURATIONS[frameDuration],
          channelLayout,
          numberOfChannels,
        };
      };
      const buildDtsSpecificBox = (frameInfo) => {
        const bytes = new Uint8Array(DTS_SPECIFIC_BOX_SIZE);
        const view = toDataView(bytes);
        view.setUint32(0, frameInfo.sampleRate);
        view.setUint32(4, frameInfo.bitRate);
        view.setUint32(8, frameInfo.bitRate);
        bytes[12] = frameInfo.pcmResolution;
        const streamConstruction =
          frameInfo.core && !frameInfo.hasExtensions ? 1 : 0;
        const bitstream = new Bitstream(bytes);
        bitstream.seekToByte(13);
        bitstream.writeBits(
          2,
          Math.max(
            DTS_SPECIFIC_BOX_FRAME_DURATIONS.indexOf(frameInfo.sampleCount),
            0,
          ),
        );
        bitstream.writeBits(5, streamConstruction);
        bitstream.writeBits(1, frameInfo.core?.lfePresent ? 1 : 0);
        bitstream.writeBits(6, frameInfo.core?.amode ?? 0);
        bitstream.writeBits(
          14,
          frameInfo.core ? frameInfo.core.frameSize - 1 : 0,
        );
        bitstream.writeBits(1, 0);
        bitstream.writeBits(3, 0);
        bitstream.writeBits(16, frameInfo.channelLayout);
        bitstream.writeBits(1, 0);
        bitstream.writeBits(1, 0);
        bitstream.writeBits(1, 0);
        bitstream.writeBits(5, 0);
        return bytes;
      };
      const getDtsChannelCount = (channelLayout) => {
        return (
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.pf)(channelLayout) +
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.pf)(
            channelLayout & DTS_CHANNEL_LAYOUT_PAIR_MASK,
          )
        );
      };
    },
    /***/
    8276(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        $3: () =>
          /* binding */
          AVC_LEVEL_TABLE,
        /* harmony export */
        Ei: () =>
          /* binding */
          parsePcmCodec,
        /* harmony export */
        LD: () =>
          /* binding */
          extractColorSpace,
        /* harmony export */
        PP: () =>
          /* binding */
          AUDIO_CODECS,
        /* harmony export */
        QP: () =>
          /* binding */
          extractVideoCodecString,
        /* harmony export */
        Sf: () =>
          /* binding */
          DTS_FOURCCS,
        /* harmony export */
        WN: () =>
          /* binding */
          VIDEO_CODECS,
        /* harmony export */
        Wq: () =>
          /* binding */
          PCM_AUDIO_CODECS,
        /* harmony export */
        X0: () =>
          /* binding */
          extractAudioCodecString,
        /* harmony export */
        Y2: () =>
          /* binding */
          PRORES_FOURCCS,
        /* harmony export */
        oU: () =>
          /* binding */
          inferCodecFromCodecString,
        /* harmony export */
        ye: () =>
          /* binding */
          VP9_LEVEL_TABLE,
        /* harmony export */
        yo: () =>
          /* binding */
          OPUS_SAMPLE_RATE,
        /* harmony export */
      });
      var last;
      var assertNever;
      var base64ToBytes;
      var toDataView;
      var isAllowSharedBufferSource;
      var COLOR_PRIMARIES_MAP;
      var TRANSFER_CHARACTERISTICS_MAP;
      var MATRIX_COEFFICIENTS_MAP;
      var _shared_aac_misc_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(4691);
      var _codec_data_js__WEBPACK_IMPORTED_MODULE_1__ =
        __webpack_require__(9705);
      var _misc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6760);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const VIDEO_CODECS = ["avc", "hevc", "vp9", "av1", "vp8", "prores"];
      const PCM_AUDIO_CODECS = [
        "pcm-s16",
        // We don't prefix 'le' so we're compatible with the WebCodecs-registered PCM codec strings
        "pcm-s16be",
        "pcm-s24",
        "pcm-s24be",
        "pcm-s32",
        "pcm-s32be",
        "pcm-f32",
        "pcm-f32be",
        "pcm-f64",
        "pcm-f64be",
        "pcm-u8",
        "pcm-s8",
        "ulaw",
        "alaw",
      ];
      const NON_PCM_AUDIO_CODECS = [
        "aac",
        "opus",
        "mp3",
        "vorbis",
        "flac",
        "ac3",
        "eac3",
        "dts",
      ];
      const AUDIO_CODECS = [...NON_PCM_AUDIO_CODECS, ...PCM_AUDIO_CODECS];
      const SUBTITLE_CODECS =
        /* unused pure expression or super */
        null;
      const AVC_LEVEL_TABLE = [
        { maxMacroblocks: 99, maxBitrate: 64e3, maxDpbMbs: 396, level: 10 },
        // Level 1
        { maxMacroblocks: 396, maxBitrate: 192e3, maxDpbMbs: 900, level: 11 },
        // Level 1.1
        { maxMacroblocks: 396, maxBitrate: 384e3, maxDpbMbs: 2376, level: 12 },
        // Level 1.2
        { maxMacroblocks: 396, maxBitrate: 768e3, maxDpbMbs: 2376, level: 13 },
        // Level 1.3
        { maxMacroblocks: 396, maxBitrate: 2e6, maxDpbMbs: 2376, level: 20 },
        // Level 2
        { maxMacroblocks: 792, maxBitrate: 4e6, maxDpbMbs: 4752, level: 21 },
        // Level 2.1
        { maxMacroblocks: 1620, maxBitrate: 4e6, maxDpbMbs: 8100, level: 22 },
        // Level 2.2
        { maxMacroblocks: 1620, maxBitrate: 1e7, maxDpbMbs: 8100, level: 30 },
        // Level 3
        { maxMacroblocks: 3600, maxBitrate: 14e6, maxDpbMbs: 18e3, level: 31 },
        // Level 3.1
        { maxMacroblocks: 5120, maxBitrate: 2e7, maxDpbMbs: 20480, level: 32 },
        // Level 3.2
        { maxMacroblocks: 8192, maxBitrate: 2e7, maxDpbMbs: 32768, level: 40 },
        // Level 4
        { maxMacroblocks: 8192, maxBitrate: 5e7, maxDpbMbs: 32768, level: 41 },
        // Level 4.1
        { maxMacroblocks: 8704, maxBitrate: 5e7, maxDpbMbs: 34816, level: 42 },
        // Level 4.2
        {
          maxMacroblocks: 22080,
          maxBitrate: 135e6,
          maxDpbMbs: 110400,
          level: 50,
        },
        // Level 5
        {
          maxMacroblocks: 36864,
          maxBitrate: 24e7,
          maxDpbMbs: 184320,
          level: 51,
        },
        // Level 5.1
        {
          maxMacroblocks: 36864,
          maxBitrate: 24e7,
          maxDpbMbs: 184320,
          level: 52,
        },
        // Level 5.2
        {
          maxMacroblocks: 139264,
          maxBitrate: 24e7,
          maxDpbMbs: 696320,
          level: 60,
        },
        // Level 6
        {
          maxMacroblocks: 139264,
          maxBitrate: 48e7,
          maxDpbMbs: 696320,
          level: 61,
        },
        // Level 6.1
        {
          maxMacroblocks: 139264,
          maxBitrate: 8e8,
          maxDpbMbs: 696320,
          level: 62,
        },
        // Level 6.2
      ];
      const HEVC_LEVEL_TABLE = [
        { maxPictureSize: 36864, maxBitrate: 128e3, tier: "L", level: 30 },
        // Level 1 (Low Tier)
        { maxPictureSize: 122880, maxBitrate: 15e5, tier: "L", level: 60 },
        // Level 2 (Low Tier)
        { maxPictureSize: 245760, maxBitrate: 3e6, tier: "L", level: 63 },
        // Level 2.1 (Low Tier)
        { maxPictureSize: 552960, maxBitrate: 6e6, tier: "L", level: 90 },
        // Level 3 (Low Tier)
        { maxPictureSize: 983040, maxBitrate: 1e7, tier: "L", level: 93 },
        // Level 3.1 (Low Tier)
        { maxPictureSize: 2228224, maxBitrate: 12e6, tier: "L", level: 120 },
        // Level 4 (Low Tier)
        { maxPictureSize: 2228224, maxBitrate: 3e7, tier: "H", level: 120 },
        // Level 4 (High Tier)
        { maxPictureSize: 2228224, maxBitrate: 2e7, tier: "L", level: 123 },
        // Level 4.1 (Low Tier)
        { maxPictureSize: 2228224, maxBitrate: 5e7, tier: "H", level: 123 },
        // Level 4.1 (High Tier)
        { maxPictureSize: 8912896, maxBitrate: 25e6, tier: "L", level: 150 },
        // Level 5 (Low Tier)
        { maxPictureSize: 8912896, maxBitrate: 1e8, tier: "H", level: 150 },
        // Level 5 (High Tier)
        { maxPictureSize: 8912896, maxBitrate: 4e7, tier: "L", level: 153 },
        // Level 5.1 (Low Tier)
        { maxPictureSize: 8912896, maxBitrate: 16e7, tier: "H", level: 153 },
        // Level 5.1 (High Tier)
        { maxPictureSize: 8912896, maxBitrate: 6e7, tier: "L", level: 156 },
        // Level 5.2 (Low Tier)
        { maxPictureSize: 8912896, maxBitrate: 24e7, tier: "H", level: 156 },
        // Level 5.2 (High Tier)
        { maxPictureSize: 35651584, maxBitrate: 6e7, tier: "L", level: 180 },
        // Level 6 (Low Tier)
        { maxPictureSize: 35651584, maxBitrate: 24e7, tier: "H", level: 180 },
        // Level 6 (High Tier)
        { maxPictureSize: 35651584, maxBitrate: 12e7, tier: "L", level: 183 },
        // Level 6.1 (Low Tier)
        { maxPictureSize: 35651584, maxBitrate: 48e7, tier: "H", level: 183 },
        // Level 6.1 (High Tier)
        { maxPictureSize: 35651584, maxBitrate: 24e7, tier: "L", level: 186 },
        // Level 6.2 (Low Tier)
        { maxPictureSize: 35651584, maxBitrate: 8e8, tier: "H", level: 186 },
        // Level 6.2 (High Tier)
      ];
      const VP9_LEVEL_TABLE = [
        { maxPictureSize: 36864, maxBitrate: 2e5, level: 10 },
        // Level 1
        { maxPictureSize: 73728, maxBitrate: 8e5, level: 11 },
        // Level 1.1
        { maxPictureSize: 122880, maxBitrate: 18e5, level: 20 },
        // Level 2
        { maxPictureSize: 245760, maxBitrate: 36e5, level: 21 },
        // Level 2.1
        { maxPictureSize: 552960, maxBitrate: 72e5, level: 30 },
        // Level 3
        { maxPictureSize: 983040, maxBitrate: 12e6, level: 31 },
        // Level 3.1
        { maxPictureSize: 2228224, maxBitrate: 18e6, level: 40 },
        // Level 4
        { maxPictureSize: 2228224, maxBitrate: 3e7, level: 41 },
        // Level 4.1
        { maxPictureSize: 8912896, maxBitrate: 6e7, level: 50 },
        // Level 5
        { maxPictureSize: 8912896, maxBitrate: 12e7, level: 51 },
        // Level 5.1
        { maxPictureSize: 8912896, maxBitrate: 18e7, level: 52 },
        // Level 5.2
        { maxPictureSize: 35651584, maxBitrate: 18e7, level: 60 },
        // Level 6
        { maxPictureSize: 35651584, maxBitrate: 24e7, level: 61 },
        // Level 6.1
        { maxPictureSize: 35651584, maxBitrate: 48e7, level: 62 },
        // Level 6.2
      ];
      const AV1_LEVEL_TABLE = [
        { maxPictureSize: 147456, maxBitrate: 15e5, tier: "M", level: 0 },
        // Level 2.0 (Main Tier)
        { maxPictureSize: 278784, maxBitrate: 3e6, tier: "M", level: 1 },
        // Level 2.1 (Main Tier)
        { maxPictureSize: 665856, maxBitrate: 6e6, tier: "M", level: 4 },
        // Level 3.0 (Main Tier)
        { maxPictureSize: 1065024, maxBitrate: 1e7, tier: "M", level: 5 },
        // Level 3.1 (Main Tier)
        { maxPictureSize: 2359296, maxBitrate: 12e6, tier: "M", level: 8 },
        // Level 4.0 (Main Tier)
        { maxPictureSize: 2359296, maxBitrate: 3e7, tier: "H", level: 8 },
        // Level 4.0 (High Tier)
        { maxPictureSize: 2359296, maxBitrate: 2e7, tier: "M", level: 9 },
        // Level 4.1 (Main Tier)
        { maxPictureSize: 2359296, maxBitrate: 5e7, tier: "H", level: 9 },
        // Level 4.1 (High Tier)
        { maxPictureSize: 8912896, maxBitrate: 3e7, tier: "M", level: 12 },
        // Level 5.0 (Main Tier)
        { maxPictureSize: 8912896, maxBitrate: 1e8, tier: "H", level: 12 },
        // Level 5.0 (High Tier)
        { maxPictureSize: 8912896, maxBitrate: 4e7, tier: "M", level: 13 },
        // Level 5.1 (Main Tier)
        { maxPictureSize: 8912896, maxBitrate: 16e7, tier: "H", level: 13 },
        // Level 5.1 (High Tier)
        { maxPictureSize: 8912896, maxBitrate: 6e7, tier: "M", level: 14 },
        // Level 5.2 (Main Tier)
        { maxPictureSize: 8912896, maxBitrate: 24e7, tier: "H", level: 14 },
        // Level 5.2 (High Tier)
        { maxPictureSize: 35651584, maxBitrate: 6e7, tier: "M", level: 15 },
        // Level 5.3 (Main Tier)
        { maxPictureSize: 35651584, maxBitrate: 24e7, tier: "H", level: 15 },
        // Level 5.3 (High Tier)
        { maxPictureSize: 35651584, maxBitrate: 6e7, tier: "M", level: 16 },
        // Level 6.0 (Main Tier)
        { maxPictureSize: 35651584, maxBitrate: 24e7, tier: "H", level: 16 },
        // Level 6.0 (High Tier)
        { maxPictureSize: 35651584, maxBitrate: 1e8, tier: "M", level: 17 },
        // Level 6.1 (Main Tier)
        { maxPictureSize: 35651584, maxBitrate: 48e7, tier: "H", level: 17 },
        // Level 6.1 (High Tier)
        { maxPictureSize: 35651584, maxBitrate: 16e7, tier: "M", level: 18 },
        // Level 6.2 (Main Tier)
        { maxPictureSize: 35651584, maxBitrate: 8e8, tier: "H", level: 18 },
        // Level 6.2 (High Tier)
        { maxPictureSize: 35651584, maxBitrate: 16e7, tier: "M", level: 19 },
        // Level 6.3 (Main Tier)
        { maxPictureSize: 35651584, maxBitrate: 8e8, tier: "H", level: 19 },
        // Level 6.3 (High Tier)
      ];
      const VP9_DEFAULT_SUFFIX = ".01.01.01.01.00";
      const AV1_DEFAULT_SUFFIX = ".0.110.01.01.01.0";
      const PRORES_FOURCCS = [
        "ap4x",
        // ProRes 4444 XQ
        "ap4h",
        // ProRes 4444
        "apch",
        // ProRes 422 High Quality
        "apcn",
        // ProRes 422 Standard Definition
        "apcs",
        // ProRes 422 LT
        "apco",
        // ProRes 422 Proxy
      ];
      const DTS_FOURCCS = [
        "dtsc",
        // DTS core
        "dtsh",
        // DTS-HD, core plus extension substreams
        "dtsl",
        // DTS-HD Lossless, no core
        "dtse",
        // DTS Express
      ];
      const PRORES_PROFILE_TARGET_BITRATES = [
        { fourCc: "apco", bitrate: 45e6, alpha: false },
        // 422 Proxy
        { fourCc: "apcs", bitrate: 102e6, alpha: false },
        // 422 LT
        { fourCc: "apcn", bitrate: 147e6, alpha: false },
        // 422 Standard
        { fourCc: "apch", bitrate: 22e7, alpha: false },
        // 422 HQ
        { fourCc: "ap4h", bitrate: 33e7, alpha: true },
        // 4444
        { fourCc: "ap4x", bitrate: 5e8, alpha: true },
        // 4444 XQ
      ];
      const buildVideoCodecString = (codec, width, height, bitrate, alpha) => {
        if (codec === "avc") {
          const profileIndication = 100;
          const totalMacroblocks =
            Math.ceil(width / 16) * Math.ceil(height / 16);
          const levelInfo =
            AVC_LEVEL_TABLE.find(
              (level) =>
                totalMacroblocks <= level.maxMacroblocks &&
                bitrate <= level.maxBitrate,
            ) ?? last(AVC_LEVEL_TABLE);
          const levelIndication = levelInfo ? levelInfo.level : 0;
          const hexProfileIndication = profileIndication
            .toString(16)
            .padStart(2, "0");
          const hexProfileCompatibility = "00";
          const hexLevelIndication = levelIndication
            .toString(16)
            .padStart(2, "0");
          return "avc1."
            .concat(hexProfileIndication)
            .concat(hexProfileCompatibility)
            .concat(hexLevelIndication);
        } else if (codec === "hevc") {
          const profilePrefix = "";
          const profileIdc = 1;
          const compatibilityFlags = "6";
          const pictureSize = width * height;
          const levelInfo =
            HEVC_LEVEL_TABLE.find(
              (level) =>
                pictureSize <= level.maxPictureSize &&
                bitrate <= level.maxBitrate,
            ) ?? last(HEVC_LEVEL_TABLE);
          const constraintFlags = "B0";
          return (
            "hev1." +
            "".concat(profilePrefix).concat(profileIdc, ".") +
            "".concat(compatibilityFlags, ".") +
            "".concat(levelInfo.tier).concat(levelInfo.level, ".") +
            "".concat(constraintFlags)
          );
        } else if (codec === "vp8") {
          return "vp8";
        } else if (codec === "vp9") {
          const profile = "00";
          const pictureSize = width * height;
          const levelInfo =
            VP9_LEVEL_TABLE.find(
              (level) =>
                pictureSize <= level.maxPictureSize &&
                bitrate <= level.maxBitrate,
            ) ?? last(VP9_LEVEL_TABLE);
          const bitDepth = "08";
          return "vp09."
            .concat(profile, ".")
            .concat(levelInfo.level.toString().padStart(2, "0"), ".")
            .concat(bitDepth);
        } else if (codec === "av1") {
          const profile = 0;
          const pictureSize = width * height;
          const levelInfo =
            AV1_LEVEL_TABLE.find(
              (level2) =>
                pictureSize <= level2.maxPictureSize &&
                bitrate <= level2.maxBitrate,
            ) ?? last(AV1_LEVEL_TABLE);
          const level = levelInfo.level.toString().padStart(2, "0");
          const bitDepth = "08";
          return "av01."
            .concat(profile, ".")
            .concat(level)
            .concat(levelInfo.tier, ".")
            .concat(bitDepth);
        } else if (codec === "prores") {
          const referencePixels = 1920 * 1080;
          const scaleFactor = Math.pow(
            (width * height) / referencePixels,
            0.95,
          );
          const candidates = PRORES_PROFILE_TARGET_BITRATES.filter(
            (x) => x.alpha === alpha,
          );
          let bestFourCc = candidates[0].fourCc;
          let smallestDifference = Infinity;
          for (const { fourCc, bitrate: targetBitrate } of candidates) {
            const difference = Math.abs(targetBitrate * scaleFactor - bitrate);
            if (difference < smallestDifference) {
              smallestDifference = difference;
              bestFourCc = fourCc;
            }
          }
          return bestFourCc;
        } else {
          assertNever(codec);
        }
        throw new TypeError("Unhandled codec '".concat(String(codec), "'."));
      };
      const generateVp9CodecConfigurationFromCodecString = (codecString) => {
        const parts = codecString.split(".");
        const profile = Number(parts[1]);
        const level = Number(parts[2]);
        const bitDepth = Number(parts[3]);
        const chromaSubsampling = parts[4] ? Number(parts[4]) : 1;
        return [
          1,
          1,
          profile,
          2,
          1,
          level,
          3,
          1,
          bitDepth,
          4,
          1,
          chromaSubsampling,
        ];
      };
      const generateAv1CodecConfigurationFromCodecString = (codecString) => {
        const parts = codecString.split(".");
        const marker = 1;
        const version = 1;
        const firstByte = (marker << 7) + version;
        const profile = Number(parts[1]);
        const levelAndTier = parts[2];
        const level = Number(levelAndTier.slice(0, -1));
        const secondByte = (profile << 5) + level;
        const tier = levelAndTier.slice(-1) === "H" ? 1 : 0;
        const bitDepth = Number(parts[3]);
        const highBitDepth = bitDepth === 8 ? 0 : 1;
        const twelveBit = bitDepth === 12 ? 1 : 0;
        const monochrome = parts[4] ? Number(parts[4]) : 0;
        const chromaSubsamplingX = parts[5] ? Number(parts[5][0]) : 1;
        const chromaSubsamplingY = parts[5] ? Number(parts[5][1]) : 1;
        const chromaSamplePosition = parts[5] ? Number(parts[5][2]) : 0;
        const thirdByte =
          (tier << 7) +
          (highBitDepth << 6) +
          (twelveBit << 5) +
          (monochrome << 4) +
          (chromaSubsamplingX << 3) +
          (chromaSubsamplingY << 2) +
          chromaSamplePosition;
        const initialPresentationDelayPresent = 0;
        const fourthByte = initialPresentationDelayPresent;
        return [firstByte, secondByte, thirdByte, fourthByte];
      };
      const extractVideoCodecString = (trackInfo) => {
        const {
          codec,
          codecDescription,
          colorSpace,
          avcCodecInfo,
          hevcCodecInfo,
          vp9CodecInfo,
          av1CodecInfo,
          proresFormat,
        } = trackInfo;
        if (codec === "avc") {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
            trackInfo.avcType !== null,
          );
          if (avcCodecInfo) {
            const bytes = new Uint8Array([
              avcCodecInfo.avcProfileIndication,
              avcCodecInfo.profileCompatibility,
              avcCodecInfo.avcLevelIndication,
            ]);
            return "avc"
              .concat(trackInfo.avcType, ".")
              .concat((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Br)(bytes));
          }
          if (!codecDescription || codecDescription.byteLength < 4) {
            throw new TypeError(
              "AVC decoder description is not provided or is not at least 4 bytes long.",
            );
          }
          return "avc"
            .concat(trackInfo.avcType, ".")
            .concat(
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Br)(
                codecDescription.subarray(1, 4),
              ),
            );
        } else if (codec === "hevc") {
          let generalProfileSpace;
          let generalProfileIdc;
          let compatibilityFlags;
          let generalTierFlag;
          let generalLevelIdc;
          let constraintFlags;
          if (hevcCodecInfo) {
            generalProfileSpace = hevcCodecInfo.generalProfileSpace;
            generalProfileIdc = hevcCodecInfo.generalProfileIdc;
            compatibilityFlags = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.P5)(
              hevcCodecInfo.generalProfileCompatibilityFlags,
            );
            generalTierFlag = hevcCodecInfo.generalTierFlag;
            generalLevelIdc = hevcCodecInfo.generalLevelIdc;
            constraintFlags = [
              ...hevcCodecInfo.generalConstraintIndicatorFlags,
            ];
          } else {
            if (!codecDescription || codecDescription.byteLength < 23) {
              throw new TypeError(
                "HEVC decoder description is not provided or is not at least 23 bytes long.",
              );
            }
            const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Zc)(
              codecDescription,
            );
            const profileByte = view.getUint8(1);
            generalProfileSpace = (profileByte >> 6) & 3;
            generalProfileIdc = profileByte & 31;
            compatibilityFlags = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.P5)(
              view.getUint32(2),
            );
            generalTierFlag = (profileByte >> 5) & 1;
            generalLevelIdc = view.getUint8(12);
            constraintFlags = [];
            for (let i = 0; i < 6; i++) {
              constraintFlags.push(view.getUint8(6 + i));
            }
          }
          let codecString = "hev1.";
          codecString +=
            ["", "A", "B", "C"][generalProfileSpace] + generalProfileIdc;
          codecString += ".";
          codecString += compatibilityFlags.toString(16).toUpperCase();
          codecString += ".";
          codecString += generalTierFlag === 0 ? "L" : "H";
          codecString += generalLevelIdc;
          while (
            constraintFlags.length > 0 &&
            constraintFlags[constraintFlags.length - 1] === 0
          ) {
            constraintFlags.pop();
          }
          if (constraintFlags.length > 0) {
            codecString += ".";
            codecString += constraintFlags
              .map((x) => x.toString(16).toUpperCase())
              .join(".");
          }
          return codecString;
        } else if (codec === "vp8") {
          return "vp8";
        } else if (codec === "vp9") {
          if (!vp9CodecInfo) {
            const pictureSize = trackInfo.width * trackInfo.height;
            let level2 = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__._g)(
              VP9_LEVEL_TABLE,
            ).level;
            for (const entry of VP9_LEVEL_TABLE) {
              if (pictureSize <= entry.maxPictureSize) {
                level2 = entry.level;
                break;
              }
            }
            return "vp09.00.".concat(level2.toString().padStart(2, "0"), ".08");
          }
          const profile = vp9CodecInfo.profile.toString().padStart(2, "0");
          const level = vp9CodecInfo.level.toString().padStart(2, "0");
          const bitDepth = vp9CodecInfo.bitDepth.toString().padStart(2, "0");
          const chromaSubsampling = vp9CodecInfo.chromaSubsampling
            .toString()
            .padStart(2, "0");
          const colourPrimaries = vp9CodecInfo.colourPrimaries
            .toString()
            .padStart(2, "0");
          const transferCharacteristics = vp9CodecInfo.transferCharacteristics
            .toString()
            .padStart(2, "0");
          const matrixCoefficients = vp9CodecInfo.matrixCoefficients
            .toString()
            .padStart(2, "0");
          const videoFullRangeFlag = vp9CodecInfo.videoFullRangeFlag
            .toString()
            .padStart(2, "0");
          let string = "vp09."
            .concat(profile, ".")
            .concat(level, ".")
            .concat(bitDepth, ".")
            .concat(chromaSubsampling);
          string += "."
            .concat(colourPrimaries, ".")
            .concat(transferCharacteristics, ".")
            .concat(matrixCoefficients, ".")
            .concat(videoFullRangeFlag);
          if (string.endsWith(VP9_DEFAULT_SUFFIX)) {
            string = string.slice(0, -VP9_DEFAULT_SUFFIX.length);
          }
          return string;
        } else if (codec === "av1") {
          if (!av1CodecInfo) {
            const pictureSize = trackInfo.width * trackInfo.height;
            let level2 = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__._g)(
              VP9_LEVEL_TABLE,
            ).level;
            for (const entry of VP9_LEVEL_TABLE) {
              if (pictureSize <= entry.maxPictureSize) {
                level2 = entry.level;
                break;
              }
            }
            return "av01.0.".concat(level2.toString().padStart(2, "0"), "M.08");
          }
          const profile = av1CodecInfo.profile;
          const level = av1CodecInfo.level.toString().padStart(2, "0");
          const tier = av1CodecInfo.tier ? "H" : "M";
          const bitDepth = av1CodecInfo.bitDepth.toString().padStart(2, "0");
          const monochrome = av1CodecInfo.monochrome ? "1" : "0";
          const chromaSubsampling =
            100 * av1CodecInfo.chromaSubsamplingX +
            10 * av1CodecInfo.chromaSubsamplingY +
            1 *
              (av1CodecInfo.chromaSubsamplingX &&
              av1CodecInfo.chromaSubsamplingY
                ? av1CodecInfo.chromaSamplePosition
                : 0);
          const colorPrimaries = colorSpace?.primaries
            ? _misc_js__WEBPACK_IMPORTED_MODULE_2__.wd[colorSpace.primaries]
            : 1;
          const transferCharacteristics = colorSpace?.transfer
            ? _misc_js__WEBPACK_IMPORTED_MODULE_2__.uN[colorSpace.transfer]
            : 1;
          const matrixCoefficients = colorSpace?.matrix
            ? _misc_js__WEBPACK_IMPORTED_MODULE_2__.Au[colorSpace.matrix]
            : 1;
          const videoFullRangeFlag = colorSpace?.fullRange ? 1 : 0;
          let string = "av01."
            .concat(profile, ".")
            .concat(level)
            .concat(tier, ".")
            .concat(bitDepth);
          string += "."
            .concat(monochrome, ".")
            .concat(chromaSubsampling.toString().padStart(3, "0"));
          string += ".".concat(colorPrimaries.toString().padStart(2, "0"));
          string += ".".concat(
            transferCharacteristics.toString().padStart(2, "0"),
          );
          string += ".".concat(matrixCoefficients.toString().padStart(2, "0"));
          string += ".".concat(videoFullRangeFlag);
          if (string.endsWith(AV1_DEFAULT_SUFFIX)) {
            string = string.slice(0, -AV1_DEFAULT_SUFFIX.length);
          }
          return string;
        } else if (codec === "prores") {
          return proresFormat ?? "apch";
        } else if (codec !== null) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.xb)(codec);
        }
        throw new TypeError("Unhandled codec '".concat(codec, "'."));
      };
      const extractColorSpace = (info) => {
        switch (info.codec) {
          case "avc":
            {
              let spsData = info.avcCodecInfo?.sequenceParameterSets[0];
              if (!spsData && info.codecDescription) {
                spsData = (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.BP)(
                  info.codecDescription,
                )?.sequenceParameterSets[0];
              }
              if (spsData) {
                const spsInfo = (0,
                _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.eM)(spsData);
                if (spsInfo) {
                  return {
                    primaries:
                      _misc_js__WEBPACK_IMPORTED_MODULE_2__.BL[
                        spsInfo.colourPrimaries
                      ],
                    transfer:
                      _misc_js__WEBPACK_IMPORTED_MODULE_2__.x_[
                        spsInfo.transferCharacteristics
                      ],
                    matrix:
                      _misc_js__WEBPACK_IMPORTED_MODULE_2__.fl[
                        spsInfo.matrixCoefficients
                      ],
                    fullRange: !!spsInfo.fullRangeFlag,
                  };
                }
              }
            }
            break;
          case "hevc":
            {
              let spsData = info.hevcCodecInfo?.arrays.find(
                (x) =>
                  x.nalUnitType ===
                  _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.iJ.SPS_NUT,
              )?.nalUnits[0];
              if (!spsData && info.codecDescription) {
                spsData = (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.hf)(
                  info.codecDescription,
                )?.arrays.find(
                  (x) =>
                    x.nalUnitType ===
                    _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.iJ.SPS_NUT,
                )?.nalUnits[0];
              }
              if (spsData) {
                const spsInfo = (0,
                _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.gT)(spsData);
                if (spsInfo) {
                  return {
                    primaries:
                      _misc_js__WEBPACK_IMPORTED_MODULE_2__.BL[
                        spsInfo.colourPrimaries
                      ],
                    transfer:
                      _misc_js__WEBPACK_IMPORTED_MODULE_2__.x_[
                        spsInfo.transferCharacteristics
                      ],
                    matrix:
                      _misc_js__WEBPACK_IMPORTED_MODULE_2__.fl[
                        spsInfo.matrixCoefficients
                      ],
                    fullRange: !!spsInfo.fullRangeFlag,
                  };
                }
              }
            }
            break;
          case "vp8":
            {
            }
            break;
          case "vp9":
            {
              if (info.vp9CodecInfo) {
                return {
                  primaries:
                    _misc_js__WEBPACK_IMPORTED_MODULE_2__.BL[
                      info.vp9CodecInfo.colourPrimaries
                    ],
                  transfer:
                    _misc_js__WEBPACK_IMPORTED_MODULE_2__.x_[
                      info.vp9CodecInfo.transferCharacteristics
                    ],
                  matrix:
                    _misc_js__WEBPACK_IMPORTED_MODULE_2__.fl[
                      info.vp9CodecInfo.matrixCoefficients
                    ],
                  fullRange: !!info.vp9CodecInfo.videoFullRangeFlag,
                };
              }
            }
            break;
          case "av1":
            {
              if (info.av1CodecInfo) {
                return {
                  primaries:
                    _misc_js__WEBPACK_IMPORTED_MODULE_2__.BL[
                      info.av1CodecInfo.colourPrimaries
                    ],
                  transfer:
                    _misc_js__WEBPACK_IMPORTED_MODULE_2__.x_[
                      info.av1CodecInfo.transferCharacteristics
                    ],
                  matrix:
                    _misc_js__WEBPACK_IMPORTED_MODULE_2__.fl[
                      info.av1CodecInfo.matrixCoefficients
                    ],
                  fullRange: !!info.av1CodecInfo.videoFullRangeFlag,
                };
              }
            }
            break;
          case "prores":
            {
              if (info.proresCodecInfo) {
                return {
                  primaries:
                    _misc_js__WEBPACK_IMPORTED_MODULE_2__.BL[
                      info.proresCodecInfo.colourPrimaries
                    ],
                  transfer:
                    _misc_js__WEBPACK_IMPORTED_MODULE_2__.x_[
                      info.proresCodecInfo.transferCharacteristics
                    ],
                  matrix:
                    _misc_js__WEBPACK_IMPORTED_MODULE_2__.fl[
                      info.proresCodecInfo.matrixCoefficients
                    ],
                  fullRange: info.proresCodecInfo.fullRange,
                };
              }
            }
            break;
        }
        return {
          primaries: void 0,
          transfer: void 0,
          matrix: void 0,
          fullRange: void 0,
        };
      };
      const buildAudioCodecString = (codec, numberOfChannels, sampleRate) => {
        if (codec === "aac") {
          if (numberOfChannels >= 2 && sampleRate <= 24e3) {
            return "mp4a.40.29";
          }
          if (sampleRate <= 24e3) {
            return "mp4a.40.5";
          }
          return "mp4a.40.2";
        } else if (codec === "mp3") {
          return "mp3";
        } else if (codec === "opus") {
          return "opus";
        } else if (codec === "vorbis") {
          return "vorbis";
        } else if (codec === "flac") {
          return "flac";
        } else if (codec === "ac3") {
          return "ac-3";
        } else if (codec === "eac3") {
          return "ec-3";
        } else if (codec === "dts") {
          return "dtsc";
        } else if (PCM_AUDIO_CODECS.includes(codec)) {
          return codec;
        }
        throw new TypeError("Unhandled codec '".concat(codec, "'."));
      };
      const extractAudioCodecString = (trackInfo) => {
        const { codec, codecDescription, aacCodecInfo, dtsFormat } = trackInfo;
        if (codec === "aac") {
          if (!aacCodecInfo) {
            throw new TypeError("AAC codec info must be provided.");
          }
          if (aacCodecInfo.isMpeg2) {
            return "mp4a.67";
          } else {
            let objectType;
            if (aacCodecInfo.objectType !== null) {
              objectType = aacCodecInfo.objectType;
            } else {
              const audioSpecificConfig = (0,
              _shared_aac_misc_js__WEBPACK_IMPORTED_MODULE_0__.zF)(
                codecDescription,
              );
              objectType = audioSpecificConfig.objectType;
            }
            return "mp4a.40.".concat(objectType);
          }
        } else if (codec === "mp3") {
          return "mp3";
        } else if (codec === "opus") {
          return "opus";
        } else if (codec === "vorbis") {
          return "vorbis";
        } else if (codec === "flac") {
          return "flac";
        } else if (codec === "ac3") {
          return "ac-3";
        } else if (codec === "eac3") {
          return "ec-3";
        } else if (codec === "dts") {
          return dtsFormat ?? "dtsc";
        } else if (codec && PCM_AUDIO_CODECS.includes(codec)) {
          return codec;
        }
        throw new TypeError("Unhandled codec '".concat(codec, "'."));
      };
      const guessDescriptionForVideo = (decoderConfig) => {
        return void 0;
      };
      const guessDescriptionForAudio = (decoderConfig) => {
        switch (decoderConfig.codec) {
          case "flac": {
            const referenceDescription = base64ToBytes(
              "ZkxhQ4AAACIQABAAAAYtACWtCsRC8AANRBhVFucAcYu5ASE2m1Dxv8tw",
            );
            if (
              decoderConfig.sampleRate >= 1 << 20 ||
              decoderConfig.numberOfChannels > 8
            ) {
              return false;
            }
            referenceDescription[18] = decoderConfig.sampleRate >>> 12;
            referenceDescription[19] = decoderConfig.sampleRate >>> 4;
            referenceDescription[20] =
              ((decoderConfig.sampleRate & 15) << 4) |
              ((decoderConfig.numberOfChannels - 1) << 1);
            return referenceDescription;
          }
          // removed by dead control flow
          case "vorbis": {
            const referenceDescription = base64ToBytes(
              "Ah7/AgF2b3JiaXMAAAAAAoC7AAAAAAAAgLUBAAAAAAC4AQN2b3JiaXMNAAAATGF2ZjU4Ljc2LjEwMAgAAAAMAAAAbGFuZ3VhZ2U9dW5kGQAAAGhhbmRsZXJfbmFtZT1Tb3VuZEhhbmRsZXIWAAAAdmVuZG9yX2lkPVswXVswXVswXVswXSAAAABlbmNvZGVyPUxhdmM1OC4xMzQuMTAwIGxpYnZvcmJpcxAAAABtYWpvcl9icmFuZD1pc29tEQAAAG1pbm9yX3ZlcnNpb249NTEyIgAAAGNvbXBhdGlibGVfYnJhbmRzPWlzb21pc28yYXZjMW1wNDEmAAAAREVTQ1JJUFRJT049TWFkZSB3aXRoIFJlbW90aW9uIDQuMC4yNzgBBXZvcmJpcyVCQ1YBAEAAACRzGCpGpXMWhBAaQlAZ4xxCzmvsGUJMEYIcMkxbyyVzkCGkoEKIWyiB0JBVAABAAACHQXgUhIpBCCGEJT1YkoMnPQghhIg5eBSEaUEIIYQQQgghhBBCCCGERTlokoMnQQgdhOMwOAyD5Tj4HIRFOVgQgydB6CCED0K4moOsOQghhCQ1SFCDBjnoHITCLCiKgsQwuBaEBDUojILkMMjUgwtCiJqDSTX4GoRnQXgWhGlBCCGEJEFIkIMGQcgYhEZBWJKDBjm4FITLQagahCo5CB+EIDRkFQCQAACgoiiKoigKEBqyCgDIAAAQQFEUx3EcyZEcybEcCwgNWQUAAAEACAAAoEiKpEiO5EiSJFmSJVmSJVmS5omqLMuyLMuyLMsyEBqyCgBIAABQUQxFcRQHCA1ZBQBkAAAIoDiKpViKpWiK54iOCISGrAIAgAAABAAAEDRDUzxHlETPVFXXtm3btm3btm3btm3btm1blmUZCA1ZBQBAAAAQ0mlmqQaIMAMZBkJDVgEACAAAgBGKMMSA0JBVAABAAACAGEoOogmtOd+c46BZDppKsTkdnEi1eZKbirk555xzzsnmnDHOOeecopxZDJoJrTnnnMSgWQqaCa0555wnsXnQmiqtOeeccc7pYJwRxjnnnCateZCajbU555wFrWmOmkuxOeecSLl5UptLtTnnnHPOOeecc84555zqxekcnBPOOeecqL25lpvQxTnnnE/G6d6cEM4555xzzjnnnHPOOeecIDRkFQAABABAEIaNYdwpCNLnaCBGEWIaMulB9+gwCRqDnELq0ehopJQ6CCWVcVJKJwgNWQUAAAIAQAghhRRSSCGFFFJIIYUUYoghhhhyyimnoIJKKqmooowyyyyzzDLLLLPMOuyssw47DDHEEEMrrcRSU2011lhr7jnnmoO0VlprrbVSSimllFIKQkNWAQAgAAAEQgYZZJBRSCGFFGKIKaeccgoqqIDQkFUAACAAgAAAAABP8hzRER3RER3RER3RER3R8RzPESVREiVREi3TMjXTU0VVdWXXlnVZt31b2IVd933d933d+HVhWJZlWZZlWZZlWZZlWZZlWZYgNGQVAAACAAAghBBCSCGFFFJIKcYYc8w56CSUEAgNWQUAAAIACAAAAHAUR3EcyZEcSbIkS9IkzdIsT/M0TxM9URRF0zRV0RVdUTdtUTZl0zVdUzZdVVZtV5ZtW7Z125dl2/d93/d93/d93/d93/d9XQdCQ1YBABIAADqSIymSIimS4ziOJElAaMgqAEAGAEAAAIriKI7jOJIkSZIlaZJneZaomZrpmZ4qqkBoyCoAABAAQAAAAAAAAIqmeIqpeIqoeI7oiJJomZaoqZoryqbsuq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq7ruq4LhIasAgAkAAB0JEdyJEdSJEVSJEdygNCQVQCADACAAAAcwzEkRXIsy9I0T/M0TxM90RM901NFV3SB0JBVAAAgAIAAAAAAAAAMybAUy9EcTRIl1VItVVMt1VJF1VNVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVN0zRNEwgNWQkAkAEAkBBTLS3GmgmLJGLSaqugYwxS7KWxSCpntbfKMYUYtV4ah5RREHupJGOKQcwtpNApJq3WVEKFFKSYYyoVUg5SIDRkhQAQmgHgcBxAsixAsiwAAAAAAAAAkDQN0DwPsDQPAAAAAAAAACRNAyxPAzTPAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA0jRA8zxA8zwAAAAAAAAA0DwP8DwR8EQRAAAAAAAAACzPAzTRAzxRBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABA0jRA8zxA8zwAAAAAAAAAsDwP8EQR0DwRAAAAAAAAACzPAzxRBDzRAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAEOAAABBgIRQasiIAiBMAcEgSJAmSBM0DSJYFTYOmwTQBkmVB06BpME0AAAAAAAAAAAAAJE2DpkHTIIoASdOgadA0iCIAAAAAAAAAAAAAkqZB06BpEEWApGnQNGgaRBEAAAAAAAAAAAAAzzQhihBFmCbAM02IIkQRpgkAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAGHAAAAgwoQwUGrIiAIgTAHA4imUBAIDjOJYFAACO41gWAABYliWKAABgWZooAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAYcAAACDChDBQashIAiAIAcCiKZQHHsSzgOJYFJMmyAJYF0DyApgFEEQAIAAAocAAACLBBU2JxgEJDVgIAUQAABsWxLE0TRZKkaZoniiRJ0zxPFGma53meacLzPM80IYqiaJoQRVE0TZimaaoqME1VFQAAUOAAABBgg6bE4gCFhqwEAEICAByKYlma5nmeJ4qmqZokSdM8TxRF0TRNU1VJkqZ5niiKommapqqyLE3zPFEURdNUVVWFpnmeKIqiaaqq6sLzPE8URdE0VdV14XmeJ4qiaJqq6roQRVE0TdNUTVV1XSCKpmmaqqqqrgtETxRNU1Vd13WB54miaaqqq7ouEE3TVFVVdV1ZBpimaaqq68oyQFVV1XVdV5YBqqqqruu6sgxQVdd1XVmWZQCu67qyLMsCAAAOHAAAAoygk4wqi7DRhAsPQKEhKwKAKAAAwBimFFPKMCYhpBAaxiSEFEImJaXSUqogpFJSKRWEVEoqJaOUUmopVRBSKamUCkIqJZVSAADYgQMA2IGFUGjISgAgDwCAMEYpxhhzTiKkFGPOOScRUoox55yTSjHmnHPOSSkZc8w556SUzjnnnHNSSuacc845KaVzzjnnnJRSSuecc05KKSWEzkEnpZTSOeecEwAAVOAAABBgo8jmBCNBhYasBABSAQAMjmNZmuZ5omialiRpmud5niiapiZJmuZ5nieKqsnzPE8URdE0VZXneZ4oiqJpqirXFUXTNE1VVV2yLIqmaZqq6rowTdNUVdd1XZimaaqq67oubFtVVdV1ZRm2raqq6rqyDFzXdWXZloEsu67s2rIAAPAEBwCgAhtWRzgpGgssNGQlAJABAEAYg5BCCCFlEEIKIYSUUggJAAAYcAAACDChDBQashIASAUAAIyx1lprrbXWQGettdZaa62AzFprrbXWWmuttdZaa6211lJrrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmuttdZaa6211lprrbXWWmstpZRSSimllFJKKaWUUkoppZRSSgUA+lU4APg/2LA6wknRWGChISsBgHAAAMAYpRhzDEIppVQIMeacdFRai7FCiDHnJKTUWmzFc85BKCGV1mIsnnMOQikpxVZjUSmEUlJKLbZYi0qho5JSSq3VWIwxqaTWWoutxmKMSSm01FqLMRYjbE2ptdhqq7EYY2sqLbQYY4zFCF9kbC2m2moNxggjWywt1VprMMYY3VuLpbaaizE++NpSLDHWXAAAd4MDAESCjTOsJJ0VjgYXGrISAAgJACAQUooxxhhzzjnnpFKMOeaccw5CCKFUijHGnHMOQgghlIwx5pxzEEIIIYRSSsaccxBCCCGEkFLqnHMQQgghhBBKKZ1zDkIIIYQQQimlgxBCCCGEEEoopaQUQgghhBBCCKmklEIIIYRSQighlZRSCCGEEEIpJaSUUgohhFJCCKGElFJKKYUQQgillJJSSimlEkoJJYQSUikppRRKCCGUUkpKKaVUSgmhhBJKKSWllFJKIYQQSikFAAAcOAAABBhBJxlVFmGjCRcegEJDVgIAZAAAkKKUUiktRYIipRikGEtGFXNQWoqocgxSzalSziDmJJaIMYSUk1Qy5hRCDELqHHVMKQYtlRhCxhik2HJLoXMOAAAAQQCAgJAAAAMEBTMAwOAA4XMQdAIERxsAgCBEZohEw0JweFAJEBFTAUBigkIuAFRYXKRdXECXAS7o4q4DIQQhCEEsDqCABByccMMTb3jCDU7QKSp1IAAAAAAADADwAACQXAAREdHMYWRobHB0eHyAhIiMkAgAAAAAABcAfAAAJCVAREQ0cxgZGhscHR4fICEiIyQBAIAAAgAAAAAggAAEBAQAAAAAAAIAAAAEBA==",
            );
            const view = toDataView(referenceDescription);
            view.setUint8(15, decoderConfig.numberOfChannels);
            view.setUint32(16, decoderConfig.sampleRate, true);
            return referenceDescription;
          }
          // removed by dead control flow
          default:
            return void 0;
        }
      };
      const OPUS_SAMPLE_RATE = 48e3;
      const PCM_CODEC_REGEX = /^pcm-([usf])(\d+)(be)?$/;
      const parsePcmCodec = (codec) => {
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
          PCM_AUDIO_CODECS.includes(codec),
        );
        if (codec === "ulaw") {
          return {
            dataType: "ulaw",
            sampleSize: 1,
            littleEndian: true,
            silentValue: 255,
          };
        } else if (codec === "alaw") {
          return {
            dataType: "alaw",
            sampleSize: 1,
            littleEndian: true,
            silentValue: 213,
          };
        }
        const match = PCM_CODEC_REGEX.exec(codec);
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(match);
        let dataType;
        if (match[1] === "u") {
          dataType = "unsigned";
        } else if (match[1] === "s") {
          dataType = "signed";
        } else {
          dataType = "float";
        }
        const sampleSize = Number(match[2]) / 8;
        const littleEndian = match[3] !== "be";
        const silentValue = codec === "pcm-u8" ? 2 ** 7 : 0;
        return { dataType, sampleSize, littleEndian, silentValue };
      };
      const inferCodecFromCodecString = (codecString) => {
        if (codecString.startsWith("avc1") || codecString.startsWith("avc3")) {
          return "avc";
        } else if (
          codecString.startsWith("hev1") ||
          codecString.startsWith("hvc1")
        ) {
          return "hevc";
        } else if (codecString === "vp8") {
          return "vp8";
        } else if (codecString.startsWith("vp09")) {
          return "vp9";
        } else if (codecString.startsWith("av01")) {
          return "av1";
        } else if (PRORES_FOURCCS.includes(codecString)) {
          return "prores";
        }
        if (
          codecString === "mp3" ||
          codecString === "mp4a.69" ||
          codecString === "mp4a.6B" ||
          codecString === "mp4a.6b" ||
          codecString === "mp4a.40.34"
        ) {
          return "mp3";
        } else if (
          codecString.startsWith("mp4a.40.") ||
          codecString === "mp4a.67"
        ) {
          return "aac";
        } else if (codecString === "opus") {
          return "opus";
        } else if (codecString === "vorbis") {
          return "vorbis";
        } else if (codecString === "flac") {
          return "flac";
        } else if (codecString === "ac-3" || codecString === "ac3") {
          return "ac3";
        } else if (codecString === "ec-3" || codecString === "eac3") {
          return "eac3";
        } else if (DTS_FOURCCS.includes(codecString)) {
          return "dts";
        } else if (codecString === "ulaw") {
          return "ulaw";
        } else if (codecString === "alaw") {
          return "alaw";
        } else if (PCM_CODEC_REGEX.test(codecString)) {
          return codecString;
        }
        if (codecString === "webvtt") {
          return "webvtt";
        }
        return null;
      };
      const getVideoEncoderConfigExtension = (codec) => {
        if (codec === "avc") {
          return {
            avc: {
              format: "avc",
              // Ensure the format is not Annex B
            },
          };
        } else if (codec === "hevc") {
          return {
            hevc: {
              format: "hevc",
              // Ensure the format is not Annex B
            },
          };
        }
        return {};
      };
      const getAudioEncoderConfigExtension = (codec) => {
        if (codec === "aac") {
          return {
            aac: {
              format: "aac",
              // Ensure the format is not ADTS
            },
          };
        } else if (codec === "opus") {
          return {
            opus: {
              format: "opus",
            },
          };
        }
        return {};
      };
      const VALID_VIDEO_CODEC_STRING_PREFIXES = [
        "avc1",
        "avc3",
        "hev1",
        "hvc1",
        "vp8",
        "vp09",
        "av01",
        ...PRORES_FOURCCS,
      ];
      const AVC_CODEC_STRING_REGEX = /^(avc1|avc3)\.[0-9a-fA-F]{6}$/;
      const HEVC_CODEC_STRING_REGEX =
        /^(hev1|hvc1)\.(?:[ABC]?\d+)\.[0-9a-fA-F]{1,8}\.[LH]\d+(?:\.[0-9a-fA-F]{1,2}){0,6}$/;
      const VP9_CODEC_STRING_REGEX = /^vp09(?:\.\d{2}){3}(?:(?:\.\d{2}){5})?$/;
      const AV1_CODEC_STRING_REGEX =
        /^av01\.\d\.\d{2}[MH]\.\d{2}(?:\.\d\.\d{3}\.\d{2}\.\d{2}\.\d{2}\.\d)?$/;
      const validateVideoChunkMetadata = (metadata, trackCodec) => {
        if (!metadata) {
          throw new TypeError("Video chunk metadata must be provided.");
        }
        if (typeof metadata !== "object") {
          throw new TypeError("Video chunk metadata must be an object.");
        }
        if (!metadata.decoderConfig) {
          throw new TypeError(
            "Video chunk metadata must include a decoder configuration.",
          );
        }
        if (typeof metadata.decoderConfig !== "object") {
          throw new TypeError(
            "Video chunk metadata decoder configuration must be an object.",
          );
        }
        if (typeof metadata.decoderConfig.codec !== "string") {
          throw new TypeError(
            "Video chunk metadata decoder configuration must specify a codec string.",
          );
        }
        if (
          !VALID_VIDEO_CODEC_STRING_PREFIXES.some((prefix) =>
            metadata.decoderConfig.codec.startsWith(prefix),
          )
        ) {
          throw new TypeError(
            "Video chunk metadata decoder configuration codec string must be a valid video codec string as specified in the Mediabunny Codec Registry.",
          );
        }
        if (
          !Number.isInteger(metadata.decoderConfig.codedWidth) ||
          metadata.decoderConfig.codedWidth <= 0
        ) {
          throw new TypeError(
            "Video chunk metadata decoder configuration must specify a valid codedWidth (positive integer).",
          );
        }
        if (
          !Number.isInteger(metadata.decoderConfig.codedHeight) ||
          metadata.decoderConfig.codedHeight <= 0
        ) {
          throw new TypeError(
            "Video chunk metadata decoder configuration must specify a valid codedHeight (positive integer).",
          );
        }
        if (
          metadata.decoderConfig.displayAspectWidth !== void 0 &&
          (!Number.isInteger(metadata.decoderConfig.displayAspectWidth) ||
            metadata.decoderConfig.displayAspectWidth <= 0)
        ) {
          throw new TypeError(
            "Video chunk metadata decoder configuration displayAspectWidth, when defined, must be a positive integer.",
          );
        }
        if (
          metadata.decoderConfig.displayAspectHeight !== void 0 &&
          (!Number.isInteger(metadata.decoderConfig.displayAspectHeight) ||
            metadata.decoderConfig.displayAspectHeight <= 0)
        ) {
          throw new TypeError(
            "Video chunk metadata decoder configuration displayAspectHeight, when defined, must be a positive integer.",
          );
        }
        if (
          (metadata.decoderConfig.displayAspectWidth !== void 0) !==
          (metadata.decoderConfig.displayAspectHeight !== void 0)
        ) {
          throw new TypeError(
            "Video chunk metadata decoder configuration must specify both displayAspectWidth and displayAspectHeight, or neither.",
          );
        }
        if (metadata.decoderConfig.description !== void 0) {
          if (!isAllowSharedBufferSource(metadata.decoderConfig.description)) {
            throw new TypeError(
              "Video chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.",
            );
          }
        }
        if (metadata.decoderConfig.colorSpace !== void 0) {
          const { colorSpace } = metadata.decoderConfig;
          if (typeof colorSpace !== "object") {
            throw new TypeError(
              "Video chunk metadata decoder configuration colorSpace, when provided, must be an object.",
            );
          }
          const primariesValues = Object.keys(COLOR_PRIMARIES_MAP);
          if (
            colorSpace.primaries != null &&
            !primariesValues.includes(colorSpace.primaries)
          ) {
            throw new TypeError(
              "Video chunk metadata decoder configuration colorSpace primaries, when defined, must be one of" +
                " ".concat(primariesValues.join(", "), "."),
            );
          }
          const transferValues = Object.keys(TRANSFER_CHARACTERISTICS_MAP);
          if (
            colorSpace.transfer != null &&
            !transferValues.includes(colorSpace.transfer)
          ) {
            throw new TypeError(
              "Video chunk metadata decoder configuration colorSpace transfer, when defined, must be one of" +
                " ".concat(transferValues.join(", "), "."),
            );
          }
          const matrixValues = Object.keys(MATRIX_COEFFICIENTS_MAP);
          if (
            colorSpace.matrix != null &&
            !matrixValues.includes(colorSpace.matrix)
          ) {
            throw new TypeError(
              "Video chunk metadata decoder configuration colorSpace matrix, when defined, must be one of" +
                " ".concat(matrixValues.join(", "), "."),
            );
          }
          if (
            colorSpace.fullRange != null &&
            typeof colorSpace.fullRange !== "boolean"
          ) {
            throw new TypeError(
              "Video chunk metadata decoder configuration colorSpace fullRange, when defined, must be a boolean.",
            );
          }
        }
        if (
          metadata.decoderConfig.codec.startsWith("avc1") ||
          metadata.decoderConfig.codec.startsWith("avc3")
        ) {
          if (!AVC_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) {
            throw new TypeError(
              "Video chunk metadata decoder configuration codec string for AVC must be a valid AVC codec string as specified in Section 3.4 of RFC 6381.",
            );
          }
        } else if (
          metadata.decoderConfig.codec.startsWith("hev1") ||
          metadata.decoderConfig.codec.startsWith("hvc1")
        ) {
          if (!HEVC_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) {
            throw new TypeError(
              "Video chunk metadata decoder configuration codec string for HEVC must be a valid HEVC codec string as specified in Section E.3 of ISO 14496-15.",
            );
          }
        } else if (metadata.decoderConfig.codec.startsWith("vp8")) {
          if (metadata.decoderConfig.codec !== "vp8") {
            throw new TypeError(
              'Video chunk metadata decoder configuration codec string for VP8 must be "vp8".',
            );
          }
        } else if (metadata.decoderConfig.codec.startsWith("vp09")) {
          if (!VP9_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) {
            throw new TypeError(
              'Video chunk metadata decoder configuration codec string for VP9 must be a valid VP9 codec string as specified in Section "Codecs Parameter String" of https://www.webmproject.org/vp9/mp4/.',
            );
          }
        } else if (metadata.decoderConfig.codec.startsWith("av01")) {
          if (!AV1_CODEC_STRING_REGEX.test(metadata.decoderConfig.codec)) {
            throw new TypeError(
              'Video chunk metadata decoder configuration codec string for AV1 must be a valid AV1 codec string as specified in Section "Codecs Parameter String" of https://aomediacodec.github.io/av1-isobmff/.',
            );
          }
        } else if (
          PRORES_FOURCCS.some((x) => metadata.decoderConfig.codec.startsWith(x))
        ) {
          if (!PRORES_FOURCCS.some((x) => metadata.decoderConfig.codec === x)) {
            throw new TypeError(
              "Video chunk metadata decoder configuration codec string for ProRes must be one of the valid ProRes" +
                " four-character codes: ".concat(
                  PRORES_FOURCCS.join(", "),
                  ".",
                ),
            );
          }
        }
        if (
          trackCodec !== null &&
          inferCodecFromCodecString(metadata.decoderConfig.codec) !== trackCodec
        ) {
          throw new TypeError(
            "Video chunk metadata decoder configuration codec string '".concat(
              metadata.decoderConfig.codec,
              "' does not fit to",
            ) + " the track codec '".concat(trackCodec, "'."),
          );
        }
      };
      const VALID_AUDIO_CODEC_STRING_PREFIXES =
        /* unused pure expression or super */
        null;
      const validateAudioChunkMetadata = (metadata, trackCodec) => {
        if (!metadata) {
          throw new TypeError("Audio chunk metadata must be provided.");
        }
        if (typeof metadata !== "object") {
          throw new TypeError("Audio chunk metadata must be an object.");
        }
        if (!metadata.decoderConfig) {
          throw new TypeError(
            "Audio chunk metadata must include a decoder configuration.",
          );
        }
        if (typeof metadata.decoderConfig !== "object") {
          throw new TypeError(
            "Audio chunk metadata decoder configuration must be an object.",
          );
        }
        if (typeof metadata.decoderConfig.codec !== "string") {
          throw new TypeError(
            "Audio chunk metadata decoder configuration must specify a codec string.",
          );
        }
        if (
          !VALID_AUDIO_CODEC_STRING_PREFIXES.some((prefix) =>
            metadata.decoderConfig.codec.startsWith(prefix),
          )
        ) {
          throw new TypeError(
            "Audio chunk metadata decoder configuration codec string must be a valid audio codec string as specified in the Mediabunny Codec Registry.",
          );
        }
        if (
          !Number.isInteger(metadata.decoderConfig.sampleRate) ||
          metadata.decoderConfig.sampleRate <= 0
        ) {
          throw new TypeError(
            "Audio chunk metadata decoder configuration must specify a valid sampleRate (positive integer).",
          );
        }
        if (
          !Number.isInteger(metadata.decoderConfig.numberOfChannels) ||
          metadata.decoderConfig.numberOfChannels <= 0
        ) {
          throw new TypeError(
            "Audio chunk metadata decoder configuration must specify a valid numberOfChannels (positive integer).",
          );
        }
        if (metadata.decoderConfig.description !== void 0) {
          if (!isAllowSharedBufferSource(metadata.decoderConfig.description)) {
            throw new TypeError(
              "Audio chunk metadata decoder configuration description, when defined, must be an ArrayBuffer or an ArrayBuffer view.",
            );
          }
        }
        if (
          metadata.decoderConfig.codec.startsWith("mp4a") &&
          metadata.decoderConfig.codec !== "mp4a.69" &&
          metadata.decoderConfig.codec !== "mp4a.6B" &&
          metadata.decoderConfig.codec !== "mp4a.6b"
        ) {
          const validStrings = [
            "mp4a.40.2",
            "mp4a.40.02",
            "mp4a.40.5",
            "mp4a.40.05",
            "mp4a.40.29",
            "mp4a.67",
          ];
          if (!validStrings.includes(metadata.decoderConfig.codec)) {
            throw new TypeError(
              "Audio chunk metadata decoder configuration codec string for AAC must be a valid AAC codec string as specified in https://www.w3.org/TR/webcodecs-aac-codec-registration/.",
            );
          }
        } else if (
          metadata.decoderConfig.codec.startsWith("mp3") ||
          metadata.decoderConfig.codec.startsWith("mp4a")
        ) {
          if (
            metadata.decoderConfig.codec !== "mp3" &&
            metadata.decoderConfig.codec !== "mp4a.69" &&
            metadata.decoderConfig.codec !== "mp4a.6B" &&
            metadata.decoderConfig.codec !== "mp4a.6b"
          ) {
            throw new TypeError(
              'Audio chunk metadata decoder configuration codec string for MP3 must be "mp3", "mp4a.69" or "mp4a.6B".',
            );
          }
        } else if (metadata.decoderConfig.codec.startsWith("opus")) {
          if (metadata.decoderConfig.codec !== "opus") {
            throw new TypeError(
              'Audio chunk metadata decoder configuration codec string for Opus must be "opus".',
            );
          }
          if (
            metadata.decoderConfig.description &&
            metadata.decoderConfig.description.byteLength < 18
          ) {
            throw new TypeError(
              "Audio chunk metadata decoder configuration description, when specified, is expected to be an Identification Header as specified in Section 5.1 of RFC 7845.",
            );
          }
        } else if (metadata.decoderConfig.codec.startsWith("vorbis")) {
          if (metadata.decoderConfig.codec !== "vorbis") {
            throw new TypeError(
              'Audio chunk metadata decoder configuration codec string for Vorbis must be "vorbis".',
            );
          }
          if (!metadata.decoderConfig.description) {
            throw new TypeError(
              "Audio chunk metadata decoder configuration for Vorbis must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-vorbis-codec-registration/.",
            );
          }
        } else if (metadata.decoderConfig.codec.startsWith("flac")) {
          if (metadata.decoderConfig.codec !== "flac") {
            throw new TypeError(
              'Audio chunk metadata decoder configuration codec string for FLAC must be "flac".',
            );
          }
          const minDescriptionSize = 4 + 4 + 34;
          if (
            !metadata.decoderConfig.description ||
            metadata.decoderConfig.description.byteLength < minDescriptionSize
          ) {
            throw new TypeError(
              "Audio chunk metadata decoder configuration for FLAC must include a description, which is expected to adhere to the format described in https://www.w3.org/TR/webcodecs-flac-codec-registration/.",
            );
          }
        } else if (
          metadata.decoderConfig.codec.startsWith("ac-3") ||
          metadata.decoderConfig.codec.startsWith("ac3")
        ) {
          if (metadata.decoderConfig.codec !== "ac-3") {
            throw new TypeError(
              'Audio chunk metadata decoder configuration codec string for AC-3 must be "ac-3".',
            );
          }
        } else if (
          metadata.decoderConfig.codec.startsWith("ec-3") ||
          metadata.decoderConfig.codec.startsWith("eac3")
        ) {
          if (metadata.decoderConfig.codec !== "ec-3") {
            throw new TypeError(
              'Audio chunk metadata decoder configuration codec string for EC-3 must be "ec-3".',
            );
          }
        } else if (metadata.decoderConfig.codec.startsWith("dts")) {
          if (!DTS_FOURCCS.includes(metadata.decoderConfig.codec)) {
            throw new TypeError(
              "Audio chunk metadata decoder configuration codec string for DTS must be one of the following" +
                " four-character codes: ".concat(DTS_FOURCCS.join(", "), "."),
            );
          }
        } else if (
          metadata.decoderConfig.codec.startsWith("pcm") ||
          metadata.decoderConfig.codec.startsWith("ulaw") ||
          metadata.decoderConfig.codec.startsWith("alaw")
        ) {
          if (!PCM_AUDIO_CODECS.includes(metadata.decoderConfig.codec)) {
            throw new TypeError(
              "Audio chunk metadata decoder configuration codec string for PCM must be one of the supported PCM" +
                " codecs (".concat(PCM_AUDIO_CODECS.join(", "), ")."),
            );
          }
        }
        if (
          trackCodec !== null &&
          inferCodecFromCodecString(metadata.decoderConfig.codec) !== trackCodec
        ) {
          throw new TypeError(
            "Audio chunk metadata decoder configuration codec string '".concat(
              metadata.decoderConfig.codec,
              "' does not fit to",
            ) + " the track codec '".concat(trackCodec, "'."),
          );
        }
      };
      const validateSubtitleMetadata = (metadata) => {
        if (!metadata) {
          throw new TypeError("Subtitle metadata must be provided.");
        }
        if (typeof metadata !== "object") {
          throw new TypeError("Subtitle metadata must be an object.");
        }
        if (!metadata.config) {
          throw new TypeError(
            "Subtitle metadata must include a config object.",
          );
        }
        if (typeof metadata.config !== "object") {
          throw new TypeError("Subtitle metadata config must be an object.");
        }
        if (typeof metadata.config.description !== "string") {
          throw new TypeError(
            "Subtitle metadata config description must be a string.",
          );
        }
      };
    },
    /***/
    471(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        wb: () =>
          /* binding */
          customVideoDecoders,
        /* harmony export */
        zx: () =>
          /* binding */
          customAudioDecoders,
        /* harmony export */
      });
      var canDecodeVideoMemo;
      var canDecodeAudioMemo;
      var canEncodeVideoMemo;
      var canEncodeAudioMemo;
      var Logging;
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class CustomVideoDecoder {
        /** Returns true if and only if the decoder can decode the given codec configuration. */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        static supports(codec, config) {
          return false;
        }
      }
      class CustomAudioDecoder {
        /** Returns true if and only if the decoder can decode the given codec configuration. */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        static supports(codec, config) {
          return false;
        }
      }
      class CustomVideoEncoder {
        /** Returns true if and only if the encoder can encode the given codec configuration. */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        static supports(codec, config) {
          return false;
        }
      }
      class CustomAudioEncoder {
        /** Returns true if and only if the encoder can encode the given codec configuration. */
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        static supports(codec, config) {
          return false;
        }
      }
      const customVideoDecoders = [];
      const customAudioDecoders = [];
      const customVideoEncoders =
        /* unused pure expression or super */
        null;
      const customAudioEncoders =
        /* unused pure expression or super */
        null;
      const registerDecoder = (decoder) => {
        if (decoder.prototype instanceof CustomVideoDecoder) {
          const casted = decoder;
          if (customVideoDecoders.includes(casted)) {
            Logging._warn("Video decoder already registered.");
            return;
          }
          customVideoDecoders.push(casted);
          canDecodeVideoMemo.clear();
        } else if (decoder.prototype instanceof CustomAudioDecoder) {
          const casted = decoder;
          if (customAudioDecoders.includes(casted)) {
            Logging._warn("Audio decoder already registered.");
            return;
          }
          customAudioDecoders.push(casted);
          canDecodeAudioMemo.clear();
        } else {
          throw new TypeError(
            "Decoder must be a CustomVideoDecoder or CustomAudioDecoder.",
          );
        }
      };
      const registerEncoder = (encoder) => {
        if (encoder.prototype instanceof CustomVideoEncoder) {
          const casted = encoder;
          if (customVideoEncoders.includes(casted)) {
            Logging._warn("Video encoder already registered.");
            return;
          }
          customVideoEncoders.push(casted);
          canEncodeVideoMemo.clear();
        } else if (encoder.prototype instanceof CustomAudioEncoder) {
          const casted = encoder;
          if (customAudioEncoders.includes(casted)) {
            Logging._warn("Audio encoder already registered.");
            return;
          }
          customAudioEncoders.push(casted);
          canEncodeAudioMemo.clear();
        } else {
          throw new TypeError(
            "Encoder must be a CustomVideoEncoder or CustomAudioEncoder.",
          );
        }
      };
    },
    /***/
    7400(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        IX: () =>
          /* binding */
          readId3V2Header,
        /* harmony export */
        aU: () =>
          /* binding */
          ID3_V1_TAG_SIZE,
        /* harmony export */
        cG: () =>
          /* binding */
          parseId3V2Tag,
        /* harmony export */
        p_: () =>
          /* binding */
          parseId3V1Tag,
        /* harmony export */
        sY: () =>
          /* binding */
          ID3_V2_HEADER_SIZE,
        /* harmony export */
      });
      var encodeSynchsafe;
      var toDataView;
      var keyValueIterator;
      var assertNever;
      var isIso88591Compatible;
      var textEncoder;
      var isRecordStringString;
      var _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(1604);
      var _logging_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
      var _misc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6760);
      var _reader_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      var Id3V2HeaderFlags;
      (function (Id3V2HeaderFlags2) {
        Id3V2HeaderFlags2[(Id3V2HeaderFlags2["Unsynchronisation"] = 128)] =
          "Unsynchronisation";
        Id3V2HeaderFlags2[(Id3V2HeaderFlags2["ExtendedHeader"] = 64)] =
          "ExtendedHeader";
        Id3V2HeaderFlags2[(Id3V2HeaderFlags2["ExperimentalIndicator"] = 32)] =
          "ExperimentalIndicator";
        Id3V2HeaderFlags2[(Id3V2HeaderFlags2["Footer"] = 16)] = "Footer";
      })(Id3V2HeaderFlags || (Id3V2HeaderFlags = {}));
      var Id3V2TextEncoding;
      (function (Id3V2TextEncoding2) {
        Id3V2TextEncoding2[(Id3V2TextEncoding2["ISO_8859_1"] = 0)] =
          "ISO_8859_1";
        Id3V2TextEncoding2[(Id3V2TextEncoding2["UTF_16_WITH_BOM"] = 1)] =
          "UTF_16_WITH_BOM";
        Id3V2TextEncoding2[(Id3V2TextEncoding2["UTF_16_BE_NO_BOM"] = 2)] =
          "UTF_16_BE_NO_BOM";
        Id3V2TextEncoding2[(Id3V2TextEncoding2["UTF_8"] = 3)] = "UTF_8";
      })(Id3V2TextEncoding || (Id3V2TextEncoding = {}));
      const ID3_V1_TAG_SIZE = 128;
      const ID3_V2_HEADER_SIZE = 10;
      const ID3_V1_GENRES = [
        "Blues",
        "Classic rock",
        "Country",
        "Dance",
        "Disco",
        "Funk",
        "Grunge",
        "Hip-hop",
        "Jazz",
        "Metal",
        "New age",
        "Oldies",
        "Other",
        "Pop",
        "Rhythm and blues",
        "Rap",
        "Reggae",
        "Rock",
        "Techno",
        "Industrial",
        "Alternative",
        "Ska",
        "Death metal",
        "Pranks",
        "Soundtrack",
        "Euro-techno",
        "Ambient",
        "Trip-hop",
        "Vocal",
        "Jazz & funk",
        "Fusion",
        "Trance",
        "Classical",
        "Instrumental",
        "Acid",
        "House",
        "Game",
        "Sound clip",
        "Gospel",
        "Noise",
        "Alternative rock",
        "Bass",
        "Soul",
        "Punk",
        "Space",
        "Meditative",
        "Instrumental pop",
        "Instrumental rock",
        "Ethnic",
        "Gothic",
        "Darkwave",
        "Techno-industrial",
        "Electronic",
        "Pop-folk",
        "Eurodance",
        "Dream",
        "Southern rock",
        "Comedy",
        "Cult",
        "Gangsta",
        "Top 40",
        "Christian rap",
        "Pop/funk",
        "Jungle music",
        "Native US",
        "Cabaret",
        "New wave",
        "Psychedelic",
        "Rave",
        "Showtunes",
        "Trailer",
        "Lo-fi",
        "Tribal",
        "Acid punk",
        "Acid jazz",
        "Polka",
        "Retro",
        "Musical",
        "Rock 'n' roll",
        "Hard rock",
        "Folk",
        "Folk rock",
        "National folk",
        "Swing",
        "Fast fusion",
        "Bebop",
        "Latin",
        "Revival",
        "Celtic",
        "Bluegrass",
        "Avantgarde",
        "Gothic rock",
        "Progressive rock",
        "Psychedelic rock",
        "Symphonic rock",
        "Slow rock",
        "Big band",
        "Chorus",
        "Easy listening",
        "Acoustic",
        "Humour",
        "Speech",
        "Chanson",
        "Opera",
        "Chamber music",
        "Sonata",
        "Symphony",
        "Booty bass",
        "Primus",
        "Porn groove",
        "Satire",
        "Slow jam",
        "Club",
        "Tango",
        "Samba",
        "Folklore",
        "Ballad",
        "Power ballad",
        "Rhythmic Soul",
        "Freestyle",
        "Duet",
        "Punk rock",
        "Drum solo",
        "A cappella",
        "Euro-house",
        "Dance hall",
        "Goa music",
        "Drum & bass",
        "Club-house",
        "Hardcore techno",
        "Terror",
        "Indie",
        "Britpop",
        "Negerpunk",
        "Polsk punk",
        "Beat",
        "Christian gangsta rap",
        "Heavy metal",
        "Black metal",
        "Crossover",
        "Contemporary Christian",
        "Christian rock",
        "Merengue",
        "Salsa",
        "Thrash metal",
        "Anime",
        "Jpop",
        "Synthpop",
        "Christmas",
        "Art rock",
        "Baroque",
        "Bhangra",
        "Big beat",
        "Breakbeat",
        "Chillout",
        "Downtempo",
        "Dub",
        "EBM",
        "Eclectic",
        "Electro",
        "Electroclash",
        "Emo",
        "Experimental",
        "Garage",
        "Global",
        "IDM",
        "Illbient",
        "Industro-Goth",
        "Jam Band",
        "Krautrock",
        "Leftfield",
        "Lounge",
        "Math rock",
        "New romantic",
        "Nu-breakz",
        "Post-punk",
        "Post-rock",
        "Psytrance",
        "Shoegaze",
        "Space rock",
        "Trop rock",
        "World music",
        "Neoclassical",
        "Audiobook",
        "Audio theatre",
        "Neue Deutsche Welle",
        "Podcast",
        "Indie rock",
        "G-Funk",
        "Dubstep",
        "Garage rock",
        "Psybient",
      ];
      const parseId3V1Tag = (slice, tags) => {
        const startPos = slice.filePos;
        tags.raw ??= {};
        tags.raw["TAG"] ??= (0, _reader_js__WEBPACK_IMPORTED_MODULE_3__.io)(
          slice,
          ID3_V1_TAG_SIZE - 3,
        );
        slice.filePos = startPos;
        const title = readId3V1String(slice, 30);
        if (title) tags.title ??= title;
        const artist = readId3V1String(slice, 30);
        if (artist) tags.artist ??= artist;
        const album = readId3V1String(slice, 30);
        if (album) tags.album ??= album;
        const yearText = readId3V1String(slice, 4);
        const year = Number.parseInt(yearText, 10);
        if (Number.isInteger(year) && year > 0) {
          tags.date ??= new Date(String(year));
        }
        const commentBytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_3__.io)(
          slice,
          30,
        );
        let comment;
        if (commentBytes[28] === 0 && commentBytes[29] !== 0) {
          const trackNum = commentBytes[29];
          if (trackNum > 0) {
            tags.trackNumber ??= trackNum;
          }
          slice.skip(-30);
          comment = readId3V1String(slice, 28);
          slice.skip(2);
        } else {
          slice.skip(-30);
          comment = readId3V1String(slice, 30);
        }
        if (comment) tags.comment ??= comment;
        const genreIndex = (0, _reader_js__WEBPACK_IMPORTED_MODULE_3__.eo)(
          slice,
        );
        if (genreIndex < ID3_V1_GENRES.length) {
          tags.genre ??= ID3_V1_GENRES[genreIndex];
        }
      };
      const readId3V1String = (slice, length) => {
        const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_3__.io)(
          slice,
          length,
        );
        const endIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Sf)(
          bytes.indexOf(0),
          bytes.length,
        );
        const relevantBytes = bytes.subarray(0, endIndex);
        let str = "";
        for (let i = 0; i < relevantBytes.length; i++) {
          str += String.fromCharCode(relevantBytes[i]);
        }
        return str.trimEnd();
      };
      const readId3V2Header = (slice) => {
        const startPos = slice.filePos;
        const tag = (0, _reader_js__WEBPACK_IMPORTED_MODULE_3__.IT)(slice, 3);
        const majorVersion = (0, _reader_js__WEBPACK_IMPORTED_MODULE_3__.eo)(
          slice,
        );
        const revision = (0, _reader_js__WEBPACK_IMPORTED_MODULE_3__.eo)(slice);
        const flags = (0, _reader_js__WEBPACK_IMPORTED_MODULE_3__.eo)(slice);
        const sizeRaw = (0, _reader_js__WEBPACK_IMPORTED_MODULE_3__.cN)(slice);
        if (
          tag !== "ID3" ||
          majorVersion === 255 ||
          revision === 255 ||
          (sizeRaw & 2155905152) !== 0
        ) {
          slice.filePos = startPos;
          return null;
        }
        let size = (0, _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_0__.Fm)(
          sizeRaw,
        );
        if (flags & Id3V2HeaderFlags.Footer) {
          size += ID3_V2_HEADER_SIZE;
        }
        return { majorVersion, revision, flags, size };
      };
      const parseId3V2Tag = (slice, header, tags) => {
        if (![2, 3, 4].includes(header.majorVersion)) {
          _logging_js__WEBPACK_IMPORTED_MODULE_1__.y._warn(
            "Unsupported ID3v2 major version: ".concat(header.majorVersion),
          );
          return;
        }
        const dataSize =
          header.flags & Id3V2HeaderFlags.Footer
            ? header.size - ID3_V2_HEADER_SIZE
            : header.size;
        const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_3__.io)(
          slice,
          dataSize,
        );
        const reader = new Id3V2Reader(header, bytes);
        if (
          header.flags & Id3V2HeaderFlags.Unsynchronisation &&
          header.majorVersion === 3
        ) {
          reader.ununsynchronizeAll();
        }
        if (header.flags & Id3V2HeaderFlags.ExtendedHeader) {
          const extendedHeaderSize = reader.readU32();
          if (header.majorVersion === 3) {
            reader.pos += extendedHeaderSize;
          } else {
            reader.pos += extendedHeaderSize - 4;
          }
        }
        while (reader.pos <= reader.bytes.length - reader.frameHeaderSize()) {
          const frame = reader.readId3V2Frame();
          if (!frame) {
            break;
          }
          const frameStartPos = reader.pos;
          const frameEndPos = reader.pos + frame.size;
          let frameEncrypted = false;
          let frameCompressed = false;
          let frameUnsynchronized = false;
          if (header.majorVersion === 3) {
            frameEncrypted = !!(frame.flags & (1 << 6));
            frameCompressed = !!(frame.flags & (1 << 7));
          } else if (header.majorVersion === 4) {
            frameEncrypted = !!(frame.flags & (1 << 2));
            frameCompressed = !!(frame.flags & (1 << 3));
            frameUnsynchronized =
              !!(frame.flags & (1 << 1)) ||
              !!(header.flags & Id3V2HeaderFlags.Unsynchronisation);
          }
          if (frameEncrypted) {
            _logging_js__WEBPACK_IMPORTED_MODULE_1__.y._warn(
              "Skipping encrypted ID3v2 frame ".concat(frame.id),
            );
            reader.pos = frameEndPos;
            continue;
          }
          if (frameCompressed) {
            _logging_js__WEBPACK_IMPORTED_MODULE_1__.y._warn(
              "Skipping compressed ID3v2 frame ".concat(frame.id),
            );
            reader.pos = frameEndPos;
            continue;
          }
          if (frameUnsynchronized) {
            reader.ununsynchronizeRegion(reader.pos, frameEndPos);
          }
          tags.raw ??= {};
          if (frame.id === "TXXX") {
            const txxx = (tags.raw["TXXX"] ??= {});
            const encoding = reader.readId3V2TextEncoding();
            const description = reader.readId3V2Text(encoding, frameEndPos);
            const value = reader.readId3V2Text(encoding, frameEndPos);
            txxx[description] ??= value;
          } else if (frame.id[0] === "T") {
            tags.raw[frame.id] ??= reader.readId3V2EncodingAndText(frameEndPos);
          } else {
            tags.raw[frame.id] ??= reader.readBytes(frame.size);
          }
          reader.pos = frameStartPos;
          switch (frame.id) {
            case "TIT2":
            case "TT2":
              {
                tags.title ??= reader.readId3V2EncodingAndText(frameEndPos);
              }
              break;
            case "TIT3":
            case "TT3":
              {
                tags.description ??=
                  reader.readId3V2EncodingAndText(frameEndPos);
              }
              break;
            case "TPE1":
            case "TP1":
              {
                tags.artist ??= reader.readId3V2EncodingAndText(frameEndPos);
              }
              break;
            case "TALB":
            case "TAL":
              {
                tags.album ??= reader.readId3V2EncodingAndText(frameEndPos);
              }
              break;
            case "TPE2":
            case "TP2":
              {
                tags.albumArtist ??=
                  reader.readId3V2EncodingAndText(frameEndPos);
              }
              break;
            case "TRCK":
            case "TRK":
              {
                const trackText = reader.readId3V2EncodingAndText(frameEndPos);
                const parts = trackText.split("/");
                const trackNum = Number.parseInt(parts[0], 10);
                const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
                if (Number.isInteger(trackNum) && trackNum > 0) {
                  tags.trackNumber ??= trackNum;
                }
                if (
                  tracksTotal &&
                  Number.isInteger(tracksTotal) &&
                  tracksTotal > 0
                ) {
                  tags.tracksTotal ??= tracksTotal;
                }
              }
              break;
            case "TPOS":
            case "TPA":
              {
                const discText = reader.readId3V2EncodingAndText(frameEndPos);
                const parts = discText.split("/");
                const discNum = Number.parseInt(parts[0], 10);
                const discsTotal = parts[1] && Number.parseInt(parts[1], 10);
                if (Number.isInteger(discNum) && discNum > 0) {
                  tags.discNumber ??= discNum;
                }
                if (
                  discsTotal &&
                  Number.isInteger(discsTotal) &&
                  discsTotal > 0
                ) {
                  tags.discsTotal ??= discsTotal;
                }
              }
              break;
            case "TCON":
            case "TCO":
              {
                const genreText = reader.readId3V2EncodingAndText(frameEndPos);
                let match = /^\((\d+)\)/.exec(genreText);
                if (match) {
                  const genreNumber = Number.parseInt(match[1]);
                  if (ID3_V1_GENRES[genreNumber] !== void 0) {
                    tags.genre ??= ID3_V1_GENRES[genreNumber];
                    break;
                  }
                }
                match = /^\d+$/.exec(genreText);
                if (match) {
                  const genreNumber = Number.parseInt(match[0]);
                  if (ID3_V1_GENRES[genreNumber] !== void 0) {
                    tags.genre ??= ID3_V1_GENRES[genreNumber];
                    break;
                  }
                }
                tags.genre ??= genreText;
              }
              break;
            case "TDRC":
            case "TDAT":
              {
                const dateText = reader.readId3V2EncodingAndText(frameEndPos);
                const date = new Date(dateText);
                if (!Number.isNaN(date.getTime())) {
                  tags.date ??= date;
                }
              }
              break;
            case "TYER":
            case "TYE":
              {
                const yearText = reader.readId3V2EncodingAndText(frameEndPos);
                const year = Number.parseInt(yearText, 10);
                if (Number.isInteger(year)) {
                  tags.date ??= new Date(String(year));
                }
              }
              break;
            case "USLT":
            case "ULT":
              {
                const encoding = reader.readU8();
                reader.pos += 3;
                reader.readId3V2Text(encoding, frameEndPos);
                tags.lyrics ??= reader.readId3V2Text(encoding, frameEndPos);
              }
              break;
            case "COMM":
            case "COM":
              {
                const encoding = reader.readU8();
                reader.pos += 3;
                reader.readId3V2Text(encoding, frameEndPos);
                tags.comment ??= reader.readId3V2Text(encoding, frameEndPos);
              }
              break;
            case "APIC":
            case "PIC":
              {
                const encoding = reader.readId3V2TextEncoding();
                let mimeType;
                if (header.majorVersion === 2) {
                  const imageFormat = reader.readAscii(3);
                  mimeType =
                    imageFormat === "PNG"
                      ? "image/png"
                      : imageFormat === "JPG"
                        ? "image/jpeg"
                        : "image/*";
                } else {
                  mimeType = reader.readId3V2Text(encoding, frameEndPos);
                }
                const pictureType = reader.readU8();
                const description = reader
                  .readId3V2Text(encoding, frameEndPos)
                  .trimEnd();
                const imageDataSize = frameEndPos - reader.pos;
                if (imageDataSize >= 0) {
                  const imageData = reader.readBytes(imageDataSize);
                  if (!tags.images) tags.images = [];
                  tags.images.push({
                    data: imageData,
                    mimeType,
                    kind:
                      pictureType === 3
                        ? "coverFront"
                        : pictureType === 4
                          ? "coverBack"
                          : "unknown",
                    description,
                  });
                }
              }
              break;
            default:
              {
                reader.pos += frame.size;
              }
              break;
          }
          reader.pos = frameEndPos;
        }
      };
      class Id3V2Reader {
        constructor(header, bytes) {
          this.header = header;
          this.bytes = bytes;
          this.pos = 0;
          this.view = new DataView(
            bytes.buffer,
            bytes.byteOffset,
            bytes.byteLength,
          );
        }
        frameHeaderSize() {
          return this.header.majorVersion === 2 ? 6 : 10;
        }
        ununsynchronizeAll() {
          const newBytes = [];
          for (let i = 0; i < this.bytes.length; i++) {
            const value1 = this.bytes[i];
            newBytes.push(value1);
            if (value1 === 255 && i !== this.bytes.length - 1) {
              const value2 = this.bytes[i];
              if (value2 === 0) {
                i++;
              }
            }
          }
          this.bytes = new Uint8Array(newBytes);
          this.view = new DataView(this.bytes.buffer);
        }
        ununsynchronizeRegion(start, end) {
          const newBytes = [];
          for (let i = start; i < end; i++) {
            const value1 = this.bytes[i];
            newBytes.push(value1);
            if (value1 === 255 && i !== end - 1) {
              const value2 = this.bytes[i + 1];
              if (value2 === 0) {
                i++;
              }
            }
          }
          const before = this.bytes.subarray(0, start);
          const after = this.bytes.subarray(end);
          this.bytes = new Uint8Array(
            before.length + newBytes.length + after.length,
          );
          this.bytes.set(before, 0);
          this.bytes.set(newBytes, before.length);
          this.bytes.set(after, before.length + newBytes.length);
          this.view = new DataView(this.bytes.buffer);
        }
        readBytes(length) {
          const slice = this.bytes.subarray(this.pos, this.pos + length);
          this.pos += length;
          return slice;
        }
        readU8() {
          const value = this.view.getUint8(this.pos);
          this.pos += 1;
          return value;
        }
        readU16() {
          const value = this.view.getUint16(this.pos, false);
          this.pos += 2;
          return value;
        }
        readU24() {
          const high = this.view.getUint16(this.pos, false);
          const low = this.view.getUint8(this.pos + 2);
          this.pos += 3;
          return high * 256 + low;
        }
        readU32() {
          const value = this.view.getUint32(this.pos, false);
          this.pos += 4;
          return value;
        }
        readAscii(length) {
          let str = "";
          for (let i = 0; i < length; i++) {
            str += String.fromCharCode(this.view.getUint8(this.pos + i));
          }
          this.pos += length;
          return str;
        }
        readId3V2Frame() {
          if (this.header.majorVersion === 2) {
            const id = this.readAscii(3);
            if (id === "\0\0\0") {
              return null;
            }
            const size = this.readU24();
            return { id, size, flags: 0 };
          } else {
            const id = this.readAscii(4);
            if (id === "\0\0\0\0") {
              return null;
            }
            const sizeRaw = this.readU32();
            let size =
              this.header.majorVersion === 4
                ? (0, _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_0__.Fm)(
                    sizeRaw,
                  )
                : sizeRaw;
            const flags = this.readU16();
            const headerEndPos = this.pos;
            const isSizeValid = (size2) => {
              const nextPos = this.pos + size2;
              if (nextPos > this.bytes.length) {
                return false;
              }
              if (nextPos <= this.bytes.length - this.frameHeaderSize()) {
                this.pos += size2;
                const nextId = this.readAscii(4);
                if (nextId !== "\0\0\0\0" && !/[0-9A-Z]{4}/.test(nextId)) {
                  return false;
                }
              }
              return true;
            };
            if (!isSizeValid(size)) {
              const otherSize =
                this.header.majorVersion === 4
                  ? sizeRaw
                  : (0, _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_0__.Fm)(
                      sizeRaw,
                    );
              if (isSizeValid(otherSize)) {
                size = otherSize;
              }
            }
            this.pos = headerEndPos;
            return { id, size, flags };
          }
        }
        readId3V2TextEncoding() {
          const number = this.readU8();
          if (number > 3) {
            throw new Error("Unsupported text encoding: ".concat(number));
          }
          return number;
        }
        readId3V2Text(encoding, until) {
          const startPos = this.pos;
          const data = this.readBytes(until - this.pos);
          switch (encoding) {
            case Id3V2TextEncoding.ISO_8859_1: {
              let str = "";
              for (let i = 0; i < data.length; i++) {
                const value = data[i];
                if (value === 0) {
                  this.pos = startPos + i + 1;
                  break;
                }
                str += String.fromCharCode(value);
              }
              return str;
            }
            case Id3V2TextEncoding.UTF_16_WITH_BOM: {
              if (data[0] === 255 && data[1] === 254) {
                const decoder = new TextDecoder("utf-16le");
                const endIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Sf)(
                  data.findIndex(
                    (x, i) => x === 0 && data[i + 1] === 0 && i % 2 === 0,
                  ),
                  data.length,
                );
                this.pos = startPos + Math.min(endIndex + 2, data.length);
                return decoder.decode(data.subarray(2, endIndex));
              } else if (data[0] === 254 && data[1] === 255) {
                const decoder = new TextDecoder("utf-16be");
                const endIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Sf)(
                  data.findIndex(
                    (x, i) => x === 0 && data[i + 1] === 0 && i % 2 === 0,
                  ),
                  data.length,
                );
                this.pos = startPos + Math.min(endIndex + 2, data.length);
                return decoder.decode(data.subarray(2, endIndex));
              } else {
                const endIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Sf)(
                  data.findIndex((x) => x === 0),
                  data.length,
                );
                this.pos = startPos + Math.min(endIndex + 1, data.length);
                return _misc_js__WEBPACK_IMPORTED_MODULE_2__.su.decode(
                  data.subarray(0, endIndex),
                );
              }
            }
            case Id3V2TextEncoding.UTF_16_BE_NO_BOM: {
              const decoder = new TextDecoder("utf-16be");
              const endIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Sf)(
                data.findIndex(
                  (x, i) => x === 0 && data[i + 1] === 0 && i % 2 === 0,
                ),
                data.length,
              );
              this.pos = startPos + Math.min(endIndex + 2, data.length);
              return decoder.decode(data.subarray(0, endIndex));
            }
            case Id3V2TextEncoding.UTF_8: {
              const endIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Sf)(
                data.findIndex((x) => x === 0),
                data.length,
              );
              this.pos = startPos + Math.min(endIndex + 1, data.length);
              return _misc_js__WEBPACK_IMPORTED_MODULE_2__.su.decode(
                data.subarray(0, endIndex),
              );
            }
          }
        }
        readId3V2EncodingAndText(until) {
          if (this.pos >= until) {
            return "";
          }
          const encoding = this.readId3V2TextEncoding();
          return this.readId3V2Text(encoding, until);
        }
      }
      class Id3V2Writer {
        constructor(writer) {
          this.helper = new Uint8Array(8);
          this.helperView = toDataView(this.helper);
          this.writer = writer;
        }
        writeId3V2Tag(metadata) {
          const tagStartPos = this.writer.getPos();
          this.writeAscii("ID3");
          this.writeU8(4);
          this.writeU8(0);
          this.writeU8(0);
          this.writeSynchsafeU32(0);
          const framesStartPos = this.writer.getPos();
          const writtenTags = /* @__PURE__ */ new Set();
          for (const { key, value } of keyValueIterator(metadata)) {
            switch (key) {
              case "title":
                {
                  this.writeId3V2TextFrame("TIT2", value);
                  writtenTags.add("TIT2");
                }
                break;
              case "description":
                {
                  this.writeId3V2TextFrame("TIT3", value);
                  writtenTags.add("TIT3");
                }
                break;
              case "artist":
                {
                  this.writeId3V2TextFrame("TPE1", value);
                  writtenTags.add("TPE1");
                }
                break;
              case "album":
                {
                  this.writeId3V2TextFrame("TALB", value);
                  writtenTags.add("TALB");
                }
                break;
              case "albumArtist":
                {
                  this.writeId3V2TextFrame("TPE2", value);
                  writtenTags.add("TPE2");
                }
                break;
              case "trackNumber":
                {
                  const string =
                    metadata.tracksTotal !== void 0
                      ? "".concat(value, "/").concat(metadata.tracksTotal)
                      : value.toString();
                  this.writeId3V2TextFrame("TRCK", string);
                  writtenTags.add("TRCK");
                }
                break;
              case "discNumber":
                {
                  const string =
                    metadata.discsTotal !== void 0
                      ? "".concat(value, "/").concat(metadata.discsTotal)
                      : value.toString();
                  this.writeId3V2TextFrame("TPOS", string);
                  writtenTags.add("TPOS");
                }
                break;
              case "genre":
                {
                  this.writeId3V2TextFrame("TCON", value);
                  writtenTags.add("TCON");
                }
                break;
              case "date":
                {
                  this.writeId3V2TextFrame(
                    "TDRC",
                    value.toISOString().slice(0, 10),
                  );
                  writtenTags.add("TDRC");
                }
                break;
              case "lyrics":
                {
                  this.writeId3V2LyricsFrame(value);
                  writtenTags.add("USLT");
                }
                break;
              case "comment":
                {
                  this.writeId3V2CommentFrame(value);
                  writtenTags.add("COMM");
                }
                break;
              case "images":
                {
                  const pictureTypeMap = {
                    coverFront: 3,
                    coverBack: 4,
                    unknown: 0,
                  };
                  for (const image of value) {
                    const pictureType = pictureTypeMap[image.kind] ?? 0;
                    const description = image.description ?? "";
                    this.writeId3V2ApicFrame(
                      image.mimeType,
                      pictureType,
                      description,
                      image.data,
                    );
                  }
                }
                break;
              case "tracksTotal":
              case "discsTotal":
                {
                }
                break;
              case "raw":
                {
                }
                break;
              default: {
                assertNever(key);
              }
            }
          }
          if (metadata.raw) {
            for (const key in metadata.raw) {
              const value = metadata.raw[key];
              if (value == null || key.length !== 4 || writtenTags.has(key)) {
                continue;
              }
              let bytes;
              if (typeof value === "string") {
                const useIso88591 = isIso88591Compatible(value);
                if (useIso88591) {
                  bytes = new Uint8Array(value.length + 2);
                  bytes[0] = Id3V2TextEncoding.ISO_8859_1;
                  for (let i = 0; i < value.length; i++) {
                    bytes[i + 1] = value.charCodeAt(i);
                  }
                } else {
                  const encoded = textEncoder.encode(value);
                  bytes = new Uint8Array(encoded.byteLength + 2);
                  bytes[0] = Id3V2TextEncoding.UTF_8;
                  bytes.set(encoded, 1);
                }
              } else if (value instanceof Uint8Array) {
                bytes = value;
              } else if (key === "TXXX" && isRecordStringString(value)) {
                for (const description in value) {
                  const frameValue = value[description];
                  const useIso88591 =
                    isIso88591Compatible(description) &&
                    isIso88591Compatible(frameValue);
                  const encodedDescription = useIso88591
                    ? null
                    : textEncoder.encode(description);
                  const encodedValue = useIso88591
                    ? null
                    : textEncoder.encode(frameValue);
                  const descriptionDataLength = useIso88591
                    ? description.length
                    : encodedDescription.byteLength;
                  const valueDataLength = useIso88591
                    ? frameValue.length
                    : encodedValue.byteLength;
                  const frameSize =
                    1 + descriptionDataLength + 1 + valueDataLength + 1;
                  this.writeAscii("TXXX");
                  this.writeSynchsafeU32(frameSize);
                  this.writeU16(0);
                  this.writeU8(
                    useIso88591
                      ? Id3V2TextEncoding.ISO_8859_1
                      : Id3V2TextEncoding.UTF_8,
                  );
                  if (useIso88591) {
                    this.writeIsoString(description);
                    this.writeIsoString(frameValue);
                  } else {
                    this.writer.write(encodedDescription);
                    this.writeU8(0);
                    this.writer.write(encodedValue);
                    this.writeU8(0);
                  }
                }
                continue;
              } else {
                continue;
              }
              this.writeAscii(key);
              this.writeSynchsafeU32(bytes.byteLength);
              this.writeU16(0);
              this.writer.write(bytes);
            }
          }
          const framesEndPos = this.writer.getPos();
          const framesSize = framesEndPos - framesStartPos;
          this.writer.seek(tagStartPos + 6);
          this.writeSynchsafeU32(framesSize);
          this.writer.seek(framesEndPos);
          return framesSize + 10;
        }
        writeU8(value) {
          this.helper[0] = value;
          this.writer.write(this.helper.subarray(0, 1));
        }
        writeU16(value) {
          this.helperView.setUint16(0, value, false);
          this.writer.write(this.helper.subarray(0, 2));
        }
        writeU32(value) {
          this.helperView.setUint32(0, value, false);
          this.writer.write(this.helper.subarray(0, 4));
        }
        writeAscii(text) {
          for (let i = 0; i < text.length; i++) {
            this.helper[i] = text.charCodeAt(i);
          }
          this.writer.write(this.helper.subarray(0, text.length));
        }
        writeSynchsafeU32(value) {
          this.writeU32(encodeSynchsafe(value));
        }
        writeIsoString(text) {
          const bytes = new Uint8Array(text.length + 1);
          for (let i = 0; i < text.length; i++) {
            bytes[i] = text.charCodeAt(i);
          }
          this.writer.write(bytes);
        }
        writeUtf8String(text) {
          const utf8Data = textEncoder.encode(text);
          this.writer.write(utf8Data);
          this.writeU8(0);
        }
        writeId3V2TextFrame(frameId, text) {
          const useIso88591 = isIso88591Compatible(text);
          const textDataLength = useIso88591
            ? text.length
            : textEncoder.encode(text).byteLength;
          const frameSize = 1 + textDataLength + 1;
          this.writeAscii(frameId);
          this.writeSynchsafeU32(frameSize);
          this.writeU16(0);
          this.writeU8(
            useIso88591
              ? Id3V2TextEncoding.ISO_8859_1
              : Id3V2TextEncoding.UTF_8,
          );
          if (useIso88591) {
            this.writeIsoString(text);
          } else {
            this.writeUtf8String(text);
          }
        }
        writeId3V2LyricsFrame(lyrics) {
          const useIso88591 = isIso88591Compatible(lyrics);
          const shortDescription = "";
          const frameSize =
            1 + 3 + shortDescription.length + 1 + lyrics.length + 1;
          this.writeAscii("USLT");
          this.writeSynchsafeU32(frameSize);
          this.writeU16(0);
          this.writeU8(
            useIso88591
              ? Id3V2TextEncoding.ISO_8859_1
              : Id3V2TextEncoding.UTF_8,
          );
          this.writeAscii("und");
          if (useIso88591) {
            this.writeIsoString(shortDescription);
            this.writeIsoString(lyrics);
          } else {
            this.writeUtf8String(shortDescription);
            this.writeUtf8String(lyrics);
          }
        }
        writeId3V2CommentFrame(comment) {
          const useIso88591 = isIso88591Compatible(comment);
          const textDataLength = useIso88591
            ? comment.length
            : textEncoder.encode(comment).byteLength;
          const shortDescription = "";
          const frameSize =
            1 + 3 + shortDescription.length + 1 + textDataLength + 1;
          this.writeAscii("COMM");
          this.writeSynchsafeU32(frameSize);
          this.writeU16(0);
          this.writeU8(
            useIso88591
              ? Id3V2TextEncoding.ISO_8859_1
              : Id3V2TextEncoding.UTF_8,
          );
          this.writeU8(117);
          this.writeU8(110);
          this.writeU8(100);
          if (useIso88591) {
            this.writeIsoString(shortDescription);
            this.writeIsoString(comment);
          } else {
            this.writeUtf8String(shortDescription);
            this.writeUtf8String(comment);
          }
        }
        writeId3V2ApicFrame(mimeType, pictureType, description, imageData) {
          const useIso88591 =
            isIso88591Compatible(mimeType) && isIso88591Compatible(description);
          const descriptionDataLength = useIso88591
            ? description.length
            : textEncoder.encode(description).byteLength;
          const frameSize =
            1 +
            mimeType.length +
            1 +
            1 +
            descriptionDataLength +
            1 +
            imageData.byteLength;
          this.writeAscii("APIC");
          this.writeSynchsafeU32(frameSize);
          this.writeU16(0);
          this.writeU8(
            useIso88591
              ? Id3V2TextEncoding.ISO_8859_1
              : Id3V2TextEncoding.UTF_8,
          );
          if (useIso88591) {
            this.writeIsoString(mimeType);
          } else {
            this.writeUtf8String(mimeType);
          }
          this.writeU8(pictureType);
          if (useIso88591) {
            this.writeIsoString(description);
          } else {
            this.writeUtf8String(description);
          }
          this.writer.write(imageData);
        }
      }
    },
    /***/
    4456(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        CW: () =>
          /* binding */
          InputFormat,
        /* harmony export */
        Gu: () =>
          /* binding */
          validateInputFormatOptions,
        /* harmony export */
        XE: () =>
          /* binding */
          ALL_FORMATS,
        /* harmony export */
        rp: () =>
          /* binding */
          HlsInputFormat,
        /* harmony export */
      });
      var _isobmff_isobmff_demuxer_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(9644);
      var _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__ =
        __webpack_require__(8059);
      var _matroska_matroska_demuxer_js__WEBPACK_IMPORTED_MODULE_2__ =
        __webpack_require__(1514);
      var _mp3_mp3_demuxer_js__WEBPACK_IMPORTED_MODULE_3__ =
        __webpack_require__(4264);
      var _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__ =
        __webpack_require__(1604);
      var _id3_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7400);
      var _mp3_mp3_reader_js__WEBPACK_IMPORTED_MODULE_6__ =
        __webpack_require__(8597);
      var _ogg_ogg_demuxer_js__WEBPACK_IMPORTED_MODULE_7__ =
        __webpack_require__(1580);
      var _wave_wave_demuxer_js__WEBPACK_IMPORTED_MODULE_8__ =
        __webpack_require__(7860);
      var _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_9__ =
        __webpack_require__(5627);
      var _adts_adts_demuxer_js__WEBPACK_IMPORTED_MODULE_10__ =
        __webpack_require__(5694);
      var _reader_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(5815);
      var _flac_flac_demuxer_js__WEBPACK_IMPORTED_MODULE_12__ =
        __webpack_require__(9926);
      var _mpeg_ts_mpeg_ts_demuxer_js__WEBPACK_IMPORTED_MODULE_13__ =
        __webpack_require__(8868);
      var _mpeg_ts_mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_14__ =
        __webpack_require__(6586);
      var _hls_hls_demuxer_js__WEBPACK_IMPORTED_MODULE_15__ =
        __webpack_require__(4437);
      var _hls_hls_misc_js__WEBPACK_IMPORTED_MODULE_16__ =
        __webpack_require__(1910);
      var _source_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(4117);
      var _misc_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(6760);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class InputFormat {
        constructor() {
          this._isIsobmff = false;
        }
      }
      class IsobmffInputFormat extends InputFormat {
        constructor() {
          super(...arguments);
          this._isIsobmff = true;
        }
        /** @internal */
        async _getMajorBrand(input) {
          let slice = input._reader.requestSlice(0, 12);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice))
            slice = await slice;
          if (!slice) return null;
          slice.skip(4);
          const fourCc = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.IT)(
            slice,
            4,
          );
          if (fourCc !== "ftyp" && fourCc !== "styp") {
            return null;
          }
          return (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.IT)(slice, 4);
        }
        /** @internal */
        _createDemuxer(input) {
          return new _isobmff_isobmff_demuxer_js__WEBPACK_IMPORTED_MODULE_0__.T(
            input,
          );
        }
      }
      class Mp4InputFormat extends IsobmffInputFormat {
        /** @internal */
        async _canReadInput(input) {
          const majorBrand = await this._getMajorBrand(input);
          if (majorBrand !== null) {
            return majorBrand !== "qt  ";
          }
          let pos = 0;
          for (let iter = 0; iter < 10; iter++) {
            let slice = input._reader.requestSlice(pos, 8);
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice))
              slice = await slice;
            if (!slice) return false;
            let size = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.cN)(slice);
            let headerSize = 8;
            if (size === 1) {
              let sizeExtensionSlice = input._reader.requestSlice(pos + 8, 8);
              if (
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(
                  sizeExtensionSlice,
                )
              )
                sizeExtensionSlice = await sizeExtensionSlice;
              if (!sizeExtensionSlice) return false;
              size = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.th)(
                sizeExtensionSlice,
              );
              headerSize = 16;
            }
            if (size < headerSize) {
              return false;
            }
            const fourCc = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.IT)(
              slice,
              4,
            );
            if (fourCc === "moof" || fourCc === "sidx") {
              return true;
            } else if (
              fourCc === "emsg" ||
              fourCc === "prft" ||
              fourCc === "free"
            ) {
              pos += size;
            } else {
              return false;
            }
          }
          return false;
        }
        get name() {
          return "MP4";
        }
        get mimeType() {
          return "video/mp4";
        }
      }
      class QuickTimeInputFormat extends IsobmffInputFormat {
        /** @internal */
        async _canReadInput(input) {
          const majorBrand = await this._getMajorBrand(input);
          return majorBrand === "qt  ";
        }
        get name() {
          return "QuickTime File Format";
        }
        get mimeType() {
          return "video/quicktime";
        }
      }
      class MatroskaInputFormat extends InputFormat {
        /** @internal */
        async isSupportedEBMLOfDocType(input, desiredDocType) {
          let headerSlice = input._reader.requestSlice(
            0,
            _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.r1,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(headerSlice))
            headerSlice = await headerSlice;
          if (!headerSlice) return false;
          const varIntSize = (0,
          _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.YO)(headerSlice);
          if (varIntSize === null) {
            return false;
          }
          if (varIntSize < 1 || varIntSize > 8) {
            return false;
          }
          const id = (0, _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.dl)(
            headerSlice,
            varIntSize,
          );
          if (id !== _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.Cl.EBML) {
            return false;
          }
          const dataSize = (0,
          _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.Kb)(headerSlice);
          if (typeof dataSize !== "number") {
            return false;
          }
          let dataSlice = input._reader.requestSlice(
            headerSlice.filePos,
            dataSize,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(dataSlice))
            dataSlice = await dataSlice;
          if (!dataSlice) return false;
          const startPos = headerSlice.filePos;
          while (
            dataSlice.filePos <=
            startPos +
              dataSize -
              _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.De
          ) {
            const header = (0,
            _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.ur)(dataSlice);
            if (!header) break;
            const { id: id2, size } = header;
            const dataStartPos = dataSlice.filePos;
            if (size === void 0) return false;
            switch (id2) {
              case _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.Cl
                .EBMLVersion:
                {
                  const ebmlVersion = (0,
                  _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.dl)(
                    dataSlice,
                    size,
                  );
                  if (ebmlVersion !== 1) {
                    return false;
                  }
                }
                break;
              case _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.Cl
                .EBMLReadVersion:
                {
                  const ebmlReadVersion = (0,
                  _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.dl)(
                    dataSlice,
                    size,
                  );
                  if (ebmlReadVersion !== 1) {
                    return false;
                  }
                }
                break;
              case _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.Cl.DocType:
                {
                  const docType = (0,
                  _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.IX)(
                    dataSlice,
                    size,
                  );
                  if (docType !== desiredDocType) {
                    return false;
                  }
                }
                break;
              case _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.Cl
                .DocTypeVersion:
                {
                  const docTypeVersion = (0,
                  _matroska_ebml_js__WEBPACK_IMPORTED_MODULE_1__.dl)(
                    dataSlice,
                    size,
                  );
                  if (docTypeVersion > 4) {
                    return false;
                  }
                }
                break;
            }
            dataSlice.filePos = dataStartPos + size;
          }
          return true;
        }
        /** @internal */
        _canReadInput(input) {
          return this.isSupportedEBMLOfDocType(input, "matroska");
        }
        /** @internal */
        _createDemuxer(input) {
          return new _matroska_matroska_demuxer_js__WEBPACK_IMPORTED_MODULE_2__.N(
            input,
          );
        }
        get name() {
          return "Matroska";
        }
        get mimeType() {
          return "video/x-matroska";
        }
      }
      class WebMInputFormat extends MatroskaInputFormat {
        /** @internal */
        _canReadInput(input) {
          return this.isSupportedEBMLOfDocType(input, "webm");
        }
        get name() {
          return "WebM";
        }
        get mimeType() {
          return "video/webm";
        }
      }
      class Mp3InputFormat extends InputFormat {
        /** @internal */
        async _canReadInput(input) {
          let currentPos = 0;
          while (true) {
            let slice2 = input._reader.requestSlice(
              currentPos,
              _id3_js__WEBPACK_IMPORTED_MODULE_5__.sY,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice2))
              slice2 = await slice2;
            if (!slice2) break;
            const id3V2Header = (0, _id3_js__WEBPACK_IMPORTED_MODULE_5__.IX)(
              slice2,
            );
            if (!id3V2Header) {
              break;
            }
            currentPos = slice2.filePos + id3V2Header.size;
          }
          const firstResult = await (0,
          _mp3_mp3_reader_js__WEBPACK_IMPORTED_MODULE_6__.W)(
            input._reader,
            currentPos,
            currentPos + 4096,
          );
          if (!firstResult) {
            return false;
          }
          const firstHeader = firstResult.header;
          const xingOffset = (0,
          _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.EZ)(
            firstHeader.mpegVersionId,
            firstHeader.channel,
          );
          let slice = input._reader.requestSlice(
            firstResult.startPos + xingOffset,
            4,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice))
            slice = await slice;
          if (!slice) return false;
          const word = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.cN)(slice);
          const isXing =
            word === _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.hY ||
            word === _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.rD;
          if (isXing) {
            return true;
          }
          currentPos = firstResult.startPos + firstResult.header.totalSize;
          const secondResult = await (0,
          _mp3_mp3_reader_js__WEBPACK_IMPORTED_MODULE_6__.W)(
            input._reader,
            currentPos,
            currentPos + _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.D_,
          );
          if (!secondResult) {
            return false;
          }
          const secondHeader = secondResult.header;
          if (
            firstHeader.channel !== secondHeader.channel ||
            firstHeader.sampleRate !== secondHeader.sampleRate
          ) {
            return false;
          }
          return true;
        }
        /** @internal */
        _createDemuxer(input) {
          return new _mp3_mp3_demuxer_js__WEBPACK_IMPORTED_MODULE_3__.l(input);
        }
        get name() {
          return "MP3";
        }
        get mimeType() {
          return "audio/mpeg";
        }
      }
      class WaveInputFormat extends InputFormat {
        /** @internal */
        async _canReadInput(input) {
          let slice = input._reader.requestSlice(0, 12);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice))
            slice = await slice;
          if (!slice) return false;
          const riffType = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.IT)(
            slice,
            4,
          );
          if (
            riffType !== "RIFF" &&
            riffType !== "RIFX" &&
            riffType !== "RF64"
          ) {
            return false;
          }
          slice.skip(4);
          const format = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.IT)(
            slice,
            4,
          );
          return format === "WAVE";
        }
        /** @internal */
        _createDemuxer(input) {
          return new _wave_wave_demuxer_js__WEBPACK_IMPORTED_MODULE_8__.E(
            input,
          );
        }
        get name() {
          return "WAVE";
        }
        get mimeType() {
          return "audio/wav";
        }
      }
      class OggInputFormat extends InputFormat {
        /** @internal */
        async _canReadInput(input) {
          let slice = input._reader.requestSlice(0, 4);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice))
            slice = await slice;
          if (!slice) return false;
          return (
            (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.IT)(slice, 4) ===
            "OggS"
          );
        }
        /** @internal */
        _createDemuxer(input) {
          return new _ogg_ogg_demuxer_js__WEBPACK_IMPORTED_MODULE_7__.S(input);
        }
        get name() {
          return "Ogg";
        }
        get mimeType() {
          return "application/ogg";
        }
      }
      class FlacInputFormat extends InputFormat {
        /** @internal */
        async _canReadInput(input) {
          let currentPos = 0;
          while (true) {
            let slice2 = input._reader.requestSlice(
              currentPos,
              _id3_js__WEBPACK_IMPORTED_MODULE_5__.sY,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice2))
              slice2 = await slice2;
            if (!slice2) break;
            const id3V2Header = (0, _id3_js__WEBPACK_IMPORTED_MODULE_5__.IX)(
              slice2,
            );
            if (!id3V2Header) {
              break;
            }
            currentPos = slice2.filePos + id3V2Header.size;
          }
          let slice = input._reader.requestSlice(currentPos, 4);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice))
            slice = await slice;
          if (!slice) return false;
          return (
            (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.IT)(slice, 4) ===
            "fLaC"
          );
        }
        get name() {
          return "FLAC";
        }
        get mimeType() {
          return "audio/flac";
        }
        /** @internal */
        _createDemuxer(input) {
          return new _flac_flac_demuxer_js__WEBPACK_IMPORTED_MODULE_12__.D(
            input,
          );
        }
      }
      class AdtsInputFormat extends InputFormat {
        /** @internal */
        async _canReadInput(input) {
          let currentPos = 0;
          while (true) {
            let slice2 = input._reader.requestSlice(
              currentPos,
              _id3_js__WEBPACK_IMPORTED_MODULE_5__.sY,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice2))
              slice2 = await slice2;
            if (!slice2) break;
            const id3V2Header = (0, _id3_js__WEBPACK_IMPORTED_MODULE_5__.IX)(
              slice2,
            );
            if (!id3V2Header) {
              break;
            }
            currentPos = slice2.filePos + id3V2Header.size;
          }
          let slice = input._reader.requestSliceRange(
            currentPos,
            _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_9__.gc,
            _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_9__.Y$,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice))
            slice = await slice;
          if (!slice) return false;
          const firstHeader = (0,
          _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_9__.lh)(slice);
          if (!firstHeader) {
            return false;
          }
          currentPos += firstHeader.frameLength;
          slice = input._reader.requestSliceRange(
            currentPos,
            _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_9__.gc,
            _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_9__.Y$,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice))
            slice = await slice;
          if (!slice) return false;
          const secondHeader = (0,
          _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_9__.lh)(slice);
          if (!secondHeader) {
            return false;
          }
          return (
            firstHeader.objectType === secondHeader.objectType &&
            firstHeader.samplingFrequencyIndex ===
              secondHeader.samplingFrequencyIndex &&
            firstHeader.channelConfiguration ===
              secondHeader.channelConfiguration
          );
        }
        /** @internal */
        _createDemuxer(input) {
          return new _adts_adts_demuxer_js__WEBPACK_IMPORTED_MODULE_10__.H(
            input,
          );
        }
        get name() {
          return "ADTS";
        }
        get mimeType() {
          return "audio/aac";
        }
      }
      class MpegTsInputFormat extends InputFormat {
        /** @internal */
        async _canReadInput(input) {
          const lengthToCheck =
            _mpeg_ts_mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_14__.ZT + 16 + 1;
          let slice = input._reader.requestSlice(0, lengthToCheck);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice))
            slice = await slice;
          if (!slice) return false;
          const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.io)(
            slice,
            lengthToCheck,
          );
          if (
            bytes[0] === 71 &&
            bytes[_mpeg_ts_mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_14__.ZT] ===
              71
          ) {
            return true;
          } else if (
            bytes[0] === 71 &&
            bytes[
              _mpeg_ts_mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_14__.ZT + 16
            ] === 71
          ) {
            return true;
          } else if (
            bytes[4] === 71 &&
            bytes[
              4 + _mpeg_ts_mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_14__.ZT + 4
            ] === 71
          ) {
            return true;
          }
          return false;
        }
        /** @internal */
        _createDemuxer(input) {
          return new _mpeg_ts_mpeg_ts_demuxer_js__WEBPACK_IMPORTED_MODULE_13__.f(
            input,
          );
        }
        get name() {
          return "MPEG Transport Stream";
        }
        get mimeType() {
          return "video/MP2T";
        }
      }
      class HlsInputFormat extends InputFormat {
        /** @internal */
        async _canReadInput(input) {
          let slice = input._reader.requestSlice(0, 7);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_18__.Qg)(slice))
            slice = await slice;
          if (!slice) return false;
          const isM3u8 =
            (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.IT)(slice, 7) ===
            "#EXTM3U";
          if (!isM3u8) {
            return false;
          }
          if (
            !(
              input._rootSource instanceof
              _source_js__WEBPACK_IMPORTED_MODULE_17__.QI
            )
          ) {
            throw new TypeError(
              "HLS inputs require `InputOptions.source` to be a PathedSource or a ref to one.",
            );
          }
          input._rootSource._usedForHls = true;
          return true;
        }
        /** @internal */
        _createDemuxer(input) {
          return new _hls_hls_demuxer_js__WEBPACK_IMPORTED_MODULE_15__.a(input);
        }
        get name() {
          return "HTTP Live Streaming (HLS)";
        }
        get mimeType() {
          return _hls_hls_misc_js__WEBPACK_IMPORTED_MODULE_16__.is;
        }
      }
      const MP4 = /* @__PURE__ */ new Mp4InputFormat();
      const QTFF = /* @__PURE__ */ new QuickTimeInputFormat();
      const MATROSKA = /* @__PURE__ */ new MatroskaInputFormat();
      const WEBM = /* @__PURE__ */ new WebMInputFormat();
      const MP3 = /* @__PURE__ */ new Mp3InputFormat();
      const WAVE = /* @__PURE__ */ new WaveInputFormat();
      const OGG = /* @__PURE__ */ new OggInputFormat();
      const ADTS = /* @__PURE__ */ new AdtsInputFormat();
      const FLAC = /* @__PURE__ */ new FlacInputFormat();
      const MPEG_TS = /* @__PURE__ */ new MpegTsInputFormat();
      const HLS = /* @__PURE__ */ new HlsInputFormat();
      const ALL_FORMATS = [
        HLS,
        MP4,
        QTFF,
        MATROSKA,
        WEBM,
        WAVE,
        OGG,
        FLAC,
        MP3,
        ADTS,
        MPEG_TS,
      ];
      const HLS_FORMATS = [HLS, MP4, QTFF, MP3, ADTS, MPEG_TS];
      const validateInputFormatOptions = (options, prefix) => {
        if (!options || typeof options !== "object") {
          throw new TypeError(
            "".concat(prefix, ", when provided, must be an object."),
          );
        }
        if (options.isobmff !== void 0) {
          if (!options.isobmff || typeof options.isobmff !== "object") {
            throw new TypeError(
              "".concat(prefix, ".isobmff, when provided, must be an object."),
            );
          }
          if (
            options.isobmff.resolveKeyId !== void 0 &&
            typeof options.isobmff.resolveKeyId !== "function"
          ) {
            throw new TypeError(
              "".concat(
                prefix,
                ".isobmff.resolveKeyId, when provided, must be a function.",
              ),
            );
          }
        }
        if (options.hls !== void 0) {
          if (!options.hls || typeof options.hls !== "object") {
            throw new TypeError(
              "".concat(prefix, ".hls, when provided, must be an object."),
            );
          }
          if (
            options.hls.offsetTimestampsByDateTime !== void 0 &&
            typeof options.hls.offsetTimestampsByDateTime !== "boolean"
          ) {
            throw new TypeError(
              "".concat(
                prefix,
                ".hls.offsetTimestampsByDateTime, when provided, must be a boolean.",
              ),
            );
          }
        }
      };
    },
    /***/
    8059(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        Cl: () =>
          /* binding */
          EBMLId,
        /* harmony export */
        De: () =>
          /* binding */
          MIN_HEADER_SIZE,
        /* harmony export */
        IQ: () =>
          /* binding */
          searchForNextElementId,
        /* harmony export */
        IX: () =>
          /* binding */
          readAsciiString,
        /* harmony export */
        K9: () =>
          /* binding */
          LEVEL_0_AND_1_EBML_IDS,
        /* harmony export */
        Kb: () =>
          /* binding */
          readElementSize,
        /* harmony export */
        Ry: () =>
          /* binding */
          readUnsignedBigInt,
        /* harmony export */
        SR: () =>
          /* binding */
          readElementId,
        /* harmony export */
        VE: () =>
          /* binding */
          LEVEL_1_EBML_IDS,
        /* harmony export */
        YO: () =>
          /* binding */
          readVarIntSize,
        /* harmony export */
        dl: () =>
          /* binding */
          readUnsignedInt,
        /* harmony export */
        jR: () =>
          /* binding */
          readUnicodeString,
        /* harmony export */
        nE: () =>
          /* binding */
          resync,
        /* harmony export */
        oo: () =>
          /* binding */
          CODEC_STRING_MAP,
        /* harmony export */
        p: () =>
          /* binding */
          assertDefinedSize,
        /* harmony export */
        pT: () =>
          /* binding */
          readVarInt,
        /* harmony export */
        r1: () =>
          /* binding */
          MAX_HEADER_SIZE,
        /* harmony export */
        ur: () =>
          /* binding */
          readElementHeader,
        /* harmony export */
        zH: () =>
          /* binding */
          readFloat,
        /* harmony export */
      });
      var textEncoder;
      var assertNever;
      var _misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6760);
      var _reader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class EBMLFloat32 {
        constructor(value) {
          this.value = value;
        }
      }
      class EBMLFloat64 {
        constructor(value) {
          this.value = value;
        }
      }
      class EBMLSignedInt {
        constructor(value) {
          this.value = value;
        }
      }
      class EBMLUnicodeString {
        constructor(value) {
          this.value = value;
        }
      }
      var EBMLId;
      (function (EBMLId2) {
        EBMLId2[(EBMLId2["EBML"] = 440786851)] = "EBML";
        EBMLId2[(EBMLId2["EBMLVersion"] = 17030)] = "EBMLVersion";
        EBMLId2[(EBMLId2["EBMLReadVersion"] = 17143)] = "EBMLReadVersion";
        EBMLId2[(EBMLId2["EBMLMaxIDLength"] = 17138)] = "EBMLMaxIDLength";
        EBMLId2[(EBMLId2["EBMLMaxSizeLength"] = 17139)] = "EBMLMaxSizeLength";
        EBMLId2[(EBMLId2["DocType"] = 17026)] = "DocType";
        EBMLId2[(EBMLId2["DocTypeVersion"] = 17031)] = "DocTypeVersion";
        EBMLId2[(EBMLId2["DocTypeReadVersion"] = 17029)] = "DocTypeReadVersion";
        EBMLId2[(EBMLId2["Void"] = 236)] = "Void";
        EBMLId2[(EBMLId2["Segment"] = 408125543)] = "Segment";
        EBMLId2[(EBMLId2["SeekHead"] = 290298740)] = "SeekHead";
        EBMLId2[(EBMLId2["Seek"] = 19899)] = "Seek";
        EBMLId2[(EBMLId2["SeekID"] = 21419)] = "SeekID";
        EBMLId2[(EBMLId2["SeekPosition"] = 21420)] = "SeekPosition";
        EBMLId2[(EBMLId2["Duration"] = 17545)] = "Duration";
        EBMLId2[(EBMLId2["Info"] = 357149030)] = "Info";
        EBMLId2[(EBMLId2["TimestampScale"] = 2807729)] = "TimestampScale";
        EBMLId2[(EBMLId2["MuxingApp"] = 19840)] = "MuxingApp";
        EBMLId2[(EBMLId2["WritingApp"] = 22337)] = "WritingApp";
        EBMLId2[(EBMLId2["Tracks"] = 374648427)] = "Tracks";
        EBMLId2[(EBMLId2["TrackEntry"] = 174)] = "TrackEntry";
        EBMLId2[(EBMLId2["TrackNumber"] = 215)] = "TrackNumber";
        EBMLId2[(EBMLId2["TrackUID"] = 29637)] = "TrackUID";
        EBMLId2[(EBMLId2["TrackType"] = 131)] = "TrackType";
        EBMLId2[(EBMLId2["FlagEnabled"] = 185)] = "FlagEnabled";
        EBMLId2[(EBMLId2["FlagDefault"] = 136)] = "FlagDefault";
        EBMLId2[(EBMLId2["FlagForced"] = 21930)] = "FlagForced";
        EBMLId2[(EBMLId2["FlagOriginal"] = 21934)] = "FlagOriginal";
        EBMLId2[(EBMLId2["FlagHearingImpaired"] = 21931)] =
          "FlagHearingImpaired";
        EBMLId2[(EBMLId2["FlagVisualImpaired"] = 21932)] = "FlagVisualImpaired";
        EBMLId2[(EBMLId2["FlagCommentary"] = 21935)] = "FlagCommentary";
        EBMLId2[(EBMLId2["FlagLacing"] = 156)] = "FlagLacing";
        EBMLId2[(EBMLId2["Name"] = 21358)] = "Name";
        EBMLId2[(EBMLId2["Language"] = 2274716)] = "Language";
        EBMLId2[(EBMLId2["LanguageBCP47"] = 2274717)] = "LanguageBCP47";
        EBMLId2[(EBMLId2["CodecID"] = 134)] = "CodecID";
        EBMLId2[(EBMLId2["CodecPrivate"] = 25506)] = "CodecPrivate";
        EBMLId2[(EBMLId2["CodecDelay"] = 22186)] = "CodecDelay";
        EBMLId2[(EBMLId2["SeekPreRoll"] = 22203)] = "SeekPreRoll";
        EBMLId2[(EBMLId2["DefaultDuration"] = 2352003)] = "DefaultDuration";
        EBMLId2[(EBMLId2["Video"] = 224)] = "Video";
        EBMLId2[(EBMLId2["PixelWidth"] = 176)] = "PixelWidth";
        EBMLId2[(EBMLId2["PixelHeight"] = 186)] = "PixelHeight";
        EBMLId2[(EBMLId2["DisplayWidth"] = 21680)] = "DisplayWidth";
        EBMLId2[(EBMLId2["DisplayHeight"] = 21690)] = "DisplayHeight";
        EBMLId2[(EBMLId2["DisplayUnit"] = 21682)] = "DisplayUnit";
        EBMLId2[(EBMLId2["AlphaMode"] = 21440)] = "AlphaMode";
        EBMLId2[(EBMLId2["Audio"] = 225)] = "Audio";
        EBMLId2[(EBMLId2["SamplingFrequency"] = 181)] = "SamplingFrequency";
        EBMLId2[(EBMLId2["Channels"] = 159)] = "Channels";
        EBMLId2[(EBMLId2["BitDepth"] = 25188)] = "BitDepth";
        EBMLId2[(EBMLId2["SimpleBlock"] = 163)] = "SimpleBlock";
        EBMLId2[(EBMLId2["BlockGroup"] = 160)] = "BlockGroup";
        EBMLId2[(EBMLId2["Block"] = 161)] = "Block";
        EBMLId2[(EBMLId2["BlockAdditions"] = 30113)] = "BlockAdditions";
        EBMLId2[(EBMLId2["BlockMore"] = 166)] = "BlockMore";
        EBMLId2[(EBMLId2["BlockAdditional"] = 165)] = "BlockAdditional";
        EBMLId2[(EBMLId2["BlockAddID"] = 238)] = "BlockAddID";
        EBMLId2[(EBMLId2["BlockDuration"] = 155)] = "BlockDuration";
        EBMLId2[(EBMLId2["ReferenceBlock"] = 251)] = "ReferenceBlock";
        EBMLId2[(EBMLId2["Cluster"] = 524531317)] = "Cluster";
        EBMLId2[(EBMLId2["Timestamp"] = 231)] = "Timestamp";
        EBMLId2[(EBMLId2["Cues"] = 475249515)] = "Cues";
        EBMLId2[(EBMLId2["CuePoint"] = 187)] = "CuePoint";
        EBMLId2[(EBMLId2["CueTime"] = 179)] = "CueTime";
        EBMLId2[(EBMLId2["CueTrackPositions"] = 183)] = "CueTrackPositions";
        EBMLId2[(EBMLId2["CueTrack"] = 247)] = "CueTrack";
        EBMLId2[(EBMLId2["CueClusterPosition"] = 241)] = "CueClusterPosition";
        EBMLId2[(EBMLId2["Colour"] = 21936)] = "Colour";
        EBMLId2[(EBMLId2["MatrixCoefficients"] = 21937)] = "MatrixCoefficients";
        EBMLId2[(EBMLId2["TransferCharacteristics"] = 21946)] =
          "TransferCharacteristics";
        EBMLId2[(EBMLId2["Primaries"] = 21947)] = "Primaries";
        EBMLId2[(EBMLId2["Range"] = 21945)] = "Range";
        EBMLId2[(EBMLId2["Projection"] = 30320)] = "Projection";
        EBMLId2[(EBMLId2["ProjectionType"] = 30321)] = "ProjectionType";
        EBMLId2[(EBMLId2["ProjectionPoseRoll"] = 30325)] = "ProjectionPoseRoll";
        EBMLId2[(EBMLId2["Attachments"] = 423732329)] = "Attachments";
        EBMLId2[(EBMLId2["AttachedFile"] = 24999)] = "AttachedFile";
        EBMLId2[(EBMLId2["FileDescription"] = 18046)] = "FileDescription";
        EBMLId2[(EBMLId2["FileName"] = 18030)] = "FileName";
        EBMLId2[(EBMLId2["FileMediaType"] = 18016)] = "FileMediaType";
        EBMLId2[(EBMLId2["FileData"] = 18012)] = "FileData";
        EBMLId2[(EBMLId2["FileUID"] = 18094)] = "FileUID";
        EBMLId2[(EBMLId2["Chapters"] = 272869232)] = "Chapters";
        EBMLId2[(EBMLId2["Tags"] = 307544935)] = "Tags";
        EBMLId2[(EBMLId2["Tag"] = 29555)] = "Tag";
        EBMLId2[(EBMLId2["Targets"] = 25536)] = "Targets";
        EBMLId2[(EBMLId2["TargetTypeValue"] = 26826)] = "TargetTypeValue";
        EBMLId2[(EBMLId2["TargetType"] = 25546)] = "TargetType";
        EBMLId2[(EBMLId2["TagTrackUID"] = 25541)] = "TagTrackUID";
        EBMLId2[(EBMLId2["TagEditionUID"] = 25545)] = "TagEditionUID";
        EBMLId2[(EBMLId2["TagChapterUID"] = 25540)] = "TagChapterUID";
        EBMLId2[(EBMLId2["TagAttachmentUID"] = 25542)] = "TagAttachmentUID";
        EBMLId2[(EBMLId2["SimpleTag"] = 26568)] = "SimpleTag";
        EBMLId2[(EBMLId2["TagName"] = 17827)] = "TagName";
        EBMLId2[(EBMLId2["TagLanguage"] = 17530)] = "TagLanguage";
        EBMLId2[(EBMLId2["TagString"] = 17543)] = "TagString";
        EBMLId2[(EBMLId2["TagBinary"] = 17541)] = "TagBinary";
        EBMLId2[(EBMLId2["ContentEncodings"] = 28032)] = "ContentEncodings";
        EBMLId2[(EBMLId2["ContentEncoding"] = 25152)] = "ContentEncoding";
        EBMLId2[(EBMLId2["ContentEncodingOrder"] = 20529)] =
          "ContentEncodingOrder";
        EBMLId2[(EBMLId2["ContentEncodingScope"] = 20530)] =
          "ContentEncodingScope";
        EBMLId2[(EBMLId2["ContentCompression"] = 20532)] = "ContentCompression";
        EBMLId2[(EBMLId2["ContentCompAlgo"] = 16980)] = "ContentCompAlgo";
        EBMLId2[(EBMLId2["ContentCompSettings"] = 16981)] =
          "ContentCompSettings";
        EBMLId2[(EBMLId2["ContentEncryption"] = 20533)] = "ContentEncryption";
      })(EBMLId || (EBMLId = {}));
      const LEVEL_0_EBML_IDS = [EBMLId.EBML, EBMLId.Segment];
      const LEVEL_1_EBML_IDS = [
        EBMLId.SeekHead,
        EBMLId.Info,
        EBMLId.Cluster,
        EBMLId.Tracks,
        EBMLId.Cues,
        EBMLId.Attachments,
        EBMLId.Chapters,
        EBMLId.Tags,
      ];
      const LEVEL_0_AND_1_EBML_IDS = [...LEVEL_0_EBML_IDS, ...LEVEL_1_EBML_IDS];
      const measureUnsignedInt = (value) => {
        if (value < 1 << 8) {
          return 1;
        } else if (value < 1 << 16) {
          return 2;
        } else if (value < 1 << 24) {
          return 3;
        } else if (value < 2 ** 32) {
          return 4;
        } else if (value < 2 ** 40) {
          return 5;
        } else {
          return 6;
        }
      };
      const measureUnsignedBigInt = (value) => {
        if (value < 1n << 8n) {
          return 1;
        } else if (value < 1n << 16n) {
          return 2;
        } else if (value < 1n << 24n) {
          return 3;
        } else if (value < 1n << 32n) {
          return 4;
        } else if (value < 1n << 40n) {
          return 5;
        } else if (value < 1n << 48n) {
          return 6;
        } else if (value < 1n << 56n) {
          return 7;
        } else {
          return 8;
        }
      };
      const measureSignedInt = (value) => {
        if (value >= -(1 << 6) && value < 1 << 6) {
          return 1;
        } else if (value >= -(1 << 13) && value < 1 << 13) {
          return 2;
        } else if (value >= -(1 << 20) && value < 1 << 20) {
          return 3;
        } else if (value >= -(1 << 27) && value < 1 << 27) {
          return 4;
        } else if (value >= -(2 ** 34) && value < 2 ** 34) {
          return 5;
        } else {
          return 6;
        }
      };
      const measureVarInt = (value) => {
        if (value < (1 << 7) - 1) {
          return 1;
        } else if (value < (1 << 14) - 1) {
          return 2;
        } else if (value < (1 << 21) - 1) {
          return 3;
        } else if (value < (1 << 28) - 1) {
          return 4;
        } else if (value < 2 ** 35 - 1) {
          return 5;
        } else if (value < 2 ** 42 - 1) {
          return 6;
        } else {
          throw new Error("EBML varint size not supported " + value);
        }
      };
      class EBMLWriter {
        constructor(writer) {
          this.writer = writer;
          this.helper = new Uint8Array(8);
          this.helperView = new DataView(this.helper.buffer);
          this.offsets = /* @__PURE__ */ new WeakMap();
          this.dataOffsets = /* @__PURE__ */ new WeakMap();
        }
        writeByte(value) {
          this.helperView.setUint8(0, value);
          this.writer.write(this.helper.subarray(0, 1));
        }
        writeFloat32(value) {
          this.helperView.setFloat32(0, value, false);
          this.writer.write(this.helper.subarray(0, 4));
        }
        writeFloat64(value) {
          this.helperView.setFloat64(0, value, false);
          this.writer.write(this.helper);
        }
        writeUnsignedInt(value, width = measureUnsignedInt(value)) {
          let pos = 0;
          switch (width) {
            case 6:
              this.helperView.setUint8(pos++, (value / 2 ** 40) | 0);
            // eslint-disable-next-line no-fallthrough
            case 5:
              this.helperView.setUint8(pos++, (value / 2 ** 32) | 0);
            // eslint-disable-next-line no-fallthrough
            case 4:
              this.helperView.setUint8(pos++, value >> 24);
            // eslint-disable-next-line no-fallthrough
            case 3:
              this.helperView.setUint8(pos++, value >> 16);
            // eslint-disable-next-line no-fallthrough
            case 2:
              this.helperView.setUint8(pos++, value >> 8);
            // eslint-disable-next-line no-fallthrough
            case 1:
              this.helperView.setUint8(pos++, value);
              break;
            default:
              throw new Error("Bad unsigned int size " + width);
          }
          this.writer.write(this.helper.subarray(0, pos));
        }
        writeUnsignedBigInt(value, width = measureUnsignedBigInt(value)) {
          let pos = 0;
          for (let i = width - 1; i >= 0; i--) {
            this.helperView.setUint8(
              pos++,
              Number((value >> BigInt(i * 8)) & 0xffn),
            );
          }
          this.writer.write(this.helper.subarray(0, pos));
        }
        writeSignedInt(value, width = measureSignedInt(value)) {
          if (value < 0) {
            value += 2 ** (width * 8);
          }
          this.writeUnsignedInt(value, width);
        }
        writeVarInt(value, width = measureVarInt(value)) {
          let pos = 0;
          switch (width) {
            case 1:
              this.helperView.setUint8(pos++, (1 << 7) | value);
              break;
            case 2:
              this.helperView.setUint8(pos++, (1 << 6) | (value >> 8));
              this.helperView.setUint8(pos++, value);
              break;
            case 3:
              this.helperView.setUint8(pos++, (1 << 5) | (value >> 16));
              this.helperView.setUint8(pos++, value >> 8);
              this.helperView.setUint8(pos++, value);
              break;
            case 4:
              this.helperView.setUint8(pos++, (1 << 4) | (value >> 24));
              this.helperView.setUint8(pos++, value >> 16);
              this.helperView.setUint8(pos++, value >> 8);
              this.helperView.setUint8(pos++, value);
              break;
            case 5:
              this.helperView.setUint8(
                pos++,
                (1 << 3) | ((value / 2 ** 32) & 7),
              );
              this.helperView.setUint8(pos++, value >> 24);
              this.helperView.setUint8(pos++, value >> 16);
              this.helperView.setUint8(pos++, value >> 8);
              this.helperView.setUint8(pos++, value);
              break;
            case 6:
              this.helperView.setUint8(
                pos++,
                (1 << 2) | ((value / 2 ** 40) & 3),
              );
              this.helperView.setUint8(pos++, (value / 2 ** 32) | 0);
              this.helperView.setUint8(pos++, value >> 24);
              this.helperView.setUint8(pos++, value >> 16);
              this.helperView.setUint8(pos++, value >> 8);
              this.helperView.setUint8(pos++, value);
              break;
            default:
              throw new Error("Bad EBML varint size " + width);
          }
          this.writer.write(this.helper.subarray(0, pos));
        }
        writeAsciiString(str) {
          this.writer.write(
            new Uint8Array(str.split("").map((x) => x.charCodeAt(0))),
          );
        }
        writeEBML(data) {
          if (data === null) return;
          if (data instanceof Uint8Array) {
            this.writer.write(data);
          } else if (Array.isArray(data)) {
            for (const elem of data) {
              this.writeEBML(elem);
            }
          } else {
            this.offsets.set(data, this.writer.getPos());
            this.writeUnsignedInt(data.id);
            if (Array.isArray(data.data)) {
              const sizePos = this.writer.getPos();
              const sizeSize = data.size === -1 ? 1 : (data.size ?? 4);
              if (data.size === -1) {
                this.writeByte(255);
              } else {
                this.writer.seek(this.writer.getPos() + sizeSize);
              }
              const startPos = this.writer.getPos();
              this.dataOffsets.set(data, startPos);
              this.writeEBML(data.data);
              if (data.size !== -1) {
                const size = this.writer.getPos() - startPos;
                const endPos = this.writer.getPos();
                this.writer.seek(sizePos);
                this.writeVarInt(size, sizeSize);
                this.writer.seek(endPos);
              }
            } else if (typeof data.data === "number") {
              const size = data.size ?? measureUnsignedInt(data.data);
              this.writeVarInt(size);
              this.writeUnsignedInt(data.data, size);
            } else if (typeof data.data === "bigint") {
              const size = data.size ?? measureUnsignedBigInt(data.data);
              this.writeVarInt(size);
              this.writeUnsignedBigInt(data.data, size);
            } else if (typeof data.data === "string") {
              this.writeVarInt(data.data.length);
              this.writeAsciiString(data.data);
            } else if (data.data instanceof Uint8Array) {
              this.writeVarInt(data.data.byteLength, data.size);
              this.writer.write(data.data);
            } else if (data.data instanceof EBMLFloat32) {
              this.writeVarInt(4);
              this.writeFloat32(data.data.value);
            } else if (data.data instanceof EBMLFloat64) {
              this.writeVarInt(8);
              this.writeFloat64(data.data.value);
            } else if (data.data instanceof EBMLSignedInt) {
              const size = data.size ?? measureSignedInt(data.data.value);
              this.writeVarInt(size);
              this.writeSignedInt(data.data.value, size);
            } else if (data.data instanceof EBMLUnicodeString) {
              const bytes = textEncoder.encode(data.data.value);
              this.writeVarInt(bytes.length);
              this.writer.write(bytes);
            } else {
              assertNever(data.data);
            }
          }
        }
      }
      const MAX_VAR_INT_SIZE = 8;
      const MIN_HEADER_SIZE = 2;
      const MAX_HEADER_SIZE = 2 * MAX_VAR_INT_SIZE;
      const readVarIntSize = (slice) => {
        if (slice.remainingLength < 1) {
          return null;
        }
        const firstByte = (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__.eo)(
          slice,
        );
        slice.skip(-1);
        if (firstByte === 0) {
          return null;
        }
        let width = 1;
        let mask = 128;
        while ((firstByte & mask) === 0) {
          width++;
          mask >>= 1;
        }
        if (slice.remainingLength < width) {
          return null;
        }
        return width;
      };
      const readVarInt = (slice) => {
        if (slice.remainingLength < 1) {
          return null;
        }
        const firstByte = (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__.eo)(
          slice,
        );
        if (firstByte === 0) {
          return null;
        }
        let width = 1;
        let mask = 1 << 7;
        while ((firstByte & mask) === 0) {
          width++;
          mask >>= 1;
        }
        if (slice.remainingLength < width - 1) {
          return null;
        }
        let value = firstByte & (mask - 1);
        for (let i = 1; i < width; i++) {
          value *= 1 << 8;
          value += (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__.eo)(slice);
        }
        return value;
      };
      const readUnsignedInt = (slice, width) => {
        if (width < 1 || width > 8) {
          throw new Error("Bad unsigned int size " + width);
        }
        let value = 0;
        for (let i = 0; i < width; i++) {
          value *= 1 << 8;
          value += (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__.eo)(slice);
        }
        return value;
      };
      const readUnsignedBigInt = (slice, width) => {
        if (width < 1) {
          throw new Error("Bad unsigned int size " + width);
        }
        let value = 0n;
        for (let i = 0; i < width; i++) {
          value <<= 8n;
          value += BigInt(
            (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__.eo)(slice),
          );
        }
        return value;
      };
      const readSignedInt = (slice, width) => {
        let value = readUnsignedInt(slice, width);
        if (value & (1 << (width * 8 - 1))) {
          value -= 2 ** (width * 8);
        }
        return value;
      };
      const readElementId = (slice) => {
        const size = readVarIntSize(slice);
        if (size === null) {
          return null;
        }
        if (slice.remainingLength < size) {
          return null;
        }
        const id = readUnsignedInt(slice, size);
        return id;
      };
      const readElementSize = (slice) => {
        if (slice.remainingLength < 1) {
          return null;
        }
        const firstByte = (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__.eo)(
          slice,
        );
        if (firstByte === 255) {
          return void 0;
        }
        slice.skip(-1);
        const size = readVarInt(slice);
        if (size === null) {
          return null;
        }
        if (size === 72057594037927940) {
          return void 0;
        }
        return size;
      };
      const readElementHeader = (slice) => {
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(
          slice.remainingLength >= MIN_HEADER_SIZE,
        );
        const id = readElementId(slice);
        if (id === null) {
          return null;
        }
        const size = readElementSize(slice);
        if (size === null) {
          return null;
        }
        return { id, size };
      };
      const readAsciiString = (slice, length) => {
        const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__.io)(
          slice,
          length,
        );
        let strLength = 0;
        while (strLength < length && bytes[strLength] !== 0) {
          strLength += 1;
        }
        return String.fromCharCode(...bytes.subarray(0, strLength));
      };
      const readUnicodeString = (slice, length) => {
        const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__.io)(
          slice,
          length,
        );
        let strLength = 0;
        while (strLength < length && bytes[strLength] !== 0) {
          strLength += 1;
        }
        return _misc_js__WEBPACK_IMPORTED_MODULE_0__.su.decode(
          bytes.subarray(0, strLength),
        );
      };
      const readFloat = (slice, width) => {
        if (width === 0) {
          return 0;
        }
        if (width !== 4 && width !== 8) {
          throw new Error("Bad float size " + width);
        }
        return width === 4
          ? (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__.Jk)(slice)
          : (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__._3)(slice);
      };
      const searchForNextElementId = async (reader, startPos, ids, until) => {
        const idsSet = new Set(ids);
        let currentPos = startPos;
        while (until === null || currentPos < until) {
          let slice = reader.requestSliceRange(
            currentPos,
            MIN_HEADER_SIZE,
            MAX_HEADER_SIZE,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(slice))
            slice = await slice;
          if (!slice) break;
          const elementHeader = readElementHeader(slice);
          if (!elementHeader) {
            break;
          }
          if (idsSet.has(elementHeader.id)) {
            return { pos: currentPos, found: true };
          }
          assertDefinedSize(elementHeader.size);
          currentPos = slice.filePos + elementHeader.size;
        }
        return {
          pos: until !== null && until > currentPos ? until : currentPos,
          found: false,
        };
      };
      const resync = async (reader, startPos, ids, until) => {
        const CHUNK_SIZE = 2 ** 16;
        const idsSet = new Set(ids);
        let currentPos = startPos;
        while (currentPos < until) {
          let slice = reader.requestSliceRange(
            currentPos,
            0,
            Math.min(CHUNK_SIZE, until - currentPos),
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(slice))
            slice = await slice;
          if (!slice) break;
          if (slice.length < MAX_VAR_INT_SIZE) break;
          for (let i = 0; i < slice.length - MAX_VAR_INT_SIZE; i++) {
            slice.filePos = currentPos;
            const elementId = readElementId(slice);
            if (elementId !== null && idsSet.has(elementId)) {
              return currentPos;
            }
            currentPos++;
          }
        }
        return null;
      };
      const CODEC_STRING_MAP = {
        avc: "V_MPEG4/ISO/AVC",
        hevc: "V_MPEGH/ISO/HEVC",
        vp8: "V_VP8",
        vp9: "V_VP9",
        av1: "V_AV1",
        prores: "V_PRORES",
        aac: "A_AAC",
        mp3: "A_MPEG/L3",
        opus: "A_OPUS",
        vorbis: "A_VORBIS",
        flac: "A_FLAC",
        ac3: "A_AC3",
        eac3: "A_EAC3",
        dts: "A_DTS",
        "pcm-u8": "A_PCM/INT/LIT",
        "pcm-s16": "A_PCM/INT/LIT",
        "pcm-s16be": "A_PCM/INT/BIG",
        "pcm-s24": "A_PCM/INT/LIT",
        "pcm-s24be": "A_PCM/INT/BIG",
        "pcm-s32": "A_PCM/INT/LIT",
        "pcm-s32be": "A_PCM/INT/BIG",
        "pcm-f32": "A_PCM/FLOAT/IEEE",
        "pcm-f64": "A_PCM/FLOAT/IEEE",
        webvtt: "S_TEXT/WEBVTT",
      };
      function assertDefinedSize(size) {
        if (size === void 0) {
          throw new Error(
            "Undefined element size is used in a place where it is not supported.",
          );
        }
      }
    },
    /***/
    6324(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        kQ: () =>
          /* binding */
          EncodedPacketSink,
        /* harmony export */
        qw: () =>
          /* binding */
          AudioSampleSink,
        /* harmony export */
      });
      var InputVideoTrack;
      var InputAudioTrack;
      var isFirefox;
      var assert;
      var mapAsyncGenerator;
      var validateCropRectangle;
      var clampCropRectangle;
      var _codec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8276);
      var _codec_data_js__WEBPACK_IMPORTED_MODULE_1__ =
        __webpack_require__(9705);
      var _custom_coder_js__WEBPACK_IMPORTED_MODULE_2__ =
        __webpack_require__(471);
      var _input_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6014);
      var _input_track_js__WEBPACK_IMPORTED_MODULE_4__ =
        __webpack_require__(3300);
      var _misc_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6760);
      var _packet_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6016);
      var _pcm_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5334);
      var _sample_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1398);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const validatePacketRetrievalOptions = (options) => {
        if (!options || typeof options !== "object") {
          throw new TypeError("options must be an object.");
        }
        if (
          options.metadataOnly !== void 0 &&
          typeof options.metadataOnly !== "boolean"
        ) {
          throw new TypeError(
            "options.metadataOnly, when defined, must be a boolean.",
          );
        }
        if (
          options.verifyKeyPackets !== void 0 &&
          typeof options.verifyKeyPackets !== "boolean"
        ) {
          throw new TypeError(
            "options.verifyKeyPackets, when defined, must be a boolean.",
          );
        }
        if (options.verifyKeyPackets && options.metadataOnly) {
          throw new TypeError(
            "options.verifyKeyPackets and options.metadataOnly cannot be enabled together.",
          );
        }
        if (
          options.skipLiveWait !== void 0 &&
          typeof options.skipLiveWait !== "boolean"
        ) {
          throw new TypeError(
            "options.skipLiveWait, when defined, must be a boolean.",
          );
        }
      };
      const validateTimestamp = (timestamp) => {
        if (!(0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Et)(timestamp)) {
          throw new TypeError("timestamp must be a number.");
        }
      };
      const maybeFixPacketType = (track, promise, options) => {
        if (options.verifyKeyPackets) {
          return promise.then(async (packet) => {
            if (!packet || packet.type === "delta") {
              return packet;
            }
            const determinedType = await track.determinePacketType(packet);
            if (determinedType) {
              packet.type = determinedType;
            }
            return packet;
          });
        } else {
          return promise;
        }
      };
      class EncodedPacketSink {
        /** Creates a new {@link EncodedPacketSink} for the given {@link InputTrack}. */
        constructor(track) {
          if (
            !(track instanceof _input_track_js__WEBPACK_IMPORTED_MODULE_4__.Kh)
          ) {
            throw new TypeError("track must be an InputTrack.");
          }
          this._track = track;
        }
        /**
         * Retrieves the track's first packet (in decode order), or null if it has no packets. The first packet is very
         * likely to be a key packet, but it doesn't have to be.
         */
        async getFirstPacket(options = {}) {
          validatePacketRetrievalOptions(options);
          if (this._track.input._disposed) {
            throw new _input_js__WEBPACK_IMPORTED_MODULE_3__.QO();
          }
          return maybeFixPacketType(
            this._track,
            this._track._backing.getFirstPacket(options),
            options,
          );
        }
        /** Retrieves the track's first key packet (in decode order), or null if it has no key packets. */
        async getFirstKeyPacket(options = {}) {
          validatePacketRetrievalOptions(options);
          const firstPacket = await this.getFirstPacket(options);
          if (!firstPacket) {
            return null;
          }
          if (firstPacket.type === "key") {
            return firstPacket;
          }
          return this.getNextKeyPacket(firstPacket, options);
        }
        /**
         * Retrieves the packet corresponding to the given timestamp, in seconds. More specifically, returns the last packet
         * (in presentation order) with a start timestamp less than or equal to the given timestamp. This method can be
         * used to retrieve a track's last packet using `getPacket(Infinity)`. The method returns null if the timestamp
         * is before the first packet in the track.
         *
         * @param timestamp - The timestamp used for retrieval, in seconds.
         */
        async getPacket(timestamp, options = {}) {
          validateTimestamp(timestamp);
          validatePacketRetrievalOptions(options);
          if (this._track.input._disposed) {
            throw new _input_js__WEBPACK_IMPORTED_MODULE_3__.QO();
          }
          return maybeFixPacketType(
            this._track,
            this._track._backing.getPacket(timestamp, options),
            options,
          );
        }
        /**
         * Retrieves the packet following the given packet (in decode order), or null if the given packet is the
         * last packet.
         */
        async getNextPacket(packet, options = {}) {
          if (!(packet instanceof _packet_js__WEBPACK_IMPORTED_MODULE_6__.Z)) {
            throw new TypeError("packet must be an EncodedPacket.");
          }
          validatePacketRetrievalOptions(options);
          if (this._track.input._disposed) {
            throw new _input_js__WEBPACK_IMPORTED_MODULE_3__.QO();
          }
          return maybeFixPacketType(
            this._track,
            this._track._backing.getNextPacket(packet, options),
            options,
          );
        }
        /**
         * Retrieves the key packet corresponding to the given timestamp, in seconds. More specifically, returns the last
         * key packet (in presentation order) with a start timestamp less than or equal to the given timestamp. A key packet
         * is a packet that doesn't require previous packets to be decoded. This method can be used to retrieve a track's
         * last key packet using `getKeyPacket(Infinity)`. The method returns null if the timestamp is before the first
         * key packet in the track.
         *
         * To ensure that the returned packet is guaranteed to be a real key frame, enable `options.verifyKeyPackets`.
         *
         * @param timestamp - The timestamp used for retrieval, in seconds.
         */
        async getKeyPacket(timestamp, options = {}) {
          validateTimestamp(timestamp);
          validatePacketRetrievalOptions(options);
          if (this._track.input._disposed) {
            throw new _input_js__WEBPACK_IMPORTED_MODULE_3__.QO();
          }
          if (!options.verifyKeyPackets) {
            return this._track._backing.getKeyPacket(timestamp, options);
          }
          const packet = await this._track._backing.getKeyPacket(
            timestamp,
            options,
          );
          if (!packet) {
            return packet;
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(packet.type === "key");
          const determinedType = await this._track.determinePacketType(packet);
          if (determinedType === "delta") {
            return this.getKeyPacket(
              packet.timestamp - 1 / (await this._track.getTimeResolution()),
              options,
            );
          }
          return packet;
        }
        /**
         * Retrieves the key packet following the given packet (in decode order), or null if the given packet is the last
         * key packet.
         *
         * To ensure that the returned packet is guaranteed to be a real key frame, enable `options.verifyKeyPackets`.
         */
        async getNextKeyPacket(packet, options = {}) {
          if (!(packet instanceof _packet_js__WEBPACK_IMPORTED_MODULE_6__.Z)) {
            throw new TypeError("packet must be an EncodedPacket.");
          }
          validatePacketRetrievalOptions(options);
          if (this._track.input._disposed) {
            throw new _input_js__WEBPACK_IMPORTED_MODULE_3__.QO();
          }
          if (!options.verifyKeyPackets) {
            return this._track._backing.getNextKeyPacket(packet, options);
          }
          const nextPacket = await this._track._backing.getNextKeyPacket(
            packet,
            options,
          );
          if (!nextPacket) {
            return nextPacket;
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
            nextPacket.type === "key",
          );
          const determinedType =
            await this._track.determinePacketType(nextPacket);
          if (determinedType === "delta") {
            return this.getNextKeyPacket(nextPacket, options);
          }
          return nextPacket;
        }
        /**
         * Creates an async iterator that yields the packets in this track in decode order. To enable fast iteration, this
         * method will intelligently preload packets based on the speed of the consumer.
         *
         * @param startPacket - (optional) The packet from which iteration should begin. This packet will also be yielded.
         * @param endPacket - (optional) The packet at which iteration should end. This packet will _not_ be yielded.
         */
        packets(startPacket, endPacket, options = {}) {
          if (
            startPacket !== void 0 &&
            !(startPacket instanceof _packet_js__WEBPACK_IMPORTED_MODULE_6__.Z)
          ) {
            throw new TypeError("startPacket must be an EncodedPacket.");
          }
          if (
            startPacket !== void 0 &&
            startPacket.isMetadataOnly &&
            !options?.metadataOnly
          ) {
            throw new TypeError(
              "startPacket can only be metadata-only if options.metadataOnly is enabled.",
            );
          }
          if (
            endPacket !== void 0 &&
            !(endPacket instanceof _packet_js__WEBPACK_IMPORTED_MODULE_6__.Z)
          ) {
            throw new TypeError("endPacket must be an EncodedPacket.");
          }
          validatePacketRetrievalOptions(options);
          if (this._track.input._disposed) {
            throw new _input_js__WEBPACK_IMPORTED_MODULE_3__.QO();
          }
          const packetQueue = [];
          let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)();
          let { promise: queueDequeue, resolve: onQueueDequeue } = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)();
          let ended = false;
          let terminated = false;
          let outOfBandError = null;
          let hasOutOfBandError = false;
          const timestamps = [];
          const maxQueueSize = () => Math.max(2, timestamps.length);
          (async () => {
            let packet = startPacket ?? (await this.getFirstPacket(options));
            while (packet && !terminated && !this._track.input._disposed) {
              if (
                endPacket &&
                packet.sequenceNumber >= endPacket?.sequenceNumber
              ) {
                break;
              }
              if (packetQueue.length > maxQueueSize()) {
                ({ promise: queueDequeue, resolve: onQueueDequeue } = (0,
                _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)());
                await queueDequeue;
                continue;
              }
              packetQueue.push(packet);
              onQueueNotEmpty();
              ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0,
              _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)());
              packet = await this.getNextPacket(packet, options);
            }
            ended = true;
            onQueueNotEmpty();
          })().catch((error) => {
            if (!hasOutOfBandError) {
              outOfBandError = error;
              hasOutOfBandError = true;
              onQueueNotEmpty();
            }
          });
          const track = this._track;
          return {
            async next() {
              while (true) {
                if (track.input._disposed) {
                  throw new _input_js__WEBPACK_IMPORTED_MODULE_3__.QO();
                } else if (terminated) {
                  return { value: void 0, done: true };
                } else if (hasOutOfBandError) {
                  throw outOfBandError;
                } else if (packetQueue.length > 0) {
                  const value = packetQueue.shift();
                  const now = performance.now();
                  timestamps.push(now);
                  while (timestamps.length > 0 && now - timestamps[0] >= 1e3) {
                    timestamps.shift();
                  }
                  onQueueDequeue();
                  return { value, done: false };
                } else if (ended) {
                  return { value: void 0, done: true };
                } else {
                  await queueNotEmpty;
                }
              }
            },
            async return() {
              terminated = true;
              onQueueDequeue();
              onQueueNotEmpty();
              return { value: void 0, done: true };
            },
            async throw(error) {
              throw error;
            },
            [Symbol.asyncIterator]() {
              return this;
            },
          };
        }
      }
      class DecoderWrapper {
        constructor(onSample, onError) {
          this.onSample = onSample;
          this.onError = onError;
        }
      }
      class BaseMediaSampleSink {
        /** @internal */
        mediaSamplesInRange(
          startTimestamp = -Infinity,
          endTimestamp = Infinity,
          options,
        ) {
          validateTimestamp(startTimestamp);
          validateTimestamp(endTimestamp);
          const sampleQueue = [];
          let firstSampleQueued = false;
          let lastSample = null;
          let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)();
          let { promise: queueDequeue, resolve: onQueueDequeue } = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)();
          let decoderIsFlushed = false;
          let ended = false;
          let terminated = false;
          let decoder = null;
          let outOfBandError = null;
          let hasOutOfBandError = false;
          const packetRetrievalOptions = {
            ...options,
            verifyKeyPackets: true,
            metadataOnly: false,
          };
          (async () => {
            decoder = await this._createDecoder(
              (sample) => {
                onQueueDequeue();
                if (sample.timestamp >= endTimestamp) {
                  ended = true;
                }
                if (ended) {
                  sample.close();
                  return;
                }
                if (lastSample) {
                  if (sample.timestamp > startTimestamp) {
                    sampleQueue.push(lastSample);
                    firstSampleQueued = true;
                  } else {
                    lastSample.close();
                  }
                }
                if (sample.timestamp >= startTimestamp) {
                  sampleQueue.push(sample);
                  firstSampleQueued = true;
                }
                lastSample = firstSampleQueued ? null : sample;
                if (sampleQueue.length > 0) {
                  onQueueNotEmpty();
                  ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0,
                  _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)());
                }
              },
              (error) => {
                if (!hasOutOfBandError) {
                  outOfBandError = error;
                  hasOutOfBandError = true;
                  onQueueNotEmpty();
                }
              },
            );
            const packetSink = this._createPacketSink();
            const keyPacket =
              (await packetSink.getKeyPacket(
                startTimestamp,
                packetRetrievalOptions,
              )) ??
              (await packetSink.getFirstKeyPacket(packetRetrievalOptions));
            let currentPacket = keyPacket;
            const endPacket = void 0;
            const packets = packetSink.packets(
              keyPacket ?? void 0,
              endPacket,
              packetRetrievalOptions,
            );
            await packets.next();
            while (currentPacket && !ended && !this._track.input._disposed) {
              const maxQueueSize = computeMaxQueueSize(sampleQueue.length);
              if (
                sampleQueue.length + decoder.getDecodeQueueSize() >
                maxQueueSize
              ) {
                ({ promise: queueDequeue, resolve: onQueueDequeue } = (0,
                _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)());
                await queueDequeue;
                continue;
              }
              decoder.decode(currentPacket);
              const packetResult = await packets.next();
              if (packetResult.done) {
                break;
              }
              currentPacket = packetResult.value;
            }
            await packets.return();
            if (!terminated && !this._track.input._disposed) {
              await decoder.flush();
            }
            if (!firstSampleQueued && lastSample) {
              sampleQueue.push(lastSample);
            }
            decoderIsFlushed = true;
            onQueueNotEmpty();
          })()
            .catch((error) => {
              if (!hasOutOfBandError) {
                outOfBandError = error;
                hasOutOfBandError = true;
                onQueueNotEmpty();
              }
            })
            .finally(() => {
              decoder?.close();
            });
          const track = this._track;
          const closeSamples = () => {
            lastSample?.close();
            for (const sample of sampleQueue) {
              sample.close();
            }
          };
          return {
            async next() {
              while (true) {
                if (track.input._disposed) {
                  closeSamples();
                  throw new _input_js__WEBPACK_IMPORTED_MODULE_3__.QO();
                } else if (terminated) {
                  return { value: void 0, done: true };
                } else if (hasOutOfBandError) {
                  closeSamples();
                  throw outOfBandError;
                } else if (sampleQueue.length > 0) {
                  const value = sampleQueue.shift();
                  onQueueDequeue();
                  return { value, done: false };
                } else if (!decoderIsFlushed) {
                  await queueNotEmpty;
                } else {
                  return { value: void 0, done: true };
                }
              }
            },
            async return() {
              terminated = true;
              ended = true;
              onQueueDequeue();
              onQueueNotEmpty();
              closeSamples();
              return { value: void 0, done: true };
            },
            async throw(error) {
              throw error;
            },
            [Symbol.asyncIterator]() {
              return this;
            },
          };
        }
        /** @internal */
        mediaSamplesAtTimestamps(timestamps, options) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.D5)(timestamps);
          const timestampIterator = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_5__.i1)(timestamps);
          const timestampsOfInterest = [];
          const sampleQueue = [];
          let { promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)();
          let { promise: queueDequeue, resolve: onQueueDequeue } = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)();
          let decoderIsFlushed = false;
          let terminated = false;
          let decoder = null;
          let outOfBandError = null;
          let hasOutOfBandError = false;
          const pushToQueue = (sample) => {
            sampleQueue.push(sample);
            onQueueNotEmpty();
            ({ promise: queueNotEmpty, resolve: onQueueNotEmpty } = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)());
          };
          const retrievalOptions = {
            ...options,
            verifyKeyPackets: true,
            metadataOnly: false,
          };
          (async () => {
            decoder = await this._createDecoder(
              (sample) => {
                onQueueDequeue();
                if (terminated) {
                  sample.close();
                  return;
                }
                let sampleUses = 0;
                while (
                  timestampsOfInterest.length > 0 &&
                  sample.timestamp - timestampsOfInterest[0] > -1e-10
                ) {
                  sampleUses++;
                  timestampsOfInterest.shift();
                }
                if (sampleUses > 0) {
                  for (let i = 0; i < sampleUses; i++) {
                    pushToQueue(i < sampleUses - 1 ? sample.clone() : sample);
                  }
                } else {
                  sample.close();
                }
              },
              (error) => {
                if (!hasOutOfBandError) {
                  outOfBandError = error;
                  hasOutOfBandError = true;
                  onQueueNotEmpty();
                }
              },
            );
            const packetSink = this._createPacketSink();
            let lastPacket = null;
            let lastKeyPacket = null;
            let maxSequenceNumber = -1;
            const decodePackets = async () => {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(lastKeyPacket);
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(decoder);
              let currentPacket = lastKeyPacket;
              decoder.decode(currentPacket);
              while (currentPacket.sequenceNumber < maxSequenceNumber) {
                const maxQueueSize = computeMaxQueueSize(sampleQueue.length);
                while (
                  sampleQueue.length + decoder.getDecodeQueueSize() >
                    maxQueueSize &&
                  !terminated
                ) {
                  ({ promise: queueDequeue, resolve: onQueueDequeue } = (0,
                  _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)());
                  await queueDequeue;
                }
                if (terminated) {
                  break;
                }
                const nextPacket = await packetSink.getNextPacket(
                  currentPacket,
                  retrievalOptions,
                );
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(nextPacket);
                decoder.decode(nextPacket);
                currentPacket = nextPacket;
              }
              maxSequenceNumber = -1;
            };
            const flushDecoder = async () => {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(decoder);
              await decoder.flush();
              for (let i = 0; i < timestampsOfInterest.length; i++) {
                pushToQueue(null);
              }
              timestampsOfInterest.length = 0;
            };
            for await (const timestamp of timestampIterator) {
              validateTimestamp(timestamp);
              if (terminated || this._track.input._disposed) {
                break;
              }
              const targetPacket = await packetSink.getPacket(
                timestamp,
                retrievalOptions,
              );
              const keyPacket =
                targetPacket &&
                (await packetSink.getKeyPacket(timestamp, retrievalOptions));
              if (!keyPacket) {
                if (maxSequenceNumber !== -1) {
                  await decodePackets();
                  await flushDecoder();
                }
                pushToQueue(null);
                lastPacket = null;
                continue;
              }
              if (
                lastPacket &&
                (keyPacket.sequenceNumber !== lastKeyPacket.sequenceNumber ||
                  targetPacket.timestamp < lastPacket.timestamp)
              ) {
                await decodePackets();
                await flushDecoder();
              }
              timestampsOfInterest.push(targetPacket.timestamp);
              maxSequenceNumber = Math.max(
                targetPacket.sequenceNumber,
                maxSequenceNumber,
              );
              lastPacket = targetPacket;
              lastKeyPacket = keyPacket;
            }
            if (!terminated && !this._track.input._disposed) {
              if (maxSequenceNumber !== -1) {
                await decodePackets();
              }
              await flushDecoder();
            }
            decoderIsFlushed = true;
            onQueueNotEmpty();
          })()
            .catch((error) => {
              if (!hasOutOfBandError) {
                outOfBandError = error;
                hasOutOfBandError = true;
                onQueueNotEmpty();
              }
            })
            .finally(() => {
              decoder?.close();
            });
          const track = this._track;
          const closeSamples = () => {
            for (const sample of sampleQueue) {
              sample?.close();
            }
          };
          return {
            async next() {
              while (true) {
                if (track.input._disposed) {
                  closeSamples();
                  throw new _input_js__WEBPACK_IMPORTED_MODULE_3__.QO();
                } else if (terminated) {
                  return { value: void 0, done: true };
                } else if (hasOutOfBandError) {
                  closeSamples();
                  throw outOfBandError;
                } else if (sampleQueue.length > 0) {
                  const value = sampleQueue.shift();
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
                    value !== void 0,
                  );
                  onQueueDequeue();
                  return { value, done: false };
                } else if (!decoderIsFlushed) {
                  await queueNotEmpty;
                } else {
                  return { value: void 0, done: true };
                }
              }
            },
            async return() {
              terminated = true;
              onQueueDequeue();
              onQueueNotEmpty();
              closeSamples();
              return { value: void 0, done: true };
            },
            async throw(error) {
              throw error;
            },
            [Symbol.asyncIterator]() {
              return this;
            },
          };
        }
      }
      const computeMaxQueueSize = (decodedSampleQueueSize) => {
        return decodedSampleQueueSize === 0 ? 40 : 8;
      };
      class VideoDecoderWrapper extends DecoderWrapper {
        constructor(
          onSample,
          onError,
          codec,
          decoderConfig,
          rotation,
          timeResolution,
        ) {
          super(onSample, onError);
          this.codec = codec;
          this.decoderConfig = decoderConfig;
          this.rotation = rotation;
          this.timeResolution = timeResolution;
          this.decoder = null;
          this.customDecoder = null;
          this.customDecoderCallSerializer =
            new _misc_js__WEBPACK_IMPORTED_MODULE_5__.dY();
          this.customDecoderQueueSize = 0;
          this.inputTimestamps = [];
          this.sampleQueue = [];
          this.currentPacketIndex = 0;
          this.raslSkipped = false;
          this.alphaDecoder = null;
          this.alphaHadKeyframe = false;
          this.colorQueue = [];
          this.alphaQueue = [];
          this.merger = null;
          this.decodedAlphaChunkCount = 0;
          this.alphaDecoderQueueSize = 0;
          this.nullAlphaFrameQueue = [];
          this.currentAlphaPacketIndex = 0;
          this.alphaRaslSkipped = false;
          this.finalSamples = [];
          this.mergeAlphaPromises = [];
          const MatchingCustomDecoder =
            _custom_coder_js__WEBPACK_IMPORTED_MODULE_2__.wb.find((x) =>
              x.supports(codec, decoderConfig),
            );
          if (MatchingCustomDecoder) {
            this.customDecoder = new MatchingCustomDecoder();
            this.customDecoder.codec = codec;
            this.customDecoder.config = decoderConfig;
            this.customDecoder.onSample = (sample) => {
              if (
                !(sample instanceof _sample_js__WEBPACK_IMPORTED_MODULE_8__.U2)
              ) {
                throw new TypeError(
                  "The argument passed to onSample must be a VideoSample.",
                );
              }
              this.finalizeAndEmitSample(sample);
            };
            this.customDecoder.onError = (error) => {
              onError(error);
            };
            void this.customDecoderCallSerializer
              .call(() => this.customDecoder.init())
              .catch((error) => onError(error));
          } else {
            const colorHandler = (frame) => {
              if (this.alphaQueue.length > 0) {
                const alphaFrame = this.alphaQueue.shift();
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
                  alphaFrame !== void 0,
                );
                void this.mergeAlpha(frame, alphaFrame);
              } else {
                this.colorQueue.push(frame);
              }
            };
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.F2)()) {
              if (codec === "avc" && this.decoderConfig.description) {
                const record = (0,
                _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.BP)(
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Fo)(
                    this.decoderConfig.description,
                  ),
                );
                if (record && record.sequenceParameterSets.length > 0) {
                  const sps = (0,
                  _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.eM)(
                    record.sequenceParameterSets[0],
                  );
                  if (sps && sps.frameMbsOnlyFlag === 0) {
                    this.decoderConfig = {
                      ...this.decoderConfig,
                      hardwareAcceleration: "prefer-software",
                    };
                  }
                }
              }
              if (
                !(0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.HV)(
                  this.decoderConfig.colorSpace,
                )
              ) {
                this.decoderConfig = {
                  ...this.decoderConfig,
                  colorSpace: {
                    primaries:
                      this.decoderConfig.colorSpace?.primaries ?? "bt709",
                    matrix: this.decoderConfig.colorSpace?.matrix ?? "bt709",
                    transfer:
                      this.decoderConfig.colorSpace?.transfer ?? "bt709",
                    fullRange:
                      this.decoderConfig.colorSpace?.fullRange ?? false,
                  },
                };
              }
            }
            const stack = new Error("Decoding error").stack;
            this.decoder = new VideoDecoder({
              output: (frame) => {
                try {
                  colorHandler(frame);
                } catch (error) {
                  this.onError(error);
                }
              },
              error: (error) => {
                error.stack = stack;
                this.onError(error);
              },
            });
            this.decoder.configure(this.decoderConfig);
          }
        }
        getDecodeQueueSize() {
          if (this.customDecoder) {
            return this.customDecoderQueueSize;
          } else {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(this.decoder);
            return Math.max(
              this.decoder.decodeQueueSize,
              this.alphaDecoder?.decodeQueueSize ?? 0,
            );
          }
        }
        decode(packet) {
          if (
            this.codec === "hevc" &&
            this.currentPacketIndex > 0 &&
            !this.raslSkipped
          ) {
            if (this.hasHevcRaslPicture(packet.data)) {
              return;
            }
            this.raslSkipped = true;
          }
          if (this.customDecoder) {
            this.customDecoderQueueSize++;
            void this.customDecoderCallSerializer
              .call(() => this.customDecoder.decode(packet))
              .catch((error) => this.onError(error))
              .finally(() => this.customDecoderQueueSize--);
          } else {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(this.decoder);
            if (!(0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Tc)()) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.h8)(
                this.inputTimestamps,
                packet.timestamp,
                (x) => x,
              );
            }
            if (
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.F2)() &&
              this.currentPacketIndex === 0
            ) {
              if (this.codec === "avc") {
                const filteredNalUnits = [];
                let hasFrameData = false;
                for (const loc of (0,
                _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.RO)(
                  packet.data,
                  this.decoderConfig,
                )) {
                  const type = (0,
                  _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.uN)(
                    packet.data[loc.offset],
                  );
                  hasFrameData ||= type >= 1 && type <= 5;
                  if (
                    type === _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.mY.AUD
                  ) {
                    if (hasFrameData) {
                      break;
                    } else {
                      filteredNalUnits.length = 0;
                    }
                  }
                  if (!(type >= 20 && type <= 31)) {
                    filteredNalUnits.push(
                      packet.data.subarray(loc.offset, loc.offset + loc.length),
                    );
                  }
                }
                const newData = (0,
                _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.Zi)(
                  filteredNalUnits,
                  this.decoderConfig,
                );
                packet = new _packet_js__WEBPACK_IMPORTED_MODULE_6__.Z(
                  newData,
                  packet.type,
                  packet.timestamp,
                  packet.duration,
                );
              } else if (this.codec === "hevc") {
                const sanitizedData = (0,
                _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.BE)(
                  packet.data,
                  this.decoderConfig,
                );
                if (sanitizedData) {
                  packet = new _packet_js__WEBPACK_IMPORTED_MODULE_6__.Z(
                    sanitizedData,
                    packet.type,
                    packet.timestamp,
                    packet.duration,
                  );
                }
              }
            }
            this.decoder.decode(packet.toEncodedVideoChunk());
            this.decodeAlphaData(packet);
          }
          this.currentPacketIndex++;
        }
        decodeAlphaData(packet) {
          if (!packet.sideData.alpha) {
            this.pushNullAlphaFrame();
            return;
          }
          if (!this.merger) {
            this.merger = new ColorAlphaMerger();
          }
          if (!this.alphaDecoder) {
            const alphaHandler = (frame) => {
              if (this.colorQueue.length > 0) {
                const colorFrame = this.colorQueue.shift();
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
                  colorFrame !== void 0,
                );
                void this.mergeAlpha(colorFrame, frame);
              } else {
                this.alphaQueue.push(frame);
              }
              this.decodedAlphaChunkCount++;
              while (
                this.nullAlphaFrameQueue.length > 0 &&
                this.nullAlphaFrameQueue[0] === this.decodedAlphaChunkCount
              ) {
                this.nullAlphaFrameQueue.shift();
                if (this.colorQueue.length > 0) {
                  const colorFrame = this.colorQueue.shift();
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
                    colorFrame !== void 0,
                  );
                  void this.mergeAlpha(colorFrame, null);
                } else {
                  this.alphaQueue.push(null);
                }
              }
              this.alphaDecoderQueueSize--;
            };
            const stack = new Error("Decoding error").stack;
            this.alphaDecoder = new VideoDecoder({
              output: (frame) => {
                try {
                  alphaHandler(frame);
                } catch (error) {
                  this.onError(error);
                }
              },
              error: (error) => {
                error.stack = stack;
                this.onError(error);
              },
            });
            this.alphaDecoder.configure(this.decoderConfig);
          }
          const type = (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.PR)(
            this.codec,
            this.decoderConfig,
            packet.sideData.alpha,
          );
          if (!this.alphaHadKeyframe) {
            this.alphaHadKeyframe = type === "key";
          }
          if (this.alphaHadKeyframe) {
            if (
              this.codec === "hevc" &&
              this.currentAlphaPacketIndex > 0 &&
              !this.alphaRaslSkipped
            ) {
              if (this.hasHevcRaslPicture(packet.sideData.alpha)) {
                this.pushNullAlphaFrame();
                return;
              }
              this.alphaRaslSkipped = true;
            }
            this.currentAlphaPacketIndex++;
            this.alphaDecoder.decode(
              packet.alphaToEncodedVideoChunk(type ?? packet.type),
            );
            this.alphaDecoderQueueSize++;
          } else {
            this.pushNullAlphaFrame();
          }
        }
        pushNullAlphaFrame() {
          if (this.alphaDecoderQueueSize === 0) {
            this.alphaQueue.push(null);
          } else {
            this.nullAlphaFrameQueue.push(
              this.decodedAlphaChunkCount + this.alphaDecoderQueueSize,
            );
          }
        }
        /**
         * If we're using HEVC, we need to make sure to skip any RASL slices that follow a non-IDR key frame such as
         * CRA_NUT. This is because RASL slices cannot be decoded without data before the CRA_NUT. Browsers behave
         * differently here: Chromium drops the packets, Safari throws a decoder error. Either way, it's not good
         * and causes bugs upstream. So, let's take the dropping into our own hands.
         */
        hasHevcRaslPicture(packetData) {
          for (const loc of (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.RF)(
            packetData,
            this.decoderConfig,
          )) {
            const type = (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.O9)(
              packetData[loc.offset],
            );
            if (
              type === _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.iJ.RASL_N ||
              type === _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.iJ.RASL_R
            ) {
              return true;
            }
          }
          return false;
        }
        /** Handler for the WebCodecs VideoDecoder for ironing out browser differences. */
        sampleHandler(sample) {
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Tc)()) {
            if (
              this.sampleQueue.length > 0 &&
              sample.timestamp >=
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__._g)(this.sampleQueue)
                  .timestamp
            ) {
              for (const sample2 of this.sampleQueue) {
                this.finalizeAndEmitSample(sample2);
              }
              this.sampleQueue.length = 0;
            }
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.h8)(
              this.sampleQueue,
              sample,
              (x) => x.timestamp,
            );
          } else {
            const timestamp = this.inputTimestamps.shift();
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(timestamp !== void 0);
            sample.setTimestamp(timestamp);
            this.finalizeAndEmitSample(sample);
          }
        }
        finalizeAndEmitSample(sample) {
          sample.setTimestamp(
            Math.round(sample.timestamp * this.timeResolution) /
              this.timeResolution,
          );
          sample.setDuration(
            Math.round(sample.duration * this.timeResolution) /
              this.timeResolution,
          );
          sample.setRotation(this.rotation);
          this.onSample(sample);
        }
        async mergeAlpha(color, alpha) {
          const resolver = (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)();
          this.mergeAlphaPromises.push(resolver.promise);
          const result = { sample: null };
          this.finalSamples.push(result);
          try {
            if (!alpha) {
              result.sample = new _sample_js__WEBPACK_IMPORTED_MODULE_8__.U2(
                color,
              );
            } else {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(this.merger);
              const finalFrame = await this.merger.merge(color, alpha);
              result.sample = new _sample_js__WEBPACK_IMPORTED_MODULE_8__.U2(
                finalFrame,
              );
            }
            while (
              this.finalSamples.length > 0 &&
              this.finalSamples[0].sample !== null
            ) {
              const next = this.finalSamples.shift();
              this.sampleHandler(next.sample);
            }
          } catch (error) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Ai)(
              this.finalSamples,
              result,
            );
            this.onError(error);
          } finally {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Ai)(
              this.mergeAlphaPromises,
              resolver.promise,
            );
            resolver.resolve();
          }
        }
        async flush() {
          if (this.customDecoder) {
            await this.customDecoderCallSerializer.call(() =>
              this.customDecoder.flush(),
            );
          } else {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(this.decoder);
            await Promise.all([
              this.decoder.flush(),
              this.alphaDecoder?.flush(),
            ]);
            await Promise.all(this.mergeAlphaPromises);
            this.colorQueue.forEach((x) => x.close());
            this.colorQueue.length = 0;
            this.alphaQueue.forEach((x) => x?.close());
            this.alphaQueue.length = 0;
            this.alphaHadKeyframe = false;
            this.decodedAlphaChunkCount = 0;
            this.alphaDecoderQueueSize = 0;
            this.nullAlphaFrameQueue.length = 0;
            this.currentAlphaPacketIndex = 0;
            this.alphaRaslSkipped = false;
          }
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Tc)()) {
            for (const sample of this.sampleQueue) {
              this.finalizeAndEmitSample(sample);
            }
            this.sampleQueue.length = 0;
          }
          this.currentPacketIndex = 0;
          this.raslSkipped = false;
        }
        close() {
          if (this.customDecoder) {
            void this.customDecoderCallSerializer.call(() =>
              this.customDecoder.close(),
            );
          } else {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(this.decoder);
            if (this.decoder.state !== "closed") {
              this.decoder.close();
            }
            if (this.alphaDecoder && this.alphaDecoder.state !== "closed") {
              this.alphaDecoder.close();
            }
            this.colorQueue.forEach((x) => x.close());
            this.colorQueue.length = 0;
            this.alphaQueue.forEach((x) => x?.close());
            this.alphaQueue.length = 0;
            this.merger?.close();
          }
          for (const sample of this.sampleQueue) {
            sample.close();
          }
          this.sampleQueue.length = 0;
        }
      }
      let mergerWorkerUrl = null;
      class ColorAlphaMerger {
        constructor() {
          this.workers = [];
          this.nextWorkerIndex = 0;
          this.pendingRequests = /* @__PURE__ */ new Map();
          this.nextRequestId = 0;
        }
        merge(color, alpha) {
          if (this.workers.length === 0) {
            if (!mergerWorkerUrl) {
              const blob = new Blob(
                ["(".concat(colorAlphaMergerWorkerCode.toString(), ")()")],
                { type: "application/javascript" },
              );
              mergerWorkerUrl = URL.createObjectURL(blob);
            }
            const poolSize = (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.qE)(
              navigator.hardwareConcurrency,
              1,
              4,
            );
            for (let i = 0; i < poolSize; i++) {
              const worker2 = new Worker(mergerWorkerUrl);
              worker2.addEventListener("message", (event) => {
                const data = event.data;
                const pending2 = this.pendingRequests.get(data.id);
                if (!pending2) {
                  return;
                }
                this.pendingRequests.delete(data.id);
                if ("error" in data) {
                  pending2.reject(new Error(data.error));
                } else {
                  pending2.resolve(data.frame);
                }
              });
              worker2.addEventListener("error", (event) => {
                const error = new Error(
                  event.message || "Color/alpha merge worker error.",
                );
                for (const pending2 of this.pendingRequests.values()) {
                  pending2.reject(error);
                }
                this.pendingRequests.clear();
              });
              this.workers.push(worker2);
            }
          }
          const id = this.nextRequestId++;
          const pending = (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.nJ)();
          this.pendingRequests.set(id, pending);
          const worker = this.workers[this.nextWorkerIndex];
          this.nextWorkerIndex =
            (this.nextWorkerIndex + 1) % this.workers.length;
          worker.postMessage(
            { id, color, alpha },
            { transfer: [color, alpha] },
          );
          return pending.promise;
        }
        close() {
          for (const worker of this.workers) {
            worker.terminate();
          }
          this.workers.length = 0;
          const error = new Error("Color/alpha merger closed.");
          for (const pending of this.pendingRequests.values()) {
            pending.reject(error);
          }
          this.pendingRequests.clear();
        }
      }
      const colorAlphaMergerWorkerCode = () => {
        let cpuAlphaBuffer = null;
        let cpuColorBuffer = null;
        let chain = Promise.resolve();
        self.addEventListener("message", (event) => {
          const { id, color, alpha } = event.data;
          chain = chain.then(async () => {
            try {
              const frame = await merge(color, alpha);
              self.postMessage({ id, frame }, { transfer: [frame] });
            } catch (error) {
              self.postMessage({ id, error: error.message });
            } finally {
              color.close();
              alpha.close();
            }
          });
        });
        const merge = async (color, alpha) => {
          const format = color.format;
          const alphaFormat = alpha.format;
          if (!format || !alphaFormat) {
            throw new Error(
              "CPU color/alpha merging requires a known VideoFrame format.",
            );
          }
          const colorIs10 = format.includes("P10");
          const colorIs12 = format.includes("P12");
          const alphaIs10 = alphaFormat.includes("P10");
          const alphaIs12 = alphaFormat.includes("P12");
          if (alphaIs10 !== colorIs10 || alphaIs12 !== colorIs12) {
            throw new Error(
              "CPU color/alpha merging requires the alpha frame to have the same bit depth as the color frame" +
                " (color: '"
                  .concat(format, "', alpha: '")
                  .concat(alphaFormat, "')."),
            );
          }
          if (
            format === "RGBX" ||
            format === "RGBA" ||
            format === "BGRX" ||
            format === "BGRA"
          ) {
            return await mergeInterleavedRgba(color, alpha, format);
          } else if (
            format === "I420" ||
            format === "I420P10" ||
            format === "I420P12" ||
            format === "I422" ||
            format === "I422P10" ||
            format === "I422P12" ||
            format === "I444" ||
            format === "I444P10" ||
            format === "I444P12"
          ) {
            return await mergePlanarYuv(color, alpha, format);
          } else if (format === "NV12") {
            return await mergeNv12(color, alpha);
          }
          throw new Error(
            "CPU color/alpha merging does not support format '".concat(
              format,
              "'.",
            ),
          );
        };
        const mergeInterleavedRgba = async (color, alpha, format) => {
          const width = color.visibleRect?.width ?? color.codedWidth;
          const height = color.visibleRect?.height ?? color.codedHeight;
          const pixelCount = width * height;
          const output = new Uint8Array(pixelCount * 4);
          await color.copyTo(output);
          const alphaY = await readAlpha(alpha, width, height, 1);
          for (let i = 0, j = 3; i < pixelCount; i++, j += 4) {
            output[j] = alphaY[i];
          }
          const outputFormat =
            format === "RGBX" || format === "RGBA" ? "RGBA" : "BGRA";
          const init = {
            format: outputFormat,
            codedWidth: width,
            codedHeight: height,
            timestamp: color.timestamp,
            duration: color.duration ?? void 0,
            transfer: [output.buffer],
          };
          return new VideoFrame(output, init);
        };
        const mergePlanarYuv = async (color, alpha, format) => {
          const width = color.visibleRect?.width ?? color.codedWidth;
          const height = color.visibleRect?.height ?? color.codedHeight;
          const is10 = format.includes("P10");
          const is12 = format.includes("P12");
          const bytesPerSample = is10 || is12 ? 2 : 1;
          let chromaW;
          let chromaH;
          if (format.startsWith("I420")) {
            chromaW = Math.ceil(width / 2);
            chromaH = Math.ceil(height / 2);
          } else if (format.startsWith("I422")) {
            chromaW = Math.ceil(width / 2);
            chromaH = height;
          } else {
            chromaW = width;
            chromaH = height;
          }
          const ySamples = width * height;
          const uvSamples = chromaW * chromaH;
          const yBytes = ySamples * bytesPerSample;
          const uvBytes = uvSamples * bytesPerSample;
          const aBytes = ySamples * bytesPerSample;
          const outputBytes = yBytes + 2 * uvBytes + aBytes;
          const output = new Uint8Array(outputBytes);
          await color.copyTo(output);
          const alphaY = await readAlpha(alpha, width, height, bytesPerSample);
          const aOffset = yBytes + 2 * uvBytes;
          output.set(alphaY, aOffset);
          const outputFormat = format.slice(0, 4) + "A" + format.slice(4);
          const init = {
            format: outputFormat,
            codedWidth: width,
            codedHeight: height,
            timestamp: color.timestamp,
            duration: color.duration ?? void 0,
            transfer: [output.buffer],
          };
          return new VideoFrame(output, init);
        };
        const mergeNv12 = async (color, alpha) => {
          const width = color.visibleRect?.width ?? color.codedWidth;
          const height = color.visibleRect?.height ?? color.codedHeight;
          const ySize = width * height;
          const chromaW = Math.ceil(width / 2);
          const chromaH = Math.ceil(height / 2);
          const uvSize = chromaW * chromaH;
          const sourceSize = color.allocationSize();
          if (!cpuColorBuffer || cpuColorBuffer.byteLength !== sourceSize) {
            cpuColorBuffer = new Uint8Array(sourceSize);
          }
          await color.copyTo(cpuColorBuffer);
          const output = new Uint8Array(ySize + 2 * uvSize + ySize);
          output.set(cpuColorBuffer.subarray(0, ySize), 0);
          const uOffset = ySize;
          const vOffset = ySize + uvSize;
          const uvStart = ySize;
          for (let i = 0; i < uvSize; i++) {
            output[uOffset + i] = cpuColorBuffer[uvStart + i * 2];
            output[vOffset + i] = cpuColorBuffer[uvStart + i * 2 + 1];
          }
          const alphaY = await readAlpha(alpha, width, height, 1);
          output.set(alphaY, ySize + 2 * uvSize);
          const init = {
            format: "I420A",
            codedWidth: width,
            codedHeight: height,
            timestamp: color.timestamp,
            duration: color.duration ?? void 0,
            transfer: [output.buffer],
          };
          return new VideoFrame(output, init);
        };
        const readAlpha = async (alpha, width, height, bytesPerSample) => {
          const size = alpha.allocationSize();
          if (!cpuAlphaBuffer || cpuAlphaBuffer.byteLength !== size) {
            cpuAlphaBuffer = new Uint8Array(size);
          }
          await alpha.copyTo(cpuAlphaBuffer);
          const format = alpha.format;
          if (
            format === "RGBA" ||
            format === "BGRA" ||
            format === "RGBX" ||
            format === "BGRX"
          ) {
            const rOffset = format === "RGBA" || format === "RGBX" ? 0 : 2;
            const pixelCount = width * height;
            for (let i = 0; i < pixelCount; i++) {
              cpuAlphaBuffer[i] = cpuAlphaBuffer[i * 4 + rOffset];
            }
            return cpuAlphaBuffer.subarray(0, pixelCount);
          } else {
            return cpuAlphaBuffer.subarray(0, width * height * bytesPerSample);
          }
        };
      };
      const validateVideoSinkDecoderOptions = (decoderOptions) => {
        if (!decoderOptions || typeof decoderOptions !== "object") {
          throw new TypeError("decoderOptions must be an object.");
        }
        if (
          decoderOptions.hardwareAcceleration !== void 0 &&
          !["no-preference", "prefer-hardware", "prefer-software"].includes(
            decoderOptions.hardwareAcceleration,
          )
        ) {
          throw new TypeError(
            "decoderOptions.hardwareAcceleration, when provided, must be 'no-preference', 'prefer-hardware' or 'prefer-software'.",
          );
        }
        if (
          decoderOptions.optimizeForLatency !== void 0 &&
          typeof decoderOptions.optimizeForLatency !== "boolean"
        ) {
          throw new TypeError(
            "decoderOptions.optimizeForLatency, when provided, must be a boolean.",
          );
        }
      };
      class VideoSampleSink extends BaseMediaSampleSink {
        /** Creates a new {@link VideoSampleSink} for the given {@link InputVideoTrack}. */
        constructor(videoTrack, decoderOptions = {}) {
          if (
            !(
              videoTrack instanceof
              _input_track_js__WEBPACK_IMPORTED_MODULE_4__.N0
            )
          ) {
            throw new TypeError("videoTrack must be an InputVideoTrack.");
          }
          validateVideoSinkDecoderOptions(decoderOptions);
          super();
          this._track = videoTrack;
          this._decoderOptions = decoderOptions;
        }
        /** @internal */
        async _createDecoder(onSample, onError) {
          if (!(await this._track.canDecode())) {
            if (typeof VideoDecoder === "undefined") {
              throw new Error(
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.tD)("VideoDecoder"),
              );
            }
            throw new Error(
              "This video track cannot be decoded in this environment. Make sure to check decodability before using a track.",
            );
          }
          const codec = await this._track.getCodec();
          const rotation = await this._track.getRotation();
          let decoderConfig = await this._track.getDecoderConfig();
          const timeResolution = await this._track.getTimeResolution();
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(codec && decoderConfig);
          decoderConfig = {
            ...decoderConfig,
            hardwareAcceleration: this._decoderOptions.hardwareAcceleration,
            optimizeForLatency: this._decoderOptions.optimizeForLatency,
          };
          return new VideoDecoderWrapper(
            onSample,
            onError,
            codec,
            decoderConfig,
            rotation,
            timeResolution,
          );
        }
        /** @internal */
        _createPacketSink() {
          return new EncodedPacketSink(this._track);
        }
        /**
         * Retrieves the video sample (frame) corresponding to the given timestamp, in seconds. More specifically, returns
         * the last video sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
         * Returns null if the timestamp is before the track's first timestamp.
         *
         * @param timestamp - The timestamp used for retrieval, in seconds.
         * @param options - Options used for the underlying packet retrieval.
         */
        async getSample(timestamp, options = {}) {
          validateTimestamp(timestamp);
          for await (const sample of this.mediaSamplesAtTimestamps(
            [timestamp],
            options,
          )) {
            return sample;
          }
          throw new Error("Internal error: Iterator returned nothing.");
        }
        /**
         * Creates an async iterator that yields the video samples (frames) of this track in presentation order. This method
         * will intelligently pre-decode a few frames ahead to enable fast iteration.
         *
         * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
         * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
         * @param options - Options used for the underlying packet retrieval.
         */
        samples(startTimestamp, endTimestamp, options = {}) {
          return this.mediaSamplesInRange(
            startTimestamp,
            endTimestamp,
            options,
          );
        }
        /**
         * Creates an async iterator that yields a video sample (frame) for each timestamp in the argument. This method
         * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
         * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
         * yield null if no frame is available for a given timestamp.
         *
         * This method is good for sparse access of media data. If you want primarily sequential media access, prefer
         * {@link VideoSampleSink.samples} instead.
         *
         * @param timestamps - An iterable or async iterable of timestamps in seconds.
         * @param options - Options used for the underlying packet retrieval.
         */
        samplesAtTimestamps(timestamps, options = {}) {
          return this.mediaSamplesAtTimestamps(timestamps, options);
        }
      }
      class CanvasSink {
        /** Creates a new {@link CanvasSink} for the given {@link InputVideoTrack}. */
        constructor(videoTrack, options = {}) {
          this._rotation = 0;
          this._initPromise = null;
          this._nextCanvasIndex = 0;
          if (!(videoTrack instanceof InputVideoTrack)) {
            throw new TypeError("videoTrack must be an InputVideoTrack.");
          }
          if (options && typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (options.alpha !== void 0 && typeof options.alpha !== "boolean") {
            throw new TypeError(
              "options.alpha, when provided, must be a boolean.",
            );
          }
          if (
            options.width !== void 0 &&
            (!Number.isInteger(options.width) || options.width <= 0)
          ) {
            throw new TypeError(
              "options.width, when defined, must be a positive integer.",
            );
          }
          if (
            options.height !== void 0 &&
            (!Number.isInteger(options.height) || options.height <= 0)
          ) {
            throw new TypeError(
              "options.height, when defined, must be a positive integer.",
            );
          }
          if (
            options.fit !== void 0 &&
            !["fill", "contain", "cover"].includes(options.fit)
          ) {
            throw new TypeError(
              'options.fit, when provided, must be one of "fill", "contain", or "cover".',
            );
          }
          if (
            options.width !== void 0 &&
            options.height !== void 0 &&
            options.fit === void 0
          ) {
            throw new TypeError(
              "When both options.width and options.height are provided, options.fit must also be provided.",
            );
          }
          if (
            options.rotation !== void 0 &&
            ![0, 90, 180, 270].includes(options.rotation)
          ) {
            throw new TypeError(
              "options.rotation, when provided, must be 0, 90, 180 or 270.",
            );
          }
          if (options.crop !== void 0) {
            validateCropRectangle(options.crop, "options.");
          }
          if (
            options.poolSize !== void 0 &&
            (typeof options.poolSize !== "number" ||
              !Number.isInteger(options.poolSize) ||
              options.poolSize < 0)
          ) {
            throw new TypeError("poolSize must be a non-negative integer.");
          }
          if (options.decoderOptions !== void 0) {
            validateVideoSinkDecoderOptions(options.decoderOptions);
          }
          this._videoTrack = videoTrack;
          this._alpha = options.alpha ?? false;
          this._options = options;
          this._fit = options.fit ?? "fill";
          this._videoSampleSink = new VideoSampleSink(
            videoTrack,
            options.decoderOptions,
          );
          this._canvasPool = Array.from(
            { length: options.poolSize ?? 0 },
            () => null,
          );
        }
        /** @internal */
        _ensureInit() {
          return (this._initPromise ??= (async () => {
            const options = this._options;
            const videoTrack = this._videoTrack;
            const rotation =
              options.rotation ?? (await videoTrack.getRotation());
            const squarePixelWidth = await videoTrack.getSquarePixelWidth();
            const squarePixelHeight = await videoTrack.getSquarePixelHeight();
            const [rotatedWidth, rotatedHeight] =
              rotation % 180 === 0
                ? [squarePixelWidth, squarePixelHeight]
                : [squarePixelHeight, squarePixelWidth];
            let crop = options.crop;
            if (crop) {
              crop = clampCropRectangle(crop, rotatedWidth, rotatedHeight);
            }
            let [width, height] = crop
              ? [crop.width, crop.height]
              : [rotatedWidth, rotatedHeight];
            const originalAspectRatio = width / height;
            if (options.width !== void 0 && options.height === void 0) {
              width = options.width;
              height = Math.round(width / originalAspectRatio);
            } else if (options.width === void 0 && options.height !== void 0) {
              height = options.height;
              width = Math.round(height * originalAspectRatio);
            } else if (options.width !== void 0 && options.height !== void 0) {
              width = options.width;
              height = options.height;
            }
            this._width = width;
            this._height = height;
            this._rotation = rotation;
            this._crop = crop;
          })());
        }
        /** @internal */
        _videoSampleToWrappedCanvas(sample) {
          const width = this._width;
          const height = this._height;
          let canvas = this._canvasPool[this._nextCanvasIndex];
          let canvasIsNew = false;
          if (!canvas) {
            if (typeof document !== "undefined") {
              canvas = document.createElement("canvas");
              canvas.width = width;
              canvas.height = height;
            } else {
              canvas = new OffscreenCanvas(width, height);
            }
            if (this._canvasPool.length > 0) {
              this._canvasPool[this._nextCanvasIndex] = canvas;
            }
            canvasIsNew = true;
          }
          if (this._canvasPool.length > 0) {
            this._nextCanvasIndex =
              (this._nextCanvasIndex + 1) % this._canvasPool.length;
          }
          const context = canvas.getContext("2d", {
            alpha: this._alpha || isFirefox(),
            // Firefox has VideoFrame glitches with opaque canvases
          });
          assert(context);
          sample._drawWithFitAndMipmapping(canvas, context, {
            fit: this._fit,
            rotation: this._rotation,
            crop: this._crop,
            targetIsFresh: canvasIsNew,
            fillBlack: !this._alpha && isFirefox(),
          });
          const result = {
            canvas,
            timestamp: sample.timestamp,
            duration: sample.duration,
          };
          sample.close();
          return result;
        }
        /**
         * Retrieves a canvas with the video frame corresponding to the given timestamp, in seconds. More specifically,
         * returns the last video frame (in presentation order) with a start timestamp less than or equal to the given
         * timestamp. Returns null if the timestamp is before the track's first timestamp.
         *
         * @param timestamp - The timestamp used for retrieval, in seconds.
         * @param options - Options used for the underlying packet retrieval.
         */
        async getCanvas(timestamp, options) {
          validateTimestamp(timestamp);
          await this._ensureInit();
          const sample = await this._videoSampleSink.getSample(
            timestamp,
            options,
          );
          return sample && this._videoSampleToWrappedCanvas(sample);
        }
        /**
         * Creates an async iterator that yields canvases with the video frames of this track in presentation order. This
         * method will intelligently pre-decode a few frames ahead to enable fast iteration.
         *
         * @param startTimestamp - The timestamp in seconds at which to start yielding canvases (inclusive).
         * @param endTimestamp - The timestamp in seconds at which to stop yielding canvases (exclusive).
         * @param options - Options used for the underlying packet retrieval.
         */
        async *canvases(startTimestamp, endTimestamp, options) {
          await this._ensureInit();
          yield* mapAsyncGenerator(
            this._videoSampleSink.samples(
              startTimestamp,
              endTimestamp,
              options,
            ),
            (sample) => this._videoSampleToWrappedCanvas(sample),
          );
        }
        /**
         * Creates an async iterator that yields a canvas for each timestamp in the argument. This method uses an optimized
         * decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most once, and is
         * therefore more efficient than manually getting the canvas for every timestamp. The iterator may yield null if
         * no frame is available for a given timestamp.
         *
         * This method is good for sparse access of media data. If you want primarily sequential media access, prefer
         * {@link CanvasSink.canvases} instead.
         *
         * @param timestamps - An iterable or async iterable of timestamps in seconds.
         * @param options - Options used for the underlying packet retrieval.
         */
        async *canvasesAtTimestamps(timestamps, options) {
          await this._ensureInit();
          yield* mapAsyncGenerator(
            this._videoSampleSink.samplesAtTimestamps(timestamps, options),
            (sample) => sample && this._videoSampleToWrappedCanvas(sample),
          );
        }
      }
      class AudioDecoderWrapper extends DecoderWrapper {
        constructor(onSample, onError, codec, decoderConfig) {
          super(onSample, onError);
          this.decoder = null;
          this.customDecoder = null;
          this.customDecoderCallSerializer =
            new _misc_js__WEBPACK_IMPORTED_MODULE_5__.dY();
          this.customDecoderQueueSize = 0;
          this.currentTimestamp = null;
          this.expectedFirstTimestamp = null;
          this.timestampOffset = 0;
          const sampleHandler = (sample) => {
            let sampleTimestamp = sample.timestamp;
            if (
              this.expectedFirstTimestamp !== null &&
              this.currentTimestamp === null
            ) {
              this.timestampOffset =
                this.expectedFirstTimestamp - sampleTimestamp;
            }
            sampleTimestamp += this.timestampOffset;
            if (
              this.currentTimestamp === null ||
              Math.abs(sampleTimestamp - this.currentTimestamp) >=
                sample.duration
            ) {
              this.currentTimestamp = sampleTimestamp;
            }
            const preciseTimestamp = this.currentTimestamp;
            this.currentTimestamp += sample.duration;
            if (sample.numberOfFrames === 0) {
              sample.close();
              return;
            }
            const sampleRate = decoderConfig.sampleRate;
            sample.setTimestamp(
              Math.round(preciseTimestamp * sampleRate) / sampleRate,
            );
            onSample(sample);
          };
          const MatchingCustomDecoder =
            _custom_coder_js__WEBPACK_IMPORTED_MODULE_2__.zx.find((x) =>
              x.supports(codec, decoderConfig),
            );
          if (MatchingCustomDecoder) {
            this.customDecoder = new MatchingCustomDecoder();
            this.customDecoder.codec = codec;
            this.customDecoder.config = decoderConfig;
            this.customDecoder.onSample = (sample) => {
              if (
                !(sample instanceof _sample_js__WEBPACK_IMPORTED_MODULE_8__.B1)
              ) {
                throw new TypeError(
                  "The argument passed to onSample must be an AudioSample.",
                );
              }
              sampleHandler(sample);
            };
            this.customDecoder.onError = (error) => {
              onError(error);
            };
            void this.customDecoderCallSerializer
              .call(() => this.customDecoder.init())
              .catch((error) => onError(error));
          } else {
            const stack = new Error("Decoding error").stack;
            this.decoder = new AudioDecoder({
              output: (data) => {
                try {
                  sampleHandler(
                    new _sample_js__WEBPACK_IMPORTED_MODULE_8__.B1(data),
                  );
                } catch (error) {
                  this.onError(error);
                }
              },
              error: (error) => {
                error.stack = stack;
                this.onError(error);
              },
            });
            this.decoder.configure(decoderConfig);
          }
        }
        getDecodeQueueSize() {
          if (this.customDecoder) {
            return this.customDecoderQueueSize;
          } else {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(this.decoder);
            return this.decoder.decodeQueueSize;
          }
        }
        decode(packet) {
          if (this.customDecoder) {
            this.customDecoderQueueSize++;
            void this.customDecoderCallSerializer
              .call(() => this.customDecoder.decode(packet))
              .catch((error) => this.onError(error))
              .finally(() => this.customDecoderQueueSize--);
          } else {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(this.decoder);
            this.expectedFirstTimestamp ??= packet.timestamp;
            this.decoder.decode(packet.toEncodedAudioChunk());
          }
        }
        async flush() {
          if (this.customDecoder) {
            await this.customDecoderCallSerializer.call(() =>
              this.customDecoder.flush(),
            );
          } else {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(this.decoder);
            await this.decoder.flush();
          }
          this.currentTimestamp = null;
          this.expectedFirstTimestamp = null;
          this.timestampOffset = 0;
        }
        close() {
          if (this.customDecoder) {
            void this.customDecoderCallSerializer.call(() =>
              this.customDecoder.close(),
            );
          } else {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(this.decoder);
            if (this.decoder.state !== "closed") {
              this.decoder.close();
            }
          }
        }
      }
      class PcmAudioDecoderWrapper extends DecoderWrapper {
        constructor(onSample, onError, decoderConfig) {
          super(onSample, onError);
          this.decoderConfig = decoderConfig;
          this.currentTimestamp = null;
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
            _codec_js__WEBPACK_IMPORTED_MODULE_0__.Wq.includes(
              decoderConfig.codec,
            ),
          );
          this.codec = decoderConfig.codec;
          const { dataType, sampleSize, littleEndian } = (0,
          _codec_js__WEBPACK_IMPORTED_MODULE_0__.Ei)(this.codec);
          this.inputSampleSize = sampleSize;
          switch (sampleSize) {
            case 1:
              {
                if (dataType === "unsigned") {
                  this.readInputValue = (view, byteOffset) =>
                    view.getUint8(byteOffset) - 2 ** 7;
                } else if (dataType === "signed") {
                  this.readInputValue = (view, byteOffset) =>
                    view.getInt8(byteOffset);
                } else if (dataType === "ulaw") {
                  this.readInputValue = (view, byteOffset) =>
                    (0, _pcm_js__WEBPACK_IMPORTED_MODULE_7__.qS)(
                      view.getUint8(byteOffset),
                    );
                } else if (dataType === "alaw") {
                  this.readInputValue = (view, byteOffset) =>
                    (0, _pcm_js__WEBPACK_IMPORTED_MODULE_7__.aw)(
                      view.getUint8(byteOffset),
                    );
                } else {
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(false);
                }
              }
              break;
            case 2:
              {
                if (dataType === "unsigned") {
                  this.readInputValue = (view, byteOffset) =>
                    view.getUint16(byteOffset, littleEndian) - 2 ** 15;
                } else if (dataType === "signed") {
                  this.readInputValue = (view, byteOffset) =>
                    view.getInt16(byteOffset, littleEndian);
                } else {
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(false);
                }
              }
              break;
            case 3:
              {
                if (dataType === "unsigned") {
                  this.readInputValue = (view, byteOffset) =>
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.dq)(
                      view,
                      byteOffset,
                      littleEndian,
                    ) -
                    2 ** 23;
                } else if (dataType === "signed") {
                  this.readInputValue = (view, byteOffset) =>
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Wh)(
                      view,
                      byteOffset,
                      littleEndian,
                    );
                } else {
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(false);
                }
              }
              break;
            case 4:
              {
                if (dataType === "unsigned") {
                  this.readInputValue = (view, byteOffset) =>
                    view.getUint32(byteOffset, littleEndian) - 2 ** 31;
                } else if (dataType === "signed") {
                  this.readInputValue = (view, byteOffset) =>
                    view.getInt32(byteOffset, littleEndian);
                } else if (dataType === "float") {
                  this.readInputValue = (view, byteOffset) =>
                    view.getFloat32(byteOffset, littleEndian);
                } else {
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(false);
                }
              }
              break;
            case 8:
              {
                if (dataType === "float") {
                  this.readInputValue = (view, byteOffset) =>
                    view.getFloat64(byteOffset, littleEndian);
                } else {
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(false);
                }
              }
              break;
            default: {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.xb)(sampleSize);
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(false);
            }
          }
          switch (sampleSize) {
            case 1:
              {
                if (dataType === "ulaw" || dataType === "alaw") {
                  this.outputSampleSize = 2;
                  this.outputFormat = "s16";
                  this.writeOutputValue = (view, byteOffset, value) =>
                    view.setInt16(byteOffset, value, true);
                } else {
                  this.outputSampleSize = 1;
                  this.outputFormat = "u8";
                  this.writeOutputValue = (view, byteOffset, value) =>
                    view.setUint8(byteOffset, value + 2 ** 7);
                }
              }
              break;
            case 2:
              {
                this.outputSampleSize = 2;
                this.outputFormat = "s16";
                this.writeOutputValue = (view, byteOffset, value) =>
                  view.setInt16(byteOffset, value, true);
              }
              break;
            case 3:
              {
                this.outputSampleSize = 4;
                this.outputFormat = "s32";
                this.writeOutputValue = (view, byteOffset, value) =>
                  view.setInt32(byteOffset, value << 8, true);
              }
              break;
            case 4:
              {
                this.outputSampleSize = 4;
                if (dataType === "float") {
                  this.outputFormat = "f32";
                  this.writeOutputValue = (view, byteOffset, value) =>
                    view.setFloat32(byteOffset, value, true);
                } else {
                  this.outputFormat = "s32";
                  this.writeOutputValue = (view, byteOffset, value) =>
                    view.setInt32(byteOffset, value, true);
                }
              }
              break;
            case 8:
              {
                this.outputSampleSize = 4;
                this.outputFormat = "f32";
                this.writeOutputValue = (view, byteOffset, value) =>
                  view.setFloat32(byteOffset, value, true);
              }
              break;
            default: {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.xb)(sampleSize);
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(false);
            }
          }
        }
        getDecodeQueueSize() {
          return 0;
        }
        decode(packet) {
          const inputView = (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Zc)(
            packet.data,
          );
          const numberOfFrames =
            packet.byteLength /
            this.decoderConfig.numberOfChannels /
            this.inputSampleSize;
          const outputBufferSize =
            numberOfFrames *
            this.decoderConfig.numberOfChannels *
            this.outputSampleSize;
          const outputBuffer = new ArrayBuffer(outputBufferSize);
          const outputView = new DataView(outputBuffer);
          for (
            let i = 0;
            i < numberOfFrames * this.decoderConfig.numberOfChannels;
            i++
          ) {
            const inputIndex = i * this.inputSampleSize;
            const outputIndex = i * this.outputSampleSize;
            const value = this.readInputValue(inputView, inputIndex);
            this.writeOutputValue(outputView, outputIndex, value);
          }
          const preciseDuration =
            numberOfFrames / this.decoderConfig.sampleRate;
          if (
            this.currentTimestamp === null ||
            Math.abs(packet.timestamp - this.currentTimestamp) >=
              preciseDuration
          ) {
            this.currentTimestamp = packet.timestamp;
          }
          const preciseTimestamp = this.currentTimestamp;
          this.currentTimestamp += preciseDuration;
          const audioSample = new _sample_js__WEBPACK_IMPORTED_MODULE_8__.B1({
            format: this.outputFormat,
            data: outputBuffer,
            numberOfChannels: this.decoderConfig.numberOfChannels,
            sampleRate: this.decoderConfig.sampleRate,
            numberOfFrames,
            timestamp: preciseTimestamp,
          });
          this.onSample(audioSample);
        }
        async flush() {}
        close() {}
      }
      class AudioSampleSink extends BaseMediaSampleSink {
        /** Creates a new {@link AudioSampleSink} for the given {@link InputAudioTrack}. */
        constructor(audioTrack) {
          if (
            !(
              audioTrack instanceof
              _input_track_js__WEBPACK_IMPORTED_MODULE_4__.Yi
            )
          ) {
            throw new TypeError("audioTrack must be an InputAudioTrack.");
          }
          super();
          this._track = audioTrack;
        }
        /** @internal */
        async _createDecoder(onSample, onError) {
          if (!(await this._track.canDecode())) {
            if (typeof AudioDecoder === "undefined") {
              throw new Error(
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.tD)("AudioDecoder"),
              );
            }
            throw new Error(
              "This audio track cannot be decoded in this environment. Make sure to check decodability before using a track.",
            );
          }
          const codec = await this._track.getCodec();
          const decoderConfig = await this._track.getDecoderConfig();
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(codec && decoderConfig);
          if (
            _codec_js__WEBPACK_IMPORTED_MODULE_0__.Wq.includes(
              decoderConfig.codec,
            )
          ) {
            return new PcmAudioDecoderWrapper(onSample, onError, decoderConfig);
          } else {
            return new AudioDecoderWrapper(
              onSample,
              onError,
              codec,
              decoderConfig,
            );
          }
        }
        /** @internal */
        _createPacketSink() {
          return new EncodedPacketSink(this._track);
        }
        /**
         * Retrieves the audio sample corresponding to the given timestamp, in seconds. More specifically, returns
         * the last audio sample (in presentation order) with a start timestamp less than or equal to the given timestamp.
         * Returns null if the timestamp is before the track's first timestamp.
         *
         * @param timestamp - The timestamp used for retrieval, in seconds.
         * @param options - Options used for the underlying packet retrieval.
         */
        async getSample(timestamp, options = {}) {
          validateTimestamp(timestamp);
          for await (const sample of this.mediaSamplesAtTimestamps(
            [timestamp],
            options,
          )) {
            return sample;
          }
          throw new Error("Internal error: Iterator returned nothing.");
        }
        /**
         * Creates an async iterator that yields the audio samples of this track in presentation order. This method
         * will intelligently pre-decode a few samples ahead to enable fast iteration.
         *
         * @param startTimestamp - The timestamp in seconds at which to start yielding samples (inclusive).
         * @param endTimestamp - The timestamp in seconds at which to stop yielding samples (exclusive).
         * @param options - Options used for the underlying packet retrieval.
         */
        samples(startTimestamp, endTimestamp, options = {}) {
          return this.mediaSamplesInRange(
            startTimestamp,
            endTimestamp,
            options,
          );
        }
        /**
         * Creates an async iterator that yields an audio sample for each timestamp in the argument. This method
         * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
         * once, and is therefore more efficient than manually getting the sample for every timestamp. The iterator may
         * yield null if no sample is available for a given timestamp.
         *
         * This method is good for sparse access of media data. If you want primarily sequential media access, prefer
         * {@link AudioSampleSink.samples} instead.
         *
         * @param timestamps - An iterable or async iterable of timestamps in seconds.
         * @param options - Options used for the underlying packet retrieval.
         */
        samplesAtTimestamps(timestamps, options = {}) {
          return this.mediaSamplesAtTimestamps(timestamps, options);
        }
      }
      class AudioBufferSink {
        /** Creates a new {@link AudioBufferSink} for the given {@link InputAudioTrack}. */
        constructor(audioTrack) {
          if (!(audioTrack instanceof InputAudioTrack)) {
            throw new TypeError("audioTrack must be an InputAudioTrack.");
          }
          this._audioSampleSink = new AudioSampleSink(audioTrack);
        }
        /** @internal */
        _audioSampleToWrappedArrayBuffer(sample) {
          const result = {
            buffer: sample.toAudioBuffer(),
            timestamp: sample.timestamp,
            duration: sample.duration,
          };
          sample.close();
          return result;
        }
        /**
         * Retrieves the audio buffer corresponding to the given timestamp, in seconds. More specifically, returns
         * the last audio buffer (in presentation order) with a start timestamp less than or equal to the given timestamp.
         * Returns null if the timestamp is before the track's first timestamp.
         *
         * @param timestamp - The timestamp used for retrieval, in seconds.
         * @param options - Options used for the underlying packet retrieval.
         */
        async getBuffer(timestamp, options) {
          validateTimestamp(timestamp);
          const data = await this._audioSampleSink.getSample(
            timestamp,
            options,
          );
          return data && this._audioSampleToWrappedArrayBuffer(data);
        }
        /**
         * Creates an async iterator that yields audio buffers of this track in presentation order. This method
         * will intelligently pre-decode a few buffers ahead to enable fast iteration.
         *
         * @param startTimestamp - The timestamp in seconds at which to start yielding buffers (inclusive).
         * @param endTimestamp - The timestamp in seconds at which to stop yielding buffers (exclusive).
         * @param options - Options used for the underlying packet retrieval.
         */
        buffers(startTimestamp, endTimestamp, options) {
          return mapAsyncGenerator(
            this._audioSampleSink.samples(
              startTimestamp,
              endTimestamp,
              options,
            ),
            (data) => this._audioSampleToWrappedArrayBuffer(data),
          );
        }
        /**
         * Creates an async iterator that yields an audio buffer for each timestamp in the argument. This method
         * uses an optimized decoding pipeline if these timestamps are monotonically sorted, decoding each packet at most
         * once, and is therefore more efficient than manually getting the buffer for every timestamp. The iterator may
         * yield null if no buffer is available for a given timestamp.
         *
         * @param timestamps - An iterable or async iterable of timestamps in seconds.
         * @param options - Options used for the underlying packet retrieval.
         */
        buffersAtTimestamps(timestamps, options) {
          return mapAsyncGenerator(
            this._audioSampleSink.samplesAtTimestamps(timestamps, options),
            (data) => data && this._audioSampleToWrappedArrayBuffer(data),
          );
        }
      }
    },
    /***/
    8957(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        VF: () =>
          /* binding */
          AttachedFile,
        /* harmony export */
        gM: () =>
          /* binding */
          DEFAULT_TRACK_DISPOSITION,
        /* harmony export */
        sF: () =>
          /* binding */
          RichImageData,
        /* harmony export */
      });
      var isRecordStringString;
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class RichImageData {
        /** Creates a new {@link RichImageData}. */
        constructor(data, mimeType) {
          this.data = data;
          this.mimeType = mimeType;
          if (!(data instanceof Uint8Array)) {
            throw new TypeError("data must be a Uint8Array.");
          }
          if (typeof mimeType !== "string") {
            throw new TypeError("mimeType must be a string.");
          }
        }
      }
      class AttachedFile {
        /** Creates a new {@link AttachedFile}. */
        constructor(data, mimeType, name, description) {
          this.data = data;
          this.mimeType = mimeType;
          this.name = name;
          this.description = description;
          if (!(data instanceof Uint8Array)) {
            throw new TypeError("data must be a Uint8Array.");
          }
          if (mimeType !== void 0 && typeof mimeType !== "string") {
            throw new TypeError("mimeType, when provided, must be a string.");
          }
          if (name !== void 0 && typeof name !== "string") {
            throw new TypeError("name, when provided, must be a string.");
          }
          if (description !== void 0 && typeof description !== "string") {
            throw new TypeError(
              "description, when provided, must be a string.",
            );
          }
        }
      }
      const validateMetadataTags = (tags) => {
        if (!tags || typeof tags !== "object") {
          throw new TypeError("tags must be an object.");
        }
        if (tags.title !== void 0 && typeof tags.title !== "string") {
          throw new TypeError("tags.title, when provided, must be a string.");
        }
        if (
          tags.description !== void 0 &&
          typeof tags.description !== "string"
        ) {
          throw new TypeError(
            "tags.description, when provided, must be a string.",
          );
        }
        if (tags.artist !== void 0 && typeof tags.artist !== "string") {
          throw new TypeError("tags.artist, when provided, must be a string.");
        }
        if (tags.album !== void 0 && typeof tags.album !== "string") {
          throw new TypeError("tags.album, when provided, must be a string.");
        }
        if (
          tags.albumArtist !== void 0 &&
          typeof tags.albumArtist !== "string"
        ) {
          throw new TypeError(
            "tags.albumArtist, when provided, must be a string.",
          );
        }
        if (
          tags.trackNumber !== void 0 &&
          (!Number.isInteger(tags.trackNumber) || tags.trackNumber <= 0)
        ) {
          throw new TypeError(
            "tags.trackNumber, when provided, must be a positive integer.",
          );
        }
        if (
          tags.tracksTotal !== void 0 &&
          (!Number.isInteger(tags.tracksTotal) || tags.tracksTotal <= 0)
        ) {
          throw new TypeError(
            "tags.tracksTotal, when provided, must be a positive integer.",
          );
        }
        if (
          tags.discNumber !== void 0 &&
          (!Number.isInteger(tags.discNumber) || tags.discNumber <= 0)
        ) {
          throw new TypeError(
            "tags.discNumber, when provided, must be a positive integer.",
          );
        }
        if (
          tags.discsTotal !== void 0 &&
          (!Number.isInteger(tags.discsTotal) || tags.discsTotal <= 0)
        ) {
          throw new TypeError(
            "tags.discsTotal, when provided, must be a positive integer.",
          );
        }
        if (tags.genre !== void 0 && typeof tags.genre !== "string") {
          throw new TypeError("tags.genre, when provided, must be a string.");
        }
        if (
          tags.date !== void 0 &&
          (!(tags.date instanceof Date) || Number.isNaN(tags.date.getTime()))
        ) {
          throw new TypeError(
            "tags.date, when provided, must be a valid Date.",
          );
        }
        if (tags.lyrics !== void 0 && typeof tags.lyrics !== "string") {
          throw new TypeError("tags.lyrics, when provided, must be a string.");
        }
        if (tags.images !== void 0) {
          if (!Array.isArray(tags.images)) {
            throw new TypeError(
              "tags.images, when provided, must be an array.",
            );
          }
          for (const image of tags.images) {
            if (!image || typeof image !== "object") {
              throw new TypeError(
                "Each image in tags.images must be an object.",
              );
            }
            if (!(image.data instanceof Uint8Array)) {
              throw new TypeError("Each image.data must be a Uint8Array.");
            }
            if (typeof image.mimeType !== "string") {
              throw new TypeError("Each image.mimeType must be a string.");
            }
            if (!["coverFront", "coverBack", "unknown"].includes(image.kind)) {
              throw new TypeError(
                "Each image.kind must be 'coverFront', 'coverBack', or 'unknown'.",
              );
            }
          }
        }
        if (tags.comment !== void 0 && typeof tags.comment !== "string") {
          throw new TypeError("tags.comment, when provided, must be a string.");
        }
        if (tags.raw !== void 0) {
          if (!tags.raw || typeof tags.raw !== "object") {
            throw new TypeError("tags.raw, when provided, must be an object.");
          }
          for (const value of Object.values(tags.raw)) {
            if (
              value !== null &&
              typeof value !== "string" &&
              !(value instanceof Uint8Array) &&
              !(value instanceof RichImageData) &&
              !(value instanceof AttachedFile) &&
              !isRecordStringString(value)
            ) {
              throw new TypeError(
                "Each value in tags.raw must be a string, Uint8Array, RichImageData, AttachedFile, Record<string, string>, or null.",
              );
            }
          }
        }
      };
      const metadataTagsAreEmpty = (tags) => {
        return (
          tags.title === void 0 &&
          tags.description === void 0 &&
          tags.artist === void 0 &&
          tags.album === void 0 &&
          tags.albumArtist === void 0 &&
          tags.trackNumber === void 0 &&
          tags.tracksTotal === void 0 &&
          tags.discNumber === void 0 &&
          tags.discsTotal === void 0 &&
          tags.genre === void 0 &&
          tags.date === void 0 &&
          tags.lyrics === void 0 &&
          (!tags.images || tags.images.length === 0) &&
          tags.comment === void 0 &&
          (tags.raw === void 0 || Object.keys(tags.raw).length === 0)
        );
      };
      const DEFAULT_TRACK_DISPOSITION = {
        default: true,
        primary: true,
        forced: false,
        original: false,
        commentary: false,
        hearingImpaired: false,
        visuallyImpaired: false,
      };
      const validateTrackDisposition = (disposition) => {
        if (!disposition || typeof disposition !== "object") {
          throw new TypeError("disposition must be an object.");
        }
        if (
          disposition.default !== void 0 &&
          typeof disposition.default !== "boolean"
        ) {
          throw new TypeError("disposition.default must be a boolean.");
        }
        if (
          disposition.primary !== void 0 &&
          typeof disposition.primary !== "boolean"
        ) {
          throw new TypeError("disposition.primary must be a boolean.");
        }
        if (
          disposition.forced !== void 0 &&
          typeof disposition.forced !== "boolean"
        ) {
          throw new TypeError("disposition.forced must be a boolean.");
        }
        if (
          disposition.original !== void 0 &&
          typeof disposition.original !== "boolean"
        ) {
          throw new TypeError("disposition.original must be a boolean.");
        }
        if (
          disposition.commentary !== void 0 &&
          typeof disposition.commentary !== "boolean"
        ) {
          throw new TypeError("disposition.commentary must be a boolean.");
        }
        if (
          disposition.hearingImpaired !== void 0 &&
          typeof disposition.hearingImpaired !== "boolean"
        ) {
          throw new TypeError("disposition.hearingImpaired must be a boolean.");
        }
        if (
          disposition.visuallyImpaired !== void 0 &&
          typeof disposition.visuallyImpaired !== "boolean"
        ) {
          throw new TypeError(
            "disposition.visuallyImpaired must be a boolean.",
          );
        }
      };
    },
    /***/
    6760(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        Ai: () =>
          /* binding */
          removeItem,
        /* harmony export */
        Au: () =>
          /* binding */
          MATRIX_COEFFICIENTS_MAP,
        /* harmony export */
        BL: () =>
          /* binding */
          COLOR_PRIMARIES_MAP_INVERSE,
        /* harmony export */
        Br: () =>
          /* binding */
          bytesToHexString,
        /* harmony export */
        D5: () =>
          /* binding */
          validateAnyIterable,
        /* harmony export */
        Et: () =>
          /* binding */
          isNumber,
        /* harmony export */
        F2: () =>
          /* binding */
          isChromium,
        /* harmony export */
        Fo: () =>
          /* binding */
          toUint8Array,
        /* harmony export */
        G8: () =>
          /* binding */
          retriedFetch,
        /* harmony export */
        HS: () =>
          /* binding */
          joinPaths,
        /* harmony export */
        HV: () =>
          /* binding */
          colorSpaceIsComplete,
        /* harmony export */
        IP: () =>
          /* binding */
          readExpGolomb,
        /* harmony export */
        IR: () =>
          /* binding */
          UNDETERMINED_LANGUAGE,
        /* harmony export */
        Kl: () =>
          /* binding */
          findLastIndex,
        /* harmony export */
        Kp: () =>
          /* binding */
          base64ToBytes,
        /* harmony export */
        MF: () =>
          /* binding */
          validateRectangle,
        /* harmony export */
        MW: () =>
          /* binding */
          SECOND_TO_MICROSECOND_FACTOR,
        /* harmony export */
        Nu: () =>
          /* binding */
          isIso639Dash2LanguageCode,
        /* harmony export */
        OO: () =>
          /* binding */
          readSignedExpGolomb,
        /* harmony export */
        P5: () =>
          /* binding */
          reverseBitsU32,
        /* harmony export */
        Q5: () =>
          /* binding */
          floorToMultiple,
        /* harmony export */
        Qg: () =>
          /* binding */
          isThenable,
        /* harmony export */
        SM: () =>
          /* binding */
          isAllowSharedBufferSource,
        /* harmony export */
        Sf: () =>
          /* binding */
          coalesceIndex,
        /* harmony export */
        Sn: () =>
          /* binding */
          HEX_STRING_REGEX,
        /* harmony export */
        Tc: () =>
          /* binding */
          isWebKit,
        /* harmony export */
        Uk: () =>
          /* binding */
          findLast,
        /* harmony export */
        Wh: () =>
          /* binding */
          getInt24,
        /* harmony export */
        XQ: () =>
          /* binding */
          polyfillSymbolDispose,
        /* harmony export */
        Yf: () =>
          /* binding */
          simplifyRational,
        /* harmony export */
        Yg: () =>
          /* binding */
          arrayArgmin,
        /* harmony export */
        ZY: () =>
          /* binding */
          hexStringToBytes,
        /* harmony export */
        Zc: () =>
          /* binding */
          toDataView,
        /* harmony export */
        _g: () =>
          /* binding */
          last,
        /* harmony export */
        _h: () =>
          /* binding */
          mergeRequestInit,
        /* harmony export */
        aD: () =>
          /* binding */
          AsyncMutex,
        /* harmony export */
        aI: () =>
          /* binding */
          roundIfAlmostInteger,
        /* harmony export */
        al: () =>
          /* binding */
          ilog,
        /* harmony export */
        bk: () =>
          /* binding */
          EventEmitter,
        /* harmony export */
        dY: () =>
          /* binding */
          CallSerializer,
        /* harmony export */
        dq: () =>
          /* binding */
          getUint24,
        /* harmony export */
        eE: () =>
          /* binding */
          binarySearchLessOrEqual,
        /* harmony export */
        fl: () =>
          /* binding */
          MATRIX_COEFFICIENTS_MAP_INVERSE,
        /* harmony export */
        gl: () =>
          /* binding */
          roundToDivisor,
        /* harmony export */
        gm: () =>
          /* binding */
          isFirefox,
        /* harmony export */
        h8: () =>
          /* binding */
          insertSorted,
        /* harmony export */
        i1: () =>
          /* binding */
          toAsyncIterator,
        /* harmony export */
        in: () =>
          /* binding */
          roundToMultiple,
        /* harmony export */
        jD: () =>
          /* binding */
          setUint24,
        /* harmony export */
        jW: () =>
          /* binding */
          EMPTY_COLOR_SPACE,
        /* harmony export */
        ju: () =>
          /* binding */
          uint8ArraysAreEqual,
        /* harmony export */
        nJ: () =>
          /* binding */
          promiseWithResolvers,
        /* harmony export */
        oX: () =>
          /* binding */
          closedIntervalsOverlap,
        /* harmony export */
        pf: () =>
          /* binding */
          popcount,
        /* harmony export */
        pl: () =>
          /* binding */
          binarySearchExact,
        /* harmony export */
        qE: () =>
          /* binding */
          clamp,
        /* harmony export */
        qT: () =>
          /* binding */
          normalizeRotation,
        /* harmony export */
        qx: () =>
          /* binding */
          normalizeHeaders,
        /* harmony export */
        su: () =>
          /* binding */
          textDecoder,
        /* harmony export */
        tD: () =>
          /* binding */
          missingWebCodecsClassMessage,
        /* harmony export */
        uN: () =>
          /* binding */
          TRANSFER_CHARACTERISTICS_MAP,
        /* harmony export */
        uk: () =>
          /* binding */
          wait,
        /* harmony export */
        v$: () =>
          /* binding */
          arrayCount,
        /* harmony export */
        vA: () =>
          /* binding */
          assert,
        /* harmony export */
        wd: () =>
          /* binding */
          COLOR_PRIMARIES_MAP,
        /* harmony export */
        x_: () =>
          /* binding */
          TRANSFER_CHARACTERISTICS_MAP_INVERSE,
        /* harmony export */
        xb: () =>
          /* binding */
          assertNever,
        /* harmony export */
      });
      var _logging_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      function assert(x) {
        if (!x) {
          throw new Error("Assertion failed.");
        }
      }
      const normalizeRotation = (rotation) => {
        const mappedRotation = ((rotation % 360) + 360) % 360;
        if (
          mappedRotation === 0 ||
          mappedRotation === 90 ||
          mappedRotation === 180 ||
          mappedRotation === 270
        ) {
          return mappedRotation;
        } else {
          throw new Error("Invalid rotation ".concat(rotation, "."));
        }
      };
      const last = (arr) => {
        return arr && arr[arr.length - 1];
      };
      const isU32 = (value) => {
        return value >= 0 && value < 2 ** 32;
      };
      const readExpGolomb = (bitstream) => {
        let leadingZeroBits = 0;
        while (bitstream.readBits(1) === 0 && leadingZeroBits < 32) {
          leadingZeroBits++;
        }
        if (leadingZeroBits >= 32) {
          throw new Error("Invalid exponential-Golomb code.");
        }
        const result =
          (1 << leadingZeroBits) - 1 + bitstream.readBits(leadingZeroBits);
        return result;
      };
      const readSignedExpGolomb = (bitstream) => {
        const codeNum = readExpGolomb(bitstream);
        return (codeNum & 1) === 0 ? -(codeNum >> 1) : (codeNum + 1) >> 1;
      };
      const writeBits = (bytes, start, end, value) => {
        for (let i = start; i < end; i++) {
          const byteIndex = Math.floor(i / 8);
          let byte = bytes[byteIndex];
          const bitIndex = 7 - (i & 7);
          byte &= ~(1 << bitIndex);
          byte |= ((value & (1 << (end - i - 1))) >> (end - i - 1)) << bitIndex;
          bytes[byteIndex] = byte;
        }
      };
      const toUint8Array = (source) => {
        if (source.constructor === Uint8Array) {
          return source;
        } else if (ArrayBuffer.isView(source)) {
          return new Uint8Array(
            source.buffer,
            source.byteOffset,
            source.byteLength,
          );
        } else {
          return new Uint8Array(source);
        }
      };
      const toDataView = (source) => {
        if (source.constructor === DataView) {
          return source;
        } else if (ArrayBuffer.isView(source)) {
          return new DataView(
            source.buffer,
            source.byteOffset,
            source.byteLength,
          );
        } else {
          return new DataView(source);
        }
      };
      const textDecoder = /* @__PURE__ */ new TextDecoder();
      const textEncoder = /* @__PURE__ */ new TextEncoder();
      const isIso88591Compatible = (text) => {
        for (let i = 0; i < text.length; i++) {
          const code = text.charCodeAt(i);
          if (code > 255) {
            return false;
          }
        }
        return true;
      };
      const invertObject = (object) => {
        return Object.fromEntries(
          Object.entries(object).map(([key, value]) => [value, key]),
        );
      };
      const COLOR_PRIMARIES_MAP = {
        bt709: 1,
        // ITU-R BT.709
        bt470bg: 5,
        // ITU-R BT.470BG
        smpte170m: 6,
        // ITU-R BT.601 525 - SMPTE 170M
        bt2020: 9,
        // ITU-R BT.202
        smpte432: 12,
        // SMPTE EG 432-1
      };
      const COLOR_PRIMARIES_MAP_INVERSE =
        /* @__PURE__ */ invertObject(COLOR_PRIMARIES_MAP);
      const TRANSFER_CHARACTERISTICS_MAP = {
        bt709: 1,
        // ITU-R BT.709
        smpte170m: 6,
        // SMPTE 170M
        linear: 8,
        // Linear transfer characteristics
        "iec61966-2-1": 13,
        // IEC 61966-2-1
        pq: 16,
        // Rec. ITU-R BT.2100-2 perceptual quantization (PQ) system
        hlg: 18,
        // Rec. ITU-R BT.2100-2 hybrid loggamma (HLG) system
      };
      const TRANSFER_CHARACTERISTICS_MAP_INVERSE = /* @__PURE__ */ invertObject(
        TRANSFER_CHARACTERISTICS_MAP,
      );
      const MATRIX_COEFFICIENTS_MAP = {
        rgb: 0,
        // Identity
        bt709: 1,
        // ITU-R BT.709
        bt470bg: 5,
        // ITU-R BT.470BG
        smpte170m: 6,
        // SMPTE 170M
        "bt2020-ncl": 9,
        // ITU-R BT.2020-2 (non-constant luminance)
      };
      const MATRIX_COEFFICIENTS_MAP_INVERSE = /* @__PURE__ */ invertObject(
        MATRIX_COEFFICIENTS_MAP,
      );
      const colorSpaceIsComplete = (colorSpace) => {
        return (
          !!colorSpace &&
          !!colorSpace.primaries &&
          !!colorSpace.transfer &&
          !!colorSpace.matrix &&
          colorSpace.fullRange !== void 0
        );
      };
      const colorSpaceIsEmpty = (colorSpace) => {
        return (
          !colorSpace ||
          (colorSpace.primaries == null &&
            colorSpace.transfer == null &&
            colorSpace.matrix == null &&
            colorSpace.fullRange == null)
        );
      };
      const EMPTY_COLOR_SPACE = {
        primaries: void 0,
        transfer: void 0,
        matrix: void 0,
        fullRange: void 0,
      };
      const isAllowSharedBufferSource = (x) => {
        return (
          x instanceof ArrayBuffer ||
          (typeof SharedArrayBuffer !== "undefined" &&
            x instanceof SharedArrayBuffer) ||
          ArrayBuffer.isView(x)
        );
      };
      class AsyncMutex {
        constructor() {
          this.currentPromise = Promise.resolve();
          this.pending = 0;
        }
        async acquire() {
          let resolver;
          const nextPromise = new Promise((resolve) => {
            let resolved = false;
            resolver = () => {
              if (resolved) {
                return;
              }
              resolve();
              this.pending--;
              resolved = true;
            };
          });
          const currentPromiseAlias = this.currentPromise;
          this.currentPromise = nextPromise;
          this.pending++;
          await currentPromiseAlias;
          return resolver;
        }
      }
      const HEX_STRING_REGEX = /^[0-9a-fA-F]+$/;
      const bytesToHexString = (bytes) => {
        return [...bytes].map((x) => x.toString(16).padStart(2, "0")).join("");
      };
      const hexStringToBytes = (hexString) => {
        assert(hexString.length % 2 === 0);
        const bytes = new Uint8Array(hexString.length / 2);
        for (let i = 0; i < hexString.length; i += 2) {
          bytes[i / 2] = parseInt(hexString.slice(i, i + 2), 16);
        }
        return bytes;
      };
      const reverseBitsU32 = (x) => {
        x = ((x >> 1) & 1431655765) | ((x & 1431655765) << 1);
        x = ((x >> 2) & 858993459) | ((x & 858993459) << 2);
        x = ((x >> 4) & 252645135) | ((x & 252645135) << 4);
        x = ((x >> 8) & 16711935) | ((x & 16711935) << 8);
        x = ((x >> 16) & 65535) | ((x & 65535) << 16);
        return x >>> 0;
      };
      const binarySearchExact = (arr, key, valueGetter) => {
        let low = 0;
        let high = arr.length - 1;
        let ans = -1;
        while (low <= high) {
          const mid = (low + high) >> 1;
          const midVal = valueGetter(arr[mid]);
          if (midVal === key) {
            ans = mid;
            high = mid - 1;
          } else if (midVal < key) {
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        return ans;
      };
      const binarySearchLessOrEqual = (arr, key, valueGetter) => {
        let low = 0;
        let high = arr.length - 1;
        let ans = -1;
        while (low <= high) {
          const mid = (low + (high - low + 1) / 2) | 0;
          const midVal = valueGetter(arr[mid]);
          if (midVal <= key) {
            ans = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        return ans;
      };
      const insertSorted = (arr, item, valueGetter) => {
        const insertionIndex = binarySearchLessOrEqual(
          arr,
          valueGetter(item),
          valueGetter,
        );
        arr.splice(insertionIndex + 1, 0, item);
      };
      const promiseWithResolvers = () => {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return { promise, resolve, reject };
      };
      const removeItem = (arr, item) => {
        const index = arr.indexOf(item);
        if (index !== -1) {
          arr.splice(index, 1);
        }
      };
      const findLast = (arr, predicate) => {
        for (let i = arr.length - 1; i >= 0; i--) {
          if (predicate(arr[i])) {
            return arr[i];
          }
        }
        return void 0;
      };
      const findLastIndex = (arr, predicate) => {
        for (let i = arr.length - 1; i >= 0; i--) {
          if (predicate(arr[i])) {
            return i;
          }
        }
        return -1;
      };
      const toAsyncIterator = async function* (source) {
        if (Symbol.iterator in source) {
          yield* source[Symbol.iterator]();
        } else {
          yield* source[Symbol.asyncIterator]();
        }
      };
      const validateAnyIterable = (iterable) => {
        if (
          !(Symbol.iterator in iterable) &&
          !(Symbol.asyncIterator in iterable)
        ) {
          throw new TypeError(
            "Argument must be an iterable or async iterable.",
          );
        }
      };
      const assertNever = (x) => {
        throw new Error("Unexpected value: ".concat(x));
      };
      const getUint24 = (view, byteOffset, littleEndian) => {
        const byte1 = view.getUint8(byteOffset);
        const byte2 = view.getUint8(byteOffset + 1);
        const byte3 = view.getUint8(byteOffset + 2);
        if (littleEndian) {
          return byte1 | (byte2 << 8) | (byte3 << 16);
        } else {
          return (byte1 << 16) | (byte2 << 8) | byte3;
        }
      };
      const getInt24 = (view, byteOffset, littleEndian) => {
        return (getUint24(view, byteOffset, littleEndian) << 8) >> 8;
      };
      const setUint24 = (view, byteOffset, value, littleEndian) => {
        value = value >>> 0;
        value = value & 16777215;
        if (littleEndian) {
          view.setUint8(byteOffset, value & 255);
          view.setUint8(byteOffset + 1, (value >>> 8) & 255);
          view.setUint8(byteOffset + 2, (value >>> 16) & 255);
        } else {
          view.setUint8(byteOffset, (value >>> 16) & 255);
          view.setUint8(byteOffset + 1, (value >>> 8) & 255);
          view.setUint8(byteOffset + 2, value & 255);
        }
      };
      const setInt24 = (view, byteOffset, value, littleEndian) => {
        value = clamp(value, -8388608, 8388607);
        if (value < 0) {
          value = (value + 16777216) & 16777215;
        }
        setUint24(view, byteOffset, value, littleEndian);
      };
      const setInt64 = (view, byteOffset, value, littleEndian) => {
        if (littleEndian) {
          view.setUint32(byteOffset + 0, value, true);
          view.setInt32(byteOffset + 4, Math.floor(value / 2 ** 32), true);
        } else {
          view.setInt32(byteOffset + 0, Math.floor(value / 2 ** 32), true);
          view.setUint32(byteOffset + 4, value, true);
        }
      };
      const mapAsyncGenerator = (generator, map) => {
        return {
          async next() {
            const result = await generator.next();
            if (result.done) {
              return { value: void 0, done: true };
            } else {
              return { value: map(result.value), done: false };
            }
          },
          return() {
            return generator.return();
          },
          throw(error) {
            return generator.throw(error);
          },
          [Symbol.asyncIterator]() {
            return this;
          },
        };
      };
      const clamp = (value, min, max) => {
        return Math.max(min, Math.min(max, value));
      };
      const lerp = (from, to, t) => {
        return from + (to - from) * t;
      };
      const UNDETERMINED_LANGUAGE = "und";
      const roundIfAlmostInteger = (value) => {
        const rounded = Math.round(value);
        if (Math.abs(value / rounded - 1) < 10 * Number.EPSILON) {
          return rounded;
        } else {
          return value;
        }
      };
      const roundToMultiple = (value, multiple) => {
        return Math.round(value / multiple) * multiple;
      };
      const roundToDivisor = (value, multiple) => {
        return Math.round(value * multiple) / multiple;
      };
      const floorToMultiple = (value, multiple) => {
        return Math.floor(value / multiple) * multiple;
      };
      const floorToDivisor = (value, multiple) => {
        return Math.floor(value * multiple) / multiple;
      };
      const ilog = (x) => {
        let ret = 0;
        while (x) {
          ret++;
          x >>= 1;
        }
        return ret;
      };
      const popcount = (value) => {
        let count = 0;
        while (value !== 0) {
          value &= value - 1;
          count++;
        }
        return count;
      };
      const ISO_639_2_REGEX = /^[a-z]{3}$/;
      const isIso639Dash2LanguageCode = (x) => {
        return ISO_639_2_REGEX.test(x);
      };
      const SECOND_TO_MICROSECOND_FACTOR = 1e6 * (1 + Number.EPSILON);
      const mergeRequestInit = (init1, init2) => {
        const merged = { ...init1, ...init2 };
        if (init1.headers || init2.headers) {
          const headers1 = init1.headers ? normalizeHeaders(init1.headers) : {};
          const headers2 = init2.headers ? normalizeHeaders(init2.headers) : {};
          const mergedHeaders = { ...headers1 };
          Object.entries(headers2).forEach(([key2, value2]) => {
            const existingKey = Object.keys(mergedHeaders).find(
              (key1) => key1.toLowerCase() === key2.toLowerCase(),
            );
            if (existingKey) {
              delete mergedHeaders[existingKey];
            }
            mergedHeaders[key2] = value2;
          });
          merged.headers = mergedHeaders;
        }
        return merged;
      };
      const normalizeHeaders = (headers) => {
        if (headers instanceof Headers) {
          const result = {};
          headers.forEach((value, key) => {
            result[key] = value;
          });
          return result;
        }
        if (Array.isArray(headers)) {
          const result = {};
          headers.forEach(([key, value]) => {
            result[key] = value;
          });
          return result;
        }
        return headers;
      };
      const retriedFetch = async (
        fetchFn,
        url,
        requestInit,
        getRetryDelay,
        shouldStop,
      ) => {
        let attempts = 0;
        while (true) {
          try {
            return await fetchFn(url, requestInit);
          } catch (error) {
            if (shouldStop()) {
              throw error;
            }
            attempts++;
            const retryDelayInSeconds = getRetryDelay(attempts, error, url);
            if (retryDelayInSeconds === null) {
              throw error;
            }
            _logging_js__WEBPACK_IMPORTED_MODULE_0__.y._error(
              "Retrying failed fetch. Error:",
              error,
            );
            if (
              !Number.isFinite(retryDelayInSeconds) ||
              retryDelayInSeconds < 0
            ) {
              throw new TypeError(
                "Retry delay must be a non-negative finite number.",
              );
            }
            if (retryDelayInSeconds > 0) {
              await wait(1e3 * retryDelayInSeconds);
            }
            if (shouldStop()) {
              throw error;
            }
          }
        }
      };
      const computeRationalApproximation = (x, maxDenominator) => {
        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);
        let prevNumerator = 0,
          prevDenominator = 1;
        let currNumerator = 1,
          currDenominator = 0;
        let remainder = x;
        while (true) {
          const integer = Math.floor(remainder);
          const nextNumerator = integer * currNumerator + prevNumerator;
          const nextDenominator = integer * currDenominator + prevDenominator;
          if (nextDenominator > maxDenominator) {
            return {
              num: sign * currNumerator,
              den: currDenominator,
            };
          }
          prevNumerator = currNumerator;
          prevDenominator = currDenominator;
          currNumerator = nextNumerator;
          currDenominator = nextDenominator;
          remainder = 1 / (remainder - integer);
          if (!isFinite(remainder)) {
            break;
          }
        }
        return {
          num: sign * currNumerator,
          den: currDenominator,
        };
      };
      class CallSerializer {
        constructor() {
          this.currentPromise = Promise.resolve();
        }
        call(fn) {
          return (this.currentPromise = this.currentPromise.then(fn));
        }
      }
      let isWebKitCache = null;
      const isWebKit = () => {
        if (isWebKitCache !== null) {
          return isWebKitCache;
        }
        return (isWebKitCache = !!(
          typeof navigator !== "undefined" && // eslint-disable-next-line @typescript-eslint/no-deprecated
          (navigator.vendor?.match(/apple/i) ||
            (/AppleWebKit/.test(navigator.userAgent) &&
              !/Chrome/.test(navigator.userAgent)) ||
            /\b(iPad|iPhone|iPod)\b/.test(navigator.userAgent))
        ));
      };
      let isFirefoxCache = null;
      const isFirefox = () => {
        if (isFirefoxCache !== null) {
          return isFirefoxCache;
        }
        return (isFirefoxCache =
          typeof navigator !== "undefined" &&
          navigator.userAgent?.includes("Firefox"));
      };
      let isChromiumCache = null;
      const isChromium = () => {
        if (isChromiumCache !== null) {
          return isChromiumCache;
        }
        return (isChromiumCache = !!(
          typeof navigator !== "undefined" &&
          (navigator.vendor?.includes("Google Inc") ||
            /Chrome/.test(navigator.userAgent))
        ));
      };
      let chromiumVersionCache = null;
      const getChromiumVersion = () => {
        if (chromiumVersionCache !== null) {
          return chromiumVersionCache;
        }
        if (typeof navigator === "undefined") {
          return null;
        }
        const match = /\bChrome\/(\d+)/.exec(navigator.userAgent);
        if (!match) {
          return null;
        }
        return (chromiumVersionCache = Number(match[1]));
      };
      const missingWebCodecsClassMessage = (className) => {
        if (
          typeof globalThis.isSecureContext !== "undefined" &&
          !globalThis.isSecureContext
        ) {
          return (
            "".concat(
              className,
              " is not available in this environment; this may be because this page is running in an",
            ) +
            " insecure context. Try serving your page over HTTPS or use localhost."
          );
        }
        return "".concat(className, " is not available in this environment.");
      };
      const NativePromiseConstructor = (async () => {})().constructor;
      const isThenable = (value) => {
        if (
          value instanceof NativePromiseConstructor ||
          value instanceof Promise
        ) {
          return true;
        }
        return typeof value?.then === "function";
      };
      const coalesceIndex = (a, b) => {
        return a !== -1 ? a : b;
      };
      const closedIntervalsOverlap = (startA, endA, startB, endB) => {
        return startA <= endB && startB <= endA;
      };
      const keyValueIterator = function* (object) {
        for (const key in object) {
          const value = object[key];
          if (value === void 0) {
            continue;
          }
          yield { key, value };
        }
      };
      const imageMimeTypeToExtension = (mimeType) => {
        switch (mimeType.toLowerCase()) {
          case "image/jpeg":
          case "image/jpg":
            return ".jpg";
          case "image/png":
            return ".png";
          case "image/gif":
            return ".gif";
          case "image/webp":
            return ".webp";
          case "image/bmp":
            return ".bmp";
          case "image/svg+xml":
            return ".svg";
          case "image/tiff":
            return ".tiff";
          case "image/avif":
            return ".avif";
          case "image/x-icon":
          case "image/vnd.microsoft.icon":
            return ".ico";
          default:
            return null;
        }
      };
      const base64ToBytes = (base64) => {
        const decoded = atob(base64);
        const bytes = new Uint8Array(decoded.length);
        for (let i = 0; i < decoded.length; i++) {
          bytes[i] = decoded.charCodeAt(i);
        }
        return bytes;
      };
      const bytesToBase64 = (bytes) => {
        let string = "";
        for (let i = 0; i < bytes.length; i++) {
          string += String.fromCharCode(bytes[i]);
        }
        return btoa(string);
      };
      const uint8ArraysAreEqual = (a, b) => {
        if (a.length !== b.length) {
          return false;
        }
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return false;
          }
        }
        return true;
      };
      const polyfillSymbolDispose = () => {
        Symbol.dispose ??= /* @__PURE__ */ Symbol("Symbol.dispose");
      };
      const isNumber = (x) => {
        return typeof x === "number" && !Number.isNaN(x);
      };
      const joinPaths = (basePath, relativePath) => {
        if (relativePath.includes("://")) {
          return relativePath;
        }
        if (basePath.includes("://")) {
          const queryIndex = basePath.indexOf("?");
          if (queryIndex !== -1) {
            basePath = basePath.slice(0, queryIndex);
          }
        }
        let result;
        if (relativePath.startsWith("/")) {
          const protocolIndex2 = basePath.indexOf("://");
          if (protocolIndex2 === -1) {
            result = relativePath;
          } else {
            const pathStart = basePath.indexOf("/", protocolIndex2 + 3);
            if (pathStart === -1) {
              result = basePath + relativePath;
            } else {
              result = basePath.slice(0, pathStart) + relativePath;
            }
          }
        } else {
          const lastSlash = basePath.lastIndexOf("/");
          if (lastSlash === -1) {
            result = relativePath;
          } else {
            result = basePath.slice(0, lastSlash + 1) + relativePath;
          }
        }
        let prefix = "";
        const protocolIndex = result.indexOf("://");
        if (protocolIndex !== -1) {
          const pathStart = result.indexOf("/", protocolIndex + 3);
          if (pathStart !== -1) {
            prefix = result.slice(0, pathStart);
            result = result.slice(pathStart);
          }
        }
        const segments = result.split("/");
        const normalized = [];
        for (const segment of segments) {
          if (segment === "..") {
            normalized.pop();
          } else if (segment !== ".") {
            normalized.push(segment);
          }
        }
        return prefix + normalized.join("/");
      };
      const arrayCount = (array, predicate) => {
        let count = 0;
        for (let i = 0; i < array.length; i++) {
          if (predicate(array[i])) {
            count++;
          }
        }
        return count;
      };
      const arrayArgmin = (array, getValue) => {
        let minIndex = -1;
        let minValue = Infinity;
        for (let i = 0; i < array.length; i++) {
          const value = getValue(array[i]);
          if (value < minValue) {
            minValue = value;
            minIndex = i;
          }
        }
        return minIndex;
      };
      const arrayArgmax = (array, getValue) => {
        let maxIndex = -1;
        let maxValue = -Infinity;
        for (let i = 0; i < array.length; i++) {
          const value = getValue(array[i]);
          if (value > maxValue) {
            maxValue = value;
            maxIndex = i;
          }
        }
        return maxIndex;
      };
      const simplifyRational = (rational) => {
        assert(Number.isInteger(rational.num));
        assert(Number.isInteger(rational.den));
        assert(rational.den !== 0);
        let a = Math.abs(rational.num);
        let b = Math.abs(rational.den);
        while (b !== 0) {
          const t = a % b;
          a = b;
          b = t;
        }
        const gcd = a || 1;
        return {
          num: rational.num / gcd,
          den: rational.den / gcd,
        };
      };
      const validateRectangle = (rect, propertyPath) => {
        if (typeof rect !== "object" || !rect) {
          throw new TypeError("".concat(propertyPath, " must be an object."));
        }
        if (!Number.isInteger(rect.left) || rect.left < 0) {
          throw new TypeError(
            "".concat(propertyPath, ".left must be a non-negative integer."),
          );
        }
        if (!Number.isInteger(rect.top) || rect.top < 0) {
          throw new TypeError(
            "".concat(propertyPath, ".top must be a non-negative integer."),
          );
        }
        if (!Number.isInteger(rect.width) || rect.width < 0) {
          throw new TypeError(
            "".concat(propertyPath, ".width must be a non-negative integer."),
          );
        }
        if (!Number.isInteger(rect.height) || rect.height < 0) {
          throw new TypeError(
            "".concat(propertyPath, ".height must be a non-negative integer."),
          );
        }
      };
      let unthrottledTimerWorker;
      let nextUnthrottledTimerId = 1;
      const unthrottledTimeoutCallbacks = /* @__PURE__ */ new Map();
      const unthrottledIntervalCallbacks = /* @__PURE__ */ new Map();
      const shouldUseNativeTimers = () => {
        return typeof window === "undefined";
      };
      const unthrottledTimerWorkerMain = () => {
        const timeoutHandles = /* @__PURE__ */ new Map();
        const intervalHandles = /* @__PURE__ */ new Map();
        self.onmessage = (event) => {
          const message = event.data;
          switch (message.type) {
            case "set-timeout":
              {
                const handle = setTimeout(() => {
                  timeoutHandles.delete(message.timerId);
                  self.postMessage({ type: "fire", timerId: message.timerId });
                }, message.delay);
                timeoutHandles.set(message.timerId, handle);
              }
              break;
            case "set-interval":
              {
                const handle = setInterval(() => {
                  self.postMessage({ type: "fire", timerId: message.timerId });
                }, message.delay);
                intervalHandles.set(message.timerId, handle);
              }
              break;
            case "clear-timeout":
              {
                const handle = timeoutHandles.get(message.timerId);
                if (handle !== void 0) {
                  clearTimeout(handle);
                  timeoutHandles.delete(message.timerId);
                }
              }
              break;
            case "clear-interval":
              {
                const handle = intervalHandles.get(message.timerId);
                if (handle !== void 0) {
                  clearInterval(handle);
                  intervalHandles.delete(message.timerId);
                }
              }
              break;
          }
        };
      };
      const getUnthrottledTimerWorker = () => {
        if (unthrottledTimerWorker) {
          return unthrottledTimerWorker;
        }
        const workerSource = "(".concat(
          unthrottledTimerWorkerMain.toString(),
          ")();",
        );
        const workerURL = URL.createObjectURL(
          new Blob([workerSource], { type: "text/javascript" }),
        );
        unthrottledTimerWorker = new Worker(workerURL);
        URL.revokeObjectURL(workerURL);
        unthrottledTimerWorker.onmessage = (event) => {
          const message = event.data;
          const timeoutCallback = unthrottledTimeoutCallbacks.get(
            message.timerId,
          );
          if (timeoutCallback) {
            unthrottledTimeoutCallbacks.delete(message.timerId);
            timeoutCallback();
            return;
          }
          const intervalCallback = unthrottledIntervalCallbacks.get(
            message.timerId,
          );
          if (intervalCallback) {
            intervalCallback();
          }
        };
        return unthrottledTimerWorker;
      };
      const setTimeoutUnthrottled = (callback, delay) => {
        if (shouldUseNativeTimers()) {
          return { id: setTimeout(callback, delay) };
        }
        const timerId = nextUnthrottledTimerId++;
        unthrottledTimeoutCallbacks.set(timerId, () => {
          callback();
        });
        getUnthrottledTimerWorker().postMessage({
          type: "set-timeout",
          timerId,
          delay,
        });
        return { id: timerId };
      };
      const clearTimeoutUnthrottled = (timer) => {
        if (shouldUseNativeTimers()) {
          clearTimeout(timer.id);
          return;
        }
        assert(typeof timer.id === "number");
        unthrottledTimeoutCallbacks.delete(timer.id);
        getUnthrottledTimerWorker().postMessage({
          type: "clear-timeout",
          timerId: timer.id,
        });
      };
      const setIntervalUnthrottled = (callback, delay) => {
        if (shouldUseNativeTimers()) {
          return { id: setInterval(callback, delay) };
        }
        const timerId = nextUnthrottledTimerId++;
        unthrottledIntervalCallbacks.set(timerId, () => {
          callback();
        });
        getUnthrottledTimerWorker().postMessage({
          type: "set-interval",
          timerId,
          delay,
        });
        return { id: timerId };
      };
      const clearIntervalUnthrottled = (timer) => {
        if (shouldUseNativeTimers()) {
          clearInterval(timer.id);
          return;
        }
        assert(typeof timer.id === "number");
        unthrottledIntervalCallbacks.delete(timer.id);
        getUnthrottledTimerWorker().postMessage({
          type: "clear-interval",
          timerId: timer.id,
        });
      };
      const wait = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      const rejectAfter = (ms, message = "Promise rejected") => {
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error(message)), ms);
        });
      };
      const toArray = (x) => {
        if (Array.isArray(x)) {
          return x;
        } else {
          return [x];
        }
      };
      class EventEmitter {
        constructor() {
          this._listeners = /* @__PURE__ */ new Map();
        }
        /** Registers a listener for the given event. Returns a function that, when called, removes the listener again. */
        on(event, listener, options) {
          if (!this._listeners.has(event)) {
            this._listeners.set(event, /* @__PURE__ */ new Set());
          }
          const entry = { fn: listener, once: options?.once ?? false };
          this._listeners.get(event).add(entry);
          return () => {
            this._listeners.get(event)?.delete(entry);
          };
        }
        /** @internal */
        _emit(...args) {
          const [event, data] = args;
          const listeners = this._listeners.get(event);
          if (!listeners) {
            return;
          }
          for (const entry of listeners) {
            try {
              entry.fn(data);
            } catch (error) {
              console.error(error);
            }
            if (entry.once) {
              listeners.delete(entry);
            }
          }
        }
      }
      const ceilToMultipleOfTwo = (value) => Math.ceil(value / 2) * 2;
      class ConcurrentRunner {
        constructor(parallelism) {
          this._queue = [];
          this._errored = false;
          this.parallelism = parallelism;
        }
        /** Whether any function has errored. The runner is effectively bricked if this is `true`, by design. */
        get errored() {
          return this._errored;
        }
        /** The number of tasks currently running. */
        get inFlightCount() {
          return this._queue.length;
        }
        /**
         * Schedules an async function to be run. If the maximum allowed level of parallelism has not yet been reached,
         * the function will be executed immediately and `run()` will resolve immediately. Otherwise, the function will be
         * called as soon as any currently-running function finishes, and `run()` will only resolve then.
         *
         * Throws if the runner is errored.
         */
        async run(fn) {
          if (this._errored) {
            await Promise.race(this._queue);
          }
          while (this._queue.length >= this.parallelism) {
            await Promise.race(this._queue);
          }
          const promise = fn();
          this._queue.push(promise);
          void promise
            .then(() => removeItem(this._queue, promise))
            .catch(() => (this._errored = true));
        }
        /** Waits for all currently running functions to finish. Throws if the runner is errored. */
        async flush() {
          await Promise.all(this._queue);
        }
      }
      const isRecordStringString = (value) => {
        return (
          value !== null &&
          typeof value === "object" &&
          Object.getPrototypeOf(value) === Object.prototype &&
          Object.values(value).every((x) => typeof x === "string")
        );
      };
    },
    /***/
    5334(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        aw: () =>
          /* binding */
          fromAlaw,
        /* harmony export */
        qS: () =>
          /* binding */
          fromUlaw,
        /* harmony export */
      });
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const toUlaw = (s16) => {
        const MULAW_MAX = 8191;
        const MULAW_BIAS = 33;
        let number = s16;
        let mask = 4096;
        let sign = 0;
        let position = 12;
        let lsb = 0;
        if (number < 0) {
          number = -number;
          sign = 128;
        }
        number += MULAW_BIAS;
        if (number > MULAW_MAX) {
          number = MULAW_MAX;
        }
        while ((number & mask) !== mask && position >= 5) {
          mask >>= 1;
          position--;
        }
        lsb = (number >> (position - 4)) & 15;
        return ~(sign | ((position - 5) << 4) | lsb) & 255;
      };
      const fromUlaw = (u8) => {
        const MULAW_BIAS = 33;
        let sign = 0;
        let position = 0;
        let number = ~u8;
        if (number & 128) {
          number &= ~(1 << 7);
          sign = -1;
        }
        position = ((number & 240) >> 4) + 5;
        const decoded =
          ((1 << position) |
            ((number & 15) << (position - 4)) |
            (1 << (position - 5))) -
          MULAW_BIAS;
        return sign === 0 ? decoded : -decoded;
      };
      const toAlaw = (s16) => {
        const ALAW_MAX = 4095;
        let mask = 2048;
        let sign = 0;
        let position = 11;
        let lsb = 0;
        let number = s16;
        if (number < 0) {
          number = -number;
          sign = 128;
        }
        if (number > ALAW_MAX) {
          number = ALAW_MAX;
        }
        while ((number & mask) !== mask && position >= 5) {
          mask >>= 1;
          position--;
        }
        lsb = (number >> (position === 4 ? 1 : position - 4)) & 15;
        return (sign | ((position - 4) << 4) | lsb) ^ 85;
      };
      const fromAlaw = (u8) => {
        let sign = 0;
        let position = 0;
        let number = u8 ^ 85;
        if (number & 128) {
          number &= ~(1 << 7);
          sign = -1;
        }
        position = ((number & 240) >> 4) + 4;
        let decoded = 0;
        if (position !== 4) {
          decoded =
            (1 << position) |
            ((number & 15) << (position - 4)) |
            (1 << (position - 5));
        } else {
          decoded = (number << 1) | 1;
        }
        return sign === 0 ? decoded : -decoded;
      };
    },
    /***/
    1398(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        B1: () =>
          /* binding */
          AudioSample,
        /* harmony export */
        U2: () =>
          /* binding */
          VideoSample,
        /* harmony export */
      });
      var _misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6760);
      var _logging_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      var __addDisposableResource = function (env, value, async) {
        if (value !== null && value !== void 0) {
          if (typeof value !== "object" && typeof value !== "function")
            throw new TypeError("Object expected.");
          var dispose, inner;
          if (async) {
            if (!Symbol.asyncDispose)
              throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
          }
          if (dispose === void 0) {
            if (!Symbol.dispose)
              throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
          }
          if (typeof dispose !== "function")
            throw new TypeError("Object not disposable.");
          if (inner)
            dispose = function () {
              try {
                inner.call(this);
              } catch (e) {
                return Promise.reject(e);
              }
            };
          env.stack.push({ value, dispose, async });
        } else if (async) {
          env.stack.push({ async: true });
        }
        return value;
      };
      var __disposeResources = /* @__PURE__ */ (function (SuppressedError2) {
        return function (env) {
          function fail(e) {
            env.error = env.hasError
              ? new SuppressedError2(
                  e,
                  env.error,
                  "An error was suppressed during disposal.",
                )
              : e;
            env.hasError = true;
          }
          var r,
            s = 0;
          function next() {
            while ((r = env.stack.pop())) {
              try {
                if (!r.async && s === 1)
                  return (
                    (s = 0),
                    env.stack.push(r),
                    Promise.resolve().then(next)
                  );
                if (r.dispose) {
                  var result = r.dispose.call(r.value);
                  if (r.async)
                    return (
                      (s |= 2),
                      Promise.resolve(result).then(next, function (e) {
                        fail(e);
                        return next();
                      })
                    );
                } else s |= 1;
              } catch (e) {
                fail(e);
              }
            }
            if (s === 1)
              return env.hasError
                ? Promise.reject(env.error)
                : Promise.resolve();
            if (env.hasError) throw env.error;
          }
          return next();
        };
      })(
        typeof SuppressedError === "function"
          ? SuppressedError
          : function (error, suppressed, message) {
              var e = new Error(message);
              return (
                (e.name = "SuppressedError"),
                (e.error = error),
                (e.suppressed = suppressed),
                e
              );
            },
      );
      (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.XQ)();
      let lastVideoGcErrorLog = -Infinity;
      let lastAudioGcErrorLog = -Infinity;
      let finalizationRegistry = null;
      if (typeof FinalizationRegistry !== "undefined") {
        finalizationRegistry = new FinalizationRegistry((value) => {
          const now = performance.now();
          if (value.type === "video") {
            if (now - lastVideoGcErrorLog >= 1e3) {
              _logging_js__WEBPACK_IMPORTED_MODULE_1__.y._error(
                "A VideoSample was garbage collected without first being closed. For proper resource management, make sure to call close() on all your VideoSamples as soon as you're done using them.",
              );
              lastVideoGcErrorLog = now;
            }
            if (
              typeof VideoFrame !== "undefined" &&
              value.data instanceof VideoFrame
            ) {
              value.data.close();
            }
          } else {
            if (now - lastAudioGcErrorLog >= 1e3) {
              _logging_js__WEBPACK_IMPORTED_MODULE_1__.y._error(
                "An AudioSample was garbage collected without first being closed. For proper resource management, make sure to call close() on all your AudioSamples as soon as you're done using them.",
              );
              lastAudioGcErrorLog = now;
            }
            if (
              typeof AudioData !== "undefined" &&
              value.data instanceof AudioData
            ) {
              value.data.close();
            }
          }
        });
      }
      class VideoSampleResource {
        constructor() {
          this._referenceCount = 0;
          this._lastAllocationBuffer = null;
        }
      }
      const VIDEO_SAMPLE_PIXEL_FORMATS = [
        // 4:2:0 Y, U, V
        "I420",
        "I420P10",
        "I420P12",
        // 4:2:0 Y, U, V, A
        "I420A",
        "I420AP10",
        "I420AP12",
        // 4:2:2 Y, U, V
        "I422",
        "I422P10",
        "I422P12",
        // 4:2:2 Y, U, V, A
        "I422A",
        "I422AP10",
        "I422AP12",
        // 4:4:4 Y, U, V
        "I444",
        "I444P10",
        "I444P12",
        // 4:4:4 Y, U, V, A
        "I444A",
        "I444AP10",
        "I444AP12",
        // 4:2:0 Y, UV
        "NV12",
        // 4:4:4 RGBA
        "RGBA",
        // 4:4:4 RGBX (opaque)
        "RGBX",
        // 4:4:4 BGRA
        "BGRA",
        // 4:4:4 BGRX (opaque)
        "BGRX",
      ];
      const VIDEO_SAMPLE_PIXEL_FORMATS_SET = new Set(
        VIDEO_SAMPLE_PIXEL_FORMATS,
      );
      class VideoSample {
        /** The width of the frame in pixels. */
        get codedWidth() {
          return this.visibleRect.width;
        }
        /** The height of the frame in pixels. */
        get codedHeight() {
          return this.visibleRect.height;
        }
        /** The display width of the frame in pixels, after aspect ratio adjustment and rotation. */
        get displayWidth() {
          return this.rotation % 180 === 0
            ? this.squarePixelWidth
            : this.squarePixelHeight;
        }
        /** The display height of the frame in pixels, after aspect ratio adjustment and rotation. */
        get displayHeight() {
          return this.rotation % 180 === 0
            ? this.squarePixelHeight
            : this.squarePixelWidth;
        }
        /** The presentation timestamp of the frame in microseconds. */
        get microsecondTimestamp() {
          return Math.trunc(
            _misc_js__WEBPACK_IMPORTED_MODULE_0__.MW * this.timestamp,
          );
        }
        /** The duration of the frame in microseconds. */
        get microsecondDuration() {
          return Math.trunc(
            _misc_js__WEBPACK_IMPORTED_MODULE_0__.MW * this.duration,
          );
        }
        /**
         * Whether this sample uses a pixel format that can hold transparency data. Note that this doesn't necessarily mean
         * that the sample is transparent.
         */
        get hasAlpha() {
          return this.format && this.format.includes("A");
        }
        constructor(data, init) {
          this._closed = false;
          if (
            data instanceof ArrayBuffer ||
            (typeof SharedArrayBuffer !== "undefined" &&
              data instanceof SharedArrayBuffer) ||
            ArrayBuffer.isView(data)
          ) {
            if (!init || typeof init !== "object") {
              throw new TypeError("init must be an object.");
            }
            if (
              init.format === void 0 ||
              !VIDEO_SAMPLE_PIXEL_FORMATS_SET.has(init.format)
            ) {
              throw new TypeError(
                "init.format must be one of: " +
                  VIDEO_SAMPLE_PIXEL_FORMATS.join(", "),
              );
            }
            if (!Number.isInteger(init.codedWidth) || init.codedWidth <= 0) {
              throw new TypeError(
                "init.codedWidth must be a positive integer.",
              );
            }
            if (!Number.isInteger(init.codedHeight) || init.codedHeight <= 0) {
              throw new TypeError(
                "init.codedHeight must be a positive integer.",
              );
            }
            if (
              init.rotation !== void 0 &&
              ![0, 90, 180, 270].includes(init.rotation)
            ) {
              throw new TypeError(
                "init.rotation, when provided, must be 0, 90, 180, or 270.",
              );
            }
            if (!Number.isFinite(init.timestamp)) {
              throw new TypeError("init.timestamp must be a number.");
            }
            if (
              init.duration !== void 0 &&
              (!Number.isFinite(init.duration) || init.duration < 0)
            ) {
              throw new TypeError(
                "init.duration, when provided, must be a non-negative number.",
              );
            }
            if (init.layout !== void 0) {
              if (!Array.isArray(init.layout)) {
                throw new TypeError(
                  "init.layout, when provided, must be an array.",
                );
              }
              for (const plane of init.layout) {
                if (
                  !plane ||
                  typeof plane !== "object" ||
                  Array.isArray(plane)
                ) {
                  throw new TypeError(
                    "Each entry in init.layout must be an object.",
                  );
                }
                if (!Number.isInteger(plane.offset) || plane.offset < 0) {
                  throw new TypeError(
                    "plane.offset must be a non-negative integer.",
                  );
                }
                if (!Number.isInteger(plane.stride) || plane.stride < 0) {
                  throw new TypeError(
                    "plane.stride must be a non-negative integer.",
                  );
                }
              }
            }
            if (init.visibleRect !== void 0) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.MF)(
                init.visibleRect,
                "init.visibleRect",
              );
            }
            if (
              init.displayWidth !== void 0 &&
              (!Number.isInteger(init.displayWidth) || init.displayWidth <= 0)
            ) {
              throw new TypeError(
                "init.displayWidth, when provided, must be a positive integer.",
              );
            }
            if (
              init.displayHeight !== void 0 &&
              (!Number.isInteger(init.displayHeight) || init.displayHeight <= 0)
            ) {
              throw new TypeError(
                "init.displayHeight, when provided, must be a positive integer.",
              );
            }
            if (
              (init.displayWidth !== void 0) !==
              (init.displayHeight !== void 0)
            ) {
              throw new TypeError(
                "init.displayWidth and init.displayHeight must be either both provided or both omitted.",
              );
            }
            this.format = init.format;
            this.rotation = init.rotation ?? 0;
            this.timestamp = init.timestamp;
            this.duration = init.duration ?? 0;
            const layout =
              init.layout ??
              createDefaultPlaneLayout(
                init.format,
                init.codedWidth,
                init.codedHeight,
              );
            let colorSpaceInit = init.colorSpace ?? null;
            if (colorSpaceInit === null) {
              if (
                this.format === "RGBA" ||
                this.format === "RGBX" ||
                this.format === "BGRA" ||
                this.format === "BGRX"
              ) {
                colorSpaceInit = {
                  primaries: "bt709",
                  transfer: "iec61966-2-1",
                  matrix: "rgb",
                  fullRange: true,
                };
              } else {
                colorSpaceInit = {
                  primaries: "bt709",
                  transfer: "bt709",
                  matrix: "bt709",
                  fullRange: false,
                };
              }
            }
            this.visibleRect = {
              left: init.visibleRect?.left ?? 0,
              top: init.visibleRect?.top ?? 0,
              width: init.visibleRect?.width ?? init.codedWidth,
              height: init.visibleRect?.height ?? init.codedHeight,
            };
            if (init.displayWidth !== void 0) {
              this.squarePixelWidth =
                this.rotation % 180 === 0
                  ? init.displayWidth
                  : init.displayHeight;
              this.squarePixelHeight =
                this.rotation % 180 === 0
                  ? init.displayHeight
                  : init.displayWidth;
            } else {
              this.squarePixelWidth = this.visibleRect.width;
              this.squarePixelHeight = this.visibleRect.height;
            }
            this._data = init._doNotCopy
              ? (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Fo)(data)
              : (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Fo)(data).slice();
            this._layout = layout;
            this.colorSpace = new VideoSampleColorSpace(colorSpaceInit);
          } else if (
            typeof VideoFrame !== "undefined" &&
            data instanceof VideoFrame
          ) {
            if (
              init?.rotation !== void 0 &&
              ![0, 90, 180, 270].includes(init.rotation)
            ) {
              throw new TypeError(
                "init.rotation, when provided, must be 0, 90, 180, or 270.",
              );
            }
            if (
              init?.timestamp !== void 0 &&
              !Number.isFinite(init?.timestamp)
            ) {
              throw new TypeError(
                "init.timestamp, when provided, must be a number.",
              );
            }
            if (
              init?.duration !== void 0 &&
              (!Number.isFinite(init.duration) || init.duration < 0)
            ) {
              throw new TypeError(
                "init.duration, when provided, must be a non-negative number.",
              );
            }
            if (init?.visibleRect !== void 0) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.MF)(
                init.visibleRect,
                "init.visibleRect",
              );
            }
            this._data = data;
            this._layout = null;
            this.format = data.format;
            this.visibleRect = {
              left: data.visibleRect?.x ?? 0,
              top: data.visibleRect?.y ?? 0,
              width: data.visibleRect?.width ?? data.codedWidth,
              height: data.visibleRect?.height ?? data.codedHeight,
            };
            this.rotation = init?.rotation ?? 0;
            this.squarePixelWidth = data.displayWidth;
            this.squarePixelHeight = data.displayHeight;
            this.timestamp = init?.timestamp ?? data.timestamp / 1e6;
            this.duration = init?.duration ?? (data.duration ?? 0) / 1e6;
            this.colorSpace = new VideoSampleColorSpace(data.colorSpace);
          } else if (
            (typeof HTMLImageElement !== "undefined" &&
              data instanceof HTMLImageElement) ||
            (typeof SVGImageElement !== "undefined" &&
              data instanceof SVGImageElement) ||
            (typeof ImageBitmap !== "undefined" &&
              data instanceof ImageBitmap) ||
            (typeof HTMLVideoElement !== "undefined" &&
              data instanceof HTMLVideoElement) ||
            (typeof HTMLCanvasElement !== "undefined" &&
              data instanceof HTMLCanvasElement) ||
            (typeof OffscreenCanvas !== "undefined" &&
              data instanceof OffscreenCanvas)
          ) {
            if (!init || typeof init !== "object") {
              throw new TypeError("init must be an object.");
            }
            if (
              init.rotation !== void 0 &&
              ![0, 90, 180, 270].includes(init.rotation)
            ) {
              throw new TypeError(
                "init.rotation, when provided, must be 0, 90, 180, or 270.",
              );
            }
            if (!Number.isFinite(init.timestamp)) {
              throw new TypeError("init.timestamp must be a number.");
            }
            if (
              init.duration !== void 0 &&
              (!Number.isFinite(init.duration) || init.duration < 0)
            ) {
              throw new TypeError(
                "init.duration, when provided, must be a non-negative number.",
              );
            }
            if (init.visibleRect !== void 0) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.MF)(
                init.visibleRect,
                "init.visibleRect",
              );
            }
            if (typeof VideoFrame !== "undefined") {
              return new VideoSample(
                new VideoFrame(data, {
                  timestamp: Math.trunc(
                    init.timestamp * _misc_js__WEBPACK_IMPORTED_MODULE_0__.MW,
                  ),
                  // Drag 0 to undefined
                  duration:
                    Math.trunc(
                      (init.duration ?? 0) *
                        _misc_js__WEBPACK_IMPORTED_MODULE_0__.MW,
                    ) || void 0,
                  // WebCodecs wants DOMRectInit
                  visibleRect: init.visibleRect && {
                    x: init.visibleRect.left,
                    y: init.visibleRect.top,
                    width: init.visibleRect.width,
                    height: init.visibleRect.height,
                  },
                }),
                init,
              );
            }
            let width = 0;
            let height = 0;
            if ("naturalWidth" in data) {
              width = data.naturalWidth;
              height = data.naturalHeight;
            } else if ("videoWidth" in data) {
              width = data.videoWidth;
              height = data.videoHeight;
            } else if ("width" in data) {
              width = Number(data.width);
              height = Number(data.height);
            }
            if (!width || !height) {
              throw new TypeError("Could not determine dimensions.");
            }
            const visibleRect = init.visibleRect ?? {
              left: 0,
              top: 0,
              width,
              height,
            };
            const canvas = new OffscreenCanvas(
              visibleRect.width,
              visibleRect.height,
            );
            const context = canvas.getContext("2d", {
              alpha: (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.gm)(),
              // Firefox has VideoFrame glitches with opaque canvases
              willReadFrequently: true,
            });
            if (!context) {
              throw new Error(
                "OffscreenCanvas must have support for the '2d' context in order to create a VideoSample from this data.",
              );
            }
            context.drawImage(data, -visibleRect.left, -visibleRect.top);
            this._data = canvas;
            this._layout = null;
            this.format = "RGBX";
            this.visibleRect = {
              left: 0,
              top: 0,
              width: visibleRect.width,
              height: visibleRect.height,
            };
            this.squarePixelWidth = visibleRect.width;
            this.squarePixelHeight = visibleRect.height;
            this.rotation = init.rotation ?? 0;
            this.timestamp = init.timestamp;
            this.duration = init.duration ?? 0;
            this.colorSpace = new VideoSampleColorSpace({
              matrix: "rgb",
              primaries: "bt709",
              transfer: "iec61966-2-1",
              fullRange: true,
            });
          } else if (data instanceof VideoSampleResource) {
            if (!init || typeof init !== "object") {
              throw new TypeError("init must be an object.");
            }
            if (
              init.rotation !== void 0 &&
              ![0, 90, 180, 270].includes(init.rotation)
            ) {
              throw new TypeError(
                "init.rotation, when provided, must be 0, 90, 180, or 270.",
              );
            }
            if (!Number.isFinite(init.timestamp)) {
              throw new TypeError("init.timestamp must be a number.");
            }
            if (
              init.duration !== void 0 &&
              (!Number.isFinite(init.duration) || init.duration < 0)
            ) {
              throw new TypeError(
                "init.duration, when provided, must be a non-negative number.",
              );
            }
            this._data = data;
            data._referenceCount++;
            this.format = data.getFormat();
            if (
              this.format !== null &&
              !VIDEO_SAMPLE_PIXEL_FORMATS.includes(this.format)
            ) {
              throw new TypeError(
                "getFormat() must return a VideoSamplePixelFormat or null.",
              );
            }
            this.visibleRect = {
              left: 0,
              top: 0,
              width: data.getCodedWidth(),
              height: data.getCodedHeight(),
            };
            if (
              !Number.isInteger(this.visibleRect.width) ||
              this.visibleRect.width <= 0
            ) {
              throw new TypeError(
                "getCodedWidth() must return a positive integer.",
              );
            }
            if (
              !Number.isInteger(this.visibleRect.height) ||
              this.visibleRect.height <= 0
            ) {
              throw new TypeError(
                "getCodedHeight() must return a positive integer.",
              );
            }
            this.squarePixelWidth = data.getSquarePixelWidth();
            if (
              !Number.isInteger(this.squarePixelWidth) ||
              this.squarePixelWidth <= 0
            ) {
              throw new TypeError(
                "getSquarePixelWidth() must return a positive integer.",
              );
            }
            this.squarePixelHeight = data.getSquarePixelHeight();
            if (
              !Number.isInteger(this.squarePixelHeight) ||
              this.squarePixelHeight <= 0
            ) {
              throw new TypeError(
                "getSquarePixelHeight() must return a positive integer.",
              );
            }
            this.rotation = init.rotation ?? 0;
            this.timestamp = init.timestamp;
            this.duration = init.duration ?? 0;
            this.colorSpace = data.getColorSpace();
          } else {
            throw new TypeError(
              "Invalid data type: Must be a BufferSource, CanvasImageSource, or VideoSampleResource.",
            );
          }
          this.encodeOptions = init?.encodeOptions ?? {};
          this.pixelAspectRatio = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Yf)(
            {
              num: this.squarePixelWidth * this.codedHeight,
              den: this.squarePixelHeight * this.codedWidth,
            },
          );
          finalizationRegistry?.register(
            this,
            { type: "video", data: this._data },
            this,
          );
        }
        /** Clones this video sample. */
        clone() {
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(this._data !== null);
          if (this._data instanceof VideoSampleResource) {
            return new VideoSample(this._data, {
              timestamp: this.timestamp,
              duration: this.duration,
              rotation: this.rotation,
              encodeOptions: this.encodeOptions,
            });
          } else if (isVideoFrame(this._data)) {
            return new VideoSample(this._data.clone(), {
              timestamp: this.timestamp,
              duration: this.duration,
              rotation: this.rotation,
              encodeOptions: this.encodeOptions,
            });
          } else if (this._data instanceof Uint8Array) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(this._layout);
            return new VideoSample(this._data, {
              format: this.format,
              layout: this._layout,
              codedWidth: this.codedWidth,
              codedHeight: this.codedHeight,
              timestamp: this.timestamp,
              duration: this.duration,
              colorSpace: this.colorSpace,
              rotation: this.rotation,
              visibleRect: this.visibleRect,
              displayWidth: this.displayWidth,
              displayHeight: this.displayHeight,
              encodeOptions: this.encodeOptions,
              // It's already been copied, if we copy it again we make the clone unnecessarily expensive
              _doNotCopy: true,
            });
          } else {
            return new VideoSample(this._data, {
              format: this.format,
              codedWidth: this.codedWidth,
              codedHeight: this.codedHeight,
              timestamp: this.timestamp,
              duration: this.duration,
              colorSpace: this.colorSpace,
              rotation: this.rotation,
              visibleRect: this.visibleRect,
              displayWidth: this.displayWidth,
              displayHeight: this.displayHeight,
              encodeOptions: this.encodeOptions,
            });
          }
        }
        /**
         * Closes this video sample, releasing held resources. Video samples should be closed as soon as they are not
         * needed anymore.
         */
        close() {
          if (this._closed) {
            return;
          }
          finalizationRegistry?.unregister(this);
          if (this._data instanceof VideoSampleResource) {
            this._data._referenceCount--;
            if (this._data._referenceCount === 0) {
              this._data.close();
            }
          } else if (isVideoFrame(this._data)) {
            this._data.close();
          } else {
            this._data = null;
          }
          this._closed = true;
        }
        /**
         * Returns the number of bytes required to hold this video sample's pixel data.
         */
        allocationSize(options = {}) {
          validateVideoFrameCopyToOptions(options);
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          if ((options.format ?? this.format) == null) {
            throw new Error("Cannot get allocation size when format is null.");
          }
          if (isVideoFrame(this._data)) {
            return this._data.allocationSize(options);
          }
          const combinedLayout = ParseVideoFrameCopyToOptions(this, options);
          return combinedLayout.allocationSize;
        }
        /**
         * Copies this video sample's pixel data to an ArrayBuffer or ArrayBufferView.
         * @returns The byte layout of the planes of the copied data.
         */
        async copyTo(destination, options = {}) {
          if (!(0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.SM)(destination)) {
            throw new TypeError(
              "destination must be an ArrayBuffer or an ArrayBuffer view.",
            );
          }
          validateVideoFrameCopyToOptions(options);
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          if ((options.format ?? this.format) == null) {
            throw new Error(
              "Cannot copy video sample data when format is null.",
            );
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(this._data !== null);
          if (isVideoFrame(this._data)) {
            return this._data.copyTo(destination, options);
          }
          if (
            options.format &&
            !["RGBA", "RGBX", "BGRA", "BGRX"].includes(this.format) &&
            ["RGBA", "RGBX", "BGRA", "BGRX"].includes(options.format)
          ) {
            if (this._data instanceof VideoSampleResource) {
              const env_1 = { stack: [], error: void 0, hasError: false };
              try {
                const rgbSample = __addDisposableResource(
                  env_1,
                  await this._data.toRgbSample(
                    {
                      timestamp: this.timestamp,
                      duration: this.duration,
                      rotation: this.rotation,
                    },
                    options.colorSpace ?? "srgb",
                  ),
                  false,
                );
                if (!(rgbSample instanceof VideoSample)) {
                  throw new TypeError(
                    "toRgbSample() must return a VideoSample.",
                  );
                }
                if (
                  !["RGBA", "RGBX", "BGRA", "BGRX"].includes(rgbSample.format)
                ) {
                  throw new Error(
                    "Sample returned by toRgbSample was expected to have an RGB format, got" +
                      " '".concat(rgbSample.format, "' instead."),
                  );
                }
                return await rgbSample.copyTo(destination, options);
              } catch (e_1) {
                env_1.error = e_1;
                env_1.hasError = true;
              } finally {
                __disposeResources(env_1);
              }
            } else {
              if (typeof VideoFrame === "undefined") {
                throw new Error(
                  "For this sample, converting from a non-RGB to an RGB format requires VideoFrame to be defined.",
                );
              }
              const tempFrame = this.toVideoFrame();
              const result = await tempFrame.copyTo(destination, options);
              tempFrame.close();
              return result;
            }
          }
          const combinedLayout = ParseVideoFrameCopyToOptions(this, options);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(this.format);
          const destBytes = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Fo)(
            destination,
          );
          if (destBytes.byteLength < combinedLayout.allocationSize) {
            throw new TypeError(
              "Destination buffer too small. Required: ".concat(
                combinedLayout.allocationSize,
                ",",
              ) + " Available: ".concat(destBytes.byteLength),
            );
          }
          const planeConfigs = getPlaneConfigs(this.format);
          let dataPlanes;
          if (this._data instanceof VideoSampleResource) {
            let result = this._data.getDataPlanes();
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(result))
              result = await result;
            if (
              !Array.isArray(result) ||
              result.some(
                (x) =>
                  !(x.data instanceof Uint8Array) ||
                  !Number.isInteger(x.stride) ||
                  x.stride < 0,
              )
            ) {
              throw new TypeError(
                'getDataPlanes() must return an array of objects with a Uint8Array "data" property and a non-negative integer "stride" property.',
              );
            }
            dataPlanes = result;
          } else if (this._data instanceof Uint8Array) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(this._layout);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(
              this._layout.length === planeConfigs.length,
            );
            dataPlanes = this._layout.map((planeLayout, i) => {
              const height = Math.ceil(
                this.codedHeight / planeConfigs[i].heightDivisor,
              );
              return {
                data: this._data.subarray(
                  planeLayout.offset,
                  planeLayout.offset + planeLayout.stride * height,
                ),
                stride: planeLayout.stride,
              };
            });
          } else {
            const canvas = this._data;
            const context = canvas.getContext("2d");
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(context);
            const imageData = context.getImageData(
              0,
              0,
              this.codedWidth,
              this.codedHeight,
            );
            dataPlanes = [
              {
                data: (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Fo)(
                  imageData.data,
                ),
                stride: 4 * this.codedWidth,
              },
            ];
          }
          const planeLayouts = [];
          const numPlanes = planeConfigs.length;
          for (let planeIndex = 0; planeIndex < numPlanes; planeIndex++) {
            const computedLayout = combinedLayout.computedLayouts[planeIndex];
            const sourceStride = dataPlanes[planeIndex].stride;
            const sourceData = dataPlanes[planeIndex].data;
            let sourceOffset = computedLayout.sourceTop * sourceStride;
            sourceOffset += computedLayout.sourceLeftBytes;
            let destinationOffset = computedLayout.destinationOffset;
            const rowBytes = computedLayout.sourceWidthBytes;
            const layout = {
              offset: destinationOffset,
              stride: computedLayout.destinationStride,
            };
            for (let row = 0; row < computedLayout.sourceHeight; row++) {
              if (sourceOffset + rowBytes > sourceData.byteLength) {
                throw new Error("Source buffer OOB read.");
              }
              if (destinationOffset + rowBytes > destBytes.byteLength) {
                throw new Error("Destination buffer OOB write.");
              }
              const srcSub = sourceData.subarray(
                sourceOffset,
                sourceOffset + rowBytes,
              );
              destBytes.set(srcSub, destinationOffset);
              sourceOffset += sourceStride;
              destinationOffset += computedLayout.destinationStride;
            }
            planeLayouts.push(layout);
          }
          if (options.format !== void 0) {
            const needsRgbConversion =
              this.format.startsWith("RGB") !==
              options.format.startsWith("RGB");
            const needsAlphaConversion =
              this.format.includes("X") && options.format.includes("A");
            if (needsRgbConversion || needsAlphaConversion) {
              for (let i = 0; i < combinedLayout.allocationSize; i += 4) {
                if (needsRgbConversion) {
                  const r = destBytes[i];
                  const b = destBytes[i + 2];
                  destBytes[i] = b;
                  destBytes[i + 2] = r;
                }
                if (needsAlphaConversion) {
                  destBytes[i + 3] = 255;
                }
              }
            }
          }
          return planeLayouts;
        }
        /**
         * Converts this video sample to a VideoFrame for use with the WebCodecs API. The VideoFrame returned by this
         * method *must* be closed separately from this video sample.
         */
        toVideoFrame() {
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(this._data !== null);
          if (this._data instanceof VideoSampleResource) {
            if (this.format === null) {
              throw new Error(
                "Cannot convert a VideoSampleResource-backed VideoSample to VideoFrame if format is null.",
              );
            }
            const planes = this._data.getDataPlanes();
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(planes)) {
              throw new Error(
                "Cannot convert a VideoSampleResource-backed VideoSample to VideoFrame if getDataPlanes() returns a promise.",
              );
            }
            const size = planes.reduce((a, b) => a + b.data.byteLength, 0);
            const buffer = new Uint8Array(size);
            let offset = 0;
            const offsets = [];
            for (const plane of planes) {
              buffer.set(plane.data, offset);
              offsets.push(offset);
              offset += plane.data.byteLength;
            }
            return new VideoFrame(buffer, {
              format: this.format,
              layout: planes.map((x, i) => ({
                offset: offsets[i],
                stride: x.stride,
              })),
              codedWidth: this.codedWidth,
              codedHeight: this.codedHeight,
              timestamp: this.microsecondTimestamp,
              duration: this.microsecondDuration,
              colorSpace: this.colorSpace,
              visibleRect: this.visibleRect,
              displayWidth: this.squarePixelWidth,
              // Not display* since we're not passing rotation
              displayHeight: this.squarePixelHeight,
            });
          } else if (isVideoFrame(this._data)) {
            return new VideoFrame(this._data, {
              timestamp: this.microsecondTimestamp,
              duration: this.microsecondDuration || void 0,
              // Drag 0 duration to undefined, glitches some codecs
            });
          } else if (this._data instanceof Uint8Array) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(this._layout);
            return new VideoFrame(this._data, {
              format: this.format,
              codedWidth: this.codedWidth,
              // This is technically wrong! codedWidth is a lie technically. But, since
              codedHeight: this.codedHeight,
              // we pass the layout (which contains the true coded width), we're good.
              layout: this._layout,
              timestamp: this.microsecondTimestamp,
              duration: this.microsecondDuration || void 0,
              colorSpace: this.colorSpace,
              visibleRect: this.visibleRect,
              displayWidth: this.squarePixelWidth,
              // Not display* since we're not passing rotation
              displayHeight: this.squarePixelHeight,
            });
          } else {
            return new VideoFrame(this._data, {
              timestamp: this.microsecondTimestamp,
              duration: this.microsecondDuration || void 0,
            });
          }
        }
        draw(context, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
          let sx = 0;
          let sy = 0;
          let sWidth = this.displayWidth;
          let sHeight = this.displayHeight;
          let dx = 0;
          let dy = 0;
          let dWidth = this.displayWidth;
          let dHeight = this.displayHeight;
          if (arg5 !== void 0) {
            sx = arg1;
            sy = arg2;
            sWidth = arg3;
            sHeight = arg4;
            dx = arg5;
            dy = arg6;
            if (arg7 !== void 0) {
              dWidth = arg7;
              dHeight = arg8;
            } else {
              dWidth = sWidth;
              dHeight = sHeight;
            }
          } else {
            dx = arg1;
            dy = arg2;
            if (arg3 !== void 0) {
              dWidth = arg3;
              dHeight = arg4;
            }
          }
          if (!(
            (typeof CanvasRenderingContext2D !== "undefined" &&
              context instanceof CanvasRenderingContext2D) ||
            (typeof OffscreenCanvasRenderingContext2D !== "undefined" &&
              context instanceof OffscreenCanvasRenderingContext2D)
          )) {
            throw new TypeError(
              "context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.",
            );
          }
          if (!Number.isFinite(sx)) {
            throw new TypeError("sx must be a number.");
          }
          if (!Number.isFinite(sy)) {
            throw new TypeError("sy must be a number.");
          }
          if (!Number.isFinite(sWidth) || sWidth < 0) {
            throw new TypeError("sWidth must be a non-negative number.");
          }
          if (!Number.isFinite(sHeight) || sHeight < 0) {
            throw new TypeError("sHeight must be a non-negative number.");
          }
          if (!Number.isFinite(dx)) {
            throw new TypeError("dx must be a number.");
          }
          if (!Number.isFinite(dy)) {
            throw new TypeError("dy must be a number.");
          }
          if (!Number.isFinite(dWidth) || dWidth < 0) {
            throw new TypeError("dWidth must be a non-negative number.");
          }
          if (!Number.isFinite(dHeight) || dHeight < 0) {
            throw new TypeError("dHeight must be a non-negative number.");
          }
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          ({ sx, sy, sWidth, sHeight } = this._rotateSourceRegion(
            sx,
            sy,
            sWidth,
            sHeight,
            this.rotation,
          ));
          const source = this.toCanvasImageSource();
          context.save();
          const centerX = dx + dWidth / 2;
          const centerY = dy + dHeight / 2;
          context.translate(centerX, centerY);
          context.rotate((this.rotation * Math.PI) / 180);
          const aspectRatioChange =
            this.rotation % 180 === 0 ? 1 : dWidth / dHeight;
          context.scale(1 / aspectRatioChange, aspectRatioChange);
          context.drawImage(
            source,
            sx,
            sy,
            sWidth,
            sHeight,
            -dWidth / 2,
            -dHeight / 2,
            dWidth,
            dHeight,
          );
          context.restore();
        }
        /**
         * Draws the sample in the middle of the canvas corresponding to the context with the specified fit behavior.
         */
        drawWithFit(context, options) {
          if (!(
            (typeof CanvasRenderingContext2D !== "undefined" &&
              context instanceof CanvasRenderingContext2D) ||
            (typeof OffscreenCanvasRenderingContext2D !== "undefined" &&
              context instanceof OffscreenCanvasRenderingContext2D)
          )) {
            throw new TypeError(
              "context must be a CanvasRenderingContext2D or OffscreenCanvasRenderingContext2D.",
            );
          }
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (!["fill", "contain", "cover"].includes(options.fit)) {
            throw new TypeError(
              "options.fit must be 'fill', 'contain', or 'cover'.",
            );
          }
          if (
            options.rotation !== void 0 &&
            ![0, 90, 180, 270].includes(options.rotation)
          ) {
            throw new TypeError(
              "options.rotation, when provided, must be 0, 90, 180, or 270.",
            );
          }
          if (options.crop !== void 0) {
            validateCropRectangle(options.crop, "options.");
          }
          const canvasWidth = context.canvas.width;
          const canvasHeight = context.canvas.height;
          const rotation = options.rotation ?? this.rotation;
          const [rotatedWidth, rotatedHeight] =
            rotation % 180 === 0
              ? [this.squarePixelWidth, this.squarePixelHeight]
              : [this.squarePixelHeight, this.squarePixelWidth];
          let finalCrop = options.crop;
          if (finalCrop) {
            finalCrop = clampCropRectangle(
              finalCrop,
              rotatedWidth,
              rotatedHeight,
            );
          }
          let dx;
          let dy;
          let newWidth;
          let newHeight;
          const { sx, sy, sWidth, sHeight } = this._rotateSourceRegion(
            options.crop?.left ?? 0,
            options.crop?.top ?? 0,
            options.crop?.width ?? rotatedWidth,
            options.crop?.height ?? rotatedHeight,
            rotation,
          );
          if (options.fit === "fill") {
            dx = 0;
            dy = 0;
            newWidth = canvasWidth;
            newHeight = canvasHeight;
          } else {
            const [sampleWidth, sampleHeight] = options.crop
              ? [options.crop.width, options.crop.height]
              : [rotatedWidth, rotatedHeight];
            const scale =
              options.fit === "contain"
                ? Math.min(
                    canvasWidth / sampleWidth,
                    canvasHeight / sampleHeight,
                  )
                : Math.max(
                    canvasWidth / sampleWidth,
                    canvasHeight / sampleHeight,
                  );
            newWidth = sampleWidth * scale;
            newHeight = sampleHeight * scale;
            dx = (canvasWidth - newWidth) / 2;
            dy = (canvasHeight - newHeight) / 2;
          }
          context.save();
          const aspectRatioChange =
            rotation % 180 === 0 ? 1 : newWidth / newHeight;
          context.translate(canvasWidth / 2, canvasHeight / 2);
          context.rotate((rotation * Math.PI) / 180);
          context.scale(1 / aspectRatioChange, aspectRatioChange);
          context.translate(-canvasWidth / 2, -canvasHeight / 2);
          context.drawImage(
            this.toCanvasImageSource(),
            sx,
            sy,
            sWidth,
            sHeight,
            dx,
            dy,
            newWidth,
            newHeight,
          );
          context.restore();
        }
        /** @internal */
        _rotateSourceRegion(sx, sy, sWidth, sHeight, rotation) {
          if (rotation === 90) {
            [sx, sy, sWidth, sHeight] = [
              sy,
              this.squarePixelHeight - sx - sWidth,
              sHeight,
              sWidth,
            ];
          } else if (rotation === 180) {
            [sx, sy] = [
              this.squarePixelWidth - sx - sWidth,
              this.squarePixelHeight - sy - sHeight,
            ];
          } else if (rotation === 270) {
            [sx, sy, sWidth, sHeight] = [
              this.squarePixelWidth - sy - sHeight,
              sx,
              sHeight,
              sWidth,
            ];
          }
          return { sx, sy, sWidth, sHeight };
        }
        /**
         * Draws the sample onto the target canvas with fit behavior, manually mipmapping on strong downscales for quality.
         * @internal
         */
        _drawWithFitAndMipmapping(targetCanvas, targetContext, options) {
          const targetWidth = targetCanvas.width;
          const targetHeight = targetCanvas.height;
          const [rotatedWidth, rotatedHeight] =
            options.rotation % 180 === 0
              ? [this.squarePixelWidth, this.squarePixelHeight]
              : [this.squarePixelHeight, this.squarePixelWidth];
          const sourceWidth = options.crop ? options.crop.width : rotatedWidth;
          const sourceHeight = options.crop
            ? options.crop.height
            : rotatedHeight;
          let mipLevels = 0;
          if (
            2 * targetWidth < sourceWidth &&
            2 * targetHeight < sourceHeight
          ) {
            mipLevels = Math.floor(
              Math.log2(
                Math.min(
                  sourceWidth / targetWidth,
                  sourceHeight / targetHeight,
                ),
              ),
            );
          }
          const drawWidth = targetWidth * 2 ** mipLevels;
          const drawHeight = targetHeight * 2 ** mipLevels;
          const { canvas, context, isNew } =
            mipLevels > 0
              ? getTransformationCanvas(drawWidth, drawHeight)
              : {
                  canvas: targetCanvas,
                  context: targetContext,
                  isNew: options.targetIsFresh,
                };
          context.imageSmoothingQuality = "high";
          if (options.fillBlack) {
            context.fillStyle = "black";
            context.fillRect(0, 0, drawWidth, drawHeight);
          } else if (!isNew) {
            context.clearRect(0, 0, drawWidth, drawHeight);
          }
          this.drawWithFit(context, {
            fit: options.fit,
            rotation: options.rotation,
            crop: options.crop,
          });
          context.globalCompositeOperation = "copy";
          for (let i = mipLevels; i > 1; i--) {
            const levelWidth = targetWidth * 2 ** i;
            const levelHeight = targetHeight * 2 ** i;
            context.drawImage(
              canvas,
              0,
              0,
              levelWidth,
              levelHeight,
              0,
              0,
              levelWidth / 2,
              levelHeight / 2,
            );
          }
          context.globalCompositeOperation = "source-over";
          if (mipLevels > 0) {
            targetContext.imageSmoothingQuality = "high";
            targetContext.globalCompositeOperation = "copy";
            targetContext.drawImage(
              canvas,
              0,
              0,
              2 * targetWidth,
              2 * targetHeight,
              0,
              0,
              targetWidth,
              targetHeight,
            );
            targetContext.globalCompositeOperation = "source-over";
          }
        }
        /**
         * Converts this video sample to a
         * [`CanvasImageSource`](https://udn.realityripple.com/docs/Web/API/CanvasImageSource) for drawing to a canvas.
         *
         * You must use the value returned by this method immediately, as any VideoFrame created internally may
         * automatically be closed in the next microtask.
         */
        toCanvasImageSource() {
          if (this._closed) {
            throw new Error("VideoSample is closed.");
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(this._data !== null);
          if (
            this._data instanceof VideoSampleResource ||
            this._data instanceof Uint8Array
          ) {
            const videoFrame = this.toVideoFrame();
            queueMicrotask(() => videoFrame.close());
            return videoFrame;
          } else {
            return this._data;
          }
        }
        /**
         * Transform this video sample to a new video sample given the options. Can be used to resize, rotate, and crop
         * the sample.
         *
         * In non-browser environments, this method will not work by default. To make it work, register a custom
         * transformer function via {@link registerVideoSampleTransformer}.
         */
        async transform(options) {
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (
            options.width !== void 0 &&
            (!Number.isInteger(options.width) || options.width <= 0)
          ) {
            throw new TypeError(
              "options.width, when provided, must be a positive integer.",
            );
          }
          if (
            options.height !== void 0 &&
            (!Number.isInteger(options.height) || options.height <= 0)
          ) {
            throw new TypeError(
              "options.height, when provided, must be a positive integer.",
            );
          }
          if (
            options.roundDimensionsTo !== void 0 &&
            (!Number.isInteger(options.roundDimensionsTo) ||
              options.roundDimensionsTo <= 0)
          ) {
            throw new TypeError(
              "options.roundDimensionsTo, when provided, must be a positive integer.",
            );
          }
          if (
            options.fit !== void 0 &&
            !["fill", "contain", "cover"].includes(options.fit)
          ) {
            throw new TypeError(
              'options.fit, when provided, must be one of "fill", "contain", or "cover".',
            );
          }
          if (
            options.width !== void 0 &&
            options.height !== void 0 &&
            options.fit === void 0
          ) {
            throw new TypeError(
              "When both options.width and options.height are provided, options.fit must also be provided.",
            );
          }
          if (
            options.rotate !== void 0 &&
            ![0, 90, 180, 270].includes(options.rotate)
          ) {
            throw new TypeError(
              "options.rotate, when provided, must be 0, 90, 180 or 270.",
            );
          }
          if (options.crop !== void 0) {
            validateCropRectangle(options.crop, "options.");
          }
          if (
            options.alpha !== void 0 &&
            !["keep", "discard"].includes(options.alpha)
          ) {
            throw new TypeError(
              "options.alpha, when provided, must be 'keep' or 'discard'.",
            );
          }
          const rotation = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.qT)(
            this.rotation + (options.rotate ?? 0),
          );
          const [rotatedWidth, rotatedHeight] =
            rotation % 180 === 0
              ? [this.squarePixelWidth, this.squarePixelHeight]
              : [this.squarePixelHeight, this.squarePixelWidth];
          let finalCrop = options.crop;
          if (finalCrop) {
            finalCrop = clampCropRectangle(
              finalCrop,
              rotatedWidth,
              rotatedHeight,
            );
          }
          const cropWidth = finalCrop ? finalCrop.width : rotatedWidth;
          const cropHeight = finalCrop ? finalCrop.height : rotatedHeight;
          const originalAspectRatio = cropWidth / cropHeight;
          let targetWidth;
          let targetHeight;
          if (options.width !== void 0 && options.height === void 0) {
            targetWidth = options.width;
            targetHeight = targetWidth / originalAspectRatio;
          } else if (options.width === void 0 && options.height !== void 0) {
            targetHeight = options.height;
            targetWidth = targetHeight * originalAspectRatio;
          } else if (options.width !== void 0 && options.height !== void 0) {
            targetWidth = options.width;
            targetHeight = options.height;
          } else {
            targetWidth = cropWidth;
            targetHeight = cropHeight;
          }
          targetWidth = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__["in"])(
            targetWidth,
            options.roundDimensionsTo ?? 1,
          );
          targetHeight = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__["in"])(
            targetHeight,
            options.roundDimensionsTo ?? 1,
          );
          const description = {
            width: targetWidth,
            height: targetHeight,
            fit: options.fit ?? "fill",
            rotation,
            crop: finalCrop ?? {
              left: 0,
              top: 0,
              width: rotatedWidth,
              height: rotatedHeight,
            },
            alpha: options.alpha ?? "keep",
          };
          for (const transformer of registeredVideoSampleTransformers) {
            let result = transformer(this, description);
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(result))
              result = await result;
            if (result !== null) {
              return result;
            }
          }
          const { canvas, context, isNew } = getTransformationCanvas(
            description.width,
            description.height,
          );
          this._drawWithFitAndMipmapping(canvas, context, {
            fit: description.fit,
            rotation: description.rotation,
            crop: description.crop,
            targetIsFresh: isNew,
            fillBlack: description.alpha === "discard",
          });
          return new VideoSample(canvas, {
            timestamp: this.timestamp,
            duration: this.duration,
            rotation: 0,
            // Any previous rotation is now baked in
          });
        }
        /** Sets the rotation metadata of this video sample. */
        setRotation(newRotation) {
          if (![0, 90, 180, 270].includes(newRotation)) {
            throw new TypeError("newRotation must be 0, 90, 180, or 270.");
          }
          this.rotation = newRotation;
        }
        /** Sets the presentation timestamp of this video sample, in seconds. */
        setTimestamp(newTimestamp) {
          if (!Number.isFinite(newTimestamp)) {
            throw new TypeError("newTimestamp must be a number.");
          }
          this.timestamp = newTimestamp;
        }
        /** Sets the duration of this video sample, in seconds. */
        setDuration(newDuration) {
          if (!Number.isFinite(newDuration) || newDuration < 0) {
            throw new TypeError("newDuration must be a non-negative number.");
          }
          this.duration = newDuration;
        }
        /** Sets the encode options used when this sample is passed to an encoder. */
        setEncodeOptions(newEncodeOptions) {
          if (!newEncodeOptions || typeof newEncodeOptions !== "object") {
            throw new TypeError("newEncodeOptions must be an object.");
          }
          this.encodeOptions = newEncodeOptions;
        }
        /** Calls `.close()`. */
        [Symbol.dispose]() {
          this.close();
        }
      }
      const registeredVideoSampleTransformers = [];
      const registerVideoSampleTransformer = (transformer) => {
        if (registeredVideoSampleTransformers.includes(transformer)) {
          return;
        }
        registeredVideoSampleTransformers.push(transformer);
      };
      const TRANSFORMATION_CANVAS_CACHE_MAX_SIZE = 3;
      const transformationCanvasCache = [];
      let transformationCanvasCacheNextAge = 0;
      const getTransformationCanvas = (width, height) => {
        for (const entry of transformationCanvasCache) {
          if (entry.canvas.width === width && entry.canvas.height === height) {
            entry.age = transformationCanvasCacheNextAge++;
            return {
              canvas: entry.canvas,
              context: entry.context,
              isNew: false,
            };
          }
        }
        let canvas;
        if (typeof OffscreenCanvas !== "undefined") {
          canvas = new OffscreenCanvas(width, height);
        } else {
          if (
            typeof window === "undefined" ||
            typeof document === "undefined"
          ) {
            throw new Error(
              "Cannot transform VideoSamples in this environment. Either run in an environment with OffscreenCanvas or HTMLCanvasElement, or supply a custom VideoSample transformer using registerVideoSampleTransformer().",
            );
          }
          canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
        }
        const context = canvas.getContext("2d", {
          alpha: true,
          willReadFrequently: false,
        });
        if (!context) {
          throw new Error(
            "The '2d' canvas context is required to transform VideoSamples. Register a custom transformer using registerVideoSampleTransformer to work around this limitation.",
          );
        }
        if (
          transformationCanvasCache.length >=
          TRANSFORMATION_CANVAS_CACHE_MAX_SIZE
        ) {
          transformationCanvasCache.splice(
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Yg)(
              transformationCanvasCache,
              (x) => x.age,
            ),
            1,
          );
        }
        transformationCanvasCache.push({
          canvas,
          context,
          age: transformationCanvasCacheNextAge++,
        });
        return { canvas, context, isNew: true };
      };
      class VideoSampleColorSpace {
        /** Creates a new VideoSampleColorSpace. */
        constructor(init) {
          if (init !== void 0) {
            if (!init || typeof init !== "object") {
              throw new TypeError(
                "init.colorSpace, when provided, must be an object.",
              );
            }
            const primariesValues = Object.keys(
              _misc_js__WEBPACK_IMPORTED_MODULE_0__.wd,
            );
            if (
              init.primaries != null &&
              !primariesValues.includes(init.primaries)
            ) {
              throw new TypeError(
                "init.colorSpace.primaries, when provided, must be one of ".concat(
                  primariesValues.join(", "),
                  ".",
                ),
              );
            }
            const transferValues = Object.keys(
              _misc_js__WEBPACK_IMPORTED_MODULE_0__.uN,
            );
            if (
              init.transfer != null &&
              !transferValues.includes(init.transfer)
            ) {
              throw new TypeError(
                "init.colorSpace.transfer, when provided, must be one of ".concat(
                  transferValues.join(", "),
                  ".",
                ),
              );
            }
            const matrixValues = Object.keys(
              _misc_js__WEBPACK_IMPORTED_MODULE_0__.Au,
            );
            if (init.matrix != null && !matrixValues.includes(init.matrix)) {
              throw new TypeError(
                "init.colorSpace.matrix, when provided, must be one of ".concat(
                  matrixValues.join(", "),
                  ".",
                ),
              );
            }
            if (init.fullRange != null && typeof init.fullRange !== "boolean") {
              throw new TypeError(
                "init.colorSpace.fullRange, when provided, must be a boolean.",
              );
            }
          }
          this.primaries = init?.primaries ?? null;
          this.transfer = init?.transfer ?? null;
          this.matrix = init?.matrix ?? null;
          this.fullRange = init?.fullRange ?? null;
        }
        /** Serializes the color space to a JSON object. */
        toJSON() {
          return {
            primaries: this.primaries,
            transfer: this.transfer,
            matrix: this.matrix,
            fullRange: this.fullRange,
          };
        }
      }
      const isVideoFrame = (x) => {
        return typeof VideoFrame !== "undefined" && x instanceof VideoFrame;
      };
      const clampCropRectangle = (crop, outerWidth, outerHeight) => {
        const left = Math.min(crop.left, outerWidth);
        const top = Math.min(crop.top, outerHeight);
        const width = Math.min(crop.width, outerWidth - left);
        const height = Math.min(crop.height, outerHeight - top);
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(width >= 0);
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(height >= 0);
        return { left, top, width, height };
      };
      const validateCropRectangle = (crop, prefix) => {
        if (!crop || typeof crop !== "object") {
          throw new TypeError(
            prefix + "crop, when provided, must be an object.",
          );
        }
        if (!Number.isInteger(crop.left) || crop.left < 0) {
          throw new TypeError(
            prefix + "crop.left must be a non-negative integer.",
          );
        }
        if (!Number.isInteger(crop.top) || crop.top < 0) {
          throw new TypeError(
            prefix + "crop.top must be a non-negative integer.",
          );
        }
        if (!Number.isInteger(crop.width) || crop.width < 0) {
          throw new TypeError(
            prefix + "crop.width must be a non-negative integer.",
          );
        }
        if (!Number.isInteger(crop.height) || crop.height < 0) {
          throw new TypeError(
            prefix + "crop.height must be a non-negative integer.",
          );
        }
      };
      const validateVideoFrameCopyToOptions = (options) => {
        if (!options || typeof options !== "object") {
          throw new TypeError("options must be an object.");
        }
        if (
          options.colorSpace !== void 0 &&
          !["display-p3", "srgb"].includes(options.colorSpace)
        ) {
          throw new TypeError(
            "options.colorSpace, when provided, must be 'display-p3' or 'srgb'.",
          );
        }
        if (options.format !== void 0 && typeof options.format !== "string") {
          throw new TypeError(
            "options.format, when provided, must be a string.",
          );
        }
        if (options.layout !== void 0) {
          if (!Array.isArray(options.layout)) {
            throw new TypeError(
              "options.layout, when provided, must be an array.",
            );
          }
          for (const plane of options.layout) {
            if (!plane || typeof plane !== "object") {
              throw new TypeError(
                "Each entry in options.layout must be an object.",
              );
            }
            if (!Number.isInteger(plane.offset) || plane.offset < 0) {
              throw new TypeError(
                "plane.offset must be a non-negative integer.",
              );
            }
            if (!Number.isInteger(plane.stride) || plane.stride < 0) {
              throw new TypeError(
                "plane.stride must be a non-negative integer.",
              );
            }
          }
        }
        if (options.rect !== void 0) {
          if (!options.rect || typeof options.rect !== "object") {
            throw new TypeError(
              "options.rect, when provided, must be an object.",
            );
          }
          if (
            options.rect.x !== void 0 &&
            (!Number.isInteger(options.rect.x) || options.rect.x < 0)
          ) {
            throw new TypeError(
              "options.rect.x, when provided, must be a non-negative integer.",
            );
          }
          if (
            options.rect.y !== void 0 &&
            (!Number.isInteger(options.rect.y) || options.rect.y < 0)
          ) {
            throw new TypeError(
              "options.rect.y, when provided, must be a non-negative integer.",
            );
          }
          if (
            options.rect.width !== void 0 &&
            (!Number.isInteger(options.rect.width) || options.rect.width < 0)
          ) {
            throw new TypeError(
              "options.rect.width, when provided, must be a non-negative integer.",
            );
          }
          if (
            options.rect.height !== void 0 &&
            (!Number.isInteger(options.rect.height) || options.rect.height < 0)
          ) {
            throw new TypeError(
              "options.rect.height, when provided, must be a non-negative integer.",
            );
          }
        }
      };
      const createDefaultPlaneLayout = (format, codedWidth, codedHeight) => {
        const planes = getPlaneConfigs(format);
        const layouts = [];
        let currentOffset = 0;
        for (const plane of planes) {
          const planeWidth = Math.ceil(codedWidth / plane.widthDivisor);
          const planeHeight = Math.ceil(codedHeight / plane.heightDivisor);
          const stride = planeWidth * plane.sampleBytes;
          const planeSize = stride * planeHeight;
          layouts.push({
            offset: currentOffset,
            stride,
          });
          currentOffset += planeSize;
        }
        return layouts;
      };
      const getPlaneConfigs = (format) => {
        const yuv = (yBytes, uvBytes, subX, subY, hasAlpha) => {
          const configs = [
            { sampleBytes: yBytes, widthDivisor: 1, heightDivisor: 1 },
            { sampleBytes: uvBytes, widthDivisor: subX, heightDivisor: subY },
            { sampleBytes: uvBytes, widthDivisor: subX, heightDivisor: subY },
          ];
          if (hasAlpha) {
            configs.push({
              sampleBytes: yBytes,
              widthDivisor: 1,
              heightDivisor: 1,
            });
          }
          return configs;
        };
        switch (format) {
          case "I420":
            return yuv(1, 1, 2, 2, false);
          case "I420P10":
          case "I420P12":
            return yuv(2, 2, 2, 2, false);
          case "I420A":
            return yuv(1, 1, 2, 2, true);
          case "I420AP10":
          case "I420AP12":
            return yuv(2, 2, 2, 2, true);
          case "I422":
            return yuv(1, 1, 2, 1, false);
          case "I422P10":
          case "I422P12":
            return yuv(2, 2, 2, 1, false);
          case "I422A":
            return yuv(1, 1, 2, 1, true);
          case "I422AP10":
          case "I422AP12":
            return yuv(2, 2, 2, 1, true);
          case "I444":
            return yuv(1, 1, 1, 1, false);
          case "I444P10":
          case "I444P12":
            return yuv(2, 2, 1, 1, false);
          case "I444A":
            return yuv(1, 1, 1, 1, true);
          case "I444AP10":
          case "I444AP12":
            return yuv(2, 2, 1, 1, true);
          case "NV12":
            return [
              { sampleBytes: 1, widthDivisor: 1, heightDivisor: 1 },
              { sampleBytes: 2, widthDivisor: 2, heightDivisor: 2 },
              // Interleaved U and V
            ];
          case "RGBA":
          case "RGBX":
          case "BGRA":
          case "BGRX":
            return [{ sampleBytes: 4, widthDivisor: 1, heightDivisor: 1 }];
          default:
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.xb)(format);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(false);
        }
      };
      const ParseVideoFrameCopyToOptions = (sample, options) => {
        const defaultRect = {
          left: 0,
          top: 0,
          width: sample.codedWidth,
          height: sample.codedHeight,
        };
        const overrideRect = options.rect;
        const parsedRect = ParseVisibleRect(
          defaultRect,
          overrideRect,
          sample.codedWidth,
          sample.codedHeight,
          sample.format,
        );
        const optLayout = options.layout;
        let format;
        if (!options.format || options.format === sample.format) {
          format = sample.format;
        } else if (["RGBA", "RGBX", "BGRA", "BGRX"].includes(options.format)) {
          format = options.format;
        } else {
          throw new Error("NotSupportedError: Invalid destination format.");
        }
        return ComputeLayoutAndAllocationSize(parsedRect, format, optLayout);
      };
      const ParseVisibleRect = (
        defaultRect,
        overrideRect,
        codedWidth,
        codedHeight,
        format,
      ) => {
        const sourceRect = { ...defaultRect };
        if (overrideRect !== void 0) {
          if (overrideRect.width === 0 || overrideRect.height === 0) {
            throw new TypeError("visibleRect dimensions cannot be zero.");
          }
          if ((overrideRect.x || 0) + (overrideRect.width || 0) > codedWidth) {
            throw new TypeError("visibleRect exceeds codedWidth.");
          }
          if (
            (overrideRect.y || 0) + (overrideRect.height || 0) >
            codedHeight
          ) {
            throw new TypeError("visibleRect exceeds codedHeight.");
          }
          sourceRect.x = overrideRect.x || 0;
          sourceRect.y = overrideRect.y || 0;
          sourceRect.width = overrideRect.width || 0;
          sourceRect.height = overrideRect.height || 0;
        }
        const validAlignment = VerifyRectOffsetAlignment(format, sourceRect);
        if (!validAlignment) {
          throw new TypeError(
            "visibleRect alignment is invalid for the format.",
          );
        }
        return sourceRect;
      };
      const VerifyRectOffsetAlignment = (format, rect) => {
        if (format === null) return true;
        const planes = getPlaneConfigs(format);
        for (let planeIndex = 0; planeIndex < planes.length; planeIndex++) {
          const plane = planes[planeIndex];
          const sampleWidth = plane.widthDivisor;
          const sampleHeight = plane.heightDivisor;
          if ((rect.x || 0) % sampleWidth !== 0) return false;
          if ((rect.y || 0) % sampleHeight !== 0) return false;
        }
        return true;
      };
      const ComputeLayoutAndAllocationSize = (parsedRect, format, layout) => {
        const planes = getPlaneConfigs(format);
        const numPlanes = planes.length;
        if (layout !== void 0 && layout.length !== numPlanes) {
          throw new TypeError(
            "Layout must have ".concat(numPlanes, " planes."),
          );
        }
        let minAllocationSize = 0;
        const computedLayouts = [];
        const endOffsets = [];
        for (let planeIndex = 0; planeIndex < numPlanes; planeIndex++) {
          const plane = planes[planeIndex];
          const sampleBytes = plane.sampleBytes;
          const sampleWidth = plane.widthDivisor;
          const sampleHeight = plane.heightDivisor;
          const computedLayout = {
            destinationOffset: 0,
            destinationStride: 0,
            sourceTop: 0,
            sourceHeight: 0,
            sourceLeftBytes: 0,
            sourceWidthBytes: 0,
          };
          computedLayout.sourceTop = Math.ceil(
            Math.trunc(parsedRect.y || 0) / sampleHeight,
          );
          computedLayout.sourceHeight = Math.ceil(
            Math.trunc(parsedRect.height || 0) / sampleHeight,
          );
          computedLayout.sourceLeftBytes =
            Math.floor(Math.trunc(parsedRect.x || 0) / sampleWidth) *
            sampleBytes;
          computedLayout.sourceWidthBytes =
            Math.floor(Math.trunc(parsedRect.width || 0) / sampleWidth) *
            sampleBytes;
          if (layout !== void 0) {
            const planeLayout = layout[planeIndex];
            if (planeLayout.stride < computedLayout.sourceWidthBytes) {
              throw new TypeError(
                "Stride for plane ".concat(planeIndex, " is too small."),
              );
            }
            computedLayout.destinationOffset = planeLayout.offset;
            computedLayout.destinationStride = planeLayout.stride;
          } else {
            computedLayout.destinationOffset = minAllocationSize;
            computedLayout.destinationStride = computedLayout.sourceWidthBytes;
          }
          const planeSize =
            computedLayout.destinationStride * computedLayout.sourceHeight;
          const planeEnd = planeSize + computedLayout.destinationOffset;
          if (planeEnd > 4294967295) {
            throw new TypeError("Allocation size exceeds limit.");
          }
          endOffsets.push(planeEnd);
          minAllocationSize = Math.max(minAllocationSize, planeEnd);
          for (
            let earlierPlaneIndex = 0;
            earlierPlaneIndex < planeIndex;
            earlierPlaneIndex++
          ) {
            const earlierLayout = computedLayouts[earlierPlaneIndex];
            if (
              endOffsets[planeIndex] <= earlierLayout.destinationOffset ||
              endOffsets[earlierPlaneIndex] <= computedLayout.destinationOffset
            ) {
              continue;
            }
            throw new TypeError("Planes overlap.");
          }
          computedLayouts.push(computedLayout);
        }
        return {
          allocationSize: minAllocationSize,
          computedLayouts,
        };
      };
      const AUDIO_SAMPLE_FORMATS = /* @__PURE__ */ new Set([
        "f32",
        "f32-planar",
        "s16",
        "s16-planar",
        "s32",
        "s32-planar",
        "u8",
        "u8-planar",
      ]);
      class AudioSampleResource {
        constructor() {
          this._referenceCount = 0;
        }
      }
      class AudioSample {
        /** The presentation timestamp of the sample in microseconds. */
        get microsecondTimestamp() {
          return Math.trunc(
            _misc_js__WEBPACK_IMPORTED_MODULE_0__.MW * this.timestamp,
          );
        }
        /** The duration of the sample in microseconds. */
        get microsecondDuration() {
          return Math.trunc(
            _misc_js__WEBPACK_IMPORTED_MODULE_0__.MW * this.duration,
          );
        }
        constructor(init) {
          this._closed = false;
          if (isAudioData(init)) {
            if (init.format === null) {
              throw new TypeError(
                "AudioData with null format is not supported.",
              );
            }
            this._data = init;
            this.format = init.format;
            this.sampleRate = init.sampleRate;
            this.numberOfFrames = init.numberOfFrames;
            this.numberOfChannels = init.numberOfChannels;
            this.timestamp = init.timestamp / 1e6;
            this.duration = init.numberOfFrames / init.sampleRate;
          } else if (init instanceof AudioSampleResource) {
            this._data = init;
            init._referenceCount++;
            this.format = init.getFormat();
            if (!AUDIO_SAMPLE_FORMATS.has(this.format)) {
              throw new TypeError(
                "getFormat() must return an AudioSampleFormat.",
              );
            }
            this.sampleRate = init.getSampleRate();
            if (!Number.isInteger(this.sampleRate) || this.sampleRate <= 0) {
              throw new TypeError(
                "getSampleRate() must return a positive integer.",
              );
            }
            this.numberOfFrames = init.getNumberOfFrames();
            if (
              !Number.isInteger(this.numberOfFrames) ||
              this.numberOfFrames < 0
            ) {
              throw new TypeError(
                "getNumberOfFrames() must return a non-negative integer.",
              );
            }
            this.numberOfChannels = init.getNumberOfChannels();
            if (
              !Number.isInteger(this.numberOfChannels) ||
              this.numberOfChannels <= 0
            ) {
              throw new TypeError(
                "getNumberOfChannels() must return a positive integer.",
              );
            }
            this.timestamp = init.getTimestamp();
            if (!Number.isFinite(this.timestamp)) {
              throw new TypeError(
                "getTimestamp() must return a finite number.",
              );
            }
            this.duration = this.numberOfFrames / this.sampleRate;
          } else {
            if (!init || typeof init !== "object") {
              throw new TypeError("Invalid AudioDataInit: must be an object.");
            }
            if (!AUDIO_SAMPLE_FORMATS.has(init.format)) {
              throw new TypeError("Invalid AudioDataInit: invalid format.");
            }
            if (!Number.isFinite(init.sampleRate) || init.sampleRate <= 0) {
              throw new TypeError(
                "Invalid AudioDataInit: sampleRate must be > 0.",
              );
            }
            if (
              !Number.isInteger(init.numberOfChannels) ||
              init.numberOfChannels === 0
            ) {
              throw new TypeError(
                "Invalid AudioDataInit: numberOfChannels must be an integer > 0.",
              );
            }
            if (!Number.isFinite(init?.timestamp)) {
              throw new TypeError("init.timestamp must be a number.");
            }
            const numberOfFrames =
              init.data.byteLength /
              (getBytesPerSample(init.format) * init.numberOfChannels);
            if (!Number.isInteger(numberOfFrames)) {
              throw new TypeError(
                "Invalid AudioDataInit: data size is not a multiple of frame size.",
              );
            }
            this.format = init.format;
            this.sampleRate = init.sampleRate;
            this.numberOfFrames = numberOfFrames;
            this.numberOfChannels = init.numberOfChannels;
            this.timestamp = init.timestamp;
            this.duration = numberOfFrames / init.sampleRate;
            let dataBuffer;
            if (init.data instanceof ArrayBuffer) {
              dataBuffer = new Uint8Array(init.data);
            } else if (ArrayBuffer.isView(init.data)) {
              dataBuffer = new Uint8Array(
                init.data.buffer,
                init.data.byteOffset,
                init.data.byteLength,
              );
            } else {
              throw new TypeError(
                "Invalid AudioDataInit: data is not a BufferSource.",
              );
            }
            const expectedSize =
              this.numberOfFrames *
              this.numberOfChannels *
              getBytesPerSample(this.format);
            if (dataBuffer.byteLength < expectedSize) {
              throw new TypeError(
                "Invalid AudioDataInit: insufficient data size.",
              );
            }
            this._data = dataBuffer;
          }
          finalizationRegistry?.register(
            this,
            { type: "audio", data: this._data },
            this,
          );
        }
        /** Returns the number of bytes required to hold the audio sample's data as specified by the given options. */
        allocationSize(options) {
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (!Number.isInteger(options.planeIndex) || options.planeIndex < 0) {
            throw new TypeError("planeIndex must be a non-negative integer.");
          }
          if (
            options.format !== void 0 &&
            !AUDIO_SAMPLE_FORMATS.has(options.format)
          ) {
            throw new TypeError("Invalid format.");
          }
          if (
            options.frameOffset !== void 0 &&
            (!Number.isInteger(options.frameOffset) || options.frameOffset < 0)
          ) {
            throw new TypeError("frameOffset must be a non-negative integer.");
          }
          if (
            options.frameCount !== void 0 &&
            (!Number.isInteger(options.frameCount) || options.frameCount < 0)
          ) {
            throw new TypeError("frameCount must be a non-negative integer.");
          }
          if (this._closed) {
            throw new Error("AudioSample is closed.");
          }
          const destFormat = options.format ?? this.format;
          const frameOffset = options.frameOffset ?? 0;
          if (frameOffset >= this.numberOfFrames) {
            throw new RangeError("frameOffset out of range");
          }
          const copyFrameCount =
            options.frameCount !== void 0
              ? options.frameCount
              : this.numberOfFrames - frameOffset;
          if (copyFrameCount > this.numberOfFrames - frameOffset) {
            throw new RangeError("frameCount out of range");
          }
          const bytesPerSample = getBytesPerSample(destFormat);
          const isPlanar = formatIsPlanar(destFormat);
          if (isPlanar && options.planeIndex >= this.numberOfChannels) {
            throw new RangeError("planeIndex out of range");
          }
          if (!isPlanar && options.planeIndex !== 0) {
            throw new RangeError("planeIndex out of range");
          }
          const elementCount = isPlanar
            ? copyFrameCount
            : copyFrameCount * this.numberOfChannels;
          return elementCount * bytesPerSample;
        }
        /** Copies the audio sample's data to an ArrayBuffer or ArrayBufferView as specified by the given options. */
        copyTo(destination, options) {
          if (!(0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.SM)(destination)) {
            throw new TypeError(
              "destination must be an ArrayBuffer or an ArrayBuffer view.",
            );
          }
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (!Number.isInteger(options.planeIndex) || options.planeIndex < 0) {
            throw new TypeError("planeIndex must be a non-negative integer.");
          }
          if (
            options.format !== void 0 &&
            !AUDIO_SAMPLE_FORMATS.has(options.format)
          ) {
            throw new TypeError("Invalid format.");
          }
          if (
            options.frameOffset !== void 0 &&
            (!Number.isInteger(options.frameOffset) || options.frameOffset < 0)
          ) {
            throw new TypeError("frameOffset must be a non-negative integer.");
          }
          if (
            options.frameCount !== void 0 &&
            (!Number.isInteger(options.frameCount) || options.frameCount < 0)
          ) {
            throw new TypeError("frameCount must be a non-negative integer.");
          }
          if (this._closed) {
            throw new Error("AudioSample is closed.");
          }
          const {
            format,
            frameCount: optFrameCount,
            frameOffset: optFrameOffset,
          } = options;
          let { planeIndex } = options;
          let srcFormat = this.format;
          const destFormat = format ?? this.format;
          if (!destFormat) throw new Error("Destination format not determined");
          const numFrames = this.numberOfFrames;
          const numChannels = this.numberOfChannels;
          const frameOffset = optFrameOffset ?? 0;
          if (frameOffset >= numFrames) {
            throw new RangeError("frameOffset out of range");
          }
          const copyFrameCount =
            optFrameCount !== void 0 ? optFrameCount : numFrames - frameOffset;
          if (copyFrameCount > numFrames - frameOffset) {
            throw new RangeError("frameCount out of range");
          }
          const destBytesPerSample = getBytesPerSample(destFormat);
          const destIsPlanar = formatIsPlanar(destFormat);
          if (destIsPlanar && planeIndex >= numChannels) {
            throw new RangeError("planeIndex out of range");
          }
          if (!destIsPlanar && planeIndex !== 0) {
            throw new RangeError("planeIndex out of range");
          }
          const destElementCount = destIsPlanar
            ? copyFrameCount
            : copyFrameCount * numChannels;
          const requiredSize = destElementCount * destBytesPerSample;
          if (destination.byteLength < requiredSize) {
            throw new RangeError("Destination buffer is too small");
          }
          const destView = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(
            destination,
          );
          const writeFn = getWriteFunction(destFormat);
          if (isAudioData(this._data)) {
            if (
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Tc)() &&
              numChannels > 2 &&
              destFormat !== srcFormat
            ) {
              doAudioDataCopyToWebKitWorkaround(
                this._data,
                destView,
                srcFormat,
                destFormat,
                numChannels,
                planeIndex,
                frameOffset,
                copyFrameCount,
              );
              return;
            } else {
              try {
                this._data.copyTo(destination, {
                  planeIndex,
                  frameOffset,
                  frameCount: copyFrameCount,
                  format: destFormat,
                });
                return;
              } catch (error) {
                if (destFormat === "f32-planar") {
                  throw error;
                }
                srcFormat = "f32-planar";
              }
            }
          }
          const readFn = getReadFunction(srcFormat);
          const srcBytesPerSample = getBytesPerSample(srcFormat);
          const srcIsPlanar = formatIsPlanar(srcFormat);
          let uint8Data;
          if (this._data instanceof AudioSampleResource) {
            const getDataPlaneValidated = (index) => {
              const result = this._data.getDataPlane(index);
              if (!(result instanceof Uint8Array)) {
                throw new TypeError("getDataPlane() must return a Uint8Array.");
              }
              const expectedSize =
                numFrames * srcBytesPerSample * (srcIsPlanar ? 1 : numChannels);
              if (result.byteLength !== expectedSize) {
                throw new TypeError(
                  "Data plane "
                    .concat(index, " has invalid size. Expected exactly ")
                    .concat(expectedSize, " bytes, got") +
                    " ".concat(result.byteLength, " bytes."),
                );
              }
              return result;
            };
            if (srcIsPlanar) {
              if (destIsPlanar) {
                uint8Data = getDataPlaneValidated(planeIndex);
                planeIndex = 0;
              } else {
                uint8Data = new Uint8Array(
                  numFrames * srcBytesPerSample * numChannels,
                );
                for (let ch = 0; ch < numChannels; ch++) {
                  const planeData = getDataPlaneValidated(ch);
                  uint8Data.set(planeData, ch * numFrames * srcBytesPerSample);
                }
              }
            } else {
              uint8Data = getDataPlaneValidated(0);
            }
          } else if (this._data instanceof Uint8Array) {
            uint8Data = this._data;
          } else {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(
              srcFormat === "f32-planar",
            );
            if (destIsPlanar) {
              uint8Data = new Uint8Array(
                this._data.allocationSize({
                  format: "f32-planar",
                  planeIndex,
                }),
              );
              this._data.copyTo(uint8Data, {
                format: "f32-planar",
                planeIndex,
              });
              planeIndex = 0;
            } else {
              uint8Data = new Uint8Array(
                this._data.allocationSize({
                  format: "f32-planar",
                  planeIndex: 0,
                }) * numChannels,
              );
              for (let ch = 0; ch < numChannels; ch++) {
                this._data.copyTo(
                  uint8Data.subarray(
                    ch * numFrames * srcBytesPerSample,
                    (ch + 1) * numFrames * srcBytesPerSample,
                  ),
                  {
                    format: "f32-planar",
                    planeIndex: ch,
                  },
                );
              }
            }
          }
          const srcView = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(
            uint8Data,
          );
          for (let i = 0; i < copyFrameCount; i++) {
            if (destIsPlanar) {
              const destOffset = i * destBytesPerSample;
              let srcOffset;
              if (srcIsPlanar) {
                srcOffset =
                  (planeIndex * numFrames + (i + frameOffset)) *
                  srcBytesPerSample;
              } else {
                srcOffset =
                  ((i + frameOffset) * numChannels + planeIndex) *
                  srcBytesPerSample;
              }
              const normalized = readFn(srcView, srcOffset);
              writeFn(destView, destOffset, normalized);
            } else {
              for (let ch = 0; ch < numChannels; ch++) {
                const destIndex = i * numChannels + ch;
                const destOffset = destIndex * destBytesPerSample;
                let srcOffset;
                if (srcIsPlanar) {
                  srcOffset =
                    (ch * numFrames + (i + frameOffset)) * srcBytesPerSample;
                } else {
                  srcOffset =
                    ((i + frameOffset) * numChannels + ch) * srcBytesPerSample;
                }
                const normalized = readFn(srcView, srcOffset);
                writeFn(destView, destOffset, normalized);
              }
            }
          }
        }
        /** Clones this audio sample. */
        clone() {
          if (this._closed) {
            throw new Error("AudioSample is closed.");
          }
          if (this._data instanceof AudioSampleResource) {
            const sample = new AudioSample(this._data);
            sample.setTimestamp(this.timestamp);
            return sample;
          } else if (isAudioData(this._data)) {
            const sample = new AudioSample(this._data.clone());
            sample.setTimestamp(this.timestamp);
            return sample;
          } else {
            return new AudioSample({
              format: this.format,
              sampleRate: this.sampleRate,
              numberOfFrames: this.numberOfFrames,
              numberOfChannels: this.numberOfChannels,
              timestamp: this.timestamp,
              data: this._data,
            });
          }
        }
        /**
         * Returns a new {@link AudioSample} containing only the frames in the range [startSample, endSample). Both bounds
         * must lie within this sample's range of frames. The returned sample's timestamp is shifted to match the start of
         * the trimmed section.
         */
        trim(startSample, endSample = this.numberOfFrames) {
          if (!Number.isInteger(startSample) || startSample < 0) {
            throw new TypeError("startSample must be a non-negative integer.");
          }
          if (!Number.isInteger(endSample) || endSample < 0) {
            throw new TypeError("endSample must be a non-negative integer.");
          }
          if (startSample > this.numberOfFrames) {
            throw new RangeError("startSample out of range.");
          }
          if (endSample > this.numberOfFrames) {
            throw new RangeError("endSample out of range.");
          }
          if (endSample < startSample) {
            throw new RangeError(
              "endSample must not be less than startSample.",
            );
          }
          if (this._closed) {
            throw new Error("AudioSample is closed.");
          }
          const frameCount = endSample - startSample;
          const bytesPerSample = getBytesPerSample(this.format);
          let data;
          if (formatIsPlanar(this.format)) {
            const planeSize = frameCount * bytesPerSample;
            data = new Uint8Array(planeSize * this.numberOfChannels);
            if (frameCount > 0) {
              for (let i = 0; i < this.numberOfChannels; i++) {
                this.copyTo(data.subarray(i * planeSize, (i + 1) * planeSize), {
                  planeIndex: i,
                  format: this.format,
                  frameOffset: startSample,
                  frameCount,
                });
              }
            }
          } else {
            data = new Uint8Array(
              frameCount * this.numberOfChannels * bytesPerSample,
            );
            if (frameCount > 0) {
              this.copyTo(data, {
                planeIndex: 0,
                format: this.format,
                frameOffset: startSample,
                frameCount,
              });
            }
          }
          return new AudioSample({
            data,
            format: this.format,
            sampleRate: this.sampleRate,
            numberOfChannels: this.numberOfChannels,
            timestamp: this.timestamp + startSample / this.sampleRate,
          });
        }
        /**
         * Closes this audio sample, releasing held resources. Audio samples should be closed as soon as they are not
         * needed anymore.
         */
        close() {
          if (this._closed) {
            return;
          }
          finalizationRegistry?.unregister(this);
          if (this._data instanceof AudioSampleResource) {
            this._data._referenceCount--;
            if (this._data._referenceCount === 0) {
              this._data.close();
            }
          } else if (isAudioData(this._data)) {
            this._data.close();
          } else {
            this._data = new Uint8Array(0);
          }
          this._closed = true;
        }
        /**
         * Converts this audio sample to an AudioData for use with the WebCodecs API. The AudioData returned by this
         * method *must* be closed separately from this audio sample.
         */
        toAudioData() {
          if (this._closed) {
            throw new Error("AudioSample is closed.");
          }
          if (this._data instanceof AudioSampleResource) {
            return this._createAudioDataFromData();
          } else if (isAudioData(this._data)) {
            if (this._data.timestamp === this.microsecondTimestamp) {
              return this._data.clone();
            } else {
              return this._createAudioDataFromData();
            }
          } else {
            return new AudioData({
              format: this.format,
              sampleRate: this.sampleRate,
              numberOfFrames: this.numberOfFrames,
              numberOfChannels: this.numberOfChannels,
              timestamp: this.microsecondTimestamp,
              data:
                this._data.buffer instanceof ArrayBuffer
                  ? this._data.buffer
                  : this._data.slice(),
              // In the case of SharedArrayBuffer, convert to ArrayBuffer
            });
          }
        }
        /** @internal */
        _createAudioDataFromData() {
          if (formatIsPlanar(this.format)) {
            const size = this.allocationSize({
              planeIndex: 0,
              format: this.format,
            });
            const data = new ArrayBuffer(size * this.numberOfChannels);
            for (let i = 0; i < this.numberOfChannels; i++) {
              this.copyTo(new Uint8Array(data, i * size, size), {
                planeIndex: i,
                format: this.format,
              });
            }
            return new AudioData({
              format: this.format,
              sampleRate: this.sampleRate,
              numberOfFrames: this.numberOfFrames,
              numberOfChannels: this.numberOfChannels,
              timestamp: this.microsecondTimestamp,
              data,
            });
          } else {
            const data = new ArrayBuffer(
              this.allocationSize({ planeIndex: 0, format: this.format }),
            );
            this.copyTo(data, { planeIndex: 0, format: this.format });
            return new AudioData({
              format: this.format,
              sampleRate: this.sampleRate,
              numberOfFrames: this.numberOfFrames,
              numberOfChannels: this.numberOfChannels,
              timestamp: this.microsecondTimestamp,
              data,
            });
          }
        }
        /** Convert this audio sample to an AudioBuffer for use with the Web Audio API. */
        toAudioBuffer() {
          if (this._closed) {
            throw new Error("AudioSample is closed.");
          }
          const audioBuffer = new AudioBuffer({
            numberOfChannels: this.numberOfChannels,
            length: this.numberOfFrames,
            sampleRate: this.sampleRate,
          });
          const dataBytes = new Float32Array(
            this.allocationSize({ planeIndex: 0, format: "f32-planar" }) / 4,
          );
          for (let i = 0; i < this.numberOfChannels; i++) {
            this.copyTo(dataBytes, { planeIndex: i, format: "f32-planar" });
            audioBuffer.copyToChannel(dataBytes, i);
          }
          return audioBuffer;
        }
        /** Sets the presentation timestamp of this audio sample, in seconds. */
        setTimestamp(newTimestamp) {
          if (!Number.isFinite(newTimestamp)) {
            throw new TypeError("newTimestamp must be a number.");
          }
          this.timestamp = newTimestamp;
        }
        /** Calls `.close()`. */
        [Symbol.dispose]() {
          this.close();
        }
        /** @internal */
        static *_fromAudioBuffer(audioBuffer, timestamp) {
          if (!(audioBuffer instanceof AudioBuffer)) {
            throw new TypeError("audioBuffer must be an AudioBuffer.");
          }
          const MAX_FLOAT_COUNT = 48e3 * 5;
          const numberOfChannels = audioBuffer.numberOfChannels;
          const sampleRate = audioBuffer.sampleRate;
          const totalFrames = audioBuffer.length;
          const maxFramesPerChunk = Math.floor(
            MAX_FLOAT_COUNT / numberOfChannels,
          );
          let currentRelativeFrame = 0;
          let remainingFrames = totalFrames;
          while (remainingFrames > 0) {
            const framesToCopy = Math.min(maxFramesPerChunk, remainingFrames);
            const chunkData = new Float32Array(numberOfChannels * framesToCopy);
            for (let channel = 0; channel < numberOfChannels; channel++) {
              audioBuffer.copyFromChannel(
                chunkData.subarray(
                  channel * framesToCopy,
                  (channel + 1) * framesToCopy,
                ),
                channel,
                currentRelativeFrame,
              );
            }
            yield new AudioSample({
              format: "f32-planar",
              sampleRate,
              numberOfFrames: framesToCopy,
              numberOfChannels,
              timestamp: timestamp + currentRelativeFrame / sampleRate,
              data: chunkData,
            });
            currentRelativeFrame += framesToCopy;
            remainingFrames -= framesToCopy;
          }
        }
        /**
         * Creates AudioSamples from an AudioBuffer, starting at the given timestamp in seconds. Typically creates exactly
         * one sample, but may create multiple if the AudioBuffer is exceedingly large.
         */
        static fromAudioBuffer(audioBuffer, timestamp) {
          if (!(audioBuffer instanceof AudioBuffer)) {
            throw new TypeError("audioBuffer must be an AudioBuffer.");
          }
          const MAX_FLOAT_COUNT = 48e3 * 5;
          const numberOfChannels = audioBuffer.numberOfChannels;
          const sampleRate = audioBuffer.sampleRate;
          const totalFrames = audioBuffer.length;
          const maxFramesPerChunk = Math.floor(
            MAX_FLOAT_COUNT / numberOfChannels,
          );
          let currentRelativeFrame = 0;
          let remainingFrames = totalFrames;
          const result = [];
          while (remainingFrames > 0) {
            const framesToCopy = Math.min(maxFramesPerChunk, remainingFrames);
            const chunkData = new Float32Array(numberOfChannels * framesToCopy);
            for (let channel = 0; channel < numberOfChannels; channel++) {
              audioBuffer.copyFromChannel(
                chunkData.subarray(
                  channel * framesToCopy,
                  (channel + 1) * framesToCopy,
                ),
                channel,
                currentRelativeFrame,
              );
            }
            const audioSample = new AudioSample({
              format: "f32-planar",
              sampleRate,
              numberOfFrames: framesToCopy,
              numberOfChannels,
              timestamp: timestamp + currentRelativeFrame / sampleRate,
              data: chunkData,
            });
            result.push(audioSample);
            currentRelativeFrame += framesToCopy;
            remainingFrames -= framesToCopy;
          }
          return result;
        }
      }
      const getBytesPerSample = (format) => {
        switch (format) {
          case "u8":
          case "u8-planar":
            return 1;
          case "s16":
          case "s16-planar":
            return 2;
          case "s32":
          case "s32-planar":
            return 4;
          case "f32":
          case "f32-planar":
            return 4;
          default:
            throw new Error("Unknown AudioSampleFormat");
        }
      };
      const formatIsPlanar = (format) => {
        switch (format) {
          case "u8-planar":
          case "s16-planar":
          case "s32-planar":
          case "f32-planar":
            return true;
          default:
            return false;
        }
      };
      const getReadFunction = (format) => {
        switch (format) {
          case "u8":
          case "u8-planar":
            return (view, offset) => (view.getUint8(offset) - 128) / 128;
          case "s16":
          case "s16-planar":
            return (view, offset) => view.getInt16(offset, true) / 32768;
          case "s32":
          case "s32-planar":
            return (view, offset) => view.getInt32(offset, true) / 2147483648;
          case "f32":
          case "f32-planar":
            return (view, offset) => view.getFloat32(offset, true);
        }
      };
      const getWriteFunction = (format) => {
        switch (format) {
          case "u8":
          case "u8-planar":
            return (view, offset, value) =>
              view.setUint8(
                offset,
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.qE)(
                  (value + 1) * 127.5,
                  0,
                  255,
                ),
              );
          case "s16":
          case "s16-planar":
            return (view, offset, value) =>
              view.setInt16(
                offset,
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.qE)(
                  Math.round(value * 32767),
                  -32768,
                  32767,
                ),
                true,
              );
          case "s32":
          case "s32-planar":
            return (view, offset, value) =>
              view.setInt32(
                offset,
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.qE)(
                  Math.round(value * 2147483647),
                  -2147483648,
                  2147483647,
                ),
                true,
              );
          case "f32":
          case "f32-planar":
            return (view, offset, value) =>
              view.setFloat32(offset, value, true);
        }
      };
      const isAudioData = (x) => {
        return typeof AudioData !== "undefined" && x instanceof AudioData;
      };
      const toInterleavedAudioFormat = (format) => {
        switch (format) {
          case "u8-planar":
            return "u8";
          case "s16-planar":
            return "s16";
          case "s32-planar":
            return "s32";
          case "f32-planar":
            return "f32";
          default:
            return format;
        }
      };
      const doAudioDataCopyToWebKitWorkaround = (
        audioData,
        destView,
        srcFormat,
        destFormat,
        numChannels,
        planeIndex,
        frameOffset,
        copyFrameCount,
      ) => {
        const readFn = getReadFunction(srcFormat);
        const writeFn = getWriteFunction(destFormat);
        const srcBytesPerSample = getBytesPerSample(srcFormat);
        const destBytesPerSample = getBytesPerSample(destFormat);
        const srcIsPlanar = formatIsPlanar(srcFormat);
        const destIsPlanar = formatIsPlanar(destFormat);
        if (destIsPlanar) {
          if (srcIsPlanar) {
            const data = new ArrayBuffer(copyFrameCount * srcBytesPerSample);
            const dataView = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(
              data,
            );
            audioData.copyTo(data, {
              planeIndex,
              frameOffset,
              frameCount: copyFrameCount,
              format: srcFormat,
            });
            for (let i = 0; i < copyFrameCount; i++) {
              const srcOffset = i * srcBytesPerSample;
              const destOffset = i * destBytesPerSample;
              const sample = readFn(dataView, srcOffset);
              writeFn(destView, destOffset, sample);
            }
          } else {
            const data = new ArrayBuffer(
              copyFrameCount * numChannels * srcBytesPerSample,
            );
            const dataView = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(
              data,
            );
            audioData.copyTo(data, {
              planeIndex: 0,
              frameOffset,
              frameCount: copyFrameCount,
              format: srcFormat,
            });
            for (let i = 0; i < copyFrameCount; i++) {
              const srcOffset =
                (i * numChannels + planeIndex) * srcBytesPerSample;
              const destOffset = i * destBytesPerSample;
              const sample = readFn(dataView, srcOffset);
              writeFn(destView, destOffset, sample);
            }
          }
        } else {
          if (srcIsPlanar) {
            const planeSize = copyFrameCount * srcBytesPerSample;
            const data = new ArrayBuffer(planeSize);
            const dataView = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(
              data,
            );
            for (let ch = 0; ch < numChannels; ch++) {
              audioData.copyTo(data, {
                planeIndex: ch,
                frameOffset,
                frameCount: copyFrameCount,
                format: srcFormat,
              });
              for (let i = 0; i < copyFrameCount; i++) {
                const srcOffset = i * srcBytesPerSample;
                const destOffset = (i * numChannels + ch) * destBytesPerSample;
                const sample = readFn(dataView, srcOffset);
                writeFn(destView, destOffset, sample);
              }
            }
          } else {
            const data = new ArrayBuffer(
              copyFrameCount * numChannels * srcBytesPerSample,
            );
            const dataView = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(
              data,
            );
            audioData.copyTo(data, {
              planeIndex: 0,
              frameOffset,
              frameCount: copyFrameCount,
              format: srcFormat,
            });
            for (let i = 0; i < copyFrameCount; i++) {
              for (let ch = 0; ch < numChannels; ch++) {
                const idx = i * numChannels + ch;
                const srcOffset = idx * srcBytesPerSample;
                const destOffset = idx * destBytesPerSample;
                const sample = readFn(dataView, srcOffset);
                writeFn(destView, destOffset, sample);
              }
            }
          }
        }
      };
      const audioSampleToInterleavedFormat = (sample, format) => {
        const size = sample.allocationSize({ format, planeIndex: 0 });
        const buffer = new ArrayBuffer(size);
        sample.copyTo(buffer, { format, planeIndex: 0 });
        return new AudioSample({
          data: buffer,
          format,
          numberOfChannels: sample.numberOfChannels,
          sampleRate: sample.sampleRate,
          timestamp: sample.timestamp,
          duration: sample.duration,
        });
      };
    },
    /***/
    4117(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      var _node_js__WEBPACK_IMPORTED_MODULE_1___namespace_cache;
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        Fy: () =>
          /* binding */
          SourceRef,
        /* harmony export */
        QI: () =>
          /* binding */
          PathedSource,
        /* harmony export */
        SM: () =>
          /* binding */
          sourceRequestsAreEqual,
        /* harmony export */
        Ts: () =>
          /* binding */
          UrlSource,
        /* harmony export */
        el: () =>
          /* binding */
          DEFAULT_MAX_READ_POSITION,
        /* harmony export */
        kL: () =>
          /* binding */
          Source,
        /* harmony export */
        m6: () =>
          /* binding */
          ReadableStreamSource,
        /* harmony export */
        oV: () =>
          /* binding */
          DEFAULT_MIN_READ_POSITION,
        /* harmony export */
        r3: () =>
          /* binding */
          CustomPathedSource,
        /* harmony export */
      });
      var _misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6760);
      var _node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2331);
      var _input_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6014);
      var _logging_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.XQ)();
      const node =
        typeof (
          _node_js__WEBPACK_IMPORTED_MODULE_1___namespace_cache ||
          (_node_js__WEBPACK_IMPORTED_MODULE_1___namespace_cache =
            __webpack_require__.t(_node_js__WEBPACK_IMPORTED_MODULE_1__, 2))
        ) !== "undefined"
          ? _node_js__WEBPACK_IMPORTED_MODULE_1___namespace_cache ||
            (_node_js__WEBPACK_IMPORTED_MODULE_1___namespace_cache =
              __webpack_require__.t(_node_js__WEBPACK_IMPORTED_MODULE_1__, 2))
          : void 0;
      const DEFAULT_MIN_READ_POSITION = 0;
      const DEFAULT_MAX_READ_POSITION = Infinity;
      let sourceFinalizationRegistry = null;
      if (typeof FinalizationRegistry !== "undefined") {
        sourceFinalizationRegistry = new FinalizationRegistry((cleanup) => {
          cleanup();
        });
      }
      class Source extends _misc_js__WEBPACK_IMPORTED_MODULE_0__.bk {
        constructor() {
          super();
          this._disposed = false;
          this._refCount = 0;
          this._usedForHls = false;
          this._refFinalizationRegistry = null;
          this._sizePromise = null;
          this.onread = null;
          if (typeof FinalizationRegistry !== "undefined") {
            this._refFinalizationRegistry = new FinalizationRegistry(
              (source) => {
                source._decrementRefCount();
              },
            );
          }
        }
        /**
         * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
         * will retrieve the size.
         *
         * Returns null if the source is unsized.
         */
        async getSizeOrNull() {
          if (this._disposed) {
            throw new _input_js__WEBPACK_IMPORTED_MODULE_2__.QO();
          }
          return (this._sizePromise ??= (async () => {
            let size = this._getFileSize();
            if (size !== void 0) {
              return size;
            }
            await this._read(
              0,
              1,
              DEFAULT_MIN_READ_POSITION,
              DEFAULT_MAX_READ_POSITION,
            );
            size = this._getFileSize();
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(size !== void 0);
            return size;
          })());
        }
        /**
         * Resolves with the total size of the file in bytes. This function is memoized, meaning only the first call
         * will retrieve the size.
         *
         * Throws an error if the source is unsized.
         */
        async getSize() {
          if (this._disposed) {
            throw new _input_js__WEBPACK_IMPORTED_MODULE_2__.QO();
          }
          const result = await this.getSizeOrNull();
          if (result === null) {
            throw new Error("Cannot determine the size of an unsized source.");
          }
          return result;
        }
        /**
         * Returns a new {@link RangedSource} that maps data onto this source using the given offset and length. If a length
         * is not provided, the ranged source spans until the end of this source's data.
         *
         * Useful for reading files that are embedded within larger files.
         */
        slice(offset, length) {
          if (!Number.isInteger(offset) || offset < 0) {
            throw new TypeError("offset must be a non-negative integer.");
          }
          if (length !== void 0 && (!Number.isInteger(length) || length < 0)) {
            throw new TypeError(
              "length, when provided, must be a non-negative integer.",
            );
          }
          return new RangedSource(this, offset, length);
        }
        /** @internal */
        _dispatchRead(start, end) {
          this.onread?.(start, end);
          this._emit("read", { start, end });
        }
        /**
         * Creates a new `SourceRef` pointing to this source. You are expected to call `.free()` on said `SourceRef` when
         * you're done with it.
         */
        ref() {
          return new SourceRef(this);
        }
        /** @internal */
        _incrementRefCount() {
          this._refCount++;
        }
        /** @internal */
        _decrementRefCount() {
          this._refCount--;
          if (this._refCount === 0) {
            this._dispose();
            this._disposed = true;
          }
        }
      }
      class SourceRef {
        /** @internal */
        constructor(source) {
          this._freed = false;
          if (source._disposed) {
            throw new Error("Cannot ref a disposed source.");
          }
          source._incrementRefCount();
          source._refFinalizationRegistry?.register(this, source, this);
          this._source = source;
        }
        /** The {@link Source} this ref references. Accessing this field throws an error after having freed the ref. */
        get source() {
          if (!this._source) {
            throw new Error("Can't get source; ref has already been freed.");
          }
          return this._source;
        }
        /** Whether or not this reference has been freed via {@link SourceRef.free}. */
        get freed() {
          return this._freed;
        }
        /**
         * Frees the ref, decrementing the source's internal reference count. If the source's internal reference count
         * reaches zero, it gets disposed. To catch bugs, this method throws if the ref is already freed.
         */
        free() {
          if (this._freed) {
            throw new Error("Illegal operation: double free on SourceRef.");
          }
          const source = this.source;
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(source._refCount > 0);
          source._decrementRefCount();
          source._refFinalizationRegistry?.unregister(this);
          this._freed = true;
          this._source = null;
        }
        /**
         * Calls {@link SourceRef.free}.
         */
        [Symbol.dispose]() {
          if (!this.freed) {
            this.free();
          }
        }
      }
      class PathedSource extends Source {
        constructor(rootPath, requestHandler) {
          if (typeof rootPath !== "string") {
            throw new TypeError("rootPath must be a string.");
          }
          if (typeof requestHandler !== "function") {
            throw new TypeError("requestHandler must be a function.");
          }
          super();
          this.rootPath = rootPath;
          this.requestHandler = requestHandler;
        }
        /** @internal */
        _resolveRequest(request) {
          const result = this.requestHandler(request);
          const handle = (result2) => {
            if (!(result2 instanceof Source || result2 instanceof SourceRef)) {
              throw new TypeError(
                "requestHandler must return or resolve to a Source or SourceRef.",
              );
            }
            const ref = result2 instanceof Source ? result2.ref() : result2;
            ref.source._usedForHls ||= this._usedForHls;
            return ref;
          };
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(result)) {
            return result.then(handle);
          } else {
            return handle(result);
          }
        }
      }
      const sourceRequestsAreEqual = (a, b) => {
        return a.path === b.path;
      };
      class CustomPathedSource extends PathedSource {
        constructor() {
          super(...arguments);
          this._root = null;
          this._rootRequest = null;
        }
        /** @internal */
        _read(start, end, minReadPosition, maxReadPosition) {
          if (!this._root) {
            if (!this._rootRequest) {
              const result = this._resolveRequest({
                path: this.rootPath,
                isRoot: true,
              });
              const handle = (result2) => {
                const ref = result2 instanceof Source ? result2.ref() : result2;
                this._root = ref;
                this._rootRequest = null;
                return ref;
              };
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(result)) {
                this._rootRequest = result.then(handle);
              } else {
                handle(result);
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(this._root);
              }
            }
            if (this._rootRequest) {
              return this._rootRequest.then((ref) =>
                ref.source._read(start, end, minReadPosition, maxReadPosition),
              );
            }
          }
          return this._root.source._read(
            start,
            end,
            minReadPosition,
            maxReadPosition,
          );
        }
        /** @internal */
        _getFileSize() {
          if (this._root) {
            return this._root.source._getFileSize();
          }
          return void 0;
        }
        /** @internal */
        _dispose() {
          if (this._root) {
            this._root.free();
          } else if (this._rootRequest) {
            void this._rootRequest.then((ref) => ref.free());
          }
        }
      }
      class BufferSource extends Source {
        /**
         * Creates a new {@link BufferSource} backed by the specified `ArrayBuffer`, `SharedArrayBuffer`,
         * or `ArrayBufferView`.
         */
        constructor(buffer) {
          if (
            !(buffer instanceof ArrayBuffer) &&
            !(
              typeof SharedArrayBuffer !== "undefined" &&
              buffer instanceof SharedArrayBuffer
            ) &&
            !ArrayBuffer.isView(buffer)
          ) {
            throw new TypeError(
              "buffer must be an ArrayBuffer, SharedArrayBuffer, or ArrayBufferView.",
            );
          }
          super();
          this._onreadCalled = false;
          this._bytes = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Fo)(buffer);
          this._view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(buffer);
        }
        /** @internal */
        _getFileSize() {
          return this._bytes.byteLength;
        }
        /** @internal */
        _read() {
          if (!this._onreadCalled) {
            this._dispatchRead(0, this._bytes.byteLength);
            this._onreadCalled = true;
          }
          return {
            bytes: this._bytes,
            view: this._view,
            offset: 0,
          };
        }
        /** @internal */
        _dispose() {}
      }
      const blobReaderRegistry =
        typeof FinalizationRegistry !== "undefined"
          ? new FinalizationRegistry((reader) => {
              void reader.cancel().catch(() => {});
            })
          : null;
      class BlobSource extends Source {
        /**
         * Creates a new {@link BlobSource} backed by the specified
         * [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).
         */
        constructor(blob, options = {}) {
          if (!(blob instanceof Blob)) {
            throw new TypeError("blob must be a Blob.");
          }
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (
            options.maxCacheSize !== void 0 &&
            (!(0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Et)(
              options.maxCacheSize,
            ) ||
              options.maxCacheSize < 0)
          ) {
            throw new TypeError(
              "options.maxCacheSize, when provided, must be a non-negative number.",
            );
          }
          if (
            options.useStreamReader !== void 0 &&
            typeof options.useStreamReader !== "boolean"
          ) {
            throw new TypeError(
              "options.useStreamReader, when provided, must be a boolean.",
            );
          }
          super();
          this._readers = /* @__PURE__ */ new WeakMap();
          this._blob = blob;
          this._options = options;
          this._orchestrator = new ReadOrchestrator({
            maxCacheSize: options.maxCacheSize ?? 8 * 2 ** 20,
            maxWorkerCount: 4,
            runWorker: this._runWorker.bind(this),
            onIdleWorkerRemoved: (worker) => {
              const reader = this._readers.get(worker);
              if (reader) {
                this._readers.delete(worker);
                blobReaderRegistry?.unregister(worker);
                void reader.cancel().catch(() => {});
              }
            },
            prefetchProfile: PREFETCH_PROFILES.fileSystem,
          });
          this._orchestrator.fileSize = blob.size;
        }
        /** @internal */
        _getFileSize() {
          return this._orchestrator.fileSize;
        }
        /** @internal */
        _read(start, end, minReadPosition, maxReadPosition) {
          return this._orchestrator.read(
            start,
            end,
            minReadPosition,
            maxReadPosition,
          );
        }
        /** @internal */
        async _runWorker(worker) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(worker.strictTarget);
          let reader = this._readers.get(worker);
          if (reader === void 0) {
            if (
              "stream" in this._blob &&
              !(0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Tc)() &&
              this._options.useStreamReader !== false
            ) {
              const slice = this._blob.slice(worker.currentPos);
              reader = slice.stream().getReader();
              blobReaderRegistry?.register(worker, reader, worker);
            } else {
              reader = null;
            }
            this._readers.set(worker, reader);
          }
          while (worker.currentPos < worker.targetPos && !worker.aborted) {
            if (reader) {
              const { done, value } = await reader.read();
              if (done) {
                this._orchestrator.onWorkerFinished(worker);
                throw new Error(
                  "Blob reader stopped unexpectedly before all requested data was read.",
                );
              }
              if (worker.aborted) {
                break;
              }
              this._dispatchRead(
                worker.currentPos,
                worker.currentPos + value.length,
              );
              this._orchestrator.supplyWorkerData(worker, value);
            } else {
              const data = await this._blob
                .slice(worker.currentPos, worker.targetPos)
                .arrayBuffer();
              if (worker.aborted) {
                break;
              }
              this._dispatchRead(
                worker.currentPos,
                worker.currentPos + data.byteLength,
              );
              this._orchestrator.supplyWorkerData(worker, new Uint8Array(data));
            }
          }
          this._orchestrator.signalWorkerStoppedRunning(worker);
          if (worker.aborted) {
            await reader?.cancel();
          }
        }
        /** @internal */
        _dispose() {
          this._orchestrator.dispose();
        }
      }
      const URL_SOURCE_MIN_LOAD_AMOUNT = 0.5 * 2 ** 20;
      const DEFAULT_RETRY_DELAY = (previousAttempts, error, src) => {
        const couldBeCorsError =
          error instanceof Error &&
          (error.message.includes("Failed to fetch") ||
            error.message.includes("Load failed") ||
            error.message.includes(
              "NetworkError when attempting to fetch resource",
            )) &&
          typeof window !== "undefined";
        if (couldBeCorsError) {
          let originOfSrc = null;
          try {
            if (
              typeof window !== "undefined" &&
              typeof window.location !== "undefined"
            ) {
              originOfSrc = new URL(
                src instanceof Request ? src.url : src,
                window.location.href,
              ).origin;
            }
          } catch {}
          const isOnline =
            typeof navigator !== "undefined" &&
            typeof navigator.onLine === "boolean"
              ? navigator.onLine
              : true;
          if (
            isOnline &&
            originOfSrc !== null &&
            originOfSrc !== window.location.origin
          ) {
            _logging_js__WEBPACK_IMPORTED_MODULE_3__.y._warn(
              "Request will not be retried because a CORS error was suspected due to different origins. You can modify this behavior by providing your own function for the 'getRetryDelay' option.",
            );
            return null;
          }
        }
        return Math.min(2 ** (previousAttempts - 2), 16);
      };
      const warnedOrigins = /* @__PURE__ */ new Set();
      class UrlSource extends PathedSource {
        /**
         * Creates a new {@link UrlSource} backed by the resource at the specified URL.
         *
         * When passing a `Request` instance, note that its `signal` will be overridden by Mediabunny; if you want to cancel
         * ongoing requests, use {@link Input.dispose}.
         */
        constructor(url, options = {}) {
          if (
            typeof url !== "string" &&
            !(url instanceof URL) &&
            !(typeof Request !== "undefined" && url instanceof Request)
          ) {
            throw new TypeError("url must be a string, URL or Request.");
          }
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (
            options.requestInit !== void 0 &&
            (!options.requestInit || typeof options.requestInit !== "object")
          ) {
            throw new TypeError(
              "options.requestInit, when provided, must be an object.",
            );
          }
          if (
            options.getRetryDelay !== void 0 &&
            typeof options.getRetryDelay !== "function"
          ) {
            throw new TypeError(
              "options.getRetryDelay, when provided, must be a function.",
            );
          }
          if (
            options.maxCacheSize !== void 0 &&
            (!(0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Et)(
              options.maxCacheSize,
            ) ||
              options.maxCacheSize < 0)
          ) {
            throw new TypeError(
              "options.maxCacheSize, when provided, must be a non-negative number.",
            );
          }
          if (
            options.parallelism !== void 0 &&
            (!Number.isInteger(options.parallelism) || options.parallelism < 1)
          ) {
            throw new TypeError(
              "options.parallelism, when provided, must be a positive number.",
            );
          }
          if (
            options.fetchFn !== void 0 &&
            typeof options.fetchFn !== "function"
          ) {
            throw new TypeError(
              "options.fetchFn, when provided, must be a function.",
            );
          }
          const urlString =
            url instanceof Request
              ? url.url
              : url instanceof URL
                ? url.href
                : url;
          super(
            urlString,
            (request) => new UrlSource(request.path, this._options),
          );
          this._offset = 0;
          this._length = null;
          this._fileSizeDetermined = false;
          this._sequentialBacking = null;
          this._url = url;
          this._options = options;
          this._getRetryDelay = options.getRetryDelay ?? DEFAULT_RETRY_DELAY;
          this._requestInit = { ...options.requestInit };
          let rangeHeaderValue = null;
          if (options.requestInit?.headers) {
            const headers = {
              ...(0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.qx)(
                options.requestInit.headers,
              ),
            };
            const rangeKey = Object.keys(headers).find(
              (key) => key.toLowerCase() === "range",
            );
            if (rangeKey !== void 0) {
              rangeHeaderValue = headers[rangeKey];
              delete headers[rangeKey];
              this._requestInit.headers = headers;
            }
          }
          if (url instanceof Request) {
            const requestRange = url.headers.get("Range");
            if (requestRange !== null) {
              rangeHeaderValue ??= requestRange;
              const strippedRequest = new Request(url);
              strippedRequest.headers.delete("Range");
              this._url = strippedRequest;
            }
          }
          if (rangeHeaderValue !== null) {
            const parsed = parseByteRangeHeader(rangeHeaderValue);
            if (parsed) {
              this._offset = parsed.offset;
              this._length = parsed.length;
            }
          }
          const DEFAULT_PARALLELISM = 2;
          this._orchestrator = new ReadOrchestrator({
            maxCacheSize: options.maxCacheSize ?? 64 * 2 ** 20,
            maxWorkerCount: options.parallelism ?? DEFAULT_PARALLELISM,
            runWorker: this._runWorker.bind(this),
            prefetchProfile: PREFETCH_PROFILES.network,
          });
        }
        /** @internal */
        _getFileSize() {
          if (!this._fileSizeDetermined) {
            return this._length !== null ? this._length : void 0;
          }
          const baseSize = this._sequentialBacking
            ? this._sequentialBacking._endIndex
            : this._orchestrator.fileSize;
          if (baseSize === null) {
            return this._length !== null ? this._length : null;
          }
          return (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.qE)(
            baseSize - this._offset,
            0,
            this._length ?? Infinity,
          );
        }
        /** @internal */
        _read(start, end, minReadPosition, maxReadPosition) {
          if (this._length !== null && end > this._length) {
            return null;
          }
          const offset = this._offset;
          const result = this._sequentialBacking
            ? this._sequentialBacking._read(offset + start, offset + end)
            : this._orchestrator.read(
                offset + start,
                offset + end,
                Math.max(offset + minReadPosition, offset),
                offset + Math.min(maxReadPosition, this._length ?? Infinity),
              );
          const processResult = (result2) => {
            if (!result2) {
              return null;
            }
            result2.offset -= this._offset;
            return result2;
          };
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(result)) {
            return result.then(processResult);
          } else {
            return processResult(result);
          }
        }
        /** @internal */
        async _runWorker(worker) {
          while (true) {
            const abortController = new AbortController();
            const response = await (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_0__.G8)(
              this._options.fetchFn ?? fetch,
              this._url,
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__._h)(this._requestInit, {
                headers: {
                  // Always sending a range request is a good way to probe if the server supports them
                  Range: "bytes=".concat(worker.currentPos, "-"),
                },
                signal: abortController.signal,
              }),
              this._getRetryDelay,
              () => this._disposed,
            );
            if (!response.ok) {
              throw new Error(
                "Error fetching "
                  .concat(String(this._url), ": ")
                  .concat(response.status, " ")
                  .concat(response.statusText),
              );
            }
            if (response.redirected) {
              this.rootPath = response.url;
            }
            outer: if (this._orchestrator.fileSize === null) {
              const contentRange = response.headers.get("Content-Range");
              if (contentRange) {
                const match = /\/(\d+)/.exec(contentRange);
                if (match) {
                  this._orchestrator.supplyFileSize(Number(match[1]));
                  break outer;
                }
              }
              const contentLength = response.headers.get("Content-Length");
              if (contentLength) {
                const basePos = response.status === 206 ? worker.currentPos : 0;
                this._orchestrator.supplyFileSize(
                  basePos + Number(contentLength),
                );
              }
            }
            this._fileSizeDetermined = true;
            if (!response.body) {
              throw new Error(
                "Missing HTTP response body stream. The used fetch function must provide the response body as a ReadableStream.",
              );
            }
            if (response.status !== 206) {
              if (this._sequentialBacking) {
                void response.body.cancel();
                return;
              }
              if (!this._usedForHls) {
                const url = new URL(
                  this._url instanceof Request ? this._url.url : this._url,
                  typeof window !== "undefined" ? window.location.href : void 0,
                );
                if (
                  url.origin !== "null" &&
                  !(
                    url.pathname.endsWith(".m3u8") ||
                    url.pathname.endsWith(".m3u")
                  )
                ) {
                  if (!warnedOrigins.has(url.origin)) {
                    _logging_js__WEBPACK_IMPORTED_MODULE_3__.y._warn(
                      "HTTP server (origin ".concat(
                        url.origin,
                        ") did not respond to a range request with 206 Partial",
                      ) +
                        " Content, meaning the resource will now be streamed sequentially, with old data being evicted from the cache. Reads into evicted regions will throw. To enable efficient media file streaming across a network, please make sure your server supports range requests. Alternatively, set maxCacheSize to Infinity in the UrlSource options to keep the entire resource in memory.",
                    );
                    warnedOrigins.add(url.origin);
                  }
                }
              }
              this._transitionToSequentialMode(response.body);
              return;
            }
            const reader = response.body.getReader();
            while (true) {
              if (worker.currentPos >= worker.targetPos || worker.aborted) {
                abortController.abort();
                this._orchestrator.signalWorkerStoppedRunning(worker);
                return;
              }
              let readResult;
              try {
                readResult = await reader.read();
              } catch (error) {
                if (this._disposed) {
                  throw error;
                }
                const retryDelayInSeconds = this._getRetryDelay(
                  1,
                  error,
                  this._url,
                );
                if (retryDelayInSeconds !== null) {
                  _logging_js__WEBPACK_IMPORTED_MODULE_3__.y._error(
                    "Error while reading response stream. Attempting to resume.",
                    error,
                  );
                  await (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.uk)(
                    1e3 * retryDelayInSeconds,
                  );
                  break;
                } else {
                  throw error;
                }
              }
              if (worker.aborted) {
                continue;
              }
              const { done, value } = readResult;
              if (done) {
                if (worker.currentPos >= worker.targetPos) {
                  this._orchestrator.onWorkerFinished(worker);
                  return;
                }
                if (worker.strictTarget) {
                  break;
                } else {
                  this._orchestrator.onWorkerFinished(worker);
                  return;
                }
              }
              this._dispatchRead(
                worker.currentPos,
                worker.currentPos + value.length,
              );
              this._orchestrator.supplyWorkerData(worker, value);
            }
          }
        }
        /** @internal */
        _transitionToSequentialMode(body) {
          let currentReader = body.getReader();
          let streamPosition = 0;
          let skipRemaining = 0;
          const wrappedStream = new ReadableStream({
            pull: async (controller) => {
              while (true) {
                let readResult;
                try {
                  readResult = await currentReader.read();
                } catch (error) {
                  if (this._disposed) {
                    throw error;
                  }
                  const retryDelayInSeconds = this._getRetryDelay(
                    1,
                    error,
                    this._url,
                  );
                  if (retryDelayInSeconds === null) {
                    throw error;
                  }
                  _logging_js__WEBPACK_IMPORTED_MODULE_3__.y._error(
                    "Error while reading response stream. Attempting to resume.",
                    error,
                  );
                  await (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.uk)(
                    1e3 * retryDelayInSeconds,
                  );
                  const newResponse = await (0,
                  _misc_js__WEBPACK_IMPORTED_MODULE_0__.G8)(
                    this._options.fetchFn ?? fetch,
                    this._url,
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__._h)(
                      this._requestInit,
                      {
                        headers: {
                          // Who knows, maybe the server honors range requests this time
                          Range: "bytes=".concat(streamPosition, "-"),
                        },
                      },
                    ),
                    this._getRetryDelay,
                    () => this._disposed,
                  );
                  if (!newResponse.ok) {
                    throw new Error(
                      // eslint-disable-next-line @typescript-eslint/no-base-to-string
                      "Error fetching ".concat(String(this._url), ":") +
                        " "
                          .concat(newResponse.status, " ")
                          .concat(newResponse.statusText),
                    );
                  }
                  if (!newResponse.body) {
                    throw new Error(
                      "Missing HTTP response body stream. The used fetch function must provide the response body as a ReadableStream.",
                    );
                  }
                  currentReader = newResponse.body.getReader();
                  skipRemaining =
                    newResponse.status === 206 ? 0 : streamPosition;
                  continue;
                }
                if (readResult.done) {
                  controller.close();
                  return;
                }
                let chunk = readResult.value;
                if (skipRemaining > 0) {
                  const skippedAmount = Math.min(skipRemaining, chunk.length);
                  skipRemaining -= skippedAmount;
                  chunk = chunk.subarray(skippedAmount);
                }
                if (chunk.length === 0) {
                  continue;
                }
                streamPosition += chunk.length;
                controller.enqueue(chunk);
                return;
              }
            },
            cancel: () => currentReader.cancel(),
          });
          const backing = new ReadableStreamSource(wrappedStream, {
            maxCacheSize: this._orchestrator.options.maxCacheSize,
          });
          backing._endIndex = this._orchestrator.fileSize;
          backing._cacheMissErrorMessage =
            "Attempted to read data from an already-evicted part of the cache. Because the HTTP server did not honor the range request, data can only be read sequentially, with old data being evicted from the cache. To fix this issue, either ensure your server responds to range requests with 206 Partial Content, or set maxCacheSize to Infinity in the UrlSource options. Note that the latter will store the entire file in the cache if needed, no matter how large.";
          backing.on("read", ({ start, end }) =>
            this._dispatchRead(start, end),
          );
          this._sequentialBacking = backing;
          const uniqueSlices = /* @__PURE__ */ new Set();
          for (const otherWorker of this._orchestrator.workers) {
            for (const slice of otherWorker.pendingSlices) {
              uniqueSlices.add(slice);
            }
            otherWorker.aborted = true;
            otherWorker.pendingSlices.length = 0;
          }
          for (const queuedRead of this._orchestrator.queuedReads) {
            for (const slice of queuedRead.pendingSlices) {
              uniqueSlices.add(slice);
            }
          }
          this._orchestrator.workers.length = 0;
          this._orchestrator.queuedReads.length = 0;
          for (const slice of uniqueSlices) {
            const result = backing._read(
              slice.start,
              slice.start + slice.bytes.length,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(result)) {
              result.then(
                (readResult) => {
                  if (readResult) {
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(
                      readResult.offset === slice.start,
                    );
                    slice.resolve(readResult.bytes);
                  } else {
                    slice.resolve(null);
                  }
                },
                (error) => slice.reject(error),
              );
            } else {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(result === null);
              slice.resolve(null);
            }
          }
        }
        /** @internal */
        _dispose() {
          this._orchestrator.dispose();
          if (this._sequentialBacking) {
            this._sequentialBacking._disposed = true;
            this._sequentialBacking._dispose();
          }
        }
      }
      const BYTE_RANGE_REGEX = /^bytes=(\d+)-(\d*)$/;
      const parseByteRangeHeader = (value) => {
        const match = BYTE_RANGE_REGEX.exec(value.trim());
        if (!match) {
          return null;
        }
        const offset = Number(match[1]);
        const end = match[2] === "" ? null : Number(match[2]);
        if (end !== null && end < offset) {
          return null;
        }
        return {
          offset,
          length: end !== null ? end - offset + 1 : null,
        };
      };
      class FilePathSource extends PathedSource {
        /** Creates a new {@link FilePathSource} backed by the file at the specified file path. */
        constructor(filePath, options = {}) {
          if (typeof filePath !== "string") {
            throw new TypeError("filePath must be a string.");
          }
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (
            options.maxCacheSize !== void 0 &&
            (!(0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Et)(
              options.maxCacheSize,
            ) ||
              options.maxCacheSize < 0)
          ) {
            throw new TypeError(
              "options.maxCacheSize, when provided, must be a non-negative number.",
            );
          }
          if (!node.fs) {
            throw new Error(
              "FilePathSource is only available in server-side environments (Node.js, Bun, Deno).",
            );
          }
          super(
            filePath,
            (request) => new FilePathSource(request.path, options),
          );
          this._fileHandle = null;
          this._customSource = new CustomSource({
            getSize: async () => {
              const fileHandle = await node.fs.open(filePath, "r");
              this._fileHandle = fileHandle;
              sourceFinalizationRegistry?.register(
                this,
                () => {
                  void fileHandle.close();
                },
                this,
              );
              const stats = await fileHandle.stat();
              return stats.size;
            },
            read: async (start, end) => {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(this._fileHandle);
              const buffer = new Uint8Array(end - start);
              await this._fileHandle.read(buffer, 0, end - start, start);
              return buffer;
            },
            maxCacheSize: options.maxCacheSize,
            prefetchProfile: "fileSystem",
          });
        }
        /** @internal */
        _read(start, end, minReadPosition, maxReadPosition) {
          return this._customSource._read(
            start,
            end,
            minReadPosition,
            maxReadPosition,
          );
        }
        /** @internal */
        _getFileSize() {
          return this._customSource._getFileSize();
        }
        /** @internal */
        _dispose() {
          this._customSource._dispose();
          if (this._fileHandle) {
            void this._fileHandle.close();
            this._fileHandle = null;
            sourceFinalizationRegistry?.unregister(this);
          }
        }
      }
      class CustomSource extends Source {
        /** Creates a new {@link CustomSource} whose behavior is specified by `options`.  */
        constructor(options) {
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (typeof options.getSize !== "function") {
            throw new TypeError("options.getSize must be a function.");
          }
          if (typeof options.read !== "function") {
            throw new TypeError("options.read must be a function.");
          }
          if (
            options.dispose !== void 0 &&
            typeof options.dispose !== "function"
          ) {
            throw new TypeError(
              "options.dispose, when provided, must be a function.",
            );
          }
          if (
            options.maxCacheSize !== void 0 &&
            (!(0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Et)(
              options.maxCacheSize,
            ) ||
              options.maxCacheSize < 0)
          ) {
            throw new TypeError(
              "options.maxCacheSize, when provided, must be a non-negative number.",
            );
          }
          if (
            options.prefetchProfile &&
            !["none", "fileSystem", "network"].includes(options.prefetchProfile)
          ) {
            throw new TypeError(
              "options.prefetchProfile, when provided, must be one of 'none', 'fileSystem' or 'network'.",
            );
          }
          super();
          this._options = options;
          this._orchestrator = new ReadOrchestrator({
            maxCacheSize: options.maxCacheSize ?? 8 * 2 ** 20,
            maxWorkerCount: 2,
            // Fixed for now, *should* be fine
            prefetchProfile:
              PREFETCH_PROFILES[options.prefetchProfile ?? "none"],
            runWorker: this._runWorker.bind(this),
          });
        }
        /** @internal */
        _getFileSize() {
          return this._orchestrator.fileSize ?? void 0;
        }
        /** @internal */
        _read(start, end, minReadPosition, maxReadPosition) {
          if (this._orchestrator.fileSize !== null) {
            return this._orchestrator.read(
              start,
              end,
              minReadPosition,
              maxReadPosition,
            );
          }
          const result = this._options.getSize();
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(result)) {
            return result.then((size) => {
              if (!Number.isInteger(size) || size < 0) {
                throw new TypeError(
                  "options.getSize must return or resolve to a non-negative integer.",
                );
              }
              this._orchestrator.fileSize = size;
              return this._orchestrator.read(
                start,
                end,
                minReadPosition,
                maxReadPosition,
              );
            });
          } else {
            if (!Number.isInteger(result) || result < 0) {
              throw new TypeError(
                "options.getSize must return or resolve to a non-negative integer.",
              );
            }
            this._orchestrator.fileSize = result;
            return this._orchestrator.read(
              start,
              end,
              minReadPosition,
              maxReadPosition,
            );
          }
        }
        /** @internal */
        async _runWorker(worker) {
          while (worker.currentPos < worker.targetPos && !worker.aborted) {
            const originalCurrentPos = worker.currentPos;
            const originalTargetPos = worker.targetPos;
            let data = this._options.read(worker.currentPos, originalTargetPos);
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(data))
              data = await data;
            if (worker.aborted) {
              break;
            }
            if (data instanceof Uint8Array) {
              data = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Fo)(data);
              if (data.length !== originalTargetPos - worker.currentPos) {
                throw new Error(
                  "options.read returned a Uint8Array with unexpected length: Requested "
                    .concat(
                      originalTargetPos - worker.currentPos,
                      " bytes, but got ",
                    )
                    .concat(data.length, "."),
                );
              }
              this._dispatchRead(
                worker.currentPos,
                worker.currentPos + data.length,
              );
              this._orchestrator.supplyWorkerData(worker, data);
            } else if (data instanceof ReadableStream) {
              const reader = data.getReader();
              while (worker.currentPos < originalTargetPos && !worker.aborted) {
                const { done, value } = await reader.read();
                if (done) {
                  if (worker.currentPos < originalTargetPos) {
                    throw new Error(
                      "ReadableStream returned by options.read ended before supplying enough data." +
                        " Requested "
                          .concat(
                            originalTargetPos - originalCurrentPos,
                            " bytes, but got ",
                          )
                          .concat(worker.currentPos - originalCurrentPos),
                    );
                  }
                  break;
                }
                if (!(value instanceof Uint8Array)) {
                  throw new TypeError(
                    "ReadableStream returned by options.read must yield Uint8Array chunks.",
                  );
                }
                if (worker.aborted) {
                  break;
                }
                const data2 = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Fo)(
                  value,
                );
                this._dispatchRead(
                  worker.currentPos,
                  worker.currentPos + data2.length,
                );
                this._orchestrator.supplyWorkerData(worker, data2);
              }
            } else {
              throw new TypeError(
                "options.read must return or resolve to a Uint8Array or a ReadableStream.",
              );
            }
          }
          this._orchestrator.signalWorkerStoppedRunning(worker);
        }
        /** @internal */
        _dispose() {
          this._orchestrator.dispose();
          this._options.dispose?.();
        }
      }
      const StreamSource =
        /* unused pure expression or super */
        null;
      class ReadableStreamSource extends Source {
        /** Creates a new {@link ReadableStreamSource} backed by the specified `ReadableStream<Uint8Array>`. */
        constructor(stream, options = {}) {
          if (!(stream instanceof ReadableStream)) {
            throw new TypeError("stream must be a ReadableStream.");
          }
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (
            options.maxCacheSize !== void 0 &&
            (!(0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Et)(
              options.maxCacheSize,
            ) ||
              options.maxCacheSize < 0)
          ) {
            throw new TypeError(
              "options.maxCacheSize, when provided, must be a non-negative number.",
            );
          }
          super();
          this._reader = null;
          this._cache = [];
          this._pendingSlices = [];
          this._currentIndex = 0;
          this._targetIndex = 0;
          this._maxRequestedIndex = 0;
          this._endIndex = null;
          this._pulling = false;
          this._cacheMissErrorMessage =
            "Attempted to read data from an already-evicted part of the cache. With ReadableStreamSource, you must access the data more sequentially or increase the size of its cache.";
          this._stream = stream;
          this._maxCacheSize = options.maxCacheSize ?? 32 * 2 ** 20;
        }
        /** @internal */
        _getFileSize() {
          return this._endIndex;
        }
        /** @internal */
        _read(start, end) {
          if (this._endIndex !== null && end > this._endIndex) {
            return null;
          }
          this._maxRequestedIndex = Math.max(this._maxRequestedIndex, end);
          const cacheStartIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.eE)(
            this._cache,
            start,
            (x) => x.start,
          );
          const cacheStartEntry =
            cacheStartIndex !== -1 ? this._cache[cacheStartIndex] : null;
          if (
            cacheStartEntry &&
            cacheStartEntry.start <= start &&
            end <= cacheStartEntry.end
          ) {
            return {
              bytes: cacheStartEntry.bytes,
              view: cacheStartEntry.view,
              offset: cacheStartEntry.start,
            };
          }
          let lastEnd = start;
          const bytes = new Uint8Array(end - start);
          if (cacheStartIndex !== -1) {
            for (let i = cacheStartIndex; i < this._cache.length; i++) {
              const cacheEntry = this._cache[i];
              if (cacheEntry.start >= end) {
                break;
              }
              const cappedStart = Math.max(start, cacheEntry.start);
              if (cappedStart > lastEnd) {
                this._throwDueToCacheMiss();
              }
              const cappedEnd = Math.min(end, cacheEntry.end);
              if (cappedStart < cappedEnd) {
                bytes.set(
                  cacheEntry.bytes.subarray(
                    cappedStart - cacheEntry.start,
                    cappedEnd - cacheEntry.start,
                  ),
                  cappedStart - start,
                );
                lastEnd = cappedEnd;
              }
            }
          }
          if (lastEnd === end) {
            return {
              bytes,
              view: (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(bytes),
              offset: start,
            };
          }
          if (this._currentIndex > lastEnd) {
            this._throwDueToCacheMiss();
          }
          const { promise, resolve, reject } = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_0__.nJ)();
          this._pendingSlices.push({
            start,
            end,
            bytes,
            resolve,
            reject,
          });
          this._targetIndex = Math.max(this._targetIndex, end);
          if (!this._pulling) {
            this._pulling = true;
            void this._pull().catch((error) => {
              this._pulling = false;
              if (this._pendingSlices.length > 0) {
                this._pendingSlices.forEach((x) => x.reject(error));
                this._pendingSlices.length = 0;
              } else {
                throw error;
              }
            });
          }
          return promise;
        }
        /** @internal */
        _throwDueToCacheMiss() {
          throw new Error(this._cacheMissErrorMessage);
        }
        /** @internal */
        async _pull() {
          this._reader ??= this._stream.getReader();
          while (this._currentIndex < this._targetIndex && !this._disposed) {
            const { done, value } = await this._reader.read();
            if (done) {
              for (const pendingSlice of this._pendingSlices) {
                pendingSlice.resolve(null);
              }
              this._pendingSlices.length = 0;
              this._endIndex = this._currentIndex;
              break;
            }
            const startIndex = this._currentIndex;
            const endIndex = this._currentIndex + value.byteLength;
            this._dispatchRead(startIndex, endIndex);
            for (let i = 0; i < this._pendingSlices.length; i++) {
              const pendingSlice = this._pendingSlices[i];
              const cappedStart = Math.max(startIndex, pendingSlice.start);
              const cappedEnd = Math.min(endIndex, pendingSlice.end);
              if (cappedStart < cappedEnd) {
                pendingSlice.bytes.set(
                  value.subarray(
                    cappedStart - startIndex,
                    cappedEnd - startIndex,
                  ),
                  cappedStart - pendingSlice.start,
                );
                if (cappedEnd === pendingSlice.end) {
                  pendingSlice.resolve({
                    bytes: pendingSlice.bytes,
                    view: (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(
                      pendingSlice.bytes,
                    ),
                    offset: pendingSlice.start,
                  });
                  this._pendingSlices.splice(i, 1);
                  i--;
                }
              }
            }
            this._cache.push({
              start: startIndex,
              end: endIndex,
              bytes: value,
              view: (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(value),
              age: 0,
              // Unused
            });
            while (this._cache.length > 0) {
              const firstEntry = this._cache[0];
              const distance = this._maxRequestedIndex - firstEntry.end;
              if (distance <= this._maxCacheSize) {
                break;
              }
              this._cache.shift();
            }
            this._currentIndex += value.byteLength;
          }
          this._pulling = false;
        }
        /** @internal */
        _dispose() {
          for (const pendingSlice of this._pendingSlices) {
            pendingSlice.reject(
              new _input_js__WEBPACK_IMPORTED_MODULE_2__.QO(),
            );
          }
          this._pendingSlices.length = 0;
          this._cache.length = 0;
          void this._reader?.cancel();
        }
      }
      const PREFETCH_PROFILES = {
        none: (start, end) => ({ start, end }),
        fileSystem: (start, end) => {
          const padding = 2 ** 16;
          start = Math.floor((start - padding) / padding) * padding;
          end = Math.ceil((end + padding) / padding) * padding;
          return { start, end };
        },
        network: (start, end, workers) => {
          const paddingStart = 2 ** 16;
          start = Math.max(
            0,
            Math.floor((start - paddingStart) / paddingStart) * paddingStart,
          );
          for (const worker of workers) {
            const maxExtensionAmount = 8 * 2 ** 20;
            const thresholdPoint = Math.max(
              (worker.startPos + worker.targetPos) / 2,
              worker.targetPos - maxExtensionAmount,
            );
            if (
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.oX)(
                start,
                end,
                thresholdPoint,
                worker.targetPos,
              )
            ) {
              const size = worker.targetPos - worker.startPos;
              const a =
                Math.ceil((size + 1) / maxExtensionAmount) * maxExtensionAmount;
              const b = 2 ** Math.ceil(Math.log2(size + 1));
              const extent = Math.min(b, a);
              end = Math.max(end, worker.startPos + extent);
            }
          }
          end = Math.max(end, start + URL_SOURCE_MIN_LOAD_AMOUNT);
          return {
            start,
            end,
          };
        },
      };
      class ReadOrchestrator {
        constructor(options) {
          this.options = options;
          this.fileSize = null;
          this.nextAge = 0;
          this.workers = [];
          this.cache = [];
          this.currentCacheSize = 0;
          this.disposed = false;
          this.queuedReads = [];
        }
        read(innerStart, innerEnd, minReadPosition, maxReadPosition) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(!this.disposed);
          const prefetchRange = this.options.prefetchProfile(
            innerStart,
            innerEnd,
            this.workers,
          );
          const outerStart = Math.max(prefetchRange.start, minReadPosition);
          const outerEnd = Math.min(
            prefetchRange.end,
            this.fileSize ?? Infinity,
            maxReadPosition,
          );
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(
            outerStart <= innerStart && innerEnd <= outerEnd,
          );
          let result = null;
          const innerCacheStartIndex = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_0__.eE)(
            this.cache,
            innerStart,
            (x) => x.start,
          );
          const innerStartEntry =
            innerCacheStartIndex !== -1
              ? this.cache[innerCacheStartIndex]
              : null;
          if (
            innerStartEntry &&
            innerStartEntry.start <= innerStart &&
            innerEnd <= innerStartEntry.end
          ) {
            innerStartEntry.age = this.nextAge++;
            result = {
              bytes: innerStartEntry.bytes,
              view: innerStartEntry.view,
              offset: innerStartEntry.start,
            };
          }
          const outerCacheStartIndex = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_0__.eE)(
            this.cache,
            outerStart,
            (x) => x.start,
          );
          const bytes = result ? null : new Uint8Array(innerEnd - innerStart);
          let contiguousBytesWriteEnd = 0;
          let lastEnd = outerStart;
          const outerHoles = [];
          if (outerCacheStartIndex !== -1) {
            for (let i = outerCacheStartIndex; i < this.cache.length; i++) {
              const entry = this.cache[i];
              if (entry.start >= outerEnd) {
                break;
              }
              if (entry.end <= outerStart) {
                continue;
              }
              const cappedOuterStart = Math.max(outerStart, entry.start);
              const cappedOuterEnd = Math.min(outerEnd, entry.end);
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(
                cappedOuterStart <= cappedOuterEnd,
              );
              if (lastEnd < cappedOuterStart) {
                outerHoles.push({ start: lastEnd, end: cappedOuterStart });
              }
              lastEnd = cappedOuterEnd;
              if (bytes) {
                const cappedInnerStart = Math.max(innerStart, entry.start);
                const cappedInnerEnd = Math.min(innerEnd, entry.end);
                if (cappedInnerStart < cappedInnerEnd) {
                  const relativeOffset = cappedInnerStart - innerStart;
                  bytes.set(
                    entry.bytes.subarray(
                      cappedInnerStart - entry.start,
                      cappedInnerEnd - entry.start,
                    ),
                    relativeOffset,
                  );
                  if (relativeOffset === contiguousBytesWriteEnd) {
                    contiguousBytesWriteEnd = cappedInnerEnd - innerStart;
                  }
                }
              }
              entry.age = this.nextAge++;
            }
            if (lastEnd < outerEnd) {
              outerHoles.push({ start: lastEnd, end: outerEnd });
            }
          } else {
            outerHoles.push({ start: outerStart, end: outerEnd });
          }
          if (bytes && contiguousBytesWriteEnd >= bytes.length) {
            result = {
              bytes,
              view: (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(bytes),
              offset: innerStart,
            };
          }
          if (outerHoles.length === 0) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(result);
            return result;
          }
          const { promise, resolve, reject } = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_0__.nJ)();
          const innerHoles = [];
          for (const outerHole of outerHoles) {
            const cappedStart = Math.max(innerStart, outerHole.start);
            const cappedEnd = Math.min(innerEnd, outerHole.end);
            if (
              cappedStart === outerHole.start &&
              cappedEnd === outerHole.end
            ) {
              innerHoles.push(outerHole);
            } else if (cappedStart < cappedEnd) {
              innerHoles.push({ start: cappedStart, end: cappedEnd });
            }
          }
          const pendingSlice = bytes && {
            start: innerStart,
            bytes,
            holes: innerHoles,
            resolve,
            reject,
          };
          outer: for (const outerHole of outerHoles) {
            for (const worker of this.workers) {
              const addedToWorker = this.checkHoleAgainstWorker(
                worker,
                outerHole,
                pendingSlice ? [pendingSlice] : [],
              );
              if (addedToWorker) {
                this.checkQueuedReadsAgainstWorker(worker);
                continue outer;
              }
            }
            const strictTarget =
              outerHole.end < outerEnd || this.fileSize !== null;
            const newWorker = this.createWorker(
              outerHole.start,
              outerHole.end,
              strictTarget,
            );
            if (newWorker) {
              if (pendingSlice) {
                newWorker.pendingSlices = [pendingSlice];
              }
              this.runWorker(newWorker);
            } else {
              let index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.eE)(
                this.queuedReads,
                outerHole.start,
                (x) => x.hole.start,
              );
              let entry = index !== -1 ? this.queuedReads[index] : null;
              if (entry && outerHole.start <= entry.hole.end) {
                entry.hole.end = Math.max(entry.hole.end, outerHole.end);
                entry.strictTarget &&= strictTarget;
                if (pendingSlice) {
                  entry.pendingSlices.push(pendingSlice);
                }
              } else {
                index++;
                entry = {
                  hole: {
                    // Clone the hole because it might be mutated later
                    start: outerHole.start,
                    end: outerHole.end,
                  },
                  strictTarget,
                  pendingSlices: pendingSlice ? [pendingSlice] : [],
                  age: this.nextAge++,
                };
                this.queuedReads.splice(index, 0, entry);
              }
              while (index + 1 < this.queuedReads.length) {
                const nextEntry = this.queuedReads[index + 1];
                if (nextEntry.hole.start > entry.hole.end) {
                  break;
                }
                entry.hole.end = Math.max(entry.hole.end, nextEntry.hole.end);
                entry.pendingSlices.push(...nextEntry.pendingSlices);
                entry.strictTarget &&= nextEntry.strictTarget;
                entry.age = Math.min(entry.age, nextEntry.age);
                this.queuedReads.splice(index + 1, 1);
              }
            }
          }
          if (!result) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(bytes);
            result = promise.then(
              (bytes2) =>
                bytes2 && {
                  bytes: bytes2,
                  view: (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(bytes2),
                  offset: innerStart,
                },
            );
          } else {
            promise.catch((error) => {
              if (this.disposed) {
                return;
              }
              throw error;
            });
          }
          return result;
        }
        checkHoleAgainstWorker(worker, hole, pendingSlices) {
          const gapTolerance = 2 ** 17;
          if (
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.oX)(
              hole.start - gapTolerance,
              hole.start,
              worker.currentPos,
              worker.targetPos,
            )
          ) {
            worker.targetPos = Math.max(worker.targetPos, hole.end);
            for (let i = 0; i < pendingSlices.length; i++) {
              const pendingSlice = pendingSlices[i];
              if (!worker.pendingSlices.includes(pendingSlice)) {
                worker.pendingSlices.push(pendingSlice);
              }
            }
            if (!worker.running) {
              this.runWorker(worker);
            }
            return true;
          }
          return false;
        }
        checkQueuedReadsAgainstWorker(worker) {
          let wasTrueOnce = false;
          for (let i = 0; i < this.queuedReads.length; i++) {
            const queuedRead = this.queuedReads[i];
            const result = this.checkHoleAgainstWorker(
              worker,
              queuedRead.hole,
              queuedRead.pendingSlices,
            );
            if (result) {
              this.queuedReads.splice(i, 1);
              i--;
              wasTrueOnce = true;
            } else if (wasTrueOnce) {
              break;
            }
          }
        }
        createWorker(startPos, targetPos, strictTarget) {
          if (this.workers.length >= this.options.maxWorkerCount) {
            let oldestWorker = null;
            let oldestIndex = null;
            for (let i = 0; i < this.workers.length; i++) {
              const worker2 = this.workers[i];
              if (
                !worker2.running &&
                worker2.pendingSlices.length === 0 &&
                (!oldestWorker || worker2.age < oldestWorker.age)
              ) {
                oldestIndex = i;
                oldestWorker = worker2;
              }
            }
            if (oldestWorker) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(
                oldestIndex !== null,
              );
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(
                oldestWorker.pendingSlices.length === 0,
              );
              this.workers.splice(oldestIndex, 1);
              this.options.onIdleWorkerRemoved?.(oldestWorker);
            } else {
              return null;
            }
          }
          const worker = {
            startPos,
            currentPos: startPos,
            targetPos,
            strictTarget,
            running: false,
            // Due to async shenanigans, it can happen that workers are started after disposal. In this case, instead of
            // simply not creating the worker, we allow it to run but immediately label it as aborted, so it can then
            // shut itself down.
            aborted: this.disposed,
            pendingSlices: [],
            age: this.nextAge++,
          };
          this.workers.push(worker);
          return worker;
        }
        runWorker(worker) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(!worker.running);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(
            worker.currentPos < worker.targetPos,
          );
          worker.running = true;
          worker.age = this.nextAge++;
          void this.options
            .runWorker(worker)
            .catch((error) => {
              worker.running = false;
              if (worker.pendingSlices.length > 0) {
                worker.pendingSlices.forEach((x) => x.reject(error));
                worker.pendingSlices.length = 0;
              } else if (!worker.aborted && !this.disposed) {
                throw error;
              }
            })
            .finally(() => {
              if (worker.running) {
                return;
              }
              if (this.queuedReads.length > 0) {
                let oldestIndex = 0;
                for (let i = 1; i < this.queuedReads.length; i++) {
                  const queuedRead2 = this.queuedReads[i];
                  if (queuedRead2.age < this.queuedReads[oldestIndex].age) {
                    oldestIndex = i;
                  }
                }
                const queuedRead = this.queuedReads[oldestIndex];
                const newWorker = this.createWorker(
                  queuedRead.hole.start,
                  queuedRead.hole.end,
                  queuedRead.strictTarget,
                );
                if (!newWorker) {
                  return;
                }
                this.queuedReads.splice(oldestIndex, 1);
                newWorker.pendingSlices = queuedRead.pendingSlices;
                this.runWorker(newWorker);
              }
            });
        }
        /** Called by a worker when it has read some data. */
        supplyWorkerData(worker, bytes) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(!worker.aborted);
          const start = worker.currentPos;
          const end = start + bytes.length;
          this.insertIntoCache({
            start,
            end,
            bytes,
            view: (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(bytes),
            age: this.nextAge++,
          });
          worker.currentPos += bytes.length;
          if (worker.currentPos > worker.targetPos) {
            worker.targetPos = worker.currentPos;
            this.checkQueuedReadsAgainstWorker(worker);
          }
          for (let i = 0; i < worker.pendingSlices.length; i++) {
            const pendingSlice = worker.pendingSlices[i];
            const clampedStart = Math.max(start, pendingSlice.start);
            const clampedEnd = Math.min(
              end,
              pendingSlice.start + pendingSlice.bytes.length,
            );
            if (clampedStart < clampedEnd) {
              pendingSlice.bytes.set(
                bytes.subarray(clampedStart - start, clampedEnd - start),
                clampedStart - pendingSlice.start,
              );
            }
            for (let j = 0; j < pendingSlice.holes.length; j++) {
              const hole = pendingSlice.holes[j];
              if (start <= hole.start && end > hole.start) {
                hole.start = end;
              }
              if (hole.end <= hole.start) {
                pendingSlice.holes.splice(j, 1);
                j--;
              }
            }
            if (pendingSlice.holes.length === 0) {
              pendingSlice.resolve(pendingSlice.bytes);
              worker.pendingSlices.splice(i, 1);
              i--;
            }
          }
          for (let i = 0; i < this.workers.length; i++) {
            const otherWorker = this.workers[i];
            if (worker === otherWorker || otherWorker.running) {
              continue;
            }
            if (
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.oX)(
                start,
                end,
                otherWorker.currentPos,
                otherWorker.targetPos,
              )
            ) {
              this.workers.splice(i, 1);
              this.options.onIdleWorkerRemoved?.(otherWorker);
              i--;
            }
          }
        }
        supplyFileSize(size) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(this.fileSize === null);
          this.fileSize = size;
          for (const worker of this.workers) {
            worker.targetPos = Math.min(worker.targetPos, size);
            worker.strictTarget = true;
            for (let i = 0; i < worker.pendingSlices.length; i++) {
              const pendingSlice = worker.pendingSlices[i];
              for (const hole of pendingSlice.holes) {
                if (hole.end > size) {
                  pendingSlice.resolve(null);
                  worker.pendingSlices.splice(i, 1);
                  i--;
                  break;
                }
              }
            }
          }
          for (let i = 0; i < this.queuedReads.length; i++) {
            const queuedRead = this.queuedReads[i];
            if (queuedRead.hole.start >= size) {
              for (const slice of queuedRead.pendingSlices) slice.resolve(null);
              this.queuedReads.splice(i, 1);
              i--;
            } else if (queuedRead.hole.end > size) {
              queuedRead.hole.end = size;
              queuedRead.strictTarget = true;
              for (let j = 0; j < queuedRead.pendingSlices.length; j++) {
                const slice = queuedRead.pendingSlices[j];
                if (slice.start >= size) {
                  slice.resolve(null);
                  queuedRead.pendingSlices.splice(j, 1);
                  j--;
                }
              }
            }
          }
        }
        signalWorkerStoppedRunning(worker) {
          worker.running = false;
          if (!worker.aborted) {
            worker.pendingSlices.length = 0;
          }
        }
        /** Called when a worker reaches the end of the underlying data and must be cleaned up. */
        onWorkerFinished(worker) {
          const index = this.workers.indexOf(worker);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(index !== -1);
          worker.running = false;
          this.workers.splice(index, 1);
          this.options.onIdleWorkerRemoved?.(worker);
          if (this.fileSize === null) {
            this.supplyFileSize(worker.currentPos);
          }
          for (const pendingSlice of worker.pendingSlices) {
            pendingSlice.resolve(null);
          }
        }
        insertIntoCache(entry) {
          if (this.options.maxCacheSize === 0) {
            return;
          }
          let insertionIndex =
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.eE)(
              this.cache,
              entry.start,
              (x) => x.start,
            ) + 1;
          if (insertionIndex > 0) {
            const previous = this.cache[insertionIndex - 1];
            if (previous.end >= entry.end) {
              return;
            }
            if (previous.end > entry.start) {
              const joined = new Uint8Array(entry.end - previous.start);
              joined.set(previous.bytes, 0);
              joined.set(entry.bytes, entry.start - previous.start);
              this.currentCacheSize += entry.end - previous.end;
              previous.bytes = joined;
              previous.view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(
                joined,
              );
              previous.end = entry.end;
              insertionIndex--;
              entry = previous;
            } else {
              this.cache.splice(insertionIndex, 0, entry);
              this.currentCacheSize += entry.bytes.length;
            }
          } else {
            this.cache.splice(insertionIndex, 0, entry);
            this.currentCacheSize += entry.bytes.length;
          }
          for (let i = insertionIndex + 1; i < this.cache.length; i++) {
            const next = this.cache[i];
            if (entry.end <= next.start) {
              break;
            }
            if (entry.end >= next.end) {
              this.cache.splice(i, 1);
              this.currentCacheSize -= next.bytes.length;
              i--;
              continue;
            }
            const joined = new Uint8Array(next.end - entry.start);
            joined.set(entry.bytes, 0);
            joined.set(next.bytes, next.start - entry.start);
            this.currentCacheSize -= entry.end - next.start;
            entry.bytes = joined;
            entry.view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(joined);
            entry.end = next.end;
            this.cache.splice(i, 1);
            break;
          }
          while (this.currentCacheSize > this.options.maxCacheSize) {
            let oldestIndex = 0;
            let oldestEntry = this.cache[0];
            for (let i = 1; i < this.cache.length; i++) {
              const entry2 = this.cache[i];
              if (entry2.age < oldestEntry.age) {
                oldestIndex = i;
                oldestEntry = entry2;
              }
            }
            if (
              this.currentCacheSize - oldestEntry.bytes.length <=
              this.options.maxCacheSize
            ) {
              break;
            }
            this.cache.splice(oldestIndex, 1);
            this.currentCacheSize -= oldestEntry.bytes.length;
          }
        }
        dispose() {
          for (const worker of this.workers) {
            for (const slice of worker.pendingSlices) {
              slice.reject(new _input_js__WEBPACK_IMPORTED_MODULE_2__.QO());
            }
            worker.pendingSlices.length = 0;
            worker.aborted = true;
            if (!worker.running) {
              this.options.onIdleWorkerRemoved?.(worker);
            }
          }
          for (const queuedRead of this.queuedReads) {
            for (const slice of queuedRead.pendingSlices) {
              slice.reject(new _input_js__WEBPACK_IMPORTED_MODULE_2__.QO());
            }
          }
          this.workers.length = 0;
          this.cache.length = 0;
          this.queuedReads.length = 0;
          this.disposed = true;
        }
      }
      class NullSource /* unused pure expression or super */ extends null {
        _getFileSize() {
          return null;
        }
        _read() {
          return null;
        }
        _dispose() {}
      }
      class RangedSource extends Source {
        /** @internal */
        constructor(baseSource, offset, length) {
          super();
          this._ref = null;
          if (baseSource._disposed) {
            throw new Error("Cannot create a slice of a disposed source.");
          }
          this._baseSource = baseSource;
          this._offset = offset;
          this._length = length ?? null;
        }
        /** @internal */
        _getFileSize() {
          const baseSize = this._baseSource._getFileSize();
          if (baseSize === void 0) {
            return this._length !== null ? this._length : void 0;
          }
          if (baseSize === null) {
            if (this._length !== null) {
              return this._length;
            } else {
              return null;
            }
          }
          return (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.qE)(
            baseSize - this._offset,
            0,
            this._length ?? Infinity,
          );
        }
        /** @internal */
        _read(start, end, minReadPosition, maxReadPosition) {
          if (this._length !== null && end > this._length) {
            return null;
          }
          const result = this._baseSource._read(
            this._offset + start,
            this._offset + end,
            this._offset + minReadPosition,
            this._offset + maxReadPosition,
          );
          const processResult = (result2) => {
            if (!result2) {
              return null;
            }
            result2.offset -= this._offset;
            return result2;
          };
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(result)) {
            return result.then(processResult);
          } else {
            return processResult(result);
          }
        }
        /** @internal */
        _dispose() {
          this._ref?.free();
        }
        ref() {
          this._ref ??= this._baseSource.ref();
          return super.ref();
        }
      }
    },
    /***/
    7860(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        E: () =>
          /* binding */
          WaveDemuxer,
        /* harmony export */
      });
      var _demuxer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2114);
      var _metadata_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8957);
      var _misc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6760);
      var _packet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6016);
      var _reader_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5815);
      var _id3_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7400);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      var WaveFormat;
      (function (WaveFormat2) {
        WaveFormat2[(WaveFormat2["PCM"] = 1)] = "PCM";
        WaveFormat2[(WaveFormat2["IEEE_FLOAT"] = 3)] = "IEEE_FLOAT";
        WaveFormat2[(WaveFormat2["ALAW"] = 6)] = "ALAW";
        WaveFormat2[(WaveFormat2["MULAW"] = 7)] = "MULAW";
        WaveFormat2[(WaveFormat2["EXTENSIBLE"] = 65534)] = "EXTENSIBLE";
      })(WaveFormat || (WaveFormat = {}));
      class WaveDemuxer extends _demuxer_js__WEBPACK_IMPORTED_MODULE_0__.B {
        constructor(input) {
          super(input);
          this.metadataPromise = null;
          this.dataStart = -1;
          this.dataSize = -1;
          this.audioInfo = null;
          this.trackBackings = [];
          this.lastKnownPacketIndex = 0;
          this.metadataTags = {};
          this.reader = input._reader;
        }
        async readMetadata() {
          return (this.metadataPromise ??= (async () => {
            let slice = this.reader.requestSlice(0, 12);
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice))
              slice = await slice;
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(slice);
            const riffType = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.IT)(
              slice,
              4,
            );
            const littleEndian = riffType !== "RIFX";
            const isRf64 = riffType === "RF64";
            const outerChunkSize = (0,
            _reader_js__WEBPACK_IMPORTED_MODULE_4__.PF)(slice, littleEndian);
            let totalFileSize = isRf64
              ? this.reader.fileSize
              : Math.min(outerChunkSize + 8, this.reader.fileSize ?? Infinity);
            const format = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.IT)(
              slice,
              4,
            );
            if (format !== "WAVE") {
              throw new Error("Invalid WAVE file - wrong format");
            }
            let chunksRead = 0;
            let dataChunkSize = null;
            let currentPos = slice.filePos;
            while (totalFileSize === null || currentPos < totalFileSize) {
              let slice2 = this.reader.requestSlice(currentPos, 8);
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice2))
                slice2 = await slice2;
              if (!slice2) break;
              const chunkId = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.IT)(
                slice2,
                4,
              );
              const chunkSize = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.PF)(
                slice2,
                littleEndian,
              );
              const startPos = slice2.filePos;
              if (isRf64 && chunksRead === 0 && chunkId !== "ds64") {
                throw new Error(
                  'Invalid RF64 file: First chunk must be "ds64".',
                );
              }
              if (chunkId === "fmt ") {
                await this.parseFmtChunk(startPos, chunkSize, littleEndian);
              } else if (chunkId === "data") {
                dataChunkSize ??= chunkSize;
                this.dataStart = slice2.filePos;
                this.dataSize = Math.min(
                  dataChunkSize,
                  (totalFileSize ?? Infinity) - this.dataStart,
                );
                if (this.reader.fileSize === null) {
                  break;
                }
              } else if (chunkId === "ds64") {
                let ds64Slice = this.reader.requestSlice(startPos, chunkSize);
                if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(ds64Slice))
                  ds64Slice = await ds64Slice;
                if (!ds64Slice) break;
                const riffChunkSize = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_4__.IM)(
                  ds64Slice,
                  littleEndian,
                );
                dataChunkSize = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.IM)(
                  ds64Slice,
                  littleEndian,
                );
                totalFileSize = Math.min(
                  riffChunkSize + 8,
                  this.reader.fileSize ?? Infinity,
                );
              } else if (chunkId === "LIST") {
                await this.parseListChunk(startPos, chunkSize, littleEndian);
              } else if (chunkId === "ID3 " || chunkId === "id3 ") {
                await this.parseId3Chunk(startPos, chunkSize);
              }
              currentPos = startPos + chunkSize + (chunkSize & 1);
              chunksRead++;
            }
            if (!this.audioInfo) {
              throw new Error('Invalid WAVE file - missing "fmt " chunk');
            }
            if (this.dataStart === -1) {
              throw new Error('Invalid WAVE file - missing "data" chunk');
            }
            const blockSize = this.audioInfo.blockSizeInBytes;
            this.dataSize = Math.floor(this.dataSize / blockSize) * blockSize;
            this.trackBackings.push(new WaveAudioTrackBacking(this));
          })());
        }
        async parseFmtChunk(startPos, size, littleEndian) {
          let slice = this.reader.requestSlice(startPos, size);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice))
            slice = await slice;
          if (!slice) return;
          let formatTag = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.Vv)(
            slice,
            littleEndian,
          );
          const numChannels = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.Vv)(
            slice,
            littleEndian,
          );
          const sampleRate = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.PF)(
            slice,
            littleEndian,
          );
          slice.skip(4);
          const blockAlign = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.Vv)(
            slice,
            littleEndian,
          );
          let bitsPerSample;
          if (size === 14) {
            bitsPerSample = 8;
          } else {
            bitsPerSample = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.Vv)(
              slice,
              littleEndian,
            );
          }
          if (size >= 18 && formatTag !== 357) {
            const cbSize = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.Vv)(
              slice,
              littleEndian,
            );
            const remainingSize = size - 18;
            const extensionSize = Math.min(remainingSize, cbSize);
            if (extensionSize >= 22 && formatTag === WaveFormat.EXTENSIBLE) {
              slice.skip(2 + 4);
              const subFormat = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.io)(
                slice,
                16,
              );
              formatTag = subFormat[0] | (subFormat[1] << 8);
            }
          }
          if (formatTag === WaveFormat.MULAW || formatTag === WaveFormat.ALAW) {
            bitsPerSample = 8;
          }
          if (
            formatTag !== WaveFormat.PCM &&
            formatTag !== WaveFormat.IEEE_FLOAT &&
            formatTag !== WaveFormat.ALAW &&
            formatTag !== WaveFormat.MULAW
          ) {
            throw new Error(
              "Unsupported WAVE codec (format tag ".concat(
                formatTag,
                "). Only integer/float PCM, A-law, and \u03BC-law are",
              ) + " supported.",
            );
          }
          if (
            formatTag === WaveFormat.PCM &&
            ![8, 16, 24, 32].includes(bitsPerSample)
          ) {
            throw new Error(
              "Unsupported WAVE PCM bit depth (".concat(
                bitsPerSample,
                "). Only 8, 16, 24, and 32 bits are supported.",
              ),
            );
          }
          if (
            formatTag === WaveFormat.IEEE_FLOAT &&
            ![32, 64].includes(bitsPerSample)
          ) {
            throw new Error(
              "Unsupported WAVE float bit depth (".concat(
                bitsPerSample,
                "). Only 32 and 64 bits are supported.",
              ),
            );
          }
          this.audioInfo = {
            format: formatTag,
            numberOfChannels: numChannels,
            sampleRate,
            sampleSizeInBytes: Math.ceil(bitsPerSample / 8),
            blockSizeInBytes: blockAlign,
          };
        }
        async parseListChunk(startPos, size, littleEndian) {
          let slice = this.reader.requestSlice(startPos, size);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice))
            slice = await slice;
          if (!slice) return;
          const infoType = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.IT)(
            slice,
            4,
          );
          if (infoType !== "INFO" && infoType !== "INF0") {
            return;
          }
          let currentPos = slice.filePos;
          while (currentPos <= startPos + size - 8) {
            slice.filePos = currentPos;
            const chunkName = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.IT)(
              slice,
              4,
            );
            const chunkSize = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.PF)(
              slice,
              littleEndian,
            );
            const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.io)(
              slice,
              chunkSize,
            );
            let stringLength = 0;
            for (let i = 0; i < bytes.length; i++) {
              if (bytes[i] === 0) {
                break;
              }
              stringLength++;
            }
            const value = String.fromCharCode(
              ...bytes.subarray(0, stringLength),
            );
            this.metadataTags.raw ??= {};
            this.metadataTags.raw[chunkName] = value;
            switch (chunkName) {
              case "INAM":
              case "TITL":
                {
                  this.metadataTags.title ??= value;
                }
                break;
              case "TIT3":
                {
                  this.metadataTags.description ??= value;
                }
                break;
              case "IART":
                {
                  this.metadataTags.artist ??= value;
                }
                break;
              case "IPRD":
                {
                  this.metadataTags.album ??= value;
                }
                break;
              case "IPRT":
              case "ITRK":
              case "TRCK":
                {
                  const parts = value.split("/");
                  const trackNum = Number.parseInt(parts[0], 10);
                  const tracksTotal = parts[1] && Number.parseInt(parts[1], 10);
                  if (Number.isInteger(trackNum) && trackNum > 0) {
                    this.metadataTags.trackNumber ??= trackNum;
                  }
                  if (
                    tracksTotal &&
                    Number.isInteger(tracksTotal) &&
                    tracksTotal > 0
                  ) {
                    this.metadataTags.tracksTotal ??= tracksTotal;
                  }
                }
                break;
              case "ICRD":
              case "IDIT":
                {
                  const date = new Date(value);
                  if (!Number.isNaN(date.getTime())) {
                    this.metadataTags.date ??= date;
                  }
                }
                break;
              case "YEAR":
                {
                  const year = Number.parseInt(value, 10);
                  if (Number.isInteger(year) && year > 0) {
                    this.metadataTags.date ??= new Date(year, 0, 1);
                  }
                }
                break;
              case "IGNR":
              case "GENR":
                {
                  this.metadataTags.genre ??= value;
                }
                break;
              case "ICMT":
              case "CMNT":
              case "COMM":
                {
                  this.metadataTags.comment ??= value;
                }
                break;
            }
            currentPos += 8 + chunkSize + (chunkSize & 1);
          }
        }
        async parseId3Chunk(startPos, size) {
          let slice = this.reader.requestSlice(startPos, size);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice))
            slice = await slice;
          if (!slice) return;
          const id3V2Header = (0, _id3_js__WEBPACK_IMPORTED_MODULE_5__.IX)(
            slice,
          );
          if (id3V2Header) {
            const availableSize =
              size - _id3_js__WEBPACK_IMPORTED_MODULE_5__.sY;
            id3V2Header.size = Math.min(id3V2Header.size, availableSize);
            if (id3V2Header.size > 0) {
              const contentSlice = slice.slice(
                startPos + _id3_js__WEBPACK_IMPORTED_MODULE_5__.sY,
                id3V2Header.size,
              );
              (0, _id3_js__WEBPACK_IMPORTED_MODULE_5__.cG)(
                contentSlice,
                id3V2Header,
                this.metadataTags,
              );
            }
          }
        }
        getCodec() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.audioInfo);
          if (this.audioInfo.format === WaveFormat.MULAW) {
            return "ulaw";
          }
          if (this.audioInfo.format === WaveFormat.ALAW) {
            return "alaw";
          }
          if (this.audioInfo.format === WaveFormat.PCM) {
            if (this.audioInfo.sampleSizeInBytes === 1) {
              return "pcm-u8";
            } else if (this.audioInfo.sampleSizeInBytes === 2) {
              return "pcm-s16";
            } else if (this.audioInfo.sampleSizeInBytes === 3) {
              return "pcm-s24";
            } else if (this.audioInfo.sampleSizeInBytes === 4) {
              return "pcm-s32";
            }
          }
          if (this.audioInfo.format === WaveFormat.IEEE_FLOAT) {
            if (this.audioInfo.sampleSizeInBytes === 4) {
              return "pcm-f32";
            } else if (this.audioInfo.sampleSizeInBytes === 8) {
              return "pcm-f64";
            }
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(false);
        }
        async getMimeType() {
          return "audio/wav";
        }
        async getTrackBackings() {
          await this.readMetadata();
          return this.trackBackings;
        }
        async getMetadataTags() {
          await this.readMetadata();
          return this.metadataTags;
        }
      }
      const PACKET_SIZE_IN_FRAMES = 2048;
      class WaveAudioTrackBacking {
        constructor(demuxer) {
          this.demuxer = demuxer;
        }
        getType() {
          return "audio";
        }
        getId() {
          return 1;
        }
        getNumber() {
          return 1;
        }
        getCodec() {
          return this.demuxer.getCodec();
        }
        getInternalCodecId() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          return this.demuxer.audioInfo.format;
        }
        async getDecoderConfig() {
          const codec = this.demuxer.getCodec();
          if (!codec) {
            return null;
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          return {
            codec,
            numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
            sampleRate: this.demuxer.audioInfo.sampleRate,
          };
        }
        getNumberOfChannels() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          return this.demuxer.audioInfo.numberOfChannels;
        }
        getSampleRate() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          return this.demuxer.audioInfo.sampleRate;
        }
        getTimeResolution() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          return this.demuxer.audioInfo.sampleRate;
        }
        isRelativeToUnixEpoch() {
          return false;
        }
        getUnixTimeForTimestamp() {
          return null;
        }
        getPairingMask() {
          return 1n;
        }
        getBitrate() {
          return null;
        }
        getAverageBitrate() {
          return null;
        }
        async getDurationFromMetadata() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
            this.demuxer.dataSize !== -1,
          );
          return (
            this.demuxer.dataSize /
            this.demuxer.audioInfo.blockSizeInBytes /
            this.demuxer.audioInfo.sampleRate
          );
        }
        async getLiveRefreshInterval() {
          return null;
        }
        getName() {
          return null;
        }
        getLanguageCode() {
          return _misc_js__WEBPACK_IMPORTED_MODULE_2__.IR;
        }
        getDisposition() {
          return {
            ..._metadata_js__WEBPACK_IMPORTED_MODULE_1__.gM,
          };
        }
        async getPacketAtIndex(packetIndex, options) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(packetIndex >= 0);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          const startOffset =
            packetIndex *
            PACKET_SIZE_IN_FRAMES *
            this.demuxer.audioInfo.blockSizeInBytes;
          if (startOffset >= this.demuxer.dataSize) {
            return null;
          }
          const sizeInBytes = Math.min(
            PACKET_SIZE_IN_FRAMES * this.demuxer.audioInfo.blockSizeInBytes,
            this.demuxer.dataSize - startOffset,
          );
          if (this.demuxer.reader.fileSize === null) {
            let slice = this.demuxer.reader.requestSlice(
              this.demuxer.dataStart + startOffset,
              sizeInBytes,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice))
              slice = await slice;
            if (!slice) {
              return null;
            }
          }
          let data;
          if (options.metadataOnly) {
            data = _packet_js__WEBPACK_IMPORTED_MODULE_3__.T;
          } else {
            let slice = this.demuxer.reader.requestSlice(
              this.demuxer.dataStart + startOffset,
              sizeInBytes,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice))
              slice = await slice;
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(slice);
            data = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.io)(
              slice,
              sizeInBytes,
            );
          }
          const timestamp =
            (packetIndex * PACKET_SIZE_IN_FRAMES) /
            this.demuxer.audioInfo.sampleRate;
          const duration =
            sizeInBytes /
            this.demuxer.audioInfo.blockSizeInBytes /
            this.demuxer.audioInfo.sampleRate;
          this.demuxer.lastKnownPacketIndex = Math.max(
            packetIndex,
            this.demuxer.lastKnownPacketIndex,
          );
          return new _packet_js__WEBPACK_IMPORTED_MODULE_3__.Z(
            data,
            "key",
            timestamp,
            duration,
            packetIndex,
            sizeInBytes,
          );
        }
        getFirstPacket(options) {
          return this.getPacketAtIndex(0, options);
        }
        async getPacket(timestamp, options) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          const packetIndex = Math.floor(
            Math.min(
              (timestamp * this.demuxer.audioInfo.sampleRate) /
                PACKET_SIZE_IN_FRAMES,
              (this.demuxer.dataSize - 1) /
                (PACKET_SIZE_IN_FRAMES *
                  this.demuxer.audioInfo.blockSizeInBytes),
            ),
          );
          if (packetIndex < 0) {
            return null;
          }
          const packet = await this.getPacketAtIndex(packetIndex, options);
          if (packet) {
            return packet;
          }
          if (packetIndex === 0) {
            return null;
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
            this.demuxer.reader.fileSize === null,
          );
          let currentPacket = await this.getPacketAtIndex(
            this.demuxer.lastKnownPacketIndex,
            options,
          );
          while (currentPacket) {
            const nextPacket = await this.getNextPacket(currentPacket, options);
            if (!nextPacket) {
              break;
            }
            currentPacket = nextPacket;
          }
          return currentPacket;
        }
        getNextPacket(packet, options) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          const packetIndex = Math.round(
            (packet.timestamp * this.demuxer.audioInfo.sampleRate) /
              PACKET_SIZE_IN_FRAMES,
          );
          return this.getPacketAtIndex(packetIndex + 1, options);
        }
        getKeyPacket(timestamp, options) {
          return this.getPacket(timestamp, options);
        }
        getNextKeyPacket(packet, options) {
          return this.getNextPacket(packet, options);
        }
      }
    },
  },
]);
