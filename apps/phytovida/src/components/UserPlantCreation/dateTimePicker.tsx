import { useState } from 'react'

import { Button } from '@repo/ui/components/button';
import { Calendar } from '@repo/ui/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/components/popover';
import Time from '@/components/UserPlantCreation/timePicker';

import { Calendar as CalendarIcon, Clock4, X } from "lucide-react";

const DateTimePicker = ({ dateTime, setDateTime }: { dateTime: Date | null; setDateTime: (date: Date | null) => void }) => {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [hour, setHour] = useState("09");
    const [minute, setMinute] = useState("00");

    const setDefault = () => {
        setDateTime(null);
        setDate(null);
        setHour("09");
        setMinute("00");
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <div className='flex gap-2'>
                <PopoverTrigger asChild>
                    <Button className="flex-auto justify-start text-left text-gray-500 bg-color-white hover:bg-color-white">
                        <CalendarIcon />
                        {dateTime ? new Date(dateTime).toLocaleString() : "Select date and time"}
                    </Button>
                </PopoverTrigger>
                {dateTime && <Button
                    className='flex-none'
                    onClick={setDefault}
                ><X /></Button>}
            </div>

            <PopoverContent className="w-auto p-0">
                <div className='grid gap-2 p-4'>
                    <Calendar
                        mode="single"
                        onSelect={(dt) => setDate(dt?.getDate() ? dt : null)}
                        selected={date ? date : undefined}
                        modifiersClassNames={{
                            today: "bg-transparent text-foreground font-normal"
                        }}
                    />
                    <div className="flex items-center gap-2 pt-2 border-t-2">
                        <p className="text-gray-500"> <Clock4 className="w-4 h-4" />Time</p>
                        <Time
                            options={Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'))}
                            time={hour}
                            setTime={setHour} />
                        :
                        <Time
                            options={["00", "15", "30", "45"]}
                            time={minute}
                            setTime={setMinute} />
                        <Button onClick={() => {
                            if (date) {
                                const selectedDateTime = new Date(date);
                                selectedDateTime.setHours(parseInt(hour));
                                selectedDateTime.setMinutes(parseInt(minute));
                                setDateTime(selectedDateTime);
                            }
                            setOpen(false)
                        }
                        }>Done</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DateTimePicker
