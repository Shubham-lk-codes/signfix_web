const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const outputDirectory = path.join(__dirname, "out");
const port = Number.parseInt(process.env.PORT || "3000", 10);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function resolveRequestFile(requestUrl) {
  let pathname;

  try {
    pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  } catch {
    return null;
  }

  if (pathname.includes("\0")) return null;

  const route = pathname.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const candidates = route
    ? [route, `${route}.html`, path.join(route, "index.html")]
    : ["index.html"];

  for (const candidate of candidates) {
    const filePath = path.resolve(outputDirectory, candidate);
    const relativePath = path.relative(outputDirectory, filePath);

    if (
      relativePath &&
      !relativePath.startsWith(`..${path.sep}`) &&
      relativePath !== ".." &&
      !path.isAbsolute(relativePath) &&
      isFile(filePath)
    ) {
      return filePath;
    }
  }

  return null;
}

function sendFile(request, response, filePath, statusCode = 200) {
  const extension = path.extname(filePath).toLowerCase();
  const isNextAsset = filePath.includes(`${path.sep}_next${path.sep}static${path.sep}`);
  const isHtml = extension === ".html";

  response.writeHead(statusCode, {
    "Content-Type": contentTypes[extension] || "application/octet-stream",
    "Cache-Control": isNextAsset
      ? "public, max-age=31536000, immutable"
      : isHtml
        ? "no-cache"
        : "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  const stream = fs.createReadStream(filePath);
  stream.on("error", () => {
    if (!response.headersSent) response.writeHead(500);
    response.end("Internal Server Error");
  });
  stream.pipe(response);
}

const server = http.createServer((request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method Not Allowed");
    return;
  }

  const filePath = resolveRequestFile(request.url || "/");

  if (filePath) {
    sendFile(request, response, filePath);
    return;
  }

  const notFoundPage = path.join(outputDirectory, "404.html");
  if (isFile(notFoundPage)) {
    sendFile(request, response, notFoundPage, 404);
    return;
  }

  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not Found");
});

server.listen(port, () => {
  console.log(`SignFix is listening on port ${port}`);
});

