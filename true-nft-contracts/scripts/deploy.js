const nodeEnv =
  process.env.NODE_ENV === "production" ? "production" : "development";
require("dotenv").config({ path: `.env.${nodeEnv}` });
const isDev = nodeEnv !== "production";
const fs = require("fs");

const { Account } = require("@tonclient/appkit");
const { TonClient, signerKeys } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");

const { toNano, add0x } = require("../utils/utils");
const { config } = require("../utils/config");

// const { mainSigner, mainSignerPublic } = require("../utils/signers");
const keysFile = require(`../keys/${process.env.KEYS_PATH}`);
const mainSigner = signerKeys(keysFile);
const mainSignerPublic = add0x(mainSigner.keys.public);

const { ClientController } = require("../utils/client-controller");

const contracts = config.contracts;

TonClient.useBinaryLibrary(libNode);

(async () => {
  const client = new TonClient({
    network: {
      endpoints: [process.env.TON_NETWORK],
    },
  });
  try {
    await main(client);
  } catch (err) {
    console.error(err);
  }
  client.close();
})();

async function main(client) {
  const nftRootOnly = process.env.NFT_ROOT_ONLY === "true";
  const rootOwnerAddress = process.env.ROOT_OWNER_ADDRESS;
  let addresses = JSON.parse(fs.readFileSync("build/addresses.json"));

  const nftRoot = new Account(contracts.NftRootContract, {
    signer: mainSigner,
    client,
  });

  const nftRootAddress = await nftRoot.getAddress();

  console.log(`Future NftRoot address: ${nftRootAddress}`);

  const sellRoot = new Account(contracts.SellRootContract, {
    signer: mainSigner,
    client,
  });

  const sellRootAddres = await sellRoot.getAddress();

  console.log(`Future SellRoot address: ${sellRootAddres}`);

  const auctionRoot = new Account(contracts.AuctionRootContract, {
    signer: mainSigner,
    client,
  });

  const auctionRootAddress = await auctionRoot.getAddress();
  console.log(`Future AuctionRoot address: ${auctionRootAddress}`);

  addresses[process.env.NFT_ROOT_NAME] = nftRootAddress;
  if (!nftRootOnly) {
    addresses[process.env.SELL_ROOT_NAME] = sellRootAddres;
    addresses[process.env.AUCTION_ROOT_NAME] = auctionRootAddress;
  }
  fs.writeFileSync("build/addresses.json", JSON.stringify(addresses, null, 2));

  const managersList = nftRootOnly
    ? [addresses["SellRoot"], addresses["AuctionRoot"]]
    : [sellRootAddres, auctionRootAddress];

  const clientController = new ClientController({ client, nftRoot });

  await clientController.deployRootContract({
    account: nftRoot,
    initInput: {
      codeIndex: contracts.IndexContract.code,
      codeData: contracts.DataContract.code,
      _pubkey: mainSignerPublic,
      _ownerAddress: rootOwnerAddress,
      _name: config.tokenName,
      _symbol: config.tokenSymbol,
      _managersList: managersList,
      _mintingFee: toNano(2),
    },
    name: "NftRoot",
    useGiver: false,
  });

  if (!nftRootOnly) {
    await clientController.deployRootContract({
      account: sellRoot,
      initInput: {
        codeIndex: contracts.IndexContract.code,
        _pubkey: mainSignerPublic,
        _offerCode: contracts.SellContract.code,
        _deploymentFee: toNano(2),
        _offersStorageFee: toNano(0.02),
        _marketFee: 25,
        _marketFeeDecimals: 1,
      },
      name: "SellRoot",
      useGiver: false,
    });

    await clientController.deployRootContract({
      account: auctionRoot,
      initInput: {
        codeIndex: contracts.IndexContract.code,
        _pubkey: mainSignerPublic,
        _offerCode: contracts.AuctionContract.code,
        _deploymentFee: toNano(2),
        _offersStorageFee: toNano(0.02),
        _marketFee: 25,
        _marketFeeDecimals: 1,
        _auctionBidDelta: 10,
        _auctionBidDeltaDecimals: 0,
      },
      name: "AuctionRoot",
      useGiver: false,
    });
  }
}
