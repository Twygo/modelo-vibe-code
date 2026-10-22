# Shell — menu novo da Twygo

Navegação em duas colunas, sem top bar. Implementação pronta: `assets/AppShell.tsx` (React) e `assets/preview.html` (HTML).

```
┌──────┬────────────────────┬──────────────────────────────────┐
│ RAIL │ PAINEL             │ CONTEÚDO (branco, flex: 1)       │
│ 64px │ 280px  (#f7f8fb)   │                                  │
│ cor  │ logo da org     ⌄  │                                  │
│ prim.│ DESENVOLVIMENTO  ‹ │                                  │
│ [■]  │ ▣ Painel           │                                  │
│ [□]  │ ▣ Ciclos  ← ativo  │                                  │
│ [□]  │ ▣ Planos e metas ⌄ │                                  │
│      │     ▣ PDI          │                                  │
│      │ ───────────────────│                                  │
│      │  🎓  💬  🔔        │                                  │
│      │     (avatar)       │                                  │
│      │   Maria Souza      │                                  │
└──────┴────────────────────┴──────────────────────────────────┘
```

## Container
- `nav`: flex em linha, `position: sticky; top: 0; height: 100vh`. Rail e lista de itens rolam sozinhos; logo, cabeçalho e rodapé ficam fixos.
- Largura total: 344px aberto, 136px recolhido. Com **um só módulo**, o rail vira uma faixa de 32px na primária, sem botões.
- Conteúdo: `flex: 1 1 0; min-width: 0`, fundo branco.
- Estado recolhido salvo em `localStorage` (`twygo:menu:collapsed`). Transição `width 0.2s linear`.
- Skeleton de carregamento: mesmas larguras, pílulas `#e2e8f0` (quadrados 28px raio 8px no rail; barras 12px raio 6px, larguras 78%/62%) pulsando opacidade 0.55→1 em 1.2s.

## Rail de módulos (`.twg-rail`)
- 64px, fundo **primária sólida**, padding 16px 8px, gap 12px.
- Botão 48×48px, raio 6px, ícone 24px, **sem rótulo visível** — rótulo em tooltip à direita + `aria-label`.
- Inativo: transparente, ícone branco 80%. Hover: fundo branco 16%, ícone branco.
- **Ativo: quadrado branco com sombra `md`, ícone na primária.**

### Módulos padrão (ordem do rail)
| Módulo | Ícone |
|---|---|
| Meu espaço | `person` |
| Minha equipe | `groups` |
| Aprendizagem | `menu_book` |
| Jornadas | `route` |
| Pessoas | `group` |
| Comunicação | `forum` |
| Desenvolvimento | `trending_up` |
| Continuidade | `monitoring` |
| Loja de prêmios | `redeem` |
| Configurações | `tune` |

Fallback: `grid_view` para módulo, `circle` para item. Para um app novo, crie seus próprios módulos seguindo o mesmo formato: um ícone Material por área funcional, 2 a 8 módulos, cada um com 3 a 10 itens. Reaproveite o ícone da tabela quando a área coincidir (treinamento → `menu_book`, pessoas → `group`, ajustes → `tune`); evite `school`, `forum` e `notifications`, que já são os atalhos do rodapé.

## Painel de menu (`.twg-panel`)
De cima para baixo:
1. **Logo** (`.twg-panel__brand`): padding 16px 12px 8px. Imagem até 32px de altura × 160px; sem logo, nome da org em 22px bold, letter-spacing -0.03em, na primária. Recolhido: quadrado 36px raio 8px na primária com a inicial branca.
2. **Cabeçalho** (`.twg-panel__header`): nome do **módulo ativo** em 11px bold, CAIXA ALTA, letter-spacing 0.14em, `#718096`. À direita, botão de recolher (`chevron_right` 22px na primária, girado 180° quando aberto).
3. **Itens** (`.twg-panel__items`): rolagem própria, padding 4px 8px, gap 0.
4. **Rodapé** (`.twg-panel__footer`): borda superior `#e2e8f0`, padding 16px, gap 12px.

