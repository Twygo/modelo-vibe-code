# Componentes

## Ícones
- **Material Symbols Outlined**, carregada pelo `twygo-ui.css`. Uso: `<span class="twg-icon">visibility</span>`; tamanho por `font-size`.
- Padrão outline (FILL 0, wght 400). Em ícones clicáveis use `twg-icon--fill-on-hover` — preenche no hover, como no produto.
- Tamanhos: 24px rail/ações de linha · 20px itens de menu/botões · 18px chevrons, utilitários e mobile · 16px ícone de ajuda.
- Nomes já adotados: `add`, `edit`, `delete`, `content_copy`, `visibility`, `more_vert`, `filter_alt`, `filter_alt_off`, `search`, `close`, `chevron_left`, `chevron_right`, `expand_more`, `help`, `history`, `calendar_month`, `list_alt`, `logout`, `notifications`, `school`, `forum`.

## Botões (`.twg-btn`)
| Tamanho | Altura | Fonte |
|---|---|---|
| `--xs` | 24px | 12px |
| `--sm` | 32px | 14px |
| padrão | 40px | 16px |
| `--lg` | 48px | 18px |

Raio 6px, peso 600, gap 8px para ícone.

| Variante | Uso |
|---|---|
| `--primary` (sólido) | Ação principal: Salvar, Adicionar, Confirmar, Executar |
| `--outline` | Secundária: Cancelar, Voltar, Ações em massa, Filtrar, Exportar — **a mais comum** |
| `--ghost` | Terciária / ações discretas |
| `--danger-outline` | Gatilho de ação destrutiva (o botão de confirmar dentro do modal continua primário) |

Botão só com ícone: `.twg-icon-btn` (40×40, ícone na primária).

## Campos de formulário
```html
<div class="twg-field">
  <label class="twg-label" for="name">Nome<span class="twg-label__required">*</span></label>
  <input id="name" class="twg-input" placeholder="Digite o nome" />
  <span class="twg-helper">Aparece para os participantes.</span>
</div>
```
- Input/select: 40px, raio **4px**, 14px, borda `#e2e8f0` (hover `#cbd5e0`).
- **Foco: borda + anel 1px azul `#3182ce`** (comportamento atual do produto — não troque pela primária sem decisão de produto).
- Inválido: borda/anel `#e53e3e` + `.twg-error` 12px vermelho. Desabilitado: fundo `#e2e8f0`, texto `#4a5568`.
- Rótulo 14px **bold**; obrigatório com `*` em `tomato`; ajuda opcional com ícone `help` 16px.
- Texto de ajuda 12px `#718096`; contador `n / max` 12px à direita.
- Layout em grade de 12 colunas, gap 16px (`.twg-form-grid` + `.twg-col-3|4|6|8|12` em cada campo; no mobile todos viram 12). Título de seção 18px bold `#4a5568`.
- Rádio/checkbox: rótulo 14px semibold `#1a202c`, `accent-color` primária.

## Drawer (`.twg-drawer`)
- À direita, 512px (`--md` 448px para filtros, `--sm` 384px para ações em massa), fundo escuro 16%, botão fechar no canto.
- Título 20px semibold. **Botões no fim do corpo (não rodapé fixo)**, alinhados à esquerda, gap 12px, 32px acima: **Salvar** (sólido) e depois **Cancelar** (outline). No mobile ambos ocupam a largura toda.
- Uso: criar/editar registro, filtros, ações em massa.
- Fecha pelo X, pelo Cancelar ou por Esc. **Clicar no fundo não fecha** (vale para drawer e modal — evita perder o formulário).
- Se quiser link direto para o drawer aberto, use query param (`?drawer=new`) com `history.replaceState`.

```html
<div class="twg-overlay"></div>
<aside class="twg-drawer" role="dialog" aria-labelledby="drawer-title">
  <div class="twg-drawer__header">
    <h2 id="drawer-title" style="margin:0;font-size:inherit">Criar treinamento</h2>
    <button class="twg-close" aria-label="Fechar"><span class="twg-icon">close</span></button>
  </div>
  <form class="twg-drawer__body">
    <div class="twg-form-grid">
      <div class="twg-field twg-col-12">…</div>
      <div class="twg-field twg-col-6">…</div>
      <div class="twg-field twg-col-6">…</div>
    </div>
    <div class="twg-drawer__actions">
      <button type="submit" class="twg-btn twg-btn--primary">Salvar</button>
      <button type="button" class="twg-btn twg-btn--outline">Cancelar</button>
    </div>
  </form>
</aside>
```

**Ordem dos botões é diferente de propósito:** drawer de formulário = Salvar → Cancelar, alinhados à esquerda; modal de confirmação = Cancelar → Confirmar, alinhados à direita. É assim no produto.

## Modal de confirmação (`.twg-modal`)
- 448px, raio 6px, corpo 14px, título 16px bold com botão fechar.
- Rodapé alinhado à direita: **Cancelar** (outline) à esquerda, **Confirmar / Excluir / Continuar** (sólido primário) à direita.
- **Clicar fora não fecha** — só os botões, o X ou Esc.

```html
<div class="twg-overlay"></div>
<div class="twg-modal" role="alertdialog" aria-labelledby="modal-title">
  <div class="twg-modal__header"><span id="modal-title">Excluir treinamento</span><button class="twg-close" aria-label="Fechar"><span class="twg-icon">close</span></button></div>
  <div class="twg-modal__body">Tem certeza que deseja excluir “LGPD na prática”? Essa ação não pode ser desfeita.</div>
  <div class="twg-modal__footer">
    <button class="twg-btn twg-btn--outline">Cancelar</button>
    <button class="twg-btn twg-btn--primary">Excluir</button>
  </div>
</div>
```

## Toast (`.twg-toast`)
Canto inferior direito, 5s, com botão fechar, variante "left-accent" (borda esquerda 4px + fundo claro do status): success verde, error vermelho, warning laranja, info azul. Título bold opcional + mensagem.

```html
<div class="twg-toast-region">
  <div class="twg-toast twg-toast--success" role="status">
    <span class="twg-icon" style="color:#38a169">check_circle</span>
    <div><div class="twg-toast__title">Treinamento criado</div>Os participantes já podem se inscrever.</div>
    <button class="twg-close twg-toast__close" aria-label="Fechar"><span class="twg-icon" style="font-size:18px">close</span></button>
  </div>
</div>
```
Ícones por status: `check_circle`, `error`, `warning`, `info`.

## Botão responsivo
Adicionar vira só ícone no mobile: `<button class="twg-btn twg-btn--primary twg-btn--responsive"><span class="twg-icon">add</span><span class="twg-btn__label">Criar treinamento</span></button>`.

## Tooltip
Fundo **na cor primária**, texto branco, raio 5px, 14px. No rail e no menu recolhido aparece à direita. Classe utilitária: `.twg-tooltip` + `data-tip="..."`.

## Estados
- **Vazio**: só texto centralizado 14px `#718096` (`.twg-empty`), sem ilustração. Na tabela: "Não há dados para exibir".
- **Carregando**: spinner na primária (`.twg-spinner`) centralizado; listas com 4 skeletons de 32px; cards com skeleton 80px raio 6px.

## Avatar
Círculo, iniciais brancas bold sobre `#a0aec0` quando não há foto; anel 2px `rgba(0,0,0,.06)`.
