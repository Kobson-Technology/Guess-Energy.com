/**
 * Erreur applicative transportable en HTTP sans fuir de détails
 * sensibles (stack, SQL, secrets).
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function badRequest(message: string, code?: string, details?: unknown): AppError {
  return new AppError(message, 400, code ?? 'BAD_REQUEST', details);
}

export function notFound(message = 'Ressource introuvable.'): AppError {
  return new AppError(message, 404, 'NOT_FOUND');
}

export function conflict(message: string, code = 'CONFLICT'): AppError {
  return new AppError(message, 409, code);
}

export function unauthorized(message = 'Non autorisé.'): AppError {
  return new AppError(message, 401, 'UNAUTHORIZED');
}

export function forbidden(message = 'Accès refusé.'): AppError {
  return new AppError(message, 403, 'FORBIDDEN');
}

export function serverError(message = 'Erreur interne du serveur.'): AppError {
  return new AppError(message, 500, 'INTERNAL');
}

/** Convertit une erreur inconnue en instance AppError (sans fuite). */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) {
    // Erreurs Prisma / réseau → réponse générique, log complet côté serveur.
    return new AppError('Une erreur est survenue. Veuillez réessayer.', 500, 'INTERNAL', undefined);
  }
  return serverError();
}