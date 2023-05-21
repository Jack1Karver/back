import { deployedStatusEnum } from '../../interfaces/enums/deployed-status.enum';
import { IOffer } from '../../models/offer.model';
import { IUser } from '../../models/user.model';
import { fromNano } from '../../utils/contract.util';
import { CarService } from '../car/car.service';
import { ICar } from '../car/interfaces/car.dto';
import { IUserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { blockingReasonsEnum } from './enums/blocking-reasons.enum';
import { statusEnum } from './enums/status.enum';
import { ICreateOffer } from './interfaces/create-offer.interface';
import { IOfferInfo } from './interfaces/offer-error.interface';
import { IOfferDto } from './interfaces/offer.interface';
import { ISellDeployedTnftEvent } from './interfaces/sell-deployed-tnft-event.interface';
import { ISellDeployed } from './interfaces/sell-deployed.interface';
import { OfferRepository } from './offer.repository';

export class OfferService {
  offerRepository = new OfferRepository();
  userService = new UserService();
  carService = new CarService();

  async findOpenedByAddress(offerAddress: string) {
    return await this.serializeOffer(await this.offerRepository.findOpenedByAddress(offerAddress));
  }

  async findAllOpened() {
    return await Promise.all(
      (
        await this.offerRepository.findAllOpened()
      ).map(async offer => {
        return await this.serializeOffer(offer);
      })
    );
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

    if (existingOffer?.contractAddress) {
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
        user,
        carAddress: sellDeployedEvent.nftAddress,
        offer,
        offerAddress: sellDeployedEvent.offerAddress,
        accountDeploymentMsgId,
      });
    }
  }

  async confirmCreateOffer({
    user,
    carAddress,
    offer,
    offerAddress,
    accountDeploymentMsgId,
  }: {
    user: IUserDto;
    carAddress: string;
    offer: IOfferDto;
    offerAddress: string;
    accountDeploymentMsgId?: string;
  }): Promise<IOfferDto> {
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

      await this.carService.unfreeze(car.id, { offer: offer.id });

      return confirmedOffer;
    } else{
        throw new Error
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
  }):Promise<IOfferDto> {
    const updateDto: Record<string, any> = {
      contractAddress: offerAddress,
      accountDeploymentMsgId,
      price: fromNano(offer.price),
    };

    return this.updateOffer(offer, car ? statusEnum.opened : statusEnum.pending, updateDto);
  }

  collectOfferInfo(itemAddress: string, offer: IOfferDto, user: IUserDto): IOfferInfo {
    return {
      itemAddress,
      offerId: offer.id,
      contractAddress: offer.contractAddress,
      userId: user?.id,
      userAddress: user?.wallet?.address,
    };
  }

  async createOrUpdate(user: IUserDto, createOfferInfo: ICreateOffer): Promise<IOfferDto> {
    let offer = await this.offerModel.findOne<IOffer>({
      sellDeployedEventMsgId: createOfferInfo.sellDeployedEventMsgId,
    });

    const car = await this.carService.findCarByAddress(createOfferInfo.itemAddress);
    const status = car!.id ? statusEnum.opened : statusEnum.pending;

    const offerFields = {
      contractAddress: '',
      owner: user.id,
      carId: car!.id ?? null,
      itemAddress: createOfferInfo.itemAddress,
      price: createOfferInfo.price,
      dateCreated: createOfferInfo.dateCreated,
      status,
      sellDeployedEventMsgId: createOfferInfo.sellDeployedEventMsgId,
    };

    if (offer) {
      offer = await this.updateOffer(offer, status, offerFields);
    } else {
      const createdOffer = await new this.offerModel(offerFields).save();

      offer = await createdOffer.populate(this._populateQuery);
    }

    if (car) {
      await this.carService.freeze(car.id, blockingReasonsEnum.offer);
    }

    if (offer) {
      this.logger.log(`ADD_OFFER: ${JSON.stringify(this.collectOfferInfo(createOfferInfo.itemAddress, offer, user))}`);

      return offer;
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
    return await this.serializeOffer(await this.offerRepository.findByAddress(sellDeployedEventMsgId));
  }

  async serializeOffer(offer: IOffer): Promise<IOfferDto> {
    return {
      id: offer.id,
      contractAddress: offer.contract_address,
      carId: offer.car_id,
      price: offer.price,
      dateCreated: offer.date_created,
      dateClosed: offer.date_closed,
      status: await this.offerRepository.getStatus(offer.status_id),
    };
  }
}
