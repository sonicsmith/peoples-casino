pragma solidity ^0.5.0;

import "./TradeableERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title PeoplesCasino
 * PeoplesCasino - a contract for non-fungible functional casino games.
 */
contract PeoplesCasino is TradeableERC721Token {

  using SafeMath for uint;
  mapping(uint => uint) houseReserves;
  uint MAX_PAYOUT = 3 ether;
  event BetResult(uint tokenId, uint random, uint oddsPercentage);
  string _baseTokenURI = "https://peoplescasino.online/api/";
  mapping(uint => string) extraData;
  struct Bet {
    uint blockNumber;
    address sender;
    uint betAmount;
    uint oddsPercentage;
  }
  mapping(uint => Bet) ongoingBets;

  constructor() 
  TradeableERC721Token("PeoplesCasino", "PCT", 0xa5409ec958C83C3f309868babACA7c86DCB077c1) 
  public {}

  function baseTokenURI() public view returns (string memory) {
    return _baseTokenURI;
  }

  function mint(uint tokenId) public payable onlyOwner {
    _mint(msg.sender, tokenId);
  }

  function mintMultiple(uint tokenIdStart, uint tokenIdEnd) public payable onlyOwner {
    for (uint id = tokenIdStart; id <= tokenIdEnd; id++) {
      _mint(msg.sender, id);
    }
  }

  function setBaseTokenURI(string memory tokenURI) public payable onlyOwner {
    _baseTokenURI = tokenURI;
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
    msg.sender.transfer(amount);
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
    address payable sender = address(uint160(ongoingBets[tokenId].sender));
    delete ongoingBets[tokenId];
    if (randomPercent <= oddsPercentage) {
      houseReserves[tokenId] = houseReserves[tokenId].sub(payout);
      sender.transfer(payout);
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