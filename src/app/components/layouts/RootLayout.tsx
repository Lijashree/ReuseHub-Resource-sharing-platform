import { Outlet, Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  PlusCircle,
  Search,
  Inbox,
  Heart,
  TrendingUp,
  Recycle,
  Shield,
  LogOut,
  Database
} from "lucide-react";
import { api, getCurrentUser } from "../../utils/api";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const menuItems = [
    { path: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/app/add-item", icon: PlusCircle, label: "Add Item" },
    { path: "/app/browse", icon: Search, label: "Browse Items" },
    { path: "/app/requests", icon: Inbox, label: "Requests" },
    { path: "/app/donations", icon: Heart, label: "Donations" },
    { path: "/app/impact", icon: TrendingUp, label: "Impact" },
    { path: "/app/admin", icon: Shield, label: "Admin Panel", adminOnly: true },
    { path: "/app/database", icon: Database, label: "Database", adminOnly: true },
  ];

  const handleSignOut = () => {
    api.auth.signout();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Recycle className="h-7 w-7 text-primary" />
            <span className="text-xl text-primary">ReuseHub</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {currentUser?.name || currentUser?.email}
              {currentUser?.role === 'admin' && ' (Admin)'}
            </span>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r border-sidebar-border bg-sidebar">
          <nav className="space-y-1 p-4">
            {menuItems.map((item) => {
              // Hide admin panel for non-admin users
              if (item.adminOnly && currentUser?.role !== 'admin') {
                return null;
              }

              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}