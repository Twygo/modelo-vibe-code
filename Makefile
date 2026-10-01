.PHONY: up down logs ps reset

# Sobe tudo (banco + backend + frontend). Reconstrói as imagens se algo mudou.
up:
	docker compose up --build

# Para os containers (os dados do banco continuam guardados).
down:
	docker compose down

# Acompanha os logs de todos os serviços (Ctrl+C para sair).
logs:
	docker compose logs -f

# Mostra quais containers estão rodando.
ps:
	docker compose ps

# APAGA o banco local e para tudo. Use quando mudar a senha do banco no .env
# ou quiser começar do zero (os dados de exemplo voltam no próximo `make up`).
reset:
	docker compose down -v
