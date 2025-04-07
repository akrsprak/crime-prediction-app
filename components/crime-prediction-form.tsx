"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  areaName: z.string().min(1, {
    message: "Please select an area.",
  }),
  reportingDistrict: z.string().min(1, {
    message: "Please enter a reporting district.",
  }),
  victimAge: z.string().min(1, {
    message: "Please enter victim age.",
  }),
  victimSex: z.string().min(1, {
    message: "Please select victim sex.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  timeHour: z.string().min(1, {
    message: "Please select an hour.",
  }),
  timeMinute: z.string().min(1, {
    message: "Please select minutes.",
  }),
  season: z.string().min(1, {
    message: "Please select a season.",
  }),
})

type PredictionResult = {
  crimeCode: number
  crimeName: string
  probability: number
  topPredictions: Array<{
    crimeCode: number
    crimeName: string
    probability: number
  }>
}

// Area name mapping
const areaNames = [
  { id: 1, name: "Central" },
  { id: 2, name: "Rampart" },
  { id: 3, name: "Southwest" },
  { id: 4, name: "Hollywood" },
  { id: 5, name: "Harbor" },
  { id: 6, name: "West Valley" },
  { id: 7, name: "Northeast" },
  { id: 8, name: "North Hollywood" },
  { id: 9, name: "Van Nuys" },
  { id: 10, name: "West LA" },
  { id: 11, name: "Wilshire" },
  { id: 12, name: "Pacific" },
  { id: 13, name: "Olympic" },
  { id: 14, name: "Devonshire" },
  { id: 15, name: "Southeast" },
  { id: 16, name: "Mission" },
  { id: 17, name: "Foothill" },
  { id: 18, name: "Newton" },
  { id: 19, name: "Topanga" },
  { id: 20, name: "South Bureau" },
  { id: 21, name: "Valley Bureau" },
]

export default function CrimePredictionForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      areaName: "",
      reportingDistrict: "",
      victimAge: "",
      victimSex: "",
      timeHour: "12",
      timeMinute: "00",
      season: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setPredictionResult(null)

    try {
      // Find the area ID from the area name
      const selectedArea = areaNames.find((area) => area.name === values.areaName)
      const areaId = selectedArea ? selectedArea.id : 1

      const response = await fetch("/api/predict-crime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          date: format(values.date, "yyyy-MM-dd"),
          timeHour: Number.parseInt(values.timeHour),
          timeMinute: Number.parseInt(values.timeMinute),
          victimAge: Number.parseInt(values.victimAge),
          areaId: areaId,
          reportingDistrict: Number.parseInt(values.reportingDistrict),
          // We're no longer sending isRural as it's been removed
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to predict crime")
      }

      const data = await response.json()
      setPredictionResult(data)
    } catch (error) {
      console.error("Error predicting crime:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="prediction">Field Selection</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6 space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Crime Prediction Model Overview</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium">Model Description</h4>
                  <p className="text-muted-foreground mt-1">
                    Our crime prediction system uses machine learning algorithms trained on historical crime data to
                    predict potential crime types based on location, time, and victim demographics.
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-lg font-medium">Methodology</h4>
                  <p className="text-muted-foreground mt-1">
                    The model analyzes patterns in historical crime data, considering seasonal variations, time of day,
                    location characteristics, and demographic factors to generate predictions with confidence scores.
                  </p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-lg font-medium">Input Features</h4>
                  <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                    <li>
                      <span className="font-medium">Area Name:</span> Geographic area where the incident may occur
                    </li>
                    <li>
                      <span className="font-medium">Reporting District:</span> Specific district within the area
                    </li>
                    <li>
                      <span className="font-medium">Victim Demographics:</span> Age and sex of potential victim
                    </li>
                    <li>
                      <span className="font-medium">Date and Time:</span> When the incident may occur
                    </li>
                    <li>
                      <span className="font-medium">Season:</span> Seasonal context which may influence crime patterns
                    </li>
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="text-lg font-medium">Interpretation</h4>
                  <p className="text-muted-foreground mt-1">
                    The system provides a primary prediction with a confidence score, along with alternative
                    possibilities. These predictions should be used as one of many tools in crime prevention and
                    resource allocation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction" className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="areaName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area Name</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select area" />
                          </SelectTrigger>
                          <SelectContent>
                            {areaNames.map((area) => (
                              <SelectItem key={area.id} value={area.name}>
                                {area.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reportingDistrict"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reporting District</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter district number" {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="victimAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Victim Age</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter age" {...field} type="number" min="0" max="120" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="victimSex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Victim Sex</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sex" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                          <SelectItem value="X">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col space-y-2">
                  <FormLabel>Time</FormLabel>
                  <div className="flex space-x-2">
                    <FormField
                      control={form.control}
                      name="timeHour"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Hour" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[...Array(24)].map((_, i) => (
                                <SelectItem key={i} value={i.toString()}>
                                  {i.toString().padStart(2, "0")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <span className="flex items-center">:</span>
                    <FormField
                      control={form.control}
                      name="timeMinute"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Min" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["00", "15", "30", "45"].map((minute) => (
                                <SelectItem key={minute} value={minute}>
                                  {minute}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-center w-10 h-10 rounded-md border border-input">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="season"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Season</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select season" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="spring">Spring</SelectItem>
                          <SelectItem value="summer">Summer</SelectItem>
                          <SelectItem value="fall">Fall</SelectItem>
                          <SelectItem value="winter">Winter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Predicting...
                  </>
                ) : (
                  "Predict Crime"
                )}
              </Button>
            </form>
          </Form>

          {predictionResult && (
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Prediction Result</h3>
                    <div className="mt-2 p-4 bg-primary/5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium">Predicted Crime:</p>
                          <p className="text-xl font-bold">{predictionResult.crimeName}</p>
                          <p className="text-sm text-muted-foreground">Code: {predictionResult.crimeCode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Confidence:</p>
                          <p className="text-xl font-bold">{Math.round(predictionResult.probability * 100)}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Other Possible Crimes:</h4>
                    <div className="space-y-3">
                      {predictionResult.topPredictions.map((prediction, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{prediction.crimeName}</span>
                            <span>{Math.round(prediction.probability * 100)}%</span>
                          </div>
                          <Progress value={prediction.probability * 100} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

