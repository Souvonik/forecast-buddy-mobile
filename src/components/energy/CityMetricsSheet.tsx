import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useMemo, useState } from "react";

export type CityMetrics = {
  name: string;
  state?: string;
  loadDemandKWh: number; // current avg load demand
  energyPricePerKWh: number; // local avg electricity price
  avgSunHours?: number; // default 4.5
  solarInsolation?: number; // kWh/m²/day
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  city: CityMetrics | null;
};

export default function CityMetricsSheet({ open, onOpenChange, city }: Props) {
  const [capacity, setCapacity] = useState<number>(4);

  // Recalculate when city or capacity changes
  const { generation, savings } = useMemo(() => {
    if (!city) return { generation: 0, savings: 0 };
    // More realistic calculation
    const panelEfficiency = 0.2; // 20% efficiency
    const panelArea = 1.6; // m² per kW
    const insolation = city.solarInsolation ?? 4.5; // kWh/m²/day
    const gen = capacity * insolation * panelEfficiency * panelArea; // kWh/day
    const save = gen * city.energyPricePerKWh;
    return { generation: gen, savings: save };
  }, [city, capacity]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[92vw] sm:w-[420px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{city ? `${city.name} Data` : "City Data"}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-5">
          {city ? (
            <>
              <section>
                <h3 className="text-sm font-medium text-muted-foreground">Energy Metrics</h3>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <Metric label="Load Demand" value={`${city.loadDemandKWh.toFixed(2)} kWh`} accent />
                  <Metric label="Energy Price" value={`₹${city.energyPricePerKWh.toFixed(2)}/kWh`} />
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-sm font-medium text-muted-foreground">Renewable Energy</h3>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Solar Panel Capacity</span>
                    <span>{capacity} kW</span>
                  </div>
                  <Slider
                    value={[capacity]}
                    min={1}
                    max={8}
                    step={1}
                    onValueChange={(v) => setCapacity(v[0] ?? 4)}
                  />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Metric label="Est. Daily Generation" value={`${generation.toFixed(1)} kWh`} accent />
                  <Metric label="Est. Daily Savings" value={`₹${savings.toFixed(2)}`} positive />
                </div>
              </section>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Tap a city pin to view energy metrics.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
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
