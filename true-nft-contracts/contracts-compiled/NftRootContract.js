const NftRootContract = {
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
                        "name": "codeData",
                        "type": "cell"
                    },
                    {
                        "name": "_pubkey",
                        "type": "uint256"
                    },
                    {
                        "name": "_ownerAddress",
                        "type": "address"
                    },
                    {
                        "name": "_name",
                        "type": "bytes"
                    },
                    {
                        "name": "_symbol",
                        "type": "bytes"
                    },
                    {
                        "name": "_managersList",
                        "type": "address[]"
                    },
                    {
                        "name": "_mintingFee",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "mint",
                "inputs": [
                    {
                        "name": "_name",
                        "type": "bytes"
                    },
                    {
                        "name": "_url",
                        "type": "bytes"
                    },
                    {
                        "name": "_royalty",
                        "type": "uint8"
                    }
                ],
                "outputs": []
            },
            {
                "name": "deployBasis",
                "inputs": [
                    {
                        "name": "codeIndexBasis",
                        "type": "cell"
                    }
                ],
                "outputs": []
            },
            {
                "name": "destructBasis",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "addManager",
                "inputs": [
                    {
                        "name": "_addr",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "removeManager",
                "inputs": [
                    {
                        "name": "_addr",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getManagersList",
                "inputs": [],
                "outputs": [
                    {
                        "name": "managers",
                        "type": "address[]"
                    }
                ]
            },
            {
                "name": "changeMintingFee",
                "inputs": [
                    {
                        "name": "_value",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "changeInternalOwner",
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "changeExternalOwner",
                "inputs": [
                    {
                        "name": "_pubkey",
                        "type": "uint256"
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
                "name": "resolveCodeHashData",
                "inputs": [],
                "outputs": [
                    {
                        "name": "codeHashData",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "resolveData",
                "inputs": [
                    {
                        "name": "addrRoot",
                        "type": "address"
                    },
                    {
                        "name": "id",
                        "type": "uint256"
                    }
                ],
                "outputs": [
                    {
                        "name": "addrData",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "name",
                "inputs": [],
                "outputs": [
                    {
                        "name": "name",
                        "type": "bytes"
                    }
                ]
            },
            {
                "name": "symbol",
                "inputs": [],
                "outputs": [
                    {
                        "name": "symbol",
                        "type": "bytes"
                    }
                ]
            },
            {
                "name": "mintingFee",
                "inputs": [],
                "outputs": [
                    {
                        "name": "mintingFee",
                        "type": "uint128"
                    }
                ]
            }
        ],
        "data": [],
        "events": [
            {
                "name": "tokenMinted",
                "inputs": [
                    {
                        "name": "ownerAddr",
                        "type": "address"
                    },
                    {
                        "name": "dataAddr",
                        "type": "address"
                    },
                    {
                        "name": "name",
                        "type": "bytes"
                    },
                    {
                        "name": "url",
                        "type": "bytes"
                    }
                ],
                "outputs": []
            }
        ]
    },
    tvc: "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",
    code: "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",
    codeHash: "6bbd8647435e97f5b58025c7aa130db95a01ca733ee2e715dfc0306234627211",
};
module.exports = { NftRootContract };