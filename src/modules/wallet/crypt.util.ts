import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export async function comparePassword(password: string, passwordHash: string): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash);
}

export const createHashName = (str: string, length = 64): string =>
  crypto.createHash('sha256').update(str).digest('hex').substring(0, length);

export const stripAddress = (address: string, start = 4, end = 4) =>
  address.substring(0, start) + ' .... ' + address.substr(address.length - end);
