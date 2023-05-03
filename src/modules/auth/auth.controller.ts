import { Router } from "express";
import { WalletAuthDto } from "./dto/wallet-auth.dto";
import { AuthService } from "./auth.service";

import { UserService } from "../user/user.service";


export const AuthController = Router()

const authService = new AuthService
const userService = new UserService

AuthController.post('/extension/auth', async (req, res)=>{
    try{
    const data = req.body as WalletAuthDto
    const walletAuthResponse = await authService.auth(data);
    authService.addJWTCookie(walletAuthResponse.user.accessToken, res)
    return res.status(201).json(walletAuthResponse)
    } catch(e){
        console.log(e)
        return res.status(500)
    }
})
