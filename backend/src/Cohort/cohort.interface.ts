import { Document } from "mongoose";

export interface ICohort extends Document {
    //cohort for ambassadors (e.g. Spring 2023 - Spring 2024)
    _id: string;
    name: string;
}
