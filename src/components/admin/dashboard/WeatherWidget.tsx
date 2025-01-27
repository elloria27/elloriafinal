import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, CloudSnow, Wind } from "lucide-react";

export const WeatherWidget = () => {
  // Get current hour to determine time of day
  const hour = new Date().getHours();
  const season = getSeason(new Date());
  
  // Simple weather simulation based on time and season
  const { condition, temperature } = simulateWeather(hour, season);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {getWeatherIcon(condition)}
            <div className="text-4xl font-bold">{temperature}°C</div>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              <span>Light breeze</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function getSeason(date: Date): 'spring' | 'summer' | 'autumn' | 'winter' {
  const month = date.getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
}

function simulateWeather(hour: number, season: string) {
  // Base temperature ranges for each season
  const tempRanges = {
    spring: { min: 10, max: 20 },
    summer: { min: 20, max: 30 },
    autumn: { min: 5, max: 15 },
    winter: { min: -5, max: 5 }
  };

  // Get temperature range for current season
  const range = tempRanges[season as keyof typeof tempRanges];
  
  // Simulate temperature based on time of day
  let tempModifier = 0;
  if (hour >= 12 && hour <= 15) tempModifier = 5; // Warmest part of day
  if (hour >= 0 && hour <= 5) tempModifier = -3; // Coldest part of day
  
  const temperature = Math.round(
    range.min + (Math.random() * (range.max - range.min)) + tempModifier
  );

  // Determine weather condition based on temperature and time
  let condition = 'clear';
  if (hour >= 6 && hour <= 18) {
    if (temperature < 0) condition = 'snow';
    else if (Math.random() > 0.7) condition = 'rain';
    else if (Math.random() > 0.5) condition = 'cloudy';
    else condition = 'clear';
  } else {
    if (temperature < 0) condition = 'snow';
    else if (Math.random() > 0.8) condition = 'rain';
    else condition = 'clear';
  }

  return { condition, temperature };
}

function getWeatherIcon(condition: string) {
  switch (condition) {
    case 'clear':
      return <Sun className="h-8 w-8 text-yellow-500" />;
    case 'cloudy':
      return <Cloud className="h-8 w-8 text-gray-500" />;
    case 'rain':
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    case 'snow':
      return <CloudSnow className="h-8 w-8 text-blue-300" />;
    default:
      return <Sun className="h-8 w-8 text-yellow-500" />;
  }
}