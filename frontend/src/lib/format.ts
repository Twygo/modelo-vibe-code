// Formatação no padrão brasileiro (1.200 · R$ 89.500,00 · 3,2% · 21/08/2026).

export type KpiUnit = "numero" | "moeda" | "percentual";

const numberFmt = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });
const currencyFmt = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatNumber(value: number): string {
  return numberFmt.format(value);
}

export function formatKpiValue(value: number, unit: KpiUnit): string {
  if (unit === "moeda") return currencyFmt.format(value);
  if (unit === "percentual") return `${numberFmt.format(value)}%`;
  return numberFmt.format(value);
}

/** 5.4 → "+5,4%" · -2.1 → "-2,1%" */
export function formatVariation(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${numberFmt.format(value)}%`;
}

/** "2026-08-21T10:00:00Z" → "21/08/2026" */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

/** "2026-03-01" → "mar" */
export function formatMonth(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`)
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");
}
