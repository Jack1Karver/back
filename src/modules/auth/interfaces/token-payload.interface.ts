import { roleEnum } from '../../user/enums/role.enum';

export interface ITokenPayload {
  id: string;
  status: string;
  role: string;
}
