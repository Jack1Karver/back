import { AccountOptions, ContractPackage } from '@eversdk/appkit';
import { AbstractNftDataAccount } from './abstract-nft-data.account';
import { ITnftItemInfo } from '../modules/contracts/interfaces/tnft-item-info.interface';
import { ITnftItemInfoExtended } from '../modules/contracts/interfaces/tnft-item-info-extended.interface';



export class TnftDataAccount extends AbstractNftDataAccount {
  constructor(contract: ContractPackage, accountOptions: AccountOptions) {
    super(contract, accountOptions);
  }

  async getAllowance(): Promise<string | null> {
    try {
      return (await this.account.runLocal('getAllowance', {})).decoded?.output?.addr;
    } catch (e) {
      return null;
    }
  }

  async getInfo(): Promise<ITnftItemInfo> {
    return (await this.account.runLocal('getInfo', {})).decoded?.output;
  }

  async getRoyalty(): Promise<number> {
    return (await this.account.runLocal('royalty', {})).decoded?.output?.royalty;
  }

  async getInfoExtended(): Promise<ITnftItemInfoExtended> {
    return {
      ...(await this.getInfo()),
      royalty: await this.getRoyalty(),
    };
  }

  async getSellRootAddress(): Promise<string> {
    return (await this.account.runLocal('getManagersList', {})).decoded?.output.managers[0];
  }

  async getAuctionRootAddress(): Promise<string> {
    return (await this.account.runLocal('getManagersList', {})).decoded?.output.managers[1];
  }

  async getNftRootAddress(): Promise<string> {
    return (await this.getInfo()).addrRoot;
  }

  async getOwner(): Promise<string> {
    return (await this.account.runLocal('getOwner', {})).decoded!.output.addrOwner;
  }

  async resolveIndexAddress(addrOwner?: string): Promise<string> {
    return (
      await this.account.runLocal('resolveIndex', {
        addrRoot: await this.getNftRootAddress(),
        addrOwner: addrOwner ?? (await this.getOwner()),
        addrData: await this.getAddress(),
      })
    ).decoded!.output.addrIndex;
  }
}
