function EstadoBadge({ estado, color }) {
  const effectiveColor = color || "#6B7280";
  return (
    <span
      className="inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-medium"
      style={{ backgroundColor: `${effectiveColor}22`, color: effectiveColor }}
    >
      <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: effectiveColor }} />
      {estado || "-"}
    </span>
  );
}

function Reportes({ reportes, reportRange, setReportRange, onRunReport, onDownloadPdf }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Reportes de Incidencias</h2>

      <div className="mb-3 text-sm text-gray-700">
        Responsable del reporte: <strong>{reportes?.responsable?.nombre_completo || "-"}</strong>
        {reportes?.responsable?.email ? ` (${reportes.responsable.email})` : ""}
      </div>

      <div className="flex gap-3 items-end mb-6">
        <div>
          <label className="text-xs text-gray-600 block mb-1">Desde</label>
          <input
            type="date"
            value={reportRange.from}
            onChange={(e) => setReportRange((prev) => ({ ...prev, from: e.target.value }))}
            className="border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">Hasta</label>
          <input
            type="date"
            value={reportRange.to}
            onChange={(e) => setReportRange((prev) => ({ ...prev, to: e.target.value }))}
            className="border rounded px-3 py-2"
          />
        </div>

        <button onClick={onRunReport} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Ejecutar reporte
        </button>
        <button onClick={onDownloadPdf} className="bg-emerald-600 text-white px-4 py-2 rounded">
          Descargar PDF
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-indigo-100 p-4 rounded shadow text-center">
          <p className="text-gray-600">Total de incidencias</p>
          <p className="text-2xl font-bold">{reportes?.total ?? 0}</p>
        </div>

        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <p className="text-gray-600">Estados registrados</p>
          <p className="text-2xl font-bold">{Object.keys(reportes?.por_estado || {}).length}</p>
        </div>

        <div className="bg-amber-100 p-4 rounded shadow text-center">
          <p className="text-gray-600">Clasificaciones registradas</p>
          <p className="text-2xl font-bold">{Object.keys(reportes?.por_clasificacion || {}).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <h3 className="font-bold mb-2">Por estado</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {Object.entries(reportes?.por_estado || {}).map(([estado, cantidad]) => (
              <li key={estado}>
                {estado}: {cantidad}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2">Por clasificacion</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {Object.entries(reportes?.por_clasificacion || {}).map(([tipo, cantidad]) => (
              <li key={tipo}>
                {tipo}: {cantidad}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-2">Por tipo de mantenimiento</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {Object.entries(reportes?.por_tipo_mantenimiento || {}).map(([tipo, cantidad]) => (
              <li key={tipo}>
                {tipo}: {cantidad}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-2">Detalle de incidencias</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Titulo</th>
                <th className="text-left p-2">Descripcion</th>
                <th className="text-left p-2">Clasificacion</th>
                <th className="text-left p-2">Mantenimiento</th>
                <th className="text-left p-2">Usuario</th>
                <th className="text-left p-2">Estado</th>
                <th className="text-left p-2">Solucion</th>
                <th className="text-left p-2">Creacion</th>
                <th className="text-left p-2">Ultima edicion</th>
              </tr>
            </thead>
            <tbody>
              {(reportes?.detalles || []).map((item) => (
                <tr key={item.id_incidencia} className="border-b align-top">
                  <td className="p-2">{item.titulo}</td>
                  <td className="p-2">{item.descripcion}</td>
                  <td className="p-2">{item.clasificacion || "-"}</td>
                  <td className="p-2">{item.tipo_mantenimiento || "-"}</td>
                  <td className="p-2">{item.usuario}</td>
                  <td className="p-2">
                    <EstadoBadge estado={item.estado} color={item.estado_color} />
                  </td>
                  <td className="p-2">{item.descripcion_solucion || "-"}</td>
                  <td className="p-2">{item.fecha_creacion}</td>
                  <td className="p-2">{item.fecha_actualizacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Reportes;