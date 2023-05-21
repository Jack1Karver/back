import { IUserToken } from "../../models/user-token.model";
import { TokenRepository } from "./token.repository";


export class TokenService{
    
    tokenRepository = new TokenRepository

    async create(token: IUserToken){
        await this.tokenRepository.saveToken(token)
    }

    async deleteAll(id: number){
        return this.tokenRepository.deleteAll(id);
    }
}