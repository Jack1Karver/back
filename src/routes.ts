import { AuthController } from "./modules/auth/auth.controller";
import { CarController } from "./modules/car/car.controller";
import { UserController } from "./modules/user/user.controller";


export const ROUTES = [
  {
    path: '/cars',
    router: CarController,
  },{
    path: '/user',
    router: UserController
  },
  {path: '/auth',
  router: AuthController}
];
