import { useEffect, useState } from "react";

type Kpi = { id: number; name: string; value: number; updated_at: string };

export default function Kpis() {
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");

  function carregar() {
    setCarregando(true);
    fetch("/api/kpis")
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then(setKpis)
      .catch((e) => setErro(String(e)))
      .finally(() => setCarregando(false));
  }

  useEffect(carregar, []);

  async function criar(e: React.FormEvent) {
    e.preventDefault();
    const resp = await fetch("/api/kpis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nome, value: Number(valor) }),
    });
    if (!resp.ok) {
      setErro(`Falha ao criar (${resp.status})`);
      return;
    }
    setNome("");
    setValor("");
    carregar();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-header__eyebrow">Cadastro</div>
          <h1 className="page-header__title">KPIs</h1>
        </div>
      </div>

      <form onSubmit={criar} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          placeholder="Nome do indicador"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
        <input
          placeholder="Valor"
          type="number"
          step="any"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />
        <button type="submit" className="btn">Adicionar</button>
      </form>

      {erro && <p className="error">{erro}</p>}
      {carregando ? (
        <p>Carregando…</p>
      ) : (
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr><th>Nome</th><th>Valor</th><th>Atualizado em</th></tr>
            </thead>
            <tbody>
              {kpis.map((k) => (
                <tr key={k.id}>
                  <td>{k.name}</td>
                  <td className="data-table__num">{k.value}</td>
                  <td className="data-table__muted">{k.updated_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
