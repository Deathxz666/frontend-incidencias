import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

function Perfil() {
  const fallbackUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(fallbackUser);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const loadProfile = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("No se pudo cargar el perfil");

        const data = await response.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch (err) {
        setError(err.message || "Error al cargar perfil");
      }
    };

    void loadProfile();
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Perfil de Usuario</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <p className="text-gray-700">Nombres: {user?.nombres || "-"}</p>
      <p className="text-gray-700">Apellido paterno: {user?.apellido_paterno || "-"}</p>
      <p className="text-gray-700">Apellido materno: {user?.apellido_materno || "-"}</p>
      <p className="text-gray-700">Puesto: {user?.puesto || "-"}</p>
      <p className="text-gray-700">Correo: {user?.email || "-"}</p>
      <p className="text-gray-700">Rol: {user?.role || "-"}</p>
    </div>
  );
}

export default Perfil;
