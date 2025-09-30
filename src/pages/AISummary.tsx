import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, TrendingUp, Award, Target, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Summary {
  overview: string;
  insights: string[];
  achievements: string[];
  technologies: string[];
  recommendations: string[];
}

const AISummary = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setSummary(null);

    try {
      console.log("Calling generate-summary function...");
      
      const { data, error } = await supabase.functions.invoke("generate-summary");

      if (error) {
        console.error("Function error:", error);
        throw error;
      }

      console.log("Summary response:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      setSummary(data);
      toast.success("Summary generated successfully!");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to generate summary");
    } finally {
      setIsGenerating(false);
    }
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
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Generating...
            </>
          ) : (
            "Generate Summary"
          )}
        </Button>
        
        {isGenerating && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">
              Analyzing your entries with AI... This may take a few moments.
            </p>
          </div>
        )}
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
              {summary.insights.map((insight, index) => (
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
          {summary.achievements.length > 0 && (
            <Card className="p-6 glass">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Recent Achievements
              </h3>
              <div className="space-y-3">
                {summary.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <Award className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <p>{achievement}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Technology Focus */}
          {summary.technologies.length > 0 && (
            <Card className="p-6 glass">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Technology Focus
              </h3>
              <div className="flex flex-wrap gap-2">
                {summary.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="p-6 glass border-2 border-primary/20">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Recommendations
            </h3>
            <div className="space-y-3">
              {summary.recommendations.map((rec, index) => (
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

export default AISummary;
