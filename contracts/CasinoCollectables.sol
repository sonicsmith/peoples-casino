pragma solidity ^0.5.0;

import "./TradeableERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title CasinoCollectables
 * CasinoCollectables - a contract for my non-fungible creatures.
 */
contract CasinoCollectables is TradeableERC721Token {

  using SafeMath for uint;
  mapping(uint => uint) houseReserves;
  uint MAX_PAYOUT = 3 ether;
  event BetResult(uint tokenId, uint roll, bool win);

  constructor(address _proxyRegistryAddress) 
  TradeableERC721Token("CasinoCollectables", "OSC", _proxyRegistryAddress) 
  public {}

  function baseTokenURI() public view returns (string memory) {
    // TODO: Host images for token
    return "https://opensea-creatures-api.herokuapp.com/api/creature/";
  }

  function getHouseReserve(uint tokenId) public view returns (uint) {
    return houseReserves[tokenId];
  } 

  function addToHouseReserve(uint tokenId) public payable {
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
    require(oddsPercentage > 0);
    require(oddsPercentage < 100);

    // Remove 2% house charges
    uint payout = msg.value.mul(98).div(oddsPercentage);

    require(payout < houseReserves[tokenId]);
    require(payout < MAX_PAYOUT);

    uint roll = getRandomPercent();
    if (roll <= oddsPercentage) {
      msg.sender.transfer(payout);
    }
    
    emit BetResult(tokenId, roll, roll <= oddsPercentage);
  }

}