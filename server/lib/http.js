export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
export const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

export function id(value) {
  const text = String(value ?? '');
  if (!/^[1-9]\d{0,19}$/.test(text) || BigInt(text) > 18446744073709551615n) {
    throw new HttpError(400, 'Identificador inválido.');
  }
  return text;
}

export function pagination(query) {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 50);
  if (!Number.isSafeInteger(page) || page < 1 || page > 1000000 ||
      !Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
    throw new HttpError(400, 'Usa page >= 1 y limit entre 1 y 100.');
  }
  return { page, limit, offset: (page - 1) * limit };
}
