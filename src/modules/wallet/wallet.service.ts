import { IWallet } from "../../models/wallet.model";
import { walletStatusesEnum } from "./enums/wallet-statuses.enum";
import { WalletRepository } from "./wallet.repository";


export class WalletService{

    private walletRepository = new WalletRepository

    async getWalletId(address: string){
        return await this.walletRepository.getWalletByAddress(address)
    }

    async createWalletWithAddress(address: string, isVerified:boolean = false){
        return await this.walletRepository.insertWallet({address, status: isVerified ? walletStatusesEnum.verified : walletStatusesEnum.pending})
    }

    async getWallet(id: number){
        return await this.walletRepository.getWallet(id)
    }

    async verifyWallet(address: string, pubkey: string) {
        await this.walletRepository.updateWalletByAddress(address, walletStatusesEnum.verified, pubkey );
      }

      async setPubkey(id: number, pubkey: string){
        await this.walletRepository.updatePubkey(id, pubkey)
    }
}