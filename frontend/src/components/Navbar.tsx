import { APP_CONFIG } from "../config";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="4.8" r="2.6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 12.5c.8-2.3 2.7-3.5 5-3.5s4.2 1.2 5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function Navbar() {
  const { title, subtitle, userName } = APP_CONFIG;
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__mark" aria-hidden="true" />
        <div>
          <div className="navbar__title">{title}</div>
          <div className="navbar__subtitle">{subtitle}</div>
        </div>
      </div>
      <div className="navbar__actions">
        <span className="navbar__user">
          <span className="navbar__avatar" aria-hidden="true">
            {userName ? initials(userName) : <UserIcon />}
          </span>
          {userName || "Usuário"}
        </span>
      </div>
    </header>
  );
}
