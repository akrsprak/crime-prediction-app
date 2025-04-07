"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteHeader } from "@/components/layout/site-header";
import { FeaturePredictionForm } from "@/components/prediction/feature-prediction-form";
import { DescriptionPredictionForm } from "@/components/prediction/description-prediction-form";
import { PredictionResult } from "@/components/prediction/prediction-result";
import { apiUrl, fetchApi } from "@/lib/api-config";

export interface PredictionData {
  weaponUsed: any;
  predicted_crime_code: number;
  predicted_crime: string;
  confidence?: number;
}

export default function PredictPage() {
  const [predictionResult, setPredictionResult] =
    useState<PredictionData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFeaturePrediction = async (formData: any) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchApi<PredictionData>(apiUrl("/predict"), {
        method: "POST",
        body: JSON.stringify(formData),
      });

      setPredictionResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while making the prediction"
      );
      setPredictionResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDescriptionPrediction = async (description: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchApi<PredictionData>(
        apiUrl("/predict_from_description"),
        {
          method: "POST",
          body: JSON.stringify({ description }),
        }
      );

      setPredictionResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while analyzing the description"
      );
      setPredictionResult(null);
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
            Crime Prediction
          </h1>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="features">
                    Predict by Features
                  </TabsTrigger>
                  <TabsTrigger value="description">
                    Predict by Description
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="features" className="mt-6">
                  <FeaturePredictionForm
                    onSubmit={handleFeaturePrediction}
                    isLoading={loading}
                  />
                </TabsContent>
                <TabsContent value="description" className="mt-6">
                  <DescriptionPredictionForm
                    onSubmit={handleDescriptionPrediction}
                    isLoading={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <PredictionResult
                result={predictionResult}
                error={error}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
