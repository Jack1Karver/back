
import { AccountOptions, ContractPackage } from '@eversdk/appkit';
import { sleep } from '../utils/contract.util';
import { AbstractAccount } from './abstract.account';

export abstract class AbstractNftDataAccount extends AbstractAccount {
  constructor(contract: ContractPackage, accountOptions: AccountOptions) {
    super(contract, accountOptions);
  }

  abstract getOwner(): Promise<string>;

  abstract getAllowance(): Promise<string | null>;

  abstract getRoyalty(): Promise<number>;

  abstract getNftRootAddress(): Promise<string>;

  abstract resolveIndexAddress(addrOwner?: string): Promise<string>;

  async waitAllowanceChanges() {
    let allowance;
    this.setAccount();

    try {
      allowance = await this.getAllowance();
      let i = 0;

      while (allowance && i < 60) {
        // We need to create new instance of acc to get updated data
        this.setAccount();

        allowance = await this.getAllowance();
        i++;

        await sleep(1000);
      }
    } catch (e) {
      allowance = null;
    }

    return allowance;
  }
}
