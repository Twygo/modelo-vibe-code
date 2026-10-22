---
name: twygo-design-system
description: Use when building a new app, prototype, internal tool, landing or screen that should look like the Twygo platform ("cara de Twygo", "com o menu da Twygo", "design system Twygo") — sidebar navigation, tabs, list/table pages, forms, drawers, modals, badges, KPI cards. Works in any stack (plain HTML, React, Next, Vite, Lovable, v0). Inside the twyg-app repo itself, use the real components in @components/lib instead.
---

# Twygo Design System

> **Dentro do repositório twyg-app, NÃO use esta skill** — use os componentes reais de `@components/lib` e as convenções do CLAUDE.md. Esta skill é para projetos novos fora dele.

Reproduz a cara da plataforma Twygo (menu novo de duas colunas, abas, listas, formulários) em qualquer stack. Os valores vêm do código de produção do `twyg-app` (Chakra UI 2 + tema próprio) e foram convertidos para CSS puro — **não é preciso Chakra**.

## Como usar (plug-and-play)

1. Copie `assets/twygo-ui.css` para o projeto e importe uma vez (ele já carrega **Lato** e **Material Symbols Outlined** do Google Fonts).
2. Monte o layout com o shell: `assets/AppShell.tsx` (React, sem dependências) ou o HTML de `assets/preview.html`.
3. Construa as telas com as classes `twg-*`. Abra `assets/preview.html` no navegador para ver tudo junto.
4. Marca: `--twg-primary` (padrão `#9349DE`) e `--twg-font` (padrão Lato). No produto, cada organização escolhe cor e fonte no brand kit (fontes possíveis: Lato, Poppins, Montserrat, Open Sans, Roboto, Nunito Sans, Raleway, Work Sans...). Trocar as duas variáveis adapta tudo; para outra fonte, adicione o `<link>` do Google Fonts dela.

Se o projeto usa Tailwind/shadcn, mantenha o `twygo-ui.css` para os componentes e use utilitários só para layout; não reinvente os componentes com outra paleta.

## Regras de ouro

| # | Regra |
|---|---|
| 1 | Layout = **rail de módulos 64px na cor primária sólida** + **painel de menu 280px `#f7f8fb`** à esquerda, conteúdo branco à direita. **Sem top bar.** |
| 2 | Painel recolhe para 72px (só ícones); o rail nunca recolhe. Abaixo de 992px vira **bottom nav** de 4 slots (3 atalhos + "Mais"). |
| 3 | Uma fonte só em tudo (`--twg-font`, padrão **Lato**). Escala: 12 · 14 · 16 · 18 · 20 · 24px. Nunca 13px/11px em texto de leitura. Exceções densas já previstas: badge de status 11px, rótulo de módulo 11px, texto secundário dentro de célula 13px. |
| 4 | Ícones **só Material Symbols Outlined** (`<span class="twg-icon">edit</span>`). Nada de lucide, heroicons, react-icons, emoji. |
| 5 | Item de menu ativo = fundo **10% da primária** + texto primário. Sem barra lateral. Ícones de menu sempre na primária. |
| 6 | Primária é a única cor de ação: botão sólido = ação principal; **outline** primário = secundária/cancelar; ghost = terciária. |
| 7 | Página de lista: abas centralizadas no topo → toolbar (**Adicionar** + Ações em massa à esquerda, **busca 380px** + **Filtrar** à direita) → tabela zebrada → paginação centralizada. Lista **não tem título H1** (o menu já diz onde você está). |
| 8 | Tabela: cabeçalho fixo 36px, 12px bold `#4a5568`, **sem caixa alta**; linhas zebradas `#f7fafc`; ações da linha no kebab `more_vert`. |
| 9 | Status = badge em pílula (`twg-badge--active`, `--scheduled`, `--draft`, `--completed`...). Nunca texto colorido solto. |
| 10 | Formulário/edição em **Drawer à direita** (512px) com **Salvar** (sólido) depois **Cancelar** (outline). Confirmações em modal com **Cancelar** à esquerda e **Confirmar** à direita. Clique no fundo não fecha drawer nem modal (X, Cancelar ou Esc). Markup pronto em `references/components.md`. |
| 11 | Raio: 4px inputs · 6px botões/cards de tabela · 8px itens de menu · pílula em badges. Sombra discreta (cards com borda `#e2e8f0`, sem sombra). |
| 12 | Textos de interface em pt-BR, tom direto ("Adicionar", "Pesquise aqui", "Não há dados para exibir"). |

## Onde está cada coisa

| Vou construir... | Leia |
|---|---|
| Menu lateral, módulos, grupos, conta, mobile | `references/shell.md` |
| Página de lista, abas, toolbar, tabela, paginação, filtros, ações em massa, KPIs, header de página | `references/pages.md` |
| Botões, campos de formulário, drawer, modal, toast, tooltip, estados vazios/loading | `references/components.md` |
| Tokens (cores, status, tipografia, raio, sombra) e tema Chakra pronto | `references/tokens.md` |

## Checklist antes de entregar

- [ ] `twygo-ui.css` importado; nenhuma outra fonte ou biblioteca de ícones.
- [ ] Shell com rail + painel; item ativo com tint 10%; colapso funcionando; bottom nav no mobile.
- [ ] Cor de ação só via `--twg-primary` (sem hex de roxo espalhado).
- [ ] Abas com sublinhado primário de 2px; tabela zebrada sem caixa alta no cabeçalho.
- [ ] Toda ação de linha no kebab `more_vert`; status em badge.
- [ ] `data-test-id` kebab-case em todo elemento interativo (`[feature]-[elemento]-[ação]`, ex. `cycles-add-button`).
- [ ] Abriu no navegador e comparou com `assets/preview.html`.

## Erros comuns

- **Top bar com logo e avatar** → não existe no menu novo; logo, notificações e conta ficam no painel (topo e rodapé).
- **Sidebar branca com item ativo cheio de cor** → o painel é `#f7f8fb` e o ativo é só um tint de 10%.
- **Botão "Novo" no canto superior direito da página** → o Adicionar é o primeiro item da toolbar, à esquerda.
- **Cabeçalho de tabela em CAIXA ALTA** (padrão de muitos kits) → aqui é sem transformação.
- **Foco do input na cor primária** → o produto usa o anel azul `#3182ce` (padrão Chakra). Mantenha, salvo decisão de produto.
- **Ícone filled por padrão** → é outline; preenche só no hover (`twg-icon--fill-on-hover`).
