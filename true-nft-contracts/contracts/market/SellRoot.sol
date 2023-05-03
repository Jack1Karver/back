pragma ton-solidity ^0.47.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
pragma AbiHeader time;

import './abstract/OffersRoot.sol';

import './Sell.sol';

contract SellRoot is OffersRoot {
    struct MarketOffer {
        address addrRoot;
        address addrOwner;
        address addrData;
        address addrIndex;
        address addrOffer;
        uint128 price;
        bytes deployHash;
    }

    mapping(address => MarketOffer) pendingOffers;

    event sellDeployed(address offerAddress, MarketOffer offerInfo);
    event sellDeclined(address offerAddress, MarketOffer offerInfo);

    constructor(
        TvmCell codeIndex,
        uint _pubkey,
        TvmCell _offerCode,
        uint128 _deploymentFee,
        uint8 _marketFee, 
        uint8 _marketFeeDecimals
    ) 
        public 
    {
        tvm.accept();
        // Method and properties are declared in OffersRoot
        setDefaultProperties(
            codeIndex,
            _pubkey,
            _offerCode,
            _deploymentFee,
            _marketFee, 
            _marketFeeDecimals
        );
    }

    function deployOffer(
        address _addrRoot,
        address _addrIndex, 
        address _addrData,
        uint128 _price,
        bytes _hash
    )
        external 
        returns(address offerAddress) 
    {
        require(msg.value >= deploymentFee, OffersBaseErrors.not_enough_value_to_deploy);
        require(resolveIndex(_addrRoot, _addrData, msg.sender) == _addrIndex, OffersBaseErrors.seller_is_not_the_owner);
        require(_price >= 0, OffersBaseErrors.wrong_price);

        offerAddress = getOfferAddress(_addrData, _price, _hash);
        MarketOffer offerInfo = MarketOffer(_addrRoot, msg.sender, _addrData, _addrIndex, offerAddress, _price, _hash);

        pendingOffers[_addrData] = offerInfo;
        IData(_addrData).lendOwnership{value: deploymentFeePart, bounce: true}(offerAddress);
    }

    function confirmOffer(
        uint8 _royalty,
        address _royaltyAuthor
    ) 
        external 
        override 
        returns(address offerAddress) 
    {
        require(pendingOffers.exists(msg.sender), OffersBaseErrors.token_not_pending);
        MarketOffer offerInfo = pendingOffers[msg.sender];

        offerAddress = new Sell {
            wid: address(this).wid,
            value: Constants.MIN_FOR_DEPLOY + 0.5 ton,
            code: offerCode,
            varInit: {
                price: offerInfo.price,
                addrData: offerInfo.addrData,
                deployHash: offerInfo.deployHash
            }
        }(
            address(this), 
            offerInfo.addrRoot, 
            offerInfo.addrOwner, 
            marketFee, 
            marketFeeDecimals,
            _royalty,
            _royaltyAuthor
        );
        
        emit sellDeployed(offerAddress, offerInfo);
    }

    function declineOffer() external override {
        require(pendingOffers.exists(msg.sender), OffersBaseErrors.token_not_pending);
        tvm.accept();
        MarketOffer offerInfo = pendingOffers[msg.sender];
        offerInfo.addrOwner.transfer(deploymentFee - 0.15 ton, false);
        
        delete pendingOffers[msg.sender];
        emit sellDeclined(offerInfo.addrOffer, offerInfo);
    }

    function pendingOfferExists(address _addr) external view onlyOwner returns(bool offerExists) {
        return pendingOffers.exists(_addr);
    }

    function getOfferAddress(
        address _addrData,
        uint128 _price,
        bytes _hash
    ) 
        public 
        view 
        returns (address offerAddress)
    {
        TvmCell data = tvm.buildStateInit({
            contr: Sell,
            code: offerCode,
            varInit: {
                price: _price,
                addrData: _addrData,
                deployHash: _hash
            }
        });

        offerAddress = address(tvm.hash(data));
    }
}