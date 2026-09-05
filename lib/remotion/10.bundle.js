"use strict";
(self["webpackChunk_lovstudio_dsh_video_studio"] =
  self["webpackChunk_lovstudio_dsh_video_studio"] || []).push([
  [10],
  {
    /***/
    10(
      __unused_webpack___webpack_module__,
      __webpack_exports__,
      __webpack_require__,
    ) {
      __webpack_require__.d(__webpack_exports__, {
        z: () =>
          /* reexport */
          external_namespaceObject,
      });
      var locales_namespaceObject = {};
      __webpack_require__.r(locales_namespaceObject);
      __webpack_require__.d(locales_namespaceObject, {
        ar: () => ar,
        az: () => az,
        be: () => be,
        bg: () => bg,
        bn: () => bn,
        ca: () => ca,
        ckb: () => ckb,
        cs: () => cs,
        da: () => da,
        de: () => de,
        el: () => el,
        en: () => en.A,
        eo: () => eo,
        es: () => es,
        fa: () => fa,
        fi: () => fi,
        fr: () => fr,
        frCA: () => fr_CA,
        gu: () => gu,
        he: () => he,
        hi: () => hi,
        hr: () => hr,
        hu: () => hu,
        hy: () => hy,
        id: () => id,
        is: () => is,
        it: () => it,
        ja: () => ja,
        ka: () => ka,
        kh: () => kh,
        km: () => km,
        kn: () => kn,
        ko: () => ko,
        lt: () => lt,
        mk: () => mk,
        ms: () => ms,
        ne: () => ne,
        nl: () => nl,
        nn: () => nn,
        no: () => no,
        ota: () => ota,
        pl: () => pl,
        ps: () => ps,
        pt: () => pt,
        ptBR: () => pt_BR,
        ro: () => ro,
        ru: () => ru,
        sk: () => sk,
        sl: () => sl,
        sv: () => sv,
        ta: () => ta,
        th: () => th,
        tk: () => tk,
        tr: () => tr,
        ua: () => ua,
        uk: () => uk,
        ur: () => ur,
        uz: () => uz,
        vi: () => vi,
        yo: () => yo,
        zhCN: () => zh_CN,
        zhTW: () => zh_TW,
      });
      var json_schema_namespaceObject = {};
      __webpack_require__.r(json_schema_namespaceObject);
      var core_namespaceObject = {};
      __webpack_require__.r(core_namespaceObject);
      __webpack_require__.d(core_namespaceObject, {
        $ZodAny: () => schemas.Gb,
        $ZodArray: () => schemas.$p,
        $ZodAsyncError: () => core.GT,
        $ZodBase64: () => schemas.Dq,
        $ZodBase64URL: () => schemas.CQ,
        $ZodBigInt: () => schemas.BN,
        $ZodBigIntFormat: () => schemas.IT,
        $ZodBoolean: () => schemas.sF,
        $ZodCIDRv4: () => schemas.CI,
        $ZodCIDRv6: () => schemas.Cn,
        $ZodCUID: () => schemas.bl,
        $ZodCUID2: () => schemas.Zu,
        $ZodCatch: () => schemas.t$,
        $ZodCheck: () => checks.QP,
        $ZodCheckBigIntFormat: () => checks.uE,
        $ZodCheckEndsWith: () => checks.E6,
        $ZodCheckGreaterThan: () => checks.J_,
        $ZodCheckIncludes: () => checks.Tt,
        $ZodCheckLengthEquals: () => checks.RM,
        $ZodCheckLessThan: () => checks.sm,
        $ZodCheckLowerCase: () => checks.NI,
        $ZodCheckMaxLength: () => checks.Yk,
        $ZodCheckMaxSize: () => checks.j2,
        $ZodCheckMimeType: () => checks.sj,
        $ZodCheckMinLength: () => checks.Kk,
        $ZodCheckMinSize: () => checks.PH,
        $ZodCheckMultipleOf: () => checks.Jk,
        $ZodCheckNumberFormat: () => checks.KH,
        $ZodCheckOverwrite: () => checks.v$,
        $ZodCheckProperty: () => checks.XF,
        $ZodCheckRegex: () => checks.DG,
        $ZodCheckSizeEquals: () => checks.e2,
        $ZodCheckStartsWith: () => checks.J,
        $ZodCheckStringFormat: () => checks.ql,
        $ZodCheckUpperCase: () => checks.kH,
        $ZodCodec: () => schemas.YY,
        $ZodCreditCard: () => schemas.ZZ,
        $ZodCustom: () => schemas.b0,
        $ZodCustomStringFormat: () => schemas.ZQ,
        $ZodCyclicError: () => memoizer.H0,
        $ZodDate: () => schemas.o5,
        $ZodDefault: () => schemas.rv,
        $ZodDiscriminatedUnion: () => schemas.P0,
        $ZodE164: () => schemas.Oy,
        $ZodEmail: () => schemas.qG,
        $ZodEmoji: () => schemas.cG,
        $ZodEncodeError: () => core.cV,
        $ZodEnum: () => schemas.VO,
        $ZodError: () => errors.a$,
        $ZodExactOptional: () => schemas.RL,
        $ZodFile: () => schemas.CT,
        $ZodFunction: () => schemas._A,
        $ZodGUID: () => schemas.Zc,
        $ZodIPv4: () => schemas.Lc,
        $ZodIPv6: () => schemas.Zy,
        $ZodISODate: () => schemas.v1,
        $ZodISODateTime: () => schemas.Ko,
        $ZodISODuration: () => schemas.$N,
        $ZodISOTime: () => schemas.Ax,
        $ZodIntersection: () => schemas.LJ,
        $ZodJWT: () => schemas.h8,
        $ZodKSUID: () => schemas.GY,
        $ZodLazy: () => schemas.kU,
        $ZodLiteral: () => schemas.nu,
        $ZodMAC: () => schemas.rO,
        $ZodMap: () => schemas.eb,
        $ZodNaN: () => schemas.zP,
        $ZodNanoID: () => schemas.Py,
        $ZodNever: () => schemas.Um,
        $ZodNonOptional: () => schemas.N$,
        $ZodNull: () => schemas.x8,
        $ZodNullable: () => schemas.qc,
        $ZodNumber: () => schemas.vz,
        $ZodNumberFormat: () => schemas.I,
        $ZodObject: () => schemas.L8,
        $ZodObjectJIT: () => schemas.w,
        $ZodOptional: () => schemas.ig,
        $ZodPipe: () => schemas._m,
        $ZodPrefault: () => schemas.VF,
        $ZodPreprocess: () => schemas.KX,
        $ZodPromise: () => schemas.hA,
        $ZodReadonly: () => schemas.Sb,
        $ZodRealError: () => errors.Kd,
        $ZodRecord: () => schemas.h,
        $ZodRegistry: () => registries.rs,
        $ZodSet: () => schemas.Oi,
        $ZodString: () => schemas.$v,
        $ZodStringFormat: () => schemas.EY,
        $ZodSuccess: () => schemas.Dw,
        $ZodSymbol: () => schemas.U5,
        $ZodTemplateLiteral: () => schemas.d,
        $ZodTransform: () => schemas.Wc,
        $ZodTuple: () => schemas.G3,
        $ZodType: () => schemas.W4,
        $ZodULID: () => schemas.g5,
        $ZodURL: () => schemas.VY,
        $ZodUUID: () => schemas.Zn,
        $ZodUndefined: () => schemas.Mv,
        $ZodUnion: () => schemas.cu,
        $ZodUnknown: () => schemas.GP,
        $ZodVoid: () => schemas.WH,
        $ZodXID: () => schemas.TF,
        $ZodXor: () => schemas.pm,
        $brand: () => core._e,
        $constructor: () => core.xI,
        $input: () => registries.nP,
        $output: () => registries.UY,
        Doc: () => core_doc.J,
        INVALID: () => INVALID,
        JSONSchema: () => json_schema_namespaceObject,
        JSONSchemaGenerator: () => JSONSchemaGenerator,
        NEVER: () => core.tm,
        TimePrecision: () => api.So,
        URL_BAD_FORMAT: () => schemas.Ix,
        URL_UNPARSEABLE: () => schemas.bc,
        ZodCompileAsyncError: () => ZodCompileAsyncError,
        ZodCompileUnsupportedError: () => ZodCompileUnsupportedError,
        _any: () => api.KA,
        _array: () => api.dZ,
        _base64: () => api.rt,
        _base64url: () => api.cU,
        _bigint: () => api.z$,
        _boolean: () => api._L,
        _catch: () => api.nb,
        _check: () => api.ST,
        _cidrv4: () => api.Uy,
        _cidrv6: () => api.gP,
        _coercedBigint: () => api.St,
        _coercedBoolean: () => api.dN,
        _coercedDate: () => api.B4,
        _coercedNumber: () => api.qG,
        _coercedString: () => api.K_,
        _creditCard: () => api.vN,
        _cuid: () => api.fs,
        _cuid2: () => api.Bj,
        _custom: () => api.FO,
        _date: () => api.YY,
        _decode: () => parse.e2,
        _decodeAsync: () => parse.or,
        _default: () => api.Rv,
        _discriminatedUnion: () => api.FG,
        _e164: () => api.KB,
        _email: () => api.Mu,
        _emoji: () => api.aC,
        _encode: () => parse.Mv,
        _encodeAsync: () => parse.GW,
        _endsWith: () => api.ER,
        _enum: () => api.$8,
        _file: () => api.K2,
        _float32: () => api.HL,
        _float64: () => api.g6,
        _gt: () => api.Tx,
        _gte: () => api.qm,
        _guid: () => api.tB,
        _includes: () => api.dR,
        _int: () => api.LK,
        _int32: () => api.sw,
        _int64: () => api.Jg,
        _intersection: () => api.tj,
        _ipv4: () => api.Ny,
        _ipv6: () => api.$O,
        _isoDate: () => api.db,
        _isoDateTime: () => api.G1,
        _isoDuration: () => api.f2,
        _isoTime: () => api.Kn,
        _jwt: () => api.rk,
        _ksuid: () => api._z,
        _lazy: () => api.kx,
        _length: () => api.YA,
        _literal: () => api.rn,
        _lowercase: () => api.hH,
        _lt: () => api.Au,
        _lte: () => api.Zm,
        _mac: () => api.R8,
        _map: () => api.rF,
        _max: () => api.Yv,
        _maxLength: () => api.Eb,
        _maxSize: () => api.vL,
        _mime: () => api.GZ,
        _min: () => api.Q_,
        _minLength: () => api.m9,
        _minSize: () => api.Nd,
        _multipleOf: () => api.Hi,
        _nan: () => api.L4,
        _nanoid: () => api.Dl,
        _nativeEnum: () => api.Un,
        _negative: () => api.bR,
        _never: () => api.G8,
        _nonnegative: () => api.UI,
        _nonoptional: () => api.v$,
        _nonpositive: () => api.ej,
        _normalize: () => api.lo,
        _null: () => api.jw,
        _nullable: () => api.jS,
        _number: () => api.F7,
        _optional: () => api.oI,
        _overwrite: () => api.bS,
        _parse: () => parse.Tj,
        _parseAsync: () => parse.Rb,
        _pipe: () => api.yz,
        _positive: () => api.NC,
        _promise: () => api.Z$,
        _properties: () => api.T2,
        _property: () => api.Jf,
        _readonly: () => api.CM,
        _record: () => api.Bb,
        _refine: () => api.fU,
        _regex: () => api.Fk,
        _safeDecode: () => parse.VS,
        _safeDecodeAsync: () => parse.R3,
        _safeEncode: () => parse.rh,
        _safeEncodeAsync: () => parse.v_,
        _safeParse: () => parse.Od,
        _safeParseAsync: () => parse.wG,
        _set: () => api.QC,
        _size: () => api.d$,
        _slugify: () => api.TL,
        _startsWith: () => api.$S,
        _string: () => api.Rl,
        _stringFormat: () => api.Af,
        _stringbool: () => api.fI,
        _success: () => api.P7,
        _superRefine: () => api.MB,
        _symbol: () => api.W7,
        _templateLiteral: () => api.Bt,
        _toLowerCase: () => api.Il,
        _toUpperCase: () => api.xY,
        _transform: () => api.MQ,
        _trim: () => api.WN,
        _tuple: () => api.gt,
        _uint32: () => api.P,
        _uint64: () => api.ii,
        _ulid: () => api.Ct,
        _undefined: () => api.E4,
        _union: () => api.h8,
        _unknown: () => api.em,
        _uppercase: () => api.qF,
        _url: () => api.Fn,
        _uuid: () => api.Be,
        _uuidv4: () => api.nA,
        _uuidv6: () => api.pY,
        _uuidv7: () => api.wA,
        _void: () => api.OC,
        _xid: () => api.Pw,
        _xor: () => api.f0,
        clone: () => schemas.o8,
        compile: () => compile,
        compileFn: () => compileFn,
        config: () => core.$W,
        createStandardJSONSchemaMethod: () => to_json_schema.uE,
        createToJSONSchemaMethod: () => to_json_schema.OA,
        decode: () => parse.D4,
        decodeAsync: () => parse.Re,
        describe: () => api.q0,
        encode: () => parse.lF,
        encodeAsync: () => parse.X$,
        extractDefs: () => to_json_schema.Wb,
        finalize: () => to_json_schema.jE,
        flattenError: () => errors.JM,
        formatError: () => errors.Wk,
        getDiscriminatedOption: () => schemas.IB,
        globalConfig: () => core.cr,
        globalRegistry: () => registries.fd,
        handleUnrepresentable: () => to_json_schema._S,
        initializeContext: () => to_json_schema.az,
        isBackEdge: () => memoizer.TE,
        isRecursiveSchema: () => memoizer.Kw,
        isValidBase64: () => schemas.UY,
        isValidBase64URL: () => schemas.tV,
        isValidCIDRv6: () => schemas.Xe,
        isValidCreditCard: () => schemas.uv,
        isValidIPv6: () => schemas.SW,
        isValidJWT: () => schemas.c2,
        locales: () => locales_namespaceObject,
        memoizer: () => memoizer.x3,
        mergeValues: () => schemas.D3,
        meta: () => api.mI,
        parse: () => parse.qg,
        parseAsync: () => parse.EJ,
        parseURLObject: () => schemas.y5,
        prettifyError: () => errors.S1,
        process: () => to_json_schema.eh,
        regexes: () => regexes,
        registry: () => registries.u5,
        safeDecode: () => parse.ex,
        safeDecodeAsync: () => parse.yR,
        safeEncode: () => parse.wy,
        safeEncodeAsync: () => parse.EM,
        safeParse: () => parse.xL,
        safeParseAsync: () => parse.bp,
        standardProps: () => schemas.YK,
        stripTabAndNewline: () => schemas.NH,
        toDotPath: () => errors.sR,
        toJSONSchema: () => json_schema_processors.bl,
        toZod: () => util.toZod,
        treeifyError: () => errors.ZC,
        urlHostnameOk: () => schemas.bL,
        urlProtocolOk: () => schemas.Yf,
        util: () => util,
        validate: () => parse.tf,
        validateAsync: () => parse.F0,
        version: () => versions.r,
      });
      var checks_namespaceObject = {};
      __webpack_require__.r(checks_namespaceObject);
      __webpack_require__.d(checks_namespaceObject, {
        endsWith: () => api.ER,
        gt: () => api.Tx,
        gte: () => api.qm,
        includes: () => api.dR,
        length: () => api.YA,
        lowercase: () => api.hH,
        lt: () => api.Au,
        lte: () => api.Zm,
        maxLength: () => api.Eb,
        maxSize: () => api.vL,
        mime: () => api.GZ,
        minLength: () => api.m9,
        minSize: () => api.Nd,
        multipleOf: () => api.Hi,
        negative: () => api.bR,
        nonnegative: () => api.UI,
        nonpositive: () => api.ej,
        normalize: () => api.lo,
        overwrite: () => api.bS,
        positive: () => api.NC,
        properties: () => api.T2,
        property: () => api.Jf,
        regex: () => api.Fk,
        size: () => api.d$,
        slugify: () => api.TL,
        startsWith: () => api.$S,
        toLowerCase: () => api.Il,
        toUpperCase: () => api.xY,
        trim: () => api.WN,
        uppercase: () => api.qF,
      });
      var iso_namespaceObject = {};
      __webpack_require__.r(iso_namespaceObject);
      __webpack_require__.d(iso_namespaceObject, {
        ZodISODate: () => classic_schemas.ZodISODate,
        ZodISODateTime: () => classic_schemas.ZodISODateTime,
        ZodISODuration: () => classic_schemas.ZodISODuration,
        ZodISOTime: () => classic_schemas.ZodISOTime,
        date: () => date,
        datetime: () => datetime,
        duration: () => duration,
        time: () => time,
      });
      var coerce_namespaceObject = {};
      __webpack_require__.r(coerce_namespaceObject);
      __webpack_require__.d(coerce_namespaceObject, {
        bigint: () => bigint,
        boolean: () => coerce_boolean,
        date: () => coerce_date,
        number: () => number,
        string: () => string,
      });
      var external_namespaceObject = {};
      __webpack_require__.r(external_namespaceObject);
      __webpack_require__.d(external_namespaceObject, {
        $brand: () => core._e,
        $input: () => registries.nP,
        $output: () => registries.UY,
        NEVER: () => core.tm,
        TimePrecision: () => api.So,
        ZodAny: () => classic_schemas.ZodAny,
        ZodArray: () => classic_schemas.ZodArray,
        ZodBase64: () => classic_schemas.ZodBase64,
        ZodBase64URL: () => classic_schemas.ZodBase64URL,
        ZodBigInt: () => classic_schemas.ZodBigInt,
        ZodBigIntFormat: () => classic_schemas.ZodBigIntFormat,
        ZodBoolean: () => classic_schemas.ZodBoolean,
        ZodCIDRv4: () => classic_schemas.ZodCIDRv4,
        ZodCIDRv6: () => classic_schemas.ZodCIDRv6,
        ZodCUID: () => classic_schemas.ZodCUID,
        ZodCUID2: () => classic_schemas.ZodCUID2,
        ZodCatch: () => classic_schemas.ZodCatch,
        ZodCodec: () => classic_schemas.ZodCodec,
        ZodCompileAsyncError: () => ZodCompileAsyncError,
        ZodCompileUnsupportedError: () => ZodCompileUnsupportedError,
        ZodCreditCard: () => classic_schemas.ZodCreditCard,
        ZodCustom: () => classic_schemas.ZodCustom,
        ZodCustomStringFormat: () => classic_schemas.ZodCustomStringFormat,
        ZodDate: () => classic_schemas.ZodDate,
        ZodDefault: () => classic_schemas.ZodDefault,
        ZodDiscriminatedUnion: () => classic_schemas.ZodDiscriminatedUnion,
        ZodE164: () => classic_schemas.ZodE164,
        ZodEmail: () => classic_schemas.ZodEmail,
        ZodEmoji: () => classic_schemas.ZodEmoji,
        ZodEnum: () => classic_schemas.ZodEnum,
        ZodError: () => classic_errors.G,
        ZodExactOptional: () => classic_schemas.ZodExactOptional,
        ZodFile: () => classic_schemas.ZodFile,
        ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
        ZodFunction: () => classic_schemas.ZodFunction,
        ZodGUID: () => classic_schemas.ZodGUID,
        ZodIPv4: () => classic_schemas.ZodIPv4,
        ZodIPv6: () => classic_schemas.ZodIPv6,
        ZodISODate: () => classic_schemas.ZodISODate,
        ZodISODateTime: () => classic_schemas.ZodISODateTime,
        ZodISODuration: () => classic_schemas.ZodISODuration,
        ZodISOTime: () => classic_schemas.ZodISOTime,
        ZodIntersection: () => classic_schemas.ZodIntersection,
        ZodIssueCode: () => ZodIssueCode,
        ZodJWT: () => classic_schemas.ZodJWT,
        ZodKSUID: () => classic_schemas.ZodKSUID,
        ZodLazy: () => classic_schemas.ZodLazy,
        ZodLiteral: () => classic_schemas.ZodLiteral,
        ZodMAC: () => classic_schemas.ZodMAC,
        ZodMap: () => classic_schemas.ZodMap,
        ZodNaN: () => classic_schemas.ZodNaN,
        ZodNanoID: () => classic_schemas.ZodNanoID,
        ZodNever: () => classic_schemas.ZodNever,
        ZodNonOptional: () => classic_schemas.ZodNonOptional,
        ZodNull: () => classic_schemas.ZodNull,
        ZodNullable: () => classic_schemas.ZodNullable,
        ZodNumber: () => classic_schemas.ZodNumber,
        ZodNumberFormat: () => classic_schemas.ZodNumberFormat,
        ZodObject: () => classic_schemas.ZodObject,
        ZodOptional: () => classic_schemas.ZodOptional,
        ZodPipe: () => classic_schemas.ZodPipe,
        ZodPrefault: () => classic_schemas.ZodPrefault,
        ZodPreprocess: () => classic_schemas.ZodPreprocess,
        ZodPromise: () => classic_schemas.ZodPromise,
        ZodReadonly: () => classic_schemas.ZodReadonly,
        ZodRealError: () => classic_errors.g,
        ZodRecord: () => classic_schemas.ZodRecord,
        ZodSet: () => classic_schemas.ZodSet,
        ZodString: () => classic_schemas.ZodString,
        ZodStringFormat: () => classic_schemas.ZodStringFormat,
        ZodSuccess: () => classic_schemas.ZodSuccess,
        ZodSymbol: () => classic_schemas.ZodSymbol,
        ZodTemplateLiteral: () => classic_schemas.ZodTemplateLiteral,
        ZodTransform: () => classic_schemas.ZodTransform,
        ZodTuple: () => classic_schemas.ZodTuple,
        ZodType: () => classic_schemas.ZodType,
        ZodULID: () => classic_schemas.ZodULID,
        ZodURL: () => classic_schemas.ZodURL,
        ZodUUID: () => classic_schemas.ZodUUID,
        ZodUndefined: () => classic_schemas.ZodUndefined,
        ZodUnion: () => classic_schemas.ZodUnion,
        ZodUnknown: () => classic_schemas.ZodUnknown,
        ZodVoid: () => classic_schemas.ZodVoid,
        ZodXID: () => classic_schemas.ZodXID,
        ZodXor: () => classic_schemas.ZodXor,
        _ZodString: () => classic_schemas._ZodString,
        _default: () => classic_schemas._default,
        _function: () => classic_schemas._function,
        any: () => classic_schemas.any,
        array: () => classic_schemas.array,
        base64: () => classic_schemas.base64,
        base64url: () => classic_schemas.base64url,
        bigint: () => classic_schemas.bigint,
        boolean: () => classic_schemas.boolean,
        catch: () => classic_schemas["catch"],
        check: () => classic_schemas.check,
        cidrv4: () => classic_schemas.cidrv4,
        cidrv6: () => classic_schemas.cidrv6,
        clone: () => util.clone,
        codec: () => classic_schemas.codec,
        coerce: () => coerce_namespaceObject,
        compile: () => compile,
        config: () => core.$W,
        core: () => core_namespaceObject,
        creditCard: () => classic_schemas.creditCard,
        cuid: () => classic_schemas.cuid,
        cuid2: () => classic_schemas.cuid2,
        custom: () => classic_schemas.custom,
        date: () => classic_schemas.date,
        decode: () => classic_parse.D4,
        decodeAsync: () => classic_parse.Re,
        deepPartial: () => deepPartial,
        describe: () => classic_schemas.describe,
        discriminatedUnion: () => classic_schemas.discriminatedUnion,
        e164: () => classic_schemas.e164,
        email: () => classic_schemas.email,
        emoji: () => classic_schemas.emoji,
        encode: () => classic_parse.lF,
        encodeAsync: () => classic_parse.X$,
        endsWith: () => api.ER,
        enum: () => classic_schemas["enum"],
        exactOptional: () => classic_schemas.exactOptional,
        file: () => classic_schemas.file,
        flattenError: () => errors.JM,
        float32: () => classic_schemas.float32,
        float64: () => classic_schemas.float64,
        formatError: () => errors.Wk,
        fromJSONSchema: () => fromJSONSchema,
        function: () => classic_schemas["function"],
        getDiscriminatedOption: () => schemas.IB,
        getErrorMap: () => getErrorMap,
        globalRegistry: () => registries.fd,
        gt: () => api.Tx,
        gte: () => api.qm,
        guid: () => classic_schemas.guid,
        hash: () => classic_schemas.hash,
        hex: () => classic_schemas.hex,
        hostname: () => classic_schemas.hostname,
        httpUrl: () => classic_schemas.httpUrl,
        includes: () => api.dR,
        input: () => input,
        instanceof: () => classic_schemas["instanceof"],
        int: () => classic_schemas.int,
        int32: () => classic_schemas.int32,
        int64: () => classic_schemas.int64,
        intersection: () => classic_schemas.intersection,
        invertCodec: () => classic_schemas.invertCodec,
        ipv4: () => classic_schemas.ipv4,
        ipv6: () => classic_schemas.ipv6,
        iso: () => iso_namespaceObject,
        json: () => classic_schemas.json,
        jwt: () => classic_schemas.jwt,
        keyof: () => classic_schemas.keyof,
        ksuid: () => classic_schemas.ksuid,
        lazy: () => classic_schemas.lazy,
        length: () => api.YA,
        literal: () => classic_schemas.literal,
        locales: () => locales_namespaceObject,
        looseObject: () => classic_schemas.looseObject,
        looseRecord: () => classic_schemas.looseRecord,
        lowercase: () => api.hH,
        lt: () => api.Au,
        lte: () => api.Zm,
        mac: () => classic_schemas.mac,
        map: () => classic_schemas.map,
        maxLength: () => api.Eb,
        maxSize: () => api.vL,
        memoizer: () => memoizer.x3,
        meta: () => classic_schemas.meta,
        mime: () => api.GZ,
        minLength: () => api.m9,
        minSize: () => api.Nd,
        multipleOf: () => api.Hi,
        nan: () => classic_schemas.nan,
        nanoid: () => classic_schemas.nanoid,
        nativeEnum: () => classic_schemas.nativeEnum,
        negative: () => api.bR,
        never: () => classic_schemas.never,
        nonnegative: () => api.UI,
        nonoptional: () => classic_schemas.nonoptional,
        nonpositive: () => api.ej,
        normalize: () => api.lo,
        null: () => classic_schemas["null"],
        nullable: () => classic_schemas.nullable,
        nullish: () => classic_schemas.nullish,
        number: () => classic_schemas.number,
        object: () => classic_schemas.object,
        optional: () => classic_schemas.optional,
        output: () => output,
        overwrite: () => api.bS,
        parse: () => classic_parse.qg,
        parseAsync: () => classic_parse.EJ,
        partialRecord: () => classic_schemas.partialRecord,
        pipe: () => classic_schemas.pipe,
        positive: () => api.NC,
        prefault: () => classic_schemas.prefault,
        preprocess: () => classic_schemas.preprocess,
        prettifyError: () => errors.S1,
        promise: () => classic_schemas.promise,
        properties: () => api.T2,
        property: () => api.Jf,
        readonly: () => classic_schemas.readonly,
        record: () => classic_schemas.record,
        refine: () => classic_schemas.refine,
        regex: () => api.Fk,
        regexes: () => regexes,
        registry: () => registries.u5,
        safeDecode: () => classic_parse.ex,
        safeDecodeAsync: () => classic_parse.yR,
        safeEncode: () => classic_parse.wy,
        safeEncodeAsync: () => classic_parse.EM,
        safeParse: () => classic_parse.xL,
        safeParseAsync: () => classic_parse.bp,
        set: () => classic_schemas.set,
        setErrorMap: () => setErrorMap,
        size: () => api.d$,
        slugify: () => api.TL,
        startsWith: () => api.$S,
        strictObject: () => classic_schemas.strictObject,
        string: () => classic_schemas.string,
        stringFormat: () => classic_schemas.stringFormat,
        stringbool: () => classic_schemas.stringbool,
        success: () => classic_schemas.success,
        superRefine: () => classic_schemas.superRefine,
        symbol: () => classic_schemas.symbol,
        templateLiteral: () => classic_schemas.templateLiteral,
        toJSONSchema: () => json_schema_processors.bl,
        toLowerCase: () => api.Il,
        toUpperCase: () => api.xY,
        toZod: () => util.toZod,
        transform: () => classic_schemas.transform,
        treeifyError: () => errors.ZC,
        trim: () => api.WN,
        tuple: () => classic_schemas.tuple,
        uint32: () => classic_schemas.uint32,
        uint64: () => classic_schemas.uint64,
        ulid: () => classic_schemas.ulid,
        undefined: () => classic_schemas.undefined,
        union: () => classic_schemas.union,
        unknown: () => classic_schemas.unknown,
        uppercase: () => api.qF,
        url: () => classic_schemas.url,
        util: () => util,
        uuid: () => classic_schemas.uuid,
        uuidv4: () => classic_schemas.uuidv4,
        uuidv6: () => classic_schemas.uuidv6,
        uuidv7: () => classic_schemas.uuidv7,
        validate: () => classic_parse.tf,
        validateAsync: () => classic_parse.F0,
        void: () => classic_schemas["void"],
        xid: () => classic_schemas.xid,
        xor: () => classic_schemas.xor,
      });
      var core = __webpack_require__(1825);
      var parse = __webpack_require__(7371);
      var errors = __webpack_require__(8473);
      var schemas = __webpack_require__(8892);
      var memoizer = __webpack_require__(1360);
      var checks = __webpack_require__(547);
      var versions = __webpack_require__(7275);
      var util = __webpack_require__(3362);
      var regexes = __webpack_require__(8371);
      const error = () => {
        const Sizable = {
          string: {
            unit: "\u062D\u0631\u0641",
            verb: "\u0623\u0646 \u064A\u062D\u0648\u064A",
          },
          file: {
            unit: "\u0628\u0627\u064A\u062A",
            verb: "\u0623\u0646 \u064A\u062D\u0648\u064A",
          },
          array: {
            unit: "\u0639\u0646\u0635\u0631",
            verb: "\u0623\u0646 \u064A\u062D\u0648\u064A",
          },
          set: {
            unit: "\u0639\u0646\u0635\u0631",
            verb: "\u0623\u0646 \u064A\u062D\u0648\u064A",
          },
          map: {
            unit: "\u0639\u0646\u0635\u0631",
            verb: "\u0623\u0646 \u064A\u062D\u0648\u064A",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0645\u062F\u062E\u0644",
          email:
            "\u0628\u0631\u064A\u062F \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A",
          url: "\u0631\u0627\u0628\u0637",
          emoji: "\u0625\u064A\u0645\u0648\u062C\u064A",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "\u062A\u0627\u0631\u064A\u062E \u0648\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
          date: "\u062A\u0627\u0631\u064A\u062E \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
          time: "\u0648\u0642\u062A \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
          duration:
            "\u0645\u062F\u0629 \u0628\u0645\u0639\u064A\u0627\u0631 ISO",
          ipv4: "\u0639\u0646\u0648\u0627\u0646 IPv4",
          ipv6: "\u0639\u0646\u0648\u0627\u0646 IPv6",
          mac: "\u0639\u0646\u0648\u0627\u0646 MAC",
          cidrv4:
            "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv4",
          cidrv6:
            "\u0645\u062F\u0649 \u0639\u0646\u0627\u0648\u064A\u0646 \u0628\u0635\u064A\u063A\u0629 IPv6",
          base64:
            "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64-encoded",
          base64url:
            "\u0646\u064E\u0635 \u0628\u062A\u0631\u0645\u064A\u0632 base64url-encoded",
          json_string:
            "\u0646\u064E\u0635 \u0639\u0644\u0649 \u0647\u064A\u0626\u0629 JSON",
          e164: "\u0631\u0642\u0645 \u0647\u0627\u062A\u0641 \u0628\u0645\u0639\u064A\u0627\u0631 E.164",
          credit_card:
            "\u0631\u0642\u0645 \u0628\u0637\u0627\u0642\u0629 \u0627\u0644\u0627\u0626\u062A\u0645\u0627\u0646",
          jwt: "JWT",
          template_literal: "\u0645\u062F\u062E\u0644",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 instanceof "
                  .concat(
                    issue.expected,
                    "\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ",
                  )
                  .concat(received);
              }
              return "\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 "
                .concat(
                  expected,
                  "\u060C \u0648\u0644\u0643\u0646 \u062A\u0645 \u0625\u062F\u062E\u0627\u0644 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u0645\u062F\u062E\u0644\u0627\u062A \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644\u0629: \u064A\u0641\u062A\u0631\u0636 \u0625\u062F\u062E\u0627\u0644 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u0627\u062E\u062A\u064A\u0627\u0631 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062A\u0648\u0642\u0639 \u0627\u0646\u062A\u0642\u0627\u0621 \u0623\u062D\u062F \u0647\u0630\u0647 \u0627\u0644\u062E\u064A\u0627\u0631\u0627\u062A: ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return " \u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 "
                  .concat(
                    issue.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629",
                    " ",
                  )
                  .concat(adj, " ")
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "\u0639\u0646\u0635\u0631");
              return "\u0623\u0643\u0628\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0623\u0646 \u062A\u0643\u0648\u0646 "
                .concat(
                  issue.origin ?? "\u0627\u0644\u0642\u064A\u0645\u0629",
                  " ",
                )
                .concat(adj, " ")
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 "
                  .concat(
                    issue.origin,
                    " \u0623\u0646 \u064A\u0643\u0648\u0646 ",
                  )
                  .concat(adj, " ")
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "\u0623\u0635\u063A\u0631 \u0645\u0646 \u0627\u0644\u0644\u0627\u0632\u0645: \u064A\u0641\u062A\u0631\u0636 \u0644\u0640 "
                .concat(issue.origin, " \u0623\u0646 \u064A\u0643\u0648\u0646 ")
                .concat(adj, " ")
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0628\u062F\u0623 \u0628\u0640 "'.concat(
                  issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return '\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0646\u062A\u0647\u064A \u0628\u0640 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u062A\u0636\u0645\u0651\u064E\u0646 "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u0646\u064E\u0635 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0637\u0627\u0628\u0642 \u0627\u0644\u0646\u0645\u0637 ".concat(
                  _issue.pattern,
                );
              return "".concat(
                FormatDictionary[_issue.format] ?? issue.format,
                " \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644",
              );
            }
            case "not_multiple_of":
              return "\u0631\u0642\u0645 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644: \u064A\u062C\u0628 \u0623\u0646 \u064A\u0643\u0648\u0646 \u0645\u0646 \u0645\u0636\u0627\u0639\u0641\u0627\u062A ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "\u0645\u0639\u0631\u0641"
                .concat(
                  issue.keys.length > 1 ? "\u0627\u062A" : "",
                  " \u063A\u0631\u064A\u0628",
                )
                .concat(issue.keys.length > 1 ? "\u0629" : "", ": ")
                .concat(util.joinValues(issue.keys, "\u060C "));
            case "invalid_key":
              return "\u0645\u0639\u0631\u0641 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
            case "invalid_element":
              return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644 \u0641\u064A ".concat(
                issue.origin,
              );
            default:
              return "\u0645\u062F\u062E\u0644 \u063A\u064A\u0631 \u0645\u0642\u0628\u0648\u0644";
          }
        };
      };
      function ar() {
        return {
          localeError: error(),
        };
      }
      const az_error = () => {
        const Sizable = {
          string: { unit: "simvol", verb: "olmal\u0131d\u0131r" },
          file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
          array: { unit: "element", verb: "olmal\u0131d\u0131r" },
          set: { unit: "element", verb: "olmal\u0131d\u0131r" },
          map: { unit: "element", verb: "olmal\u0131d\u0131r" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "input",
          email: "email address",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO datetime",
          date: "ISO date",
          time: "ISO time",
          duration: "ISO duration",
          ipv4: "IPv4 address",
          ipv6: "IPv6 address",
          mac: "MAC address",
          cidrv4: "IPv4 range",
          cidrv6: "IPv6 range",
          base64: "base64-encoded string",
          base64url: "base64url-encoded string",
          json_string: "JSON string",
          e164: "E.164 number",
          credit_card: "kredit kart\u0131 n\xF6mr\u0259si",
          jwt: "JWT",
          template_literal: "input",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n instanceof "
                  .concat(issue.expected, ", daxil olan ")
                  .concat(received);
              }
              return "Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n "
                .concat(expected, ", daxil olan ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Yanl\u0131\u015F se\xE7im: a\u015Fa\u011F\u0131dak\u0131lardan biri olmal\u0131d\u0131r: ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n "
                  .concat(issue.origin ?? "d\u0259y\u0259r", " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "element");
              return "\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n "
                .concat(issue.origin ?? "d\u0259y\u0259r", " ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n "
                  .concat(issue.origin, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              return "\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Yanl\u0131\u015F m\u0259tn: "'.concat(
                  _issue.prefix,
                  '" il\u0259 ba\u015Flamal\u0131d\u0131r',
                );
              if (_issue.format === "ends_with")
                return 'Yanl\u0131\u015F m\u0259tn: "'.concat(
                  _issue.suffix,
                  '" il\u0259 bitm\u0259lidir',
                );
              if (_issue.format === "includes")
                return 'Yanl\u0131\u015F m\u0259tn: "'.concat(
                  _issue.includes,
                  '" daxil olmal\u0131d\u0131r',
                );
              if (_issue.format === "regex")
                return "Yanl\u0131\u015F m\u0259tn: ".concat(
                  _issue.pattern,
                  " \u015Fablonuna uy\u011Fun olmal\u0131d\u0131r",
                );
              return "Yanl\u0131\u015F ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Yanl\u0131\u015F \u0259d\u0259d: ".concat(
                issue.divisor,
                " il\u0259 b\xF6l\xFCn\u0259 bil\u0259n olmal\u0131d\u0131r",
              );
            case "unrecognized_keys":
              return "Tan\u0131nmayan a\xE7ar"
                .concat(issue.keys.length > 1 ? "lar" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "".concat(
                issue.origin,
                " daxilind\u0259 yanl\u0131\u015F a\xE7ar",
              );
            case "invalid_union":
              return "Yanl\u0131\u015F d\u0259y\u0259r";
            case "invalid_element":
              return "".concat(
                issue.origin,
                " daxilind\u0259 yanl\u0131\u015F d\u0259y\u0259r",
              );
            default:
              return "Yanl\u0131\u015F d\u0259y\u0259r";
          }
        };
      };
      function az() {
        return {
          localeError: az_error(),
        };
      }
      function getBelarusianPlural(count, one, few, many) {
        const absCount = Math.abs(count);
        const lastDigit = absCount % 10;
        const lastTwoDigits = absCount % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
          return many;
        }
        if (lastDigit === 1) {
          return one;
        }
        if (lastDigit >= 2 && lastDigit <= 4) {
          return few;
        }
        return many;
      }
      const be_error = () => {
        const Sizable = {
          string: {
            unit: {
              one: "\u0441\u0456\u043C\u0432\u0430\u043B",
              few: "\u0441\u0456\u043C\u0432\u0430\u043B\u044B",
              many: "\u0441\u0456\u043C\u0432\u0430\u043B\u0430\u045E",
            },
            verb: "\u043C\u0435\u0446\u044C",
          },
          array: {
            unit: {
              one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
              few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
              many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E",
            },
            verb: "\u043C\u0435\u0446\u044C",
          },
          set: {
            unit: {
              one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
              few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
              many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E",
            },
            verb: "\u043C\u0435\u0446\u044C",
          },
          map: {
            unit: {
              one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
              few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u044B",
              many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430\u045E",
            },
            verb: "\u043C\u0435\u0446\u044C",
          },
          file: {
            unit: {
              one: "\u0431\u0430\u0439\u0442",
              few: "\u0431\u0430\u0439\u0442\u044B",
              many: "\u0431\u0430\u0439\u0442\u0430\u045E",
            },
            verb: "\u043C\u0435\u0446\u044C",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0443\u0432\u043E\u0434",
          email: "email \u0430\u0434\u0440\u0430\u0441",
          url: "URL",
          emoji: "\u044D\u043C\u043E\u0434\u0437\u0456",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO \u0434\u0430\u0442\u0430 \u0456 \u0447\u0430\u0441",
          date: "ISO \u0434\u0430\u0442\u0430",
          time: "ISO \u0447\u0430\u0441",
          duration:
            "ISO \u043F\u0440\u0430\u0446\u044F\u0433\u043B\u0430\u0441\u0446\u044C",
          ipv4: "IPv4 \u0430\u0434\u0440\u0430\u0441",
          ipv6: "IPv6 \u0430\u0434\u0440\u0430\u0441",
          mac: "MAC \u0430\u0434\u0440\u0430\u0441",
          cidrv4: "IPv4 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
          cidrv6: "IPv6 \u0434\u044B\u044F\u043F\u0430\u0437\u043E\u043D",
          base64:
            "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64",
          base64url:
            "\u0440\u0430\u0434\u043E\u043A \u0443 \u0444\u0430\u0440\u043C\u0430\u0446\u0435 base64url",
          json_string: "JSON \u0440\u0430\u0434\u043E\u043A",
          e164: "\u043D\u0443\u043C\u0430\u0440 E.164",
          credit_card:
            "\u043D\u0443\u043C\u0430\u0440 \u043A\u0440\u044D\u0434\u044B\u0442\u043D\u0430\u0439 \u043A\u0430\u0440\u0442\u044B",
          jwt: "JWT",
          template_literal: "\u0443\u0432\u043E\u0434",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u043B\u0456\u043A",
          array: "\u043C\u0430\u0441\u0456\u045E",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F instanceof "
                  .concat(
                    issue.expected,
                    ", \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ",
                  )
                  .concat(received);
              }
              return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u045E\u0441\u044F "
                .concat(
                  expected,
                  ", \u0430\u0442\u0440\u044B\u043C\u0430\u043D\u0430 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0432\u0430\u0440\u044B\u044F\u043D\u0442: \u0447\u0430\u043A\u0430\u045E\u0441\u044F \u0430\u0434\u0437\u0456\u043D \u0437 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                const maxValue = Number(issue.maximum);
                const unit = getBelarusianPlural(
                  maxValue,
                  sizing.unit.one,
                  sizing.unit.few,
                  sizing.unit.many,
                );
                return "\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E "
                  .concat(
                    issue.origin ??
                      "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435",
                    " \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ",
                  )
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(unit);
              }
              return "\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u0432\u044F\u043B\u0456\u043A\u0456: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E "
                .concat(
                  issue.origin ??
                    "\u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435",
                  " \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ",
                )
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                const minValue = Number(issue.minimum);
                const unit = getBelarusianPlural(
                  minValue,
                  sizing.unit.one,
                  sizing.unit.few,
                  sizing.unit.many,
                );
                return "\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E "
                  .concat(
                    issue.origin,
                    " \u043F\u0430\u0432\u0456\u043D\u043D\u0430 ",
                  )
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(unit);
              }
              return "\u0417\u0430\u043D\u0430\u0434\u0442\u0430 \u043C\u0430\u043B\u044B: \u0447\u0430\u043A\u0430\u043B\u0430\u0441\u044F, \u0448\u0442\u043E "
                .concat(
                  issue.origin,
                  " \u043F\u0430\u0432\u0456\u043D\u043D\u0430 \u0431\u044B\u0446\u044C ",
                )
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u043F\u0430\u0447\u044B\u043D\u0430\u0446\u0446\u0430 \u0437 "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return '\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u0430\u043A\u0430\u043D\u0447\u0432\u0430\u0446\u0446\u0430 \u043D\u0430 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0437\u043C\u044F\u0448\u0447\u0430\u0446\u044C "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u0440\u0430\u0434\u043E\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0430\u0434\u043F\u0430\u0432\u044F\u0434\u0430\u0446\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ".concat(
                  _issue.pattern,
                );
              return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043B\u0456\u043A: \u043F\u0430\u0432\u0456\u043D\u0435\u043D \u0431\u044B\u0446\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "\u041D\u0435\u0440\u0430\u0441\u043F\u0430\u0437\u043D\u0430\u043D\u044B "
                .concat(
                  issue.keys.length > 1
                    ? "\u043A\u043B\u044E\u0447\u044B"
                    : "\u043A\u043B\u044E\u0447",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u043A\u043B\u044E\u0447 \u0443 ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434";
            case "invalid_element":
              return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u0430\u0435 \u0437\u043D\u0430\u0447\u044D\u043D\u043D\u0435 \u045E ".concat(
                issue.origin,
              );
            default:
              return "\u041D\u044F\u043F\u0440\u0430\u0432\u0456\u043B\u044C\u043D\u044B \u045E\u0432\u043E\u0434";
          }
        };
      };
      function be() {
        return {
          localeError: be_error(),
        };
      }
      const bg_error = () => {
        const Sizable = {
          string: {
            unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430",
            verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
          },
          file: {
            unit: "\u0431\u0430\u0439\u0442\u0430",
            verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
          },
          array: {
            unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
            verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
          },
          set: {
            unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
            verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
          },
          map: {
            unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
            verb: "\u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0432\u0445\u043E\u0434",
          email:
            "\u0438\u043C\u0435\u0439\u043B \u0430\u0434\u0440\u0435\u0441",
          url: "URL",
          emoji: "\u0435\u043C\u043E\u0434\u0436\u0438",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO \u0432\u0440\u0435\u043C\u0435",
          date: "ISO \u0434\u0430\u0442\u0430",
          time: "ISO \u0432\u0440\u0435\u043C\u0435",
          duration:
            "ISO \u043F\u0440\u043E\u0434\u044A\u043B\u0436\u0438\u0442\u0435\u043B\u043D\u043E\u0441\u0442",
          ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
          ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
          mac: "MAC \u0430\u0434\u0440\u0435\u0441",
          cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
          cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
          base64:
            "base64-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
          base64url:
            "base64url-\u043A\u043E\u0434\u0438\u0440\u0430\u043D \u043D\u0438\u0437",
          json_string: "JSON \u043D\u0438\u0437",
          e164: "E.164 \u043D\u043E\u043C\u0435\u0440",
          credit_card:
            "\u043D\u043E\u043C\u0435\u0440 \u043D\u0430 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u0430 \u043A\u0430\u0440\u0442\u0430",
          jwt: "JWT",
          template_literal: "\u0432\u0445\u043E\u0434",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u0447\u0438\u0441\u043B\u043E",
          array: "\u043C\u0430\u0441\u0438\u0432",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D instanceof "
                  .concat(
                    issue.expected,
                    ", \u043F\u043E\u043B\u0443\u0447\u0435\u043D ",
                  )
                  .concat(received);
              }
              return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D "
                .concat(
                  expected,
                  ", \u043F\u043E\u043B\u0443\u0447\u0435\u043D ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434: \u043E\u0447\u0430\u043A\u0432\u0430\u043D ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u043E\u043F\u0446\u0438\u044F: \u043E\u0447\u0430\u043A\u0432\u0430\u043D\u043E \u0435\u0434\u043D\u043E \u043E\u0442 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 "
                  .concat(
                    issue.origin ??
                      "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442",
                    " \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ??
                      "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
                  );
              return "\u0422\u0432\u044A\u0440\u0434\u0435 \u0433\u043E\u043B\u044F\u043C\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 "
                .concat(
                  issue.origin ??
                    "\u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442",
                  " \u0434\u0430 \u0431\u044A\u0434\u0435 ",
                )
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 "
                  .concat(
                    issue.origin,
                    " \u0434\u0430 \u0441\u044A\u0434\u044A\u0440\u0436\u0430 ",
                  )
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "\u0422\u0432\u044A\u0440\u0434\u0435 \u043C\u0430\u043B\u043A\u043E: \u043E\u0447\u0430\u043A\u0432\u0430 \u0441\u0435 "
                .concat(issue.origin, " \u0434\u0430 \u0431\u044A\u0434\u0435 ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u0432\u0430 \u0441 "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return '\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0437\u0430\u0432\u044A\u0440\u0448\u0432\u0430 \u0441 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0432\u043A\u043B\u044E\u0447\u0432\u0430 "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043D\u0438\u0437: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0441\u044A\u0432\u043F\u0430\u0434\u0430 \u0441 ".concat(
                  _issue.pattern,
                );
              let invalid_adj =
                "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D";
              if (_issue.format === "emoji")
                invalid_adj =
                  "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E";
              if (_issue.format === "datetime")
                invalid_adj =
                  "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E";
              if (_issue.format === "date")
                invalid_adj =
                  "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430";
              if (_issue.format === "time")
                invalid_adj =
                  "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E";
              if (_issue.format === "duration")
                invalid_adj =
                  "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430";
              return ""
                .concat(invalid_adj, " ")
                .concat(FormatDictionary[_issue.format] ?? issue.format);
            }
            case "not_multiple_of":
              return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u043E \u0447\u0438\u0441\u043B\u043E: \u0442\u0440\u044F\u0431\u0432\u0430 \u0434\u0430 \u0431\u044A\u0434\u0435 \u043A\u0440\u0430\u0442\u043D\u043E \u043D\u0430 ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "\u041D\u0435\u0440\u0430\u0437\u043F\u043E\u0437\u043D\u0430\u0442"
                .concat(
                  issue.keys.length > 1 ? "\u0438" : "",
                  " \u043A\u043B\u044E\u0447",
                )
                .concat(issue.keys.length > 1 ? "\u043E\u0432\u0435" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u043A\u043B\u044E\u0447 \u0432 ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434";
            case "invalid_element":
              return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u043D\u0430 \u0441\u0442\u043E\u0439\u043D\u043E\u0441\u0442 \u0432 ".concat(
                issue.origin,
              );
            default:
              return "\u041D\u0435\u0432\u0430\u043B\u0438\u0434\u0435\u043D \u0432\u0445\u043E\u0434";
          }
        };
      };
      function bg() {
        return {
          localeError: bg_error(),
        };
      }
      const bn_error = () => {
        const Sizable = {
          string: {
            unit: "\u0985\u0995\u09CD\u09B7\u09B0",
            verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
          },
          file: {
            unit: "\u09AC\u09BE\u0987\u099F",
            verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
          },
          array: {
            unit: "\u0986\u0987\u099F\u09C7\u09AE",
            verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
          },
          set: {
            unit: "\u0986\u0987\u099F\u09C7\u09AE",
            verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
          },
          map: {
            unit: "\u098F\u09A8\u09CD\u099F\u09CD\u09B0\u09BF",
            verb: "\u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0987\u09A8\u09AA\u09C1\u099F",
          email:
            "\u0987\u09AE\u09C7\u0987\u09B2 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
          url: "URL",
          emoji: "\u0987\u09AE\u09CB\u099C\u09BF",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "ISO \u09A4\u09BE\u09B0\u09BF\u0996 \u0993 \u09B8\u09AE\u09AF\u09BC",
          date: "ISO \u09A4\u09BE\u09B0\u09BF\u0996",
          time: "ISO \u09B8\u09AE\u09AF\u09BC",
          duration: "ISO \u09B8\u09AE\u09AF\u09BC\u0995\u09BE\u09B2",
          ipv4: "IPv4 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
          ipv6: "IPv6 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
          mac: "MAC \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
          cidrv4: "IPv4 \u09B0\u09C7\u099E\u09CD\u099C",
          cidrv6: "IPv6 \u09B0\u09C7\u099E\u09CD\u099C",
          base64:
            "base64-\u098F\u09A8\u0995\u09CB\u09A1\u09C7\u09A1 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982",
          base64url:
            "base64url-\u098F\u09A8\u0995\u09CB\u09A1\u09C7\u09A1 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982",
          json_string: "JSON \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982",
          e164: "E.164 \u09A8\u09AE\u09CD\u09AC\u09B0",
          credit_card:
            "\u0995\u09CD\u09B0\u09C7\u09A1\u09BF\u099F \u0995\u09BE\u09B0\u09CD\u09A1 \u09A8\u09AE\u09CD\u09AC\u09B0",
          jwt: "JWT",
          template_literal: "\u0987\u09A8\u09AA\u09C1\u099F",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              return "\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F: \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4 "
                .concat(
                  expected,
                  ", \u09AA\u09CD\u09B0\u09BE\u09AA\u09CD\u09A4 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F: \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u0985\u09AC\u09C8\u09A7 \u0985\u09AA\u09B6\u09A8: ".concat(
                util.joinValues(issue.values, " | "),
                " \u098F\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u098F\u0995\u099F\u09BF \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4",
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u0985\u09A8\u09C7\u0995 \u09AC\u09A1\u09BC: "
                  .concat(issue.origin ?? "\u09AE\u09BE\u09A8", " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ??
                      "\u098F\u09B2\u09BF\u09AE\u09C7\u09A8\u09CD\u099F",
                    " \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7",
                  );
              return "\u0985\u09A8\u09C7\u0995 \u09AC\u09A1\u09BC: "
                .concat(issue.origin ?? "\u09AE\u09BE\u09A8", " ")
                .concat(adj)
                .concat(
                  issue.maximum.toString(),
                  " \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7",
                );
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0985\u09A8\u09C7\u0995 \u099B\u09CB\u099F: "
                  .concat(issue.origin, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(
                    sizing.unit,
                    " \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7",
                  );
              }
              return "\u0985\u09A8\u09C7\u0995 \u099B\u09CB\u099F: "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(
                  issue.minimum.toString(),
                  " \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7",
                );
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: "'.concat(
                  _issue.prefix,
                  '" \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B6\u09C1\u09B0\u09C1 \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7',
                );
              }
              if (_issue.format === "ends_with")
                return '\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: "'.concat(
                  _issue.suffix,
                  '" \u09A6\u09BF\u09AF\u09BC\u09C7 \u09B6\u09C7\u09B7 \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7',
                );
              if (_issue.format === "includes")
                return '\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: "'.concat(
                  _issue.includes,
                  '" \u0985\u09A8\u09CD\u09A4\u09B0\u09CD\u09AD\u09C1\u0995\u09CD\u09A4 \u09A5\u09BE\u0995\u09A4\u09C7 \u09B9\u09AC\u09C7',
                );
              if (_issue.format === "regex")
                return "\u0985\u09AC\u09C8\u09A7 \u09B8\u09CD\u099F\u09CD\u09B0\u09BF\u0982: ".concat(
                  _issue.pattern,
                  " \u09AA\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09CD\u09A8 \u09AE\u09BF\u09B2\u09A4\u09C7 \u09B9\u09AC\u09C7",
                );
              return "\u0985\u09AC\u09C8\u09A7 ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u0985\u09AC\u09C8\u09A7 \u09A8\u09AE\u09CD\u09AC\u09B0: ".concat(
                issue.divisor,
                " \u098F\u09B0 \u0997\u09C1\u09A3\u09BF\u09A4\u0995 \u09B9\u09A4\u09C7 \u09B9\u09AC\u09C7",
              );
            case "unrecognized_keys":
              return "\u0985\u099A\u09C7\u09A8\u09BE \u0995\u09C0"
                .concat(
                  issue.keys.length > 1 ? "\u0997\u09C1\u09B2\u09CB" : "",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "".concat(
                issue.origin,
                " \u098F \u0985\u09AC\u09C8\u09A7 \u0995\u09C0",
              );
            case "invalid_union":
              if (
                issue.options &&
                Array.isArray(issue.options) &&
                issue.options.length > 0
              ) {
                const opts = issue.options
                  .map((o) => "'".concat(o, "'"))
                  .join(" | ");
                return "\u0985\u09AC\u09C8\u09A7 \u09A1\u09BF\u09B8\u0995\u09CD\u09B0\u09BF\u09AE\u09BF\u09A8\u09C7\u099F\u09B0 \u09AE\u09BE\u09A8\u0964 \u09AA\u09CD\u09B0\u09A4\u09CD\u09AF\u09BE\u09B6\u09BF\u09A4 ".concat(
                  opts,
                );
              }
              return "\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F";
            case "invalid_element":
              return "".concat(
                issue.origin,
                " \u098F \u0985\u09AC\u09C8\u09A7 \u09AE\u09BE\u09A8",
              );
            default:
              return "\u0985\u09AC\u09C8\u09A7 \u0987\u09A8\u09AA\u09C1\u099F";
          }
        };
      };
      function bn() {
        return {
          localeError: bn_error(),
        };
      }
      const ca_error = () => {
        const Sizable = {
          string: { unit: "car\xE0cters", verb: "contenir" },
          file: { unit: "bytes", verb: "contenir" },
          array: { unit: "elements", verb: "contenir" },
          set: { unit: "elements", verb: "contenir" },
          map: { unit: "elements", verb: "contenir" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "entrada",
          email: "adre\xE7a electr\xF2nica",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "data i hora ISO",
          date: "data ISO",
          time: "hora ISO",
          duration: "durada ISO",
          ipv4: "adre\xE7a IPv4",
          ipv6: "adre\xE7a IPv6",
          mac: "adre\xE7a MAC",
          cidrv4: "rang IPv4",
          cidrv6: "rang IPv6",
          base64: "cadena codificada en base64",
          base64url: "cadena codificada en base64url",
          json_string: "cadena JSON",
          e164: "n\xFAmero E.164",
          credit_card: "n\xFAmero de targeta de cr\xE8dit",
          jwt: "JWT",
          template_literal: "entrada",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Tipus inv\xE0lid: s'esperava instanceof "
                  .concat(issue.expected, ", s'ha rebut ")
                  .concat(received);
              }
              return "Tipus inv\xE0lid: s'esperava "
                .concat(expected, ", s'ha rebut ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Valor inv\xE0lid: s'esperava ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Opci\xF3 inv\xE0lida: s'esperava una de ".concat(
                util.joinValues(issue.values, " o "),
              );
            case "too_big": {
              const adj = issue.inclusive ? "com a m\xE0xim" : "menys de";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Massa gran: s'esperava que "
                  .concat(issue.origin ?? "el valor", " contingu\xE9s ")
                  .concat(adj, " ")
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elements");
              return "Massa gran: s'esperava que "
                .concat(issue.origin ?? "el valor", " fos ")
                .concat(adj, " ")
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? "com a m\xEDnim" : "m\xE9s de";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Massa petit: s'esperava que "
                  .concat(issue.origin, " contingu\xE9s ")
                  .concat(adj, " ")
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Massa petit: s'esperava que "
                .concat(issue.origin, " fos ")
                .concat(adj, " ")
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return 'Format inv\xE0lid: ha de comen\xE7ar amb "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return "Format inv\xE0lid: ha d'acabar amb \"".concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return "Format inv\xE0lid: ha d'incloure \"".concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Format inv\xE0lid: ha de coincidir amb el patr\xF3 ".concat(
                  _issue.pattern,
                );
              return "Format inv\xE0lid per a ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "N\xFAmero inv\xE0lid: ha de ser m\xFAltiple de ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Clau"
                .concat(issue.keys.length > 1 ? "s" : "", " no reconeguda")
                .concat(issue.keys.length > 1 ? "s" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Clau inv\xE0lida a ".concat(issue.origin);
            case "invalid_union":
              return "Entrada inv\xE0lida";
            // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
            case "invalid_element":
              return "Element inv\xE0lid a ".concat(issue.origin);
            default:
              return "Entrada inv\xE0lida";
          }
        };
      };
      function ca() {
        return {
          localeError: ca_error(),
        };
      }
      const ckb_error = () => {
        const Sizable = {
          string: { unit: "\u067E\u06CC\u062A", verb: "\u0628\u06CE\u062A" },
          file: {
            unit: "\u0628\u0627\u06CC\u062A",
            verb: "\u0628\u06CE\u062A",
          },
          array: {
            unit: "\u062F\u0627\u0646\u06D5",
            verb: "\u0628\u06CE\u062A",
          },
          set: { unit: "\u062F\u0627\u0646\u06D5", verb: "\u0628\u06CE\u062A" },
          map: { unit: "\u062F\u0627\u0646\u06D5", verb: "\u0628\u06CE\u062A" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "regex",
          email: "\u0626\u06CC\u0645\u06D5\u06CC\u06B5",
          url: "\u0628\u06D5\u0633\u062A\u06D5\u0631 (URL)",
          emoji: "\u0626\u06CC\u0645\u06C6\u062C\u06CC",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "\u0695\u06CE\u06A9\u06D5\u0648\u062A \u0648 \u06A9\u0627\u062A",
          date: "\u0695\u06CE\u06A9\u06D5\u0648\u062A",
          time: "\u06A9\u0627\u062A",
          duration: "\u0645\u0627\u0648\u06D5",
          ipv4: "\u0646\u0627\u0648\u0646\u06CC\u0634\u0627\u0646\u06CC IPv4",
          ipv6: "\u0646\u0627\u0648\u0646\u06CC\u0634\u0627\u0646\u06CC IPv6",
          mac: "\u0646\u0627\u0648\u0646\u06CC\u0634\u0627\u0646\u06CC MAC",
          cidrv4: "\u0645\u06D5\u0648\u062F\u0627\u06CC IPv4",
          cidrv6: "\u0645\u06D5\u0648\u062F\u0627\u06CC IPv6",
          base64: "\u062F\u06D5\u0642\u06CC base64",
          base64url: "\u062F\u06D5\u0642\u06CC base64url",
          json_string: "\u062F\u06D5\u0642\u06CC JSON",
          e164: "\u0698\u0645\u0627\u0631\u06D5\u06CC E.164",
          credit_card:
            "\u0698\u0645\u0627\u0631\u06D5\u06CC \u06A9\u0627\u0631\u062A\u06CC \u06A9\u0631\u06CE\u062F\u06CC\u062A",
          jwt: "JWT",
          template_literal: "\u062A\u06CE\u06A9\u0631\u062F\u06D5",
        };
        const TypeDictionary = {
          nan: "NaN",
          string: "\u0646\u0648\u0648\u0633\u06CC\u0646",
          number: "\u0698\u0645\u0627\u0631\u06D5",
          boolean: "boolean",
          array: "array",
          object: "object",
          date: "\u0695\u06CE\u06A9\u06D5\u0648\u062A",
          integer: "\u0698\u0645\u0627\u0631\u06D5",
          float: "\u0698\u0645\u0627\u0631\u06D5",
          null: "null",
          undefined: "undefined",
          function: "function",
          symbol: "symbol",
          unknown: "unknown",
          promise: "promise",
          void: "void",
          never: "never",
          map: "map",
          set: "set",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              const postfix = [
                "\u0627",
                "\u0648",
                "\u06C6",
                "\u0648\u0648",
                "\u06D5",
                "\u06CC",
                "\u06CE",
              ].some((p) => received.endsWith(p))
                ? "\u06CC\u06D5"
                : "\u06D5";
              const isEnglish = /^[a-zA-Z]+$/.test(received);
              if (receivedType === "null" || receivedType === "undefined")
                return "\u062F\u0627\u0648\u0627\u06A9\u0631\u0627\u0648\u06D5";
              return "\u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648\u06D5 "
                .concat(
                  expected,
                  " \u0628\u06CE\u062A\u060C \u0628\u06D5\u06B5\u0627\u0645 ",
                )
                .concat(received)
                .concat(isEnglish ? "" : postfix);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u0628\u06D5\u0647\u0627\u06A9\u06D5 \u0646\u0627\u062F\u0631\u0648\u0648\u0633\u062A\u06D5: \u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648\u06D5 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                  " \u0628\u06CE\u062A",
                );
              return "\u0647\u06D5\u06B5\u0628\u0698\u0627\u0631\u062F\u06D5\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648\u06D5 \u06CC\u06D5\u06A9\u06CE\u06A9 \u0628\u06CE\u062A \u0644\u06D5 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u0632\u06C6\u0631\u06D5\u0648\u06D5 "
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit, " ")
                  .concat(sizing.verb);
              return "\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u0632\u06C6\u0631\u06D5\u0648\u06D5 ".concat(
                issue.maximum.toString(),
                " \u0628\u06CE\u062A",
              );
            }
            case "too_small": {
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u06A9\u06D5\u0645\u06D5\u0648\u06D5 "
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit, " ")
                  .concat(sizing.verb);
              return "\u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0628\u06D5 \u0644\u0627\u06CC\u06D5\u0646\u06CC \u06A9\u06D5\u0645\u06D5\u0648\u06D5 ".concat(
                issue.minimum.toString(),
                " \u0628\u06CE\u062A",
              );
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u062F\u06D5\u0633\u062A\u067E\u06CE\u0628\u06A9\u0627\u062A \u0628\u06D5 "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return '\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u06A9\u06C6\u062A\u0627\u06CC\u06CC\u0628\u06CE\u062A \u0628\u06D5 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 "'.concat(
                  _issue.includes,
                  '" \u0644\u06D5\u062E\u06C6\u0628\u06AF\u0631\u06CE\u062A',
                );
              if (_issue.format === "regex")
                return "\u062F\u06D5\u0642\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u067E\u06CE\u0648\u06CC\u0633\u062A\u06D5 \u0644\u06D5\u06AF\u06D5\u06B5 \u067E\u0627\u062A\u06CE\u0631\u0646\u06CC ".concat(
                  _issue.pattern,
                  " \u0628\u06AF\u0648\u0646\u062C\u06CE\u062A",
                );
              return "\u0628\u06D5\u0647\u0627\u06CC ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
                " \u0646\u0627\u062F\u0631\u0648\u0633\u062A\u06D5",
              );
            }
            case "not_multiple_of":
              return "\u0698\u0645\u0627\u0631\u06D5\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A: \u062F\u06D5\u0628\u06CE\u062A \u0686\u06D5\u0646\u062F \u0647\u06CE\u0646\u062F\u06D5 \u0628\u06CE\u062A \u0628\u06C6 ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "\u06A9\u0644\u06CC\u0644\u06CC \u0646\u06D5\u0646\u0627\u0633\u0631\u0627\u0648: ".concat(
                util.joinValues(issue.keys, ", "),
              );
            case "invalid_key":
              return "\u06A9\u0644\u06CC\u0644\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A \u0644\u06D5 ".concat(
                issue.origin,
              );
            case "invalid_union":
              if (
                issue.options &&
                Array.isArray(issue.options) &&
                issue.options.length > 0
              ) {
                const opts = issue.options
                  .map((o) => "'".concat(o, "'"))
                  .join(" | ");
                return "\u0628\u06D5\u0647\u0627\u06CC \u0646\u06D5\u0646\u0627\u0633\u0631\u0627\u0648 \u0647\u06D5\u06CC\u06D5. \u0628\u06D5\u0647\u0627\u06CC \u0686\u0627\u0648\u06D5\u0695\u0648\u0627\u0646\u06A9\u0631\u0627\u0648: ".concat(
                  opts,
                );
              }
              return "\u06CC\u06D5\u06A9\u06AF\u0631\u062A\u0646\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A";
            case "invalid_element":
              return "".concat(
                issue.origin,
                " \u0628\u06D5\u0647\u0627\u06A9\u06D5 \u0646\u0627\u062F\u0631\u0648\u0633\u062A\u06D5",
              );
            default:
              return "\u062A\u06CE\u06A9\u0631\u062F\u06D5\u06CC \u0646\u0627\u062F\u0631\u0648\u0633\u062A";
          }
        };
      };
      function ckb() {
        return {
          localeError: ckb_error(),
        };
      }
      const cs_error = () => {
        const Sizable = {
          string: { unit: "znak\u016F", verb: "m\xEDt" },
          file: { unit: "bajt\u016F", verb: "m\xEDt" },
          array: { unit: "prvk\u016F", verb: "m\xEDt" },
          set: { unit: "prvk\u016F", verb: "m\xEDt" },
          map: { unit: "prvk\u016F", verb: "m\xEDt" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "regul\xE1rn\xED v\xFDraz",
          email: "e-mailov\xE1 adresa",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "datum a \u010Das ve form\xE1tu ISO",
          date: "datum ve form\xE1tu ISO",
          time: "\u010Das ve form\xE1tu ISO",
          duration: "doba trv\xE1n\xED ISO",
          ipv4: "IPv4 adresa",
          ipv6: "IPv6 adresa",
          mac: "MAC adresa",
          cidrv4: "rozsah IPv4",
          cidrv6: "rozsah IPv6",
          base64: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64",
          base64url:
            "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64url",
          json_string: "\u0159et\u011Bzec ve form\xE1tu JSON",
          e164: "\u010D\xEDslo E.164",
          credit_card: "\u010D\xEDslo kreditn\xED karty",
          jwt: "JWT",
          template_literal: "vstup",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u010D\xEDslo",
          string: "\u0159et\u011Bzec",
          function: "funkce",
          array: "pole",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no instanceof "
                  .concat(issue.expected, ", obdr\u017Eeno ")
                  .concat(received);
              }
              return "Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no "
                .concat(expected, ", obdr\u017Eeno ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Neplatn\xE1 mo\u017Enost: o\u010Dek\xE1v\xE1na jedna z hodnot ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Hodnota je p\u0159\xEDli\u0161 velk\xE1: "
                  .concat(issue.origin ?? "hodnota", " mus\xED m\xEDt ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "prvk\u016F");
              }
              return "Hodnota je p\u0159\xEDli\u0161 velk\xE1: "
                .concat(issue.origin ?? "hodnota", " mus\xED b\xFDt ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Hodnota je p\u0159\xEDli\u0161 mal\xE1: "
                  .concat(issue.origin ?? "hodnota", " mus\xED m\xEDt ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit ?? "prvk\u016F");
              }
              return "Hodnota je p\u0159\xEDli\u0161 mal\xE1: "
                .concat(issue.origin ?? "hodnota", " mus\xED b\xFDt ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Neplatn\xFD \u0159et\u011Bzec: mus\xED za\u010D\xEDnat na "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Neplatn\xFD \u0159et\u011Bzec: mus\xED kon\u010Dit na "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Neplatn\xFD \u0159et\u011Bzec: mus\xED obsahovat "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Neplatn\xFD \u0159et\u011Bzec: mus\xED odpov\xEDdat vzoru ".concat(
                  _issue.pattern,
                );
              return "Neplatn\xFD form\xE1t ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Neplatn\xE9 \u010D\xEDslo: mus\xED b\xFDt n\xE1sobkem ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Nezn\xE1m\xE9 kl\xED\u010De: ".concat(
                util.joinValues(issue.keys, ", "),
              );
            case "invalid_key":
              return "Neplatn\xFD kl\xED\u010D v ".concat(issue.origin);
            case "invalid_union":
              return "Neplatn\xFD vstup";
            case "invalid_element":
              return "Neplatn\xE1 hodnota v ".concat(issue.origin);
            default:
              return "Neplatn\xFD vstup";
          }
        };
      };
      function cs() {
        return {
          localeError: cs_error(),
        };
      }
      const da_error = () => {
        const Sizable = {
          string: { unit: "tegn", verb: "havde" },
          file: { unit: "bytes", verb: "havde" },
          array: { unit: "elementer", verb: "indeholdt" },
          set: { unit: "elementer", verb: "indeholdt" },
          map: { unit: "elementer", verb: "indeholdt" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "input",
          email: "e-mailadresse",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO dato- og klokkesl\xE6t",
          date: "ISO-dato",
          time: "ISO-klokkesl\xE6t",
          duration: "ISO-varighed",
          ipv4: "IPv4-adresse",
          ipv6: "IPv6-adresse",
          mac: "MAC-adresse",
          cidrv4: "IPv4-spektrum",
          cidrv6: "IPv6-spektrum",
          base64: "base64-kodet streng",
          base64url: "base64url-kodet streng",
          json_string: "JSON-streng",
          e164: "E.164-nummer",
          credit_card: "kreditkortnummer",
          jwt: "JWT",
          template_literal: "input",
        };
        const TypeDictionary = {
          nan: "NaN",
          string: "streng",
          number: "tal",
          boolean: "boolean",
          array: "liste",
          object: "objekt",
          set: "s\xE6t",
          file: "fil",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Ugyldigt input: forventede instanceof "
                  .concat(issue.expected, ", fik ")
                  .concat(received);
              }
              return "Ugyldigt input: forventede "
                .concat(expected, ", fik ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Ugyldig v\xE6rdi: forventede ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Ugyldigt valg: forventede en af f\xF8lgende ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              const origin = TypeDictionary[issue.origin] ?? issue.origin;
              if (sizing)
                return "For stor: forventede "
                  .concat(origin ?? "value", " ")
                  .concat(sizing.verb, " ")
                  .concat(adj, " ")
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elementer");
              return "For stor: forventede "
                .concat(origin ?? "value", " havde ")
                .concat(adj, " ")
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              const origin = TypeDictionary[issue.origin] ?? issue.origin;
              if (sizing) {
                return "For lille: forventede "
                  .concat(origin, " ")
                  .concat(sizing.verb, " ")
                  .concat(adj, " ")
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "For lille: forventede "
                .concat(origin, " havde ")
                .concat(adj, " ")
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Ugyldig streng: skal starte med "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Ugyldig streng: skal ende med "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Ugyldig streng: skal indeholde "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Ugyldig streng: skal matche m\xF8nsteret ".concat(
                  _issue.pattern,
                );
              return "Ugyldig ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Ugyldigt tal: skal v\xE6re deleligt med ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return ""
                .concat(
                  issue.keys.length > 1
                    ? "Ukendte n\xF8gler"
                    : "Ukendt n\xF8gle",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Ugyldig n\xF8gle i ".concat(issue.origin);
            case "invalid_union":
              return "Ugyldigt input: matcher ingen af de tilladte typer";
            case "invalid_element":
              return "Ugyldig v\xE6rdi i ".concat(issue.origin);
            default:
              return "Ugyldigt input";
          }
        };
      };
      function da() {
        return {
          localeError: da_error(),
        };
      }
      const de_error = () => {
        const Sizable = {
          string: { unit: "Zeichen", verb: "zu haben" },
          file: { unit: "Bytes", verb: "zu haben" },
          array: { unit: "Elemente", verb: "zu haben" },
          set: { unit: "Elemente", verb: "zu haben" },
          map: { unit: "Elemente", verb: "zu haben" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "Eingabe",
          email: "E-Mail-Adresse",
          url: "URL",
          emoji: "Emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO-Datum und -Uhrzeit",
          date: "ISO-Datum",
          time: "ISO-Uhrzeit",
          duration: "ISO-Dauer",
          ipv4: "IPv4-Adresse",
          ipv6: "IPv6-Adresse",
          mac: "MAC-Adresse",
          cidrv4: "IPv4-Bereich",
          cidrv6: "IPv6-Bereich",
          base64: "Base64-codierter String",
          base64url: "Base64-URL-codierter String",
          json_string: "JSON-String",
          e164: "E.164-Nummer",
          credit_card: "Kreditkartennummer",
          jwt: "JWT",
          template_literal: "Eingabe",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "Zahl",
          array: "Array",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Ung\xFCltige Eingabe: erwartet instanceof "
                  .concat(issue.expected, ", erhalten ")
                  .concat(received);
              }
              return "Ung\xFCltige Eingabe: erwartet "
                .concat(expected, ", erhalten ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Ung\xFCltige Eingabe: erwartet ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Ung\xFCltige Option: erwartet eine von ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Zu gro\xDF: erwartet, dass "
                  .concat(issue.origin ?? "Wert", " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "Elemente", " hat");
              return "Zu gro\xDF: erwartet, dass "
                .concat(issue.origin ?? "Wert", " ")
                .concat(adj)
                .concat(issue.maximum.toString(), " ist");
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Zu klein: erwartet, dass "
                  .concat(issue.origin, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit, " hat");
              }
              return "Zu klein: erwartet, dass "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(issue.minimum.toString(), " ist");
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Ung\xFCltiger String: muss mit "'.concat(
                  _issue.prefix,
                  '" beginnen',
                );
              if (_issue.format === "ends_with")
                return 'Ung\xFCltiger String: muss mit "'.concat(
                  _issue.suffix,
                  '" enden',
                );
              if (_issue.format === "includes")
                return 'Ung\xFCltiger String: muss "'.concat(
                  _issue.includes,
                  '" enthalten',
                );
              if (_issue.format === "regex")
                return "Ung\xFCltiger String: muss dem Muster ".concat(
                  _issue.pattern,
                  " entsprechen",
                );
              return "Ung\xFCltig: ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Ung\xFCltige Zahl: muss ein Vielfaches von ".concat(
                issue.divisor,
                " sein",
              );
            case "unrecognized_keys":
              return ""
                .concat(
                  issue.keys.length > 1
                    ? "Unbekannte Schl\xFCssel"
                    : "Unbekannter Schl\xFCssel",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Ung\xFCltiger Schl\xFCssel in ".concat(issue.origin);
            case "invalid_union":
              return "Ung\xFCltige Eingabe";
            case "invalid_element":
              return "Ung\xFCltiger Wert in ".concat(issue.origin);
            default:
              return "Ung\xFCltige Eingabe";
          }
        };
      };
      function de() {
        return {
          localeError: de_error(),
        };
      }
      const el_error = () => {
        const Sizable = {
          string: {
            unit: "\u03C7\u03B1\u03C1\u03B1\u03BA\u03C4\u03AE\u03C1\u03B5\u03C2",
            verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
          },
          file: {
            unit: "bytes",
            verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
          },
          array: {
            unit: "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1",
            verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
          },
          set: {
            unit: "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1",
            verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
          },
          map: {
            unit: "\u03BA\u03B1\u03C4\u03B1\u03C7\u03C9\u03C1\u03AE\u03C3\u03B5\u03B9\u03C2",
            verb: "\u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2",
          email: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 email",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "ISO \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1 \u03BA\u03B1\u03B9 \u03CE\u03C1\u03B1",
          date: "ISO \u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1",
          time: "ISO \u03CE\u03C1\u03B1",
          duration: "ISO \u03B4\u03B9\u03AC\u03C1\u03BA\u03B5\u03B9\u03B1",
          ipv4: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 IPv4",
          ipv6: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 IPv6",
          mac: "\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 MAC",
          cidrv4: "\u03B5\u03CD\u03C1\u03BF\u03C2 IPv4",
          cidrv6: "\u03B5\u03CD\u03C1\u03BF\u03C2 IPv6",
          base64:
            "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03B7 \u03C3\u03B5 base64",
          base64url:
            "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC \u03BA\u03C9\u03B4\u03B9\u03BA\u03BF\u03C0\u03BF\u03B9\u03B7\u03BC\u03AD\u03BD\u03B7 \u03C3\u03B5 base64url",
          json_string:
            "\u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC JSON",
          e164: "\u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2 E.164",
          credit_card:
            "\u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2 \u03C0\u03B9\u03C3\u03C4\u03C9\u03C4\u03B9\u03BA\u03AE\u03C2 \u03BA\u03AC\u03C1\u03C4\u03B1\u03C2",
          jwt: "JWT",
          template_literal: "\u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (
                typeof issue.expected === "string" &&
                /^[A-Z]/.test(issue.expected)
              ) {
                return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD instanceof "
                  .concat(
                    issue.expected,
                    ", \u03BB\u03AE\u03C6\u03B8\u03B7\u03BA\u03B5 ",
                  )
                  .concat(received);
              }
              return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD "
                .concat(
                  expected,
                  ", \u03BB\u03AE\u03C6\u03B8\u03B7\u03BA\u03B5 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03C0\u03B9\u03BB\u03BF\u03B3\u03AE: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD \u03AD\u03BD\u03B1 \u03B1\u03C0\u03CC ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u03A0\u03BF\u03BB\u03CD \u03BC\u03B5\u03B3\u03AC\u03BB\u03BF: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD "
                  .concat(
                    issue.origin ?? "\u03C4\u03B9\u03BC\u03AE",
                    " \u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9 ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ??
                      "\u03C3\u03C4\u03BF\u03B9\u03C7\u03B5\u03AF\u03B1",
                  );
              return "\u03A0\u03BF\u03BB\u03CD \u03BC\u03B5\u03B3\u03AC\u03BB\u03BF: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD "
                .concat(
                  issue.origin ?? "\u03C4\u03B9\u03BC\u03AE",
                  " \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ",
                )
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u03A0\u03BF\u03BB\u03CD \u03BC\u03B9\u03BA\u03C1\u03CC: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD "
                  .concat(
                    issue.origin,
                    " \u03BD\u03B1 \u03AD\u03C7\u03B5\u03B9 ",
                  )
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "\u03A0\u03BF\u03BB\u03CD \u03BC\u03B9\u03BA\u03C1\u03CC: \u03B1\u03BD\u03B1\u03BC\u03B5\u03BD\u03CC\u03C4\u03B1\u03BD "
                .concat(
                  issue.origin,
                  " \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 ",
                )
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03BE\u03B5\u03BA\u03B9\u03BD\u03AC \u03BC\u03B5 "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return '\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C4\u03B5\u03BB\u03B5\u03B9\u03CE\u03BD\u03B5\u03B9 \u03BC\u03B5 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C0\u03B5\u03C1\u03B9\u03AD\u03C7\u03B5\u03B9 "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C3\u03C5\u03BC\u03B2\u03BF\u03BB\u03BF\u03C3\u03B5\u03B9\u03C1\u03AC: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03C4\u03B1\u03B9\u03C1\u03B9\u03AC\u03B6\u03B5\u03B9 \u03BC\u03B5 \u03C4\u03BF \u03BC\u03BF\u03C4\u03AF\u03B2\u03BF ".concat(
                  _issue.pattern,
                );
              return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF: ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF\u03C2 \u03B1\u03C1\u03B9\u03B8\u03BC\u03CC\u03C2: \u03C0\u03C1\u03AD\u03C0\u03B5\u03B9 \u03BD\u03B1 \u03B5\u03AF\u03BD\u03B1\u03B9 \u03C0\u03BF\u03BB\u03BB\u03B1\u03C0\u03BB\u03AC\u03C3\u03B9\u03BF \u03C4\u03BF\u03C5 ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "\u0386\u03B3\u03BD\u03C9\u03C3\u03C4"
                .concat(
                  issue.keys.length > 1 ? "\u03B1" : "\u03BF",
                  " \u03BA\u03BB\u03B5\u03B9\u03B4",
                )
                .concat(issue.keys.length > 1 ? "\u03B9\u03AC" : "\u03AF", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03BF \u03BA\u03BB\u03B5\u03B9\u03B4\u03AF \u03C3\u03C4\u03BF ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2";
            case "invalid_element":
              return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03C4\u03B9\u03BC\u03AE \u03C3\u03C4\u03BF ".concat(
                issue.origin,
              );
            default:
              return "\u039C\u03B7 \u03AD\u03B3\u03BA\u03C5\u03C1\u03B7 \u03B5\u03AF\u03C3\u03BF\u03B4\u03BF\u03C2";
          }
        };
      };
      function el() {
        return {
          localeError: el_error(),
        };
      }
      var en = __webpack_require__(1687);
      const eo_error = () => {
        const Sizable = {
          string: { unit: "karaktrojn", verb: "havi" },
          file: { unit: "bajtojn", verb: "havi" },
          array: { unit: "elementojn", verb: "havi" },
          set: { unit: "elementojn", verb: "havi" },
          map: { unit: "elementojn", verb: "havi" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "enigo",
          email: "retadreso",
          url: "URL",
          emoji: "emo\u011Dio",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO-datotempo",
          date: "ISO-dato",
          time: "ISO-tempo",
          duration: "ISO-da\u016Dro",
          ipv4: "IPv4-adreso",
          ipv6: "IPv6-adreso",
          mac: "MAC-adreso",
          cidrv4: "IPv4-rango",
          cidrv6: "IPv6-rango",
          base64: "64-ume kodita karaktraro",
          base64url: "URL-64-ume kodita karaktraro",
          json_string: "JSON-karaktraro",
          e164: "E.164-nombro",
          credit_card: "kreditkarta numero",
          jwt: "JWT",
          template_literal: "enigo",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "nombro",
          array: "tabelo",
          null: "senvalora",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Nevalida enigo: atendi\u011Dis instanceof "
                  .concat(issue.expected, ", ricevi\u011Dis ")
                  .concat(received);
              }
              return "Nevalida enigo: atendi\u011Dis "
                .concat(expected, ", ricevi\u011Dis ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Nevalida enigo: atendi\u011Dis ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Nevalida opcio: atendi\u011Dis unu el ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Tro granda: atendi\u011Dis ke "
                  .concat(issue.origin ?? "valoro", " havu ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elementojn");
              return "Tro granda: atendi\u011Dis ke "
                .concat(issue.origin ?? "valoro", " havu ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Tro malgranda: atendi\u011Dis ke "
                  .concat(issue.origin, " havu ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Tro malgranda: atendi\u011Dis ke "
                .concat(issue.origin, " estu ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Nevalida karaktraro: devas komenci\u011Di per "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Nevalida karaktraro: devas fini\u011Di per "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Nevalida karaktraro: devas inkluzivi "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Nevalida karaktraro: devas kongrui kun la modelo ".concat(
                  _issue.pattern,
                );
              return "Nevalida ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Nevalida nombro: devas esti oblo de ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Nekonata"
                .concat(issue.keys.length > 1 ? "j" : "", " \u015Dlosilo")
                .concat(issue.keys.length > 1 ? "j" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Nevalida \u015Dlosilo en ".concat(issue.origin);
            case "invalid_union":
              return "Nevalida enigo";
            case "invalid_element":
              return "Nevalida valoro en ".concat(issue.origin);
            default:
              return "Nevalida enigo";
          }
        };
      };
      function eo() {
        return {
          localeError: eo_error(),
        };
      }
      const es_error = () => {
        const Sizable = {
          string: { unit: "caracteres", verb: "tener" },
          file: { unit: "bytes", verb: "tener" },
          array: { unit: "elementos", verb: "tener" },
          set: { unit: "elementos", verb: "tener" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "entrada",
          email: "direcci\xF3n de correo electr\xF3nico",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "fecha y hora ISO",
          date: "fecha ISO",
          time: "hora ISO",
          duration: "duraci\xF3n ISO",
          ipv4: "direcci\xF3n IPv4",
          ipv6: "direcci\xF3n IPv6",
          mac: "direcci\xF3n MAC",
          cidrv4: "rango IPv4",
          cidrv6: "rango IPv6",
          base64: "cadena codificada en base64",
          base64url: "URL codificada en base64",
          json_string: "cadena JSON",
          e164: "n\xFAmero E.164",
          credit_card: "n\xFAmero de tarjeta de cr\xE9dito",
          jwt: "JWT",
          template_literal: "entrada",
        };
        const TypeDictionary = {
          nan: "NaN",
          string: "texto",
          number: "n\xFAmero",
          boolean: "booleano",
          array: "arreglo",
          object: "objeto",
          set: "conjunto",
          file: "archivo",
          date: "fecha",
          bigint: "n\xFAmero grande",
          symbol: "s\xEDmbolo",
          undefined: "indefinido",
          null: "nulo",
          function: "funci\xF3n",
          map: "mapa",
          record: "registro",
          tuple: "tupla",
          enum: "enumeraci\xF3n",
          union: "uni\xF3n",
          literal: "literal",
          promise: "promesa",
          void: "vac\xEDo",
          never: "nunca",
          unknown: "desconocido",
          any: "cualquiera",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Entrada inv\xE1lida: se esperaba instanceof "
                  .concat(issue.expected, ", recibido ")
                  .concat(received);
              }
              return "Entrada inv\xE1lida: se esperaba "
                .concat(expected, ", recibido ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Entrada inv\xE1lida: se esperaba ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Opci\xF3n inv\xE1lida: se esperaba una de ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              const origin = TypeDictionary[issue.origin] ?? issue.origin;
              if (sizing)
                return "Demasiado grande: se esperaba que "
                  .concat(origin ?? "valor", " tuviera ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elementos");
              return "Demasiado grande: se esperaba que "
                .concat(origin ?? "valor", " fuera ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              const origin = TypeDictionary[issue.origin] ?? issue.origin;
              if (sizing) {
                return "Demasiado peque\xF1o: se esperaba que "
                  .concat(origin, " tuviera ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Demasiado peque\xF1o: se esperaba que "
                .concat(origin, " fuera ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Cadena inv\xE1lida: debe comenzar con "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Cadena inv\xE1lida: debe terminar en "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Cadena inv\xE1lida: debe incluir "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Cadena inv\xE1lida: debe coincidir con el patr\xF3n ".concat(
                  _issue.pattern,
                );
              return "Inv\xE1lido ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "N\xFAmero inv\xE1lido: debe ser m\xFAltiplo de ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Llave"
                .concat(issue.keys.length > 1 ? "s" : "", " desconocida")
                .concat(issue.keys.length > 1 ? "s" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Llave inv\xE1lida en ".concat(
                TypeDictionary[issue.origin] ?? issue.origin,
              );
            case "invalid_union":
              return "Entrada inv\xE1lida";
            case "invalid_element":
              return "Valor inv\xE1lido en ".concat(
                TypeDictionary[issue.origin] ?? issue.origin,
              );
            default:
              return "Entrada inv\xE1lida";
          }
        };
      };
      function es() {
        return {
          localeError: es_error(),
        };
      }
      const fa_error = () => {
        const Sizable = {
          string: {
            unit: "\u06A9\u0627\u0631\u0627\u06A9\u062A\u0631",
            verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
          },
          file: {
            unit: "\u0628\u0627\u06CC\u062A",
            verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
          },
          array: {
            unit: "\u0622\u06CC\u062A\u0645",
            verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
          },
          set: {
            unit: "\u0622\u06CC\u062A\u0645",
            verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
          },
          map: {
            unit: "\u0622\u06CC\u062A\u0645",
            verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0648\u0631\u0648\u062F\u06CC",
          email: "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644",
          url: "URL",
          emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "\u062A\u0627\u0631\u06CC\u062E \u0648 \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
          date: "\u062A\u0627\u0631\u06CC\u062E \u0627\u06CC\u0632\u0648",
          time: "\u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
          duration:
            "\u0645\u062F\u062A \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
          ipv4: "IPv4 \u0622\u062F\u0631\u0633",
          ipv6: "IPv6 \u0622\u062F\u0631\u0633",
          mac: "MAC \u0622\u062F\u0631\u0633",
          cidrv4: "IPv4 \u062F\u0627\u0645\u0646\u0647",
          cidrv6: "IPv6 \u062F\u0627\u0645\u0646\u0647",
          base64: "base64-encoded \u0631\u0634\u062A\u0647",
          base64url: "base64url-encoded \u0631\u0634\u062A\u0647",
          json_string: "JSON \u0631\u0634\u062A\u0647",
          e164: "E.164 \u0639\u062F\u062F",
          credit_card:
            "\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A \u0627\u0639\u062A\u0628\u0627\u0631\u06CC",
          jwt: "JWT",
          template_literal: "\u0648\u0631\u0648\u062F\u06CC",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u0639\u062F\u062F",
          array: "\u0622\u0631\u0627\u06CC\u0647",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A instanceof "
                  .concat(
                    issue.expected,
                    " \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ",
                  )
                  .concat(
                    received,
                    " \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F",
                  );
              }
              return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A "
                .concat(
                  expected,
                  " \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ",
                )
                .concat(
                  received,
                  " \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F",
                );
            }
            case "invalid_value":
              if (issue.values.length === 1) {
                return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                  " \u0645\u06CC\u200C\u0628\u0648\u062F",
                );
              }
              return "\u06AF\u0632\u06CC\u0646\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A \u06CC\u06A9\u06CC \u0627\u0632 ".concat(
                util.joinValues(issue.values, "|"),
                " \u0645\u06CC\u200C\u0628\u0648\u062F",
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: "
                  .concat(
                    issue.origin ?? "\u0645\u0642\u062F\u0627\u0631",
                    " \u0628\u0627\u06CC\u062F ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ?? "\u0639\u0646\u0635\u0631",
                    " \u0628\u0627\u0634\u062F",
                  );
              }
              return "\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: "
                .concat(
                  issue.origin ?? "\u0645\u0642\u062F\u0627\u0631",
                  " \u0628\u0627\u06CC\u062F ",
                )
                .concat(adj)
                .concat(issue.maximum.toString(), " \u0628\u0627\u0634\u062F");
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: "
                  .concat(issue.origin, " \u0628\u0627\u06CC\u062F ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit, " \u0628\u0627\u0634\u062F");
              }
              return "\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: "
                .concat(issue.origin, " \u0628\u0627\u06CC\u062F ")
                .concat(adj)
                .concat(issue.minimum.toString(), " \u0628\u0627\u0634\u062F");
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "'.concat(
                  _issue.prefix,
                  '" \u0634\u0631\u0648\u0639 \u0634\u0648\u062F',
                );
              }
              if (_issue.format === "ends_with") {
                return '\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "'.concat(
                  _issue.suffix,
                  '" \u062A\u0645\u0627\u0645 \u0634\u0648\u062F',
                );
              }
              if (_issue.format === "includes") {
                return '\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0634\u0627\u0645\u0644 "'.concat(
                  _issue.includes,
                  '" \u0628\u0627\u0634\u062F',
                );
              }
              if (_issue.format === "regex") {
                return "\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 \u0627\u0644\u06AF\u0648\u06CC ".concat(
                  _issue.pattern,
                  " \u0645\u0637\u0627\u0628\u0642\u062A \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F",
                );
              }
              return "".concat(
                FormatDictionary[_issue.format] ?? issue.format,
                " \u0646\u0627\u0645\u0639\u062A\u0628\u0631",
              );
            }
            case "not_multiple_of":
              return "\u0639\u062F\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0645\u0636\u0631\u0628 ".concat(
                issue.divisor,
                " \u0628\u0627\u0634\u062F",
              );
            case "unrecognized_keys":
              return "\u06A9\u0644\u06CC\u062F"
                .concat(
                  issue.keys.length > 1 ? "\u0647\u0627\u06CC" : "",
                  " \u0646\u0627\u0634\u0646\u0627\u0633: ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u06A9\u0644\u06CC\u062F \u0646\u0627\u0634\u0646\u0627\u0633 \u062F\u0631 ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631";
            case "invalid_element":
              return "\u0645\u0642\u062F\u0627\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u062F\u0631 ".concat(
                issue.origin,
              );
            default:
              return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631";
          }
        };
      };
      function fa() {
        return {
          localeError: fa_error(),
        };
      }
      const fi_error = () => {
        const Sizable = {
          string: { unit: "merkki\xE4", subject: "merkkijonon" },
          file: { unit: "tavua", subject: "tiedoston" },
          array: { unit: "alkiota", subject: "listan" },
          set: { unit: "alkiota", subject: "joukon" },
          map: { unit: "alkiota", subject: "kuvauksen" },
          number: { unit: "", subject: "luvun" },
          bigint: { unit: "", subject: "suuren kokonaisluvun" },
          int: { unit: "", subject: "kokonaisluvun" },
          date: { unit: "", subject: "p\xE4iv\xE4m\xE4\xE4r\xE4n" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "s\xE4\xE4nn\xF6llinen lauseke",
          email: "s\xE4hk\xF6postiosoite",
          url: "URL-osoite",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO-aikaleima",
          date: "ISO-p\xE4iv\xE4m\xE4\xE4r\xE4",
          time: "ISO-aika",
          duration: "ISO-kesto",
          ipv4: "IPv4-osoite",
          ipv6: "IPv6-osoite",
          mac: "MAC-osoite",
          cidrv4: "IPv4-alue",
          cidrv6: "IPv6-alue",
          base64: "base64-koodattu merkkijono",
          base64url: "base64url-koodattu merkkijono",
          json_string: "JSON-merkkijono",
          e164: "E.164-luku",
          credit_card: "luottokortin numero",
          jwt: "JWT",
          template_literal: "templaattimerkkijono",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Virheellinen tyyppi: odotettiin instanceof "
                  .concat(issue.expected, ", oli ")
                  .concat(received);
              }
              return "Virheellinen tyyppi: odotettiin "
                .concat(expected, ", oli ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Virheellinen sy\xF6te: t\xE4ytyy olla ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Virheellinen valinta: t\xE4ytyy olla yksi seuraavista: ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Liian suuri: "
                  .concat(sizing.subject, " t\xE4ytyy olla ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit)
                  .trim();
              }
              return "Liian suuri: arvon t\xE4ytyy olla "
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Liian pieni: "
                  .concat(sizing.subject, " t\xE4ytyy olla ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit)
                  .trim();
              }
              return "Liian pieni: arvon t\xE4ytyy olla "
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Virheellinen sy\xF6te: t\xE4ytyy alkaa "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Virheellinen sy\xF6te: t\xE4ytyy loppua "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Virheellinen sy\xF6te: t\xE4ytyy sis\xE4lt\xE4\xE4 "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex") {
                return "Virheellinen sy\xF6te: t\xE4ytyy vastata s\xE4\xE4nn\xF6llist\xE4 lauseketta ".concat(
                  _issue.pattern,
                );
              }
              return "Virheellinen ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Virheellinen luku: t\xE4ytyy olla luvun ".concat(
                issue.divisor,
                " monikerta",
              );
            case "unrecognized_keys":
              return ""
                .concat(
                  issue.keys.length > 1
                    ? "Tuntemattomat avaimet"
                    : "Tuntematon avain",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Virheellinen avain tietueessa";
            case "invalid_union":
              return "Virheellinen unioni";
            case "invalid_element":
              return "Virheellinen arvo joukossa";
            default:
              return "Virheellinen sy\xF6te";
          }
        };
      };
      function fi() {
        return {
          localeError: fi_error(),
        };
      }
      const fr_error = () => {
        const Sizable = {
          string: { unit: "caract\xE8res", verb: "avoir" },
          file: { unit: "octets", verb: "avoir" },
          array: { unit: "\xE9l\xE9ments", verb: "avoir" },
          set: { unit: "\xE9l\xE9ments", verb: "avoir" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "expression r\xE9guli\xE8re",
          email: "adresse e-mail",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "date et heure ISO",
          date: "date ISO",
          time: "heure ISO",
          duration: "dur\xE9e ISO",
          ipv4: "adresse IPv4",
          ipv6: "adresse IPv6",
          mac: "adresse MAC",
          cidrv4: "plage IPv4",
          cidrv6: "plage IPv6",
          base64: "cha\xEEne de caract\xE8res encod\xE9e en base64",
          base64url: "cha\xEEne de caract\xE8res encod\xE9e en base64url",
          json_string: "cha\xEEne de caract\xE8res JSON",
          e164: "num\xE9ro au format E.164",
          credit_card: "num\xE9ro de carte de cr\xE9dit",
          jwt: "JWT",
          template_literal: "entr\xE9e",
        };
        const TypeDictionary = {
          string: "cha\xEEne de caract\xE8res",
          number: "nombre",
          int: "entier",
          boolean: "bool\xE9en",
          bigint: "grand entier",
          symbol: "symbole",
          undefined: "ind\xE9fini",
          null: "null",
          never: "jamais",
          void: "vide",
          date: "date",
          array: "tableau",
          object: "objet",
          tuple: "tuple",
          record: "record",
          map: "map",
          set: "ensemble",
          file: "fichier",
          nonoptional: "non optionnel",
          nan: "NaN",
          function: "fonction",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Entr\xE9e invalide : instance de "
                  .concat(issue.expected, " attendu, ")
                  .concat(received, " re\xE7u");
              }
              return "Entr\xE9e invalide : "
                .concat(expected, " attendu, ")
                .concat(received, " re\xE7u");
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Entr\xE9e invalide : ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                  " attendu",
                );
              return "Option invalide : une valeur parmi ".concat(
                util.joinValues(issue.values, "|"),
                " attendue",
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Trop grand : "
                  .concat(TypeDictionary[issue.origin] ?? "valeur", " doit ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "\xE9l\xE9ment(s)");
              return "Trop grand : "
                .concat(
                  TypeDictionary[issue.origin] ?? "valeur",
                  " doit \xEAtre ",
                )
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Trop petit : "
                  .concat(TypeDictionary[issue.origin] ?? "valeur", " doit ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              return "Trop petit : "
                .concat(
                  TypeDictionary[issue.origin] ?? "valeur",
                  " doit \xEAtre ",
                )
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Cha\xEEne de caract\xE8res invalide : doit commencer par "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Cha\xEEne de caract\xE8res invalide : doit se terminer par "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Cha\xEEne de caract\xE8res invalide : doit inclure "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Cha\xEEne de caract\xE8res invalide : doit correspondre au motif ".concat(
                  _issue.pattern,
                );
              return "".concat(
                FormatDictionary[_issue.format] ?? issue.format,
                " invalide",
              );
            }
            case "not_multiple_of":
              return "Nombre invalide : doit \xEAtre un multiple de ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Cl\xE9"
                .concat(issue.keys.length > 1 ? "s" : "", " non reconnue")
                .concat(issue.keys.length > 1 ? "s" : "", " : ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Cl\xE9 invalide dans ".concat(issue.origin);
            case "invalid_union":
              return "Entr\xE9e invalide";
            case "invalid_element":
              return "Valeur invalide dans ".concat(issue.origin);
            default:
              return "Entr\xE9e invalide";
          }
        };
      };
      function fr() {
        return {
          localeError: fr_error(),
        };
      }
      const fr_CA_error = () => {
        const Sizable = {
          string: { unit: "caract\xE8res", verb: "avoir" },
          file: { unit: "octets", verb: "avoir" },
          array: { unit: "\xE9l\xE9ments", verb: "avoir" },
          set: { unit: "\xE9l\xE9ments", verb: "avoir" },
          map: { unit: "\xE9l\xE9ments", verb: "avoir" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "entr\xE9e",
          email: "adresse courriel",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "date-heure ISO",
          date: "date ISO",
          time: "heure ISO",
          duration: "dur\xE9e ISO",
          ipv4: "adresse IPv4",
          ipv6: "adresse IPv6",
          mac: "adresse MAC",
          cidrv4: "plage IPv4",
          cidrv6: "plage IPv6",
          base64: "cha\xEEne encod\xE9e en base64",
          base64url: "cha\xEEne encod\xE9e en base64url",
          json_string: "cha\xEEne JSON",
          e164: "num\xE9ro E.164",
          credit_card: "num\xE9ro de carte de cr\xE9dit",
          jwt: "JWT",
          template_literal: "entr\xE9e",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Entr\xE9e invalide : attendu instanceof "
                  .concat(issue.expected, ", re\xE7u ")
                  .concat(received);
              }
              return "Entr\xE9e invalide : attendu "
                .concat(expected, ", re\xE7u ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Entr\xE9e invalide : attendu ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Option invalide : attendu l'une des valeurs suivantes ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "\u2264" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Trop grand : attendu que "
                  .concat(issue.origin ?? "la valeur", " ait ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit);
              return "Trop grand : attendu que "
                .concat(issue.origin ?? "la valeur", " soit ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? "\u2265" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Trop petit : attendu que "
                  .concat(issue.origin, " ait ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Trop petit : attendu que "
                .concat(issue.origin, " soit ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return 'Cha\xEEne invalide : doit commencer par "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return 'Cha\xEEne invalide : doit se terminer par "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Cha\xEEne invalide : doit inclure "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Cha\xEEne invalide : doit correspondre au motif ".concat(
                  _issue.pattern,
                );
              return "".concat(
                FormatDictionary[_issue.format] ?? issue.format,
                " invalide",
              );
            }
            case "not_multiple_of":
              return "Nombre invalide : doit \xEAtre un multiple de ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Cl\xE9"
                .concat(issue.keys.length > 1 ? "s" : "", " non reconnue")
                .concat(issue.keys.length > 1 ? "s" : "", " : ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Cl\xE9 invalide dans ".concat(issue.origin);
            case "invalid_union":
              return "Entr\xE9e invalide";
            case "invalid_element":
              return "Valeur invalide dans ".concat(issue.origin);
            default:
              return "Entr\xE9e invalide";
          }
        };
      };
      function fr_CA() {
        return {
          localeError: fr_CA_error(),
        };
      }
      const gu_error = () => {
        const Sizable = {
          string: {
            unit: "\u0A85\u0A95\u0ACD\u0AB7\u0AB0",
            verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
          },
          file: {
            unit: "\u0AAC\u0ABE\u0AAF\u0A9F",
            verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
          },
          array: {
            unit: "\u0A86\u0A87\u0A9F\u0AAE",
            verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
          },
          set: {
            unit: "\u0A86\u0A87\u0A9F\u0AAE",
            verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
          },
          map: {
            unit: "\u0A8F\u0AA8\u0ACD\u0A9F\u0ACD\u0AB0\u0AC0",
            verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0A87\u0AA8\u0AAA\u0AC1\u0A9F",
          email:
            "\u0A88\u0AAE\u0AC7\u0A87\u0AB2 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
          url: "URL",
          emoji: "\u0A87\u0AAE\u0ACB\u0A9C\u0AC0",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "ISO \u0AA4\u0ABE\u0AB0\u0AC0\u0A96 \u0A85\u0AA8\u0AC7 \u0AB8\u0AAE\u0AAF",
          date: "ISO \u0AA4\u0ABE\u0AB0\u0AC0\u0A96",
          time: "ISO \u0AB8\u0AAE\u0AAF",
          duration: "ISO \u0A85\u0AB5\u0AA7\u0ABF",
          ipv4: "IPv4 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
          ipv6: "IPv6 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
          mac: "MAC \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
          cidrv4: "IPv4 \u0AB6\u0ACD\u0AB0\u0AC7\u0AA3\u0AC0",
          cidrv6: "IPv6 \u0AB6\u0ACD\u0AB0\u0AC7\u0AA3\u0AC0",
          base64:
            "base64-\u0A8F\u0AA8\u0ACD\u0A95\u0ACB\u0AA1\u0AC7\u0AA1 \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
          base64url:
            "base64url-\u0A8F\u0AA8\u0ACD\u0A95\u0ACB\u0AA1\u0AC7\u0AA1 \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
          json_string: "JSON \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
          e164: "E.164 \u0AA8\u0A82\u0AAC\u0AB0",
          credit_card:
            "\u0A95\u0ACD\u0AB0\u0AC7\u0AA1\u0ABF\u0A9F \u0A95\u0ABE\u0AB0\u0ACD\u0AA1 \u0AA8\u0A82\u0AAC\u0AB0",
          jwt: "JWT",
          template_literal: "\u0A87\u0AA8\u0AAA\u0AC1\u0A9F",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F: \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 "
                .concat(
                  expected,
                  ", \u0AAA\u0ACD\u0AB0\u0ABE\u0AAA\u0ACD\u0AA4 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F: \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB5\u0ABF\u0A95\u0AB2\u0ACD\u0AAA: ".concat(
                util.joinValues(issue.values, " | "),
                " \u0AAE\u0ABE\u0AA7\u0ACD\u0AAF\u0AAE\u0AA5\u0AC0 \u0A8F\u0A95 \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4",
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u0A96\u0AC2\u0AAC \u0AAE\u0ACB\u0A9F\u0AC1\u0A82: "
                  .concat(issue.origin ?? "\u0AAE\u0AC2\u0AB2\u0ACD\u0AAF", " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ??
                      "\u0A8F\u0AB2\u0ABF\u0AAE\u0AC7\u0AA8\u0ACD\u0A9F",
                    " \u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
                  );
              return "\u0A96\u0AC2\u0AAC \u0AAE\u0ACB\u0A9F\u0AC1\u0A82: "
                .concat(issue.origin ?? "\u0AAE\u0AC2\u0AB2\u0ACD\u0AAF", " ")
                .concat(adj)
                .concat(
                  issue.maximum.toString(),
                  " \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F",
                );
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0A96\u0AC2\u0AAC \u0AA8\u0ABE\u0AA8\u0AC1\u0A82: "
                  .concat(issue.origin, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(
                    sizing.unit,
                    " \u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F",
                  );
              }
              return "\u0A96\u0AC2\u0AAC \u0AA8\u0ABE\u0AA8\u0AC1\u0A82: "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(
                  issue.minimum.toString(),
                  " \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F",
                );
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "'.concat(
                  _issue.prefix,
                  '" \u0AA5\u0AC0 \u0AB6\u0AB0\u0AC2 \u0AA5\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F',
                );
              }
              if (_issue.format === "ends_with")
                return '\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "'.concat(
                  _issue.suffix,
                  '" \u0AAA\u0AB0 \u0AB8\u0AAE\u0ABE\u0AAA\u0ACD\u0AA4 \u0AA5\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F',
                );
              if (_issue.format === "includes")
                return '\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "'.concat(
                  _issue.includes,
                  '" \u0AB6\u0ABE\u0AAE\u0AC7\u0AB2 \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F',
                );
              if (_issue.format === "regex")
                return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: \u0AAA\u0AC7\u0A9F\u0AB0\u0ACD\u0AA8 ".concat(
                  _issue.pattern,
                  " \u0AB8\u0ABE\u0AA5\u0AC7 \u0AAE\u0AC7\u0AB3 \u0A96\u0ABE\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F",
                );
              return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AA8\u0A82\u0AAC\u0AB0: ".concat(
                issue.divisor,
                " \u0AA8\u0ACB \u0A97\u0AC1\u0AA3\u0ABE\u0A82\u0A95 \u0AB9\u0ACB\u0AB5\u0ACB \u0A9C\u0ACB\u0A88\u0A8F",
              );
            case "unrecognized_keys":
              return "\u0A93\u0AB3\u0A96\u0AC0 \u0AB6\u0A95\u0ABE\u0AA4\u0ABE \u0AA8\u0AB9\u0AC0\u0A82 \u0AA4\u0AC7 \u0A95\u0AC0"
                .concat(issue.keys.length > 1 ? "\u0A93" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "".concat(
                issue.origin,
                " \u0AAE\u0ABE\u0A82 \u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A95\u0AC0",
              );
            case "invalid_union":
              if (
                issue.options &&
                Array.isArray(issue.options) &&
                issue.options.length > 0
              ) {
                const opts = issue.options
                  .map((o) => "'".concat(o, "'"))
                  .join(" | ");
                return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AA1\u0ABF\u0AB8\u0ACD\u0A95\u0ACD\u0AB0\u0ABF\u0AAE\u0ABF\u0AA8\u0AC7\u0A9F\u0AB0 \u0AAE\u0AC2\u0AB2\u0ACD\u0AAF. \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 ".concat(
                  opts,
                );
              }
              return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F";
            case "invalid_element":
              return "".concat(
                issue.origin,
                " \u0AAE\u0ABE\u0A82 \u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AAE\u0AC2\u0AB2\u0ACD\u0AAF",
              );
            default:
              return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F";
          }
        };
      };
      function gu() {
        return {
          localeError: gu_error(),
        };
      }
      const he_error = () => {
        const TypeNames = {
          string: {
            label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA",
            gender: "f",
          },
          number: { label: "\u05DE\u05E1\u05E4\u05E8", gender: "m" },
          boolean: {
            label:
              "\u05E2\u05E8\u05DA \u05D1\u05D5\u05DC\u05D9\u05D0\u05E0\u05D9",
            gender: "m",
          },
          bigint: { label: "BigInt", gender: "m" },
          date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA", gender: "m" },
          array: { label: "\u05DE\u05E2\u05E8\u05DA", gender: "m" },
          object: {
            label: "\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8",
            gender: "m",
          },
          null: {
            label: "\u05E2\u05E8\u05DA \u05E8\u05D9\u05E7 (null)",
            gender: "m",
          },
          undefined: {
            label:
              "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05DE\u05D5\u05D2\u05D3\u05E8 (undefined)",
            gender: "m",
          },
          symbol: {
            label: "\u05E1\u05D9\u05DE\u05D1\u05D5\u05DC (Symbol)",
            gender: "m",
          },
          function: {
            label: "\u05E4\u05D5\u05E0\u05E7\u05E6\u05D9\u05D4",
            gender: "f",
          },
          map: { label: "\u05DE\u05E4\u05D4 (Map)", gender: "f" },
          set: { label: "\u05E7\u05D1\u05D5\u05E6\u05D4 (Set)", gender: "f" },
          file: { label: "\u05E7\u05D5\u05D1\u05E5", gender: "m" },
          promise: { label: "Promise", gender: "m" },
          NaN: { label: "NaN", gender: "m" },
          unknown: {
            label: "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05D9\u05D3\u05D5\u05E2",
            gender: "m",
          },
          value: { label: "\u05E2\u05E8\u05DA", gender: "m" },
        };
        const Sizable = {
          string: {
            unit: "\u05EA\u05D5\u05D5\u05D9\u05DD",
            shortLabel: "\u05E7\u05E6\u05E8",
            longLabel: "\u05D0\u05E8\u05D5\u05DA",
          },
          file: {
            unit: "\u05D1\u05D9\u05D9\u05D8\u05D9\u05DD",
            shortLabel: "\u05E7\u05D8\u05DF",
            longLabel: "\u05D2\u05D3\u05D5\u05DC",
          },
          array: {
            unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD",
            shortLabel: "\u05E7\u05D8\u05DF",
            longLabel: "\u05D2\u05D3\u05D5\u05DC",
          },
          set: {
            unit: "\u05E4\u05E8\u05D9\u05D8\u05D9\u05DD",
            shortLabel: "\u05E7\u05D8\u05DF",
            longLabel: "\u05D2\u05D3\u05D5\u05DC",
          },
          number: {
            unit: "",
            shortLabel: "\u05E7\u05D8\u05DF",
            longLabel: "\u05D2\u05D3\u05D5\u05DC",
          },
          // no unit
        };
        const typeEntry = (t) => (t ? TypeNames[t] : void 0);
        const typeLabel = (t) => {
          const e = typeEntry(t);
          if (e) return e.label;
          return t ?? TypeNames.unknown.label;
        };
        const withDefinite = (t) => "\u05D4".concat(typeLabel(t));
        const verbFor = (t) => {
          const e = typeEntry(t);
          const gender = e?.gender ?? "m";
          return gender === "f"
            ? "\u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05D9\u05D5\u05EA"
            : "\u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA";
        };
        const getSizing = (origin) => {
          if (!origin) return null;
          return Sizable[origin] ?? null;
        };
        const FormatDictionary = {
          regex: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          email: {
            label:
              "\u05DB\u05EA\u05D5\u05D1\u05EA \u05D0\u05D9\u05DE\u05D9\u05D9\u05DC",
            gender: "f",
          },
          url: {
            label: "\u05DB\u05EA\u05D5\u05D1\u05EA \u05E8\u05E9\u05EA",
            gender: "f",
          },
          emoji: {
            label: "\u05D0\u05D9\u05DE\u05D5\u05D2'\u05D9",
            gender: "m",
          },
          uuid: { label: "UUID", gender: "m" },
          uuidv4: { label: "UUIDv4", gender: "m" },
          uuidv6: { label: "UUIDv6", gender: "m" },
          nanoid: { label: "nanoid", gender: "m" },
          guid: { label: "GUID", gender: "m" },
          cuid: { label: "cuid", gender: "m" },
          cuid2: { label: "cuid2", gender: "m" },
          ulid: { label: "ULID", gender: "m" },
          xid: { label: "XID", gender: "m" },
          ksuid: { label: "KSUID", gender: "m" },
          datetime: {
            label:
              "\u05EA\u05D0\u05E8\u05D9\u05DA \u05D5\u05D6\u05DE\u05DF ISO",
            gender: "m",
          },
          date: { label: "\u05EA\u05D0\u05E8\u05D9\u05DA ISO", gender: "m" },
          time: { label: "\u05D6\u05DE\u05DF ISO", gender: "m" },
          duration: {
            label: "\u05DE\u05E9\u05DA \u05D6\u05DE\u05DF ISO",
            gender: "m",
          },
          ipv4: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv4", gender: "f" },
          ipv6: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA IPv6", gender: "f" },
          mac: { label: "\u05DB\u05EA\u05D5\u05D1\u05EA MAC", gender: "f" },
          cidrv4: { label: "\u05D8\u05D5\u05D5\u05D7 IPv4", gender: "m" },
          cidrv6: { label: "\u05D8\u05D5\u05D5\u05D7 IPv6", gender: "m" },
          base64: {
            label:
              "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64",
            gender: "f",
          },
          base64url: {
            label:
              "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D1\u05D1\u05E1\u05D9\u05E1 64 \u05DC\u05DB\u05EA\u05D5\u05D1\u05D5\u05EA \u05E8\u05E9\u05EA",
            gender: "f",
          },
          json_string: {
            label: "\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA JSON",
            gender: "f",
          },
          e164: { label: "\u05DE\u05E1\u05E4\u05E8 E.164", gender: "m" },
          credit_card: {
            label:
              "\u05DE\u05E1\u05E4\u05E8 \u05DB\u05E8\u05D8\u05D9\u05E1 \u05D0\u05E9\u05E8\u05D0\u05D9",
            gender: "m",
          },
          jwt: { label: "JWT", gender: "m" },
          template_literal: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          ends_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          includes: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          lowercase: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          starts_with: { label: "\u05E7\u05DC\u05D8", gender: "m" },
          uppercase: { label: "\u05E7\u05DC\u05D8", gender: "m" },
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expectedKey = issue.expected;
              const expected =
                TypeDictionary[expectedKey ?? ""] ?? typeLabel(expectedKey);
              const receivedType = util.parsedType(issue.input);
              const received =
                TypeDictionary[receivedType] ??
                TypeNames[receivedType]?.label ??
                receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA instanceof "
                  .concat(issue.expected, ", \u05D4\u05EA\u05E7\u05D1\u05DC ")
                  .concat(received);
              }
              return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA "
                .concat(expected, ", \u05D4\u05EA\u05E7\u05D1\u05DC ")
                .concat(received);
            }
            case "invalid_value": {
              if (issue.values.length === 1) {
                return "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05E2\u05E8\u05DA \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              }
              const stringified = issue.values.map((v) =>
                util.stringifyPrimitive(v),
              );
              if (issue.values.length === 2) {
                return "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF "
                  .concat(stringified[0], " \u05D0\u05D5 ")
                  .concat(stringified[1]);
              }
              const lastValue = stringified[stringified.length - 1];
              const restValues = stringified.slice(0, -1).join(", ");
              return "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D4\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05D4\u05DF "
                .concat(restValues, " \u05D0\u05D5 ")
                .concat(lastValue);
            }
            case "too_big": {
              const sizing = getSizing(issue.origin);
              const subject = withDefinite(issue.origin ?? "value");
              if (issue.origin === "string") {
                return ""
                  .concat(
                    sizing?.longLabel ?? "\u05D0\u05E8\u05D5\u05DA",
                    " \u05DE\u05D3\u05D9: ",
                  )
                  .concat(
                    subject,
                    " \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ",
                  )
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing?.unit ?? "", " ")
                  .concat(
                    issue.inclusive
                      ? "\u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA"
                      : "\u05DC\u05DB\u05DC \u05D4\u05D9\u05D5\u05EA\u05E8",
                  )
                  .trim();
              }
              if (issue.origin === "number") {
                const comparison = issue.inclusive
                  ? "\u05E7\u05D8\u05DF \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-".concat(
                      issue.maximum,
                    )
                  : "\u05E7\u05D8\u05DF \u05DE-".concat(issue.maximum);
                return "\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: "
                  .concat(
                    subject,
                    " \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ",
                  )
                  .concat(comparison);
              }
              if (issue.origin === "array" || issue.origin === "set") {
                const verb =
                  issue.origin === "set"
                    ? "\u05E6\u05E8\u05D9\u05DB\u05D4"
                    : "\u05E6\u05E8\u05D9\u05DA";
                const comparison = issue.inclusive
                  ? ""
                      .concat(issue.maximum, " ")
                      .concat(
                        sizing?.unit ?? "",
                        " \u05D0\u05D5 \u05E4\u05D7\u05D5\u05EA",
                      )
                  : "\u05E4\u05D7\u05D5\u05EA \u05DE-"
                      .concat(issue.maximum, " ")
                      .concat(sizing?.unit ?? "");
                return "\u05D2\u05D3\u05D5\u05DC \u05DE\u05D3\u05D9: "
                  .concat(subject, " ")
                  .concat(verb, " \u05DC\u05D4\u05DB\u05D9\u05DC ")
                  .concat(comparison)
                  .trim();
              }
              const adj = issue.inclusive ? "<=" : "<";
              const be2 = verbFor(issue.origin ?? "value");
              if (sizing?.unit) {
                return ""
                  .concat(sizing.longLabel, " \u05DE\u05D3\u05D9: ")
                  .concat(subject, " ")
                  .concat(be2, " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit);
              }
              return ""
                .concat(
                  sizing?.longLabel ?? "\u05D2\u05D3\u05D5\u05DC",
                  " \u05DE\u05D3\u05D9: ",
                )
                .concat(subject, " ")
                .concat(be2, " ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const sizing = getSizing(issue.origin);
              const subject = withDefinite(issue.origin ?? "value");
              if (issue.origin === "string") {
                return ""
                  .concat(
                    sizing?.shortLabel ?? "\u05E7\u05E6\u05E8",
                    " \u05DE\u05D3\u05D9: ",
                  )
                  .concat(
                    subject,
                    " \u05E6\u05E8\u05D9\u05DB\u05D4 \u05DC\u05D4\u05DB\u05D9\u05DC ",
                  )
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing?.unit ?? "", " ")
                  .concat(
                    issue.inclusive
                      ? "\u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8"
                      : "\u05DC\u05E4\u05D7\u05D5\u05EA",
                  )
                  .trim();
              }
              if (issue.origin === "number") {
                const comparison = issue.inclusive
                  ? "\u05D2\u05D3\u05D5\u05DC \u05D0\u05D5 \u05E9\u05D5\u05D5\u05D4 \u05DC-".concat(
                      issue.minimum,
                    )
                  : "\u05D2\u05D3\u05D5\u05DC \u05DE-".concat(issue.minimum);
                return "\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: "
                  .concat(
                    subject,
                    " \u05E6\u05E8\u05D9\u05DA \u05DC\u05D4\u05D9\u05D5\u05EA ",
                  )
                  .concat(comparison);
              }
              if (issue.origin === "array" || issue.origin === "set") {
                const verb =
                  issue.origin === "set"
                    ? "\u05E6\u05E8\u05D9\u05DB\u05D4"
                    : "\u05E6\u05E8\u05D9\u05DA";
                if (issue.minimum === 1 && issue.inclusive) {
                  const singularPhrase =
                    issue.origin === "set"
                      ? "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3"
                      : "\u05DC\u05E4\u05D7\u05D5\u05EA \u05E4\u05E8\u05D9\u05D8 \u05D0\u05D7\u05D3";
                  return "\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: "
                    .concat(subject, " ")
                    .concat(verb, " \u05DC\u05D4\u05DB\u05D9\u05DC ")
                    .concat(singularPhrase);
                }
                const comparison = issue.inclusive
                  ? ""
                      .concat(issue.minimum, " ")
                      .concat(
                        sizing?.unit ?? "",
                        " \u05D0\u05D5 \u05D9\u05D5\u05EA\u05E8",
                      )
                  : "\u05D9\u05D5\u05EA\u05E8 \u05DE-"
                      .concat(issue.minimum, " ")
                      .concat(sizing?.unit ?? "");
                return "\u05E7\u05D8\u05DF \u05DE\u05D3\u05D9: "
                  .concat(subject, " ")
                  .concat(verb, " \u05DC\u05D4\u05DB\u05D9\u05DC ")
                  .concat(comparison)
                  .trim();
              }
              const adj = issue.inclusive ? ">=" : ">";
              const be2 = verbFor(issue.origin ?? "value");
              if (sizing?.unit) {
                return ""
                  .concat(sizing.shortLabel, " \u05DE\u05D3\u05D9: ")
                  .concat(subject, " ")
                  .concat(be2, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return ""
                .concat(
                  sizing?.shortLabel ?? "\u05E7\u05D8\u05DF",
                  " \u05DE\u05D3\u05D9: ",
                )
                .concat(subject, " ")
                .concat(be2, " ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D7\u05D9\u05DC \u05D1 "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return '\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05E1\u05EA\u05D9\u05D9\u05DD \u05D1 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05DB\u05DC\u05D5\u05DC "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u05D4\u05DE\u05D7\u05E8\u05D5\u05D6\u05EA \u05D7\u05D9\u05D9\u05D1\u05EA \u05DC\u05D4\u05EA\u05D0\u05D9\u05DD \u05DC\u05EA\u05D1\u05E0\u05D9\u05EA ".concat(
                  _issue.pattern,
                );
              const nounEntry = FormatDictionary[_issue.format];
              const noun = nounEntry?.label ?? _issue.format;
              const gender = nounEntry?.gender ?? "m";
              const adjective =
                gender === "f"
                  ? "\u05EA\u05E7\u05D9\u05E0\u05D4"
                  : "\u05EA\u05E7\u05D9\u05DF";
              return "".concat(noun, " \u05DC\u05D0 ").concat(adjective);
            }
            case "not_multiple_of":
              return "\u05DE\u05E1\u05E4\u05E8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF: \u05D7\u05D9\u05D9\u05D1 \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05DB\u05E4\u05DC\u05D4 \u05E9\u05DC ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "\u05DE\u05E4\u05EA\u05D7"
                .concat(
                  issue.keys.length > 1 ? "\u05D5\u05EA" : "",
                  " \u05DC\u05D0 \u05DE\u05D6\u05D5\u05D4",
                )
                .concat(issue.keys.length > 1 ? "\u05D9\u05DD" : "\u05D4", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key": {
              return "\u05E9\u05D3\u05D4 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1\u05D0\u05D5\u05D1\u05D9\u05D9\u05E7\u05D8";
            }
            case "invalid_union":
              return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF";
            case "invalid_element": {
              const place = withDefinite(issue.origin ?? "array");
              return "\u05E2\u05E8\u05DA \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF \u05D1".concat(
                place,
              );
            }
            default:
              return "\u05E7\u05DC\u05D8 \u05DC\u05D0 \u05EA\u05E7\u05D9\u05DF";
          }
        };
      };
      function he() {
        return {
          localeError: he_error(),
        };
      }
      const hi_error = () => {
        const Sizable = {
          string: {
            unit: "\u0905\u0915\u094D\u0937\u0930",
            verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
          },
          file: {
            unit: "\u092C\u093E\u0907\u091F\u094D\u0938",
            verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
          },
          array: {
            unit: "\u0924\u0924\u094D\u0935",
            verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
          },
          set: {
            unit: "\u0924\u0924\u094D\u0935",
            verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
          },
          map: {
            unit: "\u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F\u092F\u093E\u0901",
            verb: "\u0930\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0907\u0928\u092A\u0941\u091F",
          email: "\u0908\u092E\u0947\u0932 \u092A\u0924\u093E",
          url: "URL",
          emoji: "\u0907\u092E\u094B\u091C\u0940",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "ISO \u0924\u093F\u0925\u093F \u0914\u0930 \u0938\u092E\u092F",
          date: "ISO \u0924\u093F\u0925\u093F",
          time: "ISO \u0938\u092E\u092F",
          duration: "ISO \u0905\u0935\u0927\u093F",
          ipv4: "IPv4 \u092A\u0924\u093E",
          ipv6: "IPv6 \u092A\u0924\u093E",
          mac: "MAC \u092A\u0924\u093E",
          cidrv4: "IPv4 \u0936\u094D\u0930\u0947\u0923\u0940",
          cidrv6: "IPv6 \u0936\u094D\u0930\u0947\u0923\u0940",
          base64:
            "Base64-\u090F\u0928\u094D\u0915\u094B\u0921\u0947\u0921 \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917",
          base64url:
            "Base64URL-\u090F\u0928\u094D\u0915\u094B\u0921\u0947\u0921 \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917",
          json_string: "JSON \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917",
          e164: "E.164 \u0938\u0902\u0916\u094D\u092F\u093E",
          credit_card:
            "\u0915\u094D\u0930\u0947\u0921\u093F\u091F \u0915\u093E\u0930\u094D\u0921 \u0938\u0902\u0916\u094D\u092F\u093E",
          jwt: "JWT",
          template_literal: "\u0907\u0928\u092A\u0941\u091F",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 "
                .concat(
                  expected,
                  ", \u092A\u094D\u0930\u093E\u092A\u094D\u0924 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0935\u093F\u0915\u0932\u094D\u092A: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u092E\u093E\u0928\u094B\u0902 \u092E\u0947\u0902 \u0938\u0947 \u090F\u0915 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u092C\u0939\u0941\u0924 \u092C\u0921\u093C\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F "
                  .concat(
                    issue.origin ?? "\u092E\u093E\u0928",
                    " \u092E\u0947\u0902 ",
                  )
                  .concat(adj)
                  .concat(issue.maximum, " ")
                  .concat(sizing.unit, " \u0939\u094B\u0902");
              return "\u092C\u0939\u0941\u0924 \u092C\u0921\u093C\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F "
                .concat(issue.origin ?? "\u092E\u093E\u0928", " ")
                .concat(adj)
                .concat(issue.maximum, " \u0939\u094B");
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u092C\u0939\u0941\u0924 \u091B\u094B\u091F\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F "
                  .concat(issue.origin, " \u092E\u0947\u0902 ")
                  .concat(adj)
                  .concat(issue.minimum, " ")
                  .concat(sizing.unit, " \u0939\u094B\u0902");
              return "\u092C\u0939\u0941\u0924 \u091B\u094B\u091F\u093E: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u0925\u093E \u0915\u093F "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(issue.minimum, " \u0939\u094B");
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: "'.concat(
                  _issue.prefix,
                  '" \u0938\u0947 \u0936\u0941\u0930\u0942 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F',
                );
              if (_issue.format === "ends_with")
                return '\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: "'.concat(
                  _issue.suffix,
                  '" \u092A\u0930 \u0938\u092E\u093E\u092A\u094D\u0924 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F',
                );
              if (_issue.format === "includes")
                return '\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: \u0907\u0938\u092E\u0947\u0902 "'.concat(
                  _issue.includes,
                  '" \u0936\u093E\u092E\u093F\u0932 \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F',
                );
              if (_issue.format === "regex")
                return "\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0902\u0917: \u092A\u0948\u091F\u0930\u094D\u0928 ".concat(
                  _issue.pattern,
                  " \u0938\u0947 \u092E\u0947\u0932 \u0916\u093E\u0928\u093E \u091A\u093E\u0939\u093F\u090F",
                );
              return "\u0905\u092E\u093E\u0928\u094D\u092F ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u0902\u0916\u094D\u092F\u093E: \u092F\u0939 ".concat(
                issue.divisor,
                " \u0915\u093E \u0917\u0941\u0923\u091C \u0939\u094B\u0928\u093E \u091A\u093E\u0939\u093F\u090F",
              );
            case "unrecognized_keys":
              return "\u0905\u092A\u0930\u093F\u091A\u093F\u0924 \u0915\u0941\u0902\u091C\u0940"
                .concat(issue.keys.length > 1 ? "\u092F\u093E\u0901" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0915\u0941\u0902\u091C\u0940: ".concat(
                issue.origin,
                " \u092E\u0947\u0902",
              );
            case "invalid_union":
              if (
                issue.options &&
                Array.isArray(issue.options) &&
                issue.options.length > 0
              ) {
                const opts = issue.options
                  .map((o) => "'".concat(o, "'"))
                  .join(" | ");
                return "\u0905\u092E\u093E\u0928\u094D\u092F \u0921\u093F\u0938\u094D\u0915\u094D\u0930\u093F\u092E\u093F\u0928\u0947\u091F\u0930 \u092E\u093E\u0928: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ".concat(
                  opts,
                );
              }
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
            case "invalid_element":
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u092E\u093E\u0928: ".concat(
                issue.origin,
                " \u092E\u0947\u0902",
              );
            default:
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
          }
        };
      };
      function hi() {
        return {
          localeError: hi_error(),
        };
      }
      const hr_error = () => {
        const Sizable = {
          string: { unit: "znakova", verb: "imati" },
          file: { unit: "bajtova", verb: "imati" },
          array: { unit: "stavki", verb: "imati" },
          set: { unit: "stavki", verb: "imati" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "unos",
          email: "email adresa",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO datum i vrijeme",
          date: "ISO datum",
          time: "ISO vrijeme",
          duration: "ISO trajanje",
          ipv4: "IPv4 adresa",
          ipv6: "IPv6 adresa",
          mac: "MAC adresa",
          cidrv4: "IPv4 raspon",
          cidrv6: "IPv6 raspon",
          base64: "base64 kodirani tekst",
          base64url: "base64url kodirani tekst",
          json_string: "JSON tekst",
          e164: "E.164 broj",
          credit_card: "broj kreditne kartice",
          jwt: "JWT",
          template_literal: "unos",
        };
        const TypeDictionary = {
          nan: "NaN",
          string: "tekst",
          number: "broj",
          boolean: "boolean",
          array: "niz",
          object: "objekt",
          set: "skup",
          file: "datoteka",
          date: "datum",
          bigint: "bigint",
          symbol: "simbol",
          undefined: "undefined",
          null: "null",
          function: "funkcija",
          map: "mapa",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Neispravan unos: o\u010Dekuje se instanceof "
                  .concat(issue.expected, ", a primljeno je ")
                  .concat(received);
              }
              return "Neispravan unos: o\u010Dekuje se "
                .concat(expected, ", a primljeno je ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Neispravna vrijednost: o\u010Dekivano ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Neispravna opcija: o\u010Dekivano jedno od ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              const origin = TypeDictionary[issue.origin] ?? issue.origin;
              if (sizing)
                return "Preveliko: o\u010Dekivano da "
                  .concat(origin ?? "vrijednost", " ima ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elemenata");
              return "Preveliko: o\u010Dekivano da "
                .concat(origin ?? "vrijednost", " bude ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              const origin = TypeDictionary[issue.origin] ?? issue.origin;
              if (sizing) {
                return "Premalo: o\u010Dekivano da "
                  .concat(origin, " ima ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Premalo: o\u010Dekivano da "
                .concat(origin, " bude ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Neispravan tekst: mora zapo\u010Dinjati s "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Neispravan tekst: mora zavr\u0161avati s "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Neispravan tekst: mora sadr\u017Eavati "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Neispravan tekst: mora odgovarati uzorku ".concat(
                  _issue.pattern,
                );
              return "Neispravna ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Neispravan broj: mora biti vi\u0161ekratnik od ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Neprepoznat"
                .concat(
                  issue.keys.length > 1 ? "i klju\u010Devi" : " klju\u010D",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Neispravan klju\u010D u ".concat(
                TypeDictionary[issue.origin] ?? issue.origin,
              );
            case "invalid_union":
              return "Neispravan unos";
            case "invalid_element":
              return "Neispravna vrijednost u ".concat(
                TypeDictionary[issue.origin] ?? issue.origin,
              );
            default:
              return "Neispravan unos";
          }
        };
      };
      function hr() {
        return {
          localeError: hr_error(),
        };
      }
      const hu_error = () => {
        const Sizable = {
          string: { unit: "karakter", verb: "legyen" },
          file: { unit: "byte", verb: "legyen" },
          array: { unit: "elem", verb: "legyen" },
          set: { unit: "elem", verb: "legyen" },
          map: { unit: "elem", verb: "legyen" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "bemenet",
          email: "email c\xEDm",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO id\u0151b\xE9lyeg",
          date: "ISO d\xE1tum",
          time: "ISO id\u0151",
          duration: "ISO id\u0151intervallum",
          ipv4: "IPv4 c\xEDm",
          ipv6: "IPv6 c\xEDm",
          mac: "MAC c\xEDm",
          cidrv4: "IPv4 tartom\xE1ny",
          cidrv6: "IPv6 tartom\xE1ny",
          base64: "base64-k\xF3dolt string",
          base64url: "base64url-k\xF3dolt string",
          json_string: "JSON string",
          e164: "E.164 sz\xE1m",
          credit_card: "hitelk\xE1rtyasz\xE1m",
          jwt: "JWT",
          template_literal: "bemenet",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "sz\xE1m",
          array: "t\xF6mb",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k instanceof "
                  .concat(issue.expected, ", a kapott \xE9rt\xE9k ")
                  .concat(received);
              }
              return "\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k "
                .concat(expected, ", a kapott \xE9rt\xE9k ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\xC9rv\xE9nytelen opci\xF3: valamelyik \xE9rt\xE9k v\xE1rt ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "T\xFAl nagy: "
                  .concat(
                    issue.origin ?? "\xE9rt\xE9k",
                    " m\xE9rete t\xFAl nagy ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elem");
              return "T\xFAl nagy: a bemeneti \xE9rt\xE9k "
                .concat(issue.origin ?? "\xE9rt\xE9k", " t\xFAl nagy: ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "T\xFAl kicsi: a bemeneti \xE9rt\xE9k "
                  .concat(issue.origin, " m\xE9rete t\xFAl kicsi ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "T\xFAl kicsi: a bemeneti \xE9rt\xE9k "
                .concat(issue.origin, " t\xFAl kicsi ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\xC9rv\xE9nytelen string: "'.concat(
                  _issue.prefix,
                  '" \xE9rt\xE9kkel kell kezd\u0151dnie',
                );
              if (_issue.format === "ends_with")
                return '\xC9rv\xE9nytelen string: "'.concat(
                  _issue.suffix,
                  '" \xE9rt\xE9kkel kell v\xE9gz\u0151dnie',
                );
              if (_issue.format === "includes")
                return '\xC9rv\xE9nytelen string: "'.concat(
                  _issue.includes,
                  '" \xE9rt\xE9ket kell tartalmaznia',
                );
              if (_issue.format === "regex")
                return "\xC9rv\xE9nytelen string: ".concat(
                  _issue.pattern,
                  " mint\xE1nak kell megfelelnie",
                );
              return "\xC9rv\xE9nytelen ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\xC9rv\xE9nytelen sz\xE1m: ".concat(
                issue.divisor,
                " t\xF6bbsz\xF6r\xF6s\xE9nek kell lennie",
              );
            case "unrecognized_keys":
              return "Ismeretlen kulcs"
                .concat(issue.keys.length > 1 ? "s" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\xC9rv\xE9nytelen kulcs ".concat(issue.origin);
            case "invalid_union":
              return "\xC9rv\xE9nytelen bemenet";
            case "invalid_element":
              return "\xC9rv\xE9nytelen \xE9rt\xE9k: ".concat(issue.origin);
            default:
              return "\xC9rv\xE9nytelen bemenet";
          }
        };
      };
      function hu() {
        return {
          localeError: hu_error(),
        };
      }
      function getArmenianPlural(count, one, many) {
        return Math.abs(count) === 1 ? one : many;
      }
      function withDefiniteArticle(word) {
        if (!word) return "";
        const vowels = [
          "\u0561",
          "\u0565",
          "\u0568",
          "\u056B",
          "\u0578",
          "\u0578\u0582",
          "\u0585",
        ];
        const lastChar = word[word.length - 1];
        return word + (vowels.includes(lastChar) ? "\u0576" : "\u0568");
      }
      const hy_error = () => {
        const Sizable = {
          string: {
            unit: {
              one: "\u0576\u0577\u0561\u0576",
              many: "\u0576\u0577\u0561\u0576\u0576\u0565\u0580",
            },
            verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
          },
          file: {
            unit: {
              one: "\u0562\u0561\u0575\u0569",
              many: "\u0562\u0561\u0575\u0569\u0565\u0580",
            },
            verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
          },
          array: {
            unit: {
              one: "\u057F\u0561\u0580\u0580",
              many: "\u057F\u0561\u0580\u0580\u0565\u0580",
            },
            verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
          },
          set: {
            unit: {
              one: "\u057F\u0561\u0580\u0580",
              many: "\u057F\u0561\u0580\u0580\u0565\u0580",
            },
            verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
          },
          map: {
            unit: {
              one: "\u057F\u0561\u0580\u0580",
              many: "\u057F\u0561\u0580\u0580\u0565\u0580",
            },
            verb: "\u0578\u0582\u0576\u0565\u0576\u0561\u056C",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0574\u0578\u0582\u057F\u0584",
          email: "\u0567\u056C. \u0570\u0561\u057D\u0581\u0565",
          url: "URL",
          emoji: "\u0567\u0574\u0578\u057B\u056B",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "ISO \u0561\u0574\u057D\u0561\u0569\u056B\u057E \u0587 \u056A\u0561\u0574",
          date: "ISO \u0561\u0574\u057D\u0561\u0569\u056B\u057E",
          time: "ISO \u056A\u0561\u0574",
          duration:
            "ISO \u057F\u0587\u0578\u0572\u0578\u0582\u0569\u0575\u0578\u0582\u0576",
          ipv4: "IPv4 \u0570\u0561\u057D\u0581\u0565",
          ipv6: "IPv6 \u0570\u0561\u057D\u0581\u0565",
          mac: "MAC \u0570\u0561\u057D\u0581\u0565",
          cidrv4: "IPv4 \u0574\u056B\u057B\u0561\u056F\u0561\u0575\u0584",
          cidrv6: "IPv6 \u0574\u056B\u057B\u0561\u056F\u0561\u0575\u0584",
          base64:
            "base64 \u0571\u0587\u0561\u0579\u0561\u0583\u0578\u057E \u057F\u0578\u0572",
          base64url:
            "base64url \u0571\u0587\u0561\u0579\u0561\u0583\u0578\u057E \u057F\u0578\u0572",
          json_string: "JSON \u057F\u0578\u0572",
          e164: "E.164 \u0570\u0561\u0574\u0561\u0580",
          credit_card:
            "\u056F\u0580\u0565\u0564\u056B\u057F \u0584\u0561\u0580\u057F\u056B \u0570\u0561\u0574\u0561\u0580",
          jwt: "JWT",
          template_literal: "\u0574\u0578\u0582\u057F\u0584",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u0569\u056B\u057E",
          array: "\u0566\u0561\u0576\u0563\u057E\u0561\u056E",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 instanceof "
                  .concat(
                    issue.expected,
                    ", \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ",
                  )
                  .concat(received);
              }
              return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 "
                .concat(
                  expected,
                  ", \u057D\u057F\u0561\u0581\u057E\u0565\u056C \u0567 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 ".concat(
                  util.stringifyPrimitive(issue.values[1]),
                );
              return "\u054D\u056D\u0561\u056C \u057F\u0561\u0580\u0562\u0565\u0580\u0561\u056F\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567\u0580 \u0570\u0565\u057F\u0587\u0575\u0561\u056C\u0576\u0565\u0580\u056B\u0581 \u0574\u0565\u056F\u0568\u055D ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                const maxValue = Number(issue.maximum);
                const unit = getArmenianPlural(
                  maxValue,
                  sizing.unit.one,
                  sizing.unit.many,
                );
                return "\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 "
                  .concat(
                    withDefiniteArticle(
                      issue.origin ?? "\u0561\u0580\u056A\u0565\u0584",
                    ),
                    " \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(unit);
              }
              return "\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0574\u0565\u056E \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 "
                .concat(
                  withDefiniteArticle(
                    issue.origin ?? "\u0561\u0580\u056A\u0565\u0584",
                  ),
                  " \u056C\u056B\u0576\u056B ",
                )
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                const minValue = Number(issue.minimum);
                const unit = getArmenianPlural(
                  minValue,
                  sizing.unit.one,
                  sizing.unit.many,
                );
                return "\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 "
                  .concat(
                    withDefiniteArticle(issue.origin),
                    " \u056F\u0578\u0582\u0576\u0565\u0576\u0561 ",
                  )
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(unit);
              }
              return "\u0549\u0561\u0583\u0561\u0566\u0561\u0576\u0581 \u0583\u0578\u0584\u0580 \u0561\u0580\u056A\u0565\u0584\u2024 \u057D\u057A\u0561\u057D\u057E\u0578\u0582\u0574 \u0567, \u0578\u0580 "
                .concat(
                  withDefiniteArticle(issue.origin),
                  " \u056C\u056B\u0576\u056B ",
                )
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057D\u056F\u057D\u057E\u056B "'.concat(
                  _issue.prefix,
                  '"-\u0578\u057E',
                );
              if (_issue.format === "ends_with")
                return '\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0561\u057E\u0561\u0580\u057F\u057E\u056B "'.concat(
                  _issue.suffix,
                  '"-\u0578\u057E',
                );
              if (_issue.format === "includes")
                return '\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u057A\u0561\u0580\u0578\u0582\u0576\u0561\u056F\u056B "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u054D\u056D\u0561\u056C \u057F\u0578\u0572\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0570\u0561\u0574\u0561\u057A\u0561\u057F\u0561\u057D\u056D\u0561\u0576\u056B ".concat(
                  _issue.pattern,
                  " \u0571\u0587\u0561\u0579\u0561\u0583\u056B\u0576",
                );
              return "\u054D\u056D\u0561\u056C ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u054D\u056D\u0561\u056C \u0569\u056B\u057E\u2024 \u057A\u0565\u057F\u0584 \u0567 \u0562\u0561\u0566\u0574\u0561\u057A\u0561\u057F\u056B\u056F \u056C\u056B\u0576\u056B ".concat(
                issue.divisor,
                "-\u056B",
              );
            case "unrecognized_keys":
              return "\u0549\u0573\u0561\u0576\u0561\u0579\u057E\u0561\u056E \u0562\u0561\u0576\u0561\u056C\u056B"
                .concat(issue.keys.length > 1 ? "\u0576\u0565\u0580" : "", ". ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u054D\u056D\u0561\u056C \u0562\u0561\u0576\u0561\u056C\u056B ".concat(
                withDefiniteArticle(issue.origin),
                "-\u0578\u0582\u0574",
              );
            case "invalid_union":
              return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574";
            case "invalid_element":
              return "\u054D\u056D\u0561\u056C \u0561\u0580\u056A\u0565\u0584 ".concat(
                withDefiniteArticle(issue.origin),
                "-\u0578\u0582\u0574",
              );
            default:
              return "\u054D\u056D\u0561\u056C \u0574\u0578\u0582\u057F\u0584\u0561\u0563\u0580\u0578\u0582\u0574";
          }
        };
      };
      function hy() {
        return {
          localeError: hy_error(),
        };
      }
      const id_error = () => {
        const Sizable = {
          string: { unit: "karakter", verb: "memiliki" },
          file: { unit: "byte", verb: "memiliki" },
          array: { unit: "item", verb: "memiliki" },
          set: { unit: "item", verb: "memiliki" },
          map: { unit: "item", verb: "memiliki" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "input",
          email: "alamat email",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "tanggal dan waktu format ISO",
          date: "tanggal format ISO",
          time: "jam format ISO",
          duration: "durasi format ISO",
          ipv4: "alamat IPv4",
          ipv6: "alamat IPv6",
          mac: "alamat MAC",
          cidrv4: "rentang alamat IPv4",
          cidrv6: "rentang alamat IPv6",
          base64: "string dengan enkode base64",
          base64url: "string dengan enkode base64url",
          json_string: "string JSON",
          e164: "angka E.164",
          credit_card: "nomor kartu kredit",
          jwt: "JWT",
          template_literal: "input",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Input tidak valid: diharapkan instanceof "
                  .concat(issue.expected, ", diterima ")
                  .concat(received);
              }
              return "Input tidak valid: diharapkan "
                .concat(expected, ", diterima ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Input tidak valid: diharapkan ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Pilihan tidak valid: diharapkan salah satu dari ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Terlalu besar: diharapkan "
                  .concat(issue.origin ?? "value", " memiliki ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elemen");
              return "Terlalu besar: diharapkan "
                .concat(issue.origin ?? "value", " menjadi ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Terlalu kecil: diharapkan "
                  .concat(issue.origin, " memiliki ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Terlalu kecil: diharapkan "
                .concat(issue.origin, " menjadi ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'String tidak valid: harus dimulai dengan "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'String tidak valid: harus berakhir dengan "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'String tidak valid: harus menyertakan "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "String tidak valid: harus sesuai pola ".concat(
                  _issue.pattern,
                );
              return "".concat(
                FormatDictionary[_issue.format] ?? issue.format,
                " tidak valid",
              );
            }
            case "not_multiple_of":
              return "Angka tidak valid: harus kelipatan dari ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Kunci tidak dikenali "
                .concat(issue.keys.length > 1 ? "s" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Kunci tidak valid di ".concat(issue.origin);
            case "invalid_union":
              return "Input tidak valid";
            case "invalid_element":
              return "Nilai tidak valid di ".concat(issue.origin);
            default:
              return "Input tidak valid";
          }
        };
      };
      function id() {
        return {
          localeError: id_error(),
        };
      }
      const is_error = () => {
        const Sizable = {
          string: { unit: "stafi", verb: "a\xF0 hafa" },
          file: { unit: "b\xE6ti", verb: "a\xF0 hafa" },
          array: { unit: "hluti", verb: "a\xF0 hafa" },
          set: { unit: "hluti", verb: "a\xF0 hafa" },
          map: { unit: "hluti", verb: "a\xF0 hafa" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "gildi",
          email: "netfang",
          url: "vefsl\xF3\xF0",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO dagsetning og t\xEDmi",
          date: "ISO dagsetning",
          time: "ISO t\xEDmi",
          duration: "ISO t\xEDmalengd",
          ipv4: "IPv4 address",
          ipv6: "IPv6 address",
          mac: "MAC address",
          cidrv4: "IPv4 range",
          cidrv6: "IPv6 range",
          base64: "base64-encoded strengur",
          base64url: "base64url-encoded strengur",
          json_string: "JSON strengur",
          e164: "E.164 t\xF6lugildi",
          credit_card: "kreditkortan\xFAmer",
          jwt: "JWT",
          template_literal: "gildi",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "n\xFAmer",
          array: "fylki",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Rangt gildi: \xDE\xFA sl\xF3st inn "
                  .concat(received, " \xFEar sem \xE1 a\xF0 vera instanceof ")
                  .concat(issue.expected);
              }
              return "Rangt gildi: \xDE\xFA sl\xF3st inn "
                .concat(received, " \xFEar sem \xE1 a\xF0 vera ")
                .concat(expected);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Rangt gildi: gert r\xE1\xF0 fyrir ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\xD3gilt val: m\xE1 vera eitt af eftirfarandi ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 "
                  .concat(issue.origin ?? "gildi", " hafi ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "hluti");
              return "Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 "
                .concat(issue.origin ?? "gildi", " s\xE9 ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 "
                  .concat(issue.origin, " hafi ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 "
                .concat(issue.origin, " s\xE9 ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\xD3gildur strengur: ver\xF0ur a\xF0 byrja \xE1 "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return '\xD3gildur strengur: ver\xF0ur a\xF0 enda \xE1 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\xD3gildur strengur: ver\xF0ur a\xF0 innihalda "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\xD3gildur strengur: ver\xF0ur a\xF0 fylgja mynstri ".concat(
                  _issue.pattern,
                );
              return "Rangt ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "R\xF6ng tala: ver\xF0ur a\xF0 vera margfeldi af ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "\xD3\xFEekkt "
                .concat(issue.keys.length > 1 ? "ir lyklar" : "ur lykill", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Rangur lykill \xED ".concat(issue.origin);
            case "invalid_union":
              return "Rangt gildi";
            case "invalid_element":
              return "Rangt gildi \xED ".concat(issue.origin);
            default:
              return "Rangt gildi";
          }
        };
      };
      function is() {
        return {
          localeError: is_error(),
        };
      }
      const it_error = () => {
        const Sizable = {
          string: { unit: "caratteri", verb: "avere" },
          file: { unit: "byte", verb: "avere" },
          array: { unit: "elementi", verb: "avere" },
          set: { unit: "elementi", verb: "avere" },
          map: { unit: "elementi", verb: "avere" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "input",
          email: "indirizzo email",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "data e ora ISO",
          date: "data ISO",
          time: "ora ISO",
          duration: "durata ISO",
          ipv4: "indirizzo IPv4",
          ipv6: "indirizzo IPv6",
          mac: "indirizzo MAC",
          cidrv4: "intervallo IPv4",
          cidrv6: "intervallo IPv6",
          base64: "stringa codificata in base64",
          base64url: "URL codificata in base64",
          json_string: "stringa JSON",
          e164: "numero E.164",
          credit_card: "numero di carta di credito",
          jwt: "JWT",
          template_literal: "input",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "numero",
          array: "vettore",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Input non valido: atteso instanceof "
                  .concat(issue.expected, ", ricevuto ")
                  .concat(received);
              }
              return "Input non valido: atteso "
                .concat(expected, ", ricevuto ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Input non valido: atteso ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Opzione non valida: atteso uno tra ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Troppo grande: "
                  .concat(issue.origin ?? "valore", " deve avere ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elementi");
              return "Troppo grande: "
                .concat(issue.origin ?? "valore", " deve essere ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Troppo piccolo: "
                  .concat(issue.origin, " deve avere ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Troppo piccolo: "
                .concat(issue.origin, " deve essere ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Stringa non valida: deve iniziare con "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Stringa non valida: deve terminare con "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Stringa non valida: deve includere "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Stringa non valida: deve corrispondere al pattern ".concat(
                  _issue.pattern,
                );
              return "Input non valido: ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Numero non valido: deve essere un multiplo di ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Chiav"
                .concat(issue.keys.length > 1 ? "i" : "e", " non riconosciut")
                .concat(issue.keys.length > 1 ? "e" : "a", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Chiave non valida in ".concat(issue.origin);
            case "invalid_union":
              return "Input non valido";
            case "invalid_element":
              return "Valore non valido in ".concat(issue.origin);
            default:
              return "Input non valido";
          }
        };
      };
      function it() {
        return {
          localeError: it_error(),
        };
      }
      const ja_error = () => {
        const Sizable = {
          string: { unit: "\u6587\u5B57", verb: "\u3067\u3042\u308B" },
          file: { unit: "\u30D0\u30A4\u30C8", verb: "\u3067\u3042\u308B" },
          array: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" },
          set: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" },
          map: { unit: "\u8981\u7D20", verb: "\u3067\u3042\u308B" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u5165\u529B\u5024",
          email: "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9",
          url: "URL",
          emoji: "\u7D75\u6587\u5B57",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO\u65E5\u6642",
          date: "ISO\u65E5\u4ED8",
          time: "ISO\u6642\u523B",
          duration: "ISO\u671F\u9593",
          ipv4: "IPv4\u30A2\u30C9\u30EC\u30B9",
          ipv6: "IPv6\u30A2\u30C9\u30EC\u30B9",
          mac: "MAC\u30A2\u30C9\u30EC\u30B9",
          cidrv4: "IPv4\u7BC4\u56F2",
          cidrv6: "IPv6\u7BC4\u56F2",
          base64: "base64\u30A8\u30F3\u30B3\u30FC\u30C9\u6587\u5B57\u5217",
          base64url:
            "base64url\u30A8\u30F3\u30B3\u30FC\u30C9\u6587\u5B57\u5217",
          json_string: "JSON\u6587\u5B57\u5217",
          e164: "E.164\u756A\u53F7",
          credit_card:
            "\u30AF\u30EC\u30B8\u30C3\u30C8\u30AB\u30FC\u30C9\u756A\u53F7",
          jwt: "JWT",
          template_literal: "\u5165\u529B\u5024",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u6570\u5024",
          array: "\u914D\u5217",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u7121\u52B9\u306A\u5165\u529B: instanceof "
                  .concat(
                    issue.expected,
                    "\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001",
                  )
                  .concat(
                    received,
                    "\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F",
                  );
              }
              return "\u7121\u52B9\u306A\u5165\u529B: "
                .concat(
                  expected,
                  "\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F\u304C\u3001",
                )
                .concat(
                  received,
                  "\u304C\u5165\u529B\u3055\u308C\u307E\u3057\u305F",
                );
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u7121\u52B9\u306A\u5165\u529B: ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                  "\u304C\u671F\u5F85\u3055\u308C\u307E\u3057\u305F",
                );
              return "\u7121\u52B9\u306A\u9078\u629E: ".concat(
                util.joinValues(issue.values, "\u3001"),
                "\u306E\u3044\u305A\u308C\u304B\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059",
              );
            case "too_big": {
              const adj = issue.inclusive
                ? "\u4EE5\u4E0B\u3067\u3042\u308B"
                : "\u3088\u308A\u5C0F\u3055\u3044";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u5927\u304D\u3059\u304E\u308B\u5024: "
                  .concat(issue.origin ?? "\u5024", "\u306F")
                  .concat(issue.maximum.toString())
                  .concat(sizing.unit ?? "\u8981\u7D20")
                  .concat(adj, "\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059");
              return "\u5927\u304D\u3059\u304E\u308B\u5024: "
                .concat(issue.origin ?? "\u5024", "\u306F")
                .concat(issue.maximum.toString())
                .concat(adj, "\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059");
            }
            case "too_small": {
              const adj = issue.inclusive
                ? "\u4EE5\u4E0A\u3067\u3042\u308B"
                : "\u3088\u308A\u5927\u304D\u3044";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u5C0F\u3055\u3059\u304E\u308B\u5024: "
                  .concat(issue.origin, "\u306F")
                  .concat(issue.minimum.toString())
                  .concat(sizing.unit)
                  .concat(adj, "\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059");
              return "\u5C0F\u3055\u3059\u304E\u308B\u5024: "
                .concat(issue.origin, "\u306F")
                .concat(issue.minimum.toString())
                .concat(adj, "\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059");
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u7121\u52B9\u306A\u6587\u5B57\u5217: "'.concat(
                  _issue.prefix,
                  '"\u3067\u59CB\u307E\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059',
                );
              if (_issue.format === "ends_with")
                return '\u7121\u52B9\u306A\u6587\u5B57\u5217: "'.concat(
                  _issue.suffix,
                  '"\u3067\u7D42\u308F\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059',
                );
              if (_issue.format === "includes")
                return '\u7121\u52B9\u306A\u6587\u5B57\u5217: "'.concat(
                  _issue.includes,
                  '"\u3092\u542B\u3080\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059',
                );
              if (_issue.format === "regex")
                return "\u7121\u52B9\u306A\u6587\u5B57\u5217: \u30D1\u30BF\u30FC\u30F3".concat(
                  _issue.pattern,
                  "\u306B\u4E00\u81F4\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059",
                );
              return "\u7121\u52B9\u306A".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u7121\u52B9\u306A\u6570\u5024: ".concat(
                issue.divisor,
                "\u306E\u500D\u6570\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059",
              );
            case "unrecognized_keys":
              return "\u8A8D\u8B58\u3055\u308C\u3066\u3044\u306A\u3044\u30AD\u30FC"
                .concat(issue.keys.length > 1 ? "\u7FA4" : "", ": ")
                .concat(util.joinValues(issue.keys, "\u3001"));
            case "invalid_key":
              return "".concat(
                issue.origin,
                "\u5185\u306E\u7121\u52B9\u306A\u30AD\u30FC",
              );
            case "invalid_union":
              return "\u7121\u52B9\u306A\u5165\u529B";
            case "invalid_element":
              return "".concat(
                issue.origin,
                "\u5185\u306E\u7121\u52B9\u306A\u5024",
              );
            default:
              return "\u7121\u52B9\u306A\u5165\u529B";
          }
        };
      };
      function ja() {
        return {
          localeError: ja_error(),
        };
      }
      const ka_error = () => {
        const Sizable = {
          string: {
            unit: "\u10E1\u10D8\u10DB\u10D1\u10DD\u10DA\u10DD",
            verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
          },
          file: {
            unit: "\u10D1\u10D0\u10D8\u10E2\u10D8",
            verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
          },
          array: {
            unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8",
            verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
          },
          set: {
            unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8",
            verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
          },
          map: {
            unit: "\u10D4\u10DA\u10D4\u10DB\u10D4\u10DC\u10E2\u10D8",
            verb: "\u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0",
          email:
            "\u10D4\u10DA-\u10E4\u10DD\u10E1\u10E2\u10D8\u10E1 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
          url: "URL",
          emoji: "\u10D4\u10DB\u10DD\u10EF\u10D8",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "\u10D7\u10D0\u10E0\u10D8\u10E6\u10D8-\u10D3\u10E0\u10DD",
          date: "\u10D7\u10D0\u10E0\u10D8\u10E6\u10D8",
          time: "\u10D3\u10E0\u10DD",
          duration:
            "\u10EE\u10D0\u10DC\u10D2\u10E0\u10EB\u10DA\u10D8\u10D5\u10DD\u10D1\u10D0",
          ipv4: "IPv4 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
          ipv6: "IPv6 \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
          mac: "MAC \u10DB\u10D8\u10E1\u10D0\u10DB\u10D0\u10E0\u10D7\u10D8",
          cidrv4: "IPv4 \u10D3\u10D8\u10D0\u10DE\u10D0\u10D6\u10DD\u10DC\u10D8",
          cidrv6: "IPv6 \u10D3\u10D8\u10D0\u10DE\u10D0\u10D6\u10DD\u10DC\u10D8",
          base64:
            "base64-\u10D9\u10DD\u10D3\u10D8\u10E0\u10D4\u10D1\u10E3\u10DA\u10D8 \u10D5\u10D4\u10DA\u10D8",
          base64url:
            "base64url-\u10D9\u10DD\u10D3\u10D8\u10E0\u10D4\u10D1\u10E3\u10DA\u10D8 \u10D5\u10D4\u10DA\u10D8",
          json_string: "JSON \u10D5\u10D4\u10DA\u10D8",
          e164: "E.164 \u10DC\u10DD\u10DB\u10D4\u10E0\u10D8",
          credit_card:
            "\u10E1\u10D0\u10D9\u10E0\u10D4\u10D3\u10D8\u10E2\u10DD \u10D1\u10D0\u10E0\u10D0\u10D7\u10D8\u10E1 \u10DC\u10DD\u10DB\u10D4\u10E0\u10D8",
          jwt: "JWT",
          template_literal: "\u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u10E0\u10D8\u10EA\u10EE\u10D5\u10D8",
          string: "\u10D5\u10D4\u10DA\u10D8",
          boolean: "\u10D1\u10E3\u10DA\u10D4\u10D0\u10DC\u10D8",
          function: "\u10E4\u10E3\u10DC\u10E5\u10EA\u10D8\u10D0",
          array: "\u10DB\u10D0\u10E1\u10D8\u10D5\u10D8",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 instanceof "
                  .concat(
                    issue.expected,
                    ", \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ",
                  )
                  .concat(received);
              }
              return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 "
                .concat(
                  expected,
                  ", \u10DB\u10D8\u10E6\u10D4\u10D1\u10E3\u10DA\u10D8 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D0\u10E0\u10D8\u10D0\u10DC\u10E2\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8\u10D0 \u10D4\u10E0\u10D7-\u10D4\u10E0\u10D7\u10D8 ".concat(
                util.joinValues(issue.values, "|"),
                "-\u10D3\u10D0\u10DC",
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10D3\u10D8\u10D3\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 "
                  .concat(
                    issue.origin ??
                      "\u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0",
                    " ",
                  )
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit);
              return "\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10D3\u10D8\u10D3\u10D8: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 "
                .concat(
                  issue.origin ??
                    "\u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0",
                  " \u10D8\u10E7\u10DD\u10E1 ",
                )
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10DE\u10D0\u10E2\u10D0\u10E0\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 "
                  .concat(issue.origin, " ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "\u10D6\u10D4\u10D3\u10DB\u10D4\u10E2\u10D0\u10D3 \u10DE\u10D0\u10E2\u10D0\u10E0\u10D0: \u10DB\u10DD\u10E1\u10D0\u10DA\u10DD\u10D3\u10DC\u10D4\u10DA\u10D8 "
                .concat(issue.origin, " \u10D8\u10E7\u10DD\u10E1 ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10D8\u10EC\u10E7\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 "'.concat(
                  _issue.prefix,
                  '"-\u10D8\u10D7',
                );
              }
              if (_issue.format === "ends_with")
                return '\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10DB\u10D7\u10D0\u10D5\u10E0\u10D3\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 "'.concat(
                  _issue.suffix,
                  '"-\u10D8\u10D7',
                );
              if (_issue.format === "includes")
                return '\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D8\u10EA\u10D0\u10D5\u10D3\u10D4\u10E1 "'.concat(
                  _issue.includes,
                  '"-\u10E1',
                );
              if (_issue.format === "regex")
                return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D5\u10D4\u10DA\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10E8\u10D4\u10D4\u10E1\u10D0\u10D1\u10D0\u10DB\u10D4\u10D1\u10DD\u10D3\u10D4\u10E1 \u10E8\u10D0\u10D1\u10DA\u10DD\u10DC\u10E1 ".concat(
                  _issue.pattern,
                );
              return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E0\u10D8\u10EA\u10EE\u10D5\u10D8: \u10E3\u10DC\u10D3\u10D0 \u10D8\u10E7\u10DD\u10E1 ".concat(
                issue.divisor,
                "-\u10D8\u10E1 \u10EF\u10D4\u10E0\u10D0\u10D3\u10D8",
              );
            case "unrecognized_keys":
              return "\u10E3\u10EA\u10DC\u10DD\u10D1\u10D8 \u10D2\u10D0\u10E1\u10D0\u10E6\u10D4\u10D1"
                .concat(
                  issue.keys.length > 1 ? "\u10D4\u10D1\u10D8" : "\u10D8",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10D2\u10D0\u10E1\u10D0\u10E6\u10D4\u10D1\u10D8 ".concat(
                issue.origin,
                "-\u10E8\u10D8",
              );
            case "invalid_union":
              return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0";
            case "invalid_element":
              return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10DB\u10DC\u10D8\u10E8\u10D5\u10DC\u10D4\u10DA\u10DD\u10D1\u10D0 ".concat(
                issue.origin,
                "-\u10E8\u10D8",
              );
            default:
              return "\u10D0\u10E0\u10D0\u10E1\u10EC\u10DD\u10E0\u10D8 \u10E8\u10D4\u10E7\u10D5\u10D0\u10DC\u10D0";
          }
        };
      };
      function ka() {
        return {
          localeError: ka_error(),
        };
      }
      const km_error = () => {
        const Sizable = {
          string: {
            unit: "\u178F\u17BD\u17A2\u1780\u17D2\u179F\u179A",
            verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793",
          },
          file: {
            unit: "\u1794\u17C3",
            verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793",
          },
          array: {
            unit: "\u1792\u17B6\u178F\u17BB",
            verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793",
          },
          set: {
            unit: "\u1792\u17B6\u178F\u17BB",
            verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793",
          },
          map: {
            unit: "\u1792\u17B6\u178F\u17BB",
            verb: "\u1782\u17BD\u179A\u1798\u17B6\u1793",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex:
            "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B",
          email:
            "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793\u17A2\u17CA\u17B8\u1798\u17C2\u179B",
          url: "URL",
          emoji:
            "\u179F\u1789\u17D2\u1789\u17B6\u17A2\u17B6\u179A\u1798\u17D2\u1798\u178E\u17CD",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791 \u1793\u17B7\u1784\u1798\u17C9\u17C4\u1784 ISO",
          date: "\u1780\u17B6\u179B\u1794\u179A\u17B7\u1785\u17D2\u1786\u17C1\u1791 ISO",
          time: "\u1798\u17C9\u17C4\u1784 ISO",
          duration: "\u179A\u1799\u17C8\u1796\u17C1\u179B ISO",
          ipv4: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv4",
          ipv6: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv6",
          mac: "\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 MAC",
          cidrv4:
            "\u178A\u17C2\u1793\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv4",
          cidrv6:
            "\u178A\u17C2\u1793\u17A2\u17B6\u179F\u1799\u178A\u17D2\u178B\u17B6\u1793 IPv6",
          base64:
            "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u17A2\u17CA\u17B7\u1780\u17BC\u178A base64",
          base64url:
            "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u17A2\u17CA\u17B7\u1780\u17BC\u178A base64url",
          json_string:
            "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A JSON",
          e164: "\u179B\u17C1\u1781 E.164",
          credit_card:
            "\u179B\u17C1\u1781\u1794\u17D0\u178E\u17D2\u178E\u17A5\u178E\u1791\u17B6\u1793",
          jwt: "JWT",
          template_literal:
            "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u179B\u17C1\u1781",
          array: "\u17A2\u17B6\u179A\u17C1 (Array)",
          null: "\u1782\u17D2\u1798\u17B6\u1793\u178F\u1798\u17D2\u179B\u17C3 (null)",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A instanceof "
                  .concat(
                    issue.expected,
                    " \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ",
                  )
                  .concat(received);
              }
              return "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A "
                .concat(
                  expected,
                  " \u1794\u17C9\u17BB\u1793\u17D2\u178F\u17C2\u1791\u1791\u17BD\u179B\u1794\u17B6\u1793 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1794\u1789\u17D2\u1785\u17BC\u179B\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u1787\u1798\u17D2\u179A\u17BE\u179F\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1787\u17B6\u1798\u17BD\u1799\u1780\u17D2\u1793\u17BB\u1784\u1785\u17C6\u178E\u17C4\u1798 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u1792\u17C6\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A "
                  .concat(issue.origin ?? "\u178F\u1798\u17D2\u179B\u17C3", " ")
                  .concat(adj, " ")
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "\u1792\u17B6\u178F\u17BB");
              return "\u1792\u17C6\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A "
                .concat(issue.origin ?? "\u178F\u1798\u17D2\u179B\u17C3", " ")
                .concat(adj, " ")
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u178F\u17BC\u1785\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A "
                  .concat(issue.origin, " ")
                  .concat(adj, " ")
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "\u178F\u17BC\u1785\u1796\u17C1\u1780\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1780\u17B6\u179A "
                .concat(issue.origin, " ")
                .concat(adj, " ")
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1785\u17B6\u1794\u17CB\u1795\u17D2\u178F\u17BE\u1798\u178A\u17C4\u1799 "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return '\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1794\u1789\u17D2\u1785\u1794\u17CB\u178A\u17C4\u1799 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u1798\u17B6\u1793 "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u1781\u17D2\u179F\u17C2\u17A2\u1780\u17D2\u179F\u179A\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u178F\u17C2\u1795\u17D2\u1782\u17BC\u1795\u17D2\u1782\u1784\u1793\u17B9\u1784\u1791\u1798\u17D2\u179A\u1784\u17CB\u178A\u17C2\u179B\u1794\u17B6\u1793\u1780\u17C6\u178E\u178F\u17CB ".concat(
                  _issue.pattern,
                );
              return "\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u179B\u17C1\u1781\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u17D6 \u178F\u17D2\u179A\u17BC\u179C\u178F\u17C2\u1787\u17B6\u1796\u17A0\u17BB\u1782\u17BB\u178E\u1793\u17C3 ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "\u179A\u1780\u1783\u17BE\u1789\u179F\u17C4\u1798\u17B7\u1793\u179F\u17D2\u1782\u17B6\u179B\u17CB\u17D6 ".concat(
                util.joinValues(issue.keys, ", "),
              );
            case "invalid_key":
              return "\u179F\u17C4\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u1793\u17C5\u1780\u17D2\u1793\u17BB\u1784 ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C";
            case "invalid_element":
              return "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C\u1793\u17C5\u1780\u17D2\u1793\u17BB\u1784 ".concat(
                issue.origin,
              );
            default:
              return "\u1791\u17B7\u1793\u17D2\u1793\u1793\u17D0\u1799\u1798\u17B7\u1793\u178F\u17D2\u179A\u17B9\u1798\u178F\u17D2\u179A\u17BC\u179C";
          }
        };
      };
      function km() {
        return {
          localeError: km_error(),
        };
      }
      function kh() {
        return km();
      }
      const kn_error = () => {
        const Sizable = {
          string: {
            unit: "\u0C85\u0C95\u0CCD\u0CB7\u0CB0\u0C97\u0CB3\u0CC1",
            verb: "\u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1",
          },
          file: {
            unit: "\u0CAC\u0CC8\u0C9F\u0CCD\u200C\u0C97\u0CB3\u0CC1",
            verb: "\u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1",
          },
          array: {
            unit: "\u0CB5\u0CB8\u0CCD\u0CA4\u0CC1\u0C97\u0CB3\u0CC1",
            verb: "\u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1",
          },
          set: {
            unit: "\u0CB5\u0CB8\u0CCD\u0CA4\u0CC1\u0C97\u0CB3\u0CC1",
            verb: "\u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1",
          },
          map: {
            unit: "entries",
            verb: "\u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0C87\u0CA8\u0CCD\u0CAA\u0CC1\u0C9F\u0CCD",
          email: "email \u0CB5\u0CBF\u0CB3\u0CBE\u0CB8",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "ISO \u0CA6\u0CBF\u0CA8\u0CBE\u0C82\u0C95\u0CA6 \u0CB8\u0CAE\u0CAF",
          date: "ISO \u0CA6\u0CBF\u0CA8\u0CBE\u0C82\u0C95",
          time: "ISO \u0CB8\u0CAE\u0CAF",
          duration: "ISO \u0C85\u0CB5\u0CA7\u0CBF",
          ipv4: "IPv4 \u0CB5\u0CBF\u0CB3\u0CBE\u0CB8",
          ipv6: "IPv6 \u0CB5\u0CBF\u0CB3\u0CBE\u0CB8",
          mac: "MAC \u0CB5\u0CBF\u0CB3\u0CBE\u0CB8",
          cidrv4: "IPv4 \u0CB5\u0CCD\u0CAF\u0CBE\u0CAA\u0CCD\u0CA4\u0CBF\u0CAF",
          cidrv6: "IPv6 \u0CB5\u0CCD\u0CAF\u0CBE\u0CAA\u0CCD\u0CA4\u0CBF\u0CAF",
          base64:
            "base64-encoded\u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD",
          base64url:
            "base64url-encoded\u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD",
          json_string:
            "JSON\u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD",
          e164: "E.164 \u0CB8\u0C82\u0C96\u0CCD\u0CAF\u0CC6",
          credit_card:
            "\u0C95\u0CCD\u0CB0\u0CC6\u0CA1\u0CBF\u0C9F\u0CCD \u0C95\u0CBE\u0CB0\u0CCD\u0CA1\u0CCD \u0CB8\u0C82\u0C96\u0CCD\u0CAF\u0CC6",
          jwt: "JWT",
          template_literal: "\u0C87\u0CA8\u0CCD\u0CAA\u0CC1\u0C9F\u0CCD",
        };
        const TypeDictionary = {
          // Compatibility: "nan" -> "NaN" for display
          nan: "NaN",
          // All other type names omitted - they fall back to raw values via ?? operator
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              return "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0C87\u0CA8\u0CCD\u200C\u0CAA\u0CC1\u0C9F\u0CCD: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 "
                .concat(
                  expected,
                  ", \u0CB8\u0CCD\u0CB5\u0CC0\u0C95\u0CB0\u0CBF\u0CB8\u0CBF\u0CA6\u0CA8\u0CC1 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0C87\u0CA8\u0CCD\u200C\u0CAA\u0CC1\u0C9F\u0CCD: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0C86\u0CAF\u0CCD\u0C95\u0CC6: \u0C87\u0CB5\u0CC1\u0C97\u0CB3\u0CB2\u0CCD\u0CB2\u0CBF \u0C92\u0C82\u0CA6\u0CA8\u0CCD\u0CA8\u0CC1 \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u0CA4\u0CC1\u0C82\u0CAC\u0CBE \u0CA6\u0CCA\u0CA1\u0CCD\u0CA1\u0CA6\u0CC1: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 "
                  .concat(
                    issue.origin ?? "value",
                    " \u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1 ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ?? "\u0C85\u0C82\u0CB6\u0C97\u0CB3\u0CC1",
                  );
              return "\u0CA4\u0CC1\u0C82\u0CAC\u0CBE \u0CA6\u0CCA\u0CA1\u0CCD\u0CA1\u0CA6\u0CC1: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 "
                .concat(issue.origin ?? "value", " \u0C8E\u0C82\u0CA6\u0CC1 ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0CA4\u0CC1\u0C82\u0CAC\u0CBE \u0C9A\u0CBF\u0C95\u0CCD\u0C95\u0CA6\u0CC1: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 "
                  .concat(
                    issue.origin,
                    " \u0CB9\u0CCA\u0C82\u0CA6\u0CB2\u0CC1 ",
                  )
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "\u0CA4\u0CC1\u0C82\u0CAC\u0CBE \u0C9A\u0CBF\u0C95\u0CCD\u0C95\u0CA6\u0CC1: \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 "
                .concat(issue.origin, " \u0C8E\u0C82\u0CA6\u0CC1 ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF\u0CB5\u0CBE\u0CA6 \u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD: \u0C87\u0CA6\u0CB0\u0CCA\u0C82\u0CA6\u0CBF\u0C97\u0CC6 \u0CAA\u0CCD\u0CB0\u0CBE\u0CB0\u0C82\u0CAD\u0CBF\u0CB8\u0CAC\u0CC7\u0C95\u0CC1 "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return '\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF\u0CB5\u0CBE\u0CA6 \u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD: \u0C87\u0CA6\u0CB0\u0CCA\u0C82\u0CA6\u0CBF\u0C97\u0CC6 \u0C95\u0CCA\u0CA8\u0CC6\u0C97\u0CCA\u0CB3\u0CCD\u0CB3\u0CAC\u0CC7\u0C95\u0CC1 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD: \u0C92\u0CB3\u0C97\u0CCA\u0C82\u0CA1\u0CBF\u0CB0\u0CAC\u0CC7\u0C95\u0CC1 "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF\u0CB5\u0CBE\u0CA6 \u0CB8\u0CCD\u0C9F\u0CCD\u0CB0\u0CBF\u0C82\u0C97\u0CCD: \u0CAE\u0CBE\u0CA6\u0CB0\u0CBF\u0C97\u0CC6 \u0CB9\u0CCA\u0C82\u0CA6\u0CBF\u0C95\u0CC6\u0CAF\u0CBE\u0C97\u0CAC\u0CC7\u0C95\u0CC1 ".concat(
                  _issue.pattern,
                );
              return "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0CB8\u0C82\u0C96\u0CCD\u0CAF\u0CC6: \u0CAC\u0CB9\u0CC1\u0CB8\u0C82\u0C96\u0CCD\u0CAF\u0CC6\u0CAF\u0CBE\u0C97\u0CBF\u0CB0\u0CAC\u0CC7\u0C95\u0CC1 ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "\u0C97\u0CC1\u0CB0\u0CC1\u0CA4\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CA6 \u0C95\u0CC0 "
                .concat(issue.keys.length > 1 ? "s" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF\u0CB5\u0CBE\u0CA6 \u0C95\u0CC0 \u0C87\u0CA8\u0CCD ".concat(
                issue.origin,
              );
            case "invalid_union":
              if (
                issue.options &&
                Array.isArray(issue.options) &&
                issue.options.length > 0
              ) {
                const opts = issue.options
                  .map((o) => "'".concat(o, "'"))
                  .join(" | ");
                return "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0CA4\u0CBE\u0CB0\u0CA4\u0CAE\u0CCD\u0CAF \u0CAE\u0CCC\u0CB2\u0CCD\u0CAF. \u0CA8\u0CBF\u0CB0\u0CC0\u0C95\u0CCD\u0CB7\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CBF\u0CA6\u0CC6 ".concat(
                  opts,
                );
              }
              return "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0C87\u0CA8\u0CCD\u200C\u0CAA\u0CC1\u0C9F\u0CCD";
            case "invalid_element":
              return "\u0CB0\u0CB2\u0CCD\u0CB2\u0CBF \u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0CAE\u0CCC\u0CB2\u0CCD\u0CAF ".concat(
                issue.origin,
              );
            default:
              return "\u0C85\u0CAE\u0CBE\u0CA8\u0CCD\u0CAF \u0C87\u0CA8\u0CCD\u200C\u0CAA\u0CC1\u0C9F\u0CCD";
          }
        };
      };
      function kn() {
        return {
          localeError: kn_error(),
        };
      }
      const ko_error = () => {
        const Sizable = {
          string: { unit: "\uBB38\uC790", verb: "to have" },
          file: { unit: "\uBC14\uC774\uD2B8", verb: "to have" },
          array: { unit: "\uAC1C", verb: "to have" },
          set: { unit: "\uAC1C", verb: "to have" },
          map: { unit: "\uAC1C", verb: "to have" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\uC785\uB825",
          email: "\uC774\uBA54\uC77C \uC8FC\uC18C",
          url: "URL",
          emoji: "\uC774\uBAA8\uC9C0",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO \uB0A0\uC9DC\uC2DC\uAC04",
          date: "ISO \uB0A0\uC9DC",
          time: "ISO \uC2DC\uAC04",
          duration: "ISO \uAE30\uAC04",
          ipv4: "IPv4 \uC8FC\uC18C",
          ipv6: "IPv6 \uC8FC\uC18C",
          mac: "MAC \uC8FC\uC18C",
          cidrv4: "IPv4 \uBC94\uC704",
          cidrv6: "IPv6 \uBC94\uC704",
          base64: "base64 \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
          base64url: "base64url \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
          json_string: "JSON \uBB38\uC790\uC5F4",
          e164: "E.164 \uBC88\uD638",
          credit_card: "\uC2E0\uC6A9\uCE74\uB4DC \uBC88\uD638",
          jwt: "JWT",
          template_literal: "\uC785\uB825",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 instanceof "
                  .concat(issue.expected, ", \uBC1B\uC740 \uD0C0\uC785\uC740 ")
                  .concat(received, "\uC785\uB2C8\uB2E4");
              }
              return "\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 "
                .concat(expected, ", \uBC1B\uC740 \uD0C0\uC785\uC740 ")
                .concat(received, "\uC785\uB2C8\uB2E4");
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\uC798\uBABB\uB41C \uC785\uB825: \uAC12\uC740 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                  " \uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4",
                );
              return "\uC798\uBABB\uB41C \uC635\uC158: ".concat(
                util.joinValues(issue.values, "\uB610\uB294 "),
                " \uC911 \uD558\uB098\uC5EC\uC57C \uD569\uB2C8\uB2E4",
              );
            case "too_big": {
              const adj = issue.inclusive ? "\uC774\uD558" : "\uBBF8\uB9CC";
              const suffix =
                adj === "\uBBF8\uB9CC"
                  ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4"
                  : "\uC5EC\uC57C \uD569\uB2C8\uB2E4";
              const sizing = getSizing(issue.origin);
              const unit = sizing?.unit ?? "\uC694\uC18C";
              if (sizing)
                return ""
                  .concat(
                    issue.origin ?? "\uAC12",
                    "\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ",
                  )
                  .concat(issue.maximum.toString())
                  .concat(unit, " ")
                  .concat(adj)
                  .concat(suffix);
              return ""
                .concat(
                  issue.origin ?? "\uAC12",
                  "\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ",
                )
                .concat(issue.maximum.toString(), " ")
                .concat(adj)
                .concat(suffix);
            }
            case "too_small": {
              const adj = issue.inclusive ? "\uC774\uC0C1" : "\uCD08\uACFC";
              const suffix =
                adj === "\uC774\uC0C1"
                  ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4"
                  : "\uC5EC\uC57C \uD569\uB2C8\uB2E4";
              const sizing = getSizing(issue.origin);
              const unit = sizing?.unit ?? "\uC694\uC18C";
              if (sizing) {
                return ""
                  .concat(
                    issue.origin ?? "\uAC12",
                    "\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ",
                  )
                  .concat(issue.minimum.toString())
                  .concat(unit, " ")
                  .concat(adj)
                  .concat(suffix);
              }
              return ""
                .concat(
                  issue.origin ?? "\uAC12",
                  "\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ",
                )
                .concat(issue.minimum.toString(), " ")
                .concat(adj)
                .concat(suffix);
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "'.concat(
                  _issue.prefix,
                  '"(\uC73C)\uB85C \uC2DC\uC791\uD574\uC57C \uD569\uB2C8\uB2E4',
                );
              }
              if (_issue.format === "ends_with")
                return '\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "'.concat(
                  _issue.suffix,
                  '"(\uC73C)\uB85C \uB05D\uB098\uC57C \uD569\uB2C8\uB2E4',
                );
              if (_issue.format === "includes")
                return '\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "'.concat(
                  _issue.includes,
                  '"\uC744(\uB97C) \uD3EC\uD568\uD574\uC57C \uD569\uB2C8\uB2E4',
                );
              if (_issue.format === "regex")
                return "\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: \uC815\uADDC\uC2DD ".concat(
                  _issue.pattern,
                  " \uD328\uD134\uACFC \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4",
                );
              return "\uC798\uBABB\uB41C ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\uC798\uBABB\uB41C \uC22B\uC790: ".concat(
                issue.divisor,
                "\uC758 \uBC30\uC218\uC5EC\uC57C \uD569\uB2C8\uB2E4",
              );
            case "unrecognized_keys":
              return "\uC778\uC2DD\uD560 \uC218 \uC5C6\uB294 \uD0A4: ".concat(
                util.joinValues(issue.keys, ", "),
              );
            case "invalid_key":
              return "\uC798\uBABB\uB41C \uD0A4: ".concat(issue.origin);
            case "invalid_union":
              return "\uC798\uBABB\uB41C \uC785\uB825";
            case "invalid_element":
              return "\uC798\uBABB\uB41C \uAC12: ".concat(issue.origin);
            default:
              return "\uC798\uBABB\uB41C \uC785\uB825";
          }
        };
      };
      function ko() {
        return {
          localeError: ko_error(),
        };
      }
      const capitalizeFirstCharacter = (text) => {
        return text.charAt(0).toUpperCase() + text.slice(1);
      };
      function getUnitTypeFromNumber(number2) {
        const abs = Math.abs(number2);
        const last = abs % 10;
        const last2 = abs % 100;
        if ((last2 >= 11 && last2 <= 19) || last === 0) return "many";
        if (last === 1) return "one";
        return "few";
      }
      const lt_error = () => {
        const Sizable = {
          string: {
            unit: {
              one: "simbolis",
              few: "simboliai",
              many: "simboli\u0173",
            },
            verb: {
              smaller: {
                inclusive: "turi b\u016Bti ne ilgesn\u0117 kaip",
                notInclusive: "turi b\u016Bti trumpesn\u0117 kaip",
              },
              bigger: {
                inclusive: "turi b\u016Bti ne trumpesn\u0117 kaip",
                notInclusive: "turi b\u016Bti ilgesn\u0117 kaip",
              },
            },
          },
          file: {
            unit: {
              one: "baitas",
              few: "baitai",
              many: "bait\u0173",
            },
            verb: {
              smaller: {
                inclusive: "turi b\u016Bti ne didesnis kaip",
                notInclusive: "turi b\u016Bti ma\u017Eesnis kaip",
              },
              bigger: {
                inclusive: "turi b\u016Bti ne ma\u017Eesnis kaip",
                notInclusive: "turi b\u016Bti didesnis kaip",
              },
            },
          },
          array: {
            unit: {
              one: "element\u0105",
              few: "elementus",
              many: "element\u0173",
            },
            verb: {
              smaller: {
                inclusive: "turi tur\u0117ti ne daugiau kaip",
                notInclusive: "turi tur\u0117ti ma\u017Eiau kaip",
              },
              bigger: {
                inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
                notInclusive: "turi tur\u0117ti daugiau kaip",
              },
            },
          },
          set: {
            unit: {
              one: "element\u0105",
              few: "elementus",
              many: "element\u0173",
            },
            verb: {
              smaller: {
                inclusive: "turi tur\u0117ti ne daugiau kaip",
                notInclusive: "turi tur\u0117ti ma\u017Eiau kaip",
              },
              bigger: {
                inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
                notInclusive: "turi tur\u0117ti daugiau kaip",
              },
            },
          },
        };
        function getSizing(origin, unitType, inclusive, targetShouldBe) {
          const result = Sizable[origin] ?? null;
          if (result === null) return result;
          return {
            unit: result.unit[unitType],
            verb: result.verb[targetShouldBe][
              inclusive ? "inclusive" : "notInclusive"
            ],
          };
        }
        const FormatDictionary = {
          regex: "\u012Fvestis",
          email: "el. pa\u0161to adresas",
          url: "URL",
          emoji: "jaustukas",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO data ir laikas",
          date: "ISO data",
          time: "ISO laikas",
          duration: "ISO trukm\u0117",
          ipv4: "IPv4 adresas",
          ipv6: "IPv6 adresas",
          mac: "MAC adresas",
          cidrv4: "IPv4 tinklo prefiksas (CIDR)",
          cidrv6: "IPv6 tinklo prefiksas (CIDR)",
          base64: "base64 u\u017Ekoduota eilut\u0117",
          base64url: "base64url u\u017Ekoduota eilut\u0117",
          json_string: "JSON eilut\u0117",
          e164: "E.164 numeris",
          credit_card: "kredito kortel\u0117s numeris",
          jwt: "JWT",
          template_literal: "\u012Fvestis",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "skai\u010Dius",
          bigint: "sveikasis skai\u010Dius",
          string: "eilut\u0117",
          boolean: "login\u0117 reik\u0161m\u0117",
          undefined: "neapibr\u0117\u017Eta reik\u0161m\u0117",
          function: "funkcija",
          symbol: "simbolis",
          array: "masyvas",
          object: "objektas",
          null: "nulin\u0117 reik\u0161m\u0117",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Gautas tipas "
                  .concat(received, ", o tik\u0117tasi - instanceof ")
                  .concat(issue.expected);
              }
              return "Gautas tipas "
                .concat(received, ", o tik\u0117tasi - ")
                .concat(expected);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Privalo b\u016Bti ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Privalo b\u016Bti vienas i\u0161 ".concat(
                util.joinValues(issue.values, "|"),
                " pasirinkim\u0173",
              );
            case "too_big": {
              const origin = TypeDictionary[issue.origin] ?? issue.origin;
              const sizing = getSizing(
                issue.origin,
                getUnitTypeFromNumber(Number(issue.maximum)),
                issue.inclusive ?? false,
                "smaller",
              );
              if (sizing?.verb)
                return ""
                  .concat(
                    capitalizeFirstCharacter(
                      origin ?? issue.origin ?? "reik\u0161m\u0117",
                    ),
                    " ",
                  )
                  .concat(sizing.verb, " ")
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "element\u0173");
              const adj = issue.inclusive
                ? "ne didesnis kaip"
                : "ma\u017Eesnis kaip";
              return ""
                .concat(
                  capitalizeFirstCharacter(
                    origin ?? issue.origin ?? "reik\u0161m\u0117",
                  ),
                  " turi b\u016Bti ",
                )
                .concat(adj, " ")
                .concat(issue.maximum.toString(), " ")
                .concat(sizing?.unit);
            }
            case "too_small": {
              const origin = TypeDictionary[issue.origin] ?? issue.origin;
              const sizing = getSizing(
                issue.origin,
                getUnitTypeFromNumber(Number(issue.minimum)),
                issue.inclusive ?? false,
                "bigger",
              );
              if (sizing?.verb)
                return ""
                  .concat(
                    capitalizeFirstCharacter(
                      origin ?? issue.origin ?? "reik\u0161m\u0117",
                    ),
                    " ",
                  )
                  .concat(sizing.verb, " ")
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit ?? "element\u0173");
              const adj = issue.inclusive
                ? "ne ma\u017Eesnis kaip"
                : "didesnis kaip";
              return ""
                .concat(
                  capitalizeFirstCharacter(
                    origin ?? issue.origin ?? "reik\u0161m\u0117",
                  ),
                  " turi b\u016Bti ",
                )
                .concat(adj, " ")
                .concat(issue.minimum.toString(), " ")
                .concat(sizing?.unit);
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return 'Eilut\u0117 privalo prasid\u0117ti "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return 'Eilut\u0117 privalo pasibaigti "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Eilut\u0117 privalo \u012Ftraukti "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Eilut\u0117 privalo atitikti ".concat(_issue.pattern);
              return "Neteisingas ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Skai\u010Dius privalo b\u016Bti ".concat(
                issue.divisor,
                " kartotinis.",
              );
            case "unrecognized_keys":
              return "Neatpa\u017Eint"
                .concat(issue.keys.length > 1 ? "i" : "as", " rakt")
                .concat(issue.keys.length > 1 ? "ai" : "as", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Rastas klaidingas raktas";
            case "invalid_union":
              return "Klaidinga \u012Fvestis";
            case "invalid_element": {
              const origin = TypeDictionary[issue.origin] ?? issue.origin;
              return "".concat(
                capitalizeFirstCharacter(
                  origin ?? issue.origin ?? "reik\u0161m\u0117",
                ),
                " turi klaiding\u0105 \u012Fvest\u012F",
              );
            }
            default:
              return "Klaidinga \u012Fvestis";
          }
        };
      };
      function lt() {
        return {
          localeError: lt_error(),
        };
      }
      const mk_error = () => {
        const Sizable = {
          string: {
            unit: "\u0437\u043D\u0430\u0446\u0438",
            verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
          },
          file: {
            unit: "\u0431\u0430\u0458\u0442\u0438",
            verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
          },
          array: {
            unit: "\u0441\u0442\u0430\u0432\u043A\u0438",
            verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
          },
          set: {
            unit: "\u0441\u0442\u0430\u0432\u043A\u0438",
            verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
          },
          map: {
            unit: "\u0441\u0442\u0430\u0432\u043A\u0438",
            verb: "\u0434\u0430 \u0438\u043C\u0430\u0430\u0442",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0432\u043D\u0435\u0441",
          email:
            "\u0430\u0434\u0440\u0435\u0441\u0430 \u043D\u0430 \u0435-\u043F\u043E\u0448\u0442\u0430",
          url: "URL",
          emoji: "\u0435\u043C\u043E\u045F\u0438",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "ISO \u0434\u0430\u0442\u0443\u043C \u0438 \u0432\u0440\u0435\u043C\u0435",
          date: "ISO \u0434\u0430\u0442\u0443\u043C",
          time: "ISO \u0432\u0440\u0435\u043C\u0435",
          duration:
            "ISO \u0432\u0440\u0435\u043C\u0435\u0442\u0440\u0430\u0435\u045A\u0435",
          ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441\u0430",
          ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441\u0430",
          mac: "MAC \u0430\u0434\u0440\u0435\u0441\u0430",
          cidrv4: "IPv4 \u043E\u043F\u0441\u0435\u0433",
          cidrv6: "IPv6 \u043E\u043F\u0441\u0435\u0433",
          base64:
            "base64-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
          base64url:
            "base64url-\u0435\u043D\u043A\u043E\u0434\u0438\u0440\u0430\u043D\u0430 \u043D\u0438\u0437\u0430",
          json_string: "JSON \u043D\u0438\u0437\u0430",
          e164: "E.164 \u0431\u0440\u043E\u0458",
          credit_card:
            "\u0431\u0440\u043E\u0458 \u043D\u0430 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u0430 \u043A\u0430\u0440\u0442\u0438\u0447\u043A\u0430",
          jwt: "JWT",
          template_literal: "\u0432\u043D\u0435\u0441",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u0431\u0440\u043E\u0458",
          array: "\u043D\u0438\u0437\u0430",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 instanceof "
                  .concat(
                    issue.expected,
                    ", \u043F\u0440\u0438\u043C\u0435\u043D\u043E ",
                  )
                  .concat(received);
              }
              return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 "
                .concat(
                  expected,
                  ", \u043F\u0440\u0438\u043C\u0435\u043D\u043E ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Invalid input: expected ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u0413\u0440\u0435\u0448\u0430\u043D\u0430 \u043E\u043F\u0446\u0438\u0458\u0430: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 \u0435\u0434\u043D\u0430 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 "
                  .concat(
                    issue.origin ??
                      "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430",
                    " \u0434\u0430 \u0438\u043C\u0430 ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ??
                      "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0438",
                  );
              return "\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u0433\u043E\u043B\u0435\u043C: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 "
                .concat(
                  issue.origin ??
                    "\u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442\u0430",
                  " \u0434\u0430 \u0431\u0438\u0434\u0435 ",
                )
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 "
                  .concat(issue.origin, " \u0434\u0430 \u0438\u043C\u0430 ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "\u041F\u0440\u0435\u043C\u043D\u043E\u0433\u0443 \u043C\u0430\u043B: \u0441\u0435 \u043E\u0447\u0435\u043A\u0443\u0432\u0430 "
                .concat(issue.origin, " \u0434\u0430 \u0431\u0438\u0434\u0435 ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u043F\u043E\u0447\u043D\u0443\u0432\u0430 \u0441\u043E "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return '\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0437\u0430\u0432\u0440\u0448\u0443\u0432\u0430 \u0441\u043E "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0432\u043A\u043B\u0443\u0447\u0443\u0432\u0430 "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u041D\u0435\u0432\u0430\u0436\u0435\u0447\u043A\u0430 \u043D\u0438\u0437\u0430: \u043C\u043E\u0440\u0430 \u0434\u0430 \u043E\u0434\u0433\u043E\u0430\u0440\u0430 \u043D\u0430 \u043F\u0430\u0442\u0435\u0440\u043D\u043E\u0442 ".concat(
                  _issue.pattern,
                );
              return "Invalid ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u0413\u0440\u0435\u0448\u0435\u043D \u0431\u0440\u043E\u0458: \u043C\u043E\u0440\u0430 \u0434\u0430 \u0431\u0438\u0434\u0435 \u0434\u0435\u043B\u0438\u0432 \u0441\u043E ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return ""
                .concat(
                  issue.keys.length > 1
                    ? "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D\u0438 \u043A\u043B\u0443\u0447\u0435\u0432\u0438"
                    : "\u041D\u0435\u043F\u0440\u0435\u043F\u043E\u0437\u043D\u0430\u0435\u043D \u043A\u043B\u0443\u0447",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u0413\u0440\u0435\u0448\u0435\u043D \u043A\u043B\u0443\u0447 \u0432\u043E ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441";
            case "invalid_element":
              return "\u0413\u0440\u0435\u0448\u043D\u0430 \u0432\u0440\u0435\u0434\u043D\u043E\u0441\u0442 \u0432\u043E ".concat(
                issue.origin,
              );
            default:
              return "\u0413\u0440\u0435\u0448\u0435\u043D \u0432\u043D\u0435\u0441";
          }
        };
      };
      function mk() {
        return {
          localeError: mk_error(),
        };
      }
      const ms_error = () => {
        const Sizable = {
          string: { unit: "aksara", verb: "mempunyai" },
          file: { unit: "bait", verb: "mempunyai" },
          array: { unit: "elemen", verb: "mempunyai" },
          set: { unit: "elemen", verb: "mempunyai" },
          map: { unit: "elemen", verb: "mempunyai" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "input",
          email: "alamat e-mel",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "tarikh masa ISO",
          date: "tarikh ISO",
          time: "masa ISO",
          duration: "tempoh ISO",
          ipv4: "alamat IPv4",
          ipv6: "alamat IPv6",
          mac: "alamat MAC",
          cidrv4: "julat IPv4",
          cidrv6: "julat IPv6",
          base64: "string dikodkan base64",
          base64url: "string dikodkan base64url",
          json_string: "string JSON",
          e164: "nombor E.164",
          credit_card: "nombor kad kredit",
          jwt: "JWT",
          template_literal: "input",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "nombor",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Input tidak sah: dijangka instanceof "
                  .concat(issue.expected, ", diterima ")
                  .concat(received);
              }
              return "Input tidak sah: dijangka "
                .concat(expected, ", diterima ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Input tidak sah: dijangka ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Pilihan tidak sah: dijangka salah satu daripada ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Terlalu besar: dijangka "
                  .concat(issue.origin ?? "nilai", " ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elemen");
              return "Terlalu besar: dijangka "
                .concat(issue.origin ?? "nilai", " adalah ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Terlalu kecil: dijangka "
                  .concat(issue.origin, " ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Terlalu kecil: dijangka "
                .concat(issue.origin, " adalah ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'String tidak sah: mesti bermula dengan "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'String tidak sah: mesti berakhir dengan "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'String tidak sah: mesti mengandungi "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "String tidak sah: mesti sepadan dengan corak ".concat(
                  _issue.pattern,
                );
              return "".concat(
                FormatDictionary[_issue.format] ?? issue.format,
                " tidak sah",
              );
            }
            case "not_multiple_of":
              return "Nombor tidak sah: perlu gandaan ".concat(issue.divisor);
            case "unrecognized_keys":
              return "Kunci tidak dikenali: ".concat(
                util.joinValues(issue.keys, ", "),
              );
            case "invalid_key":
              return "Kunci tidak sah dalam ".concat(issue.origin);
            case "invalid_union":
              return "Input tidak sah";
            case "invalid_element":
              return "Nilai tidak sah dalam ".concat(issue.origin);
            default:
              return "Input tidak sah";
          }
        };
      };
      function ms() {
        return {
          localeError: ms_error(),
        };
      }
      const ne_error = () => {
        const Sizable = {
          string: {
            unit: "\u0905\u0915\u094D\u0937\u0930",
            verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
          },
          file: {
            unit: "\u092C\u093E\u0907\u091F",
            verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
          },
          array: {
            unit: "\u0924\u0924\u094D\u0935",
            verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
          },
          set: {
            unit: "\u0924\u0924\u094D\u0935",
            verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
          },
          map: {
            unit: "\u092A\u094D\u0930\u0935\u093F\u0937\u094D\u091F\u093F",
            verb: "\u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0907\u0928\u092A\u0941\u091F",
          email:
            "\u0907\u092E\u0947\u0932 \u0920\u0947\u0917\u093E\u0928\u093E",
          url: "URL",
          emoji: "\u0907\u092E\u094B\u091C\u0940",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO \u092E\u093F\u0924\u093F \u0930 \u0938\u092E\u092F",
          date: "ISO \u092E\u093F\u0924\u093F",
          time: "ISO \u0938\u092E\u092F",
          duration: "ISO \u0905\u0935\u0927\u093F",
          ipv4: "IPv4 \u0920\u0947\u0917\u093E\u0928\u093E",
          ipv6: "IPv6 \u0920\u0947\u0917\u093E\u0928\u093E",
          mac: "MAC \u0920\u0947\u0917\u093E\u0928\u093E",
          cidrv4: "IPv4 \u0926\u093E\u092F\u0930\u093E",
          cidrv6: "IPv6 \u0926\u093E\u092F\u0930\u093E",
          base64:
            "base64-\u0907\u0928\u094D\u0915\u094B\u0921 \u0917\u0930\u093F\u090F\u0915\u094B \u0938\u094D\u091F\u094D\u0930\u093F\u0919",
          base64url:
            "base64url-\u0907\u0928\u094D\u0915\u094B\u0921 \u0917\u0930\u093F\u090F\u0915\u094B \u0938\u094D\u091F\u094D\u0930\u093F\u0919",
          json_string: "JSON \u0938\u094D\u091F\u094D\u0930\u093F\u0919",
          e164: "E.164 \u0928\u092E\u094D\u092C\u0930",
          credit_card:
            "\u0915\u094D\u0930\u0947\u0921\u093F\u091F \u0915\u093E\u0930\u094D\u0921 \u0928\u092E\u094D\u092C\u0930",
          jwt: "JWT",
          template_literal: "\u0907\u0928\u092A\u0941\u091F",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 "
                .concat(
                  expected,
                  ", \u092A\u094D\u0930\u093E\u092A\u094D\u0924 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0935\u093F\u0915\u0932\u094D\u092A: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 \u092E\u093E\u0928\u0939\u0930\u0942 \u092E\u0927\u094D\u092F\u0947 \u090F\u0915 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u0927\u0947\u0930\u0948 \u0920\u0942\u0932\u094B: "
                  .concat(
                    issue.origin ?? "\u092E\u093E\u0928",
                    " \u092E\u093E ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit, " ")
                  .concat(sizing.verb);
              return "\u0927\u0947\u0930\u0948 \u0920\u0942\u0932\u094B: "
                .concat(issue.origin ?? "\u092E\u093E\u0928", " ")
                .concat(adj)
                .concat(
                  issue.maximum.toString(),
                  " \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
                );
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u0927\u0947\u0930\u0948 \u0938\u093E\u0928\u094B: "
                  .concat(issue.origin, " \u092E\u093E ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit, " ")
                  .concat(sizing.verb);
              return "\u0927\u0947\u0930\u0948 \u0938\u093E\u0928\u094B: "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(
                  issue.minimum.toString(),
                  " \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
                );
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: "'.concat(
                  _issue.prefix,
                  '" \u092C\u093E\u091F \u0938\u0941\u0930\u0941 \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B',
                );
              if (_issue.format === "ends_with")
                return '\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: "'.concat(
                  _issue.suffix,
                  '" \u092E\u093E \u0938\u092E\u093E\u092A\u094D\u0924 \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B',
                );
              if (_issue.format === "includes")
                return '\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: "'.concat(
                  _issue.includes,
                  '" \u0938\u092E\u093E\u0935\u0947\u0936 \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B',
                );
              if (_issue.format === "regex")
                return "\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u094D\u091F\u094D\u0930\u093F\u0919: \u0922\u093E\u0901\u091A\u093E ".concat(
                  _issue.pattern,
                  " \u0938\u0901\u0917 \u092E\u0947\u0932 \u0916\u093E\u0928\u0941\u092A\u0930\u094D\u091B",
                );
              return "\u0905\u092E\u093E\u0928\u094D\u092F ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0938\u0902\u0916\u094D\u092F\u093E: ".concat(
                issue.divisor,
                " \u0915\u094B \u0917\u0941\u0923\u091C \u0939\u0941\u0928\u0941\u092A\u0930\u094D\u091B",
              );
            case "unrecognized_keys":
              return "\u0905\u092A\u0930\u093F\u091A\u093F\u0924 \u0915\u0941\u091E\u094D\u091C\u0940"
                .concat(issue.keys.length > 1 ? "\u0939\u0930\u0942" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0915\u0941\u091E\u094D\u091C\u0940: ".concat(
                issue.origin,
                " \u092E\u093E",
              );
            case "invalid_union":
              if (
                issue.options &&
                Array.isArray(issue.options) &&
                issue.options.length > 0
              ) {
                const opts = issue.options
                  .map((o) => "'".concat(o, "'"))
                  .join(" | ");
                return "\u0905\u092E\u093E\u0928\u094D\u092F \u0921\u093F\u0938\u094D\u0915\u094D\u0930\u093F\u092E\u093F\u0928\u0947\u091F\u0930 \u092E\u093E\u0928: \u0905\u092A\u0947\u0915\u094D\u0937\u093F\u0924 ".concat(
                  opts,
                );
              }
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
            case "invalid_element":
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u092E\u093E\u0928: ".concat(
                issue.origin,
                " \u092E\u093E",
              );
            default:
              return "\u0905\u092E\u093E\u0928\u094D\u092F \u0907\u0928\u092A\u0941\u091F";
          }
        };
      };
      function ne() {
        return {
          localeError: ne_error(),
        };
      }
      const nl_error = () => {
        const Sizable = {
          string: { unit: "tekens", verb: "heeft" },
          file: { unit: "bytes", verb: "heeft" },
          array: { unit: "elementen", verb: "heeft" },
          set: { unit: "elementen", verb: "heeft" },
          map: { unit: "elementen", verb: "heeft" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "invoer",
          email: "emailadres",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO datum en tijd",
          date: "ISO datum",
          time: "ISO tijd",
          duration: "ISO duur",
          ipv4: "IPv4-adres",
          ipv6: "IPv6-adres",
          mac: "MAC-adres",
          cidrv4: "IPv4-bereik",
          cidrv6: "IPv6-bereik",
          base64: "base64-gecodeerde tekst",
          base64url: "base64 URL-gecodeerde tekst",
          json_string: "JSON string",
          e164: "E.164-nummer",
          credit_card: "creditcardnummer",
          jwt: "JWT",
          template_literal: "invoer",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "getal",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Ongeldige invoer: verwacht instanceof "
                  .concat(issue.expected, ", ontving ")
                  .concat(received);
              }
              return "Ongeldige invoer: verwacht "
                .concat(expected, ", ontving ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Ongeldige invoer: verwacht ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Ongeldige optie: verwacht \xE9\xE9n van ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              const longName =
                issue.origin === "date"
                  ? "laat"
                  : issue.origin === "string"
                    ? "lang"
                    : "groot";
              if (sizing)
                return "Te "
                  .concat(longName, ": verwacht dat ")
                  .concat(issue.origin ?? "waarde", " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elementen", " ")
                  .concat(sizing.verb);
              return "Te "
                .concat(longName, ": verwacht dat ")
                .concat(issue.origin ?? "waarde", " ")
                .concat(adj)
                .concat(issue.maximum.toString(), " is");
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              const shortName =
                issue.origin === "date"
                  ? "vroeg"
                  : issue.origin === "string"
                    ? "kort"
                    : "klein";
              if (sizing) {
                return "Te "
                  .concat(shortName, ": verwacht dat ")
                  .concat(issue.origin, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit, " ")
                  .concat(sizing.verb);
              }
              return "Te "
                .concat(shortName, ": verwacht dat ")
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(issue.minimum.toString(), " is");
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return 'Ongeldige tekst: moet met "'.concat(
                  _issue.prefix,
                  '" beginnen',
                );
              }
              if (_issue.format === "ends_with")
                return 'Ongeldige tekst: moet op "'.concat(
                  _issue.suffix,
                  '" eindigen',
                );
              if (_issue.format === "includes")
                return 'Ongeldige tekst: moet "'.concat(
                  _issue.includes,
                  '" bevatten',
                );
              if (_issue.format === "regex")
                return "Ongeldige tekst: moet overeenkomen met patroon ".concat(
                  _issue.pattern,
                );
              return "Ongeldig: ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Ongeldig getal: moet een veelvoud van ".concat(
                issue.divisor,
                " zijn",
              );
            case "unrecognized_keys":
              return "Onbekende key"
                .concat(issue.keys.length > 1 ? "s" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Ongeldige key in ".concat(issue.origin);
            case "invalid_union":
              return "Ongeldige invoer";
            case "invalid_element":
              return "Ongeldige waarde in ".concat(issue.origin);
            default:
              return "Ongeldige invoer";
          }
        };
      };
      function nl() {
        return {
          localeError: nl_error(),
        };
      }
      const nn_error = () => {
        const Sizable = {
          string: { unit: "teikn", verb: "\xE5 ha" },
          file: { unit: "bytes", verb: "\xE5 ha" },
          array: { unit: "element", verb: "\xE5 innehalde" },
          set: { unit: "element", verb: "\xE5 innehalde" },
          map: { unit: "element", verb: "\xE5 innehalde" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "input",
          email: "e-postadresse",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO dato- og klokkeslett",
          date: "ISO-dato",
          time: "ISO-klokkeslett",
          duration: "ISO-varigheit",
          ipv4: "IPv4-adresse",
          ipv6: "IPv6-adresse",
          mac: "MAC-adresse",
          cidrv4: "IPv4-spekter",
          cidrv6: "IPv6-spekter",
          base64: "base64-enkoda streng",
          base64url: "base64url-enkoda streng",
          json_string: "JSON-streng",
          e164: "E.164-nummer",
          credit_card: "kredittkortnummer",
          jwt: "JWT",
          template_literal: "input",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "tal",
          array: "liste",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Ugyldig input: forventa instanceof "
                  .concat(issue.expected, ", fekk ")
                  .concat(received);
              }
              return "Ugyldig input: forventa "
                .concat(expected, ", fekk ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Ugyldig verdi: forventa ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Ugyldig val: forventa eitt av ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "For stor(t): forventa "
                  .concat(issue.origin ?? "value", " til \xE5 ha ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "element");
              return "For stor(t): forventa "
                .concat(issue.origin ?? "value", " til \xE5 ha ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "For lite(n): forventa "
                  .concat(issue.origin, " til \xE5 ha ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "For lite(n): forventa "
                .concat(issue.origin, " til \xE5 ha ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Ugyldig streng: m\xE5 starte med "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Ugyldig streng: m\xE5 slutte med "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Ugyldig streng: m\xE5 innehalde "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Ugyldig streng: m\xE5 matche m\xF8nsteret ".concat(
                  _issue.pattern,
                );
              return "Ugyldig ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Ugyldig tal: m\xE5 vere eit multiplum av ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return ""
                .concat(
                  issue.keys.length > 1
                    ? "Ukjende n\xF8klar"
                    : "Ukjend n\xF8kkel",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Ugyldig n\xF8kkel i ".concat(issue.origin);
            case "invalid_union":
              return "Ugyldig input";
            case "invalid_element":
              return "Ugyldig verdi i ".concat(issue.origin);
            default:
              return "Ugyldig input";
          }
        };
      };
      function nn() {
        return {
          localeError: nn_error(),
        };
      }
      const no_error = () => {
        const Sizable = {
          string: { unit: "tegn", verb: "\xE5 ha" },
          file: { unit: "bytes", verb: "\xE5 ha" },
          array: { unit: "elementer", verb: "\xE5 inneholde" },
          set: { unit: "elementer", verb: "\xE5 inneholde" },
          map: { unit: "elementer", verb: "\xE5 inneholde" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "input",
          email: "e-postadresse",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO dato- og klokkeslett",
          date: "ISO-dato",
          time: "ISO-klokkeslett",
          duration: "ISO-varighet",
          ipv4: "IPv4-adresse",
          ipv6: "IPv6-adresse",
          mac: "MAC-adresse",
          cidrv4: "IPv4-spekter",
          cidrv6: "IPv6-spekter",
          base64: "base64-enkodet streng",
          base64url: "base64url-enkodet streng",
          json_string: "JSON-streng",
          e164: "E.164-nummer",
          credit_card: "kredittkortnummer",
          jwt: "JWT",
          template_literal: "input",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "tall",
          array: "liste",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Ugyldig input: forventet instanceof "
                  .concat(issue.expected, ", fikk ")
                  .concat(received);
              }
              return "Ugyldig input: forventet "
                .concat(expected, ", fikk ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Ugyldig verdi: forventet ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Ugyldig valg: forventet en av ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "For stor(t): forventet "
                  .concat(issue.origin ?? "value", " til \xE5 ha ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elementer");
              return "For stor(t): forventet "
                .concat(issue.origin ?? "value", " til \xE5 ha ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "For lite(n): forventet "
                  .concat(issue.origin, " til \xE5 ha ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "For lite(n): forventet "
                .concat(issue.origin, " til \xE5 ha ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Ugyldig streng: m\xE5 starte med "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Ugyldig streng: m\xE5 ende med "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Ugyldig streng: m\xE5 inneholde "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Ugyldig streng: m\xE5 matche m\xF8nsteret ".concat(
                  _issue.pattern,
                );
              return "Ugyldig ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Ugyldig tall: m\xE5 v\xE6re et multiplum av ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return ""
                .concat(
                  issue.keys.length > 1
                    ? "Ukjente n\xF8kler"
                    : "Ukjent n\xF8kkel",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Ugyldig n\xF8kkel i ".concat(issue.origin);
            case "invalid_union":
              return "Ugyldig input";
            case "invalid_element":
              return "Ugyldig verdi i ".concat(issue.origin);
            default:
              return "Ugyldig input";
          }
        };
      };
      function no() {
        return {
          localeError: no_error(),
        };
      }
      const ota_error = () => {
        const Sizable = {
          string: { unit: "harf", verb: "olmal\u0131d\u0131r" },
          file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
          array: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
          set: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
          map: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "giren",
          email: "epostag\xE2h",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO heng\xE2m\u0131",
          date: "ISO tarihi",
          time: "ISO zaman\u0131",
          duration: "ISO m\xFCddeti",
          ipv4: "IPv4 ni\u015F\xE2n\u0131",
          ipv6: "IPv6 ni\u015F\xE2n\u0131",
          mac: "MAC ni\u015F\xE2n\u0131",
          cidrv4: "IPv4 menzili",
          cidrv6: "IPv6 menzili",
          base64: "base64-\u015Fifreli metin",
          base64url: "base64url-\u015Fifreli metin",
          json_string: "JSON metin",
          e164: "E.164 say\u0131s\u0131",
          credit_card: "i'tib\xE2r kart\u0131 numaras\u0131",
          jwt: "JWT",
          template_literal: "giren",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "numara",
          array: "saf",
          null: "gayb",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "F\xE2sit giren: umulan instanceof "
                  .concat(issue.expected, ", al\u0131nan ")
                  .concat(received);
              }
              return "F\xE2sit giren: umulan "
                .concat(expected, ", al\u0131nan ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "F\xE2sit giren: umulan ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "F\xE2sit tercih: m\xFBteberler ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Fazla b\xFCy\xFCk: "
                  .concat(issue.origin ?? "value", ", ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ?? "elements",
                    " sahip olmal\u0131yd\u0131.",
                  );
              return "Fazla b\xFCy\xFCk: "
                .concat(issue.origin ?? "value", ", ")
                .concat(adj)
                .concat(issue.maximum.toString(), " olmal\u0131yd\u0131.");
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Fazla k\xFC\xE7\xFCk: "
                  .concat(issue.origin, ", ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit, " sahip olmal\u0131yd\u0131.");
              }
              return "Fazla k\xFC\xE7\xFCk: "
                .concat(issue.origin, ", ")
                .concat(adj)
                .concat(issue.minimum.toString(), " olmal\u0131yd\u0131.");
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'F\xE2sit metin: "'.concat(
                  _issue.prefix,
                  '" ile ba\u015Flamal\u0131.',
                );
              if (_issue.format === "ends_with")
                return 'F\xE2sit metin: "'.concat(
                  _issue.suffix,
                  '" ile bitmeli.',
                );
              if (_issue.format === "includes")
                return 'F\xE2sit metin: "'.concat(
                  _issue.includes,
                  '" ihtiv\xE2 etmeli.',
                );
              if (_issue.format === "regex")
                return "F\xE2sit metin: ".concat(
                  _issue.pattern,
                  " nak\u015F\u0131na uymal\u0131.",
                );
              return "F\xE2sit ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "F\xE2sit say\u0131: ".concat(
                issue.divisor,
                " kat\u0131 olmal\u0131yd\u0131.",
              );
            case "unrecognized_keys":
              return "Tan\u0131nmayan anahtar "
                .concat(issue.keys.length > 1 ? "s" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "".concat(
                issue.origin,
                " i\xE7in tan\u0131nmayan anahtar var.",
              );
            case "invalid_union":
              return "Giren tan\u0131namad\u0131.";
            case "invalid_element":
              return "".concat(
                issue.origin,
                " i\xE7in tan\u0131nmayan k\u0131ymet var.",
              );
            default:
              return "K\u0131ymet tan\u0131namad\u0131.";
          }
        };
      };
      function ota() {
        return {
          localeError: ota_error(),
        };
      }
      const ps_error = () => {
        const Sizable = {
          string: {
            unit: "\u062A\u0648\u06A9\u064A",
            verb: "\u0648\u0644\u0631\u064A",
          },
          file: {
            unit: "\u0628\u0627\u06CC\u067C\u0633",
            verb: "\u0648\u0644\u0631\u064A",
          },
          array: {
            unit: "\u062A\u0648\u06A9\u064A",
            verb: "\u0648\u0644\u0631\u064A",
          },
          set: {
            unit: "\u062A\u0648\u06A9\u064A",
            verb: "\u0648\u0644\u0631\u064A",
          },
          map: {
            unit: "\u062A\u0648\u06A9\u064A",
            verb: "\u0648\u0644\u0631\u064A",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0648\u0631\u0648\u062F\u064A",
          email: "\u0628\u0631\u06CC\u069A\u0646\u0627\u0644\u06CC\u06A9",
          url: "\u06CC\u0648 \u0622\u0631 \u0627\u0644",
          emoji: "\u0627\u06CC\u0645\u0648\u062C\u064A",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "\u0646\u06CC\u067C\u0647 \u0627\u0648 \u0648\u062E\u062A",
          date: "\u0646\u06D0\u067C\u0647",
          time: "\u0648\u062E\u062A",
          duration: "\u0645\u0648\u062F\u0647",
          ipv4: "\u062F IPv4 \u067E\u062A\u0647",
          ipv6: "\u062F IPv6 \u067E\u062A\u0647",
          mac: "\u062F MAC \u067E\u062A\u0647",
          cidrv4: "\u062F IPv4 \u0633\u0627\u062D\u0647",
          cidrv6: "\u062F IPv6 \u0633\u0627\u062D\u0647",
          base64: "base64-encoded \u0645\u062A\u0646",
          base64url: "base64url-encoded \u0645\u062A\u0646",
          json_string: "JSON \u0645\u062A\u0646",
          e164: "\u062F E.164 \u0634\u0645\u06D0\u0631\u0647",
          credit_card:
            "\u062F \u06A9\u0631\u06CC\u0689\u06CC\u067C \u06A9\u0627\u0631\u062A \u0634\u0645\u06CC\u0631\u0647",
          jwt: "JWT",
          template_literal: "\u0648\u0631\u0648\u062F\u064A",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u0639\u062F\u062F",
          array: "\u0627\u0631\u06D0",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F instanceof "
                  .concat(
                    issue.expected,
                    " \u0648\u0627\u06CC, \u0645\u06AB\u0631 ",
                  )
                  .concat(
                    received,
                    " \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648",
                  );
              }
              return "\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F "
                .concat(expected, " \u0648\u0627\u06CC, \u0645\u06AB\u0631 ")
                .concat(
                  received,
                  " \u062A\u0631\u0644\u0627\u0633\u0647 \u0634\u0648",
                );
            }
            case "invalid_value":
              if (issue.values.length === 1) {
                return "\u0646\u0627\u0633\u0645 \u0648\u0631\u0648\u062F\u064A: \u0628\u0627\u06CC\u062F ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                  " \u0648\u0627\u06CC",
                );
              }
              return "\u0646\u0627\u0633\u0645 \u0627\u0646\u062A\u062E\u0627\u0628: \u0628\u0627\u06CC\u062F \u06CC\u0648 \u0644\u0647 ".concat(
                util.joinValues(issue.values, "|"),
                " \u0685\u062E\u0647 \u0648\u0627\u06CC",
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0689\u06CC\u0631 \u0644\u0648\u06CC: "
                  .concat(
                    issue.origin ?? "\u0627\u0631\u0632\u069A\u062A",
                    " \u0628\u0627\u06CC\u062F ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ?? "\u0639\u0646\u0635\u0631\u0648\u0646\u0647",
                    " \u0648\u0644\u0631\u064A",
                  );
              }
              return "\u0689\u06CC\u0631 \u0644\u0648\u06CC: "
                .concat(
                  issue.origin ?? "\u0627\u0631\u0632\u069A\u062A",
                  " \u0628\u0627\u06CC\u062F ",
                )
                .concat(adj)
                .concat(issue.maximum.toString(), " \u0648\u064A");
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: "
                  .concat(issue.origin, " \u0628\u0627\u06CC\u062F ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit, " \u0648\u0644\u0631\u064A");
              }
              return "\u0689\u06CC\u0631 \u06A9\u0648\u0686\u0646\u06CC: "
                .concat(issue.origin, " \u0628\u0627\u06CC\u062F ")
                .concat(adj)
                .concat(issue.minimum.toString(), " \u0648\u064A");
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "'.concat(
                  _issue.prefix,
                  '" \u0633\u0631\u0647 \u067E\u06CC\u0644 \u0634\u064A',
                );
              }
              if (_issue.format === "ends_with") {
                return '\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F "'.concat(
                  _issue.suffix,
                  '" \u0633\u0631\u0647 \u067E\u0627\u06CC \u062A\u0647 \u0648\u0631\u0633\u064A\u0696\u064A',
                );
              }
              if (_issue.format === "includes") {
                return '\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F "'.concat(
                  _issue.includes,
                  '" \u0648\u0644\u0631\u064A',
                );
              }
              if (_issue.format === "regex") {
                return "\u0646\u0627\u0633\u0645 \u0645\u062A\u0646: \u0628\u0627\u06CC\u062F \u062F ".concat(
                  _issue.pattern,
                  " \u0633\u0631\u0647 \u0645\u0637\u0627\u0628\u0642\u062A \u0648\u0644\u0631\u064A",
                );
              }
              return "".concat(
                FormatDictionary[_issue.format] ?? issue.format,
                " \u0646\u0627\u0633\u0645 \u062F\u06CC",
              );
            }
            case "not_multiple_of":
              return "\u0646\u0627\u0633\u0645 \u0639\u062F\u062F: \u0628\u0627\u06CC\u062F \u062F ".concat(
                issue.divisor,
                " \u0645\u0636\u0631\u0628 \u0648\u064A",
              );
            case "unrecognized_keys":
              return "\u0646\u0627\u0633\u0645 "
                .concat(
                  issue.keys.length > 1
                    ? "\u06A9\u0644\u06CC\u0689\u0648\u0646\u0647"
                    : "\u06A9\u0644\u06CC\u0689",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u0646\u0627\u0633\u0645 \u06A9\u0644\u06CC\u0689 \u067E\u0647 ".concat(
                issue.origin,
                " \u06A9\u06D0",
              );
            case "invalid_union":
              return "\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A";
            case "invalid_element":
              return "\u0646\u0627\u0633\u0645 \u0639\u0646\u0635\u0631 \u067E\u0647 ".concat(
                issue.origin,
                " \u06A9\u06D0",
              );
            default:
              return "\u0646\u0627\u0633\u0645\u0647 \u0648\u0631\u0648\u062F\u064A";
          }
        };
      };
      function ps() {
        return {
          localeError: ps_error(),
        };
      }
      const pl_error = () => {
        const Sizable = {
          string: { unit: "znak\xF3w", verb: "mie\u0107" },
          file: { unit: "bajt\xF3w", verb: "mie\u0107" },
          array: { unit: "element\xF3w", verb: "mie\u0107" },
          set: { unit: "element\xF3w", verb: "mie\u0107" },
          map: { unit: "element\xF3w", verb: "mie\u0107" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "wyra\u017Cenie",
          email: "adres email",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "data i godzina w formacie ISO",
          date: "data w formacie ISO",
          time: "godzina w formacie ISO",
          duration: "czas trwania ISO",
          ipv4: "adres IPv4",
          ipv6: "adres IPv6",
          mac: "adres MAC",
          cidrv4: "zakres IPv4",
          cidrv6: "zakres IPv6",
          base64: "ci\u0105g znak\xF3w zakodowany w formacie base64",
          base64url: "ci\u0105g znak\xF3w zakodowany w formacie base64url",
          json_string: "ci\u0105g znak\xF3w w formacie JSON",
          e164: "liczba E.164",
          credit_card: "numer karty kredytowej",
          jwt: "JWT",
          template_literal: "wej\u015Bcie",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "liczba",
          array: "tablica",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano instanceof "
                  .concat(issue.expected, ", otrzymano ")
                  .concat(received);
              }
              return "Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano "
                .concat(expected, ", otrzymano ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Nieprawid\u0142owa opcja: oczekiwano jednej z warto\u015Bci ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Za du\u017Ca warto\u015B\u0107: oczekiwano, \u017Ce "
                  .concat(
                    issue.origin ?? "warto\u015B\u0107",
                    " b\u0119dzie mie\u0107 ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "element\xF3w");
              }
              return "Zbyt du\u017C(y/a/e): oczekiwano, \u017Ce "
                .concat(
                  issue.origin ?? "warto\u015B\u0107",
                  " b\u0119dzie wynosi\u0107 ",
                )
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Za ma\u0142a warto\u015B\u0107: oczekiwano, \u017Ce "
                  .concat(
                    issue.origin ?? "warto\u015B\u0107",
                    " b\u0119dzie mie\u0107 ",
                  )
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit ?? "element\xF3w");
              }
              return "Zbyt ma\u0142(y/a/e): oczekiwano, \u017Ce "
                .concat(
                  issue.origin ?? "warto\u015B\u0107",
                  " b\u0119dzie wynosi\u0107 ",
                )
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zaczyna\u0107 si\u0119 od "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Nieprawid\u0142owy ci\u0105g znak\xF3w: musi ko\u0144czy\u0107 si\u0119 na "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zawiera\u0107 "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Nieprawid\u0142owy ci\u0105g znak\xF3w: musi odpowiada\u0107 wzorcowi ".concat(
                  _issue.pattern,
                );
              return "Nieprawid\u0142ow(y/a/e) ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Nieprawid\u0142owa liczba: musi by\u0107 wielokrotno\u015Bci\u0105 ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Nierozpoznane klucze"
                .concat(issue.keys.length > 1 ? "s" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Nieprawid\u0142owy klucz w ".concat(issue.origin);
            case "invalid_union":
              return "Nieprawid\u0142owe dane wej\u015Bciowe";
            case "invalid_element":
              return "Nieprawid\u0142owa warto\u015B\u0107 w ".concat(
                issue.origin,
              );
            default:
              return "Nieprawid\u0142owe dane wej\u015Bciowe";
          }
        };
      };
      function pl() {
        return {
          localeError: pl_error(),
        };
      }
      const pt_error = () => {
        const Sizable = {
          string: { unit: "caracteres" },
          file: { unit: "bytes" },
          array: { unit: "elementos" },
          set: { unit: "elementos" },
          map: { unit: "entradas" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "a entrada",
          email: "o endere\xE7o de e-mail",
          url: "o URL",
          emoji: "o emoji",
          uuid: "o UUID",
          uuidv4: "o UUIDv4",
          uuidv6: "o UUIDv6",
          nanoid: "o nanoid",
          guid: "o GUID",
          cuid: "o cuid",
          cuid2: "o cuid2",
          ulid: "o ULID",
          xid: "o XID",
          ksuid: "o KSUID",
          datetime: "a data e hora ISO",
          date: "a data ISO",
          time: "a hora ISO",
          duration: "a dura\xE7\xE3o ISO",
          ipv4: "o endere\xE7o IPv4",
          ipv6: "o endere\xE7o IPv6",
          mac: "o endere\xE7o MAC",
          cidrv4: "o intervalo de endere\xE7os IPv4",
          cidrv6: "o intervalo de endere\xE7os IPv6",
          base64: "o texto codificado em base64",
          base64url: "o texto codificado em base64url",
          json_string: "o texto JSON",
          e164: "o n\xFAmero E.164",
          credit_card: "o n\xFAmero de cart\xE3o de cr\xE9dito",
          jwt: "o JWT",
          template_literal: "a entrada",
        };
        const Gender = {
          masculine: { definite: "o", indefinite: "um" },
          feminine: { definite: "a", indefinite: "uma" },
        };
        const TypeDictionary = {
          string: { name: "texto", articles: Gender.masculine },
          number: { name: "n\xFAmero", articles: Gender.masculine },
          int: { name: "n\xFAmero inteiro", articles: Gender.masculine },
          boolean: { name: "valor booleano", articles: Gender.masculine },
          bigint: { name: "n\xFAmero bigint", articles: Gender.masculine },
          symbol: { name: "s\xEDmbolo", articles: Gender.masculine },
          undefined: { name: 'valor "undefined"', articles: Gender.masculine },
          null: { name: 'valor "nulo"', articles: Gender.masculine },
          never: { name: 'valor "never"', articles: Gender.masculine },
          void: { name: 'valor "void"', articles: Gender.masculine },
          date: { name: "data", articles: Gender.feminine },
          array: { name: "vetor", articles: Gender.masculine },
          object: { name: "objeto", articles: Gender.masculine },
          tuple: { name: "tuplo", articles: Gender.masculine },
          record: { name: "registo", articles: Gender.masculine },
          map: { name: "mapa", articles: Gender.masculine },
          set: { name: "conjunto", articles: Gender.masculine },
          file: { name: "ficheiro", articles: Gender.masculine },
          nonoptional: {
            name: "valor n\xE3o opcional",
            articles: Gender.masculine,
          },
          nan: { name: 'valor "NaN"', articles: Gender.masculine },
          // Compatibility: "nan" -> "NaN" for display
          function: { name: "fun\xE7\xE3o", articles: Gender.feminine },
        };
        function translateOriginWithArticle(type, articleType) {
          const translatedValue = TypeDictionary[type] ?? {
            name: 'valor "'.concat(type, '"'),
            articles: Gender.masculine,
          };
          return ""
            .concat(translatedValue.articles[articleType], " ")
            .concat(translatedValue.name);
        }
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = translateOriginWithArticle(
                issue.expected,
                "indefinite",
              );
              const receivedType = util.parsedType(issue.input);
              const received = translateOriginWithArticle(
                receivedType,
                "indefinite",
              );
              return "Entrada inv\xE1lida: esperava "
                .concat(expected, ", recebeu ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Entrada inv\xE1lida: esperava ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Op\xE7\xE3o inv\xE1lida: esperava uma das seguintes op\xE7\xF5es: ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Demasiado grande: esperava que "
                  .concat(
                    translateOriginWithArticle(issue.origin, "definite"),
                    " tivesse ",
                  )
                  .concat(adj, " ")
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elementos");
              return "Demasiado grande: esperava que "
                .concat(
                  translateOriginWithArticle(issue.origin, "definite"),
                  " fosse ",
                )
                .concat(adj, " ")
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Demasiado pequeno: esperava que "
                  .concat(
                    translateOriginWithArticle(issue.origin, "definite"),
                    " tivesse ",
                  )
                  .concat(adj, " ")
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit ?? "elementos");
              }
              return "Demasiado pequeno: esperava que "
                .concat(
                  translateOriginWithArticle(issue.origin, "definite"),
                  " fosse ",
                )
                .concat(adj, " ")
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Texto inv\xE1lido: deve come\xE7ar por "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Texto inv\xE1lido: deve terminar em "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Texto inv\xE1lido: deve incluir "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Texto inv\xE1lido: deve corresponder ao padr\xE3o ".concat(
                  _issue.pattern,
                );
              return "Formato d".concat(
                FormatDictionary[_issue.format] ?? issue.format,
                " inv\xE1lido",
              );
            }
            case "not_multiple_of":
              return "N\xFAmero inv\xE1lido: deve ser m\xFAltiplo de ".concat(
                issue.divisor,
              );
            case "unrecognized_keys": {
              const plural = issue.keys.length > 1 ? "s" : "";
              return "Chave"
                .concat(plural, " inv\xE1lida")
                .concat(plural, ": ")
                .concat(util.joinValues(issue.keys, ", "));
            }
            case "invalid_key":
              return "Entrada inv\xE1lida n".concat(
                translateOriginWithArticle(issue.origin, "definite"),
              );
            case "invalid_union":
              if (
                issue.options &&
                Array.isArray(issue.options) &&
                issue.options.length > 0
              ) {
                const opts = issue.options
                  .map((o) => "'".concat(o, "'"))
                  .join(" | ");
                return "Valor de discrimina\xE7\xE3o inv\xE1lido. Esperava ".concat(
                  opts,
                );
              }
              return "Entrada inv\xE1lida";
            case "invalid_element":
              return "Entrada inv\xE1lida n".concat(
                translateOriginWithArticle(issue.origin, "definite"),
              );
            default:
              return "Entrada inv\xE1lida";
          }
        };
      };
      function pt() {
        return {
          localeError: pt_error(),
        };
      }
      const pt_BR_error = () => {
        const Sizable = {
          string: { unit: "caracteres" },
          file: { unit: "bytes" },
          array: { unit: "elementos" },
          set: { unit: "elementos" },
          map: { unit: "entradas" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "a entrada",
          email: "o endere\xE7o de e-mail",
          url: "o URL",
          emoji: "o emoji",
          uuid: "o UUID",
          uuidv4: "o UUIDv4",
          uuidv6: "o UUIDv6",
          nanoid: "o nanoid",
          guid: "o GUID",
          cuid: "o cuid",
          cuid2: "o cuid2",
          ulid: "o ULID",
          xid: "o XID",
          ksuid: "o KSUID",
          datetime: "a data e hora ISO",
          date: "a data ISO",
          time: "a hora ISO",
          duration: "a dura\xE7\xE3o ISO",
          ipv4: "o endere\xE7o IPv4",
          ipv6: "o endere\xE7o IPv6",
          mac: "o endere\xE7o MAC",
          cidrv4: "a faixa de endere\xE7os IPv4",
          cidrv6: "a faixa de endere\xE7os IPv6",
          base64: "o texto codificado em base64",
          base64url: "o texto codificado em base64url",
          json_string: "o texto JSON",
          e164: "o n\xFAmero E.164",
          credit_card: "o n\xFAmero de cart\xE3o de cr\xE9dito",
          jwt: "o JWT",
          template_literal: "a entrada",
        };
        const Gender = {
          masculine: { definite: "o", indefinite: "um" },
          feminine: { definite: "a", indefinite: "uma" },
        };
        const TypeDictionary = {
          string: { name: "texto", articles: Gender.masculine },
          number: { name: "n\xFAmero", articles: Gender.masculine },
          int: { name: "n\xFAmero inteiro", articles: Gender.masculine },
          boolean: { name: "valor booleano", articles: Gender.masculine },
          bigint: { name: "n\xFAmero bigint", articles: Gender.masculine },
          symbol: { name: "s\xEDmbolo", articles: Gender.masculine },
          undefined: { name: 'valor "undefined"', articles: Gender.masculine },
          null: { name: 'valor "nulo"', articles: Gender.masculine },
          never: { name: 'valor "never"', articles: Gender.masculine },
          void: { name: 'valor "void"', articles: Gender.masculine },
          date: { name: "data", articles: Gender.feminine },
          array: { name: "vetor", articles: Gender.masculine },
          object: { name: "objeto", articles: Gender.masculine },
          tuple: { name: "tupla", articles: Gender.feminine },
          record: { name: "registro", articles: Gender.masculine },
          map: { name: "mapa", articles: Gender.masculine },
          set: { name: "conjunto", articles: Gender.masculine },
          file: { name: "arquivo", articles: Gender.masculine },
          nonoptional: {
            name: "valor n\xE3o opcional",
            articles: Gender.masculine,
          },
          nan: { name: 'valor "NaN"', articles: Gender.masculine },
          // Compatibility: "nan" -> "NaN" for display
          function: { name: "fun\xE7\xE3o", articles: Gender.feminine },
        };
        function translateOriginWithArticle(type, articleType) {
          const translatedValue = TypeDictionary[type] ?? {
            name: 'valor "'.concat(type, '"'),
            articles: Gender.masculine,
          };
          return ""
            .concat(translatedValue.articles[articleType], " ")
            .concat(translatedValue.name);
        }
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = translateOriginWithArticle(
                issue.expected,
                "indefinite",
              );
              const receivedType = util.parsedType(issue.input);
              const received = translateOriginWithArticle(
                receivedType,
                "indefinite",
              );
              return "Entrada inv\xE1lida: esperava "
                .concat(expected, ", recebeu ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Entrada inv\xE1lida: esperava ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Op\xE7\xE3o inv\xE1lida: esperava uma das seguintes op\xE7\xF5es: ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Grande demais: esperava que "
                  .concat(
                    translateOriginWithArticle(issue.origin, "definite"),
                    " tivesse ",
                  )
                  .concat(adj, " ")
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elementos");
              return "Grande demais: esperava que "
                .concat(
                  translateOriginWithArticle(issue.origin, "definite"),
                  " fosse ",
                )
                .concat(adj, " ")
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Pequeno demais: esperava que "
                  .concat(
                    translateOriginWithArticle(issue.origin, "definite"),
                    " tivesse ",
                  )
                  .concat(adj, " ")
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit ?? "elementos");
              }
              return "Pequeno demais: esperava que "
                .concat(
                  translateOriginWithArticle(issue.origin, "definite"),
                  " fosse ",
                )
                .concat(adj, " ")
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return 'Texto inv\xE1lido: deve come\xE7ar com "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return 'Texto inv\xE1lido: deve terminar com "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Texto inv\xE1lido: deve incluir "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Texto inv\xE1lido: deve corresponder ao padr\xE3o ".concat(
                  _issue.pattern,
                );
              return "Formato d".concat(
                FormatDictionary[_issue.format] ?? issue.format,
                " inv\xE1lido",
              );
            }
            case "not_multiple_of":
              return "N\xFAmero inv\xE1lido: deve ser m\xFAltiplo de ".concat(
                issue.divisor,
              );
            case "unrecognized_keys": {
              const plural = issue.keys.length > 1 ? "s" : "";
              return "Chave"
                .concat(plural, " inv\xE1lida")
                .concat(plural, ": ")
                .concat(util.joinValues(issue.keys, ", "));
            }
            case "invalid_key":
              return "Entrada inv\xE1lida n".concat(
                translateOriginWithArticle(issue.origin, "definite"),
              );
            case "invalid_union":
              if (
                issue.options &&
                Array.isArray(issue.options) &&
                issue.options.length > 0
              ) {
                const opts = issue.options
                  .map((o) => "'".concat(o, "'"))
                  .join(" | ");
                return "Valor de discrimina\xE7\xE3o inv\xE1lido. Esperava ".concat(
                  opts,
                );
              }
              return "Entrada inv\xE1lida";
            case "invalid_element":
              return "Entrada inv\xE1lida n".concat(
                translateOriginWithArticle(issue.origin, "definite"),
              );
            default:
              return "Entrada inv\xE1lida";
          }
        };
      };
      function pt_BR() {
        return {
          localeError: pt_BR_error(),
        };
      }
      const ro_error = () => {
        const Sizable = {
          string: { unit: "caractere", verb: "s\u0103 aib\u0103" },
          file: { unit: "octe\u021Bi", verb: "s\u0103 aib\u0103" },
          array: { unit: "elemente", verb: "s\u0103 aib\u0103" },
          set: { unit: "elemente", verb: "s\u0103 aib\u0103" },
          map: { unit: "intr\u0103ri", verb: "s\u0103 aib\u0103" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "intrare",
          email: "adres\u0103 de email",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "dat\u0103 \u0219i or\u0103 ISO",
          date: "dat\u0103 ISO",
          time: "or\u0103 ISO",
          duration: "durat\u0103 ISO",
          ipv4: "adres\u0103 IPv4",
          ipv6: "adres\u0103 IPv6",
          mac: "adres\u0103 MAC",
          cidrv4: "interval IPv4",
          cidrv6: "interval IPv6",
          base64: "\u0219ir codat base64",
          base64url: "\u0219ir codat base64url",
          json_string: "\u0219ir JSON",
          e164: "num\u0103r E.164",
          credit_card: "num\u0103r de card de credit",
          jwt: "JWT",
          template_literal: "intrare",
        };
        const TypeDictionary = {
          nan: "NaN",
          string: "\u0219ir",
          number: "num\u0103r",
          boolean: "boolean",
          function: "func\u021Bie",
          array: "matrice",
          object: "obiect",
          undefined: "nedefinit",
          symbol: "simbol",
          bigint: "num\u0103r mare",
          void: "void",
          never: "never",
          map: "hart\u0103",
          set: "set",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              return "Intrare invalid\u0103: a\u0219teptat "
                .concat(expected, ", primit ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Intrare invalid\u0103: a\u0219teptat ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Op\u021Biune invalid\u0103: a\u0219teptat una dintre ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Prea mare: a\u0219teptat ca "
                  .concat(issue.origin ?? "valoarea", " ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elemente");
              return "Prea mare: a\u0219teptat ca "
                .concat(issue.origin ?? "valoarea", " s\u0103 fie ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Prea mic: a\u0219teptat ca "
                  .concat(issue.origin, " ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Prea mic: a\u0219teptat ca "
                .concat(issue.origin, " s\u0103 fie ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u0218ir invalid: trebuie s\u0103 \xEEnceap\u0103 cu "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return '\u0218ir invalid: trebuie s\u0103 se termine cu "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u0218ir invalid: trebuie s\u0103 includ\u0103 "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u0218ir invalid: trebuie s\u0103 se potriveasc\u0103 cu modelul ".concat(
                  _issue.pattern,
                );
              return "Format invalid: ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Num\u0103r invalid: trebuie s\u0103 fie multiplu de ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Chei nerecunoscute: ".concat(
                util.joinValues(issue.keys, ", "),
              );
            case "invalid_key":
              return "Cheie invalid\u0103 \xEEn ".concat(issue.origin);
            case "invalid_union":
              return "Intrare invalid\u0103";
            case "invalid_element":
              return "Valoare invalid\u0103 \xEEn ".concat(issue.origin);
            default:
              return "Intrare invalid\u0103";
          }
        };
      };
      function ro() {
        return {
          localeError: ro_error(),
        };
      }
      function getRussianPlural(count, one, few, many) {
        const absCount = Math.abs(count);
        const lastDigit = absCount % 10;
        const lastTwoDigits = absCount % 100;
        if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
          return many;
        }
        if (lastDigit === 1) {
          return one;
        }
        if (lastDigit >= 2 && lastDigit <= 4) {
          return few;
        }
        return many;
      }
      const ru_error = () => {
        const Sizable = {
          string: {
            unit: {
              one: "\u0441\u0438\u043C\u0432\u043E\u043B",
              few: "\u0441\u0438\u043C\u0432\u043E\u043B\u0430",
              many: "\u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432",
            },
            verb: "\u0438\u043C\u0435\u0442\u044C",
          },
          file: {
            unit: {
              one: "\u0431\u0430\u0439\u0442",
              few: "\u0431\u0430\u0439\u0442\u0430",
              many: "\u0431\u0430\u0439\u0442",
            },
            verb: "\u0438\u043C\u0435\u0442\u044C",
          },
          array: {
            unit: {
              one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
              few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
              many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
            },
            verb: "\u0438\u043C\u0435\u0442\u044C",
          },
          set: {
            unit: {
              one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
              few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
              many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
            },
            verb: "\u0438\u043C\u0435\u0442\u044C",
          },
          map: {
            unit: {
              one: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442",
              few: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430",
              many: "\u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432",
            },
            verb: "\u0438\u043C\u0435\u0442\u044C",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0432\u0432\u043E\u0434",
          email: "email \u0430\u0434\u0440\u0435\u0441",
          url: "URL",
          emoji: "\u044D\u043C\u043E\u0434\u0437\u0438",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "ISO \u0434\u0430\u0442\u0430 \u0438 \u0432\u0440\u0435\u043C\u044F",
          date: "ISO \u0434\u0430\u0442\u0430",
          time: "ISO \u0432\u0440\u0435\u043C\u044F",
          duration:
            "ISO \u0434\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0441\u0442\u044C",
          ipv4: "IPv4 \u0430\u0434\u0440\u0435\u0441",
          ipv6: "IPv6 \u0430\u0434\u0440\u0435\u0441",
          mac: "MAC \u0430\u0434\u0440\u0435\u0441",
          cidrv4: "IPv4 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
          cidrv6: "IPv6 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D",
          base64:
            "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64",
          base64url:
            "\u0441\u0442\u0440\u043E\u043A\u0430 \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 base64url",
          json_string: "JSON \u0441\u0442\u0440\u043E\u043A\u0430",
          e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
          credit_card:
            "\u043D\u043E\u043C\u0435\u0440 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u043E\u0439 \u043A\u0430\u0440\u0442\u044B",
          jwt: "JWT",
          template_literal: "\u0432\u0432\u043E\u0434",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u0447\u0438\u0441\u043B\u043E",
          array: "\u043C\u0430\u0441\u0441\u0438\u0432",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C instanceof "
                  .concat(
                    issue.expected,
                    ", \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ",
                  )
                  .concat(received);
              }
              return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C "
                .concat(
                  expected,
                  ", \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u043E ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0432\u043E\u0434: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0432\u0430\u0440\u0438\u0430\u043D\u0442: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0434\u043D\u043E \u0438\u0437 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                const maxValue = Number(issue.maximum);
                const unit = getRussianPlural(
                  maxValue,
                  sizing.unit.one,
                  sizing.unit.few,
                  sizing.unit.many,
                );
                return "\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E "
                  .concat(
                    issue.origin ??
                      "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",
                    " \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(unit);
              }
              return "\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E "
                .concat(
                  issue.origin ??
                    "\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435",
                  " \u0431\u0443\u0434\u0435\u0442 ",
                )
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                const minValue = Number(issue.minimum);
                const unit = getRussianPlural(
                  minValue,
                  sizing.unit.one,
                  sizing.unit.few,
                  sizing.unit.many,
                );
                return "\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E "
                  .concat(
                    issue.origin,
                    " \u0431\u0443\u0434\u0435\u0442 \u0438\u043C\u0435\u0442\u044C ",
                  )
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(unit);
              }
              return "\u0421\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u0435\u043D\u044C\u043A\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435: \u043E\u0436\u0438\u0434\u0430\u043B\u043E\u0441\u044C, \u0447\u0442\u043E "
                .concat(issue.origin, " \u0431\u0443\u0434\u0435\u0442 ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u043D\u0430\u0447\u0438\u043D\u0430\u0442\u044C\u0441\u044F \u0441 "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return '\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0437\u0430\u043A\u0430\u043D\u0447\u0438\u0432\u0430\u0442\u044C\u0441\u044F \u043D\u0430 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u041D\u0435\u0432\u0435\u0440\u043D\u0430\u044F \u0441\u0442\u0440\u043E\u043A\u0430: \u0434\u043E\u043B\u0436\u043D\u0430 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ".concat(
                  _issue.pattern,
                );
              return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0447\u0438\u0441\u043B\u043E: \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u043A\u0440\u0430\u0442\u043D\u044B\u043C ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "\u041D\u0435\u0440\u0430\u0441\u043F\u043E\u0437\u043D\u0430\u043D\u043D"
                .concat(
                  issue.keys.length > 1 ? "\u044B\u0435" : "\u044B\u0439",
                  " \u043A\u043B\u044E\u0447",
                )
                .concat(issue.keys.length > 1 ? "\u0438" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u043A\u043B\u044E\u0447 \u0432 ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435";
            case "invalid_element":
              return "\u041D\u0435\u0432\u0435\u0440\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0432 ".concat(
                issue.origin,
              );
            default:
              return "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0432\u0445\u043E\u0434\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435";
          }
        };
      };
      function ru() {
        return {
          localeError: ru_error(),
        };
      }
      const sk_error = () => {
        const Sizable = {
          string: { unit: "znakov", verb: "ma\u0165" },
          file: { unit: "bajtov", verb: "ma\u0165" },
          array: { unit: "prvkov", verb: "ma\u0165" },
          set: { unit: "prvkov", verb: "ma\u0165" },
          map: { unit: "polo\u017Eiek", verb: "ma\u0165" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "regul\xE1rny v\xFDraz",
          email: "e-mailov\xE1 adresa",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "d\xE1tum a \u010Das vo form\xE1te ISO",
          date: "d\xE1tum vo form\xE1te ISO",
          time: "\u010Das vo form\xE1te ISO",
          duration: "doba trvania ISO",
          ipv4: "IPv4 adresa",
          ipv6: "IPv6 adresa",
          mac: "MAC adresa",
          cidrv4: "rozsah IPv4",
          cidrv6: "rozsah IPv6",
          base64: "re\u0165azec zak\xF3dovan\xFD vo form\xE1te base64",
          base64url: "re\u0165azec zak\xF3dovan\xFD vo form\xE1te base64url",
          json_string: "re\u0165azec vo form\xE1te JSON",
          e164: "\u010D\xEDslo E.164",
          credit_card: "\u010D\xEDslo kreditnej karty",
          jwt: "JWT",
          template_literal: "vstup",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u010D\xEDslo",
          string: "re\u0165azec",
          function: "funkcia",
          array: "pole",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 instanceof "
                  .concat(issue.expected, ", obdr\u017Ean\xE9 ")
                  .concat(received);
              }
              return "Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 "
                .concat(expected, ", obdr\u017Ean\xE9 ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Neplatn\xFD vstup: o\u010Dak\xE1van\xE1 jedna z hodn\xF4t ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Hodnota je pr\xEDli\u0161 ve\u013Ek\xE1: "
                  .concat(issue.origin ?? "hodnota", " mus\xED ma\u0165 ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "prvkov");
              }
              return "Hodnota je pr\xEDli\u0161 ve\u013Ek\xE1: "
                .concat(issue.origin ?? "hodnota", " mus\xED by\u0165 ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Hodnota je pr\xEDli\u0161 mal\xE1: "
                  .concat(issue.origin ?? "hodnota", " mus\xED ma\u0165 ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit ?? "prvkov");
              }
              return "Hodnota je pr\xEDli\u0161 mal\xE1: "
                .concat(issue.origin ?? "hodnota", " mus\xED by\u0165 ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Neplatn\xFD re\u0165azec: mus\xED za\u010D\xEDna\u0165 na "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Neplatn\xFD re\u0165azec: mus\xED kon\u010Di\u0165 na "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Neplatn\xFD re\u0165azec: mus\xED obsahova\u0165 "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Neplatn\xFD re\u0165azec: mus\xED zodpoveda\u0165 vzoru ".concat(
                  _issue.pattern,
                );
              return "Neplatn\xFD form\xE1t ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Neplatn\xE9 \u010D\xEDslo: mus\xED by\u0165 n\xE1sobkom ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Nezn\xE1me kl\xFA\u010De: ".concat(
                util.joinValues(issue.keys, ", "),
              );
            case "invalid_key":
              return "Neplatn\xFD kl\xFA\u010D v ".concat(issue.origin);
            case "invalid_union":
              return "Neplatn\xFD vstup";
            case "invalid_element":
              return "Neplatn\xE1 hodnota v ".concat(issue.origin);
            default:
              return "Neplatn\xFD vstup";
          }
        };
      };
      function sk() {
        return {
          localeError: sk_error(),
        };
      }
      const sl_error = () => {
        const Sizable = {
          string: { unit: "znakov", verb: "imeti" },
          file: { unit: "bajtov", verb: "imeti" },
          array: { unit: "elementov", verb: "imeti" },
          set: { unit: "elementov", verb: "imeti" },
          map: { unit: "elementov", verb: "imeti" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "vnos",
          email: "e-po\u0161tni naslov",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO datum in \u010Das",
          date: "ISO datum",
          time: "ISO \u010Das",
          duration: "ISO trajanje",
          ipv4: "IPv4 naslov",
          ipv6: "IPv6 naslov",
          mac: "MAC naslov",
          cidrv4: "obseg IPv4",
          cidrv6: "obseg IPv6",
          base64: "base64 kodiran niz",
          base64url: "base64url kodiran niz",
          json_string: "JSON niz",
          e164: "E.164 \u0161tevilka",
          credit_card: "\u0161tevilka kreditne kartice",
          jwt: "JWT",
          template_literal: "vnos",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u0161tevilo",
          array: "tabela",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Neveljaven vnos: pri\u010Dakovano instanceof "
                  .concat(issue.expected, ", prejeto ")
                  .concat(received);
              }
              return "Neveljaven vnos: pri\u010Dakovano "
                .concat(expected, ", prejeto ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Neveljaven vnos: pri\u010Dakovano ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Neveljavna mo\u017Enost: pri\u010Dakovano eno izmed ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Preveliko: pri\u010Dakovano, da bo "
                  .concat(issue.origin ?? "vrednost", " imelo ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "elementov");
              return "Preveliko: pri\u010Dakovano, da bo "
                .concat(issue.origin ?? "vrednost", " ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Premajhno: pri\u010Dakovano, da bo "
                  .concat(issue.origin, " imelo ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Premajhno: pri\u010Dakovano, da bo "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return 'Neveljaven niz: mora se za\u010Deti z "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return 'Neveljaven niz: mora se kon\u010Dati z "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Neveljaven niz: mora vsebovati "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Neveljaven niz: mora ustrezati vzorcu ".concat(
                  _issue.pattern,
                );
              return "Neveljaven ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Neveljavno \u0161tevilo: mora biti ve\u010Dkratnik ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Neprepoznan"
                .concat(
                  issue.keys.length > 1 ? "i klju\u010Di" : " klju\u010D",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Neveljaven klju\u010D v ".concat(issue.origin);
            case "invalid_union":
              return "Neveljaven vnos";
            case "invalid_element":
              return "Neveljavna vrednost v ".concat(issue.origin);
            default:
              return "Neveljaven vnos";
          }
        };
      };
      function sl() {
        return {
          localeError: sl_error(),
        };
      }
      const sv_error = () => {
        const Sizable = {
          string: { unit: "tecken", verb: "att ha" },
          file: { unit: "bytes", verb: "att ha" },
          array: { unit: "objekt", verb: "att inneh\xE5lla" },
          set: { unit: "objekt", verb: "att inneh\xE5lla" },
          map: { unit: "objekt", verb: "att inneh\xE5lla" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "regulj\xE4rt uttryck",
          email: "e-postadress",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO-datum och tid",
          date: "ISO-datum",
          time: "ISO-tid",
          duration: "ISO-varaktighet",
          ipv4: "IPv4-adress",
          ipv6: "IPv6-adress",
          mac: "MAC-adress",
          cidrv4: "IPv4-spektrum",
          cidrv6: "IPv6-spektrum",
          base64: "base64-kodad str\xE4ng",
          base64url: "base64url-kodad str\xE4ng",
          json_string: "JSON-str\xE4ng",
          e164: "E.164-nummer",
          credit_card: "kreditkortsnummer",
          jwt: "JWT",
          template_literal: "mall-literal",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "antal",
          array: "lista",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Ogiltig inmatning: f\xF6rv\xE4ntat instanceof "
                  .concat(issue.expected, ", fick ")
                  .concat(received);
              }
              return "Ogiltig inmatning: f\xF6rv\xE4ntat "
                .concat(expected, ", fick ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Ogiltig inmatning: f\xF6rv\xE4ntat ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Ogiltigt val: f\xF6rv\xE4ntade en av ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "F\xF6r stor(t): f\xF6rv\xE4ntade "
                  .concat(issue.origin ?? "v\xE4rdet", " att ha ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "element");
              }
              return "F\xF6r stor(t): f\xF6rv\xE4ntat "
                .concat(issue.origin ?? "v\xE4rdet", " att ha ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "F\xF6r lite(t): f\xF6rv\xE4ntade "
                  .concat(issue.origin ?? "v\xE4rdet", " att ha ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "F\xF6r lite(t): f\xF6rv\xE4ntade "
                .concat(issue.origin ?? "v\xE4rdet", " att ha ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return 'Ogiltig str\xE4ng: m\xE5ste b\xF6rja med "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return 'Ogiltig str\xE4ng: m\xE5ste sluta med "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Ogiltig str\xE4ng: m\xE5ste inneh\xE5lla "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return 'Ogiltig str\xE4ng: m\xE5ste matcha m\xF6nstret "'.concat(
                  _issue.pattern,
                  '"',
                );
              return "Ogiltig(t) ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Ogiltigt tal: m\xE5ste vara en multipel av ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return ""
                .concat(
                  issue.keys.length > 1
                    ? "Ok\xE4nda nycklar"
                    : "Ok\xE4nd nyckel",
                  ": ",
                )
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "Ogiltig nyckel i ".concat(issue.origin ?? "v\xE4rdet");
            case "invalid_union":
              return "Ogiltig input";
            case "invalid_element":
              return "Ogiltigt v\xE4rde i ".concat(issue.origin ?? "v\xE4rdet");
            default:
              return "Ogiltig input";
          }
        };
      };
      function sv() {
        return {
          localeError: sv_error(),
        };
      }
      const ta_error = () => {
        const Sizable = {
          string: {
            unit: "\u0B8E\u0BB4\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BCD\u0B95\u0BB3\u0BCD",
            verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
          },
          file: {
            unit: "\u0BAA\u0BC8\u0B9F\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD",
            verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
          },
          array: {
            unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
            verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
          },
          set: {
            unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
            verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
          },
          map: {
            unit: "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
            verb: "\u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBF\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1",
          email:
            "\u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BCD \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "ISO \u0BA4\u0BC7\u0BA4\u0BBF \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
          date: "ISO \u0BA4\u0BC7\u0BA4\u0BBF",
          time: "ISO \u0BA8\u0BC7\u0BB0\u0BAE\u0BCD",
          duration: "ISO \u0B95\u0BBE\u0BB2 \u0B85\u0BB3\u0BB5\u0BC1",
          ipv4: "IPv4 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
          ipv6: "IPv6 \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
          mac: "MAC \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
          cidrv4: "IPv4 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
          cidrv6: "IPv6 \u0BB5\u0BB0\u0BAE\u0BCD\u0BAA\u0BC1",
          base64: "base64-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
          base64url: "base64url-encoded \u0B9A\u0BB0\u0BAE\u0BCD",
          json_string: "JSON \u0B9A\u0BB0\u0BAE\u0BCD",
          e164: "E.164 \u0B8E\u0BA3\u0BCD",
          credit_card:
            "\u0B95\u0B9F\u0BA9\u0BCD \u0B85\u0B9F\u0BCD\u0B9F\u0BC8 \u0B8E\u0BA3\u0BCD",
          jwt: "JWT",
          template_literal: "input",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u0B8E\u0BA3\u0BCD",
          array: "\u0B85\u0BA3\u0BBF",
          null: "\u0BB5\u0BC6\u0BB1\u0BC1\u0BAE\u0BC8",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 instanceof "
                  .concat(
                    issue.expected,
                    ", \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ",
                  )
                  .concat(received);
              }
              return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 "
                .concat(
                  expected,
                  ", \u0BAA\u0BC6\u0BB1\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BCD: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 ".concat(
                util.joinValues(issue.values, "|"),
                " \u0B87\u0BB2\u0BCD \u0B92\u0BA9\u0BCD\u0BB1\u0BC1",
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 "
                  .concat(
                    issue.origin ??
                      "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1",
                    " ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ??
                      "\u0B89\u0BB1\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BB3\u0BCD",
                    " \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
                  );
              }
              return "\u0BAE\u0BBF\u0B95 \u0BAA\u0BC6\u0BB0\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 "
                .concat(
                  issue.origin ?? "\u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1",
                  " ",
                )
                .concat(adj)
                .concat(
                  issue.maximum.toString(),
                  " \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
                );
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 "
                  .concat(issue.origin, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(
                    sizing.unit,
                    " \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
                  );
              }
              return "\u0BAE\u0BBF\u0B95\u0B9A\u0BCD \u0B9A\u0BBF\u0BB1\u0BBF\u0BAF\u0BA4\u0BC1: \u0B8E\u0BA4\u0BBF\u0BB0\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(
                  issue.minimum.toString(),
                  " \u0B86\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
                );
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "'.concat(
                  _issue.prefix,
                  '" \u0B87\u0BB2\u0BCD \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD',
                );
              if (_issue.format === "ends_with")
                return '\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "'.concat(
                  _issue.suffix,
                  '" \u0B87\u0BB2\u0BCD \u0BAE\u0BC1\u0B9F\u0BBF\u0BB5\u0B9F\u0BC8\u0BAF \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD',
                );
              if (_issue.format === "includes")
                return '\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: "'.concat(
                  _issue.includes,
                  '" \u0B90 \u0B89\u0BB3\u0BCD\u0BB3\u0B9F\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD',
                );
              if (_issue.format === "regex")
                return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B9A\u0BB0\u0BAE\u0BCD: ".concat(
                  _issue.pattern,
                  " \u0BAE\u0BC1\u0BB1\u0BC8\u0BAA\u0BBE\u0B9F\u0BCD\u0B9F\u0BC1\u0B9F\u0BA9\u0BCD \u0BAA\u0BCA\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
                );
              return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B8E\u0BA3\u0BCD: ".concat(
                issue.divisor,
                " \u0B87\u0BA9\u0BCD \u0BAA\u0BB2\u0BAE\u0BBE\u0B95 \u0B87\u0BB0\u0BC1\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD",
              );
            case "unrecognized_keys":
              return "\u0B85\u0B9F\u0BC8\u0BAF\u0BBE\u0BB3\u0BAE\u0BCD \u0BA4\u0BC6\u0BB0\u0BBF\u0BAF\u0BBE\u0BA4 \u0BB5\u0BBF\u0B9A\u0BC8"
                .concat(issue.keys.length > 1 ? "\u0B95\u0BB3\u0BCD" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "".concat(
                issue.origin,
                " \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BB5\u0BBF\u0B9A\u0BC8",
              );
            case "invalid_union":
              return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1";
            case "invalid_element":
              return "".concat(
                issue.origin,
                " \u0B87\u0BB2\u0BCD \u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0BAE\u0BA4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1",
              );
            default:
              return "\u0BA4\u0BB5\u0BB1\u0BBE\u0BA9 \u0B89\u0BB3\u0BCD\u0BB3\u0BC0\u0B9F\u0BC1";
          }
        };
      };
      function ta() {
        return {
          localeError: ta_error(),
        };
      }
      const th_error = () => {
        const Sizable = {
          string: {
            unit: "\u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23",
            verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
          },
          file: {
            unit: "\u0E44\u0E1A\u0E15\u0E4C",
            verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
          },
          array: {
            unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
            verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
          },
          set: {
            unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
            verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
          },
          map: {
            unit: "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
            verb: "\u0E04\u0E27\u0E23\u0E21\u0E35",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex:
            "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19",
          email:
            "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48\u0E2D\u0E35\u0E40\u0E21\u0E25",
          url: "URL",
          emoji: "\u0E2D\u0E34\u0E42\u0E21\u0E08\u0E34",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
          date: "\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E41\u0E1A\u0E1A ISO",
          time: "\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
          duration:
            "\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A ISO",
          ipv4: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv4",
          ipv6: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 IPv6",
          mac: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 MAC",
          cidrv4: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv4",
          cidrv6: "\u0E0A\u0E48\u0E27\u0E07 IP \u0E41\u0E1A\u0E1A IPv6",
          base64:
            "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64",
          base64url:
            "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A Base64 \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A URL",
          json_string:
            "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E41\u0E1A\u0E1A JSON",
          e164: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07\u0E1B\u0E23\u0E30\u0E40\u0E17\u0E28 (E.164)",
          credit_card:
            "\u0E2B\u0E21\u0E32\u0E22\u0E40\u0E25\u0E02\u0E1A\u0E31\u0E15\u0E23\u0E40\u0E04\u0E23\u0E14\u0E34\u0E15",
          jwt: "\u0E42\u0E17\u0E40\u0E04\u0E19 JWT",
          template_literal:
            "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E1B\u0E49\u0E2D\u0E19",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02",
          array: "\u0E2D\u0E32\u0E23\u0E4C\u0E40\u0E23\u0E22\u0E4C (Array)",
          null: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E04\u0E48\u0E32 (null)",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 instanceof "
                  .concat(
                    issue.expected,
                    " \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ",
                  )
                  .concat(received);
              }
              return "\u0E1B\u0E23\u0E30\u0E40\u0E20\u0E17\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 "
                .concat(
                  expected,
                  " \u0E41\u0E15\u0E48\u0E44\u0E14\u0E49\u0E23\u0E31\u0E1A ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u0E04\u0E48\u0E32\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19 ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E04\u0E27\u0E23\u0E40\u0E1B\u0E47\u0E19\u0E2B\u0E19\u0E36\u0E48\u0E07\u0E43\u0E19 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive
                ? "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19"
                : "\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: "
                  .concat(
                    issue.origin ?? "\u0E04\u0E48\u0E32",
                    " \u0E04\u0E27\u0E23\u0E21\u0E35",
                  )
                  .concat(adj, " ")
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ?? "\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23",
                  );
              return "\u0E40\u0E01\u0E34\u0E19\u0E01\u0E33\u0E2B\u0E19\u0E14: "
                .concat(
                  issue.origin ?? "\u0E04\u0E48\u0E32",
                  " \u0E04\u0E27\u0E23\u0E21\u0E35",
                )
                .concat(adj, " ")
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive
                ? "\u0E2D\u0E22\u0E48\u0E32\u0E07\u0E19\u0E49\u0E2D\u0E22"
                : "\u0E21\u0E32\u0E01\u0E01\u0E27\u0E48\u0E32";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: "
                  .concat(issue.origin, " \u0E04\u0E27\u0E23\u0E21\u0E35")
                  .concat(adj, " ")
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "\u0E19\u0E49\u0E2D\u0E22\u0E01\u0E27\u0E48\u0E32\u0E01\u0E33\u0E2B\u0E19\u0E14: "
                .concat(issue.origin, " \u0E04\u0E27\u0E23\u0E21\u0E35")
                .concat(adj, " ")
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E02\u0E36\u0E49\u0E19\u0E15\u0E49\u0E19\u0E14\u0E49\u0E27\u0E22 "'.concat(
                  _issue.prefix,
                  '"',
                );
              }
              if (_issue.format === "ends_with")
                return '\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E25\u0E07\u0E17\u0E49\u0E32\u0E22\u0E14\u0E49\u0E27\u0E22 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21\u0E15\u0E49\u0E2D\u0E07\u0E21\u0E35 "'.concat(
                  _issue.includes,
                  '" \u0E2D\u0E22\u0E39\u0E48\u0E43\u0E19\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21',
                );
              if (_issue.format === "regex")
                return "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14 ".concat(
                  _issue.pattern,
                );
              return "\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E02\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E15\u0E49\u0E2D\u0E07\u0E40\u0E1B\u0E47\u0E19\u0E08\u0E33\u0E19\u0E27\u0E19\u0E17\u0E35\u0E48\u0E2B\u0E32\u0E23\u0E14\u0E49\u0E27\u0E22 ".concat(
                issue.divisor,
                " \u0E44\u0E14\u0E49\u0E25\u0E07\u0E15\u0E31\u0E27",
              );
            case "unrecognized_keys":
              return "\u0E1E\u0E1A\u0E04\u0E35\u0E22\u0E4C\u0E17\u0E35\u0E48\u0E44\u0E21\u0E48\u0E23\u0E39\u0E49\u0E08\u0E31\u0E01: ".concat(
                util.joinValues(issue.keys, ", "),
              );
            case "invalid_key":
              return "\u0E04\u0E35\u0E22\u0E4C\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07: \u0E44\u0E21\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E23\u0E39\u0E1B\u0E41\u0E1A\u0E1A\u0E22\u0E39\u0E40\u0E19\u0E35\u0E22\u0E19\u0E17\u0E35\u0E48\u0E01\u0E33\u0E2B\u0E19\u0E14\u0E44\u0E27\u0E49";
            case "invalid_element":
              return "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07\u0E43\u0E19 ".concat(
                issue.origin,
              );
            default:
              return "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07";
          }
        };
      };
      function th() {
        return {
          localeError: th_error(),
        };
      }
      const tk_error = () => {
        const Sizable = {
          string: { unit: "simwol", verb: "bolmaly" },
          file: { unit: "ba\xFDt", verb: "bolmaly" },
          array: { unit: "elementler", verb: "bolmaly" },
          set: { unit: "elementler", verb: "bolmaly" },
          map: { unit: "elementler", verb: "bolmaly" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "giri\u015F",
          email: "e-po\xE7ta salgysy",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO sene we wagt",
          date: "ISO sene",
          time: "ISO wagt",
          duration: "ISO wagt aralygy",
          ipv4: "IPv4 salgysy",
          ipv6: "IPv6 salgysy",
          mac: "MAC salgysy",
          cidrv4: "IPv4 aralygy",
          cidrv6: "IPv6 aralygy",
          base64: "base64 bilen \u015Fifrlenen setir",
          base64url: "base64url bilen \u015Fifrlenen setir",
          json_string: "JSON setiri",
          e164: "E.164 nomeri",
          credit_card: "kredit kartyny\u0148 nomeri",
          jwt: "JWT",
          template_literal: "\u015Fablon",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              return "N\xE4dogry baha: gara\u015Fylan "
                .concat(expected, " \xFDerine ")
                .concat(received, " alyndy");
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "N\xE4dogry baha: ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                  " bolmaly",
                );
              return "N\xE4dogry sa\xFDlaw: a\u015Fakdakylardan biri bolmaly: ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Has uly: gara\u015Fyl\xFDan "
                  .concat(issue.origin ?? "baha", " ")
                  .concat(adj, " ")
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "element");
              return "Has uly: gara\u015Fyl\xFDan "
                .concat(issue.origin ?? "baha", " ")
                .concat(adj, " ")
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Has ki\xE7i: gara\u015Fyl\xFDan "
                  .concat(issue.origin, " ")
                  .concat(adj, " ")
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              return "Has ki\xE7i: gara\u015Fyl\xFDan "
                .concat(issue.origin, " ")
                .concat(adj, " ")
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'N\xE4dogry setir: "'.concat(
                  _issue.prefix,
                  '" bilen ba\u015Flamaly',
                );
              if (_issue.format === "ends_with")
                return 'N\xE4dogry setir: "'.concat(
                  _issue.suffix,
                  '" bilen gutarmaly',
                );
              if (_issue.format === "includes")
                return 'N\xE4dogry setir: "'.concat(
                  _issue.includes,
                  '" saklamaly',
                );
              if (_issue.format === "regex")
                return "N\xE4dogry setir: ".concat(
                  _issue.pattern,
                  " nusga la\xFDyk bolmaly",
                );
              return "N\xE4dogry ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "N\xE4dogry san: ".concat(
                issue.divisor,
                " bilen galyndysyz b\xF6l\xFCnmeli",
              );
            case "unrecognized_keys":
              return "Tanalma\xFDan a\xE7ar"
                .concat(issue.keys.length > 1 ? "lar" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "".concat(issue.origin, " i\xE7inde n\xE4dogry a\xE7ar");
            case "invalid_union":
              return "N\xE4dogry baha";
            case "invalid_element":
              return "".concat(issue.origin, " i\xE7inde n\xE4dogry baha");
            default:
              return "N\xE4dogry baha";
          }
        };
      };
      function tk() {
        return {
          localeError: tk_error(),
        };
      }
      const tr_error = () => {
        const Sizable = {
          string: { unit: "karakter", verb: "olmal\u0131" },
          file: { unit: "bayt", verb: "olmal\u0131" },
          array: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
          set: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
          map: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "girdi",
          email: "e-posta adresi",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO tarih ve saat",
          date: "ISO tarih",
          time: "ISO saat",
          duration: "ISO s\xFCre",
          ipv4: "IPv4 adresi",
          ipv6: "IPv6 adresi",
          mac: "MAC adresi",
          cidrv4: "IPv4 aral\u0131\u011F\u0131",
          cidrv6: "IPv6 aral\u0131\u011F\u0131",
          base64: "base64 ile \u015Fifrelenmi\u015F metin",
          base64url: "base64url ile \u015Fifrelenmi\u015F metin",
          json_string: "JSON dizesi",
          e164: "E.164 say\u0131s\u0131",
          credit_card: "kredi kart\u0131 numaras\u0131",
          jwt: "JWT",
          template_literal: "\u015Eablon dizesi",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Ge\xE7ersiz de\u011Fer: beklenen instanceof "
                  .concat(issue.expected, ", al\u0131nan ")
                  .concat(received);
              }
              return "Ge\xE7ersiz de\u011Fer: beklenen "
                .concat(expected, ", al\u0131nan ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Ge\xE7ersiz de\u011Fer: beklenen ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Ge\xE7ersiz se\xE7enek: a\u015Fa\u011F\u0131dakilerden biri olmal\u0131: ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\xC7ok b\xFCy\xFCk: beklenen "
                  .concat(issue.origin ?? "de\u011Fer", " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "\xF6\u011Fe");
              return "\xC7ok b\xFCy\xFCk: beklenen "
                .concat(issue.origin ?? "de\u011Fer", " ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\xC7ok k\xFC\xE7\xFCk: beklenen "
                  .concat(issue.origin, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              return "\xC7ok k\xFC\xE7\xFCk: beklenen "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Ge\xE7ersiz metin: "'.concat(
                  _issue.prefix,
                  '" ile ba\u015Flamal\u0131',
                );
              if (_issue.format === "ends_with")
                return 'Ge\xE7ersiz metin: "'.concat(
                  _issue.suffix,
                  '" ile bitmeli',
                );
              if (_issue.format === "includes")
                return 'Ge\xE7ersiz metin: "'.concat(
                  _issue.includes,
                  '" i\xE7ermeli',
                );
              if (_issue.format === "regex")
                return "Ge\xE7ersiz metin: ".concat(
                  _issue.pattern,
                  " desenine uymal\u0131",
                );
              return "Ge\xE7ersiz ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Ge\xE7ersiz say\u0131: ".concat(
                issue.divisor,
                " ile tam b\xF6l\xFCnebilmeli",
              );
            case "unrecognized_keys":
              return "Tan\u0131nmayan anahtar"
                .concat(issue.keys.length > 1 ? "lar" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "".concat(issue.origin, " i\xE7inde ge\xE7ersiz anahtar");
            case "invalid_union":
              return "Ge\xE7ersiz de\u011Fer";
            case "invalid_element":
              return "".concat(
                issue.origin,
                " i\xE7inde ge\xE7ersiz de\u011Fer",
              );
            default:
              return "Ge\xE7ersiz de\u011Fer";
          }
        };
      };
      function tr() {
        return {
          localeError: tr_error(),
        };
      }
      const uk_error = () => {
        const Sizable = {
          string: {
            unit: "\u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432",
            verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
          },
          file: {
            unit: "\u0431\u0430\u0439\u0442\u0456\u0432",
            verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
          },
          array: {
            unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
            verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
          },
          set: {
            unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
            verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
          },
          map: {
            unit: "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
            verb: "\u043C\u0430\u0442\u0438\u043C\u0435",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex:
            "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456",
          email:
            "\u0430\u0434\u0440\u0435\u0441\u0430 \u0435\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u043E\u0457 \u043F\u043E\u0448\u0442\u0438",
          url: "URL",
          emoji: "\u0435\u043C\u043E\u0434\u0437\u0456",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime:
            "\u0434\u0430\u0442\u0430 \u0442\u0430 \u0447\u0430\u0441 ISO",
          date: "\u0434\u0430\u0442\u0430 ISO",
          time: "\u0447\u0430\u0441 ISO",
          duration:
            "\u0442\u0440\u0438\u0432\u0430\u043B\u0456\u0441\u0442\u044C ISO",
          ipv4: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv4",
          ipv6: "\u0430\u0434\u0440\u0435\u0441\u0430 IPv6",
          mac: "\u0430\u0434\u0440\u0435\u0441\u0430 MAC",
          cidrv4: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv4",
          cidrv6: "\u0434\u0456\u0430\u043F\u0430\u0437\u043E\u043D IPv6",
          base64:
            "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64",
          base64url:
            "\u0440\u044F\u0434\u043E\u043A \u0443 \u043A\u043E\u0434\u0443\u0432\u0430\u043D\u043D\u0456 base64url",
          json_string: "\u0440\u044F\u0434\u043E\u043A JSON",
          e164: "\u043D\u043E\u043C\u0435\u0440 E.164",
          credit_card:
            "\u043D\u043E\u043C\u0435\u0440 \u043A\u0440\u0435\u0434\u0438\u0442\u043D\u043E\u0457 \u043A\u0430\u0440\u0442\u043A\u0438",
          jwt: "JWT",
          template_literal:
            "\u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u0447\u0438\u0441\u043B\u043E",
          array: "\u043C\u0430\u0441\u0438\u0432",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F instanceof "
                  .concat(
                    issue.expected,
                    ", \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ",
                  )
                  .concat(received);
              }
              return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F "
                .concat(
                  expected,
                  ", \u043E\u0442\u0440\u0438\u043C\u0430\u043D\u043E ",
                )
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0430 \u043E\u043F\u0446\u0456\u044F: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F \u043E\u0434\u043D\u0435 \u0437 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E "
                  .concat(
                    issue.origin ??
                      "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",
                    " ",
                  )
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ??
                      "\u0435\u043B\u0435\u043C\u0435\u043D\u0442\u0456\u0432",
                  );
              return "\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u0432\u0435\u043B\u0438\u043A\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E "
                .concat(
                  issue.origin ??
                    "\u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F",
                  " \u0431\u0443\u0434\u0435 ",
                )
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E "
                  .concat(issue.origin, " ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "\u0417\u0430\u043D\u0430\u0434\u0442\u043E \u043C\u0430\u043B\u0435: \u043E\u0447\u0456\u043A\u0443\u0454\u0442\u044C\u0441\u044F, \u0449\u043E "
                .concat(issue.origin, " \u0431\u0443\u0434\u0435 ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043F\u043E\u0447\u0438\u043D\u0430\u0442\u0438\u0441\u044F \u0437 "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return '\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0437\u0430\u043A\u0456\u043D\u0447\u0443\u0432\u0430\u0442\u0438\u0441\u044F \u043D\u0430 "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u043C\u0456\u0441\u0442\u0438\u0442\u0438 "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u0440\u044F\u0434\u043E\u043A: \u043F\u043E\u0432\u0438\u043D\u0435\u043D \u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u0430\u0442\u0438 \u0448\u0430\u0431\u043B\u043E\u043D\u0443 ".concat(
                  _issue.pattern,
                );
              return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0447\u0438\u0441\u043B\u043E: \u043F\u043E\u0432\u0438\u043D\u043D\u043E \u0431\u0443\u0442\u0438 \u043A\u0440\u0430\u0442\u043D\u0438\u043C ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "\u041D\u0435\u0440\u043E\u0437\u043F\u0456\u0437\u043D\u0430\u043D\u0438\u0439 \u043A\u043B\u044E\u0447"
                .concat(issue.keys.length > 1 ? "\u0456" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0438\u0439 \u043A\u043B\u044E\u0447 \u0443 ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456";
            case "invalid_element":
              return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u043D\u044F \u0443 ".concat(
                issue.origin,
              );
            default:
              return "\u041D\u0435\u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0456 \u0432\u0445\u0456\u0434\u043D\u0456 \u0434\u0430\u043D\u0456";
          }
        };
      };
      function uk() {
        return {
          localeError: uk_error(),
        };
      }
      function ua() {
        return uk();
      }
      const ur_error = () => {
        const Sizable = {
          string: {
            unit: "\u062D\u0631\u0648\u0641",
            verb: "\u06C1\u0648\u0646\u0627",
          },
          file: {
            unit: "\u0628\u0627\u0626\u0679\u0633",
            verb: "\u06C1\u0648\u0646\u0627",
          },
          array: {
            unit: "\u0622\u0626\u0679\u0645\u0632",
            verb: "\u06C1\u0648\u0646\u0627",
          },
          set: {
            unit: "\u0622\u0626\u0679\u0645\u0632",
            verb: "\u06C1\u0648\u0646\u0627",
          },
          map: {
            unit: "\u0622\u0626\u0679\u0645\u0632",
            verb: "\u06C1\u0648\u0646\u0627",
          },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0627\u0646 \u067E\u0679",
          email:
            "\u0627\u06CC \u0645\u06CC\u0644 \u0627\u06CC\u0688\u0631\u06CC\u0633",
          url: "\u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644",
          emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
          uuid: "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
          uuidv4:
            "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 4",
          uuidv6:
            "\u06CC\u0648 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC \u0648\u06CC 6",
          nanoid: "\u0646\u06CC\u0646\u0648 \u0622\u0626\u06CC \u0688\u06CC",
          guid: "\u062C\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
          cuid: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
          cuid2: "\u0633\u06CC \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC 2",
          ulid: "\u06CC\u0648 \u0627\u06CC\u0644 \u0622\u0626\u06CC \u0688\u06CC",
          xid: "\u0627\u06CC\u06A9\u0633 \u0622\u0626\u06CC \u0688\u06CC",
          ksuid:
            "\u06A9\u06D2 \u0627\u06CC\u0633 \u06CC\u0648 \u0622\u0626\u06CC \u0688\u06CC",
          datetime:
            "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0688\u06CC\u0679 \u0679\u0627\u0626\u0645",
          date: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u062A\u0627\u0631\u06CC\u062E",
          time: "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0648\u0642\u062A",
          duration:
            "\u0622\u0626\u06CC \u0627\u06CC\u0633 \u0627\u0648 \u0645\u062F\u062A",
          ipv4: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0627\u06CC\u0688\u0631\u06CC\u0633",
          ipv6: "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0627\u06CC\u0688\u0631\u06CC\u0633",
          mac: "\u0627\u06CC\u0645 \u0627\u06D2 \u0633\u06CC \u0627\u06CC\u0688\u0631\u06CC\u0633",
          cidrv4:
            "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 4 \u0631\u06CC\u0646\u062C",
          cidrv6:
            "\u0622\u0626\u06CC \u067E\u06CC \u0648\u06CC 6 \u0631\u06CC\u0646\u062C",
          base64:
            "\u0628\u06CC\u0633 64 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
          base64url:
            "\u0628\u06CC\u0633 64 \u06CC\u0648 \u0622\u0631 \u0627\u06CC\u0644 \u0627\u0646 \u06A9\u0648\u0688\u0688 \u0633\u0679\u0631\u0646\u06AF",
          json_string:
            "\u062C\u06D2 \u0627\u06CC\u0633 \u0627\u0648 \u0627\u06CC\u0646 \u0633\u0679\u0631\u0646\u06AF",
          e164: "\u0627\u06CC 164 \u0646\u0645\u0628\u0631",
          credit_card:
            "\u06A9\u0631\u06CC\u0688\u0679 \u06A9\u0627\u0631\u0688 \u0646\u0645\u0628\u0631",
          jwt: "\u062C\u06D2 \u0688\u0628\u0644\u06CC\u0648 \u0679\u06CC",
          template_literal: "\u0627\u0646 \u067E\u0679",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u0646\u0645\u0628\u0631",
          array: "\u0622\u0631\u06D2",
          null: "\u0646\u0644",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: instanceof "
                  .concat(
                    issue.expected,
                    " \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ",
                  )
                  .concat(
                    received,
                    " \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627",
                  );
              }
              return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: "
                .concat(
                  expected,
                  " \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627\u060C ",
                )
                .concat(
                  received,
                  " \u0645\u0648\u0635\u0648\u0644 \u06C1\u0648\u0627",
                );
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679: ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                  " \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627",
                );
              return "\u063A\u0644\u0637 \u0622\u067E\u0634\u0646: ".concat(
                util.joinValues(issue.values, "|"),
                " \u0645\u06CC\u06BA \u0633\u06D2 \u0627\u06CC\u06A9 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627",
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u0628\u06C1\u062A \u0628\u0691\u0627: "
                  .concat(
                    issue.origin ?? "\u0648\u06CC\u0644\u06CC\u0648",
                    " \u06A9\u06D2 ",
                  )
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(
                    sizing.unit ?? "\u0639\u0646\u0627\u0635\u0631",
                    " \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2",
                  );
              return "\u0628\u06C1\u062A \u0628\u0691\u0627: "
                .concat(
                  issue.origin ?? "\u0648\u06CC\u0644\u06CC\u0648",
                  " \u06A9\u0627 ",
                )
                .concat(adj)
                .concat(
                  issue.maximum.toString(),
                  " \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627",
                );
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: "
                  .concat(issue.origin, " \u06A9\u06D2 ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(
                    sizing.unit,
                    " \u06C1\u0648\u0646\u06D2 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u06D2",
                  );
              }
              return "\u0628\u06C1\u062A \u0686\u06BE\u0648\u0679\u0627: "
                .concat(issue.origin, " \u06A9\u0627 ")
                .concat(adj)
                .concat(
                  issue.minimum.toString(),
                  " \u06C1\u0648\u0646\u0627 \u0645\u062A\u0648\u0642\u0639 \u062A\u06BE\u0627",
                );
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "'.concat(
                  _issue.prefix,
                  '" \u0633\u06D2 \u0634\u0631\u0648\u0639 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2',
                );
              }
              if (_issue.format === "ends_with")
                return '\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "'.concat(
                  _issue.suffix,
                  '" \u067E\u0631 \u062E\u062A\u0645 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2',
                );
              if (_issue.format === "includes")
                return '\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: "'.concat(
                  _issue.includes,
                  '" \u0634\u0627\u0645\u0644 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2',
                );
              if (_issue.format === "regex")
                return "\u063A\u0644\u0637 \u0633\u0679\u0631\u0646\u06AF: \u067E\u06CC\u0679\u0631\u0646 ".concat(
                  _issue.pattern,
                  " \u0633\u06D2 \u0645\u06CC\u0686 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2",
                );
              return "\u063A\u0644\u0637 ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u063A\u0644\u0637 \u0646\u0645\u0628\u0631: ".concat(
                issue.divisor,
                " \u06A9\u0627 \u0645\u0636\u0627\u0639\u0641 \u06C1\u0648\u0646\u0627 \u0686\u0627\u06C1\u06CC\u06D2",
              );
            case "unrecognized_keys":
              return "\u063A\u06CC\u0631 \u062A\u0633\u0644\u06CC\u0645 \u0634\u062F\u06C1 \u06A9\u06CC"
                .concat(issue.keys.length > 1 ? "\u0632" : "", ": ")
                .concat(util.joinValues(issue.keys, "\u060C "));
            case "invalid_key":
              return "".concat(
                issue.origin,
                " \u0645\u06CC\u06BA \u063A\u0644\u0637 \u06A9\u06CC",
              );
            case "invalid_union":
              return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679";
            case "invalid_element":
              return "".concat(
                issue.origin,
                " \u0645\u06CC\u06BA \u063A\u0644\u0637 \u0648\u06CC\u0644\u06CC\u0648",
              );
            default:
              return "\u063A\u0644\u0637 \u0627\u0646 \u067E\u0679";
          }
        };
      };
      function ur() {
        return {
          localeError: ur_error(),
        };
      }
      const uz_error = () => {
        const Sizable = {
          string: { unit: "belgi", verb: "bo\u2018lishi kerak" },
          file: { unit: "bayt", verb: "bo\u2018lishi kerak" },
          array: { unit: "element", verb: "bo\u2018lishi kerak" },
          set: { unit: "element", verb: "bo\u2018lishi kerak" },
          map: { unit: "yozuv", verb: "bo\u2018lishi kerak" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "kirish",
          email: "elektron pochta manzili",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO sana va vaqti",
          date: "ISO sana",
          time: "ISO vaqt",
          duration: "ISO davomiylik",
          ipv4: "IPv4 manzil",
          ipv6: "IPv6 manzil",
          mac: "MAC manzil",
          cidrv4: "IPv4 diapazon",
          cidrv6: "IPv6 diapazon",
          base64: "base64 kodlangan satr",
          base64url: "base64url kodlangan satr",
          json_string: "JSON satr",
          e164: "E.164 raqam",
          credit_card: "kredit karta raqami",
          jwt: "JWT",
          template_literal: "kirish",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "raqam",
          array: "massiv",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "Noto\u2018g\u2018ri kirish: kutilgan instanceof "
                  .concat(issue.expected, ", qabul qilingan ")
                  .concat(received);
              }
              return "Noto\u2018g\u2018ri kirish: kutilgan "
                .concat(expected, ", qabul qilingan ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "Noto\u2018g\u2018ri kirish: kutilgan ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "Noto\u2018g\u2018ri variant: quyidagilardan biri kutilgan ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Juda katta: kutilgan "
                  .concat(issue.origin ?? "qiymat", " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit, " ")
                  .concat(sizing.verb);
              return "Juda katta: kutilgan "
                .concat(issue.origin ?? "qiymat", " ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Juda kichik: kutilgan "
                  .concat(issue.origin, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit, " ")
                  .concat(sizing.verb);
              }
              return "Juda kichik: kutilgan "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Noto\u2018g\u2018ri satr: "'.concat(
                  _issue.prefix,
                  '" bilan boshlanishi kerak',
                );
              if (_issue.format === "ends_with")
                return 'Noto\u2018g\u2018ri satr: "'.concat(
                  _issue.suffix,
                  '" bilan tugashi kerak',
                );
              if (_issue.format === "includes")
                return 'Noto\u2018g\u2018ri satr: "'.concat(
                  _issue.includes,
                  '" ni o\u2018z ichiga olishi kerak',
                );
              if (_issue.format === "regex")
                return "Noto\u2018g\u2018ri satr: ".concat(
                  _issue.pattern,
                  " shabloniga mos kelishi kerak",
                );
              return "Noto\u2018g\u2018ri ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "Noto\u2018g\u2018ri raqam: ".concat(
                issue.divisor,
                " ning karralisi bo\u2018lishi kerak",
              );
            case "unrecognized_keys":
              return "Noma\u2019lum kalit"
                .concat(issue.keys.length > 1 ? "lar" : "", ": ")
                .concat(util.joinValues(issue.keys, ", "));
            case "invalid_key":
              return "".concat(issue.origin, " dagi kalit noto\u2018g\u2018ri");
            case "invalid_union":
              return "Noto\u2018g\u2018ri kirish";
            case "invalid_element":
              return "".concat(issue.origin, " da noto\u2018g\u2018ri qiymat");
            default:
              return "Noto\u2018g\u2018ri kirish";
          }
        };
      };
      function uz() {
        return {
          localeError: uz_error(),
        };
      }
      const vi_error = () => {
        const Sizable = {
          string: { unit: "k\xFD t\u1EF1", verb: "c\xF3" },
          file: { unit: "byte", verb: "c\xF3" },
          array: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
          set: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
          map: { unit: "ph\u1EA7n t\u1EED", verb: "c\xF3" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u0111\u1EA7u v\xE0o",
          email: "\u0111\u1ECBa ch\u1EC9 email",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ng\xE0y gi\u1EDD ISO",
          date: "ng\xE0y ISO",
          time: "gi\u1EDD ISO",
          duration: "kho\u1EA3ng th\u1EDDi gian ISO",
          ipv4: "\u0111\u1ECBa ch\u1EC9 IPv4",
          ipv6: "\u0111\u1ECBa ch\u1EC9 IPv6",
          mac: "\u0111\u1ECBa ch\u1EC9 MAC",
          cidrv4: "d\u1EA3i IPv4",
          cidrv6: "d\u1EA3i IPv6",
          base64: "chu\u1ED7i m\xE3 h\xF3a base64",
          base64url: "chu\u1ED7i m\xE3 h\xF3a base64url",
          json_string: "chu\u1ED7i JSON",
          e164: "s\u1ED1 E.164",
          credit_card: "s\u1ED1 th\u1EBB t\xEDn d\u1EE5ng",
          jwt: "JWT",
          template_literal: "\u0111\u1EA7u v\xE0o",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "s\u1ED1",
          array: "m\u1EA3ng",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i instanceof "
                  .concat(issue.expected, ", nh\u1EADn \u0111\u01B0\u1EE3c ")
                  .concat(received);
              }
              return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i "
                .concat(expected, ", nh\u1EADn \u0111\u01B0\u1EE3c ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "T\xF9y ch\u1ECDn kh\xF4ng h\u1EE3p l\u1EC7: mong \u0111\u1EE3i m\u1ED9t trong c\xE1c gi\xE1 tr\u1ECB ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i "
                  .concat(issue.origin ?? "gi\xE1 tr\u1ECB", " ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "ph\u1EA7n t\u1EED");
              return "Qu\xE1 l\u1EDBn: mong \u0111\u1EE3i "
                .concat(issue.origin ?? "gi\xE1 tr\u1ECB", " ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i "
                  .concat(issue.origin, " ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "Qu\xE1 nh\u1ECF: mong \u0111\u1EE3i "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return 'Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i b\u1EAFt \u0111\u1EA7u b\u1EB1ng "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return 'Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i k\u1EBFt th\xFAc b\u1EB1ng "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return 'Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i bao g\u1ED3m "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "Chu\u1ED7i kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i kh\u1EDBp v\u1EDBi m\u1EABu ".concat(
                  _issue.pattern,
                );
              return "".concat(
                FormatDictionary[_issue.format] ?? issue.format,
                " kh\xF4ng h\u1EE3p l\u1EC7",
              );
            }
            case "not_multiple_of":
              return "S\u1ED1 kh\xF4ng h\u1EE3p l\u1EC7: ph\u1EA3i l\xE0 b\u1ED9i s\u1ED1 c\u1EE7a ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "Kh\xF3a kh\xF4ng \u0111\u01B0\u1EE3c nh\u1EADn d\u1EA1ng: ".concat(
                util.joinValues(issue.keys, ", "),
              );
            case "invalid_key":
              return "Kh\xF3a kh\xF4ng h\u1EE3p l\u1EC7 trong ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7";
            case "invalid_element":
              return "Gi\xE1 tr\u1ECB kh\xF4ng h\u1EE3p l\u1EC7 trong ".concat(
                issue.origin,
              );
            default:
              return "\u0110\u1EA7u v\xE0o kh\xF4ng h\u1EE3p l\u1EC7";
          }
        };
      };
      function vi() {
        return {
          localeError: vi_error(),
        };
      }
      const zh_CN_error = () => {
        const Sizable = {
          string: { unit: "\u5B57\u7B26", verb: "\u5305\u542B" },
          file: { unit: "\u5B57\u8282", verb: "\u5305\u542B" },
          array: { unit: "\u9879", verb: "\u5305\u542B" },
          set: { unit: "\u9879", verb: "\u5305\u542B" },
          map: { unit: "\u9879", verb: "\u5305\u542B" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u8F93\u5165",
          email: "\u7535\u5B50\u90AE\u4EF6",
          url: "URL",
          emoji: "\u8868\u60C5\u7B26\u53F7",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO\u65E5\u671F\u65F6\u95F4",
          date: "ISO\u65E5\u671F",
          time: "ISO\u65F6\u95F4",
          duration: "ISO\u65F6\u957F",
          ipv4: "IPv4\u5730\u5740",
          ipv6: "IPv6\u5730\u5740",
          mac: "MAC\u5730\u5740",
          cidrv4: "IPv4\u7F51\u6BB5",
          cidrv6: "IPv6\u7F51\u6BB5",
          base64: "base64\u7F16\u7801\u5B57\u7B26\u4E32",
          base64url: "base64url\u7F16\u7801\u5B57\u7B26\u4E32",
          json_string: "JSON\u5B57\u7B26\u4E32",
          e164: "E.164\u53F7\u7801",
          credit_card: "\u4FE1\u7528\u5361\u53F7",
          jwt: "JWT",
          template_literal: "\u8F93\u5165",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "\u6570\u5B57",
          array: "\u6570\u7EC4",
          null: "\u7A7A\u503C(null)",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B instanceof "
                  .concat(issue.expected, "\uFF0C\u5B9E\u9645\u63A5\u6536 ")
                  .concat(received);
              }
              return "\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B "
                .concat(expected, "\uFF0C\u5B9E\u9645\u63A5\u6536 ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u65E0\u6548\u9009\u9879\uFF1A\u671F\u671B\u4EE5\u4E0B\u4E4B\u4E00 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B "
                  .concat(issue.origin ?? "\u503C", " ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "\u4E2A\u5143\u7D20");
              return "\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B "
                .concat(issue.origin ?? "\u503C", " ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B "
                  .concat(issue.origin, " ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B "
                .concat(issue.origin, " ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "'.concat(
                  _issue.prefix,
                  '" \u5F00\u5934',
                );
              if (_issue.format === "ends_with")
                return '\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "'.concat(
                  _issue.suffix,
                  '" \u7ED3\u5C3E',
                );
              if (_issue.format === "includes")
                return '\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u5305\u542B "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u6EE1\u8DB3\u6B63\u5219\u8868\u8FBE\u5F0F ".concat(
                  _issue.pattern,
                );
              return "\u65E0\u6548".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u65E0\u6548\u6570\u5B57\uFF1A\u5FC5\u987B\u662F ".concat(
                issue.divisor,
                " \u7684\u500D\u6570",
              );
            case "unrecognized_keys":
              return "\u51FA\u73B0\u672A\u77E5\u7684\u952E(key): ".concat(
                util.joinValues(issue.keys, ", "),
              );
            case "invalid_key":
              return "".concat(
                issue.origin,
                " \u4E2D\u7684\u952E(key)\u65E0\u6548",
              );
            case "invalid_union":
              return "\u65E0\u6548\u8F93\u5165";
            case "invalid_element":
              return "".concat(
                issue.origin,
                " \u4E2D\u5305\u542B\u65E0\u6548\u503C(value)",
              );
            default:
              return "\u65E0\u6548\u8F93\u5165";
          }
        };
      };
      function zh_CN() {
        return {
          localeError: zh_CN_error(),
        };
      }
      const zh_TW_error = () => {
        const Sizable = {
          string: { unit: "\u5B57\u5143", verb: "\u64C1\u6709" },
          file: { unit: "\u4F4D\u5143\u7D44", verb: "\u64C1\u6709" },
          array: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
          set: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
          map: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u8F38\u5165",
          email: "\u90F5\u4EF6\u5730\u5740",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "ISO \u65E5\u671F\u6642\u9593",
          date: "ISO \u65E5\u671F",
          time: "ISO \u6642\u9593",
          duration: "ISO \u671F\u9593",
          ipv4: "IPv4 \u4F4D\u5740",
          ipv6: "IPv6 \u4F4D\u5740",
          mac: "MAC \u4F4D\u5740",
          cidrv4: "IPv4 \u7BC4\u570D",
          cidrv6: "IPv6 \u7BC4\u570D",
          base64: "base64 \u7DE8\u78BC\u5B57\u4E32",
          base64url: "base64url \u7DE8\u78BC\u5B57\u4E32",
          json_string: "JSON \u5B57\u4E32",
          e164: "E.164 \u6578\u503C",
          credit_card: "\u4FE1\u7528\u5361\u865F",
          jwt: "JWT",
          template_literal: "\u8F38\u5165",
        };
        const TypeDictionary = {
          nan: "NaN",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA instanceof "
                  .concat(issue.expected, "\uFF0C\u4F46\u6536\u5230 ")
                  .concat(received);
              }
              return "\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA "
                .concat(expected, "\uFF0C\u4F46\u6536\u5230 ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\u7121\u6548\u7684\u9078\u9805\uFF1A\u9810\u671F\u70BA\u4EE5\u4E0B\u5176\u4E2D\u4E4B\u4E00 ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F "
                  .concat(issue.origin ?? "\u503C", " \u61C9\u70BA ")
                  .concat(adj)
                  .concat(issue.maximum.toString(), " ")
                  .concat(sizing.unit ?? "\u500B\u5143\u7D20");
              return "\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F "
                .concat(issue.origin ?? "\u503C", " \u61C9\u70BA ")
                .concat(adj)
                .concat(issue.maximum.toString());
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing) {
                return "\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F "
                  .concat(issue.origin, " \u61C9\u70BA ")
                  .concat(adj)
                  .concat(issue.minimum.toString(), " ")
                  .concat(sizing.unit);
              }
              return "\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F "
                .concat(issue.origin, " \u61C9\u70BA ")
                .concat(adj)
                .concat(issue.minimum.toString());
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with") {
                return '\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "'.concat(
                  _issue.prefix,
                  '" \u958B\u982D',
                );
              }
              if (_issue.format === "ends_with")
                return '\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "'.concat(
                  _issue.suffix,
                  '" \u7D50\u5C3E',
                );
              if (_issue.format === "includes")
                return '\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u5305\u542B "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u7B26\u5408\u683C\u5F0F ".concat(
                  _issue.pattern,
                );
              return "\u7121\u6548\u7684 ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "\u7121\u6548\u7684\u6578\u5B57\uFF1A\u5FC5\u9808\u70BA ".concat(
                issue.divisor,
                " \u7684\u500D\u6578",
              );
            case "unrecognized_keys":
              return "\u7121\u6CD5\u8B58\u5225\u7684\u9375\u503C"
                .concat(issue.keys.length > 1 ? "\u5011" : "", "\uFF1A")
                .concat(util.joinValues(issue.keys, "\u3001"));
            case "invalid_key":
              return "".concat(
                issue.origin,
                " \u4E2D\u6709\u7121\u6548\u7684\u9375\u503C",
              );
            case "invalid_union":
              return "\u7121\u6548\u7684\u8F38\u5165\u503C";
            case "invalid_element":
              return "".concat(
                issue.origin,
                " \u4E2D\u6709\u7121\u6548\u7684\u503C",
              );
            default:
              return "\u7121\u6548\u7684\u8F38\u5165\u503C";
          }
        };
      };
      function zh_TW() {
        return {
          localeError: zh_TW_error(),
        };
      }
      const yo_error = () => {
        const Sizable = {
          string: { unit: "\xE0mi", verb: "n\xED" },
          file: { unit: "bytes", verb: "n\xED" },
          array: { unit: "nkan", verb: "n\xED" },
          set: { unit: "nkan", verb: "n\xED" },
          map: { unit: "nkan", verb: "n\xED" },
        };
        function getSizing(origin) {
          return Sizable[origin] ?? null;
        }
        const FormatDictionary = {
          regex: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9",
          email: "\xE0d\xEDr\u1EB9\u0301s\xEC \xECm\u1EB9\u0301l\xEC",
          url: "URL",
          emoji: "emoji",
          uuid: "UUID",
          uuidv4: "UUIDv4",
          uuidv6: "UUIDv6",
          nanoid: "nanoid",
          guid: "GUID",
          cuid: "cuid",
          cuid2: "cuid2",
          ulid: "ULID",
          xid: "XID",
          ksuid: "KSUID",
          datetime: "\xE0k\xF3k\xF2 ISO",
          date: "\u1ECDj\u1ECD\u0301 ISO",
          time: "\xE0k\xF3k\xF2 ISO",
          duration: "\xE0k\xF3k\xF2 t\xF3 p\xE9 ISO",
          ipv4: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv4",
          ipv6: "\xE0d\xEDr\u1EB9\u0301s\xEC IPv6",
          mac: "\xE0d\xEDr\u1EB9\u0301s\xEC MAC",
          cidrv4: "\xE0gb\xE8gb\xE8 IPv4",
          cidrv6: "\xE0gb\xE8gb\xE8 IPv6",
          base64:
            "\u1ECD\u0300r\u1ECD\u0300 t\xED a k\u1ECD\u0301 n\xED base64",
          base64url: "\u1ECD\u0300r\u1ECD\u0300 base64url",
          json_string: "\u1ECD\u0300r\u1ECD\u0300 JSON",
          e164: "n\u1ECD\u0301mb\xE0 E.164",
          credit_card: "n\u1ECDmba kaadi gbese",
          jwt: "JWT",
          template_literal: "\u1EB9\u0300r\u1ECD \xECb\xE1w\u1ECDl\xE9",
        };
        const TypeDictionary = {
          nan: "NaN",
          number: "n\u1ECD\u0301mb\xE0",
          array: "akop\u1ECD",
        };
        return (issue) => {
          switch (issue.code) {
            case "invalid_type": {
              const expected = TypeDictionary[issue.expected] ?? issue.expected;
              const receivedType = util.parsedType(issue.input);
              const received = TypeDictionary[receivedType] ?? receivedType;
              if (/^[A-Z]/.test(issue.expected)) {
                return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi instanceof "
                  .concat(issue.expected, ", \xE0m\u1ECD\u0300 a r\xED ")
                  .concat(received);
              }
              return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi "
                .concat(expected, ", \xE0m\u1ECD\u0300 a r\xED ")
                .concat(received);
            }
            case "invalid_value":
              if (issue.values.length === 1)
                return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e: a n\xED l\xE1ti fi ".concat(
                  util.stringifyPrimitive(issue.values[0]),
                );
              return "\xC0\u1E63\xE0y\xE0n a\u1E63\xEC\u1E63e: yan \u1ECD\u0300kan l\xE1ra ".concat(
                util.joinValues(issue.values, "|"),
              );
            case "too_big": {
              const adj = issue.inclusive ? "<=" : "<";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 "
                  .concat(issue.origin ?? "iye", " ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.maximum, " ")
                  .concat(sizing.unit);
              return "T\xF3 p\u1ECD\u0300 j\xF9: a n\xED l\xE1ti j\u1EB9\u0301 "
                .concat(adj)
                .concat(issue.maximum);
            }
            case "too_small": {
              const adj = issue.inclusive ? ">=" : ">";
              const sizing = getSizing(issue.origin);
              if (sizing)
                return "K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 p\xE9 "
                  .concat(issue.origin, " ")
                  .concat(sizing.verb, " ")
                  .concat(adj)
                  .concat(issue.minimum, " ")
                  .concat(sizing.unit);
              return "K\xE9r\xE9 ju: a n\xED l\xE1ti j\u1EB9\u0301 "
                .concat(adj)
                .concat(issue.minimum);
            }
            case "invalid_format": {
              const _issue = issue;
              if (_issue.format === "starts_with")
                return '\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\u1EB9\u0300r\u1EB9\u0300 p\u1EB9\u0300l\xFA "'.concat(
                  _issue.prefix,
                  '"',
                );
              if (_issue.format === "ends_with")
                return '\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 par\xED p\u1EB9\u0300l\xFA "'.concat(
                  _issue.suffix,
                  '"',
                );
              if (_issue.format === "includes")
                return '\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 n\xED "'.concat(
                  _issue.includes,
                  '"',
                );
              if (_issue.format === "regex")
                return "\u1ECC\u0300r\u1ECD\u0300 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 b\xE1 \xE0p\u1EB9\u1EB9r\u1EB9 mu ".concat(
                  _issue.pattern,
                );
              return "A\u1E63\xEC\u1E63e: ".concat(
                FormatDictionary[_issue.format] ?? issue.format,
              );
            }
            case "not_multiple_of":
              return "N\u1ECD\u0301mb\xE0 a\u1E63\xEC\u1E63e: gb\u1ECD\u0301d\u1ECD\u0300 j\u1EB9\u0301 \xE8y\xE0 p\xEDp\xEDn ti ".concat(
                issue.divisor,
              );
            case "unrecognized_keys":
              return "B\u1ECDt\xECn\xEC \xE0\xECm\u1ECD\u0300: ".concat(
                util.joinValues(issue.keys, ", "),
              );
            case "invalid_key":
              return "B\u1ECDt\xECn\xEC a\u1E63\xEC\u1E63e n\xEDn\xFA ".concat(
                issue.origin,
              );
            case "invalid_union":
              return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
            case "invalid_element":
              return "Iye a\u1E63\xEC\u1E63e n\xEDn\xFA ".concat(issue.origin);
            default:
              return "\xCCb\xE1w\u1ECDl\xE9 a\u1E63\xEC\u1E63e";
          }
        };
      };
      function yo() {
        return {
          localeError: yo_error(),
        };
      }
      var registries = __webpack_require__(2345);
      var core_doc = __webpack_require__(5782);
      const INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid");
      const FALLBACK_FLAG = /* @__PURE__ */ Symbol.for("zod.compile.fallback");
      class ZodCompileAsyncError extends Error {
        constructor(
          message = "z.compile does not support async refinements, transforms, or checks",
        ) {
          super(message);
          this.name = "ZodCompileAsyncError";
        }
      }
      class ZodCompileUnsupportedError extends Error {
        constructor(feature, islandable = true) {
          super(
            "z.compile does not support ".concat(
              feature,
              "; this schema must use the runtime parser",
            ),
          );
          this.name = "ZodCompileUnsupportedError";
          this.islandable = islandable;
        }
      }
      function compileValidator(schema, parser) {
        try {
          return compileFn(schema, { assertOnly: true });
        } catch {
          return parser;
        }
      }
      function compile(schema, options) {
        try {
          const parser = compileFn(schema);
          const clone = util.clone(schema);
          const liveRun = schema._zod.run;
          const originalRun = liveRun.__originalRun ?? liveRun;
          const wrapped = (payload, ctx) => {
            if (
              ctx?.async ||
              ctx?.direction === "backward" ||
              ctx?.skipChecks ||
              ctx?.[FALLBACK_FLAG]
            ) {
              return originalRun(payload, ctx);
            }
            if (ctx && (0, memoizer.TE)(ctx, payload.value)) {
              return originalRun(payload, ctx);
            }
            const out = parser(payload.value);
            if (out !== INVALID) {
              payload.value = out;
              return payload;
            }
            if (ctx) ctx[FALLBACK_FLAG] = true;
            return originalRun(payload, ctx);
          };
          wrapped.__originalRun = originalRun;
          clone._zod.bag.fallbackRun = originalRun;
          clone._zod.bag.validator = compileValidator(schema, parser);
          clone._zod.run = wrapped;
          if (!liveRun.__originalRun)
            installCompiledUserMethods(clone, schema, parser);
          return clone;
        } catch (err) {
          if (options?.strict) throw err;
          return schema;
        }
      }
      function installCompiledUserMethods(target, source, parser) {
        const targetAny = target;
        const sourceAny = source;
        if (typeof sourceAny.safeParse === "function") {
          const originalSafeParse = sourceAny.safeParse;
          targetAny.safeParse = (data, params) => {
            const out = parser(data);
            if (out !== INVALID) {
              return { success: true, data: out };
            }
            return originalSafeParse(data, params);
          };
        }
        if (typeof sourceAny.parse === "function") {
          const originalParse = sourceAny.parse;
          targetAny.parse = (data, params) => {
            const out = parser(data);
            if (out !== INVALID) {
              return out;
            }
            return originalParse(data, params);
          };
        }
      }
      function compileFn(schema, options) {
        let recursive = true;
        try {
          recursive = (0, memoizer.Kw)(schema);
        } catch {}
        if (recursive) {
          throw new ZodCompileUnsupportedError(
            "a schema whose subtree contains a reference cycle",
          );
        }
        const ctx = {
          constants: /* @__PURE__ */ new Map(),
          constantCounter: 0,
          varCounter: 0,
        };
        const doc = new core_doc.J(["input"]);
        const outputAccessor = generateCheck(
          doc,
          ctx,
          schema,
          "input",
          !options?.assertOnly,
        );
        doc.write(
          outputAccessor === null
            ? "return true;"
            : "return ".concat(outputAccessor, ";"),
        );
        const constantNames = ["INVALID", ...ctx.constants.keys()];
        const constantValues = [INVALID, ...ctx.constants.values()];
        const code = doc.content.join("\n");
        const fullCode = options?.debug
          ? constantNames.length > 0
            ? "// Constants: "
                .concat(constantNames.join(", "), "\n")
                .concat(code)
            : code
          : "";
        const F = Function;
        const factoryCode = "return (input) => {\n".concat(code, "\n}");
        let fn;
        try {
          const factory = new F(...constantNames, factoryCode);
          fn = factory(...constantValues);
        } catch (err) {
          throw new ZodCompileUnsupportedError(
            "this schema (generated code failed to evaluate: ".concat(
              err.message,
              ")",
            ),
          );
        }
        if (options?.debug) {
          fn.code = fullCode;
        }
        return fn;
      }
      function addConstant(ctx, value) {
        for (const [name2, v] of ctx.constants) {
          if (v === value) return name2;
        }
        const name = "c".concat(ctx.constantCounter++);
        ctx.constants.set(name, value);
        return name;
      }
      function newVar(ctx) {
        return "v".concat(ctx.varCounter++);
      }
      function runtimeRun(schema, value) {
        const result = schema._zod.run({ value, issues: [] }, {});
        if (result && typeof result.then === "function") return INVALID;
        const r = result;
        return r.issues.length === 0 ? r.value : INVALID;
      }
      function compileChild(doc, ctx, schema, accessor, needsValue = true) {
        const contentLen = doc.content.length;
        const constantCount = ctx.constants.size;
        const constantCounter = ctx.constantCounter;
        const varCounter = ctx.varCounter;
        try {
          return generateCheck(doc, ctx, schema, accessor, needsValue);
        } catch (err) {
          if (!(err instanceof ZodCompileUnsupportedError) || !err.islandable)
            throw err;
          doc.content.length = contentLen;
          if (ctx.constants.size > constantCount) {
            const trailing = Array.from(ctx.constants.keys()).slice(
              constantCount,
            );
            for (const k of trailing) ctx.constants.delete(k);
          }
          ctx.constantCounter = constantCounter;
          ctx.varCounter = varCounter;
          return emitRuntimeIsland(doc, ctx, schema, accessor);
        }
      }
      function emitRuntimeIsland(doc, ctx, schema, accessor) {
        const schemaConst = addConstant(ctx, schema);
        const runConst = addConstant(ctx, runtimeRun);
        const outVar = newVar(ctx);
        doc.write(
          "const "
            .concat(outVar, " = ")
            .concat(runConst, "(")
            .concat(schemaConst, ", ")
            .concat(accessor, ");"),
        );
        doc.write("if (".concat(outVar, " === INVALID) return INVALID;"));
        return outVar;
      }
      const WHEN_DEFAULTED_CHECKS = /* @__PURE__ */ new Set([
        "max_size",
        "min_size",
        "size_equals",
        "max_length",
        "min_length",
        "length_equals",
      ]);
      function generateChecks(doc, ctx, schema, accessor) {
        const schemaChecks = schema._zod.def.checks;
        if (!schemaChecks || schemaChecks.length === 0) return accessor;
        let currentAccessor = accessor;
        for (const check of schemaChecks) {
          const def = check._zod.def;
          if (def.when && !WHEN_DEFAULTED_CHECKS.has(def.check)) {
            throw new ZodCompileUnsupportedError(
              'check with a custom "when" condition',
            );
          }
          switch (def.check) {
            case "greater_than":
              generateGreaterThanCheck(doc, ctx, def, currentAccessor);
              break;
            case "less_than":
              generateLessThanCheck(doc, ctx, def, currentAccessor);
              break;
            case "multiple_of":
              generateMultipleOfCheck(doc, ctx, def, currentAccessor);
              break;
            case "number_format":
              generateNumberFormatCheck(doc, def, currentAccessor);
              break;
            case "min_length": {
              const min = numericOperand(def.minimum, "min_length");
              const len = codePointLengthVar(
                doc,
                ctx,
                currentAccessor,
                ""
                  .concat(currentAccessor, ".length >= ")
                  .concat(min, " && ")
                  .concat(currentAccessor, ".length < ")
                  .concat(def.minimum * 2),
              );
              doc.write(
                "if (".concat(len, " < ").concat(min, ") return INVALID;"),
              );
              break;
            }
            case "max_length": {
              const max = numericOperand(def.maximum, "max_length");
              const len = codePointLengthVar(
                doc,
                ctx,
                currentAccessor,
                "".concat(currentAccessor, ".length > ").concat(max),
              );
              doc.write(
                "if (".concat(len, " > ").concat(max, ") return INVALID;"),
              );
              break;
            }
            case "length_equals": {
              const exact = numericOperand(def.length, "length_equals");
              const len = codePointLengthVar(
                doc,
                ctx,
                currentAccessor,
                ""
                  .concat(currentAccessor, ".length >= ")
                  .concat(exact, " && ")
                  .concat(currentAccessor, ".length <= ")
                  .concat(def.length * 2),
              );
              doc.write(
                "if (".concat(len, " !== ").concat(exact, ") return INVALID;"),
              );
              break;
            }
            case "min_size":
              doc.write(
                "if ("
                  .concat(currentAccessor, ".size < ")
                  .concat(
                    numericOperand(def.minimum, "min_size"),
                    ") return INVALID;",
                  ),
              );
              break;
            case "max_size":
              doc.write(
                "if ("
                  .concat(currentAccessor, ".size > ")
                  .concat(
                    numericOperand(def.maximum, "max_size"),
                    ") return INVALID;",
                  ),
              );
              break;
            case "size_equals":
              doc.write(
                "if ("
                  .concat(currentAccessor, ".size !== ")
                  .concat(
                    numericOperand(def.size, "size_equals"),
                    ") return INVALID;",
                  ),
              );
              break;
            case "string_format":
              currentAccessor = generateStringFormatCheck(
                doc,
                ctx,
                def,
                currentAccessor,
              );
              break;
            case "custom":
              currentAccessor = generateCustomRefineCheck(
                doc,
                ctx,
                check,
                currentAccessor,
              );
              break;
            case "bigint_format":
              generateBigIntFormatCheck(doc, def, currentAccessor);
              break;
            case "mime_type":
              generateMimeTypeCheck(doc, ctx, def, currentAccessor);
              break;
            case "property":
              generatePropertyCheck(doc, ctx, def, currentAccessor);
              break;
            case "overwrite": {
              const newAccessor = newVar(ctx);
              generateOverwriteCheck(
                doc,
                ctx,
                check,
                currentAccessor,
                newAccessor,
              );
              currentAccessor = newAccessor;
              break;
            }
            default: {
              void def;
              throw new ZodCompileUnsupportedError(
                "check type ".concat(def.check),
              );
            }
          }
        }
        return currentAccessor;
      }
      function codePointLengthVar(doc, ctx, accessor, inDoubt) {
        const cpLen = addConstant(ctx, util.codePointLength);
        const v = newVar(ctx);
        doc.write(
          "const "
            .concat(v, " = typeof ")
            .concat(accessor, ' === "string" && ')
            .concat(inDoubt, " ? ")
            .concat(cpLen, "(")
            .concat(accessor, ") : ")
            .concat(accessor, ".length;"),
        );
        return v;
      }
      function numericOperand(value, label) {
        if (typeof value !== "number" || !Number.isFinite(value)) {
          throw new ZodCompileUnsupportedError(
            "".concat(label, " bound of type ").concat(typeof value),
          );
        }
        return "".concat(value);
      }
      function comparisonOperand(ctx, value) {
        if (typeof value === "bigint") return "".concat(value, "n");
        if (typeof value === "number") {
          if (Number.isNaN(value))
            throw new ZodCompileUnsupportedError(
              "comparison check with NaN bound",
            );
          return "".concat(value);
        }
        if (value instanceof Date) {
          if (Number.isNaN(value.getTime())) {
            throw new ZodCompileUnsupportedError(
              "comparison check with Invalid Date bound",
            );
          }
          return addConstant(ctx, value);
        }
        throw new ZodCompileUnsupportedError(
          "comparison check bound of type ".concat(typeof value),
        );
      }
      function generateGreaterThanCheck(doc, ctx, def, accessor) {
        const op = def.inclusive ? "<" : "<=";
        doc.write(
          "if ("
            .concat(accessor, " ")
            .concat(op, " ")
            .concat(comparisonOperand(ctx, def.value), ") return INVALID;"),
        );
      }
      function generateLessThanCheck(doc, ctx, def, accessor) {
        const op = def.inclusive ? ">" : ">=";
        doc.write(
          "if ("
            .concat(accessor, " ")
            .concat(op, " ")
            .concat(comparisonOperand(ctx, def.value), ") return INVALID;"),
        );
      }
      function generateMultipleOfCheck(doc, ctx, def, accessor) {
        if (typeof def.value === "bigint") {
          if (def.value === BigInt(0))
            throw new ZodCompileUnsupportedError(
              "multiple_of check with a zero divisor",
            );
          doc.write(
            "if ("
              .concat(accessor, " % ")
              .concat(def.value, "n !== 0n) return INVALID;"),
          );
        } else {
          const remainder = addConstant(ctx, util.floatSafeRemainder);
          doc.write(
            "if ("
              .concat(remainder, "(")
              .concat(accessor, ", ")
              .concat(
                numericOperand(def.value, "multiple_of"),
                ") !== 0) return INVALID;",
              ),
          );
        }
      }
      function generateNumberFormatCheck(doc, def, accessor) {
        const format = def.format;
        switch (format) {
          case "safeint":
            doc.write(
              "if (!Number.isSafeInteger(".concat(
                accessor,
                ")) return INVALID;",
              ),
            );
            break;
          case "int32":
            doc.write(
              "if (!Number.isInteger("
                .concat(accessor, ") || ")
                .concat(accessor, " < -2147483648 || ")
                .concat(accessor, " > 2147483647) return INVALID;"),
            );
            break;
          case "uint32":
            doc.write(
              "if (!Number.isInteger("
                .concat(accessor, ") || ")
                .concat(accessor, " < 0 || ")
                .concat(accessor, " > 4294967295) return INVALID;"),
            );
            break;
          case "float32":
            doc.write(
              "if (!Number.isFinite("
                .concat(accessor, ") || ")
                .concat(accessor, " < -3.4028234663852886e38 || ")
                .concat(accessor, " > 3.4028234663852886e38) return INVALID;"),
            );
            break;
          case "float64":
            doc.write(
              "if (!Number.isFinite(".concat(accessor, ")) return INVALID;"),
            );
            break;
          default: {
            void format;
            throw new ZodCompileUnsupportedError(
              "number format ".concat(format),
            );
          }
        }
      }
      function generateBigIntFormatCheck(doc, def, accessor) {
        const format = def.format;
        if (!format) return;
        switch (format) {
          case "int64":
            doc.write(
              "if ("
                .concat(accessor, " < -9223372036854775808n || ")
                .concat(accessor, " > 9223372036854775807n) return INVALID;"),
            );
            break;
          case "uint64":
            doc.write(
              "if ("
                .concat(accessor, " < 0n || ")
                .concat(accessor, " > 18446744073709551615n) return INVALID;"),
            );
            break;
          default: {
            void format;
            throw new ZodCompileUnsupportedError(
              "bigint format ".concat(format),
            );
          }
        }
      }
      function generateMimeTypeCheck(doc, ctx, def, accessor) {
        const mimeTypes = def.mime;
        if (mimeTypes && mimeTypes.length > 0) {
          const mimeSet = addConstant(ctx, new Set(mimeTypes));
          doc.write(
            "if (!"
              .concat(mimeSet, ".has(")
              .concat(accessor, ".type)) return INVALID;"),
          );
        }
      }
      function generatePropertyCheck(doc, ctx, def, accessor) {
        const propAccessor = ""
          .concat(accessor, "[")
          .concat(JSON.stringify(def.property), "]");
        generateCheck(doc, ctx, def.schema, propAccessor);
      }
      function generateOverwriteCheck(
        doc,
        ctx,
        check,
        currentAccessor,
        newAccessor,
      ) {
        const tx = check._zod.def.tx;
        if (!tx) {
          throw new ZodCompileUnsupportedError(
            "overwrite check without a transform function",
          );
        }
        if (isAsyncFunction(tx)) {
          throw new ZodCompileAsyncError(
            "z.compile: async overwrite transforms are not supported",
          );
        }
        const txConst = addConstant(ctx, tx);
        doc.write(
          "const "
            .concat(newAccessor, " = ")
            .concat(txConst, "(")
            .concat(currentAccessor, ");"),
        );
      }
      function throwAsync() {
        throw new core.GT();
      }
      function pushIssue(issue) {
        this.issues.push(issue);
      }
      function generateCustomRefineCheck(doc, ctx, check, accessor) {
        const def = check._zod.def;
        if (def.fn) {
          if (isAsyncFunction(def.fn)) {
            throw new ZodCompileAsyncError(
              "z.compile: async .refine() predicates are not supported",
            );
          }
          const fnConst = addConstant(ctx, def.fn);
          const throwAsyncConst = addConstant(ctx, throwAsync);
          const resVar = newVar(ctx);
          doc.write(
            "const "
              .concat(resVar, " = ")
              .concat(fnConst, "(")
              .concat(accessor, ");"),
          );
          doc.write(
            "if ("
              .concat(resVar, " instanceof Promise) ")
              .concat(throwAsyncConst, "();"),
          );
          doc.write("if (!".concat(resVar, ") return INVALID;"));
          return accessor;
        }
        if (check._zod.check) {
          if (isAsyncFunction(check._zod.check)) {
            throw new ZodCompileAsyncError(
              "z.compile: async .superRefine() / check functions are not supported",
            );
          }
          const checkFn = check._zod.check;
          const helperFn = (value) => {
            const fakePayload = { value, issues: [], addIssue: pushIssue };
            const result = checkFn(fakePayload);
            if (result instanceof Promise) throwAsync();
            return fakePayload.issues.length === 0
              ? fakePayload.value
              : INVALID;
          };
          const helperConst = addConstant(ctx, helperFn);
          const outVar = newVar(ctx);
          doc.write(
            "const "
              .concat(outVar, " = ")
              .concat(helperConst, "(")
              .concat(accessor, ");"),
          );
          doc.write("if (".concat(outVar, " === INVALID) return INVALID;"));
          return outVar;
        }
        throw new ZodCompileUnsupportedError(
          "custom check without a predicate or check function",
        );
      }
      const PATTERN_IS_COMPLETE = /* @__PURE__ */ new Set([
        "cidrv4",
        "cuid",
        "cuid2",
        "date",
        "datetime",
        "duration",
        "e164",
        "email",
        "emoji",
        "ends_with",
        "guid",
        "includes",
        "ipv4",
        "ksuid",
        "lowercase",
        "mac",
        "nanoid",
        "regex",
        "starts_with",
        "time",
        "ulid",
        "uppercase",
        "uuid",
        "xid",
      ]);
      function generateStringFormatCheck(doc, ctx, def, accessor) {
        const fmt = def.format;
        if (fmt === "base64") {
          const validator = addConstant(ctx, schemas.UY);
          doc.write(
            "if (!"
              .concat(validator, "(")
              .concat(accessor, ")) return INVALID;"),
          );
          return accessor;
        }
        if (fmt === "base64url") {
          const validator = addConstant(ctx, schemas.tV);
          doc.write(
            "if (!"
              .concat(validator, "(")
              .concat(accessor, ")) return INVALID;"),
          );
          return accessor;
        }
        if (fmt === "jwt") {
          const validator = addConstant(ctx, schemas.c2);
          const alg = addConstant(ctx, def.alg ?? null);
          doc.write(
            "if (!"
              .concat(validator, "(")
              .concat(accessor, ", ")
              .concat(alg, ")) return INVALID;"),
          );
          return accessor;
        }
        if (fmt === "ipv6") {
          const validator = addConstant(ctx, schemas.SW);
          doc.write(
            "if (!"
              .concat(validator, "(")
              .concat(accessor, ")) return INVALID;"),
          );
          return accessor;
        }
        if (fmt === "cidrv6") {
          const validator = addConstant(ctx, schemas.Xe);
          doc.write(
            "if (!"
              .concat(validator, "(")
              .concat(accessor, ")) return INVALID;"),
          );
          return accessor;
        }
        if (fmt === "credit_card") {
          const validator = addConstant(ctx, schemas.uv);
          doc.write(
            "if (!"
              .concat(validator, "(")
              .concat(accessor, ")) return INVALID;"),
          );
          return accessor;
        }
        const formatDef = def;
        if (
          fmt === "url" ||
          fmt === "httpurl" ||
          formatDef.normalize ||
          formatDef.hostname !== void 0 ||
          formatDef.protocol !== void 0
        ) {
          const parseConst = addConstant(ctx, schemas.y5);
          const defConst = addConstant(ctx, def);
          const trimVar = newVar(ctx);
          const urlVar = newVar(ctx);
          doc.write(
            "const ".concat(trimVar, " = ").concat(accessor, ".trim();"),
          );
          doc.write(
            "const "
              .concat(urlVar, " = ")
              .concat(parseConst, "(")
              .concat(trimVar, ", ")
              .concat(defConst, ");"),
          );
          doc.write(
            "if (typeof ".concat(urlVar, ' === "number") return INVALID;'),
          );
          if (formatDef.hostname !== void 0) {
            const hostnameConst = addConstant(ctx, schemas.bL);
            doc.write(
              "if (!"
                .concat(hostnameConst, "(")
                .concat(urlVar, ", ")
                .concat(defConst, ".hostname)) return INVALID;"),
            );
          }
          if (formatDef.protocol !== void 0) {
            const protocolConst = addConstant(ctx, schemas.Yf);
            doc.write(
              "if (!"
                .concat(protocolConst, "(")
                .concat(urlVar, ", ")
                .concat(defConst, ".protocol)) return INVALID;"),
            );
          }
          const outputVar = newVar(ctx);
          const outputExpr = formatDef.normalize
            ? "".concat(urlVar, ".href")
            : "".concat(addConstant(ctx, schemas.NH), "(").concat(trimVar, ")");
          doc.write("const ".concat(outputVar, " = ").concat(outputExpr, ";"));
          return outputVar;
        }
        const customFn = def.fn;
        if (customFn) {
          if (isAsyncFunction(customFn))
            throw new ZodCompileUnsupportedError(
              "async string format ".concat(fmt),
            );
          const fnConst = addConstant(ctx, customFn);
          doc.write(
            "if (!".concat(fnConst, "(").concat(accessor, ")) return INVALID;"),
          );
          return accessor;
        }
        if (PATTERN_IS_COMPLETE.has(fmt) && def.pattern) {
          const patternConst = addConstant(ctx, def.pattern);
          doc.write("".concat(patternConst, ".lastIndex = 0;"));
          doc.write(
            "if (!"
              .concat(patternConst, ".test(")
              .concat(accessor, ")) return INVALID;"),
          );
          return accessor;
        }
        const format = def.format;
        switch (format) {
          case "regex":
            throw new ZodCompileUnsupportedError(
              "regex format without a pattern",
            );
          case "lowercase":
            doc.write(
              "if ("
                .concat(accessor, " !== ")
                .concat(accessor, ".toLowerCase()) return INVALID;"),
            );
            break;
          case "uppercase":
            doc.write(
              "if ("
                .concat(accessor, " !== ")
                .concat(accessor, ".toUpperCase()) return INVALID;"),
            );
            break;
          case "includes":
            doc.write(
              "if (!"
                .concat(accessor, ".includes(")
                .concat(util.esc(def.includes), ")) return INVALID;"),
            );
            break;
          case "starts_with": {
            const prefix = def.prefix;
            doc.write(
              "if ("
                .concat(accessor, ".slice(0, ")
                .concat(prefix.length, ") !== ")
                .concat(util.esc(prefix), ") return INVALID;"),
            );
            break;
          }
          case "ends_with": {
            const suffix = def.suffix;
            doc.write(
              "if ("
                .concat(accessor, ".slice(-")
                .concat(suffix.length, ") !== ")
                .concat(util.esc(suffix), ") return INVALID;"),
            );
            break;
          }
          default: {
            void format;
            throw new ZodCompileUnsupportedError(
              "string format ".concat(format),
            );
          }
        }
        return accessor;
      }
      function generateCheck(doc, ctx, schema, accessor, needsValue = true) {
        const def = schema._zod.def;
        const type = def.type;
        if (def.coerce) {
          throw new ZodCompileUnsupportedError(
            "coercion (z.coerce.".concat(type, "())"),
          );
        }
        const buildsValue = needsValue || !!def.checks?.length;
        let typeAccessor;
        switch (type) {
          case "string":
            typeAccessor = generateStringCheck(doc, ctx, schema, accessor);
            break;
          case "number":
            typeAccessor = generateNumberCheck(doc, schema, accessor);
            break;
          case "boolean":
            typeAccessor = generateBooleanCheck(doc, accessor);
            break;
          case "bigint":
            typeAccessor = generateBigIntCheck(doc, schema, accessor);
            break;
          case "symbol":
            typeAccessor = generateSymbolCheck(doc, accessor);
            break;
          case "undefined":
            typeAccessor = generateUndefinedCheck(doc, accessor);
            break;
          case "null":
            typeAccessor = generateNullCheck(doc, accessor);
            break;
          case "any":
          case "unknown":
            typeAccessor = accessor;
            break;
          case "never":
            doc.write("return INVALID;");
            typeAccessor = accessor;
            break;
          case "void":
            typeAccessor = generateVoidCheck(doc, accessor);
            break;
          case "nan":
            typeAccessor = generateNaNCheck(doc, accessor);
            break;
          case "date":
            typeAccessor = generateDateCheck(doc, accessor);
            break;
          case "object":
            typeAccessor = generateObjectCheck(
              doc,
              ctx,
              schema,
              accessor,
              buildsValue,
            );
            break;
          case "optional":
            typeAccessor = generateOptionalCheck(
              doc,
              ctx,
              schema,
              accessor,
              buildsValue,
            );
            break;
          case "nullable":
            typeAccessor = generateNullableCheck(
              doc,
              ctx,
              schema,
              accessor,
              buildsValue,
            );
            break;
          case "array":
            typeAccessor = generateArrayCheck(
              doc,
              ctx,
              schema,
              accessor,
              buildsValue,
            );
            break;
          case "literal":
            typeAccessor = generateLiteralCheck(doc, ctx, schema, accessor);
            break;
          case "enum":
            typeAccessor = generateEnumCheck(doc, ctx, schema, accessor);
            break;
          case "readonly": {
            const innerOut = generateWrapperCheck(doc, ctx, schema, accessor);
            const frozenVar = newVar(ctx);
            doc.write(
              "const "
                .concat(frozenVar, " = Object.freeze(")
                .concat(innerOut, ");"),
            );
            typeAccessor = frozenVar;
            break;
          }
          case "success":
            generateWrapperCheck(doc, ctx, schema, accessor);
            typeAccessor = "true";
            break;
          case "default":
          case "prefault":
            typeAccessor = generateDefaultCheck(doc, ctx, schema, accessor);
            break;
          case "nonoptional":
            typeAccessor = generateNonOptionalCheck(doc, ctx, schema, accessor);
            break;
          case "tuple":
            typeAccessor = generateTupleCheck(doc, ctx, schema, accessor);
            break;
          case "union":
            typeAccessor = generateUnionCheck(doc, ctx, schema, accessor);
            break;
          case "intersection":
            typeAccessor = generateIntersectionCheck(
              doc,
              ctx,
              schema,
              accessor,
            );
            break;
          case "record":
            typeAccessor = generateRecordCheck(doc, ctx, schema, accessor);
            break;
          case "map":
            typeAccessor = generateMapCheck(doc, ctx, schema, accessor);
            break;
          case "set":
            typeAccessor = generateSetCheck(doc, ctx, schema, accessor);
            break;
          case "file":
            typeAccessor = generateFileCheck(doc, accessor);
            break;
          case "template_literal":
            typeAccessor = generateTemplateLiteralCheck(
              doc,
              ctx,
              schema,
              accessor,
            );
            break;
          case "lazy":
            typeAccessor = generateLazyCheck(doc, ctx, schema, accessor);
            break;
          case "pipe":
            typeAccessor = generatePipeCheck(doc, ctx, schema, accessor);
            break;
          case "custom":
            typeAccessor = generateCustomCheck(doc, ctx, schema, accessor);
            break;
          case "transform":
            typeAccessor = generateTransformCheck(doc, ctx, schema, accessor);
            break;
          case "catch":
            typeAccessor = generateCatchCheck(doc, ctx, schema, accessor);
            break;
          default: {
            void type;
            throw new ZodCompileUnsupportedError("schema type ".concat(type));
          }
        }
        if (typeAccessor === null) return null;
        return generateChecks(doc, ctx, schema, typeAccessor);
      }
      function generateStringCheck(doc, ctx, schema, accessor) {
        doc.write(
          "if (typeof ".concat(accessor, ' !== "string") return INVALID;'),
        );
        const def = schema._zod.def;
        if (def.format === void 0) return accessor;
        return generateStringFormatCheck(doc, ctx, def, accessor);
      }
      function generateNumberCheck(doc, schema, accessor) {
        doc.write(
          "if (typeof "
            .concat(accessor, ' !== "number" || !Number.isFinite(')
            .concat(accessor, ")) return INVALID;"),
        );
        const def = schema._zod.def;
        if (def.check === "number_format" && def.format) {
          generateNumberFormatCheck(doc, { format: def.format }, accessor);
        }
        return accessor;
      }
      function generateBooleanCheck(doc, accessor) {
        doc.write(
          "if (typeof ".concat(accessor, ' !== "boolean") return INVALID;'),
        );
        return accessor;
      }
      function generateBigIntCheck(doc, schema, accessor) {
        doc.write(
          "if (typeof ".concat(accessor, ' !== "bigint") return INVALID;'),
        );
        const def = schema._zod.def;
        if (def.format) {
          switch (def.format) {
            case "int64":
              doc.write(
                "if ("
                  .concat(accessor, " < -9223372036854775808n || ")
                  .concat(accessor, " > 9223372036854775807n) return INVALID;"),
              );
              break;
            case "uint64":
              doc.write(
                "if ("
                  .concat(accessor, " < 0n || ")
                  .concat(
                    accessor,
                    " > 18446744073709551615n) return INVALID;",
                  ),
              );
              break;
          }
        }
        return accessor;
      }
      function generateSymbolCheck(doc, accessor) {
        doc.write(
          "if (typeof ".concat(accessor, ' !== "symbol") return INVALID;'),
        );
        return accessor;
      }
      function generateUndefinedCheck(doc, accessor) {
        doc.write("if (".concat(accessor, " !== undefined) return INVALID;"));
        return accessor;
      }
      function generateNullCheck(doc, accessor) {
        doc.write("if (".concat(accessor, " !== null) return INVALID;"));
        return accessor;
      }
      function generateVoidCheck(doc, accessor) {
        doc.write("if (".concat(accessor, " !== undefined) return INVALID;"));
        return accessor;
      }
      function generateNaNCheck(doc, accessor) {
        doc.write(
          "if (typeof "
            .concat(accessor, ' !== "number" || !Number.isNaN(')
            .concat(accessor, ")) return INVALID;"),
        );
        return accessor;
      }
      function generateDateCheck(doc, accessor) {
        doc.write(
          "if (!("
            .concat(accessor, " instanceof Date) || Number.isNaN(")
            .concat(accessor, ".getTime())) return INVALID;"),
        );
        return accessor;
      }
      function generateObjectCheck(
        doc,
        ctx,
        schema,
        accessor,
        buildsValue = true,
      ) {
        const def = schema._zod.def;
        doc.write(
          "if (typeof "
            .concat(accessor, ' !== "object" || ')
            .concat(accessor, " === null || Array.isArray(")
            .concat(accessor, ")) return INVALID;"),
        );
        const shape = def.shape;
        const keys = Object.keys(shape);
        const symbolKeys = Object.getOwnPropertySymbols(shape);
        const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
        const keyExpr = (k) =>
          typeof k === "symbol" ? addConstant(ctx, k) : util.esc(k);
        const propKey = (k) =>
          typeof k === "symbol" ? "[".concat(keyExpr(k), "]") : util.esc(k);
        const propShape = shape;
        if (keys.includes("__proto__")) {
          throw new ZodCompileUnsupportedError('object shape key "__proto__"');
        }
        const propOutputs = /* @__PURE__ */ new Map();
        for (const key of allKeys) {
          const propSchema = propShape[key];
          const kx = keyExpr(key);
          const inputVar = newVar(ctx);
          doc.write(
            "const "
              .concat(inputVar, " = ")
              .concat(accessor, "[")
              .concat(kx, "];"),
          );
          if (propSchema._zod.optin !== void 0) {
            const outputVar2 = newVar(ctx);
            doc.write("let ".concat(outputVar2, " = (() => {"));
            doc.indented((d) => {
              const outputAccessor = compileChild(d, ctx, propSchema, inputVar);
              d.write("return ".concat(outputAccessor, ";"));
            });
            doc.write("})();");
            if (propSchema._zod.optout === "optional") {
              doc.write("if (".concat(outputVar2, " === INVALID) {"));
              doc.indented((d) => {
                d.write(
                  "if ("
                    .concat(kx, " in ")
                    .concat(accessor, ") return INVALID;"),
                );
                d.write("".concat(outputVar2, " = undefined;"));
              });
              doc.write("}");
            } else {
              doc.write(
                "if (".concat(outputVar2, " === INVALID) return INVALID;"),
              );
            }
            propOutputs.set(key, outputVar2);
          } else {
            if (requiresPresenceCheck(propSchema)) {
              doc.write(
                "if (!("
                  .concat(kx, " in ")
                  .concat(accessor, ")) return INVALID;"),
              );
            }
            const outputAccessor = compileChild(
              doc,
              ctx,
              propSchema,
              inputVar,
              buildsValue,
            );
            if (outputAccessor !== null) propOutputs.set(key, outputAccessor);
          }
        }
        const catchall = def.catchall;
        let unknownKeysMode = "none";
        if (catchall) {
          const catchallType = catchall._zod.def.type;
          if (catchallType === "never") {
            const condition =
              keys.map((k) => "k !== ".concat(util.esc(k))).join(" && ") ||
              "true";
            doc.write("for (const k in ".concat(accessor, ") {"));
            doc.indented((d) => {
              d.write("if (".concat(condition, ") return INVALID;"));
            });
            doc.write("}");
          } else if (
            (catchallType === "unknown" || catchallType === "any") &&
            !catchall._zod.def.checks?.length
          ) {
            unknownKeysMode = "passthrough";
          } else {
            unknownKeysMode = "schema";
          }
        }
        const outputVar = newVar(ctx);
        const hasConditionalKeys = allKeys.some(
          (k) =>
            mayOutputUndefined(propShape[k]) || dropsWhenAbsent(propShape[k]),
        );
        if (!buildsValue) {
          if (unknownKeysMode === "schema") {
            const knownSet =
              keys.length > 0 ? addConstant(ctx, new Set(keys)) : null;
            doc.write("for (const k in ".concat(accessor, ") {"));
            doc.indented((d) => {
              d.write('if (k === "__proto__") continue;');
              if (knownSet)
                d.write("if (".concat(knownSet, ".has(k)) continue;"));
              const valVar = newVar(ctx);
              d.write("const ".concat(valVar, " = ").concat(accessor, "[k];"));
              compileChild(d, ctx, catchall, valVar, false);
            });
            doc.write("}");
          }
          return null;
        }
        if (!hasConditionalKeys) {
          const propLiterals = allKeys
            .map((k) => "".concat(propKey(k), ": ").concat(propOutputs.get(k)))
            .join(", ");
          doc.write(
            "const ".concat(outputVar, " = { ").concat(propLiterals, " };"),
          );
        } else {
          doc.write("const ".concat(outputVar, " = {};"));
          for (const k of allKeys) {
            const kx = keyExpr(k);
            const out = propOutputs.get(k);
            if (dropsWhenAbsent(propShape[k])) {
              doc.write(
                "if ("
                  .concat(kx, " in ")
                  .concat(accessor, ") ")
                  .concat(outputVar, "[")
                  .concat(kx, "] = ")
                  .concat(out, ";"),
              );
            } else if (mayOutputUndefined(propShape[k])) {
              doc.write(
                "if ("
                  .concat(out, " !== undefined || ")
                  .concat(kx, " in ")
                  .concat(accessor, ") ")
                  .concat(outputVar, "[")
                  .concat(kx, "] = ")
                  .concat(out, ";"),
              );
            } else {
              doc.write(
                "".concat(outputVar, "[").concat(kx, "] = ").concat(out, ";"),
              );
            }
          }
        }
        if (unknownKeysMode !== "none") {
          const knownSet =
            keys.length > 0 ? addConstant(ctx, new Set(keys)) : null;
          doc.write("for (const k in ".concat(accessor, ") {"));
          doc.indented((d) => {
            d.write('if (k === "__proto__") continue;');
            if (knownSet)
              d.write("if (".concat(knownSet, ".has(k)) continue;"));
            if (unknownKeysMode === "passthrough") {
              d.write("".concat(outputVar, "[k] = ").concat(accessor, "[k];"));
            } else {
              const valVar = newVar(ctx);
              d.write("const ".concat(valVar, " = ").concat(accessor, "[k];"));
              const catchallOut = compileChild(d, ctx, catchall, valVar);
              d.write("".concat(outputVar, "[k] = ").concat(catchallOut, ";"));
            }
          });
          doc.write("}");
        }
        return outputVar;
      }
      function generateOptionalCheck(
        doc,
        ctx,
        schema,
        accessor,
        buildsValue = true,
      ) {
        const def = schema._zod.def;
        if (isExactOptional(schema)) {
          return generateCheck(doc, ctx, def.innerType, accessor, buildsValue);
        }
        if (def.innerType._zod.optin === "defaulted") {
          const outputVar2 = newVar(ctx);
          const branchVar = newVar(ctx);
          doc.write("let ".concat(outputVar2, ";"));
          doc.write("if (".concat(accessor, " === undefined) {"));
          doc.indented((d) => {
            d.write("const ".concat(branchVar, " = (() => {"));
            d.indented((d2) => {
              const innerOutput = generateCheck(
                d2,
                ctx,
                def.innerType,
                accessor,
              );
              d2.write("return ".concat(innerOutput, ";"));
            });
            d.write("})();");
            d.write(
              "if ("
                .concat(branchVar, " !== INVALID) ")
                .concat(outputVar2, " = ")
                .concat(branchVar, ";"),
            );
          });
          doc.write("} else {");
          doc.indented((d) => {
            const innerOutput = generateCheck(d, ctx, def.innerType, accessor);
            d.write("".concat(outputVar2, " = ").concat(innerOutput, ";"));
          });
          doc.write("}");
          return outputVar2;
        }
        const outputVar = buildsValue ? newVar(ctx) : null;
        if (outputVar) doc.write("let ".concat(outputVar, ";"));
        doc.write("if (".concat(accessor, " !== undefined) {"));
        doc.indented((d) => {
          const innerOutput = generateCheck(
            d,
            ctx,
            def.innerType,
            accessor,
            buildsValue,
          );
          if (outputVar && innerOutput !== null)
            d.write("".concat(outputVar, " = ").concat(innerOutput, ";"));
        });
        doc.write("}");
        return outputVar;
      }
      function isExactOptional(schema) {
        return schema._zod.traits?.has("$ZodExactOptional") === true;
      }
      function requiresPresenceCheck(schema) {
        return schema._zod.optin === void 0 && fastPathAcceptsAbsence(schema);
      }
      function fastPathAcceptsAbsence(schema) {
        if (schema._zod.def.coerce) return true;
        const def = schema._zod.def;
        switch (def.type) {
          case "any":
          case "unknown":
          case "undefined":
          case "void":
          case "default":
          case "prefault":
          case "transform":
          case "custom":
          case "lazy":
            return true;
          case "string":
          case "number":
          case "boolean":
          case "bigint":
          case "symbol":
          case "null":
          case "never":
          case "nan":
          case "date":
          case "object":
          case "array":
          case "tuple":
          case "record":
          case "map":
          case "set":
          case "file":
          case "template_literal":
            return false;
          case "nonoptional":
            return def.innerType
              ? fastPathAcceptsAbsence(def.innerType)
              : false;
          case "literal":
            return !!def.values?.includes(void 0);
          case "enum":
            return !!schema._zod.values?.has(void 0);
          case "optional":
          case "nullable":
          case "readonly":
          case "success":
            return def.innerType ? fastPathAcceptsAbsence(def.innerType) : true;
          case "catch":
            return true;
          case "union":
            return def.options
              ? def.options.some(fastPathAcceptsAbsence)
              : true;
          case "intersection":
            if (!def.left || !def.right) return true;
            return (
              fastPathAcceptsAbsence(def.left) &&
              fastPathAcceptsAbsence(def.right)
            );
          case "pipe":
            return def.in ? fastPathAcceptsAbsence(def.in) : true;
          default:
            return true;
        }
      }
      function dropsWhenAbsent(schema) {
        return (
          schema._zod.optin === "optional" && schema._zod.optout === "optional"
        );
      }
      function mayOutputUndefined(schema) {
        const def = schema._zod.def;
        switch (def.type) {
          case "string":
          case "number":
          case "boolean":
          case "bigint":
          case "symbol":
          case "null":
          case "nan":
          case "date":
          case "object":
          case "array":
          case "tuple":
          case "record":
          case "map":
          case "set":
          case "file":
          case "template_literal":
          case "never":
          case "success":
            return false;
          case "literal":
            return !!def.values?.includes(void 0);
          case "enum":
            return !!schema._zod.values?.has(void 0);
          case "optional":
            return true;
          case "nullable":
          case "readonly":
          case "nonoptional":
            return def.innerType ? mayOutputUndefined(def.innerType) : true;
          case "union":
            return def.options ? def.options.some(mayOutputUndefined) : true;
          case "intersection":
            return (
              !def.left ||
              !def.right ||
              mayOutputUndefined(def.left) ||
              mayOutputUndefined(def.right)
            );
          case "pipe":
            return def.out ? mayOutputUndefined(def.out) : true;
          default:
            return true;
        }
      }
      function generateNullableCheck(
        doc,
        ctx,
        schema,
        accessor,
        buildsValue = true,
      ) {
        const def = schema._zod.def;
        const outputVar = buildsValue ? newVar(ctx) : null;
        if (outputVar) doc.write("let ".concat(outputVar, " = null;"));
        doc.write("if (".concat(accessor, " !== null) {"));
        doc.indented((d) => {
          const innerOutput = generateCheck(
            d,
            ctx,
            def.innerType,
            accessor,
            buildsValue,
          );
          if (outputVar && innerOutput !== null)
            d.write("".concat(outputVar, " = ").concat(innerOutput, ";"));
        });
        doc.write("}");
        return outputVar;
      }
      function generateArrayCheck(
        doc,
        ctx,
        schema,
        accessor,
        buildsValue = true,
      ) {
        const def = schema._zod.def;
        doc.write("if (!Array.isArray(".concat(accessor, ")) return INVALID;"));
        const outputVar = buildsValue ? newVar(ctx) : null;
        const iVar = newVar(ctx);
        const elemVar = newVar(ctx);
        if (outputVar)
          doc.write(
            "const "
              .concat(outputVar, " = new Array(")
              .concat(accessor, ".length);"),
          );
        doc.write(
          "for (let "
            .concat(iVar, " = 0; ")
            .concat(iVar, " < ")
            .concat(accessor, ".length; ")
            .concat(iVar, "++) {"),
        );
        doc.indented((d) => {
          d.write(
            "const "
              .concat(elemVar, " = ")
              .concat(accessor, "[")
              .concat(iVar, "];"),
          );
          const elemOutput = compileChild(
            d,
            ctx,
            def.element,
            elemVar,
            buildsValue,
          );
          if (outputVar && elemOutput !== null)
            d.write(
              ""
                .concat(outputVar, "[")
                .concat(iVar, "] = ")
                .concat(elemOutput, ";"),
            );
        });
        doc.write("}");
        return outputVar;
      }
      function generateLiteralCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        const values = def.values;
        if (values.length !== 1) {
          const literalSet = addConstant(ctx, new Set(values));
          doc.write(
            "if (!"
              .concat(literalSet, ".has(")
              .concat(accessor, ")) return INVALID;"),
          );
          return accessor;
        }
        const value = values[0];
        if (typeof value === "number" && Number.isNaN(value)) {
          const literalSet = addConstant(ctx, new Set(values));
          doc.write(
            "if (!"
              .concat(literalSet, ".has(")
              .concat(accessor, ")) return INVALID;"),
          );
          return accessor;
        }
        if (typeof value === "string") {
          doc.write(
            "if ("
              .concat(accessor, " !== ")
              .concat(util.esc(value), ") return INVALID;"),
          );
        } else if (typeof value === "number" || typeof value === "boolean") {
          doc.write(
            "if (".concat(accessor, " !== ").concat(value, ") return INVALID;"),
          );
        } else if (value === null) {
          doc.write("if (".concat(accessor, " !== null) return INVALID;"));
        } else if (value === void 0) {
          doc.write("if (".concat(accessor, " !== undefined) return INVALID;"));
        } else if (typeof value === "bigint") {
          doc.write(
            "if ("
              .concat(accessor, " !== ")
              .concat(value, "n) return INVALID;"),
          );
        } else {
          throw new ZodCompileUnsupportedError(
            "literal type ".concat(typeof value),
          );
        }
        return accessor;
      }
      function generateEnumCheck(doc, ctx, schema, accessor) {
        const values = schema._zod.values;
        if (!values) {
          throw new ZodCompileUnsupportedError(
            "enum schema without enumerated values",
          );
        }
        const enumSet = addConstant(ctx, values);
        doc.write(
          "if (!"
            .concat(enumSet, ".has(")
            .concat(accessor, ")) return INVALID;"),
        );
        return accessor;
      }
      function generateWrapperCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        return generateCheck(doc, ctx, def.innerType, accessor);
      }
      function generateDefaultCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        const descriptor = Object.getOwnPropertyDescriptor(
          schema._zod.def,
          "defaultValue",
        );
        const defaultGetter = descriptor
          ? () => schema._zod.def.defaultValue
          : void 0;
        if (schema._zod.def.type === "prefault") {
          if (!defaultGetter) {
            return generateCheck(doc, ctx, def.innerType, accessor);
          }
          const defaultFn = addConstant(ctx, defaultGetter);
          const inputVar = newVar(ctx);
          doc.write("let ".concat(inputVar, " = ").concat(accessor, ";"));
          doc.write(
            "if ("
              .concat(accessor, " === undefined) ")
              .concat(inputVar, " = ")
              .concat(defaultFn, "();"),
          );
          return generateCheck(doc, ctx, def.innerType, inputVar);
        }
        const outputVar = newVar(ctx);
        if (defaultGetter) {
          const defaultFn = addConstant(ctx, defaultGetter);
          const cloneFn = addConstant(ctx, util.shallowClone);
          doc.write("let ".concat(outputVar, ";"));
          doc.write("if (".concat(accessor, " === undefined) {"));
          doc.indented((d) => {
            d.write(
              ""
                .concat(outputVar, " = ")
                .concat(cloneFn, "(")
                .concat(defaultFn, "());"),
            );
          });
          doc.write("} else {");
          doc.indented((d) => {
            const innerOutput = generateCheck(d, ctx, def.innerType, accessor);
            d.write(
              ""
                .concat(outputVar, " = ")
                .concat(innerOutput, " === undefined ? ")
                .concat(cloneFn, "(")
                .concat(defaultFn, "()) : ")
                .concat(innerOutput, ";"),
            );
          });
          doc.write("}");
        } else {
          doc.write("let ".concat(outputVar, ";"));
          doc.write("if (".concat(accessor, " !== undefined) {"));
          doc.indented((d) => {
            const innerOutput = generateCheck(d, ctx, def.innerType, accessor);
            d.write("".concat(outputVar, " = ").concat(innerOutput, ";"));
          });
          doc.write("}");
        }
        return outputVar;
      }
      function generateNonOptionalCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        const innerOutput = generateCheck(doc, ctx, def.innerType, accessor);
        const outputVar = newVar(ctx);
        doc.write("const ".concat(outputVar, " = ").concat(innerOutput, ";"));
        doc.write("if (".concat(outputVar, " === undefined) return INVALID;"));
        return outputVar;
      }
      function generateTupleCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        const items = def.items;
        const rest = def.rest;
        doc.write("if (!Array.isArray(".concat(accessor, ")) return INVALID;"));
        const optinStart = getTupleOptStart(items, "optin");
        const optoutStart = getTupleOptStart(items, "optout");
        if (rest) {
          doc.write(
            "if ("
              .concat(accessor, ".length < ")
              .concat(optinStart, ") return INVALID;"),
          );
        } else {
          doc.write(
            "if ("
              .concat(accessor, ".length < ")
              .concat(optinStart, " || ")
              .concat(accessor, ".length > ")
              .concat(items.length, ") return INVALID;"),
          );
        }
        const outputVar = newVar(ctx);
        doc.write("const ".concat(outputVar, " = [];"));
        for (let i = 0; i < items.length; i++) {
          const itemSchema = items[i];
          if (i >= optoutStart) {
            doc.write(
              "if (".concat(outputVar, ".length === ").concat(i, ") {"),
            );
            doc.indented((d) => {
              d.write("if (".concat(i, " < ").concat(accessor, ".length) {"));
              d.indented((d2) => {
                const elemVar = newVar(ctx);
                d2.write(
                  "const "
                    .concat(elemVar, " = ")
                    .concat(accessor, "[")
                    .concat(i, "];"),
                );
                const elemOutput = compileChild(d2, ctx, itemSchema, elemVar);
                d2.write(
                  ""
                    .concat(outputVar, "[")
                    .concat(i, "] = ")
                    .concat(elemOutput, ";"),
                );
              });
              d.write("} else {");
              d.indented((d2) => {
                if (dropsWhenAbsent(itemSchema)) {
                  d2.write("".concat(outputVar, ".length = ").concat(i, ";"));
                  return;
                }
                const elemVar = newVar(ctx);
                const branchVar = newVar(ctx);
                d2.write("const ".concat(elemVar, " = undefined;"));
                d2.write("const ".concat(branchVar, " = (() => {"));
                d2.indented((d3) => {
                  const elemOutput = compileChild(d3, ctx, itemSchema, elemVar);
                  d3.write("return ".concat(elemOutput, ";"));
                });
                d2.write("})();");
                d2.write(
                  "if ("
                    .concat(branchVar, " === INVALID || ")
                    .concat(branchVar, " === undefined) ")
                    .concat(outputVar, ".length = ")
                    .concat(i, ";"),
                );
                d2.write(
                  "else "
                    .concat(outputVar, "[")
                    .concat(i, "] = ")
                    .concat(branchVar, ";"),
                );
              });
              d.write("}");
            });
            doc.write("}");
          } else {
            const elemVar = newVar(ctx);
            doc.write(
              "const "
                .concat(elemVar, " = ")
                .concat(accessor, "[")
                .concat(i, "];"),
            );
            const elemOutput = compileChild(doc, ctx, itemSchema, elemVar);
            doc.write(
              ""
                .concat(outputVar, "[")
                .concat(i, "] = ")
                .concat(elemOutput, ";"),
            );
          }
        }
        if (rest) {
          const iVar = newVar(ctx);
          const elemVar = newVar(ctx);
          doc.write(
            "for (let "
              .concat(iVar, " = ")
              .concat(items.length, "; ")
              .concat(iVar, " < ")
              .concat(accessor, ".length; ")
              .concat(iVar, "++) {"),
          );
          doc.indented((d) => {
            d.write(
              "const "
                .concat(elemVar, " = ")
                .concat(accessor, "[")
                .concat(iVar, "];"),
            );
            const elemOutput = compileChild(d, ctx, rest, elemVar);
            d.write(
              ""
                .concat(outputVar, "[")
                .concat(iVar, "] = ")
                .concat(elemOutput, ";"),
            );
          });
          doc.write("}");
        }
        return outputVar;
      }
      function getTupleOptStart(items, key) {
        for (let i = items.length - 1; i >= 0; i--) {
          const omittable =
            key === "optin"
              ? items[i]._zod.optin !== void 0
              : items[i]._zod.optout === "optional";
          if (!omittable) return i + 1;
        }
        return 0;
      }
      function generateUnionCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        const options = def.options;
        if (def.discriminator) {
          return generateDiscriminatedUnionCheck(doc, ctx, def, accessor);
        }
        if (def.inclusive === false) {
          throw new ZodCompileUnsupportedError("exclusive unions (z.xor)");
        }
        if (options.length === 0) {
          doc.write("return INVALID;");
          return accessor;
        }
        if (options.length === 1) {
          return generateCheck(doc, ctx, options[0], accessor);
        }
        const allLiterals = options.every(
          (opt) =>
            opt._zod.def.type === "literal" && !opt._zod.def.checks?.length,
        );
        if (allLiterals) {
          const values = new Set(options.flatMap((opt) => opt._zod.def.values));
          const valuesConst = addConstant(ctx, values);
          doc.write(
            "if (!"
              .concat(valuesConst, ".has(")
              .concat(accessor, ")) return INVALID;"),
          );
          return accessor;
        }
        const outputVar = newVar(ctx);
        doc.write("let ".concat(outputVar, ";"));
        for (let i = 0; i < options.length; i++) {
          const opt = options[i];
          if (i === 0) {
            doc.write("".concat(outputVar, " = (() => {"));
          } else {
            doc.write(
              "if ("
                .concat(outputVar, " === INVALID) ")
                .concat(outputVar, " = (() => {"),
            );
          }
          doc.indented((d) => {
            const branchOutput = generateCheck(d, ctx, opt, accessor);
            d.write("return ".concat(branchOutput, ";"));
          });
          doc.write("})();");
        }
        doc.write("if (".concat(outputVar, " === INVALID) return INVALID;"));
        return outputVar;
      }
      function generateDiscriminatedUnionCheck(doc, ctx, def, accessor) {
        if (def.unionFallback) {
          throw new ZodCompileUnsupportedError(
            "discriminated union with unionFallback",
          );
        }
        if (def.options.length === 0) {
          doc.write("return INVALID;");
          return accessor;
        }
        const discVar = newVar(ctx);
        const outputVar = newVar(ctx);
        doc.write(
          "const "
            .concat(discVar, " = ")
            .concat(accessor, "?.[")
            .concat(util.esc(def.discriminator), "];"),
        );
        doc.write("let ".concat(outputVar, ";"));
        let firstBranch = true;
        const claimed = /* @__PURE__ */ new Set();
        for (const option of def.options) {
          const values = option._zod.propValues?.[def.discriminator];
          if (!values || values.size === 0) {
            throw new ZodCompileUnsupportedError(
              "discriminated union option without static discriminator values",
            );
          }
          for (const value of values) {
            if (claimed.has(value)) {
              throw new ZodCompileUnsupportedError(
                "duplicate discriminator value ".concat(String(value)),
              );
            }
            claimed.add(value);
          }
          const conditions = Array.from(values, (value) =>
            literalEquality(ctx, discVar, value),
          );
          const prefix = firstBranch ? "if" : "else if";
          doc.write(
            "".concat(prefix, " (").concat(conditions.join(" || "), ") {"),
          );
          doc.indented((d) => {
            const branchOutput = generateCheck(d, ctx, option, accessor);
            d.write("".concat(outputVar, " = ").concat(branchOutput, ";"));
          });
          doc.write("}");
          firstBranch = false;
        }
        doc.write("else { return INVALID; }");
        return outputVar;
      }
      function literalEquality(ctx, accessor, value) {
        if (typeof value === "string")
          return "".concat(accessor, " === ").concat(util.esc(value));
        if (typeof value === "number") {
          if (Number.isNaN(value)) return "Number.isNaN(".concat(accessor, ")");
          return "".concat(accessor, " === ").concat(value);
        }
        if (typeof value === "boolean")
          return "".concat(accessor, " === ").concat(value);
        if (value === null) return "".concat(accessor, " === null");
        if (value === void 0) return "".concat(accessor, " === undefined");
        if (typeof value === "bigint")
          return "".concat(accessor, " === ").concat(value, "n");
        if (typeof value === "symbol") {
          const symbolConst = addConstant(ctx, value);
          return "".concat(accessor, " === ").concat(symbolConst);
        }
        throw new ZodCompileUnsupportedError(
          "literal discriminator value ".concat(String(value)),
        );
      }
      function generateIntersectionCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        const leftOutput = compileChild(doc, ctx, def.left, accessor);
        const rightOutput = compileChild(doc, ctx, def.right, accessor);
        const mergeConst = addConstant(ctx, schemas.D3);
        const mergedVar = newVar(ctx);
        doc.write(
          "const "
            .concat(mergedVar, " = ")
            .concat(mergeConst, "(")
            .concat(leftOutput, ", ")
            .concat(rightOutput, ");"),
        );
        doc.write("if (!".concat(mergedVar, ".valid) return INVALID;"));
        return "".concat(mergedVar, ".data");
      }
      function generateRecordCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        const isPlainObjectConst = addConstant(ctx, util.isPlainObject);
        doc.write(
          "if (!"
            .concat(isPlainObjectConst, "(")
            .concat(accessor, ")) return INVALID;"),
        );
        const outputVar = newVar(ctx);
        const kVar = newVar(ctx);
        const valVar = newVar(ctx);
        doc.write("const ".concat(outputVar, " = {};"));
        const recordDef = def;
        const keyValues = recordDef.partial ? void 0 : def.keyType._zod.values;
        if (keyValues) {
          const inputKeys = [];
          for (const key of keyValues) {
            if (!(
              typeof key === "string" ||
              typeof key === "number" ||
              typeof key === "symbol"
            )) {
              throw new ZodCompileUnsupportedError(
                "record key value ".concat(String(key)),
              );
            }
            const inputKey = typeof key === "number" ? key.toString() : key;
            if (inputKey === "__proto__") {
              throw new ZodCompileUnsupportedError('record key "__proto__"');
            }
            inputKeys.push(inputKey);
            const keyConst = addConstant(ctx, key);
            const outKey = generateCheck(doc, ctx, def.keyType, keyConst);
            const valueVar = newVar(ctx);
            doc.write(
              "const "
                .concat(valueVar, " = ")
                .concat(accessor, "[")
                .concat(literalPropertyKey(ctx, inputKey), "];"),
            );
            const valOutput = compileChild(doc, ctx, def.valueType, valueVar);
            doc.write(
              ""
                .concat(outputVar, "[")
                .concat(outKey, "] = ")
                .concat(valOutput, ";"),
            );
          }
          const knownKeysConst = addConstant(ctx, new Set(inputKeys));
          doc.write("for (const ".concat(kVar, " in ").concat(accessor, ") {"));
          doc.indented((d) => {
            d.write(
              "if ("
                .concat(knownKeysConst, ".has(")
                .concat(kVar, ")) continue;"),
            );
            if (recordDef.mode === "loose") {
              d.write(
                "if ("
                  .concat(kVar, ' !== "__proto__") ')
                  .concat(outputVar, "[")
                  .concat(kVar, "] = ")
                  .concat(accessor, "[")
                  .concat(kVar, "];"),
              );
            } else {
              d.write("return INVALID;");
            }
          });
          doc.write("}");
          return outputVar;
        }
        const keyDef = def.keyType._zod.def;
        const keyIsBareString =
          keyDef.type === "string" &&
          keyDef.format === void 0 &&
          !keyDef.coerce &&
          (keyDef.checks?.length ?? 0) === 0;
        if (!keyIsBareString) {
          const isLoose = def.mode === "loose";
          const keyFast = addConstant(ctx, compileFn(def.keyType));
          const numericConst = addConstant(ctx, regexes.number);
          const propIsEnumerableConst = addConstant(
            ctx,
            Object.prototype.propertyIsEnumerable,
          );
          const outKeyVar = newVar(ctx);
          doc.write(
            "for (const "
              .concat(kVar, " of Reflect.ownKeys(")
              .concat(accessor, ")) {"),
          );
          doc.indented((d) => {
            d.write("if (".concat(kVar, ' === "__proto__") continue;'));
            d.write(
              "if (!"
                .concat(propIsEnumerableConst, ".call(")
                .concat(accessor, ", ")
                .concat(kVar, ")) continue;"),
            );
            d.write(
              "let "
                .concat(outKeyVar, " = ")
                .concat(keyFast, "(")
                .concat(kVar, ");"),
            );
            d.write(
              "if ("
                .concat(outKeyVar, " === INVALID && typeof ")
                .concat(kVar, ' === "string" && ')
                .concat(numericConst, ".test(")
                .concat(kVar, ")) ")
                .concat(outKeyVar, " = ")
                .concat(keyFast, "(Number(")
                .concat(kVar, "));"),
            );
            if (isLoose) {
              d.write(
                "if ("
                  .concat(outKeyVar, " === INVALID) { ")
                  .concat(outputVar, "[")
                  .concat(kVar, "] = ")
                  .concat(accessor, "[")
                  .concat(kVar, "]; continue; }"),
              );
            } else {
              d.write(
                "if (".concat(outKeyVar, " === INVALID) return INVALID;"),
              );
            }
            d.write("if (".concat(outKeyVar, ' === "__proto__") continue;'));
            const valueVar = newVar(ctx);
            d.write(
              "const "
                .concat(valueVar, " = ")
                .concat(accessor, "[")
                .concat(kVar, "];"),
            );
            const valOutput = compileChild(d, ctx, def.valueType, valueVar);
            d.write(
              ""
                .concat(outputVar, "[")
                .concat(outKeyVar, "] = ")
                .concat(valOutput, ";"),
            );
          });
          doc.write("}");
          return outputVar;
        }
        const propIsEnumerable = addConstant(
          ctx,
          Object.prototype.propertyIsEnumerable,
        );
        doc.write(
          "for (const "
            .concat(kVar, " of Reflect.ownKeys(")
            .concat(accessor, ")) {"),
        );
        doc.indented((d) => {
          d.write("if (".concat(kVar, ' === "__proto__") continue;'));
          d.write(
            "if (!"
              .concat(propIsEnumerable, ".call(")
              .concat(accessor, ", ")
              .concat(kVar, ")) continue;"),
          );
          d.write("if (typeof ".concat(kVar, ' !== "string") return INVALID;'));
          d.write(
            "const "
              .concat(valVar, " = ")
              .concat(accessor, "[")
              .concat(kVar, "];"),
          );
          const valOutput = compileChild(d, ctx, def.valueType, valVar);
          d.write(
            ""
              .concat(outputVar, "[")
              .concat(kVar, "] = ")
              .concat(valOutput, ";"),
          );
        });
        doc.write("}");
        return outputVar;
      }
      function literalPropertyKey(ctx, key) {
        if (typeof key === "string") return util.esc(key);
        return addConstant(ctx, key);
      }
      function generateMapCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        doc.write(
          "if (!(".concat(accessor, " instanceof Map)) return INVALID;"),
        );
        const outputVar = newVar(ctx);
        const kVar = newVar(ctx);
        const valVar = newVar(ctx);
        doc.write("const ".concat(outputVar, " = new Map();"));
        doc.write(
          "for (const ["
            .concat(kVar, ", ")
            .concat(valVar, "] of ")
            .concat(accessor, ") {"),
        );
        doc.indented((d) => {
          const keyOutput = generateCheck(d, ctx, def.keyType, kVar);
          const valOutput = generateCheck(d, ctx, def.valueType, valVar);
          d.write(
            ""
              .concat(outputVar, ".set(")
              .concat(keyOutput, ", ")
              .concat(valOutput, ");"),
          );
        });
        doc.write("}");
        return outputVar;
      }
      function generateSetCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        doc.write(
          "if (!(".concat(accessor, " instanceof Set)) return INVALID;"),
        );
        const outputVar = newVar(ctx);
        const valVar = newVar(ctx);
        doc.write("const ".concat(outputVar, " = new Set();"));
        doc.write("for (const ".concat(valVar, " of ").concat(accessor, ") {"));
        doc.indented((d) => {
          const valOutput = generateCheck(d, ctx, def.valueType, valVar);
          d.write("".concat(outputVar, ".add(").concat(valOutput, ");"));
        });
        doc.write("}");
        return outputVar;
      }
      function generateFileCheck(doc, accessor) {
        doc.write(
          "if (!(".concat(accessor, " instanceof File)) return INVALID;"),
        );
        return accessor;
      }
      function generateTemplateLiteralCheck(doc, ctx, schema, accessor) {
        doc.write(
          "if (typeof ".concat(accessor, ' !== "string") return INVALID;'),
        );
        const pattern = schema._zod.pattern;
        if (pattern) {
          const patternConst = addConstant(ctx, pattern);
          doc.write("".concat(patternConst, ".lastIndex = 0;"));
          doc.write(
            "if (!"
              .concat(patternConst, ".test(")
              .concat(accessor, ")) return INVALID;"),
          );
        }
        return accessor;
      }
      function generateLazyCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        const getterConst = addConstant(ctx, def.getter);
        const cacheConst = addConstant(ctx, { parser: null });
        doc.write("if (!".concat(cacheConst, ".parser) {"));
        doc.indented((d) => {
          d.write("const inner = ".concat(getterConst, "();"));
          d.write("".concat(cacheConst, ".parser = function(input) {"));
          d.indented((d2) => {
            d2.write(
              "const result = inner._zod.run({ value: input, issues: [] }, {});",
            );
            d2.write(
              "return result.issues.length === 0 ? result.value : INVALID;",
            );
          });
          d.write("};");
        });
        doc.write("}");
        const outputVar = newVar(ctx);
        doc.write(
          "const "
            .concat(outputVar, " = ")
            .concat(cacheConst, ".parser(")
            .concat(accessor, ");"),
        );
        doc.write("if (".concat(outputVar, " === INVALID) return INVALID;"));
        return outputVar;
      }
      function generatePipeCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        const inputOutput = generateCheck(doc, ctx, def.in, accessor);
        if (def.transform) {
          if (isAsyncFunction(def.transform)) {
            throw new ZodCompileAsyncError(
              "z.compile: async transforms in pipes are not supported",
            );
          }
          const transformFn = def.transform;
          const helperFn = (value) => {
            const fakePayload = { value, issues: [], addIssue: pushIssue };
            const result = transformFn(value, fakePayload);
            if (result instanceof Promise) return INVALID;
            return fakePayload.issues.length === 0 ? result : INVALID;
          };
          const helperConst = addConstant(ctx, helperFn);
          const transformedVar = newVar(ctx);
          doc.write(
            "const "
              .concat(transformedVar, " = ")
              .concat(helperConst, "(")
              .concat(inputOutput, ");"),
          );
          doc.write(
            "if (".concat(transformedVar, " === INVALID) return INVALID;"),
          );
          return generateCheck(doc, ctx, def.out, transformedVar);
        } else {
          return generateCheck(doc, ctx, def.out, inputOutput);
        }
      }
      function isAsyncFunction(fn) {
        return (
          typeof fn === "function" &&
          (fn.constructor.name === "AsyncFunction" ||
            fn[Symbol.toStringTag] === "AsyncFunction")
        );
      }
      function generateCustomCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        if (def.fn) {
          if (isAsyncFunction(def.fn)) {
            throw new ZodCompileAsyncError(
              "z.compile: async custom predicates are not supported",
            );
          }
          const fnConst = addConstant(ctx, def.fn);
          const throwAsyncConst = addConstant(ctx, throwAsync);
          const resVar = newVar(ctx);
          doc.write(
            "const "
              .concat(resVar, " = ")
              .concat(fnConst, "(")
              .concat(accessor, ");"),
          );
          doc.write(
            "if ("
              .concat(resVar, " instanceof Promise) ")
              .concat(throwAsyncConst, "();"),
          );
          doc.write("if (!".concat(resVar, ") return INVALID;"));
        } else {
          throw new ZodCompileUnsupportedError(
            "custom schema without a predicate function",
          );
        }
        return accessor;
      }
      function runtimeCatch(innerSchema, catchValue, value) {
        const result = innerSchema._zod.run({ value, issues: [] }, {});
        if (result && typeof result.then === "function") return INVALID;
        const r = result;
        if (r.issues.length === 0) return r.value;
        return catchValue();
      }
      function generateCatchCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        if (!def.catchValue[util.CONSTANT_CATCH]) {
          throw new ZodCompileUnsupportedError(
            "catch with a callback (only a constant catch value compiles)",
            false,
          );
        }
        const outputVar = newVar(ctx);
        doc.write("let ".concat(outputVar, " = (() => {"));
        doc.indented((d) => {
          const innerOut = compileChild(d, ctx, def.innerType, accessor);
          d.write("return ".concat(innerOut, ";"));
        });
        doc.write("})();");
        const innerConst = addConstant(ctx, def.innerType);
        const catchConst = addConstant(ctx, def.catchValue);
        const catchHelperConst = addConstant(ctx, runtimeCatch);
        doc.write("if (".concat(outputVar, " === INVALID) {"));
        doc.indented((d) => {
          d.write(
            ""
              .concat(outputVar, " = ")
              .concat(catchHelperConst, "(")
              .concat(innerConst, ", ")
              .concat(catchConst, ", ")
              .concat(accessor, ");"),
          );
          d.write("if (".concat(outputVar, " === INVALID) return INVALID;"));
        });
        doc.write("}");
        return outputVar;
      }
      function generateTransformCheck(doc, ctx, schema, accessor) {
        const def = schema._zod.def;
        if (def.transform) {
          if (isAsyncFunction(def.transform)) {
            throw new ZodCompileAsyncError(
              "z.compile: async transforms are not supported",
            );
          }
          const transformFn = def.transform;
          const helperFn = (value) => {
            const fakePayload = { value, issues: [], addIssue: pushIssue };
            const result = transformFn(value, fakePayload);
            if (result instanceof Promise) return INVALID;
            return fakePayload.issues.length === 0 ? result : INVALID;
          };
          const helperConst = addConstant(ctx, helperFn);
          const outputVar = newVar(ctx);
          doc.write(
            "const "
              .concat(outputVar, " = ")
              .concat(helperConst, "(")
              .concat(accessor, ");"),
          );
          doc.write("if (".concat(outputVar, " === INVALID) return INVALID;"));
          return outputVar;
        }
        return accessor;
      }
      var api = __webpack_require__(8084);
      var to_json_schema = __webpack_require__(7148);
      var json_schema_processors = __webpack_require__(5382);
      class JSONSchemaGenerator {
        /** @deprecated Access via ctx instead */
        get metadataRegistry() {
          return this.ctx.metadataRegistry;
        }
        /** @deprecated Access via ctx instead */
        get target() {
          return this.ctx.target;
        }
        // annotated so the .d.cts emits an indexed access rather than an inline `import()` of an ESM path
        /** @deprecated Access via ctx instead */
        get unrepresentable() {
          return this.ctx.unrepresentable;
        }
        /** @deprecated Access via ctx instead */
        get override() {
          return this.ctx.override;
        }
        /** @deprecated Access via ctx instead */
        get io() {
          return this.ctx.io;
        }
        /** @deprecated Access via ctx instead */
        get counter() {
          return this.ctx.counter;
        }
        set counter(value) {
          this.ctx.counter = value;
        }
        /** @deprecated Access via ctx instead */
        get seen() {
          return this.ctx.seen;
        }
        constructor(params) {
          let normalizedTarget = params?.target ?? "draft-2020-12";
          if (normalizedTarget === "draft-4") normalizedTarget = "draft-04";
          if (normalizedTarget === "draft-7") normalizedTarget = "draft-07";
          this.ctx = (0, to_json_schema.az)({
            processors: json_schema_processors.Df,
            target: normalizedTarget,
            ...(params?.metadata && { metadata: params.metadata }),
            ...(params?.unrepresentable && {
              unrepresentable: params.unrepresentable,
            }),
            ...(params?.override && { override: params.override }),
            ...(params?.io && { io: params.io }),
          });
        }
        /**
         * Process a schema to prepare it for JSON Schema generation.
         * This must be called before emit().
         */
        process(schema, _params = { path: [], schemaPath: [] }) {
          return (0, to_json_schema.eh)(schema, this.ctx, _params);
        }
        /**
         * Emit the final JSON Schema after processing.
         * Must call process() first.
         */
        emit(schema, _params) {
          if (_params) {
            if (_params.cycles) this.ctx.cycles = _params.cycles;
            if (_params.reused) this.ctx.reused = _params.reused;
            if (_params.external) this.ctx.external = _params.external;
          }
          this.ctx.sharedDefsExtractedFor = void 0;
          this.ctx.sharedEmitDoneFor = void 0;
          (0, to_json_schema.Wb)(this.ctx, schema);
          const result = (0, to_json_schema.jE)(this.ctx, schema);
          const { "~standard": _, ...plainResult } = result;
          return plainResult;
        }
      }
      var classic_schemas = __webpack_require__(5273);
      var classic_errors = __webpack_require__(5378);
      var classic_parse = __webpack_require__(1746);
      const ZodIssueCode = {
        invalid_type: "invalid_type",
        too_big: "too_big",
        too_small: "too_small",
        invalid_format: "invalid_format",
        not_multiple_of: "not_multiple_of",
        unrecognized_keys: "unrecognized_keys",
        invalid_union: "invalid_union",
        invalid_key: "invalid_key",
        invalid_element: "invalid_element",
        invalid_value: "invalid_value",
        custom: "custom",
      };
      function setErrorMap(map) {
        core.$W({
          customError: map,
        });
      }
      function getErrorMap() {
        return core.$W().customError;
      }
      var ZodFirstPartyTypeKind;
      /* @__PURE__ */ (function (ZodFirstPartyTypeKind2) {})(
        ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}),
      );
      function datetime(params) {
        return api.G1(classic_schemas.ZodISODateTime, params);
      }
      function date(params) {
        return api.db(classic_schemas.ZodISODate, params);
      }
      function time(params) {
        return api.Kn(classic_schemas.ZodISOTime, params);
      }
      function duration(params) {
        return api.f2(classic_schemas.ZodISODuration, params);
      }
      const z = {
        ...classic_schemas,
        ...checks_namespaceObject,
        iso: iso_namespaceObject,
      };
      const RECOGNIZED_KEYS = /* @__PURE__ */ new Set([
        // Schema identification
        "$schema",
        "$ref",
        "$defs",
        "definitions",
        // Core schema keywords
        "$id",
        "id",
        "$comment",
        "$anchor",
        "$vocabulary",
        "$dynamicRef",
        "$dynamicAnchor",
        // Type
        "type",
        "enum",
        "const",
        // Composition
        "anyOf",
        "oneOf",
        "allOf",
        "not",
        // Object
        "properties",
        "required",
        "additionalProperties",
        "patternProperties",
        "propertyNames",
        "minProperties",
        "maxProperties",
        // Array
        "items",
        "prefixItems",
        "additionalItems",
        "minItems",
        "maxItems",
        "uniqueItems",
        "contains",
        "minContains",
        "maxContains",
        // String
        "minLength",
        "maxLength",
        "pattern",
        "format",
        // Number
        "minimum",
        "maximum",
        "exclusiveMinimum",
        "exclusiveMaximum",
        "multipleOf",
        // Already handled metadata
        "description",
        "default",
        // Content
        "contentEncoding",
        "contentMediaType",
        "contentSchema",
        // Unsupported (error-throwing)
        "unevaluatedItems",
        "unevaluatedProperties",
        "if",
        "then",
        "else",
        "dependentSchemas",
        "dependentRequired",
        // OpenAPI
        "nullable",
        "readOnly",
      ]);
      function detectVersion(schema, defaultTarget) {
        const $schema = schema.$schema;
        if ($schema === "https://json-schema.org/draft/2020-12/schema") {
          return "draft-2020-12";
        }
        if ($schema === "http://json-schema.org/draft-07/schema#") {
          return "draft-7";
        }
        if ($schema === "http://json-schema.org/draft-04/schema#") {
          return "draft-4";
        }
        return defaultTarget ?? "draft-2020-12";
      }
      function applyMinItems(items, minItems) {
        return items.map((item, index) =>
          index < minItems ? item : item.optional(),
        );
      }
      function decodeJSONPointerSegment(segment) {
        return segment.replace(/~1/g, "/").replace(/~0/g, "~");
      }
      function resolveRef(ref, ctx) {
        if (!ref.startsWith("#")) {
          throw new Error(
            "External $ref is not supported, only local refs (#/...) are allowed",
          );
        }
        const path = ref.slice(1).split("/").filter(Boolean);
        if (path.length === 0) {
          return ctx.rootSchema;
        }
        const defsKey =
          ctx.version === "draft-2020-12" ? "$defs" : "definitions";
        if (path[0] === defsKey) {
          const key =
            path[1] === void 0 ? void 0 : decodeJSONPointerSegment(path[1]);
          if (!key || !ctx.defs[key]) {
            throw new Error("Reference not found: ".concat(ref));
          }
          return ctx.defs[key];
        }
        throw new Error("Reference not found: ".concat(ref));
      }
      function checkPropertyNames(objectSchema, keySchema) {
        const guard = z
          .transform((value) => value)
          .check((payload) => {
            const value = payload.value;
            if (
              typeof value !== "object" ||
              value === null ||
              Array.isArray(value)
            )
              return;
            for (const key of Object.getOwnPropertyNames(value)) {
              const result = keySchema.safeParse(key);
              if (result.success) continue;
              payload.issues.push({
                code: "invalid_key",
                origin: "record",
                issues: result.error.issues,
                input: key,
                path: [key],
                continue: true,
              });
            }
          });
        return guard.pipe(objectSchema);
      }
      function getTupleRest(restSchema, ctx) {
        if (restSchema === false) {
          return void 0;
        }
        if (restSchema === void 0 || restSchema === true) {
          return z.any();
        }
        return convertSchema(restSchema, ctx);
      }
      const fullTime =
        /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;
      function convertBaseSchema(schema, ctx) {
        if (schema.not !== void 0) {
          if (
            typeof schema.not === "object" &&
            Object.keys(schema.not).length === 0
          ) {
            return z.never();
          }
          throw new Error(
            "not is not supported in Zod (except { not: {} } for never)",
          );
        }
        if (schema.unevaluatedItems !== void 0) {
          throw new Error("unevaluatedItems is not supported");
        }
        if (schema.unevaluatedProperties !== void 0) {
          throw new Error("unevaluatedProperties is not supported");
        }
        if (
          schema.if !== void 0 ||
          schema.then !== void 0 ||
          schema.else !== void 0
        ) {
          throw new Error(
            "Conditional schemas (if/then/else) are not supported",
          );
        }
        if (
          schema.dependentSchemas !== void 0 ||
          schema.dependentRequired !== void 0
        ) {
          throw new Error(
            "dependentSchemas and dependentRequired are not supported",
          );
        }
        if (schema.$ref) {
          const refPath = schema.$ref;
          if (ctx.refs.has(refPath)) {
            return ctx.refs.get(refPath);
          }
          if (ctx.processing.has(refPath)) {
            return z.lazy(() => {
              if (!ctx.refs.has(refPath)) {
                throw new Error(
                  "Circular reference not resolved: ".concat(refPath),
                );
              }
              return ctx.refs.get(refPath);
            });
          }
          ctx.processing.add(refPath);
          const resolved = resolveRef(refPath, ctx);
          const zodSchema2 = convertSchema(resolved, ctx);
          ctx.refs.set(refPath, zodSchema2);
          ctx.processing.delete(refPath);
          return zodSchema2;
        }
        if (schema.enum !== void 0) {
          const enumValues = schema.enum;
          if (
            ctx.version === "openapi-3.0" &&
            schema.nullable === true &&
            enumValues.length === 1 &&
            enumValues[0] === null
          ) {
            return z.null();
          }
          if (enumValues.length === 0) {
            return z.never();
          }
          if (enumValues.length === 1) {
            return z.literal(enumValues[0]);
          }
          if (enumValues.every((v) => typeof v === "string")) {
            return z.enum(enumValues);
          }
          const literalSchemas = enumValues.map((v) => z.literal(v));
          if (literalSchemas.length < 2) {
            return literalSchemas[0];
          }
          return z.union([
            literalSchemas[0],
            literalSchemas[1],
            ...literalSchemas.slice(2),
          ]);
        }
        if (schema.const !== void 0) {
          return z.literal(schema.const);
        }
        const type = schema.type;
        if (Array.isArray(type)) {
          const typeSchemas = type.map((t) => {
            const typeSchema = { ...schema, type: t };
            return convertBaseSchema(typeSchema, ctx);
          });
          if (typeSchemas.length === 0) {
            return z.never();
          }
          if (typeSchemas.length === 1) {
            return typeSchemas[0];
          }
          return z.union(typeSchemas);
        }
        if (!type) {
          return z.any();
        }
        let zodSchema;
        switch (type) {
          case "string": {
            let stringSchema = z.string();
            if (schema.format) {
              const format = schema.format;
              if (format === "email") {
                stringSchema = stringSchema.check(z.email());
              } else if (format === "uri" || format === "uri-reference") {
                stringSchema = stringSchema.check(z.url());
              } else if (format === "uuid" || format === "guid") {
                stringSchema = stringSchema.check(z.uuid());
              } else if (format === "date-time") {
                stringSchema = stringSchema.check(
                  z.iso.datetime({ offset: true }),
                );
              } else if (format === "date") {
                stringSchema = stringSchema.check(z.iso.date());
              } else if (format === "time") {
                stringSchema = stringSchema.check(z.regex(fullTime));
              } else if (format === "duration") {
                stringSchema = stringSchema.check(z.iso.duration());
              } else if (format === "hostname") {
                stringSchema = stringSchema.check(z.hostname());
              } else if (format === "ipv4") {
                stringSchema = stringSchema.check(z.ipv4());
              } else if (format === "ipv6") {
                stringSchema = stringSchema.check(z.ipv6());
              } else if (format === "mac") {
                stringSchema = stringSchema.check(z.mac());
              } else if (format === "cidr") {
                stringSchema = stringSchema.check(z.cidrv4());
              } else if (format === "cidr-v6") {
                stringSchema = stringSchema.check(z.cidrv6());
              } else if (format === "base64") {
                stringSchema = stringSchema.check(z.base64());
              } else if (format === "base64url") {
                stringSchema = stringSchema.check(z.base64url());
              } else if (format === "e164") {
                stringSchema = stringSchema.check(z.e164());
              } else if (format === "credit_card") {
                stringSchema = stringSchema.check(z.creditCard());
              } else if (format === "jwt") {
                stringSchema = stringSchema.check(z.jwt());
              } else if (format === "emoji") {
                stringSchema = stringSchema.check(z.emoji());
              } else if (format === "nanoid") {
                stringSchema = stringSchema.check(z.nanoid());
              } else if (format === "cuid") {
                stringSchema = stringSchema.check(z.cuid());
              } else if (format === "cuid2") {
                stringSchema = stringSchema.check(z.cuid2());
              } else if (format === "ulid") {
                stringSchema = stringSchema.check(z.ulid());
              } else if (format === "xid") {
                stringSchema = stringSchema.check(z.xid());
              } else if (format === "ksuid") {
                stringSchema = stringSchema.check(z.ksuid());
              }
            }
            if (typeof schema.minLength === "number") {
              stringSchema = stringSchema.min(schema.minLength);
            }
            if (typeof schema.maxLength === "number") {
              stringSchema = stringSchema.max(schema.maxLength);
            }
            if (schema.pattern) {
              stringSchema = stringSchema.regex(new RegExp(schema.pattern));
            }
            zodSchema = stringSchema;
            break;
          }
          case "number":
          case "integer": {
            let numberSchema =
              type === "integer" ? z.number().int() : z.number();
            if (
              typeof schema.minimum === "number" &&
              schema.exclusiveMinimum !== true
            ) {
              numberSchema = numberSchema.min(schema.minimum);
            }
            if (
              typeof schema.maximum === "number" &&
              schema.exclusiveMaximum !== true
            ) {
              numberSchema = numberSchema.max(schema.maximum);
            }
            if (typeof schema.exclusiveMinimum === "number") {
              numberSchema = numberSchema.gt(schema.exclusiveMinimum);
            } else if (
              schema.exclusiveMinimum === true &&
              typeof schema.minimum === "number"
            ) {
              numberSchema = numberSchema.gt(schema.minimum);
            }
            if (typeof schema.exclusiveMaximum === "number") {
              numberSchema = numberSchema.lt(schema.exclusiveMaximum);
            } else if (
              schema.exclusiveMaximum === true &&
              typeof schema.maximum === "number"
            ) {
              numberSchema = numberSchema.lt(schema.maximum);
            }
            if (typeof schema.multipleOf === "number") {
              numberSchema = numberSchema.multipleOf(schema.multipleOf);
            }
            zodSchema = numberSchema;
            break;
          }
          case "boolean": {
            zodSchema = z.boolean();
            break;
          }
          case "null": {
            zodSchema = z.null();
            break;
          }
          case "object": {
            const shape = {};
            const properties = schema.properties || {};
            const requiredSet = new Set(schema.required || []);
            const additionalSchema =
              typeof schema.additionalProperties === "object"
                ? convertSchema(schema.additionalProperties, ctx)
                : void 0;
            for (const [key, propSchema] of Object.entries(properties)) {
              const propZodSchema = convertSchema(propSchema, ctx);
              (0, util.assignProp)(
                shape,
                key,
                requiredSet.has(key) ? propZodSchema : propZodSchema.optional(),
              );
            }
            if (schema.patternProperties) {
              const patternProps = schema.patternProperties;
              const patternKeys = Object.keys(patternProps);
              const looseRecords = [];
              for (const pattern of patternKeys) {
                const patternValue = convertSchema(patternProps[pattern], ctx);
                const keySchema = z.string().regex(new RegExp(pattern));
                looseRecords.push(z.looseRecord(keySchema, patternValue));
              }
              const schemasToIntersect = [];
              if (Object.keys(shape).length > 0) {
                schemasToIntersect.push(z.object(shape).passthrough());
              }
              schemasToIntersect.push(...looseRecords);
              if (schemasToIntersect.length === 0) {
                zodSchema = z.object({}).passthrough();
              } else if (schemasToIntersect.length === 1) {
                zodSchema = schemasToIntersect[0];
              } else {
                let result = z.intersection(
                  schemasToIntersect[0],
                  schemasToIntersect[1],
                );
                for (let i = 2; i < schemasToIntersect.length; i++) {
                  result = z.intersection(result, schemasToIntersect[i]);
                }
                zodSchema = result;
              }
              if (schema.additionalProperties === false) {
                const propertyKeys = Object.keys(shape);
                const patterns = patternKeys.map((p) => new RegExp(p));
                const basePatternSchema = zodSchema;
                zodSchema = zodSchema.check((payload) => {
                  if (!(0, util.isPlainObject)(payload.value)) return;
                  const unrecognized = [];
                  for (const key of Object.keys(payload.value)) {
                    if (propertyKeys.includes(key)) continue;
                    if (patterns.some((regex) => regex.test(key))) continue;
                    unrecognized.push(key);
                  }
                  if (unrecognized.length) {
                    payload.issues.push({
                      code: "unrecognized_keys",
                      keys: unrecognized,
                      input: payload.value,
                      inst: basePatternSchema,
                    });
                  }
                });
              }
            } else {
              const objectSchema = z.object(shape);
              if (schema.additionalProperties === false) {
                zodSchema = objectSchema.strict();
              } else if (additionalSchema) {
                zodSchema = objectSchema.catchall(additionalSchema);
              } else {
                zodSchema = objectSchema.passthrough();
              }
            }
            if (
              schema.propertyNames !== void 0 &&
              schema.propertyNames !== true
            ) {
              const keyJSONSchema =
                typeof schema.propertyNames === "object" &&
                schema.propertyNames.type === void 0
                  ? { type: "string", ...schema.propertyNames }
                  : schema.propertyNames;
              zodSchema = checkPropertyNames(
                zodSchema,
                convertSchema(keyJSONSchema, ctx),
              );
            }
            break;
          }
          case "array": {
            const prefixItems = schema.prefixItems;
            const items = schema.items;
            if (prefixItems && Array.isArray(prefixItems)) {
              const minItems =
                typeof schema.minItems === "number" ? schema.minItems : 0;
              const tupleItems = prefixItems.map((item) =>
                convertSchema(item, ctx),
              );
              const positionalItems = applyMinItems(tupleItems, minItems);
              const rest = !Array.isArray(items)
                ? getTupleRest(items, ctx)
                : void 0;
              const tupleSchema = z.tuple(positionalItems);
              zodSchema = rest ? tupleSchema.rest(rest) : tupleSchema;
              if (typeof schema.minItems === "number") {
                zodSchema = zodSchema.check(z.minLength(schema.minItems));
              }
              if (typeof schema.maxItems === "number") {
                zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
              }
            } else if (Array.isArray(items)) {
              const minItems =
                typeof schema.minItems === "number" ? schema.minItems : 0;
              const tupleItems = items.map((item) => convertSchema(item, ctx));
              const positionalItems = applyMinItems(tupleItems, minItems);
              const rest = getTupleRest(schema.additionalItems, ctx);
              const tupleSchema = z.tuple(positionalItems);
              zodSchema = rest ? tupleSchema.rest(rest) : tupleSchema;
              if (typeof schema.minItems === "number") {
                zodSchema = zodSchema.check(z.minLength(schema.minItems));
              }
              if (typeof schema.maxItems === "number") {
                zodSchema = zodSchema.check(z.maxLength(schema.maxItems));
              }
            } else if (items !== void 0) {
              const element = convertSchema(items, ctx);
              let arraySchema = z.array(element);
              if (typeof schema.minItems === "number") {
                arraySchema = arraySchema.min(schema.minItems);
              }
              if (typeof schema.maxItems === "number") {
                arraySchema = arraySchema.max(schema.maxItems);
              }
              zodSchema = arraySchema;
            } else {
              zodSchema = z.array(z.any());
            }
            break;
          }
          default:
            throw new Error("Unsupported type: ".concat(type));
        }
        return zodSchema;
      }
      function convertSchema(schema, ctx) {
        if (typeof schema === "boolean") {
          return schema ? z.any() : z.never();
        }
        let baseSchema = convertBaseSchema(schema, ctx);
        const hasExplicitType =
          schema.type || schema.enum !== void 0 || schema.const !== void 0;
        if (schema.anyOf && Array.isArray(schema.anyOf)) {
          const options = schema.anyOf.map((s) => convertSchema(s, ctx));
          const anyOfUnion = z.union(options);
          baseSchema = hasExplicitType
            ? z.intersection(baseSchema, anyOfUnion)
            : anyOfUnion;
        }
        if (schema.oneOf && Array.isArray(schema.oneOf)) {
          const options = schema.oneOf.map((s) => convertSchema(s, ctx));
          const oneOfUnion = z.xor(options);
          baseSchema = hasExplicitType
            ? z.intersection(baseSchema, oneOfUnion)
            : oneOfUnion;
        }
        if (schema.allOf && Array.isArray(schema.allOf)) {
          if (schema.allOf.length === 0) {
            baseSchema = hasExplicitType ? baseSchema : z.any();
          } else {
            let result = hasExplicitType
              ? baseSchema
              : convertSchema(schema.allOf[0], ctx);
            const startIdx = hasExplicitType ? 0 : 1;
            for (let i = startIdx; i < schema.allOf.length; i++) {
              result = z.intersection(
                result,
                convertSchema(schema.allOf[i], ctx),
              );
            }
            baseSchema = result;
          }
        }
        if (schema.nullable === true && ctx.version === "openapi-3.0") {
          baseSchema = z.nullable(baseSchema);
        }
        if (schema.readOnly === true) {
          baseSchema = z.readonly(baseSchema);
        }
        if (schema.default !== void 0) {
          baseSchema = baseSchema.default(schema.default);
        }
        const extraMeta = {};
        const coreMetadataKeys = [
          "$id",
          "id",
          "$comment",
          "$anchor",
          "$vocabulary",
          "$dynamicRef",
          "$dynamicAnchor",
        ];
        for (const key of coreMetadataKeys) {
          if (key in schema) {
            extraMeta[key] = schema[key];
          }
        }
        const contentMetadataKeys = [
          "contentEncoding",
          "contentMediaType",
          "contentSchema",
        ];
        for (const key of contentMetadataKeys) {
          if (key in schema) {
            extraMeta[key] = schema[key];
          }
        }
        if (
          schema.propertyNames !== void 0 &&
          schema.type === "object" &&
          schema.$ref === void 0
        ) {
          extraMeta.propertyNames = schema.propertyNames;
        }
        for (const key of Object.keys(schema)) {
          if (!RECOGNIZED_KEYS.has(key)) {
            (0, util.assignProp)(extraMeta, key, schema[key]);
          }
        }
        if (Object.keys(extraMeta).length > 0) {
          ctx.registry.add(baseSchema, extraMeta);
        }
        if (schema.description) {
          baseSchema = baseSchema.describe(schema.description);
        }
        return baseSchema;
      }
      function fromJSONSchema(schema, params) {
        if (typeof schema === "boolean") {
          return schema ? z.any() : z.never();
        }
        let normalized;
        try {
          normalized = JSON.parse(JSON.stringify(schema));
        } catch {
          throw new Error(
            "fromJSONSchema input is not valid JSON (possibly cyclic); use $defs/$ref for recursive schemas",
          );
        }
        const version = detectVersion(normalized, params?.defaultTarget);
        const defs = normalized.$defs || normalized.definitions || {};
        const ctx = {
          version,
          defs,
          refs: /* @__PURE__ */ new Map(),
          processing: /* @__PURE__ */ new Set(),
          rootSchema: normalized,
          registry: params?.registry ?? registries.fd,
        };
        return convertSchema(normalized, ctx);
      }
      const RESOLVING = /* @__PURE__ */ Symbol("z.visit/resolving");
      function visit(schema, fnOrHandlers) {
        const fn =
          typeof fnOrHandlers === "function"
            ? fnOrHandlers
            : (node, rewritten) => {
                const h = fnOrHandlers[node._zod.def.type];
                return h ? h(node, rewritten) : node;
              };
        const cache = /* @__PURE__ */ new Map();
        function run(s) {
          const cached = cache.get(s);
          if (cached === RESOLVING) {
            return new schemas.kU({
              type: "lazy",
              getter: () => cache.get(s),
            });
          }
          if (cached !== void 0) return cached;
          cache.set(s, RESOLVING);
          const inner = mapInner(s);
          const mapped = fn(inner, inner !== s);
          cache.set(s, mapped);
          return mapped;
        }
        function mapInner(s) {
          const def = s._zod.def;
          const kind = def.type;
          switch (kind) {
            case "object": {
              const oldShape = def.shape;
              const keys = Object.keys(oldShape);
              let changed = false;
              const newShape = {};
              for (const k of keys) {
                const mapped = run(oldShape[k]);
                if (mapped !== oldShape[k]) changed = true;
                newShape[k] = mapped;
              }
              let newCatchall = def.catchall;
              if (def.catchall) {
                newCatchall = run(def.catchall);
                if (newCatchall !== def.catchall) changed = true;
              }
              return changed
                ? (0, util.clone)(s, {
                    ...def,
                    shape: newShape,
                    catchall: newCatchall,
                  })
                : s;
            }
            case "array": {
              const mapped = run(def.element);
              return mapped === def.element
                ? s
                : (0, util.clone)(s, { ...def, element: mapped });
            }
            case "tuple": {
              const oldItems = def.items;
              let changed = false;
              const newItems = [];
              for (const item of oldItems) {
                const mapped = run(item);
                if (mapped !== item) changed = true;
                newItems.push(mapped);
              }
              let newRest = def.rest;
              if (def.rest) {
                newRest = run(def.rest);
                if (newRest !== def.rest) changed = true;
              }
              return changed
                ? (0, util.clone)(s, { ...def, items: newItems, rest: newRest })
                : s;
            }
            case "record":
            case "map": {
              const newKey = run(def.keyType);
              const newVal = run(def.valueType);
              return newKey === def.keyType && newVal === def.valueType
                ? s
                : (0, util.clone)(s, {
                    ...def,
                    keyType: newKey,
                    valueType: newVal,
                  });
            }
            case "set": {
              const newVal = run(def.valueType);
              return newVal === def.valueType
                ? s
                : (0, util.clone)(s, { ...def, valueType: newVal });
            }
            case "union": {
              const oldOptions = def.options;
              let changed = false;
              const newOptions = [];
              for (const opt of oldOptions) {
                const mapped = run(opt);
                if (mapped !== opt) changed = true;
                newOptions.push(mapped);
              }
              return changed
                ? (0, util.clone)(s, { ...def, options: newOptions })
                : s;
            }
            case "intersection": {
              const newLeft = run(def.left);
              const newRight = run(def.right);
              return newLeft === def.left && newRight === def.right
                ? s
                : (0, util.clone)(s, {
                    ...def,
                    left: newLeft,
                    right: newRight,
                  });
            }
            case "optional":
            case "nullable":
            case "default":
            case "prefault":
            case "catch":
            case "readonly":
            case "nonoptional":
            case "promise":
            case "success": {
              const newInner = run(def.innerType);
              return newInner === def.innerType
                ? s
                : (0, util.clone)(s, { ...def, innerType: newInner });
            }
            case "pipe": {
              const newIn = run(def.in);
              const newOut = run(def.out);
              return newIn === def.in && newOut === def.out
                ? s
                : (0, util.clone)(s, { ...def, in: newIn, out: newOut });
            }
            case "function": {
              const newInput = run(def.input);
              const newOutput = run(def.output);
              return newInput === def.input && newOutput === def.output
                ? s
                : (0, util.clone)(s, {
                    ...def,
                    input: newInput,
                    output: newOutput,
                  });
            }
            case "lazy": {
              const original = def.getter;
              const { _cachedInner, ...rest } = def;
              return (0, util.clone)(s, {
                ...rest,
                getter: () => run(original()),
              });
            }
            // A leaf by choice: `parts` are regex fragments, not data positions.
            case "template_literal":
            // Leaves.
            case "string":
            case "number":
            case "int":
            case "boolean":
            case "bigint":
            case "symbol":
            case "undefined":
            case "null":
            case "void":
            case "never":
            case "any":
            case "unknown":
            case "date":
            case "nan":
            case "enum":
            case "literal":
            case "file":
            case "transform":
            case "custom":
              return s;
            default: {
              kind;
              return s;
            }
          }
        }
        return run(schema);
      }
      function deepPartial(schema) {
        return visit(schema, {
          object: (s) => s.partial(),
          // Every partialed option now admits `undefined`, which the constructor rejects as a duplicate.
          union: (s) => {
            const def = s._zod.def;
            return def.discriminator === void 0
              ? s
              : classic_schemas.union(def.options);
          },
        });
      }
      function withChecks(side, checks2) {
        if (!checks2?.length) return side;
        const def = side._zod.def;
        return (0, util.clone)(
          side,
          (0, util.mergeDefs)(def, {
            checks: [...(def.checks ?? []), ...checks2],
          }),
          { parent: true },
        );
      }
      function outSide(def) {
        return withChecks(def.out, def.checks);
      }
      function inSide(def) {
        return def.in._zod.traits.has("$ZodTransform") ? outSide(def) : def.in;
      }
      function input(schema) {
        return visit(schema, {
          pipe: (s) => inSide(s._zod.def),
          // A default value belongs to the output side, so a rewritten inner type leaves it stranded. `.default()` widens the declared input type with `undefined`, and `optional` is what carries that across.
          default: (s, rewritten) =>
            rewritten ? classic_schemas.optional(s._zod.def.innerType) : s,
          // A catch value is output-side too, but `.catch()` leaves the declared input type alone, so the inner schema stands on its own.
          catch: (s, rewritten) => (rewritten ? s._zod.def.innerType : s),
        });
      }
      function output(schema) {
        return visit(schema, {
          pipe: (s) => outSide(s._zod.def),
          // A prefault value is fed through the schema, which makes it input-side, so a rewritten inner type leaves it stranded.
          prefault: (s, rewritten) => (rewritten ? s._zod.def.innerType : s),
        });
      }
      function string(params) {
        return api.K_(classic_schemas.ZodString, params);
      }
      function number(params) {
        return api.qG(classic_schemas.ZodNumber, params);
      }
      function coerce_boolean(params) {
        return api.dN(classic_schemas.ZodBoolean, params);
      }
      function bigint(params) {
        return api.St(classic_schemas.ZodBigInt, params);
      }
      function coerce_date(params) {
        return api.B4(classic_schemas.ZodDate, params);
      }
    },
  },
]);
