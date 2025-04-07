"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { TimeField } from "@/components/ui/time-field";

interface FeaturePredictionFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
}

export function FeaturePredictionForm({
  onSubmit,
  isLoading,
}: FeaturePredictionFormProps) {
  const [areas, setAreas] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    "Area Name": "Central",
    Hour: 12,
    DayOfWeek: 0,
    Month: 1,
    WeaponUsed: false,
  });

  useEffect(() => {
    // In a real app, fetch areas from the backend
    // For now, use hardcoded areas to avoid API errors
    setAreas([
      "Central",
      "Rampart",
      "Southwest",
      "Hollywood",
      "Harbor",
      "West LA",
      "Van Nuys",
      "Northeast",
      "77th Street",
      "Wilshire",
    ]);
  }, []);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Predict by Features</CardTitle>
        <CardDescription>
          Enter location and time details to predict the most likely crime type
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Area
            </label>
            <Select
              value={formData["Area Name"]}
              onValueChange={(value) => handleChange("Area Name", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Time
            </label>
            <TimeField
              value={new Date(2023, 0, 1, formData.Hour, 0)}
              onChange={(time) => {
                if (time) {
                  handleChange("Hour", time.getHours());
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Current hour: {formData.Hour}:00
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Day of Week
            </label>
            <Select
              value={formData.DayOfWeek.toString()}
              onValueChange={(value) =>
                handleChange("DayOfWeek", Number.parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Monday</SelectItem>
                <SelectItem value="1">Tuesday</SelectItem>
                <SelectItem value="2">Wednesday</SelectItem>
                <SelectItem value="3">Thursday</SelectItem>
                <SelectItem value="4">Friday</SelectItem>
                <SelectItem value="5">Saturday</SelectItem>
                <SelectItem value="6">Sunday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Month
            </label>
            <Select
              value={formData.Month.toString()}
              onValueChange={(value) =>
                handleChange("Month", Number.parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">January</SelectItem>
                <SelectItem value="2">February</SelectItem>
                <SelectItem value="3">March</SelectItem>
                <SelectItem value="4">April</SelectItem>
                <SelectItem value="5">May</SelectItem>
                <SelectItem value="6">June</SelectItem>
                <SelectItem value="7">July</SelectItem>
                <SelectItem value="8">August</SelectItem>
                <SelectItem value="9">September</SelectItem>
                <SelectItem value="10">October</SelectItem>
                <SelectItem value="11">November</SelectItem>
                <SelectItem value="12">December</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="weapon-used"
              checked={formData.WeaponUsed}
              onCheckedChange={(checked) => handleChange("WeaponUsed", checked)}
            />
            <Label htmlFor="weapon-used">Weapon Used</Label>
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
      </CardContent>
    </Card>
  );
}
