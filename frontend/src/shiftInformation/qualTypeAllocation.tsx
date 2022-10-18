import { IShiftRequiredQualification } from "../api/shiftApi";
import { useQualificationTypeById } from "../hooks/useQualificationTypeById";

export const QualTypeAllocation = ({ qualAllocationObj }: { qualAllocationObj: IShiftRequiredQualification }) => {
    const { isLoading, data } = useQualificationTypeById(qualAllocationObj.qualificationType);

    return (
        <tr>
            {isLoading && <td>Loading...</td>}
            {data?.data && (
                <>
                    <td>{data?.data.name}</td>
                    <td>{qualAllocationObj.numRequired}</td>
                    <td>{qualAllocationObj.currentNum}</td>
                    <td>{qualAllocationObj.numRequired - qualAllocationObj.currentNum}</td>
                </>
            )}
        </tr>
    );
};
