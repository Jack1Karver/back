import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../modules/user/user.repository';
import { Request } from 'express';
import { SECRET_TOKEN } from '../config/secret';
import { TokenRepository } from '../modules/token/token.repository';
import { IUser } from '../models/user.model';
import { UserService } from '../modules/user/user.service';

const userRepository = new UserRepository
const tokenReposiory = new TokenRepository

const options = {
  jwtFromRequest: ExtractJwt.fromExtractors([(request: Request)=>{
    const data = request.cookies['access_token']
    if(!data) return null;
    return data
  }]),
  secretOrKey: SECRET_TOKEN,
  passReqToCallback: true,
};

export const passportfN = passport => {
  passport.use(
    new Strategy(options, async (req, user : IUser, done) => {
        try{
          const token = req.cookies?.access_token;
          const tokenExists = await tokenReposiory.getToken(token)
          if(tokenExists){
            const user = await userRepository.findUserById(tokenExists.user_id);
            if(user){
             return done(null, await new UserService().serializeUser(user));
            } else{

            }
          }
        return {code: 401};
          }
    catch(e){
        console.log(e)
    }
    })
  );
};
