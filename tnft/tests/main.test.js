const fs = require("fs");

const { Account } = require("@tonclient/appkit");
const { TonClient, signerNone, abiContract } = require("@tonclient/core");
const { libNode } = require("@tonclient/lib-node");

const { utf8ToHex, toNano, hexToUtf8 } = require("../utils/utils");
const { config } = require("../utils/config");

const chai = require("chai");
const assertArrays = require("chai-arrays");
chai.use(assertArrays);
const expect = chai.expect;

const {
  mainSigner,
  mainSignerPublic,
  secondSigner,
  secondSignerPublic,
  signers,
  signersPublics,
} = require("../utils/signers");

const { ClientController } = require("../utils/client-controller");
const { DataContract } = require("../contracts-compiled/DataContract");

const contracts = config.contracts;

TonClient.useBinaryLibrary(libNode);

describe("Deploy main contracts, mint and transfer nfts", () => {
  let client;
  let clientController;

  let nftRoot;
  let sellRoot;
  let auctionRoot;

  let sellRootAddr;
  let auctionRootAddr;

  let zeroAddress =
    "0:0000000000000000000000000000000000000000000000000000000000000000";
  let wallets = [];
  let nftDataAddrs = {};

  before(async () => {
    client = new TonClient({
      network: {
        endpoints: [config.endpoint],
      },
    });
  });

  after(async () => {
    client.close();
  });

  it("Deploy NftRoot contract", async () => {
    nftRoot = new Account(contracts.NftRootContract, {
      signer: mainSigner,
      client,
    });

    clientController = new ClientController({ client, nftRoot });

    await clientController.deployRootContract({
      account: nftRoot,
      initInput: {
        codeIndex: contracts.IndexContract.code,
        codeData: contracts.DataContract.code,
        _pubkey: mainSignerPublic,
        _ownerAddress: zeroAddress,
        _name: config.tokenName,
        _symbol: config.tokenSymbol,
        _managersList: [],
        _mintingFee: toNano(2),
      },
      name: "NftRoot",
      useGiver: true,
    });

    const res = await checkAccountStatus(nftRoot, client);
    expect(1).to.be.equal(res.acc_type);
  });

  it("Deploy SellRoot contract", async () => {
    sellRoot = new Account(contracts.SellRootContract, {
      signer: mainSigner,
      client,
    });

    await clientController.deployRootContract({
      account: sellRoot,
      initInput: {
        codeIndex: contracts.IndexContract.code,
        _pubkey: mainSignerPublic,
        _offerCode: contracts.SellContract.code,
        _deploymentFee: toNano(1.5),
        _offersStorageFee: toNano(0.02),
        _marketFee: 25,
        _marketFeeDecimals: 1,
      },
      name: "SellRoot",
      useGiver: true,
    });

    sellRootAddr = await sellRoot.getAddress();

    const res = await checkAccountStatus(sellRoot, client);
    expect(1).to.be.equal(res.acc_type);
  });

  it("Deploy AuctionRoot contract", async () => {
    auctionRoot = new Account(contracts.AuctionRootContract, {
      signer: mainSigner,
      client,
    });

    await clientController.deployRootContract({
      account: auctionRoot,
      initInput: {
        codeIndex: contracts.IndexContract.code,
        _pubkey: mainSignerPublic,
        _offerCode: contracts.AuctionContract.code,
        _deploymentFee: toNano(1.5),
        _offersStorageFee: toNano(0.02),
        _marketFee: 25,
        _marketFeeDecimals: 1,
        _auctionBidDelta: 10,
      },
      name: "AuctionRoot",
      useGiver: true,
    });
    auctionRootAddr = await auctionRoot.getAddress();

    const res = await checkAccountStatus(auctionRoot, client);
    expect(1).to.be.equal(res.acc_type);
  });

  it("Add manager for NftRoot with addManager method", async () => {
    await nftRoot.run("addManager", { _addr: sellRootAddr });
    await nftRoot.run("addManager", { _addr: auctionRootAddr });

    const managers = (await nftRoot.runLocal("getManagersList", {})).decoded
      .output.managers;

    expect(managers).to.be.containingAllOf([sellRootAddr, auctionRootAddr]);
  });

  it("Remove managers for NftRoot with removeManager method", async () => {
    await nftRoot.run("removeManager", { _addr: sellRootAddr });

    let managers = (await nftRoot.runLocal("getManagersList", {})).decoded
      .output.managers;

    expect(managers).to.be.equalTo([auctionRootAddr]);

    await nftRoot.run("removeManager", { _addr: auctionRootAddr });
    managers = (await nftRoot.runLocal("getManagersList", {})).decoded.output
      .managers;

    expect(managers.length).to.be.equal(0);
  });

  it("addManager on NftRoot again after removing", async () => {
    await nftRoot.run("addManager", { _addr: sellRootAddr });
    await nftRoot.run("addManager", { _addr: auctionRootAddr });

    const managers = (await nftRoot.runLocal("getManagersList", {})).decoded
      .output.managers;

    expect(managers.length).to.be.equal(2);
    expect(managers).to.be.containingAllOf([sellRootAddr, auctionRootAddr]);
  });

  it("Create 4 multisig accounts, mint 4 nfts and validate their fields", async () => {
    let nftDataAddr;
    for (let i = 0; i < signers.length; i++) {
      const multisig = await clientController.deployMultisig({
        signer: signers[i],
        signerPublic: signersPublics[i],
      });

      wallets.push(multisig);
      const multisigAddress = await multisig.getAddress();

      const nfts = await clientController.mintNft({
        authorWalletAcc: multisig,
        name: `Token ${i + 1}`,
        royalty: 10,
      });

      nftDataAddr = nfts[0].decoded.output.addrData;

      nftDataAddrs[i] = [nftDataAddr];

      // const events = await client.net.query_collection({
      //   collection: "messages",
      //   filter: {
      //     src: { eq: await nftRoot.getAddress() },
      //     msg_type: { eq: 2 },
      //   },
      //   result: "boc",
      // });

      // for (let i = 0; i < events.result.length; i++) {
      //   console.log(events.result[i]);
      //   console.log(await nftRoot.decodeMessage(events.result[i].boc));
      // }

      const nftDataAcc = new Account(DataContract, {
        client,
        signer: signerNone(),
        address: nftDataAddr,
      });

      const nftDataOwner = (await nftDataAcc.runLocal("getOwner", {})).decoded
        .output.addrOwner;
      expect(multisigAddress).to.be.equal(nftDataOwner);
    }
  });

  it("Nft transferOwnership from first wallet to second", async () => {
    await clientController.sendTransactionWithPayload({
      abi: DataContract.abi,
      function_name: "transferOwnership",
      input: { addrTo: await wallets[1].getAddress() },
      multisigAcc: wallets[0],
      dest: nftDataAddrs[0][0],
      value: toNano(1),
    });

    const firstWalletNfts = await clientController.getMyNfts({
      rootAcc: nftRoot,
      addrOwner: await wallets[0].getAddress(),
    });
    const secondWalletNfts = await clientController.getMyNfts({
      rootAcc: nftRoot,
      addrOwner: await wallets[1].getAddress(),
    });

    expect(firstWalletNfts.length).to.be.equal(0);
    expect(secondWalletNfts.length).to.be.equal(2);
  });
});

async function checkAccountStatus(account, client) {
  return (
    await client.net.query_collection({
      collection: "accounts",
      filter: {
        id: { eq: account.address },
      },
      result: "acc_type",
    })
  ).result[0];
}
