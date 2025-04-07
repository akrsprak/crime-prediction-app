"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/layout/site-header"
import { Loader2, Download, FileDown } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiUrl } from "@/lib/api-config"

export default function ExportPage() {
  const [selectedYear, setSelectedYear] = useState<string>("2023")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedFormat, setSelectedFormat] = useState<string>("csv")
  const [loading, setLoading] = useState<boolean>(false)
  const [exportReady, setExportReady] = useState<boolean>(false)
  const [exportUrl, setExportUrl] = useState<string | null>(null)

  // Mock data for demonstration
  const years = ["2020", "2021", "2022", "2023"]
  const areas = [
    { id: "all", name: "All Areas" },
    { id: "Central", name: "Central" },
    { id: "Rampart", name: "Rampart" },
    { id: "Southwest", name: "Southwest" },
    { id: "Hollywood", name: "Hollywood" },
    { id: "Harbor", name: "Harbor" },
    { id: "West LA", name: "West LA" },
    { id: "Van Nuys", name: "Van Nuys" },
    { id: "Northeast", name: "Northeast" },
    { id: "77th Street", name: "77th Street" },
    { id: "Wilshire", name: "Wilshire" },
  ]

  const handleExport = () => {
    setLoading(true)

    // Simulate export process
    setTimeout(() => {
      setLoading(false)
      setExportReady(true)

      // In a real app, this would be a URL to the exported file
      // For demo purposes, we'll use a placeholder
      setExportUrl(`${apiUrl(`/static/heatmap_data.${selectedFormat}`)}?t=${new Date().getTime()}`)
    }, 1500)
  }

  const handleHeatmapExport = () => {
    setLoading(true)

    // Simulate export process
    setTimeout(() => {
      setLoading(false)
      setExportReady(true)

      // In a real app, this would be a URL to the exported file
      if (selectedFormat === "geojson") {
        setExportUrl(`${apiUrl("/static/heatmap_data.geojson")}?t=${new Date().getTime()}`)
      } else {
        setExportUrl(`${apiUrl("/static/heatmap_data.csv")}?t=${new Date().getTime()}`)
      }
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <h1 className="mb-8 text-3xl font-bold tracking-tight">Export Data</h1>

          <Tabs defaultValue="crime-data" className="space-y-4">
            <TabsList>
              <TabsTrigger value="crime-data">Crime Data</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap Data</TabsTrigger>
            </TabsList>

            <TabsContent value="crime-data" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Export Crime Data</CardTitle>
                  <CardDescription>Export crime statistics and records for analysis in external tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Year</label>
                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Area</label>
                        <Select value={selectedArea} onValueChange={setSelectedArea}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            {areas.map((area) => (
                              <SelectItem key={area.id} value={area.id}>
                                {area.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Format</label>
                        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button onClick={handleExport} className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Preparing Export...
                        </>
                      ) : (
                        <>
                          <FileDown className="mr-2 h-4 w-4" />
                          Export Data
                        </>
                      )}
                    </Button>

                    {exportReady && exportUrl && (
                      <div className="mt-4 rounded-md bg-muted p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Export Ready</h3>
                            <p className="text-sm text-muted-foreground">Your data export is ready for download</p>
                          </div>
                          <a
                            href={exportUrl}
                            download={`crime_data_${selectedYear}_${selectedArea}.${selectedFormat}`}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="heatmap" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Export Heatmap Data</CardTitle>
                  <CardDescription>Export crime prediction heatmap data for use in GIS tools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Area</label>
                        <Select value={selectedArea} onValueChange={setSelectedArea}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            {areas
                              .filter((a) => a.id !== "all")
                              .map((area) => (
                                <SelectItem key={area.id} value={area.id}>
                                  {area.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Format</label>
                        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="geojson">GeoJSON</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <h3 className="font-medium mb-2">GIS Integration</h3>
                      <p className="text-sm text-muted-foreground">
                        The exported data can be imported into GIS tools like QGIS or ArcGIS for advanced spatial
                        analysis.
                      </p>
                      <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
                        <li>GeoJSON format includes full geographic features with properties</li>
                        <li>CSV format includes latitude/longitude coordinates for easy plotting</li>
                        <li>Each point includes crime probability and predicted crime type</li>
                      </ul>
                    </div>

                    <Button onClick={handleHeatmapExport} className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Preparing Export...
                        </>
                      ) : (
                        <>
                          <FileDown className="mr-2 h-4 w-4" />
                          Export Heatmap Data
                        </>
                      )}
                    </Button>

                    {exportReady && exportUrl && (
                      <div className="mt-4 rounded-md bg-muted p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Export Ready</h3>
                            <p className="text-sm text-muted-foreground">
                              Your heatmap data export is ready for download
                            </p>
                          </div>
                          <a
                            href={exportUrl}
                            download={`heatmap_data_${selectedArea}.${selectedFormat}`}
                            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

