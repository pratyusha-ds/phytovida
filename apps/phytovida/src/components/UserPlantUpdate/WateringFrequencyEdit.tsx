import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Check, TriangleAlert, X } from "lucide-react"
import { useState } from "react"
import FeedbackCard from "../FeedbackCard"

interface PropType {
    setEditMode: any,
    userPlantId: number,
    defaultValue: number | null,
    updateUserPlantFields: any
}
const WateringFrequencyEdit = ({ setEditMode, userPlantId, defaultValue, updateUserPlantFields }: PropType) => {
    const [wateringFrequency, setWateringFrequency] = useState<number | null>(defaultValue);

    const handleSubmitUpdate = () => {
        updateUserPlantFields.mutate({
            userPlantId,
            body: {
                fields: [{ name: "wateringFrequency", value: wateringFrequency }]
            }
        }, {
            onSuccess: () => {
                setEditMode(false);
            }
        }
        )
    }
    return (
        <div className="flex flex-col md:flex-row mt-4">
            <div className="flex gap-2 items-center">
                <p>Every</p>
                <Input
                    type="number"
                    min={1}
                    value={wateringFrequency ? wateringFrequency : ""}
                    onChange={(e) => { setWateringFrequency(Number(e.target.value)) }}
                    className="w-30 bg-white" />
                <p>days</p>
            </div>
            <div className="flex gap-2 mt-6 md:mt-0 mx-auto md:mx-0 md:ml-auto">
                <Button
                    className="rounded-4xl bg-white text-black hover:bg-gray-100"
                    onClick={() => setEditMode(false)}
                ><X /></Button>
                <Button
                    className="rounded-4xl"
                    onClick={() => handleSubmitUpdate()}><Check />
                    {updateUserPlantFields.isPending && "..."}
                </Button>
            </div>
            {updateUserPlantFields.isError && (
                updateUserPlantFields.error?.status !== undefined && updateUserPlantFields.error.status < 500
                    ? <FeedbackCard
                        icon={{ icon: <TriangleAlert />, bgColor: "bg-orange-600" }}
                        title={"Your details need a tweak"}
                        description={{ text: `Some details didn't look right.  ${updateUserPlantFields.error.message}`, color: "text-orange-600" }}
                    />
                    : <FeedbackCard
                        icon={{ icon: <TriangleAlert />, bgColor: "bg-red-800" }}
                        title={"We couldn't update your plant"}
                        description={{ text: "We couldn't reach the garden service. Please try again in a moment.", color: "text-red-800" }}
                    />
            )}
        </div>
    )
}

export default WateringFrequencyEdit
