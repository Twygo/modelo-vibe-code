import type { CSSProperties } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { APP_CONFIG } from "../config";

export default function AppLayout() {
  const brandStyle = { "--twg-primary": APP_CONFIG.primaryColor } as CSSProperties;

  return (
    <div className="twg-shell" style={brandStyle}>
      <Sidebar />
      <main className="twg-shell__content app-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
