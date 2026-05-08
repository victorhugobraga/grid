export class AppError extends Error {
  constructor(
    message: string,
    public status: number = 500,
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

export class ExternalApiError extends AppError {
  constructor(api: string, message?: string) {
    super(message ?? `Erro na API externa: ${api}`, 502);
    this.name = "ExternalApiError";
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super("Muitas requisições. Tente novamente em breve.", 429);
    this.name = "RateLimitError";
  }
}

export class CacheError extends AppError {
  constructor(message = "Erro ao acessar cache") {
    super(message, 500);
    this.name = "CacheError";
  }
}
