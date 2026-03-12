import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

function GestionUsuarios() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    nombres: "",
    apellido_paterno: "",
    apellido_materno: "",
    email: "",
    puesto: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadUsers = async (searchValue = search) => {
    const query = new URLSearchParams();
    if (searchValue.trim()) query.append("search", searchValue.trim());

    const response = await fetch(`${API_BASE_URL}/auth/users?${query.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No se pudo cargar la lista de usuarios");
    }

    const data = await response.json();
    setUsers(data);

    if (data.length > 0) {
      const selected = data.find((u) => u.id_usuario === selectedUserId) || data[0];
      setSelectedUserId(selected.id_usuario);
      setForm({
        nombres: selected.nombres || "",
        apellido_paterno: selected.apellido_paterno || "",
        apellido_materno: selected.apellido_materno || "",
        email: selected.email || "",
        puesto: selected.puesto || "",
      });
    }
  };

  useEffect(() => {
    if (user?.role === "admin") {
      void loadUsers();
    }
  }, [user?.role]);

  const handleSelectUser = (id) => {
    setSelectedUserId(id);
    const selected = users.find((u) => u.id_usuario === id);
    if (!selected) return;

    setForm({
      nombres: selected.nombres || "",
      apellido_paterno: selected.apellido_paterno || "",
      apellido_materno: selected.apellido_materno || "",
      email: selected.email || "",
      puesto: selected.puesto || "",
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedUserId) {
      setError("Selecciona un usuario");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/users/${selectedUserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo actualizar usuario";
        throw new Error(message);
      }

      setSuccess("Usuario actualizado correctamente");
      await loadUsers();
    } catch (err) {
      setError(err.message || "Error al actualizar usuario");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h2 className="text-xl font-bold text-red-600 mb-2">Acceso restringido</h2>
        <p className="text-gray-600">Solo el administrador puede gestionar usuarios.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-bold">Gestion de Usuarios</h2>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-emerald-600 text-sm">{success}</p>}

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="text-sm text-gray-700 block mb-1">Buscar usuario</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Nombre o correo"
          />
        </div>
        <button
          type="button"
          onClick={() => void loadUsers(search)}
          className="bg-slate-700 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      <form onSubmit={handleUpdateUser} className="space-y-3">
        <div>
          <label className="text-sm text-gray-700 block mb-1">Usuario seleccionado</label>
          <select
            value={selectedUserId}
            onChange={(e) => handleSelectUser(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            {users.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.email} ({u.role})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-700 block mb-1">Nombres</label>
            <input
              value={form.nombres}
              onChange={(e) => setForm((p) => ({ ...p, nombres: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">Apellido paterno</label>
            <input
              value={form.apellido_paterno}
              onChange={(e) => setForm((p) => ({ ...p, apellido_paterno: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">Apellido materno</label>
            <input
              value={form.apellido_materno}
              onChange={(e) => setForm((p) => ({ ...p, apellido_materno: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700 block mb-1">Correo electronico</label>
            <input
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-700 block mb-1">Puesto de trabajo</label>
            <input
              value={form.puesto}
              onChange={(e) => setForm((p) => ({ ...p, puesto: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
        </div>

        <button className="bg-indigo-600 text-white px-4 py-2 rounded">Guardar cambios</button>
      </form>
    </div>
  );
}

export default GestionUsuarios;
