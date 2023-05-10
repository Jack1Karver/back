const { utf8ToHex, add0x, hexToUtf8, toNano } = require("./utils");

const { NftRootContract } = require("../contracts-compiled/NftRootContract");
const { DataContract } = require("../contracts-compiled/DataContract");
const {
  SellRootContract,
} = require("../contracts-compiled/market/SellRootContract");
const {
  AuctionRootContract,
} = require("../contracts-compiled/market/AuctionRootContract");
const { IndexContract } = require("../contracts-compiled/IndexContract");
const {
  IndexBasisContract,
} = require("../contracts-compiled/IndexBasisContract");
const { SellContract } = require("../contracts-compiled/market/SellContract");
const {
  AuctionContract,
} = require("../contracts-compiled/market/AuctionContract");

const {
  SafeMultisigWalletContract,
} = require("../z-contracts-add/multisig/SafeMultisigWalletContract");

const config = {
  tokenName: utf8ToHex(process.env.TOKEN_NAME || "grandbazar.io"),
  tokenSymbol: utf8ToHex(process.env.TOKEN_SYMBOL || "NGBT"),
  endpoint: "http://127.0.0.1/",
  contracts: {
    NftRootContract,
    DataContract,
    SellRootContract,
    AuctionRootContract,
    IndexContract,
    SafeMultisigWalletContract,
    SellContract,
    AuctionContract,
    IndexBasisContract,
  },
};

module.exports = { config };
