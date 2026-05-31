import http from "node:http";
import { getContextSummary, setLatestContext, type ProjectContext } from "./contextStore.js";

const PORT = 3737;
const MAX_BODY_BYTES = 1024 * 1024;

let server: http.Server | null = null;

export function startServer() {
  if (server) {
    return server;
  }

  server = http.createServer((request, response) => {
    setJsonHeaders(response);

    if (request.method === "OPTIONS") {
      response.writeHead(204);
      response.end();
      return;
    }

    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200);
      response.end('{ "ok": true }');
      return;
    }

    if (request.method === "GET" && request.url === "/context") {
      response.writeHead(200);
      response.end(JSON.stringify(getContextSummary()));
      return;
    }

    if (request.method === "POST" && request.url === "/context") {
      readJsonBody(request)
        .then((context) => {
          setLatestContext(context);
          response.writeHead(200);
          response.end('{ "ok": true, "message": "Context received" }');
        })
        .catch((error) => {
          response.writeHead(error.statusCode ?? 400);
          response.end(JSON.stringify({ ok: false, error: error.message }));
        });
      return;
    }

    response.writeHead(404);
    response.end(JSON.stringify({ ok: false, error: "Not found" }));
  });

  server.listen(PORT, "127.0.0.1", () => {
    console.log(`hey-micki local server listening on http://localhost:${PORT}`);
  });

  return server;
}

function setJsonHeaders(response: http.ServerResponse) {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function readJsonBody(request: http.IncomingMessage): Promise<ProjectContext> {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk: Buffer) => {
      body += chunk.toString("utf8");

      if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
        const error = new Error("Request body too large") as Error & { statusCode: number };
        error.statusCode = 413;
        reject(error);
        request.destroy();
      }
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(body) as ProjectContext);
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });

    request.on("error", reject);
  });
}
