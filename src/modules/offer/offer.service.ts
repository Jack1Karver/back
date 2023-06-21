import { ROOTS } from '../../config/roots.config';
import { AbstractNftDataAccount } from '../../contract-accounts/abstract-nft-data.account';
import { deployedStatusEnum } from '../../interfaces/enums/deployed-status.enum';
import { IOffer } from '../../models/offer.model';
import { IUser } from '../../models/user.model';
import { fromNano } from '../../utils/contract.util';
import { CarService } from '../car/car.service';
import { ICar } from '../car/interfaces/car.dto';
import { ContractsService } from '../contracts/contracts.service';
import { IUserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { blockingReasonsEnum } from './enums/blocking-reasons.enum';
import { offerContractsEventsEnum } from './enums/offer-contracts-events.enum';
import { statusEnum } from './enums/status.enum';
import { ICreateOffer } from './interfaces/create-offer.interface';
import { IOfferInfo } from './interfaces/offer-error.interface';
import { IOfferDto } from './interfaces/offer.interface';
import { ISellCancelled } from './interfaces/sell-cancelled.interface';
import { ISellConfirmed } from './interfaces/sell-confirmed.interface';
import { ISellDeployedTnftEvent } from './interfaces/sell-deployed-tnft-event.interface';
import { ISellDeployed } from './interfaces/sell-deployed.interface';
import { OfferRepository } from './offer.repository';
import { OfferSerializer } from './offer.serializer';

export class OfferService {
  offerRepository = new OfferRepository();
  userService = new UserService();
  carService = new CarService();
  contractsService = new ContractsService();
  offerSerializer = new OfferSerializer()

  async findOpenedByAddress(offerAddress: string) {
    return await this.offerSerializer.serializeOffer(await this.offerRepository.findOpenedByAddress(offerAddress));
  }

  async findAllOpened() {
    return await Promise.all(
      (
        await this.offerRepository.findAllOpened()
      ).map(async offer => {
        return await this.offerSerializer.serializeOffer(offer);
      })
    );
  }

  async findByCarId(car_id: string){
    return await this.offerRepository.findByCarId(car_id)
  }

  async createOfferFromTnftEvent({
    eventValue,
    dateCreatedTimestamp,
    sellDeployedEventMsgId,
    sellRoot,
  }: {
    eventValue: ISellDeployedTnftEvent;
    dateCreatedTimestamp: number;
    sellDeployedEventMsgId: string;
    sellRoot: string;
  }) {
    const sellDeployedEvent: ISellDeployed = {
      nftAddress: eventValue.offerInfo.addrData,
      ownerAddress: eventValue.offerInfo.addrOwner,
      offerAddress: eventValue.offerAddress,
      price: +eventValue.offerInfo.price,
    };

    return this.createOfferFromEvent({
      sellDeployedEvent,
      dateCreated: new Date(dateCreatedTimestamp * 1000),
      sellDeployedEventMsgId,
      sellRoot,
    });
  }

  async createOfferFromEvent({
    sellDeployedEvent,
    dateCreated,
    sellDeployedEventMsgId,
    sellRoot,
    accountDeploymentMsgId,
  }: {
    sellDeployedEvent: ISellDeployed;
    dateCreated: Date;
    sellDeployedEventMsgId: string;
    sellRoot: string;
    accountDeploymentMsgId?: string;
  }) {
    // If offer with such a message id exists - skip, it was already processed
    const existingOffer = await this.isDocumentExists(sellDeployedEventMsgId);

    if (existingOffer?.contract_address) {
      return existingOffer;
    }

    // Find user and offer, create them if it was creation via deBot
    const user = await this.userService.getUserByWalletAddress(sellDeployedEvent.ownerAddress);
    if (user) {
      const offer = await this.createOrUpdate(user, {
        sellRootAddress: sellRoot,
        itemAddress: sellDeployedEvent.nftAddress,
        price: sellDeployedEvent.price,
        sellDeployedEventMsgId,
        dateCreated,
      });

      const offerDeployedInfo = await this.checkIsOfferDeployed(
        sellDeployedEvent.offerAddress,
        sellDeployedEventMsgId,
        accountDeploymentMsgId
      );

      // Account wasn't deployed, message came from subscription
      if (offerDeployedInfo.status === deployedStatusEnum.rejected) {
        console.log('BLOCKCHAIN_FAILED_PUT_ON_SALE');
        return;
      }

      return this.confirmCreateOffer({
        carAddress: sellDeployedEvent.nftAddress,
        offer,
        offerAddress: sellDeployedEvent.offerAddress,
        accountDeploymentMsgId,
      });
    }
  }

  async confirmCreateOffer({
    carAddress,
    offer,
    offerAddress,
    accountDeploymentMsgId,
  }: {
    carAddress: string;
    offer: IOffer;
    offerAddress: string;
    accountDeploymentMsgId?: string;
  }): Promise<IOffer> {
    const car = await this.carService.findCarByAddress(carAddress);
    let confirmedOffer;

    if (car) {
      confirmedOffer = await this.confirmOffer({
        car,
        offer,
        offerAddress,
        accountDeploymentMsgId,
      });

      console.log(`BLOCKCHAIN_ADD_OFFER: ${offerAddress}`);

      return confirmedOffer;
    } else {
      throw new Error();
    }
  }
  private async confirmOffer({
    car,
    offer,
    offerAddress,
    accountDeploymentMsgId,
  }: {
    car: ICar;
    offer: IOffer;
    offerAddress: string;
    accountDeploymentMsgId?: string;
  }): Promise<IOffer> {
    const updateDto: Partial<IOffer> = {
      contract_address: offerAddress,
      price: fromNano(offer.price),
    };

    return this.updateOffer(offer, car ? statusEnum.opened : statusEnum.pending, updateDto);
  }

  async updateOffer(offer: IOffer, status: statusEnum, updateDto: Partial<IOffer> = {}): Promise<IOffer> {
    return await this.offerRepository.updateOffer({
      id: offer.id,
      status_id: await this.getStatusId(status),
      ...updateDto,
    });
  }

  async getStatusId(status: string) {
    return await this.offerRepository.getStatusId(status);
  }

  collectOfferInfo(carAddress: string, offer: IOffer, user?: IUserDto): IOfferInfo {
    return {
      carAddress,
      offerId: offer.id,
      contractAddress: offer.contract_address,
      userId: user?.id,
      userAddress: user?.wallet?.address,
    };
  }

  async createOrUpdate(user: IUserDto, createOfferInfo: ICreateOffer): Promise<IOffer> {
    let offer = await this.offerRepository.findByMessageId(createOfferInfo.sellDeployedEventMsgId);

    const car = await this.carService.findCarByAddress(createOfferInfo.itemAddress);
    const status = car!.id ? statusEnum.opened : statusEnum.pending;

    const offerFields: Partial<IOffer> = {
      contract_address: '',
      car_id: car!.id ?? null,
      price: createOfferInfo.price,
      date_created: createOfferInfo.dateCreated,
      message_id: createOfferInfo.sellDeployedEventMsgId,
    };

    if (offer) {
      return await this.updateOffer(offer, status, offerFields);
    } else {
      return  await this.offerRepository.createOffer(offerFields);
    }    
  }

  async checkIsOfferDeployed(offerAddress: string, sellDeployedEventMsgId: string, accountDeploymentMsgId?: string) {
    // Wait until sell contract is deployed
    const deployed = await this.contractsService.waitForContractDeployment(
      offerAddress,
      accountDeploymentMsgId ? 20000 : 60000
    );

    // Account wasn't deployed, message came from subscription
    if (!deployed && !accountDeploymentMsgId) {
      return {
        status: deployedStatusEnum.rejected,
      };
    }

    // Search event message, then get id of deployment message from parent transaction
    accountDeploymentMsgId =
      accountDeploymentMsgId ??
      (
        await this.contractsService.client.net.query_collection({
          collection: 'messages',
          filter: {
            id: { eq: sellDeployedEventMsgId },
          },
          result: 'boc id src_transaction { out_messages {id boc msg_type} }',
        })
      ).result[0].src_transaction.out_messages.find((outMessage: any) => outMessage.msg_type != 2).id;

    if (!accountDeploymentMsgId) {
      return {
        status: deployedStatusEnum.rejected,
      };
    }

    return {
      status: deployedStatusEnum.deployed,
      accountDeploymentMsgId,
    };
  }

  async isDocumentExists(sellDeployedEventMsgId: string) {
    return await this.offerRepository.findByMessageId(sellDeployedEventMsgId);
  }

  async cancelOfferFromEvent({
    sellCancelledEvent,
    date,
  }: {
    sellCancelledEvent: ISellCancelled;
    date: number;
  }): Promise<IOffer | null> {
    const offer = await this.offerRepository.findByAddress(sellCancelledEvent.offerAddress);
    const car = await this.carService.findCarByAddress(sellCancelledEvent.nftAddress);

    if (!offer || !car) {
      throw new Error();
    }

    console.log(`CANCEL_OFFER: ${JSON.stringify({ offerId: offer.id })}`);

    let nftDataAccount: AbstractNftDataAccount;

    nftDataAccount = await this.contractsService.getTnftDataAccount(car.address!, ROOTS.nftRoot.abi);

    const allowance = await nftDataAccount.waitAllowanceChanges();

    if (allowance) {
      await this.rejectCancelOffer(car, offer);
      return null;
    }

    return this.confirmCancelOffer(car, offer, new Date(date));
  }

  async confirmCancelOffer(car: ICar, offer: IOffer, date_closed: Date): Promise<IOffer> {
    const closedOffer = await this.updateOffer(offer, statusEnum.canceled, { date_closed });

    console.log(`BLOCKCHAIN_CANCEL_OFFER: ${JSON.stringify({ offerId: offer.id })}`);

    return closedOffer;
  }

  async rejectCancelOffer(car: ICar, offer: IOffer) {
    const errorInfo = this.collectOfferInfo(car.address!, offer);

    console.log(`BLOCKCHAIN_FAILED_CANCEL_SALE: ${JSON.stringify(errorInfo)}`);
  }

  async rejectCloseOffer(newOwner: IUserDto, car: ICar, offer: IOffer) {
    const offerInfo = this.collectOfferInfo(car.address!, offer, newOwner);

    console.log(`BLOCKCHAIN_FAILED_BUY_TOKEN: ${JSON.stringify(offerInfo)}`);
  }

  async closeOfferFromEvent({ sellConfirmedEvent, date }: { sellConfirmedEvent: ISellConfirmed; date: Date }) {
    const car = await this.carService.findCarByAddress(sellConfirmedEvent.nftAddress);
    const offer = await this.offerRepository.findByAddress(sellConfirmedEvent.offerAddress);

    if (!car || !offer || (await this.offerSerializer.serializeOffer(offer)!).status !== statusEnum.opened) {
      return;
    }

    let nftDataAccount: AbstractNftDataAccount;

    nftDataAccount = this.contractsService.getTnftDataAccount(car.address!, ROOTS.nftRoot.abi);

    await this.updateOffer(offer, statusEnum.closing, { date_closed: date });

    console.log(`CLOSE_OFFER: ${JSON.stringify({ offerId: offer.id })}`);

    // Find user or create new one if he bought via surf, oberton(everspace) or deBot
    const user = await this.userService.findOrCreateUserWithWallet(sellConfirmedEvent.newOwnerAddress);

    try {
      await this.confirmCloseOffer(user, car, offer);
    } catch (e) {
      console.error(`OFFER_CLOSING: ${JSON.stringify(e)}`);
    }
  }

  async confirmCloseOffer(newOwner: IUserDto, car: ICar, offer: IOffer): Promise<IOffer> {
    const offerInfo = this.collectOfferInfo(car.address!, offer, newOwner);
    let updatedOffer;

    updatedOffer = await this.updateOffer(offer, statusEnum.closed);
    const updateCar = await this.carService.updateOwner(newOwner.id, car.id);

    console.log(`BLOCKCHAIN_BUY_TOKEN: ${JSON.stringify(offerInfo)}`);    

    return updatedOffer;
  }  
}