### Item (`.twg-nav-item`)
- Altura mínima 34px, padding 7px 8px, gap 8px, raio 8px.
- Ícone 20px **sempre na primária**; texto 14px semibold `#34495e`, até 2 linhas.
- Hover: `#e9ebee`.
- **Ativo** (`aria-current="page"`): fundo `color-mix(primária 10%, transparent)`, texto primário. Sem barra lateral. Ativo = caminho atual igual ao href ou começando por `href/`.
- Badges: pílula 9px bold uppercase, padding 2px 6px. `beta`: `#dbeafe`/`#2563eb`. `novo`: `#f0fff4`/`#2f855a`.

### Grupo (pasta)
- Mesmo estilo de item + chevron 18px no fim (`chevron_right` fechado, `expand_more` aberto).
- Filhos com recuo de 16px e 4px acima, abrindo com animação de collapse. Só um nível de aninhamento.
- Começa aberto se um filho está ativo. Fechado com filho ativo → o cabeçalho do grupo recebe o tint (`.twg-nav-item--active-parent`).

### Recolhido (72px)
Só ícones centralizados, tooltip à direita, sem rótulos/badges/chevrons.

## Rodapé
- **Ações utilitárias**: linha centralizada, gap 4px (coluna quando recolhido). Botões 36×36px ghost, raio 10px, ícone 18px na primária: `school` (Academy), `forum` (chat), `notifications`.
- **Conta**: botão ghost largura total, raio 12px, padding 8px; avatar 64px (48px recolhido) com anel 2px `rgba(0,0,0,.06)`, nome 14px semibold `#1a1a1a` embaixo.
- **Menu da conta** (dropdown à direita, 288px, padding 8px, raio 12px, borda `#e8eaef`, sombra xl): cartão de cabeçalho `#f4f5f8` raio 8px com avatar, nome e perfil de acesso; títulos de seção 11px bold uppercase na primária; itens 14px medium com ícone 18px na primária (`edit`, `group`, `menu_book`, `headset_mic`); divisores `#eceef2`; **Sair** com `logout` em `#e53e3e`.

## Seletor de ambiente (só se houver mais de um)
Botão `expand_more` 18px ao lado do logo. Dropdown até 329px, máx 340px de altura, raio 4px, borda `#e2e8f0`, sombra `0 8px 24px rgba(15,23,42,.12)`. Busca fixa no topo (36px, ícone `search` `#94a3b8`). Linhas de 50px com logo 50×40 em `#f1f5f9` e nome 13px semibold. Ambiente inativo: pílula "Inativo" `#e2e8f0`/`#64748b`.

## Mobile (≤ 991px)
- Esconde rail e painel. **Bottom nav** fixo, branco, borda superior `#edf2f7`, `z-index 1200`, 4 colunas iguais: 3 atalhos + **Mais** (`more_horiz`). Conteúdo ganha `padding-bottom: 56px + safe-area`.
- Slot: 56px de altura, ícone 18px numa caixa 28×28 raio 12px, rótulo 10px bold. Inativo `#64748b`; ativo primária com caixa `color-mix(primária 12%, white)`.
- **Mais** abre um sheet de baixo: altura `min(88dvh, 720px)`, cantos superiores 24px, alça 40×4px `#d1d5db`, fundo escuro 16%. Cabeçalho "Menu" 18px bold + "Navegue pela plataforma" 12px `#64748b`, botão fechar redondo `#f1f5f9`. Seletor de módulo (48px, raio 16px, borda `#e2e8f0`, fundo `#f8fafc`) substitui o rail; abaixo, os mesmos itens do desktop; no fim, ações utilitárias e conta.

## Modelo de dados

```ts
type ShellNavItem = {
  key: string
  label: string
  href: string
  icon: string
  betaBadge?: boolean
  newBadge?: boolean
  children?: ShellNavItem[]
}

type ShellNavModule = {
  key: string
  label: string
  icon: string
  items: ShellNavItem[]
}
```
Módulos → itens → filhos (um nível). Grupo = item com `children`.
