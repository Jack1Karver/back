import { Types } from 'mongoose';

export interface IOfferInfo {
  itemAddress: string;
  userId: Types.ObjectId;
  userAddress: string;
  offerId: Types.ObjectId;
  contractAddress: string;
}
