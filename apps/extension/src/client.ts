import http from "node:http";
import type { ProjectContext } from "./context";

const DEFAULT_DESKTOP_CONTEXT_URL = "http://localhost:3737/context";
const REQUEST_TIMEOUT_MS = 5000;

export type SendContextResponse = {
  ok: boolean;
  message?: string;
  error?: string;
};

export async function sendContextToDesktop(
  context: ProjectContext,
  endpoint = DEFAULT_DESKTOP_CONTEXT_URL
): Promise<SendContextResponse> {
  console.log(`hey-micki sending context to desktop app: ${endpoint}`);

  const response = await postJson<SendContextResponse>(endpoint, context);

  if (!response.ok) {
    throw new Error(response.error ?? "Micki desktop app did not accept the project context.");
  }

  console.log("hey-micki desktop app accepted context:", {
    workspaceName: context.workspaceName,
    fileCount: context.fileTree.length,
    message: response.message
  });

  return response;
}

function postJson<TResponse>(endpoint: string, body: unknown): Promise<TResponse> {
  const url = new URL(endpoint);
  const payload = JSON.stringify(body);

  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        },
        timeout: REQUEST_TIMEOUT_MS
      },
      (response) => {
        let responseBody = "";

        response.on("data", (chunk: Buffer) => {
          responseBody += chunk.toString("utf8");
        });

        response.on("end", () => {
          if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
            reject(
              new Error(
                `Micki desktop app returned ${response.statusCode ?? "an unknown status"}: ${
                  responseBody || "No response body"
                }`
              )
            );
            return;
          }

          try {
            resolve(JSON.parse(responseBody) as TResponse);
          } catch {
            reject(new Error("Micki desktop app returned an invalid JSON response."));
          }
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error("Timed out connecting to the Micki desktop app."));
    });

    request.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "ECONNREFUSED" || error.code === "ENOTFOUND" || error.code === "EHOSTUNREACH") {
        console.log("hey-micki desktop app not running:", {
          endpoint,
          code: error.code
        });
        reject(new Error("Micki desktop app is not running. Start the Micki desktop app and try again."));
        return;
      }

      reject(error);
    });

    request.write(payload);
    request.end();
  });
}
