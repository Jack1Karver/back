import { IUserDto } from '../dto/user.dto';

export interface IReadableUser extends IUserDto {
  accessToken: string;
}
