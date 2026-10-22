# Páginas — lista, abas, header, dashboard

Exemplo completo e funcional em `assets/preview.html`.

## Estrutura da página
- Conteúdo dentro de `.twg-page` (fundo branco, padding 16px, largura total — **sem max-width**).
- **Página de lista não tem título.** Começa direto pelas abas ou pela toolbar; o menu já indica onde o usuário está.
- **Página de criar/editar/detalhe/configurações** usa o page header.

## Page header (`.twg-page-header`)
Linha em 3 colunas, `padding-top 30px`, gap 24px:
- Esquerda (flex 1): botão **Voltar** outline primário com ícone `chevron_left`.
- Centro (flex 8): título 20px bold `#718096`, **centralizado**; ícone `help` 16px opcional ao lado; subtítulo 14px `#718096`.
- Direita (flex 1): vazio (mantém o título centralizado).
- Versão compacta: padding 16px 0 8px, gap 12px, título 18px. No mobile empilha.

```html
<div class="twg-page-header">
  <div class="twg-page-header__side"><button class="twg-btn twg-btn--outline"><span class="twg-icon">chevron_left</span>Voltar</button></div>
  <div class="twg-page-header__center"><h1 class="twg-page-header__title">Editar ciclo</h1><p class="twg-page-header__subtitle">Configure etapas e participantes</p></div>
  <div class="twg-page-header__side"></div>
</div>
```

## Abas (`.twg-tabs`)
- Variante "line": lista **centralizada**, sublinhado de 2px `#e2e8f0` em toda a largura; aba ativa com **sublinhado 2px na primária** e texto primário.
- Texto 16px **bold** `#4a5568`, 8px entre abas, sem quebra de linha. Painel com 16px acima.
- Overflow: rolagem horizontal sem barra; chevrons nas bordas sobre um degradê branco de 64px.
- Ponto de atenção opcional: 8px vermelho `#e53e3e` ao lado do título.
- **Sincronize com a URL** via `?tab=<slug>` usando `history.replaceState` (nunca `pushState`); slug = nome da aba, nunca o índice.
- No mobile mantém a mesma lista com rolagem horizontal.
- Markup: `.twg-tabs` > `.twg-tabs__list[role=tablist]` > `.twg-tab[role=tab][aria-selected]`, e o conteúdo em `.twg-tabs__panel`.

## Página de lista

Ordem fixa, de cima para baixo: **abas (opcional) → KPIs (opcional) → toolbar → tabela → paginação**.

### Toolbar (`.twg-toolbar`)
Margem vertical 24px, gap 24px, alinhada embaixo, com quebra de linha.
- **Esquerda, nesta ordem:** `+ Adicionar` (sólido primário, ícone `add`; rótulo pode ser específico: "Criar ciclo") → `Ações em massa` (outline) → `Exportar` (outline) → ações extras. No mobile o Adicionar vira só o ícone.
- **Direita:** busca (`.twg-search`, 200–380px, ícone `search` cinza, placeholder "Pesquise aqui", debounce 500ms) → alternância grade/lista opcional (`grid_view` / `reorder`) → **Filtrar**.
- Filtrar sem filtro aplicado: outline com `filter_alt` + "Filtrar". Com filtro: botão sólido só com ícone + outline "Limpar filtro" com `filter_alt_off`. Abre **Drawer à direita (448px)**.

