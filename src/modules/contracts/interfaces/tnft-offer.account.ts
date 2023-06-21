import { AccountOptions, ContractPackage } from '@eversdk/appkit';
import { abiJson } from '@eversdk/core';
import { AbstractOfferAccount } from '../abstract-offer.account';
import { fromNano } from '../../../utils/contract.util';
import { offerContractsEventsEnum } from '../../offer/enums/offer-contracts-events.enum';


export class TnftOfferAccount extends AbstractOfferAccount {
  constructor(contract: ContractPackage, accountOptions: AccountOptions) {
    super(contract, accountOptions);
  }

  async isActive(): Promise<boolean> {
    return (await this.account.runLocal('isActive', {})).decoded!.output.isActive;
  }

  async getPrice(): Promise<number> {
    const price = (await this.account.runLocal('price', {})).decoded!.output?.price;

    return fromNano(price);
  }  

  async getInfoFromClosed(): Promise<{
    created_at: number;
    status: offerContractsEventsEnum;
    newOwner?: string;
  }> {
    const messages = (
      await this.client.net.query_collection({
        collection: 'messages',
        filter: {
          src: {
            eq: await this.account.getAddress(),
          },
          msg_type: { eq: 2 },
        },
        result: 'boc created_at',
      })
    ).result as { boc: string; created_at: number }[];

    let offerInfo;

    if (messages?.length) {
      for (let i = 0; i < messages.length; i++) {
        const message = await this.account.decodeMessage(messages[i].boc);
        const isEvent = message?.body_type === 'Event';

        if (isEvent && message.name === offerContractsEventsEnum.sellConfirmed) {
          offerInfo = {
            created_at: messages[i].created_at,
            status: offerContractsEventsEnum.sellConfirmed,
            newOwner: message.value.newOwner,
          };

          break;
        } else if (isEvent && message.name === offerContractsEventsEnum.sellCancelled) {
          offerInfo = {
            created_at: messages[i].created_at,
            status: offerContractsEventsEnum.sellCancelled,
          };
          break;
        }
      }
    }

    return offerInfo;
  }
}
