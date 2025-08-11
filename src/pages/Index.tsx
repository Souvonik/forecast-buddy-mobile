import { Button } from "@/components/ui/button";
import { Seo } from "@/components/seo/Seo";
import { Link } from "react-router-dom";
import PointerGradient from "@/components/graphics/PointerGradient";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background hero-gradient relative overflow-hidden">
      <Seo title="AI Load Forecasting" description="Mobile-first AI load forecasting with an elegant, neon-accented design." />
      {/* Signature pointer gradient effect */}
      <PointerGradient />
      <div className="text-center max-w-xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">AI Load Forecasting</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Predict demand with interactive charts and upload your own datasets.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/forecast">
            <Button variant="hero" className="px-6">Get Started</Button>
          </Link>
          <Link to="/about">
            <Button variant="outline" className="px-6">Learn More</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
