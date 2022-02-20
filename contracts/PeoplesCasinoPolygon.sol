//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * https://github.com/maticnetwork/pos-portal/blob/master/contracts/common/ContextMixin.sol
 */
abstract contract ContextMixin {
    function msgSender()
        internal
        view
        returns (address payable sender)
    {
        if (msg.sender == address(this)) {
            bytes memory array = msg.data;
            uint256 index = msg.data.length;
            assembly {
                // Load the 32 bytes word from memory with the address on the lower 20 bytes, and mask those.
                sender := and(
                    mload(add(array, index)),
                    0xffffffffffffffffffffffffffffffffffffffff
                )
            }
        } else {
            sender = payable(msg.sender);
        }
        return sender;
    }
}

/**
 * https://github.com/maticnetwork/pos-portal/blob/master/contracts/common/Initializable.sol
 */
contract Initializable {
    bool inited = false;

    modifier initializer() {
        require(!inited, "already inited");
        _;
        inited = true;
    }
}

/**
 * https://github.com/maticnetwork/pos-portal/blob/master/contracts/common/EIP712Base.sol
 */
contract EIP712Base is Initializable {
    struct EIP712Domain {
        string name;
        string version;
        address verifyingContract;
        bytes32 salt;
    }

    string constant public ERC712_VERSION = "1";

    bytes32 internal constant EIP712_DOMAIN_TYPEHASH = keccak256(
        bytes(
            "EIP712Domain(string name,string version,address verifyingContract,bytes32 salt)"
        )
    );
    bytes32 internal domainSeperator;

    // supposed to be called once while initializing.
    // one of the contractsa that inherits this contract follows proxy pattern
    // so it is not possible to do this in a constructor
    function _initializeEIP712(
        string memory name
    )
        internal
        initializer
    {
        _setDomainSeperator(name);
    }

    function _setDomainSeperator(string memory name) internal {
        domainSeperator = keccak256(
            abi.encode(
                EIP712_DOMAIN_TYPEHASH,
                keccak256(bytes(name)),
                keccak256(bytes(ERC712_VERSION)),
                address(this),
                bytes32(getChainId())
            )
        );
    }

    function getDomainSeperator() public view returns (bytes32) {
        return domainSeperator;
    }

    function getChainId() public view returns (uint256) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return id;
    }

    /**
     * Accept message hash and returns hash message in EIP712 compatible form
     * So that it can be used to recover signer from signature signed using EIP712 formatted data
     * https://eips.ethereum.org/EIPS/eip-712
     * "\\x19" makes the encoding deterministic
     * "\\x01" is the version byte to make it compatible to EIP-191
     */
    function toTypedMessageHash(bytes32 messageHash)
        internal
        view
        returns (bytes32)
    {
        return
            keccak256(
                abi.encodePacked("\x19\x01", getDomainSeperator(), messageHash)
            );
    }
}

/**
 * https://github.com/maticnetwork/pos-portal/blob/master/contracts/common/NativeMetaTransaction.sol
 */
contract NativeMetaTransaction is EIP712Base {
    bytes32 private constant META_TRANSACTION_TYPEHASH = keccak256(
        bytes(
            "MetaTransaction(uint256 nonce,address from,bytes functionSignature)"
        )
    );
    event MetaTransactionExecuted(
        address userAddress,
        address payable relayerAddress,
        bytes functionSignature
    );
    mapping(address => uint256) nonces;

    /*
     * Meta transaction structure.
     * No point of including value field here as if user is doing value transfer then he has the funds to pay for gas
     * He should call the desired function directly in that case.
     */
    struct MetaTransaction {
        uint256 nonce;
        address from;
        bytes functionSignature;
    }

    function executeMetaTransaction(
        address userAddress,
        bytes memory functionSignature,
        bytes32 sigR,
        bytes32 sigS,
        uint8 sigV
    ) public payable returns (bytes memory) {
        MetaTransaction memory metaTx = MetaTransaction({
            nonce: nonces[userAddress],
            from: userAddress,
            functionSignature: functionSignature
        });
        require(
            verify(userAddress, metaTx, sigR, sigS, sigV),
            "Signer and signature do not match"
        );

        // increase nonce for user (to avoid re-use)
        nonces[userAddress] = nonces[userAddress] + 1;

        emit MetaTransactionExecuted(
            userAddress,
            payable(msg.sender),
            functionSignature
        );

        // Append userAddress and relayer address at the end to extract it from calling context
        (bool success, bytes memory returnData) = address(this).call(
            abi.encodePacked(functionSignature, userAddress)
        );
        require(success, "Function call not successful");

        return returnData;
    }

    function hashMetaTransaction(MetaTransaction memory metaTx)
        internal
        pure
        returns (bytes32)
    {
        return
            keccak256(
                abi.encode(
                    META_TRANSACTION_TYPEHASH,
                    metaTx.nonce,
                    metaTx.from,
                    keccak256(metaTx.functionSignature)
                )
            );
    }

    function getNonce(address user) public view returns (uint256 nonce) {
        nonce = nonces[user];
    }

    function verify(
        address signer,
        MetaTransaction memory metaTx,
        bytes32 sigR,
        bytes32 sigS,
        uint8 sigV
    ) internal view returns (bool) {
        require(signer != address(0), "NativeMetaTransaction: INVALID_SIGNER");
        return
            signer ==
            ecrecover(
                toTypedMessageHash(hashMetaTransaction(metaTx)),
                sigV,
                sigR,
                sigS
            );
    }
}


/**
 * @title PeoplesCasino
 * PeoplesCasino - a contract for non-fungible functional casino games.
 */
