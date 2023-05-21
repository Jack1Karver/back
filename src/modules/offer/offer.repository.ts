import { AbstractRepository } from "../../db/abstract.repository";
import { IOffer } from "../../models/offer.model";


export class OfferRepository extends AbstractRepository{

    async findByAddress(sellDeployedEventMsgId: string) {
        return (await this.getByFields('offer', {address: sellDeployedEventMsgId}))[0] as IOffer
    }

    async findOpenedByAddress(offerAddress: string): Promise<IOffer> {
        return (await this.connection.sqlQuery(`SELECT offer.* 
        FROM offer 
        JOIN status ON status.id = offer.status_id
        WHERE status.status = 'opened' AND contract_address = ${offerAddress}`))[0] as IOffer
    }

    async findAllOpened(){
        return await this.connection.sqlQuery(`SELECT offer.* 
        FROM offer 
        JOIN status ON status.id = offer.status_id
        WHERE status.status = 'opened'`) as IOffer[]
    }

    async getStatus(id: number){
        return (await this.connection.sqlQuery(`SELECT status.status FROM status WHERE id=${id}`))[0] as string
    }
}