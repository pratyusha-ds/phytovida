import { Button } from '@repo/ui/components/button'
import { Plus } from 'lucide-react'

const WateringFrequencyNotSetCard = ({ setEditMode }: { setEditMode: any }) => {
    return (
        <div className='flex flex-col items-start gap-2 mt-4'>
            <p className='text-secondary text-3xl italic'>Not set yet</p>
            <p className='text-black'>Add how often this plant needs water so we can remind you in time.</p>
            <Button
                className='flex-auto'
                onClick={() => setEditMode(true)}
            ><Plus /> Set watering frequency</Button>
        </div>
    )
}

export default WateringFrequencyNotSetCard
