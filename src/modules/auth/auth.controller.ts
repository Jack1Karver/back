import { Router } from 'express';
import { WalletAuthDto } from './dto/wallet-auth.dto';
import { AuthService } from './auth.service';

import { UserService } from '../user/user.service';
import passport from 'passport';
import { IUser } from '../../models/user.model';

export const AuthController = Router();

const authService = new AuthService();
const userService = new UserService();

AuthController.post('/extension/auth', async (req, res) => {
  try {
    const data = req.body as WalletAuthDto;
    const walletAuthResponse = await authService.auth(data);
    authService.addJWTCookie(walletAuthResponse.user.accessToken, res);
    return res.status(201).json(walletAuthResponse);
  } catch (e) {
    console.log(e);
    return res.status(500);
  }
});

AuthController.post('/logout', [passport.authenticate('jwt', { session: false })], async (req, res) => {
  const user = req.user as IUser;
  authService.clearJWTCookie(res);

  return await authService.logout(user.id);
});
