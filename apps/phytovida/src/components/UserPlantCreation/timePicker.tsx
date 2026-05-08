import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectLabel,
    SelectValue
} from "@repo/ui/components/select";

const Time = ({ options, time, setTime }: {
    options: string[],
    time: string,
    setTime: (time: string) => void
}) => {
    return (
        <Select
            value={time}
            onValueChange={setTime}
        >
            <SelectTrigger>
                <SelectValue placeholder={time} />
            </SelectTrigger>
            <SelectContent className="w-auto">
                <SelectGroup>
                    <SelectLabel>Hour</SelectLabel>
                    {options.map((option) => (
                        <SelectItem key={option} value={option} >
                            {option}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default Time
