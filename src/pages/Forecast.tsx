import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Seo } from "@/components/seo/Seo";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { findCityByName } from "@/data/cities";
import { getForecastData } from "@/api/api";

export default function Forecast() {
  const [searchParams] = useSearchParams();
  const cityName = searchParams.get("city") || "";
  const city = useMemo(() => (cityName ? findCityByName(cityName) : null), [cityName]);
  const [forecastData, setForecastData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = (await getForecastData()) as any[];
      setForecastData(data);
    };
    fetchData();
  }, []);

  const cityForecast = useMemo(() => {
    if (!city || !forecastData.length) return [];
    return forecastData.filter((row: any) => row.city?.toLowerCase() === city.name.toLowerCase());
  }, [city, forecastData]);

  const [timeRange, setTimeRange] = useState("day");

  const chartData = useMemo(() => {
    if (!cityForecast.length) return [];

    const now = new Date();

    const dataWithValidDate = cityForecast
      .map((row: any) => ({ ...row, date: new Date(row.date) }))
      .filter((row: any) => !isNaN(row.date.getTime()));

    if (timeRange === "day") {
      return cityForecast
        .map((row: any) => ({
          time: `${row.hour}:00`,
          actual: parseFloat(row.actual),
          forecast: parseFloat(row.forecast),
        }))
        .slice(-24);
    }

    const aggregate = (data: any[], unit: "week" | "month") => {
      const grouped = data.reduce((acc, row) => {
        const key =
          unit === "week"
            ? row.date.toLocaleDateString([], { weekday: "short" })
            : `${row.date.getDate()}`;
        if (!acc[key]) {
          acc[key] = { actuals: [], forecasts: [] };
        }
        acc[key].actuals.push(parseFloat(row.actual));
        acc[key].forecasts.push(parseFloat(row.forecast));
        return acc;
      }, {});

      return Object.entries(grouped).map(([key, value]: [string, any]) => ({
        time: key,
        actual: value.actuals.reduce((a: number, b: number) => a + b, 0) / value.actuals.length,
        forecast: value.forecasts.reduce((a: number, b: number) => a + b, 0) / value.forecasts.length,
      }));
    };

    if (timeRange === "week") {
      const lastWeek = new Date(now.setDate(now.getDate() - 7));
      const weeklyData = dataWithValidDate.filter((row: any) => row.date > lastWeek);
      return aggregate(weeklyData, "week");
    }

    if (timeRange === "month") {
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
      const monthlyData = dataWithValidDate.filter((row: any) => row.date > lastMonth);
      return aggregate(monthlyData, "month");
    }

    return [];
  }, [cityForecast, timeRange]);

  const [capacity, setCapacity] = useState<number>(4);
  const { generation, savings } = useMemo(() => {
    if (!city) return { generation: 0, savings: 0 };
    const panelEfficiency = 0.2; // 20% efficiency
    const panelArea = 1.6; // m² per kW
    const insolation = city.solarInsolation ?? 4.5; // kWh/m²/day
    const gen = capacity * insolation * panelEfficiency * panelArea; // kWh/day
    const save = gen * city.energyPricePerKWh;
    return { generation: gen, savings: save };
  }, [city, capacity]);

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
          <Tabs defaultValue="day" className="w-full" onValueChange={setTimeRange}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
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
