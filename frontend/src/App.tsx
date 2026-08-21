import { Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Kpis from "./pages/Kpis";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/kpis" element={<Kpis />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
