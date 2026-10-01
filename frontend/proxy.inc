# Cabeçalhos comuns a toda rota proxiada pro backend. Fica num include pra
# não ter duas locations divergindo — uma delas esquecer o Host quebra
# geração de URL absoluta na API.
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
# NÃO usar $scheme aqui: o TLS termina no Traefik (Dokploy), então da ótica
# do nginx o esquema é sempre http, e sobrescrever apagaria o https que o
# Traefik mandou. $forwarded_proto (definido no nginx.conf) preserva o valor
# original quando ele existe e cai pra $scheme só em acesso direto ao
# container (sem proxy na frente).
proxy_set_header X-Forwarded-Proto $forwarded_proto;
proxy_read_timeout 60s;
