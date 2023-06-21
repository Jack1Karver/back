export interface IOffer {
    id: number;
    contract_address: string;
    car_id: string;
    price: number;
    date_created: Date;
    date_closed?: Date;
    status_id: number;
    message_id: string
  }