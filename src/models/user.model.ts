import { IWallet } from "./wallet.model";

export interface IUser {
    id: number;
    slug: string;
    wallet: IWallet;
    name: string;
    bio?: string;
    role: string;
    email?: string;
    nonce: string;
    memo: string;
    status: string;
    notificationEmail?: {
      email: string;
      isConfirmed: boolean;
    };
    dateRegister: Date
  }
  