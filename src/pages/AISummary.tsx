import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, TrendingUp, Award, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const AISummary = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setSummary(mockSummary);
      setIsGenerating(false);
      toast.success("Summary generated successfully!");
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-gradient">AI Summary</h1>
        <p className="text-muted-foreground mt-2">
          Get intelligent insights and summaries from your journal entries
        </p>
      </div>

      <Card className="p-8 glass text-center">
        <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Generate AI Summary</h2>
        <p className="text-muted-foreground mb-6">
          Our AI will analyze your journal entries and provide insights on your growth,
          patterns, and achievements.
        </p>
        <Button
          variant="hero"
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate Summary"}
        </Button>
      </Card>

      {summary && (
        <div className="space-y-6 animate-fade-in">
          {/* Overview */}
          <Card className="p-6 glass">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Overview
            </h3>
            <p className="text-muted-foreground leading-relaxed">{summary.overview}</p>
          </Card>

          {/* Key Insights */}
          <Card className="p-6 glass">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Key Insights
            </h3>
            <div className="space-y-3">
              {summary.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">{index + 1}</span>
                  </div>
                  <p className="text-muted-foreground">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6 glass">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Recent Achievements
            </h3>
            <div className="space-y-3">
              {summary.achievements.map((achievement: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <Award className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                  <p>{achievement}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Technology Focus */}
          <Card className="p-6 glass">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Technology Focus
            </h3>
            <div className="flex flex-wrap gap-2">
              {summary.technologies.map((tech: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {tech}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6 glass border-2 border-primary/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommendations
            </h3>
            <div className="space-y-3">
              {summary.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                  <p className="text-muted-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

const mockSummary = {
  overview: "Over the past month, you've shown remarkable growth in full-stack development, with a strong focus on React and state management. Your entries demonstrate consistent learning and practical application of new technologies. You've tackled 4 significant challenges and achieved 3 major milestones.",
  insights: [
    "Your learning pace has increased by 40% compared to last month, with more frequent entries about new technologies.",
    "You're spending more time on code quality and best practices, indicating professional maturity.",
    "Your entries show a shift from individual work to more collaborative problem-solving.",
    "Performance optimization has become a recurring theme in your recent entries."
  ],
  achievements: [
    "Successfully migrated state management to Redux Toolkit with full TypeScript support",
    "Reduced application load time by 40% through optimization techniques",
    "Led code review sessions that improved team code quality standards"
  ],
  technologies: [
    "React", "TypeScript", "Redux Toolkit", "React Query", "WebSocket",
    "Performance Optimization", "Code Splitting", "Lazy Loading"
  ],
  recommendations: [
    "Consider documenting your debugging process more systematically to build a personal knowledge base.",
    "Your entries show expertise in React - consider sharing your knowledge through blog posts or mentoring.",
    "Explore testing strategies more deeply to complement your focus on code quality.",
    "Set specific goals for the next month to maintain your impressive momentum."
  ]
};

export default AISummary;
