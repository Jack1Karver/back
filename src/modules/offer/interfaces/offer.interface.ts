export interface IOfferDto {
  id: number;
  contractAddress: string;
  carId: string;
  price: number;
  dateCreated: Date;
  dateClosed?: Date;
  status: string;
  messageId: string
}
