import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, BookOpen, Zap, Shield, TrendingUp, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gradient">DevJournal</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-smooth">
              Pricing
            </Link>
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 gradient-subtle opacity-50" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-medium text-primary">The Professional Journal for Developers</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Document Your
            <span className="text-gradient"> Development Journey</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Track your projects, reflect on your code, and grow as a developer. 
            AI-powered insights help you learn from every line you write.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Start Journaling Free <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Grow</h2>
            <p className="text-xl text-muted-foreground">Powerful features designed for developers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 glass hover:shadow-lg transition-smooth">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Developers</h2>
            <p className="text-xl text-muted-foreground">See what our community has to say</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 glass">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-primary" />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="p-12 text-center gradient-hero relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of developers documenting their growth
              </p>
              <Link to="/auth">
                <Button variant="accent" size="lg">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 DevJournal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    icon: BookOpen,
    title: "Smart Journal Entries",
    description: "Create detailed entries with categories, tags, and markdown support."
  },
  {
    icon: Zap,
    title: "AI-Powered Insights",
    description: "Get intelligent summaries and insights from your journal entries."
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Visualize your growth with beautiful charts and statistics."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and kept completely private."
  },
  {
    icon: Users,
    title: "Resume Import",
    description: "Import your professional experience to jumpstart your journal."
  },
  {
    icon: Check,
    title: "Easy to Use",
    description: "Intuitive interface designed specifically for developers."
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Developer",
    content: "DevJournal has transformed how I reflect on my coding journey. The AI insights are incredibly helpful!"
  },
  {
    name: "Marcus Rodriguez",
    role: "Full Stack Engineer",
    content: "I love how easy it is to track my progress. The statistics view is amazing for interviews."
  },
  {
    name: "Emily Taylor",
    role: "Tech Lead",
    content: "This is the tool I wish I had when I started my career. Essential for any developer."
  }
];

export default Homepage;
