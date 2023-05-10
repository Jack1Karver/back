const SellRootContract = {
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
                        "name": "_marketFee",
                        "type": "uint8"
                    },
                    {
                        "name": "_marketFeeDecimals",
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
            }
        ],
        "data": [],
        "events": [
            {
                "name": "sellDeployed",
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
                "name": "sellDeclined",
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
    codeHash: "63c7054263b33b16b393789eb82aee76b6a763edcd38fdf9787f68fdba011eda",
};
module.exports = { SellRootContract };