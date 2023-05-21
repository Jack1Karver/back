export interface IOffer {
    id: number;
    contract_address: string;
    car_id: number;
    price: number;
    date_created: Date;
    date_closed?: Date;
    status_id: number;
  }