import { Router } from 'express';
import { walletTypeEnum } from '../wallet/enums/wallet-type.enum';
import { ContractsService } from '../contracts/contracts.service';
import { UserService } from './user.service';
import { statusEnum } from './enums/status.enum';
import passport from 'passport';
import { errorHandler } from '../../utils/error.utils';

export const UserController = Router();

const contractsService = new ContractsService();
const userService = new UserService();

UserController.get('/nonce/:walletAddress', async (req, res) => {
  let addressType: walletTypeEnum;
  const walletAddress = req.params.walletAddress;

  if (await contractsService.isAccountAddress(walletAddress)) {
    addressType = walletTypeEnum.external;
  } else {
    throw { code: 401, message: 'ACCOUNT_ADDRESS_WRONG_FORMAT' };
  }

  const user = await userService.getUserByWalletAddress(walletAddress);
  if (user) {
    return res.status(200).json({ nonce: user.nonce });
  } else if (await contractsService.isAccountDeployed(walletAddress)) {
    const result = (await userService.createWithWallet(walletAddress, statusEnum.pending, addressType)).nonce;
    return res.status(200).json({ nonce: result });
  }
});

UserController.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  res.send(req.user);
});

UserController.get('/:slug', async (req, res) => {
  try {
    const userSlug = req.params.slug;
    const result = await userService.getUserBySlug(userSlug);
    return res.status(200).json(result)
  } catch (e) {
    errorHandler(e, res);
  }
});
