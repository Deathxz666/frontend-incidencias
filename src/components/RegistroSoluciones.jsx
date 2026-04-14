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

function getFullName(usuario) {
  if (!usuario) return "-";
  const fullName = [usuario.nombres, usuario.apellido_paterno, usuario.apellido_materno]
    .filter(Boolean)
    .join(" ")
    .trim();
  return fullName || usuario.email || "-";
}

function RegistroSoluciones({ incidencias, meta, onSearch, onPageChange }) {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow">
      <div className="flex flex-wrap justify-between items-end gap-3 mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Registro de Soluciones</h2>
        <button onClick={onSearch} className="bg-indigo-600 text-white px-4 py-2 rounded w-full sm:w-auto">
          Actualizar
        </button>
      </div>

      {incidencias.length === 0 ? (
        <p className="text-gray-500">No hay incidencias resueltas con descripcion de solucion.</p>
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
                <th className="text-left p-2">Descripcion de solucion</th>
                <th className="text-left p-2">Tiempo solucion</th>
                <th className="text-left p-2">Creacion</th>
                <th className="text-left p-2">Ultima edicion</th>
              </tr>
            </thead>
            <tbody>
              {incidencias.map((inc) => (
                <tr key={inc.id_incidencia} className="border-b align-top">
                  <td className="p-2">{inc.titulo}</td>
                  <td className="p-2">{inc.descripcion}</td>
                  <td className="p-2">{inc.clasificacion || "-"}</td>
                  <td className="p-2">{inc.tipo_mantenimiento || "-"}</td>
                  <td className="p-2"><EstadoBadge estado={inc.estado} /></td>
                  <td className="p-2">{getFullName(inc.usuario)}</td>
                  <td className="p-2">{inc.asignado_a || "-"}</td>
                  <td className="p-2">{inc.descripcion_solucion || "-"}</td>
                  <td className="p-2">{inc.tiempo_solucion || "-"}</td>
                  <td className="p-2">{inc.fecha_creacion ? new Date(inc.fecha_creacion).toLocaleString() : "-"}</td>
                  <td className="p-2">{inc.fecha_actualizacion ? new Date(inc.fecha_actualizacion).toLocaleString() : "-"}</td>
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

export default RegistroSoluciones;
