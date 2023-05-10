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

const contracts = config.contracts;

TonClient.useBinaryLibrary(libNode);

describe("Sell contracts tests", () => {
  let client;
  let clientController;
  let nftRoot;
  let nftRootAddress;
  let sellRoot;
  let wallets = [];

  let nftToSellAcc;
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

    sellRoot = new Account(contracts.SellRootContract, {
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

  it("Put NFT on sale (sell offer deployment)", async () => {
    const wallet = wallets[1];
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
      abi: contracts.SellRootContract.abi,
      function_name: "deployOffer",
      input: {
        _addrRoot: nftRootAddress,
        _addrIndex: nftToSellIndex,
        ...inputPart,
      },
      multisigAcc: wallet,
      dest: await sellRoot.getAddress(),
      value: toNano(2),
    });

    offerAddress = (await sellRoot.runLocal("getOfferAddress", inputPart))
      .decoded.output.offerAddress;

    console.log(offerAddress);

    const pendingOfferExists = (
      await sellRoot.runLocal("pendingOfferExists", { _addr: nftToSellAddress })
    ).decoded.output.offerExists;

    expect(pendingOfferExists).to.be.equal(true);
  });

  /*it("Confirm offer deployment by getting allowance info", async () => {
    const allowance = (await nftToSellAcc.runLocal("getAllowance", {})).decoded
      .output.addr;

    expect(allowance).to.be.equal(offerAddress);
  });*/

  it("Buy token", async () => {
    const wallet = wallets[2];

    await clientController.sendTransactionWithPayload({
      abi: contracts.SellContract.abi,
      function_name: "buyToken",
      multisigAcc: wallet,
      dest: offerAddress,
      value: toNano(1),
    });

    await clientController.sleep(20000);

    const ownerAddress = (await nftToSellAcc.runLocal("getOwner")).decoded
      .output.addrOwner;
    expect(ownerAddress).to.be.equal(await wallet.getAddress());
  });
});
