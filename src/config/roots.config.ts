export const ROOTS = {
    nftRoot: {
      address: '0:6ec5b388bff936878174457ac99b781b87990e7f8e46504a5ae354122fd61ab3',
      abi: `{
          "ABI version": 2,
          "header": ["pubkey", "time", "expire"],
          "functions": [
              {
                  "name": "constructor",
                  "inputs": [
                      {"name":"codeIndex","type":"cell"},
                      {"name":"codeData","type":"cell"},
                      {"name":"_pubkey","type":"uint256"},
                      {"name":"_ownerAddress","type":"address"},
                      {"name":"_name","type":"bytes"},
                      {"name":"_symbol","type":"bytes"},
                      {"name":"_managersList","type":"address[]"},
                      {"name":"_mintingFee","type":"uint128"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "mint",
                  "inputs": [
                      {"name":"_name","type":"bytes"},
                      {"name":"_url","type":"bytes"},
                      {"name":"_royalty","type":"uint8"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "deployBasis",
                  "inputs": [
                      {"name":"codeIndexBasis","type":"cell"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "destructBasis",
                  "inputs": [
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "addManager",
                  "inputs": [
                      {"name":"_addr","type":"address"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "removeManager",
                  "inputs": [
                      {"name":"_addr","type":"address"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "getManagersList",
                  "inputs": [
                  ],
                  "outputs": [
                      {"name":"managers","type":"address[]"}
                  ]
              },
              {
                  "name": "changeMintingFee",
                  "inputs": [
                      {"name":"_value","type":"uint128"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "changeInternalOwner",
                  "inputs": [
                      {"name":"_owner","type":"address"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "changeExternalOwner",
                  "inputs": [
                      {"name":"_pubkey","type":"uint256"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "withdraw",
                  "inputs": [
                      {"name":"_dest","type":"address"},
                      {"name":"_value","type":"uint128"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "resolveCodeHashIndex",
                  "inputs": [
                      {"name":"addrRoot","type":"address"},
                      {"name":"addrOwner","type":"address"}
                  ],
                  "outputs": [
                      {"name":"codeHashIndex","type":"uint256"}
                  ]
              },
              {
                  "name": "resolveIndex",
                  "inputs": [
                      {"name":"addrRoot","type":"address"},
                      {"name":"addrData","type":"address"},
                      {"name":"addrOwner","type":"address"}
                  ],
                  "outputs": [
                      {"name":"addrIndex","type":"address"}
                  ]
              },
              {
                  "name": "resolveCodeHashData",
                  "inputs": [
                  ],
                  "outputs": [
                      {"name":"codeHashData","type":"uint256"}
                  ]
              },
              {
                  "name": "resolveData",
                  "inputs": [
                      {"name":"addrRoot","type":"address"},
                      {"name":"id","type":"uint256"}
                  ],
                  "outputs": [
                      {"name":"addrData","type":"address"}
                  ]
              },
              {
                  "name": "name",
                  "inputs": [
                  ],
                  "outputs": [
                      {"name":"name","type":"bytes"}
                  ]
              },
              {
                  "name": "symbol",
                  "inputs": [
                  ],
                  "outputs": [
                      {"name":"symbol","type":"bytes"}
                  ]
              },
              {
                  "name": "mintingFee",
                  "inputs": [
                  ],
                  "outputs": [
                      {"name":"mintingFee","type":"uint128"}
                  ]
              }
          ],
          "data": [
          ],
          "events": [
              {
                  "name": "tokenMinted",
                  "inputs": [
                      {"name":"ownerAddr","type":"address"},
                      {"name":"dataAddr","type":"address"},
                      {"name":"name","type":"bytes"},
                      {"name":"url","type":"bytes"}
                  ],
                  "outputs": [
                  ]
              }
          ]
      }
      `,
    },
    sellRoot:{address: '0:c1007576424edecb8573224f4655b0e8738543b3596f2a466ac5fd022806fde5', abi: `{
      "ABI version": 2,
      "header": ["pubkey", "time", "expire"],
      "functions": [
          {
              "name": "constructor",
              "inputs": [
                  {"name":"codeIndex","type":"cell"},
                  {"name":"_pubkey","type":"uint256"},
                  {"name":"_offerCode","type":"cell"},
                  {"name":"_deploymentFee","type":"uint128"},
                  {"name":"_marketFee","type":"uint8"},
                  {"name":"_marketFeeDecimals","type":"uint8"}
              ],
              "outputs": [
              ]
          },
          {
              "name": "deployOffer",
              "inputs": [
                  {"name":"_addrRoot","type":"address"},
                  {"name":"_addrIndex","type":"address"},
                  {"name":"_addrData","type":"address"},
                  {"name":"_price","type":"uint128"},
                  {"name":"_hash","type":"bytes"}
              ],
              "outputs": [
                  {"name":"offerAddress","type":"address"}
              ]
          },
          {
              "name": "confirmOffer",
              "inputs": [
                  {"name":"_royalty","type":"uint8"},
                  {"name":"_royaltyAuthor","type":"address"}
              ],
              "outputs": [
                  {"name":"offerAddress","type":"address"}
              ]
          },
          {
              "name": "declineOffer",
              "inputs": [
              ],
              "outputs": [
              ]
          },
          {
              "name": "pendingOfferExists",
              "inputs": [
                  {"name":"_addr","type":"address"}
              ],
              "outputs": [
                  {"name":"offerExists","type":"bool"}
              ]
          },
          {
              "name": "getOfferAddress",
              "inputs": [
                  {"name":"_addrData","type":"address"},
                  {"name":"_price","type":"uint128"},
                  {"name":"_hash","type":"bytes"}
              ],
              "outputs": [
                  {"name":"offerAddress","type":"address"}
              ]
          },
          {
              "name": "changeDeploymentFee",
              "inputs": [
                  {"name":"_value","type":"uint128"}
              ],
              "outputs": [
              ]
          },
          {
              "name": "changeMarketFee",
              "inputs": [
                  {"name":"_value","type":"uint8"},
                  {"name":"_decimals","type":"uint8"}
              ],
              "outputs": [
              ]
          },
          {
              "name": "setOfferCode",
              "inputs": [
                  {"name":"_newCode","type":"cell"}
              ],
              "outputs": [
              ]
          },
          {
              "name": "withdraw",
              "inputs": [
                  {"name":"_dest","type":"address"},
                  {"name":"_value","type":"uint128"}
              ],
              "outputs": [
              ]
          },
          {
              "name": "resolveCodeHashIndex",
              "inputs": [
                  {"name":"addrRoot","type":"address"},
                  {"name":"addrOwner","type":"address"}
              ],
              "outputs": [
                  {"name":"codeHashIndex","type":"uint256"}
              ]
          },
          {
              "name": "resolveIndex",
              "inputs": [
                  {"name":"addrRoot","type":"address"},
                  {"name":"addrData","type":"address"},
                  {"name":"addrOwner","type":"address"}
              ],
              "outputs": [
                  {"name":"addrIndex","type":"address"}
              ]
          },
          {
              "name": "marketFee",
              "inputs": [
              ],
              "outputs": [
                  {"name":"marketFee","type":"uint8"}
              ]
          },
          {
              "name": "marketFeeDecimals",
              "inputs": [
              ],
              "outputs": [
                  {"name":"marketFeeDecimals","type":"uint8"}
              ]
          },
          {
              "name": "deploymentFee",
              "inputs": [
              ],
              "outputs": [
                  {"name":"deploymentFee","type":"uint128"}
              ]
          }
      ],
      "data": [
      ],
      "events": [
          {
              "name": "sellDeployed",
              "inputs": [
                  {"name":"offerAddress","type":"address"},
                  {"components":[{"name":"addrRoot","type":"address"},{"name":"addrOwner","type":"address"},{"name":"addrData","type":"address"},{"name":"addrIndex","type":"address"},{"name":"addrOffer","type":"address"},{"name":"price","type":"uint128"},{"name":"deployHash","type":"bytes"}],"name":"offerInfo","type":"tuple"}
              ],
              "outputs": [
              ]
          },
          {
              "name": "sellDeclined",
              "inputs": [
                  {"name":"offerAddress","type":"address"},
                  {"components":[{"name":"addrRoot","type":"address"},{"name":"addrOwner","type":"address"},{"name":"addrData","type":"address"},{"name":"addrIndex","type":"address"},{"name":"addrOffer","type":"address"},{"name":"price","type":"uint128"},{"name":"deployHash","type":"bytes"}],"name":"offerInfo","type":"tuple"}
              ],
              "outputs": [
              ]
          }
      ]
  }
  `} ,
  data: {
      abi: `{
          "ABI version": 2,
          "header": ["pubkey", "time", "expire"],
          "functions": [
              {
                  "name": "constructor",
                  "inputs": [
                      {"name":"addrOwner","type":"address"},
                      {"name":"codeIndex","type":"cell"},
                      {"name":"_name","type":"bytes"},
                      {"name":"_url","type":"bytes"},
                      {"name":"_editionNumber","type":"uint8"},
                      {"name":"_editionAmount","type":"uint8"},
                      {"name":"_managersList","type":"address[]"},
                      {"name":"_royalty","type":"uint8"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "transferOwnership",
                  "inputs": [
                      {"name":"addrTo","type":"address"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "getInfo",
                  "inputs": [
                  ],
                  "outputs": [
                      {"name":"addrRoot","type":"address"},
                      {"name":"addrOwner","type":"address"},
                      {"name":"addrAuthor","type":"address"},
                      {"name":"addrData","type":"address"},
                      {"name":"id","type":"uint256"},
                      {"name":"name","type":"bytes"},
                      {"name":"url","type":"bytes"},
                      {"name":"number","type":"uint8"},
                      {"name":"amount","type":"uint8"}
                  ]
              },
              {
                  "name": "getInfoResponsible",
                  "inputs": [
                      {"name":"_answer_id","type":"uint32"}
                  ],
                  "outputs": [
                      {"name":"addrRoot","type":"address"},
                      {"name":"addrOwner","type":"address"},
                      {"name":"addrAuthor","type":"address"},
                      {"name":"addrData","type":"address"},
                      {"name":"id","type":"uint256"},
                      {"name":"name","type":"bytes"},
                      {"name":"url","type":"bytes"},
                      {"name":"number","type":"uint8"},
                      {"name":"amount","type":"uint8"}
                  ]
              },
              {
                  "name": "getOwner",
                  "inputs": [
                  ],
                  "outputs": [
                      {"name":"addrOwner","type":"address"}
                  ]
              },
              {
                  "name": "getOwnerResponsible",
                  "inputs": [
                      {"name":"_answer_id","type":"uint32"}
                  ],
                  "outputs": [
                      {"name":"addrOwner","type":"address"}
                  ]
              },
              {
                  "name": "lendOwnership",
                  "inputs": [
                      {"name":"_addr","type":"address"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "returnOwnership",
                  "inputs": [
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "getAllowance",
                  "inputs": [
                  ],
                  "outputs": [
                      {"name":"addr","type":"address"}
                  ]
              },
              {
                  "name": "burn",
                  "inputs": [
                      {"name":"_dest","type":"address"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "addManager",
                  "inputs": [
                      {"name":"_addr","type":"address"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "removeManager",
                  "inputs": [
                      {"name":"_addr","type":"address"}
                  ],
                  "outputs": [
                  ]
              },
              {
                  "name": "getManagersList",
                  "inputs": [
                  ],
                  "outputs": [
                      {"name":"managers","type":"address[]"}
                  ]
              },
              {
                  "name": "resolveCodeHashIndex",
                  "inputs": [
                      {"name":"addrRoot","type":"address"},
                      {"name":"addrOwner","type":"address"}
                  ],
                  "outputs": [
                      {"name":"codeHashIndex","type":"uint256"}
                  ]
              },
              {
                  "name": "resolveIndex",
                  "inputs": [
                      {"name":"addrRoot","type":"address"},
                      {"name":"addrData","type":"address"},
                      {"name":"addrOwner","type":"address"}
                  ],
                  "outputs": [
                      {"name":"addrIndex","type":"address"}
                  ]
              },
              {
                  "name": "royalty",
                  "inputs": [
                  ],
                  "outputs": [
                      {"name":"royalty","type":"uint8"}
                  ]
              }
          ],
          "data": [
              {"key":1,"name":"_id","type":"uint256"}
          ],
          "events": [
          ]
      }
      `
  }
  };
  