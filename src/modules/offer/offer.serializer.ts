import { IOffer } from "../../models/offer.model";
import { IOfferDto } from "./interfaces/offer.interface";
import { OfferRepository } from "./offer.repository";


export class OfferSerializer{
    offerRepository = new OfferRepository()

    async serializeOffer(offer: IOffer): Promise<IOfferDto> {

        return {
          id: offer.id,
          contractAddress: offer.contract_address,
          carId: offer.car_id,
          price: offer.price,
          dateCreated: offer.date_created,
          dateClosed: offer.date_closed,
          status: offer.status_id ? (await this.offerRepository.getStatus(offer.status_id)).status: '',
          messageId: offer.message_id,
        };
      }
    
}