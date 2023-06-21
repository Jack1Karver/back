import { Account, AccountOptions, ContractPackage } from '@eversdk/appkit';
import { AbiContract, TonClient } from '@eversdk/core';

export abstract class AbstractAccount {
  protected contract: ContractPackage;
  protected accountOptions: AccountOptions;
  protected account: Account;
  protected readonly client: TonClient;
  readonly abi: AbiContract;

  protected constructor(contract: ContractPackage, accountOptions: AccountOptions) {
    this.contract = contract;
    this.accountOptions = accountOptions;

    this.abi = contract.abi;
    this.client = accountOptions.client!;
    this.account = new Account(<ContractPackage>(<unknown>this.contract), {
      client: this.accountOptions.client,
      address: this.accountOptions.address,
      signer: this.accountOptions.signer,
    });
  }

  protected setAccount() {
    this.account = new Account(<ContractPackage>(<unknown>this.contract), {
      client: this.accountOptions.client,
      address: this.accountOptions.address,
      signer: this.accountOptions.signer,
    });
  }

  public async getAccountType(): Promise<number> {
    return (await this.account.getAccount()).acc_type;
  }

  public async getAddress(): Promise<string> {
    return this.account.getAddress();
  }

  public decodeMessage(message: string): Promise<any> {
    return this.account.decodeMessage(message);
  }
}
