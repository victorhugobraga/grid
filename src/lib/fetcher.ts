import { ExternalApiError } from "./errors";

type FetcherOptions = {
  headers?: Record<string, string>;
};

export async function fetcher<T>(
  url: string,
  source: string,
  options: FetcherOptions = {},
): Promise<T> {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      throw new ExternalApiError(source, `Status ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (err) {
    if (err instanceof ExternalApiError) throw err;
    throw new ExternalApiError(source, "Erro de rede");
  }
}
