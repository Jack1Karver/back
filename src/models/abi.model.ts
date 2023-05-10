import { abiTypesEnum } from "../interfaces/enums/abi-types.enum";

export interface IAbi  {
    id: number;
    abi: string;
    type: abiTypesEnum;
  }