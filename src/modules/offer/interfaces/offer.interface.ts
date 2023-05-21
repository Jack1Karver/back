export interface IOfferDto {
  id: number;
  contractAddress: string;
  carId: number;
  price: number;
  dateCreated: Date;
  dateClosed?: Date;
  status: string;
}
