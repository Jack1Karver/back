import { ICountry } from "../../../models/country.model";

export interface IMarkDto {
    id: number;
    name: string;
    popular: boolean;
    country: ICountry;
  }