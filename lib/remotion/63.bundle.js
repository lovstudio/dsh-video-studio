"use strict";
(self["webpackChunk_lovstudio_dsh_video_studio"] =
  self["webpackChunk_lovstudio_dsh_video_studio"] || []).push([
  [63],
  {
    /***/
    9745(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        N: () =>
          /* binding */
          AC3_SAMPLE_RATES,
        /* harmony export */
        P: () =>
          /* binding */
          EAC3_REDUCED_SAMPLE_RATES,
        /* harmony export */
      });
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const AC3_SAMPLE_RATES = [48e3, 44100, 32e3];
      const EAC3_REDUCED_SAMPLE_RATES = [24e3, 22050, 16e3];
    },
    /***/
    3486(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        _: () =>
          /* binding */
          Bitstream,
        /* harmony export */
      });
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class Bitstream {
        constructor(bytes) {
          this.bytes = bytes;
          this.pos = 0;
        }
        seekToByte(byteOffset) {
          this.pos = 8 * byteOffset;
        }
        readBit() {
          const byteIndex = Math.floor(this.pos / 8);
          const byte = this.bytes[byteIndex] ?? 0;
          const bitIndex = 7 - (this.pos & 7);
          const bit = (byte & (1 << bitIndex)) >> bitIndex;
          this.pos++;
          return bit;
        }
        readBits(n) {
          if (n === 1) {
            return this.readBit();
          }
          let result = 0;
          for (let i = 0; i < n; i++) {
            result <<= 1;
            result |= this.readBit();
          }
          return result;
        }
        writeBits(n, value) {
          const end = this.pos + n;
          for (let i = this.pos; i < end; i++) {
            const byteIndex = Math.floor(i / 8);
            let byte = this.bytes[byteIndex];
            const bitIndex = 7 - (i & 7);
            byte &= ~(1 << bitIndex);
            byte |=
              ((value & (1 << (end - i - 1))) >> (end - i - 1)) << bitIndex;
            this.bytes[byteIndex] = byte;
          }
          this.pos = end;
        }
        readAlignedByte() {
          if (this.pos % 8 !== 0) {
            throw new Error("Bitstream is not byte-aligned.");
          }
          const byteIndex = this.pos / 8;
          const byte = this.bytes[byteIndex] ?? 0;
          this.pos += 8;
          return byte;
        }
        skipBits(n) {
          this.pos += n;
        }
        getBitsLeft() {
          return this.bytes.length * 8 - this.pos;
        }
        clone() {
          const clone = new Bitstream(this.bytes);
          clone.pos = this.pos;
          return clone;
        }
      }
    },
    /***/
    5694(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        H: () =>
          /* binding */
          AdtsDemuxer,
        /* harmony export */
        s: () =>
          /* binding */
          SAMPLES_PER_AAC_FRAME,
        /* harmony export */
      });
      var _shared_aac_misc_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(4691);
      var _demuxer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2114);
      var _id3_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7400);
      var _metadata_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8957);
      var _misc_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6760);
      var _packet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6016);
      var _reader_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5815);
      var _adts_reader_js__WEBPACK_IMPORTED_MODULE_7__ =
        __webpack_require__(5627);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const SAMPLES_PER_AAC_FRAME = 1024;
      class AdtsDemuxer extends _demuxer_js__WEBPACK_IMPORTED_MODULE_1__.B {
        constructor(input) {
          super(input);
          this.metadataPromise = null;
          this.firstFrameHeader = null;
          this.loadedSamples = [];
          this.metadataTags = null;
          this.trackBackings = [];
          this.readingMutex = new _misc_js__WEBPACK_IMPORTED_MODULE_4__.aD();
          this.lastSampleLoaded = false;
          this.lastLoadedPos = 0;
          this.nextTimestampInSamples = 0;
          this.reader = input._reader;
        }
        async readMetadata() {
          return (this.metadataPromise ??= (async () => {
            while (!this.firstFrameHeader && !this.lastSampleLoaded) {
              await this.advanceReader();
            }
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
              this.firstFrameHeader,
            );
            this.trackBackings = [new AdtsAudioTrackBacking(this)];
          })());
        }
        async advanceReader() {
          if (this.lastLoadedPos === 0) {
            while (true) {
              let slice2 = this.reader.requestSlice(
                this.lastLoadedPos,
                _id3_js__WEBPACK_IMPORTED_MODULE_2__.sY,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(slice2))
                slice2 = await slice2;
              if (!slice2) {
                this.lastSampleLoaded = true;
                return;
              }
              const id3V2Header = (0, _id3_js__WEBPACK_IMPORTED_MODULE_2__.IX)(
                slice2,
              );
              if (!id3V2Header) {
                break;
              }
              this.lastLoadedPos = slice2.filePos + id3V2Header.size;
            }
          }
          let slice = this.reader.requestSliceRange(
            this.lastLoadedPos,
            _adts_reader_js__WEBPACK_IMPORTED_MODULE_7__.gc,
            _adts_reader_js__WEBPACK_IMPORTED_MODULE_7__.Y$,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(slice))
            slice = await slice;
          if (!slice) {
            this.lastSampleLoaded = true;
            return;
          }
          const header = (0, _adts_reader_js__WEBPACK_IMPORTED_MODULE_7__.lh)(
            slice,
          );
          if (!header) {
            this.lastSampleLoaded = true;
            return;
          }
          if (
            this.reader.fileSize !== null &&
            header.startPos + header.frameLength > this.reader.fileSize
          ) {
            this.lastSampleLoaded = true;
            return;
          }
          if (!this.firstFrameHeader) {
            this.firstFrameHeader = header;
          }
          const sampleRate =
            _shared_aac_misc_js__WEBPACK_IMPORTED_MODULE_0__.Im[
              header.samplingFrequencyIndex
            ];
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(sampleRate !== void 0);
          const sampleDuration = SAMPLES_PER_AAC_FRAME / sampleRate;
          const sample = {
            timestamp: this.nextTimestampInSamples / sampleRate,
            duration: sampleDuration,
            dataStart: header.startPos,
            dataSize: header.frameLength,
          };
          this.loadedSamples.push(sample);
          this.nextTimestampInSamples += SAMPLES_PER_AAC_FRAME;
          this.lastLoadedPos = header.startPos + header.frameLength;
        }
        async getMimeType() {
          return "audio/aac";
        }
        async getTrackBackings() {
          await this.readMetadata();
          return this.trackBackings;
        }
        async getMetadataTags() {
          const release = await this.readingMutex.acquire();
          try {
            await this.readMetadata();
            if (this.metadataTags) {
              return this.metadataTags;
            }
            this.metadataTags = {};
            let currentPos = 0;
            while (true) {
              let headerSlice = this.reader.requestSlice(
                currentPos,
                _id3_js__WEBPACK_IMPORTED_MODULE_2__.sY,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(headerSlice))
                headerSlice = await headerSlice;
              if (!headerSlice) break;
              const id3V2Header = (0, _id3_js__WEBPACK_IMPORTED_MODULE_2__.IX)(
                headerSlice,
              );
              if (!id3V2Header) {
                break;
              }
              let contentSlice = this.reader.requestSlice(
                headerSlice.filePos,
                id3V2Header.size,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(contentSlice))
                contentSlice = await contentSlice;
              if (!contentSlice) break;
              (0, _id3_js__WEBPACK_IMPORTED_MODULE_2__.cG)(
                contentSlice,
                id3V2Header,
                this.metadataTags,
              );
              currentPos = headerSlice.filePos + id3V2Header.size;
            }
            return this.metadataTags;
          } finally {
            release();
          }
        }
      }
      class AdtsAudioTrackBacking {
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
        getTimeResolution() {
          const sampleRate = this.getSampleRate();
          return sampleRate / SAMPLES_PER_AAC_FRAME;
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
          return null;
        }
        async getLiveRefreshInterval() {
          return null;
        }
        getName() {
          return null;
        }
        getLanguageCode() {
          return _misc_js__WEBPACK_IMPORTED_MODULE_4__.IR;
        }
        getCodec() {
          return "aac";
        }
        getInternalCodecId() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            this.demuxer.firstFrameHeader,
          );
          return this.demuxer.firstFrameHeader.objectType;
        }
        getNumberOfChannels() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            this.demuxer.firstFrameHeader,
          );
          const numberOfChannels =
            _shared_aac_misc_js__WEBPACK_IMPORTED_MODULE_0__.Ti[
              this.demuxer.firstFrameHeader.channelConfiguration
            ];
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            numberOfChannels !== void 0,
          );
          return numberOfChannels;
        }
        getSampleRate() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            this.demuxer.firstFrameHeader,
          );
          const sampleRate =
            _shared_aac_misc_js__WEBPACK_IMPORTED_MODULE_0__.Im[
              this.demuxer.firstFrameHeader.samplingFrequencyIndex
            ];
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(sampleRate !== void 0);
          return sampleRate;
        }
        getDisposition() {
          return {
            ..._metadata_js__WEBPACK_IMPORTED_MODULE_3__.gM,
          };
        }
        async getDecoderConfig() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            this.demuxer.firstFrameHeader,
          );
          return {
            codec: "mp4a.40.".concat(this.demuxer.firstFrameHeader.objectType),
            numberOfChannels: this.getNumberOfChannels(),
            sampleRate: this.getSampleRate(),
          };
        }
        async getPacketAtIndex(sampleIndex, options) {
          if (sampleIndex === -1) {
            return null;
          }
          const rawSample = this.demuxer.loadedSamples[sampleIndex];
          if (!rawSample) {
            return null;
          }
          let data;
          if (options.metadataOnly) {
            data = _packet_js__WEBPACK_IMPORTED_MODULE_5__.T;
          } else {
            let slice = this.demuxer.reader.requestSlice(
              rawSample.dataStart,
              rawSample.dataSize,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(slice))
              slice = await slice;
            if (!slice) {
              return null;
            }
            data = (0, _reader_js__WEBPACK_IMPORTED_MODULE_6__.io)(
              slice,
              rawSample.dataSize,
            );
          }
          return new _packet_js__WEBPACK_IMPORTED_MODULE_5__.Z(
            data,
            "key",
            rawSample.timestamp,
            rawSample.duration,
            sampleIndex,
            rawSample.dataSize,
          );
        }
        getFirstPacket(options) {
          return this.getPacketAtIndex(0, options);
        }
        async getNextPacket(packet, options) {
          const release = await this.demuxer.readingMutex.acquire();
          try {
            const sampleIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.pl)(
              this.demuxer.loadedSamples,
              packet.timestamp,
              (x) => x.timestamp,
            );
            if (sampleIndex === -1) {
              throw new Error("Packet was not created from this track.");
            }
            const nextIndex = sampleIndex + 1;
            while (
              nextIndex >= this.demuxer.loadedSamples.length &&
              !this.demuxer.lastSampleLoaded
            ) {
              await this.demuxer.advanceReader();
            }
            return this.getPacketAtIndex(nextIndex, options);
          } finally {
            release();
          }
        }
        async getPacket(timestamp, options) {
          const release = await this.demuxer.readingMutex.acquire();
          try {
            while (true) {
              const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
                this.demuxer.loadedSamples,
                timestamp,
                (x) => x.timestamp,
              );
              if (index === -1 && this.demuxer.loadedSamples.length > 0) {
                return null;
              }
              if (this.demuxer.lastSampleLoaded) {
                return this.getPacketAtIndex(index, options);
              }
              if (index >= 0 && index + 1 < this.demuxer.loadedSamples.length) {
                return this.getPacketAtIndex(index, options);
              }
              await this.demuxer.advanceReader();
            }
          } finally {
            release();
          }
        }
        getKeyPacket(timestamp, options) {
          return this.getPacket(timestamp, options);
        }
        getNextKeyPacket(packet, options) {
          return this.getNextPacket(packet, options);
        }
      }
    },
    /***/
    5627(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        Y$: () =>
          /* binding */
          MAX_ADTS_FRAME_HEADER_SIZE,
        /* harmony export */
        gc: () =>
          /* binding */
          MIN_ADTS_FRAME_HEADER_SIZE,
        /* harmony export */
        lh: () =>
          /* binding */
          readAdtsFrameHeader,
        /* harmony export */
      });
      var _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(3486);
      var _reader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const MIN_ADTS_FRAME_HEADER_SIZE = 7;
      const MAX_ADTS_FRAME_HEADER_SIZE = 9;
      const readAdtsFrameHeader = (slice) => {
        const startPos = slice.filePos;
        const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__.io)(slice, 9);
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_0__._(bytes);
        const syncword = bitstream.readBits(12);
        if (syncword !== 4095) {
          return null;
        }
        bitstream.skipBits(1);
        const layer = bitstream.readBits(2);
        if (layer !== 0) {
          return null;
        }
        const protectionAbsence = bitstream.readBits(1);
        const objectType = bitstream.readBits(2) + 1;
        const samplingFrequencyIndex = bitstream.readBits(4);
        if (samplingFrequencyIndex === 15) {
          return null;
        }
        bitstream.skipBits(1);
        const channelConfiguration = bitstream.readBits(3);
        if (channelConfiguration === 0) {
          throw new Error(
            "ADTS frames with channel configuration 0 are not supported.",
          );
        }
        bitstream.skipBits(1);
        bitstream.skipBits(1);
        bitstream.skipBits(1);
        bitstream.skipBits(1);
        const frameLength = bitstream.readBits(13);
        bitstream.skipBits(11);
        const numberOfAacFrames = bitstream.readBits(2) + 1;
        if (numberOfAacFrames !== 1) {
          throw new Error(
            "ADTS frames with more than one AAC frame are not supported.",
          );
        }
        let crcCheck = null;
        if (protectionAbsence === 1) {
          slice.filePos -= 2;
        } else {
          crcCheck = bitstream.readBits(16);
        }
        return {
          objectType,
          samplingFrequencyIndex,
          channelConfiguration,
          frameLength,
          numberOfAacFrames,
          crcCheck,
          startPos,
        };
      };
    },
    /***/
    5277(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        U4: () =>
          /* binding */
          createAes128CbcDecryptStream,
        /* harmony export */
        UP: () =>
          /* binding */
          Aes128CbcContext,
        /* harmony export */
        ye: () =>
          /* binding */
          AES_128_BLOCK_SIZE,
        /* harmony export */
      });
      var _misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6760);
      var _reader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const AES_128_BLOCK_SIZE = 16;
      const Te4 = new Uint32Array(256);
      const Td0 = new Uint32Array(256);
      const Td1 = new Uint32Array(256);
      const Td2 = new Uint32Array(256);
      const Td3 = new Uint32Array(256);
      const Td4 = new Uint32Array(256);
      const rcon = new Uint32Array(10);
      let tablesGenerated = false;
      const generateAesTables = () => {
        const sbox = new Uint8Array(256);
        const log = new Uint8Array(256);
        const pow = new Uint8Array(256);
        for (let i = 0, p = 1; i < 256; i++) {
          pow[i] = p;
          log[p] = i;
          p = p ^ (p << 1) ^ (p & 128 ? 283 : 0);
        }
        const mul = (a, b) => (a && b ? pow[(log[a] + log[b]) % 255] : 0);
        sbox[0] = 99;
        for (let i = 1; i < 256; i++) {
          const x = pow[255 - log[i]];
          let s = x ^ (x << 1) ^ (x << 2) ^ (x << 3) ^ (x << 4);
          s = (s >>> 8) ^ (s & 255) ^ 99;
          sbox[i] = s;
        }
        for (let i = 0; i < 256; i++) {
          const s = sbox[i];
          const is = sbox.indexOf(i);
          Te4[i] = (s << 24) | (s << 16) | (s << 8) | s;
          Td4[i] = (is << 24) | (is << 16) | (is << 8) | is;
          const b0 = mul(is, 14);
          const b1 = mul(is, 9);
          const b2 = mul(is, 13);
          const b3 = mul(is, 11);
          const w = (b0 << 24) | (b1 << 16) | (b2 << 8) | b3;
          Td0[i] = w;
          Td1[i] = (w >>> 8) | (w << 24);
          Td2[i] = (w >>> 16) | (w << 16);
          Td3[i] = (w >>> 24) | (w << 8);
        }
        let r = 1;
        for (let i = 0; i < 10; i++) {
          rcon[i] = r << 24;
          r = (r << 1) ^ (r & 128 ? 283 : 0);
        }
        tablesGenerated = true;
      };
      class Aes128CbcContext {
        constructor() {
          this.roundkey = new Uint32Array(44);
          this.iv = new Uint32Array(
            AES_128_BLOCK_SIZE / Uint32Array.BYTES_PER_ELEMENT,
          );
          this.in = new Uint8Array(AES_128_BLOCK_SIZE);
          this.out = new Uint8Array(AES_128_BLOCK_SIZE);
          this.inView = new DataView(this.in.buffer);
          this.outView = new DataView(this.out.buffer);
        }
        init({ key, iv }) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(key.byteLength === 16);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.vA)(iv.byteLength === 16);
          if (!tablesGenerated) {
            generateAesTables();
          }
          const keyView = new DataView(
            key.buffer,
            key.byteOffset,
            key.byteLength,
          );
          const ivView = new DataView(iv.buffer, iv.byteOffset, iv.byteLength);
          this.roundkey[0] = keyView.getUint32(0, false);
          this.roundkey[1] = keyView.getUint32(4, false);
          this.roundkey[2] = keyView.getUint32(8, false);
          this.roundkey[3] = keyView.getUint32(12, false);
          this.iv[0] = ivView.getUint32(0, false);
          this.iv[1] = ivView.getUint32(4, false);
          this.iv[2] = ivView.getUint32(8, false);
          this.iv[3] = ivView.getUint32(12, false);
          for (let index = 4; index < 44; index += 4) {
            const temp = this.roundkey[index - 1];
            this.roundkey[index] =
              this.roundkey[index - 4] ^
              (Te4[(temp >>> 16) & 255] & 4278190080) ^
              (Te4[(temp >>> 8) & 255] & 16711680) ^
              (Te4[(temp >>> 0) & 255] & 65280) ^
              (Te4[(temp >>> 24) & 255] & 255) ^
              rcon[index / 4 - 1];
            this.roundkey[index + 1] =
              this.roundkey[index - 3] ^ this.roundkey[index];
            this.roundkey[index + 2] =
              this.roundkey[index - 2] ^ this.roundkey[index + 1];
            this.roundkey[index + 3] =
              this.roundkey[index - 1] ^ this.roundkey[index + 2];
          }
          for (let i = 0, j = 40; i < j; i += 4, j -= 4) {
            for (let k = 0; k < 4; k++) {
              const temp = this.roundkey[i + k];
              this.roundkey[i + k] = this.roundkey[j + k];
              this.roundkey[j + k] = temp;
            }
          }
          for (let index = 4; index < 40; index += 4) {
            for (let k = 0; k < 4; k++) {
              const rk = this.roundkey[index + k];
              this.roundkey[index + k] =
                Td0[Te4[(rk >>> 24) & 255] & 255] ^
                Td1[Te4[(rk >>> 16) & 255] & 255] ^
                Td2[Te4[(rk >>> 8) & 255] & 255] ^
                Td3[Te4[(rk >>> 0) & 255] & 255];
            }
          }
        }
        decrypt() {
          let s0 = this.inView.getUint32(0, false) ^ this.roundkey[0];
          let s1 = this.inView.getUint32(4, false) ^ this.roundkey[1];
          let s2 = this.inView.getUint32(8, false) ^ this.roundkey[2];
          let s3 = this.inView.getUint32(12, false) ^ this.roundkey[3];
          const temp0 = this.inView.getUint32(0, false);
          const temp1 = this.inView.getUint32(4, false);
          const temp2 = this.inView.getUint32(8, false);
          const temp3 = this.inView.getUint32(12, false);
          let t0, t1, t2, t3;
          for (let round = 1; round < 10; round++) {
            const offset = round * 4;
            t0 =
              Td0[s0 >>> 24] ^
              Td1[(s3 >>> 16) & 255] ^
              Td2[(s2 >>> 8) & 255] ^
              Td3[s1 & 255] ^
              this.roundkey[offset];
            t1 =
              Td0[s1 >>> 24] ^
              Td1[(s0 >>> 16) & 255] ^
              Td2[(s3 >>> 8) & 255] ^
              Td3[s2 & 255] ^
              this.roundkey[offset + 1];
            t2 =
              Td0[s2 >>> 24] ^
              Td1[(s1 >>> 16) & 255] ^
              Td2[(s0 >>> 8) & 255] ^
              Td3[s3 & 255] ^
              this.roundkey[offset + 2];
            t3 =
              Td0[s3 >>> 24] ^
              Td1[(s2 >>> 16) & 255] ^
              Td2[(s1 >>> 8) & 255] ^
              Td3[s0 & 255] ^
              this.roundkey[offset + 3];
            s0 = t0;
            s1 = t1;
            s2 = t2;
            s3 = t3;
          }
          const f0 =
            (Td4[(s0 >>> 24) & 255] & 4278190080) ^
            (Td4[(s3 >>> 16) & 255] & 16711680) ^
            (Td4[(s2 >>> 8) & 255] & 65280) ^
            (Td4[(s1 >>> 0) & 255] & 255) ^
            this.roundkey[40];
          const f1 =
            (Td4[(s1 >>> 24) & 255] & 4278190080) ^
            (Td4[(s0 >>> 16) & 255] & 16711680) ^
            (Td4[(s3 >>> 8) & 255] & 65280) ^
            (Td4[(s2 >>> 0) & 255] & 255) ^
            this.roundkey[41];
          const f2 =
            (Td4[(s2 >>> 24) & 255] & 4278190080) ^
            (Td4[(s1 >>> 16) & 255] & 16711680) ^
            (Td4[(s0 >>> 8) & 255] & 65280) ^
            (Td4[(s3 >>> 0) & 255] & 255) ^
            this.roundkey[42];
          const f3 =
            (Td4[(s3 >>> 24) & 255] & 4278190080) ^
            (Td4[(s2 >>> 16) & 255] & 16711680) ^
            (Td4[(s1 >>> 8) & 255] & 65280) ^
            (Td4[(s0 >>> 0) & 255] & 255) ^
            this.roundkey[43];
          this.outView.setUint32(0, f0 ^ this.iv[0], false);
          this.outView.setUint32(4, f1 ^ this.iv[1], false);
          this.outView.setUint32(8, f2 ^ this.iv[2], false);
          this.outView.setUint32(12, f3 ^ this.iv[3], false);
          this.iv[0] = temp0;
          this.iv[1] = temp1;
          this.iv[2] = temp2;
          this.iv[3] = temp3;
        }
      }
      const createAes128CbcDecryptStream = (reader, getInit, close) => {
        let initted = false;
        let pos = 0;
        const CHUNK_SIZE = 2 ** 16;
        const BLOCK_SIZE = 16;
        const aesContext = new Aes128CbcContext();
        return new ReadableStream({
          pull: async (controller) => {
            if (!initted) {
              aesContext.init(await getInit());
              initted = true;
            }
            const requestedLength = CHUNK_SIZE + BLOCK_SIZE;
            let nextSlice = reader.requestSliceRange(pos, 0, requestedLength);
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Qg)(nextSlice))
              nextSlice = await nextSlice;
            if (!nextSlice || nextSlice.length === 0) {
              throw new Error("Invalid ciphertext.");
            }
            const sliceLength = nextSlice.length;
            if (sliceLength % 16 !== 0) {
              throw new Error("Invalid ciphertext.");
            }
            const bytesToRead =
              sliceLength === requestedLength
                ? sliceLength - BLOCK_SIZE
                : sliceLength;
            const input = (0, _reader_js__WEBPACK_IMPORTED_MODULE_1__.io)(
              nextSlice,
              bytesToRead,
            );
            const output = new Uint8Array(bytesToRead);
            for (let i = 0; i < bytesToRead; i += 16) {
              aesContext.in.set(input.subarray(i, i + 16));
              aesContext.decrypt();
              output.set(aesContext.out, i);
            }
            if (bytesToRead < sliceLength) {
              controller.enqueue(output);
              pos += bytesToRead;
            } else {
              const paddingLength = output[bytesToRead - 1];
              if (paddingLength === 0 || paddingLength > 16) {
                throw new Error(
                  "Invalid PKCS#7 padding. Incorrect key or corrupted data.",
                );
              }
              const trimmedOutput = output.subarray(
                0,
                bytesToRead - paddingLength,
              );
              controller.enqueue(trimmedOutput);
              controller.close();
              close();
            }
          },
          cancel: () => {
            close();
          },
        });
      };
    },
    /***/
    2114(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        B: () =>
          /* binding */
          Demuxer,
        /* harmony export */
      });
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class Demuxer {
        constructor(input) {
          this.input = input;
        }
        dispose() {}
      }
    },
    /***/
    9926(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        D: () =>
          /* binding */
          FlacDemuxer,
        /* harmony export */
      });
      var _codec_data_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(9705);
      var _demuxer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2114);
      var _misc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6760);
      var _packet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6016);
      var _reader_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5815);
      var _metadata_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8957);
      var _flac_misc_js__WEBPACK_IMPORTED_MODULE_6__ =
        __webpack_require__(3972);
      var _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_7__ =
        __webpack_require__(3486);
      var _id3_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7400);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class FlacDemuxer extends _demuxer_js__WEBPACK_IMPORTED_MODULE_1__.B {
        constructor(input) {
          super(input);
          this.loadedSamples = [];
          this.metadataPromise = null;
          this.trackBacking = null;
          this.metadataTags = {};
          this.audioInfo = null;
          this.lastLoadedPos = null;
          this.blockingBit = null;
          this.readingMutex = new _misc_js__WEBPACK_IMPORTED_MODULE_2__.aD();
          this.lastSampleLoaded = false;
          this.reader = input._reader;
        }
        async getMetadataTags() {
          await this.readMetadata();
          return this.metadataTags;
        }
        async getTrackBackings() {
          await this.readMetadata();
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.trackBacking);
          return [this.trackBacking];
        }
        async getMimeType() {
          return "audio/flac";
        }
        async readMetadata() {
          return (this.metadataPromise ??= (async () => {
            let currentPos = 0;
            while (true) {
              let headerSlice = this.reader.requestSlice(
                currentPos,
                _id3_js__WEBPACK_IMPORTED_MODULE_8__.sY,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(headerSlice))
                headerSlice = await headerSlice;
              if (!headerSlice) {
                this.lastSampleLoaded = true;
                return;
              }
              const id3V2Header = (0, _id3_js__WEBPACK_IMPORTED_MODULE_8__.IX)(
                headerSlice,
              );
              if (!id3V2Header) {
                break;
              }
              let contentSlice = this.reader.requestSlice(
                headerSlice.filePos,
                id3V2Header.size,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(contentSlice))
                contentSlice = await contentSlice;
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(contentSlice);
              (0, _id3_js__WEBPACK_IMPORTED_MODULE_8__.cG)(
                contentSlice,
                id3V2Header,
                this.metadataTags,
              );
              currentPos = headerSlice.filePos + id3V2Header.size;
            }
            currentPos += 4;
            while (
              this.reader.fileSize === null ||
              currentPos < this.reader.fileSize
            ) {
              let sizeSlice = this.reader.requestSlice(currentPos, 4);
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(sizeSlice))
                sizeSlice = await sizeSlice;
              currentPos += 4;
              if (sizeSlice === null) {
                throw new Error(
                  "Metadata block at position ".concat(
                    currentPos,
                    " is too small! Corrupted file.",
                  ),
                );
              }
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(sizeSlice);
              const byte = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.eo)(
                sizeSlice,
              );
              const size = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.n2)(
                sizeSlice,
              );
              const isLastMetadata = (byte & 128) !== 0;
              const metaBlockType = byte & 127;
              switch (metaBlockType) {
                case _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.A3
                  .STREAMINFO: {
                  let streamInfoBlock = this.reader.requestSlice(
                    currentPos,
                    size,
                  );
                  if (
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(
                      streamInfoBlock,
                    )
                  )
                    streamInfoBlock = await streamInfoBlock;
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
                    streamInfoBlock,
                  );
                  if (streamInfoBlock === null) {
                    throw new Error(
                      "StreamInfo block at position ".concat(
                        currentPos,
                        " is too small! Corrupted file.",
                      ),
                    );
                  }
                  const streamInfoBytes = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_4__.io)(
                    streamInfoBlock,
                    34,
                  );
                  const bitstream =
                    new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_7__._(
                      streamInfoBytes,
                    );
                  const minimumBlockSize = bitstream.readBits(16);
                  const maximumBlockSize = bitstream.readBits(16);
                  const minimumFrameSize = bitstream.readBits(24);
                  const maximumFrameSize = bitstream.readBits(24);
                  const sampleRate = bitstream.readBits(20);
                  const numberOfChannels = bitstream.readBits(3) + 1;
                  bitstream.readBits(5);
                  const totalSamples = bitstream.readBits(36);
                  bitstream.skipBits(16 * 8);
                  const description = new Uint8Array(42);
                  description.set(new Uint8Array([102, 76, 97, 67]), 0);
                  description.set(new Uint8Array([128, 0, 0, 34]), 4);
                  description.set(streamInfoBytes, 8);
                  this.audioInfo = {
                    numberOfChannels,
                    sampleRate,
                    totalSamples,
                    minimumBlockSize,
                    maximumBlockSize,
                    minimumFrameSize,
                    maximumFrameSize,
                    description,
                  };
                  this.trackBacking = new FlacAudioTrackBacking(this);
                  break;
                }
                case _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.A3
                  .VORBIS_COMMENT: {
                  let vorbisCommentBlock = this.reader.requestSlice(
                    currentPos,
                    size,
                  );
                  if (
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(
                      vorbisCommentBlock,
                    )
                  )
                    vorbisCommentBlock = await vorbisCommentBlock;
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
                    vorbisCommentBlock,
                  );
                  (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.Oc)(
                    (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.io)(
                      vorbisCommentBlock,
                      size,
                    ),
                    this.metadataTags,
                  );
                  break;
                }
                case _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.A3.PICTURE: {
                  let pictureBlock = this.reader.requestSlice(currentPos, size);
                  if (
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(pictureBlock)
                  )
                    pictureBlock = await pictureBlock;
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(pictureBlock);
                  const pictureType = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_4__.cN)(pictureBlock);
                  const mediaTypeLength = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_4__.cN)(pictureBlock);
                  const mediaType =
                    _misc_js__WEBPACK_IMPORTED_MODULE_2__.su.decode(
                      (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.io)(
                        pictureBlock,
                        mediaTypeLength,
                      ),
                    );
                  const descriptionLength = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_4__.cN)(pictureBlock);
                  const description =
                    _misc_js__WEBPACK_IMPORTED_MODULE_2__.su.decode(
                      (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.io)(
                        pictureBlock,
                        descriptionLength,
                      ),
                    );
                  pictureBlock.skip(4 + 4 + 4 + 4);
                  const dataLength = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_4__.cN)(pictureBlock);
                  const data = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.io)(
                    pictureBlock,
                    dataLength,
                  );
                  this.metadataTags.images ??= [];
                  this.metadataTags.images.push({
                    data,
                    mimeType: mediaType,
                    // https://www.rfc-editor.org/rfc/rfc9639.html#table13
                    kind:
                      pictureType === 3
                        ? "coverFront"
                        : pictureType === 4
                          ? "coverBack"
                          : "unknown",
                    description,
                  });
                  break;
                }
                default:
                  break;
              }
              currentPos += size;
              if (isLastMetadata) {
                this.lastLoadedPos = currentPos;
                break;
              }
            }
            if (!this.audioInfo) {
              throw new Error(
                "Missing STREAMINFO metadata block! Corrupted FLAC file.",
              );
            }
          })());
        }
        async readNextFlacFrame({ startPos, isFirstPacket }) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.audioInfo);
          const minimumHeaderLength = 6;
          const maximumHeaderLength = 16;
          const minimumFrameLength = 10;
          const maximumFrameLength =
            this.audioInfo.maximumBlockSize *
              this.audioInfo.numberOfChannels *
              4 +
            maximumHeaderLength +
            2;
          const effectiveMinFrameSize =
            this.audioInfo.minimumFrameSize || minimumFrameLength;
          const effectiveMaxFrameSize =
            this.audioInfo.maximumFrameSize || maximumFrameLength;
          const maximumSliceLength =
            effectiveMaxFrameSize + maximumHeaderLength;
          const slice = await this.reader.requestSliceRange(
            startPos,
            maximumHeaderLength,
            maximumSliceLength,
          );
          if (!slice) {
            return null;
          }
          const frameHeader = this.readFlacFrameHeader({
            slice,
            isFirstPacket,
          });
          if (!frameHeader) {
            return null;
          }
          slice.filePos = startPos + effectiveMinFrameSize;
          while (true) {
            if (slice.filePos > slice.end - minimumHeaderLength) {
              return {
                num: frameHeader.num,
                blockSize: frameHeader.blockSize,
                sampleRate: frameHeader.sampleRate,
                size: slice.end - startPos,
                isLastFrame: true,
              };
            }
            const nextByte = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.eo)(
              slice,
            );
            if (nextByte === 255) {
              const positionBeforeReading = slice.filePos;
              const byteAfterNextByte = (0,
              _reader_js__WEBPACK_IMPORTED_MODULE_4__.eo)(slice);
              const expected = this.blockingBit === 1 ? 249 : 248;
              if (byteAfterNextByte !== expected) {
                slice.filePos = positionBeforeReading;
                continue;
              }
              slice.skip(-2);
              const lengthIfNextFlacFrameHeaderIsLegit =
                slice.filePos - startPos;
              const nextFrameHeader = this.readFlacFrameHeader({
                slice,
                isFirstPacket: false,
              });
              if (!nextFrameHeader) {
                slice.filePos = positionBeforeReading;
                continue;
              }
              if (this.blockingBit === 0) {
                if (nextFrameHeader.num - frameHeader.num !== 1) {
                  slice.filePos = positionBeforeReading;
                  continue;
                }
              } else {
                if (
                  nextFrameHeader.num - frameHeader.num !==
                  frameHeader.blockSize
                ) {
                  slice.filePos = positionBeforeReading;
                  continue;
                }
              }
              return {
                num: frameHeader.num,
                blockSize: frameHeader.blockSize,
                sampleRate: frameHeader.sampleRate,
                size: lengthIfNextFlacFrameHeaderIsLegit,
                isLastFrame: false,
              };
            }
          }
        }
        readFlacFrameHeader({ slice, isFirstPacket }) {
          const startOffset = slice.filePos;
          const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.io)(
            slice,
            4,
          );
          const bitstream =
            new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_7__._(bytes);
          const bits = bitstream.readBits(15);
          if (bits !== 32764) {
            return null;
          }
          if (this.blockingBit === null) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(isFirstPacket);
            const newBlockingBit = bitstream.readBits(1);
            this.blockingBit = newBlockingBit;
          } else if (this.blockingBit === 1) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(!isFirstPacket);
            const newBlockingBit = bitstream.readBits(1);
            if (newBlockingBit !== 1) {
              return null;
            }
          } else if (this.blockingBit === 0) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(!isFirstPacket);
            const newBlockingBit = bitstream.readBits(1);
            if (newBlockingBit !== 0) {
              return null;
            }
          } else {
            throw new Error("Invalid blocking bit");
          }
          const blockSizeOrUncommon = (0,
          _flac_misc_js__WEBPACK_IMPORTED_MODULE_6__.iv)(bitstream.readBits(4));
          if (!blockSizeOrUncommon) {
            return null;
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.audioInfo);
          const sampleRateOrUncommon = (0,
          _flac_misc_js__WEBPACK_IMPORTED_MODULE_6__.oP)(
            bitstream.readBits(4),
            this.audioInfo.sampleRate,
          );
          if (!sampleRateOrUncommon) {
            return null;
          }
          bitstream.readBits(4);
          bitstream.readBits(3);
          const reservedZero = bitstream.readBits(1);
          if (reservedZero !== 0) {
            return null;
          }
          const num = (0, _flac_misc_js__WEBPACK_IMPORTED_MODULE_6__.X7)(slice);
          const blockSize = (0, _flac_misc_js__WEBPACK_IMPORTED_MODULE_6__.f6)(
            slice,
            blockSizeOrUncommon,
          );
          const sampleRate = (0, _flac_misc_js__WEBPACK_IMPORTED_MODULE_6__.Ld)(
            slice,
            sampleRateOrUncommon,
          );
          if (sampleRate === null) {
            return null;
          }
          if (sampleRate !== this.audioInfo.sampleRate) {
            return null;
          }
          const size = slice.filePos - startOffset;
          const crc = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.eo)(slice);
          slice.skip(-size);
          slice.skip(-1);
          const crcCalculated = (0,
          _flac_misc_js__WEBPACK_IMPORTED_MODULE_6__.Be)(
            (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.io)(slice, size),
          );
          if (crc !== crcCalculated) {
            return null;
          }
          return { num, blockSize, sampleRate };
        }
        async advanceReader() {
          await this.readMetadata();
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
            this.lastLoadedPos !== null,
          );
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.audioInfo);
          const startPos = this.lastLoadedPos;
          const frame = await this.readNextFlacFrame({
            startPos,
            isFirstPacket: this.loadedSamples.length === 0,
          });
          if (!frame) {
            this.lastSampleLoaded = true;
            return;
          }
          const lastSample = this.loadedSamples[this.loadedSamples.length - 1];
          const blockOffset = lastSample
            ? lastSample.blockOffset + lastSample.blockSize
            : 0;
          const sample = {
            blockOffset,
            blockSize: frame.blockSize,
            byteOffset: startPos,
            byteSize: frame.size,
          };
          this.lastLoadedPos = this.lastLoadedPos + frame.size;
          this.loadedSamples.push(sample);
          if (frame.isLastFrame) {
            this.lastSampleLoaded = true;
            return;
          }
        }
      }
      class FlacAudioTrackBacking {
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
          return "flac";
        }
        getInternalCodecId() {
          return null;
        }
        getNumberOfChannels() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          return this.demuxer.audioInfo.numberOfChannels;
        }
        getSampleRate() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          return this.demuxer.audioInfo.sampleRate;
        }
        getName() {
          return null;
        }
        getLanguageCode() {
          return _misc_js__WEBPACK_IMPORTED_MODULE_2__.IR;
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
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          if (this.demuxer.audioInfo.totalSamples === 0) {
            return null;
          }
          return (
            this.demuxer.audioInfo.totalSamples /
            this.demuxer.audioInfo.sampleRate
          );
        }
        async getLiveRefreshInterval() {
          return null;
        }
        getDisposition() {
          return {
            ..._metadata_js__WEBPACK_IMPORTED_MODULE_5__.gM,
          };
        }
        async getDecoderConfig() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          return {
            codec: "flac",
            numberOfChannels: this.demuxer.audioInfo.numberOfChannels,
            sampleRate: this.demuxer.audioInfo.sampleRate,
            description: this.demuxer.audioInfo.description,
          };
        }
        async getPacket(timestamp, options) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          if (timestamp < 0) {
            return null;
          }
          const release = await this.demuxer.readingMutex.acquire();
          try {
            while (true) {
              const packetIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.eE)(
                this.demuxer.loadedSamples,
                timestamp,
                (x) => x.blockOffset / this.demuxer.audioInfo.sampleRate,
              );
              if (packetIndex === -1) {
                await this.demuxer.advanceReader();
                continue;
              }
              const packet = this.demuxer.loadedSamples[packetIndex];
              const sampleTimestamp =
                packet.blockOffset / this.demuxer.audioInfo.sampleRate;
              const sampleDuration =
                packet.blockSize / this.demuxer.audioInfo.sampleRate;
              if (sampleTimestamp + sampleDuration <= timestamp) {
                if (this.demuxer.lastSampleLoaded) {
                  return this.getPacketAtIndex(
                    this.demuxer.loadedSamples.length - 1,
                    options,
                  );
                }
                await this.demuxer.advanceReader();
                continue;
              }
              return this.getPacketAtIndex(packetIndex, options);
            }
          } finally {
            release();
          }
        }
        async getNextPacket(packet, options) {
          const release = await this.demuxer.readingMutex.acquire();
          try {
            const nextIndex = packet.sequenceNumber + 1;
            if (
              this.demuxer.lastSampleLoaded &&
              nextIndex >= this.demuxer.loadedSamples.length
            ) {
              return null;
            }
            while (
              nextIndex >= this.demuxer.loadedSamples.length &&
              !this.demuxer.lastSampleLoaded
            ) {
              await this.demuxer.advanceReader();
            }
            return this.getPacketAtIndex(nextIndex, options);
          } finally {
            release();
          }
        }
        getKeyPacket(timestamp, options) {
          return this.getPacket(timestamp, options);
        }
        getNextKeyPacket(packet, options) {
          return this.getNextPacket(packet, options);
        }
        async getPacketAtIndex(sampleIndex, options) {
          const rawSample = this.demuxer.loadedSamples[sampleIndex];
          if (!rawSample) {
            return null;
          }
          let data;
          if (options.metadataOnly) {
            data = _packet_js__WEBPACK_IMPORTED_MODULE_3__.T;
          } else {
            let slice = this.demuxer.reader.requestSlice(
              rawSample.byteOffset,
              rawSample.byteSize,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice))
              slice = await slice;
            if (!slice) {
              return null;
            }
            data = (0, _reader_js__WEBPACK_IMPORTED_MODULE_4__.io)(
              slice,
              rawSample.byteSize,
            );
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this.demuxer.audioInfo);
          const timestamp =
            rawSample.blockOffset / this.demuxer.audioInfo.sampleRate;
          const duration =
            rawSample.blockSize / this.demuxer.audioInfo.sampleRate;
          return new _packet_js__WEBPACK_IMPORTED_MODULE_3__.Z(
            data,
            "key",
            timestamp,
            duration,
            sampleIndex,
            rawSample.byteSize,
          );
        }
        async getFirstPacket(options) {
          while (
            this.demuxer.loadedSamples.length === 0 &&
            !this.demuxer.lastSampleLoaded
          ) {
            await this.demuxer.advanceReader();
          }
          return this.getPacketAtIndex(0, options);
        }
      }
    },
    /***/
    3972(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        Be: () =>
          /* binding */
          calculateCrc8,
        /* harmony export */
        Ld: () =>
          /* binding */
          readSampleRate,
        /* harmony export */
        X7: () =>
          /* binding */
          readCodedNumber,
        /* harmony export */
        f6: () =>
          /* binding */
          readBlockSize,
        /* harmony export */
        iv: () =>
          /* binding */
          getBlockSizeOrUncommon,
        /* harmony export */
        oP: () =>
          /* binding */
          getSampleRateOrUncommon,
        /* harmony export */
      });
      var _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(3486);
      var _misc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6760);
      var _reader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const getBlockSizeOrUncommon = (bits) => {
        if (bits === 0) {
          return null;
        } else if (bits === 1) {
          return 192;
        } else if (bits >= 2 && bits <= 5) {
          return 144 * 2 ** bits;
        } else if (bits === 6) {
          return "uncommon-u8";
        } else if (bits === 7) {
          return "uncommon-u16";
        } else if (bits >= 8 && bits <= 15) {
          return 2 ** bits;
        } else {
          return null;
        }
      };
      const getSampleRateOrUncommon = (
        sampleRateBits,
        streamInfoSampleRate,
      ) => {
        switch (sampleRateBits) {
          case 0:
            return streamInfoSampleRate;
          case 1:
            return 88200;
          case 2:
            return 176400;
          case 3:
            return 192e3;
          case 4:
            return 8e3;
          case 5:
            return 16e3;
          case 6:
            return 22050;
          case 7:
            return 24e3;
          case 8:
            return 32e3;
          case 9:
            return 44100;
          case 10:
            return 48e3;
          case 11:
            return 96e3;
          case 12:
            return "uncommon-u8";
          case 13:
            return "uncommon-u16";
          case 14:
            return "uncommon-u16-10";
          default:
            return null;
        }
      };
      const readCodedNumber = (fileSlice) => {
        let ones = 0;
        const bitstream1 =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_0__._(
            (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.io)(fileSlice, 1),
          );
        while (bitstream1.readBits(1) === 1) {
          ones++;
        }
        if (ones === 0) {
          return bitstream1.readBits(7);
        }
        const bitArray = [];
        const extraBytes = ones - 1;
        const bitstream2 =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_0__._(
            (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.io)(
              fileSlice,
              extraBytes,
            ),
          );
        const firstByteBits = 8 - ones - 1;
        for (let i = 0; i < firstByteBits; i++) {
          bitArray.unshift(bitstream1.readBits(1));
        }
        for (let i = 0; i < extraBytes; i++) {
          for (let j = 0; j < 8; j++) {
            const val = bitstream2.readBits(1);
            if (j < 2) {
              continue;
            }
            bitArray.unshift(val);
          }
        }
        const encoded = bitArray.reduce((acc, bit, index) => {
          return acc | (bit << index);
        }, 0);
        return encoded;
      };
      const readBlockSize = (slice, blockSizeBits) => {
        if (blockSizeBits === "uncommon-u16") {
          return (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.mH)(slice) + 1;
        } else if (blockSizeBits === "uncommon-u8") {
          return (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.eo)(slice) + 1;
        } else if (typeof blockSizeBits === "number") {
          return blockSizeBits;
        } else {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.xb)(blockSizeBits);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.vA)(false);
        }
      };
      const readSampleRate = (slice, sampleRateOrUncommon) => {
        if (sampleRateOrUncommon === "uncommon-u16") {
          return (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.mH)(slice);
        }
        if (sampleRateOrUncommon === "uncommon-u16-10") {
          return (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.mH)(slice) * 10;
        }
        if (sampleRateOrUncommon === "uncommon-u8") {
          return (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.eo)(slice);
        }
        if (typeof sampleRateOrUncommon === "number") {
          return sampleRateOrUncommon;
        }
        return null;
      };
      const calculateCrc8 = (data) => {
        const polynomial = 7;
        let crc = 0;
        for (const byte of data) {
          crc ^= byte;
          for (let i = 0; i < 8; i++) {
            if ((crc & 128) !== 0) {
              crc = (crc << 1) ^ polynomial;
            } else {
              crc <<= 1;
            }
            crc &= 255;
          }
        }
        return crc;
      };
    },
    /***/
    4437(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        a: () =>
          /* binding */
          HlsDemuxer,
      });
      var codec = __webpack_require__(8276);
      var demuxer = __webpack_require__(2114);
      var metadata = __webpack_require__(8957);
      var misc = __webpack_require__(6760);
      var src_reader = __webpack_require__(5815);
      var hls_misc = __webpack_require__(1910);
      var aes = __webpack_require__(5277);
      var src_input = __webpack_require__(6014);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class SegmentedInput {
        constructor(input, path, trackDeclarations) {
          this.nextInputCacheAge = 0;
          this.inputCache = [];
          this.trackBackingsPromise = null;
          this.firstSegment = null;
          this.firstSegmentFirstTimestamps = /* @__PURE__ */ new WeakMap();
          this.firstTimestampCache = /* @__PURE__ */ new WeakMap();
          this.input = input;
          this.path = path;
          this.trackDeclarations = trackDeclarations;
        }
        async getDurationFromMetadata(options) {
          const lastSegment = await this.getSegmentAt(Infinity, {
            skipLiveWait: options.skipLiveWait,
          });
          if (!lastSegment) {
            return null;
          }
          return lastSegment.timestamp + lastSegment.duration;
        }
        async getUnixTimeForTimestamp(timestamp) {
          let segment = await this.getSegmentAt(timestamp, {});
          segment ??= await this.getFirstSegment({});
          if (!segment || segment.unixEpochTimestamp === null) {
            return null;
          }
          const elapsed = timestamp - segment.timestamp;
          return segment.unixEpochTimestamp + elapsed;
        }
        async getTrackBackings() {
          return (this.trackBackingsPromise ??= (async () => {
            const backings = [];
            if (this.trackDeclarations) {
              for (const decl of this.trackDeclarations) {
                if (decl.type === "video") {
                  const number =
                    (0, misc.v$)(backings, (x) => x.getType() === "video") + 1;
                  backings.push(
                    new SegmentedInputInputVideoTrackBacking(
                      this,
                      decl,
                      number,
                    ),
                  );
                } else if (decl.type === "audio") {
                  const number =
                    (0, misc.v$)(backings, (x) => x.getType() === "audio") + 1;
                  backings.push(
                    new SegmentedInputInputAudioTrackBacking(
                      this,
                      decl,
                      number,
                    ),
                  );
                }
              }
            } else {
              this.firstSegment = await this.getFirstSegment({});
              if (!this.firstSegment) {
                return [];
              }
              const input = this.getInputForSegment(this.firstSegment);
              const inputTracks = await input.getTracks();
              for (const track of inputTracks) {
                if (track.type === "video") {
                  const number =
                    (0, misc.v$)(backings, (x) => x.getType() === "video") + 1;
                  backings.push(
                    new SegmentedInputInputVideoTrackBacking(
                      this,
                      {
                        id: backings.length + 1,
                        type: "video",
                      },
                      number,
                    ),
                  );
                } else if (track.type === "audio") {
                  const number =
                    (0, misc.v$)(backings, (x) => x.getType() === "audio") + 1;
                  backings.push(
                    new SegmentedInputInputAudioTrackBacking(
                      this,
                      {
                        id: backings.length + 1,
                        type: "audio",
                      },
                      number,
                    ),
                  );
                }
              }
            }
            return backings;
          })());
        }
        // This operation is done a lot and can be semi-expensive, so it's good to have a cache for it
        async getFirstTimestampForInput(input) {
          const existing = this.firstTimestampCache.get(input);
          if (existing !== void 0) {
            return existing;
          }
          const firstTimestamp = await input.getFirstTimestamp();
          this.firstTimestampCache.set(input, firstTimestamp);
          return firstTimestamp;
        }
        async getMediaOffset(segment, input) {
          const firstSegment = segment.firstSegment ?? segment;
          let firstSegmentFirstTimestamp;
          if (this.firstSegmentFirstTimestamps.has(firstSegment)) {
            firstSegmentFirstTimestamp =
              this.firstSegmentFirstTimestamps.get(firstSegment);
          } else {
            const firstInput = this.getInputForSegment(firstSegment);
            firstSegmentFirstTimestamp =
              await this.getFirstTimestampForInput(firstInput);
            this.firstSegmentFirstTimestamps.set(
              firstSegment,
              firstSegmentFirstTimestamp,
            );
          }
          if (firstSegment === segment) {
            return firstSegment.timestamp - firstSegmentFirstTimestamp;
          }
          const segmentFirstTimestamp =
            await this.getFirstTimestampForInput(input);
          const segmentElapsed = segment.timestamp - firstSegment.timestamp;
          const inputElapsed =
            segmentFirstTimestamp - firstSegmentFirstTimestamp;
          const difference = inputElapsed - segmentElapsed;
          if (Math.abs(difference) <= Math.min(0.25, segmentElapsed)) {
            return firstSegment.timestamp - firstSegmentFirstTimestamp;
          } else {
            return segment.timestamp - segmentFirstTimestamp;
          }
        }
        dispose() {
          for (const entry of this.inputCache) {
            entry.input.dispose();
          }
          this.inputCache.length = 0;
        }
      }
      class SegmentedInputInputTrackBacking {
        constructor(segmentedInput, decl, number) {
          this.packetInfos = /* @__PURE__ */ new WeakMap();
          this.hydrationPromise = null;
          this.firstInputTrack = null;
          this.firstSegment = null;
          this.segmentedInput = segmentedInput;
          this.decl = decl;
          this.number = number;
        }
        hydrate() {
          return (this.hydrationPromise ??= (async () => {
            this.segmentedInput.firstSegment ??=
              await this.segmentedInput.getFirstSegment({});
            if (!this.segmentedInput.firstSegment) {
              throw new Error("Missing first segment, can't retrieve track.");
            }
            let currentSegment = this.segmentedInput.firstSegment;
            let track = null;
            while (currentSegment) {
              const input =
                this.segmentedInput.getInputForSegment(currentSegment);
              const inputTracks = await input.getTracks();
              track =
                inputTracks.find(
                  (x) => x.type === this.decl.type && x.number === this.number,
                ) ?? null;
              if (track) {
                break;
              }
              currentSegment = await this.segmentedInput.getNextSegment(
                currentSegment,
                {},
              );
            }
            if (!track) {
              throw new Error(
                "No matching track found in underlying media data.",
              );
            }
            this.firstInputTrack = track;
            this.firstSegment = currentSegment;
          })());
        }
        getId() {
          return this.decl.id;
        }
        getType() {
          return this.decl.type;
        }
        getNumber() {
          return this.number;
        }
        /** If the backing track is already present, delegate synchronously; otherwise, hydrate first. */
        delegate(fn) {
          if (this.firstInputTrack) {
            return fn();
          }
          return this.hydrate().then(fn);
        }
        async getDecoderConfig() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getDecoderConfig(),
          );
        }
        getHasOnlyKeyPackets() {
          return this.delegate(
            () =>
              this.firstInputTrack._backing.getHasOnlyKeyPackets?.() ?? null,
          );
        }
        getPairingMask() {
          return 1n;
        }
        getCodec() {
          return this.delegate(() => this.firstInputTrack._backing.getCodec());
        }
        getInternalCodecId() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getInternalCodecId(),
          );
        }
        getDisposition() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getDisposition(),
          );
        }
        getLanguageCode() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getLanguageCode(),
          );
        }
        getName() {
          return this.delegate(() => this.firstInputTrack._backing.getName());
        }
        getTimeResolution() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getTimeResolution(),
          );
        }
        async isRelativeToUnixEpoch() {
          await this.hydrate();
          (0, misc.vA)(this.segmentedInput.firstSegment);
          return (
            this.segmentedInput.firstSegment.unixEpochTimestamp ===
            this.segmentedInput.firstSegment.timestamp
          );
        }
        getUnixTimeForTimestamp(timestamp) {
          return this.segmentedInput.getUnixTimeForTimestamp(timestamp);
        }
        getBitrate() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getBitrate(),
          );
        }
        getAverageBitrate() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getAverageBitrate(),
          );
        }
        getDurationFromMetadata(options) {
          return this.segmentedInput.getDurationFromMetadata(options);
        }
        getLiveRefreshInterval() {
          return this.segmentedInput.getLiveRefreshInterval();
        }
        async createAdjustedPacket(packet, segment, track) {
          (0, misc.vA)(packet.sequenceNumber >= 0);
          (0, misc.vA)(this.segmentedInput.firstSegment);
          const mediaOffset = await this.segmentedInput.getMediaOffset(
            segment,
            track.input,
          );
          const segmentTimestampRelativeToFirst =
            segment.timestamp - this.segmentedInput.firstSegment.timestamp;
          const modified = packet.clone({
            timestamp: (0, misc.gl)(
              packet.timestamp + mediaOffset,
              await track.getTimeResolution(),
            ),
            // The 1e8 assumes a max of 100 MB per second, highly unlikely to be hit, so this should guarantee
            // monotonically increasing sequence numbers across segments.
            sequenceNumber:
              Math.floor(1e8 * segmentTimestampRelativeToFirst) +
              packet.sequenceNumber,
          });
          this.packetInfos.set(modified, {
            segment,
            track,
            sourcePacket: packet,
          });
          return modified;
        }
        async getFirstPacket(options) {
          await this.hydrate();
          (0, misc.vA)(this.firstInputTrack);
          (0, misc.vA)(this.firstSegment);
          let currentTrack = this.firstInputTrack;
          let currentSegment = this.firstSegment;
          while (true) {
            if (currentTrack) {
              const packet =
                await currentTrack._backing.getFirstPacket(options);
              if (packet) {
                return this.createAdjustedPacket(
                  packet,
                  currentSegment,
                  currentTrack,
                );
              }
            }
            currentSegment = await this.segmentedInput.getNextSegment(
              currentSegment,
              {
                skipLiveWait: options.skipLiveWait,
              },
            );
            if (!currentSegment) {
              break;
            }
            const nextInput =
              this.segmentedInput.getInputForSegment(currentSegment);
            const nextTracks = await nextInput.getTracks();
            currentTrack =
              nextTracks.find(
                (t) =>
                  t.type === this.firstInputTrack.type &&
                  t.number === this.firstInputTrack.number,
              ) ?? null;
          }
          return null;
        }
        getNextPacket(packet, options) {
          return this._getNextInternal(packet, options, false);
        }
        getNextKeyPacket(packet, options) {
          return this._getNextInternal(packet, options, true);
        }
        async _getNextInternal(packet, options, keyframesOnly) {
          const info = this.packetInfos.get(packet);
          if (!info) {
            throw new Error("Packet was not created from this track.");
          }
          const nextPacket = keyframesOnly
            ? await info.track._backing.getNextKeyPacket(
                info.sourcePacket,
                options,
              )
            : await info.track._backing.getNextPacket(
                info.sourcePacket,
                options,
              );
          if (nextPacket) {
            return this.createAdjustedPacket(
              nextPacket,
              info.segment,
              info.track,
            );
          }
          let currentSegment = info.segment;
          while (true) {
            const nextSegment = await this.segmentedInput.getNextSegment(
              currentSegment,
              {
                skipLiveWait: options.skipLiveWait,
              },
            );
            if (!nextSegment) {
              return null;
            }
            const nextInput =
              this.segmentedInput.getInputForSegment(nextSegment);
            const nextTracks = await nextInput.getTracks();
            const nextTrack = nextTracks.find(
              (t) =>
                t.type === info.track.type && t.number === info.track.number,
            );
            if (!nextTrack) {
              currentSegment = nextSegment;
              continue;
            }
            const firstPacket =
              await nextTrack._backing.getFirstPacket(options);
            if (!firstPacket) {
              return null;
            }
            return this.createAdjustedPacket(
              firstPacket,
              nextSegment,
              nextTrack,
            );
          }
        }
        getPacket(timestamp, options) {
          return this._getPacketInternal(timestamp, options, false);
        }
        getKeyPacket(timestamp, options) {
          return this._getPacketInternal(timestamp, options, true);
        }
        async _getPacketInternal(timestamp, options, keyframesOnly) {
          let currentSegment = await this.segmentedInput.getSegmentAt(
            timestamp,
            {
              skipLiveWait: options.skipLiveWait,
            },
          );
          if (!currentSegment) {
            return null;
          }
          await this.hydrate();
          while (currentSegment) {
            const input =
              this.segmentedInput.getInputForSegment(currentSegment);
            const tracks = await input.getTracks();
            const track = tracks.find(
              (t) =>
                t.type === this.firstInputTrack.type &&
                t.number === this.firstInputTrack.number,
            );
            if (!track) {
              currentSegment = await this.segmentedInput.getPreviousSegment(
                currentSegment,
                {
                  skipLiveWait: options.skipLiveWait,
                },
              );
              continue;
            }
            const mediaOffset = await this.segmentedInput.getMediaOffset(
              currentSegment,
              input,
            );
            const offsetTimestamp = timestamp - mediaOffset;
            const packet = keyframesOnly
              ? await track._backing.getKeyPacket(offsetTimestamp, options)
              : await track._backing.getPacket(offsetTimestamp, options);
            if (!packet) {
              currentSegment = await this.segmentedInput.getPreviousSegment(
                currentSegment,
                {
                  skipLiveWait: options.skipLiveWait,
                },
              );
              continue;
            }
            return this.createAdjustedPacket(packet, currentSegment, track);
          }
          return null;
        }
      }
      class SegmentedInputInputVideoTrackBacking extends SegmentedInputInputTrackBacking {
        getType() {
          return "video";
        }
        getCodec() {
          return this.delegate(() => this.firstInputTrack._backing.getCodec());
        }
        getCodedWidth() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getCodedWidth(),
          );
        }
        getCodedHeight() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getCodedHeight(),
          );
        }
        getSquarePixelWidth() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getSquarePixelWidth(),
          );
        }
        getSquarePixelHeight() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getSquarePixelHeight(),
          );
        }
        getRotation() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getRotation(),
          );
        }
        async getColorSpace() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getColorSpace(),
          );
        }
        async canBeTransparent() {
          return this.delegate(() =>
            this.firstInputTrack._backing.canBeTransparent(),
          );
        }
        async getDecoderConfig() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getDecoderConfig(),
          );
        }
      }
      class SegmentedInputInputAudioTrackBacking extends SegmentedInputInputTrackBacking {
        getType() {
          return "audio";
        }
        getCodec() {
          return this.delegate(() => this.firstInputTrack._backing.getCodec());
        }
        getNumberOfChannels() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getNumberOfChannels(),
          );
        }
        getSampleRate() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getSampleRate(),
          );
        }
        async getDecoderConfig() {
          return this.delegate(() =>
            this.firstInputTrack._backing.getDecoderConfig(),
          );
        }
      }
      var source = __webpack_require__(4117);
      var input_format = __webpack_require__(4456);
      var isobmff_misc = __webpack_require__(2997);
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
      const IV_STRING_REGEX = /^0[xX][0-9a-fA-F]+$/;
      const BASE64_DATA_URI_REGEX = /^data:.*;base64,/i;
      class HlsSegmentedInput extends SegmentedInput {
        constructor(demuxer2, path, trackDeclarations, lines) {
          super(demuxer2.input, path, trackDeclarations);
          this.segments = [];
          this.nextLines = null;
          this.currentUpdateSegmentsPromise = null;
          this.streamHasEnded = false;
          this.lastSegmentUpdateTime = -Infinity;
          this.refreshInterval = 5;
          this.rootPath = path;
          this.demuxer = demuxer2;
          this.nextLines = lines;
        }
        runUpdateSegments() {
          return (this.currentUpdateSegmentsPromise ??= (async () => {
            try {
              const remainingWaitTimeMs = this.getRemainingWaitTimeMs();
              if (remainingWaitTimeMs > 0) {
                await (0, misc.uk)(remainingWaitTimeMs);
              }
              this.lastSegmentUpdateTime = performance.now();
              await this.updateSegments();
            } finally {
              this.currentUpdateSegmentsPromise = null;
            }
          })());
        }
        getRemainingWaitTimeMs() {
          const elapsed = performance.now() - this.lastSegmentUpdateTime;
          const result = Math.max(0, 1e3 * this.refreshInterval - elapsed);
          if (result <= 50) {
            return 0;
          }
          return result;
        }
        /**
         * Reads and parses the segment info from the playlist file. When called more than one, it updates the existing
         * segments by appending the new ones. Existing segments are never removed.
         */
        async updateSegments() {
          let lines = this.nextLines;
          this.nextLines = null;
          if (!lines) {
            const env_1 = { stack: [], error: void 0, hasError: false };
            try {
              const ref = __addDisposableResource(
                env_1,
                await this.demuxer.input._getSourceUncached({
                  path: this.rootPath,
                  isRoot: false,
                }),
                false,
              );
              const reader = new src_reader.mP(ref.source);
              const slice = await reader.requestEntireFile();
              (0, misc.vA)(slice);
              lines = (0, src_reader.jo)(slice, slice.length, {
                ignore: hls_misc.nf,
              });
              if (ref.source instanceof source.QI) {
                this.rootPath = ref.source.rootPath;
              }
            } catch (e_1) {
              env_1.error = e_1;
              env_1.hasError = true;
            } finally {
              __disposeResources(env_1);
            }
          }
          const offsetTimestampsByDateTime =
            this.input._formatOptions.hls?.offsetTimestampsByDateTime !== false;
          let headerRead = false;
          let accumulatedTime = 0;
          let accumulatedUnixTime = null;
          let nextSegmentDuration = null;
          let currentKey = null;
          let nextSequenceNumber = 0;
          let currentFirstSegment = null;
          let currentInitSegment = null;
          let lastByteRangeEnd = null;
          let nextByteRange = null;
          let lastProgramDateTimeSeconds = null;
          let targetDuration = null;
          let segmentSeen = false;
          let prevLastSegment = (0, misc._g)(this.segments) ?? null;
          const parseByteRange = (content) => {
            const atIndex = content.indexOf("@");
            const length = Number(
              atIndex === -1 ? content : content.slice(0, atIndex),
            );
            if (!Number.isInteger(length) || length < 0) {
              throw new Error(
                "Invalid #EXT-X-BYTERANGE length '".concat(content, "'."),
              );
            }
            let offset = null;
            if (atIndex !== -1) {
              offset = Number(content.slice(atIndex + 1));
              if (!Number.isInteger(offset) || offset < 0) {
                throw new Error(
                  "Invalid #EXT-X-BYTERANGE offset '".concat(content, "'."),
                );
              }
            }
            return { length, offset };
          };
          const setNextSequenceNumber = (number) => {
            nextSequenceNumber = number;
            if (prevLastSegment) {
              (0, misc.vA)(prevLastSegment.sequenceNumber !== null);
              if (prevLastSegment.sequenceNumber < number) {
                accumulatedTime =
                  prevLastSegment.timestamp + prevLastSegment.duration;
                currentFirstSegment = prevLastSegment.firstSegment;
                currentInitSegment = prevLastSegment.initSegment;
                lastProgramDateTimeSeconds =
                  prevLastSegment.lastProgramDateTimeSeconds;
                accumulatedUnixTime =
                  prevLastSegment.unixEpochTimestamp !== null
                    ? prevLastSegment.unixEpochTimestamp +
                      prevLastSegment.duration
                    : null;
                prevLastSegment = null;
              }
            }
          };
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (!headerRead) {
              if (line !== "#EXTM3U") {
                throw new Error(
                  "Invalid M3U8 file; expected first line to be #EXTM3U.",
                );
              }
              headerRead = true;
              continue;
            }
            if (!line.startsWith("#")) {
              if (!prevLastSegment) {
                if (nextSegmentDuration === null) {
                  throw new Error(
                    "Invalid M3U8 file; a segment must be preceded by an #EXTINF tag.",
                  );
                }
                let key = currentKey;
                if (key && key.method === "AES-128" && !key.iv) {
                  const iv = new Uint8Array(aes.ye);
                  const view = (0, misc.Zc)(iv);
                  view.setUint32(8, Math.floor(nextSequenceNumber / 2 ** 32));
                  view.setUint32(12, nextSequenceNumber);
                  key = { ...key, iv };
                }
                const fullPath = (0, misc.HS)(this.rootPath, line);
                const location = {
                  path: fullPath,
                  offset: nextByteRange?.offset ?? 0,
                  length: nextByteRange?.length ?? null,
                };
                const segment = {
                  timestamp: accumulatedTime,
                  unixEpochTimestamp: accumulatedUnixTime,
                  firstSegment: currentFirstSegment,
                  sequenceNumber: nextSequenceNumber,
                  location,
                  duration: nextSegmentDuration,
                  encryption: key,
                  initSegment: currentInitSegment,
                  lastProgramDateTimeSeconds,
                };
                currentFirstSegment ??= segment;
                accumulatedTime += nextSegmentDuration;
                if (accumulatedUnixTime !== null) {
                  accumulatedUnixTime += nextSegmentDuration;
                }
                this.segments.push(segment);
              } else {
              }
              nextSegmentDuration = null;
              if (nextByteRange === null) {
                lastByteRangeEnd = null;
              } else {
                nextByteRange = null;
              }
              setNextSequenceNumber(nextSequenceNumber + 1);
            }
            if (line.startsWith(hls_misc.e9)) {
              if (prevLastSegment) {
                segmentSeen = true;
                continue;
              }
              if (!segmentSeen) {
                if (
                  lastProgramDateTimeSeconds === null &&
                  nextSequenceNumber > 0 &&
                  targetDuration !== null
                ) {
                  accumulatedTime = nextSequenceNumber * targetDuration;
                }
                segmentSeen = true;
              }
              const extinfContent = line.slice(hls_misc.e9.length);
              const commaIndex = extinfContent.indexOf(",");
              const durationStr =
                commaIndex === -1
                  ? extinfContent
                  : extinfContent.slice(0, commaIndex);
              const duration = Number(durationStr);
              if (!Number.isFinite(duration) || duration < 0) {
                throw new Error(
                  "Invalid #EXTINF tag duration '".concat(durationStr, "'."),
                );
              }
              nextSegmentDuration = duration;
            } else if (line.startsWith(hls_misc.sA)) {
              const attributes = new hls_misc.Hw(
                line.slice(hls_misc.sA.length),
              );
              const uri = attributes.get("uri");
              if (!uri) {
                throw new Error(
                  "Invalid #EXT-X-MAP tag; missing URI attribute.",
                );
              }
              const byteRange = attributes.get("byterange");
              let parsedByteRange = null;
              if (byteRange !== null) {
                parsedByteRange = parseByteRange(byteRange);
              }
              if (parsedByteRange && parsedByteRange.offset === null) {
                throw new Error(
                  "Invalid #EXT-X-MAP tag; BYTERANGE attribute must have a specified offset.",
                );
              }
              if (!prevLastSegment) {
                const fullPath = (0, misc.HS)(this.rootPath, uri);
                const location = {
                  path: fullPath,
                  offset: parsedByteRange?.offset ?? 0,
                  length: parsedByteRange?.length ?? null,
                };
                if (currentKey?.method === "AES-128" && !currentKey.iv) {
                  throw new Error(
                    "IV attribute must be set on #EXT-X-KEY tag preceding the #EXT-X-MAP tag.",
                  );
                }
                const segment = {
                  timestamp: accumulatedTime,
                  unixEpochTimestamp: accumulatedUnixTime,
                  firstSegment: null,
                  sequenceNumber: null,
                  location,
                  duration: 0,
                  encryption: currentKey,
                  initSegment: null,
                  lastProgramDateTimeSeconds,
                };
                currentInitSegment = segment;
              } else {
              }
              nextSegmentDuration = null;
              if (nextByteRange === null) {
                lastByteRangeEnd = null;
              } else {
                nextByteRange = null;
              }
            } else if (line.startsWith(hls_misc.L2)) {
              const attributes = new hls_misc.Hw(
                line.slice(hls_misc.L2.length),
              );
              const method = attributes.get("method");
              if (method === "NONE") {
                currentKey = null;
              } else if (method === "AES-128") {
                const uri = attributes.get("uri");
                if (!uri) {
                  throw new Error(
                    "Invalid #EXT-X-KEY: AES-128 requires a URI attribute.",
                  );
                }
                let iv = null;
                const ivString = attributes.get("iv");
                if (ivString) {
                  if (!IV_STRING_REGEX.test(ivString)) {
                    throw new Error(
                      "Unsupported IV format '".concat(ivString, "'."),
                    );
                  }
                  let hex = ivString.slice(2);
                  hex = hex.padStart(aes.ye * 2, "0");
                  iv = new Uint8Array(aes.ye);
                  for (let i2 = 0; i2 < aes.ye; i2++) {
                    const startIndex = -aes.ye * 2 + i2;
                    iv[i2] = parseInt(
                      hex.slice(startIndex, startIndex + 2),
                      16,
                    );
                  }
                }
                const keyFormat = attributes.get("keyformat") ?? "identity";
                if (keyFormat !== "identity") {
                  throw new Error(
                    "For AES-128 encryption, only the 'identity' KEYFORMAT is currently supported. If you think other formats should be supported, please raise an issue.",
                  );
                }
                currentKey = {
                  method: "AES-128",
                  keyUri: (0, misc.HS)(this.rootPath, uri),
                  iv,
                  keyFormat,
                };
              } else if (
                method === "SAMPLE-AES" ||
                method === "SAMPLE-AES-CTR"
              ) {
                const uri = attributes.get("uri");
                if (!uri) {
                  throw new Error(
                    "Invalid #EXT-X-KEY: ".concat(
                      method,
                      " requires a URI attribute.",
                    ),
                  );
                }
                const keyFormat = attributes.get("keyformat") ?? "identity";
                if (keyFormat === "identity") {
                  throw new Error(
                    "For SAMPLE-AES and SAMPLE-AES-CTR encryption, the 'identity' KEYFORMAT is not supported. If you think this format should be supported, please raise an issue.",
                  );
                }
                let psshBox = null;
                if (BASE64_DATA_URI_REGEX.test(uri)) {
                  const commaIndex = uri.indexOf(",");
                  const bytes = (0, misc.Kp)(uri.slice(commaIndex + 1));
                  if (
                    bytes.length >= 8 &&
                    bytes[4] === 112 &&
                    bytes[5] === 115 &&
                    bytes[6] === 115 &&
                    bytes[7] === 104
                  ) {
                    const size = (0, misc.Zc)(bytes).getUint32(0);
                    psshBox = (0, isobmff_misc.j1)(
                      bytes.subarray(8, Math.min(size, bytes.length)),
                    );
                  }
                }
                currentKey = {
                  method,
                  psshBox,
                };
              } else {
                throw new Error(
                  "Unsupported encryption method '".concat(
                    method,
                    "'. If you think this method should be supported,",
                  ) + " please raise an issue.",
                );
              }
            } else if (line.startsWith(hls_misc._2)) {
              const value = line.slice(hls_misc._2.length);
              const number = Number(value);
              if (!Number.isInteger(number) || number < 0) {
                throw new Error(
                  "Invalid EXT-X-MEDIA-SEQUENCE value '".concat(value, "'."),
                );
              }
              setNextSequenceNumber(number);
            } else if (line.startsWith(hls_misc.v6)) {
              const parsed = parseByteRange(line.slice(hls_misc.v6.length));
              if (parsed.offset === null) {
                if (lastByteRangeEnd === null) {
                  throw new Error(
                    "Invalid M3U8 file; #EXT-X-BYTERANGE without offset requires a previous byte range.",
                  );
                }
                parsed.offset = lastByteRangeEnd;
              }
              nextByteRange = parsed;
              lastByteRangeEnd = parsed.offset + parsed.length;
            } else if (line.startsWith(hls_misc.bW)) {
              if (prevLastSegment) {
                continue;
              }
              const dateTime = line.slice(hls_misc.bW.length);
              const dateTimeMs = Date.parse(dateTime);
              if (!Number.isFinite(dateTimeMs)) {
                continue;
              }
              const dateTimeSeconds = dateTimeMs / 1e3;
              if (lastProgramDateTimeSeconds === dateTimeSeconds) {
                continue;
              }
              if (
                lastProgramDateTimeSeconds === null &&
                this.segments.length > 0
              ) {
                const lastSegment = (0, misc._g)(this.segments);
                const lastSegmentEnd =
                  lastSegment.timestamp + lastSegment.duration;
                const offset = dateTimeSeconds - lastSegmentEnd;
                for (const segment of this.segments) {
                  segment.unixEpochTimestamp = segment.timestamp + offset;
                  if (offsetTimestampsByDateTime) {
                    segment.timestamp = segment.unixEpochTimestamp;
                  }
                }
              }
              lastProgramDateTimeSeconds = dateTimeSeconds;
              accumulatedUnixTime = dateTimeSeconds;
              if (offsetTimestampsByDateTime) {
                accumulatedTime = dateTimeSeconds;
              }
            } else if (line === hls_misc.i$) {
              currentFirstSegment = null;
            } else if (line.startsWith(hls_misc.xe)) {
              const value = line.slice(hls_misc.xe.length);
              const duration = Number(value);
              if (!Number.isFinite(duration) || duration < 0) {
                throw new Error(
                  "Invalid EXT-X-TARGETDURATION value '".concat(value, "'."),
                );
              }
              this.refreshInterval = duration;
              targetDuration = duration;
            } else if (line === hls_misc.dY) {
              this.streamHasEnded = true;
              break;
            } else if (line.startsWith(hls_misc.zA)) {
              const type = line.slice(hls_misc.zA.length);
              if (type.toLowerCase() === "vod") {
                this.streamHasEnded = true;
              }
            }
          }
          if (!headerRead) {
            throw new Error("Invalid M3U8 file; no #EXTM3U header.");
          }
        }
        async getFirstSegment() {
          if (this.segments.length === 0) {
            await this.runUpdateSegments();
          }
          return this.segments[0] ?? null;
        }
        async getSegmentAt(timestamp, options) {
          if (this.segments.length === 0) {
            await this.runUpdateSegments();
          }
          let isLazy =
            !!options.skipLiveWait && this.getRemainingWaitTimeMs() > 0;
          while (true) {
            const index = (0, misc.eE)(
              this.segments,
              timestamp,
              (x) => x.timestamp,
            );
            if (index === -1) {
              return null;
            }
            if (
              index < this.segments.length - 1 ||
              this.streamHasEnded ||
              isLazy
            ) {
              return this.segments[index];
            }
            const segment = this.segments[index];
            if (timestamp < segment.timestamp + segment.duration) {
              return segment;
            }
            await this.runUpdateSegments();
            if (options.skipLiveWait) {
              isLazy = true;
            }
          }
        }
        async getNextSegment(segment, options) {
          const index = this.segments.indexOf(segment);
          (0, misc.vA)(index !== -1);
          const nextIndex = index + 1;
          let isLazy =
            !!options.skipLiveWait && this.getRemainingWaitTimeMs() > 0;
          while (true) {
            if (nextIndex < this.segments.length) {
              return this.segments[nextIndex];
            }
            if (this.streamHasEnded || isLazy) {
              return null;
            }
            await this.runUpdateSegments();
            if (options.skipLiveWait) {
              isLazy = true;
            }
          }
        }
        async getPreviousSegment(segment) {
          const index = this.segments.indexOf(segment);
          (0, misc.vA)(index !== -1);
          return this.segments[index - 1] ?? null;
        }
        getInputForSegment(segment) {
          const hlsSegment = segment;
          const cacheEntry = this.inputCache.find(
            (x) => x.segment === hlsSegment,
          );
          if (cacheEntry) {
            cacheEntry.age = this.nextInputCacheAge++;
            return cacheEntry.input;
          }
          let initInput = null;
          if (hlsSegment.initSegment || hlsSegment.firstSegment) {
            initInput = this.getInputForSegment(
              hlsSegment.initSegment ?? hlsSegment.firstSegment,
            );
          }
          const formatOptions = {
            ...this.input._formatOptions,
            isobmff: {
              ...this.input._formatOptions.isobmff,
              // Intercept calls to resolveKeyId to inject our psshBox knowledge into it
              resolveKeyId:
                this.input._formatOptions.isobmff?.resolveKeyId &&
                ((options) => {
                  if (
                    !hlsSegment.encryption ||
                    !(
                      hlsSegment.encryption.method === "SAMPLE-AES" ||
                      hlsSegment.encryption.method === "SAMPLE-AES-CTR"
                    ) ||
                    !hlsSegment.encryption.psshBox
                  ) {
                    return this.input._formatOptions.isobmff.resolveKeyId(
                      options,
                    );
                  }
                  let psshBoxes = options.psshBoxes;
                  const { psshBox } = hlsSegment.encryption;
                  if (
                    (psshBox.keyIds === null ||
                      psshBox.keyIds.includes(options.keyId)) &&
                    !psshBoxes.some((x) => (0, isobmff_misc.MG)(x, psshBox))
                  ) {
                    psshBoxes = [...psshBoxes, psshBox];
                  }
                  return this.input._formatOptions.isobmff.resolveKeyId({
                    ...options,
                    psshBoxes,
                  });
                }),
            },
          };
          const input = new src_input.pd({
            source: new source.r3(hlsSegment.location.path, async (request) => {
              (0, misc.vA)(request.isRoot);
              const proxiedRequest = {
                ...request,
                isRoot: false,
              };
              let ref;
              const needsSlice =
                hlsSegment.location.offset > 0 ||
                hlsSegment.location.length !== null;
              if (
                !hlsSegment.encryption ||
                hlsSegment.encryption.method === "SAMPLE-AES" ||
                hlsSegment.encryption.method === "SAMPLE-AES-CTR"
              ) {
                ref = await this.input._getSourceCached(proxiedRequest);
                if (needsSlice) {
                  const slice = ref.source.slice(
                    hlsSegment.location.offset,
                    hlsSegment.location.length ?? void 0,
                  );
                  const sliceRef = slice.ref();
                  ref.free();
                  ref = sliceRef;
                }
              } else if (hlsSegment.encryption.method === "AES-128") {
                const encryption = hlsSegment.encryption;
                (0, misc.vA)(encryption.iv);
                let ciphertextRef =
                  await this.input._getSourceCached(proxiedRequest);
                if (needsSlice) {
                  const slice = ciphertextRef.source.slice(
                    hlsSegment.location.offset,
                    hlsSegment.location.length ?? void 0,
                  );
                  const sliceRef = slice.ref();
                  ciphertextRef.free();
                  ciphertextRef = sliceRef;
                }
                const ciphertextReader = new src_reader.mP(
                  ciphertextRef.source,
                );
                const stream = (0, aes.U4)(
                  ciphertextReader,
                  async () => {
                    const env_2 = { stack: [], error: void 0, hasError: false };
                    try {
                      const keyRef = __addDisposableResource(
                        env_2,
                        await this.input._getSourceCached(
                          { path: encryption.keyUri, isRoot: false },
                          src_input.Ng,
                        ),
                        false,
                      );
                      const keyReader = new src_reader.mP(keyRef.source);
                      const keySlice = await keyReader.requestSlice(0, aes.ye);
                      if (!keySlice) {
                        throw new Error(
                          "Invalid AES-128 key; expected at least 16 bytes of data.",
                        );
                      }
                      const key = (0, src_reader.io)(keySlice, aes.ye);
                      return { key, iv: encryption.iv };
                    } catch (e_2) {
                      env_2.error = e_2;
                      env_2.hasError = true;
                    } finally {
                      __disposeResources(env_2);
                    }
                  },
                  () => {
                    ciphertextRef.free();
                  },
                );
                ref = new source.m6(stream).ref();
              } else {
                (0, misc.vA)(false);
              }
              return ref;
            }),
            // Do not allow recursive HLS. Cool on paper, but allows for nasty infinite-depth request trees.
            formats: this.input._formats.filter(
              (x) => !(x instanceof input_format.rp),
            ),
            initInput: initInput ?? void 0,
            formatOptions,
          });
          input._onFormatDetermined = (format) => {
            if (
              (hlsSegment.encryption?.method === "SAMPLE-AES" ||
                hlsSegment.encryption?.method === "SAMPLE-AES-CTR") &&
              !format._isIsobmff
            ) {
              throw new Error(
                "The SAMPLE-AES and SAMPLE-AES-CTR encryption methods are currently only supported for ISOBMFF files.",
              );
            }
          };
          this.inputCache.push({
            segment: hlsSegment,
            input,
            age: this.nextInputCacheAge++,
          });
          const MAX_INPUT_CACHE_SIZE = 4;
          if (this.inputCache.length > MAX_INPUT_CACHE_SIZE) {
            const minAgeIndex = (0, misc.Yg)(this.inputCache, (x) => x.age);
            (0, misc.vA)(minAgeIndex !== -1);
            this.inputCache.splice(minAgeIndex, 1);
          }
          return input;
        }
        async getLiveRefreshInterval() {
          if (this.getRemainingWaitTimeMs() === 0) {
            await this.runUpdateSegments();
          }
          return this.streamHasEnded ? null : this.refreshInterval;
        }
      }
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class HlsDemuxer extends demuxer.B {
        constructor(input) {
          super(input);
          this.metadataPromise = null;
          this.trackBackings = null;
          this.internalTracks = null;
          this.segmentedInputs = [];
          this.hasMasterPlaylist = true;
        }
        readMetadata() {
          return (this.metadataPromise ??= (async () => {
            (0, misc.vA)(this.input._rootSource instanceof source.QI);
            const slice = await this.input._reader.requestEntireFile();
            (0, misc.vA)(slice);
            const lines = (0, src_reader.jo)(slice, slice.length, {
              ignore: hls_misc.nf,
            });
            const { rootPath } = this.input._rootSource;
            const variantStreams = [];
            const mediaTags = [];
            for (let i = 1; i < lines.length; i++) {
              const line = lines[i];
              if (line.startsWith(hls_misc.c$)) {
                const streamInfLineNumber = i;
                const playlistPath = lines[++i];
                if (playlistPath === void 0) {
                  throw new Error(
                    "Incorrect M3U8 file; a line must follow the #EXT-X-STREAM-INF tag.",
                  );
                }
                const fullPath = (0, misc.HS)(rootPath, playlistPath);
                const attributes = new hls_misc.Hw(
                  line.slice(hls_misc.c$.length),
                );
                const bandwidth = attributes.getAsNumber("bandwidth");
                if (bandwidth === null) {
                  throw new Error(
                    "Invalid M3U8 file; #EXT-X-STREAM-INF tag requires a BANDWIDTH attribute with a valid numerical value.",
                  );
                }
                variantStreams.push({
                  fullPath,
                  attributes,
                  lineNumber: streamInfLineNumber,
                  hasOnlyKeyPackets: false,
                });
              } else if (line.startsWith(hls_misc.g4)) {
                const attributes = new hls_misc.Hw(
                  line.slice(hls_misc.g4.length),
                );
                const playlistPath = attributes.get("uri");
                if (playlistPath === null) {
                  throw new Error(
                    "Invalid M3U8 file; #EXT-X-I-FRAME-STREAM-INF tag requires a URI attribute.",
                  );
                }
                const bandwidth = attributes.getAsNumber("bandwidth");
                if (bandwidth === null) {
                  throw new Error(
                    "Invalid M3U8 file; #EXT-X-I-FRAME-STREAM-INF tag requires a BANDWIDTH attribute with a valid numerical value.",
                  );
                }
                const fullPath = (0, misc.HS)(rootPath, playlistPath);
                variantStreams.push({
                  fullPath,
                  attributes,
                  lineNumber: i,
                  hasOnlyKeyPackets: true,
                });
              } else if (line.startsWith(hls_misc.EF)) {
                const attributes = new hls_misc.Hw(
                  line.slice(hls_misc.EF.length),
                );
                const type = attributes.get("type");
                if (type === null) {
                  throw new Error(
                    "Invalid M3U8 file; #EXT-X-MEDIA tag requires a TYPE attribute.",
                  );
                }
                const groupId = attributes.get("group-id");
                if (groupId === null) {
                  throw new Error(
                    "Invalid M3U8 file; #EXT-X-MEDIA tag requires a GROUP-ID attribute.",
                  );
                }
                let fullPath = null;
                const uri = attributes.get("uri");
                if (uri !== null) {
                  fullPath = (0, misc.HS)(rootPath, uri);
                }
                mediaTags.push({ fullPath, attributes, lineNumber: i });
              } else if (line === hls_misc.DT) {
              } else if (line.startsWith(hls_misc.e9)) {
                const segmentedInput = new HlsSegmentedInput(
                  this,
                  rootPath,
                  null,
                  lines,
                );
                this.segmentedInputs = [segmentedInput];
                this.hasMasterPlaylist = false;
                this.trackBackings = await segmentedInput.getTrackBackings();
                return;
              }
            }
            const videoGroupIds = [
              ...new Set(
                mediaTags
                  .filter(
                    (tag) =>
                      tag.attributes.get("type").toLowerCase() === "video",
                  )
                  .map((tag) => tag.attributes.get("group-id")),
              ),
            ];
            const audioGroupIds = [
              ...new Set(
                mediaTags
                  .filter(
                    (tag) =>
                      tag.attributes.get("type").toLowerCase() === "audio",
                  )
                  .map((tag) => tag.attributes.get("group-id")),
              ),
            ];
            const internalTracksByVariant = await Promise.all(
              variantStreams.map(async (variantStream, i) => {
                const result = [];
                const codecsList = variantStream.attributes.get("codecs");
                let codecStrings;
                if (codecsList) {
                  codecStrings = codecsList.split(",").map((x) => x.trim());
                } else {
                  const segmentedInput = this.getSegmentedInputForPath(
                    variantStream.fullPath,
                  );
                  const trackBackings = await segmentedInput.getTrackBackings();
                  const tracksWithCodec = await Promise.all(
                    trackBackings.map(async (t) => ({
                      track: t,
                      codec: await t.getCodec(),
                    })),
                  );
                  codecStrings = await Promise.all(
                    tracksWithCodec
                      .filter((x) => x.codec !== null)
                      .map((x) =>
                        x.track.getDecoderConfig().then((x2) => x2.codec),
                      ),
                  );
                }
                const videoGroupId = variantStream.attributes.get("video");
                const audioGroupId = variantStream.attributes.get("audio");
                const containsVideoCodecs = codecStrings.some((x) =>
                  codec.WN.includes((0, codec.oU)(x)),
                );
                const containsAudioCodecs = codecStrings.some((x) =>
                  codec.PP.includes((0, codec.oU)(x)),
                );
                if (videoGroupId !== null && !containsVideoCodecs) {
                  if (!videoGroupIds.includes(videoGroupId)) {
                    throw new Error(
                      'Invalid M3U8 file; variant stream references video group "'.concat(
                        videoGroupId,
                        '" which',
                      ) + " is not defined in any #EXT-X-MEDIA tags.",
                    );
                  }
                  const matchingVideoMediaTag = mediaTags.find((mediaTag) => {
                    const groupId = mediaTag.attributes.get("group-id");
                    const type = mediaTag.attributes.get("type");
                    return (
                      groupId === videoGroupId && type.toLowerCase() === "video"
                    );
                  });
                  outer: if (matchingVideoMediaTag) {
                    const uri = matchingVideoMediaTag.attributes.get("uri");
                    if (uri === null) {
                      break outer;
                    }
                    const fullPath = (0, misc.HS)(rootPath, uri);
                    const segmentedInput =
                      this.getSegmentedInputForPath(fullPath);
                    const trackBackings =
                      await segmentedInput.getTrackBackings();
                    const videoTrack = trackBackings.find(
                      (x) => x.getType() === "video",
                    );
                    if (!videoTrack || (await videoTrack.getCodec()) === null) {
                      break outer;
                    }
                    const additionalCodecString = await videoTrack
                      .getDecoderConfig()
                      .then((x) => x?.codec ?? null);
                    (0, misc.vA)(additionalCodecString !== null);
                    codecStrings.push(additionalCodecString);
                  }
                }
                if (audioGroupId !== null && !containsAudioCodecs) {
                  if (!audioGroupIds.includes(audioGroupId)) {
                    throw new Error(
                      'Invalid M3U8 file; variant stream references audio group "'.concat(
                        audioGroupId,
                        '" which',
                      ) + " is not defined in any #EXT-X-MEDIA tags.",
                    );
                  }
                  const matchingAudioMediaTag = mediaTags.find((tag) => {
                    const groupId = tag.attributes.get("group-id");
                    const type = tag.attributes.get("type");
                    return (
                      groupId === audioGroupId && type.toLowerCase() === "audio"
                    );
                  });
                  outer: if (matchingAudioMediaTag) {
                    const uri = matchingAudioMediaTag.attributes.get("uri");
                    if (uri === null) {
                      break outer;
                    }
                    const fullPath = (0, misc.HS)(rootPath, uri);
                    const segmentedInput =
                      this.getSegmentedInputForPath(fullPath);
                    const trackBackings =
                      await segmentedInput.getTrackBackings();
                    const audioTrack = trackBackings.find(
                      (x) => x.getType() === "audio",
                    );
                    if (!audioTrack || (await audioTrack.getCodec()) === null) {
                      break outer;
                    }
                    const additionalCodecString = await audioTrack
                      .getDecoderConfig()
                      .then((x) => x?.codec ?? null);
                    (0, misc.vA)(additionalCodecString !== null);
                    codecStrings.push(additionalCodecString);
                  }
                }
                codecStrings = [...new Set(codecStrings)];
                let videoCodecString = null;
                let audioCodecString = null;
                const bandwidth =
                  variantStream.attributes.getAsNumber("bandwidth");
                (0, misc.vA)(bandwidth !== null);
                const averageBandwidth =
                  variantStream.attributes.getAsNumber("average-bandwidth");
                const name = variantStream.attributes.get("name");
                for (const codecString of codecStrings) {
                  const inferredCodec = (0, codec.oU)(codecString);
                  if (inferredCodec === null) {
                    continue;
                  }
                  if (codec.WN.includes(inferredCodec)) {
                    if (videoCodecString !== null) {
                      throw new Error(
                        "Unsupported M3U8 file; multiple video codecs found in the CODECS attribute of a variant stream.",
                      );
                    }
                    videoCodecString = codecString;
                    const videoGroupId2 = variantStream.attributes.get("video");
                    if (videoGroupId2 === null) {
                      const resolution =
                        variantStream.attributes.get("resolution");
                      let width = null;
                      let height = null;
                      if (resolution) {
                        const match = resolution.match(/^(\d+)x(\d+)$/);
                        if (match) {
                          width = Number(match[1]);
                          height = Number(match[2]);
                        }
                      }
                      result.push({
                        id: -1,
                        demuxer: this,
                        backingTrack: null,
                        default: true,
                        autoselect: true,
                        languageCode: misc.IR,
                        lineNumber: variantStream.lineNumber,
                        fullPath: variantStream.fullPath,
                        fullCodecString: videoCodecString,
                        pairingMask: 1n << BigInt(i),
                        peakBitrate: bandwidth,
                        averageBitrate: averageBandwidth,
                        name,
                        hasOnlyKeyPackets: variantStream.hasOnlyKeyPackets,
                        info: {
                          type: "video",
                          width,
                          height,
                        },
                      });
                    } else {
                      if (!videoGroupIds.includes(videoGroupId2)) {
                        throw new Error(
                          'Invalid M3U8 file; variant stream references video group "'.concat(
                            videoGroupId2,
                            '"',
                          ) + " which is not defined in any #EXT-X-MEDIA tags.",
                        );
                      }
                      for (const mediaTag of mediaTags) {
                        const groupId = mediaTag.attributes.get("group-id");
                        const type = mediaTag.attributes.get("type");
                        if (
                          groupId !== videoGroupId2 ||
                          type.toLowerCase() !== "video"
                        ) {
                          continue;
                        }
                        const resolution =
                          mediaTag.attributes.get("resolution") ??
                          variantStream.attributes.get("resolution");
                        let width = null;
                        let height = null;
                        if (resolution) {
                          const match = resolution.match(/^(\d+)x(\d+)$/);
                          if (match) {
                            width = Number(match[1]);
                            height = Number(match[2]);
                          }
                        }
                        result.push({
                          id: -1,
                          demuxer: this,
                          backingTrack: null,
                          default: getMediaTagDefault(mediaTag.attributes),
                          // Autoselect is inferred to be true if the default is true
                          autoselect:
                            getMediaTagDefault(mediaTag.attributes) ||
                            getMediaTagAutoselect(mediaTag.attributes),
                          languageCode: preprocessLanguageCode(
                            mediaTag.attributes.get("language"),
                          ),
                          lineNumber: mediaTag.lineNumber,
                          fullPath: mediaTag.fullPath ?? variantStream.fullPath,
                          fullCodecString: videoCodecString,
                          pairingMask: 1n << BigInt(i),
                          peakBitrate: null,
                          averageBitrate: null,
                          name: mediaTag.attributes.get("name"),
                          hasOnlyKeyPackets: variantStream.hasOnlyKeyPackets,
                          info: {
                            type: "video",
                            width,
                            height,
                          },
                        });
                      }
                    }
                  } else if (codec.PP.includes(inferredCodec)) {
                    if (audioCodecString !== null) {
                      throw new Error(
                        "Unsupported M3U8 file; multiple audio codecs found in the CODECS attribute of a variant stream.",
                      );
                    }
                    audioCodecString = codecString;
                    const audioGroupId2 = variantStream.attributes.get("audio");
                    if (audioGroupId2 === null) {
                      const channels = variantStream.attributes.get("channels");
                      const parsedChannels =
                        channels !== null
                          ? Number(channels.split("/")[0])
                          : null;
                      result.push({
                        id: -1,
                        demuxer: this,
                        backingTrack: null,
                        default: true,
                        autoselect: true,
                        languageCode: misc.IR,
                        lineNumber: variantStream.lineNumber,
                        fullPath: variantStream.fullPath,
                        fullCodecString: audioCodecString,
                        pairingMask: 1n << BigInt(i),
                        peakBitrate: bandwidth,
                        averageBitrate: averageBandwidth,
                        name,
                        hasOnlyKeyPackets: variantStream.hasOnlyKeyPackets,
                        info: {
                          type: "audio",
                          numberOfChannels:
                            parsedChannels !== null &&
                            Number.isInteger(parsedChannels) &&
                            parsedChannels > 0
                              ? parsedChannels
                              : null,
                        },
                      });
                    } else {
                      if (!audioGroupIds.includes(audioGroupId2)) {
                        throw new Error(
                          'Invalid M3U8 file; variant stream references audio group "'.concat(
                            audioGroupId2,
                            '"',
                          ) + " which is not defined in any #EXT-X-MEDIA tags.",
                        );
                      }
                      for (const mediaTag of mediaTags) {
                        const groupId = mediaTag.attributes.get("group-id");
                        const type = mediaTag.attributes.get("type");
                        if (
                          groupId !== audioGroupId2 ||
                          type.toLowerCase() !== "audio"
                        ) {
                          continue;
                        }
                        const channels =
                          mediaTag.attributes.get("channels") ??
                          variantStream.attributes.get("channels");
                        const parsedChannels =
                          channels !== null
                            ? Number(channels.split("/")[0])
                            : null;
                        result.push({
                          id: -1,
                          demuxer: this,
                          backingTrack: null,
                          default: getMediaTagDefault(mediaTag.attributes),
                          // Autoselect is inferred to be true if the default is true
                          autoselect:
                            getMediaTagDefault(mediaTag.attributes) ||
                            getMediaTagAutoselect(mediaTag.attributes),
                          languageCode: preprocessLanguageCode(
                            mediaTag.attributes.get("language"),
                          ),
                          lineNumber: mediaTag.lineNumber,
                          fullPath: mediaTag.fullPath ?? variantStream.fullPath,
                          fullCodecString: audioCodecString,
                          pairingMask: 1n << BigInt(i),
                          peakBitrate: null,
                          averageBitrate: null,
                          name: mediaTag.attributes.get("name"),
                          hasOnlyKeyPackets: variantStream.hasOnlyKeyPackets,
                          info: {
                            type: "audio",
                            numberOfChannels:
                              parsedChannels !== null &&
                              Number.isInteger(parsedChannels) &&
                              parsedChannels > 0
                                ? parsedChannels
                                : null,
                          },
                        });
                      }
                    }
                  }
                }
                return result;
              }),
            );
            const internalTracks = [];
            const addInternalTrack = (track) => {
              const existingTrack = internalTracks.find(
                (x) =>
                  x.fullPath === track.fullPath &&
                  x.info.type === track.info.type,
              );
              if (existingTrack) {
                existingTrack.pairingMask |= track.pairingMask;
                existingTrack.default ||= track.default;
                existingTrack.autoselect ||= track.autoselect;
                existingTrack.lineNumber = Math.min(
                  existingTrack.lineNumber,
                  track.lineNumber,
                );
                if (track.peakBitrate !== null) {
                  existingTrack.peakBitrate = Math.max(
                    existingTrack.peakBitrate ?? -Infinity,
                    track.peakBitrate,
                  );
                }
                if (track.averageBitrate !== null) {
                  existingTrack.averageBitrate = Math.max(
                    existingTrack.averageBitrate ?? -Infinity,
                    track.averageBitrate,
                  );
                }
                if (existingTrack.languageCode === misc.IR) {
                  existingTrack.languageCode = track.languageCode;
                }
              } else {
                track.id = internalTracks.length + 1;
                internalTracks.push(track);
              }
            };
            for (const variantInternalTracks of internalTracksByVariant) {
              for (const trackEntry of variantInternalTracks) {
                addInternalTrack(trackEntry);
              }
            }
            internalTracks.sort((a, b) => a.lineNumber - b.lineNumber);
            this.trackBackings = [];
            for (const internalTrack of internalTracks) {
              if (internalTrack.info.type === "video") {
                this.trackBackings.push(
                  new HlsInputVideoTrackBacking(internalTrack),
                );
              } else {
                this.trackBackings.push(
                  new HlsInputAudioTrackBacking(internalTrack),
                );
              }
            }
            this.internalTracks = internalTracks;
          })());
        }
        async getTrackBackings() {
          await this.readMetadata();
          (0, misc.vA)(this.trackBackings);
          return this.trackBackings;
        }
        getSegmentedInputForPath(path) {
          let segmentedInput = this.segmentedInputs.find(
            (x) => x.path === path,
          );
          if (segmentedInput) {
            return segmentedInput;
          }
          let decls = null;
          if (this.internalTracks) {
            const tracks = this.internalTracks.filter(
              (x) => x.fullPath === path,
            );
            decls = tracks.map((x) => ({
              id: x.id,
              type: x.info.type,
            }));
          }
          segmentedInput = new HlsSegmentedInput(this, path, decls, null);
          this.segmentedInputs.push(segmentedInput);
          return segmentedInput;
        }
        async getMetadataTags() {
          return {};
        }
        async getMimeType() {
          return hls_misc.is;
        }
        dispose() {
          if (this.segmentedInputs) {
            for (const segInput of this.segmentedInputs) {
              segInput.dispose();
            }
            this.segmentedInputs.length = 0;
          }
        }
      }
      class HlsInputTrackBacking {
        constructor(internalTrack) {
          this.internalTrack = internalTrack;
          this.hydrationPromise = null;
        }
        hydrate() {
          return (this.hydrationPromise ??= (async () => {
            const segmentedInput =
              this.internalTrack.demuxer.getSegmentedInputForPath(
                this.internalTrack.fullPath,
              );
            let trackBacking = null;
            const trackBackings = await segmentedInput.getTrackBackings();
            const matchingType = trackBackings.filter(
              (x) => x.getType() === this.getType(),
            );
            if (matchingType.length === 1) {
              trackBacking = matchingType[0];
            } else {
              if (this instanceof HlsInputVideoTrackBacking) {
                for (const backing of matchingType) {
                  if ((await backing.getCodec()) === this.getCodec()) {
                    trackBacking = backing;
                    break;
                  }
                }
              } else {
                (0, misc.vA)(this instanceof HlsInputAudioTrackBacking);
                for (const backing of matchingType) {
                  if ((await backing.getCodec()) === this.getCodec()) {
                    trackBacking = backing;
                    break;
                  }
                }
              }
            }
            if (!trackBacking) {
              throw new Error(
                "Could not find matching track in underlying media data.",
              );
            }
            this.internalTrack.backingTrack = trackBacking;
          })());
        }
        /** If the backing track is already present, delegate synchronously; otherwise, hydrate first. */
        delegate(fn) {
          if (this.internalTrack.backingTrack) {
            return fn();
          }
          return this.hydrate().then(fn);
        }
        getCodec() {
          throw new Error("Not implemented on base class.");
        }
        getDisposition() {
          return {
            ...metadata.gM,
            // Meanings are swapped in HLS: "Default" means that a track is the primary track.
            default: this.internalTrack.autoselect,
            primary: this.internalTrack.default,
          };
        }
        getId() {
          return this.internalTrack.id;
        }
        getPairingMask() {
          return this.internalTrack.pairingMask;
        }
        getInternalCodecId() {
          return null;
        }
        getLanguageCode() {
          return this.internalTrack.languageCode;
        }
        getName() {
          return this.internalTrack.name;
        }
        getNumber() {
          (0, misc.vA)(this.internalTrack.demuxer.internalTracks);
          const trackType = this.internalTrack.info.type;
          let number = 0;
          for (const track of this.internalTrack.demuxer.internalTracks) {
            if (track.info.type === trackType) {
              number++;
            }
            if (track === this.internalTrack) {
              break;
            }
          }
          return number;
        }
        getTimeResolution() {
          return this.delegate(() =>
            this.internalTrack.backingTrack.getTimeResolution(),
          );
        }
        isRelativeToUnixEpoch() {
          return this.delegate(() =>
            this.internalTrack.backingTrack.isRelativeToUnixEpoch(),
          );
        }
        getUnixTimeForTimestamp(timestamp) {
          return this.delegate(() =>
            this.internalTrack.backingTrack.getUnixTimeForTimestamp(timestamp),
          );
        }
        getBitrate() {
          return this.internalTrack.peakBitrate;
        }
        getAverageBitrate() {
          return this.internalTrack.averageBitrate;
        }
        async getDurationFromMetadata(options) {
          await this.hydrate();
          return this.internalTrack.backingTrack.getDurationFromMetadata(
            options,
          );
        }
        async getLiveRefreshInterval() {
          await this.hydrate();
          return this.internalTrack.backingTrack.getLiveRefreshInterval();
        }
        getHasOnlyKeyPackets() {
          return this.internalTrack.hasOnlyKeyPackets || null;
        }
        async getFirstPacket(options) {
          await this.hydrate();
          return this.internalTrack.backingTrack.getFirstPacket(options);
        }
        async getPacket(timestamp, options) {
          await this.hydrate();
          return this.internalTrack.backingTrack.getPacket(timestamp, options);
        }
        async getKeyPacket(timestamp, options) {
          await this.hydrate();
          return this.internalTrack.backingTrack.getKeyPacket(
            timestamp,
            options,
          );
        }
        async getNextPacket(packet, options) {
          await this.hydrate();
          return this.internalTrack.backingTrack.getNextPacket(packet, options);
        }
        async getNextKeyPacket(packet, options) {
          await this.hydrate();
          return this.internalTrack.backingTrack.getNextKeyPacket(
            packet,
            options,
          );
        }
      }
      class HlsInputVideoTrackBacking extends HlsInputTrackBacking {
        constructor(internalTrack) {
          super(internalTrack);
        }
        get backingVideoTrack() {
          return this.internalTrack.backingTrack;
        }
        getType() {
          return "video";
        }
        getCodec() {
          const inferredCodec = (0, codec.oU)(
            this.internalTrack.fullCodecString,
          );
          return inferredCodec;
        }
        getCodedWidth() {
          return this.delegate(() => this.backingVideoTrack.getCodedWidth());
        }
        getCodedHeight() {
          return this.delegate(() => this.backingVideoTrack.getCodedHeight());
        }
        getSquarePixelWidth() {
          return this.delegate(() =>
            this.backingVideoTrack.getSquarePixelWidth(),
          );
        }
        getSquarePixelHeight() {
          return this.delegate(() =>
            this.backingVideoTrack.getSquarePixelHeight(),
          );
        }
        getMetadataDisplayWidth() {
          if (this.backingVideoTrack) {
            return null;
          }
          return this.internalTrack.info.width;
        }
        getMetadataDisplayHeight() {
          if (this.backingVideoTrack) {
            return null;
          }
          return this.internalTrack.info.height;
        }
        getRotation() {
          return this.delegate(() => this.backingVideoTrack.getRotation());
        }
        async getColorSpace() {
          await this.hydrate();
          return this.backingVideoTrack.getColorSpace();
        }
        async canBeTransparent() {
          await this.hydrate();
          return this.backingVideoTrack.canBeTransparent();
        }
        getMetadataCodecParameterString() {
          if (this.backingVideoTrack) {
            return null;
          }
          return this.internalTrack.fullCodecString;
        }
        async getDecoderConfig() {
          await this.hydrate();
          return this.backingVideoTrack.getDecoderConfig();
        }
      }
      class HlsInputAudioTrackBacking extends HlsInputTrackBacking {
        constructor(internalTrack) {
          super(internalTrack);
        }
        get backingAudioTrack() {
          return this.internalTrack.backingTrack;
        }
        getType() {
          return "audio";
        }
        getCodec() {
          const inferredCodec = (0, codec.oU)(
            this.internalTrack.fullCodecString,
          );
          return inferredCodec;
        }
        getNumberOfChannels() {
          if (this.internalTrack.info.numberOfChannels !== null) {
            return this.internalTrack.info.numberOfChannels;
          }
          return this.delegate(() =>
            this.backingAudioTrack.getNumberOfChannels(),
          );
        }
        getSampleRate() {
          return this.delegate(() => this.backingAudioTrack.getSampleRate());
        }
        getMetadataCodecParameterString() {
          if (this.backingAudioTrack) {
            return null;
          }
          return this.internalTrack.fullCodecString;
        }
        async getDecoderConfig() {
          await this.hydrate();
          return this.backingAudioTrack.getDecoderConfig();
        }
      }
      const getMediaTagDefault = (attributes) => {
        const value = attributes.get("default");
        if (value === null) {
          return false;
        }
        const normalized = value.toUpperCase();
        if (normalized === "YES") {
          return true;
        }
        if (normalized === "NO") {
          return false;
        }
        throw new Error(
          'Invalid M3U8 file; #EXT-X-MEDIA DEFAULT attribute must be YES or NO, got "'.concat(
            value,
            '".',
          ),
        );
      };
      const getMediaTagAutoselect = (attributes) => {
        const value = attributes.get("autoselect");
        if (value === null) {
          return false;
        }
        const normalized = value.toUpperCase();
        if (normalized === "YES") {
          return true;
        }
        if (normalized === "NO") {
          return false;
        }
        throw new Error(
          'Invalid M3U8 file; #EXT-X-MEDIA AUTOSELECT attribute must be YES or NO, got "'.concat(
            value,
            '".',
          ),
        );
      };
      const preprocessLanguageCode = (code) => {
        if (code === null) {
          return misc.IR;
        }
        const languageSubtag = code.split("-")[0];
        if (!languageSubtag) {
          return misc.IR;
        }
        return languageSubtag;
      };
    },
    /***/
    1910(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        DT: () =>
          /* binding */
          TAG_I_FRAMES_ONLY,
        /* harmony export */
        EF: () =>
          /* binding */
          TAG_MEDIA,
        /* harmony export */
        Hw: () =>
          /* binding */
          AttributeList,
        /* harmony export */
        L2: () =>
          /* binding */
          TAG_KEY,
        /* harmony export */
        _2: () =>
          /* binding */
          TAG_MEDIA_SEQUENCE,
        /* harmony export */
        bW: () =>
          /* binding */
          TAG_PROGRAM_DATE_TIME,
        /* harmony export */
        c$: () =>
          /* binding */
          TAG_STREAM_INF,
        /* harmony export */
        dY: () =>
          /* binding */
          TAG_ENDLIST,
        /* harmony export */
        e9: () =>
          /* binding */
          TAG_EXTINF,
        /* harmony export */
        g4: () =>
          /* binding */
          TAG_I_FRAME_STREAM_INF,
        /* harmony export */
        i$: () =>
          /* binding */
          TAG_DISCONTINUITY,
        /* harmony export */
        is: () =>
          /* binding */
          HLS_MIME_TYPE,
        /* harmony export */
        nf: () =>
          /* binding */
          canIgnoreLine,
        /* harmony export */
        sA: () =>
          /* binding */
          TAG_MAP,
        /* harmony export */
        v6: () =>
          /* binding */
          TAG_BYTERANGE,
        /* harmony export */
        xe: () =>
          /* binding */
          TAG_TARGETDURATION,
        /* harmony export */
        zA: () =>
          /* binding */
          TAG_PLAYLIST_TYPE,
        /* harmony export */
      });
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const HLS_MIME_TYPE = "application/vnd.apple.mpegurl";
      const TAG_STREAM_INF = "#EXT-X-STREAM-INF:";
      const TAG_I_FRAME_STREAM_INF = "#EXT-X-I-FRAME-STREAM-INF:";
      const TAG_MEDIA = "#EXT-X-MEDIA:";
      const TAG_EXTINF = "#EXTINF:";
      const TAG_MAP = "#EXT-X-MAP:";
      const TAG_KEY = "#EXT-X-KEY:";
      const TAG_MEDIA_SEQUENCE = "#EXT-X-MEDIA-SEQUENCE:";
      const TAG_BYTERANGE = "#EXT-X-BYTERANGE:";
      const TAG_PROGRAM_DATE_TIME = "#EXT-X-PROGRAM-DATE-TIME:";
      const TAG_DISCONTINUITY = "#EXT-X-DISCONTINUITY";
      const TAG_TARGETDURATION = "#EXT-X-TARGETDURATION:";
      const TAG_ENDLIST = "#EXT-X-ENDLIST";
      const TAG_PLAYLIST_TYPE = "#EXT-X-PLAYLIST-TYPE:";
      const TAG_I_FRAMES_ONLY = "#EXT-X-I-FRAMES-ONLY";
      const canIgnoreLine = (line) =>
        line.length === 0 || (line.startsWith("#") && !line.startsWith("#EXT"));
      class AttributeList {
        constructor(str) {
          this._attributes = {};
          let key = "";
          let value = "";
          let inValue = false;
          let inQuotes = false;
          for (let i = 0; i < str.length; i++) {
            const char = str[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "=" && !inValue && !inQuotes) {
              inValue = true;
            } else if (char === "," && !inQuotes) {
              if (key) {
                this._attributes[key.trim().toLowerCase()] = value;
              }
              key = "";
              value = "";
              inValue = false;
            } else if (inValue) {
              value += char;
            } else {
              key += char;
            }
          }
          if (key) {
            this._attributes[key.trim().toLowerCase()] = value;
          }
        }
        get(name) {
          return this._attributes[name.toLowerCase()] ?? null;
        }
        getAsNumber(name) {
          const value = this.get(name);
          if (value === null) {
            return null;
          }
          const num = Number(value);
          return Number.isFinite(num) ? num : null;
        }
        merge(other) {
          Object.assign(this._attributes, other._attributes);
        }
      }
    },
    /***/
    3300(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        D8: () =>
          /* binding */
          prefer,
        /* harmony export */
        Kh: () =>
          /* binding */
          InputTrack,
        /* harmony export */
        N0: () =>
          /* binding */
          InputVideoTrack,
        /* harmony export */
        NY: () =>
          /* binding */
          queryInputTracks,
        /* harmony export */
        Uj: () =>
          /* binding */
          mergeInputTrackQueries,
        /* harmony export */
        Yi: () =>
          /* binding */
          InputAudioTrack,
        /* harmony export */
        i8: () =>
          /* binding */
          desc,
        /* harmony export */
        vo: () =>
          /* binding */
          toValidatedInputTrackQuery,
        /* harmony export */
      });
      var _codec_data_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(9705);
      var _custom_coder_js__WEBPACK_IMPORTED_MODULE_1__ =
        __webpack_require__(471);
      var _logging_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9815);
      var _media_sink_js__WEBPACK_IMPORTED_MODULE_3__ =
        __webpack_require__(6324);
      var _misc_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6760);
      var _packet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6016);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class InputTrack {
        /** @internal */
        constructor(input, backing) {
          this.input = input;
          this._backing = backing;
        }
        /** Returns true if and only if this track is a video track. */
        isVideoTrack() {
          return this instanceof InputVideoTrack;
        }
        /** Returns true if and only if this track is an audio track. */
        isAudioTrack() {
          return this instanceof InputAudioTrack;
        }
        /** The unique ID of this track in the input file. */
        get id() {
          return this._backing.getId();
        }
        /**
         * The 1-based index of this track among all tracks of the same type in the input file. For example, the first
         * video track has number 1, the second video track has number 2, and so on. The index refers to the order in
         * which the tracks are returned by {@link Input.getTracks}.
         */
        get number() {
          return this._backing.getNumber();
        }
        /**
         * Returns the identifier of the codec used internally by the container. It is not homogenized by Mediabunny
         * and depends entirely on the container format.
         *
         * This method can be used to determine the codec of a track in case Mediabunny doesn't know that codec.
         *
         * - For ISOBMFF files, this resolves to the name of the Sample Description Box (e.g. `'avc1'`).
         * - For Matroska files, this resolves to the value of the `CodecID` element.
         * - For WAVE files, this resolves to the value of the format tag in the `'fmt '` chunk.
         * - For ADTS files, this resolves to the `MPEG-4 Audio Object Type`.
         * - For MPEG-TS files, this resolves to the `streamType` value from the Program Map Table.
         * - In all other cases, this resolves to `null`.
         */
        async getInternalCodecId() {
          return this._backing.getInternalCodecId();
        }
        /**
         * See {@link InputTrack.getInternalCodecId}.
         * @deprecated Use {@link InputTrack.getInternalCodecId} instead.
         */
        get internalCodecId() {
          return requireSync(
            this._backing.getInternalCodecId(),
            "internalCodecId",
            "getInternalCodecId",
          );
        }
        /**
         * Returns the ISO 639-2/T language code for this track. If the language is unknown, this resolves to `'und'`
         * (undetermined).
         */
        async getLanguageCode() {
          return this._backing.getLanguageCode();
        }
        /**
         * The ISO 639-2/T language code for this track. If the language is unknown, this field is `'und'` (undetermined).
         * @deprecated Use {@link InputTrack.getLanguageCode} instead.
         */
        get languageCode() {
          return requireSync(
            this._backing.getLanguageCode(),
            "languageCode",
            "getLanguageCode",
          );
        }
        /** Returns the user-defined name for this track. */
        async getName() {
          return this._backing.getName();
        }
        /**
         * A user-defined name for this track.
         * @deprecated Use {@link InputTrack.getName} instead.
         */
        get name() {
          return requireSync(this._backing.getName(), "name", "getName");
        }
        /**
         * Returns a positive number x such that all timestamps and durations of all packets of this track are
         * integer multiples of 1/x.
         */
        async getTimeResolution() {
          return this._backing.getTimeResolution();
        }
        /**
         * A positive number x such that all timestamps and durations of all packets of this track are
         * integer multiples of 1/x.
         * @deprecated Use {@link InputTrack.getTimeResolution} instead.
         */
        get timeResolution() {
          return requireSync(
            this._backing.getTimeResolution(),
            "timeResolution",
            "getTimeResolution",
          );
        }
        /**
         * Returns whether the timestamps of this track are relative to the Unix epoch (January 1, 1970 00:00:00 UTC).
         * When `true`, each timestamp maps to a definitive point in time.
         */
        async isRelativeToUnixEpoch() {
          return this._backing.isRelativeToUnixEpoch();
        }
        /**
         * Returns the Unix time (in seconds since January 1, 1970 00:00:00 UTC) that the given track timestamp (in seconds)
         * maps to, or `null` if there is no such mapping. This provides a piecewise-continuous mapping from this track's
         * timestamp space into wall-clock time. Such mapping exists, for example, for HLS playlists with
         * `#EXT-X-PROGRAM-DATE-TIME` tags present.
         *
         * This mapping can be available even when {@link InputTrack.isRelativeToUnixEpoch} is `false`, for example for HLS
         * streams with program date time information but with {@link HlsInputFormatOptions.offsetTimestampsByDateTime}
         * set to `false`.
         */
        async getUnixTimeForTimestamp(timestamp) {
          return this._backing.getUnixTimeForTimestamp(timestamp);
        }
        /**
         * Whether the track's timestamps can be mapped to Unix wall clock time via
         * {@link InputTrack.getUnixTimeForTimestamp}.
         */
        async hasUnixTimeMapping() {
          return (
            (await this._backing.getUnixTimeForTimestamp(
              await this.getFirstTimestamp(),
            )) !== null
          );
        }
        /** Returns the track's disposition, i.e. information about its intended usage. */
        async getDisposition() {
          return this._backing.getDisposition();
        }
        /**
         * The track's disposition, i.e. information about its intended usage.
         * @deprecated Use {@link InputTrack.getDisposition} instead.
         */
        get disposition() {
          return requireSync(
            this._backing.getDisposition(),
            "disposition",
            "getDisposition",
          );
        }
        /**
         * Returns the peak bitrate of the track in bits per second, as specified in the track's metadata. This might not
         * match the actual media data's bitrate.
         */
        async getBitrate() {
          return this._backing.getBitrate();
        }
        /**
         * Returns the average bitrate of the track in bits per second, as specified in the track's metadata. This might
         * not match the actual media data's bitrate.
         */
        async getAverageBitrate() {
          return this._backing.getAverageBitrate();
        }
        /**
         * Returns the start timestamp of the first packet of this track, in seconds. While often near zero, this value
         * may be positive or even negative. A negative starting timestamp means the track's timing has been offset. Samples
         * with a negative timestamp should not be presented.
         */
        async getFirstTimestamp() {
          const firstPacket = await this._backing.getFirstPacket({
            metadataOnly: true,
          });
          return firstPacket?.timestamp ?? 0;
        }
        /**
         * Returns the end timestamp of the last packet of this track, in seconds.
         *
         * By default, when the underlying media is live, this method will only resolve once the live stream ends. If you
         * want to query the current end timestamp of the stream, set {@link PacketRetrievalOptions.skipLiveWait} to `true`
         * in the options.
         */
        async computeDuration(options) {
          const lastPacket = await this._backing.getPacket(Infinity, {
            metadataOnly: true,
            ...options,
          });
          const result =
            (lastPacket?.timestamp ?? 0) + (lastPacket?.duration ?? 0);
          return (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.gl)(
            result,
            await this.getTimeResolution(),
          );
        }
        /**
         * Gets the duration (end timestamp) in seconds of this track from metadata stored in the file. This value may be
         * approximate or diverge from the actual, precise duration returned by `.computeDuration()`, but compared to that
         * method, this method is cheaper. When the duration cannot be determined from the file metadata, `null`
         * is returned.
         *
         * By default, when the underlying media is live, this method will only resolve once the live stream
         * ends. If you want to query the current duration of the media, set
         * {@link DurationMetadataRequestOptions.skipLiveWait} to `true` in the options.
         */
        async getDurationFromMetadata(options = {}) {
          return this._backing.getDurationFromMetadata(options);
        }
        /**
         * Computes aggregate packet statistics for this track, such as average packet rate or bitrate.
         *
         * @param targetPacketCount - This optional parameter sets a target for how many packets this method must have
         * looked at before it can return early; this means, you can use it to aggregate only a subset (prefix) of all
         * packets. This is very useful for getting a great estimate of video frame rate without having to scan through the
         * entire file.
         *
         * By default, when the underlying media is live and `targetPacketCount` is not set, this method will only resolve
         * once the live stream ends. If you want to query the current packet statistics of the stream, set
         * {@link PacketRetrievalOptions.skipLiveWait} to `true` in the options.
         */
        async computePacketStats(targetPacketCount = Infinity, options) {
          const sink = new _media_sink_js__WEBPACK_IMPORTED_MODULE_3__.kQ(this);
          let startTimestamp = Infinity;
          let endTimestamp = -Infinity;
          let packetCount = 0;
          let totalPacketBytes = 0;
          for await (const packet of sink.packets(void 0, void 0, {
            metadataOnly: true,
            ...options,
          })) {
            if (
              packetCount >= targetPacketCount &&
              packet.timestamp >= endTimestamp
            ) {
              break;
            }
            startTimestamp = Math.min(startTimestamp, packet.timestamp);
            endTimestamp = Math.max(
              endTimestamp,
              packet.timestamp + packet.duration,
            );
            packetCount++;
            totalPacketBytes += packet.byteLength;
          }
          return {
            packetCount,
            averagePacketRate: packetCount
              ? Number(
                  (packetCount / (endTimestamp - startTimestamp)).toPrecision(
                    16,
                  ),
                )
              : 0,
            averageBitrate: packetCount
              ? Number(
                  (
                    (8 * totalPacketBytes) /
                    (endTimestamp - startTimestamp)
                  ).toPrecision(16),
                )
              : 0,
          };
        }
        /**
         * Whether or not this track is currently live, meaning the media's end is still unknown.
         *
         * The value returned by this method may change over time as the track stops being live. To keep track of the
         * track's live status, poll this method at the track's refresh interval
         * via {@link InputTrack.getLiveRefreshInterval}.
         */
        async isLive() {
          return (await this._backing.getLiveRefreshInterval()) !== null;
        }
        /**
         * Returns the track's live refresh interval in seconds, or `null` if the track is not live. This interval describes
         * the time it takes, on average, for new live media data to become available.
         */
        async getLiveRefreshInterval() {
          return this._backing.getLiveRefreshInterval();
        }
        /**
         * Returns `true` if this track can be paired with the given track. Two tracks being pairable means they can be
         * presented (displayed) together.
         *
         * Returns `false` if `other` equals `this`.
         */
        canBePairedWith(other) {
          if (!(other instanceof InputTrack)) {
            throw new TypeError("other must be an InputTrack.");
          }
          if (this.input !== other.input || this === other) {
            return false;
          }
          return (
            (this._backing.getPairingMask() &
              other._backing.getPairingMask()) !==
            0n
          );
        }
        /**
         * Gets the list of other tracks that can be paired with this track. An optional query can be provided to narrow
         * down the results.
         */
        async getPairableTracks(query) {
          return this.input.getTracks(
            mergeInputTrackQueries(
              {
                filter: (t) => t.canBePairedWith(this),
              },
              query,
            ),
          );
        }
        /**
         * Gets the list of other video tracks that can be paired with this track. An optional query can be provided to
         * narrow down the results.
         */
        async getPairableVideoTracks(query) {
          return this.input.getVideoTracks(
            mergeInputTrackQueries(
              {
                filter: (t) => t.canBePairedWith(this),
              },
              query,
            ),
          );
        }
        /**
         * Gets the list of other audio tracks that can be paired with this track. An optional query can be provided to
         * narrow down the results.
         */
        async getPairableAudioTracks(query) {
          return this.input.getAudioTracks(
            mergeInputTrackQueries(
              {
                filter: (t) => t.canBePairedWith(this),
              },
              query,
            ),
          );
        }
        /** Returns the primary track that can be paired with this track, optionally steered by the provided query. */
        async getPrimaryPairableVideoTrack(query) {
          return this.input.getPrimaryVideoTrack(
            mergeInputTrackQueries(
              {
                filter: (t) => t.canBePairedWith(this),
              },
              query,
            ),
          );
        }
        /** Returns the primary track that can be paired with this track, optionally steered by the provided query. */
        async getPrimaryPairableAudioTrack(query) {
          return this.input.getPrimaryAudioTrack(
            mergeInputTrackQueries(
              {
                filter: (t) => t.canBePairedWith(this),
              },
              query,
            ),
          );
        }
        /** Returns `true` if there is another track that can be paired with this track. */
        async hasPairableTrack(predicate) {
          predicate &&= toValidatedPredicate(predicate);
          const tracks = await this.input.getTracks();
          for (const track of tracks) {
            if (!this.canBePairedWith(track)) {
              continue;
            }
            if (!predicate || (await predicate(track))) {
              return true;
            }
          }
          return false;
        }
        /** Returns `true` if there is a video track that can be paired with this track. */
        hasPairableVideoTrack(predicate) {
          predicate &&= toValidatedPredicate(predicate);
          return this.hasPairableTrack(
            async (x) =>
              x.isVideoTrack() && (!predicate || (await predicate(x))),
          );
        }
        /** Returns `true` if there is an audio track that can be paired with this track. */
        hasPairableAudioTrack(predicate) {
          predicate &&= toValidatedPredicate(predicate);
          return this.hasPairableTrack(
            async (x) =>
              x.isAudioTrack() && (!predicate || (await predicate(x))),
          );
        }
      }
      const requireSync = (value, getterName, asyncName) => {
        if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(value)) {
          throw new Error(
            "'".concat(
              getterName,
              "' is deprecated and not available synchronously for this track. Use the preferred",
            ) + " '".concat(asyncName, "()' instead."),
          );
        }
        return value;
      };
      const toValidatedPredicate = (predicate) => {
        if (predicate !== void 0 && typeof predicate !== "function") {
          throw new TypeError("predicate, when provided, must be a function.");
        }
        return predicate
          ? (track) => {
              const handle = (result2) => {
                if (typeof result2 !== "boolean") {
                  throw new TypeError(
                    "predicate must return or resolve to a boolean value.",
                  );
                }
                return result2;
              };
              const result = predicate(track);
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(result)) {
                return result.then(handle);
              }
              return handle(result);
            }
          : void 0;
      };
      class InputVideoTrack extends InputTrack {
        /** @internal */
        constructor(input, backing) {
          super(input, backing);
          this._pixelAspectRatioCache = null;
          this._backing = backing;
        }
        get type() {
          return "video";
        }
        /** The codec of the track's packets. */
        async getCodec() {
          return this._backing.getCodec();
        }
        /**
         * The codec of the track's packets.
         * @deprecated Use {@link InputVideoTrack.getCodec} instead.
         */
        get codec() {
          return requireSync(this._backing.getCodec(), "codec", "getCodec");
        }
        async hasOnlyKeyPackets() {
          return (
            (await this._backing.getHasOnlyKeyPackets?.()) ??
            (await this._backing.getCodec()) === "prores"
          );
        }
        /** Returns the width in pixels of the track's coded samples, before any transformations or rotations. */
        async getCodedWidth() {
          return this._backing.getCodedWidth();
        }
        /**
         * The width in pixels of the track's coded samples, before any transformations or rotations.
         * @deprecated Use {@link InputVideoTrack.getCodedWidth} instead.
         */
        get codedWidth() {
          return requireSync(
            this._backing.getCodedWidth(),
            "codedWidth",
            "getCodedWidth",
          );
        }
        /** Returns the height in pixels of the track's coded samples, before any transformations or rotations. */
        async getCodedHeight() {
          return this._backing.getCodedHeight();
        }
        /**
         * The height in pixels of the track's coded samples, before any transformations or rotations.
         * @deprecated Use {@link InputVideoTrack.getCodedHeight} instead.
         */
        get codedHeight() {
          return requireSync(
            this._backing.getCodedHeight(),
            "codedHeight",
            "getCodedHeight",
          );
        }
        /** Returns the angle in degrees by which the track's frames should be rotated (clockwise). */
        async getRotation() {
          return this._backing.getRotation();
        }
        /**
         * The angle in degrees by which the track's frames should be rotated (clockwise).
         * @deprecated Use {@link InputVideoTrack.getRotation} instead.
         */
        get rotation() {
          return requireSync(
            this._backing.getRotation(),
            "rotation",
            "getRotation",
          );
        }
        /**
         * Returns the width of the track's frames in square pixels, adjusted for pixel aspect ratio but before rotation.
         */
        async getSquarePixelWidth() {
          return this._backing.getSquarePixelWidth();
        }
        /**
         * The width of the track's frames in square pixels, adjusted for pixel aspect ratio but before rotation.
         * @deprecated Use {@link InputVideoTrack.getSquarePixelWidth} instead.
         */
        get squarePixelWidth() {
          return requireSync(
            this._backing.getSquarePixelWidth(),
            "squarePixelWidth",
            "getSquarePixelWidth",
          );
        }
        /**
         * Returns the height of the track's frames in square pixels, adjusted for pixel aspect ratio but before rotation.
         */
        async getSquarePixelHeight() {
          return this._backing.getSquarePixelHeight();
        }
        /**
         * The height of the track's frames in square pixels, adjusted for pixel aspect ratio but before rotation.
         * @deprecated Use {@link InputVideoTrack.getSquarePixelHeight} instead.
         */
        get squarePixelHeight() {
          return requireSync(
            this._backing.getSquarePixelHeight(),
            "squarePixelHeight",
            "getSquarePixelHeight",
          );
        }
        /**
         * Returns the pixel aspect ratio of the track's frames as a rational number in its reduced form. Most videos use
         * square pixels (1:1).
         */
        async getPixelAspectRatio() {
          return (this._pixelAspectRatioCache ??= (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_4__.Yf)({
            num:
              (await this.getSquarePixelWidth()) *
              (await this.getCodedHeight()),
            den:
              (await this.getSquarePixelHeight()) *
              (await this.getCodedWidth()),
          }));
        }
        /**
         * The pixel aspect ratio of the track's frames, as a rational number in its reduced form. Most videos use
         * square pixels (1:1).
         * @deprecated Use {@link InputVideoTrack.getPixelAspectRatio} instead.
         */
        get pixelAspectRatio() {
          return (this._pixelAspectRatioCache ??= (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_4__.Yf)({
            num:
              requireSync(
                this._backing.getSquarePixelWidth(),
                "pixelAspectRatio",
                "getPixelAspectRatio",
              ) *
              requireSync(
                this._backing.getCodedHeight(),
                "pixelAspectRatio",
                "getPixelAspectRatio",
              ),
            den:
              requireSync(
                this._backing.getSquarePixelHeight(),
                "pixelAspectRatio",
                "getPixelAspectRatio",
              ) *
              requireSync(
                this._backing.getCodedWidth(),
                "pixelAspectRatio",
                "getPixelAspectRatio",
              ),
          }));
        }
        /** Returns the display width of the track's frames in pixels, after aspect ratio adjustment and rotation. */
        async getDisplayWidth() {
          const metadata = await this._backing.getMetadataDisplayWidth?.();
          if (metadata != null) {
            return metadata;
          }
          const rotation = await this.getRotation();
          return rotation % 180 === 0
            ? this.getSquarePixelWidth()
            : this.getSquarePixelHeight();
        }
        /**
         * The display width of the track's frames in pixels, after aspect ratio adjustment and rotation.
         * @deprecated Use {@link InputVideoTrack.getDisplayWidth} instead.
         */
        get displayWidth() {
          const metadataRaw = this._backing.getMetadataDisplayWidth?.();
          if (metadataRaw !== void 0) {
            const metadata = requireSync(
              metadataRaw,
              "displayWidth",
              "getDisplayWidth",
            );
            if (metadata !== null) {
              return metadata;
            }
          }
          const rotation = requireSync(
            this._backing.getRotation(),
            "displayWidth",
            "getDisplayWidth",
          );
          const value =
            rotation % 180 === 0
              ? this._backing.getSquarePixelWidth()
              : this._backing.getSquarePixelHeight();
          return requireSync(value, "displayWidth", "getDisplayWidth");
        }
        /** Returns the display height of the track's frames in pixels, after aspect ratio adjustment and rotation. */
        async getDisplayHeight() {
          const metadata = await this._backing.getMetadataDisplayHeight?.();
          if (metadata != null) {
            return metadata;
          }
          const rotation = await this.getRotation();
          return rotation % 180 === 0
            ? this.getSquarePixelHeight()
            : this.getSquarePixelWidth();
        }
        /**
         * The display height of the track's frames in pixels, after aspect ratio adjustment and rotation.
         * @deprecated Use {@link InputVideoTrack.getDisplayHeight} instead.
         */
        get displayHeight() {
          const metadataRaw = this._backing.getMetadataDisplayHeight?.();
          if (metadataRaw !== void 0) {
            const metadata = requireSync(
              metadataRaw,
              "displayHeight",
              "getDisplayHeight",
            );
            if (metadata !== null) {
              return metadata;
            }
          }
          const rotation = requireSync(
            this._backing.getRotation(),
            "displayHeight",
            "getDisplayHeight",
          );
          const value =
            rotation % 180 === 0
              ? this._backing.getSquarePixelHeight()
              : this._backing.getSquarePixelWidth();
          return requireSync(value, "displayHeight", "getDisplayHeight");
        }
        /** Returns the color space of the track's samples. */
        async getColorSpace() {
          return this._backing.getColorSpace();
        }
        /** If this method returns true, the track's samples use a high dynamic range (HDR). */
        async hasHighDynamicRange() {
          const colorSpace = await this._backing.getColorSpace();
          return (
            colorSpace.primaries === "bt2020" ||
            colorSpace.primaries === "smpte432" ||
            colorSpace.transfer === "pq" ||
            colorSpace.transfer === "hlg" ||
            colorSpace.matrix === "bt2020-ncl"
          );
        }
        /** Checks if this track may contain transparent samples with alpha data. */
        async canBeTransparent() {
          return this._backing.canBeTransparent();
        }
        /**
         * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#video-decoder-config) for decoding the
         * track's packets using a [`VideoDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/VideoDecoder). Returns
         * null if the track's codec is unknown.
         */
        async getDecoderConfig() {
          return this._backing.getDecoderConfig();
        }
        async getCodecParameterString() {
          const fromMetadata =
            await this._backing.getMetadataCodecParameterString?.();
          if (fromMetadata != null) {
            return fromMetadata;
          }
          const decoderConfig = await this._backing.getDecoderConfig();
          return decoderConfig?.codec ?? null;
        }
        async canDecode() {
          try {
            const decoderConfig = await this._backing.getDecoderConfig();
            if (!decoderConfig) {
              return false;
            }
            const codec = await this._backing.getCodec();
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(codec !== null);
            if (
              _custom_coder_js__WEBPACK_IMPORTED_MODULE_1__.wb.some((x) =>
                x.supports(codec, decoderConfig),
              )
            ) {
              return true;
            }
            if (typeof VideoDecoder === "undefined") {
              return false;
            }
            const support = await VideoDecoder.isConfigSupported(decoderConfig);
            return support.supported === true;
          } catch (error) {
            _logging_js__WEBPACK_IMPORTED_MODULE_2__.y._error(
              "Error during decodability check:",
              error,
            );
            return false;
          }
        }
        async determinePacketType(packet) {
          if (!(packet instanceof _packet_js__WEBPACK_IMPORTED_MODULE_5__.Z)) {
            throw new TypeError("packet must be an EncodedPacket.");
          }
          if (packet.isMetadataOnly) {
            throw new TypeError(
              "packet must not be metadata-only to determine its type.",
            );
          }
          const codec = await this.getCodec();
          if (codec === null) {
            return null;
          }
          const decoderConfig = await this.getDecoderConfig();
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(decoderConfig);
          return (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.PR)(
            codec,
            decoderConfig,
            packet.data,
          );
        }
        /**
         * Computes frame rate metrics for this video track, i.e. estimates the video's frame rate. Frame rate is never
         * determined from file metadata (which is unreliable) but is always deduced directly from the actual frame
         * timestamps.
         */
        async computeFrameRateMetrics(options = {}) {
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (
            options.targetPacketCount !== void 0 &&
            (!(0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Et)(
              options.targetPacketCount,
            ) ||
              options.targetPacketCount < 0)
          ) {
            throw new TypeError(
              "options.targetPacketCount must be a non-negative number.",
            );
          }
          const timeResolution = await this.getTimeResolution();
          const targetPacketCount = options.targetPacketCount ?? 256;
          const sink = new _media_sink_js__WEBPACK_IMPORTED_MODULE_3__.kQ(this);
          const timestamps = [];
          let maxTimestamp = -Infinity;
          let probedPacketCount = 0;
          for await (const packet of sink.packets(void 0, void 0, {
            metadataOnly: true,
          })) {
            if (
              timestamps.length >= targetPacketCount &&
              packet.timestamp >= maxTimestamp
            ) {
              break;
            }
            timestamps.push(packet.timestamp);
            maxTimestamp = Math.max(maxTimestamp, packet.timestamp);
            probedPacketCount++;
          }
          const ticks = new Float64Array(timestamps.length);
          for (let i = 0; i < timestamps.length; i++) {
            ticks[i] = Math.round(timestamps[i] * timeResolution);
          }
          ticks.sort();
          let n = 1;
          for (let i = 1; i < ticks.length; i++) {
            if (ticks[i] !== ticks[n - 1]) {
              ticks[n++] = ticks[i];
            }
          }
          if (n < 2) {
            return {
              underlyingFrameRate: null,
              bestGuessFrameRate: timeResolution,
              minFrameRate: timeResolution,
              maxFrameRate: timeResolution,
              averageFrameRate: timeResolution,
              medianFrameRate: timeResolution,
              frameRateIsConstant: true,
              probedPacketCount,
            };
          }
          const activeTicks = ticks.subarray(0, n);
          const underlyingFrameRate = findUnderlyingFrameRate(
            activeTicks,
            timeResolution,
          );
          const unitRate = underlyingFrameRate ?? timeResolution;
          const ticksPerFrame =
            underlyingFrameRate !== null
              ? timeResolution / underlyingFrameRate
              : null;
          const histogram = /* @__PURE__ */ new Map();
          let minDifference = Infinity;
          let maxDifference = -Infinity;
          let totalDifference = 0;
          for (let i = 1; i < n; i++) {
            const tickDifference = activeTicks[i] - activeTicks[i - 1];
            const difference =
              ticksPerFrame !== null
                ? Math.max(1, Math.round(tickDifference / ticksPerFrame))
                : tickDifference;
            histogram.set(difference, (histogram.get(difference) ?? 0) + 1);
            minDifference = Math.min(minDifference, difference);
            maxDifference = Math.max(maxDifference, difference);
            totalDifference += difference;
          }
          const differenceCount = n - 1;
          const sortedDifferences = [...histogram.keys()].sort((a, b) => a - b);
          const middleA = (differenceCount - 1) >> 1;
          const middleB = differenceCount >> 1;
          let medianDifferenceA = 0;
          let medianDifferenceB = 0;
          let cumulativeCount = 0;
          for (const difference of sortedDifferences) {
            cumulativeCount += histogram.get(difference);
            if (medianDifferenceA === 0 && cumulativeCount > middleA) {
              medianDifferenceA = difference;
            }
            if (cumulativeCount > middleB) {
              medianDifferenceB = difference;
              break;
            }
          }
          const medianFrameRate =
            (unitRate / medianDifferenceA + unitRate / medianDifferenceB) / 2;
          return {
            underlyingFrameRate,
            bestGuessFrameRate:
              underlyingFrameRate !== null
                ? underlyingFrameRate
                : getBestGuessFrameRate(medianFrameRate),
            minFrameRate: unitRate / maxDifference,
            maxFrameRate: unitRate / minDifference,
            averageFrameRate: (unitRate * differenceCount) / totalDifference,
            medianFrameRate,
            frameRateIsConstant:
              underlyingFrameRate !== null &&
              minDifference === 1 &&
              maxDifference === 1,
            probedPacketCount,
          };
        }
      }
      class InputAudioTrack extends InputTrack {
        /** @internal */
        constructor(input, backing) {
          super(input, backing);
          this._backing = backing;
        }
        get type() {
          return "audio";
        }
        /** The codec of the track's packets. */
        async getCodec() {
          return this._backing.getCodec();
        }
        /**
         * The codec of the track's packets.
         * @deprecated Use {@link InputAudioTrack.getCodec} instead.
         */
        get codec() {
          return requireSync(this._backing.getCodec(), "codec", "getCodec");
        }
        async hasOnlyKeyPackets() {
          return (await this._backing.getHasOnlyKeyPackets?.()) ?? true;
        }
        /** Returns the number of audio channels in the track. */
        async getNumberOfChannels() {
          return this._backing.getNumberOfChannels();
        }
        /**
         * The number of audio channels in the track.
         * @deprecated Use {@link InputAudioTrack.getNumberOfChannels} instead.
         */
        get numberOfChannels() {
          return requireSync(
            this._backing.getNumberOfChannels(),
            "numberOfChannels",
            "getNumberOfChannels",
          );
        }
        /** Returns the track's audio sample rate in hertz. */
        async getSampleRate() {
          return this._backing.getSampleRate();
        }
        /**
         * The track's audio sample rate in hertz.
         * @deprecated Use {@link InputAudioTrack.getSampleRate} instead.
         */
        get sampleRate() {
          return requireSync(
            this._backing.getSampleRate(),
            "sampleRate",
            "getSampleRate",
          );
        }
        /**
         * Returns the [decoder configuration](https://www.w3.org/TR/webcodecs/#audio-decoder-config) for decoding the
         * track's packets using an [`AudioDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/AudioDecoder). Returns
         * null if the track's codec is unknown.
         */
        async getDecoderConfig() {
          return this._backing.getDecoderConfig();
        }
        async getCodecParameterString() {
          const fromMetadata =
            await this._backing.getMetadataCodecParameterString?.();
          if (fromMetadata != null) {
            return fromMetadata;
          }
          const decoderConfig = await this._backing.getDecoderConfig();
          return decoderConfig?.codec ?? null;
        }
        async canDecode() {
          try {
            const decoderConfig = await this._backing.getDecoderConfig();
            if (!decoderConfig) {
              return false;
            }
            const codec = await this._backing.getCodec();
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(codec !== null);
            if (
              _custom_coder_js__WEBPACK_IMPORTED_MODULE_1__.zx.some((x) =>
                x.supports(codec, decoderConfig),
              )
            ) {
              return true;
            }
            if (decoderConfig.codec.startsWith("pcm-")) {
              return true;
            } else {
              if (typeof AudioDecoder === "undefined") {
                return false;
              }
              const support =
                await AudioDecoder.isConfigSupported(decoderConfig);
              return support.supported === true;
            }
          } catch (error) {
            _logging_js__WEBPACK_IMPORTED_MODULE_2__.y._error(
              "Error during decodability check:",
              error,
            );
            return false;
          }
        }
        async determinePacketType(packet) {
          if (!(packet instanceof _packet_js__WEBPACK_IMPORTED_MODULE_5__.Z)) {
            throw new TypeError("packet must be an EncodedPacket.");
          }
          if ((await this.getCodec()) === null) {
            return null;
          }
          return "key";
        }
      }
      const asc = (value) => {
        return value ?? Infinity;
      };
      const desc = (value) => {
        return -(value ?? -Infinity);
      };
      const prefer = (value) => {
        return -value;
      };
      const toValidatedInputTrackQuery = (query) => {
        if (typeof query !== "object" || !query) {
          throw new TypeError("query must be an object.");
        }
        if (query.filter !== void 0 && typeof query.filter !== "function") {
          throw new TypeError(
            "query.filter, when provided, must be a function.",
          );
        }
        if (query.sortBy !== void 0 && typeof query.sortBy !== "function") {
          throw new TypeError(
            "query.sortBy, when provided, must be a function.",
          );
        }
        return {
          filter: query.filter
            ? (track) => {
                const handle = (bool) => {
                  if (typeof bool !== "boolean") {
                    throw new TypeError(
                      "query.filter must return or resolve to a boolean.",
                    );
                  }
                  return bool;
                };
                const result = query.filter(track);
                if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(result)) {
                  return result.then(handle);
                } else {
                  return handle(result);
                }
              }
            : void 0,
          sortBy: query.sortBy
            ? (track) => {
                const handle = (value) => {
                  if (
                    typeof value !== "number" &&
                    (!Array.isArray(value) ||
                      !value.every((x) => typeof x === "number"))
                  ) {
                    throw new TypeError(
                      "query.sortBy must return or resolve to a number or an array of numbers.",
                    );
                  }
                  return value;
                };
                const result = query.sortBy(track);
                if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(result)) {
                  return result.then(handle);
                } else {
                  return handle(result);
                }
              }
            : void 0,
        };
      };
      const mergeInputTrackQueries = (queryA, queryB) => {
        return {
          filter:
            queryA?.filter || queryB?.filter
              ? (track) => {
                  const resultA = queryA?.filter?.(track) ?? true;
                  const handleResultA = (resultA2) => {
                    if (resultA2 === false) {
                      return false;
                    }
                    return queryB?.filter?.(track) ?? true;
                  };
                  if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(resultA)) {
                    return resultA.then(handleResultA);
                  } else {
                    return handleResultA(resultA);
                  }
                }
              : void 0,
          sortBy:
            queryA?.sortBy || queryB?.sortBy
              ? (track) => {
                  const resultA = queryA?.sortBy?.(track) ?? [];
                  const resultB = queryB?.sortBy?.(track) ?? [];
                  const join = (resultA2, resultB2) => {
                    return [
                      ...(Array.isArray(resultA2) ? resultA2 : [resultA2]),
                      ...(Array.isArray(resultB2) ? resultB2 : [resultB2]),
                    ];
                  };
                  if (
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(resultA) ||
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(resultB)
                  ) {
                    return Promise.all([resultA, resultB]).then(
                      ([resultA2, resultB2]) => {
                        return join(resultA2, resultB2);
                      },
                    );
                  } else {
                    return join(resultA, resultB);
                  }
                }
              : void 0,
        };
      };
      const queryInputTracks = async (tracks, query) => {
        let matched = tracks;
        if (query?.filter) {
          const filterMatches = tracks.map((t) => query.filter(t));
          const hasAsyncFilter = filterMatches.some((x) =>
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(x),
          );
          if (hasAsyncFilter) {
            const resolvedFilterMatches = await Promise.all(filterMatches);
            matched = tracks.filter((_, i) => resolvedFilterMatches[i]);
          } else {
            matched = tracks.filter((_, i) => filterMatches[i]);
          }
        }
        if (!query?.sortBy) {
          return matched;
        }
        const sortValues = matched.map((t) => query.sortBy(t));
        const hasAsyncSort = sortValues.some((x) =>
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(x),
        );
        const resolvedSortValues = hasAsyncSort
          ? await Promise.all(sortValues)
          : sortValues;
        return matched
          .map((track, i) => ({ track, sortValue: resolvedSortValues[i] }))
          .sort((a, b) => {
            const aValues = Array.isArray(a.sortValue)
              ? a.sortValue
              : [a.sortValue];
            const bValues = Array.isArray(b.sortValue)
              ? b.sortValue
              : [b.sortValue];
            const maxLength = Math.max(aValues.length, bValues.length);
            for (let i = 0; i < maxLength; i++) {
              const aValue = aValues[i] ?? 0;
              const bValue = bValues[i] ?? 0;
              if (aValue === bValue) {
                continue;
              }
              return aValue - bValue;
            }
            return 0;
          })
          .map((x) => x.track);
      };
      const findUnderlyingFrameRate = (ticks, resolution) => {
        const MAX_DENOMINATOR = 1e6;
        const MIN_INLIER_RATIO = 0.98;
        const DELTA_TOLERANCE = 1 + 1e-9;
        const MAX_EFFECTIVE_FRAME_SPAN = 1e3;
        const KNOWN_FRAME_RATES = [
          12,
          15,
          20,
          24e3 / 1001,
          24,
          25,
          3e4 / 1001,
          30,
          48,
          50,
          6e4 / 1001,
          60,
          100,
          12e4 / 1001,
          120,
          144,
          240,
        ];
        if (ticks.length < 2) {
          return null;
        }
        const gaps = new Float64Array(ticks.length - 1);
        for (let i = 1; i < ticks.length; i++) {
          const gap = ticks[i] - ticks[i - 1];
          if (!(gap > 0)) {
            return null;
          }
          gaps[i - 1] = gap;
        }
        const sortedGaps = gaps.slice();
        sortedGaps.sort();
        let period = sortedGaps[Math.floor(sortedGaps.length * 0.05)];
        for (let iteration = 0; iteration < 6; iteration++) {
          let totalTicks2 = 0;
          let totalFrames2 = 0;
          for (const gap of gaps) {
            const multiple = Math.max(1, Math.round(gap / period));
            if (Math.abs(gap - multiple * period) >= DELTA_TOLERANCE) {
              continue;
            }
            totalTicks2 += gap;
            totalFrames2 += multiple;
          }
          if (totalFrames2 === 0) {
            return null;
          }
          const refinedPeriod = totalTicks2 / totalFrames2;
          if (Math.abs(refinedPeriod - period) <= 1e-12 * Math.max(1, period)) {
            period = refinedPeriod;
            break;
          }
          period = refinedPeriod;
        }
        let inlierCount = 0;
        let totalTicks = 0;
        let totalFrames = 0;
        for (const gap of gaps) {
          const multiple = Math.max(1, Math.round(gap / period));
          if (Math.abs(gap - multiple * period) >= DELTA_TOLERANCE) {
            continue;
          }
          inlierCount++;
          totalTicks += gap;
          totalFrames += multiple;
        }
        if (inlierCount / gaps.length < MIN_INLIER_RATIO) {
          return null;
        }
        period = totalTicks / totalFrames;
        const uncertainty = 1 / Math.min(totalFrames, MAX_EFFECTIVE_FRAME_SPAN);
        const periodLo = Math.max(Number.EPSILON, period - uncertainty);
        const periodHi = period + uncertainty;
        const fpsLo = resolution / periodHi;
        const fpsHi = resolution / periodLo;
        const fittedFps = resolution / period;
        let fps = null;
        let bestKnownError = Infinity;
        for (const candidate of KNOWN_FRAME_RATES) {
          if (candidate < fpsLo || candidate > fpsHi) {
            continue;
          }
          const error = Math.abs(candidate / fittedFps - 1);
          if (error < bestKnownError) {
            fps = candidate;
            bestKnownError = error;
          }
        }
        if (fps === null) {
          const periodFraction = simplestFractionBetween(
            periodLo,
            periodHi,
            MAX_DENOMINATOR,
          );
          const fpsFraction = simplestFractionBetween(
            fpsLo,
            fpsHi,
            MAX_DENOMINATOR,
          );
          if (
            fpsFraction &&
            (!periodFraction ||
              fpsFraction.den < periodFraction.den ||
              (fpsFraction.den === periodFraction.den &&
                fpsFraction.num <= periodFraction.num))
          ) {
            fps = fpsFraction.num / fpsFraction.den;
          } else if (periodFraction) {
            fps = (resolution * periodFraction.den) / periodFraction.num;
          } else {
            return null;
          }
        }
        const finalPeriod = resolution / fps;
        let finalInlierCount = 0;
        for (const gap of gaps) {
          const multiple = Math.max(1, Math.round(gap / finalPeriod));
          if (Math.abs(gap - multiple * finalPeriod) < DELTA_TOLERANCE) {
            finalInlierCount++;
          }
        }
        if (finalInlierCount / gaps.length < MIN_INLIER_RATIO) {
          return null;
        }
        return fps;
      };
      const simplestFractionBetween = (lo, hi, maxDenominator) => {
        for (let den = 1; den <= maxDenominator; den++) {
          const num = Math.floor(lo * den) + 1;
          if (num / den < hi) {
            return (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Yf)({ num, den });
          }
        }
        return null;
      };
      const getBestGuessFrameRate = (frameRate) => {
        const SPECIAL_FRAME_RATES = [
          24 / 1.001,
          30 / 1.001,
          60 / 1.001,
          120 / 1.001,
        ];
        const COMMON_FRAME_RATES = [
          12, 15, 20, 24, 25, 30, 48, 50, 60, 100, 120, 144, 240,
        ];
        const SPECIAL_TOLERANCE = 5e-4;
        const COMMON_TOLERANCE = 0.025;
        for (const candidate of SPECIAL_FRAME_RATES) {
          if (Math.abs(candidate / frameRate - 1) <= SPECIAL_TOLERANCE) {
            return candidate;
          }
        }
        let best = frameRate;
        let bestError = Infinity;
        for (const candidate of COMMON_FRAME_RATES) {
          const error = Math.abs(candidate / frameRate - 1);
          if (error <= COMMON_TOLERANCE && error < bestError) {
            best = candidate;
            bestError = error;
          }
        }
        return best;
      };
    },
    /***/
    6014(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        Ng: () =>
          /* binding */
          ENCRYPTION_KEY_CACHE_GROUP,
        /* harmony export */
        QO: () =>
          /* binding */
          InputDisposedError,
        /* harmony export */
        pd: () =>
          /* binding */
          Input,
        /* harmony export */
      });
      var _input_format_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(4456);
      var _input_track_js__WEBPACK_IMPORTED_MODULE_1__ =
        __webpack_require__(3300);
      var _misc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6760);
      var _reader_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5815);
      var _source_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4117);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.XQ)();
      const DEFAULT_SOURCE_CACHE_GROUP = 1;
      const ENCRYPTION_KEY_CACHE_GROUP = 2;
      class Input extends _misc_js__WEBPACK_IMPORTED_MODULE_2__.bk {
        /** True if the input has been disposed. */
        get disposed() {
          return this._disposed;
        }
        /**
         * Creates a new input file from the specified options. No reading operations will be performed until methods are
         * called on this instance.
         */
        constructor(options) {
          super();
          this._demuxerPromise = null;
          this._format = null;
          this._trackBackingsCache = null;
          this._backingToTrack = /* @__PURE__ */ new Map();
          this._disposed = false;
          this._nextSourceCacheAge = 0;
          this._sourceRefs = [];
          this._sourceCache = [];
          this._sourceCachePromises = [];
          this._onFormatDetermined = null;
          if (!options || typeof options !== "object") {
            throw new TypeError("options must be an object.");
          }
          if (
            !Array.isArray(options.formats) ||
            options.formats.some(
              (x) =>
                !(
                  x instanceof _input_format_js__WEBPACK_IMPORTED_MODULE_0__.CW
                ),
            )
          ) {
            throw new TypeError(
              "options.formats must be an array of InputFormat.",
            );
          }
          if (!(
            options.source instanceof
              _source_js__WEBPACK_IMPORTED_MODULE_4__.kL ||
            options.source instanceof _source_js__WEBPACK_IMPORTED_MODULE_4__.Fy
          )) {
            throw new TypeError(
              "options.source must be a Source or SourceRef.",
            );
          }
          if (
            options.source instanceof
              _source_js__WEBPACK_IMPORTED_MODULE_4__.kL &&
            options.source._disposed
          ) {
            throw new TypeError(
              "options.source must not be a disposed Source.",
            );
          }
          if (
            options.initInput !== void 0 &&
            !(options.initInput instanceof Input)
          ) {
            throw new TypeError(
              "options.initInput, when provided, must be an Input.",
            );
          }
          if (options.formatOptions !== void 0) {
            (0, _input_format_js__WEBPACK_IMPORTED_MODULE_0__.Gu)(
              options.formatOptions,
              "formatOptions",
            );
          }
          this._formats = options.formats;
          this._initInput = options.initInput ?? null;
          this._formatOptions = options.formatOptions ?? {};
          if (
            options.source instanceof _source_js__WEBPACK_IMPORTED_MODULE_4__.kL
          ) {
            this._rootRef = options.source.ref();
          } else {
            this._rootRef = options.source;
          }
          this._sourceRefs.push(this._rootRef);
        }
        /** @internal */
        get _rootSource() {
          return this._rootRef.source;
        }
        /** @internal */
        async _getSourceUncached(request) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
            this._rootSource instanceof
              _source_js__WEBPACK_IMPORTED_MODULE_4__.QI,
          );
          const ref = await this._rootSource._resolveRequest(request);
          this._emit("source", {
            source: ref.source,
            request,
            isRoot: request.isRoot,
          });
          return ref;
        }
        /** @internal */
        _getSourceCached(request, cacheGroup = DEFAULT_SOURCE_CACHE_GROUP) {
          const cachedEntry = this._sourceCache.find(
            (x) =>
              x.cacheGroup === cacheGroup &&
              (0, _source_js__WEBPACK_IMPORTED_MODULE_4__.SM)(
                x.request,
                request,
              ),
          );
          if (cachedEntry) {
            cachedEntry.age++;
            return Promise.resolve(cachedEntry.sourceRef.source.ref());
          }
          const cachedPromiseEntry = this._sourceCachePromises.find(
            (x) =>
              x.cacheGroup === cacheGroup &&
              (0, _source_js__WEBPACK_IMPORTED_MODULE_4__.SM)(
                x.request,
                request,
              ),
          );
          if (cachedPromiseEntry) {
            return cachedPromiseEntry.promise.then((x) =>
              x.sourceRef.source.ref(),
            );
          }
          const promise = (async () => {
            const sourceRef = await this._getSourceUncached(request);
            const MAX_SOURCE_CACHE_SIZE = 4;
            const count = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.v$)(
              this._sourceCache,
              (x) =>
                x.cacheGroup === cacheGroup &&
                x.sourceRef.source._refCount === 1,
            );
            if (count >= MAX_SOURCE_CACHE_SIZE) {
              const minAgeIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Yg)(
                this._sourceCache,
                (x) =>
                  x.cacheGroup === cacheGroup &&
                  x.sourceRef.source._refCount === 1
                    ? x.age
                    : Infinity,
              );
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(minAgeIndex !== -1);
              const entry = this._sourceCache[minAgeIndex];
              this._sourceCache.splice(minAgeIndex, 1);
              entry.sourceRef.free();
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Ai)(
                this._sourceRefs,
                entry.sourceRef,
              );
            }
            this._sourceRefs.push(sourceRef);
            const promiseIndex = this._sourceCachePromises.findIndex(
              (x) => x.request === request,
            );
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(promiseIndex !== -1);
            this._sourceCachePromises.splice(promiseIndex, 1);
            const cacheEntry = {
              request,
              sourceRef,
              age: this._nextSourceCacheAge++,
              cacheGroup,
            };
            return cacheEntry;
          })();
          this._sourceCachePromises.push({
            request,
            cacheGroup,
            promise,
          });
          return promise.then((entry) => {
            const ref = entry.sourceRef.source.ref();
            this._sourceCache.push(entry);
            return ref;
          });
        }
        /** @internal */
        _getDemuxer() {
          return (this._demuxerPromise ??= (async () => {
            this._reader = new _reader_js__WEBPACK_IMPORTED_MODULE_3__.mP(
              this._rootSource,
            );
            this._emit("source", {
              source: this._rootSource,
              request: null,
              isRoot: true,
            });
            for (const format of this._formats) {
              const canRead = await format._canReadInput(this);
              if (canRead) {
                this._format = format;
                this._onFormatDetermined?.(format);
                return format._createDemuxer(this);
              }
            }
            throw new UnsupportedInputFormatError();
          })());
        }
        /**
         * Returns the source from which this input file reads data for the root path.
         */
        get source() {
          return this._rootSource;
        }
        /**
         * Returns the format of the input file. You can compare this result directly to the {@link InputFormat} singletons
         * or use `instanceof` checks for subset-aware logic (for example, `format instanceof MatroskaInputFormat` is true
         * for both MKV and WebM).
         */
        async getFormat() {
          await this._getDemuxer();
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(this._format);
          return this._format;
        }
        /** Returns `true` if the format of the input file is known and the file can be read, `false` otherwise. */
        async canRead() {
          try {
            await this._getDemuxer();
            return true;
          } catch (error) {
            if (error instanceof UnsupportedInputFormatError) {
              return false;
            }
            throw error;
          }
        }
        /**
         * Returns the timestamp at which the input file starts. More precisely, returns the smallest starting timestamp
         * among all tracks.
         *
         * Optionally, you can pass in the list of tracks for which you want to compute the starting timestamp.
         *
         * Note that this method is potentially expensive for inputs with many tracks (such as HLS manifests), since it
         * probes every track.
         */
        async getFirstTimestamp(tracks) {
          tracks ??= await this.getTracks();
          const filtered = tracks.filter((x) => x !== null);
          if (filtered.length === 0) {
            return 0;
          }
          const firstPackets = await Promise.all(
            filtered.map((x) =>
              x._backing.getFirstPacket({ metadataOnly: true }),
            ),
          );
          const result = Math.min(
            ...firstPackets.map((x) => x?.timestamp ?? Infinity),
          );
          return result === Infinity ? 0 : result;
        }
        /**
         * Computes the duration of the input file, in seconds. More precisely, returns the largest end timestamp among
         * all tracks.
         *
         * Optionally, you can pass in the list of tracks for which you want to compute the duration.
         *
         * This method can be potentially expensive depending on the underlying file format, because it returns the most
         * accurate duration possible and must check all tracks. Use {@link Input.getDurationFromMetadata} for a faster but
         * less accurate estimate of duration.
         *
         * By default, when any track in the underlying media is live, this method will only resolve once the live stream
         * ends. If you want to query the current duration of the media, set {@link PacketRetrievalOptions.skipLiveWait}
         * to `true` in the options.
         */
        async computeDuration(tracks, options) {
          tracks ??= await this.getTracks();
          const filtered = tracks.filter((x) => x !== null);
          if (filtered.length === 0) {
            return 0;
          }
          const tracksDurations = await Promise.all(
            filtered.map((x) => x.computeDuration(options)),
          );
          return Math.max(...tracksDurations);
        }
        /**
         * Gets the duration (end timestamp) in seconds of the input file from metadata stored in the file. This value may
         * be approximate or diverge from the actual, precise duration returned by `.computeDuration()`, but compared to
         * that method, this method is cheaper. When the duration cannot be determined from the file metadata, `null`
         * is returned.
         *
         * Optionally, you can pass in the list of tracks for which you want to get the duration from metadata.
         *
         * By default, when the underlying media is live, this method will only resolve once the live stream
         * ends. If you want to query the current duration of the media, set
         * {@link DurationMetadataRequestOptions.skipLiveWait} to `true` in the options.
         */
        async getDurationFromMetadata(tracks, options) {
          tracks ??= await this.getTracks();
          const filtered = tracks.filter((x) => x !== null);
          const tracksDurations = await Promise.all(
            filtered.map((x) => x.getDurationFromMetadata(options)),
          );
          const nonNullDurations = tracksDurations.filter((x) => x !== null);
          if (nonNullDurations.length === 0) {
            return null;
          }
          return Math.max(...nonNullDurations);
        }
        /**
         * Returns the list of all tracks of this input file in the order in which they appear in the file. An optional
         * query can be provided.
         */
        async getTracks(query) {
          query &&= (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.vo)(query);
          const backings = await this._getTrackBackings();
          const tracks = backings.map((backing) =>
            this._wrapBackingAsTrack(backing),
          );
          return (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.NY)(
            tracks,
            query,
          );
        }
        /** Returns the list of all video tracks of this input file. An optional query can be provided. */
        async getVideoTracks(query) {
          query &&= (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.vo)(query);
          const tracks = await this.getTracks();
          const videoTracks = tracks.filter((x) => x.isVideoTrack());
          return (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.NY)(
            videoTracks,
            query,
          );
        }
        /** Returns the list of all audio tracks of this input file. An optional query can be provided. */
        async getAudioTracks(query) {
          query &&= (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.vo)(query);
          const tracks = await this.getTracks();
          const audioTracks = tracks.filter((x) => x.isAudioTrack());
          return (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.NY)(
            audioTracks,
            query,
          );
        }
        /**
         * Returns the primary video track of this input file, or null if there are no video tracks.
         *
         * Multiple factors determine which track is considered primary, including its position in the file, disposition,
         * bitrate (higher bitrate is preferred), and if it can be paired with an audio track.
         */
        async getPrimaryVideoTrack(query) {
          query &&= (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.vo)(query);
          const merged = (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.Uj)(
            query,
            {
              sortBy: async (t) => [
                (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.D8)(
                  (await t.getDisposition()).default,
                ),
                (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.D8)(
                  await t.hasPairableAudioTrack(),
                ),
                (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.D8)(
                  !(await t.hasOnlyKeyPackets()),
                ),
                (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.i8)(
                  await t.getBitrate(),
                ),
              ],
            },
          );
          const sorted = await this.getVideoTracks(merged);
          return sorted[0] ?? null;
        }
        /**
         * Returns the primary audio track of this input file, or null if there are no audio tracks.
         *
         * Multiple factors determine which track is considered primary, including its position in the file, disposition,
         * bitrate (higher bitrate is preferred), and if it can be paired with the primary video track.
         */
        async getPrimaryAudioTrack(query) {
          query &&= (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.vo)(query);
          const primaryVideoTrack = await this.getPrimaryVideoTrack();
          const merged = (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.Uj)(
            query,
            {
              sortBy: async (t) => [
                (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.D8)(
                  !primaryVideoTrack || t.canBePairedWith(primaryVideoTrack),
                ),
                (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.D8)(
                  (await t.getDisposition()).default,
                ),
                (0, _input_track_js__WEBPACK_IMPORTED_MODULE_1__.i8)(
                  await t.getBitrate(),
                ),
              ],
            },
          );
          const sorted = await this.getAudioTracks(merged);
          return sorted[0] ?? null;
        }
        /** @internal */
        async _getTrackBackings() {
          const demuxer = await this._getDemuxer();
          return (this._trackBackingsCache ??=
            await demuxer.getTrackBackings());
        }
        /** @internal */
        _wrapBackingAsTrack(backing) {
          const existing = this._backingToTrack.get(backing);
          if (existing) {
            return existing;
          }
          const type = backing.getType();
          const track =
            type === "video"
              ? new _input_track_js__WEBPACK_IMPORTED_MODULE_1__.N0(
                  this,
                  backing,
                )
              : new _input_track_js__WEBPACK_IMPORTED_MODULE_1__.Yi(
                  this,
                  backing,
                );
          this._backingToTrack.set(backing, track);
          return track;
        }
        /** Returns the full MIME type of this input file, including track codecs. */
        async getMimeType() {
          const demuxer = await this._getDemuxer();
          return demuxer.getMimeType();
        }
        /**
         * Returns descriptive metadata tags about the media file, such as title, author, date, cover art, or other
         * attached files.
         */
        async getMetadataTags() {
          const demuxer = await this._getDemuxer();
          return demuxer.getMetadataTags();
        }
        /**
         * Disposes this input and frees connected resources. When an input is disposed, ongoing read operations will be
         * canceled, all future read operations will fail, any open decoders will be closed, and all ongoing media sink
         * operations will be canceled. Disallowed and canceled operations will throw an {@link InputDisposedError}.
         *
         * You are expected not to use an input after disposing it. While some operations may still work, it is not
         * specified and may change in any future update.
         */
        dispose() {
          if (this._disposed) {
            return;
          }
          this._disposed = true;
          for (const ref of this._sourceRefs) {
            ref.free();
          }
          this._sourceRefs.length = 0;
          if (this._demuxerPromise) {
            void this._demuxerPromise
              .then((demuxer) => demuxer.dispose())
              .catch(() => {});
          }
        }
        /**
         * Calls `.dispose()` on the input, implementing the `Disposable` interface for use with
         * JavaScript Explicit Resource Management features.
         */
        [Symbol.dispose]() {
          this.dispose();
        }
      }
      class UnsupportedInputFormatError extends Error {
        /** Creates a new {@link UnsupportedInputFormatError}. */
        constructor(
          message = "Input has an unsupported or unrecognizable format.",
        ) {
          super(message);
          this.name = "UnsupportedInputFormatError";
        }
      }
      class InputDisposedError extends Error {
        /** Creates a new {@link InputDisposedError}. */
        constructor(message = "Input has been disposed.") {
          super(message);
          this.name = "InputDisposedError";
        }
      }
    },
    /***/
    9644(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        T: () =>
          /* binding */
          IsobmffDemuxer,
        /* harmony export */
      });
      var _shared_aac_misc_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(4691);
      var _codec_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8276);
      var _codec_data_js__WEBPACK_IMPORTED_MODULE_2__ =
        __webpack_require__(9705);
      var _demuxer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2114);
      var _misc_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6760);
      var _packet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6016);
      var _isobmff_misc_js__WEBPACK_IMPORTED_MODULE_6__ =
        __webpack_require__(2997);
      var _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__ =
        __webpack_require__(8689);
      var _reader_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5815);
      var _metadata_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(8957);
      var _shared_ac3_misc_js__WEBPACK_IMPORTED_MODULE_10__ =
        __webpack_require__(9745);
      var _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_11__ =
        __webpack_require__(3486);
      var _aes_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(5277);
      var _logging_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(9815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class IsobmffDemuxer extends _demuxer_js__WEBPACK_IMPORTED_MODULE_3__.B {
        constructor(input) {
          super(input);
          this.moovSlice = null;
          this.currentTrack = null;
          this.tracks = [];
          this.metadataPromise = null;
          this.movieTimescale = -1;
          this.movieDurationInTimescale = -1;
          this.isQuickTime = false;
          this.metadataTags = {};
          this.currentMetadataKeys = null;
          this.isFragmented = false;
          this.fragmentTrackDefaults = [];
          this.psshBoxes = [];
          this.currentFragment = null;
          this.lastReadFragment = null;
          this.decryptionKeyCache = /* @__PURE__ */ new Map();
          this.reader = input._reader;
        }
        async getTrackBackings() {
          await this.readMetadata();
          return this.tracks.map((track) => track.trackBacking);
        }
        async getMimeType() {
          await this.readMetadata();
          const backings = await this.getTrackBackings();
          const codecStrings = await Promise.all(
            backings.map((x) =>
              x.getDecoderConfig().then((c) => c?.codec ?? null),
            ),
          );
          return (0, _isobmff_misc_js__WEBPACK_IMPORTED_MODULE_6__.Xh)({
            isQuickTime: this.isQuickTime,
            hasVideo: this.tracks.some((x) => x.info?.type === "video"),
            hasAudio: this.tracks.some((x) => x.info?.type === "audio"),
            codecStrings: codecStrings.filter(Boolean),
          });
        }
        async getMetadataTags() {
          await this.readMetadata();
          return this.metadataTags;
        }
        readMetadata() {
          return (this.metadataPromise ??= (async () => {
            let currentPos = 0;
            let lookForMfraBox = false;
            let foundMovieBoxes = false;
            while (true) {
              let slice = this.reader.requestSliceRange(
                currentPos,
                _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.ZM,
                _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Xk,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(slice))
                slice = await slice;
              if (!slice) break;
              const startPos = currentPos;
              const boxInfo = (0,
              _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Vl)(slice);
              if (!boxInfo) {
                break;
              }
              if (boxInfo.name === "ftyp" || boxInfo.name === "styp") {
                const majorBrand = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.IT)(slice, 4);
                this.isQuickTime = majorBrand === "qt  ";
              } else if (boxInfo.name === "moov") {
                let moovSlice = this.reader.requestSlice(
                  slice.filePos,
                  boxInfo.contentSize,
                );
                if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(moovSlice))
                  moovSlice = await moovSlice;
                if (!moovSlice) break;
                this.moovSlice = moovSlice;
                this.readContiguousBoxes(this.moovSlice);
                for (const track of this.tracks) {
                  const previousSegmentDurationsInSeconds =
                    track.editListPreviousSegmentDurations /
                    this.movieTimescale;
                  track.editListOffset -= Math.round(
                    previousSegmentDurationsInSeconds * track.timescale,
                  );
                }
                lookForMfraBox =
                  this.isFragmented &&
                  this.reader.fileSize !== null &&
                  this.reader.fileSize > startPos + boxInfo.totalSize;
                foundMovieBoxes = true;
                break;
              } else if (boxInfo.name === "moof") {
                if (!this.input._initInput) {
                  throw new Error(
                    '"moof" box encountered with no "moov" box present; this file is likely a Segment as described in ISO/IEC 14496-12 Section 8.16. A separate init file that contains a "moov" box is required to read this file, please provide it using InputOptions.initInput.',
                  );
                }
                await this.copyMetadataFromInitInput(this.input._initInput);
                lookForMfraBox = false;
                foundMovieBoxes = true;
                break;
              }
              currentPos = startPos + boxInfo.totalSize;
            }
            if (!foundMovieBoxes && this.input._initInput) {
              await this.copyMetadataFromInitInput(this.input._initInput);
            }
            if (lookForMfraBox) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                this.reader.fileSize !== null,
              );
              let lastWordSlice = this.reader.requestSlice(
                this.reader.fileSize - 4,
                4,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(lastWordSlice))
                lastWordSlice = await lastWordSlice;
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(lastWordSlice);
              const lastWord = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                lastWordSlice,
              );
              const potentialMfraPos = this.reader.fileSize - lastWord;
              if (
                potentialMfraPos >= 0 &&
                potentialMfraPos <=
                  this.reader.fileSize -
                    _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Xk
              ) {
                let mfraHeaderSlice = this.reader.requestSliceRange(
                  potentialMfraPos,
                  _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.ZM,
                  _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Xk,
                );
                if (
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(mfraHeaderSlice)
                )
                  mfraHeaderSlice = await mfraHeaderSlice;
                if (mfraHeaderSlice) {
                  const boxInfo = (0,
                  _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Vl)(
                    mfraHeaderSlice,
                  );
                  if (boxInfo && boxInfo.name === "mfra") {
                    let mfraSlice = this.reader.requestSlice(
                      mfraHeaderSlice.filePos,
                      boxInfo.contentSize,
                    );
                    if (
                      (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(mfraSlice)
                    )
                      mfraSlice = await mfraSlice;
                    if (mfraSlice) {
                      this.readContiguousBoxes(mfraSlice);
                    }
                  }
                }
              }
            }
          })());
        }
        async copyMetadataFromInitInput(initInput) {
          const initDemuxer = await initInput._getDemuxer();
          if (initDemuxer.constructor !== IsobmffDemuxer) {
            throw new Error("Init input must match the input's format.");
          }
          await initDemuxer.readMetadata();
          this.movieTimescale = initDemuxer.movieTimescale;
          this.movieDurationInTimescale = initDemuxer.movieDurationInTimescale;
          this.metadataTags = initDemuxer.metadataTags;
          this.isFragmented = true;
          this.fragmentTrackDefaults = initDemuxer.fragmentTrackDefaults;
          this.psshBoxes = initDemuxer.psshBoxes;
          for (const foreignTrack of initDemuxer.tracks) {
            const track = {
              id: foreignTrack.id,
              demuxer: this,
              trackBacking: null,
              disposition: foreignTrack.disposition,
              timescale: foreignTrack.timescale,
              durationInMediaTimescale: foreignTrack.durationInMediaTimescale,
              durationInMovieTimescale: foreignTrack.durationInMovieTimescale,
              rotation: foreignTrack.rotation,
              internalCodecId: foreignTrack.internalCodecId,
              name: foreignTrack.name,
              languageCode: foreignTrack.languageCode,
              sampleTableByteOffset: null,
              sampleTable: null,
              fragmentLookupTable: [],
              currentFragmentState: null,
              fragmentPositionCache: [],
              editListPreviousSegmentDurations:
                foreignTrack.editListPreviousSegmentDurations,
              editListOffset: foreignTrack.editListOffset,
              encryptionInfo: foreignTrack.encryptionInfo,
              encryptionAuxInfo: null,
              frmaCodecString: null,
              info: foreignTrack.info,
            };
            if (foreignTrack.trackBacking) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(track.info);
              if (track.info.type === "video" && track.info.width !== -1) {
                const videoTrack = track;
                track.trackBacking = new IsobmffVideoTrackBacking(videoTrack);
                this.tracks.push(track);
              } else if (
                track.info.type === "audio" &&
                track.info.numberOfChannels !== -1
              ) {
                const audioTrack = track;
                track.trackBacking = new IsobmffAudioTrackBacking(audioTrack);
                this.tracks.push(track);
              }
            } else {
            }
          }
        }
        getSampleTableForTrack(internalTrack) {
          if (internalTrack.sampleTable) {
            return internalTrack.sampleTable;
          }
          const sampleTable = {
            sampleTimingEntries: [],
            sampleCompositionTimeOffsets: [],
            sampleSizes: [],
            keySampleIndices: null,
            chunkOffsets: [],
            sampleToChunk: [],
            presentationTimestamps: null,
            presentationTimestampIndexMap: null,
          };
          internalTrack.sampleTable = sampleTable;
          if (internalTrack.sampleTableByteOffset === null) {
            return sampleTable;
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(this.moovSlice);
          const stblContainerSlice = this.moovSlice.slice(
            internalTrack.sampleTableByteOffset,
          );
          this.currentTrack = internalTrack;
          this.traverseBox(stblContainerSlice);
          this.currentTrack = null;
          const isPcmCodec =
            internalTrack.info?.type === "audio" &&
            internalTrack.info.codec &&
            _codec_js__WEBPACK_IMPORTED_MODULE_1__.Wq.includes(
              internalTrack.info.codec,
            );
          if (
            isPcmCodec &&
            sampleTable.sampleCompositionTimeOffsets.length === 0
          ) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
              internalTrack.info?.type === "audio",
            );
            const pcmInfo = (0, _codec_js__WEBPACK_IMPORTED_MODULE_1__.Ei)(
              internalTrack.info.codec,
            );
            const newSampleTimingEntries = [];
            const newSampleSizes = [];
            for (let i = 0; i < sampleTable.sampleToChunk.length; i++) {
              const chunkEntry = sampleTable.sampleToChunk[i];
              const nextEntry = sampleTable.sampleToChunk[i + 1];
              const chunkCount =
                (nextEntry
                  ? nextEntry.startChunkIndex
                  : sampleTable.chunkOffsets.length) -
                chunkEntry.startChunkIndex;
              for (let j = 0; j < chunkCount; j++) {
                const startSampleIndex =
                  chunkEntry.startSampleIndex + j * chunkEntry.samplesPerChunk;
                const endSampleIndex =
                  startSampleIndex + chunkEntry.samplesPerChunk;
                const startTimingEntryIndex = (0,
                _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
                  sampleTable.sampleTimingEntries,
                  startSampleIndex,
                  (x) => x.startIndex,
                );
                const startTimingEntry =
                  sampleTable.sampleTimingEntries[startTimingEntryIndex];
                const endTimingEntryIndex = (0,
                _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
                  sampleTable.sampleTimingEntries,
                  endSampleIndex,
                  (x) => x.startIndex,
                );
                const endTimingEntry =
                  sampleTable.sampleTimingEntries[endTimingEntryIndex];
                const firstSampleTimestamp =
                  startTimingEntry.startDecodeTimestamp +
                  (startSampleIndex - startTimingEntry.startIndex) *
                    startTimingEntry.delta;
                const lastSampleTimestamp =
                  endTimingEntry.startDecodeTimestamp +
                  (endSampleIndex - endTimingEntry.startIndex) *
                    endTimingEntry.delta;
                const delta = lastSampleTimestamp - firstSampleTimestamp;
                const lastSampleTimingEntry = (0,
                _misc_js__WEBPACK_IMPORTED_MODULE_4__._g)(
                  newSampleTimingEntries,
                );
                if (
                  lastSampleTimingEntry &&
                  lastSampleTimingEntry.delta === delta
                ) {
                  lastSampleTimingEntry.count++;
                } else {
                  newSampleTimingEntries.push({
                    startIndex: chunkEntry.startChunkIndex + j,
                    startDecodeTimestamp: firstSampleTimestamp,
                    count: 1,
                    delta,
                  });
                }
                const chunkSize =
                  chunkEntry.samplesPerChunk *
                  pcmInfo.sampleSize *
                  internalTrack.info.numberOfChannels;
                newSampleSizes.push(chunkSize);
              }
              chunkEntry.startSampleIndex = chunkEntry.startChunkIndex;
              chunkEntry.samplesPerChunk = 1;
            }
            sampleTable.sampleTimingEntries = newSampleTimingEntries;
            sampleTable.sampleSizes = newSampleSizes;
          }
          if (sampleTable.sampleCompositionTimeOffsets.length > 0) {
            sampleTable.presentationTimestamps = [];
            for (const entry of sampleTable.sampleTimingEntries) {
              for (let i = 0; i < entry.count; i++) {
                sampleTable.presentationTimestamps.push({
                  presentationTimestamp:
                    entry.startDecodeTimestamp + i * entry.delta,
                  sampleIndex: entry.startIndex + i,
                });
              }
            }
            for (const entry of sampleTable.sampleCompositionTimeOffsets) {
              for (let i = 0; i < entry.count; i++) {
                const sampleIndex = entry.startIndex + i;
                const sample = sampleTable.presentationTimestamps[sampleIndex];
                if (!sample) {
                  continue;
                }
                sample.presentationTimestamp += entry.offset;
              }
            }
            sampleTable.presentationTimestamps.sort(
              (a, b) => a.presentationTimestamp - b.presentationTimestamp,
            );
            sampleTable.presentationTimestampIndexMap = Array(
              sampleTable.presentationTimestamps.length,
            ).fill(-1);
            for (
              let i = 0;
              i < sampleTable.presentationTimestamps.length;
              i++
            ) {
              sampleTable.presentationTimestampIndexMap[
                sampleTable.presentationTimestamps[i].sampleIndex
              ] = i;
            }
          } else {
          }
          return sampleTable;
        }
        async readFragment(startPos) {
          if (this.lastReadFragment?.moofOffset === startPos) {
            return this.lastReadFragment;
          }
          let headerSlice = this.reader.requestSliceRange(
            startPos,
            _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.ZM,
            _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Xk,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(headerSlice))
            headerSlice = await headerSlice;
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(headerSlice);
          const moofBoxInfo = (0,
          _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Vl)(headerSlice);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            moofBoxInfo?.name === "moof",
          );
          let entireSlice = this.reader.requestSlice(
            startPos,
            moofBoxInfo.totalSize,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(entireSlice))
            entireSlice = await entireSlice;
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(entireSlice);
          this.traverseBox(entireSlice);
          const fragment = this.lastReadFragment;
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            fragment && fragment.moofOffset === startPos,
          );
          for (const [, trackData] of fragment.trackData) {
            const track = trackData.track;
            const { fragmentPositionCache } = track;
            if (!trackData.startTimestampIsFinal) {
              const lookupEntry = track.fragmentLookupTable.find(
                (x) => x.moofOffset === fragment.moofOffset,
              );
              if (lookupEntry) {
                offsetFragmentTrackDataByTimestamp(
                  trackData,
                  lookupEntry.timestamp,
                );
              } else {
                const lastCacheIndex = (0,
                _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
                  fragmentPositionCache,
                  fragment.moofOffset - 1,
                  (x) => x.moofOffset,
                );
                if (lastCacheIndex !== -1) {
                  const lastCache = fragmentPositionCache[lastCacheIndex];
                  offsetFragmentTrackDataByTimestamp(
                    trackData,
                    lastCache.endTimestamp,
                  );
                } else {
                }
              }
              trackData.startTimestampIsFinal = true;
            }
            const insertionIndex = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
              fragmentPositionCache,
              trackData.startTimestamp,
              (x) => x.startTimestamp,
            );
            if (
              insertionIndex === -1 ||
              fragmentPositionCache[insertionIndex].moofOffset !==
                fragment.moofOffset
            ) {
              fragmentPositionCache.splice(insertionIndex + 1, 0, {
                moofOffset: fragment.moofOffset,
                startTimestamp: trackData.startTimestamp,
                endTimestamp: trackData.endTimestamp,
              });
            }
            if (trackData.encryptionAuxInfo && track.encryptionInfo) {
              const entries = await resolveEncryptionAuxInfo(
                this.reader,
                track.encryptionInfo,
                trackData.encryptionAuxInfo,
              );
              for (
                let i = 0;
                i < Math.min(trackData.samples.length, entries.length);
                i++
              ) {
                const entry = entries[i];
                trackData.samples[i].encryption = entry;
              }
            }
          }
          return fragment;
        }
        readContiguousBoxes(slice) {
          const startIndex = slice.filePos;
          while (
            slice.filePos - startIndex <=
            slice.length - _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.ZM
          ) {
            const foundBox = this.traverseBox(slice);
            if (!foundBox) {
              break;
            }
          }
        }
        // eslint-disable-next-line @stylistic/generator-star-spacing
        *iterateContiguousBoxes(slice) {
          const startIndex = slice.filePos;
          while (
            slice.filePos - startIndex <=
            slice.length - _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.ZM
          ) {
            const startPos = slice.filePos;
            const boxInfo = (0,
            _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Vl)(slice);
            if (!boxInfo) {
              break;
            }
            yield { boxInfo, slice };
            slice.filePos = startPos + boxInfo.totalSize;
          }
        }
        traverseBox(slice) {
          const startPos = slice.filePos;
          const boxInfo = (0,
          _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Vl)(slice);
          if (!boxInfo) {
            return false;
          }
          const contentStartPos = slice.filePos;
          const boxEndPos = startPos + boxInfo.totalSize;
          switch (boxInfo.name) {
            case "mdia":
            case "minf":
            case "dinf":
            case "mfra":
            case "edts":
            case "sinf":
            case "schi":
              {
                this.readContiguousBoxes(
                  slice.slice(contentStartPos, boxInfo.contentSize),
                );
              }
              break;
            case "mvhd":
              {
                const version = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                slice.skip(3);
                if (version === 1) {
                  slice.skip(8 + 8);
                  this.movieTimescale = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  this.movieDurationInTimescale = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.th)(slice);
                } else {
                  slice.skip(4 + 4);
                  this.movieTimescale = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  this.movieDurationInTimescale = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                }
              }
              break;
            case "trak":
              {
                const track = {
                  id: -1,
                  demuxer: this,
                  trackBacking: null,
                  disposition: {
                    ..._metadata_js__WEBPACK_IMPORTED_MODULE_9__.gM,
                    primary: false,
                  },
                  info: null,
                  timescale: -1,
                  durationInMovieTimescale: -1,
                  durationInMediaTimescale: -1,
                  rotation: 0,
                  internalCodecId: null,
                  name: null,
                  languageCode: _misc_js__WEBPACK_IMPORTED_MODULE_4__.IR,
                  sampleTableByteOffset: -1,
                  sampleTable: null,
                  fragmentLookupTable: [],
                  currentFragmentState: null,
                  fragmentPositionCache: [],
                  editListPreviousSegmentDurations: 0,
                  editListOffset: 0,
                  encryptionInfo: null,
                  encryptionAuxInfo: null,
                  frmaCodecString: null,
                };
                this.currentTrack = track;
                this.readContiguousBoxes(
                  slice.slice(contentStartPos, boxInfo.contentSize),
                );
                if (
                  track.id !== -1 &&
                  track.timescale !== -1 &&
                  track.info !== null
                ) {
                  if (track.info.type === "video" && track.info.width !== -1) {
                    const videoTrack = track;
                    track.trackBacking = new IsobmffVideoTrackBacking(
                      videoTrack,
                    );
                    this.tracks.push(track);
                  } else if (
                    track.info.type === "audio" &&
                    track.info.numberOfChannels !== -1
                  ) {
                    const audioTrack = track;
                    track.trackBacking = new IsobmffAudioTrackBacking(
                      audioTrack,
                    );
                    this.tracks.push(track);
                  }
                }
                this.currentTrack = null;
              }
              break;
            case "tkhd":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                const version = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                const flags = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.n2)(
                  slice,
                );
                const trackEnabled = !!(flags & 1);
                track.disposition.default = trackEnabled;
                if (version === 0) {
                  slice.skip(8);
                  track.id = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                    slice,
                  );
                  slice.skip(4);
                  track.durationInMovieTimescale = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                } else if (version === 1) {
                  slice.skip(16);
                  track.id = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                    slice,
                  );
                  slice.skip(4);
                  track.durationInMovieTimescale = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.th)(slice);
                } else {
                  throw new Error(
                    "Incorrect track header version ".concat(version, "."),
                  );
                }
                slice.skip(2 * 4 + 2 + 2 + 2 + 2);
                const matrix = [
                  (0, _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.vX)(
                    slice,
                  ),
                  (0, _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.vX)(
                    slice,
                  ),
                  (0, _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.IS)(
                    slice,
                  ),
                  (0, _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.vX)(
                    slice,
                  ),
                  (0, _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.vX)(
                    slice,
                  ),
                  (0, _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.IS)(
                    slice,
                  ),
                  (0, _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.vX)(
                    slice,
                  ),
                  (0, _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.vX)(
                    slice,
                  ),
                  (0, _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.IS)(
                    slice,
                  ),
                ];
                const rotation = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.qT)(
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__["in"])(
                    extractRotationFromMatrix(matrix),
                    90,
                  ),
                );
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  rotation === 0 ||
                    rotation === 90 ||
                    rotation === 180 ||
                    rotation === 270,
                );
                track.rotation = rotation;
              }
              break;
            case "elst":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                const version = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                slice.skip(3);
                let relevantEntryFound = false;
                let previousSegmentDurations = 0;
                const entryCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                for (let i = 0; i < entryCount; i++) {
                  const segmentDuration =
                    version === 1
                      ? (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.th)(slice)
                      : (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  const mediaTime =
                    version === 1
                      ? (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.B5)(slice)
                      : (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.Ar)(slice);
                  const mediaRate = (0,
                  _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.vX)(slice);
                  if (segmentDuration === 0) {
                    continue;
                  }
                  if (relevantEntryFound) {
                    _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                      "Unsupported edit list: multiple edits are not currently supported. Only using first edit.",
                    );
                    break;
                  }
                  if (mediaTime === -1) {
                    previousSegmentDurations += segmentDuration;
                    continue;
                  }
                  if (mediaRate !== 1) {
                    _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                      "Unsupported edit list entry: media rate must be 1.",
                    );
                    break;
                  }
                  track.editListPreviousSegmentDurations =
                    previousSegmentDurations;
                  track.editListOffset = mediaTime;
                  relevantEntryFound = true;
                }
              }
              break;
            case "mdhd":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                const version = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                slice.skip(3);
                if (version === 0) {
                  slice.skip(8);
                  track.timescale = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  track.durationInMediaTimescale = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                } else if (version === 1) {
                  slice.skip(16);
                  track.timescale = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  track.durationInMediaTimescale = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.th)(slice);
                }
                let language = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(
                  slice,
                );
                if (language > 0) {
                  track.languageCode = "";
                  for (let i = 0; i < 3; i++) {
                    track.languageCode =
                      String.fromCharCode(96 + (language & 31)) +
                      track.languageCode;
                    language >>= 5;
                  }
                  if (
                    !(0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Nu)(
                      track.languageCode,
                    )
                  ) {
                    track.languageCode =
                      _misc_js__WEBPACK_IMPORTED_MODULE_4__.IR;
                  }
                }
              }
              break;
            case "hdlr":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                slice.skip(8);
                const handlerType = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.IT)(slice, 4);
                if (handlerType === "vide") {
                  track.info = {
                    type: "video",
                    width: -1,
                    height: -1,
                    squarePixelWidth: -1,
                    squarePixelHeight: -1,
                    codec: null,
                    codecDescription: null,
                    colorSpace: { ..._misc_js__WEBPACK_IMPORTED_MODULE_4__.jW },
                    avcType: null,
                    avcCodecInfo: null,
                    hevcCodecInfo: null,
                    vp9CodecInfo: null,
                    av1CodecInfo: null,
                    proresCodecInfo: null,
                    proresFormat: null,
                  };
                } else if (handlerType === "soun") {
                  track.info = {
                    type: "audio",
                    numberOfChannels: -1,
                    sampleRate: -1,
                    codec: null,
                    codecDescription: null,
                    aacCodecInfo: null,
                    dtsFormat: null,
                    pcmLittleEndian: false,
                    pcmSampleSize: null,
                  };
                }
              }
              break;
            case "stbl":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                track.sampleTableByteOffset = startPos;
                this.readContiguousBoxes(
                  slice.slice(contentStartPos, boxInfo.contentSize),
                );
              }
              break;
            case "stsd":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                if (track.info === null || track.sampleTable) {
                  break;
                }
                const stsdVersion = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                slice.skip(3);
                const entries = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                  slice,
                );
                for (let i = 0; i < entries; i++) {
                  const sampleBoxStartPos = slice.filePos;
                  const sampleBoxInfo = (0,
                  _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Vl)(slice);
                  if (!sampleBoxInfo) {
                    break;
                  }
                  track.internalCodecId = sampleBoxInfo.name;
                  const lowercaseBoxName = sampleBoxInfo.name.toLowerCase();
                  if (track.info.type === "video") {
                    slice.skip(6 * 1 + 2 + 2 + 2 + 3 * 4);
                    track.info.width = (0,
                    _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice);
                    track.info.height = (0,
                    _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice);
                    track.info.squarePixelWidth = track.info.width;
                    track.info.squarePixelHeight = track.info.height;
                    slice.skip(4 + 4 + 4 + 2 + 32 + 2 + 2);
                    track.frmaCodecString = null;
                    this.readContiguousBoxes(
                      slice.slice(
                        slice.filePos,
                        sampleBoxStartPos +
                          sampleBoxInfo.totalSize -
                          slice.filePos,
                      ),
                    );
                    const codecName =
                      lowercaseBoxName === "encv"
                        ? track.frmaCodecString
                        : lowercaseBoxName;
                    track.frmaCodecString = null;
                    if (codecName === "avc1" || codecName === "avc3") {
                      track.info.codec = "avc";
                      track.info.avcType = codecName === "avc1" ? 1 : 3;
                    } else if (codecName === "hvc1" || codecName === "hev1") {
                      track.info.codec = "hevc";
                    } else if (codecName === "vp08") {
                      track.info.codec = "vp8";
                    } else if (codecName === "vp09") {
                      track.info.codec = "vp9";
                    } else if (codecName === "av01") {
                      track.info.codec = "av1";
                    } else if (
                      _codec_js__WEBPACK_IMPORTED_MODULE_1__.Y2.includes(
                        lowercaseBoxName,
                      )
                    ) {
                      track.info.codec = "prores";
                      track.info.proresFormat = lowercaseBoxName;
                    } else if (codecName === null) {
                      _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                        "Unknown encrypted video codec due to missing frma box.",
                      );
                    } else {
                      _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                        "Unsupported video codec (sample entry type '".concat(
                          sampleBoxInfo.name,
                          "').",
                        ),
                      );
                    }
                  } else {
                    slice.skip(6 * 1 + 2);
                    const version = (0,
                    _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice);
                    slice.skip(3 * 2);
                    let channelCount = (0,
                    _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice);
                    let sampleSize = (0,
                    _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice);
                    slice.skip(2 * 2);
                    let sampleRate =
                      (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice) /
                      65536;
                    let lpcmFlags = null;
                    if (stsdVersion === 0 && version > 0) {
                      if (version === 1) {
                        slice.skip(4);
                        sampleSize =
                          8 *
                          (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                            slice,
                          );
                        slice.skip(2 * 4);
                      } else if (version === 2) {
                        slice.skip(4);
                        sampleRate = (0,
                        _reader_js__WEBPACK_IMPORTED_MODULE_8__._3)(slice);
                        channelCount = (0,
                        _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                        slice.skip(4);
                        sampleSize = (0,
                        _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                        lpcmFlags = (0,
                        _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                        slice.skip(2 * 4);
                      }
                    }
                    track.info.numberOfChannels = channelCount;
                    track.info.sampleRate = sampleRate;
                    track.frmaCodecString = null;
                    this.readContiguousBoxes(
                      slice.slice(
                        slice.filePos,
                        sampleBoxStartPos +
                          sampleBoxInfo.totalSize -
                          slice.filePos,
                      ),
                    );
                    const codecName =
                      lowercaseBoxName === "enca"
                        ? track.frmaCodecString
                        : lowercaseBoxName;
                    track.frmaCodecString = null;
                    if (codecName === "mp4a") {
                    } else if (codecName === "opus") {
                      track.info.codec = "opus";
                      track.info.sampleRate =
                        _codec_js__WEBPACK_IMPORTED_MODULE_1__.yo;
                    } else if (codecName === "flac") {
                      track.info.codec = "flac";
                    } else if (codecName === "ulaw") {
                      track.info.codec = "ulaw";
                    } else if (codecName === "alaw") {
                      track.info.codec = "alaw";
                    } else if (codecName === "ac-3") {
                      track.info.codec = "ac3";
                    } else if (codecName === "ec-3") {
                      track.info.codec = "eac3";
                    } else if (
                      _codec_js__WEBPACK_IMPORTED_MODULE_1__.Sf.includes(
                        codecName,
                      )
                    ) {
                      track.info.codec = "dts";
                      track.info.dtsFormat = codecName;
                    } else if (codecName === "twos") {
                      if (sampleSize === 8) {
                        track.info.codec = "pcm-s8";
                      } else if (sampleSize === 16) {
                        track.info.codec = track.info.pcmLittleEndian
                          ? "pcm-s16"
                          : "pcm-s16be";
                      } else {
                        _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                          "Unsupported sample size ".concat(
                            sampleSize,
                            " for codec 'twos'.",
                          ),
                        );
                        track.info.codec = null;
                      }
                    } else if (codecName === "sowt") {
                      if (sampleSize === 8) {
                        track.info.codec = "pcm-s8";
                      } else if (sampleSize === 16) {
                        track.info.codec = "pcm-s16";
                      } else {
                        _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                          "Unsupported sample size ".concat(
                            sampleSize,
                            " for codec 'sowt'.",
                          ),
                        );
                        track.info.codec = null;
                      }
                    } else if (codecName === "raw ") {
                      track.info.codec = "pcm-u8";
                    } else if (codecName === "in24") {
                      track.info.codec = track.info.pcmLittleEndian
                        ? "pcm-s24"
                        : "pcm-s24be";
                    } else if (codecName === "in32") {
                      track.info.codec = track.info.pcmLittleEndian
                        ? "pcm-s32"
                        : "pcm-s32be";
                    } else if (codecName === "fl32") {
                      track.info.codec = track.info.pcmLittleEndian
                        ? "pcm-f32"
                        : "pcm-f32be";
                    } else if (codecName === "fl64") {
                      track.info.codec = track.info.pcmLittleEndian
                        ? "pcm-f64"
                        : "pcm-f64be";
                    } else if (codecName === "ipcm") {
                      const pcmSampleSize = track.info.pcmSampleSize;
                      if (track.info.pcmLittleEndian) {
                        if (pcmSampleSize === 16) {
                          track.info.codec = "pcm-s16";
                        } else if (pcmSampleSize === 24) {
                          track.info.codec = "pcm-s24";
                        } else if (pcmSampleSize === 32) {
                          track.info.codec = "pcm-s32";
                        } else {
                          _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                            "Invalid ipcm sample size ".concat(
                              pcmSampleSize,
                              ".",
                            ),
                          );
                          track.info.codec = null;
                        }
                      } else {
                        if (pcmSampleSize === 16) {
                          track.info.codec = "pcm-s16be";
                        } else if (pcmSampleSize === 24) {
                          track.info.codec = "pcm-s24be";
                        } else if (pcmSampleSize === 32) {
                          track.info.codec = "pcm-s32be";
                        } else {
                          _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                            "Invalid ipcm sample size ".concat(
                              pcmSampleSize,
                              ".",
                            ),
                          );
                          track.info.codec = null;
                        }
                      }
                    } else if (codecName === "fpcm") {
                      const pcmSampleSize = track.info.pcmSampleSize;
                      if (track.info.pcmLittleEndian) {
                        if (pcmSampleSize === 32) {
                          track.info.codec = "pcm-f32";
                        } else if (pcmSampleSize === 64) {
                          track.info.codec = "pcm-f64";
                        } else {
                          _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                            "Invalid fpcm sample size ".concat(
                              pcmSampleSize,
                              ".",
                            ),
                          );
                          track.info.codec = null;
                        }
                      } else {
                        if (pcmSampleSize === 32) {
                          track.info.codec = "pcm-f32be";
                        } else if (pcmSampleSize === 64) {
                          track.info.codec = "pcm-f64be";
                        } else {
                          _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                            "Invalid fpcm sample size ".concat(
                              pcmSampleSize,
                              ".",
                            ),
                          );
                          track.info.codec = null;
                        }
                      }
                    } else if (codecName === "lpcm" && lpcmFlags !== null) {
                      const bytesPerSample = (sampleSize + 7) >> 3;
                      const isFloat = Boolean(lpcmFlags & 1);
                      const isBigEndian = Boolean(lpcmFlags & 2);
                      const sFlags = lpcmFlags & 4 ? -1 : 0;
                      if (sampleSize > 0 && sampleSize <= 64) {
                        if (isFloat) {
                          if (sampleSize === 32) {
                            track.info.codec = isBigEndian
                              ? "pcm-f32be"
                              : "pcm-f32";
                          }
                        } else {
                          if (sFlags & (1 << (bytesPerSample - 1))) {
                            if (bytesPerSample === 1) {
                              track.info.codec = "pcm-s8";
                            } else if (bytesPerSample === 2) {
                              track.info.codec = isBigEndian
                                ? "pcm-s16be"
                                : "pcm-s16";
                            } else if (bytesPerSample === 3) {
                              track.info.codec = isBigEndian
                                ? "pcm-s24be"
                                : "pcm-s24";
                            } else if (bytesPerSample === 4) {
                              track.info.codec = isBigEndian
                                ? "pcm-s32be"
                                : "pcm-s32";
                            }
                          } else {
                            if (bytesPerSample === 1) {
                              track.info.codec = "pcm-u8";
                            }
                          }
                        }
                      }
                      if (track.info.codec === null) {
                        _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                          "Unsupported PCM format.",
                        );
                      }
                    } else if (codecName === null) {
                      _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                        "Unknown encrypted audio codec due to missing frma box.",
                      );
                    } else {
                      _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                        "Unsupported audio codec (sample entry type '".concat(
                          sampleBoxInfo.name,
                          "').",
                        ),
                      );
                    }
                  }
                  slice.filePos = sampleBoxStartPos + sampleBoxInfo.totalSize;
                }
              }
              break;
            case "frma":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                const format = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.IT)(
                  slice,
                  4,
                );
                const lowercase = format.toLowerCase();
                track.frmaCodecString = lowercase;
              }
              break;
            case "schm":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                slice.skip(4);
                const schemeType = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.IT)(slice, 4);
                if (
                  schemeType === "cenc" ||
                  schemeType === "cens" ||
                  schemeType === "cbcs"
                ) {
                  track.encryptionInfo = {
                    scheme: schemeType,
                    defaultKid: null,
                    defaultIsProtected: null,
                    defaultPerSampleIvSize: null,
                    defaultConstantIv: null,
                    defaultCryptByteBlock: null,
                    defaultSkipByteBlock: null,
                  };
                } else {
                  _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                    "Unsupported encryption scheme '".concat(schemeType, "'."),
                  );
                }
              }
              break;
            case "tenc":
              {
                const track = this.currentTrack;
                if (!track || !track.encryptionInfo) {
                  break;
                }
                const version = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                slice.skip(3);
                slice.skip(1);
                const patternByte = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                if (version > 0) {
                  track.encryptionInfo.defaultCryptByteBlock = patternByte >> 4;
                  track.encryptionInfo.defaultSkipByteBlock = patternByte & 15;
                } else {
                  track.encryptionInfo.defaultCryptByteBlock = 0;
                  track.encryptionInfo.defaultSkipByteBlock = 0;
                }
                track.encryptionInfo.defaultIsProtected =
                  (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice) !== 0;
                track.encryptionInfo.defaultPerSampleIvSize = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                track.encryptionInfo.defaultKid = (0,
                _misc_js__WEBPACK_IMPORTED_MODULE_4__.Br)(
                  (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(slice, 16),
                );
                if (
                  track.encryptionInfo.defaultIsProtected &&
                  track.encryptionInfo.defaultPerSampleIvSize === 0
                ) {
                  const constantIvSize = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                  const constantIv = new Uint8Array(16);
                  constantIv.set(
                    (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                      slice,
                      constantIvSize,
                    ),
                    0,
                  );
                  track.encryptionInfo.defaultConstantIv = constantIv;
                }
              }
              break;
            case "avcC":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(track.info);
                if (boxInfo.contentSize === 0) {
                  break;
                }
                track.info.codecDescription = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                  slice,
                  boxInfo.contentSize,
                );
              }
              break;
            case "hvcC":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(track.info);
                if (boxInfo.contentSize === 0) {
                  break;
                }
                track.info.codecDescription = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                  slice,
                  boxInfo.contentSize,
                );
              }
              break;
            case "vpcC":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "video",
                );
                slice.skip(4);
                const profile = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                const level = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                const thirdByte = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                const bitDepth = thirdByte >> 4;
                const chromaSubsampling = (thirdByte >> 1) & 7;
                const videoFullRangeFlag = thirdByte & 1;
                const colourPrimaries = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                const transferCharacteristics = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                const matrixCoefficients = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                track.info.vp9CodecInfo = {
                  profile,
                  level,
                  bitDepth,
                  chromaSubsampling,
                  videoFullRangeFlag,
                  colourPrimaries,
                  transferCharacteristics,
                  matrixCoefficients,
                };
              }
              break;
            case "av1C":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "video",
                );
                slice.skip(1);
                const secondByte = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                const profile = secondByte >> 5;
                const level = secondByte & 31;
                const thirdByte = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                const tier = thirdByte >> 7;
                const highBitDepth = (thirdByte >> 6) & 1;
                const twelveBit = (thirdByte >> 5) & 1;
                const monochrome = (thirdByte >> 4) & 1;
                const chromaSubsamplingX = (thirdByte >> 3) & 1;
                const chromaSubsamplingY = (thirdByte >> 2) & 1;
                const chromaSamplePosition = thirdByte & 3;
                const bitDepth =
                  profile === 2 && highBitDepth
                    ? twelveBit
                      ? 12
                      : 10
                    : highBitDepth
                      ? 10
                      : 8;
                slice.skip(1);
                const configObus = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                  slice,
                  boxInfo.contentSize - 4,
                );
                const configObuInfo = (0,
                _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.UU)(configObus);
                track.info.av1CodecInfo = {
                  profile,
                  level,
                  tier,
                  bitDepth,
                  monochrome,
                  chromaSubsamplingX,
                  chromaSubsamplingY,
                  chromaSamplePosition,
                  videoFullRangeFlag: configObuInfo?.videoFullRangeFlag ?? 0,
                  colourPrimaries: configObuInfo?.colourPrimaries ?? 2,
                  transferCharacteristics:
                    configObuInfo?.transferCharacteristics ?? 2,
                  matrixCoefficients: configObuInfo?.matrixCoefficients ?? 2,
                };
              }
              break;
            case "colr":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "video",
                );
                const colourType = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.IT)(slice, 4);
                if (colourType !== "nclx" && colourType !== "nclc") {
                  break;
                }
                const colourPrimaries = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice);
                const transferCharacteristics = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice);
                const matrixCoefficients = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice);
                let fullRange = void 0;
                if (colourType === "nclx") {
                  fullRange = Boolean(
                    (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice) &
                    128,
                  );
                }
                track.info.colorSpace = {
                  primaries:
                    _misc_js__WEBPACK_IMPORTED_MODULE_4__.BL[colourPrimaries],
                  transfer:
                    _misc_js__WEBPACK_IMPORTED_MODULE_4__.x_[
                      transferCharacteristics
                    ],
                  matrix:
                    _misc_js__WEBPACK_IMPORTED_MODULE_4__.fl[
                      matrixCoefficients
                    ],
                  fullRange,
                };
              }
              break;
            case "pasp":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "video",
                );
                const num = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                  slice,
                );
                const den = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                  slice,
                );
                if (num > 0 && den > 0) {
                  if (num > den) {
                    track.info.squarePixelWidth = Math.round(
                      (track.info.width * num) / den,
                    );
                  } else {
                    track.info.squarePixelHeight = Math.round(
                      (track.info.height * den) / num,
                    );
                  }
                }
              }
              break;
            case "wave":
              {
                this.readContiguousBoxes(
                  slice.slice(contentStartPos, boxInfo.contentSize),
                );
              }
              break;
            case "esds":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "audio",
                );
                slice.skip(4);
                const tag = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(tag === 3);
                (0, _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.hs)(slice);
                slice.skip(2);
                const mixed = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                const streamDependenceFlag = (mixed & 128) !== 0;
                const urlFlag = (mixed & 64) !== 0;
                const ocrStreamFlag = (mixed & 32) !== 0;
                if (streamDependenceFlag) {
                  slice.skip(2);
                }
                if (urlFlag) {
                  const urlLength = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                  slice.skip(urlLength);
                }
                if (ocrStreamFlag) {
                  slice.skip(2);
                }
                const decoderConfigTag = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  decoderConfigTag === 4,
                );
                const decoderConfigDescriptorLength = (0,
                _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.hs)(slice);
                const payloadStart = slice.filePos;
                const objectTypeIndication = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                if (
                  objectTypeIndication === 64 ||
                  objectTypeIndication === 103
                ) {
                  track.info.codec = "aac";
                  track.info.aacCodecInfo = {
                    isMpeg2: objectTypeIndication === 103,
                    objectType: null,
                  };
                } else if (
                  objectTypeIndication === 105 ||
                  objectTypeIndication === 107
                ) {
                  track.info.codec = "mp3";
                } else if (objectTypeIndication === 221) {
                  track.info.codec = "vorbis";
                } else if (objectTypeIndication === 169) {
                  track.info.codec = "dts";
                } else {
                  _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                    "Unsupported audio codec (objectTypeIndication ".concat(
                      objectTypeIndication,
                      ") - discarding track.",
                    ),
                  );
                }
                slice.skip(1 + 3 + 4 + 4);
                if (
                  decoderConfigDescriptorLength >
                  slice.filePos - payloadStart
                ) {
                  const decoderSpecificInfoTag = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                    decoderSpecificInfoTag === 5,
                  );
                  const decoderSpecificInfoLength = (0,
                  _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.hs)(slice);
                  track.info.codecDescription = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                    slice,
                    decoderSpecificInfoLength,
                  );
                  if (track.info.codec === "aac") {
                    const audioSpecificConfig = (0,
                    _shared_aac_misc_js__WEBPACK_IMPORTED_MODULE_0__.zF)(
                      track.info.codecDescription,
                    );
                    if (audioSpecificConfig.outputNumberOfChannels !== null) {
                      track.info.numberOfChannels =
                        audioSpecificConfig.outputNumberOfChannels;
                    }
                    if (audioSpecificConfig.outputSampleRate !== null) {
                      track.info.sampleRate =
                        audioSpecificConfig.outputSampleRate;
                    }
                  }
                }
              }
              break;
            case "enda":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "audio",
                );
                track.info.pcmLittleEndian = !!(
                  (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice) & 255
                );
              }
              break;
            case "pcmC":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "audio",
                );
                slice.skip(1 + 3);
                const formatFlags = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                track.info.pcmLittleEndian = Boolean(formatFlags & 1);
                track.info.pcmSampleSize = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
              }
              break;
            case "dOps":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "audio",
                );
                slice.skip(1);
                const outputChannelCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                const preSkip = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(
                  slice,
                );
                const inputSampleRate = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                const outputGain = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.iH)(slice);
                const channelMappingFamily = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                let channelMappingTable;
                if (channelMappingFamily !== 0) {
                  channelMappingTable = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                    slice,
                    2 + outputChannelCount,
                  );
                } else {
                  channelMappingTable = new Uint8Array(0);
                }
                const description = new Uint8Array(
                  8 + 1 + 1 + 2 + 4 + 2 + 1 + channelMappingTable.byteLength,
                );
                const view = new DataView(description.buffer);
                view.setUint32(0, 1332770163, false);
                view.setUint32(4, 1214603620, false);
                view.setUint8(8, 1);
                view.setUint8(9, outputChannelCount);
                view.setUint16(10, preSkip, true);
                view.setUint32(12, inputSampleRate, true);
                view.setInt16(16, outputGain, true);
                view.setUint8(18, channelMappingFamily);
                description.set(channelMappingTable, 19);
                track.info.codecDescription = description;
                track.info.numberOfChannels = outputChannelCount;
              }
              break;
            case "dfLa":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "audio",
                );
                slice.skip(4);
                const BLOCK_TYPE_MASK = 127;
                const LAST_METADATA_BLOCK_FLAG_MASK = 128;
                const startPos2 = slice.filePos;
                while (slice.filePos < boxEndPos) {
                  const flagAndType = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                  const metadataBlockLength = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.n2)(slice);
                  const type = flagAndType & BLOCK_TYPE_MASK;
                  if (
                    type ===
                    _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.A3.STREAMINFO
                  ) {
                    slice.skip(10);
                    const word = (0,
                    _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                    const sampleRate = word >>> 12;
                    const numberOfChannels = ((word >> 9) & 7) + 1;
                    track.info.sampleRate = sampleRate;
                    track.info.numberOfChannels = numberOfChannels;
                    slice.skip(20);
                  } else {
                    slice.skip(metadataBlockLength);
                  }
                  if (flagAndType & LAST_METADATA_BLOCK_FLAG_MASK) {
                    break;
                  }
                }
                const endPos = slice.filePos;
                slice.filePos = startPos2;
                const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                  slice,
                  endPos - startPos2,
                );
                const description = new Uint8Array(4 + bytes.byteLength);
                const view = new DataView(description.buffer);
                view.setUint32(0, 1716281667, false);
                description.set(bytes, 4);
                track.info.codecDescription = description;
              }
              break;
            case "dac3":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "audio",
                );
                const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                  slice,
                  3,
                );
                const bitstream =
                  new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_11__._(
                    bytes,
                  );
                const fscod = bitstream.readBits(2);
                bitstream.skipBits(5 + 3);
                const acmod = bitstream.readBits(3);
                const lfeon = bitstream.readBits(1);
                if (fscod < 3) {
                  track.info.sampleRate =
                    _shared_ac3_misc_js__WEBPACK_IMPORTED_MODULE_10__.N[fscod];
                }
                track.info.numberOfChannels =
                  _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.ux[acmod] + lfeon;
              }
              break;
            case "dec3":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "audio",
                );
                const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                  slice,
                  boxInfo.contentSize,
                );
                const config = (0,
                _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.Sd)(bytes);
                if (!config) {
                  _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                    "Invalid dec3 box contents, ignoring.",
                  );
                  break;
                }
                const sampleRate = (0,
                _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.PK)(config);
                if (sampleRate !== null) {
                  track.info.sampleRate = sampleRate;
                }
                track.info.numberOfChannels = (0,
                _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.zV)(config);
              }
              break;
            case "ddts":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.info?.type === "audio",
                );
                const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                  slice,
                  Math.min(
                    boxInfo.contentSize,
                    _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.Xc,
                  ),
                );
                const config = (0,
                _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.ix)(bytes);
                if (!config) {
                  _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                    "Invalid ddts box contents, ignoring.",
                  );
                  break;
                }
                track.info.sampleRate = config.sampleRate;
                if (config.numberOfChannels !== null) {
                  track.info.numberOfChannels = config.numberOfChannels;
                }
              }
              break;
            case "stts":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                if (!track.sampleTable) {
                  break;
                }
                slice.skip(4);
                const entryCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                let currentIndex = 0;
                let currentTimestamp = 0;
                for (let i = 0; i < entryCount; i++) {
                  const sampleCount = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  const sampleDelta = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  track.sampleTable.sampleTimingEntries.push({
                    startIndex: currentIndex,
                    startDecodeTimestamp: currentTimestamp,
                    count: sampleCount,
                    delta: sampleDelta,
                  });
                  currentIndex += sampleCount;
                  currentTimestamp += sampleCount * sampleDelta;
                }
              }
              break;
            case "ctts":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                if (!track.sampleTable) {
                  break;
                }
                slice.skip(1 + 3);
                const entryCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                let sampleIndex = 0;
                for (let i = 0; i < entryCount; i++) {
                  const sampleCount = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  const sampleOffset = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.Ar)(slice);
                  track.sampleTable.sampleCompositionTimeOffsets.push({
                    startIndex: sampleIndex,
                    count: sampleCount,
                    offset: sampleOffset,
                  });
                  sampleIndex += sampleCount;
                }
              }
              break;
            case "stsz":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                if (!track.sampleTable) {
                  break;
                }
                slice.skip(4);
                const sampleSize = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                const sampleCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                if (sampleSize === 0) {
                  for (let i = 0; i < sampleCount; i++) {
                    const sampleSize2 = (0,
                    _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                    track.sampleTable.sampleSizes.push(sampleSize2);
                  }
                } else {
                  track.sampleTable.sampleSizes.push(sampleSize);
                }
              }
              break;
            case "stz2":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                if (!track.sampleTable) {
                  break;
                }
                slice.skip(4);
                slice.skip(3);
                const fieldSize = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                const sampleCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                  slice,
                  Math.ceil((sampleCount * fieldSize) / 8),
                );
                const bitstream =
                  new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_11__._(
                    bytes,
                  );
                for (let i = 0; i < sampleCount; i++) {
                  const sampleSize = bitstream.readBits(fieldSize);
                  track.sampleTable.sampleSizes.push(sampleSize);
                }
              }
              break;
            case "stss":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                if (!track.sampleTable) {
                  break;
                }
                slice.skip(4);
                track.sampleTable.keySampleIndices = [];
                const entryCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                for (let i = 0; i < entryCount; i++) {
                  const sampleIndex =
                    (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice) - 1;
                  track.sampleTable.keySampleIndices.push(sampleIndex);
                }
                if (track.sampleTable.keySampleIndices[0] !== 0) {
                  track.sampleTable.keySampleIndices.unshift(0);
                }
              }
              break;
            case "stsc":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                if (!track.sampleTable) {
                  break;
                }
                slice.skip(4);
                const entryCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                for (let i = 0; i < entryCount; i++) {
                  const startChunkIndex =
                    (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice) - 1;
                  const samplesPerChunk = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  const sampleDescriptionIndex = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  track.sampleTable.sampleToChunk.push({
                    startSampleIndex: -1,
                    startChunkIndex,
                    samplesPerChunk,
                    sampleDescriptionIndex,
                  });
                }
                let startSampleIndex = 0;
                for (
                  let i = 0;
                  i < track.sampleTable.sampleToChunk.length;
                  i++
                ) {
                  track.sampleTable.sampleToChunk[i].startSampleIndex =
                    startSampleIndex;
                  if (i < track.sampleTable.sampleToChunk.length - 1) {
                    const nextChunk = track.sampleTable.sampleToChunk[i + 1];
                    const chunkCount =
                      nextChunk.startChunkIndex -
                      track.sampleTable.sampleToChunk[i].startChunkIndex;
                    startSampleIndex +=
                      chunkCount *
                      track.sampleTable.sampleToChunk[i].samplesPerChunk;
                  }
                }
              }
              break;
            case "stco":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                if (!track.sampleTable) {
                  break;
                }
                slice.skip(4);
                const entryCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                for (let i = 0; i < entryCount; i++) {
                  const chunkOffset = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  track.sampleTable.chunkOffsets.push(chunkOffset);
                }
              }
              break;
            case "co64":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                if (!track.sampleTable) {
                  break;
                }
                slice.skip(4);
                const entryCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                for (let i = 0; i < entryCount; i++) {
                  const chunkOffset = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.th)(slice);
                  track.sampleTable.chunkOffsets.push(chunkOffset);
                }
              }
              break;
            case "mvex":
              {
                this.isFragmented = true;
                this.readContiguousBoxes(
                  slice.slice(contentStartPos, boxInfo.contentSize),
                );
              }
              break;
            case "mehd":
              {
                const version = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                slice.skip(3);
                const fragmentDuration =
                  version === 1
                    ? (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.th)(slice)
                    : (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                this.movieDurationInTimescale = fragmentDuration;
              }
              break;
            case "trex":
              {
                slice.skip(4);
                const trackId = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                  slice,
                );
                const defaultSampleDescriptionIndex = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                const defaultSampleDuration = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                const defaultSampleSize = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                const defaultSampleFlags = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                this.fragmentTrackDefaults.push({
                  trackId,
                  defaultSampleDescriptionIndex,
                  defaultSampleDuration,
                  defaultSampleSize,
                  defaultSampleFlags,
                });
              }
              break;
            case "tfra":
              {
                const version = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                slice.skip(3);
                const trackId = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                  slice,
                );
                const track = this.tracks.find((x) => x.id === trackId);
                if (!track) {
                  break;
                }
                const word = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                  slice,
                );
                const lengthSizeOfTrafNum = (word & 48) >> 4;
                const lengthSizeOfTrunNum = (word & 12) >> 2;
                const lengthSizeOfSampleNum = word & 3;
                const functions = [
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.n2,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN,
                ];
                const readTrafNum = functions[lengthSizeOfTrafNum];
                const readTrunNum = functions[lengthSizeOfTrunNum];
                const readSampleNum = functions[lengthSizeOfSampleNum];
                const numberOfEntries = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                for (let i = 0; i < numberOfEntries; i++) {
                  const time =
                    version === 1
                      ? (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.th)(slice)
                      : (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  const moofOffset =
                    version === 1
                      ? (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.th)(slice)
                      : (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  readTrafNum(slice);
                  readTrunNum(slice);
                  readSampleNum(slice);
                  track.fragmentLookupTable.push({
                    timestamp: time,
                    moofOffset,
                  });
                }
                track.fragmentLookupTable.sort(
                  (a, b) => a.timestamp - b.timestamp,
                );
                for (let i = 0; i < track.fragmentLookupTable.length - 1; i++) {
                  const entry1 = track.fragmentLookupTable[i];
                  const entry2 = track.fragmentLookupTable[i + 1];
                  if (entry1.timestamp === entry2.timestamp) {
                    track.fragmentLookupTable.splice(i + 1, 1);
                    i--;
                  }
                }
              }
              break;
            case "moof":
              {
                this.currentFragment = {
                  moofOffset: startPos,
                  moofSize: boxInfo.totalSize,
                  implicitBaseDataOffset: startPos,
                  trackData: /* @__PURE__ */ new Map(),
                  psshBoxes: [],
                };
                this.readContiguousBoxes(
                  slice.slice(contentStartPos, boxInfo.contentSize),
                );
                this.lastReadFragment = this.currentFragment;
                this.currentFragment = null;
              }
              break;
            case "traf":
              {
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  this.currentFragment,
                );
                this.readContiguousBoxes(
                  slice.slice(contentStartPos, boxInfo.contentSize),
                );
                if (this.currentTrack) {
                  const trackData = this.currentFragment.trackData.get(
                    this.currentTrack.id,
                  );
                  cond: if (trackData) {
                    if (trackData.samples.length === 0) {
                      this.currentFragment.trackData.delete(
                        this.currentTrack.id,
                      );
                      break cond;
                    }
                    trackData.presentationTimestamps = trackData.samples
                      .map((x, i) => ({
                        presentationTimestamp: x.presentationTimestamp,
                        sampleIndex: i,
                      }))
                      .sort(
                        (a, b) =>
                          a.presentationTimestamp - b.presentationTimestamp,
                      );
                    for (
                      let i = 0;
                      i < trackData.presentationTimestamps.length;
                      i++
                    ) {
                      const currentEntry = trackData.presentationTimestamps[i];
                      const currentSample =
                        trackData.samples[currentEntry.sampleIndex];
                      if (
                        trackData.firstKeyFrameTimestamp === null &&
                        currentSample.isKeyFrame
                      ) {
                        trackData.firstKeyFrameTimestamp =
                          currentSample.presentationTimestamp;
                      }
                      if (i < trackData.presentationTimestamps.length - 1) {
                        const nextEntry =
                          trackData.presentationTimestamps[i + 1];
                        const duration =
                          nextEntry.presentationTimestamp -
                          currentEntry.presentationTimestamp;
                        currentSample.duration = duration;
                      }
                    }
                    const firstSample =
                      trackData.samples[
                        trackData.presentationTimestamps[0].sampleIndex
                      ];
                    const lastSample =
                      trackData.samples[
                        (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__._g)(
                          trackData.presentationTimestamps,
                        ).sampleIndex
                      ];
                    trackData.startTimestamp =
                      firstSample.presentationTimestamp;
                    trackData.endTimestamp =
                      lastSample.presentationTimestamp + lastSample.duration;
                    const { currentFragmentState } = this.currentTrack;
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                      currentFragmentState,
                    );
                    if (currentFragmentState.startTimestamp !== null) {
                      offsetFragmentTrackDataByTimestamp(
                        trackData,
                        currentFragmentState.startTimestamp,
                      );
                      trackData.startTimestampIsFinal = true;
                    }
                    if (
                      currentFragmentState.encryptionAuxInfo &&
                      !trackData.samples[0].encryption
                    ) {
                      trackData.encryptionAuxInfo =
                        currentFragmentState.encryptionAuxInfo;
                    }
                  }
                  this.currentTrack.currentFragmentState = null;
                  this.currentTrack = null;
                }
              }
              break;
            case "pssh":
              {
                if (this.input._formatOptions.isobmff?._suppressPsshParsing) {
                  break;
                }
                const psshBox = (0,
                _isobmff_misc_js__WEBPACK_IMPORTED_MODULE_6__.j1)(
                  (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                    slice,
                    boxInfo.contentSize,
                  ),
                );
                if (this.currentFragment) {
                  this.currentFragment.psshBoxes.push(psshBox);
                } else if (!this.currentTrack) {
                  this.psshBoxes.push(psshBox);
                }
              }
              break;
            case "tfhd":
              {
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  this.currentFragment,
                );
                slice.skip(1);
                const flags = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.n2)(
                  slice,
                );
                const baseDataOffsetPresent = Boolean(flags & 1);
                const sampleDescriptionIndexPresent = Boolean(flags & 2);
                const defaultSampleDurationPresent = Boolean(flags & 8);
                const defaultSampleSizePresent = Boolean(flags & 16);
                const defaultSampleFlagsPresent = Boolean(flags & 32);
                const durationIsEmpty = Boolean(flags & 65536);
                const defaultBaseIsMoof = Boolean(flags & 131072);
                const trackId = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                  slice,
                );
                const track = this.tracks.find((x) => x.id === trackId);
                if (!track) {
                  break;
                }
                const defaults = this.fragmentTrackDefaults.find(
                  (x) => x.trackId === trackId,
                );
                this.currentTrack = track;
                track.currentFragmentState = {
                  baseDataOffset: this.currentFragment.implicitBaseDataOffset,
                  sampleDescriptionIndex:
                    defaults?.defaultSampleDescriptionIndex ?? null,
                  defaultSampleDuration:
                    defaults?.defaultSampleDuration ?? null,
                  defaultSampleSize: defaults?.defaultSampleSize ?? null,
                  defaultSampleFlags: defaults?.defaultSampleFlags ?? null,
                  startTimestamp: null,
                  encryptionAuxInfo: null,
                };
                if (baseDataOffsetPresent) {
                  track.currentFragmentState.baseDataOffset = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.th)(slice);
                } else if (defaultBaseIsMoof) {
                  track.currentFragmentState.baseDataOffset =
                    this.currentFragment.moofOffset;
                }
                if (sampleDescriptionIndexPresent) {
                  track.currentFragmentState.sampleDescriptionIndex = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                }
                if (defaultSampleDurationPresent) {
                  track.currentFragmentState.defaultSampleDuration = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                }
                if (defaultSampleSizePresent) {
                  track.currentFragmentState.defaultSampleSize = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                }
                if (defaultSampleFlagsPresent) {
                  track.currentFragmentState.defaultSampleFlags = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                }
                if (durationIsEmpty) {
                  track.currentFragmentState.defaultSampleDuration = 0;
                }
              }
              break;
            case "tfdt":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.currentFragmentState,
                );
                const version = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                slice.skip(3);
                const baseMediaDecodeTime =
                  version === 0
                    ? (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice)
                    : (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.th)(slice);
                track.currentFragmentState.startTimestamp = baseMediaDecodeTime;
              }
              break;
            case "trun":
              {
                const track = this.currentTrack;
                if (!track) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  this.currentFragment,
                );
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  track.currentFragmentState,
                );
                const version = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                const flags = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.n2)(
                  slice,
                );
                const dataOffsetPresent = Boolean(flags & 1);
                const firstSampleFlagsPresent = Boolean(flags & 4);
                const sampleDurationPresent = Boolean(flags & 256);
                const sampleSizePresent = Boolean(flags & 512);
                const sampleFlagsPresent = Boolean(flags & 1024);
                const sampleCompositionTimeOffsetsPresent = Boolean(
                  flags & 2048,
                );
                const sampleCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                let dataOffset = null;
                if (dataOffsetPresent) {
                  dataOffset = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.Ar)(
                    slice,
                  );
                }
                let firstSampleFlags = null;
                if (firstSampleFlagsPresent) {
                  firstSampleFlags = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                }
                let trackData;
                if (this.currentFragment.trackData.has(track.id)) {
                  trackData = this.currentFragment.trackData.get(track.id);
                  if (dataOffset !== null) {
                    trackData.currentOffset =
                      track.currentFragmentState.baseDataOffset + dataOffset;
                  } else {
                  }
                } else {
                  trackData = {
                    track,
                    currentTimestamp: 0,
                    currentOffset:
                      track.currentFragmentState.baseDataOffset +
                      (dataOffset ?? 0),
                    startTimestamp: 0,
                    endTimestamp: 0,
                    firstKeyFrameTimestamp: null,
                    samples: [],
                    presentationTimestamps: [],
                    startTimestampIsFinal: false,
                    encryptionAuxInfo: null,
                  };
                  this.currentFragment.trackData.set(track.id, trackData);
                }
                for (let i = 0; i < sampleCount; i++) {
                  let sampleDuration;
                  if (sampleDurationPresent) {
                    sampleDuration = (0,
                    _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  } else {
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                      track.currentFragmentState.defaultSampleDuration !== null,
                    );
                    sampleDuration =
                      track.currentFragmentState.defaultSampleDuration;
                  }
                  let sampleSize;
                  if (sampleSizePresent) {
                    sampleSize = (0,
                    _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  } else {
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                      track.currentFragmentState.defaultSampleSize !== null,
                    );
                    sampleSize = track.currentFragmentState.defaultSampleSize;
                  }
                  let sampleFlags;
                  if (sampleFlagsPresent) {
                    sampleFlags = (0,
                    _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  } else {
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                      track.currentFragmentState.defaultSampleFlags !== null,
                    );
                    sampleFlags = track.currentFragmentState.defaultSampleFlags;
                  }
                  if (i === 0 && firstSampleFlags !== null) {
                    sampleFlags = firstSampleFlags;
                  }
                  let sampleCompositionTimeOffset = 0;
                  if (sampleCompositionTimeOffsetsPresent) {
                    if (version === 0) {
                      sampleCompositionTimeOffset = (0,
                      _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                    } else {
                      sampleCompositionTimeOffset = (0,
                      _reader_js__WEBPACK_IMPORTED_MODULE_8__.Ar)(slice);
                    }
                  }
                  const isKeyFrame = !(sampleFlags & 65536);
                  trackData.samples.push({
                    presentationTimestamp:
                      trackData.currentTimestamp + sampleCompositionTimeOffset,
                    duration: sampleDuration,
                    byteOffset: trackData.currentOffset,
                    byteSize: sampleSize,
                    isKeyFrame,
                    encryption: null,
                  });
                  trackData.currentOffset += sampleSize;
                  trackData.currentTimestamp += sampleDuration;
                }
                this.currentFragment.implicitBaseDataOffset =
                  trackData.currentOffset;
              }
              break;
            case "saiz":
              {
                const track = this.currentTrack;
                if (!track || !track.encryptionInfo) {
                  break;
                }
                slice.skip(1);
                const flags = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.n2)(
                  slice,
                );
                if (flags & 1) {
                  const auxInfoType = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.IT)(slice, 4);
                  const auxInfoTypeParam = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  if (
                    auxInfoType !== track.encryptionInfo.scheme ||
                    auxInfoTypeParam !== 0
                  ) {
                    break;
                  }
                }
                const defaultSampleInfoSize = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(slice);
                const sampleCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                let sampleSizes = null;
                if (defaultSampleInfoSize === 0 && sampleCount > 0) {
                  sampleSizes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                    slice,
                    sampleCount,
                  );
                }
                const aux = getOrCreateEncryptionAuxInfo(track);
                aux.defaultSampleInfoSize = defaultSampleInfoSize;
                aux.sampleSizes = sampleSizes;
                aux.sampleCount = sampleCount;
              }
              break;
            case "saio":
              {
                const track = this.currentTrack;
                if (!track || !track.encryptionInfo) {
                  break;
                }
                const version = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.eo)(
                  slice,
                );
                const flags = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.n2)(
                  slice,
                );
                if (flags & 1) {
                  const auxInfoType = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.IT)(slice, 4);
                  const auxInfoTypeParam = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  if (
                    auxInfoType !== track.encryptionInfo.scheme ||
                    auxInfoTypeParam !== 0
                  ) {
                    break;
                  }
                }
                const entryCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                if (entryCount === 0) {
                  break;
                }
                if (entryCount > 1) {
                  _logging_js__WEBPACK_IMPORTED_MODULE_13__.y._warn(
                    "Multiple saio entries are not supported; using the first offset only.",
                  );
                }
                let offset =
                  version === 0
                    ? (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice)
                    : Number(
                        (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.th)(slice),
                      );
                if (this.currentFragment) {
                  offset += this.currentFragment.moofOffset;
                }
                const aux = getOrCreateEncryptionAuxInfo(track);
                aux.offset = offset;
              }
              break;
            case "senc":
              {
                const track = this.currentTrack;
                if (!track || !track.encryptionInfo) {
                  break;
                }
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  this.currentFragment,
                );
                const trackData = this.currentFragment.trackData.get(track.id);
                if (!trackData) {
                  break;
                }
                slice.skip(1);
                const flags = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.n2)(
                  slice,
                );
                const useSubsamples = Boolean(flags & 2);
                const sampleCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                const ivSize = track.encryptionInfo.defaultPerSampleIvSize;
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(ivSize !== null);
                for (
                  let i = 0;
                  i < Math.min(sampleCount, trackData.samples.length);
                  i++
                ) {
                  const iv = new Uint8Array(16);
                  if (ivSize > 0) {
                    iv.set(
                      (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                        slice,
                        ivSize,
                      ),
                      0,
                    );
                  } else {
                    iv.set(track.encryptionInfo.defaultConstantIv, 0);
                  }
                  let subsamples = null;
                  if (useSubsamples) {
                    const subsampleCount = (0,
                    _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice);
                    subsamples = [];
                    for (let j = 0; j < subsampleCount; j++) {
                      const clearLen = (0,
                      _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice);
                      const protectedLen = (0,
                      _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                      subsamples.push({ clearLen, protectedLen });
                    }
                  }
                  const sample = trackData.samples[i];
                  sample.encryption = { iv, subsamples };
                }
              }
              break;
            // Metadata section
            // https://exiftool.org/TagNames/QuickTime.html
            // https://mp4workshop.com/about
            case "udta":
              {
                const iterator = this.iterateContiguousBoxes(
                  slice.slice(contentStartPos, boxInfo.contentSize),
                );
                for (const { boxInfo: boxInfo2, slice: slice2 } of iterator) {
                  if (boxInfo2.name !== "meta" && !this.currentTrack) {
                    const startPos2 = slice2.filePos;
                    this.metadataTags.raw ??= {};
                    if (boxInfo2.name[0] === "\xA9") {
                      this.metadataTags.raw[boxInfo2.name] ??= (0,
                      _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.$L)(
                        slice2,
                      );
                    } else {
                      this.metadataTags.raw[boxInfo2.name] ??= (0,
                      _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                        slice2,
                        boxInfo2.contentSize,
                      );
                    }
                    slice2.filePos = startPos2;
                  }
                  switch (boxInfo2.name) {
                    case "meta":
                      {
                        slice2.skip(-boxInfo2.headerSize);
                        this.traverseBox(slice2);
                      }
                      break;
                    case "\xA9nam":
                    case "name":
                      {
                        if (this.currentTrack) {
                          this.currentTrack.name =
                            _misc_js__WEBPACK_IMPORTED_MODULE_4__.su.decode(
                              (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                                slice2,
                                boxInfo2.contentSize,
                              ),
                            );
                        } else {
                          this.metadataTags.title ??= (0,
                          _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.$L)(
                            slice2,
                          );
                        }
                      }
                      break;
                    case "\xA9des":
                      {
                        if (!this.currentTrack) {
                          this.metadataTags.description ??= (0,
                          _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.$L)(
                            slice2,
                          );
                        }
                      }
                      break;
                    case "\xA9ART":
                      {
                        if (!this.currentTrack) {
                          this.metadataTags.artist ??= (0,
                          _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.$L)(
                            slice2,
                          );
                        }
                      }
                      break;
                    case "\xA9alb":
                      {
                        if (!this.currentTrack) {
                          this.metadataTags.album ??= (0,
                          _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.$L)(
                            slice2,
                          );
                        }
                      }
                      break;
                    case "albr":
                      {
                        if (!this.currentTrack) {
                          this.metadataTags.albumArtist ??= (0,
                          _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.$L)(
                            slice2,
                          );
                        }
                      }
                      break;
                    case "\xA9gen":
                      {
                        if (!this.currentTrack) {
                          this.metadataTags.genre ??= (0,
                          _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.$L)(
                            slice2,
                          );
                        }
                      }
                      break;
                    case "\xA9day":
                      {
                        if (!this.currentTrack) {
                          const date = new Date(
                            (0,
                            _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.$L)(
                              slice2,
                            ),
                          );
                          if (!Number.isNaN(date.getTime())) {
                            this.metadataTags.date ??= date;
                          }
                        }
                      }
                      break;
                    case "\xA9cmt":
                      {
                        if (!this.currentTrack) {
                          this.metadataTags.comment ??= (0,
                          _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.$L)(
                            slice2,
                          );
                        }
                      }
                      break;
                    case "\xA9lyr":
                      {
                        if (!this.currentTrack) {
                          this.metadataTags.lyrics ??= (0,
                          _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.$L)(
                            slice2,
                          );
                        }
                      }
                      break;
                  }
                }
              }
              break;
            case "meta":
              {
                if (this.currentTrack) {
                  break;
                }
                const word = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(
                  slice,
                );
                const isQuickTime = word !== 0;
                this.currentMetadataKeys = /* @__PURE__ */ new Map();
                if (isQuickTime) {
                  this.readContiguousBoxes(
                    slice.slice(contentStartPos, boxInfo.contentSize),
                  );
                } else {
                  this.readContiguousBoxes(
                    slice.slice(contentStartPos + 4, boxInfo.contentSize - 4),
                  );
                }
                this.currentMetadataKeys = null;
              }
              break;
            case "keys":
              {
                if (!this.currentMetadataKeys) {
                  break;
                }
                slice.skip(4);
                const entryCount = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                for (let i = 0; i < entryCount; i++) {
                  const keySize = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
                  slice.skip(4);
                  const keyName =
                    _misc_js__WEBPACK_IMPORTED_MODULE_4__.su.decode(
                      (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
                        slice,
                        keySize - 8,
                      ),
                    );
                  this.currentMetadataKeys.set(i + 1, keyName);
                }
              }
              break;
            case "ilst":
              {
                if (!this.currentMetadataKeys) {
                  break;
                }
                const iterator = this.iterateContiguousBoxes(
                  slice.slice(contentStartPos, boxInfo.contentSize),
                );
                for (const { boxInfo: boxInfo2, slice: slice2 } of iterator) {
                  let metadataKey = boxInfo2.name;
                  const nameAsNumber =
                    (metadataKey.charCodeAt(0) << 24) +
                    (metadataKey.charCodeAt(1) << 16) +
                    (metadataKey.charCodeAt(2) << 8) +
                    metadataKey.charCodeAt(3);
                  if (this.currentMetadataKeys.has(nameAsNumber)) {
                    metadataKey = this.currentMetadataKeys.get(nameAsNumber);
                  }
                  const data = (0,
                  _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Cp)(slice2);
                  this.metadataTags.raw ??= {};
                  this.metadataTags.raw[metadataKey] ??= data;
                  switch (metadataKey) {
                    case "\xA9nam":
                    case "titl":
                    case "com.apple.quicktime.title":
                    case "title":
                      {
                        if (typeof data === "string") {
                          this.metadataTags.title ??= data;
                        }
                      }
                      break;
                    case "\xA9des":
                    case "desc":
                    case "dscp":
                    case "com.apple.quicktime.description":
                    case "description":
                      {
                        if (typeof data === "string") {
                          this.metadataTags.description ??= data;
                        }
                      }
                      break;
                    case "\xA9ART":
                    case "com.apple.quicktime.artist":
                    case "artist":
                      {
                        if (typeof data === "string") {
                          this.metadataTags.artist ??= data;
                        }
                      }
                      break;
                    case "\xA9alb":
                    case "albm":
                    case "com.apple.quicktime.album":
                    case "album":
                      {
                        if (typeof data === "string") {
                          this.metadataTags.album ??= data;
                        }
                      }
                      break;
                    case "aART":
                    case "album_artist":
                      {
                        if (typeof data === "string") {
                          this.metadataTags.albumArtist ??= data;
                        }
                      }
                      break;
                    case "\xA9cmt":
                    case "com.apple.quicktime.comment":
                    case "comment":
                      {
                        if (typeof data === "string") {
                          this.metadataTags.comment ??= data;
                        }
                      }
                      break;
                    case "\xA9gen":
                    case "gnre":
                    case "com.apple.quicktime.genre":
                    case "genre":
                      {
                        if (typeof data === "string") {
                          this.metadataTags.genre ??= data;
                        }
                      }
                      break;
                    case "\xA9lyr":
                    case "lyrics":
                      {
                        if (typeof data === "string") {
                          this.metadataTags.lyrics ??= data;
                        }
                      }
                      break;
                    case "\xA9day":
                    case "rldt":
                    case "com.apple.quicktime.creationdate":
                    case "date":
                      {
                        if (typeof data === "string") {
                          const date = new Date(data);
                          if (!Number.isNaN(date.getTime())) {
                            this.metadataTags.date ??= date;
                          }
                        }
                      }
                      break;
                    case "covr":
                    case "com.apple.quicktime.artwork":
                      {
                        if (
                          data instanceof
                          _metadata_js__WEBPACK_IMPORTED_MODULE_9__.sF
                        ) {
                          this.metadataTags.images ??= [];
                          this.metadataTags.images.push({
                            data: data.data,
                            kind: "coverFront",
                            mimeType: data.mimeType,
                          });
                        } else if (data instanceof Uint8Array) {
                          this.metadataTags.images ??= [];
                          this.metadataTags.images.push({
                            data,
                            kind: "coverFront",
                            mimeType: "image/*",
                          });
                        }
                      }
                      break;
                    case "track":
                      {
                        if (typeof data === "string") {
                          const parts = data.split("/");
                          const trackNum = Number.parseInt(parts[0], 10);
                          const tracksTotal =
                            parts[1] && Number.parseInt(parts[1], 10);
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
                      }
                      break;
                    case "trkn":
                      {
                        if (data instanceof Uint8Array && data.length >= 6) {
                          const view = (0,
                          _misc_js__WEBPACK_IMPORTED_MODULE_4__.Zc)(data);
                          const trackNumber = view.getUint16(2, false);
                          const tracksTotal = view.getUint16(4, false);
                          if (trackNumber > 0) {
                            this.metadataTags.trackNumber ??= trackNumber;
                          }
                          if (tracksTotal > 0) {
                            this.metadataTags.tracksTotal ??= tracksTotal;
                          }
                        }
                      }
                      break;
                    case "disc":
                    case "disk":
                      {
                        if (data instanceof Uint8Array && data.length >= 6) {
                          const view = (0,
                          _misc_js__WEBPACK_IMPORTED_MODULE_4__.Zc)(data);
                          const discNumber = view.getUint16(2, false);
                          const discNumberMax = view.getUint16(4, false);
                          if (discNumber > 0) {
                            this.metadataTags.discNumber ??= discNumber;
                          }
                          if (discNumberMax > 0) {
                            this.metadataTags.discsTotal ??= discNumberMax;
                          }
                        }
                      }
                      break;
                  }
                }
              }
              break;
          }
          slice.filePos = boxEndPos;
          return true;
        }
      }
      class IsobmffTrackBacking {
        constructor(internalTrack) {
          this.internalTrack = internalTrack;
          this.packetToSampleIndex = /* @__PURE__ */ new WeakMap();
          this.packetToFragmentLocation = /* @__PURE__ */ new WeakMap();
        }
        getId() {
          return this.internalTrack.id;
        }
        getNumber() {
          const demuxer = this.internalTrack.demuxer;
          const trackType = this.internalTrack.trackBacking.getType();
          let number = 0;
          for (const track of demuxer.tracks) {
            if (track.trackBacking.getType() === trackType) {
              number++;
            }
            if (track === this.internalTrack) {
              break;
            }
          }
          return number;
        }
        getCodec() {
          throw new Error("Not implemented on base class.");
        }
        getInternalCodecId() {
          return this.internalTrack.internalCodecId;
        }
        getName() {
          return this.internalTrack.name;
        }
        getLanguageCode() {
          return this.internalTrack.languageCode;
        }
        getTimeResolution() {
          return this.internalTrack.timescale;
        }
        isRelativeToUnixEpoch() {
          return false;
        }
        getUnixTimeForTimestamp() {
          return null;
        }
        getDisposition() {
          return this.internalTrack.disposition;
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
          const track = this.internalTrack;
          if (track.durationInMediaTimescale <= 0) {
            return null;
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(track.trackBacking);
          const firstPacket = await track.trackBacking.getFirstPacket({
            metadataOnly: true,
          });
          return (
            (firstPacket?.timestamp ?? 0) +
            track.durationInMediaTimescale / track.timescale
          );
        }
        async getLiveRefreshInterval() {
          return null;
        }
        async getFirstPacket(options) {
          const regularPacket = await this.fetchPacketForSampleIndex(
            0,
            options,
          );
          if (regularPacket || !this.internalTrack.demuxer.isFragmented) {
            return regularPacket;
          }
          return this.performFragmentedLookup(
            null,
            (fragment) => {
              const trackData = fragment.trackData.get(this.internalTrack.id);
              if (trackData) {
                return {
                  sampleIndex: 0,
                  correctSampleFound: true,
                };
              }
              return {
                sampleIndex: -1,
                correctSampleFound: false,
              };
            },
            -Infinity,
            // Use -Infinity as a search timestamp to avoid using the lookup entries
            Infinity,
            options,
          );
        }
        mapTimestampIntoTimescale(timestamp) {
          return (
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.aI)(
              timestamp * this.internalTrack.timescale,
            ) + this.internalTrack.editListOffset
          );
        }
        async getPacket(timestamp, options) {
          const timestampInTimescale =
            this.mapTimestampIntoTimescale(timestamp);
          const sampleTable = this.internalTrack.demuxer.getSampleTableForTrack(
            this.internalTrack,
          );
          const sampleIndex = getSampleIndexForTimestamp(
            sampleTable,
            timestampInTimescale,
          );
          const regularPacket = await this.fetchPacketForSampleIndex(
            sampleIndex,
            options,
          );
          if (
            !sampleTableIsEmpty(sampleTable) ||
            !this.internalTrack.demuxer.isFragmented
          ) {
            return regularPacket;
          }
          return this.performFragmentedLookup(
            null,
            (fragment) => {
              const trackData = fragment.trackData.get(this.internalTrack.id);
              if (!trackData) {
                return { sampleIndex: -1, correctSampleFound: false };
              }
              const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
                trackData.presentationTimestamps,
                timestampInTimescale,
                (x) => x.presentationTimestamp,
              );
              const sampleIndex2 =
                index !== -1
                  ? trackData.presentationTimestamps[index].sampleIndex
                  : -1;
              const correctSampleFound =
                index !== -1 && timestampInTimescale < trackData.endTimestamp;
              return { sampleIndex: sampleIndex2, correctSampleFound };
            },
            timestampInTimescale,
            timestampInTimescale,
            options,
          );
        }
        async getNextPacket(packet, options) {
          const regularSampleIndex = this.packetToSampleIndex.get(packet);
          if (regularSampleIndex !== void 0) {
            return this.fetchPacketForSampleIndex(
              regularSampleIndex + 1,
              options,
            );
          }
          const locationInFragment = this.packetToFragmentLocation.get(packet);
          if (locationInFragment === void 0) {
            throw new Error("Packet was not created from this track.");
          }
          return this.performFragmentedLookup(
            locationInFragment.fragment,
            (fragment) => {
              if (fragment === locationInFragment.fragment) {
                const trackData = fragment.trackData.get(this.internalTrack.id);
                if (
                  locationInFragment.sampleIndex + 1 <
                  trackData.samples.length
                ) {
                  return {
                    sampleIndex: locationInFragment.sampleIndex + 1,
                    correctSampleFound: true,
                  };
                }
              } else {
                const trackData = fragment.trackData.get(this.internalTrack.id);
                if (trackData) {
                  return {
                    sampleIndex: 0,
                    correctSampleFound: true,
                  };
                }
              }
              return {
                sampleIndex: -1,
                correctSampleFound: false,
              };
            },
            -Infinity,
            // Use -Infinity as a search timestamp to avoid using the lookup entries
            Infinity,
            options,
          );
        }
        async getKeyPacket(timestamp, options) {
          const timestampInTimescale =
            this.mapTimestampIntoTimescale(timestamp);
          const sampleTable = this.internalTrack.demuxer.getSampleTableForTrack(
            this.internalTrack,
          );
          const sampleIndex = getKeyframeSampleIndexForTimestamp(
            sampleTable,
            timestampInTimescale,
          );
          const regularPacket = await this.fetchPacketForSampleIndex(
            sampleIndex,
            options,
          );
          if (
            !sampleTableIsEmpty(sampleTable) ||
            !this.internalTrack.demuxer.isFragmented
          ) {
            return regularPacket;
          }
          return this.performFragmentedLookup(
            null,
            (fragment) => {
              const trackData = fragment.trackData.get(this.internalTrack.id);
              if (!trackData) {
                return { sampleIndex: -1, correctSampleFound: false };
              }
              const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Kl)(
                trackData.presentationTimestamps,
                (x) => {
                  const sample = trackData.samples[x.sampleIndex];
                  return (
                    sample.isKeyFrame &&
                    x.presentationTimestamp <= timestampInTimescale
                  );
                },
              );
              const sampleIndex2 =
                index !== -1
                  ? trackData.presentationTimestamps[index].sampleIndex
                  : -1;
              const correctSampleFound =
                index !== -1 && timestampInTimescale < trackData.endTimestamp;
              return { sampleIndex: sampleIndex2, correctSampleFound };
            },
            timestampInTimescale,
            timestampInTimescale,
            options,
          );
        }
        async getNextKeyPacket(packet, options) {
          const regularSampleIndex = this.packetToSampleIndex.get(packet);
          if (regularSampleIndex !== void 0) {
            const sampleTable =
              this.internalTrack.demuxer.getSampleTableForTrack(
                this.internalTrack,
              );
            const nextKeyFrameSampleIndex = getNextKeyframeIndexForSample(
              sampleTable,
              regularSampleIndex,
            );
            return this.fetchPacketForSampleIndex(
              nextKeyFrameSampleIndex,
              options,
            );
          }
          const locationInFragment = this.packetToFragmentLocation.get(packet);
          if (locationInFragment === void 0) {
            throw new Error("Packet was not created from this track.");
          }
          return this.performFragmentedLookup(
            locationInFragment.fragment,
            (fragment) => {
              if (fragment === locationInFragment.fragment) {
                const trackData = fragment.trackData.get(this.internalTrack.id);
                const nextKeyFrameIndex = trackData.samples.findIndex(
                  (x, i) => x.isKeyFrame && i > locationInFragment.sampleIndex,
                );
                if (nextKeyFrameIndex !== -1) {
                  return {
                    sampleIndex: nextKeyFrameIndex,
                    correctSampleFound: true,
                  };
                }
              } else {
                const trackData = fragment.trackData.get(this.internalTrack.id);
                if (trackData && trackData.firstKeyFrameTimestamp !== null) {
                  const keyFrameIndex = trackData.samples.findIndex(
                    (x) => x.isKeyFrame,
                  );
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                    keyFrameIndex !== -1,
                  );
                  return {
                    sampleIndex: keyFrameIndex,
                    correctSampleFound: true,
                  };
                }
              }
              return {
                sampleIndex: -1,
                correctSampleFound: false,
              };
            },
            -Infinity,
            // Use -Infinity as a search timestamp to avoid using the lookup entries
            Infinity,
            options,
          );
        }
        async fetchPacketForSampleIndex(sampleIndex, options) {
          if (sampleIndex === -1) {
            return null;
          }
          const sampleTable = this.internalTrack.demuxer.getSampleTableForTrack(
            this.internalTrack,
          );
          const sampleInfo = getSampleInfo(sampleTable, sampleIndex);
          if (!sampleInfo) {
            return null;
          }
          let data;
          if (options.metadataOnly) {
            data = _packet_js__WEBPACK_IMPORTED_MODULE_5__.T;
          } else {
            let slice = this.internalTrack.demuxer.reader.requestSlice(
              sampleInfo.sampleOffset,
              sampleInfo.sampleSize,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(slice))
              slice = await slice;
            if (!slice) {
              return null;
            }
            data = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
              slice,
              sampleInfo.sampleSize,
            );
            if (this.internalTrack.encryptionInfo) {
              let sampleEncryption = null;
              if (this.internalTrack.encryptionAuxInfo) {
                const entries = await resolveEncryptionAuxInfo(
                  this.internalTrack.demuxer.reader,
                  this.internalTrack.encryptionInfo,
                  this.internalTrack.encryptionAuxInfo,
                );
                if (sampleIndex < entries.length) {
                  sampleEncryption = entries[sampleIndex];
                }
              }
              sampleEncryption ??= getDefaultSampleEncryption(
                this.internalTrack.encryptionInfo,
              );
              if (sampleEncryption) {
                data = await decryptSample(
                  this.internalTrack,
                  sampleEncryption,
                  data,
                  null,
                );
              }
            }
          }
          const timestamp =
            (sampleInfo.presentationTimestamp -
              this.internalTrack.editListOffset) /
            this.internalTrack.timescale;
          const duration = sampleInfo.duration / this.internalTrack.timescale;
          const packet = new _packet_js__WEBPACK_IMPORTED_MODULE_5__.Z(
            data,
            sampleInfo.isKeyFrame ? "key" : "delta",
            timestamp,
            duration,
            sampleIndex,
            sampleInfo.sampleSize,
          );
          this.packetToSampleIndex.set(packet, sampleIndex);
          return packet;
        }
        async fetchPacketInFragment(fragment, sampleIndex, options) {
          if (sampleIndex === -1) {
            return null;
          }
          const trackData = fragment.trackData.get(this.internalTrack.id);
          const fragmentSample = trackData.samples[sampleIndex];
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(fragmentSample);
          let data;
          if (options.metadataOnly) {
            data = _packet_js__WEBPACK_IMPORTED_MODULE_5__.T;
          } else {
            let slice = this.internalTrack.demuxer.reader.requestSlice(
              fragmentSample.byteOffset,
              fragmentSample.byteSize,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(slice))
              slice = await slice;
            if (!slice) {
              return null;
            }
            data = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(
              slice,
              fragmentSample.byteSize,
            );
            if (this.internalTrack.encryptionInfo) {
              const sampleEncryption =
                fragmentSample.encryption ??
                getDefaultSampleEncryption(this.internalTrack.encryptionInfo);
              if (sampleEncryption) {
                data = await decryptSample(
                  this.internalTrack,
                  sampleEncryption,
                  data,
                  fragment,
                );
              }
            }
          }
          const timestamp =
            (fragmentSample.presentationTimestamp -
              this.internalTrack.editListOffset) /
            this.internalTrack.timescale;
          const duration =
            fragmentSample.duration / this.internalTrack.timescale;
          const packet = new _packet_js__WEBPACK_IMPORTED_MODULE_5__.Z(
            data,
            fragmentSample.isKeyFrame ? "key" : "delta",
            timestamp,
            duration,
            fragment.moofOffset + sampleIndex,
            fragmentSample.byteSize,
          );
          this.packetToFragmentLocation.set(packet, { fragment, sampleIndex });
          return packet;
        }
        /** Looks for a packet in the fragments while trying to load as few fragments as possible to retrieve it. */
        async performFragmentedLookup(
          startFragment,
          getMatchInFragment,
          searchTimestamp,
          latestTimestamp,
          options,
        ) {
          const demuxer = this.internalTrack.demuxer;
          let currentFragment = null;
          let bestFragment = null;
          let bestSampleIndex = -1;
          if (startFragment) {
            const { sampleIndex, correctSampleFound } =
              getMatchInFragment(startFragment);
            if (correctSampleFound) {
              return this.fetchPacketInFragment(
                startFragment,
                sampleIndex,
                options,
              );
            }
            if (sampleIndex !== -1) {
              bestFragment = startFragment;
              bestSampleIndex = sampleIndex;
            }
          }
          const lookupEntryIndex = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
            this.internalTrack.fragmentLookupTable,
            searchTimestamp,
            (x) => x.timestamp,
          );
          const lookupEntry =
            lookupEntryIndex !== -1
              ? this.internalTrack.fragmentLookupTable[lookupEntryIndex]
              : null;
          const positionCacheIndex = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
            this.internalTrack.fragmentPositionCache,
            searchTimestamp,
            (x) => x.startTimestamp,
          );
          const positionCacheEntry =
            positionCacheIndex !== -1
              ? this.internalTrack.fragmentPositionCache[positionCacheIndex]
              : null;
          const lookupEntryPosition =
            Math.max(
              lookupEntry?.moofOffset ?? 0,
              positionCacheEntry?.moofOffset ?? 0,
            ) || null;
          let currentPos;
          if (!startFragment) {
            currentPos = lookupEntryPosition ?? 0;
          } else {
            if (
              lookupEntryPosition === null ||
              startFragment.moofOffset >= lookupEntryPosition
            ) {
              currentPos = startFragment.moofOffset + startFragment.moofSize;
              currentFragment = startFragment;
            } else {
              currentPos = lookupEntryPosition;
            }
          }
          while (true) {
            if (currentFragment) {
              const trackData = currentFragment.trackData.get(
                this.internalTrack.id,
              );
              if (trackData && trackData.startTimestamp > latestTimestamp) {
                break;
              }
            }
            let slice = demuxer.reader.requestSliceRange(
              currentPos,
              _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.ZM,
              _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Xk,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(slice))
              slice = await slice;
            if (!slice) break;
            const boxStartPos = currentPos;
            const boxInfo = (0,
            _isobmff_reader_js__WEBPACK_IMPORTED_MODULE_7__.Vl)(slice);
            if (!boxInfo) {
              break;
            }
            if (boxInfo.name === "moof") {
              currentFragment = await demuxer.readFragment(boxStartPos);
              const { sampleIndex, correctSampleFound } =
                getMatchInFragment(currentFragment);
              if (correctSampleFound) {
                return this.fetchPacketInFragment(
                  currentFragment,
                  sampleIndex,
                  options,
                );
              }
              if (sampleIndex !== -1) {
                bestFragment = currentFragment;
                bestSampleIndex = sampleIndex;
              }
            }
            currentPos = boxStartPos + boxInfo.totalSize;
          }
          if (
            lookupEntry &&
            (!bestFragment || bestFragment.moofOffset < lookupEntry.moofOffset)
          ) {
            const previousLookupEntry =
              this.internalTrack.fragmentLookupTable[lookupEntryIndex - 1];
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
              !previousLookupEntry ||
                previousLookupEntry.timestamp < lookupEntry.timestamp,
            );
            const newSearchTimestamp =
              previousLookupEntry?.timestamp ?? -Infinity;
            return this.performFragmentedLookup(
              null,
              getMatchInFragment,
              newSearchTimestamp,
              latestTimestamp,
              options,
            );
          }
          if (bestFragment) {
            return this.fetchPacketInFragment(
              bestFragment,
              bestSampleIndex,
              options,
            );
          }
          return null;
        }
      }
      class IsobmffVideoTrackBacking extends IsobmffTrackBacking {
        constructor(internalTrack) {
          super(internalTrack);
          this.decoderConfigPromise = null;
          this.internalTrack = internalTrack;
        }
        getType() {
          return "video";
        }
        getCodec() {
          return this.internalTrack.info.codec;
        }
        getCodedWidth() {
          return this.internalTrack.info.width;
        }
        getCodedHeight() {
          return this.internalTrack.info.height;
        }
        getSquarePixelWidth() {
          return this.internalTrack.info.squarePixelWidth;
        }
        getSquarePixelHeight() {
          return this.internalTrack.info.squarePixelHeight;
        }
        getRotation() {
          return this.internalTrack.rotation;
        }
        async getColorSpace() {
          const decoderConfig = await this.getDecoderConfig();
          if (!decoderConfig) {
            return this.internalTrack.info.colorSpace;
          }
          return {
            primaries: decoderConfig.colorSpace?.primaries,
            transfer: decoderConfig.colorSpace?.transfer,
            matrix: decoderConfig.colorSpace?.matrix,
            fullRange: decoderConfig.colorSpace?.fullRange,
          };
        }
        async canBeTransparent() {
          return (
            this.internalTrack.info.codec === "prores" &&
            (this.internalTrack.info.proresFormat === "ap4h" ||
              this.internalTrack.info.proresFormat === "ap4x")
          );
        }
        async getDecoderConfig() {
          if (!this.internalTrack.info.codec) {
            return null;
          }
          return (this.decoderConfigPromise ??= (async () => {
            if (
              this.internalTrack.info.codec === "avc" &&
              !this.internalTrack.info.codecDescription
            ) {
              const firstPacket = await this.getFirstPacket({});
              this.internalTrack.info.avcCodecInfo =
                firstPacket &&
                (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.fH)(
                  firstPacket.data,
                );
            } else if (
              this.internalTrack.info.codec === "hevc" &&
              !this.internalTrack.info.codecDescription
            ) {
              const firstPacket = await this.getFirstPacket({});
              this.internalTrack.info.hevcCodecInfo =
                firstPacket &&
                (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.D5)(
                  firstPacket.data,
                );
            } else if (
              this.internalTrack.info.codec === "vp9" &&
              (!this.internalTrack.info.vp9CodecInfo ||
                !(0, _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.$m)(
                  this.internalTrack.info.vp9CodecInfo,
                ))
            ) {
              const firstPacket = await this.getFirstPacket({});
              const packetInfo =
                firstPacket &&
                (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.bs)(
                  firstPacket.data,
                );
              if (packetInfo) {
                this.internalTrack.info.vp9CodecInfo = {
                  ...(this.internalTrack.info.vp9CodecInfo ?? packetInfo),
                  videoFullRangeFlag: packetInfo.videoFullRangeFlag,
                  colourPrimaries: packetInfo.colourPrimaries,
                  transferCharacteristics: packetInfo.transferCharacteristics,
                  matrixCoefficients: packetInfo.matrixCoefficients,
                };
              }
            } else if (
              this.internalTrack.info.codec === "av1" &&
              (!this.internalTrack.info.av1CodecInfo ||
                !(0, _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.et)(
                  this.internalTrack.info.av1CodecInfo,
                ))
            ) {
              const firstPacket = await this.getFirstPacket({});
              const packetInfo =
                firstPacket &&
                (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.UU)(
                  firstPacket.data,
                );
              if (packetInfo) {
                this.internalTrack.info.av1CodecInfo = packetInfo;
              }
            } else if (
              this.internalTrack.info.codec === "prores" &&
              !this.internalTrack.info.proresCodecInfo
            ) {
              const firstPacket = await this.getFirstPacket({});
              this.internalTrack.info.proresCodecInfo =
                firstPacket &&
                (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.RU)(
                  firstPacket.data,
                );
            }
            if (
              !(0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.HV)(
                this.internalTrack.info.colorSpace,
              )
            ) {
              const colorSpace = (0, _codec_js__WEBPACK_IMPORTED_MODULE_1__.LD)(
                this.internalTrack.info,
              );
              this.internalTrack.info.colorSpace.primaries ??=
                colorSpace.primaries;
              this.internalTrack.info.colorSpace.transfer ??=
                colorSpace.transfer;
              this.internalTrack.info.colorSpace.matrix ??= colorSpace.matrix;
              this.internalTrack.info.colorSpace.fullRange ??=
                colorSpace.fullRange;
            }
            const config = {
              codec: (0, _codec_js__WEBPACK_IMPORTED_MODULE_1__.QP)(
                this.internalTrack.info,
              ),
              codedWidth: this.internalTrack.info.width,
              codedHeight: this.internalTrack.info.height,
              description: this.internalTrack.info.codecDescription ?? void 0,
              colorSpace: this.internalTrack.info.colorSpace,
            };
            if (
              this.internalTrack.info.width !==
                this.internalTrack.info.squarePixelWidth ||
              this.internalTrack.info.height !==
                this.internalTrack.info.squarePixelHeight
            ) {
              config.displayAspectWidth =
                this.internalTrack.info.squarePixelWidth;
              config.displayAspectHeight =
                this.internalTrack.info.squarePixelHeight;
            }
            return config;
          })());
        }
      }
      class IsobmffAudioTrackBacking extends IsobmffTrackBacking {
        constructor(internalTrack) {
          super(internalTrack);
          this.decoderConfigPromise = null;
          this.internalTrack = internalTrack;
        }
        getType() {
          return "audio";
        }
        getCodec() {
          return this.internalTrack.info.codec;
        }
        getNumberOfChannels() {
          return this.internalTrack.info.numberOfChannels;
        }
        getSampleRate() {
          return this.internalTrack.info.sampleRate;
        }
        async getDecoderConfig() {
          if (!this.internalTrack.info.codec) {
            return null;
          }
          return (this.decoderConfigPromise ??= (async () => {
            if (
              this.internalTrack.info.codec === "dts" &&
              !this.internalTrack.info.dtsFormat
            ) {
              const firstPacket = await this.getFirstPacket({});
              this.internalTrack.info.dtsFormat =
                firstPacket &&
                (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_2__.n$)(
                  firstPacket.data,
                );
            }
            return {
              codec: (0, _codec_js__WEBPACK_IMPORTED_MODULE_1__.X0)(
                this.internalTrack.info,
              ),
              numberOfChannels: this.internalTrack.info.numberOfChannels,
              sampleRate: this.internalTrack.info.sampleRate,
              description: this.internalTrack.info.codecDescription ?? void 0,
            };
          })());
        }
      }
      const getSampleIndexForTimestamp = (sampleTable, timescaleUnits) => {
        if (sampleTable.presentationTimestamps) {
          const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
            sampleTable.presentationTimestamps,
            timescaleUnits,
            (x) => x.presentationTimestamp,
          );
          if (index === -1) {
            return -1;
          }
          return sampleTable.presentationTimestamps[index].sampleIndex;
        } else {
          const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
            sampleTable.sampleTimingEntries,
            timescaleUnits,
            (x) => x.startDecodeTimestamp,
          );
          if (index === -1) {
            return -1;
          }
          const entry = sampleTable.sampleTimingEntries[index];
          return (
            entry.startIndex +
            Math.min(
              Math.floor(
                (timescaleUnits - entry.startDecodeTimestamp) / entry.delta,
              ),
              entry.count - 1,
            )
          );
        }
      };
      const getKeyframeSampleIndexForTimestamp = (
        sampleTable,
        timescaleUnits,
      ) => {
        if (!sampleTable.keySampleIndices) {
          return getSampleIndexForTimestamp(sampleTable, timescaleUnits);
        }
        if (sampleTable.presentationTimestamps) {
          const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
            sampleTable.presentationTimestamps,
            timescaleUnits,
            (x) => x.presentationTimestamp,
          );
          if (index === -1) {
            return -1;
          }
          for (let i = index; i >= 0; i--) {
            const sampleIndex =
              sampleTable.presentationTimestamps[i].sampleIndex;
            const isKeyFrame =
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.pl)(
                sampleTable.keySampleIndices,
                sampleIndex,
                (x) => x,
              ) !== -1;
            if (isKeyFrame) {
              return sampleIndex;
            }
          }
          return -1;
        } else {
          const sampleIndex = getSampleIndexForTimestamp(
            sampleTable,
            timescaleUnits,
          );
          const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
            sampleTable.keySampleIndices,
            sampleIndex,
            (x) => x,
          );
          return sampleTable.keySampleIndices[index] ?? -1;
        }
      };
      const getSampleInfo = (sampleTable, sampleIndex) => {
        const timingEntryIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
          sampleTable.sampleTimingEntries,
          sampleIndex,
          (x) => x.startIndex,
        );
        const timingEntry = sampleTable.sampleTimingEntries[timingEntryIndex];
        if (
          !timingEntry ||
          timingEntry.startIndex + timingEntry.count <= sampleIndex
        ) {
          return null;
        }
        const decodeTimestamp =
          timingEntry.startDecodeTimestamp +
          (sampleIndex - timingEntry.startIndex) * timingEntry.delta;
        let presentationTimestamp = decodeTimestamp;
        const offsetEntryIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
          sampleTable.sampleCompositionTimeOffsets,
          sampleIndex,
          (x) => x.startIndex,
        );
        const offsetEntry =
          sampleTable.sampleCompositionTimeOffsets[offsetEntryIndex];
        if (
          offsetEntry &&
          sampleIndex - offsetEntry.startIndex < offsetEntry.count
        ) {
          presentationTimestamp += offsetEntry.offset;
        }
        const sampleSize =
          sampleTable.sampleSizes[
            Math.min(sampleIndex, sampleTable.sampleSizes.length - 1)
          ];
        const chunkEntryIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
          sampleTable.sampleToChunk,
          sampleIndex,
          (x) => x.startSampleIndex,
        );
        const chunkEntry = sampleTable.sampleToChunk[chunkEntryIndex];
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(chunkEntry);
        const chunkIndex =
          chunkEntry.startChunkIndex +
          Math.floor(
            (sampleIndex - chunkEntry.startSampleIndex) /
              chunkEntry.samplesPerChunk,
          );
        const chunkOffset = sampleTable.chunkOffsets[chunkIndex];
        const startSampleIndexOfChunk =
          chunkEntry.startSampleIndex +
          (chunkIndex - chunkEntry.startChunkIndex) *
            chunkEntry.samplesPerChunk;
        let chunkSize = 0;
        let sampleOffset = chunkOffset;
        if (sampleTable.sampleSizes.length === 1) {
          sampleOffset += sampleSize * (sampleIndex - startSampleIndexOfChunk);
          chunkSize += sampleSize * chunkEntry.samplesPerChunk;
        } else {
          for (
            let i = startSampleIndexOfChunk;
            i < startSampleIndexOfChunk + chunkEntry.samplesPerChunk;
            i++
          ) {
            const sampleSize2 = sampleTable.sampleSizes[i];
            if (i < sampleIndex) {
              sampleOffset += sampleSize2;
            }
            chunkSize += sampleSize2;
          }
        }
        let duration = timingEntry.delta;
        if (sampleTable.presentationTimestamps) {
          const presentationIndex =
            sampleTable.presentationTimestampIndexMap[sampleIndex];
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            presentationIndex !== void 0,
          );
          if (
            presentationIndex <
            sampleTable.presentationTimestamps.length - 1
          ) {
            const nextEntry =
              sampleTable.presentationTimestamps[presentationIndex + 1];
            const nextPresentationTimestamp = nextEntry.presentationTimestamp;
            duration = nextPresentationTimestamp - presentationTimestamp;
          }
        }
        return {
          presentationTimestamp,
          duration,
          sampleOffset,
          sampleSize,
          chunkOffset,
          chunkSize,
          isKeyFrame: sampleTable.keySampleIndices
            ? (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.pl)(
                sampleTable.keySampleIndices,
                sampleIndex,
                (x) => x,
              ) !== -1
            : true,
        };
      };
      const getNextKeyframeIndexForSample = (sampleTable, sampleIndex) => {
        if (!sampleTable.keySampleIndices) {
          return sampleIndex + 1;
        }
        const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
          sampleTable.keySampleIndices,
          sampleIndex,
          (x) => x,
        );
        return sampleTable.keySampleIndices[index + 1] ?? -1;
      };
      const offsetFragmentTrackDataByTimestamp = (trackData, timestamp) => {
        trackData.startTimestamp += timestamp;
        trackData.endTimestamp += timestamp;
        for (const sample of trackData.samples) {
          sample.presentationTimestamp += timestamp;
        }
        for (const entry of trackData.presentationTimestamps) {
          entry.presentationTimestamp += timestamp;
        }
      };
      const extractRotationFromMatrix = (matrix) => {
        const [a, b] = matrix;
        const radians = Math.atan2(b, a);
        if (!Number.isFinite(radians)) {
          return 0;
        }
        return radians * (180 / Math.PI);
      };
      const sampleTableIsEmpty = (sampleTable) => {
        return sampleTable.sampleSizes.length === 0;
      };
      const getOrCreateEncryptionAuxInfo = (track) => {
        if (track.currentFragmentState) {
          return (track.currentFragmentState.encryptionAuxInfo ??= {
            defaultSampleInfoSize: 0,
            sampleSizes: null,
            sampleCount: 0,
            offset: null,
            resolved: null,
          });
        } else {
          return (track.encryptionAuxInfo ??= {
            defaultSampleInfoSize: 0,
            sampleSizes: null,
            sampleCount: 0,
            offset: null,
            resolved: null,
          });
        }
      };
      const resolveEncryptionAuxInfo = async (reader, encryptionInfo, aux) => {
        if (aux.resolved) {
          return aux.resolved;
        }
        if (aux.offset === null || aux.sampleCount === 0) {
          throw new Error(
            "Incomplete saiz/saio info; cannot resolve encryption data.",
          );
        }
        let totalSize = 0;
        if (aux.defaultSampleInfoSize > 0) {
          totalSize = aux.defaultSampleInfoSize * aux.sampleCount;
        } else {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(aux.sampleSizes);
          for (let i = 0; i < aux.sampleCount; i++) {
            totalSize += aux.sampleSizes[i];
          }
        }
        let slice = reader.requestSlice(aux.offset, totalSize);
        if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(slice))
          slice = await slice;
        if (!slice) {
          throw new Error("Failed to read auxiliary encryption info.");
        }
        const ivSize = encryptionInfo.defaultPerSampleIvSize;
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(ivSize !== null);
        const entries = [];
        for (let i = 0; i < aux.sampleCount; i++) {
          const entrySize =
            aux.defaultSampleInfoSize > 0
              ? aux.defaultSampleInfoSize
              : aux.sampleSizes[i];
          const iv = new Uint8Array(16);
          if (ivSize > 0) {
            iv.set(
              (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.io)(slice, ivSize),
              0,
            );
          } else {
            iv.set(encryptionInfo.defaultConstantIv, 0);
          }
          let subsamples = null;
          if (entrySize > ivSize) {
            const subsampleCount = (0,
            _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(slice);
            subsamples = [];
            for (let j = 0; j < subsampleCount; j++) {
              const clearLen = (0, _reader_js__WEBPACK_IMPORTED_MODULE_8__.mH)(
                slice,
              );
              const protectedLen = (0,
              _reader_js__WEBPACK_IMPORTED_MODULE_8__.cN)(slice);
              subsamples.push({ clearLen, protectedLen });
            }
          }
          entries.push({ iv, subsamples });
        }
        aux.resolved = entries;
        return entries;
      };
      const getDefaultSampleEncryption = (encryptionInfo) => {
        if (!encryptionInfo.defaultConstantIv) {
          return null;
        }
        return {
          iv: encryptionInfo.defaultConstantIv,
          subsamples: null,
        };
      };
      const decryptSample = async (track, sampleEncryption, data, fragment) => {
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(track.encryptionInfo);
        const encryptionInfo = track.encryptionInfo;
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
          encryptionInfo.defaultKid !== null,
        );
        const keyId = encryptionInfo.defaultKid;
        let keyBytes;
        const cacheEntry = track.demuxer.decryptionKeyCache.get(keyId);
        if (cacheEntry) {
          keyBytes = await cacheEntry;
        } else {
          if (!track.demuxer.input._formatOptions.isobmff?.resolveKeyId) {
            throw new Error(
              "Encrypted media samples encountered. To decrypt them, please provide a callback for InputOptions.formatOptions.isobmff.resolveKeyId.",
            );
          }
          const promise = (async () => {
            let psshBoxes = track.demuxer.psshBoxes;
            if (fragment) {
              psshBoxes = [...psshBoxes, ...fragment.psshBoxes].filter(
                (x) => x.keyIds === null || x.keyIds.includes(keyId),
              );
              for (let i = 0; i < psshBoxes.length - 1; i++) {
                for (let j = i + 1; j < psshBoxes.length; j++) {
                  if (
                    (0, _isobmff_misc_js__WEBPACK_IMPORTED_MODULE_6__.MG)(
                      psshBoxes[i],
                      psshBoxes[j],
                    )
                  ) {
                    psshBoxes.splice(j, 1);
                    j--;
                  }
                }
              }
            }
            const keyResult =
              await track.demuxer.input._formatOptions.isobmff.resolveKeyId({
                keyId,
                psshBoxes,
              });
            if (!(
              (typeof keyResult === "string" &&
                keyResult.length === 32 &&
                _misc_js__WEBPACK_IMPORTED_MODULE_4__.Sn.test(keyResult)) ||
              (keyResult instanceof Uint8Array && keyResult.byteLength === 16)
            )) {
              throw new TypeError(
                "resolveKeyId must return a 32-character hex string or a 16-byte Uint8Array containing the decryption key.",
              );
            }
            return keyResult instanceof Uint8Array
              ? keyResult
              : (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.ZY)(keyResult);
          })();
          track.demuxer.decryptionKeyCache.set(keyId, promise);
          keyBytes = await promise;
        }
        if (
          encryptionInfo.scheme === "cenc" ||
          encryptionInfo.scheme === "cens"
        ) {
          return decryptCtr(keyBytes, encryptionInfo, sampleEncryption, data);
        } else {
          return decryptCbcs(keyBytes, encryptionInfo, sampleEncryption, data);
        }
      };
      const decryptCtr = async (
        key,
        encryptionInfo,
        sampleEncryption,
        data,
      ) => {
        const counter = new Uint8Array(16);
        counter.set(sampleEncryption.iv, 0);
        const cryptoKey = await crypto.subtle.importKey(
          "raw",
          key,
          { name: "AES-CTR" },
          false,
          ["decrypt"],
        );
        const cryptApply = async (input) => {
          const plaintext = await crypto.subtle.decrypt(
            { name: "AES-CTR", counter, length: 64 },
            cryptoKey,
            input,
          );
          return new Uint8Array(plaintext);
        };
        if (!sampleEncryption.subsamples) {
          return cryptApply(data);
        }
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
          encryptionInfo.defaultCryptByteBlock !== null &&
            encryptionInfo.defaultSkipByteBlock !== null,
        );
        const cryptRanges = collectCryptRanges(
          sampleEncryption.subsamples,
          encryptionInfo.defaultCryptByteBlock,
          encryptionInfo.defaultSkipByteBlock,
        );
        let totalCryptLen = 0;
        for (const range of cryptRanges) {
          for (const seg of range.perSubsample) {
            totalCryptLen += seg.length;
          }
        }
        const cryptBuffer = new Uint8Array(totalCryptLen);
        let writePos = 0;
        for (const range of cryptRanges) {
          for (const seg of range.perSubsample) {
            cryptBuffer.set(
              data.subarray(seg.offset, seg.offset + seg.length),
              writePos,
            );
            writePos += seg.length;
          }
        }
        const plain = await cryptApply(cryptBuffer);
        const output = new Uint8Array(data);
        let readPos = 0;
        for (const range of cryptRanges) {
          for (const seg of range.perSubsample) {
            output.set(
              plain.subarray(readPos, readPos + seg.length),
              seg.offset,
            );
            readPos += seg.length;
          }
        }
        return output;
      };
      const decryptCbcs = (key, encryptionInfo, sampleEncryption, data) => {
        const ctx = new _aes_js__WEBPACK_IMPORTED_MODULE_12__.UP();
        ctx.init({ key, iv: sampleEncryption.iv });
        const cryptByteBlock = encryptionInfo.defaultCryptByteBlock;
        const skipByteBlock = encryptionInfo.defaultSkipByteBlock;
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
          cryptByteBlock !== null && skipByteBlock !== null,
        );
        if (!sampleEncryption.subsamples) {
          const output2 = new Uint8Array(data);
          const numBlocks = Math.floor(data.length / 16);
          for (let b = 0; b < numBlocks; b++) {
            const off = b * 16;
            ctx.in.set(data.subarray(off, off + 16));
            ctx.decrypt();
            output2.set(ctx.out, off);
          }
          return output2;
        }
        if (cryptByteBlock === 0 && skipByteBlock === 0) {
          throw new Error("cbcs with subsamples requires pattern encryption.");
        }
        const output = new Uint8Array(data);
        const cryptRanges = collectCryptRanges(
          sampleEncryption.subsamples,
          cryptByteBlock,
          skipByteBlock,
        );
        const ivView = new DataView(
          sampleEncryption.iv.buffer,
          sampleEncryption.iv.byteOffset,
          16,
        );
        for (const range of cryptRanges) {
          ctx.iv[0] = ivView.getUint32(0, false);
          ctx.iv[1] = ivView.getUint32(4, false);
          ctx.iv[2] = ivView.getUint32(8, false);
          ctx.iv[3] = ivView.getUint32(12, false);
          for (const seg of range.perSubsample) {
            const numBlocks = seg.length / 16;
            for (let b = 0; b < numBlocks; b++) {
              const offset = seg.offset + b * 16;
              ctx.in.set(data.subarray(offset, offset + 16));
              ctx.decrypt();
              output.set(ctx.out, offset);
            }
          }
        }
        return output;
      };
      const collectCryptRanges = (
        subsamples,
        cryptByteBlock,
        skipByteBlock,
      ) => {
        const ranges = [];
        const hasPattern = cryptByteBlock !== 0 || skipByteBlock !== 0;
        let cursor = 0;
        for (const subsample of subsamples) {
          cursor += subsample.clearLen;
          const perSubsample = [];
          if (!hasPattern) {
            if (subsample.protectedLen > 0) {
              perSubsample.push({
                offset: cursor,
                length: subsample.protectedLen,
              });
            }
            cursor += subsample.protectedLen;
          } else {
            let remaining = subsample.protectedLen;
            let pos = cursor;
            while (remaining > 0) {
              if (remaining < 16 * cryptByteBlock) {
                break;
              }
              const cryptBytes = 16 * cryptByteBlock;
              perSubsample.push({ offset: pos, length: cryptBytes });
              pos += cryptBytes;
              remaining -= cryptBytes;
              const skipBytes = Math.min(16 * skipByteBlock, remaining);
              pos += skipBytes;
              remaining -= skipBytes;
            }
            cursor += subsample.protectedLen;
          }
          ranges.push({ perSubsample });
        }
        return ranges;
      };
    },
    /***/
    2997(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        MG: () =>
          /* binding */
          psshBoxesAreEqual,
        /* harmony export */
        Xh: () =>
          /* binding */
          buildIsobmffMimeType,
        /* harmony export */
        j1: () =>
          /* binding */
          parsePsshBoxContents,
        /* harmony export */
      });
      var _misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6760);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const buildIsobmffMimeType = (info) => {
        const base = info.hasVideo
          ? "video/"
          : info.hasAudio
            ? "audio/"
            : "application/";
        let string = base + (info.isQuickTime ? "quicktime" : "mp4");
        if (info.codecStrings.length > 0) {
          const uniqueCodecMimeTypes = [...new Set(info.codecStrings)];
          string += '; codecs="'.concat(uniqueCodecMimeTypes.join(", "), '"');
        }
        return string;
      };
      const parsePsshBoxContents = (contents) => {
        const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Zc)(contents);
        let pos = 0;
        const version = view.getUint8(pos);
        pos += 1;
        pos += 3;
        const systemId = (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Br)(
          contents.subarray(pos, pos + 16),
        );
        pos += 16;
        let keyIds = null;
        if (version > 0) {
          const kidCount = view.getUint32(pos);
          pos += 4;
          if (kidCount > 0) {
            keyIds = [];
            for (let i = 0; i < kidCount; i++) {
              keyIds.push(
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.Br)(
                  contents.subarray(pos, pos + 16),
                ),
              );
              pos += 16;
            }
          }
        }
        const dataSize = view.getUint32(pos);
        pos += 4;
        return {
          systemId,
          keyIds,
          data: contents.slice(pos, pos + dataSize),
        };
      };
      const psshBoxesAreEqual = (a, b) =>
        a.systemId === b.systemId &&
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_0__.ju)(a.data, b.data);
    },
    /***/
    8689(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        $L: () =>
          /* binding */
          readMetadataStringShort,
        /* harmony export */
        Cp: () =>
          /* binding */
          readDataBox,
        /* harmony export */
        IS: () =>
          /* binding */
          readFixed_2_30,
        /* harmony export */
        Vl: () =>
          /* binding */
          readBoxHeader,
        /* harmony export */
        Xk: () =>
          /* binding */
          MAX_BOX_HEADER_SIZE,
        /* harmony export */
        ZM: () =>
          /* binding */
          MIN_BOX_HEADER_SIZE,
        /* harmony export */
        hs: () =>
          /* binding */
          readIsomVariableInteger,
        /* harmony export */
        vX: () =>
          /* binding */
          readFixed_16_16,
        /* harmony export */
      });
      var _metadata_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8957);
      var _misc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6760);
      var _reader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const MIN_BOX_HEADER_SIZE = 8;
      const MAX_BOX_HEADER_SIZE = 16;
      const readBoxHeader = (slice) => {
        let totalSize = (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.cN)(slice);
        const name = (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.IT)(slice, 4);
        let headerSize = 8;
        const hasLargeSize = totalSize === 1;
        if (hasLargeSize) {
          totalSize = (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.th)(slice);
          headerSize = 16;
        }
        const contentSize = totalSize - headerSize;
        if (contentSize < 0) {
          return null;
        }
        return { name, totalSize, headerSize, contentSize };
      };
      const readFixed_16_16 = (slice) => {
        return (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.Ar)(slice) / 65536;
      };
      const readFixed_2_30 = (slice) => {
        return (
          (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.Ar)(slice) / 1073741824
        );
      };
      const readIsomVariableInteger = (slice) => {
        let result = 0;
        for (let i = 0; i < 4; i++) {
          result <<= 7;
          const nextByte = (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.eo)(
            slice,
          );
          result |= nextByte & 127;
          if ((nextByte & 128) === 0) {
            break;
          }
        }
        return result;
      };
      const readMetadataStringShort = (slice) => {
        let stringLength = (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.mH)(
          slice,
        );
        slice.skip(2);
        stringLength = Math.min(stringLength, slice.remainingLength);
        return _misc_js__WEBPACK_IMPORTED_MODULE_1__.su.decode(
          (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.io)(slice, stringLength),
        );
      };
      const readDataBox = (slice) => {
        const header = readBoxHeader(slice);
        if (!header || header.name !== "data") {
          return null;
        }
        if (slice.remainingLength < 8) {
          return null;
        }
        const typeIndicator = (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.cN)(
          slice,
        );
        slice.skip(4);
        const data = (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.io)(
          slice,
          header.contentSize - 8,
        );
        switch (typeIndicator) {
          case 1:
            return _misc_js__WEBPACK_IMPORTED_MODULE_1__.su.decode(data);
          // UTF-8
          case 2:
            return new TextDecoder("utf-16be").decode(data);
          // UTF-16-BE
          case 13:
            return new _metadata_js__WEBPACK_IMPORTED_MODULE_0__.sF(
              data,
              "image/jpeg",
            );
          case 14:
            return new _metadata_js__WEBPACK_IMPORTED_MODULE_0__.sF(
              data,
              "image/png",
            );
          case 27:
            return new _metadata_js__WEBPACK_IMPORTED_MODULE_0__.sF(
              data,
              "image/bmp",
            );
          default:
            return data;
        }
      };
    },
    /***/
    9815(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        y: () =>
          /* binding */
          Logging,
        /* harmony export */
      });
      var _misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6760);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      var LogLevel;
      (function (LogLevel2) {
        LogLevel2[(LogLevel2["Silent"] = 0)] = "Silent";
        LogLevel2[(LogLevel2["Errors"] = 1)] = "Errors";
        LogLevel2[(LogLevel2["Warnings"] = 2)] = "Warnings";
        LogLevel2[(LogLevel2["Info"] = 3)] = "Info";
      })(LogLevel || (LogLevel = {}));
      class Logging {
        constructor() {}
        /** The current log level. Defaults to {@link LogLevel.Info}. */
        static get level() {
          return Logging._level;
        }
        static set level(value) {
          if (
            value !== LogLevel.Silent &&
            value !== LogLevel.Errors &&
            value !== LogLevel.Warnings &&
            value !== LogLevel.Info
          ) {
            throw new TypeError(
              "Invalid log level. Use one of the values of the LogLevel enum.",
            );
          }
          Logging._level = value;
        }
        /** @internal */
        static get _emitter() {
          return (Logging._emitterInstance ??=
            new _misc_js__WEBPACK_IMPORTED_MODULE_0__.bk());
        }
        /** Registers a listener for a log event. Returns a function that, when called, removes the listener again. */
        static on(event, listener, options) {
          return Logging._emitter.on(event, listener, options);
        }
        /** @internal */
        static _error(...args) {
          Logging._emitter._emit("error", args);
          if (Logging._level >= LogLevel.Errors) {
            console.error(...args);
          }
        }
        /** @internal */
        static _warn(...args) {
          Logging._emitter._emit("warn", args);
          if (Logging._level >= LogLevel.Warnings) {
            console.warn(...args);
          }
        }
        /** @internal */
        static _info(...args) {
          Logging._emitter._emit("info", args);
          if (Logging._level >= LogLevel.Info) {
            console.info(...args);
          }
        }
      }
      Logging._level = LogLevel.Info;
      Logging._emitterInstance = null;
    },
    /***/
    1514(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        N: () =>
          /* binding */
          MatroskaDemuxer,
        /* harmony export */
      });
      var _codec_data_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(9705);
      var _codec_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8276);
      var _demuxer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2114);
      var _logging_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9815);
      var _metadata_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8957);
      var _misc_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6760);
      var _packet_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6016);
      var _ebml_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8059);
      var _matroska_misc_js__WEBPACK_IMPORTED_MODULE_8__ =
        __webpack_require__(160);
      var _reader_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      var BlockLacing;
      (function (BlockLacing2) {
        BlockLacing2[(BlockLacing2["None"] = 0)] = "None";
        BlockLacing2[(BlockLacing2["Xiph"] = 1)] = "Xiph";
        BlockLacing2[(BlockLacing2["FixedSize"] = 2)] = "FixedSize";
        BlockLacing2[(BlockLacing2["Ebml"] = 3)] = "Ebml";
      })(BlockLacing || (BlockLacing = {}));
      var ContentEncodingScope;
      (function (ContentEncodingScope2) {
        ContentEncodingScope2[(ContentEncodingScope2["Block"] = 1)] = "Block";
        ContentEncodingScope2[(ContentEncodingScope2["Private"] = 2)] =
          "Private";
        ContentEncodingScope2[(ContentEncodingScope2["Next"] = 4)] = "Next";
      })(ContentEncodingScope || (ContentEncodingScope = {}));
      var ContentCompAlgo;
      (function (ContentCompAlgo2) {
        ContentCompAlgo2[(ContentCompAlgo2["Zlib"] = 0)] = "Zlib";
        ContentCompAlgo2[(ContentCompAlgo2["Bzlib"] = 1)] = "Bzlib";
        ContentCompAlgo2[(ContentCompAlgo2["lzo1x"] = 2)] = "lzo1x";
        ContentCompAlgo2[(ContentCompAlgo2["HeaderStripping"] = 3)] =
          "HeaderStripping";
      })(ContentCompAlgo || (ContentCompAlgo = {}));
      const METADATA_ELEMENTS = [
        {
          id: _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.SeekHead,
          flag: "seekHeadSeen",
        },
        { id: _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Info, flag: "infoSeen" },
        {
          id: _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Tracks,
          flag: "tracksSeen",
        },
        { id: _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Cues, flag: "cuesSeen" },
      ];
      const MAX_RESYNC_LENGTH = 10 * 2 ** 20;
      class MatroskaDemuxer extends _demuxer_js__WEBPACK_IMPORTED_MODULE_2__.B {
        constructor(input) {
          super(input);
          this.readMetadataPromise = null;
          this.segments = [];
          this.currentSegment = null;
          this.currentTrack = null;
          this.currentCluster = null;
          this.currentBlock = null;
          this.currentBlockAdditional = null;
          this.currentCueTime = null;
          this.currentDecodingInstruction = null;
          this.currentTagTargetIsMovie = true;
          this.currentSimpleTagName = null;
          this.currentAttachedFile = null;
          this.isWebM = false;
          this.reader = input._reader;
        }
        async getTrackBackings() {
          await this.readMetadata();
          return this.segments.flatMap((segment) =>
            segment.tracks.map((track) => track.trackBacking),
          );
        }
        async getMimeType() {
          await this.readMetadata();
          const backings = await this.getTrackBackings();
          const codecStrings = await Promise.all(
            backings.map((x) =>
              x.getDecoderConfig().then((c) => c?.codec ?? null),
            ),
          );
          return (0, _matroska_misc_js__WEBPACK_IMPORTED_MODULE_8__.V)({
            isWebM: this.isWebM,
            hasVideo: this.segments.some((segment) =>
              segment.tracks.some((x) => x.info?.type === "video"),
            ),
            hasAudio: this.segments.some((segment) =>
              segment.tracks.some((x) => x.info?.type === "audio"),
            ),
            codecStrings: codecStrings.filter(Boolean),
          });
        }
        async getMetadataTags() {
          await this.readMetadata();
          for (const segment of this.segments) {
            if (!segment.metadataTagsCollected) {
              if (this.reader.fileSize !== null) {
                await this.loadSegmentMetadata(segment);
              } else {
              }
              segment.metadataTagsCollected = true;
            }
          }
          let metadataTags = {};
          for (const segment of this.segments) {
            metadataTags = { ...metadataTags, ...segment.metadataTags };
          }
          return metadataTags;
        }
        readMetadata() {
          return (this.readMetadataPromise ??= (async () => {
            let currentPos = 0;
            while (true) {
              let slice = this.reader.requestSliceRange(
                currentPos,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.De,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.r1,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(slice))
                slice = await slice;
              if (!slice) break;
              const header = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.ur)(
                slice,
              );
              if (!header) {
                break;
              }
              const id = header.id;
              let size = header.size;
              const dataStartPos = slice.filePos;
              if (id === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.EBML) {
                (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.p)(size);
                let slice2 = this.reader.requestSlice(dataStartPos, size);
                if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(slice2))
                  slice2 = await slice2;
                if (!slice2) break;
                this.readContiguousElements(slice2);
              } else if (
                id === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Segment
              ) {
                await this.readSegment(dataStartPos, size);
                if (size === void 0) {
                  break;
                }
                if (this.reader.fileSize === null) {
                  break;
                }
              } else if (
                id === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Cluster
              ) {
                if (this.reader.fileSize === null) {
                  break;
                }
                if (size === void 0) {
                  const nextElementPos = await (0,
                  _ebml_js__WEBPACK_IMPORTED_MODULE_7__.IQ)(
                    this.reader,
                    dataStartPos,
                    _ebml_js__WEBPACK_IMPORTED_MODULE_7__.K9,
                    this.reader.fileSize,
                  );
                  size = nextElementPos.pos - dataStartPos;
                }
                const lastSegment = (0,
                _misc_js__WEBPACK_IMPORTED_MODULE_5__._g)(this.segments);
                if (lastSegment) {
                  lastSegment.elementEndPos = dataStartPos + size;
                }
              }
              (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.p)(size);
              currentPos = dataStartPos + size;
            }
          })());
        }
        async readSegment(segmentDataStart, dataSize) {
          this.currentSegment = {
            seekHeadSeen: false,
            infoSeen: false,
            tracksSeen: false,
            cuesSeen: false,
            tagsSeen: false,
            attachmentsSeen: false,
            timestampScale: -1,
            timestampFactor: -1,
            duration: -1,
            seekEntries: [],
            tracks: [],
            cuePoints: [],
            dataStartPos: segmentDataStart,
            elementEndPos:
              dataSize === void 0 ? null : segmentDataStart + dataSize,
            clusterSeekStartPos: segmentDataStart,
            lastReadCluster: null,
            metadataTags: {},
            metadataTagsCollected: false,
          };
          this.segments.push(this.currentSegment);
          let currentPos = segmentDataStart;
          while (
            this.currentSegment.elementEndPos === null ||
            currentPos < this.currentSegment.elementEndPos
          ) {
            let slice = this.reader.requestSliceRange(
              currentPos,
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.De,
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.r1,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(slice))
              slice = await slice;
            if (!slice) break;
            const elementStartPos = currentPos;
            const header = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.ur)(slice);
            if (
              !header ||
              (!_ebml_js__WEBPACK_IMPORTED_MODULE_7__.VE.includes(header.id) &&
                header.id !== _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Void)
            ) {
              const nextPos = await (0,
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.nE)(
                this.reader,
                elementStartPos,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.VE,
                Math.min(
                  this.currentSegment.elementEndPos ?? Infinity,
                  elementStartPos + MAX_RESYNC_LENGTH,
                ),
              );
              if (nextPos) {
                currentPos = nextPos;
                continue;
              } else {
                break;
              }
            }
            const { id, size } = header;
            const dataStartPos = slice.filePos;
            const metadataElementIndex = METADATA_ELEMENTS.findIndex(
              (x) => x.id === id,
            );
            if (metadataElementIndex !== -1) {
              const field = METADATA_ELEMENTS[metadataElementIndex].flag;
              this.currentSegment[field] = true;
              (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.p)(size);
              let slice2 = this.reader.requestSlice(dataStartPos, size);
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(slice2))
                slice2 = await slice2;
              if (slice2) {
                this.readContiguousElements(slice2);
              }
            } else if (
              id === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Tags ||
              id === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Attachments
            ) {
              if (id === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Tags) {
                this.currentSegment.tagsSeen = true;
              } else {
                this.currentSegment.attachmentsSeen = true;
              }
              (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.p)(size);
              let slice2 = this.reader.requestSlice(dataStartPos, size);
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(slice2))
                slice2 = await slice2;
              if (slice2) {
                this.readContiguousElements(slice2);
              }
            } else if (
              id === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Cluster
            ) {
              this.currentSegment.clusterSeekStartPos = elementStartPos;
              break;
            }
            if (size === void 0) {
              break;
            } else {
              currentPos = dataStartPos + size;
            }
          }
          this.currentSegment.seekEntries.sort(
            (a, b) => a.segmentPosition - b.segmentPosition,
          );
          if (this.reader.fileSize !== null) {
            for (const seekEntry of this.currentSegment.seekEntries) {
              const target = METADATA_ELEMENTS.find(
                (x) => x.id === seekEntry.id,
              );
              if (!target) {
                continue;
              }
              if (this.currentSegment[target.flag]) continue;
              let slice = this.reader.requestSliceRange(
                segmentDataStart + seekEntry.segmentPosition,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.De,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.r1,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(slice))
                slice = await slice;
              if (!slice) continue;
              const header = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.ur)(
                slice,
              );
              if (!header) continue;
              const { id, size } = header;
              if (id !== target.id) continue;
              (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.p)(size);
              this.currentSegment[target.flag] = true;
              let dataSlice = this.reader.requestSlice(slice.filePos, size);
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(dataSlice))
                dataSlice = await dataSlice;
              if (!dataSlice) continue;
              this.readContiguousElements(dataSlice);
            }
          }
          if (this.currentSegment.timestampScale === -1) {
            this.currentSegment.timestampScale = 1e6;
            this.currentSegment.timestampFactor = 1e9 / 1e6;
          }
          for (const track of this.currentSegment.tracks) {
            if (track.defaultDurationNs !== null) {
              track.defaultDuration =
                (this.currentSegment.timestampFactor *
                  track.defaultDurationNs) /
                1e9;
            }
          }
          const idToTrack = new Map(
            this.currentSegment.tracks.map((x) => [x.id, x]),
          );
          for (const cuePoint of this.currentSegment.cuePoints) {
            const track = idToTrack.get(cuePoint.trackId);
            if (track) {
              track.cuePoints.push(cuePoint);
            }
          }
          for (const track of this.currentSegment.tracks) {
            track.cuePoints.sort((a, b) => a.time - b.time);
            for (let i = 0; i < track.cuePoints.length - 1; i++) {
              const cuePoint1 = track.cuePoints[i];
              const cuePoint2 = track.cuePoints[i + 1];
              if (cuePoint1.time === cuePoint2.time) {
                track.cuePoints.splice(i + 1, 1);
                i--;
              }
            }
          }
          let trackWithMostCuePoints = null;
          let maxCuePointCount = -Infinity;
          for (const track of this.currentSegment.tracks) {
            if (track.cuePoints.length > maxCuePointCount) {
              maxCuePointCount = track.cuePoints.length;
              trackWithMostCuePoints = track;
            }
          }
          for (const track of this.currentSegment.tracks) {
            if (track.cuePoints.length === 0) {
              track.cuePoints = trackWithMostCuePoints.cuePoints;
            }
          }
          this.currentSegment = null;
        }
        async readCluster(startPos, segment) {
          if (segment.lastReadCluster?.elementStartPos === startPos) {
            return segment.lastReadCluster;
          }
          let headerSlice = this.reader.requestSliceRange(
            startPos,
            _ebml_js__WEBPACK_IMPORTED_MODULE_7__.De,
            _ebml_js__WEBPACK_IMPORTED_MODULE_7__.r1,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(headerSlice))
            headerSlice = await headerSlice;
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(headerSlice);
          const elementStartPos = startPos;
          const elementHeader = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.ur)(
            headerSlice,
          );
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(elementHeader);
          const id = elementHeader.id;
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
            id === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Cluster,
          );
          let size = elementHeader.size;
          const dataStartPos = headerSlice.filePos;
          if (size === void 0) {
            const nextElementPos = await (0,
            _ebml_js__WEBPACK_IMPORTED_MODULE_7__.IQ)(
              this.reader,
              dataStartPos,
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.K9,
              segment.elementEndPos,
            );
            size = nextElementPos.pos - dataStartPos;
          }
          let dataSlice = this.reader.requestSlice(dataStartPos, size);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(dataSlice))
            dataSlice = await dataSlice;
          const cluster = {
            segment,
            elementStartPos,
            elementEndPos: dataStartPos + size,
            dataStartPos,
            timestamp: -1,
            trackData: /* @__PURE__ */ new Map(),
          };
          this.currentCluster = cluster;
          if (dataSlice) {
            const endPos = this.readContiguousElements(
              dataSlice,
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.K9,
            );
            cluster.elementEndPos = endPos;
          }
          for (const [, trackData] of cluster.trackData) {
            const track = trackData.track;
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
              trackData.blocks.length > 0,
            );
            let hasLacedBlocks = false;
            for (let i = 0; i < trackData.blocks.length; i++) {
              const block = trackData.blocks[i];
              block.timestamp += cluster.timestamp;
              hasLacedBlocks ||= block.lacing !== BlockLacing.None;
            }
            trackData.presentationTimestamps = trackData.blocks
              .map((block, i) => ({
                timestamp: block.timestamp,
                blockIndex: i,
              }))
              .sort((a, b) => a.timestamp - b.timestamp);
            for (let i = 0; i < trackData.presentationTimestamps.length; i++) {
              const currentEntry = trackData.presentationTimestamps[i];
              const currentBlock = trackData.blocks[currentEntry.blockIndex];
              if (
                trackData.firstKeyFrameTimestamp === null &&
                currentBlock.isKeyFrame
              ) {
                trackData.firstKeyFrameTimestamp = currentBlock.timestamp;
              }
              if (i < trackData.presentationTimestamps.length - 1) {
                const nextEntry = trackData.presentationTimestamps[i + 1];
                currentBlock.duration =
                  nextEntry.timestamp - currentBlock.timestamp;
              } else if (currentBlock.duration === 0) {
                if (track.defaultDuration != null) {
                  if (currentBlock.lacing === BlockLacing.None) {
                    currentBlock.duration = track.defaultDuration;
                  } else {
                  }
                }
              }
            }
            if (hasLacedBlocks) {
              this.expandLacedBlocks(trackData.blocks, track);
              trackData.presentationTimestamps = trackData.blocks
                .map((block, i) => ({
                  timestamp: block.timestamp,
                  blockIndex: i,
                }))
                .sort((a, b) => a.timestamp - b.timestamp);
            }
            const firstBlock =
              trackData.blocks[trackData.presentationTimestamps[0].blockIndex];
            const lastBlock =
              trackData.blocks[
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__._g)(
                  trackData.presentationTimestamps,
                ).blockIndex
              ];
            trackData.startTimestamp = firstBlock.timestamp;
            trackData.endTimestamp = lastBlock.timestamp + lastBlock.duration;
            const insertionIndex = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_5__.eE)(
              track.clusterPositionCache,
              trackData.startTimestamp,
              (x) => x.startTimestamp,
            );
            if (
              insertionIndex === -1 ||
              track.clusterPositionCache[insertionIndex].elementStartPos !==
                elementStartPos
            ) {
              track.clusterPositionCache.splice(insertionIndex + 1, 0, {
                elementStartPos: cluster.elementStartPos,
                startTimestamp: trackData.startTimestamp,
              });
            }
          }
          segment.lastReadCluster = cluster;
          return cluster;
        }
        getTrackDataInCluster(cluster, trackNumber) {
          let trackData = cluster.trackData.get(trackNumber);
          if (!trackData) {
            const track = cluster.segment.tracks.find(
              (x) => x.id === trackNumber,
            );
            if (!track) {
              return null;
            }
            trackData = {
              track,
              startTimestamp: 0,
              endTimestamp: 0,
              firstKeyFrameTimestamp: null,
              blocks: [],
              presentationTimestamps: [],
            };
            cluster.trackData.set(trackNumber, trackData);
          }
          return trackData;
        }
        expandLacedBlocks(blocks, track) {
          for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
            const originalBlock = blocks[blockIndex];
            if (originalBlock.lacing === BlockLacing.None) {
              continue;
            }
            if (!originalBlock.decoded) {
              originalBlock.data = this.decodeBlockData(
                track,
                originalBlock.data,
              );
              originalBlock.decoded = true;
            }
            const slice =
              _reader_js__WEBPACK_IMPORTED_MODULE_9__.x$.tempFromBytes(
                originalBlock.data,
              );
            const frameSizes = [];
            const frameCount =
              (0, _reader_js__WEBPACK_IMPORTED_MODULE_9__.eo)(slice) + 1;
            switch (originalBlock.lacing) {
              case BlockLacing.Xiph:
                {
                  let totalUsedSize = 0;
                  for (let i = 0; i < frameCount - 1; i++) {
                    let frameSize = 0;
                    while (slice.bufferPos < slice.length) {
                      const value = (0,
                      _reader_js__WEBPACK_IMPORTED_MODULE_9__.eo)(slice);
                      frameSize += value;
                      if (value < 255) {
                        frameSizes.push(frameSize);
                        totalUsedSize += frameSize;
                        break;
                      }
                    }
                  }
                  frameSizes.push(
                    slice.length - (slice.bufferPos + totalUsedSize),
                  );
                }
                break;
              case BlockLacing.FixedSize:
                {
                  const totalDataSize = slice.length - 1;
                  const frameSize = Math.floor(totalDataSize / frameCount);
                  for (let i = 0; i < frameCount; i++) {
                    frameSizes.push(frameSize);
                  }
                }
                break;
              case BlockLacing.Ebml:
                {
                  const firstResult = (0,
                  _ebml_js__WEBPACK_IMPORTED_MODULE_7__.pT)(slice);
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
                    firstResult !== null,
                  );
                  let currentSize = firstResult;
                  frameSizes.push(currentSize);
                  let totalUsedSize = currentSize;
                  for (let i = 1; i < frameCount - 1; i++) {
                    const startPos = slice.bufferPos;
                    const diffResult = (0,
                    _ebml_js__WEBPACK_IMPORTED_MODULE_7__.pT)(slice);
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
                      diffResult !== null,
                    );
                    const unsignedDiff = diffResult;
                    const width = slice.bufferPos - startPos;
                    const bias = (1 << (width * 7 - 1)) - 1;
                    const diff = unsignedDiff - bias;
                    currentSize += diff;
                    frameSizes.push(currentSize);
                    totalUsedSize += currentSize;
                  }
                  frameSizes.push(
                    slice.length - (slice.bufferPos + totalUsedSize),
                  );
                }
                break;
              default:
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(false);
            }
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
              frameSizes.length === frameCount,
            );
            blocks.splice(blockIndex, 1);
            const blockDuration =
              originalBlock.duration ||
              frameCount * (track.defaultDuration ?? 0);
            for (let i = 0; i < frameCount; i++) {
              const frameSize = frameSizes[i];
              const frameData = (0, _reader_js__WEBPACK_IMPORTED_MODULE_9__.io)(
                slice,
                frameSize,
              );
              const frameTimestamp =
                originalBlock.timestamp + (blockDuration * i) / frameCount;
              const frameDuration = blockDuration / frameCount;
              blocks.splice(blockIndex + i, 0, {
                timestamp: frameTimestamp,
                duration: frameDuration,
                isKeyFrame: originalBlock.isKeyFrame,
                data: frameData,
                lacing: BlockLacing.None,
                decoded: true,
                postProcessed: false,
                mainAdditional: originalBlock.mainAdditional,
              });
            }
            blockIndex += frameCount;
            blockIndex--;
          }
        }
        async loadSegmentMetadata(segment) {
          for (const seekEntry of segment.seekEntries) {
            if (
              seekEntry.id === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Tags &&
              !segment.tagsSeen
            ) {
            } else if (
              seekEntry.id ===
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Attachments &&
              !segment.attachmentsSeen
            ) {
            } else {
              continue;
            }
            let slice = this.reader.requestSliceRange(
              segment.dataStartPos + seekEntry.segmentPosition,
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.De,
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.r1,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(slice))
              slice = await slice;
            if (!slice) continue;
            const header = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.ur)(slice);
            if (!header || header.id !== seekEntry.id) continue;
            const { size } = header;
            (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.p)(size);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(!this.currentSegment);
            this.currentSegment = segment;
            let dataSlice = this.reader.requestSlice(slice.filePos, size);
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(dataSlice))
              dataSlice = await dataSlice;
            if (dataSlice) {
              this.readContiguousElements(dataSlice);
            }
            this.currentSegment = null;
            if (
              seekEntry.id === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Tags
            ) {
              segment.tagsSeen = true;
            } else if (
              seekEntry.id ===
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Attachments
            ) {
              segment.attachmentsSeen = true;
            }
          }
        }
        readContiguousElements(slice, stopIds) {
          while (
            slice.remainingLength >= _ebml_js__WEBPACK_IMPORTED_MODULE_7__.De
          ) {
            const startPos = slice.filePos;
            const foundElement = this.traverseElement(slice, stopIds);
            if (!foundElement) {
              return startPos;
            }
          }
          return slice.filePos;
        }
        traverseElement(slice, stopIds) {
          const header = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.ur)(slice);
          if (!header) {
            return false;
          }
          if (stopIds && stopIds.includes(header.id)) {
            return false;
          }
          const { id, size } = header;
          const dataStartPos = slice.filePos;
          (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.p)(size);
          switch (id) {
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.DocType:
              {
                this.isWebM =
                  (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.IX)(slice, size) ===
                  "webm";
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Seek:
              {
                if (!this.currentSegment) break;
                const seekEntry = { id: -1, segmentPosition: -1 };
                this.currentSegment.seekEntries.push(seekEntry);
                this.readContiguousElements(slice.slice(dataStartPos, size));
                if (seekEntry.id === -1 || seekEntry.segmentPosition === -1) {
                  this.currentSegment.seekEntries.pop();
                }
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.SeekID:
              {
                const lastSeekEntry =
                  this.currentSegment?.seekEntries[
                    this.currentSegment.seekEntries.length - 1
                  ];
                if (!lastSeekEntry) break;
                lastSeekEntry.id = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.SeekPosition:
              {
                const lastSeekEntry =
                  this.currentSegment?.seekEntries[
                    this.currentSegment.seekEntries.length - 1
                  ];
                if (!lastSeekEntry) break;
                lastSeekEntry.segmentPosition = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TimestampScale:
              {
                if (!this.currentSegment) break;
                this.currentSegment.timestampScale = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
                this.currentSegment.timestampFactor =
                  1e9 / this.currentSegment.timestampScale;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Duration:
              {
                if (!this.currentSegment) break;
                this.currentSegment.duration = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.zH)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TrackEntry:
              {
                if (!this.currentSegment) break;
                this.currentTrack = {
                  id: -1,
                  segment: this.currentSegment,
                  demuxer: this,
                  clusterPositionCache: [],
                  cuePoints: [],
                  disposition: {
                    ..._metadata_js__WEBPACK_IMPORTED_MODULE_4__.gM,
                    primary: false,
                  },
                  trackBacking: null,
                  codecId: null,
                  codecPrivate: null,
                  defaultDuration: null,
                  defaultDurationNs: null,
                  name: null,
                  languageCode: "eng",
                  // The default in Matroska
                  hasLanguageBcp47: false,
                  decodingInstructions: [],
                  info: null,
                };
                this.readContiguousElements(slice.slice(dataStartPos, size));
                if (!this.currentTrack) {
                  break;
                }
                if (
                  this.currentTrack.decodingInstructions.some((instruction) => {
                    return (
                      instruction.data?.type !== "decompress" ||
                      instruction.scope !== ContentEncodingScope.Block ||
                      instruction.data.algorithm !==
                        ContentCompAlgo.HeaderStripping
                    );
                  })
                ) {
                  _logging_js__WEBPACK_IMPORTED_MODULE_3__.y._warn(
                    "Track #".concat(
                      this.currentTrack.id,
                      " has an unsupported content encoding; dropping.",
                    ),
                  );
                  this.currentTrack = null;
                }
                if (
                  this.currentTrack &&
                  this.currentTrack.id !== -1 &&
                  this.currentTrack.codecId &&
                  this.currentTrack.info
                ) {
                  const slashIndex = this.currentTrack.codecId.indexOf("/");
                  const codecIdWithoutSuffix =
                    slashIndex === -1
                      ? this.currentTrack.codecId
                      : this.currentTrack.codecId.slice(0, slashIndex);
                  if (
                    this.currentTrack.info.type === "video" &&
                    this.currentTrack.info.width !== -1 &&
                    this.currentTrack.info.height !== -1
                  ) {
                    this.currentTrack.info.squarePixelWidth =
                      this.currentTrack.info.width;
                    this.currentTrack.info.squarePixelHeight =
                      this.currentTrack.info.height;
                    if (
                      this.currentTrack.info.displayWidth !== null &&
                      this.currentTrack.info.displayHeight !== null
                    ) {
                      const num =
                        this.currentTrack.info.displayWidth *
                        this.currentTrack.info.height;
                      const den =
                        this.currentTrack.info.displayHeight *
                        this.currentTrack.info.width;
                      if (num > 0 && den > 0) {
                        if (num > den) {
                          this.currentTrack.info.squarePixelWidth = Math.round(
                            (this.currentTrack.info.width * num) / den,
                          );
                        } else {
                          this.currentTrack.info.squarePixelHeight = Math.round(
                            (this.currentTrack.info.height * den) / num,
                          );
                        }
                      }
                    }
                    if (
                      this.currentTrack.codecId ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.avc
                    ) {
                      this.currentTrack.info.codec = "avc";
                      this.currentTrack.info.codecDescription =
                        this.currentTrack.codecPrivate;
                    } else if (
                      this.currentTrack.codecId ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.hevc
                    ) {
                      this.currentTrack.info.codec = "hevc";
                      this.currentTrack.info.codecDescription =
                        this.currentTrack.codecPrivate;
                    } else if (
                      codecIdWithoutSuffix ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.vp8
                    ) {
                      this.currentTrack.info.codec = "vp8";
                    } else if (
                      codecIdWithoutSuffix ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.vp9
                    ) {
                      this.currentTrack.info.codec = "vp9";
                    } else if (
                      codecIdWithoutSuffix ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.av1
                    ) {
                      this.currentTrack.info.codec = "av1";
                    } else if (
                      codecIdWithoutSuffix ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.prores
                    ) {
                      const format = this.currentTrack.codecPrivate
                        ? _misc_js__WEBPACK_IMPORTED_MODULE_5__.su.decode(
                            this.currentTrack.codecPrivate,
                          )
                        : "";
                      if (
                        _codec_js__WEBPACK_IMPORTED_MODULE_1__.Y2.includes(
                          format,
                        )
                      ) {
                        this.currentTrack.info.codec = "prores";
                        this.currentTrack.info.proresFormat = format;
                      } else {
                      }
                    }
                    const videoTrack = this.currentTrack;
                    this.currentTrack.trackBacking =
                      new MatroskaVideoTrackBacking(videoTrack);
                    this.currentSegment.tracks.push(this.currentTrack);
                  } else if (this.currentTrack.info.type === "audio") {
                    if (
                      codecIdWithoutSuffix ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.aac
                    ) {
                      this.currentTrack.info.codec = "aac";
                      this.currentTrack.info.aacCodecInfo = {
                        isMpeg2: this.currentTrack.codecId.includes("MPEG2"),
                        objectType: null,
                      };
                      this.currentTrack.info.codecDescription =
                        this.currentTrack.codecPrivate;
                    } else if (
                      this.currentTrack.codecId ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.mp3
                    ) {
                      this.currentTrack.info.codec = "mp3";
                    } else if (
                      codecIdWithoutSuffix ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.opus
                    ) {
                      this.currentTrack.info.codec = "opus";
                      this.currentTrack.info.codecDescription =
                        this.currentTrack.codecPrivate;
                      this.currentTrack.info.sampleRate =
                        _codec_js__WEBPACK_IMPORTED_MODULE_1__.yo;
                    } else if (
                      codecIdWithoutSuffix ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.vorbis
                    ) {
                      this.currentTrack.info.codec = "vorbis";
                      this.currentTrack.info.codecDescription =
                        this.currentTrack.codecPrivate;
                    } else if (
                      codecIdWithoutSuffix ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.flac
                    ) {
                      this.currentTrack.info.codec = "flac";
                      this.currentTrack.info.codecDescription =
                        this.currentTrack.codecPrivate;
                    } else if (
                      codecIdWithoutSuffix ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.ac3
                    ) {
                      this.currentTrack.info.codec = "ac3";
                      this.currentTrack.info.codecDescription =
                        this.currentTrack.codecPrivate;
                    } else if (
                      codecIdWithoutSuffix ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.eac3
                    ) {
                      this.currentTrack.info.codec = "eac3";
                      this.currentTrack.info.codecDescription =
                        this.currentTrack.codecPrivate;
                    } else if (
                      codecIdWithoutSuffix ===
                      _ebml_js__WEBPACK_IMPORTED_MODULE_7__.oo.dts
                    ) {
                      this.currentTrack.info.codec = "dts";
                      if (this.currentTrack.codecId === "A_DTS/EXPRESS") {
                        this.currentTrack.info.dtsFormat = "dtse";
                      } else if (
                        this.currentTrack.codecId === "A_DTS/LOSSLESS"
                      ) {
                        this.currentTrack.info.dtsFormat = "dtsl";
                      }
                    } else if (this.currentTrack.codecId === "A_PCM/INT/LIT") {
                      if (this.currentTrack.info.bitDepth === 8) {
                        this.currentTrack.info.codec = "pcm-u8";
                      } else if (this.currentTrack.info.bitDepth === 16) {
                        this.currentTrack.info.codec = "pcm-s16";
                      } else if (this.currentTrack.info.bitDepth === 24) {
                        this.currentTrack.info.codec = "pcm-s24";
                      } else if (this.currentTrack.info.bitDepth === 32) {
                        this.currentTrack.info.codec = "pcm-s32";
                      }
                    } else if (this.currentTrack.codecId === "A_PCM/INT/BIG") {
                      if (this.currentTrack.info.bitDepth === 8) {
                        this.currentTrack.info.codec = "pcm-u8";
                      } else if (this.currentTrack.info.bitDepth === 16) {
                        this.currentTrack.info.codec = "pcm-s16be";
                      } else if (this.currentTrack.info.bitDepth === 24) {
                        this.currentTrack.info.codec = "pcm-s24be";
                      } else if (this.currentTrack.info.bitDepth === 32) {
                        this.currentTrack.info.codec = "pcm-s32be";
                      }
                    } else if (
                      this.currentTrack.codecId === "A_PCM/FLOAT/IEEE"
                    ) {
                      if (this.currentTrack.info.bitDepth === 32) {
                        this.currentTrack.info.codec = "pcm-f32";
                      } else if (this.currentTrack.info.bitDepth === 64) {
                        this.currentTrack.info.codec = "pcm-f64";
                      }
                    }
                    const audioTrack = this.currentTrack;
                    this.currentTrack.trackBacking =
                      new MatroskaAudioTrackBacking(audioTrack);
                    this.currentSegment.tracks.push(this.currentTrack);
                  }
                }
                this.currentTrack = null;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TrackNumber:
              {
                if (!this.currentTrack) break;
                this.currentTrack.id = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TrackType:
              {
                if (!this.currentTrack) break;
                const type = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(
                  slice,
                  size,
                );
                if (type === 1) {
                  this.currentTrack.info = {
                    type: "video",
                    width: -1,
                    height: -1,
                    displayWidth: null,
                    displayHeight: null,
                    displayUnit: null,
                    squarePixelWidth: -1,
                    squarePixelHeight: -1,
                    rotation: 0,
                    codec: null,
                    codecDescription: null,
                    colorSpace: { ..._misc_js__WEBPACK_IMPORTED_MODULE_5__.jW },
                    alphaMode: false,
                    proresFormat: null,
                  };
                } else if (type === 2) {
                  this.currentTrack.info = {
                    type: "audio",
                    numberOfChannels: 1,
                    // Default value
                    sampleRate: 8e3,
                    // Default value
                    bitDepth: -1,
                    codec: null,
                    codecDescription: null,
                    aacCodecInfo: null,
                    dtsFormat: null,
                  };
                }
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FlagEnabled:
              {
                if (!this.currentTrack) break;
                const enabled = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(
                  slice,
                  size,
                );
                if (!enabled) {
                  this.currentTrack = null;
                }
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FlagDefault:
              {
                if (!this.currentTrack) break;
                this.currentTrack.disposition.default = !!(0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FlagForced:
              {
                if (!this.currentTrack) break;
                this.currentTrack.disposition.forced = !!(0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FlagOriginal:
              {
                if (!this.currentTrack) break;
                this.currentTrack.disposition.original = !!(0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FlagHearingImpaired:
              {
                if (!this.currentTrack) break;
                this.currentTrack.disposition.hearingImpaired = !!(0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FlagVisualImpaired:
              {
                if (!this.currentTrack) break;
                this.currentTrack.disposition.visuallyImpaired = !!(0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FlagCommentary:
              {
                if (!this.currentTrack) break;
                this.currentTrack.disposition.commentary = !!(0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.CodecID:
              {
                if (!this.currentTrack) break;
                this.currentTrack.codecId = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.IX)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.CodecPrivate:
              {
                if (!this.currentTrack) break;
                this.currentTrack.codecPrivate = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_9__.io)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.DefaultDuration:
              {
                if (!this.currentTrack) break;
                this.currentTrack.defaultDurationNs = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Name:
              {
                if (!this.currentTrack) break;
                this.currentTrack.name = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.jR)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Language:
              {
                if (!this.currentTrack) break;
                if (this.currentTrack.hasLanguageBcp47) {
                  break;
                }
                this.currentTrack.languageCode = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.IX)(slice, size);
                if (
                  !(0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Nu)(
                    this.currentTrack.languageCode,
                  )
                ) {
                  this.currentTrack.languageCode =
                    _misc_js__WEBPACK_IMPORTED_MODULE_5__.IR;
                }
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.LanguageBCP47:
              {
                if (!this.currentTrack) break;
                const bcp47 = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.IX)(
                  slice,
                  size,
                );
                const languageSubtag = bcp47.split("-")[0];
                if (languageSubtag) {
                  this.currentTrack.languageCode = languageSubtag;
                } else {
                  this.currentTrack.languageCode =
                    _misc_js__WEBPACK_IMPORTED_MODULE_5__.IR;
                }
                this.currentTrack.hasLanguageBcp47 = true;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Video:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.PixelWidth:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                this.currentTrack.info.width = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.PixelHeight:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                this.currentTrack.info.height = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.DisplayWidth:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                this.currentTrack.info.displayWidth = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.DisplayHeight:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                this.currentTrack.info.displayHeight = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.DisplayUnit:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                this.currentTrack.info.displayUnit = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.AlphaMode:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                this.currentTrack.info.alphaMode =
                  (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size) ===
                  1;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Colour:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.MatrixCoefficients:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                const matrixCoefficients = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
                const mapped =
                  _misc_js__WEBPACK_IMPORTED_MODULE_5__.fl[matrixCoefficients];
                this.currentTrack.info.colorSpace.matrix = mapped;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Range:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                const range = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(
                  slice,
                  size,
                );
                this.currentTrack.info.colorSpace.fullRange =
                  range === 1 || range === 2 ? range === 2 : void 0;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl
              .TransferCharacteristics:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                const transferCharacteristics = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
                const mapped =
                  _misc_js__WEBPACK_IMPORTED_MODULE_5__.x_[
                    transferCharacteristics
                  ];
                this.currentTrack.info.colorSpace.transfer = mapped;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Primaries:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                const primaries = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(
                  slice,
                  size,
                );
                const mapped =
                  _misc_js__WEBPACK_IMPORTED_MODULE_5__.BL[primaries];
                this.currentTrack.info.colorSpace.primaries = mapped;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Projection:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.ProjectionPoseRoll:
              {
                if (this.currentTrack?.info?.type !== "video") break;
                const rotation = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.zH)(
                  slice,
                  size,
                );
                const flippedRotation = -rotation;
                try {
                  this.currentTrack.info.rotation = (0,
                  _misc_js__WEBPACK_IMPORTED_MODULE_5__.qT)(flippedRotation);
                } catch {}
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Audio:
              {
                if (this.currentTrack?.info?.type !== "audio") break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.SamplingFrequency:
              {
                if (this.currentTrack?.info?.type !== "audio") break;
                this.currentTrack.info.sampleRate = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.zH)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Channels:
              {
                if (this.currentTrack?.info?.type !== "audio") break;
                this.currentTrack.info.numberOfChannels = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.BitDepth:
              {
                if (this.currentTrack?.info?.type !== "audio") break;
                this.currentTrack.info.bitDepth = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.CuePoint:
              {
                if (!this.currentSegment) break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
                this.currentCueTime = null;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.CueTime:
              {
                this.currentCueTime = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.CueTrackPositions:
              {
                if (this.currentCueTime === null) break;
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
                  this.currentSegment,
                );
                const cuePoint = {
                  time: this.currentCueTime,
                  trackId: -1,
                  clusterPosition: -1,
                };
                this.currentSegment.cuePoints.push(cuePoint);
                this.readContiguousElements(slice.slice(dataStartPos, size));
                if (
                  cuePoint.trackId === -1 ||
                  cuePoint.clusterPosition === -1
                ) {
                  this.currentSegment.cuePoints.pop();
                }
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.CueTrack:
              {
                const lastCuePoint =
                  this.currentSegment?.cuePoints[
                    this.currentSegment.cuePoints.length - 1
                  ];
                if (!lastCuePoint) break;
                lastCuePoint.trackId = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.CueClusterPosition:
              {
                const lastCuePoint =
                  this.currentSegment?.cuePoints[
                    this.currentSegment.cuePoints.length - 1
                  ];
                if (!lastCuePoint) break;
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
                  this.currentSegment,
                );
                lastCuePoint.clusterPosition =
                  this.currentSegment.dataStartPos +
                  (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Timestamp:
              {
                if (!this.currentCluster) break;
                this.currentCluster.timestamp = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.SimpleBlock:
              {
                if (!this.currentCluster) break;
                const trackNumber = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.pT)(slice);
                if (trackNumber === null) break;
                const trackData = this.getTrackDataInCluster(
                  this.currentCluster,
                  trackNumber,
                );
                if (!trackData) break;
                const relativeTimestamp = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_9__.iH)(slice);
                const flags = (0, _reader_js__WEBPACK_IMPORTED_MODULE_9__.eo)(
                  slice,
                );
                const lacing = (flags >> 1) & 3;
                let isKeyFrame = !!(flags & 128);
                if (
                  trackData.track.info?.type === "audio" &&
                  trackData.track.info.codec
                ) {
                  isKeyFrame = true;
                }
                const blockData = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_9__.io)(
                  slice,
                  size - (slice.filePos - dataStartPos),
                );
                const hasDecodingInstructions =
                  trackData.track.decodingInstructions.length > 0;
                trackData.blocks.push({
                  timestamp: relativeTimestamp,
                  // We'll add the cluster's timestamp to this later
                  duration: 0,
                  // Will set later
                  isKeyFrame,
                  data: blockData,
                  lacing,
                  decoded: !hasDecodingInstructions,
                  postProcessed: false,
                  mainAdditional: null,
                });
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.BlockGroup:
              {
                if (!this.currentCluster) break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
                this.currentBlock = null;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Block:
              {
                if (!this.currentCluster) break;
                const trackNumber = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.pT)(slice);
                if (trackNumber === null) break;
                const trackData = this.getTrackDataInCluster(
                  this.currentCluster,
                  trackNumber,
                );
                if (!trackData) break;
                const relativeTimestamp = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_9__.iH)(slice);
                const flags = (0, _reader_js__WEBPACK_IMPORTED_MODULE_9__.eo)(
                  slice,
                );
                const lacing = (flags >> 1) & 3;
                const blockData = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_9__.io)(
                  slice,
                  size - (slice.filePos - dataStartPos),
                );
                const hasDecodingInstructions =
                  trackData.track.decodingInstructions.length > 0;
                this.currentBlock = {
                  timestamp: relativeTimestamp,
                  // We'll add the cluster's timestamp to this later
                  duration: 0,
                  // Will set later
                  isKeyFrame: true,
                  data: blockData,
                  lacing,
                  decoded: !hasDecodingInstructions,
                  postProcessed: false,
                  mainAdditional: null,
                };
                trackData.blocks.push(this.currentBlock);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.BlockAdditions:
              {
                this.readContiguousElements(slice.slice(dataStartPos, size));
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.BlockMore:
              {
                if (!this.currentBlock) break;
                this.currentBlockAdditional = {
                  addId: 1,
                  data: null,
                };
                this.readContiguousElements(slice.slice(dataStartPos, size));
                if (
                  this.currentBlockAdditional.data &&
                  this.currentBlockAdditional.addId === 1
                ) {
                  this.currentBlock.mainAdditional =
                    this.currentBlockAdditional.data;
                }
                this.currentBlockAdditional = null;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.BlockAdditional:
              {
                if (!this.currentBlockAdditional) break;
                this.currentBlockAdditional.data = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_9__.io)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.BlockAddID:
              {
                if (!this.currentBlockAdditional) break;
                this.currentBlockAdditional.addId = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.BlockDuration:
              {
                if (!this.currentBlock) break;
                this.currentBlock.duration = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.ReferenceBlock:
              {
                if (!this.currentBlock) break;
                this.currentBlock.isKeyFrame = false;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Tag:
              {
                this.currentTagTargetIsMovie = true;
                this.readContiguousElements(slice.slice(dataStartPos, size));
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Targets:
              {
                this.readContiguousElements(slice.slice(dataStartPos, size));
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TargetTypeValue:
              {
                const targetTypeValue = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
                if (targetTypeValue !== 50) {
                  this.currentTagTargetIsMovie = false;
                }
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TagTrackUID:
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TagEditionUID:
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TagChapterUID:
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TagAttachmentUID:
              {
                this.currentTagTargetIsMovie = false;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.SimpleTag:
              {
                if (!this.currentTagTargetIsMovie) break;
                this.currentSimpleTagName = null;
                this.readContiguousElements(slice.slice(dataStartPos, size));
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TagName:
              {
                this.currentSimpleTagName = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.jR)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TagString:
              {
                if (!this.currentSimpleTagName) break;
                const value = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.jR)(
                  slice,
                  size,
                );
                this.processTagValue(this.currentSimpleTagName, value);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.TagBinary:
              {
                if (!this.currentSimpleTagName) break;
                const value = (0, _reader_js__WEBPACK_IMPORTED_MODULE_9__.io)(
                  slice,
                  size,
                );
                this.processTagValue(this.currentSimpleTagName, value);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.AttachedFile:
              {
                if (!this.currentSegment) break;
                this.currentAttachedFile = {
                  fileUid: null,
                  fileName: null,
                  fileMediaType: null,
                  fileData: null,
                  fileDescription: null,
                };
                this.readContiguousElements(slice.slice(dataStartPos, size));
                const tags = this.currentSegment.metadataTags;
                if (
                  this.currentAttachedFile.fileUid &&
                  this.currentAttachedFile.fileData
                ) {
                  tags.raw ??= {};
                  tags.raw[this.currentAttachedFile.fileUid.toString()] =
                    new _metadata_js__WEBPACK_IMPORTED_MODULE_4__.VF(
                      this.currentAttachedFile.fileData,
                      this.currentAttachedFile.fileMediaType ?? void 0,
                      this.currentAttachedFile.fileName ?? void 0,
                      this.currentAttachedFile.fileDescription ?? void 0,
                    );
                }
                if (
                  this.currentAttachedFile.fileMediaType?.startsWith(
                    "image/",
                  ) &&
                  this.currentAttachedFile.fileData
                ) {
                  const fileName = this.currentAttachedFile.fileName;
                  let kind = "unknown";
                  if (fileName) {
                    const lowerName = fileName.toLowerCase();
                    if (lowerName.startsWith("cover.")) {
                      kind = "coverFront";
                    } else if (lowerName.startsWith("back.")) {
                      kind = "coverBack";
                    }
                  }
                  tags.images ??= [];
                  tags.images.push({
                    data: this.currentAttachedFile.fileData,
                    mimeType: this.currentAttachedFile.fileMediaType,
                    kind,
                    name: this.currentAttachedFile.fileName ?? void 0,
                    description:
                      this.currentAttachedFile.fileDescription ?? void 0,
                  });
                }
                this.currentAttachedFile = null;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FileUID:
              {
                if (!this.currentAttachedFile) break;
                this.currentAttachedFile.fileUid = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Ry)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FileName:
              {
                if (!this.currentAttachedFile) break;
                this.currentAttachedFile.fileName = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.jR)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FileMediaType:
              {
                if (!this.currentAttachedFile) break;
                this.currentAttachedFile.fileMediaType = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.IX)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FileData:
              {
                if (!this.currentAttachedFile) break;
                this.currentAttachedFile.fileData = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_9__.io)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.FileDescription:
              {
                if (!this.currentAttachedFile) break;
                this.currentAttachedFile.fileDescription = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.jR)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.ContentEncodings:
              {
                if (!this.currentTrack) break;
                this.readContiguousElements(slice.slice(dataStartPos, size));
                this.currentTrack.decodingInstructions.sort(
                  (a, b) => b.order - a.order,
                );
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.ContentEncoding:
              {
                this.currentDecodingInstruction = {
                  order: 0,
                  scope: ContentEncodingScope.Block,
                  data: null,
                };
                this.readContiguousElements(slice.slice(dataStartPos, size));
                if (this.currentDecodingInstruction.data) {
                  this.currentTrack.decodingInstructions.push(
                    this.currentDecodingInstruction,
                  );
                }
                this.currentDecodingInstruction = null;
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.ContentEncodingOrder:
              {
                if (!this.currentDecodingInstruction) break;
                this.currentDecodingInstruction.order = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.ContentEncodingScope:
              {
                if (!this.currentDecodingInstruction) break;
                this.currentDecodingInstruction.scope = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.ContentCompression:
              {
                if (!this.currentDecodingInstruction) break;
                this.currentDecodingInstruction.data = {
                  type: "decompress",
                  algorithm: ContentCompAlgo.Zlib,
                  settings: null,
                };
                this.readContiguousElements(slice.slice(dataStartPos, size));
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.ContentCompAlgo:
              {
                if (
                  this.currentDecodingInstruction?.data?.type !== "decompress"
                )
                  break;
                this.currentDecodingInstruction.data.algorithm = (0,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.dl)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.ContentCompSettings:
              {
                if (
                  this.currentDecodingInstruction?.data?.type !== "decompress"
                )
                  break;
                this.currentDecodingInstruction.data.settings = (0,
                _reader_js__WEBPACK_IMPORTED_MODULE_9__.io)(slice, size);
              }
              break;
            case _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.ContentEncryption:
              {
                if (!this.currentDecodingInstruction) break;
                this.currentDecodingInstruction.data = {
                  type: "decrypt",
                };
              }
              break;
          }
          slice.filePos = dataStartPos + size;
          return true;
        }
        decodeBlockData(track, rawData) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
            track.decodingInstructions.length > 0,
          );
          let currentData = rawData;
          for (const instruction of track.decodingInstructions) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(instruction.data);
            switch (instruction.data.type) {
              case "decompress":
                {
                  switch (instruction.data.algorithm) {
                    case ContentCompAlgo.HeaderStripping:
                      {
                        if (
                          instruction.data.settings &&
                          instruction.data.settings.length > 0
                        ) {
                          const prefix = instruction.data.settings;
                          const newData = new Uint8Array(
                            prefix.length + currentData.length,
                          );
                          newData.set(prefix, 0);
                          newData.set(currentData, prefix.length);
                          currentData = newData;
                        }
                      }
                      break;
                    default: {
                    }
                  }
                }
                break;
              default: {
              }
            }
          }
          return currentData;
        }
        processTagValue(name, value) {
          if (!this.currentSegment?.metadataTags) return;
          const metadataTags = this.currentSegment.metadataTags;
          metadataTags.raw ??= {};
          metadataTags.raw[name] ??= value;
          if (typeof value === "string") {
            switch (name.toLowerCase()) {
              case "title":
                {
                  metadataTags.title ??= value;
                }
                break;
              case "description":
                {
                  metadataTags.description ??= value;
                }
                break;
              case "artist":
                {
                  metadataTags.artist ??= value;
                }
                break;
              case "album":
                {
                  metadataTags.album ??= value;
                }
                break;
              case "album_artist":
                {
                  metadataTags.albumArtist ??= value;
                }
                break;
              case "genre":
                {
                  metadataTags.genre ??= value;
                }
                break;
              case "comment":
                {
                  metadataTags.comment ??= value;
                }
                break;
              case "lyrics":
                {
                  metadataTags.lyrics ??= value;
                }
                break;
              case "date":
                {
                  const date = new Date(value);
                  if (!Number.isNaN(date.getTime())) {
                    metadataTags.date ??= date;
                  }
                }
                break;
              case "track_number":
              case "part_number":
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
              case "disc_number":
              case "disc":
                {
                  const discParts = value.split("/");
                  const discNum = Number.parseInt(discParts[0], 10);
                  const discsTotal =
                    discParts[1] && Number.parseInt(discParts[1], 10);
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
            }
          }
        }
      }
      class MatroskaTrackBacking {
        constructor(internalTrack) {
          this.internalTrack = internalTrack;
          this.packetToClusterLocation = /* @__PURE__ */ new WeakMap();
        }
        getId() {
          return this.internalTrack.id;
        }
        getNumber() {
          const demuxer = this.internalTrack.demuxer;
          const trackType = this.internalTrack.trackBacking.getType();
          let number = 0;
          for (const segment of demuxer.segments) {
            for (const track of segment.tracks) {
              if (track.trackBacking.getType() === trackType) {
                number++;
              }
              if (track === this.internalTrack) {
                break;
              }
            }
          }
          return number;
        }
        getCodec() {
          throw new Error("Not implemented on base class.");
        }
        getInternalCodecId() {
          return this.internalTrack.codecId;
        }
        getName() {
          return this.internalTrack.name;
        }
        getLanguageCode() {
          return this.internalTrack.languageCode;
        }
        getTimeResolution() {
          return this.internalTrack.segment.timestampFactor;
        }
        isRelativeToUnixEpoch() {
          return false;
        }
        getUnixTimeForTimestamp() {
          return null;
        }
        getDisposition() {
          return this.internalTrack.disposition;
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
          const segment = this.internalTrack.segment;
          if (segment.duration <= 0) {
            return null;
          }
          let endTimestamp = segment.duration / segment.timestampFactor;
          const firstPacket = await this.getFirstPacket({ metadataOnly: true });
          endTimestamp += firstPacket?.timestamp ?? 0;
          return endTimestamp;
        }
        async getLiveRefreshInterval() {
          return null;
        }
        async getFirstPacket(options) {
          return this.performClusterLookup(
            null,
            (cluster) => {
              const trackData = cluster.trackData.get(this.internalTrack.id);
              if (trackData) {
                return {
                  blockIndex: 0,
                  correctBlockFound: true,
                };
              }
              return {
                blockIndex: -1,
                correctBlockFound: false,
              };
            },
            -Infinity,
            // Use -Infinity as a search timestamp to avoid using the cues
            Infinity,
            options,
          );
        }
        intoTimescale(timestamp) {
          return (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.aI)(
            timestamp * this.internalTrack.segment.timestampFactor,
          );
        }
        async getPacket(timestamp, options) {
          const timestampInTimescale = this.intoTimescale(timestamp);
          return this.performClusterLookup(
            null,
            (cluster) => {
              const trackData = cluster.trackData.get(this.internalTrack.id);
              if (!trackData) {
                return { blockIndex: -1, correctBlockFound: false };
              }
              const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.eE)(
                trackData.presentationTimestamps,
                timestampInTimescale,
                (x) => x.timestamp,
              );
              const blockIndex =
                index !== -1
                  ? trackData.presentationTimestamps[index].blockIndex
                  : -1;
              const correctBlockFound =
                index !== -1 && timestampInTimescale < trackData.endTimestamp;
              return { blockIndex, correctBlockFound };
            },
            timestampInTimescale,
            timestampInTimescale,
            options,
          );
        }
        async getNextPacket(packet, options) {
          const locationInCluster = this.packetToClusterLocation.get(packet);
          if (locationInCluster === void 0) {
            throw new Error("Packet was not created from this track.");
          }
          return this.performClusterLookup(
            locationInCluster.cluster,
            (cluster) => {
              if (cluster === locationInCluster.cluster) {
                const trackData = cluster.trackData.get(this.internalTrack.id);
                if (
                  locationInCluster.blockIndex + 1 <
                  trackData.blocks.length
                ) {
                  return {
                    blockIndex: locationInCluster.blockIndex + 1,
                    correctBlockFound: true,
                  };
                }
              } else {
                const trackData = cluster.trackData.get(this.internalTrack.id);
                if (trackData) {
                  return {
                    blockIndex: 0,
                    correctBlockFound: true,
                  };
                }
              }
              return {
                blockIndex: -1,
                correctBlockFound: false,
              };
            },
            -Infinity,
            // Use -Infinity as a search timestamp to avoid using the cues
            Infinity,
            options,
          );
        }
        async getKeyPacket(timestamp, options) {
          const timestampInTimescale = this.intoTimescale(timestamp);
          return this.performClusterLookup(
            null,
            (cluster) => {
              const trackData = cluster.trackData.get(this.internalTrack.id);
              if (!trackData) {
                return { blockIndex: -1, correctBlockFound: false };
              }
              const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Kl)(
                trackData.presentationTimestamps,
                (x) => {
                  const block = trackData.blocks[x.blockIndex];
                  return (
                    block.isKeyFrame && x.timestamp <= timestampInTimescale
                  );
                },
              );
              const blockIndex =
                index !== -1
                  ? trackData.presentationTimestamps[index].blockIndex
                  : -1;
              const correctBlockFound =
                index !== -1 && timestampInTimescale < trackData.endTimestamp;
              return { blockIndex, correctBlockFound };
            },
            timestampInTimescale,
            timestampInTimescale,
            options,
          );
        }
        async getNextKeyPacket(packet, options) {
          const locationInCluster = this.packetToClusterLocation.get(packet);
          if (locationInCluster === void 0) {
            throw new Error("Packet was not created from this track.");
          }
          return this.performClusterLookup(
            locationInCluster.cluster,
            (cluster) => {
              if (cluster === locationInCluster.cluster) {
                const trackData = cluster.trackData.get(this.internalTrack.id);
                const nextKeyFrameIndex = trackData.blocks.findIndex(
                  (x, i) => x.isKeyFrame && i > locationInCluster.blockIndex,
                );
                if (nextKeyFrameIndex !== -1) {
                  return {
                    blockIndex: nextKeyFrameIndex,
                    correctBlockFound: true,
                  };
                }
              } else {
                const trackData = cluster.trackData.get(this.internalTrack.id);
                if (trackData && trackData.firstKeyFrameTimestamp !== null) {
                  const keyFrameIndex = trackData.blocks.findIndex(
                    (x) => x.isKeyFrame,
                  );
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
                    keyFrameIndex !== -1,
                  );
                  return {
                    blockIndex: keyFrameIndex,
                    correctBlockFound: true,
                  };
                }
              }
              return {
                blockIndex: -1,
                correctBlockFound: false,
              };
            },
            -Infinity,
            // Use -Infinity as a search timestamp to avoid using the cues
            Infinity,
            options,
          );
        }
        async fetchPacketInCluster(cluster, blockIndex, options) {
          if (blockIndex === -1) {
            return null;
          }
          const trackData = cluster.trackData.get(this.internalTrack.id);
          const block = trackData.blocks[blockIndex];
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(block);
          if (!block.decoded) {
            block.data = this.internalTrack.demuxer.decodeBlockData(
              this.internalTrack,
              block.data,
            );
            block.decoded = true;
          }
          if (!block.postProcessed) {
            if (this.internalTrack.info?.codec === "prores") {
              const hasFrameContainer =
                block.data.length >= 8 &&
                block.data[4] === 105 &&
                block.data[5] === 99 &&
                block.data[6] === 112 &&
                block.data[7] === 102;
              if (!hasFrameContainer) {
                const newData = new Uint8Array(block.data.length + 8);
                const newDataView = (0,
                _misc_js__WEBPACK_IMPORTED_MODULE_5__.Zc)(newData);
                newDataView.setUint32(0, newData.length, false);
                newData[4] = 105;
                newData[5] = 99;
                newData[6] = 112;
                newData[7] = 102;
                newData.set(block.data, 8);
                block.data = newData;
              }
            }
            block.postProcessed = true;
          }
          const data = options.metadataOnly
            ? _packet_js__WEBPACK_IMPORTED_MODULE_6__.T
            : block.data;
          const timestamp =
            block.timestamp / this.internalTrack.segment.timestampFactor;
          const duration =
            block.duration / this.internalTrack.segment.timestampFactor;
          const sideData = {};
          if (
            block.mainAdditional &&
            this.internalTrack.info?.type === "video" &&
            this.internalTrack.info.alphaMode
          ) {
            sideData.alpha = options.metadataOnly
              ? _packet_js__WEBPACK_IMPORTED_MODULE_6__.T
              : block.mainAdditional;
            sideData.alphaByteLength = block.mainAdditional.byteLength;
          }
          const packet = new _packet_js__WEBPACK_IMPORTED_MODULE_6__.Z(
            data,
            block.isKeyFrame ? "key" : "delta",
            timestamp,
            duration,
            cluster.dataStartPos + blockIndex,
            block.data.byteLength,
            sideData,
          );
          this.packetToClusterLocation.set(packet, { cluster, blockIndex });
          return packet;
        }
        /** Looks for a packet in the clusters while trying to load as few clusters as possible to retrieve it. */
        async performClusterLookup(
          startCluster,
          getMatchInCluster,
          searchTimestamp,
          latestTimestamp,
          options,
        ) {
          const { demuxer, segment } = this.internalTrack;
          let currentCluster = null;
          let bestCluster = null;
          let bestBlockIndex = -1;
          if (startCluster) {
            const { blockIndex, correctBlockFound } =
              getMatchInCluster(startCluster);
            if (correctBlockFound) {
              return this.fetchPacketInCluster(
                startCluster,
                blockIndex,
                options,
              );
            }
            if (blockIndex !== -1) {
              bestCluster = startCluster;
              bestBlockIndex = blockIndex;
            }
          }
          const cuePointIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.eE)(
            this.internalTrack.cuePoints,
            searchTimestamp,
            (x) => x.time,
          );
          const cuePoint =
            cuePointIndex !== -1
              ? this.internalTrack.cuePoints[cuePointIndex]
              : null;
          const positionCacheIndex = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_5__.eE)(
            this.internalTrack.clusterPositionCache,
            searchTimestamp,
            (x) => x.startTimestamp,
          );
          const positionCacheEntry =
            positionCacheIndex !== -1
              ? this.internalTrack.clusterPositionCache[positionCacheIndex]
              : null;
          const lookupEntryPosition =
            Math.max(
              cuePoint?.clusterPosition ?? 0,
              positionCacheEntry?.elementStartPos ?? 0,
            ) || null;
          let currentPos;
          if (!startCluster) {
            currentPos = lookupEntryPosition ?? segment.clusterSeekStartPos;
          } else {
            if (
              lookupEntryPosition === null ||
              startCluster.elementStartPos >= lookupEntryPosition
            ) {
              currentPos = startCluster.elementEndPos;
              currentCluster = startCluster;
            } else {
              currentPos = lookupEntryPosition;
            }
          }
          while (
            segment.elementEndPos === null ||
            currentPos <=
              segment.elementEndPos - _ebml_js__WEBPACK_IMPORTED_MODULE_7__.De
          ) {
            if (currentCluster) {
              const trackData = currentCluster.trackData.get(
                this.internalTrack.id,
              );
              if (trackData && trackData.startTimestamp > latestTimestamp) {
                break;
              }
            }
            let slice = demuxer.reader.requestSliceRange(
              currentPos,
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.De,
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.r1,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(slice))
              slice = await slice;
            if (!slice) break;
            const elementStartPos = currentPos;
            const elementHeader = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.ur)(
              slice,
            );
            if (
              !elementHeader ||
              (!_ebml_js__WEBPACK_IMPORTED_MODULE_7__.VE.includes(
                elementHeader.id,
              ) &&
                elementHeader.id !==
                  _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Void)
            ) {
              const nextPos = await (0,
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.nE)(
                demuxer.reader,
                elementStartPos,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.VE,
                Math.min(
                  segment.elementEndPos ?? Infinity,
                  elementStartPos + MAX_RESYNC_LENGTH,
                ),
              );
              if (nextPos) {
                currentPos = nextPos;
                continue;
              } else {
                break;
              }
            }
            const id = elementHeader.id;
            let size = elementHeader.size;
            const dataStartPos = slice.filePos;
            if (id === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Cluster) {
              currentCluster = await demuxer.readCluster(
                elementStartPos,
                segment,
              );
              size = currentCluster.elementEndPos - dataStartPos;
              const { blockIndex, correctBlockFound } =
                getMatchInCluster(currentCluster);
              if (correctBlockFound) {
                return this.fetchPacketInCluster(
                  currentCluster,
                  blockIndex,
                  options,
                );
              }
              if (blockIndex !== -1) {
                bestCluster = currentCluster;
                bestBlockIndex = blockIndex;
              }
            }
            if (size === void 0) {
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
                id !== _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Cluster,
              );
              const nextElementPos = await (0,
              _ebml_js__WEBPACK_IMPORTED_MODULE_7__.IQ)(
                demuxer.reader,
                dataStartPos,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.K9,
                segment.elementEndPos,
              );
              size = nextElementPos.pos - dataStartPos;
            }
            const endPos = dataStartPos + size;
            if (segment.elementEndPos === null) {
              let slice2 = demuxer.reader.requestSliceRange(
                endPos,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.De,
                _ebml_js__WEBPACK_IMPORTED_MODULE_7__.r1,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.Qg)(slice2))
                slice2 = await slice2;
              if (!slice2) break;
              const elementId = (0, _ebml_js__WEBPACK_IMPORTED_MODULE_7__.SR)(
                slice2,
              );
              if (
                elementId === _ebml_js__WEBPACK_IMPORTED_MODULE_7__.Cl.Segment
              ) {
                segment.elementEndPos = endPos;
                break;
              }
            }
            currentPos = endPos;
          }
          if (
            cuePoint &&
            (!bestCluster ||
              bestCluster.elementStartPos < cuePoint.clusterPosition)
          ) {
            const previousCuePoint =
              this.internalTrack.cuePoints[cuePointIndex - 1];
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.vA)(
              !previousCuePoint || previousCuePoint.time < cuePoint.time,
            );
            const newSearchTimestamp = previousCuePoint?.time ?? -Infinity;
            return this.performClusterLookup(
              null,
              getMatchInCluster,
              newSearchTimestamp,
              latestTimestamp,
              options,
            );
          }
          if (bestCluster) {
            return this.fetchPacketInCluster(
              bestCluster,
              bestBlockIndex,
              options,
            );
          }
          return null;
        }
      }
      class MatroskaVideoTrackBacking extends MatroskaTrackBacking {
        constructor(internalTrack) {
          super(internalTrack);
          this.decoderConfigPromise = null;
          this.internalTrack = internalTrack;
        }
        getType() {
          return "video";
        }
        getCodec() {
          return this.internalTrack.info.codec;
        }
        getCodedWidth() {
          return this.internalTrack.info.width;
        }
        getCodedHeight() {
          return this.internalTrack.info.height;
        }
        getSquarePixelWidth() {
          return this.internalTrack.info.squarePixelWidth;
        }
        getSquarePixelHeight() {
          return this.internalTrack.info.squarePixelHeight;
        }
        getRotation() {
          return this.internalTrack.info.rotation;
        }
        async getColorSpace() {
          const decoderConfig = await this.getDecoderConfig();
          if (!decoderConfig) {
            return this.internalTrack.info.colorSpace;
          }
          return {
            primaries: decoderConfig.colorSpace?.primaries,
            transfer: decoderConfig.colorSpace?.transfer,
            matrix: decoderConfig.colorSpace?.matrix,
            fullRange: decoderConfig.colorSpace?.fullRange,
          };
        }
        async canBeTransparent() {
          return (
            this.internalTrack.info.alphaMode ||
            (this.internalTrack.info.codec === "prores" &&
              (this.internalTrack.info.proresFormat === "ap4h" ||
                this.internalTrack.info.proresFormat === "ap4x"))
          );
        }
        async getDecoderConfig() {
          if (!this.internalTrack.info.codec) {
            return null;
          }
          return (this.decoderConfigPromise ??= (async () => {
            let firstPacket = null;
            const needsPacketForAdditionalInfo =
              this.internalTrack.info.codec === "vp9" ||
              this.internalTrack.info.codec === "av1" ||
              this.internalTrack.info.codec === "prores" ||
              (this.internalTrack.info.codec === "avc" &&
                !this.internalTrack.info.codecDescription) ||
              (this.internalTrack.info.codec === "hevc" &&
                !this.internalTrack.info.codecDescription);
            if (needsPacketForAdditionalInfo) {
              firstPacket = await this.getFirstPacket({});
            }
            const codecInfo = {
              width: this.internalTrack.info.width,
              height: this.internalTrack.info.height,
              codec: this.internalTrack.info.codec,
              codecDescription: this.internalTrack.info.codecDescription,
              colorSpace: this.internalTrack.info.colorSpace,
              avcType: 1,
              // We don't know better (or do we?) so just assume 'avc1'
              avcCodecInfo:
                this.internalTrack.info.codec === "avc" && firstPacket
                  ? (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.fH)(
                      firstPacket.data,
                    )
                  : null,
              hevcCodecInfo:
                this.internalTrack.info.codec === "hevc" && firstPacket
                  ? (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.D5)(
                      firstPacket.data,
                    )
                  : null,
              vp9CodecInfo:
                this.internalTrack.info.codec === "vp9" && firstPacket
                  ? (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.bs)(
                      firstPacket.data,
                    )
                  : null,
              av1CodecInfo:
                this.internalTrack.info.codec === "av1" && firstPacket
                  ? (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.UU)(
                      firstPacket.data,
                    )
                  : null,
              proresCodecInfo:
                this.internalTrack.info.codec === "prores" && firstPacket
                  ? (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.RU)(
                      firstPacket.data,
                    )
                  : null,
              proresFormat: this.internalTrack.info.proresFormat,
            };
            if (
              !(0, _misc_js__WEBPACK_IMPORTED_MODULE_5__.HV)(
                this.internalTrack.info.colorSpace,
              )
            ) {
              const colorSpace = (0, _codec_js__WEBPACK_IMPORTED_MODULE_1__.LD)(
                codecInfo,
              );
              this.internalTrack.info.colorSpace.primaries ??=
                colorSpace.primaries;
              this.internalTrack.info.colorSpace.transfer ??=
                colorSpace.transfer;
              this.internalTrack.info.colorSpace.matrix ??= colorSpace.matrix;
              this.internalTrack.info.colorSpace.fullRange ??=
                colorSpace.fullRange;
            }
            const config = {
              codec: (0, _codec_js__WEBPACK_IMPORTED_MODULE_1__.QP)(codecInfo),
              codedWidth: this.internalTrack.info.width,
              codedHeight: this.internalTrack.info.height,
              description: this.internalTrack.info.codecDescription ?? void 0,
              colorSpace: this.internalTrack.info.colorSpace,
            };
            if (
              this.internalTrack.info.width !==
                this.internalTrack.info.squarePixelWidth ||
              this.internalTrack.info.height !==
                this.internalTrack.info.squarePixelHeight
            ) {
              config.displayAspectWidth =
                this.internalTrack.info.squarePixelWidth;
              config.displayAspectHeight =
                this.internalTrack.info.squarePixelHeight;
            }
            return config;
          })());
        }
      }
      class MatroskaAudioTrackBacking extends MatroskaTrackBacking {
        constructor(internalTrack) {
          super(internalTrack);
          this.decoderConfigPromise = null;
          this.internalTrack = internalTrack;
        }
        getType() {
          return "audio";
        }
        getCodec() {
          return this.internalTrack.info.codec;
        }
        getNumberOfChannels() {
          return this.internalTrack.info.numberOfChannels;
        }
        getSampleRate() {
          return this.internalTrack.info.sampleRate;
        }
        async getDecoderConfig() {
          if (!this.internalTrack.info.codec) {
            return null;
          }
          return (this.decoderConfigPromise ??= (async () => {
            if (
              this.internalTrack.info.codec === "dts" &&
              !this.internalTrack.info.dtsFormat
            ) {
              const firstPacket = await this.getFirstPacket({});
              this.internalTrack.info.dtsFormat =
                firstPacket &&
                (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.n$)(
                  firstPacket.data,
                );
            }
            return {
              codec: (0, _codec_js__WEBPACK_IMPORTED_MODULE_1__.X0)({
                codec: this.internalTrack.info.codec,
                codecDescription: this.internalTrack.info.codecDescription,
                aacCodecInfo: this.internalTrack.info.aacCodecInfo,
                dtsFormat: this.internalTrack.info.dtsFormat,
              }),
              numberOfChannels: this.internalTrack.info.numberOfChannels,
              sampleRate: this.internalTrack.info.sampleRate,
              description: this.internalTrack.info.codecDescription ?? void 0,
            };
          })());
        }
      }
    },
    /***/
    160(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        V: () =>
          /* binding */
          buildMatroskaMimeType,
        /* harmony export */
      });
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const buildMatroskaMimeType = (info) => {
        const base = info.hasVideo
          ? "video/"
          : info.hasAudio
            ? "audio/"
            : "application/";
        let string = base + (info.isWebM ? "webm" : "x-matroska");
        if (info.codecStrings.length > 0) {
          const uniqueCodecMimeTypes = [
            ...new Set(info.codecStrings.filter(Boolean)),
          ];
          string += '; codecs="'.concat(uniqueCodecMimeTypes.join(", "), '"');
        }
        return string;
      };
    },
    /***/
    4264(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        l: () =>
          /* binding */
          Mp3Demuxer,
        /* harmony export */
      });
      var _demuxer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2114);
      var _metadata_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8957);
      var _misc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6760);
      var _packet_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6016);
      var _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__ =
        __webpack_require__(1604);
      var _id3_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7400);
      var _mp3_reader_js__WEBPACK_IMPORTED_MODULE_6__ =
        __webpack_require__(8597);
      var _reader_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class Mp3Demuxer extends _demuxer_js__WEBPACK_IMPORTED_MODULE_0__.B {
        constructor(input) {
          super(input);
          this.metadataPromise = null;
          this.firstFrameHeader = null;
          this.firstFrameHeaderPos = null;
          this.xingFrameHeader = null;
          this.xingFrameHeaderPos = null;
          this.loadedSamples = [];
          this.metadataTags = null;
          this.xingData = null;
          this.trackBackings = [];
          this.readingMutex = new _misc_js__WEBPACK_IMPORTED_MODULE_2__.aD();
          this.lastSampleLoaded = false;
          this.lastLoadedPos = 0;
          this.nextTimestampInSamples = 0;
          this.reader = input._reader;
        }
        async readMetadata() {
          return (this.metadataPromise ??= (async () => {
            while (!this.firstFrameHeader && !this.lastSampleLoaded) {
              await this.advanceReader();
            }
            if (!this.firstFrameHeader && this.xingFrameHeader) {
              this.firstFrameHeader = this.xingFrameHeader;
              this.firstFrameHeaderPos = this.xingFrameHeaderPos;
            }
            if (!this.firstFrameHeader) {
              throw new Error("No valid MP3 frame found.");
            }
            this.trackBackings = [new Mp3AudioTrackBacking(this)];
          })());
        }
        async advanceReader() {
          if (this.lastLoadedPos === 0) {
            while (true) {
              let slice2 = this.reader.requestSlice(
                this.lastLoadedPos,
                _id3_js__WEBPACK_IMPORTED_MODULE_5__.sY,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice2))
                slice2 = await slice2;
              if (!slice2) {
                this.lastSampleLoaded = true;
                return;
              }
              const id3V2Header = (0, _id3_js__WEBPACK_IMPORTED_MODULE_5__.IX)(
                slice2,
              );
              if (!id3V2Header) {
                break;
              }
              this.lastLoadedPos = slice2.filePos + id3V2Header.size;
            }
          }
          const result = await (0,
          _mp3_reader_js__WEBPACK_IMPORTED_MODULE_6__.W)(
            this.reader,
            this.lastLoadedPos,
            this.reader.fileSize,
            this.firstFrameHeader,
          );
          if (!result) {
            this.lastSampleLoaded = true;
            return;
          }
          const header = result.header;
          this.lastLoadedPos = result.startPos + header.totalSize - 1;
          const xingOffset = (0,
          _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.EZ)(
            header.mpegVersionId,
            header.channel,
          );
          let slice = this.reader.requestSlice(result.startPos + xingOffset, 4);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice))
            slice = await slice;
          if (slice) {
            const word = (0, _reader_js__WEBPACK_IMPORTED_MODULE_7__.cN)(slice);
            const isXing =
              word === _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.hY ||
              word === _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.rD;
            if (isXing) {
              if (!this.xingFrameHeader) {
                this.xingFrameHeader = header;
                this.xingFrameHeaderPos = result.startPos;
              }
              if (!this.xingData) {
                let xingDataSlice = this.reader.requestSlice(
                  result.startPos + xingOffset + 4,
                  12,
                );
                if (
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(xingDataSlice)
                )
                  xingDataSlice = await xingDataSlice;
                if (xingDataSlice) {
                  const xingData = (0,
                  _reader_js__WEBPACK_IMPORTED_MODULE_7__.io)(
                    xingDataSlice,
                    12,
                  );
                  const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Zc)(
                    xingData,
                  );
                  const flags = view.getUint32(0, false);
                  this.xingData = {
                    frameCount:
                      flags &
                      _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.MJ
                        .FrameCount
                        ? view.getUint32(4, false)
                        : null,
                    fileSize:
                      flags &
                      _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.MJ
                        .FileSize
                        ? view.getUint32(8, false)
                        : null,
                  };
                }
              }
              return;
            }
          }
          if (!this.firstFrameHeader) {
            this.firstFrameHeader = header;
            this.firstFrameHeaderPos = result.startPos;
          }
          const sampleDuration =
            header.audioSamplesInFrame / this.firstFrameHeader.sampleRate;
          const sample = {
            timestamp:
              this.nextTimestampInSamples / this.firstFrameHeader.sampleRate,
            duration: sampleDuration,
            dataStart: result.startPos,
            dataSize: header.totalSize,
          };
          this.loadedSamples.push(sample);
          this.nextTimestampInSamples += header.audioSamplesInFrame;
          return;
        }
        async getMimeType() {
          return "audio/mpeg";
        }
        async getTrackBackings() {
          await this.readMetadata();
          return this.trackBackings;
        }
        async getMetadataTags() {
          const release = await this.readingMutex.acquire();
          try {
            await this.readMetadata();
            if (this.metadataTags) {
              return this.metadataTags;
            }
            this.metadataTags = {};
            let currentPos = 0;
            let id3V2HeaderFound = false;
            while (true) {
              let headerSlice = this.reader.requestSlice(
                currentPos,
                _id3_js__WEBPACK_IMPORTED_MODULE_5__.sY,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(headerSlice))
                headerSlice = await headerSlice;
              if (!headerSlice) break;
              const id3V2Header = (0, _id3_js__WEBPACK_IMPORTED_MODULE_5__.IX)(
                headerSlice,
              );
              if (!id3V2Header) {
                break;
              }
              id3V2HeaderFound = true;
              let contentSlice = this.reader.requestSlice(
                headerSlice.filePos,
                id3V2Header.size,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(contentSlice))
                contentSlice = await contentSlice;
              if (!contentSlice) break;
              (0, _id3_js__WEBPACK_IMPORTED_MODULE_5__.cG)(
                contentSlice,
                id3V2Header,
                this.metadataTags,
              );
              currentPos = headerSlice.filePos + id3V2Header.size;
            }
            if (
              !id3V2HeaderFound &&
              this.reader.fileSize !== null &&
              this.reader.fileSize >= _id3_js__WEBPACK_IMPORTED_MODULE_5__.aU
            ) {
              let slice = this.reader.requestSlice(
                this.reader.fileSize - _id3_js__WEBPACK_IMPORTED_MODULE_5__.aU,
                _id3_js__WEBPACK_IMPORTED_MODULE_5__.aU,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice))
                slice = await slice;
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(slice);
              const tag = (0, _reader_js__WEBPACK_IMPORTED_MODULE_7__.IT)(
                slice,
                3,
              );
              if (tag === "TAG") {
                (0, _id3_js__WEBPACK_IMPORTED_MODULE_5__.p_)(
                  slice,
                  this.metadataTags,
                );
              }
            }
            return this.metadataTags;
          } finally {
            release();
          }
        }
      }
      class Mp3AudioTrackBacking {
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
        getTimeResolution() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
            this.demuxer.firstFrameHeader,
          );
          return (
            this.demuxer.firstFrameHeader.sampleRate /
            this.demuxer.firstFrameHeader.audioSamplesInFrame
          );
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
          const demuxer = this.demuxer;
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
            demuxer.firstFrameHeader !== null,
          );
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
            demuxer.firstFrameHeaderPos !== null,
          );
          if (demuxer.xingData) {
            if (demuxer.xingData.frameCount !== null) {
              return (
                (demuxer.xingData.frameCount *
                  demuxer.firstFrameHeader.audioSamplesInFrame) /
                demuxer.firstFrameHeader.sampleRate
              );
            }
          } else {
            if (demuxer.reader.fileSize !== null) {
              const averageFrameSize = (0,
              _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.hD)(
                demuxer.firstFrameHeader.lowSamplingFrequency,
                demuxer.firstFrameHeader.layer,
                demuxer.firstFrameHeader.bitrate,
                demuxer.firstFrameHeader.sampleRate,
              );
              const frameCount =
                (demuxer.reader.fileSize - demuxer.firstFrameHeaderPos) /
                averageFrameSize;
              return (
                (Math.round(frameCount) *
                  demuxer.firstFrameHeader.audioSamplesInFrame) /
                demuxer.firstFrameHeader.sampleRate
              );
            }
          }
          return null;
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
        getCodec() {
          return "mp3";
        }
        getInternalCodecId() {
          return null;
        }
        getNumberOfChannels() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
            this.demuxer.firstFrameHeader,
          );
          return (0, _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.fX)(
            this.demuxer.firstFrameHeader.channel,
          );
        }
        getSampleRate() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
            this.demuxer.firstFrameHeader,
          );
          return this.demuxer.firstFrameHeader.sampleRate;
        }
        getDisposition() {
          return {
            ..._metadata_js__WEBPACK_IMPORTED_MODULE_1__.gM,
          };
        }
        async getDecoderConfig() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.vA)(
            this.demuxer.firstFrameHeader,
          );
          return {
            codec: "mp3",
            numberOfChannels: (0,
            _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_4__.fX)(
              this.demuxer.firstFrameHeader.channel,
            ),
            sampleRate: this.demuxer.firstFrameHeader.sampleRate,
          };
        }
        async getPacketAtIndex(sampleIndex, options) {
          if (sampleIndex === -1) {
            return null;
          }
          const rawSample = this.demuxer.loadedSamples[sampleIndex];
          if (!rawSample) {
            return null;
          }
          let data;
          if (options.metadataOnly) {
            data = _packet_js__WEBPACK_IMPORTED_MODULE_3__.T;
          } else {
            let slice = this.demuxer.reader.requestSlice(
              rawSample.dataStart,
              rawSample.dataSize,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.Qg)(slice))
              slice = await slice;
            if (!slice) {
              return null;
            }
            data = (0, _reader_js__WEBPACK_IMPORTED_MODULE_7__.io)(
              slice,
              rawSample.dataSize,
            );
          }
          return new _packet_js__WEBPACK_IMPORTED_MODULE_3__.Z(
            data,
            "key",
            rawSample.timestamp,
            rawSample.duration,
            sampleIndex,
            rawSample.dataSize,
          );
        }
        getFirstPacket(options) {
          return this.getPacketAtIndex(0, options);
        }
        async getNextPacket(packet, options) {
          const release = await this.demuxer.readingMutex.acquire();
          try {
            const sampleIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.pl)(
              this.demuxer.loadedSamples,
              packet.timestamp,
              (x) => x.timestamp,
            );
            if (sampleIndex === -1) {
              throw new Error("Packet was not created from this track.");
            }
            const nextIndex = sampleIndex + 1;
            while (
              nextIndex >= this.demuxer.loadedSamples.length &&
              !this.demuxer.lastSampleLoaded
            ) {
              await this.demuxer.advanceReader();
            }
            return this.getPacketAtIndex(nextIndex, options);
          } finally {
            release();
          }
        }
        async getPacket(timestamp, options) {
          const release = await this.demuxer.readingMutex.acquire();
          try {
            while (true) {
              const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_2__.eE)(
                this.demuxer.loadedSamples,
                timestamp,
                (x) => x.timestamp,
              );
              if (index === -1 && this.demuxer.loadedSamples.length > 0) {
                return null;
              }
              if (this.demuxer.lastSampleLoaded) {
                return this.getPacketAtIndex(index, options);
              }
              if (index >= 0 && index + 1 < this.demuxer.loadedSamples.length) {
                return this.getPacketAtIndex(index, options);
              }
              await this.demuxer.advanceReader();
            }
          } finally {
            release();
          }
        }
        getKeyPacket(timestamp, options) {
          return this.getPacket(timestamp, options);
        }
        getNextKeyPacket(packet, options) {
          return this.getNextPacket(packet, options);
        }
      }
    },
    /***/
    8597(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        W: () =>
          /* binding */
          readNextMp3FrameHeader,
        /* harmony export */
      });
      var _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(1604);
      var _misc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6760);
      var _reader_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5815);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const readNextMp3FrameHeader = async (
        reader,
        startPos,
        until,
        ref = null,
      ) => {
        const CHUNK_SIZE = 2 ** 16;
        let currentPos = startPos;
        while (until === null || currentPos < until) {
          const maxLength =
            until !== null
              ? Math.min(CHUNK_SIZE, until - currentPos)
              : CHUNK_SIZE;
          let slice = reader.requestSliceRange(
            currentPos,
            _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_0__.D_,
            maxLength,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Qg)(slice))
            slice = await slice;
          if (
            !slice ||
            slice.length < _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_0__.D_
          )
            break;
          while (
            slice.remainingLength >=
            _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_0__.D_
          ) {
            const posBeforeRead = slice.filePos;
            const word = (0, _reader_js__WEBPACK_IMPORTED_MODULE_2__.cN)(slice);
            const remainingBytes =
              reader.fileSize !== null ? reader.fileSize - currentPos : null;
            const result = (0,
            _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_0__.P8)(
              word,
              remainingBytes,
            );
            if (
              result.header &&
              (!ref || // This condition helps us recover malformed streams
                // https://stackoverflow.com/a/20884944
                (result.header.sampleRate === ref.sampleRate &&
                  result.header.mpegVersionId === ref.mpegVersionId &&
                  result.header.layer === ref.layer &&
                  (0, _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_0__.fX)(
                    result.header.channel,
                  ) ===
                    (0, _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_0__.fX)(
                      ref.channel,
                    )))
            ) {
              return { header: result.header, startPos: currentPos };
            }
            slice.filePos = posBeforeRead + result.bytesAdvanced;
            currentPos = slice.filePos;
          }
        }
        return null;
      };
    },
    /***/
    8868(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        f: () =>
          /* binding */
          MpegTsDemuxer,
        /* harmony export */
      });
      var _adts_adts_demuxer_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(5694);
      var _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_1__ =
        __webpack_require__(5627);
      var _shared_aac_misc_js__WEBPACK_IMPORTED_MODULE_2__ =
        __webpack_require__(4691);
      var _codec_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8276);
      var _codec_data_js__WEBPACK_IMPORTED_MODULE_4__ =
        __webpack_require__(9705);
      var _demuxer_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2114);
      var _logging_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9815);
      var _metadata_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(8957);
      var _misc_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6760);
      var _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_9__ =
        __webpack_require__(1604);
      var _packet_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(6016);
      var _reader_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(5815);
      var _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__ =
        __webpack_require__(6586);
      var _shared_ac3_misc_js__WEBPACK_IMPORTED_MODULE_13__ =
        __webpack_require__(9745);
      var _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_14__ =
        __webpack_require__(3486);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const MISSING_PTS_ERROR_MESSAGE =
        "PES packet is missing PTS where it was expected. PES packets without PTS are not currently supported. If you think this file should be supported, please report it.";
      const REGISTRATION_DESCRIPTOR_TAG = 5;
      const HDMV_FORMAT_IDENTIFIER = 1212435798;
      const HDPR_FORMAT_IDENTIFIER = 1212436562;
      const DTS_FORMAT_IDENTIFIER_PREFIX = 1146376960;
      const BLU_RAY_DTS_STREAM_TYPES = /* @__PURE__ */ new Set([133, 134, 162]);
      const ignoredStreamTypes = /* @__PURE__ */ new Set();
      class MpegTsDemuxer extends _demuxer_js__WEBPACK_IMPORTED_MODULE_5__.B {
        constructor(input) {
          super(input);
          this.metadataPromise = null;
          this.elementaryStreams = [];
          this.trackBackingEntries = [];
          this.packetOffset = 0;
          this.packetStride = -1;
          this.sectionEndPositions = [];
          this.seekChunkSize = 5 * 1024 * 1024;
          this.minReferencePointByteDistance = -1;
          this.reader = input._reader;
        }
        async readMetadata() {
          return (this.metadataPromise ??= (async () => {
            const lengthToCheck =
              _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.ZT + 16 + 1;
            let startingSlice = this.reader.requestSlice(0, lengthToCheck);
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(startingSlice))
              startingSlice = await startingSlice;
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(startingSlice);
            const startingBytes = (0,
            _reader_js__WEBPACK_IMPORTED_MODULE_11__.io)(
              startingSlice,
              lengthToCheck,
            );
            if (
              startingBytes[0] === 71 &&
              startingBytes[
                _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.ZT
              ] === 71
            ) {
              this.packetOffset = 0;
              this.packetStride =
                _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.ZT;
            } else if (
              startingBytes[0] === 71 &&
              startingBytes[
                _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.ZT + 16
              ] === 71
            ) {
              this.packetOffset = 0;
              this.packetStride =
                _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.ZT + 16;
            } else if (
              startingBytes[4] === 71 &&
              startingBytes[
                4 + _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.ZT + 4
              ] === 71
            ) {
              this.packetOffset = 4;
              this.packetStride =
                _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.ZT + 4;
            } else {
              throw new Error("Unreachable.");
            }
            const MIN_REFERENCE_POINT_PACKET_DISTANCE = 256;
            this.minReferencePointByteDistance =
              MIN_REFERENCE_POINT_PACKET_DISTANCE * this.packetStride;
            let currentPos = this.packetOffset;
            let programMapPid = null;
            let hasProgramAssociationTable = false;
            let hasProgramMap = false;
            while (true) {
              const packetHeader = await this.readPacketHeader(currentPos);
              if (!packetHeader) {
                break;
              }
              if (packetHeader.payloadUnitStartIndicator === 0) {
                currentPos += this.packetStride;
                continue;
              }
              if (
                hasProgramMap &&
                !this.elementaryStreams.some((x) => x.pid === packetHeader.pid)
              ) {
                currentPos += this.packetStride;
                continue;
              }
              const section = await this.readSection(
                currentPos,
                true,
                !hasProgramMap,
              );
              if (!section) {
                break;
              }
              const BYTES_BEFORE_SECTION_LENGTH = 3;
              const BITS_IN_CRC_32 = 32;
              let isProbablyProgramMap = false;
              if (!hasProgramMap && section.pid !== 0) {
                const isPesPacket =
                  section.payload[0] === 0 &&
                  section.payload[1] === 0 &&
                  section.payload[2] === 1;
                if (!isPesPacket) {
                  const bitstream =
                    new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_14__._(
                      section.payload,
                    );
                  const pointerField = bitstream.readAlignedByte();
                  bitstream.skipBits(8 * pointerField);
                  const tableId = bitstream.readBits(8);
                  isProbablyProgramMap = tableId === 2;
                }
              }
              if (section.pid === 0 && !hasProgramAssociationTable) {
                const bitstream =
                  new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_14__._(
                    section.payload,
                  );
                const pointerField = bitstream.readAlignedByte();
                bitstream.skipBits(8 * pointerField);
                bitstream.skipBits(14);
                const sectionLength = bitstream.readBits(10);
                bitstream.skipBits(40);
                while (
                  8 * (sectionLength + BYTES_BEFORE_SECTION_LENGTH) -
                    bitstream.pos >
                  BITS_IN_CRC_32
                ) {
                  const programNumber = bitstream.readBits(16);
                  bitstream.skipBits(3);
                  const id = bitstream.readBits(13);
                  if (programNumber !== 0) {
                    if (programMapPid !== null) {
                      throw new Error(
                        "Only files with a single program are supported.",
                      );
                    } else {
                      programMapPid = id;
                    }
                  }
                }
                if (programMapPid === null) {
                  throw new Error(
                    "Program Association Table must link to a Program Map Table.",
                  );
                }
                hasProgramAssociationTable = true;
              } else if (
                (section.pid === programMapPid || isProbablyProgramMap) &&
                !hasProgramMap
              ) {
                const bitstream =
                  new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_14__._(
                    section.payload,
                  );
                const pointerField = bitstream.readAlignedByte();
                bitstream.skipBits(8 * pointerField);
                bitstream.skipBits(12);
                const sectionLength = bitstream.readBits(12);
                bitstream.skipBits(43);
                const pcrPid = bitstream.readBits(13);
                bitstream.skipBits(6);
                const programInfoLength = bitstream.readBits(10);
                const programInfoEndPos = bitstream.pos + 8 * programInfoLength;
                let isBluRayProgram = false;
                while (bitstream.pos < programInfoEndPos) {
                  const descriptorTag = bitstream.readBits(8);
                  const descriptorLength = bitstream.readBits(8);
                  const descriptorEndPos = bitstream.pos + 8 * descriptorLength;
                  if (
                    descriptorTag === REGISTRATION_DESCRIPTOR_TAG &&
                    descriptorLength >= 4
                  ) {
                    const formatIdentifier = bitstream.readBits(32);
                    isBluRayProgram ||=
                      formatIdentifier === HDMV_FORMAT_IDENTIFIER ||
                      formatIdentifier === HDPR_FORMAT_IDENTIFIER;
                  }
                  bitstream.pos = descriptorEndPos;
                }
                bitstream.pos = programInfoEndPos;
                while (
                  8 * (sectionLength + BYTES_BEFORE_SECTION_LENGTH) -
                    bitstream.pos >
                  BITS_IN_CRC_32
                ) {
                  const streamType = bitstream.readBits(8);
                  bitstream.skipBits(3);
                  const elementaryPid = bitstream.readBits(13);
                  bitstream.skipBits(6);
                  const esInfoLength = bitstream.readBits(10);
                  const esInfoEndPos = bitstream.pos + 8 * esInfoLength;
                  let hasAc3Descriptor = false;
                  let hasEac3Descriptor = false;
                  let hasDtsDescriptor = false;
                  while (bitstream.pos < esInfoEndPos) {
                    const descriptorTag = bitstream.readBits(8);
                    const descriptorLength = bitstream.readBits(8);
                    const descriptorEndPos =
                      bitstream.pos + 8 * descriptorLength;
                    if (descriptorTag === 106) {
                      hasAc3Descriptor = true;
                    } else if (descriptorTag === 122 || descriptorTag === 204) {
                      hasEac3Descriptor = true;
                    } else if (descriptorTag === 123) {
                      hasDtsDescriptor = true;
                    } else if (
                      descriptorTag === REGISTRATION_DESCRIPTOR_TAG &&
                      descriptorLength >= 4
                    ) {
                      const formatIdentifier = bitstream.readBits(32);
                      hasDtsDescriptor ||=
                        (formatIdentifier & 4294967040) ===
                        DTS_FORMAT_IDENTIFIER_PREFIX;
                    }
                    bitstream.pos = descriptorEndPos;
                  }
                  let info = null;
                  const effectiveStreamType =
                    isBluRayProgram && BLU_RAY_DTS_STREAM_TYPES.has(streamType)
                      ? 130
                      : streamType;
                  switch (effectiveStreamType) {
                    case 27:
                    case 36:
                      {
                        const codec = streamType === 27 ? "avc" : "hevc";
                        info = {
                          type: "video",
                          codec,
                          decoderConfig: null,
                          avcCodecInfo: null,
                          hevcCodecInfo: null,
                          colorSpace: {
                            primaries: null,
                            transfer: null,
                            matrix: null,
                            fullRange: null,
                          },
                          width: -1,
                          height: -1,
                          squarePixelWidth: -1,
                          squarePixelHeight: -1,
                          reorderSize: -1,
                        };
                      }
                      break;
                    case 3:
                    case 4:
                    case 15:
                    case 129:
                    case 135:
                    case 130:
                    case 138:
                      {
                        let codec;
                        if (
                          effectiveStreamType === 3 ||
                          effectiveStreamType === 4
                        ) {
                          codec = "mp3";
                        } else if (effectiveStreamType === 15) {
                          codec = "aac";
                        } else if (effectiveStreamType === 129) {
                          codec = "ac3";
                        } else if (effectiveStreamType === 135) {
                          codec = "eac3";
                        } else {
                          codec = "dts";
                        }
                        info = {
                          type: "audio",
                          codec,
                          decoderConfig: null,
                          aacCodecInfo: null,
                          dtsFormat: null,
                          numberOfChannels: -1,
                          sampleRate: -1,
                        };
                      }
                      break;
                    case 6:
                      {
                        if (hasEac3Descriptor) {
                          info = {
                            type: "audio",
                            codec: "eac3",
                            decoderConfig: null,
                            aacCodecInfo: null,
                            dtsFormat: null,
                            numberOfChannels: -1,
                            sampleRate: -1,
                          };
                        } else if (hasAc3Descriptor) {
                          info = {
                            type: "audio",
                            codec: "ac3",
                            decoderConfig: null,
                            aacCodecInfo: null,
                            dtsFormat: null,
                            numberOfChannels: -1,
                            sampleRate: -1,
                          };
                        } else if (hasDtsDescriptor) {
                          info = {
                            type: "audio",
                            codec: "dts",
                            decoderConfig: null,
                            aacCodecInfo: null,
                            dtsFormat: null,
                            numberOfChannels: -1,
                            sampleRate: -1,
                          };
                        }
                      }
                      break;
                    default: {
                      if (!ignoredStreamTypes.has(streamType)) {
                        _logging_js__WEBPACK_IMPORTED_MODULE_6__.y._warn(
                          "Note: MPEG-TS streams with stream_type 0x".concat(
                            streamType.toString(16),
                            " are not",
                          ) + " currently supported.",
                        );
                        ignoredStreamTypes.add(streamType);
                      }
                    }
                  }
                  if (info) {
                    this.elementaryStreams.push({
                      demuxer: this,
                      pid: elementaryPid,
                      streamType,
                      initialized: false,
                      firstSection: null,
                      canBeTrustedWithKeyPackets: false,
                      info,
                      referencePesPackets: [],
                    });
                  }
                }
                hasProgramMap = true;
              } else {
                const elementaryStream = this.elementaryStreams.find(
                  (x) => x.pid === section.pid,
                );
                outer: if (elementaryStream && !elementaryStream.initialized) {
                  const pesPacket = readPesPacket(section, true);
                  if (!pesPacket) {
                    throw new Error(
                      "Couldn't read first PES packet for Elementary Stream with PID ".concat(
                        elementaryStream.pid,
                      ),
                    );
                  }
                  elementaryStream.firstSection = section;
                  elementaryStream.canBeTrustedWithKeyPackets =
                    section.randomAccessIndicator === 1;
                  if (this.input._initInput) {
                    const initDemuxer =
                      await this.input._initInput._getDemuxer();
                    const matchingStream = initDemuxer.elementaryStreams.find(
                      (x) =>
                        x.pid === section.pid &&
                        x.info.codec === elementaryStream.info.codec,
                    );
                    if (matchingStream) {
                      elementaryStream.info = matchingStream.info;
                      elementaryStream.initialized = true;
                      break outer;
                    }
                  }
                  const context = new PacketReadingContext(
                    elementaryStream,
                    pesPacket,
                  );
                  if (elementaryStream.info.type === "video") {
                    while (true) {
                      const contextAlias = context;
                      contextAlias.suppliedPacket = null;
                      await context.markNextPacket();
                      if (elementaryStream.info.codec === "avc") {
                        if (!context.suppliedPacket) {
                          throw new Error(
                            "Invalid AVC video stream; could not extract AVCDecoderConfigurationRecord from any packet.",
                          );
                        }
                        elementaryStream.info.avcCodecInfo = (0,
                        _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.fH)(
                          context.suppliedPacket.data,
                        );
                        if (!elementaryStream.info.avcCodecInfo) {
                          continue;
                        }
                        const spsUnit =
                          elementaryStream.info.avcCodecInfo
                            .sequenceParameterSets[0];
                        (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(spsUnit);
                        const spsInfo = (0,
                        _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.eM)(
                          spsUnit,
                        );
                        elementaryStream.info.width = spsInfo.displayWidth;
                        elementaryStream.info.height = spsInfo.displayHeight;
                        const num = spsInfo.pixelAspectRatio.num;
                        const den = spsInfo.pixelAspectRatio.den;
                        if (num > 0 && den > 0) {
                          if (num > den) {
                            elementaryStream.info.squarePixelWidth = Math.round(
                              (elementaryStream.info.width * num) / den,
                            );
                            elementaryStream.info.squarePixelHeight =
                              elementaryStream.info.height;
                          } else {
                            elementaryStream.info.squarePixelWidth =
                              elementaryStream.info.width;
                            elementaryStream.info.squarePixelHeight =
                              Math.round(
                                (elementaryStream.info.height * den) / num,
                              );
                          }
                        }
                        elementaryStream.info.colorSpace = {
                          primaries:
                            _misc_js__WEBPACK_IMPORTED_MODULE_8__.BL[
                              spsInfo.colourPrimaries
                            ],
                          transfer:
                            _misc_js__WEBPACK_IMPORTED_MODULE_8__.x_[
                              spsInfo.transferCharacteristics
                            ],
                          matrix:
                            _misc_js__WEBPACK_IMPORTED_MODULE_8__.fl[
                              spsInfo.matrixCoefficients
                            ],
                          fullRange: !!spsInfo.fullRangeFlag,
                        };
                        elementaryStream.info.reorderSize =
                          spsInfo.maxDecFrameBuffering;
                        break;
                      } else if (elementaryStream.info.codec === "hevc") {
                        if (!context.suppliedPacket) {
                          throw new Error(
                            "Invalid HEVC video stream; could not extract HVCDecoderConfigurationRecord from first packet.",
                          );
                        }
                        elementaryStream.info.hevcCodecInfo = (0,
                        _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.D5)(
                          context.suppliedPacket.data,
                        );
                        if (!elementaryStream.info.hevcCodecInfo) {
                          continue;
                        }
                        const spsArray =
                          elementaryStream.info.hevcCodecInfo.arrays.find(
                            (a) =>
                              a.nalUnitType ===
                              _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.iJ
                                .SPS_NUT,
                          );
                        const spsUnit = spsArray.nalUnits[0];
                        (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(spsUnit);
                        const spsInfo = (0,
                        _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.gT)(
                          spsUnit,
                        );
                        elementaryStream.info.width = spsInfo.displayWidth;
                        elementaryStream.info.height = spsInfo.displayHeight;
                        if (
                          spsInfo.pixelAspectRatio.num >
                          spsInfo.pixelAspectRatio.den
                        ) {
                          elementaryStream.info.squarePixelWidth = Math.round(
                            (elementaryStream.info.width *
                              spsInfo.pixelAspectRatio.num) /
                              spsInfo.pixelAspectRatio.den,
                          );
                          elementaryStream.info.squarePixelHeight =
                            elementaryStream.info.height;
                        } else {
                          elementaryStream.info.squarePixelWidth =
                            elementaryStream.info.width;
                          elementaryStream.info.squarePixelHeight = Math.round(
                            (elementaryStream.info.height *
                              spsInfo.pixelAspectRatio.den) /
                              spsInfo.pixelAspectRatio.num,
                          );
                        }
                        elementaryStream.info.colorSpace = {
                          primaries:
                            _misc_js__WEBPACK_IMPORTED_MODULE_8__.BL[
                              spsInfo.colourPrimaries
                            ],
                          transfer:
                            _misc_js__WEBPACK_IMPORTED_MODULE_8__.x_[
                              spsInfo.transferCharacteristics
                            ],
                          matrix:
                            _misc_js__WEBPACK_IMPORTED_MODULE_8__.fl[
                              spsInfo.matrixCoefficients
                            ],
                          fullRange: !!spsInfo.fullRangeFlag,
                        };
                        elementaryStream.info.reorderSize =
                          spsInfo.maxDecFrameBuffering;
                        break;
                      } else {
                        throw new Error("Unhandled.");
                      }
                    }
                    elementaryStream.info.decoderConfig = {
                      codec: (0, _codec_js__WEBPACK_IMPORTED_MODULE_3__.QP)({
                        width: elementaryStream.info.width,
                        height: elementaryStream.info.height,
                        codec: elementaryStream.info.codec,
                        codecDescription: null,
                        colorSpace: elementaryStream.info.colorSpace,
                        avcType: 1,
                        avcCodecInfo: elementaryStream.info.avcCodecInfo,
                        hevcCodecInfo: elementaryStream.info.hevcCodecInfo,
                        vp9CodecInfo: null,
                        av1CodecInfo: null,
                        proresFormat: null,
                      }),
                      codedWidth: elementaryStream.info.width,
                      codedHeight: elementaryStream.info.height,
                      colorSpace: elementaryStream.info.colorSpace,
                    };
                    if (
                      elementaryStream.info.width !==
                        elementaryStream.info.squarePixelWidth ||
                      elementaryStream.info.height !==
                        elementaryStream.info.squarePixelHeight
                    ) {
                      elementaryStream.info.decoderConfig.displayAspectWidth =
                        elementaryStream.info.squarePixelWidth;
                      elementaryStream.info.decoderConfig.displayAspectHeight =
                        elementaryStream.info.squarePixelHeight;
                    }
                    elementaryStream.initialized = true;
                  } else {
                    await context.markNextPacket();
                    if (!context.suppliedPacket) {
                      throw new Error(
                        "Couldn't parse first media packet for Elementary Stream with" +
                          " PID ".concat(elementaryStream.pid),
                      );
                    }
                    if (elementaryStream.info.codec === "aac") {
                      const slice =
                        _reader_js__WEBPACK_IMPORTED_MODULE_11__.x$.tempFromBytes(
                          context.suppliedPacket.data,
                        );
                      const header = (0,
                      _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_1__.lh)(
                        slice,
                      );
                      if (!header) {
                        throw new Error(
                          "Invalid AAC audio stream; could not read ADTS frame header from first packet.",
                        );
                      }
                      elementaryStream.info.aacCodecInfo = {
                        isMpeg2: false,
                        objectType: header.objectType,
                      };
                      elementaryStream.info.numberOfChannels =
                        _shared_aac_misc_js__WEBPACK_IMPORTED_MODULE_2__.Ti[
                          header.channelConfiguration
                        ];
                      elementaryStream.info.sampleRate =
                        _shared_aac_misc_js__WEBPACK_IMPORTED_MODULE_2__.Im[
                          header.samplingFrequencyIndex
                        ];
                    } else if (elementaryStream.info.codec === "mp3") {
                      const word = (0,
                      _reader_js__WEBPACK_IMPORTED_MODULE_11__.cN)(
                        _reader_js__WEBPACK_IMPORTED_MODULE_11__.x$.tempFromBytes(
                          context.suppliedPacket.data,
                        ),
                      );
                      const result = (0,
                      _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_9__.P8)(
                        word,
                        context.suppliedPacket.data.byteLength,
                      );
                      if (!result.header) {
                        throw new Error(
                          "Invalid MP3 audio stream; could not read frame header from first packet.",
                        );
                      }
                      elementaryStream.info.numberOfChannels = (0,
                      _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_9__.fX)(
                        result.header.channel,
                      );
                      elementaryStream.info.sampleRate =
                        result.header.sampleRate;
                    } else if (elementaryStream.info.codec === "ac3") {
                      const frameInfo = (0,
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.LM)(
                        context.suppliedPacket.data,
                      );
                      if (!frameInfo) {
                        throw new Error(
                          "Invalid AC-3 audio stream; could not read sync frame from first packet.",
                        );
                      }
                      if (frameInfo.fscod === 3) {
                        throw new Error(
                          "Invalid AC-3 audio stream; reserved sample rate code found in first packet.",
                        );
                      }
                      elementaryStream.info.numberOfChannels =
                        _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.ux[
                          frameInfo.acmod
                        ] + frameInfo.lfeon;
                      elementaryStream.info.sampleRate =
                        _shared_ac3_misc_js__WEBPACK_IMPORTED_MODULE_13__.N[
                          frameInfo.fscod
                        ];
                    } else if (elementaryStream.info.codec === "eac3") {
                      const frameInfo = (0,
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.oL)(
                        context.suppliedPacket.data,
                      );
                      if (!frameInfo) {
                        throw new Error(
                          "Invalid E-AC-3 audio stream; could not read sync frame from first packet.",
                        );
                      }
                      const sampleRate = (0,
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.PK)(
                        frameInfo,
                      );
                      if (sampleRate === null) {
                        throw new Error(
                          "Invalid E-AC-3 audio stream; reserved sample rate code found in first packet.",
                        );
                      }
                      elementaryStream.info.numberOfChannels = (0,
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.zV)(
                        frameInfo,
                      );
                      elementaryStream.info.sampleRate = sampleRate;
                    } else if (elementaryStream.info.codec === "dts") {
                      const frameInfo = (0,
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.CX)(
                        context.suppliedPacket.data,
                      );
                      if (!frameInfo) {
                        throw new Error(
                          "Invalid DTS audio stream; could not read frame header from first packet.",
                        );
                      }
                      elementaryStream.info.numberOfChannels =
                        frameInfo.numberOfChannels;
                      elementaryStream.info.sampleRate = frameInfo.sampleRate;
                      if (frameInfo.core) {
                        elementaryStream.info.dtsFormat =
                          frameInfo.hasExtensions ? "dtsh" : "dtsc";
                      }
                    } else {
                      throw new Error("Unhandled.");
                    }
                    elementaryStream.info.decoderConfig = {
                      codec: (0, _codec_js__WEBPACK_IMPORTED_MODULE_3__.X0)({
                        codec: elementaryStream.info.codec,
                        codecDescription: null,
                        aacCodecInfo: elementaryStream.info.aacCodecInfo,
                        dtsFormat: elementaryStream.info.dtsFormat,
                      }),
                      numberOfChannels: elementaryStream.info.numberOfChannels,
                      sampleRate: elementaryStream.info.sampleRate,
                    };
                    elementaryStream.initialized = true;
                  }
                }
              }
              const isDone =
                hasProgramMap &&
                this.elementaryStreams.every((x) => x.initialized);
              if (isDone) {
                break;
              }
              currentPos += this.packetStride;
            }
            if (!hasProgramMap) {
              if (!hasProgramAssociationTable) {
                throw new Error(
                  "No Program Association Table found in the file.",
                );
              }
              throw new Error("No Program Map Table found in the file.");
            }
            for (const stream of this.elementaryStreams) {
              if (!stream.initialized) {
                continue;
              }
              if (stream.info.type === "video") {
                this.trackBackingEntries.push(
                  new MpegTsVideoTrackBacking(stream),
                );
              } else {
                this.trackBackingEntries.push(
                  new MpegTsAudioTrackBacking(stream),
                );
              }
            }
          })());
        }
        async getTrackBackings() {
          await this.readMetadata();
          return this.trackBackingEntries;
        }
        async getMetadataTags() {
          return {};
        }
        async getMimeType() {
          await this.readMetadata();
          const codecStrings = await Promise.all(
            this.trackBackingEntries.map((x) =>
              x.getDecoderConfig().then((c) => c?.codec ?? null),
            ),
          );
          return (0, _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.Vx)(
            codecStrings,
          );
        }
        async readSection(startPos, full, contiguous = false) {
          let endPos = startPos;
          let currentPos = startPos;
          const chunks = [];
          let chunksByteLength = 0;
          let firstPacket = null;
          let mustAddSectionEnd = true;
          let randomAccessIndicator = 0;
          while (true) {
            const packet = await this.readPacket(currentPos);
            currentPos += this.packetStride;
            if (!packet) {
              break;
            }
            if (!firstPacket) {
              if (packet.payloadUnitStartIndicator === 0) {
                break;
              }
              firstPacket = packet;
            } else {
              if (packet.pid !== firstPacket.pid) {
                if (contiguous) {
                  break;
                } else {
                  continue;
                }
              }
              if (packet.payloadUnitStartIndicator === 1) {
                break;
              }
            }
            const hasAdaptationField = !!(packet.adaptationFieldControl & 2);
            const hasPayload = !!(packet.adaptationFieldControl & 1);
            let adaptationFieldLength = 0;
            if (hasAdaptationField) {
              adaptationFieldLength = 1 + packet.body[0];
              if (packet === firstPacket && adaptationFieldLength > 1) {
                randomAccessIndicator = (packet.body[1] >> 6) & 1;
              }
            }
            if (hasPayload) {
              if (adaptationFieldLength === 0) {
                chunks.push(packet.body);
                chunksByteLength += packet.body.byteLength;
              } else {
                chunks.push(packet.body.subarray(adaptationFieldLength));
                chunksByteLength +=
                  packet.body.byteLength - adaptationFieldLength;
              }
            }
            endPos = currentPos;
            if (!full && chunksByteLength >= 64) {
              mustAddSectionEnd = false;
              break;
            }
            const isKnownSectionEnd =
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.pl)(
                this.sectionEndPositions,
                endPos,
                (x) => x,
              ) !== -1;
            if (isKnownSectionEnd) {
              mustAddSectionEnd = false;
              break;
            }
          }
          if (mustAddSectionEnd) {
            const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.eE)(
              this.sectionEndPositions,
              endPos,
              (x) => x,
            );
            this.sectionEndPositions.splice(index + 1, 0, endPos);
          }
          if (!firstPacket) {
            return null;
          }
          let merged;
          if (chunks.length === 1) {
            merged = chunks[0];
          } else {
            const totalLength = chunks.reduce(
              (sum, chunk) => sum + chunk.length,
              0,
            );
            merged = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
              merged.set(chunk, offset);
              offset += chunk.length;
            }
          }
          return {
            startPos,
            endPos: full ? endPos : null,
            pid: firstPacket.pid,
            payload: merged,
            randomAccessIndicator,
          };
        }
        async readPacketHeader(pos) {
          let slice = this.reader.requestSlice(pos, 4);
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(slice))
            slice = await slice;
          if (!slice) {
            return null;
          }
          const syncByte = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.eo)(
            slice,
          );
          if (syncByte !== 71) {
            throw new Error(
              "Invalid TS packet sync byte. Likely an internal bug, please report this file.",
            );
          }
          const nextTwoBytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.mH)(
            slice,
          );
          const transportErrorIndicator = nextTwoBytes >> 15;
          const payloadUnitStartIndicator = (nextTwoBytes >> 14) & 1;
          const transportPriority = (nextTwoBytes >> 13) & 1;
          const pid = nextTwoBytes & 8191;
          const nextByte = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.eo)(
            slice,
          );
          const transportScramblingControl = nextByte >> 6;
          const adaptationFieldControl = (nextByte >> 4) & 3;
          const continuityCounter = nextByte & 15;
          return {
            payloadUnitStartIndicator,
            pid,
            adaptationFieldControl,
          };
        }
        async readPacket(pos) {
          let slice = this.reader.requestSlice(
            pos,
            _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.ZT,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(slice))
            slice = await slice;
          if (!slice) {
            return null;
          }
          const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_11__.io)(
            slice,
            _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.ZT,
          );
          const syncByte = bytes[0];
          if (syncByte !== 71) {
            throw new Error(
              "Invalid TS packet sync byte. Likely an internal bug, please report this file.",
            );
          }
          const nextTwoBytes = (bytes[1] << 8) + bytes[2];
          const transportErrorIndicator = nextTwoBytes >> 15;
          const payloadUnitStartIndicator = (nextTwoBytes >> 14) & 1;
          const transportPriority = (nextTwoBytes >> 13) & 1;
          const pid = nextTwoBytes & 8191;
          const nextByte = bytes[3];
          const transportScramblingControl = nextByte >> 6;
          const adaptationFieldControl = (nextByte >> 4) & 3;
          const continuityCounter = nextByte & 15;
          return {
            payloadUnitStartIndicator,
            pid,
            adaptationFieldControl,
            body: bytes.subarray(4),
          };
        }
      }
      const readPesPacketHeader = (section, expectPts) => {
        if (section.payload.byteLength < 3) {
          return null;
        }
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_14__._(
            section.payload,
          );
        const startCodePrefix = bitstream.readBits(24);
        if (startCodePrefix !== 1) {
          return null;
        }
        const streamId = bitstream.readBits(8);
        bitstream.skipBits(16);
        if (
          streamId === 188 ||
          streamId === 190 ||
          streamId === 191 ||
          streamId === 240 ||
          streamId === 241 ||
          streamId === 255 ||
          streamId === 242 ||
          streamId === 248
        ) {
          return null;
        }
        bitstream.skipBits(8);
        const ptsDtsFlags = bitstream.readBits(2);
        bitstream.skipBits(14);
        let pts = null;
        if (ptsDtsFlags === 2 || ptsDtsFlags === 3) {
          pts = 0;
          bitstream.skipBits(4);
          pts += bitstream.readBits(3) * (1 << 30);
          bitstream.skipBits(1);
          pts += bitstream.readBits(15) * (1 << 15);
          bitstream.skipBits(1);
          pts += bitstream.readBits(15);
        } else {
          if (expectPts) {
            throw new Error(MISSING_PTS_ERROR_MESSAGE);
          }
        }
        return {
          sectionStartPos: section.startPos,
          sectionEndPos: section.endPos,
          pts,
          randomAccessIndicator: section.randomAccessIndicator,
        };
      };
      const readPesPacket = (section, expectPts) => {
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(section.endPos !== null);
        const header = readPesPacketHeader(section, expectPts);
        if (!header) {
          return null;
        }
        const bitstream =
          new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_14__._(
            section.payload,
          );
        bitstream.skipBits(32);
        const pesPacketLength = bitstream.readBits(16);
        const BYTES_UNTIL_END_OF_PES_PACKET_LENGTH = 6;
        bitstream.skipBits(16);
        const pesHeaderDataLength = bitstream.readBits(8);
        const pesHeaderEndPos = bitstream.pos + 8 * pesHeaderDataLength;
        bitstream.pos = pesHeaderEndPos;
        const bytePos = pesHeaderEndPos / 8;
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(
          Number.isInteger(bytePos),
        );
        const data = section.payload.subarray(
          bytePos,
          // "A value of 0 indicates that the PES packet length is neither specified nor bounded and is allowed only in
          // PES packets whose payload consists of bytes from a video elementary stream contained in
          // transport stream packets."
          pesPacketLength > 0
            ? BYTES_UNTIL_END_OF_PES_PACKET_LENGTH + pesPacketLength
            : section.payload.byteLength,
        );
        return {
          ...header,
          data,
        };
      };
      class MpegTsTrackBacking {
        constructor(elementaryStream) {
          this.elementaryStream = elementaryStream;
          this.packetBuffers = /* @__PURE__ */ new WeakMap();
          this.packetSectionStarts = /* @__PURE__ */ new WeakMap();
        }
        getId() {
          return this.elementaryStream.pid;
        }
        getNumber() {
          const demuxer = this.elementaryStream.demuxer;
          const trackType = this.elementaryStream.info.type;
          let number = 0;
          for (const backing of demuxer.trackBackingEntries) {
            if (backing.getType() === trackType) {
              number++;
            }
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(
              backing instanceof MpegTsTrackBacking,
            );
            if (backing.elementaryStream === this.elementaryStream) {
              break;
            }
          }
          return number;
        }
        getCodec() {
          throw new Error("Not implemented on base class.");
        }
        getInternalCodecId() {
          return this.elementaryStream.streamType;
        }
        getName() {
          return null;
        }
        getLanguageCode() {
          return _misc_js__WEBPACK_IMPORTED_MODULE_8__.IR;
        }
        getDisposition() {
          return {
            ..._metadata_js__WEBPACK_IMPORTED_MODULE_7__.gM,
            primary: false,
          };
        }
        getTimeResolution() {
          return _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.cS;
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
          return null;
        }
        async getLiveRefreshInterval() {
          return null;
        }
        createEncodedPacket(suppliedPacket, duration, options) {
          let packetType;
          if (this.allPacketsAreKeyPackets()) {
            packetType = "key";
          } else {
            packetType =
              suppliedPacket.randomAccessIndicator === 1 ? "key" : "delta";
          }
          return new _packet_js__WEBPACK_IMPORTED_MODULE_10__.Z(
            options.metadataOnly
              ? _packet_js__WEBPACK_IMPORTED_MODULE_10__.T
              : suppliedPacket.data,
            packetType,
            suppliedPacket.pts /
              _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.cS,
            Math.max(
              duration / _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.cS,
              0,
            ),
            suppliedPacket.sequenceNumber,
            suppliedPacket.data.byteLength,
          );
        }
        async getFirstPacket(options) {
          const section = this.elementaryStream.firstSection;
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(section);
          const pesPacket = readPesPacket(section, true);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(pesPacket);
          const context = new PacketReadingContext(
            this.elementaryStream,
            pesPacket,
          );
          const buffer = new PacketBuffer(this, context);
          const result = await buffer.readNext();
          if (!result) {
            return null;
          }
          const packet = this.createEncodedPacket(
            result.packet,
            result.duration,
            options,
          );
          this.packetBuffers.set(packet, buffer);
          this.packetSectionStarts.set(packet, result.packet.sectionStartPos);
          return packet;
        }
        async getNextPacket(packet, options) {
          let buffer = this.packetBuffers.get(packet);
          if (buffer) {
            const result = await buffer.readNext();
            if (!result) {
              return null;
            }
            this.packetBuffers.delete(packet);
            const newPacket = this.createEncodedPacket(
              result.packet,
              result.duration,
              options,
            );
            this.packetBuffers.set(newPacket, buffer);
            this.packetSectionStarts.set(
              newPacket,
              result.packet.sectionStartPos,
            );
            return newPacket;
          }
          const sectionStartPos = this.packetSectionStarts.get(packet);
          if (sectionStartPos === void 0) {
            throw new Error("Packet was not created from this track.");
          }
          const demuxer = this.elementaryStream.demuxer;
          const section = await demuxer.readSection(sectionStartPos, true);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(section);
          const pesPacket = readPesPacket(section, true);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(pesPacket);
          const context = new PacketReadingContext(
            this.elementaryStream,
            pesPacket,
          );
          buffer = new PacketBuffer(this, context);
          const targetSequenceNumber = packet.sequenceNumber;
          while (true) {
            const result = await buffer.readNext();
            if (!result) {
              return null;
            }
            if (result.packet.sequenceNumber > targetSequenceNumber) {
              const newPacket = this.createEncodedPacket(
                result.packet,
                result.duration,
                options,
              );
              this.packetBuffers.set(newPacket, buffer);
              this.packetSectionStarts.set(
                newPacket,
                result.packet.sectionStartPos,
              );
              return newPacket;
            }
          }
        }
        async getNextKeyPacket(packet, options) {
          let currentPacket = packet;
          while (true) {
            currentPacket = await this.getNextPacket(currentPacket, options);
            if (!currentPacket) {
              return null;
            }
            if (currentPacket.type === "key") {
              return currentPacket;
            }
          }
        }
        getPacket(timestamp, options) {
          return this.doPacketLookup(timestamp, false, options);
        }
        getKeyPacket(timestamp, options) {
          return this.doPacketLookup(timestamp, true, options);
        }
        /**
         * Searches for the packet with the largest timestamp not larger than `timestamp` in the file, using a combination
         * of chunk-based binary search and linear refinement. The reason the coarse search is done in large chunks is to
         * make it more performant for small files and over high-latency readers such as the network.
         */
        async doPacketLookup(timestamp, keyframesOnly, options) {
          const searchPts = (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.aI)(
            timestamp * _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.cS,
          );
          const demuxer = this.elementaryStream.demuxer;
          const { reader, seekChunkSize } = demuxer;
          const pid = this.elementaryStream.pid;
          const findFirstPesPacketHeaderInChunk = async (
            startPos,
            endPos,
            readSectionInFull,
          ) => {
            let currentPos = startPos;
            while (currentPos < endPos) {
              const packetHeader = await demuxer.readPacketHeader(currentPos);
              if (!packetHeader) {
                return null;
              }
              if (
                packetHeader.pid === pid &&
                packetHeader.payloadUnitStartIndicator === 1
              ) {
                const section = await demuxer.readSection(
                  currentPos,
                  readSectionInFull,
                );
                if (!section) {
                  return null;
                }
                const pesPacketHeader = readPesPacketHeader(section, false);
                if (pesPacketHeader && pesPacketHeader.pts !== null) {
                  return {
                    pesPacketHeader,
                    section,
                  };
                }
              }
              currentPos += demuxer.packetStride;
            }
            return null;
          };
          const firstSection = this.elementaryStream.firstSection;
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(firstSection);
          const firstPesPacketHeader = readPesPacketHeader(firstSection, true);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(firstPesPacketHeader);
          if (searchPts < firstPesPacketHeader.pts) {
            return null;
          }
          let scanStartPos;
          const referencePesPackets = this.elementaryStream.referencePesPackets;
          const referencePointIndex = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_8__.eE)(
            referencePesPackets,
            searchPts,
            (x) => x.pts,
          );
          const referencePoint =
            referencePointIndex !== -1
              ? referencePesPackets[referencePointIndex]
              : null;
          if (
            referencePoint &&
            searchPts - referencePoint.pts <
              _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.cS / 2
          ) {
            scanStartPos = referencePoint.sectionStartPos;
          } else {
            let startChunkIndex = 0;
            if (reader.fileSize !== null) {
              const numChunks = Math.ceil(reader.fileSize / seekChunkSize);
              if (numChunks > 1) {
                let low = 0;
                let high = numChunks - 1;
                startChunkIndex = low;
                while (low <= high) {
                  const mid = Math.floor((low + high) / 2);
                  const chunkStartPos =
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Q5)(
                      mid * seekChunkSize,
                      demuxer.packetStride,
                    ) + firstPesPacketHeader.sectionStartPos;
                  const chunkEndPos = chunkStartPos + seekChunkSize;
                  const result2 = await findFirstPesPacketHeaderInChunk(
                    chunkStartPos,
                    chunkEndPos,
                    false,
                  );
                  if (!result2) {
                    high = mid - 1;
                    continue;
                  }
                  if (result2.pesPacketHeader.pts <= searchPts) {
                    startChunkIndex = mid;
                    low = mid + 1;
                  } else {
                    high = mid - 1;
                  }
                }
              }
            }
            scanStartPos =
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Q5)(
                startChunkIndex * seekChunkSize,
                demuxer.packetStride,
              ) + firstPesPacketHeader.sectionStartPos;
          }
          const result = await findFirstPesPacketHeaderInChunk(
            scanStartPos,
            reader.fileSize ?? Infinity,
            false,
          );
          let currentPesHeader = result?.pesPacketHeader ?? null;
          if (!currentPesHeader) {
            currentPesHeader = firstPesPacketHeader;
          }
          const reorderSize = this.getReorderSize();
          const retrieveEncodedPacket = async (sectionStartPos, predicate) => {
            const section = await demuxer.readSection(sectionStartPos, true);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(section);
            const pesPacket = readPesPacket(section, true);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(pesPacket);
            const context = new PacketReadingContext(
              this.elementaryStream,
              pesPacket,
            );
            const buffer = new PacketBuffer(this, context);
            while (true) {
              const topPts =
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__._g)(
                  buffer.presentationOrderPackets,
                )?.pts ?? -Infinity;
              if (topPts >= searchPts) {
                break;
              }
              const didRead = await buffer.readNextPacket();
              if (!didRead) {
                break;
              }
            }
            const targetIndex = (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Kl)(
              buffer.presentationOrderPackets,
              predicate,
            );
            if (targetIndex === -1) {
              return null;
            }
            const targetPacket = buffer.presentationOrderPackets[targetIndex];
            const lastDuration =
              targetIndex === 0
                ? 0
                : targetPacket.pts -
                  buffer.presentationOrderPackets[targetIndex - 1].pts;
            while (buffer.decodeOrderPackets[0] !== targetPacket) {
              buffer.decodeOrderPackets.shift();
            }
            buffer.lastDuration = lastDuration;
            const result2 = await buffer.readNext();
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(result2);
            const packet = this.createEncodedPacket(
              result2.packet,
              result2.duration,
              options,
            );
            this.packetBuffers.set(packet, buffer);
            this.packetSectionStarts.set(
              packet,
              result2.packet.sectionStartPos,
            );
            return packet;
          };
          if (!keyframesOnly || this.allPacketsAreKeyPackets()) {
            outer: while (true) {
              let currentPos =
                currentPesHeader.sectionStartPos + demuxer.packetStride;
              while (true) {
                const packetHeader = await demuxer.readPacketHeader(currentPos);
                if (!packetHeader) {
                  break outer;
                }
                if (
                  packetHeader.pid === pid &&
                  packetHeader.payloadUnitStartIndicator === 1
                ) {
                  const section = await demuxer.readSection(currentPos, false);
                  if (section) {
                    const nextPesHeader = readPesPacketHeader(section, false);
                    if (nextPesHeader && nextPesHeader.pts !== null) {
                      if (nextPesHeader.pts > searchPts) {
                        break outer;
                      }
                      currentPesHeader = nextPesHeader;
                      maybeInsertReferencePacket(
                        this.elementaryStream,
                        currentPesHeader,
                      );
                      break;
                    }
                  }
                }
                currentPos += demuxer.packetStride;
              }
            }
            outer: for (let i = 0; i < reorderSize + 1; i++) {
              let pos = currentPesHeader.sectionStartPos - demuxer.packetStride;
              while (pos >= demuxer.packetOffset) {
                const packetHeader = await demuxer.readPacketHeader(pos);
                if (!packetHeader) {
                  break outer;
                }
                if (
                  packetHeader.pid === pid &&
                  packetHeader.payloadUnitStartIndicator === 1
                ) {
                  const section = await demuxer.readSection(pos, false);
                  if (section) {
                    const header = readPesPacketHeader(section, false);
                    if (header && header.pts !== null) {
                      currentPesHeader = header;
                      break;
                    }
                  }
                }
                pos -= demuxer.packetStride;
              }
            }
            return retrieveEncodedPacket(
              currentPesHeader.sectionStartPos,
              (p) => p.pts <= searchPts,
            );
          } else {
            let currentChunkStartPos = scanStartPos;
            let nextChunkStartPos = null;
            const readSectionsInFull =
              !this.elementaryStream.canBeTrustedWithKeyPackets;
            while (true) {
              let bestKeyPesHeader = null;
              const isFirstChunk =
                currentChunkStartPos <= firstPesPacketHeader.sectionStartPos;
              let pesHeader;
              let pesHeaderSection = null;
              if (isFirstChunk) {
                pesHeader = firstPesPacketHeader;
                pesHeaderSection = firstSection;
              } else {
                const result2 = await findFirstPesPacketHeaderInChunk(
                  currentChunkStartPos,
                  reader.fileSize ?? Infinity,
                  readSectionsInFull,
                );
                pesHeader = result2?.pesPacketHeader ?? null;
                pesHeaderSection = result2?.section ?? null;
              }
              let passedSearchPts = false;
              let lookaheadCount = 0;
              outer: while (pesHeader) {
                if (
                  nextChunkStartPos !== null &&
                  pesHeader.sectionStartPos >= nextChunkStartPos
                ) {
                  break;
                }
                if (pesHeader.pts <= searchPts) {
                  let isKeyPacket;
                  if (this.elementaryStream.canBeTrustedWithKeyPackets) {
                    isKeyPacket = pesHeader.randomAccessIndicator === 1;
                  } else {
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(
                      pesHeaderSection,
                    );
                    const pesPacket = readPesPacket(pesHeaderSection, true);
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(pesPacket);
                    const context = new PacketReadingContext(
                      this.elementaryStream,
                      pesPacket,
                    );
                    await context.markNextPacket();
                    isKeyPacket =
                      context.suppliedPacket?.randomAccessIndicator === 1;
                  }
                  if (isKeyPacket) {
                    bestKeyPesHeader = pesHeader;
                  }
                }
                if (pesHeader.pts > searchPts) {
                  passedSearchPts = true;
                }
                if (passedSearchPts) {
                  lookaheadCount++;
                  if (lookaheadCount > reorderSize) {
                    break;
                  }
                }
                let currentPos =
                  pesHeader.sectionStartPos + demuxer.packetStride;
                while (true) {
                  const packetHeader =
                    await demuxer.readPacketHeader(currentPos);
                  if (!packetHeader) {
                    break outer;
                  }
                  if (
                    packetHeader.pid === pid &&
                    packetHeader.payloadUnitStartIndicator === 1
                  ) {
                    const section = await demuxer.readSection(
                      currentPos,
                      readSectionsInFull,
                    );
                    if (section) {
                      const nextPesHeader = readPesPacketHeader(section, false);
                      if (nextPesHeader && nextPesHeader.pts !== null) {
                        pesHeader = nextPesHeader;
                        pesHeaderSection = section;
                        maybeInsertReferencePacket(
                          this.elementaryStream,
                          pesHeader,
                        );
                        break;
                      }
                    }
                  }
                  currentPos += demuxer.packetStride;
                }
              }
              if (bestKeyPesHeader) {
                let startPesHeader = bestKeyPesHeader;
                if (lookaheadCount === 0) {
                  outer: for (let i = 0; i < reorderSize; i++) {
                    let pos =
                      startPesHeader.sectionStartPos - demuxer.packetStride;
                    while (pos >= demuxer.packetOffset) {
                      const packetHeader = await demuxer.readPacketHeader(pos);
                      if (!packetHeader) {
                        break outer;
                      }
                      if (
                        packetHeader.pid === pid &&
                        packetHeader.payloadUnitStartIndicator === 1
                      ) {
                        const section = await demuxer.readSection(
                          pos,
                          readSectionsInFull,
                        );
                        if (section) {
                          const header = readPesPacketHeader(section, false);
                          if (header && header.pts !== null) {
                            startPesHeader = header;
                            break;
                          }
                        }
                      }
                      pos -= demuxer.packetStride;
                    }
                  }
                }
                const encodedPacket = await retrieveEncodedPacket(
                  startPesHeader.sectionStartPos,
                  (p) => p.pts <= searchPts && p.randomAccessIndicator === 1,
                );
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(encodedPacket);
                return encodedPacket;
              }
              if (isFirstChunk) {
                return null;
              }
              nextChunkStartPos = currentChunkStartPos;
              currentChunkStartPos = Math.max(
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Q5)(
                  currentChunkStartPos -
                    firstPesPacketHeader.sectionStartPos -
                    seekChunkSize,
                  demuxer.packetStride,
                ) + firstPesPacketHeader.sectionStartPos,
                firstPesPacketHeader.sectionStartPos,
              );
            }
          }
        }
      }
      class MpegTsVideoTrackBacking extends MpegTsTrackBacking {
        getType() {
          return "video";
        }
        getCodec() {
          return this.elementaryStream.info.codec;
        }
        getCodedWidth() {
          return this.elementaryStream.info.width;
        }
        getCodedHeight() {
          return this.elementaryStream.info.height;
        }
        getSquarePixelWidth() {
          return this.elementaryStream.info.squarePixelWidth;
        }
        getSquarePixelHeight() {
          return this.elementaryStream.info.squarePixelHeight;
        }
        getRotation() {
          return 0;
        }
        async getColorSpace() {
          return this.elementaryStream.info.colorSpace;
        }
        async canBeTransparent() {
          return false;
        }
        async getDecoderConfig() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(
            this.elementaryStream.info.decoderConfig,
          );
          return this.elementaryStream.info.decoderConfig;
        }
        allPacketsAreKeyPackets() {
          return false;
        }
        getReorderSize() {
          return this.elementaryStream.info.reorderSize;
        }
      }
      class MpegTsAudioTrackBacking extends MpegTsTrackBacking {
        getType() {
          return "audio";
        }
        getCodec() {
          return this.elementaryStream.info.codec;
        }
        getNumberOfChannels() {
          return this.elementaryStream.info.numberOfChannels;
        }
        getSampleRate() {
          return this.elementaryStream.info.sampleRate;
        }
        async getDecoderConfig() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(
            this.elementaryStream.info.decoderConfig,
          );
          return this.elementaryStream.info.decoderConfig;
        }
        allPacketsAreKeyPackets() {
          return true;
        }
        getReorderSize() {
          return 0;
        }
      }
      const maybeInsertReferencePacket = (
        elementaryStream,
        pesPacketHeader,
      ) => {
        const referencePesPackets = elementaryStream.referencePesPackets;
        const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.eE)(
          referencePesPackets,
          pesPacketHeader.sectionStartPos,
          (x) => x.sectionStartPos,
        );
        if (index >= 0) {
          const entry = referencePesPackets[index];
          if (pesPacketHeader.pts <= entry.pts) {
            return false;
          }
          const minByteDistance =
            elementaryStream.demuxer.minReferencePointByteDistance;
          if (
            pesPacketHeader.sectionStartPos - entry.sectionStartPos <
            minByteDistance
          ) {
            return false;
          }
          if (index < referencePesPackets.length - 1) {
            const nextEntry = referencePesPackets[index + 1];
            if (nextEntry.pts < pesPacketHeader.pts) {
              return false;
            }
            if (
              nextEntry.sectionStartPos - pesPacketHeader.sectionStartPos <
              minByteDistance
            ) {
              return false;
            }
          }
        }
        referencePesPackets.splice(index + 1, 0, pesPacketHeader);
        return true;
      };
      class PacketReadingContext {
        constructor(elementaryStream, startingPesPacket) {
          this.currentPos = 0;
          this.pesPackets = [];
          this.currentPesPacketIndex = 0;
          this.currentPesPacketPos = 0;
          this.endPos = 0;
          this.lastSuppliedPesPacket = null;
          this.nextPts = null;
          this.suppliedPacket = null;
          this.elementaryStream = elementaryStream;
          this.pid = elementaryStream.pid;
          this.demuxer = elementaryStream.demuxer;
          this.startingPesPacket = startingPesPacket;
        }
        ensureBuffered(length) {
          const remaining = this.endPos - this.currentPos;
          if (remaining >= length) {
            return length;
          }
          return this.bufferData(length - remaining).then(() =>
            Math.min(this.endPos - this.currentPos, length),
          );
        }
        getCurrentPesPacket() {
          const packet = this.pesPackets[this.currentPesPacketIndex];
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(packet);
          return packet;
        }
        async bufferData(length) {
          const targetEndPos = this.endPos + length;
          while (this.endPos < targetEndPos) {
            let pesPacket;
            if (this.pesPackets.length === 0) {
              pesPacket = this.startingPesPacket;
            } else {
              let currentPos = (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__._g)(
                this.pesPackets,
              ).sectionEndPos;
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(
                currentPos !== null,
              );
              while (true) {
                const packetHeader =
                  await this.demuxer.readPacketHeader(currentPos);
                if (!packetHeader) {
                  return;
                }
                if (packetHeader.pid === this.pid) {
                  const nextSection = await this.demuxer.readSection(
                    currentPos,
                    true,
                  );
                  if (!nextSection) {
                    return;
                  }
                  const nextPesPacket = readPesPacket(nextSection, false);
                  if (nextPesPacket) {
                    pesPacket = nextPesPacket;
                    break;
                  }
                }
                currentPos += this.demuxer.packetStride;
              }
            }
            this.pesPackets.push(pesPacket);
            this.endPos += pesPacket.data.byteLength;
          }
        }
        readBytes(length) {
          const currentPesPacket = this.getCurrentPesPacket();
          const relativeStartOffset =
            this.currentPos - this.currentPesPacketPos;
          const relativeEndOffset = relativeStartOffset + length;
          this.currentPos += length;
          if (relativeEndOffset <= currentPesPacket.data.byteLength) {
            return currentPesPacket.data.subarray(
              relativeStartOffset,
              relativeEndOffset,
            );
          }
          const result = new Uint8Array(length);
          result.set(currentPesPacket.data.subarray(relativeStartOffset));
          let offset = currentPesPacket.data.byteLength - relativeStartOffset;
          while (true) {
            this.advanceCurrentPacket();
            const currentPesPacket2 = this.getCurrentPesPacket();
            const relativeEndOffset2 = length - offset;
            if (relativeEndOffset2 <= currentPesPacket2.data.byteLength) {
              result.set(
                currentPesPacket2.data.subarray(0, relativeEndOffset2),
                offset,
              );
              break;
            }
            result.set(currentPesPacket2.data, offset);
            offset += currentPesPacket2.data.byteLength;
          }
          return result;
        }
        readU8() {
          let currentPesPacket = this.getCurrentPesPacket();
          const relativeOffset = this.currentPos - this.currentPesPacketPos;
          this.currentPos++;
          if (relativeOffset < currentPesPacket.data.byteLength) {
            return currentPesPacket.data[relativeOffset];
          }
          this.advanceCurrentPacket();
          currentPesPacket = this.getCurrentPesPacket();
          return currentPesPacket.data[0];
        }
        seekTo(pos) {
          if (pos === this.currentPos) {
            return;
          }
          if (pos < this.currentPos) {
            while (pos < this.currentPesPacketPos) {
              this.currentPesPacketIndex--;
              const currentPacket = this.getCurrentPesPacket();
              this.currentPesPacketPos -= currentPacket.data.byteLength;
            }
          } else {
            while (true) {
              const currentPesPacket = this.getCurrentPesPacket();
              const currentEndPos =
                this.currentPesPacketPos + currentPesPacket.data.byteLength;
              if (pos < currentEndPos) {
                break;
              }
              this.currentPesPacketPos += currentPesPacket.data.byteLength;
              this.currentPesPacketIndex++;
            }
          }
          this.currentPos = pos;
        }
        skip(n) {
          this.seekTo(this.currentPos + n);
        }
        advanceCurrentPacket() {
          this.currentPesPacketPos +=
            this.getCurrentPesPacket().data.byteLength;
          this.currentPesPacketIndex++;
        }
        async markNextPacket() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(!this.suppliedPacket);
          const elementaryStream = this.elementaryStream;
          if (elementaryStream.info.type === "video") {
            const codec = elementaryStream.info.codec;
            const CHUNK_SIZE = 1024;
            if (codec !== "avc" && codec !== "hevc") {
              throw new Error("Unhandled.");
            }
            const nalHeaderSize = codec === "avc" ? 1 : 2;
            let packetStartPos = null;
            let frameStartFound = false;
            let lastFirstMacroblockInSlice = 0;
            while (true) {
              let remaining = this.ensureBuffered(CHUNK_SIZE);
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining))
                remaining = await remaining;
              if (remaining === 0) {
                break;
              }
              const chunkStartPos = this.currentPos;
              const chunk = this.readBytes(remaining);
              const length = chunk.byteLength;
              let i = 0;
              while (i < length) {
                const zeroIndex = chunk.indexOf(0, i);
                if (zeroIndex === -1 || zeroIndex >= length) {
                  break;
                }
                i = zeroIndex;
                const posBeforeZero = chunkStartPos + i;
                if (i + 3 >= length) {
                  this.seekTo(posBeforeZero);
                  break;
                }
                const b1 = chunk[i + 1];
                const b2 = chunk[i + 2];
                const b3 = chunk[i + 3];
                let startCodeLength = 0;
                if (b1 === 0 && b2 === 0 && b3 === 1) {
                  startCodeLength = 4;
                } else if (b1 === 0 && b2 === 1) {
                  startCodeLength = 3;
                }
                if (startCodeLength === 0) {
                  i++;
                  continue;
                }
                const startCodePos = posBeforeZero;
                packetStartPos ??= startCodePos;
                const nalHeaderStart = i + startCodeLength;
                const payloadStart = nalHeaderStart + nalHeaderSize;
                const AVC_SLICE_HEADER_PEEK_SIZE = 6;
                const bytesNeeded =
                  payloadStart +
                  (codec === "avc" ? AVC_SLICE_HEADER_PEEK_SIZE : 1);
                if (bytesNeeded > length) {
                  this.seekTo(posBeforeZero);
                  break;
                }
                const headerByte0 = chunk[nalHeaderStart];
                let nalUnitType;
                let isSlice;
                let isAccessUnitStart;
                if (codec === "avc") {
                  nalUnitType = (0,
                  _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.uN)(headerByte0);
                  isSlice =
                    nalUnitType ===
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.mY
                        .NON_IDR_SLICE ||
                    nalUnitType ===
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.mY
                        .SLICE_DPA ||
                    nalUnitType ===
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.mY.IDR;
                  isAccessUnitStart =
                    nalUnitType ===
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.mY.SEI ||
                    nalUnitType ===
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.mY.SPS ||
                    nalUnitType ===
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.mY.PPS ||
                    nalUnitType ===
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.mY.AUD;
                } else {
                  nalUnitType = (0,
                  _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.O9)(headerByte0);
                  const layerId =
                    ((headerByte0 & 1) << 5) | (chunk[nalHeaderStart + 1] >> 3);
                  if (layerId > 0) {
                    i += startCodeLength;
                    continue;
                  }
                  isSlice =
                    nalUnitType <=
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.iJ.RASL_R ||
                    (nalUnitType >=
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.iJ.BLA_W_LP &&
                      nalUnitType <= 21);
                  isAccessUnitStart =
                    (nalUnitType >=
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.iJ.VPS_NUT &&
                      nalUnitType <= 37) ||
                    nalUnitType ===
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.iJ
                        .PREFIX_SEI_NUT ||
                    (nalUnitType >= 41 && nalUnitType <= 44) ||
                    (nalUnitType >= 48 && nalUnitType <= 55);
                }
                let isFrameBoundary = false;
                if (isSlice) {
                  let startsNewPicture;
                  if (codec === "avc") {
                    const headerBytes = chunk.subarray(
                      payloadStart,
                      payloadStart + AVC_SLICE_HEADER_PEEK_SIZE,
                    );
                    const firstMacroblockInSlice = (0,
                    _misc_js__WEBPACK_IMPORTED_MODULE_8__.IP)(
                      new _shared_bitstream_js__WEBPACK_IMPORTED_MODULE_14__._(
                        headerBytes,
                      ),
                    );
                    startsNewPicture =
                      !frameStartFound ||
                      firstMacroblockInSlice <= lastFirstMacroblockInSlice;
                    lastFirstMacroblockInSlice = firstMacroblockInSlice;
                  } else {
                    startsNewPicture = chunk[payloadStart] >> 7 === 1;
                  }
                  if (startsNewPicture) {
                    if (frameStartFound) {
                      isFrameBoundary = true;
                    } else {
                      frameStartFound = true;
                    }
                  }
                } else if (isAccessUnitStart && frameStartFound) {
                  isFrameBoundary = true;
                }
                if (isFrameBoundary) {
                  const packetLength = startCodePos - packetStartPos;
                  this.seekTo(packetStartPos);
                  return this.supplyPacket(packetLength, 0);
                }
                i += startCodeLength;
              }
              if (remaining < CHUNK_SIZE) {
                break;
              }
            }
            if (packetStartPos !== null && this.endPos > packetStartPos) {
              const packetLength = this.endPos - packetStartPos;
              this.seekTo(packetStartPos);
              return this.supplyPacket(packetLength, 0);
            }
          } else {
            const codec = elementaryStream.info.codec;
            const CHUNK_SIZE = 128;
            while (true) {
              let remaining = this.ensureBuffered(CHUNK_SIZE);
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining))
                remaining = await remaining;
              const startPos = this.currentPos;
              while (this.currentPos - startPos < remaining) {
                const byte = this.readU8();
                if (codec === "aac") {
                  if (byte !== 255) {
                    continue;
                  }
                  this.skip(-1);
                  const possibleHeaderStartPos = this.currentPos;
                  let remaining2 = this.ensureBuffered(
                    _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_1__.Y$,
                  );
                  if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining2))
                    remaining2 = await remaining2;
                  if (
                    remaining2 <
                    _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_1__.Y$
                  ) {
                    return;
                  }
                  const headerBytes = this.readBytes(
                    _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_1__.Y$,
                  );
                  const header = (0,
                  _adts_adts_reader_js__WEBPACK_IMPORTED_MODULE_1__.lh)(
                    _reader_js__WEBPACK_IMPORTED_MODULE_11__.x$.tempFromBytes(
                      headerBytes,
                    ),
                  );
                  if (header) {
                    this.seekTo(possibleHeaderStartPos);
                    let remaining3 = this.ensureBuffered(header.frameLength);
                    if (
                      (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining3)
                    )
                      remaining3 = await remaining3;
                    return this.supplyPacket(
                      remaining3,
                      Math.round(
                        (_adts_adts_demuxer_js__WEBPACK_IMPORTED_MODULE_0__.s *
                          _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.cS) /
                          elementaryStream.info.sampleRate,
                      ),
                    );
                  } else {
                    this.seekTo(possibleHeaderStartPos + 1);
                  }
                } else if (codec === "mp3") {
                  if (byte !== 255) {
                    continue;
                  }
                  this.skip(-1);
                  const possibleHeaderStartPos = this.currentPos;
                  let remaining2 = this.ensureBuffered(
                    _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_9__.D_,
                  );
                  if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining2))
                    remaining2 = await remaining2;
                  if (
                    remaining2 <
                    _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_9__.D_
                  ) {
                    return;
                  }
                  const headerBytes = this.readBytes(
                    _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_9__.D_,
                  );
                  const word = (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Zc)(
                    headerBytes,
                  ).getUint32(0);
                  const result = (0,
                  _shared_mp3_misc_js__WEBPACK_IMPORTED_MODULE_9__.P8)(
                    word,
                    null,
                  );
                  if (result.header) {
                    this.seekTo(possibleHeaderStartPos);
                    let remaining3 = this.ensureBuffered(
                      result.header.totalSize,
                    );
                    if (
                      (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining3)
                    )
                      remaining3 = await remaining3;
                    const duration =
                      (result.header.audioSamplesInFrame *
                        _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.cS) /
                      elementaryStream.info.sampleRate;
                    return this.supplyPacket(remaining3, Math.round(duration));
                  } else {
                    this.seekTo(possibleHeaderStartPos + 1);
                  }
                } else if (codec === "ac3") {
                  if (byte !== 11) {
                    continue;
                  }
                  this.skip(-1);
                  const possibleSyncPos = this.currentPos;
                  let remaining2 = this.ensureBuffered(5);
                  if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining2))
                    remaining2 = await remaining2;
                  if (remaining2 < 5) {
                    return;
                  }
                  const headerBytes = this.readBytes(5);
                  if (headerBytes[0] !== 11 || headerBytes[1] !== 119) {
                    this.seekTo(possibleSyncPos + 1);
                    continue;
                  }
                  const fscod = headerBytes[4] >> 6;
                  const frmsizecod = headerBytes[4] & 63;
                  if (fscod === 3 || frmsizecod > 37) {
                    this.seekTo(possibleSyncPos + 1);
                    continue;
                  }
                  const frameSize =
                    _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.Pl[
                      3 * frmsizecod + fscod
                    ];
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(
                    frameSize !== void 0,
                  );
                  this.seekTo(possibleSyncPos);
                  remaining2 = this.ensureBuffered(frameSize);
                  if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining2))
                    remaining2 = await remaining2;
                  const duration = Math.round(
                    (_codec_data_js__WEBPACK_IMPORTED_MODULE_4__.Ir *
                      _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.cS) /
                      elementaryStream.info.sampleRate,
                  );
                  return this.supplyPacket(remaining2, duration);
                } else if (codec === "eac3") {
                  if (byte !== 11) {
                    continue;
                  }
                  this.skip(-1);
                  const possibleSyncPos = this.currentPos;
                  let remaining2 = this.ensureBuffered(5);
                  if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining2))
                    remaining2 = await remaining2;
                  if (remaining2 < 5) {
                    return;
                  }
                  const headerBytes = this.readBytes(5);
                  if (headerBytes[0] !== 11 || headerBytes[1] !== 119) {
                    this.seekTo(possibleSyncPos + 1);
                    continue;
                  }
                  const frmsiz = ((headerBytes[2] & 7) << 8) | headerBytes[3];
                  const frameSize = (frmsiz + 1) * 2;
                  const fscod = headerBytes[4] >> 6;
                  const numblkscod =
                    fscod === 3 ? 3 : (headerBytes[4] >> 4) & 3;
                  const numblks =
                    _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.FY[numblkscod];
                  this.seekTo(possibleSyncPos);
                  remaining2 = this.ensureBuffered(frameSize);
                  if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining2))
                    remaining2 = await remaining2;
                  const samplesPerFrame = numblks * 256;
                  const duration = Math.round(
                    (samplesPerFrame *
                      _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.cS) /
                      elementaryStream.info.sampleRate,
                  );
                  return this.supplyPacket(remaining2, duration);
                } else if (codec === "dts") {
                  if (byte !== 127 && byte !== 100) {
                    continue;
                  }
                  this.skip(-1);
                  const possibleSyncPos = this.currentPos;
                  let remaining2 = this.ensureBuffered(
                    _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.mB,
                  );
                  if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining2))
                    remaining2 = await remaining2;
                  if (
                    remaining2 < _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.mB
                  ) {
                    return;
                  }
                  const headerBytes = this.readBytes(
                    _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.mB,
                  );
                  const core = (0,
                  _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.Wt)(headerBytes);
                  let leadingExss = core
                    ? null
                    : (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.Zt)(
                        headerBytes,
                      );
                  if (!core && !leadingExss) {
                    this.seekTo(possibleSyncPos + 1);
                    continue;
                  }
                  if (leadingExss && !leadingExss.asset) {
                    this.seekTo(possibleSyncPos);
                    const headerBound = Math.min(
                      leadingExss.frameSize,
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.$N,
                    );
                    let remaining3 = this.ensureBuffered(headerBound);
                    if (
                      (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining3)
                    )
                      remaining3 = await remaining3;
                    leadingExss =
                      (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.Zt)(
                        this.readBytes(remaining3),
                      ) ?? leadingExss;
                  }
                  let frameSize = core ? core.frameSize : leadingExss.frameSize;
                  if (core) {
                    let nextSubstreamPos = Math.ceil(core.frameSize / 4) * 4;
                    while (true) {
                      this.seekTo(possibleSyncPos);
                      const neededBytes =
                        nextSubstreamPos +
                        _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.l9;
                      let remaining3 = this.ensureBuffered(neededBytes);
                      if (
                        (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(
                          remaining3,
                        )
                      )
                        remaining3 = await remaining3;
                      if (remaining3 < neededBytes) {
                        break;
                      }
                      this.seekTo(possibleSyncPos + nextSubstreamPos);
                      const exss = (0,
                      _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.Zt)(
                        this.readBytes(
                          _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.l9,
                        ),
                      );
                      if (!exss) {
                        break;
                      }
                      nextSubstreamPos += exss.frameSize;
                      frameSize = nextSubstreamPos;
                    }
                  }
                  const sampleCount =
                    core?.sampleCount ?? leadingExss.asset?.sampleCount;
                  if (sampleCount === void 0) {
                    this.seekTo(possibleSyncPos + 1);
                    continue;
                  }
                  this.seekTo(possibleSyncPos);
                  remaining2 = this.ensureBuffered(frameSize);
                  if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.Qg)(remaining2))
                    remaining2 = await remaining2;
                  const duration = Math.round(
                    (sampleCount *
                      _mpeg_ts_misc_js__WEBPACK_IMPORTED_MODULE_12__.cS) /
                      elementaryStream.info.sampleRate,
                  );
                  return this.supplyPacket(remaining2, duration);
                } else {
                  throw new Error("Unhandled.");
                }
              }
              if (remaining < CHUNK_SIZE) {
                break;
              }
            }
          }
        }
        /** Supplies the context with a new encoded packet, beginning at the current position. */
        supplyPacket(packetLength, intrinsicDuration) {
          const currentPesPacket = this.getCurrentPesPacket();
          let pts;
          if (this.lastSuppliedPesPacket === currentPesPacket) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(
              this.nextPts !== null,
            );
            pts = this.nextPts;
          } else {
            if (currentPesPacket.pts === null) {
              throw new Error(MISSING_PTS_ERROR_MESSAGE);
            }
            pts = currentPesPacket.pts;
            maybeInsertReferencePacket(this.elementaryStream, currentPesPacket);
          }
          this.lastSuppliedPesPacket = currentPesPacket;
          this.nextPts = pts + intrinsicDuration;
          const sectionStartPos = currentPesPacket.sectionStartPos;
          const sequenceNumber =
            sectionStartPos + (this.currentPos - this.currentPesPacketPos);
          const data = this.readBytes(packetLength);
          let randomAccessIndicator = currentPesPacket.randomAccessIndicator;
          if (
            randomAccessIndicator === 0 &&
            !this.elementaryStream.canBeTrustedWithKeyPackets
          ) {
            if (this.elementaryStream.info.type === "audio") {
              randomAccessIndicator = 1;
            } else {
              if (this.elementaryStream.info.decoderConfig) {
                const isKey =
                  (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_4__.PR)(
                    this.elementaryStream.info.codec,
                    this.elementaryStream.info.decoderConfig,
                    data,
                  ) === "key";
                randomAccessIndicator = Number(isKey);
              } else {
              }
            }
          }
          this.suppliedPacket = {
            pts,
            data,
            sequenceNumber,
            sectionStartPos,
            randomAccessIndicator,
          };
          this.pesPackets.splice(0, this.currentPesPacketIndex);
          this.currentPesPacketIndex = 0;
        }
      }
      class PacketBuffer {
        constructor(backing, context) {
          this.decodeOrderPackets = [];
          this.reorderBuffer = [];
          this.presentationOrderPackets = [];
          this.reachedEnd = false;
          this.lastDuration = 0;
          this.backing = backing;
          this.context = context;
          this.reorderSize = backing.getReorderSize();
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(this.reorderSize >= 0);
        }
        async readNext() {
          if (this.decodeOrderPackets.length === 0) {
            const didRead = await this.readNextPacket();
            if (!didRead) {
              return null;
            }
          }
          await this.ensureCurrentPacketHasNext();
          const packet = this.decodeOrderPackets[0];
          const presentationIndex =
            this.presentationOrderPackets.indexOf(packet);
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(
            presentationIndex !== -1,
          );
          let duration;
          if (presentationIndex === this.presentationOrderPackets.length - 1) {
            duration = this.lastDuration;
          } else {
            const nextPacket =
              this.presentationOrderPackets[presentationIndex + 1];
            duration = nextPacket.pts - packet.pts;
            this.lastDuration = duration;
          }
          this.decodeOrderPackets.shift();
          while (this.presentationOrderPackets.length > 0) {
            const first = this.presentationOrderPackets[0];
            if (this.decodeOrderPackets.includes(first)) {
              break;
            }
            this.presentationOrderPackets.shift();
          }
          return { packet, duration };
        }
        async readNextPacket() {
          if (this.reachedEnd) {
            return false;
          }
          let suppliedPacket;
          if (this.context.suppliedPacket) {
            suppliedPacket = this.context.suppliedPacket;
          } else {
            await this.context.markNextPacket();
            suppliedPacket = this.context.suppliedPacket;
          }
          this.context.suppliedPacket = null;
          if (!suppliedPacket) {
            this.reachedEnd = true;
            this.flushReorderBuffer();
            return false;
          }
          this.decodeOrderPackets.push(suppliedPacket);
          this.processPacketThroughReorderBuffer(suppliedPacket);
          return true;
        }
        async ensureCurrentPacketHasNext() {
          const current = this.decodeOrderPackets[0];
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_8__.vA)(current);
          while (true) {
            const presentationIndex =
              this.presentationOrderPackets.indexOf(current);
            if (
              presentationIndex !== -1 &&
              presentationIndex <= this.presentationOrderPackets.length - 2
            ) {
              break;
            }
            const didRead = await this.readNextPacket();
            if (!didRead) {
              break;
            }
          }
        }
        processPacketThroughReorderBuffer(packet) {
          this.reorderBuffer.push(packet);
          if (this.reorderBuffer.length > this.reorderSize) {
            let minIndex = 0;
            for (let i = 1; i < this.reorderBuffer.length; i++) {
              if (
                this.reorderBuffer[i].pts < this.reorderBuffer[minIndex].pts
              ) {
                minIndex = i;
              }
            }
            const packet2 = this.reorderBuffer[minIndex];
            this.presentationOrderPackets.push(packet2);
            this.reorderBuffer.splice(minIndex, 1);
          }
        }
        flushReorderBuffer() {
          this.reorderBuffer.sort((a, b) => a.pts - b.pts);
          this.presentationOrderPackets.push(...this.reorderBuffer);
          this.reorderBuffer.length = 0;
        }
      }
    },
    /***/
    6586(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        Vx: () =>
          /* binding */
          buildMpegTsMimeType,
        /* harmony export */
        ZT: () =>
          /* binding */
          TS_PACKET_SIZE,
        /* harmony export */
        cS: () =>
          /* binding */
          TIMESCALE,
        /* harmony export */
      });
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const TIMESCALE = 9e4;
      const TS_PACKET_SIZE = 188;
      const buildMpegTsMimeType = (codecStrings) => {
        let string = "video/MP2T";
        const uniqueCodecStrings = [...new Set(codecStrings.filter(Boolean))];
        if (uniqueCodecStrings.length > 0) {
          string += '; codecs="'.concat(uniqueCodecStrings.join(", "), '"');
        }
        return string;
      };
    },
    /***/
    1580(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        S: () =>
          /* binding */
          OggDemuxer,
        /* harmony export */
      });
      var _codec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8276);
      var _codec_data_js__WEBPACK_IMPORTED_MODULE_1__ =
        __webpack_require__(9705);
      var _demuxer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(2114);
      var _metadata_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8957);
      var _misc_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6760);
      var _packet_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6016);
      var _reader_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(5815);
      var _ogg_misc_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3522);
      var _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__ =
        __webpack_require__(5505);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class OggDemuxer extends _demuxer_js__WEBPACK_IMPORTED_MODULE_2__.B {
        constructor(input) {
          super(input);
          this.metadataPromise = null;
          this.bitstreams = [];
          this.trackBackings = [];
          this.metadataTags = {};
          this.reader = input._reader;
        }
        async readMetadata() {
          return (this.metadataPromise ??= (async () => {
            let currentPos = 0;
            while (true) {
              let slice = this.reader.requestSliceRange(
                currentPos,
                _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.b0,
                _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.H9,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(slice))
                slice = await slice;
              if (!slice) break;
              const page = (0, _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.BF)(
                slice,
              );
              if (!page) {
                break;
              }
              const isBos = !!(page.headerType & 2);
              if (!isBos) {
                break;
              }
              this.bitstreams.push({
                serialNumber: page.serialNumber,
                bosPage: page,
                description: null,
                numberOfChannels: -1,
                sampleRate: -1,
                codecInfo: {
                  codec: null,
                  vorbisInfo: null,
                  opusInfo: null,
                },
                lastMetadataPacket: null,
              });
              currentPos = page.headerStartPos + page.totalSize;
            }
            for (const bitstream of this.bitstreams) {
              const firstPacket = await this.readPacket(bitstream.bosPage, 0);
              if (!firstPacket) {
                continue;
              }
              if (
                // Check for Vorbis
                firstPacket.data.byteLength >= 7 &&
                firstPacket.data[0] === 1 &&
                firstPacket.data[1] === 118 &&
                firstPacket.data[2] === 111 &&
                firstPacket.data[3] === 114 &&
                firstPacket.data[4] === 98 &&
                firstPacket.data[5] === 105 &&
                firstPacket.data[6] === 115
              ) {
                await this.readVorbisMetadata(firstPacket, bitstream);
              } else if (
                // Check for Opus
                firstPacket.data.byteLength >= 8 &&
                firstPacket.data[0] === 79 &&
                firstPacket.data[1] === 112 &&
                firstPacket.data[2] === 117 &&
                firstPacket.data[3] === 115 &&
                firstPacket.data[4] === 72 &&
                firstPacket.data[5] === 101 &&
                firstPacket.data[6] === 97 &&
                firstPacket.data[7] === 100
              ) {
                await this.readOpusMetadata(firstPacket, bitstream);
              }
              if (bitstream.codecInfo.codec !== null) {
                this.trackBackings.push(
                  new OggAudioTrackBacking(bitstream, this),
                );
              }
            }
          })());
        }
        async readVorbisMetadata(firstPacket, bitstream) {
          let nextPacketPosition = await this.findNextPacketStart(firstPacket);
          if (!nextPacketPosition) {
            return;
          }
          const secondPacket = await this.readPacket(
            nextPacketPosition.startPage,
            nextPacketPosition.startSegmentIndex,
          );
          if (!secondPacket) {
            return;
          }
          nextPacketPosition = await this.findNextPacketStart(secondPacket);
          if (!nextPacketPosition) {
            return;
          }
          const thirdPacket = await this.readPacket(
            nextPacketPosition.startPage,
            nextPacketPosition.startSegmentIndex,
          );
          if (!thirdPacket) {
            return;
          }
          if (secondPacket.data[0] !== 3 || thirdPacket.data[0] !== 5) {
            return;
          }
          const lacingValues = [];
          const addBytesToSegmentTable = (bytes) => {
            while (true) {
              lacingValues.push(Math.min(255, bytes));
              if (bytes < 255) {
                break;
              }
              bytes -= 255;
            }
          };
          addBytesToSegmentTable(firstPacket.data.length);
          addBytesToSegmentTable(secondPacket.data.length);
          const description = new Uint8Array(
            1 +
              lacingValues.length +
              firstPacket.data.length +
              secondPacket.data.length +
              thirdPacket.data.length,
          );
          description[0] = 2;
          description.set(lacingValues, 1);
          description.set(firstPacket.data, 1 + lacingValues.length);
          description.set(
            secondPacket.data,
            1 + lacingValues.length + firstPacket.data.length,
          );
          description.set(
            thirdPacket.data,
            1 +
              lacingValues.length +
              firstPacket.data.length +
              secondPacket.data.length,
          );
          bitstream.codecInfo.codec = "vorbis";
          bitstream.description = description;
          bitstream.lastMetadataPacket = thirdPacket;
          const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Zc)(
            firstPacket.data,
          );
          bitstream.numberOfChannels = view.getUint8(11);
          bitstream.sampleRate = view.getUint32(12, true);
          const blockSizeByte = view.getUint8(28);
          bitstream.codecInfo.vorbisInfo = {
            blocksizes: [1 << (blockSizeByte & 15), 1 << (blockSizeByte >> 4)],
            modeBlockflags: (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.Co)(
              thirdPacket.data,
            ).modeBlockflags,
          };
          (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.Oc)(
            secondPacket.data.subarray(7),
            this.metadataTags,
          );
        }
        async readOpusMetadata(firstPacket, bitstream) {
          const nextPacketPosition =
            await this.findNextPacketStart(firstPacket);
          if (!nextPacketPosition) {
            return;
          }
          const secondPacket = await this.readPacket(
            nextPacketPosition.startPage,
            nextPacketPosition.startSegmentIndex,
          );
          if (!secondPacket) {
            return;
          }
          bitstream.codecInfo.codec = "opus";
          bitstream.description = firstPacket.data;
          bitstream.lastMetadataPacket = secondPacket;
          const header = (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.Qf)(
            firstPacket.data,
          );
          bitstream.numberOfChannels = header.outputChannelCount;
          bitstream.sampleRate = _codec_js__WEBPACK_IMPORTED_MODULE_0__.yo;
          bitstream.codecInfo.opusInfo = {
            preSkip: header.preSkip,
          };
          (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_1__.Oc)(
            secondPacket.data.subarray(8),
            this.metadataTags,
          );
        }
        async readPacket(startPage, startSegmentIndex) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            startSegmentIndex < startPage.lacingValues.length,
          );
          let startDataOffset = 0;
          for (let i = 0; i < startSegmentIndex; i++) {
            startDataOffset += startPage.lacingValues[i];
          }
          let currentPage = startPage;
          let currentDataOffset = startDataOffset;
          let currentSegmentIndex = startSegmentIndex;
          const chunks = [];
          outer: while (true) {
            let pageSlice = this.reader.requestSlice(
              currentPage.dataStartPos,
              currentPage.dataSize,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(pageSlice))
              pageSlice = await pageSlice;
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(pageSlice);
            const pageData = (0, _reader_js__WEBPACK_IMPORTED_MODULE_6__.io)(
              pageSlice,
              currentPage.dataSize,
            );
            while (true) {
              if (currentSegmentIndex === currentPage.lacingValues.length) {
                chunks.push(
                  pageData.subarray(startDataOffset, currentDataOffset),
                );
                break;
              }
              const lacingValue = currentPage.lacingValues[currentSegmentIndex];
              currentDataOffset += lacingValue;
              if (lacingValue < 255) {
                chunks.push(
                  pageData.subarray(startDataOffset, currentDataOffset),
                );
                break outer;
              }
              currentSegmentIndex++;
            }
            let currentPos = currentPage.headerStartPos + currentPage.totalSize;
            while (true) {
              let headerSlice = this.reader.requestSliceRange(
                currentPos,
                _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.b0,
                _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.H9,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(headerSlice))
                headerSlice = await headerSlice;
              if (!headerSlice) {
                return null;
              }
              const nextPage = (0,
              _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.BF)(headerSlice);
              if (!nextPage) {
                return null;
              }
              currentPage = nextPage;
              if (currentPage.serialNumber === startPage.serialNumber) {
                break;
              }
              currentPos = currentPage.headerStartPos + currentPage.totalSize;
            }
            startDataOffset = 0;
            currentDataOffset = 0;
            currentSegmentIndex = 0;
          }
          const totalPacketSize = chunks.reduce(
            (sum, chunk) => sum + chunk.length,
            0,
          );
          if (totalPacketSize === 0) {
            return null;
          }
          const packetData = new Uint8Array(totalPacketSize);
          let offset = 0;
          for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            packetData.set(chunk, offset);
            offset += chunk.length;
          }
          return {
            data: packetData,
            endPage: currentPage,
            endSegmentIndex: currentSegmentIndex,
          };
        }
        async findNextPacketStart(lastPacket) {
          if (
            lastPacket.endSegmentIndex <
            lastPacket.endPage.lacingValues.length - 1
          ) {
            return {
              startPage: lastPacket.endPage,
              startSegmentIndex: lastPacket.endSegmentIndex + 1,
            };
          }
          const isEos = !!(lastPacket.endPage.headerType & 4);
          if (isEos) {
            return null;
          }
          let currentPos =
            lastPacket.endPage.headerStartPos + lastPacket.endPage.totalSize;
          while (true) {
            let slice = this.reader.requestSliceRange(
              currentPos,
              _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.b0,
              _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.H9,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(slice))
              slice = await slice;
            if (!slice) {
              return null;
            }
            const nextPage = (0,
            _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.BF)(slice);
            if (!nextPage) {
              return null;
            }
            if (nextPage.serialNumber === lastPacket.endPage.serialNumber) {
              return { startPage: nextPage, startSegmentIndex: 0 };
            }
            currentPos = nextPage.headerStartPos + nextPage.totalSize;
          }
        }
        async getMimeType() {
          await this.readMetadata();
          const codecStrings = await Promise.all(
            this.trackBackings.map((x) =>
              x.getDecoderConfig().then((c) => c?.codec ?? null),
            ),
          );
          return (0, _ogg_misc_js__WEBPACK_IMPORTED_MODULE_7__.Ob)({
            codecStrings: codecStrings.filter(Boolean),
          });
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
      class OggAudioTrackBacking {
        constructor(bitstream, demuxer) {
          this.bitstream = bitstream;
          this.demuxer = demuxer;
          this.encodedPacketToMetadata = /* @__PURE__ */ new WeakMap();
          this.sequentialScanCache = [];
          this.sequentialScanMutex =
            new _misc_js__WEBPACK_IMPORTED_MODULE_4__.aD();
          this.internalSampleRate =
            bitstream.codecInfo.codec === "opus"
              ? _codec_js__WEBPACK_IMPORTED_MODULE_0__.yo
              : bitstream.sampleRate;
        }
        getType() {
          return "audio";
        }
        getId() {
          return this.bitstream.serialNumber;
        }
        getNumber() {
          const index = this.demuxer.trackBackings.findIndex(
            (x) => x.bitstream === this.bitstream,
          );
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(index !== -1);
          return index + 1;
        }
        getNumberOfChannels() {
          return this.bitstream.numberOfChannels;
        }
        getSampleRate() {
          return this.bitstream.sampleRate;
        }
        getTimeResolution() {
          return this.bitstream.sampleRate;
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
          return null;
        }
        async getLiveRefreshInterval() {
          return null;
        }
        getCodec() {
          return this.bitstream.codecInfo.codec;
        }
        getInternalCodecId() {
          return null;
        }
        async getDecoderConfig() {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            this.bitstream.codecInfo.codec,
          );
          return {
            codec: this.bitstream.codecInfo.codec,
            numberOfChannels: this.bitstream.numberOfChannels,
            sampleRate: this.bitstream.sampleRate,
            description: this.bitstream.description ?? void 0,
          };
        }
        getName() {
          return null;
        }
        getLanguageCode() {
          return _misc_js__WEBPACK_IMPORTED_MODULE_4__.IR;
        }
        getDisposition() {
          return {
            ..._metadata_js__WEBPACK_IMPORTED_MODULE_3__.gM,
            primary: false,
          };
        }
        granulePositionToTimestampInSamples(granulePosition) {
          if (this.bitstream.codecInfo.codec === "opus") {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
              this.bitstream.codecInfo.opusInfo,
            );
            return granulePosition - this.bitstream.codecInfo.opusInfo.preSkip;
          }
          return granulePosition;
        }
        createEncodedPacketFromOggPacket(packet, additional, options) {
          if (!packet) {
            return null;
          }
          const { durationInSamples, vorbisBlockSize } = (0,
          _ogg_misc_js__WEBPACK_IMPORTED_MODULE_7__.nL)(
            packet.data,
            this.bitstream.codecInfo,
            additional.vorbisLastBlocksize,
          );
          const encodedPacket = new _packet_js__WEBPACK_IMPORTED_MODULE_5__.Z(
            options.metadataOnly
              ? _packet_js__WEBPACK_IMPORTED_MODULE_5__.T
              : packet.data,
            "key",
            Math.max(0, additional.timestampInSamples) /
              this.internalSampleRate,
            durationInSamples / this.internalSampleRate,
            packet.endPage.headerStartPos + packet.endSegmentIndex,
            packet.data.byteLength,
          );
          this.encodedPacketToMetadata.set(encodedPacket, {
            packet,
            timestampInSamples: additional.timestampInSamples,
            durationInSamples,
            vorbisLastBlockSize: additional.vorbisLastBlocksize,
            vorbisBlockSize,
          });
          return encodedPacket;
        }
        async getFirstPacket(options) {
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            this.bitstream.lastMetadataPacket,
          );
          const packetPosition = await this.demuxer.findNextPacketStart(
            this.bitstream.lastMetadataPacket,
          );
          if (!packetPosition) {
            return null;
          }
          let timestampInSamples = 0;
          if (this.bitstream.codecInfo.codec === "opus") {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
              this.bitstream.codecInfo.opusInfo,
            );
            timestampInSamples -= this.bitstream.codecInfo.opusInfo.preSkip;
          }
          const packet = await this.demuxer.readPacket(
            packetPosition.startPage,
            packetPosition.startSegmentIndex,
          );
          return this.createEncodedPacketFromOggPacket(
            packet,
            {
              timestampInSamples,
              vorbisLastBlocksize: null,
            },
            options,
          );
        }
        async getNextPacket(prevPacket, options) {
          const prevMetadata = this.encodedPacketToMetadata.get(prevPacket);
          if (!prevMetadata) {
            throw new Error("Packet was not created from this track.");
          }
          const packetPosition = await this.demuxer.findNextPacketStart(
            prevMetadata.packet,
          );
          if (!packetPosition) {
            return null;
          }
          const timestampInSamples =
            prevMetadata.timestampInSamples + prevMetadata.durationInSamples;
          const packet = await this.demuxer.readPacket(
            packetPosition.startPage,
            packetPosition.startSegmentIndex,
          );
          return this.createEncodedPacketFromOggPacket(
            packet,
            {
              timestampInSamples,
              vorbisLastBlocksize: prevMetadata.vorbisBlockSize,
            },
            options,
          );
        }
        async getPacket(timestamp, options) {
          if (this.demuxer.reader.fileSize === null) {
            return this.getPacketSequential(timestamp, options);
          }
          const timestampInSamples = (0,
          _misc_js__WEBPACK_IMPORTED_MODULE_4__.aI)(
            timestamp * this.internalSampleRate,
          );
          if (timestampInSamples === 0) {
            return this.getFirstPacket(options);
          }
          if (timestampInSamples < 0) {
            return null;
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            this.bitstream.lastMetadataPacket,
          );
          const startPosition = await this.demuxer.findNextPacketStart(
            this.bitstream.lastMetadataPacket,
          );
          if (!startPosition) {
            return null;
          }
          let lowPage = startPosition.startPage;
          let high = this.demuxer.reader.fileSize;
          const lowPages = [lowPage];
          outer: while (lowPage.headerStartPos + lowPage.totalSize < high) {
            const low = lowPage.headerStartPos;
            const mid = Math.floor((low + high) / 2);
            let searchStartPos = mid;
            while (true) {
              const until = Math.min(
                searchStartPos + _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.H4,
                high - _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.b0,
              );
              let searchSlice = this.demuxer.reader.requestSlice(
                searchStartPos,
                until - searchStartPos,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(searchSlice))
                searchSlice = await searchSlice;
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(searchSlice);
              const found = (0, _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.v5)(
                searchSlice,
                until,
              );
              if (!found) {
                high = mid + _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.b0;
                continue outer;
              }
              let headerSlice = this.demuxer.reader.requestSliceRange(
                searchSlice.filePos,
                _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.b0,
                _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.H9,
              );
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(headerSlice))
                headerSlice = await headerSlice;
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(headerSlice);
              const page = (0, _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.BF)(
                headerSlice,
              );
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(page);
              let pageValid = false;
              if (page.serialNumber === this.bitstream.serialNumber) {
                pageValid = true;
              } else {
                let pageSlice = this.demuxer.reader.requestSlice(
                  page.headerStartPos,
                  page.totalSize,
                );
                if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(pageSlice))
                  pageSlice = await pageSlice;
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(pageSlice);
                const bytes = (0, _reader_js__WEBPACK_IMPORTED_MODULE_6__.io)(
                  pageSlice,
                  page.totalSize,
                );
                const crc = (0, _ogg_misc_js__WEBPACK_IMPORTED_MODULE_7__._S)(
                  bytes,
                );
                pageValid = crc === page.checksum;
              }
              if (!pageValid) {
                searchStartPos = page.headerStartPos + 4;
                continue;
              }
              if (
                pageValid &&
                page.serialNumber !== this.bitstream.serialNumber
              ) {
                searchStartPos = page.headerStartPos + page.totalSize;
                continue;
              }
              const isContinuationPage = page.granulePosition === -1;
              if (isContinuationPage) {
                searchStartPos = page.headerStartPos + page.totalSize;
                continue;
              }
              if (
                this.granulePositionToTimestampInSamples(page.granulePosition) >
                timestampInSamples
              ) {
                high = page.headerStartPos;
              } else {
                lowPage = page;
                lowPages.push(page);
              }
              continue outer;
            }
          }
          let lowerPage = startPosition.startPage;
          for (const otherLowPage of lowPages) {
            if (otherLowPage.granulePosition === lowPage.granulePosition) {
              break;
            }
            if (
              !lowerPage ||
              otherLowPage.headerStartPos > lowerPage.headerStartPos
            ) {
              lowerPage = otherLowPage;
            }
          }
          let currentPage = lowerPage;
          const previousPages = [currentPage];
          while (true) {
            if (
              currentPage.serialNumber === this.bitstream.serialNumber &&
              currentPage.granulePosition === lowPage.granulePosition
            ) {
              break;
            }
            const nextPos = currentPage.headerStartPos + currentPage.totalSize;
            let slice = this.demuxer.reader.requestSliceRange(
              nextPos,
              _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.b0,
              _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.H9,
            );
            if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Qg)(slice))
              slice = await slice;
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(slice);
            const nextPage = (0,
            _ogg_reader_js__WEBPACK_IMPORTED_MODULE_8__.BF)(slice);
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(nextPage);
            currentPage = nextPage;
            if (currentPage.serialNumber === this.bitstream.serialNumber) {
              previousPages.push(currentPage);
            }
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
            currentPage.granulePosition !== -1,
          );
          let currentSegmentIndex = null;
          let currentTimestampInSamples;
          let currentTimestampIsCorrect;
          let endPage = currentPage;
          let endSegmentIndex = 0;
          if (
            currentPage.headerStartPos ===
            startPosition.startPage.headerStartPos
          ) {
            currentTimestampInSamples =
              this.granulePositionToTimestampInSamples(0);
            currentTimestampIsCorrect = true;
            currentSegmentIndex = 0;
          } else {
            currentTimestampInSamples = 0;
            currentTimestampIsCorrect = false;
            for (let i = currentPage.lacingValues.length - 1; i >= 0; i--) {
              const value = currentPage.lacingValues[i];
              if (value < 255) {
                currentSegmentIndex = i + 1;
                break;
              }
            }
            if (currentSegmentIndex === null) {
              throw new Error(
                "Invalid page with granule position: no packets end on this page.",
              );
            }
            endSegmentIndex = currentSegmentIndex - 1;
            const pseudopacket = {
              data: _packet_js__WEBPACK_IMPORTED_MODULE_5__.T,
              endPage,
              endSegmentIndex,
            };
            const nextPosition =
              await this.demuxer.findNextPacketStart(pseudopacket);
            if (nextPosition) {
              const endPosition = findPreviousPacketEndPosition(
                previousPages,
                currentPage,
                currentSegmentIndex,
              );
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(endPosition);
              const startPosition2 = findPacketStartPosition(
                previousPages,
                endPosition.page,
                endPosition.segmentIndex,
              );
              if (startPosition2) {
                currentPage = startPosition2.page;
                currentSegmentIndex = startPosition2.segmentIndex;
              }
            } else {
              while (true) {
                const endPosition = findPreviousPacketEndPosition(
                  previousPages,
                  currentPage,
                  currentSegmentIndex,
                );
                if (!endPosition) {
                  break;
                }
                const startPosition2 = findPacketStartPosition(
                  previousPages,
                  endPosition.page,
                  endPosition.segmentIndex,
                );
                if (!startPosition2) {
                  break;
                }
                currentPage = startPosition2.page;
                currentSegmentIndex = startPosition2.segmentIndex;
                if (
                  endPosition.page.headerStartPos !== endPage.headerStartPos
                ) {
                  endPage = endPosition.page;
                  endSegmentIndex = endPosition.segmentIndex;
                  break;
                }
              }
            }
          }
          let lastEncodedPacket = null;
          let lastEncodedPacketMetadata = null;
          while (currentPage !== null) {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
              currentSegmentIndex !== null,
            );
            const packet = await this.demuxer.readPacket(
              currentPage,
              currentSegmentIndex,
            );
            if (!packet) {
              break;
            }
            const skipPacket =
              currentPage.headerStartPos ===
                startPosition.startPage.headerStartPos &&
              currentSegmentIndex < startPosition.startSegmentIndex;
            if (!skipPacket) {
              let encodedPacket = this.createEncodedPacketFromOggPacket(
                packet,
                {
                  timestampInSamples: currentTimestampInSamples,
                  vorbisLastBlocksize:
                    lastEncodedPacketMetadata?.vorbisBlockSize ?? null,
                },
                options,
              );
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(encodedPacket);
              let encodedPacketMetadata =
                this.encodedPacketToMetadata.get(encodedPacket);
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                encodedPacketMetadata,
              );
              if (
                !currentTimestampIsCorrect &&
                packet.endPage.headerStartPos === endPage.headerStartPos &&
                packet.endSegmentIndex === endSegmentIndex
              ) {
                currentTimestampInSamples =
                  this.granulePositionToTimestampInSamples(
                    currentPage.granulePosition,
                  );
                currentTimestampIsCorrect = true;
                encodedPacket = this.createEncodedPacketFromOggPacket(
                  packet,
                  {
                    timestampInSamples:
                      currentTimestampInSamples -
                      encodedPacketMetadata.durationInSamples,
                    vorbisLastBlocksize:
                      lastEncodedPacketMetadata?.vorbisBlockSize ?? null,
                  },
                  options,
                );
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(encodedPacket);
                encodedPacketMetadata =
                  this.encodedPacketToMetadata.get(encodedPacket);
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                  encodedPacketMetadata,
                );
              } else {
                currentTimestampInSamples +=
                  encodedPacketMetadata.durationInSamples;
              }
              lastEncodedPacket = encodedPacket;
              lastEncodedPacketMetadata = encodedPacketMetadata;
              if (
                currentTimestampIsCorrect && // Next timestamp will be too late
                (Math.max(currentTimestampInSamples, 0) > timestampInSamples ||
                  Math.max(encodedPacketMetadata.timestampInSamples, 0) ===
                    timestampInSamples)
              ) {
                break;
              }
            }
            const nextPosition = await this.demuxer.findNextPacketStart(packet);
            if (!nextPosition) {
              break;
            }
            currentPage = nextPosition.startPage;
            currentSegmentIndex = nextPosition.startSegmentIndex;
          }
          return lastEncodedPacket;
        }
        // A slower but simpler and sequential algorithm for finding a packet in a file
        async getPacketSequential(timestamp, options) {
          const release = await this.sequentialScanMutex.acquire();
          try {
            const timestampInSamples = (0,
            _misc_js__WEBPACK_IMPORTED_MODULE_4__.aI)(
              timestamp * this.internalSampleRate,
            );
            timestamp = timestampInSamples / this.internalSampleRate;
            const index = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.eE)(
              this.sequentialScanCache,
              timestampInSamples,
              (x) => x.timestampInSamples,
            );
            let currentPacket;
            if (index !== -1) {
              const cacheEntry = this.sequentialScanCache[index];
              currentPacket = this.createEncodedPacketFromOggPacket(
                cacheEntry.packet,
                {
                  timestampInSamples: cacheEntry.timestampInSamples,
                  vorbisLastBlocksize: cacheEntry.vorbisLastBlockSize,
                },
                options,
              );
            } else {
              currentPacket = await this.getFirstPacket(options);
            }
            let i = 0;
            while (currentPacket && currentPacket.timestamp < timestamp) {
              const nextPacket = await this.getNextPacket(
                currentPacket,
                options,
              );
              if (!nextPacket || nextPacket.timestamp > timestamp) {
                break;
              }
              currentPacket = nextPacket;
              i++;
              if (i === 100) {
                i = 0;
                const metadata =
                  this.encodedPacketToMetadata.get(currentPacket);
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(metadata);
                if (this.sequentialScanCache.length > 0) {
                  (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(
                    (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__._g)(
                      this.sequentialScanCache,
                    ).timestampInSamples <= metadata.timestampInSamples,
                  );
                }
                this.sequentialScanCache.push(metadata);
              }
            }
            return currentPacket;
          } finally {
            release();
          }
        }
        getKeyPacket(timestamp, options) {
          return this.getPacket(timestamp, options);
        }
        getNextKeyPacket(packet, options) {
          return this.getNextPacket(packet, options);
        }
      }
      const findPacketStartPosition = (pageList, endPage, endSegmentIndex) => {
        let page = endPage;
        let segmentIndex = endSegmentIndex;
        outer: while (true) {
          segmentIndex--;
          for (segmentIndex; segmentIndex >= 0; segmentIndex--) {
            const lacingValue = page.lacingValues[segmentIndex];
            if (lacingValue < 255) {
              segmentIndex++;
              break outer;
            }
          }
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(segmentIndex === -1);
          const pageStartsWithFreshPacket = !(page.headerType & 1);
          if (pageStartsWithFreshPacket) {
            segmentIndex = 0;
            break;
          }
          const previousPage = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Uk)(
            pageList,
            (x) => x.headerStartPos < page.headerStartPos,
          );
          if (!previousPage) {
            return null;
          }
          page = previousPage;
          segmentIndex = page.lacingValues.length;
        }
        (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(segmentIndex !== -1);
        if (segmentIndex === page.lacingValues.length) {
          const nextPage = pageList[pageList.indexOf(page) + 1];
          (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.vA)(nextPage);
          page = nextPage;
          segmentIndex = 0;
        }
        return { page, segmentIndex };
      };
      const findPreviousPacketEndPosition = (
        pageList,
        startPage,
        startSegmentIndex,
      ) => {
        if (startSegmentIndex > 0) {
          return { page: startPage, segmentIndex: startSegmentIndex - 1 };
        }
        const previousPage = (0, _misc_js__WEBPACK_IMPORTED_MODULE_4__.Uk)(
          pageList,
          (x) => x.headerStartPos < startPage.headerStartPos,
        );
        if (!previousPage) {
          return null;
        }
        return {
          page: previousPage,
          segmentIndex: previousPage.lacingValues.length - 1,
        };
      };
    },
    /***/
    3522(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        Ob: () =>
          /* binding */
          buildOggMimeType,
        /* harmony export */
        Zk: () =>
          /* binding */
          OGGS,
        /* harmony export */
        _S: () =>
          /* binding */
          computeOggPageCrc,
        /* harmony export */
        nL: () =>
          /* binding */
          extractSampleMetadata,
        /* harmony export */
      });
      var _codec_data_js__WEBPACK_IMPORTED_MODULE_0__ =
        __webpack_require__(9705);
      var _misc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6760);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const OGGS = 1399285583;
      const OGG_CRC_POLYNOMIAL = 79764919;
      const OGG_CRC_TABLE = new Uint32Array(256);
      for (let n = 0; n < 256; n++) {
        let crc = n << 24;
        for (let k = 0; k < 8; k++) {
          crc = crc & 2147483648 ? (crc << 1) ^ OGG_CRC_POLYNOMIAL : crc << 1;
        }
        OGG_CRC_TABLE[n] = (crc >>> 0) & 4294967295;
      }
      const computeOggPageCrc = (bytes) => {
        const view = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(bytes);
        const originalChecksum = view.getUint32(22, true);
        view.setUint32(22, 0, true);
        let crc = 0;
        for (let i = 0; i < bytes.length; i++) {
          const byte = bytes[i];
          crc = ((crc << 8) ^ OGG_CRC_TABLE[(crc >>> 24) ^ byte]) >>> 0;
        }
        view.setUint32(22, originalChecksum, true);
        return crc;
      };
      const extractSampleMetadata = (data, codecInfo, vorbisLastBlocksize) => {
        let durationInSamples = 0;
        let currentBlocksize = null;
        if (data.length > 0) {
          if (codecInfo.codec === "vorbis") {
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.vA)(codecInfo.vorbisInfo);
            const vorbisModeCount = codecInfo.vorbisInfo.modeBlockflags.length;
            const bitCount = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.al)(
              vorbisModeCount - 1,
            );
            const modeMask = ((1 << bitCount) - 1) << 1;
            const modeNumber = (data[0] & modeMask) >> 1;
            if (modeNumber >= codecInfo.vorbisInfo.modeBlockflags.length) {
              throw new Error("Invalid mode number.");
            }
            let prevBlocksize = vorbisLastBlocksize;
            const blockflag = codecInfo.vorbisInfo.modeBlockflags[modeNumber];
            currentBlocksize = codecInfo.vorbisInfo.blocksizes[blockflag];
            if (blockflag === 1) {
              const prevMask = (modeMask | 1) + 1;
              const flag = data[0] & prevMask ? 1 : 0;
              prevBlocksize = codecInfo.vorbisInfo.blocksizes[flag];
            }
            durationInSamples =
              prevBlocksize !== null
                ? (prevBlocksize + currentBlocksize) >> 2
                : 0;
          } else if (codecInfo.codec === "opus") {
            const toc = (0, _codec_data_js__WEBPACK_IMPORTED_MODULE_0__.ls)(
              data,
            );
            durationInSamples = toc.durationInSamples;
          }
        }
        return {
          durationInSamples,
          vorbisBlockSize: currentBlocksize,
        };
      };
      const buildOggMimeType = (info) => {
        let string = "audio/ogg";
        if (info.codecStrings) {
          const uniqueCodecMimeTypes = [...new Set(info.codecStrings)];
          string += '; codecs="'.concat(uniqueCodecMimeTypes.join(", "), '"');
        }
        return string;
      };
    },
    /***/
    5505(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        BF: () =>
          /* binding */
          readPageHeader,
        /* harmony export */
        H4: () =>
          /* binding */
          MAX_PAGE_SIZE,
        /* harmony export */
        H9: () =>
          /* binding */
          MAX_PAGE_HEADER_SIZE,
        /* harmony export */
        b0: () =>
          /* binding */
          MIN_PAGE_HEADER_SIZE,
        /* harmony export */
        v5: () =>
          /* binding */
          findNextPageHeader,
        /* harmony export */
      });
      var _reader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5815);
      var _ogg_misc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3522);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const MIN_PAGE_HEADER_SIZE = 27;
      const MAX_PAGE_HEADER_SIZE = 27 + 255;
      const MAX_PAGE_SIZE = MAX_PAGE_HEADER_SIZE + 255 * 255;
      const readPageHeader = (slice) => {
        const startPos = slice.filePos;
        const capturePattern = (0, _reader_js__WEBPACK_IMPORTED_MODULE_0__.aJ)(
          slice,
        );
        if (capturePattern !== _ogg_misc_js__WEBPACK_IMPORTED_MODULE_1__.Zk) {
          return null;
        }
        slice.skip(1);
        const headerType = (0, _reader_js__WEBPACK_IMPORTED_MODULE_0__.eo)(
          slice,
        );
        const granulePosition = (0, _reader_js__WEBPACK_IMPORTED_MODULE_0__.TH)(
          slice,
        );
        const serialNumber = (0, _reader_js__WEBPACK_IMPORTED_MODULE_0__.aJ)(
          slice,
        );
        const sequenceNumber = (0, _reader_js__WEBPACK_IMPORTED_MODULE_0__.aJ)(
          slice,
        );
        const checksum = (0, _reader_js__WEBPACK_IMPORTED_MODULE_0__.aJ)(slice);
        const numberPageSegments = (0,
        _reader_js__WEBPACK_IMPORTED_MODULE_0__.eo)(slice);
        const lacingValues = new Uint8Array(numberPageSegments);
        for (let i = 0; i < numberPageSegments; i++) {
          lacingValues[i] = (0, _reader_js__WEBPACK_IMPORTED_MODULE_0__.eo)(
            slice,
          );
        }
        const headerSize = 27 + numberPageSegments;
        const dataSize = lacingValues.reduce((a, b) => a + b, 0);
        const totalSize = headerSize + dataSize;
        return {
          headerStartPos: startPos,
          totalSize,
          dataStartPos: startPos + headerSize,
          dataSize,
          headerType,
          granulePosition,
          serialNumber,
          sequenceNumber,
          checksum,
          lacingValues,
        };
      };
      const findNextPageHeader = (slice, until) => {
        while (slice.filePos < until - (4 - 1)) {
          const word = (0, _reader_js__WEBPACK_IMPORTED_MODULE_0__.aJ)(slice);
          const firstByte = word & 255;
          const secondByte = (word >>> 8) & 255;
          const thirdByte = (word >>> 16) & 255;
          const fourthByte = (word >>> 24) & 255;
          const O = 79;
          if (
            firstByte !== O &&
            secondByte !== O &&
            thirdByte !== O &&
            fourthByte !== O
          ) {
            continue;
          }
          slice.skip(-4);
          if (word === _ogg_misc_js__WEBPACK_IMPORTED_MODULE_1__.Zk) {
            return true;
          }
          slice.skip(1);
        }
        return false;
      };
    },
    /***/
    6016(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        T: () =>
          /* binding */
          PLACEHOLDER_DATA,
        /* harmony export */
        Z: () =>
          /* binding */
          EncodedPacket,
        /* harmony export */
      });
      var _misc_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6760);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      const PLACEHOLDER_DATA = /* @__PURE__ */ new Uint8Array(0);
      class EncodedPacket {
        /** Creates a new {@link EncodedPacket} from raw bytes and timing information. */
        constructor(
          data,
          type,
          timestamp,
          duration,
          sequenceNumber = -1,
          byteLength,
          sideData,
        ) {
          this.data = data;
          this.type = type;
          this.timestamp = timestamp;
          this.duration = duration;
          this.sequenceNumber = sequenceNumber;
          if (data === PLACEHOLDER_DATA && byteLength === void 0) {
            throw new Error(
              "Internal error: byteLength must be explicitly provided when constructing metadata-only packets.",
            );
          }
          if (byteLength === void 0) {
            byteLength = data.byteLength;
          }
          if (!(data instanceof Uint8Array)) {
            throw new TypeError("data must be a Uint8Array.");
          }
          if (type !== "key" && type !== "delta") {
            throw new TypeError('type must be either "key" or "delta".');
          }
          if (!Number.isFinite(timestamp)) {
            throw new TypeError("timestamp must be a number.");
          }
          if (!Number.isFinite(duration) || duration < 0) {
            throw new TypeError("duration must be a non-negative number.");
          }
          if (!Number.isFinite(sequenceNumber)) {
            throw new TypeError("sequenceNumber must be a number.");
          }
          if (!Number.isInteger(byteLength) || byteLength < 0) {
            throw new TypeError("byteLength must be a non-negative integer.");
          }
          if (
            sideData !== void 0 &&
            (typeof sideData !== "object" || !sideData)
          ) {
            throw new TypeError("sideData, when provided, must be an object.");
          }
          if (
            sideData?.alpha !== void 0 &&
            !(sideData.alpha instanceof Uint8Array)
          ) {
            throw new TypeError(
              "sideData.alpha, when provided, must be a Uint8Array.",
            );
          }
          if (
            sideData?.alphaByteLength !== void 0 &&
            (!Number.isInteger(sideData.alphaByteLength) ||
              sideData.alphaByteLength < 0)
          ) {
            throw new TypeError(
              "sideData.alphaByteLength, when provided, must be a non-negative integer.",
            );
          }
          this.byteLength = byteLength;
          this.sideData = sideData ?? {};
          if (this.sideData.alpha && this.sideData.alphaByteLength === void 0) {
            this.sideData.alphaByteLength = this.sideData.alpha.byteLength;
          }
        }
        /**
         * If this packet is a metadata-only packet. Metadata-only packets don't contain their packet data. They are the
         * result of retrieving packets with {@link PacketRetrievalOptions.metadataOnly} set to `true`.
         */
        get isMetadataOnly() {
          return this.data === PLACEHOLDER_DATA;
        }
        /** The timestamp of this packet in microseconds. */
        get microsecondTimestamp() {
          return Math.trunc(
            _misc_js__WEBPACK_IMPORTED_MODULE_0__.MW * this.timestamp,
          );
        }
        /** The duration of this packet in microseconds. */
        get microsecondDuration() {
          return Math.trunc(
            _misc_js__WEBPACK_IMPORTED_MODULE_0__.MW * this.duration,
          );
        }
        /** Converts this packet to an
         * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
         * WebCodecs API. */
        toEncodedVideoChunk() {
          if (this.isMetadataOnly) {
            throw new TypeError(
              "Metadata-only packets cannot be converted to a video chunk.",
            );
          }
          if (typeof EncodedVideoChunk === "undefined") {
            throw new Error(
              "EncodedVideoChunk is not available in this environment.",
            );
          }
          return new EncodedVideoChunk({
            data: this.data,
            type: this.type,
            timestamp: this.microsecondTimestamp,
            duration: this.microsecondDuration,
          });
        }
        /**
         * Converts this packet to an
         * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) for use with the
         * WebCodecs API, using the alpha side data instead of the color data. Throws if no alpha side data is defined.
         */
        alphaToEncodedVideoChunk(type = this.type) {
          if (!this.sideData.alpha) {
            throw new TypeError(
              "This packet does not contain alpha side data.",
            );
          }
          if (this.isMetadataOnly) {
            throw new TypeError(
              "Metadata-only packets cannot be converted to a video chunk.",
            );
          }
          if (typeof EncodedVideoChunk === "undefined") {
            throw new Error(
              "EncodedVideoChunk is not available in this environment.",
            );
          }
          return new EncodedVideoChunk({
            data: this.sideData.alpha,
            type,
            timestamp: this.microsecondTimestamp,
            duration: this.microsecondDuration,
          });
        }
        /** Converts this packet to an
         * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk) for use with the
         * WebCodecs API. */
        toEncodedAudioChunk() {
          if (this.isMetadataOnly) {
            throw new TypeError(
              "Metadata-only packets cannot be converted to an audio chunk.",
            );
          }
          if (typeof EncodedAudioChunk === "undefined") {
            throw new Error(
              "EncodedAudioChunk is not available in this environment.",
            );
          }
          return new EncodedAudioChunk({
            data: this.data,
            type: this.type,
            timestamp: this.microsecondTimestamp,
            duration: this.microsecondDuration,
          });
        }
        /**
         * Creates an {@link EncodedPacket} from an
         * [`EncodedVideoChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedVideoChunk) or
         * [`EncodedAudioChunk`](https://developer.mozilla.org/en-US/docs/Web/API/EncodedAudioChunk). This method is useful
         * for converting chunks from the WebCodecs API to `EncodedPacket` instances.
         */
        static fromEncodedChunk(chunk, sideData) {
          if (!(
            chunk instanceof EncodedVideoChunk ||
            chunk instanceof EncodedAudioChunk
          )) {
            throw new TypeError(
              "chunk must be an EncodedVideoChunk or EncodedAudioChunk.",
            );
          }
          const data = new Uint8Array(chunk.byteLength);
          chunk.copyTo(data);
          return new EncodedPacket(
            data,
            chunk.type,
            chunk.timestamp / 1e6,
            (chunk.duration ?? 0) / 1e6,
            void 0,
            void 0,
            sideData,
          );
        }
        /** Clones this packet while optionally modifying the new packet's data. */
        clone(options) {
          if (
            options !== void 0 &&
            (typeof options !== "object" || options === null)
          ) {
            throw new TypeError("options, when provided, must be an object.");
          }
          if (
            options?.data !== void 0 &&
            !(options.data instanceof Uint8Array)
          ) {
            throw new TypeError(
              "options.data, when provided, must be a Uint8Array.",
            );
          }
          if (
            options?.type !== void 0 &&
            options.type !== "key" &&
            options.type !== "delta"
          ) {
            throw new TypeError(
              'options.type, when provided, must be either "key" or "delta".',
            );
          }
          if (
            options?.timestamp !== void 0 &&
            !Number.isFinite(options.timestamp)
          ) {
            throw new TypeError(
              "options.timestamp, when provided, must be a number.",
            );
          }
          if (
            options?.duration !== void 0 &&
            !Number.isFinite(options.duration)
          ) {
            throw new TypeError(
              "options.duration, when provided, must be a number.",
            );
          }
          if (
            options?.sequenceNumber !== void 0 &&
            !Number.isFinite(options.sequenceNumber)
          ) {
            throw new TypeError(
              "options.sequenceNumber, when provided, must be a number.",
            );
          }
          if (
            options?.sideData !== void 0 &&
            (typeof options.sideData !== "object" || options.sideData === null)
          ) {
            throw new TypeError(
              "options.sideData, when provided, must be an object.",
            );
          }
          return new EncodedPacket(
            options?.data ?? this.data,
            options?.type ?? this.type,
            options?.timestamp ?? this.timestamp,
            options?.duration ?? this.duration,
            options?.sequenceNumber ?? this.sequenceNumber,
            this.byteLength,
            options?.sideData ?? this.sideData,
          );
        }
      }
    },
    /***/
    5815(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        /* harmony export */
        Ar: () =>
          /* binding */
          readI32Be,
        /* harmony export */
        B5: () =>
          /* binding */
          readI64Be,
        /* harmony export */
        IM: () =>
          /* binding */
          readU64,
        /* harmony export */
        IT: () =>
          /* binding */
          readAscii,
        /* harmony export */
        Jk: () =>
          /* binding */
          readF32Be,
        /* harmony export */
        PF: () =>
          /* binding */
          readU32,
        /* harmony export */
        TH: () =>
          /* binding */
          readI64Le,
        /* harmony export */
        Vv: () =>
          /* binding */
          readU16,
        /* harmony export */
        _3: () =>
          /* binding */
          readF64Be,
        /* harmony export */
        aJ: () =>
          /* binding */
          readU32Le,
        /* harmony export */
        cN: () =>
          /* binding */
          readU32Be,
        /* harmony export */
        eo: () =>
          /* binding */
          readU8,
        /* harmony export */
        iH: () =>
          /* binding */
          readI16Be,
        /* harmony export */
        io: () =>
          /* binding */
          readBytes,
        /* harmony export */
        jo: () =>
          /* binding */
          readAllLines,
        /* harmony export */
        mH: () =>
          /* binding */
          readU16Be,
        /* harmony export */
        mP: () =>
          /* binding */
          Reader,
        /* harmony export */
        n2: () =>
          /* binding */
          readU24Be,
        /* harmony export */
        th: () =>
          /* binding */
          readU64Be,
        /* harmony export */
        x$: () =>
          /* binding */
          FileSlice,
        /* harmony export */
      });
      var _input_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6014);
      var _misc_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6760);
      var _source_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4117);
      /*!
       * Copyright (c) 2026-present, Vanilagy and contributors
       *
       * This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at https://mozilla.org/MPL/2.0/.
       */
      class Reader {
        constructor(source) {
          this.source = source;
        }
        get fileSize() {
          const size = this.source._getFileSize();
          if (size === void 0) {
            throw new Error(
              "Reading file size too early; read required first.",
            );
          }
          return size;
        }
        get fileSizeNonStrict() {
          return this.source._getFileSize() ?? null;
        }
        requestSlice(start, length) {
          if (this.source._disposed) {
            throw new _input_js__WEBPACK_IMPORTED_MODULE_0__.QO();
          }
          if (start < 0) {
            return null;
          }
          if (
            this.fileSizeNonStrict !== null &&
            start + length > this.fileSizeNonStrict
          ) {
            return null;
          }
          if (length === 0) {
            const buffer = new Uint8Array(0);
            return new FileSlice(
              buffer,
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(buffer),
              0,
              start,
              start,
            );
          }
          const end = start + length;
          const result = this.source._read(
            start,
            end,
            _source_js__WEBPACK_IMPORTED_MODULE_2__.oV,
            _source_js__WEBPACK_IMPORTED_MODULE_2__.el,
          );
          if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Qg)(result)) {
            return result.then((x) => {
              if (!x) {
                return null;
              }
              return new FileSlice(x.bytes, x.view, x.offset, start, end);
            });
          } else {
            if (!result) {
              return null;
            }
            return new FileSlice(
              result.bytes,
              result.view,
              result.offset,
              start,
              end,
            );
          }
        }
        requestSliceRange(start, minLength, maxLength) {
          if (this.source._disposed) {
            throw new _input_js__WEBPACK_IMPORTED_MODULE_0__.QO();
          }
          if (start < 0) {
            return null;
          }
          if (this.fileSizeNonStrict !== null) {
            return this.requestSlice(
              start,
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.qE)(
                this.fileSizeNonStrict - start,
                minLength,
                maxLength,
              ),
            );
          } else {
            const promisedAttempt = this.requestSlice(start, maxLength);
            const handleAttempt = (attempt) => {
              if (attempt) {
                return attempt;
              }
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.vA)(
                this.fileSizeNonStrict !== null,
              );
              return this.requestSlice(
                start,
                (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.qE)(
                  this.fileSizeNonStrict - start,
                  minLength,
                  maxLength,
                ),
              );
            };
            if (
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Qg)(promisedAttempt)
            ) {
              return promisedAttempt.then(handleAttempt);
            } else {
              return handleAttempt(promisedAttempt);
            }
          }
        }
        requestEntireFile() {
          if (this.fileSizeNonStrict !== null) {
            return this.requestSlice(0, this.fileSizeNonStrict);
          }
          const CHUNK_SIZE = 1024;
          return (async () => {
            const chunks = [];
            let currentSize = 0;
            while (true) {
              if (chunks.length === 1 && this.fileSizeNonStrict !== null) {
                return this.requestSlice(0, this.fileSizeNonStrict);
              }
              let slice = this.requestSliceRange(currentSize, 0, CHUNK_SIZE);
              if ((0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Qg)(slice))
                slice = await slice;
              if (!slice || slice.length === 0) {
                break;
              }
              const chunk = readBytes(slice, slice.length);
              chunks.push(chunk);
              currentSize += slice.length;
            }
            const joined = new Uint8Array(currentSize);
            let offset = 0;
            for (const chunk of chunks) {
              joined.set(chunk, offset);
              offset += chunk.length;
            }
            return new FileSlice(
              joined,
              (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(joined),
              0,
              0,
              currentSize,
            );
          })();
        }
      }
      class FileSlice {
        constructor(bytes, view, offset, start, end) {
          this.bytes = bytes;
          this.view = view;
          this.offset = offset;
          this.start = start;
          this.end = end;
          this.bufferPos = start - offset;
        }
        static tempFromBytes(bytes) {
          return new FileSlice(
            bytes,
            (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.Zc)(bytes),
            0,
            0,
            bytes.length,
          );
        }
        get length() {
          return this.end - this.start;
        }
        get filePos() {
          return this.offset + this.bufferPos;
        }
        set filePos(value) {
          this.bufferPos = value - this.offset;
        }
        /** The number of bytes left from the current pos to the end of the slice. */
        get remainingLength() {
          return Math.max(this.end - this.filePos, 0);
        }
        skip(byteCount) {
          this.bufferPos += byteCount;
        }
        /** Creates a new subslice of this slice whose byte range must be contained within this slice. */
        slice(filePos, length = this.end - filePos) {
          if (filePos < this.start || filePos + length > this.end) {
            throw new RangeError("Slicing outside of original slice.");
          }
          return new FileSlice(
            this.bytes,
            this.view,
            this.offset,
            filePos,
            filePos + length,
          );
        }
      }
      const checkIsInRange = (slice, bytesToRead) => {
        if (
          slice.filePos < slice.start ||
          slice.filePos + bytesToRead > slice.end
        ) {
          throw new RangeError(
            "Tried reading ["
              .concat(slice.filePos, ", ")
              .concat(slice.filePos + bytesToRead, "), but slice is") +
              " ["
                .concat(slice.start, ", ")
                .concat(
                  slice.end,
                  "). This is likely an internal error, please report it alongside the file",
                ) +
              " that caused it.",
          );
        }
      };
      const readBytes = (slice, length) => {
        checkIsInRange(slice, length);
        const bytes = slice.bytes.subarray(
          slice.bufferPos,
          slice.bufferPos + length,
        );
        slice.bufferPos += length;
        return bytes;
      };
      const readU8 = (slice) => {
        checkIsInRange(slice, 1);
        return slice.view.getUint8(slice.bufferPos++);
      };
      const readU16 = (slice, littleEndian) => {
        checkIsInRange(slice, 2);
        const value = slice.view.getUint16(slice.bufferPos, littleEndian);
        slice.bufferPos += 2;
        return value;
      };
      const readU16Be = (slice) => {
        checkIsInRange(slice, 2);
        const value = slice.view.getUint16(slice.bufferPos, false);
        slice.bufferPos += 2;
        return value;
      };
      const readU24Be = (slice) => {
        checkIsInRange(slice, 3);
        const value = (0, _misc_js__WEBPACK_IMPORTED_MODULE_1__.dq)(
          slice.view,
          slice.bufferPos,
          false,
        );
        slice.bufferPos += 3;
        return value;
      };
      const readI16Be = (slice) => {
        checkIsInRange(slice, 2);
        const value = slice.view.getInt16(slice.bufferPos, false);
        slice.bufferPos += 2;
        return value;
      };
      const readU32 = (slice, littleEndian) => {
        checkIsInRange(slice, 4);
        const value = slice.view.getUint32(slice.bufferPos, littleEndian);
        slice.bufferPos += 4;
        return value;
      };
      const readU32Be = (slice) => {
        checkIsInRange(slice, 4);
        const value = slice.view.getUint32(slice.bufferPos, false);
        slice.bufferPos += 4;
        return value;
      };
      const readU32Le = (slice) => {
        checkIsInRange(slice, 4);
        const value = slice.view.getUint32(slice.bufferPos, true);
        slice.bufferPos += 4;
        return value;
      };
      const readI32Be = (slice) => {
        checkIsInRange(slice, 4);
        const value = slice.view.getInt32(slice.bufferPos, false);
        slice.bufferPos += 4;
        return value;
      };
      const readI32Le = (slice) => {
        checkIsInRange(slice, 4);
        const value = slice.view.getInt32(slice.bufferPos, true);
        slice.bufferPos += 4;
        return value;
      };
      const readU64 = (slice, littleEndian) => {
        let low;
        let high;
        if (littleEndian) {
          low = readU32(slice, true);
          high = readU32(slice, true);
        } else {
          high = readU32(slice, false);
          low = readU32(slice, false);
        }
        return high * 4294967296 + low;
      };
      const readU64Be = (slice) => {
        const high = readU32Be(slice);
        const low = readU32Be(slice);
        return high * 4294967296 + low;
      };
      const readI64Be = (slice) => {
        const high = readI32Be(slice);
        const low = readU32Be(slice);
        return high * 4294967296 + low;
      };
      const readI64Le = (slice) => {
        const low = readU32Le(slice);
        const high = readI32Le(slice);
        return high * 4294967296 + low;
      };
      const readF32Be = (slice) => {
        checkIsInRange(slice, 4);
        const value = slice.view.getFloat32(slice.bufferPos, false);
        slice.bufferPos += 4;
        return value;
      };
      const readF64Be = (slice) => {
        checkIsInRange(slice, 8);
        const value = slice.view.getFloat64(slice.bufferPos, false);
        slice.bufferPos += 8;
        return value;
      };
      const readAscii = (slice, length) => {
        checkIsInRange(slice, length);
        let str = "";
        for (let i = 0; i < length; i++) {
          str += String.fromCharCode(slice.bytes[slice.bufferPos++]);
        }
        return str;
      };
      const readAllLines = (slice, length, options) => {
        const text = _misc_js__WEBPACK_IMPORTED_MODULE_1__.su.decode(
          readBytes(slice, length),
        );
        const lines = text
          .split("\n")
          .map((x) => x.trim())
          .filter((x) => x.length > 0 && !options?.ignore?.(x));
        return lines;
      };
    },
  },
]);
