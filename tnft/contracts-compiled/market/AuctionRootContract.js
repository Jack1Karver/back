const AuctionRootContract = {
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
                        "name": "codeIndex",
                        "type": "cell"
                    },
                    {
                        "name": "_pubkey",
                        "type": "uint256"
                    },
                    {
                        "name": "_offerCode",
                        "type": "cell"
                    },
                    {
                        "name": "_deploymentFee",
                        "type": "uint128"
                    },
                    {
                        "name": "_offersStorageFee",
                        "type": "uint128"
                    },
                    {
                        "name": "_marketFee",
                        "type": "uint8"
                    },
                    {
                        "name": "_marketFeeDecimals",
                        "type": "uint8"
                    },
                    {
                        "name": "_auctionBidDelta",
                        "type": "uint8"
                    }
                ],
                "outputs": []
            },
            {
                "name": "deployOffer",
                "inputs": [
                    {
                        "name": "_addrRoot",
                        "type": "address"
                    },
                    {
                        "name": "_addrIndex",
                        "type": "address"
                    },
                    {
                        "name": "_addrData",
                        "type": "address"
                    },
                    {
                        "name": "_price",
                        "type": "uint128"
                    },
                    {
                        "name": "_hash",
                        "type": "bytes"
                    },
                    {
                        "name": "_auctionDuration",
                        "type": "uint128"
                    }
                ],
                "outputs": [
                    {
                        "name": "offerAddress",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "confirmOffer",
                "inputs": [
                    {
                        "name": "_royalty",
                        "type": "uint8"
                    },
                    {
                        "name": "_royaltyAuthor",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "offerAddress",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "declineOffer",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "changeOffersStorageFee",
                "inputs": [
                    {
                        "name": "_value",
                        "type": "uint8"
                    }
                ],
                "outputs": []
            },
            {
                "name": "pendingOfferExists",
                "inputs": [
                    {
                        "name": "_addr",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "offerExists",
                        "type": "bool"
                    }
                ]
            },
            {
                "name": "getOfferAddress",
                "inputs": [
                    {
                        "name": "_addrData",
                        "type": "address"
                    },
                    {
                        "name": "_price",
                        "type": "uint128"
                    },
                    {
                        "name": "_hash",
                        "type": "bytes"
                    }
                ],
                "outputs": [
                    {
                        "name": "offerAddress",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "changeDeploymentFee",
                "inputs": [
                    {
                        "name": "_value",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "changeMarketFee",
                "inputs": [
                    {
                        "name": "_value",
                        "type": "uint8"
                    },
                    {
                        "name": "_decimals",
                        "type": "uint8"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setOfferCode",
                "inputs": [
                    {
                        "name": "_newCode",
                        "type": "cell"
                    }
                ],
                "outputs": []
            },
            {
                "name": "withdraw",
                "inputs": [
                    {
                        "name": "_dest",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "resolveCodeHashIndex",
                "inputs": [
                    {
                        "name": "addrRoot",
                        "type": "address"
                    },
                    {
                        "name": "addrOwner",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "codeHashIndex",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "resolveIndex",
                "inputs": [
                    {
                        "name": "addrRoot",
                        "type": "address"
                    },
                    {
                        "name": "addrData",
                        "type": "address"
                    },
                    {
                        "name": "addrOwner",
                        "type": "address"
                    }
                ],
                "outputs": [
                    {
                        "name": "addrIndex",
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
                        "type": "uint8"
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
                "name": "deploymentFee",
                "inputs": [],
                "outputs": [
                    {
                        "name": "deploymentFee",
                        "type": "uint128"
                    }
                ]
            },
            {
                "name": "auctionBidDelta",
                "inputs": [],
                "outputs": [
                    {
                        "name": "auctionBidDelta",
                        "type": "uint8"
                    }
                ]
            }
        ],
        "data": [],
        "events": [
            {
                "name": "auctionDeployed",
                "inputs": [
                    {
                        "name": "offerAddress",
                        "type": "address"
                    },
                    {
                        "components": [
                            {
                                "name": "addrRoot",
                                "type": "address"
                            },
                            {
                                "name": "addrOwner",
                                "type": "address"
                            },
                            {
                                "name": "addrData",
                                "type": "address"
                            },
                            {
                                "name": "addrIndex",
                                "type": "address"
                            },
                            {
                                "name": "addrOffer",
                                "type": "address"
                            },
                            {
                                "name": "price",
                                "type": "uint128"
                            },
                            {
                                "name": "auctionDuration",
                                "type": "uint128"
                            },
                            {
                                "name": "deployHash",
                                "type": "bytes"
                            }
                        ],
                        "name": "offerInfo",
                        "type": "tuple"
                    }
                ],
                "outputs": []
            },
            {
                "name": "auctionDeclined",
                "inputs": [
                    {
                        "name": "offerAddress",
                        "type": "address"
                    },
                    {
                        "components": [
                            {
                                "name": "addrRoot",
                                "type": "address"
                            },
                            {
                                "name": "addrOwner",
                                "type": "address"
                            },
                            {
                                "name": "addrData",
                                "type": "address"
                            },
                            {
                                "name": "addrIndex",
                                "type": "address"
                            },
                            {
                                "name": "addrOffer",
                                "type": "address"
                            },
                            {
                                "name": "price",
                                "type": "uint128"
                            },
                            {
                                "name": "auctionDuration",
                                "type": "uint128"
                            },
                            {
                                "name": "deployHash",
                                "type": "bytes"
                            }
                        ],
                        "name": "offerInfo",
                        "type": "tuple"
                    }
                ],
                "outputs": []
            }
        ]
    },
    tvc: "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",
    code: "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",
    codeHash: "15d5d798939335195194566b58555ad5ce7e898991a72339f9e575164ec6ab79",
};
module.exports = { AuctionRootContract };