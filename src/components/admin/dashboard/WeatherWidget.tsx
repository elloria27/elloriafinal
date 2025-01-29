import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";

interface WeatherData {
  temp: number;
  condition: string;
  windSpeed: number;
  city: string;
  forecast: Array<{
    date: string;
    temp: number;
    condition: string;
  }>;
}

export const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        console.log('Fetching weather data for coordinates:', { latitude, longitude });
        
        // Get weather data from OpenMeteo
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,weather_code&timezone=auto`;
        console.log('Weather URL:', weatherUrl);
        
        const weatherResponse = await fetch(weatherUrl);
        if (!weatherResponse.ok) {
          throw new Error(`Weather API error: ${weatherResponse.statusText}`);
        }
        const weatherData = await weatherResponse.json();
        console.log('Weather data:', weatherData);

        // Get city name using reverse geocoding
        const geocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        const geocodeResponse = await fetch(geocodeUrl);
        let city = "Unknown location";
        
        if (geocodeResponse.ok) {
          const geocodeData = await geocodeResponse.json();
          city = geocodeData.city || geocodeData.locality || geocodeData.principalSubdivision || "Unknown location";
          console.log('Location data:', geocodeData);
        }

        // Convert weather code to condition format
        const getCondition = (code: number) => {
          if (code >= 71 && code <= 77) return 'snow';
          if (code >= 61 && code <= 67) return 'rain';
          if (code >= 51 && code <= 57) return 'rain';
          if (code >= 1 && code <= 3) return 'cloudy';
          return 'clear';
        };

        const currentCondition = getCondition(weatherData.current.weather_code);
        
        // Format the data
        setWeather({
          temp: Math.round(weatherData.current.temperature_2m),
          condition: currentCondition,
          windSpeed: Math.round(weatherData.current.wind_speed_10m || 0),
          city: city,
          forecast: weatherData.daily.time.slice(0, 5).map((date: string, index: number) => ({
            date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            temp: Math.round(weatherData.daily.temperature_2m_max[index]),
            condition: getCondition(weatherData.daily.weather_code[index])
          }))
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching weather:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error loading weather data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    const handleGeolocationError = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      let errorMessage = 'Could not get your location. ';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += 'Please enable location access in your browser settings.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage += 'Location information is unavailable.';
          break;
        case error.TIMEOUT:
          errorMessage += 'Location request timed out.';
          break;
        default:
          errorMessage += 'An unknown error occurred.';
      }
      
      toast.error(errorMessage);
      // Use IP-based geolocation as fallback
      fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
          console.log('IP geolocation data:', data);
          if (data.latitude && data.longitude) {
            fetchWeather(data.latitude, data.longitude);
          } else {
            throw new Error('Could not determine location from IP');
          }
        })
        .catch(err => {
          console.error('IP geolocation failed:', err);
          // Final fallback to a default location
          fetchWeather(50.4501, 30.5234); // Kyiv coordinates as default
        });
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Got user location:', position.coords);
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        handleGeolocationError,
        { 
          timeout: 10000,
          enableHighAccuracy: true,
          maximumAge: 0
        }
      );
    } else {
      console.warn('Geolocation not supported');
      toast.error('Geolocation is not supported by your browser.');
      // Use IP-based geolocation for browsers without geolocation support
      fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
          if (data.latitude && data.longitude) {
            fetchWeather(data.latitude, data.longitude);
          } else {
            throw new Error('Could not determine location from IP');
          }
        })
        .catch(err => {
          console.error('IP geolocation failed:', err);
          fetchWeather(50.4501, 30.5234); // Kyiv coordinates as default
        });
    }
  }, []);

  const getWeatherIcon = (condition: string) => {
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
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weather.condition)}
              <div className="text-4xl font-bold">{weather.temp}°C</div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{weather.city}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4" />
                <span>Wind {weather.windSpeed} m/s</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-5 gap-2 pt-4 border-t">
            {weather.forecast.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-sm text-muted-foreground">{day.date}</div>
                {getWeatherIcon(day.condition)}
                <div className="text-sm font-medium">{day.temp}°C</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};