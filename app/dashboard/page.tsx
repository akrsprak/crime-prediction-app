"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SiteHeader } from "@/components/layout/site-header"
import { BarChart, LineChart, PieChart } from "@/components/charts"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { apiUrl, fetchApi } from "@/lib/api-config"

interface CrimeStats {
  byMonth: { month: string; count: number }[]
  byType: { type: string; count: number }[]
  byArea: { area: string; count: number }[]
  byTimeOfDay: { timeRange: string; count: number }[]
  totalCrimes: number
  ruralPercentage: number
  urbanPercentage: number
  seasonalDistribution: {
    spring: number
    summer: number
    fall: number
    winter: number
  }
}

interface Trend {
  year: string
  count: number
  previousYearCount: number
  percentChange: number
  increased: boolean
}

interface Hotspot {
  area: string
  count: number
  percentage: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<CrimeStats | null>(null)
  const [trends, setTrends] = useState<Trend[]>([])
  const [hotspots, setHotspots] = useState<Hotspot[]>([])
  const [years, setYears] = useState<string[]>([])
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([])
  const [crimeTypes, setCrimeTypes] = useState<string[]>([])
  const [selectedYear, setSelectedYear] = useState<string>("2023")
  const [selectedArea, setSelectedArea] = useState<string>("all")
  const [selectedCrimeType, setSelectedCrimeType] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch available years
    fetchApi<{ years: string[] }>(apiUrl("/api/available-years"))
      .then((data) => {
        setYears(data.years)
        if (data.years.length > 0) {
          setSelectedYear(data.years[data.years.length - 1]) // Select most recent year
        }
      })
      .catch((error) => {
        console.error("Error fetching years:", error)
        // Use mock data if API fails
        const mockYears = ["2020", "2021", "2022", "2023"]
        setYears(mockYears)
        setSelectedYear("2023")
      })

    // Fetch available areas
    fetchApi<{ areas: { id: string; name: string }[] }>(apiUrl("/api/available-areas"))
      .then((data) => {
        setAreas(data.areas)
      })
      .catch((error) => {
        console.error("Error fetching areas:", error)
        // Use mock data if API fails
        setAreas([
          { id: "all", name: "All Areas" },
          { id: "rural", name: "Rural Only" },
          { id: "urban", name: "Urban Only" },
          { id: "Central", name: "Central" },
          { id: "Rampart", name: "Rampart" },
          { id: "Southwest", name: "Southwest" },
        ])
      })

    // Fetch crime types
    fetchApi<{ crime_types: string[] }>(apiUrl("/api/crime-types"))
      .then((data) => {
        setCrimeTypes(data.crime_types)
      })
      .catch((error) => {
        console.error("Error fetching crime types:", error)
        // Use mock data if API fails
        setCrimeTypes(["Theft", "Assault", "Burglary", "Vehicle Theft", "Robbery", "Vandalism"])
      })

    // Fetch trend analysis
    fetchApi<{ trends: Trend[] }>(apiUrl("/api/trend-analysis"))
      .then((data) => {
        setTrends(data.trends)
      })
      .catch((error) => {
        console.error("Error fetching trends:", error)
        // Use mock data if API fails
        setTrends([
          {
            year: "2023",
            count: 12500,
            previousYearCount: 11800,
            percentChange: 5.9,
            increased: true,
          },
          {
            year: "2022",
            count: 11800,
            previousYearCount: 13200,
            percentChange: -10.6,
            increased: false,
          },
        ])
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Fetch crime statistics based on selected year and area
    fetchApi<CrimeStats>(apiUrl(`/api/crime-stats?year=${selectedYear}&area=${selectedArea}`))
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching crime stats:", error)
        setError("Failed to load crime statistics. Please try again later.")
        setLoading(false)

        // Use mock data if API fails
        setStats({
          byMonth: [
            { month: "Jan", count: 850 },
            { month: "Feb", count: 740 },
            { month: "Mar", count: 900 },
            { month: "Apr", count: 880 },
            { month: "May", count: 940 },
            { month: "Jun", count: 1100 },
            { month: "Jul", count: 1250 },
            { month: "Aug", count: 1300 },
            { month: "Sep", count: 1150 },
            { month: "Oct", count: 1050 },
            { month: "Nov", count: 950 },
            { month: "Dec", count: 1100 },
          ],
          byType: [
            { type: "Theft", count: 4200 },
            { type: "Assault", count: 2100 },
            { type: "Burglary", count: 1800 },
            { type: "Vehicle Theft", count: 1500 },
            { type: "Robbery", count: 900 },
          ],
          byArea: [
            { area: "Downtown", count: 3500 },
            { area: "North District", count: 2800 },
            { area: "South Side", count: 2400 },
            { area: "West End", count: 1900 },
            { area: "East Side", count: 1600 },
          ],
          byTimeOfDay: [
            { timeRange: "12am-3am", count: 1800 },
            { timeRange: "3am-6am", count: 1200 },
            { timeRange: "6am-9am", count: 900 },
            { timeRange: "9am-12pm", count: 1100 },
            { timeRange: "12pm-3pm", count: 1400 },
            { timeRange: "3pm-6pm", count: 1700 },
            { timeRange: "6pm-9pm", count: 2100 },
            { timeRange: "9pm-12am", count: 2000 },
          ],
          totalCrimes: 12200,
          ruralPercentage: 30,
          urbanPercentage: 70,
          seasonalDistribution: {
            spring: 25,
            summer: 35,
            fall: 22,
            winter: 18,
          },
        })
      })

