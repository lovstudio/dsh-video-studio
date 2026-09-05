import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { StudioRuntime } from "./runtime";
import { devRequestRejection } from "./http";

const currentDir = dirname(fileURLToPath(import.meta.url));
const packageRoot =
  currentDir.endsWith("/src/host") || currentDir.endsWith("\\src\\host")
    ? resolve(currentDir, "../..")
    : resolve(currentDir, "..");
const port = Number(process.env.DSH_VIDEO_PORT ?? "4318");
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("DSH_VIDEO_PORT must be a valid TCP port");
const server = createServer((req, res) => {
  if (req.url === "/" && devRequestRejection(req, port) === undefined) {
    res.writeHead(302, { Location: "/video-studio/" });
    res.end();
    return;
  }
  void runtime.handle(req, res);
});
const runtime = new StudioRuntime({
  config: {
    dataDir:
      process.env.DSH_VIDEO_DATA_DIR ?? resolve(packageRoot, ".studio-data"),
  },
  studioDir: resolve(packageRoot, "lib/studio"),
  remotionDir: resolve(packageRoot, "lib/remotion"),
  authorize: (req) => devRequestRejection(req, port),
});
await runtime.init();
await new Promise<void>((done, reject) => {
  server.once("error", reject);
  server.listen(port, "127.0.0.1", () => {
    server.off("error", reject);
    done();
  });
});
console.log(
  `Video Studio: http://127.0.0.1:${(server.address() as AddressInfo).port}/video-studio/`,
);
let stopping = false;
async function stop(): Promise<void> {
  if (stopping) return;
  stopping = true;
  const closed = new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
  server.closeAllConnections();
  await runtime.dispose();
  await closed;
}
process.once("SIGINT", () => {
  void stop();
});
process.once("SIGTERM", () => {
  void stop();
});