contract PeoplesCasino is ERC721, ContextMixin, NativeMetaTransaction, Ownable {

    using SafeMath for uint;
    mapping(uint => uint) houseReserves;
    uint MAX_PAYOUT = 3000 ether;
    string _baseTokenURI = "https://peoplescasino.online/api/polygon";
    event BetResult(uint tokenId, uint random, uint oddsPercentage);
    mapping(uint => string) extraData;
    struct Bet {
        uint blockNumber;
        address sender;
        uint betAmount;
        uint oddsPercentage;
    }
    mapping(uint => Bet) ongoingBets;


    constructor (string memory name_, string memory symbol_) ERC721(name_, symbol_) {
        _initializeEIP712(name_);
    }

    /**
     * This is used instead of msg.sender as transactions won't be sent by the original token owner, but by OpenSea.
     */
    function _msgSender()
        internal
        override
        view
        returns (address sender)
    {
        return ContextMixin.msgSender();
    }

    /**
    * As another option for supporting trading without requiring meta transactions, override isApprovedForAll to whitelist OpenSea proxy accounts on Matic
    */
    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
        if (_operator == address(0x58807baD0B376efc12F5AD86aAc70E78ed67deaE)) {
            return true;
        }
        
        return ERC721.isApprovedForAll(_owner, _operator);
    }

    function _baseURI() internal override view virtual returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseTokenURI(string memory tokenURI) public payable onlyOwner {
        _baseTokenURI = tokenURI;
    } 

    function mint(uint tokenId) public payable onlyOwner {
        _mint(msg.sender, tokenId);
    }

    function mintMultiple(uint tokenIdStart, uint tokenIdEnd) public payable onlyOwner {
        for (uint id = tokenIdStart; id <= tokenIdEnd; id++) {
        _mint(msg.sender, id);
        }
    } 

    function setMaxPayout(uint maxPayout) public payable onlyOwner {
        MAX_PAYOUT = maxPayout;
    }

    function getPayout(uint betAmount, uint oddsPercentage) internal pure returns (uint) {
        return betAmount.mul(96).div(oddsPercentage); // 4% house edge
    }

    function getIsBetActive(uint tokenId) internal view returns (bool) {
        uint blockNumber = ongoingBets[tokenId].blockNumber;
        if (blockNumber.add(1) == block.number) {
        return true;
        }
        return blockNumber > 0 && blockhash(blockNumber.add(1)) != bytes32(0);
    }

    function getPayoutFromBet(uint tokenId) internal view returns (uint) {
        if (getIsBetActive(tokenId)) {
        uint betAmount = ongoingBets[tokenId].betAmount;
        uint oddsPercentage = ongoingBets[tokenId].oddsPercentage;
        return getPayout(betAmount, oddsPercentage);
        }
        return 0;
    }

    function getHouseReserve(uint tokenId) public view returns (uint) {
        uint currentBetPayout = getPayoutFromBet(tokenId);
        return houseReserves[tokenId].sub(currentBetPayout);
    } 

    function depositHouseReserve(uint tokenId) public payable {
        require(ownerOf(tokenId) != address(0), "Casino does not exist");
        houseReserves[tokenId] = houseReserves[tokenId].add(msg.value);
    } 

    function withdrawalHouseReserve(uint tokenId, uint amount) public payable {
        require(msg.sender == ownerOf(tokenId), "Sender is not the owner of the casino");
        uint houseReserve = getHouseReserve(tokenId);
        require(houseReserve >= amount);
        houseReserves[tokenId] = houseReserves[tokenId].sub(amount);
        payable(msg.sender).transfer(amount);
    }

    function getOngoingBetSender(uint tokenId) public view returns (address) {
        return ongoingBets[tokenId].sender;
    }

    function commitBet(uint tokenId, uint oddsPercentage) public payable {
        require(ownerOf(tokenId) != address(0), "Casino does not exist");
        require(!getIsBetActive(tokenId), "Casino in play");
        require(oddsPercentage > 1, "Bet is too low");
        require(oddsPercentage < 99, "Bet is too high");
        uint payout = getPayout(msg.value, oddsPercentage);
        require(payout < houseReserves[tokenId].add(msg.value), "Casino too poor");
        require(payout < MAX_PAYOUT, "Payout above max");
        houseReserves[tokenId] = houseReserves[tokenId].add(msg.value);
        ongoingBets[tokenId].blockNumber = block.number;
        ongoingBets[tokenId].sender = msg.sender;
        ongoingBets[tokenId].betAmount = msg.value;
        ongoingBets[tokenId].oddsPercentage = oddsPercentage;
    }

    function getResult(uint tokenId) public payable {
        uint blockNumber = ongoingBets[tokenId].blockNumber;
        require(blockNumber > 0, "Bet not started");
        require(blockNumber < block.number - 1, "Result called too soon");
        require(ongoingBets[tokenId].sender == msg.sender, "Sender not better");
        bytes32 nextBlockhash = blockhash(blockNumber.add(1));
        uint oddsPercentage = ongoingBets[tokenId].oddsPercentage;
        uint betAmount = ongoingBets[tokenId].betAmount;
        uint randomPercent = 100 - uint256(nextBlockhash) % 100;
        uint payout = getPayout(betAmount, oddsPercentage);
        address sender = address(uint160(ongoingBets[tokenId].sender));
        delete ongoingBets[tokenId];
        if (randomPercent <= oddsPercentage) {
            houseReserves[tokenId] = houseReserves[tokenId].sub(payout);
            payable(sender).transfer(payout);
        }
        emit BetResult(tokenId, randomPercent, oddsPercentage);
    }

    function setExtraData(uint tokenId, string memory data) public payable {
        require(msg.sender == ownerOf(tokenId), "Sender is not the owner of the casino");
        extraData[tokenId] = data;
    } 

    function getExtraData(uint tokenId) public view returns (string memory) {
        return extraData[tokenId];
    }

}