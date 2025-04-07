"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  query: z.string().min(10, {
    message: "Query must be at least 10 characters.",
  }),
  numResults: z.string().min(1, {
    message: "Please select number of results to return.",
  }),
})

type SimilarCase = {
  id: string
  crimeCode: number
  crimeName: string
  date: string
  location: string
  description: string
  similarity: number
}

export default function SimilarCasesSearch() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SimilarCase[] | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: "",
      numResults: "5",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setSearchResults(null)

    try {
      const response = await fetch("/api/similar-cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: values.query,
          numResults: Number.parseInt(values.numResults),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to search for similar cases")
      }

      const data = await response.json()
      setSearchResults(data.results)
    } catch (error) {
      console.error("Error searching for similar cases:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the case details, location, time, and any other relevant information..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Provide as much detail as possible for better matching results.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numResults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Results</FormLabel>
                <FormControl>
                  <Input type="number" min="1" max="20" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Similar Cases
              </>
            )}
          </Button>
        </form>
      </Form>

      {searchResults && searchResults.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Similar Cases Found</h3>
          <div className="space-y-4">
            {searchResults.map((result) => (
              <Card key={result.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{result.crimeName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {result.date} • {result.location}
                      </p>
                    </div>
                    <Badge variant="outline">{Math.round(result.similarity * 100)}% Match</Badge>
                  </div>
                  <Separator className="my-2" />
                  <p className="text-sm">{result.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : searchResults && searchResults.length === 0 ? (
        <div className="text-center p-6 border rounded-lg">
          <h3 className="text-lg font-medium">No Similar Cases Found</h3>
          <p className="text-muted-foreground mt-2">Try broadening your search query or providing different details.</p>
        </div>
      ) : null}
    </div>
  )
}

