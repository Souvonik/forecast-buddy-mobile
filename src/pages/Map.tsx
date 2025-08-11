import { useMemo, useState } from "react";
import { Seo } from "@/components/seo/Seo";
import CityMetricsSheet, { CityMetrics } from "@/components/energy/CityMetricsSheet";
import { Card } from "@/components/ui/card";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// Basic dataset of Indian cities with rough sample metrics (for demo purposes)
const cityData: (CityMetrics & { position: LatLngExpression })[] = [
  { name: "Delhi", loadDemandKWh: 16.2, energyPricePerKWh: 7.85, position: [28.6139, 77.209], avgSunHours: 5 },
  { name: "Mumbai", loadDemandKWh: 18.4, energyPricePerKWh: 8.20, position: [19.076, 72.8777], avgSunHours: 4.8 },
  { name: "Bengaluru", loadDemandKWh: 14.9, energyPricePerKWh: 7.10, position: [12.9716, 77.5946], avgSunHours: 5 },
  { name: "Chennai", loadDemandKWh: 17.1, energyPricePerKWh: 8.05, position: [13.0827, 80.2707], avgSunHours: 5.5 },
  { name: "Hyderabad", loadDemandKWh: 15.3, energyPricePerKWh: 7.35, position: [17.385, 78.4867], avgSunHours: 5.2 },
  { name: "Kolkata", loadDemandKWh: 13.8, energyPricePerKWh: 7.00, position: [22.5726, 88.3639], avgSunHours: 4.6 },
  { name: "Ahmedabad", loadDemandKWh: 14.1, energyPricePerKWh: 7.50, position: [23.0225, 72.5714], avgSunHours: 5.8 },
  { name: "Pune", loadDemandKWh: 12.9, energyPricePerKWh: 7.25, position: [18.5204, 73.8567], avgSunHours: 5.1 },
  { name: "Jaipur", loadDemandKWh: 11.8, energyPricePerKWh: 7.15, position: [26.9124, 75.7873], avgSunHours: 5.6 },
  { name: "Lucknow", loadDemandKWh: 12.4, energyPricePerKWh: 7.10, position: [26.8467, 80.9462], avgSunHours: 4.9 },
  { name: "Bhopal", loadDemandKWh: 11.2, energyPricePerKWh: 6.95, position: [23.2599, 77.4126], avgSunHours: 5.3 },
  { name: "Patna", loadDemandKWh: 10.9, energyPricePerKWh: 6.80, position: [25.5941, 85.1376], avgSunHours: 4.7 },
  { name: "Guwahati", loadDemandKWh: 10.7, energyPricePerKWh: 6.60, position: [26.1445, 91.7362], avgSunHours: 4.5 },
  { name: "Chandigarh", loadDemandKWh: 11.6, energyPricePerKWh: 7.00, position: [30.7333, 76.7794], avgSunHours: 5.2 },
  { name: "Kochi", loadDemandKWh: 12.1, energyPricePerKWh: 7.40, position: [9.9312, 76.2673], avgSunHours: 4.8 },
  { name: "Indore", loadDemandKWh: 11.5, energyPricePerKWh: 7.05, position: [22.7196, 75.8577], avgSunHours: 5.4 },
  { name: "Jamshedpur", loadDemandKWh: 15.1, energyPricePerKWh: 7.51, position: [22.8046, 86.2029], avgSunHours: 4.9 },
];

function MapAutoFit({ bounds }: { bounds: LatLngExpression[] }) {
  const map = useMap();
  useMemo(() => {
    if (bounds.length) {
      map.fitBounds(bounds as any, { padding: [30, 30] });
    }
  }, [map, bounds]);
  return null;
}

export default function MapPage() {
  const [selected, setSelected] = useState<CityMetrics | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const positions = useMemo(() => cityData.map((c) => c.position), []);

  return (
    <div className="space-y-3">
      <Seo title="India Energy Map • Load Forecaster" description="Interactive map of Indian cities with load demand, energy price, and solar savings estimates." />
      <h1 className="sr-only">India Energy Map</h1>
      <Card className="overflow-hidden elevated-card">
        <div className="relative">
          <MapContainer
            className="h-[60vh] sm:h-[70vh] w-full"
            center={[22.9734, 78.6569]}
            zoom={5}
            minZoom={4}
            maxZoom={12}
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapAutoFit bounds={positions as any} />
            {cityData.map((c) => (
              <CircleMarker
                key={c.name}
                center={c.position}
                radius={8}
                pathOptions={{ color: "hsl(var(--primary))", fillColor: "hsl(var(--primary))", fillOpacity: 0.85 }}
                eventHandlers={{
                  click: () => {
                    setSelected({ name: c.name, loadDemandKWh: c.loadDemandKWh, energyPricePerKWh: c.energyPricePerKWh, avgSunHours: c.avgSunHours });
                    setSheetOpen(true);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -4]} opacity={1} permanent={false}>
                  <span className="text-xs font-medium">{c.name}</span>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </Card>

      <CityMetricsSheet open={sheetOpen} onOpenChange={setSheetOpen} city={selected} />
    </div>
  );
}
