import { spawn, spawnSync } from "node:child_process";
import http from "node:http";
import path from "node:path";

const isWindows = process.platform === "win32";
const binExtension = isWindows ? ".cmd" : "";
const binDir = path.join(process.cwd(), "node_modules", ".bin");
const electronBin = path.join(binDir, `electron${binExtension}`);
const tscBin = path.join(binDir, `tsc${binExtension}`);
const viteBin = path.join(binDir, `vite${binExtension}`);
const mainEntry = path.join(process.cwd(), "dist", "main", "main.js");
const rendererUrl = "http://127.0.0.1:5173";

const children = [];

function run(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false,
    ...options
  });
  children.push(child);
  return child;
}

function waitForHttp(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      http
        .get(url, (response) => {
          response.resume();
          resolve();
        })
        .on("error", () => {
          if (Date.now() - startedAt > timeoutMs) {
            reject(new Error(`Timed out waiting for ${url}`));
            return;
          }

          setTimeout(check, 250);
        });
    };

    check();
  });
}

function cleanup() {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
}

process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});

try {
  const compile = spawnSync(tscBin, ["-p", "tsconfig.main.json"], {
    stdio: "inherit"
  });

  if (compile.status !== 0) {
    throw new Error("Main process TypeScript build failed");
  }

  run(viteBin, ["--host", "127.0.0.1"]);
  await waitForHttp(rendererUrl);

  const electron = run(electronBin, [mainEntry], {
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: rendererUrl
    }
  });

  electron.on("exit", (code) => {
    cleanup();
    process.exit(code ?? 0);
  });
} catch (error) {
  console.error(error);
  cleanup();
  process.exit(1);
}
