import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getQualTypeById, IQualificationType } from "../api/qualificationTypeAPI";
import { ResponseWithData } from "../api/utility";

export const useQualificationTypeById = (
    qualTypeId: string
): UseQueryResult<ResponseWithData<IQualificationType>, Error> => {
    return useQuery([`qual-type-${qualTypeId}`, qualTypeId], () => getQualTypeById(qualTypeId), {
        // The query will not execute until the userId exists
        enabled: !!qualTypeId,
    });
};
