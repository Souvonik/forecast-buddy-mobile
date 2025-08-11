import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Seo } from "@/components/seo/Seo";

const dayData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  actual: Math.round(40 + Math.sin(i / 3) * 10 + (i > 18 ? 8 : 0)),
  forecast: Math.round(42 + Math.sin(i / 3 + 0.3) * 10 + (i > 18 ? 6 : 0)),
}));

export default function Forecast() {
  return (
    <div className="space-y-4">
      <Seo title="Forecast • AI Load Forecasting" description="Interactive AI load forecasting chart with mobile-first experience." />
      <h1 className="sr-only">Load Forecast</h1>
      <Card className="elevated-card">
        <CardHeader>
          <CardTitle>Load Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="day" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dayData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="forecast" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="hero">Export</Button>
            <Button variant="outline">Compare</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
