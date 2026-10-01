import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useApi } from "../lib/api";
import { downloadCsv } from "../lib/csv";
import {
  formatDate,
  formatKpiValue,
  formatMonth,
  formatNumber,
  formatVariation,
  type KpiUnit,
} from "../lib/format";

// Formato que o backend devolve em GET /api/dashboard
// (ver backend/app/routers/dashboard.py e backend/app/schemas.py).
type DashboardKpi = {
  id: number;
  name: string;
  value: number;
  unit: KpiUnit;
  variation: number;
  featured: boolean;
  updated_at: string;
  history: { period: string; value: number }[];
};

type DashboardData = { kpis: DashboardKpi[] };

// Cores dos cards, na ordem em que aparecem (tokens definidos em styles.css).
const ACCENTS = ["var(--series-1)", "var(--series-2)", "var(--series-3)", "var(--series-4)"];

// Indicador mostrado no gráfico de linha quando nada está selecionado.
const DEFAULT_TREND_KPI = "NPS";

const tooltipStyle = {
  background: "var(--viz-surface)",
  border: "1px solid var(--viz-border)",
  borderRadius: 8,
  color: "var(--viz-text-primary)",
  fontSize: 12,
};

export default function Dashboard() {
  const { data, loading, error, reload } = useApi<DashboardData>("/api/dashboard");

  // "name" é a chave do filtro cruzado: clicar num card ou numa barra
  // seleciona esse indicador e filtra a tabela e o gráfico de linha.
  const [selected, setSelected] = useState<string | null>(null);

  function toggleSelected(name: string) {
    setSelected((current) => (current === name ? null : name));
  }

  const allKpis = useMemo(() => data?.kpis ?? [], [data]);
  const featured = useMemo(() => allKpis.filter((k) => k.featured), [allKpis]);

  const visibleRows = useMemo(
    () => (selected ? allKpis.filter((r) => r.name === selected) : allKpis),
    [selected, allKpis],
  );

  const trendKpi = useMemo(() => {
    const withHistory = allKpis.filter((k) => k.history.length > 0);
    return (
      withHistory.find((k) => k.name === selected) ??
      withHistory.find((k) => k.name === DEFAULT_TREND_KPI) ??
      withHistory[0] ??
      null
    );
  }, [allKpis, selected]);

  const trendData = useMemo(
    () => (trendKpi?.history ?? []).map((p) => ({ month: formatMonth(p.period), value: p.value })),
    [trendKpi],
  );

  function exportCsv() {
    downloadCsv(
      selected ? `kpis-${selected.toLowerCase().replace(/\s+/g, "-")}.csv` : "kpis.csv",
      ["Indicador", "Valor", "Variação", "Atualizado em"],
      visibleRows.map((r) => [
        r.name,
        formatKpiValue(r.value, r.unit),
        formatVariation(r.variation),
        formatDate(r.updated_at),
      ]),
    );
  }

  const header = (
    <div className="page-header">
      <div>
        <div className="page-header__eyebrow">Visão geral</div>
        <h1 className="page-header__title">Dashboard</h1>
      </div>
    </div>
  );

  if (loading && !data) {
    return (
      <div>
        {header}
        <div className="state-card">Carregando indicadores…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {header}
        <div className="state-card state-card--error">
          <div>
            <strong>Não foi possível carregar o Dashboard.</strong>
            <div className="state-card__detail">{error}</div>
          </div>
          <button type="button" className="btn" onClick={reload}>
            Tentar de novo
          </button>
        </div>
      </div>
    );
  }

  if (allKpis.length === 0) {
    return (
      <div>
        {header}
        <div className="state-card">
          Nenhum indicador cadastrado ainda. Cadastre em http://localhost:8000/docs (POST /api/kpis).
        </div>
      </div>
    );
  }

  return (
    <div>
      {header}

      <div className="filter-bar">
        <span className="filter-bar__label">Filtros</span>
        {selected ? (
          <button type="button" className="filter-chip" onClick={() => setSelected(null)}>
            Indicador: <strong>{selected}</strong>
            <span className="filter-chip__x" aria-hidden="true">
              ×
            </span>
          </button>
        ) : (
          <span className="filter-bar__hint">
            Nenhum filtro aplicado — clique num card ou numa barra do gráfico pra filtrar
          </span>
        )}
      </div>

      <div className="kpi-grid">
        {featured.map((kpi, i) => {
          const isSelected = selected === kpi.name;
          const isDimmed = selected !== null && !isSelected;
          const isDown = kpi.variation < 0;
          return (
            <button
              type="button"
              className={
                "kpi-card" +
                (isSelected ? " kpi-card--selected" : "") +
                (isDimmed ? " kpi-card--dimmed" : "")
              }
              key={kpi.id}
              style={{ ["--kpi-accent" as string]: ACCENTS[i % ACCENTS.length] }}
              onClick={() => toggleSelected(kpi.name)}
              aria-pressed={isSelected}
            >
              <div className="kpi-card__accent" />
              <div className="kpi-card__name">{kpi.name}</div>
              <div className="kpi-card__value">{formatKpiValue(kpi.value, kpi.unit)}</div>
              <div
                className={
                  "kpi-card__delta " + (isDown ? "kpi-card__delta--down" : "kpi-card__delta--up")
                }
              >
                <span aria-hidden="true">{isDown ? "▾" : "▴"}</span>
                {formatVariation(kpi.variation)}
              </div>
            </button>
          );
        })}
      </div>

      <div className="section-header">
        <span className="section-header__eyebrow">Tendências</span>
      </div>
      <div className="chart-grid">
        <div className="chart-card viz-root">
          {/* Cada KPI tem uma unidade (R$, %, pessoas...). Pra comparar no mesmo
              gráfico, mostramos a VARIAÇÃO em %, que é comparável entre todos. */}
          <div className="chart-card__title">
            Variação vs. mês anterior (%) — clique numa barra pra filtrar
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={featured} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--viz-grid)" />
              <XAxis
                dataKey="name"
                interval={0}
                tick={{ fill: "var(--viz-muted)", fontSize: 11 }}
                axisLine={{ stroke: "var(--viz-axis)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--viz-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={44}
                tickFormatter={(v: number) => `${formatNumber(v)}%`}
              />
              <ReferenceLine y={0} stroke="var(--viz-axis)" />
              <Tooltip
                cursor={{ fill: "var(--viz-hover)" }}
                contentStyle={tooltipStyle}
                formatter={(v: number) => [formatVariation(v), "Variação"]}
              />
              <Bar
                dataKey="variation"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
                onClick={(entry) => toggleSelected((entry as unknown as DashboardKpi).name)}
                cursor="pointer"
              >
                {featured.map((kpi) => (
                  <Cell
                    key={kpi.id}
                    fill="var(--viz-series-1)"
                    opacity={selected === null || selected === kpi.name ? 1 : 0.3}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card viz-root">
          <div className="chart-card__title">
            {trendKpi ? `${trendKpi.name} — últimos ${trendData.length} meses` : "Sem histórico"}
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--viz-grid)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "var(--viz-muted)", fontSize: 12 }}
                axisLine={{ stroke: "var(--viz-axis)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--viz-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={56}
                domain={["auto", "auto"]}
                tickFormatter={(v: number) => formatNumber(v)}
              />
              <Tooltip
                cursor={{ stroke: "var(--viz-axis)", strokeWidth: 1 }}
                contentStyle={tooltipStyle}
                formatter={(v: number) => [
                  trendKpi ? formatKpiValue(v, trendKpi.unit) : formatNumber(v),
                  trendKpi?.name ?? "Valor",
                ]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--viz-series-1)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--viz-series-1)" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="section-header">
        <span className="section-header__eyebrow">
          Detalhamento{" "}
          {selected && <span className="section-header__count">({visibleRows.length})</span>}
        </span>
        <button type="button" className="btn btn--export" onClick={exportCsv}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 1v8m0 0L4 6.5M7 9l3-2.5M2 11.5h10"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Exportar CSV
        </button>
      </div>
      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Indicador</th>
              <th>Valor</th>
              <th>Variação</th>
              <th>Atualizado em</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td className="data-table__num">{formatKpiValue(row.value, row.unit)}</td>
                <td
                  className={
                    row.variation < 0 ? "data-table__delta--down" : "data-table__delta--up"
                  }
                >
                  {formatVariation(row.variation)}
                </td>
                <td className="data-table__muted">{formatDate(row.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
