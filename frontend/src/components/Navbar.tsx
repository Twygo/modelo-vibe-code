export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__mark" aria-hidden="true" />
        <div>
          <div className="navbar__title">KPI Boilerplate</div>
          <div className="navbar__subtitle">Twygo · Painel de indicadores</div>
        </div>
      </div>
      <div className="navbar__actions">
        <span className="navbar__user">
          <span className="navbar__avatar" aria-hidden="true">
            JG
          </span>
          usuário
        </span>
      </div>
    </header>
  );
}
