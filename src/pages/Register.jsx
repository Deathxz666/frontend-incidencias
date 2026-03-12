import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config/api";

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const nombres = e.target.nombres.value;
    const apellido_paterno = e.target.apellido_paterno.value;
    const apellido_materno = e.target.apellido_materno.value;
    const puesto = e.target.puesto.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirm = e.target.confirm.value;

    if (password !== confirm) {
      setError("Las contrasenas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombres,
          apellido_paterno,
          apellido_materno,
          puesto,
          email,
          password,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(", ")
          : data.message || "No se pudo registrar";
        throw new Error(message);
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Crear cuenta</h2>
        <p className="text-center text-gray-500 mb-6">Registrate para usar el sistema</p>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            className="w-full mb-3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="text"
            name="apellido_paterno"
            placeholder="Apellido paterno"
            className="w-full mb-3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="text"
            name="apellido_materno"
            placeholder="Apellido materno"
            className="w-full mb-3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Correo electronico"
            className="w-full mb-3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="text"
            name="puesto"
            placeholder="Puesto de trabajo"
            className="w-full mb-3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contrasena"
            className="w-full mb-3 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <input
            type="password"
            name="confirm"
            placeholder="Confirmar contrasena"
            className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            required
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Ya tienes cuenta?{" "}
          <Link to="/" className="text-indigo-600 hover:underline">
            Iniciar sesion
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

