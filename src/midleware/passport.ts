import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from '../modules/user/user.repository';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_TOKEN,
};

export const passportfN = passport => {
  passport.use(
    new Strategy(options, async (payload, done) => {
        try{
      const user = await new UserRepository().getUserById(payload.id);

      if (user) {
        done(null, user);
      } else {
        done(null, false);
      }
    }
    catch(e){
        console.log(e)
    }
    })
  );
};
