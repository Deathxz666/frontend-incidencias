import { useState } from "react";

function getFullName(usuario) {
  if (!usuario) return "-";
  const fullName = [usuario.nombres, usuario.apellido_paterno, usuario.apellido_materno]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || usuario.email || "-";
}

function EstadoBadge({ estado }) {
  const color = estado?.color || "#6B7280";
  return (
    <span
      className="inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium"
      style={{ backgroundColor: `${color}22`, color }}
    >
      <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {estado?.nombre_estado || "-"}
    </span>
  );
}

function ListaIncidencias({
  incidencias,
  meta,
  query,
  role,
  onSearch,
  onEstadoFilter,
  onClasificacionFilter,
  onTipoMantenimientoFilter,
  onPageChange,
  onEdit,
  onDelete,
  onEstadoChange,
}) {
  const [searchTerm, setSearchTerm] = useState(query.search || "");

  return (
    <div className="bg-white mt-8 p-4 md:p-6 rounded-xl shadow">
      <h2 className="text-lg md:text-xl font-bold mb-4">Incidencias Registradas</h2>

      <div className="flex flex-wrap gap-3 mb-4 items-end">
        <div>
          <label className="text-xs text-gray-600 block mb-1">Buscar</label>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Titulo, descripcion, solucion, nombre"
            className="border rounded px-3 py-2 w-full sm:w-auto"
          />
        </div>

        <button onClick={() => onSearch(searchTerm)} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Aplicar
        </button>

        <div>
          <label className="text-xs text-gray-600 block mb-1">Estado</label>
          <select
            value={query.estado || ""}
            onChange={(e) => onEstadoFilter(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-auto"
          >
            <option value="">Todos</option>
            <option value="pendiente">pendiente</option>
            <option value="en progreso">en progreso</option>
            <option value="resuelta">resuelta</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">Clasificacion</label>
          <select
            value={query.clasificacion || ""}
            onChange={(e) => onClasificacionFilter(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-auto"
          >
            <option value="">Todas</option>
            <option value="incidencia">Incidencia</option>
            <option value="accidente">Accidente</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">Mantenimiento</label>
          <select
            value={query.tipo_mantenimiento || ""}
            onChange={(e) => onTipoMantenimientoFilter(e.target.value)}
            className="border rounded px-3 py-2 w-full sm:w-auto"
          >
            <option value="">Todos</option>
            <option value="correctivo">Correctivo</option>
            <option value="preventivo">Preventivo</option>
          </select>
        </div>
      </div>

      {incidencias.length === 0 ? (
        <p className="text-gray-500">No hay incidencias para el filtro seleccionado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Titulo</th>
                <th className="text-left p-2">Descripcion</th>
                <th className="text-left p-2">Clasificacion</th>
                <th className="text-left p-2">Mantenimiento</th>
                <th className="text-left p-2">Estado</th>
                <th className="text-left p-2">Usuario</th>
                <th className="text-left p-2">Asignado a</th>
                <th className="text-left p-2">Solucion</th>
                <th className="text-left p-2">Tiempo solucion</th>
                <th className="text-left p-2">Creacion</th>
                <th className="text-left p-2">Ultima edicion</th>
                <th className="text-left p-2">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {incidencias.map((inc) => (
                <tr key={inc.id_incidencia} className="border-b hover:bg-gray-50 align-top">
                  <td className="p-2">{inc.titulo}</td>
                  <td className="p-2 max-w-sm">{inc.descripcion}</td>
                  <td className="p-2">{inc.clasificacion || "-"}</td>
                  <td className="p-2">{inc.tipo_mantenimiento || "-"}</td>
                  <td className="p-2">
                    <div className="space-y-2">
                      <EstadoBadge estado={inc.estado} />
                      {role === "admin" && (
                        <select
                          value={inc.estado?.nombre_estado || "pendiente"}
                          onChange={(e) => {
                            const estado = e.target.value;
                            const payload = { estado };

                            if (estado === "en progreso") {
                              const asignado = window.prompt(
                                "Escribe el nombre de la persona asignada:",
                                inc.asignado_a || "",
                              );
                              if (!asignado?.trim()) {
                                return;
                              }
                              payload.asignado_a = asignado.trim();
                            }

                            if (estado === "resuelta") {
                              const descripcion = window.prompt(
                                "Describe como se resolvio esta incidencia:",
                                inc.descripcion_solucion || "",
                              );
                              if (!descripcion?.trim()) {
                                return;
                              }

                              const tiempo = window.prompt(
                                "Cuanto tiempo tomo resolverla? (ej: 2h 30m)",
                                inc.tiempo_solucion || "",
                              );
                              if (!tiempo?.trim()) {
                                return;
                              }

                              payload.descripcion_solucion = descripcion.trim();
                              payload.tiempo_solucion = tiempo.trim();
                            }

                            onEstadoChange(inc.id_incidencia, payload);
                          }}
                          className="border rounded px-2 py-1 block"
                        >
                          <option value="pendiente">pendiente</option>
                          <option value="en progreso">en progreso</option>
                          <option value="resuelta">resuelta</option>
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="p-2">{getFullName(inc.usuario)}</td>
                  <td className="p-2">{inc.asignado_a || "-"}</td>
                  <td className="p-2 max-w-sm">{inc.descripcion_solucion || "-"}</td>
                  <td className="p-2">{inc.tiempo_solucion || "-"}</td>
                  <td className="p-2">{inc.fecha_creacion ? new Date(inc.fecha_creacion).toLocaleString() : "-"}</td>
                  <td className="p-2">{inc.fecha_actualizacion ? new Date(inc.fecha_actualizacion).toLocaleString() : "-"}</td>
                  <td className="p-2">
                    <div className="flex gap-3">
                      <button onClick={() => onEdit(inc)} className="text-blue-600 hover:underline">
                        Editar
                      </button>
                      {role === "admin" && (
                        <button onClick={() => onDelete(inc.id_incidencia)} className="text-red-600 hover:underline">
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Pagina {meta.page} de {meta.totalPages} | Total: {meta.total}
        </p>
        <div className="flex gap-2">
          <button
            disabled={meta.page <= 1}
            onClick={() => onPageChange(meta.page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            disabled={meta.page >= meta.totalPages}
            onClick={() => onPageChange(meta.page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListaIncidencias;
