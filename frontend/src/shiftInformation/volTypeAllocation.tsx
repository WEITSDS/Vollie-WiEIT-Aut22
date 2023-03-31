import { IShiftVolunteerAllocations } from "../api/shiftApi";
import { useVolunteerTypeById } from "../hooks/useVolunteerTypeById";

export const VolTypeAllocation = ({ volAllocationObj }: { volAllocationObj: IShiftVolunteerAllocations }) => {
    const { isLoading, data } = useVolunteerTypeById(volAllocationObj.type);

    return (
        <tr>
            {isLoading && <td>Loading...</td>}
            {data?.data && (
                <>
                    <td>{data?.data.name}</td>
                    <td>{volAllocationObj.numMembers}</td>
                    <td>{volAllocationObj.users.length}</td>
                    <td>{volAllocationObj.numMembers - volAllocationObj.users.length}</td>
                </>
            )}
        </tr>
    );
};
