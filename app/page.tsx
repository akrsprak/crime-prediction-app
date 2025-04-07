import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span className="font-bold">Crime Prediction System</span>
            </Link>
          </div>
          <nav className="hidden md:flex flex-1 items-center space-x-4">
            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link href="/predict" className="text-sm font-medium transition-colors hover:text-primary">
              Predict
            </Link>
            <Link href="/heatmap" className="text-sm font-medium transition-colors hover:text-primary">
              Heatmap
            </Link>
            <Link href="/search" className="text-sm font-medium transition-colors hover:text-primary">
              Search
            </Link>
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              GitHub
            </a>
            <a href="/docs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Documentation
            </a>
          </div>
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
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button>View Dashboard</Button>
                </Link>
                <Link href="/predict">
                  <Button variant="outline">Make Prediction</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="container px-4 md:px-6 py-12 md:py-24">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex flex-col space-y-2">
                <h3 className="text-lg font-semibold">Crime Statistics</h3>
                <p className="text-sm text-muted-foreground">
                  View comprehensive crime statistics and trends across different areas and time periods.
                </p>
                <Link href="/dashboard" className="text-sm text-primary hover:underline mt-auto">
                  View Statistics →
                </Link>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex flex-col space-y-2">
                <h3 className="text-lg font-semibold">Predictive Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Predict crime types based on location, time, and other factors using our machine learning model.
                </p>
                <Link href="/predict" className="text-sm text-primary hover:underline mt-auto">
                  Make Prediction →
                </Link>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex flex-col space-y-2">
                <h3 className="text-lg font-semibold">Heatmap Visualization</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize crime hotspots and probability distributions across different areas.
                </p>
                <Link href="/heatmap" className="text-sm text-primary hover:underline mt-auto">
                  View Heatmap →
                </Link>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex flex-col space-y-2">
                <h3 className="text-lg font-semibold">Semantic Search</h3>
                <p className="text-sm text-muted-foreground">
                  Search for similar crime events using natural language descriptions.
                </p>
                <Link href="/search" className="text-sm text-primary hover:underline mt-auto">
                  Search Events →
                </Link>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex flex-col space-y-2">
                <h3 className="text-lg font-semibold">Data Export</h3>
                <p className="text-sm text-muted-foreground">
                  Export crime data and predictions for use in GIS tools and other analysis software.
                </p>
                <Link href="/export" className="text-sm text-primary hover:underline mt-auto">
                  Export Data →
                </Link>
              </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 flex flex-col space-y-2">
                <h3 className="text-lg font-semibold">Trend Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Analyze year-over-year crime trends and patterns to identify emerging issues.
                </p>
                <Link href="/dashboard?view=trends" className="text-sm text-primary hover:underline mt-auto">
                  View Trends →
                </Link>
              </div>
            </div>
          </div>
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

