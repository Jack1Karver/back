#!/bin/bash
contracts=("Data" "NftRoot")
marketContracts=("AuctionRoot" "SellRoot" "Auction" "Sell")
for i in ${!contracts[*]}
do
  tondev sol compile "contracts/${contracts[$i]}.sol" -o contracts-compiled
  tondev js wrap "contracts-compiled/${contracts[$i]}.abi.json"
done

for i in ${!marketContracts[*]}
do
  tondev sol compile "contracts/market/${marketContracts[$i]}.sol" -o contracts-compiled/market
  tondev js wrap "contracts-compiled/market/${marketContracts[$i]}.abi.json"
done