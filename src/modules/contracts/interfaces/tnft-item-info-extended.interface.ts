import { ITnftItemInfo } from 'src/module/item/interfaces/tnft-item-info.interface';

export interface ITnftItemInfoExtended extends ITnftItemInfo {
  royalty: number;
}
