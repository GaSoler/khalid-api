CREATE TABLE public.closed_days (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  date        date        NOT NULL UNIQUE,
  reason      text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

// 1. Verifica se a barbearia está fechada naquele dia
const closedDay = await this.closedDaysRepository.findByDate(date);
if (closedDay) {
  throw new AppError(
    ErrorCodes.CONFLICT.code,
    ErrorCodes.CONFLICT.statusCode,
    `Barbearia fechada: ${closedDay.reason || "Dia indisponível"}`,
  );
}

// ... resto das validações