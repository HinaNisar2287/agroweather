
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
type IconProps = {
  size?: number;
  className?: string;
  strokeWidth?: number;
};

function Icon({ name, size = 24, className, strokeWidth = 2 }: IconProps & { name: string }) {
  const paths: Record<string, string> = {
    activity: "M3 12h4l3-9 4 18 3-9h4",
    cloud: "M20 16.2A4.5 4.5 0 0 0 18 7.8 6 6 0 0 0 6.3 9.5 4 4 0 0 0 7 17h12",
    cloudRain: "M20 16.2A4.5 4.5 0 0 0 18 7.8 6 6 0 0 0 6.3 9.5 4 4 0 0 0 7 17h12M8 20l1-2m4 2 1-2m4 2 1-2",
    droplets: "M12 22a7 7 0 0 0 7-7c0-4-7-13-7-13S5 11 5 15a7 7 0 0 0 7 7ZM19 8c1.5 1.7 2 3 2 4",
    leaf: "M20 4c-8 0-14 3-14 10a6 6 0 0 0 6 6c7 0 10-8 8-16ZM4 21c3-6 7-9 12-12",
    loader: "M21 12a9 9 0 1 1-6.2-8.6",
    mapPin: "M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z",
    search: "m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
    sprout: "M12 22V9m0 5c-6 0-9-3-9-9 6 0 9 3 9 9Zm0-3c0-6 3-9 9-9 0 6-3 9-9 9Z",
    sun: "M12 3v2m0 14v2M3 12h2m14 0h2m-2.6-6.4-1.4 1.4M7 17l-1.4 1.4m12.8 0L17 17M7 7 5.6 5.6M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z",
    thermometer: "M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0ZM11 11v6",
    wind: "M3 8h12a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M4 16h7",
    refresh: "M20 7v5h-5M4 17v-5h5m10-2a7 7 0 0 0-12-3L4 12m16 0-3 5a7 7 0 0 1-12-3",
    alert: "M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4m0 4h.01",
  };
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={paths[name]} />
      {name === "mapPin" && <circle cx="12" cy="10" r="2.5" />}
    </svg>
  );
}

const Activity = (props: IconProps) => <Icon name="activity" {...props} />;
const Cloud = (props: IconProps) => <Icon name="cloud" {...props} />;
const CloudRain = (props: IconProps) => <Icon name="cloudRain" {...props} />;
const Droplets = (props: IconProps) => <Icon name="droplets" {...props} />;
const Leaf = (props: IconProps) => <Icon name="leaf" {...props} />;
const LoaderCircle = (props: IconProps) => <Icon name="loader" {...props} />;
const MapPin = (props: IconProps) => <Icon name="mapPin" {...props} />;
const Search = (props: IconProps) => <Icon name="search" {...props} />;
const Sprout = (props: IconProps) => <Icon name="sprout" {...props} />;
const Sun = (props: IconProps) => <Icon name="sun" {...props} />;
const Thermometer = (props: IconProps) => <Icon name="thermometer" {...props} />;
const Wind = (props: IconProps) => <Icon name="wind" {...props} />;
const RefreshCw = (props: IconProps) => <Icon name="refresh" {...props} />;
const AlertTriangle = (props: IconProps) => <Icon name="alert" {...props} />;

type Place = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
};

type WeatherData = {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    uv_index_max: number[];
    sunrise: string[];
    sunset: string[];
  };
};

const crops = [
  "Wheat", "Rice", "Maize", "Cotton",
  "Sugarcane", "Tomato", "Potato", "Other",
];

function weatherDescription(code: number) {
  if (code === 0) return "Clear sky";
  if ([1, 2].includes(code)) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Weather conditions";
}

function weatherIcon(code: number) {
  if ([0, 1, 2].includes(code)) return Sun;
  if ([61, 63, 65, 80, 81, 82, 95, 96, 99].includes(code)) {
    return CloudRain;
  }
  return Cloud;
}

function formatDay(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en", {
    weekday: "short",
  });
}

