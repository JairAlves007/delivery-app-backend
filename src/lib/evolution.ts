import { env } from "@/env.js";
import { WhatsappProviderError } from "@/errors/whatsapp/whatsapp-provider-error.js";

type EvolutionRequestParams = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  apiKey?: string | null;
  body?: unknown;
};

type EvolutionErrorBody = {
  message?: string | unknown[];
  response?: { message?: unknown[] };
};

const stringifyMessageItems = (items: unknown[]): string =>
  items
    .map((item) =>
      typeof item === "string" ? item : JSON.stringify(item),
    )
    .join(", ");

const extractErrorMessage = (data: unknown, status: number): string => {
  const body = data as EvolutionErrorBody | null;
  const fromResponse = body?.response?.message;
  if (Array.isArray(fromResponse) && fromResponse.length > 0)
    return stringifyMessageItems(fromResponse);

  if (Array.isArray(body?.message)) return stringifyMessageItems(body.message);
  if (typeof body?.message === "string") return body.message;

  return `Evolution API respondeu com status ${status}`;
};

export const evolutionRequest = async <T>({
  method,
  path,
  apiKey,
  body,
}: EvolutionRequestParams): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`${env.EVOLUTION_API_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey ?? env.EVOLUTION_API_KEY,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new WhatsappProviderError(
      "Não foi possível conectar ao provedor de WhatsApp",
    );
  }

  const text = await response.text();
  const data: unknown = text ? JSON.parse(text) : null;

  if (!response.ok)
    throw new WhatsappProviderError(
      extractErrorMessage(data, response.status),
      response.status,
    );

  return data as T;
};
