import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeatherWidget } from "@/components/admin/dashboard/WeatherWidget";
import { AnalyticsWidget } from "@/components/admin/dashboard/AnalyticsWidget";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeatherWidget />
        <AnalyticsWidget />
      </div>
    </div>
  );
};

export default Dashboard;