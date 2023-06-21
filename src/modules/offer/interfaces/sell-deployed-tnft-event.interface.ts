export interface ISellDeployedTnftEvent {
  offerAddress: string;
  offerInfo: {
    addrRoot: string;
    addrOwner: string;
    addrData: string;
    addrIndex: string;
    addrOffer: string;
    price: number;
    deployHash: string;
  };
}
