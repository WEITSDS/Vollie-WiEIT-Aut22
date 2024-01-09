import { IVolunteerType, IVolunteerTypeUserWithApproved } from "../../api/volTypeAPI";

export interface FilterResultsModalProps {
    visible: boolean;
    filters: Filters;
    updateFilters: (filters: Filters) => void;
    onClose: () => void;
    allVolTypes?: IVolunteerType[];
    userVolTypes: IVolunteerTypeUserWithApproved[];
}

export interface VolType {
    label: string;
    value: string;
}

export interface Filters {
    to: Date;
    from: Date;
    volTypes: VolType[];
    category: string;
    hours: string;
    hideUnavailable: boolean;
    location: string;
    limit?: number;
}