function getAdvice(weather: WeatherData, crop: string, stage: string) {
  const current = weather.current;
  const maxTemp =
    weather.daily.temperature_2m_max[0] ?? current.temperature_2m;
  const rainChance = Math.max(
    0,
    ...weather.hourly.precipitation_probability.slice(0, 12)
  );
  const tomorrowRain = weather.daily.precipitation_sum[1] ?? 0;

  const advice: { title: string; detail: string }[] = [];

  if (tomorrowRain >= 5 || rainChance >= 60) {
    advice.push({
      title: "Rainfall alert",
      detail:
        "Rain is possible. Check soil moisture before irrigation and keep field drainage clear.",
    });
  } else if (current.relative_humidity_2m < 35 && maxTemp >= 30) {
    advice.push({
      title: "Dry and warm conditions",
      detail:
        "Check root-zone soil moisture. Irrigation needs depend on soil type, crop stage and recent rainfall.",
    });
  } else {
    advice.push({
      title: "Soil moisture",
      detail:
        "Check soil moisture and recent rainfall before deciding whether irrigation is needed.",
    });
  }

  if (maxTemp >= 35) {
    advice.push({
      title: "High temperature",
      detail:
        "Monitor crops for heat stress, wilting and dry soil, especially during sensitive growth stages.",
    });
  }

  if (current.wind_speed_10m >= 25) {
    advice.push({
      title: "Wind alert",
      detail:
        "Avoid spraying during strong winds and inspect plants for possible wind damage.",
    });
  }

  advice.push({
    title: `${crop} — ${stage}`,
    detail:
      "Inspect plants for pests, disease symptoms and nutrient stress. Adjust management to crop growth and local field conditions.",
  });

  return advice;
}

