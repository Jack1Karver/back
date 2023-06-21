import { IMarkDto } from "./mark.dto";

export interface IModelDto{
    id: number;
    name: string;
    mark: IMarkDto
    class?: string;
    year_from: number;
    year_to?: number;
}