export interface ICarAd {
  id: string;
  car_features_id: number;
  owner_id: number;
  description: string;
  offer_id: string;
  address?: string;
  json: string;
  json_hash: string;
  date_created: Date;
}
