import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, X, Trash2, Users, Package, Inbox, TrendingUp } from "lucide-react";
import { api } from "../../utils/api";
import { toast } from "sonner";

interface Item {
  id: string;
  title: string;
  category: string;
  type: string;
  quantity: number;
  owner: string;
  ownerName: string;
  status: "pending" | "approved" | "rejected";
  imageUrl: string;
  createdAt: string;
}

export function AdminDashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [pendingItems, setPendingItems] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState<"items" | "users">("items");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingItems();
  }, []);

  const loadPendingItems = async () => {
    try {
      const data = await api.items.getAll({ status: "pending" });
      setPendingItems(data.items || []);
      setItems(data.items || []); // Also set items for the table
    } catch (error: any) {
      toast.error(error.message || "Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.admin.approveItem(id);
      toast.success("Item approved!");
      loadPendingItems(); // Reload the list
    } catch (error: any) {
      toast.error(error.message || "Failed to approve item");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.admin.rejectItem(id);
      toast.success("Item rejected");
      loadPendingItems(); // Reload the list
    } catch (error: any) {
      toast.error(error.message || "Failed to reject item");
    }
  };

  const handleRemove = (id: string) => {
    if (confirm("Are you sure you want to remove this item?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const stats = {
    totalItems: items.length,
    pendingItems: items.filter((i) => i.status === "pending").length,
    totalUsers: 0, // Placeholder, actual value should be fetched from API
    activeRequests: 12,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-foreground">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage platform items and users</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Items", value: stats.totalItems, icon: Package, color: "text-primary" },
          { label: "Pending Approval", value: stats.pendingItems, icon: Inbox, color: "text-accent" },
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-secondary" },
          { label: "Active Requests", value: stats.activeRequests, icon: TrendingUp, color: "text-[#52b788]" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl text-card-foreground">{stat.value}</p>
                </div>
                <Icon className={`h-10 w-10 ${stat.color}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button
          onClick={() => setActiveTab("items")}
          className={`px-6 py-3 transition-colors ${
            activeTab === "items"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Items Management
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 transition-colors ${
            activeTab === "users"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Users List
        </button>
      </div>

      {/* Items Table */}
      {activeTab === "items" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Item</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Category</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Type</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Quantity</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Owner</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="text-sm text-card-foreground">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.createdAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-card-foreground">{item.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          item.type === "Share"
                            ? "bg-primary/10 text-primary"
                            : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-card-foreground">{item.quantity}</td>
                    <td className="px-6 py-4 text-sm text-card-foreground">{item.ownerName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs ${
                          item.status === "approved"
                            ? "bg-primary/10 text-primary"
                            : item.status === "rejected"
                            ? "bg-destructive/10 text-destructive"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {item.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="rounded-lg bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(item.id)}
                              className="rounded-lg bg-destructive p-2 text-destructive-foreground transition-colors hover:bg-destructive/90"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="rounded-lg bg-muted p-2 text-destructive transition-colors hover:bg-destructive/10"
                          title="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Users Table */}
      {activeTab === "users" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-hidden rounded-xl border border-border bg-card shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Email</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Items Listed</th>
                  <th className="px-6 py-4 text-left text-sm text-muted-foreground">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {/* Placeholder for users list, actual data should be fetched from API */}
                <tr className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-sm text-card-foreground">Sarah Chen</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">sarah@university.edu</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">12</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">2026-01-15</td>
                </tr>
                <tr className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-sm text-card-foreground">Michael Ross</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">michael@university.edu</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">8</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">2026-02-20</td>
                </tr>
                <tr className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-sm text-card-foreground">Emily Davis</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">emily@university.edu</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">15</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">2026-01-10</td>
                </tr>
                <tr className="border-b border-border last:border-0">
                  <td className="px-6 py-4 text-sm text-card-foreground">Alex Kumar</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">alex@university.edu</td>
                  <td className="px-6 py-4 text-sm text-card-foreground">6</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">2026-03-05</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}