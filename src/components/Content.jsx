import { useState, useEffect } from "react";
import IncidenciaForm from "./IncidenciaForm";
import ListaIncidencias from "./ListaIncidencias";
import Reportes from "./Reportes";
import Perfil from "./Perfil";
import GestionUsuarios from "./GestionUsuarios";
import RegistroSoluciones from "./RegistroSoluciones";
import { API_BASE_URL } from "../config/api";

function normalizeMessage(message) {
  if (Array.isArray(message)) {
    return message.join(", ");
  }
  return message || "Operacion no completada";
}

function Content({
  active,
  incidencias,
  meta,
  query,
  setIncidencias,
  reloadIncidencias,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "user";
  const [formError, setFormError] = useState("");
  const [editingIncidencia, setEditingIncidencia] = useState(null);
  const [reportes, setReportes] = useState(null);
  const [reportRange, setReportRange] = useState({ from: "", to: "" });
  const [reportSearch, setReportSearch] = useState("");
  const [soluciones, setSoluciones] = useState([]);
  const [solucionesMeta, setSolucionesMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  const token = localStorage.getItem("token");

  const apiHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleCreate = async (nueva) => {
    if (!token) {
      setFormError("Sesion expirada. Vuelve a iniciar sesion.");
      return false;
    }

    try {
      setFormError("");
      const response = await fetch(`${API_BASE_URL}/incidencias`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(nueva),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(normalizeMessage(errorData.message));
      }

      const created = await response.json();
      setIncidencias([created, ...incidencias]);
      await reloadIncidencias({ page: 1 });
      return true;
    } catch (err) {
      setFormError(err.message || "Error al crear incidencia");
      return false;
    }
  };

  const handleUpdate = async (changes) => {
    if (!editingIncidencia || !token) {
      return false;
    }

    try {
      setFormError("");
      const response = await fetch(
        `${API_BASE_URL}/incidencias/${editingIncidencia.id_incidencia}`,
        {
          method: "PATCH",
          headers: apiHeaders,
          body: JSON.stringify(changes),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(normalizeMessage(errorData.message));
      }

      setEditingIncidencia(null);
      await reloadIncidencias();
      return true;
    } catch (err) {
      setFormError(err.message || "Error al editar incidencia");
      return false;
    }
  };

  const handleEstadoChange = async (idIncidencia, payload) => {
    try {
      setFormError("");

      const response = await fetch(`${API_BASE_URL}/incidencias/${idIncidencia}/estado`, {
        method: "PATCH",
        headers: apiHeaders,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(normalizeMessage(errorData.message));
      }

      await reloadIncidencias();
      if (active === "soluciones") {
        await loadSoluciones({ page: solucionesMeta.page });
      }
    } catch (err) {
      setFormError(err.message || "Error al actualizar estado");
    }
  };

  const handleDelete = async (idIncidencia) => {
    if (role !== "admin") {
      return;
    }

    const confirmDelete = window.confirm("Seguro que deseas eliminar esta incidencia?");
    if (!confirmDelete) {
      return;
    }

    try {
      setFormError("");
      const response = await fetch(`${API_BASE_URL}/incidencias/${idIncidencia}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(normalizeMessage(errorData.message));
      }

      await reloadIncidencias();
    } catch (err) {
      setFormError(err.message || "Error al eliminar incidencia");
    }
  };

  const loadReportes = async (filters = reportRange) => {
    if (!token || role !== "admin") {
      return;
    }

    const searchParams = new URLSearchParams();
    if (filters.from) searchParams.append("from", filters.from);
    if (filters.to) searchParams.append("to", filters.to);
    if (reportSearch.trim()) searchParams.append("search", reportSearch.trim());

    try {
      setFormError("");
      const response = await fetch(`${API_BASE_URL}/incidencias/reportes?${searchParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(normalizeMessage(errorData.message));
      }

      const data = await response.json();
      setReportes(data);
    } catch (err) {
      setFormError(err.message || "Error al cargar reportes");
    }
  };

  const loadSoluciones = async (overrides = {}) => {
    if (!token || role !== "admin") {
      return;
    }

    const next = { ...query, ...overrides };
    const searchParams = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    try {
      setFormError("");
      const response = await fetch(`${API_BASE_URL}/incidencias/soluciones?${searchParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(normalizeMessage(errorData.message));
      }

      const result = await response.json();
      setSoluciones(result.data || []);
      setSolucionesMeta(result.meta || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      setFormError(err.message || "Error al cargar registro de soluciones");
    }
  };

  const downloadReportesPdf = async (filters = reportRange) => {
    if (!token || role !== "admin") {
      return;
    }

    const searchParams = new URLSearchParams();
    if (filters.from) searchParams.append("from", filters.from);
    if (filters.to) searchParams.append("to", filters.to);
    if (reportSearch.trim()) searchParams.append("search", reportSearch.trim());

    try {
      const response = await fetch(
        `${API_BASE_URL}/incidencias/reportes/pdf?${searchParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(normalizeMessage(errorData.message));
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reporte-incidencias-${Date.now()}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setFormError(err.message || "Error al descargar PDF");
    }
  };

  useEffect(() => {
    if (active === "reportes" && role === "admin") {
      void loadReportes();
    }
    if (active === "soluciones" && role === "admin") {
      void loadSoluciones({ page: 1 });
    }
  }, [active, role]);

  switch (active) {
    case "inicio":
      return <Inicio />;

    case "registrar":
      return (
        <div>
          {formError && <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">{formError}</div>}
          <IncidenciaForm onSave={handleCreate} role={role} />
        </div>
      );

    case "lista":
      return (
        <div>
          {formError && <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">{formError}</div>}
          <ListaIncidencias
            incidencias={incidencias}
            meta={meta}
            query={query}
            role={role}
            onSearch={(search) => reloadIncidencias({ search, page: 1 })}
            onEstadoFilter={(estado) => reloadIncidencias({ estado, page: 1 })}
            onClasificacionFilter={(clasificacion) => reloadIncidencias({ clasificacion, page: 1 })}
            onTipoMantenimientoFilter={(tipo_mantenimiento) => reloadIncidencias({ tipo_mantenimiento, page: 1 })}
            onPageChange={(page) => reloadIncidencias({ page })}
            onEdit={setEditingIncidencia}
            onDelete={handleDelete}
            onEstadoChange={handleEstadoChange}
          />

          {editingIncidencia && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
              <IncidenciaForm
                mode="edit"
                initialData={editingIncidencia}
                onSave={handleUpdate}
                onCancel={() => setEditingIncidencia(null)}
                role={role}
              />
            </div>
          )}
        </div>
      );

    case "soluciones":
      if (role !== "admin") {
        return (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Acceso restringido</h2>
            <p className="text-gray-600">Solo el administrador puede ver el registro de soluciones.</p>
          </div>
        );
      }

      return (
        <div>
          {formError && <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">{formError}</div>}
          <RegistroSoluciones
            incidencias={soluciones}
            meta={solucionesMeta}
            onSearch={() => loadSoluciones({ page: 1 })}
            onPageChange={(page) => loadSoluciones({ page })}
          />
        </div>
      );

    case "reportes":
      if (role !== "admin") {
        return (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">Acceso restringido</h2>
            <p className="text-gray-600">No tienes permisos para acceder a reportes.</p>
          </div>
        );
      }

      return (
        <div>
          {formError && <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">{formError}</div>}
          <Reportes
            reportes={reportes}
            reportRange={reportRange}
            setReportRange={setReportRange}
            reportSearch={reportSearch}
            setReportSearch={setReportSearch}
            onRunReport={() => loadReportes(reportRange)}
            onDownloadPdf={() => downloadReportesPdf(reportRange)}
          />
        </div>
      );

    case "gestion_usuarios":
      return <GestionUsuarios />;

    case "perfil":
      return <Perfil />;

    default:
      return null;
  }
}

function Inicio() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-2">Bienvenido</h2>
      <p className="text-gray-600">
        Desde aqui puedes registrar incidencias, aplicar filtros y revisar reportes (admin).
      </p>
    </div>
  );
}

export default Content;
