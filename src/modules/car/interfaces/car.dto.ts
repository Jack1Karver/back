import { driveType } from "../../../interfaces/enums/drive-type";
import { engineType } from "../../../interfaces/enums/engine-type";
import { gearboxType } from "../../../interfaces/enums/gearbox-type";
import { IOffer } from "../../../models/offer.model";
import { IUser } from "../../../models/user.model";
import { IModelDto } from "./model.dto";

export interface ISimpleCar {
  id: string;
  files: string[];
  address?: string;
  carFeatures: ICarFeaturesDto
}

export interface ICar extends ISimpleCar{
  owner: IUser;
  description: string;
  dateCreated: Date;
  status: string;
  jsonHash: string;
  offer?: IOffer;
}

export interface ICarFeaturesDto {
  id?:number;
  model: IModelDto;
  yearProd: number;
  engineType: string;
  driveType: string;
  gearboxType: string;
  hp: number;
  engineCapacity?: number;
  color: string;
  mileage: number;
}
