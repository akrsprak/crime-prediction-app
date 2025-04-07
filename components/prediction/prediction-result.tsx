"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { PredictionData } from "@/app/predict/page";
import { Badge } from "@/components/ui/badge";

interface PredictionResultProps {
  result: PredictionData | null;
  error: string | null;
  loading: boolean;
}

export function PredictionResult({
  result,
  error,
  loading,
}: PredictionResultProps) {
  console.log("PredictionResult", { result, error, loading });
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Prediction Result</CardTitle>
        <CardDescription>
          The predicted crime type based on your input
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Processing your request...</p>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : result ? (
          <div className="space-y-6">
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertTitle>Prediction Complete</AlertTitle>
              <AlertDescription>
                Based on the provided information, we've predicted the most
                likely crime type.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">
                  Predicted Crime Type
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{result.predicted_crime}</p>
                  {result.weaponUsed && (
                    <Badge variant="destructive" className="ml-2">
                      Weapon Involved
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-muted-foreground">
                  Crime Code
                </h3>
                <p className="text-xl">{result.predicted_crime_code}</p>
              </div>

              {result.confidence !== undefined && (
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">
                    Confidence
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {(result.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">
              Enter prediction details to see results here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
