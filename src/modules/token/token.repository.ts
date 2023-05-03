import { AbstractRepository } from "../../db/abstract.repository";
import { IUserToken } from "../../models/user-token.model";


export class TokenRepository extends AbstractRepository{

    async saveToken(token: IUserToken){
        await this.insertAndGetID('user_token', token);
    }
}