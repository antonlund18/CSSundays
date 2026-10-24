import { print } from "@0no-co/graphql.web";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { initGraphQLTada, type ResultOf, type TadaDocumentNode, type VariablesOf } from "gql.tada";
import { createClient, type Client } from "graphql-sse";
import { useEffect } from "react";
import type { introspection } from "../graphql-env.d.ts";

/** Typed GraphQL documents, checked against server/schema.graphql (run `npm run gen:graphql` after schema changes). */
export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: { DateTime: string; JSON: unknown; File: File; ID: string };
  disableMasking: true;
}>();

export type { ResultOf, VariablesOf };

export const API_URL = ((import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:4000").replace(/\/$/, "");
const ENDPOINT = `${API_URL}/graphql`;

// --- Session token ----------------------------------------------------------------

const TOKEN_KEY = "cssundays.session";
const listeners = new Set<(token: string | null) => void>();

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage unavailable (private mode); the session lasts until reload.
  }
  resetSubscriptions();
  listeners.forEach((listener) => listener(token));
}

export function onTokenChange(listener: (token: string | null) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// --- Requests -------------------------------------------------------------------------

/** Thrown for GraphQL errors. `message` is the server's error code (see lib/errors.ts). */
export class ApiError extends Error {
  constructor(public readonly code: string) {
    super(code);
  }
}

type Response<T> = { data?: T; errors?: { message: string; extensions?: { code?: string } }[] };

async function send<T>(init: RequestInit): Promise<T> {
  const token = getToken();
  let response: globalThis.Response;
  try {
    response = await fetch(ENDPOINT, {
      ...init,
      headers: { ...init.headers, ...(token ? { authorization: `Bearer ${token}` } : {}) },
    });
  } catch {
    throw new ApiError("NETWORK_ERROR");
  }
  const body = (await response.json().catch(() => ({}))) as Response<T>;
  if (body.errors?.length) {
    const error = body.errors[0];
    throw new ApiError(error.extensions?.code ?? error.message);
  }
  if (!response.ok || !body.data) throw new ApiError("NETWORK_ERROR");
  return body.data;
}

export function request<Result, Variables>(
  document: TadaDocumentNode<Result, Variables>,
  ...[variables]: Variables extends Record<string, never> ? [] : [Variables]
): Promise<Result> {
  return send<Result>({
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: print(document), variables: variables ?? {} }),
  });
}

/** Sends an operation with file variables using the GraphQL multipart request spec. */
export function upload<Result, Variables extends Record<string, unknown>>(
  document: TadaDocumentNode<Result, Variables>,
  variables: Variables,
): Promise<Result> {
  const files: [string, File][] = [];
  const plain = Object.fromEntries(
    Object.entries(variables).map(([key, value]) => {
      if (value instanceof File) {
        files.push([key, value]);
        return [key, null];
      }
      return [key, value];
    }),
  );
  const form = new FormData();
  form.append("operations", JSON.stringify({ query: print(document), variables: plain }));
  form.append("map", JSON.stringify(Object.fromEntries(files.map(([key], index) => [String(index), [`variables.${key}`]]))));
  files.forEach(([, file], index) => form.append(String(index), file));
  // Yoga's CSRF protection requires a custom header on multipart requests.
  return send<Result>({ method: "POST", headers: { "graphql-preflight": "1" }, body: form });
}

// --- Subscriptions ----------------------------------------------------------------------

let sseClient: Client | null = null;

function subscriptions(): Client {
  sseClient ??= createClient({
    url: ENDPOINT,
    headers: (): Record<string, string> => {
      const token = getToken();
      return token ? { authorization: `Bearer ${token}` } : {};
    },
    retryAttempts: Infinity,
  });
  return sseClient;
}

function resetSubscriptions() {
  sseClient?.dispose();
  sseClient = null;
}

/**
 * Subscribes while mounted and refetches the given queries whenever the server
 * signals a change. Data itself always comes from the normal queries.
 */
export function useLiveInvalidate<Variables>(
  document: TadaDocumentNode<unknown, Variables>,
  variables: Variables,
  invalidate: QueryKey[],
  enabled = true,
) {
  const queryClient = useQueryClient();
  // Callers pass fresh objects every render; resubscribe only when the content changes.
  const signature = JSON.stringify([variables, invalidate]);

  useEffect(() => {
    if (!enabled) return;
    const [vars, keys] = JSON.parse(signature) as [Record<string, unknown>, QueryKey[]];
    return subscriptions().subscribe(
      { query: print(document), variables: vars },
      {
        next: () => keys.forEach((key) => queryClient.invalidateQueries({ queryKey: key })),
        error: () => undefined,
        complete: () => undefined,
      },
    );
  }, [document, signature, enabled, queryClient]);
}
