import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Tag, Package, BarChart, LogOut, X } from "lucide-react";
import { useStore } from "@/stores/root/store";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/books", label: "Books", icon: BookOpen },
  { to: "/categories", label: "Categories", icon: Tag },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/reports", label: "Reports", icon: BarChart },
];

interface AdminSidebarProps {
  onClose?: () => void;
}

const AdminSidebar = ({ onClose }: AdminSidebarProps) => {
  const { accountStore } = useStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    accountStore.logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white text-stone-900">
      <div className="p-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">📚 Library</h1>
          <p className="text-sm text-stone-500">Inventory System</p>
        </div>
        {/* Close button for mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded hover:bg-stone-100"
          >
            <X className="h-5 w-5 text-stone-500" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-stone-900 text-white"
                  : "hover:bg-stone-100 text-stone-700"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium w-full hover:bg-red-50 hover:text-red-600 transition-colors text-stone-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;