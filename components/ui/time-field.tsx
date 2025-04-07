"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TimeFieldProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  value: Date;
  onChange: (date: Date | null) => void;
  className?: string;
}

export function TimeField({
  value,
  onChange,
  className,
  ...props
}: TimeFieldProps) {
  const [hours, setHours] = React.useState<number>(
    value ? value.getHours() : 0
  );
  const [minutes, setMinutes] = React.useState<number>(
    value ? value.getMinutes() : 0
  );

  React.useEffect(() => {
    if (value) {
      setHours(value.getHours());
      setMinutes(value.getMinutes());
    }
  }, [value]);

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = Number.parseInt(e.target.value);
    if (!isNaN(newHours) && newHours >= 0 && newHours <= 23) {
      setHours(newHours);
      updateTime(newHours, minutes);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = Number.parseInt(e.target.value);
    if (!isNaN(newMinutes) && newMinutes >= 0 && newMinutes <= 59) {
      setMinutes(newMinutes);
      updateTime(hours, newMinutes);
    }
  };

  const incrementHours = () => {
    const newHours = (hours + 1) % 24;
    setHours(newHours);
    updateTime(newHours, minutes);
  };

  const decrementHours = () => {
    const newHours = (hours - 1 + 24) % 24;
    setHours(newHours);
    updateTime(newHours, minutes);
  };

  const incrementMinutes = () => {
    const newMinutes = (minutes + 5) % 60;
    setMinutes(newMinutes);
    updateTime(hours, newMinutes);
  };

  const decrementMinutes = () => {
    const newMinutes = (minutes - 5 + 60) % 60;
    setMinutes(newMinutes);
    updateTime(hours, newMinutes);
  };

  const updateTime = (h: number, m: number) => {
    const newDate = new Date(value);
    newDate.setHours(h);
    newDate.setMinutes(m);
    onChange(newDate);
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className="flex flex-col items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={incrementHours}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Input
          type="text"
          inputMode="numeric"
          value={hours.toString().padStart(2, "0")}
          onChange={handleHoursChange}
          className="h-9 w-12 text-center"
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={decrementHours}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
      <span className="text-xl">:</span>
      <div className="flex flex-col items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={incrementMinutes}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Input
          type="text"
          inputMode="numeric"
          value={minutes.toString().padStart(2, "0")}
          onChange={handleMinutesChange}
          className="h-9 w-12 text-center"
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={decrementMinutes}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
