import { BarChart3, Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Visualize your spending patterns with interactive charts and insights.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is encrypted and completely secure.",
  },
  {
    icon: Zap,
    title: "Quick Entry",
    description: "Add expenses in seconds with our streamlined interface.",
  },
  {
    icon: Users,
    title: "Student Focused",
    description: "Built specifically for students' unique financial needs.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Why Choose BojetBuddy?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The smartest way for students to manage their finances and build better spending habits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-3xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-heading font-bold text-foreground mb-4">
                Take Control of Your Finances
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                Join thousands of students who are already managing their money smarter with BojetBuddy. 
                Track expenses, set budgets, and achieve your financial goals.
              </p>
              <ul className="space-y-3">
                {["Free to use", "No credit card required", "Cancel anytime"].map((item) => (
                  <li key={item} className="flex items-center text-foreground">
                    <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-3xl font-heading font-bold text-primary mb-2">
                  5K+
                </div>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-3xl font-heading font-bold text-primary mb-2">
                  $2M+
                </div>
                <p className="text-sm text-muted-foreground">Tracked</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-3xl font-heading font-bold text-primary mb-2">
                  15K+
                </div>
                <p className="text-sm text-muted-foreground">Expenses Logged</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="text-3xl font-heading font-bold text-primary mb-2">
                  4.9★
                </div>
                <p className="text-sm text-muted-foreground">User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