    // Fetch crime hotspots
    fetchApi<{ hotspots: Hotspot[] }>(
      apiUrl(`/api/crime-hotspots?year=${selectedYear}${selectedCrimeType ? `&crime_type=${selectedCrimeType}` : ""}`),
    )
      .then((data) => {
        setHotspots(data.hotspots)
      })
      .catch((error) => {
        console.error("Error fetching hotspots:", error)
        // Use mock data if API fails
        setHotspots([
          { area: "Downtown", count: 3500, percentage: 28.7 },
          { area: "North District", count: 2800, percentage: 23.0 },
          { area: "South Side", count: 2400, percentage: 19.7 },
          { area: "West End", count: 1900, percentage: 15.6 },
          { area: "East Side", count: 1600, percentage: 13.1 },
        ])
      })
  }, [selectedYear, selectedArea, selectedCrimeType])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <div className="mt-4 flex flex-wrap gap-4 md:mt-0">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area.id} value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedCrimeType} onValueChange={setSelectedCrimeType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Crime Type (All)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crime Types</SelectItem>
                  {crimeTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading ? (
            <div className="flex h-[400px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : stats ? (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="hotspots">Hotspots</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Crimes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalCrimes.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">
                        For {selectedYear} in {areas.find((a) => a.id === selectedArea)?.name || "All Areas"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Urban/Rural Split</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {stats.urbanPercentage}% / {stats.ruralPercentage}%
                      </div>
                      <p className="text-xs text-muted-foreground">Urban vs Rural Areas</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Top Crime Type</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.byType[0]?.type || "N/A"}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.byType[0]?.count.toLocaleString() || 0} incidents (
                        {Math.round(((stats.byType[0]?.count || 0) / stats.totalCrimes) * 100)}%)
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Top Area</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.byArea[0]?.area || "N/A"}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.byArea[0]?.count.toLocaleString() || 0} incidents (
                        {Math.round(((stats.byArea[0]?.count || 0) / stats.totalCrimes) * 100)}%)
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Monthly Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <BarChart data={stats.byMonth} xField="month" yField="count" categoryField="month" />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Crime Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PieChart
                        data={stats.byType.slice(0, 5).map((item) => ({
                          name: item.type,
                          value: item.count,
                        }))}
                      />
                    </CardContent>
                  </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Time of Day Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <BarChart data={stats.byTimeOfDay} xField="timeRange" yField="count" categoryField="timeRange" />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Seasonal Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PieChart
                        data={[
                          { name: "Spring", value: stats.seasonalDistribution.spring },
                          { name: "Summer", value: stats.seasonalDistribution.summer },
                          { name: "Fall", value: stats.seasonalDistribution.fall },
                          { name: "Winter", value: stats.seasonalDistribution.winter },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Year-over-Year Trends</CardTitle>
                    <CardDescription>Crime count changes over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <LineChart data={trends} xField="year" yField="count" categoryField="year" />
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-2">
                  {trends.map((trend) => (
                    <Card key={trend.year}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {trend.year} vs {Number.parseInt(trend.year) - 1}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {trend.percentChange > 0 ? "+" : ""}
                          {trend.percentChange}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {trend.count.toLocaleString()} vs {trend.previousYearCount.toLocaleString()} incidents
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="hotspots" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Crime Hotspots</CardTitle>
                    <CardDescription>
                      Areas with highest crime incidence in {selectedYear}
                      {selectedCrimeType ? ` for ${selectedCrimeType}` : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {hotspots.map((hotspot) => (
                        <div key={hotspot.area} className="flex items-center">
                          <div className="w-1/4 font-medium">{hotspot.area}</div>
                          <div className="w-3/4">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-full rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-primary"
                                  style={{ width: `${hotspot.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">
                                {hotspot.count.toLocaleString()} ({hotspot.percentage}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {hotspots.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          No hotspot data available for the selected criteria
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
              <p className="text-muted-foreground">
                There is no crime data available for {selectedYear} in{" "}
                {areas.find((a) => a.id === selectedArea)?.name || "the selected area"}.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

