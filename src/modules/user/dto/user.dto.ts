export interface IUserDto{
    id: number
    slug: string;
    wallet_id: number;
    name: string;
    bio?: string;
    role_id: number;
    status_id: number;
    nonce: string;
    memo: string;
    date_register: Date
}