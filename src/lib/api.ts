import { AppError } from "./errors";
import type { ApiResponse, ApiError } from "@/types/api";

export function ok<T>(data: T, cachedAt?: Date): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    ...(cachedAt && { cachedAt: cachedAt.toISOString() }),
  };
  return Response.json(body);
}

export function okWithCache<T>(
  data: T,
  ttlSeconds: number,
  cachedAt?: Date,
): Response {
  const body: ApiResponse<T> = {
    success: true,
    data,
    ...(cachedAt && { cachedAt: cachedAt.toISOString() }),
  };

  return Response.json(body, {
    headers: {
      "Cache-Control": `public, s-maxage=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 2}`,
    },
  });
}

export function err(error: unknown): Response {
  if (error instanceof AppError) {
    const body: ApiError = {
      success: false,
      error: {
        message: error.message,
        status: error.status,
        details: error.details,
      },
    };
    return Response.json(body, { status: error.status });
  }

  const body: ApiError = {
    success: false,
    error: {
      message: "Erro interno do servidor",
      status: 500,
    },
  };
  return Response.json(body, { status: 500 });
}

export function withHandler(
  handler: (req: Request, ctx?: unknown) => Promise<Response>,
) {
  return async (req: Request, ctx?: unknown) => {
    try {
      return await handler(req, ctx);
    } catch (error) {
      console.error("[API Error]", error);
      return err(error);
    }
  };
}
