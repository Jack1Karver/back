pragma ton-solidity ^0.46.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
pragma AbiHeader time;

import './errors/RootDeployerErrors.sol';
import './CollectionRoot.sol';

contract RootDeployer {
    uint ownerPubkey;
    TvmCell collectionRootCode;
    // TODO: amount. How much to send and how much to keep
    uint128 public deploymentFee;
    uint128 feePart;

    // TODO: colection set of standart fields 
    struct CollectionRootInfo {
        bytes symbol;
        bytes name;
        uint128 tokensAmount;
    }

    // TODO: store or not to store?
    mapping (address => CollectionRootInfo) public collections;

    event collectionRootDeployed(address addr, CollectionRootInfo info);

    constructor(
        uint _pubkey,
        TvmCell _collectionRootCode,
        uint128 _deploymentFee
    ) public {
        require(tvm.pubkey() != 0 && tvm.pubkey() == msg.pubkey(), RootDeployerErrors.message_sender_is_not_my_owner);
        tvm.accept();
        ownerPubkey = _pubkey;
        collectionRootCode = _collectionRootCode;
        deploymentFee = _deploymentFee;
        (feePart, ) = math.divmod(deploymentFee, 2);
    }

    // 0 tokensAmount - no restrictions
    function deployCollectionRoot(
        uint _pubkey,
        bytes _symbol,
        bytes _name,
        uint128 _tokensAmount
    ) external returns (address collectionRootAddress) {
        require(msg.value >= deploymentFee, RootDeployerErrors.not_enough_value_to_deploy);
        require(_pubkey != 0, RootDeployerErrors.wrong_pubkey);
        
        // TODO: unique addresses problem
        collectionRootAddress = new CollectionRoot{
        wid: address(this).wid,
        value: feePart,
        pubkey: _pubkey,
        code: collectionRootCode,
        varInit: {
            symbol: _symbol,
            name: _name,
            tokensAmount: _tokensAmount
        }
        }(msg.sender);

        CollectionRootInfo collectionInfo = CollectionRootInfo(_symbol, _name, _tokensAmount);
        collections[collectionRootAddress] = collectionInfo;
        emit collectionRootDeployed(collectionRootAddress, collectionInfo);
    }

    function getCollectionRootAddress(
        uint _pubkey,
        bytes _symbol,
        bytes _name,
        uint128 _tokensAmount
    ) external view returns (address collectionRootAddress) {
        TvmCell data = tvm.buildStateInit({
        contr: CollectionRoot,
        code: collectionRootCode,
        pubkey: _pubkey,
        varInit: {
            symbol: _symbol,
            name: _name,
            tokensAmount: _tokensAmount
                }
        });

        collectionRootAddress = address(tvm.hash(data));
    }

    function changeDeploymentFee(uint128 _value) external onlyOwner {
        tvm.accept();
        deploymentFee = _value;
        (feePart, ) = math.divmod(deploymentFee, 2);
    }

    function withdraw(address _dest, uint128 _grams) external pure onlyOwner {
        tvm.accept();
        _dest.transfer(_grams, true);
    }

    /** ---- **/
    
    modifier onlyOwner() {
        require(msg.pubkey() == ownerPubkey, RootDeployerErrors.message_sender_is_not_my_owner);
        _;
    }
}