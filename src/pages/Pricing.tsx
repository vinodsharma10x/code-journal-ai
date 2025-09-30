import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, BookOpen, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gradient">DevJournal</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="hero" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. Start free, upgrade when you're ready.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <Card className="p-8 glass hover:shadow-xl transition-smooth">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">Perfect for getting started</p>
              </div>

              <Link to="/auth" className="block mb-6">
                <Button variant="outline" className="w-full" size="lg">
                  Get Started Free
                </Button>
              </Link>

              <div className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pro Tier */}
            <Card className="p-8 relative overflow-hidden border-2 border-primary shadow-[0_0_30px_hsl(265,70%,60%/0.3)]">
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 text-xs font-semibold rounded-full gradient-primary text-white">
                  POPULAR
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-5xl font-bold text-gradient">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">For serious developers</p>
              </div>

              <Link to="/auth" className="block mb-6">
                <Button variant="hero" className="w-full" size="lg">
                  Start Pro Trial
                </Button>
              </Link>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-primary mb-4">Everything in Free, plus:</p>
                {proFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-6 glass">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </div>
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

const freeFeatures = [
  "Up to 50 journal entries",
  "Basic categories and tags",
  "Mobile responsive design",
  "Export to markdown",
  "7-day data retention"
];

const proFeatures = [
  "Unlimited journal entries",
  "AI-powered summaries",
  "Advanced analytics dashboard",
  "Resume import",
  "Priority support",
  "Custom categories",
  "Lifetime data retention",
  "API access"
];

const faqs = [
  {
    question: "Can I upgrade or downgrade anytime?",
    answer: "Yes! You can change your plan at any time. If you upgrade, you'll be charged a prorated amount. If you downgrade, the change will take effect at the end of your current billing cycle."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal."
  },
  {
    question: "Is there a free trial for Pro?",
    answer: "Yes! Pro comes with a 14-day free trial. No credit card required to start."
  },
  {
    question: "What happens to my data if I cancel?",
    answer: "Your data is always yours. You can export all your entries before canceling, and we keep your data for 30 days in case you change your mind."
  }
];

export default Pricing;
