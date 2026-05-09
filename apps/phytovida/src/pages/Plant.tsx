import CreateUserPlantForm from '@/components/UserPlantCreation/CreateUserPlantForm';

const Plant = () => {

    return (
        <div>
            <p>This is the page of a plant</p>
            <CreateUserPlantForm plantId="12" name="Tomato" />
        </div>
    )
}

export default Plant
