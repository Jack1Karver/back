import { IUser } from '../../models/user.model';
import { createHashName, stripAddress } from '../wallet/crypt.util';
import { walletTypeEnum } from '../wallet/enums/wallet-type.enum';
import { WalletService } from '../wallet/wallet.service';
import { IUserDto } from './dto/user.dto';
import { roleEnum } from './enums/role.enum';
import { statusEnum } from './enums/status.enum';
import { UserRepository } from './user.repository';
import { v4 as uuidV4 } from 'uuid';

export class UserService {
  private userRepository = new UserRepository();
  private walletService = new WalletService();

  async getUserByWalletAddress(address: string): Promise<IUser | null> {
    const user = await this.userRepository.findUserByWalletAddress(address);
    if (user) {
      return await this.serializeUser(user);
    }
    return null;
  }

  async getUserById(id: number): Promise<IUser | null> {
    const user = await this.userRepository.findUserById(id);
    if (user) {
      return await this.serializeUser(user);
    }
    return null;
  }

  async createWithWallet(
    address: string,
    userStatus: statusEnum = statusEnum.active,
    walletType: walletTypeEnum = walletTypeEnum.external
  ): Promise<IUser> {
    try {
      const createdUser: Omit<IUserDto, 'id'> = {
        name: stripAddress(address),
        slug: walletType === walletTypeEnum.ethereum ? createHashName(address) : address,
        status_id: await this.userRepository.getStatusId(userStatus),
        role_id: await this.userRepository.getRoleId(roleEnum.user),
        nonce: uuidV4(),
        memo: uuidV4(),
        date_register: new Date(),
        wallet_id: await this.walletService.createWalletWithAddress(address),
      };

      const userId = await this.userRepository.insertUser(createdUser);

      const user = await this.userRepository.findUserById(userId);

      if (user) {
        return await this.serializeUser(user);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.log(e);
      throw new Error();
    }
  }

  async serializeUser(user: IUserDto): Promise<IUser> {
    return {
      id: user.id,
      role: (await this.userRepository.getRole(user.role_id)).role,
      nonce: user.nonce,
      memo: user.memo,
      slug: user.slug,
      dateRegister: user.date_register,
      wallet: await this.walletService.getWallet(user.wallet_id),
      name: user.name,
      status: (await this.userRepository.getStatus(user.status_id)).status,
    };
  }

  async updateNonce(id: number) {
    await this.userRepository.updateNonce(id, uuidV4());
  }

  async makeActive(id: number): Promise<IUser | null> {
    await this.userRepository.updateStatus(id, await this.userRepository.getStatusId(statusEnum.active));
    return await this.getUserById(id);
  }
}
