import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { downloadCsv } from "../lib/csv";

// Dados mockados — trocar por fetch em /api/kpis (ou /api/kpis/mock) quando
// o backend tiver dados reais. Mantido estático aqui pra pagina renderizar
// sem depender da API estar de pe.
const kpiCards = [
  { id: 1, name: "Usuarios ativos", value: "1.200", delta: "+5.4%", accent: "var(--series-1)" },
  { id: 2, name: "Receita mensal", value: "R$ 89.500", delta: "-2.1%", accent: "var(--series-2)" },
  { id: 3, name: "Churn", value: "3,2%", delta: "+0.5%", accent: "var(--series-3)" },
  { id: 4, name: "NPS", value: "89", delta: "+18.7%", accent: "var(--series-4)" },
];

const kpiValues = [
  { name: "Usuarios ativos", value: 1200 },
  { name: "Receita (x100)", value: 895 },
  { name: "Churn (x100)", value: 32 },
  { name: "NPS", value: 89 },
];

const trend = [
  { month: "Mar", value: 62 },
  { month: "Abr", value: 68 },
  { month: "Mai", value: 71 },
  { month: "Jun", value: 69 },
  { month: "Jul", value: 75 },
  { month: "Ago", value: 89 },
];

const tableRows = [
  { name: "Usuarios ativos", value: "1.200", delta: "+5.4%", updatedAt: "2026-08-21" },
  { name: "Receita mensal", value: "R$ 89.500,00", delta: "-2.1%", updatedAt: "2026-08-21" },
  { name: "Churn", value: "3,2%", delta: "+0.5%", updatedAt: "2026-08-20" },
  { name: "NPS", value: "89", delta: "+18.7%", updatedAt: "2026-08-19" },
  { name: "Ticket medio", value: "R$ 149,90", delta: "+1.2%", updatedAt: "2026-08-18" },
  { name: "Tempo de resposta (h)", value: "3,4", delta: "-9.8%", updatedAt: "2026-08-18" },
];

function exportTableCsv() {
  downloadCsv(
    "kpis.csv",
    ["Indicador", "Valor", "Variacao", "Atualizado em"],
    tableRows.map((r) => [r.name, r.value, r.delta, r.updatedAt]),
  );
}

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Visão geral</div>
          <h1 className="page-header__title">Dashboard</h1>
        </div>
      </div>

      <div className="kpi-grid">
        {kpiCards.map((kpi) => (
          <div className="kpi-card" key={kpi.id} style={{ ["--kpi-accent" as string]: kpi.accent }}>
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
          </div>
        ))}
      </div>

      <div className="section-header">
        <span className="section-header__eyebrow">Tendências</span>
      </div>
      <div className="chart-grid">
        <div className="chart-card viz-root">
          <div className="chart-card__title">KPIs (valores atuais)</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={kpiValues} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
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
              <Bar dataKey="value" fill="var(--viz-series-1)" radius={[4, 4, 0, 0]} maxBarSize={48} />
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
        <span className="section-header__eyebrow">Detalhamento</span>
        <button type="button" className="btn btn--export" onClick={exportTableCsv}>
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
            {tableRows.map((row) => (
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
