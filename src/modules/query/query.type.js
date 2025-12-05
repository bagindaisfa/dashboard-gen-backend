export const PG_NUMERIC_TYPES = [
  "integer",
  "bigint",
  "smallint",
  "decimal",
  "numeric",
  "real",
  "double precision"
];

export const PG_DATE_TYPES = [
  "timestamp",
  "timestamp without time zone",
  "timestamp with time zone",
  "date",
  "time",
  "time without time zone",
  "time with time zone"
];

export function detectColumnType(pgType) {
  if (PG_NUMERIC_TYPES.includes(pgType)) return "number";
  if (PG_DATE_TYPES.includes(pgType)) return "date";
  return "string";
}
