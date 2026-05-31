import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { downloadArtifact } from "@electron/get";

const electronRoot = path.join(process.cwd(), "node_modules", "electron");
const electronPackagePath = path.join(electronRoot, "package.json");
const distPath = path.join(electronRoot, "dist");
const pathFile = path.join(electronRoot, "path.txt");

if (!existsSync(electronPackagePath)) {
  process.exit(0);
}

const electronPackage = JSON.parse(readFileSync(electronPackagePath, "utf8"));
const platform = process.env.ELECTRON_INSTALL_PLATFORM || process.env.npm_config_platform || process.platform;
const arch = process.env.ELECTRON_INSTALL_ARCH || process.env.npm_config_arch || process.arch;
const platformPath = getPlatformPath(platform);
const executablePath = path.join(distPath, platformPath);

if (existsSync(pathFile) && existsSync(executablePath)) {
  process.exit(0);
}

if (!existsSync(executablePath)) {
  const zipPath = await downloadArtifact({
    version: electronPackage.version,
    artifactName: "electron",
    platform,
    arch,
    cacheRoot: process.env.electron_config_cache,
    checksums: JSON.parse(readFileSync(path.join(electronRoot, "checksums.json"), "utf8"))
  });

  mkdirSync(distPath, { recursive: true });

  const extractCommand = process.platform === "darwin" ? "ditto" : "unzip";
  const extractArgs =
    process.platform === "darwin"
      ? ["-x", "-k", zipPath, distPath]
      : ["-oq", zipPath, "-d", distPath];

  const unzip = spawnSync(extractCommand, extractArgs, {
    stdio: "inherit"
  });

  if (unzip.status !== 0) {
    throw new Error(`Failed to extract Electron from ${zipPath}`);
  }
}

writeFileSync(pathFile, platformPath);

function getPlatformPath(platformName) {
  switch (platformName) {
    case "mas":
    case "darwin":
      return "Electron.app/Contents/MacOS/Electron";
    case "freebsd":
    case "openbsd":
    case "linux":
      return "electron";
    case "win32":
      return "electron.exe";
    default:
      throw new Error(`Electron builds are not available on platform: ${platformName}`);
  }
}
