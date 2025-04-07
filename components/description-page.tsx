"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

const formSchema = z.object({
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(1000, {
      message: "Description must not exceed 1000 characters.",
    }),
})

interface DescriptionPageProps {
  onDescriptionSubmit: (description: string) => void
}

export default function DescriptionPage({ onDescriptionSubmit }: DescriptionPageProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Pass the description to the parent component
      onDescriptionSubmit(values.description)
    } catch (error) {
      console.error("Error submitting description:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Crime Prediction Analysis</CardTitle>
          <CardDescription>Provide a detailed description of the situation for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>How this works</AlertTitle>
            <AlertDescription>
              Enter a detailed description of the situation, including any relevant context about the location, time,
              potential victims, and circumstances. This information will be used alongside the specific fields in the
              next step to generate a more accurate prediction.
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Situation Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the situation in detail, including location characteristics, time of day, potential victims, and any other relevant context..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Prediction Form"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About the Analysis Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Model Description</h3>
            <p className="text-muted-foreground mt-1">
              Our crime prediction system uses machine learning algorithms trained on historical crime data to predict
              potential crime types based on location, time, and victim demographics.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Methodology</h3>
            <p className="text-muted-foreground mt-1">
              The model analyzes patterns in historical crime data, considering seasonal variations, time of day,
              location characteristics, and demographic factors to generate predictions with confidence scores.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Interpretation</h3>
            <p className="text-muted-foreground mt-1">
              The system provides a primary prediction with a confidence score, along with alternative possibilities.
              These predictions should be used as one of many tools in crime prevention and resource allocation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

