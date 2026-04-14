import { useState, useMemo, useEffect } from "react";

function IncidenciaForm({ onSave, mode = "create", initialData = null, onCancel, role = "user" }) {
  const defaults = useMemo(
    () => ({
      titulo: initialData?.titulo || "",
      descripcion: initialData?.descripcion || "",
      clasificacion: initialData?.clasificacion || "incidencia",
      tipo_mantenimiento: initialData?.tipo_mantenimiento || "correctivo",
      descripcion_solucion: initialData?.descripcion_solucion || "",
      asignado_a: initialData?.asignado_a || "",
      tiempo_solucion: initialData?.tiempo_solucion || "",
    }),
    [initialData],
  );

  const [titulo, setTitulo] = useState(defaults.titulo);
  const [descripcion, setDescripcion] = useState(defaults.descripcion);
  const [clasificacion, setClasificacion] = useState(defaults.clasificacion);
  const [tipoMantenimiento, setTipoMantenimiento] = useState(defaults.tipo_mantenimiento);
  const [descripcionSolucion, setDescripcionSolucion] = useState(defaults.descripcion_solucion);
  const [asignadoA, setAsignadoA] = useState(defaults.asignado_a);
  const [tiempoSolucion, setTiempoSolucion] = useState(defaults.tiempo_solucion);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const isEdit = mode === "edit";
  const canEditSolucion = isEdit && role === "admin";

  useEffect(() => {
    setTitulo(defaults.titulo);
    setDescripcion(defaults.descripcion);
    setClasificacion(defaults.clasificacion);
    setTipoMantenimiento(defaults.tipo_mantenimiento);
    setDescripcionSolucion(defaults.descripcion_solucion);
    setAsignadoA(defaults.asignado_a);
    setTiempoSolucion(defaults.tiempo_solucion);
  }, [defaults]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const payload = {
      titulo,
      descripcion,
      clasificacion,
      tipo_mantenimiento: tipoMantenimiento,
    };

    if (canEditSolucion) {
      payload.descripcion_solucion = descripcionSolucion.trim() || undefined;
      payload.asignado_a = asignadoA.trim() || undefined;
      payload.tiempo_solucion = tiempoSolucion.trim() || undefined;
    }

    const ok = await onSave(payload);

    if (ok) {
      setSuccess(isEdit ? "Incidencia actualizada correctamente" : "Incidencia registrada correctamente");
      if (!isEdit) {
        setTitulo("");
        setDescripcion("");
        setClasificacion("incidencia");
        setTipoMantenimiento("correctivo");
        setDescripcionSolucion("");
        setAsignadoA("");
        setTiempoSolucion("");
      }
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-xl shadow max-w-4xl w-full">
      <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? "Editar Incidencia" : "Registrar Nueva Incidencia"}
      </h2>

      {success && <div className="mb-4 bg-green-100 text-green-700 p-3 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Titulo"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Descripcion"
          className="w-full border p-2 rounded"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-700 block mb-1">Clasificacion</label>
            <select
              value={clasificacion}
              onChange={(e) => setClasificacion(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="incidencia">Incidencia</option>
              <option value="accidente">Accidente</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">Tipo de mantenimiento</label>
            <select
              value={tipoMantenimiento}
              onChange={(e) => setTipoMantenimiento(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="correctivo">Correctivo</option>
              <option value="preventivo">Preventivo</option>
            </select>
          </div>
        </div>

        {canEditSolucion && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm text-gray-700 block mb-1">Descripcion de la solucion (opcional)</label>
              <textarea
                value={descripcionSolucion}
                onChange={(e) => setDescripcionSolucion(e.target.value)}
                placeholder="Describe como se soluciono esta incidencia"
                className="w-full border p-2 rounded"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 block mb-1">Asignado a (opcional)</label>
              <input
                type="text"
                value={asignadoA}
                onChange={(e) => setAsignadoA(e.target.value)}
                placeholder="Nombre de la persona asignada"
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 block mb-1">Tiempo de solucion (opcional)</label>
              <input
                type="text"
                value={tiempoSolucion}
                onChange={(e) => setTiempoSolucion(e.target.value)}
                placeholder="Ej: 2h 30m"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button disabled={loading} className="bg-indigo-600 text-white px-6 py-2 rounded disabled:opacity-50">
            {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Registrar"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 px-6 py-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default IncidenciaForm;
