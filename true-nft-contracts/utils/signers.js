const { signerKeys } = require("@tonclient/core");
const { add0x } = require("./utils");

const rtwSigner = require("../keys/NftRoot.keys.json");
const secondSignerFile = require("../keys/second.keys.json");
const user1SignerFile = require("../keys/user1.keys.json");
const user2SignerFile = require("../keys/user2.keys.json");
const user3SignerFile = require("../keys/user3.keys.json");
const user4SignerFile = require("../keys/user4.keys.json");

const mainSigner = signerKeys(rtwSigner);
const mainSignerPublic = add0x(mainSigner.keys.public);
const secondSigner = signerKeys(secondSignerFile);
const secondSignerPublic = add0x(secondSigner.keys.public);

const signers = [
  signerKeys(user1SignerFile),
  signerKeys(user2SignerFile),
  signerKeys(user3SignerFile),
  signerKeys(user4SignerFile),
];
const signersPublics = signers.map((signer) => add0x(signer.keys.public));

module.exports = {
  mainSigner,
  mainSignerPublic,
  secondSigner,
  secondSignerPublic,
  signers,
  signersPublics,
};
