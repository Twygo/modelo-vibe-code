# kpi-boilerplate — instruções para o agente

Este repositório é a **base para projetos "vibe-code"** de pessoas da Twygo que **não são
programadoras** (RH, PMO e outras áreas) usando o Claude Code. Quem conversa com você
normalmente não sabe o que é React, API ou Docker. Seu papel é construir o que a pessoa
pede **e** explicar de um jeito que ela entenda.

## Como falar com a pessoa

- **Responda sempre em português do Brasil**, com frases simples e sem jargão. Se precisar
  usar um termo técnico, explique em uma linha ("o *backend* é a parte que guarda e calcula
  os dados").
- **Antes de editar arquivos, explique o plano** em poucos tópicos ("vou criar uma página
  nova chamada Turnover, um endpoint que entrega os números e um item no menu") e só então
  faça. Para mudanças grandes ou que apagam algo, peça um "ok" antes.
- **Depois de cada mudança, diga onde ver o resultado**: qual endereço abrir
  (ex.: http://localhost:5173/turnover) e o que a pessoa deve ver lá. Se precisar rodar
  algum comando, diga exatamente qual (ex.: `make up`).
- Se algo der errado, explique o que aconteceu em linguagem simples e o que você vai fazer.
- Não despeje código na conversa sem necessidade: a pessoa quer o resultado, não o código.

## Regras de ouro (não negociáveis)

1. **Tudo roda local** (http://localhost). Nada é publicado, implantado ("deploy") ou
   colocado na internet sem **auditoria do João, da Adriana ou de um dev**. Se a pessoa
   pedir para publicar, explique essa regra e não faça.
2. **Repositório só privado.** Nunca crie repositório público, nunca mude visibilidade,
   nunca envie o código para serviços externos (pastebin, gists públicos etc.).
3. **LGPD:** nada de dados pessoais reais de colaboradores (nome + CPF, salário, avaliações,
   saúde, endereço...) sem autorização explícita. Para testes, use dados fictícios. Planilhas
   com dados reais não entram no Git (coloque em `dados/`, que está no `.gitignore`, ou peça
   para a pessoa manter fora da pasta do projeto).
4. **Segredos nunca vão para o Git:** nunca faça commit do `.env`, de tokens, senhas ou
   chaves. Segredos ficam **só** no `.env` (que já está no `.gitignore`) e só são lidos pelo
   **backend** — nunca coloque token no código do frontend (ele roda no navegador e
   qualquer um vê).
5. **Não instale nada fora do Docker.** Não rode `npm install`, `pip install`, `brew install`
   na máquina da pessoa. Para adicionar uma biblioteca: edite `frontend/package.json` (e
   gere o `package-lock.json`) ou `backend/requirements.txt` com versão fixa, e peça para
   rodar `make up` de novo (ele reconstrói as imagens).

## Stack e endereços

| Parte     | Tecnologia                         | Pasta       | Endereço                    |
|-----------|------------------------------------|-------------|-----------------------------|
| Frontend  | React 18 + TypeScript + Vite + Recharts | `frontend/` | http://localhost:5173       |
| Backend   | FastAPI + SQLAlchemy 2 + psycopg 3 | `backend/`  | http://localhost:8000/docs  |
| Banco     | PostgreSQL 16                      | (Docker)    | sem porta exposta           |

Comandos (sempre na raiz do projeto):

- Nome do serviço do banco no compose é `postgres` (igual em dev e produção).


- `make up` — sobe tudo (e reconstrói se dependências mudaram)
- `make down` — para tudo (dados do banco ficam guardados)
- `make logs` — mostra os logs (Ctrl+C para sair)
- `make ps` — mostra o que está rodando
- `make reset` — **apaga o banco local** e para tudo (use ao mudar model/tabela ou a senha
  do banco no `.env`; os dados de exemplo voltam no próximo `make up`)

O código de `frontend/src` e `backend/app` recarrega sozinho ao salvar (hot-reload). Só
precisa de `make up` de novo quando mudar dependências, `docker-compose.yml` ou `.env`.

## Onde fica cada coisa

- `frontend/src/pages/` — uma página por arquivo (`Dashboard.tsx` é o **exemplo de referência**).
- `frontend/src/App.tsx` — lista de rotas (`<Route path="/x" element={<X />} />`).
- `frontend/src/components/Sidebar.tsx` — itens do menu lateral (`NAV_ITEMS`).
- `frontend/src/lib/api.ts` — `api.get/post/put/delete/upload` e o hook `useApi` (chamadas
  sempre em `/api/...`, o Vite encaminha para o backend).
- `frontend/src/lib/format.ts` — formatação BR (números, R$, %, datas, meses).
- `frontend/src/lib/csv.ts` — `downloadCsv` para botões "Exportar CSV".
- `frontend/src/config.ts` — título do app e nome do usuário na navbar.
- `frontend/src/styles.css` — todos os estilos.
- `backend/app/routers/` — um arquivo por grupo de endpoints (`dashboard.py` é a referência).
- `backend/app/main.py` — registra os routers (`app.include_router(...)`).
- `backend/app/models.py` — tabelas do banco. `backend/app/schemas.py` — formato das respostas.
- `backend/app/seed.py` — dados de exemplo inseridos quando o banco está vazio.
- `backend/app/routers/twygo.py` — exemplo de integração com a API da Twygo (token no `.env`).

## Reaproveite o visual existente

Não invente estilos novos se já existe um. Use:

- Cabeçalho de página: `page-header`, `page-header__eyebrow`, `page-header__title`.
- Cards de número: `kpi-grid` + `kpi-card` (`kpi-card__name`, `kpi-card__value`,
  `kpi-card__delta--up/--down`, cor via `--kpi-accent`).
- Gráficos: `chart-grid` + `chart-card viz-root` + `chart-card__title`. Dentro de gráficos use
  as cores `var(--viz-series-1..4)`, `var(--viz-grid)`, `var(--viz-axis)`, `var(--viz-muted)`.
  Fora de gráficos, `var(--series-1..4)`.
- Tabelas: `table-card` + `data-table` (`data-table__num`, `data-table__muted`,
  `data-table__delta--up/--down`).
- Seções: `section-header`, `section-header__eyebrow`. Botões: `btn`.
- Filtros: `filter-bar`, `filter-chip`. Estados: `state-card` (carregando/vazio),
  `state-card state-card--error` (erro).
- Gráficos com **Recharts**, copiando o padrão do `Dashboard.tsx` (`ResponsiveContainer`,
  `CartesianGrid vertical={false}`, eixos sem linha de tick, `Tooltip` com o mesmo
  `contentStyle`). Não misture unidades diferentes (R$ e %) no mesmo eixo.

## Receita: nova página + endpoint

(Detalhes na skill `nova-pagina-kpi`.)

1. **Backend** — crie `backend/app/routers/<nome>.py` com
   `router = APIRouter(prefix="/api/<nome>", tags=["<nome>"])` e um `@router.get("")`.
   Se precisar de tabela nova, adicione o model em `models.py` e o schema em `schemas.py`.
2. Registre em `backend/app/main.py`: `from app.routers import <nome>` e
   `app.include_router(<nome>.router)`.
3. Confira em http://localhost:8000/docs que o endpoint responde.
4. **Frontend** — crie `frontend/src/pages/<Nome>.tsx` usando
   `const { data, loading, error, reload } = useApi<Tipo>("/api/<nome>")`, com os estados de
   carregando/erro iguais ao Dashboard.
5. Adicione a rota em `frontend/src/App.tsx`: `<Route path="/<nome>" element={<Nome />} />`.
6. Adicione o item no menu em `frontend/src/components/Sidebar.tsx` (`NAV_ITEMS`).
7. Valide os tipos com `docker compose exec frontend npx tsc -b` (roda dentro do container,
   não instala nada na máquina) e diga para a pessoa abrir http://localhost:5173/<nome>.

Mudou um model de uma tabela que já existe? O backend só cria tabelas novas, não altera as
existentes. Avise a pessoa e rode `make reset` (apaga os dados locais) e depois `make up`.

## Importar CSV/XLSX

(Detalhes na skill `importar-planilha`.) Padrão recomendado: o frontend envia o arquivo com
`api.upload("/api/<nome>/importar", arquivo)`; o backend lê com `csv` (CSV) ou `openpyxl`
(XLSX, já instalado), **valida** cada linha (colunas obrigatórias, números, datas), devolve
a lista de erros por linha em português e só grava se estiver tudo certo. Planilhas reais
não vão para o Git.

## Princípios de código

É uma base simples. Sem over-engineering, sem abstrações prematuras, sem features
especulativas — faça só o que a pessoa pediu, seguindo os padrões que já existem aqui.
Commits locais são ok quando a pessoa pedir; **push/publicação só com auditoria** (regra 1).

## Publicar (só depois da auditoria)

Existe um segundo compose, `docker-compose.dokploy.yml`: a receita de **produção** (nginx
servindo o build do React com proxy `/api`, backend sem `--reload`). A skill
`publicar-dokploy` tem o passo a passo — mas **só use depois que João, Adriana ou um dev
auditarem** (regra de ouro 1). Se o usuário pedir pra publicar sem auditoria, explique a
regra com gentileza e não publique.

**Não misture os dois composes.** `docker-compose.yml` é sempre dev (hot-reload, portas em
127.0.0.1); `docker-compose.dokploy.yml` é sempre produção (sem bind mount, quem expõe é o
Dokploy). Variável de ambiente nova precisa existir nos dois onde fizer sentido e estar
explicada no `.env.example`. Nada de Kubernetes ou CI/CD sofisticado: Docker Compose e
Dokploy bastam.
