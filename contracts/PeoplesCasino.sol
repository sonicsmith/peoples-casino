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
  event BetResult(uint tokenId, uint roll, bool win);
  string _baseTokenURI = "";

  constructor(address _proxyRegistryAddress) 
  TradeableERC721Token("PeoplesCasino", "PCT", _proxyRegistryAddress) 
  public {}

  function baseTokenURI() public view returns (string memory) {
    return _baseTokenURI;
  }

  function mint(uint tokenId) public payable onlyOwner {
    _mint(msg.sender, tokenId);
  }

  function setBaseTokenURI(string memory tokenURI) public payable onlyOwner {
    _baseTokenURI = tokenURI;
  } 

  function setMaxPayout(uint maxPayout) public payable onlyOwner {
    MAX_PAYOUT = maxPayout;
  }

  function getHouseReserve(uint tokenId) public view returns (uint) {
    require(ownerOf(tokenId) != address(0));
    return houseReserves[tokenId];
  } 

  function addToHouseReserve(uint tokenId) public payable {
    require(ownerOf(tokenId) != address(0));
    houseReserves[tokenId] += msg.value;
  } 

  function subtractFromHouseReserve(uint tokenId, uint amount) public payable {
    require(msg.sender == ownerOf(tokenId));
    require(houseReserves[tokenId] >= amount);
    msg.sender.transfer(amount);
  } 

  function getRandomPercent() internal view returns (uint) {
    return uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 100;
  }

  function makeBet(uint tokenId, uint oddsPercentage) public payable {
    require(ownerOf(tokenId) != address(0));
    require(oddsPercentage > 0);
    require(oddsPercentage < 100);
    // Remove 1% house charges
    uint payout = msg.value.mul(99).div(oddsPercentage);
    require(payout < houseReserves[tokenId].add(msg.value));
    require(payout < MAX_PAYOUT);
    // Bet is now underway. 
    // Add wager to house.
    houseReserves[tokenId] = houseReserves[tokenId].add(msg.value);
    // Roll the dice
    uint roll = getRandomPercent();
    // Payout winner if needed
    if (roll <= oddsPercentage) {
      msg.sender.transfer(payout);
    }
    // Make the result available
    emit BetResult(tokenId, roll, roll <= oddsPercentage);
  }

}