export default function Home() {
  const [cityInput, setCityInput] = useState("Sargodha");
  const [place, setPlace] = useState<Place | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [crop, setCrop] = useState("Wheat");
  const [stage, setStage] = useState("Vegetative growth");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const loadWeather = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setSearching(true);
    setLoading(true);
    setError("");

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query.trim()
        )}&count=1&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error("Could not connect to the location service.");
      }

      const geoData = await geoResponse.json();
      const result = geoData.results?.[0];

      if (!result) {
        throw new Error("City not found. Please try another name.");
      }

      const selectedPlace: Place = {
        name: result.name,
        country: result.country,
        latitude: result.latitude,
        longitude: result.longitude,
      };

      const params = new URLSearchParams({
        latitude: String(selectedPlace.latitude),
        longitude: String(selectedPlace.longitude),
        current:
          "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
        hourly:
          "temperature_2m,precipitation_probability,precipitation",
        daily:
          "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,uv_index_max,sunrise,sunset",
        timezone: "auto",
        forecast_days: "7",
      });

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params.toString()}`
      );

      if (!weatherResponse.ok) {
        throw new Error("Could not retrieve weather data.");
      }

      const data: WeatherData = await weatherResponse.json();

      if (!data.current || !data.daily?.time?.length) {
        throw new Error("Weather data is incomplete.");
      }

      setPlace(selectedPlace);
      setWeather(data);
      setCityInput(selectedPlace.name);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setWeather(null);
      setPlace(null);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    void loadWeather("Sargodha");
  }, [loadWeather]);

  const hourlyData = useMemo(() => {
    if (!weather) return [];

    const currentHour = weather.current.time.slice(0, 13);
    let start = weather.hourly.time.findIndex(
      (time) => time.slice(0, 13) >= currentHour
    );

    if (start < 0) start = 0;

    return weather.hourly.time.slice(start, start + 24).map((time, index) => ({
      time: time.slice(11, 16),
      temperature: weather.hourly.temperature_2m[start + index],
      rain: weather.hourly.precipitation_probability[start + index],
    }));
  }, [weather]);

  const dailyData = useMemo(() => {
    if (!weather) return [];

    return weather.daily.time.map((date, index) => ({
      date,
      day: formatDay(date),
      code: weather.daily.weather_code[index],
      max: weather.daily.temperature_2m_max[index],
      min: weather.daily.temperature_2m_min[index],
      rain: weather.daily.precipitation_sum[index],
    }));
  }, [weather]);

  const advice = useMemo(
    () => weather ? getAdvice(weather, crop, stage) : [],
    [weather, crop, stage]
  );

  const current = weather?.current;
  const CurrentIcon = current ? weatherIcon(current.weather_code) : Cloud;

  return (
    <main className="min-h-screen bg-[#f5f8f1] text-slate-800">
      <header className="sticky top-0 z-20 border-b border-green-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-green-700 p-3 text-white">
              <Sprout size={25} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-green-900">
                AgroWeather
              </h1>
              <p className="text-xs text-slate-500">
                Weather insights for agriculture
              </p>
            </div>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <form
              className="flex min-w-0 flex-1 overflow-hidden rounded-xl border border-green-200 bg-white sm:w-72"
              onSubmit={(event) => {
                event.preventDefault();
                void loadWeather(cityInput);
              }}
            >
              <Search className="ml-3 mt-3 shrink-0 text-slate-400" size={19} />
              <input
                value={cityInput}
                onChange={(event) => setCityInput(event.target.value)}
                placeholder="Search a city..."
                aria-label="Search city"
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 outline-none"
              />
              <button
                type="submit"
                disabled={searching}
                className="bg-green-700 px-4 text-white hover:bg-green-800 disabled:opacity-60"
              >
                {searching ? (
                  <LoaderCircle className="animate-spin" size={19} />
                ) : "Go"}
              </button>
            </form>

            <button
              onClick={() => void loadWeather(cityInput)}
              disabled={loading}
              aria-label="Refresh weather"
              className="rounded-xl border border-green-200 bg-white p-3 text-green-800 hover:bg-green-50 disabled:opacity-50"
            >
              <RefreshCw size={19} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8">
        <section className="mb-8 grid gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-green-950 via-green-800 to-emerald-700 p-7 text-white shadow-lg md:grid-cols-[1.4fr_1fr] md:items-center md:p-10">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm text-green-100">
              <Leaf size={17} /> SMART FARMING DASHBOARD
            </p>
            <h2 className="max-w-2xl text-3xl font-extrabold leading-tight md:text-5xl">
              Grow smarter with weather insights.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-green-100">
              Monitor local weather, explore the seven-day forecast and get
              practical suggestions for your crops.
            </p>
            <p className="mt-6 flex items-center gap-2 text-sm text-green-50">
              <MapPin size={17} />
              {place
                ? `${place.name}${place.country ? `, ${place.country}` : ""}`
                : "Finding location..."}
            </p>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/10 p-6">
            {loading && !current ? (
              <div className="flex min-h-40 items-center justify-center">
                <LoaderCircle className="animate-spin" size={35} />
              </div>
            ) : current ? (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-100">Current weather</p>
                    <p className="mt-2 text-6xl font-light">
                      {Math.round(current.temperature_2m)}°
                    </p>
                    <p className="mt-2 text-green-50">
                      {weatherDescription(current.weather_code)}
                    </p>
                  </div>
                  <CurrentIcon size={76} strokeWidth={1.3} />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/20 pt-5">
                  <div>
                    <p className="text-xs text-green-100">Feels like</p>
                    <p className="mt-1 text-lg font-semibold">
                      {Math.round(current.apparent_temperature)}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-green-100">Wind speed</p>
                    <p className="mt-1 text-lg font-semibold">
                      {current.wind_speed_10m} km/h
                    </p>
                  </div>
                </div>
              </>
            ) : <p>Weather information will appear here.</p>}
          </div>
        </section>

        {error && (
          <div role="alert" className="mb-6 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
            <AlertTriangle className="shrink-0" size={21} />
            <div>
              <p className="font-semibold">Unable to load weather</p>
              <p className="mt-1 text-sm">{error}</p>
              <button
                onClick={() => void loadWeather(cityInput)}
                className="mt-2 text-sm font-bold underline"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-green-950">Weather overview</h2>
            <p className="mt-1 text-sm text-slate-500">
              Current conditions for your selected location
            </p>
          </div>
          {loading && (
            <span className="flex items-center gap-2 text-sm text-green-700">
              <LoaderCircle className="animate-spin" size={16} />
              Updating...
            </span>
          )}
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Feels like" value={current ? `${current.apparent_temperature}°C` : "—"} subtitle="Perceived temperature" icon={<Thermometer size={22} />} />
          <MetricCard title="Humidity" value={current ? `${current.relative_humidity_2m}%` : "—"} subtitle="Relative humidity" icon={<Droplets size={22} />} />
          <MetricCard title="Today's high" value={dailyData.length ? `${dailyData[0].max.toFixed(1)}°C` : "—"} subtitle="Forecast maximum" icon={<Sun size={22} />} />
          <MetricCard title="Today's rainfall" value={dailyData.length ? `${dailyData[0].rain.toFixed(1)} mm` : "—"} subtitle="Forecast precipitation" icon={<CloudRain size={22} />} />
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm md:p-6">
            <h3 className="text-lg font-bold text-green-950">24-hour temperature</h3>
            <p className="mt-1 text-sm text-slate-500">Forecast temperature in °C</p>
            <div className="mt-5 h-64">
              {hourlyData.length > 0 ? (
                <HourlyChart data={hourlyData} />
              ) : (
                <ChartPlaceholder loading={loading} />
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-green-100 bg-white p-5 shadow-sm md:p-6">
            <h3 className="text-lg font-bold text-green-950">Seven-day forecast</h3>
            <p className="mt-1 text-sm text-slate-500">Daily temperature and rainfall</p>
            <div className="mt-5 space-y-3">
              {dailyData.map((day, index) => {
                const Icon = weatherIcon(day.code);
                return (
                  <div key={day.date} className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-xl px-3 py-2 hover:bg-green-50">
                    <span className="text-sm font-semibold text-slate-600">
                      {index === 0 ? "Today" : day.day}
                    </span>
                    <div className="flex min-w-0 items-center gap-3">
                      <Icon className="shrink-0 text-green-700" size={22} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{weatherDescription(day.code)}</p>
                        <p className="text-xs text-slate-500">
                          <Droplets className="mr-1 inline" size={12} />
                          {day.rain.toFixed(1)} mm
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <span className="font-bold">{Math.round(day.max)}°</span>
                      <span className="ml-2 text-slate-400">{Math.round(day.min)}°</span>
                    </div>
                  </div>
                );
              })}
              {!dailyData.length && <ChartPlaceholder loading={loading} />}
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-green-100 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-800"><Sprout size={24} /></div>
            <div>
              <h2 className="text-xl font-bold text-green-950">Crop advisor</h2>
              <p className="mt-1 text-sm text-slate-500">Select your crop to receive weather-based suggestions.</p>
            </div>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Select crop</span>
              <select value={crop} onChange={(event) => setCrop(event.target.value)} className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 outline-none focus:border-green-600">
                {crops.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Growth stage</span>
              <select value={stage} onChange={(event) => setStage(event.target.value)} className="w-full rounded-xl border border-green-200 bg-white px-4 py-3 outline-none focus:border-green-600">
                <option>Seedling</option>
                <option>Vegetative growth</option>
                <option>Flowering</option>
                <option>Fruit development</option>
                <option>Maturity</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {advice.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-2xl border border-green-100 bg-green-50/70 p-5">
                <div className="mb-2 flex items-center gap-2 text-green-800">
                  <Activity size={19} />
                  <h3 className="font-bold">{item.title}</h3>
                </div>
                <p className="text-sm leading-6 text-slate-600">{item.detail}</p>
              </div>
            ))}
            {!weather && <p className="text-sm text-slate-500">Crop advice will appear after weather data loads.</p>}
          </div>

          <p className="mt-5 rounded-xl bg-amber-50 p-4 text-xs leading-5 text-amber-900">
            These are general rule-based suggestions, not professional crop diagnosis. Confirm decisions using field conditions, soil moisture and local agricultural guidance.
          </p>
        </section>

        <footer className="flex flex-col gap-3 border-t border-green-200 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 font-semibold text-green-900"><Leaf size={17} /> AgroWeather</p>
          <p>Weather data provided by Open-Meteo.</p>
        </footer>
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className="rounded-xl bg-green-50 p-2.5 text-green-700">{icon}</div>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-green-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function ChartPlaceholder({ loading }: { loading: boolean }) {
  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 text-slate-400">
      {loading ? <LoaderCircle className="animate-spin" size={28} /> : <Wind size={28} />}
      <p className="text-sm">{loading ? "Loading weather data..." : "No chart data available"}</p>
    </div>
  );
}

function HourlyChart({
  data,
}: {
  data: { time: string; temperature: number; rain: number }[];
}) {
  const width = 720;
  const height = 240;
  const left = 42;
  const right = 12;
  const top = 12;
  const bottom = 30;
  const values = data.map((point) => point.temperature);
  const min = Math.floor(Math.min(...values) - 1);
  const max = Math.ceil(Math.max(...values) + 1);
  const range = Math.max(max - min, 1);
  const x = (index: number) =>
    left + (index / Math.max(data.length - 1, 1)) * (width - left - right);
  const y = (value: number) =>
    top + ((max - value) / range) * (height - top - bottom);
  const points = data
    .map((point, index) => `${x(index)},${y(point.temperature)}`)
    .join(" ");
  const areaPoints = `${left},${height - bottom} ${points} ${x(data.length - 1)},${height - bottom}`;
  const ticks = [min, Math.round((min + max) / 2), max];

  return (
    <svg
      className="h-full w-full overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Hourly temperature forecast in degrees Celsius"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="hourlyTemperatureFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={left} y1={y(tick)} x2={width - right} y2={y(tick)} stroke="#e5e7eb" strokeDasharray="4 4" />
          <text x={left - 8} y={y(tick) + 4} textAnchor="end" fill="#64748b" fontSize="11">{tick}°</text>
        </g>
      ))}
      <polygon points={areaPoints} fill="url(#hourlyTemperatureFill)" />
      <polyline points={points} fill="none" stroke="#15803d" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      {data.filter((_, index) => index % 4 === 0 || index === data.length - 1).map((point) => {
        const index = data.indexOf(point);
        return (
          <text key={`${point.time}-${index}`} x={x(index)} y={height - 7} textAnchor="middle" fill="#64748b" fontSize="11">
            {point.time}
          </text>
        );
      })}
      <title>{data.map((point) => `${point.time}: ${point.temperature}°C`).join("; ")}</title>
    </svg>
  );
}
