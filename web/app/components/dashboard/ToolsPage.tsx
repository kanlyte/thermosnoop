"use client"

import { Calculator, Thermometer, Gauge, Calendar, BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { Session } from "next-auth"

export default function ToolsPage({ session }: { session: Session }) {
  const [humidity, setHumidity] = useState(50)
  const [temperature, setTemperature] = useState(25)
  const [result, setResult] = useState<number | null>(null)

  const calculateThermalStress = () => {
    // Simple THI calculation formula (Temperature-Humidity Index)
    const thi = temperature - (0.55 - (0.55 * humidity / 100)) * (temperature - 14.5)
    setResult(parseFloat(thi.toFixed(1)))
  }

  const thermalStressLevel = result ? 
    result < 22 ? "No thermal stress" :
    result < 25 ? "Mild discomfort" :
    result < 28 ? "Discomfort" :
    result < 31 ? "Alert" :
    result < 34 ? "Danger" : "Emergency" 
    : null

  const tools = [
    {
      title: "Thermal Stress Calculator",
      description: "Calculate the thermal stress of your farm at any time",
      icon: <Calculator className="h-6 w-6" />,
      href: "#thermal-stress"
    },
    {
      title: "Historical Analysis",
      description: "View past thermal stress data and trends",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "#"
    },
    {
      title: "Forecast Tool",
      description: "Predict future thermal stress based on weather forecasts",
      icon: <Calendar className="h-6 w-6" />,
      href: "#"
    },
    {
      title: "Farm Comparison",
      description: "Compare thermal stress across different farms",
      icon: <Gauge className="h-6 w-6" />,
      href: "#"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Tools</h1>
          <p className="text-muted-foreground">Tools to assist in your daily farm management</p>
        </div>

        {/* Tools Grid */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Select tool to use</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool, index) => (
              <Card 
                key={index} 
                className="cursor-pointer transition-all hover:shadow-md border-green-100 hover:border-green-300"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{tool.title}</CardTitle>
                    <div className="text-green-600">{tool.icon}</div>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Thermal Stress Calculator */}
        <div id="thermal-stress" className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-2 flex items-center gap-2">
              <Thermometer className="h-6 w-6" />
              Thermal Stress Calculator
            </h2>
            <p className="text-muted-foreground">
              Calculate the thermal stress of your farm at any time
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Humidity (%)</CardTitle>
                  <CardDescription>Enter the humidity in %</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="humidity" className="text-sm">Humidity: {humidity}%</Label>
                  </div>
                  <Slider
                    id="humidity"
                    min={0}
                    max={100}
                    step={1}
                    value={[humidity]}
                    onValueChange={([value]: number[]) => setHumidity(value)}
                    className="py-4"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {[30, 50, 70].map((value) => (
                      <Button 
                        key={value} 
                        variant={humidity === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setHumidity(value)}
                        className="text-xs"
                      >
                        {value}%
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Temperature (°C)</CardTitle>
                  <CardDescription>Enter the temperature in °C</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="temperature" className="text-sm">Temperature: {temperature}°C</Label>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={45}
                    step={0.5}
                    value={[temperature]}
                    onValueChange={([value]: number[]) => setTemperature(value)}
                    className="py-4"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    {[15, 25, 35].map((value) => (
                      <Button 
                        key={value} 
                        variant={temperature === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTemperature(value)}
                        className="text-xs"
                      >
                        {value}°C
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={calculateThermalStress} 
                className="w-full py-6 text-lg"
                size="lg"
              >
                Calculate Thermal Stress
              </Button>
            </div>

            {/* Result Section */}
            <div className="flex items-center justify-center">
              {result ? (
                <Card className="w-full text-center py-8">
                  <CardHeader>
                    <CardTitle className="text-2xl mb-2">Results</CardTitle>
                    <div className={`text-5xl font-bold py-4 ${
                      result < 22 ? "text-green-600" :
                      result < 25 ? "text-yellow-600" :
                      result < 28 ? "text-orange-600" :
                      result < 31 ? "text-red-500" :
                      result < 34 ? "text-red-700" : "text-purple-700"
                    }`}>
                      {result}
                    </div>
                    <CardDescription className="text-lg">
                      THI Value
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-xl font-semibold mb-4 ${
                      result < 22 ? "text-green-600" :
                      result < 25 ? "text-yellow-600" :
                      result < 28 ? "text-orange-600" :
                      result < 31 ? "text-red-500" :
                      result < 34 ? "text-red-700" : "text-purple-700"
                    }`}>
                      {thermalStressLevel}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on the Temperature-Humidity Index (THI)
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="w-full text-center py-12 bg-muted/30">
                  <CardContent className="flex flex-col items-center justify-center space-y-4">
                    <div className="rounded-full bg-green-100 p-4">
                      <Calculator className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-muted-foreground">Enter values and click calculate to see results</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">No Thermal Stress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">THI &lt; 22 - Normal conditions</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Mild Discomfort</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">THI 22-24 - Monitor conditions</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Danger Level</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">THI ≥ 31 - Take immediate action</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}