const { Account } = require("@tonclient/appkit");
const { TonClient, signerNone, abiContract } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");

const { utf8ToHex, toNano } = require("../utils/utils");
const { config } = require("../utils/config");

const chai = require("chai");
const assertArrays = require("chai-arrays");
chai.use(assertArrays);
const expect = chai.expect;

const { mainSigner, signers } = require("../utils/signers");

const { ClientController } = require("../utils/client-controller");
const {
  AuctionRootContract,
} = require("../contracts-compiled/market/AuctionRootContract");
const {
  AuctionContract,
} = require("../contracts-compiled/market/AuctionContract");

const contracts = config.contracts;

TonClient.useBinaryLibrary(libNode);

describe("Auctions test", async () => {
  let client;
  let clientController;
  let nftRoot;
  let nftRootAddress;
  let auctionRoot;
  let wallets = [];

  let nftToSellAcc;

  let offerAccount;
  let offerAddress;

  before(async () => {
    client = new TonClient({
      network: {
        endpoints: [config.endpoint],
      },
    });

    nftRoot = new Account(contracts.NftRootContract, {
      signer: mainSigner,
      client,
    });
    nftRootAddress = await nftRoot.getAddress();

    clientController = new ClientController({ client, nftRoot });

    auctionRoot = new Account(contracts.AuctionRootContract, {
      signer: mainSigner,
      client,
    });

    for (let i = 0; i < 4; i++) {
      wallets.push(
        new Account(contracts.SafeMultisigWalletContract, {
          client,
          signer: signers[i],
        })
      );
    }
  });

  after(async () => {
    client.close();
  });

  it("Put NFT on auction (auction offer deployment)", async () => {
    const wallet = wallets[2];
    const walletAddress = await wallet.getAddress();

    const nfts = await clientController.getMyNfts({
      rootAcc: nftRoot,
      addrOwner: walletAddress,
    });
    const nftToSellAddress = nfts[0].decoded.output.addrData;
    console.log(nftToSellAddress);
    nftToSellAcc = new Account(contracts.DataContract, {
      client,
      address: nftToSellAddress,
    });

    const nftToSellIndex = (
      await nftToSellAcc.runLocal("resolveIndex", {
        addrRoot: nftRootAddress,
        addrData: nftToSellAddress,
        addrOwner: walletAddress,
      })
    ).decoded.output.addrIndex;

    const inputPart = {
      _addrData: nftToSellAddress,
      _price: toNano(1),
      _hash: utf8ToHex("023"),
    };

    await clientController.sendTransactionWithPayload({
      abi: AuctionRootContract.abi,
      function_name: "deployOffer",
      input: {
        ...inputPart,
        _addrRoot: nftRootAddress,
        _addrIndex: nftToSellIndex,
        _auctionDuration: 30,
      },
      multisigAcc: wallet,
      dest: await auctionRoot.getAddress(),
      value: toNano(1.5),
    });

    offerAddress = (await auctionRoot.runLocal("getOfferAddress", inputPart))
      .decoded.output.offerAddress;

    offerAccount = new Account(contracts.AuctionContract, {
      address: offerAddress,
      client,
      signer: signerNone(),
    });

    console.log(offerAddress);

    const pendingOfferExists = (
      await auctionRoot.runLocal("pendingOfferExists", {
        _addr: nftToSellAddress,
      })
    ).decoded.output.offerExists;

    expect(pendingOfferExists).to.be.equal(true);
  });

  it("Place a bid", async () => {
    const wallet = wallets[3];

    const bidValue = toNano(1.5);
    await clientController.sendTransactionWithPayload({
      abi: AuctionContract.abi,
      function_name: "placeBid",
      input: {},
      multisigAcc: wallet,
      dest: offerAddress,
      value: bidValue,
    });

    let currentBid = (await offerAccount.runLocal("currentBid", {})).decoded
      .output.currentBid;

    while (currentBid.value == 0) {
      currentBid = (await offerAccount.runLocal("currentBid", {})).decoded
        .output.currentBid;
    }
    console.log(currentBid);

    expect(currentBid.addr).to.be.equal(await wallet.getAddress());
    expect(+currentBid.value).to.be.equal(bidValue);
  });

  it("Place a bid without payload", async () => {
    const wallet = wallets[1];

    const bidValue = (await offerAccount.runLocal("nextBidValue", {})).decoded
      .output.nextBidValue;
    console.log(bidValue);

    await wallet.run("submitTransaction", {
      dest: offerAddress,
      value: bidValue,
      bounce: true,
      allBalance: false,
      payload: "",
    });

    let currentBid = (await offerAccount.runLocal("currentBid", {})).decoded
      .output.currentBid;

    for (let i = 0; i < 50; i++) {
      currentBid = (await offerAccount.runLocal("currentBid", {})).decoded
        .output.currentBid;
    }
    console.log(currentBid);

    expect(currentBid.addr).to.be.equal(await wallet.getAddress());
    expect(currentBid.value).to.be.equal(bidValue);
  });

  it("Finish auction", async () => {
    await clientController.sleep(30000);

    await offerAccount.run("finishAuction", {});
    const buyerAddr = await wallets[1].getAddress();

    await clientController.sleep(10000);

    const ownerAddr = (await nftToSellAcc.runLocal("getInfo", {})).decoded
      .output.addrOwner;

    expect(ownerAddr).to.be.equal(buyerAddr);
  });
});
