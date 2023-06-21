
import { AccountOptions, ContractPackage } from '@eversdk/appkit';
import { offerContractsEventsEnum } from '../offer/enums/offer-contracts-events.enum';
import { AbstractAccount } from '../../contract-accounts/abstract.account';


export abstract class AbstractOfferAccount extends AbstractAccount {
  constructor(contract: ContractPackage, accountOptions: AccountOptions) {
    super(contract, accountOptions);
  }

  abstract isActive(): Promise<boolean>;

  abstract getInfoFromClosed(): Promise<{
    status: offerContractsEventsEnum;
    newOwner?: string;
  }>;
}
