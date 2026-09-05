(() => {
  var __webpack_modules__ = {
    /***/
    2331() {},
    /******/
  };
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== void 0) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = {
      /******/
      // no module.id needed
      /******/
      // no module.loaded needed
      /******/
      exports: {},
      /******/
    });
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }
  __webpack_require__.m = __webpack_modules__;
  __webpack_require__.x = () => {
    var __webpack_exports__2 = __webpack_require__.O(void 0, [63, 325], () =>
      __webpack_require__(4325),
    );
    __webpack_exports__2 = __webpack_require__.O(__webpack_exports__2);
    return __webpack_exports__2;
  };
  (() => {
    var deferred = [];
    __webpack_require__.O = (result, chunkIds, fn, priority) => {
      if (chunkIds) {
        priority = priority || 0;
        for (
          var i = deferred.length;
          i > 0 && deferred[i - 1][2] > priority;
          i--
        )
          deferred[i] = deferred[i - 1];
        deferred[i] = [chunkIds, fn, priority];
        return;
      }
      var notFulfilled = Infinity;
      for (var i = 0; i < deferred.length; i++) {
        var [chunkIds, fn, priority] = deferred[i];
        var fulfilled = true;
        for (var j = 0; j < chunkIds.length; j++) {
          if (
            (priority & false || notFulfilled >= priority) &&
            Object.keys(__webpack_require__.O).every((key) =>
              __webpack_require__.O[key](chunkIds[j]),
            )
          ) {
            chunkIds.splice(j--, 1);
          } else {
            fulfilled = false;
            if (priority < notFulfilled) notFulfilled = priority;
          }
        }
        if (fulfilled) {
          deferred.splice(i--, 1);
          var r = fn();
          if (r !== void 0) result = r;
        }
      }
      return result;
    };
  })();
  (() => {
    var getProto = Object.getPrototypeOf
      ? (obj) => Object.getPrototypeOf(obj)
      : (obj) => obj.__proto__;
    var leafPrototypes;
    __webpack_require__.t = function (value, mode) {
      if (mode & 1) value = this(value);
      if (mode & 8) return value;
      if (typeof value === "object" && value) {
        if (mode & 4 && value.__esModule) return value;
        if (mode & 16 && typeof value.then === "function") return value;
      }
      var ns = /* @__PURE__ */ Object.create(null);
      __webpack_require__.r(ns);
      var def = {};
      leafPrototypes = leafPrototypes || [
        null,
        getProto({}),
        getProto([]),
        getProto(getProto),
      ];
      for (
        var current = mode & 2 && value;
        (typeof current == "object" || typeof current == "function") &&
        !~leafPrototypes.indexOf(current);
        current = getProto(current)
      ) {
        Object.getOwnPropertyNames(current).forEach(
          (key) => (def[key] = () => value[key]),
        );
      }
      def["default"] = () => value;
      __webpack_require__.d(ns, def);
      return ns;
    };
  })();
  (() => {
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();
  (() => {
    __webpack_require__.f = {};
    __webpack_require__.e = (chunkId) => {
      return Promise.all(
        Object.keys(__webpack_require__.f).reduce((promises, key) => {
          __webpack_require__.f[key](chunkId, promises);
          return promises;
        }, []),
      );
    };
  })();
  (() => {
    __webpack_require__.u = (chunkId) => {
      return "" + chunkId + ".bundle.js";
    };
  })();
  (() => {
    __webpack_require__.g = (function () {
      if (typeof globalThis === "object") return globalThis;
      try {
        return this || new Function("return this")();
      } catch (e) {
        if (typeof window === "object") return window;
      }
    })();
  })();
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();
  (() => {
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();
  (() => {
    var scriptUrl;
    if (__webpack_require__.g.importScripts)
      scriptUrl = __webpack_require__.g.location + "";
    var document = __webpack_require__.g.document;
    if (!scriptUrl && document) {
      if (
        document.currentScript &&
        document.currentScript.tagName.toUpperCase() === "SCRIPT"
      )
        scriptUrl = document.currentScript.src;
      if (!scriptUrl) {
        var scripts = document.getElementsByTagName("script");
        if (scripts.length) {
          var i = scripts.length - 1;
          while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl)))
            scriptUrl = scripts[i--].src;
        }
      }
    }
    if (!scriptUrl)
      throw new Error("Automatic publicPath is not supported in this browser");
    scriptUrl = scriptUrl
      .replace(/^blob:/, "")
      .replace(/#.*$/, "")
      .replace(/\?.*$/, "")
      .replace(/\/[^\/]+$/, "/");
    __webpack_require__.p = scriptUrl;
  })();
  (() => {
    var installedChunks = {
      /******/
      331: 1,
      /******/
      712: 1,
      /******/
    };
    var installChunk = (data) => {
      var [chunkIds, moreModules, runtime] = data;
      for (var moduleId in moreModules) {
        if (__webpack_require__.o(moreModules, moduleId)) {
          __webpack_require__.m[moduleId] = moreModules[moduleId];
        }
      }
      if (runtime) runtime(__webpack_require__);
      while (chunkIds.length) installedChunks[chunkIds.pop()] = 1;
      parentChunkLoadingFunction(data);
    };
    __webpack_require__.f.i = (chunkId, promises) => {
      if (!installedChunks[chunkId]) {
        if (true) {
          importScripts(__webpack_require__.p + __webpack_require__.u(chunkId));
        }
      }
    };
    var chunkLoadingGlobal = (self["webpackChunk_lovstudio_dsh_video_studio"] =
      self["webpackChunk_lovstudio_dsh_video_studio"] || []);
    var parentChunkLoadingFunction =
      chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
    chunkLoadingGlobal.push = installChunk;
  })();
  (() => {
    var next = __webpack_require__.x;
    __webpack_require__.x = () => {
      return Promise.all([
        /******/
        __webpack_require__.e(63),
        /******/
        __webpack_require__.e(325),
        /******/
      ]).then(next);
    };
  })();
  var __webpack_exports__ = __webpack_require__.x();
})();
