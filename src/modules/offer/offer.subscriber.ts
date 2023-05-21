import { DecodedMessageBody, MessageBodyType, ResultOfSubscribeCollection, abiContract, abiJson } from '@eversdk/core';
import { ContractsService } from '../contracts/contracts.service';
import { OfferService } from './offer.service';
import { CarService } from '../car/car.service';
import { ROOTS } from '../../config/roots.config';
import { IMessage } from '../contracts/interfaces/message.interface';
import { ResponseType } from '@eversdk/core/dist/bin';
import { SellContract } from '../../../tnft/contracts-compiled/market/SellContract';
import { SellRootContract } from '../../../tnft/contracts-compiled/market/SellRootContract';
import { offerContractsEventsEnum } from './enums/offer-contracts-events.enum';
import { statusEnum } from './enums/status.enum';

export class OfferSubscriber {
  private messagesSubscription: Record<string, ResultOfSubscribeCollection> = {};
  private sellRoots: { address: string; abi: string }[] = [];
  private rootAddresses: string[] = [];
  private offerAddresses: { [key: string]: boolean } = {};

  constructor(
    private readonly contractsService: ContractsService,
    private readonly offerService: OfferService,
    private readonly carService: CarService
  ) {}

  onModuleInit(): void {
    (async () => {
      this.sellRoots.push(ROOTS.sellRoot);
      this.rootAddresses = this.sellRoots.map(root => root.address);

      const tnftOffers = await this.offerService.findAllOpened();

      tnftOffers.forEach(offer => {
        if (offer.contractAddress && offer.status === statusEnum.opened) {
          this.offerAddresses[offer.contractAddress] = true;
        }
      });

      this.subscribe();
    })();
  }

  private async subscribe(): Promise<void> {
    this.subscribeToRoots();
    this.subscribeToOffers();
  }

  private async subscribeToRoots(): Promise<void> {
    await this.contractsService.wsClient.net.subscribe_collection(
      {
        collection: 'messages',
        filter: {
          src: { in: this.rootAddresses },
          msg_type: { eq: 2 },
        },
        result: 'boc id created_at src',
      },
      async (message: IMessage, responseType: number) => {
        try {
          console.log(`SELL_ROOT_CONTRACT_MESSAGE: ${JSON.stringify({ responseType, message })}`);

          if (responseType === ResponseType.Custom) {
            this.decodeAndProcessSellRootMessage(message.result);
          }
        } catch (err) {
          console.log(err);
        }
      }
    );

    console.log(`SUBSCRIBED_TO_SELL_ROOTS: ${JSON.stringify(this.rootAddresses)}`);
  }

  private async subscribeToOffer(address: string): Promise<void> {
    this.messagesSubscription[address] = await this.contractsService.wsClient.net.subscribe_collection(
      {
        collection: 'messages',
        filter: {
          src: { eq: address },
          msg_type: { eq: 2 },
        },
        result: 'boc dst src id created_at',
      },
      async (message: IMessage, responseType: number) => {
        try {
          console.log(`SELL_CONTRACT_MESSAGE: ${JSON.stringify({ responseType, message, address })}`);

          if (responseType === ResponseType.Custom) {
            const decoded = await this.contractsService.client.abi.decode_message({
              abi: abiContract(SellContract.abi),
              message: message.result.boc,
            });

            console.log('SELL_CONTRACT_MESSAGE_BODY_TYPE: ' + decoded.body_type);

            if (decoded.body_type == MessageBodyType.Event) {
              await this.processOfferClosing(decoded, message.result);
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    );
  }

  private async subscribeToOffers(): Promise<void> {
    this.messagesSubscription = {};
    const addresses = Object.keys(this.offerAddresses);

    if (addresses.length) {
      for (const address of addresses) {
        await this.subscribeToOffer(address);
      }
    }
  }

  private async decodeAndProcessSellRootMessage(message: { boc: string; id: string; created_at: number; src: string }) {
    const sellRoot = this.sellRoots.find(root => root.address === message.src);

    const decoded = await this.contractsService.client.abi.decode_message({
      abi: ROOTS.sellRoot?.abi ? abiJson(ROOTS.sellRoot.abi) : abiContract(SellRootContract.abi),
      message: message.boc,
    });

    console.log(`SELL_ROOT_MESSAGE_DECODED: ${JSON.stringify(decoded)}`);

    if (decoded.body_type == MessageBodyType.Event) {
      await this.offerService.createOfferFromTnftEvent({
        eventValue: decoded.value,
        dateCreatedTimestamp: message.created_at,
        sellDeployedEventMsgId: message.id,
        sellRoot,
      });
    }
  }

  private async processOfferClosing(
    decoded: DecodedMessageBody,
    message: {
      boc: string;
      dst: string;
      src: string;
      id: string;
      created_at: number;
    }
  ): Promise<void> {
    const offerAddress = message.src;
    const offer = await this.offerService.findOpenedByAddress(offerAddress);
    const car = await this.carService.findCar(offer.carId)
    if(car){
    switch (decoded.name) {
      case offerContractsEventsEnum.sellConfirmed:
        await this.offerService.closeOfferFromTnftEvent({
          sellConfirmedEvent: {
            offerAddress: offer.contractAddress,
            nftAddress: car.address,
            newOwnerAddress: decoded.value.newOwner,
          },
          dateTimestamp: message.created_at,
        });
        break;
      case offerContractsEventsEnum.sellCancelled:
        await this.offerService.cancelOfferFromTnftEvent({
          sellCancelledEvent: {
            offerAddress: offer.contractAddress,
            nftAddress: car.address,
          },
          dateTimestamp: message.created_at,
        });
    }
}
  }

  async addOfferAddress(address: string): Promise<void> {
    this.offerAddresses[address] = true;
    await this.subscribeToOffer(address);
    console.log(`OFFER_ADDED_TO_SUBSCRIPTION: ${JSON.stringify({ address })}`);
  }

  async removeOfferAddress(address: string): Promise<void> {
    delete this.offerAddresses[address];
    await this.contractsService.wsClient.net.unsubscribe(this.messagesSubscription[address]);
    delete this.messagesSubscription[address];
    console.log(`OFFER_REMOVED_FROM_SUBSCRIPTION: ${JSON.stringify({ address })}`);
  }

}
