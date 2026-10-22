import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { APP_CONFIG } from "../config";

// Menu no padrão Twygo: módulos na faixa colorida da esquerda e os itens do
// módulo selecionado no painel claro. Ícones são nomes do Material Symbols
// (https://fonts.google.com/icons). Para uma página nova, adicione um item no
// módulo certo (ou crie um módulo novo). Com um módulo só, a faixa vira uma
// barra fina sem botões.
type NavItem = { to: string; label: string; icon: string; end?: boolean; badge?: "beta" | "novo" };
type NavModule = { key: string; label: string; icon: string; items: NavItem[] };

const NAV_MODULES: NavModule[] = [
  {
    key: "indicadores",
    label: "Indicadores",
    icon: "monitoring",
    items: [
      { to: "/", label: "Dashboard", icon: "dashboard", end: true },
      { to: "/kpis", label: "KPIs", icon: "bar_chart" },
    ],
  },
  {
    key: "configuracoes",
    label: "Configurações",
    icon: "tune",
    items: [{ to: "/settings", label: "Configurações", icon: "settings" }],
  },
];

const COLLAPSED_STORAGE_KEY = "twygo:menu:collapsed";

function isActivePath(pathname: string, item: NavItem) {
  if (item.end) return pathname === item.to;
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

function readCollapsed() {
  try {
    return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`twg-icon ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export default function Sidebar() {
  const { pathname } = useLocation();
  const moduleFromPath =
    NAV_MODULES.find((module) => module.items.some((item) => isActivePath(pathname, item))) ??
    NAV_MODULES[0]!;
  const [selectedKey, setSelectedKey] = useState(moduleFromPath.key);
  const [collapsed, setCollapsed] = useState(readCollapsed);

  useEffect(() => setSelectedKey(moduleFromPath.key), [moduleFromPath.key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(COLLAPSED_STORAGE_KEY, String(collapsed));
    } catch {
      // navegador sem localStorage: o menu só não lembra o estado
    }
  }, [collapsed]);

  const selected = NAV_MODULES.find((module) => module.key === selectedKey) ?? NAV_MODULES[0]!;
  const singleModule = NAV_MODULES.length === 1;
  const userName = APP_CONFIG.userName || "Usuário";
  const quickItems = NAV_MODULES.flatMap((module) => module.items).slice(0, 3);

  return (
    <>
      <nav className="twg-shell__nav" aria-label="Menu principal">
        <div className={singleModule ? "twg-rail twg-rail--strip" : "twg-rail"}>
          {!singleModule &&
            NAV_MODULES.map((module) => (
              <button
                key={module.key}
                type="button"
                className="twg-rail__item twg-tooltip"
                data-tip={module.label}
                aria-label={module.label}
                aria-current={module.key === selected.key ? "true" : undefined}
                onClick={() => setSelectedKey(module.key)}
              >
                <Icon name={module.icon} />
              </button>
            ))}
        </div>

        <div className={collapsed ? "twg-panel twg-panel--collapsed" : "twg-panel"}>
          <div className="twg-panel__brand">
            {collapsed ? (
              <span className="shell-brand-mark">{APP_CONFIG.title[0]}</span>
            ) : (
              <span className="twg-panel__brand-name">{APP_CONFIG.title}</span>
            )}
          </div>

          <div className="twg-panel__header">
            <span className="twg-panel__module-title">{selected.label}</span>
            <button
              type="button"
              className="twg-panel__toggle"
              aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
              onClick={() => setCollapsed((value) => !value)}
            >
              <Icon name="chevron_right" />
            </button>
          </div>

          <div className="twg-panel__items">
            {selected.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={collapsed ? "twg-nav-item twg-tooltip" : "twg-nav-item"}
                data-tip={collapsed ? item.label : undefined}
              >
                <Icon name={item.icon} />
                <span className="twg-nav-item__label">{item.label}</span>
                {item.badge && (
                  <span className={`twg-nav-badge twg-nav-badge--${item.badge === "novo" ? "new" : "beta"}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          <div className="twg-panel__footer">
            <div className="twg-account">
              <span className="twg-avatar">
                {APP_CONFIG.userName ? initials(APP_CONFIG.userName) : <Icon name="person" />}
              </span>
              <span className="twg-account__name">{userName}</span>
            </div>
          </div>
        </div>
      </nav>

      <nav className="twg-bottom-nav" aria-label="Menu rápido">
        {quickItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className="twg-bottom-nav__item">
            <span className="twg-bottom-nav__icon">
              <Icon name={item.icon} />
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
}
