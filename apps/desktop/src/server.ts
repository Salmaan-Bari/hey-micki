import http from "node:http";

const PORT = 3737;

let server: http.Server | null = null;

export function startServer() {
  if (server) {
    return server;
  }

  server = http.createServer((request, response) => {
    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200, {
        "Content-Type": "application/json"
      });
      response.end('{ "ok": true }');
      return;
    }

    response.writeHead(404, {
      "Content-Type": "application/json"
    });
    response.end(JSON.stringify({ ok: false, error: "Not found" }));
  });

  server.listen(PORT, "127.0.0.1", () => {
    console.log(`hey-micki local server listening on http://localhost:${PORT}`);
  });

  return server;
}
