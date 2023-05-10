import { SignOptions } from 'jsonwebtoken';
import { IUser } from '../../models/user.model';
import { strip0x } from '../../utils/contract.util';
import { ContractsService } from '../contracts/contracts.service';
import jwt from 'jsonwebtoken';
import { statusEnum } from '../user/enums/status.enum';
import { IReadableUser } from '../user/interfaces/readable-user.interface';
import { UserService } from '../user/user.service';
import { WalletService } from '../wallet/wallet.service';
import { WalletAuthDto } from './dto/wallet-auth.dto';
import { registrationStatusesEnum } from './enums/registration-statuses.enum';
import { IOauthResponse } from './interfaces/oauth-response.interface';
import { ITokenPayload } from './interfaces/token-payload.interface';
import { addOneDay } from '../../utils/date.util';
import { TokenService } from '../token/token.service';
import { Response } from 'express';
import { SECRET_TOKEN } from '../../config/secret';

export class AuthService {
  userService = new UserService();
  contractsService = new ContractsService();
  walletService = new WalletService();
  tokenService = new TokenService();

  async auth(data: WalletAuthDto): Promise<IOauthResponse> {
    let user = await this.userService.getUserByWalletAddress(data.address);
    let registrationStatus = registrationStatusesEnum.existing;

    if (!user) {
      throw new Error();
    }
    await this.userService.updateNonce(user.id);
    user = await this.userService.getUserByWalletAddress(data.address);
    if (!user) {
      throw new Error();
    }
    const strippedPubkey = strip0x(data.signature);
    if (user.status === statusEnum.pending) {
      await this.walletService.verifyWallet(data.address, strippedPubkey);
      user = await this.userService.makeActive(user.id);
      registrationStatus = registrationStatusesEnum.new;
    } else if (!user.wallet.pubkey) {
      await this.walletService.setPubkey(user.wallet.id, strippedPubkey);
    }
    if (!user) {
      throw new Error();
    }
    return { status: registrationStatus, user: await this.getLoggedInUser(user) };
  }

  private async getLoggedInUser(user: IUser): Promise<IReadableUser> {
    const token = await this.getUserToken(user);
    const readableUser = user as IReadableUser;

    readableUser.accessToken = token;

    return readableUser;
  }

  async getUserToken(user: IUser, withStatusCheck = true): Promise<string> {
    if (withStatusCheck && user.status !== statusEnum.active) {
      throw new Error();
    }

    const tokenPayload: ITokenPayload = {
      id: String(user.id),
      status: user.status,
      role: user.role,
    };
    const token = await this.generateToken(tokenPayload);
    const expire_at = addOneDay().toISOString();

    await this.tokenService.create({
      token,
      expire_at,
      user_id: user.id,
    });

    return token;
  }

  private async generateToken(data: ITokenPayload, options?: SignOptions): Promise<string> {
    return jwt.sign(data, SECRET_TOKEN, options);
  }

  addJWTCookie(token: string, res: Response): void {
    res.cookie('access_token', token, {
      httpOnly: true,
      expires: addOneDay().toDate(),
      sameSite: 'none',
      secure: true,
    });
  }

  clearJWTCookie(res: Response): void {
    res.clearCookie('access_token');
  }
}
