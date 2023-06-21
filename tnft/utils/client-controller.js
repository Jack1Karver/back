const { Account } = require("@tonclient/appkit");
const { utf8ToHex, toNano } = require("./utils");
const { config } = require("./config");
const { signerNone, abiContract } = require("@tonclient/core");

const contracts = config.contracts;

class ClientController {
  constructor({ client, nftRoot }) {
    this.client = client;
    this.nftRoot = nftRoot;
  }

  async deployRootContract({ initInput, account, name, useGiver }) {
    const { acc_type } = await account.getAccount();
    if (acc_type !== 1) {
      await account.deploy({
        initFunctionName: "constructor",
        initInput,
        useGiver,
      });
    }

    const address = await account.getAddress();

    console.log(`${name || ""} was deployed at address ${address}`);

    return address;
  }

  async deployMultisig({ signer, signerPublic }) {
    const multisig = new Account(contracts.SafeMultisigWalletContract, {
      signer,
      client: this.client,
    });

    const { acc_type } = await multisig.getAccount();

    if (acc_type !== 1) {
      await multisig.deploy({
        initInput: {
          owners: [signerPublic],
          reqConfirms: 0,
        },
        useGiver: true,
      });
    }

    const multisigAddress = await multisig.getAddress();
    console.log(`Multisig address: ${multisigAddress}`);

    return multisig;
  }

  async mintNft({ authorWalletAcc, name, authorName, amount, royalty }) {
    amount = amount || 1;

    await this.sendTransactionWithPayload({
      abi: contracts.NftRootContract.abi,
      function_name: "mint",
      input: {
        _name: utf8ToHex(name),
        _url: utf8ToHex("test"),
        _royalty: royalty || 0,
      },
      multisigAcc: authorWalletAcc,
      dest: await this.nftRoot.getAddress(),
      value: toNano(2),
    });

    const nfts = await this.getMyNfts({
      rootAcc: this.nftRoot,
      addrOwner: await authorWalletAcc.getAddress(),
    });
    nfts.forEach((nft) => console.log(nft.decoded.output));

    return nfts;
  }

  async getMyNfts({ rootAcc, addrOwner }) {
    const { codeHashIndex } = (
      await rootAcc.runLocal("resolveCodeHashIndex", {
        addrRoot: await rootAcc.getAddress(),
        addrOwner,
      })
    ).decoded.output;

    let nfts = [];
    let counter = 0;

    while (nfts.length === 0 && counter <= 10) {
      const qwe = await this.client.net.query_collection({
        collection: "accounts",
        filter: {
          code_hash: { eq: codeHashIndex.slice(2) },
        },
        result: "id",
      });
      counter++;
      nfts = qwe.result;
    }

    const promises = nfts.map((el) => {
      const nftIndex = new Account(contracts.IndexContract, {
        client: this.client,
        address: el.id,
        signer: signerNone(),
      });

      return nftIndex.runLocal("getInfo");
    });

    const result = await Promise.all(promises);
    // result.forEach((res) => console.log(res.decoded.output));

    return result;
  }

  async sendTransactionWithPayload({
    abi,
    function_name,
    input,
    multisigAcc,
    dest,
    value,
  }) {
    const transferOwnershipPayload = (
      await this.client.abi.encode_message_body({
        abi: abiContract(abi),
        call_set: {
          function_name: function_name,
          input: input || {},
        },
        is_internal: true,
        signer: multisigAcc.signer,
      })
    ).body;

    await multisigAcc.run("submitTransaction", {
      dest,
      value,
      bounce: true,
      allBalance: false,
      payload: transferOwnershipPayload,
    });
  }

  sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

module.exports = { ClientController };
