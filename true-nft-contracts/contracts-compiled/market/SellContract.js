const SellContract = {
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
                        "type": "uint8"
                    },
                    {
                        "name": "_marketFeeDecimals",
                        "type": "uint8"
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
                "name": "buyToken",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "cancelOrder",
                "inputs": [],
                "outputs": []
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
                "name": "sellConfirmed",
                "inputs": [
                    {
                        "name": "newOwner",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "sellCancelled",
                "inputs": [],
                "outputs": []
            }
        ]
    },
    tvc: "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",
    code: "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",
    codeHash: "da1e116e1fedf87d3184eade1f2baaf1773520b63c2e719f5cd402c3c2f0a167",
};
module.exports = { SellContract };