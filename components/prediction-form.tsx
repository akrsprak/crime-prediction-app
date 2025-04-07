"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

import { fetchAreaNames, submitPrediction } from "@/utils/api"
import type { AreaName, PredictionResult } from "@/types/api"

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

interface PredictionFormProps {
  description?: string
}

export default function PredictionForm({ description }: PredictionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null)
  const [areas, setAreas] = useState<AreaName[]>([])
  const [error, setError] = useState<string | null>(null)

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

  // Fetch area names from the API when the component mounts
  useEffect(() => {
    async function loadAreaNames() {
      try {
        const areaNames = await fetchAreaNames()
        setAreas(areaNames)
      } catch (error) {
        console.error("Failed to load area names:", error)
        setError("Failed to load area names. Please try again later.")
      }
    }

    loadAreaNames()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setPredictionResult(null)

    try {
      // Find the area ID from the area name
      const selectedArea = areas.find((area) => area.name === values.areaName)

      if (!selectedArea) {
        throw new Error("Selected area not found")
      }

      // Format the time string
      const timeString = `${values.timeHour.padStart(2, "0")}:${values.timeMinute.padStart(2, "0")}`

      const response = await submitPrediction({
        areaId: selectedArea.id,
        reportingDistrict: Number.parseInt(values.reportingDistrict),
        victimAge: Number.parseInt(values.victimAge),
        victimSex: values.victimSex,
        date: format(values.date, "yyyy-MM-dd"),
        time: timeString,
        season: values.season,
        description: description,
      })

      setPredictionResult(response)
    } catch (error) {
      console.error("Error predicting crime:", error)
      setError("Failed to generate prediction. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Crime Prediction Form</CardTitle>
          <CardDescription>Enter details to predict potential crime types</CardDescription>
        </CardHeader>
        <CardContent>
          {description && (
            <Alert className="mb-6">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Description included:</strong>{" "}
                {description.length > 100 ? `${description.substring(0, 100)}...` : description}
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-6 bg-destructive/10">
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

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
                            {areas.map((area) => (
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

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="timeHour"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hour</FormLabel>
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

                  <FormField
                    control={form.control}
                    name="timeMinute"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minute</FormLabel>
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
        </CardContent>
      </Card>

      {predictionResult && (
        <Card>
          <CardHeader>
            <CardTitle>Prediction Results</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Primary Prediction</h3>
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
    </div>
  )
}

