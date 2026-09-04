---
name: criar-tela
description: Cria ou termina uma tela neste boilerplate (kpi-boilerplate) — modelo no backend, rota da API, página no React, item no menu. Use quando o usuário pedir "cria uma tela pra X", "adiciona uma página de Y", "termina a tela de Z", ou "como eu ligo isso na API".
---

# Criar uma tela

Uma tela aqui é sempre a mesma anatomia de 4 peças. Nas 3 páginas que já
existem (`Dashboard`, `Kpis`, `Settings`) só o Dashboard usa dado de verdade
(mockado no próprio componente) — `Kpis` e `Settings` são placeholder.
Terminar uma dessas ou criar uma nova são o mesmo trabalho.

```
Postgres  →  models.py (SQLAlchemy)  →  schemas.py (Pydantic)  →  routers/*.py (FastAPI)
                                                                          ↓
                                                          frontend/src/pages/*.tsx  ←  Sidebar.tsx (nav) + App.tsx (rota)
```

## Exemplo completo: terminar a tela de KPIs

O backend desta tela **já existe e já funciona** — `backend/app/models.py`
tem `Kpi`, `backend/app/schemas.py` tem `KpiOut`/`KpiCreate`,
`backend/app/routers/kpis.py` tem `GET/POST /api/kpis`. Confirme rodando
(skill `rodar-sistema`):

```bash
curl -s http://localhost:8000/api/kpis        # []  (Postgres vazio, mas funciona)
curl -s -X POST http://localhost:8000/api/kpis \
  -H 'Content-Type: application/json' -d '{"name":"Teste","value":42}'
curl -s http://localhost:8000/api/kpis        # [{"id":1,"name":"Teste","value":42.0,...}]
```

Falta só o frontend. Isso é o que 90% das telas novas vão precisar escrever
— o backend deste exemplo já está pronto de propósito, pra você copiar o
padrão de `frontend/src/pages/Kpis.tsx` sem se preocupar com o resto ainda.

**1. Um client de API pequeno** (não existe um `services/api.ts` genérico
ainda neste boilerplate — se seu projeto crescer, vale criar um; pra uma
tela só, um `fetch` direto no componente está bem):

```tsx
// frontend/src/pages/Kpis.tsx
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
```

Nada mais muda — a rota (`/kpis` em `App.tsx`) e o item de menu
(`Sidebar.tsx`) já existiam. Rode `make up`, abra `/kpis`, cadastre um KPI e
confirme que ele aparece na tabela (e sobrevive a um F5 — está no Postgres,
não em memória).

Vá em `frontend/src/lib/csv.ts` se quiser reusar `downloadCsv` (o Dashboard
já usa pra exportar a tabela) — é a mesma função pra qualquer lista nova.

## Do zero: uma tela nova pra uma entidade nova

Digamos "Metas" (uma meta por KPI, com prazo). Mesma anatomia, 4 arquivos
novos + 2 arquivos existentes tocados:

**Backend**

1. `backend/app/models.py` — acrescente a classe (mesmo arquivo, sem criar
   `models/` por enquanto — o boilerplate é um arquivo só até crescer
   demais):
   ```python
   class Meta(Base):
       __tablename__ = "metas"
       id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
       kpi_id: Mapped[int] = mapped_column(ForeignKey("kpis.id"), nullable=False)
       valor_alvo: Mapped[float] = mapped_column(Float, nullable=False)
       prazo: Mapped[date] = mapped_column(Date, nullable=False)
   ```
   `Base.metadata.create_all(bind=engine)` em `main.py` cria a tabela sozinho
   no próximo boot — não tem Alembic aqui, é criação direta do schema. Se o
   projeto crescer a ponto de precisar de migração de verdade (alterar coluna
   existente, não só criar tabela nova), é a primeira coisa a adicionar.
2. `backend/app/schemas.py` — `MetaBase`/`MetaCreate`/`MetaOut`, mesmo padrão
   de `KpiBase`/`KpiCreate`/`KpiOut`.
3. `backend/app/routers/metas.py` — copie `routers/kpis.py` inteiro, troque
   `Kpi`→`Meta` e o prefixo pra `/api/metas`.
4. `backend/app/main.py` — `from app.routers import metas` +
   `app.include_router(metas.router)`.

**Frontend**

5. `frontend/src/pages/Metas.tsx` — copie o `Kpis.tsx` acabado de escrever
   (seção acima) e ajuste os campos.
6. `frontend/src/App.tsx` — `<Route path="/metas" element={<Metas />} />`.
7. `frontend/src/components/Sidebar.tsx` — um ícone SVG (copie o padrão dos
   três existentes: `viewBox="0 0 18 18"`, `stroke`/`fill="currentColor"`) e
   uma entrada em `NAV_ITEMS`.

Teste do mesmo jeito: `make up`, `curl -s http://localhost:8000/api/metas`
antes de mexer no front (confirma que o backend está de pé sozinho), depois
abra a tela no navegador.

## Onde NÃO seguir o padrão do governanca-estrategia/dashboards-corporativo

Se você já viu o padrão "casa" da Twygo em outros repos (regras/dados/rotas/
esquemas, psycopg cru sem ORM) — este boilerplate é **deliberadamente mais
simples**: SQLAlchemy ORM + Pydantic direto no router, sem a camada de
`regras/` separada. Isso é o ponto de partida certo pra um MVP pequeno; se o
projeto crescer (regra de negócio complexa, múltiplos papéis de usuário,
telas com filtro/permissão), migrar pra separar "regra pura testável sem
banco" de "acesso a dado" de "rota HTTP" é o próximo passo natural — mas não
adiante isso aqui à toa. Três telas simples não precisam de quatro camadas.

## Convenções de nome e estilo

- Português nos textos de tela (labels, títulos), inglês no código (nomes de
  variável, função, classe) — mesmo padrão dos arquivos existentes.
- Classes CSS em `kebab-case` com BEM (`__elemento`, `--modificador`) — ver
  `frontend/src/styles.css`. Reuse `page-header`, `table-card`/`data-table`,
  `kpi-card`, `chart-card`, `btn` antes de inventar uma classe nova.
- `end={true}` no `NavLink` só pra rota `/` (senão ela fica "ativa" em
  qualquer outra rota, porque `/` é prefixo de tudo).
- Toda tela nova: primeiro confirme a API com `curl` (isolando se o problema
  é backend ou frontend), só depois abra o navegador.