### Tabela (`.twg-table` dentro de `.twg-table-wrap`)
- Fundo branco, raio 6px, rolagem interna (máx 75vh), **cabeçalho fixo**.
- Cabeçalho: 36px, padding 8px, 12px bold `#4a5568`, **sem caixa alta**, sem quebra. Colunas ordenáveis mostram seta (`unfold_more` / `arrow_upward` / `arrow_downward`) e cursor de mão.
- Células: padding 8px, 14px, alinhadas ao meio, texto em até 2 linhas (`.twg-cell-clamp` + tooltip). **Zebra** branco/`#f7fafc`, borda inferior `#edf2f7`, sem bordas verticais, **sem hover**.
- Vazio na célula: "—" em `#a0aec0` (`.twg-cell--muted`). Texto secundário em 13px `#4a5568`.
- Progresso: barra de 8px em pílula, trilho `#e2e8f0`, preenchimento primário, % em 13px semibold.
- **Seleção:** primeira coluna com checkbox na primária; o do cabeçalho seleciona a página (com estado indeterminado).
- **Ações da linha:** última coluna, alinhada à direita, sem título. Padrão moderno: **todas as ações no kebab** `more_vert` (24px, primária) abrindo menu com ícone + rótulo (`edit` Editar, `content_copy` Duplicar, `history` Histórico, `delete` Excluir). Sem ações disponíveis: kebab cinza com tooltip.
- **Vazio:** uma linha ocupando todas as colunas com "Não há dados para exibir", centralizado, cinza. Sem ilustração.
- **Carregando:** 4 barras skeleton de 32px.

### Badges de status (`.twg-badge`)
Pílula, padding 2px 10px, 11px semibold, sem caixa alta.

| Status | Classe | Fundo | Texto |
|---|---|---|---|
| Rascunho | `--draft` | `#EDF2F7` | `#718096` |
| Agendado | `--scheduled` | `#DBEAFE` | `#1E40AF` |
| Ativo / Em andamento | `--active` | `#C6F6D5` | `#22543D` |
| Encerrado / Concluído | `--completed` | `#BEE3F8` | `#2C5282` |
| Atenção | `--warning` | `#FEFCBF` | `#744210` |
| Cancelado / Erro | `--danger` | `#FED7D7` | `#9B2C2C` |

Tag maior (`.twg-tag--success|warning|error|gray`): pílula 14px bold, padding 4px 20px — usada em cards e detalhes.

### Ações em massa
Não há barra flutuante. O botão **Ações em massa** abre um **Drawer à direita (384px)**: título "Ações em massa", select "Ação *", rádio do alvo ("Selecionados" × "Todos do filtro"), campos da ação e, no fim, **Cancelar** (outline) + **Executar** (sólido). Depois, modal de confirmação.

### Paginação (`.twg-pagination`)
Centralizada, 16px abaixo da tabela, gap 8px: `«  ‹  1 2 3 4 5  ›` + select "25 / 50 / 100 por página" (180px).
- Botões 40×40px, raio 6px, borda `#e2e8f0`, número preto 16px peso 400. Página atual com borda primária. Hover: borda primária + fundo primário bem claro. Setas = ícones primários (`keyboard_double_arrow_left`, `chevron_left`, `chevron_right`).
- Mobile: 3 números e o select empilhado acima.

### Visualização em cards (opcional)
Card branco, raio 8px, sombra `0 2px 6px 0 #1a1a1a4c`, padding 10px.

## Dashboard / KPIs
- **Card KPI** (`.twg-kpi`): branco, borda 1px `#e2e8f0`, **borda esquerda 3px na cor semântica** (`--twg-kpi-color`), raio 10px, padding 12px, sem sombra. Valor 20px bold na cor semântica, % 12px semibold `#a0aec0`, rótulo 12px `#718096`. Hover: borda primária. Grade com gap 12px.
- Cores semânticas: roxo `#7f27d8`, laranja `#dd6b20`, cinza `#718096`, vermelho `#e53e3e`, azul `#3182ce`, verde `#48bb78`, teal `#319795`.
- **Painel de contagem**: borda 1px, raio 16px, padding 16px, gap 16px.
- **Card genérico** (`.twg-card`): branco, borda `#e2e8f0`, raio 8px, padding 16px.
- Divisores: 1px `#e2e8f0`.

## data-test-id
Atributo **`data-test-id`** (com hífen), kebab-case, prefixado pela feature: `cycles-add-button`, `cycles-tab-all`, `cycles-1-actions-kebab`, `cycles-edit-action-1`, `cycles-confirm-close-modal`. Máx 50 caracteres. Linhas carregam `data-item-id`.
