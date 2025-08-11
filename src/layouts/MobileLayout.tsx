import { Outlet } from "react-router-dom";
import BottomTabBar from "@/components/navigation/BottomTabBar";

export default function MobileLayout() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <main className="container px-4 py-4">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
