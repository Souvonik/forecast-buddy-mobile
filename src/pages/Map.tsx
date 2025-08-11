import { useMemo } from "react";
import { Seo } from "@/components/seo/Seo";
import { Card } from "@/components/ui/card";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";
import { cityData } from "@/data/cities";

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
  const navigate = useNavigate();

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
                    navigate(`/forecast?city=${encodeURIComponent(c.name)}`);
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

      
    </div>
  );
}
