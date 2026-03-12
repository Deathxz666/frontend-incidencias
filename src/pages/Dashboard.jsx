import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Content from "../components/Content";
import { API_BASE_URL } from "../config/api";

function Dashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("inicio");
  const [incidencias, setIncidencias] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [query, setQuery] = useState({
    page: 1,
    limit: 10,
    search: "",
    estado: "",
    clasificacion: "",
    tipo_mantenimiento: "",
  });
  const [error, setError] = useState("");

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const loadIncidencias = useCallback(
    async (overrides = {}) => {
      const token = localStorage.getItem("token");
      if (!token) {
        logout();
        return;
      }

      const nextQuery = { ...query, ...overrides };
      setQuery(nextQuery);

      const searchParams = new URLSearchParams();
      Object.entries(nextQuery).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          searchParams.append(key, String(value));
        }
      });

      try {
        setError("");
        const response = await fetch(`${API_BASE_URL}/incidencias?${searchParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "No se pudieron cargar las incidencias");
        }

        const result = await response.json();
        setIncidencias(result.data || []);
        setMeta(result.meta || { page: 1, limit: 10, total: 0, totalPages: 1 });
      } catch (err) {
        setError(err.message || "Error de conexion con el backend");
      }
    },
    [query],
  );

  useEffect(() => {
    void loadIncidencias();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar active={active} setActive={setActive} logout={logout} />
      <main className="flex-1 p-8 relative">
        <Header />
        {error && <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">{error}</div>}
        <Content
          active={active}
          incidencias={incidencias}
          meta={meta}
          query={query}
          setIncidencias={setIncidencias}
          reloadIncidencias={loadIncidencias}
        />
      </main>
    </div>
  );
}

export default Dashboard;