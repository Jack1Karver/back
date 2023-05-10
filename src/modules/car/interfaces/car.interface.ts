import { driveType } from "../../../interfaces/enums/drive-type";
import { engineType } from "../../../interfaces/enums/engine-type";
import { gearboxType } from "../../../interfaces/enums/gearbox-type";
import { IOffer } from "../../../models/offer.model";
import { IUser } from "../../../models/user.model";
import { IModelDto } from "./model.interface";

export interface ISimpleCar {
  id: string;
  files: string[];
  address?: string;
  car_features: ICarFeatures
}

export interface ICar extends ISimpleCar{
  owner: IUser;
  description: string;
  dateCreated: Date;
  status: string;
  jsonHash: string;
  offer: IOffer;
}

export interface ICarFeatures extends ISimpleCar {
  model: IModelDto;
  year_prod: number;
  engine_type: engineType;
  drive_type: driveType;
  gearbox_type: gearboxType;
  hp: number;
  engine_capacity: number;
  color: string;
  mileage: number;
}
