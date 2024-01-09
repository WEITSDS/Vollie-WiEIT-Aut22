import { IVolunteerTypeUserWithApproved } from "../../api/volTypeAPI";
import { YEAR_MILLISECONDS } from "./constants";
import { Filters, VolType } from "./types";

export const getDefaultFilters = (defaultVolTypes?: IVolunteerTypeUserWithApproved[]) => {
    return {
        from: new Date(),
        to: new Date(Date.now() + YEAR_MILLISECONDS),
        category: "All",
        hours: "All",
        volTypes:
            defaultVolTypes?.map((type) => {
                return {
                    label: type.name,
                    value: type._id,
                };
            }) || ([] as VolType[]),
        hideUnavailable: false,
        location: "",
    } as Filters;
};
