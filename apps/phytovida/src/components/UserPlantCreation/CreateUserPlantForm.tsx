import { useCreateUserPlant } from '@/hooks/user-plants/useUserPlant';
import React, { useState } from 'react'
import { Button } from '@repo/ui/components/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@repo/ui/components/dialog';
import { FieldGroup, Field, FieldLabel } from '@repo/ui/components/field';
import { Checkbox } from '@repo/ui/components/checkbox';
import { Input } from '@repo/ui/components/input';

import { Plus, Sprout, ArrowRight, Check, TriangleAlert, Droplets } from "lucide-react";
import DateTimePicker from './dateTimePicker';
import type { CreateUserPlant } from '@/api/user-plants/user.plant.types';
import FeedbackCard from '../FeedbackCard';

const CreateUserPlantForm = ({ plantId, name }: { plantId: string, name: string }) => {
    const [open, setOpen] = useState(false);
    const addUserPlantMutation = useCreateUserPlant();
    const [createdUserPlant, setCreatedUserPlant] = useState<any | null>(null);

    const [plantInfo, setPlantInfo] = useState<CreateUserPlant>({
        plantId,
        phase: "planning",
        wateringFrequency: null,
        lastWateredDate: null
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setPlantInfo((prev) => ({
            ...prev,
            [name]: type === "checkbox"
                ? (checked ? "growing" : "planning")
                : type === "number" ? value === "" ? null : parseInt(value)
                    : value
        }));
    }

    const handleSubmit = () => {
        addUserPlantMutation.mutate(plantInfo, {
            onSuccess: (resp) => {
                setCreatedUserPlant(resp[0]);
                clearInputs();
                setOpen(false);
            }
        });
    }

    const clearInputs = () => {
        setPlantInfo({
            plantId,
            phase: "planning",
            wateringFrequency: null,
            lastWateredDate: null
        })
    };

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={() => {
                    clearInputs();
                    setOpen(!open);
                }}
            >
                <Button onClick={() => setOpen(true)}><Plus /> Add to my garden</Button>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-primary font-light text-sm">
                            <Sprout className="w-3 h-3" />
                            ADD TO MY GARDEN
                        </DialogTitle>
                        <DialogDescription className="text-lg font-bold text-black">
                            {name}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            {/* Phase: planning / growing */}
                            <Field orientation="horizontal" className="p-4 border-solid border-4 rounded-lg">
                                <Checkbox
                                    id="already-planted"
                                    checked={plantInfo.phase === "growing"}
                                    onCheckedChange={(checked) => setPlantInfo({ ...plantInfo, phase: checked ? "growing" : "planning" })}
                                />
                                <div className="grid gap-1">
                                    <FieldLabel htmlFor="already-planted">
                                        I’ve already planted it
                                    </FieldLabel>

                                    <span className="text-sm text-gray-500">
                                        Uncheck if you’re just planning to grow this one soon.
                                    </span>
                                </div>
                            </Field>

                            {/* Watering Frequency */}
                            <Field>
                                <FieldLabel className='flex gap-2'>
                                    <Droplets className=' w-4 h-4' />
                                    Watering Frequency
                                    <span className="text-gray-500">• optional</span>
                                </FieldLabel>
                                <div className="flex items-center gap-2 border-solid border-4 rounded-lg">
                                    <Input
                                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                        type='number'
                                        id="watering-frequency"
                                        placeholder='e.g. 8'
                                        min={1}
                                        value={plantInfo.wateringFrequency ? plantInfo.wateringFrequency : ""}
                                        name="wateringFrequency"
                                        onChange={handleInputChange}
                                    />
                                    <span className="text-sm text-gray-500 pr-2">
                                        days
                                    </span>
                                </div>
                            </Field>
                            {/* Last watered date */}
                            <Field>
                                <FieldLabel>
                                    Last watered
                                    <span className="text-gray-500">• optional</span>
                                </FieldLabel>
                                <DateTimePicker
                                    dateTime={plantInfo.lastWateredDate || null}
                                    setDateTime={(date: Date | null) => setPlantInfo({ ...plantInfo, lastWateredDate: date })}
                                />
                            </Field>
                        </FieldGroup>
                    </form>
                    <Button
                        onClick={handleSubmit}
                    >Add to my garden {addUserPlantMutation.isPending ? "..." : ""}<ArrowRight /></Button>

                </DialogContent>
            </Dialog>
            {addUserPlantMutation.isError ?
                (
                    addUserPlantMutation.error?.status !== undefined &&
                        addUserPlantMutation.error.status < 500
                        ? <FeedbackCard
                            icon={{ icon: <TriangleAlert />, bgColor: "bg-orange-600" }}
                            title={"Your details need a tweak"}
                            description={{ text: "Some details didn't look right. Please review and try again.", color: "text-orange-600" }}
                        />
                        : <FeedbackCard
                            icon={{ icon: <TriangleAlert />, bgColor: "bg-red-800" }}
                            title={"We couldn't save your plant"}
                            description={{ text: "We couldn't reach the garden service. Please try again in a moment.", color: "text-red-800" }}
                        />
                )
                : addUserPlantMutation.isSuccess
                && createdUserPlant && <FeedbackCard
                    icon={{ icon: <Check />, bgColor: "bg-primary" }}
                    title={createdUserPlant.phase === "planning" ? "Planned & saved" : "Saved"}
                    description={{
                        text: `${name} ${createdUserPlant.phase === "planning" ? "was saved to your planting wishlist. Mark it as planted whenever you're ready" : "was added to your garden. We’ll send gentle watering reminders so it thrives."}`,
                        color: "text-primary"
                    }}
                    actions={[
                        { link: "/plant-library", text: "Browse other plants", bgColor: "bg-secondary", color: "text-black" },
                        { link: "/my-garden", text: "View my garden", bgColor: "bg-primary", color: "text-white" }]}
                />
            }
        </>
    )
}

export default CreateUserPlantForm
