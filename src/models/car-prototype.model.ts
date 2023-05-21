import { IFile } from "./file.model";

export interface ICarPrototype {
    id: number;
    car_features_id: number;
    owner_id: number;
    description: string;
    address?: string;
    json?: string;
    json_hash?: string
  }