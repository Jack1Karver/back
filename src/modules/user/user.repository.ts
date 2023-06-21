import { AbstractRepository } from '../../db/abstract.repository';
import { IRole } from '../../models/role.model';
import { IStatus } from '../../models/status.model';
import { IUser} from '../../models/user.model';

export class UserRepository extends AbstractRepository {
  async findUserByWalletAddress(address: string): Promise<IUser | null> {
    try{
    const res = await this.connection.sqlQuery(`
        SELECT user_table.* FROM user_table
        JOIN wallet ON wallet.id = user_table.wallet_id
        WHERE wallet.address = '${address}'`);
    return res.length ? (res[0] as IUser) : null;
    } catch(e){
      console.log(e)
      throw new Error
    }
  }

  async insertUser(user: Omit<IUser, 'id'>) {
    return await this.insertAndGetID('user_table', user);
  }

  async getStatusId(status: string): Promise<number> {
    return await this.getIdOrInsert('status', { status: status });
  }

  async getStatus(id: number):Promise<IStatus>{
    const res =  await this.getByFields('status', {id: id});
    return res[0] as IStatus
  }

  async getRoleId(role: string): Promise<number> {
    return await this.getIdOrInsert('role', { role: role });
  }

  async getRole(id: number):Promise<IRole>{
    const res =  await this.getByFields('role', {id});
    return res[0] as IRole
  }

  async findUserById(id: number): Promise<IUser | null> {
    const res = await this.getByFields('user_table', { id: id });
    return res.length ? (res[0] as IUser) : null;
  }

  async updateNonce(id: number, nonce: string){
    await this.updateTable('user_table', {id: id, nonce: nonce})
  }

  async updateStatus(id: number, status_id: number){
   await this.updateTable('user_table', {id, status_id})
  }

  async getUserBySlug(slug: string):Promise<IUser>{
    return (await this.getByFields('user_table', {slug}))[0]
  }
}
