import { AuthController } from './modules/auth/auth.controller';
import { CarController } from './modules/car/car.controller';
import { FilterController } from './modules/filter/filter.controller';
import { UserController } from './modules/user/user.controller';

export const ROUTES = [
  {
    path: '/cars',
    router: CarController,
  },
  {
    path: '/user',
    router: UserController,
  },
  { path: '/auth', router: AuthController },
  { path: '/filter', router: FilterController },
];
