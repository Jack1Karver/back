export interface ISellDeployed {
  nftAddress: string;
  offerAddress: string;
  ownerAddress: string;
  price: number;
  oldManager?: string | null;
}
