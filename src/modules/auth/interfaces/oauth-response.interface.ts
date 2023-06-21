import { IUser } from "../../../models/user.model";
import { IReadableUser } from "../../user/interfaces/readable-user.interface";
import { registrationStatusesEnum } from "../enums/registration-statuses.enum";

export interface IOauthResponse {
  status: registrationStatusesEnum;
  user: IReadableUser;
}

export interface IOauthResponseSerialized {
  status: registrationStatusesEnum;
  user: IUser;
}
