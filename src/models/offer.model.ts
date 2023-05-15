export interface IOffer {
    id: string;
    contract_address: string;
    car_id: string;
    price: number;
    date_created: Date;
    date_closed?: Date;
  }