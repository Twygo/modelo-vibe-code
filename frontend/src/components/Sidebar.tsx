import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

function DashboardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="6" height="8" rx="1.5" fill="currentColor" opacity="0.9" />
      <rect x="10" y="2" width="6" height="5" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="10" y="9" width="6" height="7" rx="1.5" fill="currentColor" opacity="0.55" />
      <rect x="2" y="12" width="6" height="4" rx="1.5" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function KpiIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M2.5 14.5V9.5M7 14.5V4.5M11.5 14.5V7M16 14.5V2.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9 2.5v1.6M9 13.9v1.6M15.5 9h-1.6M4.1 9H2.5M13.4 4.6l-1.1 1.1M5.7 12.3l-1.1 1.1M13.4 13.4l-1.1-1.1M5.7 5.7 4.6 4.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const NAV_ITEMS: { to: string; label: string; end: boolean; icon: ReactNode }[] = [
  { to: "/", label: "Dashboard", end: true, icon: <DashboardIcon /> },
  { to: "/kpis", label: "KPIs", end: false, icon: <KpiIcon /> },
  { to: "/settings", label: "Configurações", end: false, icon: <SettingsIcon /> },
];

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <div className="sidebar__eyebrow">Navegação</div>
      <ul className="sidebar__list">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive ? "sidebar__link sidebar__link--active" : "sidebar__link"
              }
            >
              <span className="sidebar__icon">{item.icon}</span>
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
