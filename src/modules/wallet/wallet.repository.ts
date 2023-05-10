import { AbstractRepository } from "../../db/abstract.repository";
import { IWallet } from "../../models/wallet.model";
import { statusEnum } from "../user/enums/status.enum";


export class WalletRepository extends AbstractRepository{

    async getWalletByAddress(address: string){
        return (await this.getByFields('wallet', {address}))[0]
    }

    async insertWallet(wallet: Omit<IWallet, 'id'>){
        const res =  await this.insertAndGetID('wallet', wallet)
        return res
    }

    async getWallet(id: number): Promise<IWallet>{
        return (await this.getByFields('wallet', {id}))[0]
    }

    async updateWalletByAddress(address: string, status: string, pubkey: string){
        await this.connection.sqlQuery(`UPDATE wallet SET (status, pubkey) = ('${status}', '${pubkey}') WHERE address = '${address}'`)
    }

    async updatePubkey(id: number, pubkey: string){
        await this.updateTable('wallet', {id, pubkey})
    }
}