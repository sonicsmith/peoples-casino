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
  event BetResult(uint tokenId, uint roll, uint rollUnder);
  string _baseTokenURI = "https://peoplescasino.online/api/";
  mapping(uint => string) extraData;

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

  function getHouseReserve(uint tokenId) public view returns (uint) {
    require(ownerOf(tokenId) != address(0), "Casino does not exist");
    return houseReserves[tokenId];
  } 

  function depositHouseReserve(uint tokenId) public payable {
    require(ownerOf(tokenId) != address(0), "Casino does not exist");
    houseReserves[tokenId] += msg.value;
  } 

  function withdrawalHouseReserve(uint tokenId, uint amount) public payable {
    require(msg.sender == ownerOf(tokenId), "Account is not the owner of the casino");
    require(houseReserves[tokenId] >= amount);
    houseReserves[tokenId] -= amount;
    msg.sender.transfer(amount);
  } 

  function getRandomPercent() internal view returns (uint) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 100;
  }

  function makeBet(uint tokenId, uint oddsPercentage) public payable {
    require(ownerOf(tokenId) != address(0), "Casino does not exist");
    require(oddsPercentage > 1, "Bet is too low");
    require(oddsPercentage < 99, "Bet is too high");
    // Remove 4% house charges
    uint payout = msg.value.mul(96).div(oddsPercentage);
    require(payout < houseReserves[tokenId].add(msg.value), "Payout is too high");
    require(payout < MAX_PAYOUT, "Payout is too high");
    // Bet is now underway.
    // Add wager to house.
    houseReserves[tokenId] = houseReserves[tokenId].add(msg.value);
    // Roll the dice
    uint roll = getRandomPercent();
    // Payout winner if needed
    if (roll <= oddsPercentage) {
      // Remove winnings from house.
      houseReserves[tokenId] = houseReserves[tokenId].sub(payout);
      msg.sender.transfer(payout);
    }
    // Make the result available
    emit BetResult(tokenId, roll, oddsPercentage);
  }

  function setExtraData(uint tokenId, string memory data) public payable {
    require(msg.sender == ownerOf(tokenId), "Account is not the owner of the casino");
    extraData[tokenId] = data;
  } 

  function getExtraData(uint tokenId) public view returns (string memory) {
    require(ownerOf(tokenId) != address(0), "Casino does not exist");
    return extraData[tokenId];
  } 

}