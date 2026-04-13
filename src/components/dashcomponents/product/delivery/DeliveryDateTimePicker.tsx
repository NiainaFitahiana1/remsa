// components/dashboard/product/DeliveryDateTimePicker.tsx
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type DeliveryDateTimePickerProps = {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
};

export function DeliveryDateTimePicker({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}: DeliveryDateTimePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Date prévue */}
      <div className="grid gap-2">
        <Label>Date prévue</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate 
                ? format(selectedDate, "PPP", { locale: fr }) 
                : "Choisir une date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Heure prévue */}
      <div className="grid gap-2">
        <Label>Heure prévue</Label>
        <input
          type="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          disabled={!selectedDate}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}