// components/thermal-stress-graph.tsx
"use client"

import { fetchHistoricalThermalData, HistoricalDataPoint } from "@/actions/shared"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart3, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

interface ThermalStressGraphProps {
  farmId: string
  days?: number
  className?: string
}

// Helper: map thermoStress (thi) -> level + color
function getDiscomfortLevel(thermoStress: number) {
  if (thermoStress > 0 && thermoStress < 68) {
    return { level: "No thermal Stress", color: "bg-green-500 text-white" }
  } else if (thermoStress > 67.4 && thermoStress < 72) {
    return { level: "Mild discomfort", color: "bg-yellow-400 text-black" }
  } else if (thermoStress > 71.4 && thermoStress < 75) {
    return { level: "Discomfort", color: "bg-orange-400 text-white" }
  } else if (thermoStress > 74.4 && thermoStress < 79) {
    return { level: "Alert", color: "bg-red-400 text-white" }
  } else if (thermoStress > 78.4 && thermoStress < 84) {
    return { level: "Danger", color: "bg-red-600 text-white" }
  } else if (thermoStress > 83.4 && thermoStress < 1000) {
    return { level: "Emergency", color: "bg-purple-700 text-white" }
  } else {
    return { level: "404 | try again", color: "bg-gray-400 text-black" }
  }
}

export default function ThermalStressGraph({
  farmId,
  days = 7,
  className = ""
}: ThermalStressGraphProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadHistoricalData = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await fetchHistoricalThermalData(farmId, days)
        setHistoricalData(data)
      } catch (err) {
        setError("Failed to load historical data")
        console.error("Error loading thermal data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (farmId) {
      loadHistoricalData()
    }
  }, [farmId, days])

  // Calculate statistics
  const averageThi =
    historicalData.length > 0
      ? historicalData.reduce((sum, data) => sum + data.thi, 0) /
        historicalData.length
      : 0

  const peakThi =
    historicalData.length > 0
      ? Math.max(...historicalData.map((data) => data.thi))
      : 0

  const minThi =
    historicalData.length > 0
      ? Math.min(...historicalData.map((data) => data.thi))
      : 0
  const maxThi =
    historicalData.length > 0
      ? Math.max(...historicalData.map((data) => data.thi))
      : 0
  const range = maxThi - minThi

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Historical Thermal Stress Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Loading historical data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Historical Thermal Stress Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Historical Thermal Stress Data
          <span className="text-sm font-normal text-muted-foreground flex items-center gap-1 ml-auto">
            <Calendar className="h-4 w-4" />
            Past {days} days
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {historicalData.length === 0 ? (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">No historical data available</p>
          </div>
        ) : (
          <>
            {/* Bar chart */}
            <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-between">
              {historicalData.map((data, index) => {
                const discomfort = getDiscomfortLevel(data.thi)
                const normalizedHeight =
                  range > 0
                    ? ((data.thi - minThi) / range) * 180 + 20
                    : 100

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 mx-1"
                  >
                    <div
                      className={`${discomfort.color} w-full rounded-t-md transition-all duration-300 hover:opacity-80 cursor-pointer`}
                      style={{ height: `${normalizedHeight}px` }}
                      title={`THI: ${data.thi} (${discomfort.level}) on ${data.date}`}
                    ></div>
                    <span className="text-xs mt-2 truncate max-w-full">
                      {new Date(data.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric"
                      })}
                    </span>
                    <span className="text-xs font-semibold mt-1">
                      {data.thi}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg border">
                <p className="text-sm text-muted-foreground">Average THI</p>
                <p className="text-xl font-bold text-blue-700">
                  {averageThi.toFixed(1)}
                </p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg border">
                <p className="text-sm text-muted-foreground">Peak THI</p>
                <p className="text-xl font-bold text-orange-700">
                  {peakThi.toFixed(1)}
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>No thermal Stress</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span>Mild discomfort</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span>Discomfort</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span>Alert</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-600 rounded"></div>
                <span>Danger</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-purple-700 rounded"></div>
                <span>Emergency</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
