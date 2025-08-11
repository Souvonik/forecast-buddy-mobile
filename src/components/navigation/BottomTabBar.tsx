import { NavLink } from "react-router-dom";
import { LineChart, Upload, Info } from "lucide-react";

const tabs = [
  { to: "/forecast", label: "Forecast", Icon: LineChart },
  { to: "/upload", label: "Upload", Icon: Upload },
  { to: "/about", label: "About", Icon: Info },
];

export default function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <ul className="flex items-center justify-around py-2">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-1 text-xs transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
