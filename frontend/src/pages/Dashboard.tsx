import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { downloadCsv } from "../lib/csv";

// Dados mockados — trocar por fetch em /api/kpis (ou /api/kpis/mock) quando
// o backend tiver dados reais. "name" é a chave de cross-filter: clicar num
// card ou numa barra seleciona esse indicador e filtra a tabela abaixo.
const kpis = [
  { name: "Usuarios ativos", value: "1.200", chartValue: 1200, delta: "+5.4%", accent: "var(--series-1)", updatedAt: "2026-08-21" },
  { name: "Receita mensal", value: "R$ 89.500,00", chartValue: 895, delta: "-2.1%", accent: "var(--series-2)", updatedAt: "2026-08-21" },
  { name: "Churn", value: "3,2%", chartValue: 32, delta: "+0.5%", accent: "var(--series-3)", updatedAt: "2026-08-20" },
  { name: "NPS", value: "89", chartValue: 89, delta: "+18.7%", accent: "var(--series-4)", updatedAt: "2026-08-19" },
];

const extraRows = [
  { name: "Ticket medio", value: "R$ 149,90", delta: "+1.2%", updatedAt: "2026-08-18" },
  { name: "Tempo de resposta (h)", value: "3,4", delta: "-9.8%", updatedAt: "2026-08-18" },
];

const tableRows = [...kpis, ...extraRows];

const trend = [
  { month: "Mar", value: 62 },
  { month: "Abr", value: 68 },
  { month: "Mai", value: 71 },
  { month: "Jun", value: 69 },
  { month: "Jul", value: 75 },
  { month: "Ago", value: 89 },
];

export default function Dashboard() {
  const [selected, setSelected] = useState<string | null>(null);

  function toggleSelected(name: string) {
    setSelected((current) => (current === name ? null : name));
  }

  const visibleRows = useMemo(
    () => (selected ? tableRows.filter((r) => r.name === selected) : tableRows),
    [selected],
  );

  function exportCsv() {
    downloadCsv(
      selected ? `kpis-${selected.toLowerCase().replace(/\s+/g, "-")}.csv` : "kpis.csv",
      ["Indicador", "Valor", "Variacao", "Atualizado em"],
      visibleRows.map((r) => [r.name, r.value, r.delta, r.updatedAt]),
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Visão geral</div>
          <h1 className="page-header__title">Dashboard</h1>
        </div>
      </div>

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
        {kpis.map((kpi) => {
          const isSelected = selected === kpi.name;
          const isDimmed = selected !== null && !isSelected;
          return (
            <button
              type="button"
              className={
                "kpi-card" +
                (isSelected ? " kpi-card--selected" : "") +
                (isDimmed ? " kpi-card--dimmed" : "")
              }
              key={kpi.name}
              style={{ ["--kpi-accent" as string]: kpi.accent }}
              onClick={() => toggleSelected(kpi.name)}
              aria-pressed={isSelected}
            >
              <div className="kpi-card__accent" />
              <div className="kpi-card__name">{kpi.name}</div>
              <div className="kpi-card__value">{kpi.value}</div>
              <div
                className={
                  "kpi-card__delta " +
                  (kpi.delta.startsWith("-")
                    ? "kpi-card__delta--down"
                    : "kpi-card__delta--up")
                }
              >
                <span aria-hidden="true">{kpi.delta.startsWith("-") ? "▾" : "▴"}</span>
                {kpi.delta}
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
          <div className="chart-card__title">KPIs (valores atuais) — clique numa barra pra filtrar</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={kpis} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
              <CartesianGrid vertical={false} stroke="var(--viz-grid)" />
              <XAxis
                dataKey="name"
                tick={{ fill: "var(--viz-muted)", fontSize: 12 }}
                axisLine={{ stroke: "var(--viz-axis)" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "var(--viz-muted)", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                cursor={{ fill: "var(--viz-hover)" }}
                contentStyle={{
                  background: "var(--viz-surface)",
                  border: "1px solid var(--viz-border)",
                  borderRadius: 8,
                  color: "var(--viz-text-primary)",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="chartValue"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
                onClick={(entry) => toggleSelected(entry.name as string)}
                cursor="pointer"
              >
                {kpis.map((kpi) => (
                  <Cell
                    key={kpi.name}
                    fill="var(--viz-series-1)"
                    opacity={selected === null || selected === kpi.name ? 1 : 0.3}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card viz-root">
          <div className="chart-card__title">NPS — últimos 6 meses</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
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
                width={32}
              />
              <Tooltip
                cursor={{ stroke: "var(--viz-axis)", strokeWidth: 1 }}
                contentStyle={{
                  background: "var(--viz-surface)",
                  border: "1px solid var(--viz-border)",
                  borderRadius: 8,
                  color: "var(--viz-text-primary)",
                  fontSize: 12,
                }}
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
          Detalhamento {selected && <span className="section-header__count">({visibleRows.length})</span>}
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
              <tr key={row.name}>
                <td>{row.name}</td>
                <td className="data-table__num">{row.value}</td>
                <td className={row.delta.startsWith("-") ? "data-table__delta--down" : "data-table__delta--up"}>
                  {row.delta}
                </td>
                <td className="data-table__muted">{row.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
