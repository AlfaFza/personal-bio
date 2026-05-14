const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const crypto = require("node:crypto");

const rootDir = __dirname;
const dataDir = path.join(rootDir, "data");
const messagesFile = path.join(dataDir, "messages.json");
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

async function ensureMessageStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(messagesFile);
  } catch {
    await fs.writeFile(messagesFile, "[]\n", "utf8");
  }
}

async function readMessages() {
  await ensureMessageStore();
  const content = await fs.readFile(messagesFile, "utf8");
  return JSON.parse(content || "[]");
}

async function saveMessage(message) {
  const messages = await readMessages();
  messages.push(message);
  await fs.writeFile(messagesFile, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;

      if (body.length > 100_000) {
        reject(new Error("Message is too large."));
        request.destroy();
      }
    });

    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function cleanText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

async function handleMessagePost(request, response) {
  try {
    const body = await readRequestBody(request);
    const data = JSON.parse(body || "{}");

    const message = {
      id: crypto.randomUUID(),
      name: cleanText(data.name, 80),
      email: cleanText(data.email, 120),
      mood: cleanText(data.mood, 40),
      message: cleanText(data.message, 2000),
      createdAt: new Date().toISOString(),
    };

    if (!message.name || !message.email || !message.message) {
      sendJson(response, 400, { error: "Name, email, and message are required." });
      return;
    }

    await saveMessage(message);
    sendJson(response, 201, { ok: true, message: "Message saved." });
  } catch (error) {
    sendJson(response, 500, { error: "Message could not be saved." });
  }
}

async function serveStaticFile(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = requestUrl.pathname === "/" ? "/index.html" : requestUrl.pathname;
  const decodedPath = decodeURIComponent(requestedPath);
  const filePath = path.normalize(path.join(rootDir, decodedPath));

  if (!filePath.startsWith(rootDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream",
    });
    response.end(file);
  } catch {
    response.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    response.end("Not found");
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method === "POST" && request.url === "/api/messages") {
    await handleMessagePost(request, response);
    return;
  }

  if (request.method === "GET") {
    await serveStaticFile(request, response);
    return;
  }

  response.writeHead(405, {
    "Content-Type": "text/plain; charset=utf-8",
  });
  response.end("Method not allowed");
});

ensureMessageStore()
  .then(() => {
    server.listen(port, () => {
      console.log(`Personal site running at http://localhost:${port}`);
      console.log(`Messages are stored in ${messagesFile}`);
    });
  })
  .catch((error) => {
    console.error("Could not start server:", error);
    process.exitCode = 1;
  });
