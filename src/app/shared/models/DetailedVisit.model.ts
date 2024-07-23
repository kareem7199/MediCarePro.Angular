import { Diagnosis } from "./Diagnosis.model";

export interface DetailedVisit {
  id: number;
  patientName: string;
  diagnoses : Diagnosis[];
  physicanFees: number;
  date : Date
}
