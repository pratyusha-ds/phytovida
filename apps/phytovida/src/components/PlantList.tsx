import { Link } from 'react-router'
import type { PlantWateringDue } from './TaskList'

const PlantList = ({ plants }: { plants: PlantWateringDue[] | [] }) => {
    const displayDate = (date: string) => {
        const toDate = new Date(date);
        const month = toDate.toLocaleString('default', { month: 'long' });
        return `${toDate.getDate()} ${month}`
    }

    const handlePlural = (n: number) => {
        return `every ${n} day${n > 1 ? "s" : ""}`
    }

    return (
        <div className="flex flex-col items-stretch gap-4">
            {plants.map(({ plant, daysOverDue }) => (
                <Link
                    key={plant.id}
                    to={`/my-garden/${plant.id}`}
                    className="flex items-center gap-4 p-4 bg-divider rounded-xl hover:bg-divider/80 transition-colors duration-200 hover:ml-2"
                >
                    {plant.image ? (
                        <img
                            src={plant.image}
                            alt={plant.name}
                            className="w-20 h-20 object-cover rounded-lg shrink-0"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-lg bg-accent2/20 shrink-0" />
                    )}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className='flex flex-col'>
                            <p className="truncate text-md font-bold text-black">{plant.name}</p>
                            <div className='flex gap-2 text-sm'>
                                {plant.lastWatered && <p>Last watered {displayDate(plant.lastWatered)} • </p>}
                                {plant.wateringFrequency && <p>{handlePlural(plant.wateringFrequency)}</p>}
                            </div>
                        </div>
                        <p className={`ml-auto ${daysOverDue > 0 ? "bg-red-100" : "bg-orange-100"} ${daysOverDue > 0 ? "text-red-700" : "text-orange-700"} text-xs font-medium px-2.5 py-1 rounded-full`}>
                            {daysOverDue > 0 ? `${daysOverDue} days overdue` : "due today"}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default PlantList
