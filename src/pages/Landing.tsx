import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AdvancedHeatmap } from "@/components/AdvancedHeatmap";

export default function Landing() {

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🇮🇳 India Disaster Management</h1>
          <nav className="flex gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">Heatmap</Button>
            </Link>
            <Link to="/nearby">
              <Button variant="ghost" size="sm">Emergency Services</Button>
            </Link>
            <Link to="/alerts">
              <Button variant="ghost" size="sm">Alerts</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <Link to="/copilot">
              <Button variant="ghost" size="sm">AI Copilot</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative h-[calc(100vh-80px)]">
        <AdvancedHeatmap />
      </div>
    </div>
  );
}
