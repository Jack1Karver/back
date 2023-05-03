pragma ton-solidity ^0.46.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
pragma AbiHeader time;

contract CollectionRoot {
    bytes public static symbol;
    bytes public static name;
    uint128 public static tokensAmount;

    constructor(address _internalOwner) public {
        tvm.accept();
    }
}