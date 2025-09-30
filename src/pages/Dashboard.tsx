import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, BookOpen, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's your progress overview.</p>
        </div>
        <Link to="/entries">
          <Button variant="hero" size="lg">
            <Plus className="mr-2 h-4 w-4" /> New Entry
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6 glass hover:shadow-lg transition-smooth">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-primary mt-1">{stat.change}</p>
              </div>
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-6 glass">
        <h2 className="text-2xl font-bold mb-6">Entry Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="entries"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Entries */}
      <Card className="p-6 glass">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Entries</h2>
          <Link to="/entries">
            <Button variant="ghost" size="sm">View All</Button>
          </Link>
        </div>
        <div className="space-y-4">
          {recentEntries.map((entry, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth"
            >
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{entry.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{entry.excerpt}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {entry.date}
                  </span>
                  <span className="px-2 py-1 rounded bg-primary/10 text-primary">{entry.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

const stats = [
  { label: "Total Entries", value: "47", change: "+5 this week", icon: BookOpen },
  { label: "Current Streak", value: "12", change: "days", icon: TrendingUp },
  { label: "Categories", value: "8", change: "active", icon: Award },
  { label: "This Month", value: "15", change: "+3 from last", icon: Calendar },
];

const chartData = [
  { name: "Mon", entries: 4 },
  { name: "Tue", entries: 7 },
  { name: "Wed", entries: 5 },
  { name: "Thu", entries: 9 },
  { name: "Fri", entries: 6 },
  { name: "Sat", entries: 3 },
  { name: "Sun", entries: 8 },
];

const recentEntries = [
  {
    title: "Implemented Redux Toolkit",
    excerpt: "Today I migrated our state management from Context API to Redux Toolkit. The type safety improvements are incredible...",
    date: "Today",
    category: "Learning",
  },
  {
    title: "Code Review Insights",
    excerpt: "Had a great code review session with the team. Learned some best practices for handling async operations in React...",
    date: "Yesterday",
    category: "Team",
  },
  {
    title: "Performance Optimization Win",
    excerpt: "Reduced initial load time by 40% by implementing lazy loading and code splitting. Users are going to love this...",
    date: "2 days ago",
    category: "Achievement",
  },
];

export default Dashboard;
