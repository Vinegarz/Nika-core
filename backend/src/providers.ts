import type { CallerRecord } from "./types.js";

/** Provider responses are never guessed or fabricated. */
export interface CallerProvider {
  readonly name: string;
  lookup(phone: string): Promise<CallerRecord | null>;
}

class DisabledProvider implements CallerProvider {
  constructor(readonly name: string) {}
  async lookup(): Promise<CallerRecord | null> { return null; }
}

class JsonHttpProvider implements CallerProvider {
  constructor(readonly name: string, private readonly endpoint: string, private readonly apiKey: string) {}

  async lookup(phone: string): Promise<CallerRecord | null> {
    const url = new URL(this.endpoint);
    url.searchParams.set("phone", phone);
    const response = await fetch(url, { headers: { authorization: `Bearer ${this.apiKey}`, accept: "application/json" } });
    if (!response.ok) throw new Error(`${this.name} returned HTTP ${response.status}`);
    // Add a mapping only from the provider's current, authorized contract.
    await response.arrayBuffer();
    return null;
  }
}

export function configuredProviders(env: NodeJS.ProcessEnv = process.env): CallerProvider[] {
  return [
    env.HIYA_API_URL && env.HIYA_API_KEY ? new JsonHttpProvider("Hiya", env.HIYA_API_URL, env.HIYA_API_KEY) : new DisabledProvider("Hiya (not configured)"),
    env.CALLERAPI_API_URL && env.CALLERAPI_API_KEY ? new JsonHttpProvider("CallerAPI", env.CALLERAPI_API_URL, env.CALLERAPI_API_KEY) : new DisabledProvider("CallerAPI (not configured)")
  ];
}
