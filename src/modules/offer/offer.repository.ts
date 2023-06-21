import { AbstractRepository } from "../../db/abstract.repository";
import { IOffer } from "../../models/offer.model";
import { IStatus } from "../../models/status.model";


export class OfferRepository extends AbstractRepository{

    async findByAddress(sellDeployedEventMsgId: string) {
        return (await this.getByFields('offer', {contract_address: sellDeployedEventMsgId}))[0] as IOffer
    }

    async findByMessageId(sellDeployedEventMsgId: string) {
        return (await this.getByFields('offer', {message_id: sellDeployedEventMsgId}))[0] as IOffer
    }

    async findOpenedByAddress(offerAddress: string): Promise<IOffer> {
        return (await this.connection.sqlQuery(`SELECT offer.* 
        FROM offer 
        JOIN status ON status.id = offer.status_id
        WHERE status.status = 'opened' AND contract_address = '${offerAddress}'`))[0] as IOffer
    }

    async findAllOpened(){
        return await this.connection.sqlQuery(`SELECT offer.* 
        FROM offer 
        JOIN status ON status.id = offer.status_id
        WHERE status.status = 'opened'`) as IOffer[]
    }

    async getStatus(id: number){
        const res =  (await this.connection.sqlQuery(`SELECT * FROM status WHERE id=${id}`))[0] as IStatus
        return res
    }

    async updateOffer(updatedOffer: Partial<IOffer>){
         await this.updateTable('offer', updatedOffer)
         return (await this.getByFields('offer', {id: updatedOffer.id}))[0]
    }

    async getStatusId(status:string){
        return await this.getIdOrInsert('status', {status})
    }

    async createOffer(offer: Partial<IOffer>){
        const id = await this.insertAndGetID('offer', offer)
        return (await this.getByFields('offer', {id}))[0]
    }

    async findByCarId(car_id: string){
        const res =(await this.getByFields('offer',{car_id, }))[0] as IOffer
        return res
    }

    async findActiveByCarId(car_id: string, status_id: number){
        const res =(await this.getByFields('offer',{car_id, status_id}, true))[0] as IOffer
        return res
    }
    
}