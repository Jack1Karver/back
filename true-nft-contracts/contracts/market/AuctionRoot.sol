pragma ton-solidity ^0.47.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
pragma AbiHeader time;

import './abstract/OffersRoot.sol';

import './Auction.sol';

contract AuctionRoot is OffersRoot {
    struct MarketOffer {
        address addrRoot;
        address addrOwner;
        address addrData;
        address addrIndex;
        address addrOffer;
        uint128 price;
        uint128 auctionDuration;
        bytes deployHash;
    }

    uint128 offersStorageFee;
    mapping(address => MarketOffer) pendingOffers;

    uint8 public auctionBidDelta;

    event auctionDeployed(address offerAddress, MarketOffer offerInfo);
    event auctionDeclined(address offerAddress, MarketOffer offerInfo);
    
    constructor(
        TvmCell codeIndex,
        uint _pubkey,
        TvmCell _offerCode,
        uint128 _deploymentFee,
        uint128 _offersStorageFee,
        uint8 _marketFee, 
        uint8 _marketFeeDecimals,
        uint8 _auctionBidDelta
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

        offersStorageFee = _offersStorageFee;
        auctionBidDelta = _auctionBidDelta;
    }

    function deployOffer(
        address _addrRoot,
        address _addrIndex,
        address _addrData,
        uint128 _price,
        bytes _hash,
        uint128 _auctionDuration
    )
        external 
        returns(address offerAddress) 
    {
        require(msg.value >= deploymentFee, OffersBaseErrors.not_enough_value_to_deploy);
        require(resolveIndex(_addrRoot, _addrData, msg.sender) == _addrIndex, OffersBaseErrors.seller_is_not_the_owner);
        require(_price >= 0, OffersBaseErrors.wrong_price);

        offerAddress = getOfferAddress(_addrData, _price, _hash);
        MarketOffer offerInfo = MarketOffer(_addrRoot, msg.sender, _addrData, _addrIndex, offerAddress, _price, _auctionDuration, _hash);

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

        offerAddress = new Auction {
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
            offerInfo.auctionDuration,
            auctionBidDelta, 
            offersStorageFee,
            _royalty,
            _royaltyAuthor
        );
        
        emit auctionDeployed(offerAddress, offerInfo);
    }

    function declineOffer() external override {
        require(pendingOffers.exists(msg.sender), OffersBaseErrors.token_not_pending);
        MarketOffer offerInfo = pendingOffers[msg.sender];
        offerInfo.addrOwner.transfer(deploymentFee - 0.15 ton, false);

        delete pendingOffers[msg.sender];
        emit auctionDeclined(offerInfo.addrOffer, offerInfo);
    }

    function changeOffersStorageFee(uint8 _value) external onlyOwner {
        tvm.accept();
        offersStorageFee = _value;
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
            contr: Auction,
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