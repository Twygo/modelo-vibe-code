---
name: publicar-dokploy
description: Publica este projeto (nascido do modelo-vibe-code) num servidor Dokploy — mesmo servidor onde rodam o extrator-de-dados, o dashboards-corporativo e o JPMO da Twygo. Use quando o usuário pedir "publica isso", "sobe no Dokploy", "coloca no ar", "cria o deploy", ou perguntar como ir de "roda no meu Docker" pra "roda de verdade".
---

# Publicar no Dokploy

Este projeto já nasce com `docker-compose.dokploy.yml` pronto — a receita de
produção, separada do `docker-compose.yml` de desenvolvimento (hot-reload,
portas em localhost). Publicar é essencialmente: criar um projeto no Dokploy
apontando pra este compose, e preencher as variáveis de ambiente.

## Antes de publicar

1. Suba localmente com o compose de **produção** pra ter certeza de que builda:

   ```bash
   cp .env.example .env    # ajuste os valores
   docker compose -f docker-compose.dokploy.yml -p teste-local up --build -d
   curl http://localhost/health          # se você mapear a porta 80 no teste
   docker compose -f docker-compose.dokploy.yml -p teste-local down -v
   ```

   Se preferir, use a skill `rodar-sistema` pro compose de dev primeiro, pra
   confirmar que a aplicação em si funciona, e só depois teste o de produção.

2. **Renomeie o que for genérico.** O boilerplate usa `db`, `backend`,
   `frontend` como nome de serviço — funciona bem pra um projeto isolado no
   Dokploy (cada projeto tem sua própria rede interna, então não há colisão
   entre projetos diferentes). Se o SEU projeto tiver um nome, ajuste o
   `title`/nome do projeto no Dokploy, não precisa mexer nos nomes dos
   serviços do compose.

## Se você tem acesso ao Dokploy via Claude (MCP)

Peça pro Claude usar a skill **`dokploy-deploy`** — ela conduz o processo
inteiro: organização, ambiente, política de acesso, domínio, credenciais
fortes geradas na hora, TLS. Você só confirma a ficha antes de qualquer coisa
ser criada. É a mesma skill usada para publicar o extrator, os painéis e o
JPMO no servidor da Twygo.

O que a skill vai perguntar e o que informar:

- **Repositório**: o fork/cópia deste boilerplate no GitHub da organização
  Twygo, branch a publicar (normalmente `main`).
- **Build**: Docker Compose, arquivo `docker-compose.dokploy.yml`.
- **Variáveis de ambiente** (nenhuma tem valor fixo — a skill gera senha forte
  quando pedido):

  | variável | pra quê |
  |---|---|
  | `POSTGRES_USER` | usuário do Postgres |
  | `POSTGRES_PASSWORD` | senha do Postgres — gere forte, nunca reuse de outro projeto |
  | `POSTGRES_DB` | nome do banco |
  | `CORS_ORIGINS` | deixe **vazio** em produção — o nginx já serve tudo pela mesma origem, então não precisa de CORS. Só preencha se algo for acessar a API de outro domínio. |

- **Domínio**: um subdomínio `*.apps.twygo.com` (peça pro João, é ele quem
  decide o nome) ou um dos domínios gratuitos `*.traefik.me` que o Dokploy
  oferece pra teste rápido, sem precisar mexer em DNS.
- **Acesso**: pergunte se o projeto vai ficar público ou atrás de senha
  (basic auth) — a skill sabe configurar os dois.

## Se você não tem acesso ao Dokploy via Claude

Entre no painel do Dokploy (peça a URL e as credenciais pra quem administra
o servidor), crie um projeto novo, escolha "Docker Compose" como tipo de
build, aponte pro repositório do GitHub e pro arquivo
`docker-compose.dokploy.yml`, preencha as variáveis de ambiente da tabela
acima, e defina o domínio na aba de Domains do serviço `frontend` (é ele que
recebe tráfego externo — `db` e `backend` ficam só na rede interna do
projeto).

## Depois de publicar

- Auto-deploy (publicar sozinho a cada push) fica **desligado por padrão**.
  Ligue só quando o projeto estiver estável — publicar no meio de alguém
  usando o sistema derruba a sessão da pessoa.
- `GET /health` do seu domínio tem que responder `{"status":"ok"}`. Se não
  responder, o backend não subiu — confira os logs do serviço `backend` no
  Dokploy antes de mexer em qualquer outra coisa.
- Path de dados: o Postgres grava em um volume Docker (`db_data`), então
  refazer o deploy não apaga o banco. Só `docker compose down -v` apagaria —
  e isso não faz parte do fluxo normal de deploy do Dokploy.
