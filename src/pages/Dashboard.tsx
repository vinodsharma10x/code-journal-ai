import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, BookOpen, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  created_at: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntries: 0,
    thisWeek: 0,
    thisMonth: 0,
    categories: 0,
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      setEntries(data || []);
      calculateStats(data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (allEntries: JournalEntry[]) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeekCount = allEntries.filter(
      e => new Date(e.created_at) >= weekAgo
    ).length;

    const thisMonthCount = allEntries.filter(
      e => new Date(e.created_at) >= monthAgo
    ).length;

    const uniqueCategories = new Set(
      allEntries.filter(e => e.category).map(e => e.category)
    );

    setStats({
      totalEntries: allEntries.length,
      thisWeek: thisWeekCount,
      thisMonth: thisMonthCount,
      categories: uniqueCategories.size,
    });
  };

  // Generate chart data from entries
  const generateChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const count = entries.filter(entry => 
        entry.created_at.startsWith(date)
      ).length;
      
      return {
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        entries: count,
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

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
        <Card className="p-6 glass hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-3xl font-bold mt-2">{stats.totalEntries}</p>
              <p className="text-sm text-primary mt-1">+{stats.thisWeek} this week</p>
            </div>
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-3xl font-bold mt-2">{stats.thisWeek}</p>
              <p className="text-sm text-primary mt-1">entries</p>
            </div>
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-3xl font-bold mt-2">{stats.categories}</p>
              <p className="text-sm text-primary mt-1">active</p>
            </div>
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 glass hover:shadow-lg transition-smooth">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold mt-2">{stats.thisMonth}</p>
              <p className="text-sm text-primary mt-1">entries</p>
            </div>
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6 glass">
        <h2 className="text-2xl font-bold mb-6">Entry Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={generateChartData()}>
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
        {entries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No entries yet. Start documenting your journey!</p>
            <Link to="/entries">
              <Button variant="hero">
                <Plus className="mr-2 h-4 w-4" /> Create Your First Entry
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-smooth"
              >
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                    {entry.category && (
                      <span className="px-2 py-1 rounded bg-primary/10 text-primary">{entry.category}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
