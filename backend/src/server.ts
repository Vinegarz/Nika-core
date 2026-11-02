import { createServer } from "node:http";
import { testRecords, reports } from "./data.js";
import { configuredProviders } from "./providers.js";
import type { CallerReport, ReportKind } from "./types.js";

const port = Number(process.env.PORT ?? 8787);
const providers = configuredProviders();

function normalizePhone(value: string): string {
  const compact = value.trim().replace(/[()\s-]/g, "");
  if (compact.startsWith("00")) return `+${compact.slice(2)}`;
  if (compact.startsWith("+")) return compact;
  return `+${compact}`;
}

function json(response: import("node:http").ServerResponse, status: number, body: unknown) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  response.end(JSON.stringify(body));
}

async function readBody(request: import("node:http").IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

async function lookup(phone: string) {
  const normalized = normalizePhone(phone);
  const local = testRecords.find((record) => record.phone === normalized);
  if (local) return { record: local, provider: local.sourceName };
  for (const provider of providers) {
    try {
      const record = await provider.lookup(normalized);
      if (record) return { record, provider: provider.name };
    } catch (error) {
      console.warn(`Provider ${provider.name} failed:`, error);
    }
  }
  return { record: null, provider: null };
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    if (request.method === "GET" && url.pathname === "/health") {
      return json(response, 200, { ok: true, service: "nika-core", configuredProviders: providers.map((provider) => provider.name) });
    }
    if (request.method === "GET" && url.pathname === "/v1/lookup") {
      const phone = url.searchParams.get("phone");
      if (!phone) return json(response, 400, { error: "phone is required" });
      const result = await lookup(phone);
      return json(response, 200, { phone: normalizePhone(phone), found: Boolean(result.record), data: result.record, provider: result.provider });
    }
    if (request.method === "POST" && url.pathname === "/v1/reports") {
      const body = (await readBody(request)) as Partial<CallerReport>;
      if (!body.phone || !body.kind || !["spam", "not_spam", "wrong_name"].includes(body.kind)) {
        return json(response, 400, { error: "phone and a valid kind are required" });
      }
      const report: CallerReport = { phone: normalizePhone(body.phone), kind: body.kind as ReportKind, comment: body.comment, createdAt: new Date().toISOString() };
      reports.push(report);
      return json(response, 201, { accepted: true, persisted: "in-memory-demo", report });
    }
    return json(response, 404, { error: "not found" });
  } catch (error) {
    console.error(error);
    return json(response, 500, { error: "internal server error" });
  }
});

server.listen(port, () => console.log(`Nika Core API listening on http://localhost:${port}`));
