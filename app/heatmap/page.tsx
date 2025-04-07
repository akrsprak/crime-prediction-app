"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/layout/site-header"
import { Loader2, Download } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { apiUrl, fetchApi } from "@/lib/api-config"

export default function HeatmapPage() {
  const [areas, setAreas] = useState<string[]>([])
  const [selectedArea, setSelectedArea] = useState<string>("Central")
  const [selectedHour, setSelectedHour] = useState<string>("12")
  const [selectedDay, setSelectedDay] = useState<string>("0")
  const [selectedMonth, setSelectedMonth] = useState<string>("1")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [mapUrl, setMapUrl] = useState<string | null>(null)
  const [exportUrls, setExportUrls] = useState<{ geojson: string | null; csv: string | null }>({
    geojson: null,
    csv: null,
  })

  useEffect(() => {
    // In a real app, fetch areas from the backend
    setAreas([
      "Central",
      "Rampart",
      "Southwest",
      "Hollywood",
      "Harbor",
      "West LA",
      "Van Nuys",
      "Northeast",
      "77th Street",
      "Wilshire",
    ])
  }, [])

  const generateHeatmap = async () => {
    setLoading(true)
    setError(null)
    setMapUrl(null)

    try {
      const data = await fetchApi<{ status: string; map_url: string }>(apiUrl("/generate_heatmap"), {
        method: "POST",
        body: JSON.stringify({
          area: selectedArea,
          hour: Number.parseInt(selectedHour),
          day_of_week: Number.parseInt(selectedDay),
          month: Number.parseInt(selectedMonth),
        }),
      })

      // Add timestamp to prevent caching
      setMapUrl(`${apiUrl(data.map_url)}?t=${new Date().getTime()}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while generating the heatmap")
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchApi<{
        status: string
        geojson_url: string
        csv_url: string
      }>(apiUrl("/export_heatmap_data"), {
        method: "POST",
        body: JSON.stringify({
          area: selectedArea,
          hour: Number.parseInt(selectedHour),
          day_of_week: Number.parseInt(selectedDay),
          month: Number.parseInt(selectedMonth),
        }),
      })

      // Add timestamp to prevent caching
      const timestamp = new Date().getTime()
      setExportUrls({
        geojson: `${apiUrl(data.geojson_url)}?t=${timestamp}`,
        csv: `${apiUrl(data.csv_url)}?t=${timestamp}`,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while exporting the data")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <h1 className="mb-8 text-3xl font-bold tracking-tight">Crime Heatmap</h1>

          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Heatmap Settings</CardTitle>
                  <CardDescription>Configure parameters for the crime prediction heatmap</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Area</label>
                      <Select value={selectedArea} onValueChange={setSelectedArea}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select area" />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.map((area) => (
                            <SelectItem key={area} value={area}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Hour (0-23)</label>
                      <Select value={selectedHour} onValueChange={setSelectedHour}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select hour" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                              {i.toString().padStart(2, "0")}:00
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Day of Week</label>
                      <Select value={selectedDay} onValueChange={setSelectedDay}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Monday</SelectItem>
                          <SelectItem value="1">Tuesday</SelectItem>
                          <SelectItem value="2">Wednesday</SelectItem>
                          <SelectItem value="3">Thursday</SelectItem>
                          <SelectItem value="4">Friday</SelectItem>
                          <SelectItem value="5">Saturday</SelectItem>
                          <SelectItem value="6">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">Month</label>
                      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">January</SelectItem>
                          <SelectItem value="2">February</SelectItem>
                          <SelectItem value="3">March</SelectItem>
                          <SelectItem value="4">April</SelectItem>
                          <SelectItem value="5">May</SelectItem>
                          <SelectItem value="6">June</SelectItem>
                          <SelectItem value="7">July</SelectItem>
                          <SelectItem value="8">August</SelectItem>
                          <SelectItem value="9">September</SelectItem>
                          <SelectItem value="10">October</SelectItem>
                          <SelectItem value="11">November</SelectItem>
                          <SelectItem value="12">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Button onClick={generateHeatmap} className="w-full" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "Generate Heatmap"
                        )}
                      </Button>

                      <Button onClick={exportData} variant="outline" className="w-full" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                          </>
                        )}
                      </Button>
                    </div>

                    {exportUrls.geojson && (
                      <div className="space-y-2 pt-2 border-t">
                        <h3 className="text-sm font-medium">Download Data</h3>
                        <div className="flex flex-col gap-2">
                          <a
                            href={exportUrls.geojson}
                            download="crime_heatmap.geojson"
                            className="text-sm text-primary hover:underline flex items-center"
                          >
                            <Download className="mr-2 h-3 w-3" />
                            Download GeoJSON
                          </a>
                          <a
                            href={exportUrls.csv}
                            download="crime_heatmap.csv"
                            className="text-sm text-primary hover:underline flex items-center"
                          >
                            <Download className="mr-2 h-3 w-3" />
                            Download CSV
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Crime Prediction Heatmap</CardTitle>
                  <CardDescription>Visualization of predicted crime probability for {selectedArea}</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="h-[600px] rounded-md border">
                    {loading ? (
                      <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : mapUrl ? (
                      <iframe src={mapUrl} className="w-full h-full border-0" title="Crime Prediction Heatmap" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <p className="text-muted-foreground">
                          Generate a heatmap to visualize crime prediction probabilities
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

