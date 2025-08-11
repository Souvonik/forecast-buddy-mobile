import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Seo } from "@/components/seo/Seo";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { findCityByName } from "@/data/cities";

const dayData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  actual: Math.round(40 + Math.sin(i / 3) * 10 + (i > 18 ? 8 : 0)),
  forecast: Math.round(42 + Math.sin(i / 3 + 0.3) * 10 + (i > 18 ? 6 : 0)),
}));

export default function Forecast() {
  const [searchParams] = useSearchParams();
  const cityName = searchParams.get("city") || "";
  const city = useMemo(() => (cityName ? findCityByName(cityName) : null), [cityName]);

  const [capacity, setCapacity] = useState<number>(4);
  const sun = city?.avgSunHours ?? 4.5;
  const generation = city ? capacity * sun : 0;
  const savings = city ? generation * city.energyPricePerKWh : 0;

  return (
    <div className="space-y-4">
      <Seo title="Metrics • AI Load Forecasting" description="City energy metrics and interactive AI load forecasting chart." />
      <h1 className="sr-only">City Metrics</h1>

      {city ? (
        <Card className="elevated-card">
          <CardHeader>
            <CardTitle>{city.name} Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <section>
              <h3 className="text-sm font-medium text-muted-foreground">Energy Metrics</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Load Demand" value={`${city.loadDemandKWh.toFixed(2)} kWh`} accent />
                <Metric label="Energy Price" value={`₹${city.energyPricePerKWh.toFixed(2)}/kWh`} />
              </div>
            </section>

            <Separator className="my-4" />

            <section>
              <h3 className="text-sm font-medium text-muted-foreground">Renewable Energy</h3>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>Solar Panel Capacity</span>
                  <span>{capacity} kW</span>
                </div>
                <Slider value={[capacity]} min={1} max={8} step={1} onValueChange={(v) => setCapacity(v[0] ?? 4)} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Est. Daily Generation" value={`${generation.toFixed(1)} kWh`} accent />
                <Metric label="Est. Daily Savings" value={`₹${savings.toFixed(2)}`} positive />
              </div>
            </section>
          </CardContent>
        </Card>
      ) : (
        <Card className="elevated-card">
          <CardHeader>
            <CardTitle>Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Select a city on the map to see metrics here.</p>
          </CardContent>
        </Card>
      )}

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

function Metric({ label, value, accent, positive }: { label: string; value: string; accent?: boolean; positive?: boolean }) {
  return (
    <div className="p-3 rounded-lg border bg-card/60">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`mt-1 text-base font-semibold ${accent ? "text-primary" : positive ? "text-green-600 dark:text-green-400" : ""}`}>{value}</div>
    </div>
  );
}
