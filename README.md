# kpi-boilerplate

Base pronta para criar **dashboards de indicadores** e **ferramentas internas** da Twygo
conversando com o **Claude Code** — mesmo sem saber programar.

Você descreve o que quer ("quero uma página com o turnover por área"), o Claude Code
constrói, e você vê o resultado no seu navegador, **na sua máquina**. Nada vai para a
internet.

O projeto já vem com um Dashboard de exemplo (cards, gráficos, filtro clicável, tabela e
botão de exportar CSV) usando dados **fictícios**.

---

## Pré-requisitos (instalar uma vez)

1. **Docker Desktop** — https://www.docker.com/products/docker-desktop/
   Depois de instalar, abra o Docker Desktop e deixe ele aberto (a baleia aparece na barra
   do topo/tarefas).
2. **Git** — no Mac já vem instalado (se pedir, aceite instalar as "Command Line Tools").
   No Windows: https://git-scm.com/download/win
3. **Claude Code** — https://claude.com/claude-code (siga a instalação e faça
   login com a sua conta da Twygo).

> No Windows, rode os comandos dentro do **WSL** (Ubuntu) ou do Git Bash, para o `make`
> funcionar.

## Passo a passo

Abra o Terminal e rode, um de cada vez:

```bash
# 1. Baixar o projeto (troque "meu-projeto" pelo nome que quiser)
git clone https://github.com/Twygo/kpi-boilerplate.git meu-projeto
cd meu-projeto

# 2. Criar o arquivo de configuração local (só na primeira vez)
cp .env.example .env

# 3. Ligar o sistema (a primeira vez demora alguns minutos)
make up
```

Quando aparecerem mensagens como `Uvicorn running` e `VITE ... ready`, abra no navegador:

- **O sistema:** http://localhost:5173
- **A "documentação" da API** (lista de dados que o sistema entrega): http://localhost:8000/docs

Para conversar com o Claude Code, abra **outra** janela do Terminal na mesma pasta e rode
`claude`. Peça o que quiser em português.

Para desligar: aperte `Ctrl+C` na janela onde rodou `make up` (ou rode `make down`).

### Comandos úteis

| Comando      | O que faz                                                                 |
|--------------|---------------------------------------------------------------------------|
| `make up`    | Liga tudo (e reconstrói se algo de instalação mudou)                       |
| `make down`  | Desliga tudo (os dados continuam guardados)                                |
| `make logs`  | Mostra o que o sistema está fazendo (bom para achar erros)                 |
| `make ps`    | Mostra o que está ligado                                                   |
| `make reset` | **Apaga o banco de dados local** e desliga (os dados de exemplo voltam no próximo `make up`) |

## Deu erro, e agora?

**"port is already allocated" / "address already in use" (porta ocupada)**
Outra coisa está usando a porta 5173 ou 8000 — muitas vezes é este mesmo projeto aberto
em outra pasta. Rode `make down` nas outras pastas, ou feche o programa que usa a porta.
Ainda não resolveu? Peça ao Claude Code: *"a porta 5173 está ocupada, me ajuda?"*.

**"Cannot connect to the Docker daemon" / "docker: command not found" (Docker parado)**
O Docker Desktop não está aberto. Abra o aplicativo, espere a baleia ficar parada (sem
animação) e rode `make up` de novo.

**Página em branco ou "Não foi possível carregar o Dashboard"**
1. Confira se o `make up` ainda está rodando (a janela não pode ter sido fechada).
2. Espere uns segundos e recarregue a página (Cmd+R / Ctrl+R).
3. Rode `make logs` e procure linhas com `Error`. Copie e cole para o Claude Code explicar.
4. Se você mudou a senha do banco no `.env` depois de já ter ligado o sistema, rode
   `make reset` e depois `make up` (a senha só vale para um banco novo).

**Mudei uma tabela/coluna e começou a dar erro no banco**
O banco local guarda a estrutura antiga. Rode `make reset` e `make up` (isso apaga os
dados locais, que são só de teste).

## 5 prompts de exemplo para o Claude Code

1. *"Cria uma página nova chamada Turnover com cards de turnover mensal, voluntário e
   involuntário e um gráfico de linha dos últimos 12 meses, usando dados fictícios."*
2. *"Quero subir uma planilha CSV de headcount por área e ver uma tabela e um gráfico de
   barras por área. Valida se as colunas estão certas e me mostra os erros."*
3. *"No Dashboard, adiciona um filtro por mês e faz o botão Exportar CSV respeitar o filtro."*
4. *"Cria uma página de acompanhamento de projetos do PMO com status (no prazo, atrasado,
   concluído), uma tabela e um gráfico de pizza por status."*
5. *"Troca o título do sistema para 'Painel de RH' e coloca meu nome no canto superior
   direito."*

Dica: comece pedindo para o Claude **explicar o plano** antes de mexer — ele já é instruído
a fazer isso.

## Regras de ouro

1. **Tudo roda local** (localhost). Nada é publicado/implantado na internet sem
   **auditoria do João, da Adriana ou de um dev**.
2. **Repositório só privado.** Nunca torne o seu repositório público.
3. **LGPD:** não use dados pessoais reais de colaboradores sem autorização. Para testar,
   use dados fictícios. Planilhas reais ficam fora do Git (pasta `dados/` já é ignorada).
4. **Nunca envie o `.env` nem tokens/senhas** para o Git ou para outras pessoas.
5. **Não instale programas por fora**: tudo roda dentro do Docker (`make up`).

---

## Para devs

- Stack: React 18 + TypeScript + Vite + Recharts (`frontend/`, :5173) · FastAPI +
  SQLAlchemy 2 + psycopg 3 (`backend/`, :8000) · PostgreSQL 16 (sem porta publicada; há uma
  opção comentada `127.0.0.1:5433` no `docker-compose.yml`).
- As portas são publicadas só em `127.0.0.1` (nada exposto na rede/Wi-Fi).
- Credenciais do banco: `POSTGRES_*` no `.env`; o `DATABASE_URL` do backend é montado a
  partir delas no `docker-compose.yml`. Mudar a senha depois do primeiro boot exige
  `make reset`.
- **Nova página:** arquivo em `frontend/src/pages/` + `<Route>` em `frontend/src/App.tsx`
  + item em `frontend/src/components/Sidebar.tsx`.
- **Nova rota de API:** router em `backend/app/routers/` + `app.include_router(...)` em
  `backend/app/main.py`.
- Padrão de referência: `GET /api/dashboard` (`backend/app/routers/dashboard.py`) consumido
  por `frontend/src/pages/Dashboard.tsx` via `useApi` (`frontend/src/lib/api.ts`).
- Seed idempotente de dados de exemplo em `backend/app/seed.py` (só insere com tabela vazia).
- Integração Twygo de exemplo: `GET /api/twygo/users` (precisa de `TWYGO_API_TOKEN` no
  `.env`; sem token responde 503).
- Instruções para o agente: `CLAUDE.md`. Skills em `.claude/skills/`.
