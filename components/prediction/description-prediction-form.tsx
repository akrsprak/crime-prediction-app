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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DescriptionPredictionFormProps {
  onSubmit: (description: string) => void;
  isLoading: boolean;
}

export function DescriptionPredictionForm({
  onSubmit,
  isLoading,
}: DescriptionPredictionFormProps) {
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onSubmit(description);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predict by Description</CardTitle>
        <CardDescription>
          Describe the incident in natural language to predict the crime type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Crime Description
            </label>
            <Textarea
              placeholder="Describe the incident in detail..."
              className="min-h-[150px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !description.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Description"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
