pragma ton-solidity ^0.47.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
pragma AbiHeader time;

import '../interfaces/IOffersRoot.sol';

import '../../resolvers/IndexResolver.sol';

import '../../errors/BaseErrors.sol';

import '../../errors/BaseErrors.sol';
import '../errors/OffersBaseErrors.sol';

import '../../interfaces/IData.sol';

import '../../libraries/Constants.sol';

abstract contract OffersRoot is IOffersRoot, IndexResolver {
    uint ownerPubkey;

    uint8 public marketFee;
    uint8 public marketFeeDecimals;
    uint128 public deploymentFee;
    uint128 deploymentFeePart;
    
    TvmCell offerCode;

    // _deploymentFee should be at least 1.5 ton
    function setDefaultProperties(
        TvmCell codeIndex,
        uint _pubkey,
        TvmCell _offerCode,
        uint128 _deploymentFee,
        uint8 _marketFee, 
        uint8 _marketFeeDecimals
    )  
        internal
    {
        // Declared in IndexResolver
        _codeIndex = codeIndex;

        offerCode = _offerCode;

        ownerPubkey = _pubkey;
        deploymentFee = _deploymentFee;
        marketFee = _marketFee;
        marketFeeDecimals = _marketFeeDecimals;

        (deploymentFeePart, ) = math.divmod(deploymentFee, 4);
    }

    function changeDeploymentFee(uint128 _value) override external onlyOwner {
        tvm.accept();
        deploymentFee = _value;
        (deploymentFeePart, ) = math.divmod(deploymentFee, 4);
    }

    function changeMarketFee(uint8 _value, uint8 _decimals) override external onlyOwner {
        tvm.accept();
        marketFee = _value;
        marketFeeDecimals = _decimals;
    }

    function setOfferCode(TvmCell _newCode) external onlyOwner {
        tvm.accept();
        offerCode = _newCode;
    }

    function withdraw(address _dest, uint128 _value) external pure onlyOwner {
        tvm.accept();
        _dest.transfer(_value, true);
    }

    modifier onlyOwner() {
        require(msg.pubkey() == ownerPubkey, BaseErrors.message_sender_is_not_my_owner);
        _;
    }
}