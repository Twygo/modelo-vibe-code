---
name: nova-pagina-kpi
description: Cria uma página nova de indicadores no kpi-boilerplate (página React + rota + item no menu + endpoint FastAPI), seguindo o padrão do Dashboard. Use quando o usuário pedir "cria uma página de X", "quero uma tela com os números de Y", "adiciona um dashboard de turnover/headcount/projetos", "nova aba no menu".
---

# Nova página de KPI (página + rota + menu + endpoint)

Referência a copiar: `backend/app/routers/dashboard.py` (backend) e
`frontend/src/pages/Dashboard.tsx` (frontend).

## 0. Combine com a pessoa (em português simples)

Antes de editar, confirme em poucos tópicos:
- nome da página e endereço (ex.: "Turnover" em http://localhost:5173/turnover);
- quais números/cards, quais gráficos e quais colunas na tabela;
- de onde vêm os dados: **fictícios** (seed), planilha (use a skill `importar-planilha`)
  ou API da Twygo (skill `integracao-twygo`). Dados reais de pessoas só com autorização (LGPD).

Use um "slug" curto, sem acento e minúsculo (ex.: `turnover`) para arquivo/rota/endpoint.

## 1. Backend — endpoint

Crie `backend/app/routers/<slug>.py`:

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db

router = APIRouter(prefix="/api/<slug>", tags=["<slug>"])


@router.get("")
def get_<slug>(db: Session = Depends(get_db)):
    # Comece simples: devolva um dicionário com o que a página precisa.
    return {
        "cards": [
            {"name": "Turnover mensal", "value": 2.4, "unit": "percentual", "variation": -0.3},
        ],
        "series": [{"period": "2026-08-01", "value": 2.4}],
    }
```

Se os dados precisam ficar guardados no banco:
- adicione o model em `backend/app/models.py` (copie o estilo de `Kpi`/`KpiHistory`);
- adicione schemas em `backend/app/schemas.py` e use `response_model=...`;
- se quiser dados de exemplo, adicione uma função `seed_<slug>_if_empty(db)` em
  `backend/app/seed.py` (só insere se a tabela estiver vazia) e chame no `lifespan` de
  `backend/app/main.py`, junto de `seed_if_empty`.
- Tabela **nova** é criada sozinha ao reiniciar. Se **alterou** uma tabela existente, avise
  e rode `make reset` + `make up`.

Registre em `backend/app/main.py`:

```python
from app.routers import dashboard, kpis, twygo, <slug>
...
app.include_router(<slug>.router)
```

Teste: `curl -s http://localhost:8000/api/<slug>` (o uvicorn recarrega sozinho).

## 2. Frontend — página

Crie `frontend/src/pages/<Nome>.tsx` seguindo o Dashboard:

```tsx
import { useApi } from "../lib/api";
import { formatKpiValue, formatVariation, type KpiUnit } from "../lib/format";

type Card = { name: string; value: number; unit: KpiUnit; variation: number };
type Data = { cards: Card[]; series: { period: string; value: number }[] };

export default function <Nome>() {
  const { data, loading, error, reload } = useApi<Data>("/api/<slug>");

  const header = (
    <div className="page-header">
      <div>
        <div className="page-header__eyebrow">Indicadores</div>
        <h1 className="page-header__title"><Título></h1>
      </div>
    </div>
  );

  if (loading && !data) return <div>{header}<div className="state-card">Carregando…</div></div>;
  if (error)
    return (
      <div>
        {header}
        <div className="state-card state-card--error">
          <div><strong>Não foi possível carregar.</strong><div className="state-card__detail">{error}</div></div>
          <button type="button" className="btn" onClick={reload}>Tentar de novo</button>
        </div>
      </div>
    );

  return (
    <div>
      {header}
      <div className="kpi-grid">
        {data!.cards.map((c, i) => (
          <div key={c.name} className="kpi-card" style={{ ["--kpi-accent" as string]: `var(--series-${(i % 4) + 1})` }}>
            <div className="kpi-card__accent" />
            <div className="kpi-card__name">{c.name}</div>
            <div className="kpi-card__value">{formatKpiValue(c.value, c.unit)}</div>
            <div className={"kpi-card__delta " + (c.variation < 0 ? "kpi-card__delta--down" : "kpi-card__delta--up")}>
              {formatVariation(c.variation)}
            </div>
          </div>
        ))}
      </div>
      {/* Gráficos: copie os blocos chart-grid/chart-card viz-root do Dashboard.tsx */}
      {/* Tabela: copie table-card/data-table do Dashboard.tsx (+ downloadCsv se quiser exportar) */}
    </div>
  );
}
```

Regras visuais: só classes existentes (`kpi-card`, `chart-card`, `data-table`,
`filter-chip`, `state-card`, `btn`) e cores `var(--viz-series-N)` dentro de gráficos.
Não misture unidades diferentes no mesmo eixo de gráfico. Formate números com
`lib/format.ts` (padrão brasileiro).

## 3. Rota e menu

- `frontend/src/App.tsx`: importe a página e adicione dentro do `<Route element={<AppLayout />}>`:
  `<Route path="/<slug>" element={<Nome />} />`
- `frontend/src/components/Sidebar.tsx`: adicione em `NAV_ITEMS`
  `{ to: "/<slug>", label: "<Título>", end: false, icon: <KpiIcon /> }` (reaproveite um
  ícone existente ou crie um SVG pequeno no mesmo estilo).

## 4. Verificar e avisar

```bash
docker compose exec frontend npx tsc -b      # sem erros de tipo
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5173/api/<slug>   # 200
```

Diga para a pessoa: "Abra http://localhost:5173/<slug> — você deve ver ... no menu
lateral aparece '<Título>'." Se algo não aparecer, veja `docker compose logs frontend backend`.
