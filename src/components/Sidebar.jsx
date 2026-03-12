// src/components/Sidebar.jsx
function Sidebar({ setActive, active, logout }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "user";

  const menuItems = [
    { key: "inicio", label: "Inicio" },
    { key: "registrar", label: "Registrar Incidencia" },
    { key: "lista", label: "Lista de Incidencias" },
    ...(role === "admin"
      ? [
          { key: "soluciones", label: "Registro de Soluciones" },
          { key: "reportes", label: "Reportes" },
          { key: "gestion_usuarios", label: "Gestion de Usuarios" },
        ]
      : []),
    { key: "perfil", label: "Perfil" },
  ];

  return (
    <aside className="w-64 bg-indigo-700 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-indigo-500">Incidencias</div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`w-full text-left px-4 py-2 rounded ${active === item.key ? "bg-indigo-500" : "hover:bg-indigo-600"}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-indigo-500">
        <button onClick={logout} className="w-full bg-red-500 hover:bg-red-600 py-2 rounded">
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;