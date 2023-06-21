pragma ton-solidity ^0.47.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
pragma AbiHeader time;

import './resolvers/IndexResolver.sol';
import './resolvers/DataResolver.sol';

import './IndexBasis.sol';

import './interfaces/IData.sol';
import './interfaces/IIndexBasis.sol';

import './errors/BaseErrors.sol';
import './errors/NftRootErrors.sol';
import './libraries/Constants.sol';

contract NftRoot is DataResolver, IndexResolver {
    uint _totalMinted;
    address _addrBasis;

    bytes public name;
    bytes public symbol;
    
    uint ownerPubkey;
    address ownerAddress;

    mapping(address => bool) managersList;
    address[] managersListArr;

    uint128 public mintingFee;

    event tokenMinted(address ownerAddr, address dataAddr, bytes name, bytes url);

    constructor(
        TvmCell codeIndex,
        TvmCell codeData,
        uint _pubkey,
        address _ownerAddress,
        bytes _name,
        bytes _symbol,
        address[] _managersList,
        uint128 _mintingFee
    )
        public
    {
        tvm.accept();
        _codeIndex = codeIndex;
        _codeData = codeData;

        ownerPubkey = _pubkey;
        name = _name;
        symbol = _symbol;

        for (uint8 i = 0; i < _managersList.length; i++) {
            managersList[_managersList[i]] = true;
        }
        managersListArr = _managersList;

        ownerAddress = _ownerAddress;
        mintingFee = _mintingFee;
    }

    function mint(
        bytes _name,
        bytes _url,
        uint8 _royalty
    ) 
        public
    {
        require(msg.value >= mintingFee, BaseErrors.not_enough_value);

        uint tokenId = _totalMinted + 1;
        TvmCell codeData = _buildDataCode(address(this));
        TvmCell stateData = _buildDataState(codeData, tokenId);
        address dataAddr = new Data{
            stateInit: stateData,
            value: 1.1 ton
        }(
            msg.sender, 
            _codeIndex, 
            _name,
            _url,
            1,
            1, 
            managersListArr, 
            _royalty
        );

        _totalMinted = tokenId;

        emit tokenMinted(msg.sender, dataAddr, _name, _url);
    }

    function deployBasis(TvmCell codeIndexBasis) public onlyOwner {
        tvm.accept();
        uint256 codeHasData = resolveCodeHashData();
        TvmCell state = tvm.buildStateInit({
            contr: IndexBasis,
            varInit: {
                _codeHashData: codeHasData,
                _addrRoot: address(this)
            },
            code: codeIndexBasis
        });
        _addrBasis = new IndexBasis{stateInit: state, value: 0.4 ton}();
    }

    function destructBasis() public view onlyOwner {
        tvm.accept();
        IIndexBasis(_addrBasis).destruct();
    }

    function addManager(address _addr) external onlyOwner {
        require(!managersList.exists(_addr), BaseErrors.wrong_manager_address);
        tvm.accept();
        managersListArr.push(_addr);
        managersList[_addr] = true;
    }

    function removeManager(address _addr) external onlyOwner {
        require(managersList.exists(_addr), BaseErrors.wrong_manager_address);
        tvm.accept();
        delete managersList[_addr];
        for (uint8 i = 0; i < managersListArr.length; i++) {
            if (managersListArr[i] == _addr) {
                delete managersListArr[i];
                managersListArr[i] = managersListArr[managersListArr.length - 1];
                managersListArr.pop();
            }
        }
    }

    function getManagersList() external view returns (address[] managers) {
        managers = managersListArr;
    }

    function changeMintingFee(uint128 _value) external onlyOwner {
        tvm.accept();
        mintingFee = _value;
    }

    function changeInternalOwner(address _owner) external onlyOwner {
        tvm.accept();
        ownerAddress = _owner;
    }

    function changeExternalOwner(uint _pubkey) external onlyOwner {
        tvm.accept();
        ownerPubkey = _pubkey;
    }

    function withdraw(address _dest, uint128 _value) external pure onlyOwner {
        require(address(this).balance - _value >= 10 ton, BaseErrors.not_enough_balance_to_withdraw);
        tvm.accept();
        _dest.transfer(_value, true);
    }

    /** ----- **/

    function isOwner() private view returns(bool) {
        return isInternalOwner() || isExternalOwner();
    }

    function isInternalOwner() private view returns(bool) {
        return msg.sender == ownerAddress;
    }

    function isExternalOwner() private view returns(bool) {
        return ownerPubkey == msg.pubkey();
    }

    modifier onlyOwner {
		require(isOwner(), BaseErrors.message_sender_is_not_my_owner);
		_;
	}
}
