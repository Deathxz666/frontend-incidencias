function Header() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6 flex justify-between items-center">
      <h1 className="text-xl font-semibold">Panel de Control</h1>
      <span className="text-gray-600 text-sm">
        {user?.nombres ? `${user.nombres} (${user?.puesto || "sin puesto"})` : user?.email}
      </span>
    </div>
  );
}

export default Header;
