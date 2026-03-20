import AdminPanelLayout from "@/components/AdminPanelLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const orderVolumeData = [
  { month: "Sep", orders: 145 }, { month: "Oct", orders: 178 }, { month: "Nov", orders: 162 },
  { month: "Dec", orders: 205 }, { month: "Jan", orders: 189 }, { month: "Feb", orders: 223 }, { month: "Mar", orders: 248 },
];

const statusBreakdown = [
  { name: "Delivered", value: 842, color: "hsl(152, 60%, 42%)" },
  { name: "Processing", value: 45, color: "hsl(205, 80%, 55%)" },
  { name: "Pending", value: 28, color: "hsl(38, 92%, 50%)" },
  { name: "Cancelled", value: 33, color: "hsl(0, 72%, 55%)" },
];

const deliveryTimeData = [
  { day: "Mon", avgMin: 42 }, { day: "Tue", avgMin: 38 }, { day: "Wed", avgMin: 45 },
  { day: "Thu", avgMin: 35 }, { day: "Fri", avgMin: 40 }, { day: "Sat", avgMin: 52 }, { day: "Sun", avgMin: 48 },
];

const PanelAnalyticsPage = () => {
  return (
    <AdminPanelLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">Analytics & Reports</h1>
        <p className="text-sm text-muted-foreground">Business metrics and performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Order Volume */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Monthly Order Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={orderVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-bold text-foreground mb-4">Order Status Breakdown</h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" cx="50%" cy="50%" outerRadius={80} innerRadius={50}>
                  {statusBreakdown.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {statusBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="text-sm font-bold text-foreground ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Time */}
      <div className="bg-card rounded-xl border border-border p-5">
        <h3 className="font-bold text-foreground mb-4">Average Delivery Time (minutes)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={deliveryTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Line type="monotone" dataKey="avgMin" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </AdminPanelLayout>
  );
};

export default PanelAnalyticsPage;
