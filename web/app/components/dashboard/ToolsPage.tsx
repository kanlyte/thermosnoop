"use client";

import { useState } from "react";
import { Session } from "next-auth";
import {
  BarChart3,
  Calculator,
  Calendar,
  Gauge,
  Info,
  Thermometer,
  Droplets,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export default function ToolsPage({ session }: { session: Session }) {
  const [humidity, setHumidity] = useState(50);
  const [temperature, setTemperature] = useState(25);
  const [result, setResult] = useState<number | null>(null);

  const calculateThermalStress = () => {
    const thi =
      temperature -
      (0.55 - (0.55 * humidity) / 100) * (temperature - 14.5);

    setResult(Number(thi.toFixed(2)));
  };

  const thermalStressLevel = result
    ? result < 22
      ? "No thermal stress"
      : result < 25
        ? "Mild discomfort"
        : result < 28
          ? "Discomfort"
          : result < 31
            ? "Alert"
            : result < 34
              ? "Danger"
              : "Emergency"
    : null;

  const resultColor =
    !result || result < 22
      ? "text-emerald-700"
      : result < 25
        ? "text-yellow-600"
        : result < 28
          ? "text-orange-600"
          : result < 31
            ? "text-red-500"
            : result < 34
              ? "text-red-700"
              : "text-purple-700";

  const tools = [
    {
      title: "Thermal Stress Calculator",
      description: "Calculate THI using temperature and humidity.",
      icon: Calculator,
      href: "#thermal-stress",
    },
    {
      title: "Historical Analysis",
      description: "Review past farm thermal stress patterns.",
      icon: BarChart3,
      href: "#thermal-info",
    },
    {
      title: "Forecast Tool",
      description: "Support farm planning using weather forecasts.",
      icon: Calendar,
      href: "#thermal-info",
    },
    {
      title: "Farm Comparison",
      description: "Compare farm conditions and risk levels.",
      icon: Gauge,
      href: "#thermal-info",
    },
  ];

  const stressLevels = [
    {
      title: "No Thermal Stress",
      range: "THI < 22",
      description: "Normal conditions for livestock.",
    },
    {
      title: "Mild Discomfort",
      range: "22 - 24.9",
      description: "Monitor animals and provide water.",
    },
    {
      title: "Discomfort",
      range: "25 - 27.9",
      description: "Provide shade and reduce movement.",
    },
    {
      title: "Alert",
      range: "28 - 30.9",
      description: "Heat stress risk is increasing.",
    },
    {
      title: "Danger",
      range: "31 - 33.9",
      description: "Immediate cooling actions required.",
    },
    {
      title: "Emergency",
      range: "34+",
      description: "High-risk condition. Act immediately.",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="border border-emerald-100 bg-white shadow-sm">
        <CardContent className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Badge className="mb-3 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-50">
              Farm Tools
            </Badge>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Tools for Farm Monitoring
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Use these tools to calculate thermal stress, understand farm
              conditions, and support better livestock management decisions.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
            <p className="text-sm font-semibold text-emerald-800">
              Logged in as
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              {session.user?.name || session.user?.email || "User"}
            </p>
          </div>
        </CardContent>
      </Card>

      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            Available Tools
          </h2>
          <p className="text-sm text-slate-500">
            Select a tool to help with your daily farm decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tools.map((tool) => {
            const Icon = tool.icon;

            return (
              <a href={tool.href} key={tool.title}>
                <Card className="group h-full border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700">
                      {tool.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      </section>

      <section id="thermal-stress">
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="flex items-center gap-2 text-xl text-slate-900">
              <Thermometer className="h-5 w-5 text-emerald-600" />
              Thermal Stress Calculator
            </CardTitle>
            <CardDescription>
              Calculate Temperature-Humidity Index using temperature and
              humidity values.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-5">
                <Card className="border border-slate-200 bg-slate-50 shadow-none">
                  <CardContent className="p-5">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Humidity
                        </h3>
                        <p className="text-sm text-slate-500">
                          Adjust the relative humidity percentage.
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-700">
                        <Droplets className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <Label className="text-sm font-semibold text-slate-700">
                        Humidity
                      </Label>
                      <span className="text-lg font-bold text-slate-900">
                        {humidity}%
                      </span>
                    </div>

                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[humidity]}
                      onValueChange={([value]) => setHumidity(value)}
                      className="py-4"
                    />

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[30, 50, 70].map((value) => (
                        <Button
                          key={value}
                          type="button"
                          variant={humidity === value ? "default" : "outline"}
                          onClick={() => setHumidity(value)}
                          className="rounded-xl"
                        >
                          {value}%
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 bg-slate-50 shadow-none">
                  <CardContent className="p-5">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Temperature
                        </h3>
                        <p className="text-sm text-slate-500">
                          Adjust the air temperature in degrees Celsius.
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-emerald-700">
                        <Thermometer className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                      <Label className="text-sm font-semibold text-slate-700">
                        Temperature
                      </Label>
                      <span className="text-lg font-bold text-slate-900">
                        {temperature}°C
                      </span>
                    </div>

                    <Slider
                      min={0}
                      max={45}
                      step={0.5}
                      value={[temperature]}
                      onValueChange={([value]) => setTemperature(value)}
                      className="py-4"
                    />

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[15, 25, 35].map((value) => (
                        <Button
                          key={value}
                          type="button"
                          variant={
                            temperature === value ? "default" : "outline"
                          }
                          onClick={() => setTemperature(value)}
                          className="rounded-xl"
                        >
                          {value}°C
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={calculateThermalStress}
                  className="h-12 w-full rounded-xl bg-emerald-600 text-base font-semibold hover:bg-emerald-700"
                >
                  Calculate Thermal Stress
                </Button>
              </div>

              <Card className="border border-emerald-100 bg-white shadow-sm">
                <CardContent className="flex h-full min-h-[360px] flex-col items-center justify-center p-6 text-center">
                  {result ? (
                    <>
                      <Badge className="mb-4 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-50">
                        THI Result
                      </Badge>

                      <div className={`text-6xl font-black ${resultColor}`}>
                        {result}
                      </div>

                      <p className="mt-2 text-sm font-medium text-slate-500">
                        Temperature-Humidity Index
                      </p>

                      <div
                        className={`mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-xl font-bold ${resultColor}`}
                      >
                        {thermalStressLevel}
                      </div>

                      <p className="mt-5 max-w-sm text-sm leading-6 text-slate-500">
                        This result is based on the current humidity and
                        temperature values you selected.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <Calculator className="h-8 w-8" />
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">
                        No result yet
                      </h3>

                      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                        Set the humidity and temperature values, then click
                        calculate to view the thermal stress result.
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="thermal-info">
        <div className="mb-4 flex items-center gap-2">
          <Info className="h-5 w-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-900">
            THI Interpretation Guide
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stressLevels.map((level) => (
            <Card
              key={level.title}
              className="border border-slate-200 bg-white shadow-sm"
            >
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-bold text-slate-900">
                    {level.title}
                  </h3>

                  <Badge className="rounded-full bg-slate-100 text-slate-700 hover:bg-slate-100">
                    {level.range}
                  </Badge>
                </div>

                <p className="text-sm leading-6 text-slate-500">
                  {level.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}