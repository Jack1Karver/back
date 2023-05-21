import { AbstractRepository } from "../../db/abstract.repository";
import { IUserToken } from "../../models/user-token.model";


export class TokenRepository extends AbstractRepository{

    async saveToken(token: IUserToken){
        await this.insertAndGetID('user_token', token);
    }

    async getToken (token: string){
        return (await this.getByFields('user_token', {token}))[0]
    }

    async deleteAll(id: number){
        await this.connection.sqlQuery(`DELETE FROM user_token WHERE user_id = ${id}`)
    }
}