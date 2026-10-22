# Tokens

Todos já estão como variáveis CSS em `assets/twygo-ui.css` (`--twg-*`).

## Cor primária
- Padrão **`#9349DE`** (roxo Twygo). Cada organização define a sua — trate como variável, nunca como constante espalhada.
- Tints: 10% sobre transparente (item ativo, fundo suave), 12% sobre branco (bottom nav ativo), ~8% sobre branco (hover de botão outline).
- Troca: defina `--twg-primary` (e `--twg-font`) no `:root` ou no `.twg-shell`; os tints são recalculados ali. Conteúdo renderizado fora do shell (portal de modal) recebe a classe `.twg-theme` com as mesmas variáveis.
- Sólida em: rail, botões primários, ícones de menu e de ação, aba ativa, tooltip, checkbox, barra de progresso.

## Cinzas (escala Chakra)
| Token | Hex | Uso |
|---|---|---|
| gray.50 | `#F7FAFC` | Zebra da tabela, painéis sutis |
| gray.100 | `#EDF2F7` | Bordas de linha, hover leve |
| gray.200 | `#E2E8F0` | **Borda padrão** de cards, inputs, divisores |
| gray.300 | `#CBD5E0` | Borda da busca, hover de input |
| gray.400 | `#A0AEC0` | Ícone de busca, placeholder "—" |
| gray.500 | `#718096` | Títulos de página, texto auxiliar |
| gray.600 | `#4A5568` | Cabeçalho de tabela, abas, títulos de seção |
| gray.700 | `#2D3748` | Texto forte |
| gray.800 | `#1A202C` | Texto de corpo |

## Superfícies do shell
| Uso | Hex |
|---|---|
| Painel do menu | `#F7F8FB` |
| Borda do shell | `#E2E8F0` |
| Texto de item | `#34495E` |
| Hover de item | `#E9EBEE` |
| Fundo do body (atrás do conteúdo) | `#ECF0F5` |
| Conteúdo / cards / tabela | `#FFFFFF` |

## Cores de status (paleta do produto)
released `#a4df56` · development `#7970f1` · suspended `#ec9238` · concluded `#25855A` · inProgress `#FEEBCB` · cancel `#FED7D7` · interrupted `#E2E8F0` · waiting `#dbb333`.
Tipo de conteúdo: curso `#5198D7` (claro `#bcdbf6`) · trilha `#AC71E8` (claro `#dabcf7`).
Feedback de resposta: correta `#c9efcb` · parcial `#fff0c0` · incorreta `#fbd38d`.
Badges de status de tabela: ver `pages.md`.

## Tipografia
- **Lato** (300, 400, 700) para títulos e corpo — padrão do layout. A organização pode trocar no brand kit (Baloo 2, Cabin, Lato, Merriweather, Montserrat, Nunito Sans, Open Sans, Poppins, PT Sans, Raleway, Roboto, Rubik, Source Sans Pro, Ubuntu, Work Sans...). Em CSS: `--twg-font`.
- Escala: xs 12 · sm 14 · md 16 · lg 18 · xl 20 · 2xl 24px. Pesos: 400 corpo, 600 rótulos/botões, 700 títulos/cabeçalhos.
- Exceções intencionais (densas): 11px rótulo de módulo e badges de status, 10px bottom nav, 9px badge beta/novo, 13px texto secundário em células.

## Raio
4px input · 6px botão, tabela, modal, rail · 8px item de menu, card · 10px KPI · 12px menu da conta · 16px painel de contagem · pílula em badges/tags.

## Sombras (escala Chakra)
- sm `0 1px 2px 0 rgba(0,0,0,.05)` · md `0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06)` · xl `0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04)`.
- Cards usam borda, não sombra. Sombra `md` no módulo ativo do rail e em dropdowns; `xl` em drawer/modal/menu da conta.

## Espaçamento
Base 4px (escala Chakra: 1=4, 2=8, 3=12, 4=16, 6=24, 8=32). Página com padding 16px, toolbar 24px de margem, grid de formulário gap 16px.

## Breakpoints
Mobile do shell ≤ 991px. Chakra: sm 480 · md 768 · lg 992 · xl 1280.

---

## Opcional: projeto em Chakra UI 2
Se o projeto já usa Chakra 2, este tema reproduz o do produto (gere `primary` com qualquer gerador de escala 50–900; no produto 500/600/800 são a cor exata da org):

```ts
import { extendTheme } from '@chakra-ui/react'

export const twygoTheme = extendTheme({
  fonts: { heading: 'Lato, sans-serif', body: 'Lato, sans-serif' },
  breakpoints: { xs: '25em' },
  colors: {
    primary: { 50: '#f6effd', 100: '#e7d6f8', 200: '#d3b3f2', 300: '#bc8deb', 400: '#a66be4', 500: '#9349de', 600: '#9349de', 700: '#6f2fb3', 800: '#9349de', 900: '#2c0f4d' },
    lightGray: { 100: '#f7fafc' },
  },
  components: {
    Tag: {
      variants: {
        success: { container: { borderRadius: 'full', backgroundColor: 'green.100', color: 'green.600', fontWeight: 'bold', px: 5, py: 1 } },
        warning: { container: { borderRadius: 'full', backgroundColor: 'orange.100', color: 'orange.500', fontWeight: 'bold', px: 5, py: 1 } },
        error: { container: { borderRadius: 'full', backgroundColor: 'red.100', color: 'red.600', fontWeight: 'bold', px: 5, py: 1 } },
        gray: { container: { borderRadius: 'full', backgroundColor: 'gray.200', color: 'black', fontWeight: '600', px: 5, py: 1 } },
      },
    },
    Table: { defaultProps: { colorScheme: 'lightGray' } },
    Tabs: { defaultProps: { colorScheme: 'primary' } },
    Button: { defaultProps: { colorScheme: 'primary' } },
    Tooltip: { baseStyle: { bg: 'primary.500', color: 'white', borderRadius: '5px' } },
    Modal: { baseStyle: { dialog: { mx: '5px', fontSize: 'sm' }, header: { fontSize: 'md' } } },
    Input: { baseStyle: { field: { _disabled: { bg: 'gray.200', color: 'gray.600' } } } },
    FormLabel: { baseStyle: { fontWeight: '700' } },
    Alert: { baseStyle: { container: { fontSize: 'md' } } },
  },
})
```
Tabela: `<Table variant="striped" colorScheme="lightGray" size="sm">` com `Th` em `textTransform="none" fontSize="xs" color="#4a5568"`. Modal: `closeOnOverlayClick={false}`. Toast: `position: 'bottom-right', variant: 'left-accent', duration: 5000, isClosable: true`.
