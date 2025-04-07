"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { Loader2, Search } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { apiUrl, fetchApi } from "@/lib/api-config";

interface SearchResult {
  event_location: React.JSX.Element;
  similarity_score: number;
  event_time: string | number | Date;
  enhanced_text: string;
  id: string | number;
  description: string;
  similarity: number;
  date?: string;
  location?: string;
  crime_type?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const data = await fetchApi<{ results: SearchResult[] }>(
        apiUrl("/search"),
        {
          method: "POST",
          body: JSON.stringify({
            query,
            top_k: 10,
          }),
        }
      );
      console.log("Search results:", data);
      setResults(data.results || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while searching"
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-6">
          <h1 className="mb-8 text-3xl font-bold tracking-tight">
            Semantic Search
          </h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search for Similar Crime Events</CardTitle>
              <CardDescription>
                Use natural language to find similar crime events in our
                database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Describe the crime event you're looking for..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading || !query.trim()}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : results.length > 0 ? (
              <>
                <h2 className="text-xl font-semibold">Search Results</h2>
                {results.map((result, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">
                              {result.enhanced_text || "Crime Event"}
                            </h3>
                            {result.event_time && (
                              <p className="text-sm text-muted-foreground">
                                {new Date(
                                  result.event_time
                                ).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                            {(result.similarity_score * 100).toFixed(1)}% match
                          </div>
                        </div>
                        <p className="text-sm">{result.description}</p>
                        {result.event_location && (
                          <p className="text-sm text-muted-foreground">
                            Location: {result.event_location}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : hasSearched ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">No Results Found</h2>
                <p className="text-muted-foreground">
                  No matching crime events were found for your query. Try using
                  different keywords or a more general description.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
