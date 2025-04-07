"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DescriptionPage from "@/components/description-page"
import PredictionForm from "@/components/prediction-form"

export default function Home() {
  const [activeTab, setActiveTab] = useState("description")
  const [description, setDescription] = useState<string | undefined>()

  const handleDescriptionSubmit = (desc: string) => {
    setDescription(desc)
    setActiveTab("prediction")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <div className="flex items-center space-x-2">
              <div className="relative h-8 w-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <span className="font-bold">Crime Prediction System</span>
            </div>
          </div>
          <nav className="flex flex-1 items-center justify-end space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              GitHub
            </a>
            <a
              href="https://docs.example.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Documentation
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-muted/50 to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Crime Prediction Analysis
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Advanced crime prediction using machine learning and historical data analysis
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="container px-4 md:px-6 py-6 md:py-10">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="prediction">Prediction Input</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <DescriptionPage onDescriptionSubmit={handleDescriptionSubmit} />
            </TabsContent>
            <TabsContent value="prediction" className="mt-6">
              <PredictionForm description={description} />
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Crime Prediction System. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground underline underline-offset-4">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

