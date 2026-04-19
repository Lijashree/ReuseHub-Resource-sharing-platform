import { useState, useEffect } from "react";
import { Database, RefreshCw, Download, Trash2 } from "lucide-react";
import { motion } from "motion/react";

export function DatabaseViewerPage() {
  const [dbData, setDbData] = useState<any>({});
  const [activeTab, setActiveTab] = useState<"users" | "items" | "requests">("users");

  const loadDatabase = () => {
    const users = JSON.parse(localStorage.getItem("mock_users") || "[]");
    const items = JSON.parse(localStorage.getItem("mock_items") || "[]");
    const requests = JSON.parse(localStorage.getItem("mock_requests") || "[]");

    setDbData({ users, items, requests });
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  const exportData = () => {
    const dataStr = JSON.stringify(dbData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reusehub-database-${Date.now()}.json`;
    link.click();
  };

  const clearDatabase = () => {
    if (confirm("⚠️ Are you sure? This will delete ALL data!")) {
      localStorage.removeItem("mock_users");
      localStorage.removeItem("mock_items");
      localStorage.removeItem("mock_requests");
      loadDatabase();
      alert("Database cleared!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Database Viewer
          </h1>
          <p className="mt-2 text-muted-foreground">
            Real-time view of stored data (localStorage simulation)
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadDatabase}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
          <button
            onClick={clearDatabase}
            className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
            Clear DB
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="mt-2 text-3xl text-card-foreground">{dbData.users?.length || 0}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="text-sm text-muted-foreground">Total Items</div>
          <div className="mt-2 text-3xl text-card-foreground">{dbData.items?.length || 0}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="text-sm text-muted-foreground">Total Requests</div>
          <div className="mt-2 text-3xl text-card-foreground">{dbData.requests?.length || 0}</div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(["users", "items", "requests"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 transition-colors capitalize ${
              activeTab === tab
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab} ({dbData[tab]?.length || 0})
          </button>
        ))}
      </div>

      {/* Data Display */}
      <div className="rounded-xl border border-border bg-card p-6">
        <pre className="overflow-auto text-sm text-card-foreground max-h-[600px]">
          {JSON.stringify(dbData[activeTab] || [], null, 2)}
        </pre>
      </div>

      {/* Architecture Info */}
      <div className="rounded-xl border border-accent bg-accent/5 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">🏗️ Database Architecture</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><strong>Current (Demo):</strong> localStorage - Browser-based key-value storage</p>
          <p><strong>Production:</strong> PostgreSQL via Supabase</p>
          <p><strong>Tables:</strong> users, items, requests, donations, impact_stats</p>
          <p><strong>Features:</strong> Row Level Security, Real-time subscriptions, Auto-scaling</p>
          <p><strong>API:</strong> RESTful endpoints via Edge Functions (Serverless)</p>
        </div>
      </div>
    </div>
  );
}
