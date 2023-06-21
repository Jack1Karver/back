import { ICarFeatures } from "../../../models/car-features.model";
import { IUserDto } from "../../user/dto/user.dto";
import { ICarFeaturesDto } from "./car.dto";

export interface ICarPrototypeDto{
    id?: number;
    carFeatures: ICarFeaturesDto;
    description: string;
    owner: IUserDto;
    files?: string[];
    json?: string;
    jsonHash?: string;
}