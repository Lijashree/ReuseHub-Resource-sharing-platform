import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Users, Package, Leaf } from "lucide-react";
import { api } from "../../utils/api";

const monthlyData = [
  { month: "Jan", items: 45, users: 120 },
  { month: "Feb", items: 62, users: 185 },
  { month: "Mar", items: 78, users: 243 },
  { month: "Apr", items: 91, users: 298 },
  { month: "May", items: 105, users: 356 },
  { month: "Jun", items: 128, users: 421 },
];

const wasteData = [
  { category: "Books", kg: 120 },
  { category: "Electronics", kg: 85 },
  { category: "Furniture", kg: 340 },
  { category: "Clothing", kg: 95 },
  { category: "Other", kg: 65 },
];

export function ImpactPage() {
  const [stats, setStats] = useState({
    totalItems: 0,
    studentsHelped: 0,
    wasteReduced: 0,
    co2Saved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImpact();
  }, []);

  const loadImpact = async () => {
    try {
      const data = await api.impact.getStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load impact stats");
      // Use default values on error
    } finally {
      setLoading(false);
    }
  };

  const impactStats = [
    {
      label: "Items Reused",
      value: stats.totalItems.toString(),
      change: "+18%",
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Students Helped",
      value: stats.studentsHelped.toString(),
      change: "+24%",
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      label: "Waste Saved",
      value: `${stats.wasteReduced} kg`,
      change: "+15%",
      icon: Leaf,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "CO₂ Reduced",
      value: `${stats.co2Saved} kg`,
      change: "+19%",
      icon: TrendingUp,
      color: "text-[#52b788]",
      bgColor: "bg-[#52b788]/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading impact data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl text-foreground">Impact Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Track your environmental impact and community contribution
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {impactStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-3xl text-card-foreground">{stat.value}</p>
                  <p className="mt-2 text-sm text-primary">{stat.change} this month</p>
                </div>
                <div className={`rounded-lg p-3 ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <h2 className="mb-6 text-xl text-card-foreground">Monthly Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="items"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                name="Items"
              />
              <Line
                type="monotone"
                dataKey="users"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                name="Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Waste Reduction by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <h2 className="mb-6 text-xl text-card-foreground">Waste Reduction by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={wasteData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="kg" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Environmental Impact Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5 p-8"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Leaf className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl text-foreground">Your Environmental Contribution</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              By participating in ReuseHub, you've helped reduce campus waste equivalent to:
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-card p-4">
                <p className="text-2xl text-primary">🌳</p>
                <p className="mt-2 text-xl text-card-foreground">12 Trees</p>
                <p className="text-sm text-muted-foreground">Worth of CO₂ absorbed</p>
              </div>
              <div className="rounded-lg bg-card p-4">
                <p className="text-2xl text-primary">💧</p>
                <p className="mt-2 text-xl text-card-foreground">850 L</p>
                <p className="text-sm text-muted-foreground">Water conserved</p>
              </div>
              <div className="rounded-lg bg-card p-4">
                <p className="text-2xl text-primary">⚡</p>
                <p className="mt-2 text-xl text-card-foreground">340 kWh</p>
                <p className="text-sm text-muted-foreground">Energy saved</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
