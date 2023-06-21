pragma ton-solidity ^0.47.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
pragma AbiHeader time;

import './resolvers/IndexResolver.sol';

import './interfaces/IData.sol';

import './libraries/Constants.sol';

import './errors/BaseErrors.sol';
import './errors/DataErrors.sol';

import './market/interfaces/IOffersRoot.sol';

contract Data is IData, IndexResolver {
    address _addrRoot;
    address _addrOwner;
    address _addrAuthor;
    uint static _id;

    bytes dataName;
    bytes dataUrl;

    uint8 editionNumber;
    uint8 editionAmount;

    mapping(address => bool) managersList;
    address[] managersListArr;

    uint8 public royalty;

    optional(address) allowance;

    constructor(
        address addrOwner,
        TvmCell codeIndex,
        bytes _name,
        bytes _url,
        uint8 _editionNumber,
        uint8 _editionAmount,
        address[] _managersList,
        uint8 _royalty
    ) 
        public 
    {
        optional(TvmCell) optSalt = tvm.codeSalt(tvm.code());
        require(optSalt.hasValue(), 101);
        (address addrRoot) = optSalt.get().toSlice().decode(address);
        require(msg.sender == addrRoot, DataErrors.sender_is_not_my_root);
        require(msg.value >= Constants.MIN_FOR_DEPLOY, BaseErrors.not_enough_value);
        tvm.accept();
        _addrRoot = addrRoot;
        _addrOwner = addrOwner;
        _addrAuthor = addrOwner;
        _codeIndex = codeIndex;

        dataName = _name;
        dataUrl = _url;
        editionNumber = _editionNumber;
        editionAmount = _editionAmount;

        for (uint8 i = 0; i < _managersList.length; i++) {
            managersList[_managersList[i]] = true;
        }
        managersListArr = _managersList;

        royalty = _royalty;

        deployIndex(addrOwner);
    }

    function transferOwnership(address addrTo) public override {
        require((msg.sender == _addrOwner && !allowance.hasValue()) || (allowance.hasValue() && allowance.get() == msg.sender), DataErrors.not_enough_allowance_or_not_owner);
        require(msg.value >= Constants.MIN_FOR_DEPLOY, BaseErrors.not_enough_value);
        removeAllowance();

        address oldIndexOwner = resolveIndex(_addrRoot, address(this), _addrOwner);
        IIndex(oldIndexOwner).destruct();
        address oldIndexOwnerRoot = resolveIndex(address(0), address(this), _addrOwner);
        IIndex(oldIndexOwnerRoot).destruct();

        _addrOwner = addrTo;

        deployIndex(addrTo);
    }

    function deployIndex(address owner) private {
        TvmCell codeIndexOwner = _buildIndexCode(_addrRoot, owner);
        TvmCell stateIndexOwner = _buildIndexState(codeIndexOwner, address(this));
        new Index{stateInit: stateIndexOwner, value: 0.4 ton}(_addrRoot);

        TvmCell codeIndexOwnerRoot = _buildIndexCode(address(0), owner);
        TvmCell stateIndexOwnerRoot = _buildIndexState(codeIndexOwnerRoot, address(this));
        new Index{stateInit: stateIndexOwnerRoot, value: 0.4 ton}(_addrRoot);
    }

    function getInfo() public view override returns (
        address addrRoot,
        address addrOwner,
        address addrAuthor,
        address addrData,
        uint id,
        bytes name,
        bytes url,
        uint8 number,
        uint8 amount
    ) {
        addrRoot = _addrRoot;
        addrOwner = _addrOwner;
        addrAuthor = _addrAuthor;
        addrData = address(this);
        name = dataName;
        url = dataUrl;
        id = _id;
        number = editionNumber;
        amount = editionAmount;
    }

    function getInfoResponsible() public view responsible returns (
        address addrRoot,
        address addrOwner,
        address addrAuthor,
        address addrData,
        uint id,
        bytes name,
        bytes url,
        uint8 number,
        uint8 amount
    ) {
        return{value: 0, flag: 64} (_addrRoot, _addrOwner, _addrAuthor, address(this), _id, dataName, dataUrl, editionNumber, editionAmount);
    }

    function getOwner() public view override returns(address addrOwner) {
        addrOwner = _addrOwner;
    }

    function getOwnerResponsible() public view responsible returns(address addrOwner) {
        return{value: 0, flag: 64}  (_addrOwner);
    }

    function lendOwnership(address _addr) external override onlyManager {
        tvm.rawReserve(address(this).balance - (msg.value - 0.1 ton), 2);
        if (allowance.hasValue()) {
            IOffersRoot(msg.sender).declineOffer{value: 0, flag: 128}();
        } else {
            setAllowance(_addr);
            IOffersRoot(msg.sender).confirmOffer{value: 0, flag: 128}(royalty, _addrAuthor);
        }
    }

    function returnOwnership() override external {
        require(msg.sender == allowance.get(), DataErrors.not_enough_allowance);
        tvm.rawReserve(address(this).balance - msg.value, 2);
        removeAllowance();
        _addrOwner.transfer({value: 0, flag: 128});
    }

    function setAllowance(address _addr) private {
        allowance = _addr;
    }

    function removeAllowance() private {
        allowance.reset();   
    }

    function getAllowance() external view returns(address addr) {
        addr = allowance.get();
    }

    function burn(address _dest) external onlyOwner {
        tvm.accept();
        selfdestruct(_dest);
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

    modifier onlyOwner() {
        require(msg.sender == _addrOwner, BaseErrors.message_sender_is_not_my_owner);
        _;
    }

    modifier onlyManager() {
        require(managersList.exists(msg.sender), BaseErrors.sender_is_not_manager);
        _;
    }

    modifier allowanceNotExists() {
        require(!allowance.hasValue(), DataErrors.allowance_exists);
        _;
    }
}