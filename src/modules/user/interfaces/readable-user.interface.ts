import { IUser } from '../../../models/user.model';

export interface IReadableUser extends IUser {
  accessToken: string;
}
