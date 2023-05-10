pragma ton-solidity ^0.47.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
pragma AbiHeader time;

import './abstract/Offer.sol';

contract Sell is Offer {
    event sellConfirmed(address newOwner);
    event sellCancelled();

    constructor(
        address _markerRootAddr, 
        address _tokenRootAddr,
        address _addrOwner,
        uint8 _marketFee, 
        uint8 _marketFeeDecimals,
        uint8 _royalty,
        address _royaltyAuthor
    ) 
        public 
    {
        tvm.accept();
        
        setDefaultProperties(
            _markerRootAddr, 
            _tokenRootAddr, 
            _addrOwner,
            _marketFee, 
            _marketFeeDecimals,
            _royalty,
            _royaltyAuthor
        );
    }

    function buyToken() external {
        proceedDeal();
    }

    receive() external {
        proceedDeal();
    }

    function proceedDeal() private {
        require(isActive, OffersBaseErrors.offer_is_not_active);
        require(msg.value >= price, OffersBaseErrors.not_enough_value_to_buy);
        require(msg.sender != addrOwner, OffersBaseErrors.buyer_is_my_owner);
        (uint128 totalFeeValue, uint128 royaltyValue, ) = getFeesValues(price);
        if (royaltyValue > 0) {
            royaltyAuthor.transfer(royaltyValue, false);
        }
   
        IData(addrData).transferOwnership{value: Constants.MIN_FOR_DEPLOY + 0.1 ton, bounce: true}(msg.sender);
    
        addrOwner.transfer(price - totalFeeValue, false);
        emit sellConfirmed(msg.sender);
        isActive = false;
        tvm.rawReserve(0.01 ton, 2);
        markerRootAddr.transfer(0, false, 128);
    }

    function cancelOrder() public onlyOwner {
        tvm.accept();
        IData(addrData).returnOwnership{value: 0.1 ton}();
        emit sellCancelled();
        selfdestruct(addrOwner);
    }
}