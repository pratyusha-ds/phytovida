import { useState } from "react";
import { Calendar } from "@repo/ui/components/calendar";


export function PlantCalendar() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    return (
        <>
        <Calendar
            className="w-full bg-divider rounded-xl"
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}/>
        </>

    );

}

