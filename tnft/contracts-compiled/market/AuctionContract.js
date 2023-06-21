const AuctionContract = {
    abi: {
        "ABI version": 2,
        "header": [
            "pubkey",
            "time",
            "expire"
        ],
        "functions": [
            {
                "name": "constructor",
                "inputs": [
                    {
                        "name": "_markerRootAddr",
                        "type": "address"
                    },
                    {
                        "name": "_tokenRootAddr",
                        "type": "address"
                    },
                    {
                        "name": "_addrOwner",
                        "type": "address"
                    },
                    {
                        "name": "_marketFee",
                        "type": "uint128"
                    },
                    {
                        "name": "_marketFeeDecimals",
                        "type": "uint8"
                    },
                    {
                        "name": "_auctionDuration",
                        "type": "uint128"
                    },
                    {
                        "name": "_bidDelta",
                        "type": "uint8"
                    },
                    {
                        "name": "_storageFee",
                        "type": "uint128"
                    },
                    {
                        "name": "_royalty",
                        "type": "uint8"
                    },
                    {
                        "name": "_royaltyAuthor",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "placeBid",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "finishAuction",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "getAuctionInfo",
                "inputs": [],
                "outputs": [
                    {
                        "name": "startPrice",
                        "type": "uint128"
                    },
                    {
                        "name": "delta",
                        "type": "uint8"
                    },
                    {
                        "name": "duration",
                        "type": "uint256"
                    },
                    {
                        "name": "endTime",
                        "type": "uint256"
                    },
                    {
                        "name": "currentBidAddr",
                        "type": "address"
                    },
                    {
                        "name": "currentBidValue",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "getRoyaltyInfo",
                "inputs": [],
                "outputs": [
                    {
                        "name": "value",
                        "type": "uint8"
                    },
                    {
                        "name": "author",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "price",
                "inputs": [],
                "outputs": [
                    {
                        "name": "price",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "addrData",
                "inputs": [],
                "outputs": [
                    {
                        "name": "addrData",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "markerRootAddr",
                "inputs": [],
                "outputs": [
                    {
                        "name": "markerRootAddr",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "tokenRootAddr",
                "inputs": [],
                "outputs": [
                    {
                        "name": "tokenRootAddr",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "addrOwner",
                "inputs": [],
                "outputs": [
                    {
                        "name": "addrOwner",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "marketFee",
                "inputs": [],
                "outputs": [
                    {
                        "name": "marketFee",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "marketFeeDecimals",
                "inputs": [],
                "outputs": [
                    {
                        "name": "marketFeeDecimals",
                        "type": "uint8"
                    }
                ]
            },
            {
                "name": "isActive",
                "inputs": [],
                "outputs": [
                    {
                        "name": "isActive",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "currentBid",
                "inputs": [],
                "outputs": [
                    {
                        "components": [
                            {
                                "name": "addr",
                                "type": "address"
                            },
                            {
                                "name": "value",
                                "type": "uint128"
                            }
                        ],
                        "name": "currentBid",
                        "type": "tuple"
                    }
                ]
            },
            {
                "name": "maxBidValue",
                "inputs": [],
                "outputs": [
                    {
                        "name": "maxBidValue",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "nextBidValue",
                "inputs": [],
                "outputs": [
                    {
                        "name": "nextBidValue",
                        "type": "uint128"
                    }
                ]
            }
        ],
        "data": [
            {
                "key": 1,
                "name": "price",
                "type": "uint128"
            },
            {
                "key": 2,
                "name": "addrData",
                "type": "address"
            },
            {
                "key": 3,
                "name": "deployHash",
                "type": "bytes"
            }
        ],
        "events": [
            {
                "name": "bidPlaced",
                "inputs": [
                    {
                        "name": "buyerAddress",
                        "type": "address"
                    },
                    {
                        "name": "value",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "bidDeclined",
                "inputs": [
                    {
                        "name": "buyerAddress",
                        "type": "address"
                    },
                    {
                        "name": "value",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "auctionFinished",
                "inputs": [
                    {
                        "name": "newOwner",
                        "type": "address"
                    },
                    {
                        "name": "price",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "auctionCancelled",
                "inputs": [],
                "outputs": []
            }
        ]
    },
    tvc: "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",
    code: "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",
    codeHash: "535fc8cf8b500c963ca413e53b4856a71eec82c7d6ba067fcc1f1e2f51670446",
};
module.exports = { AuctionContract };