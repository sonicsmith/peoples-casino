const PeoplesCasino = artifacts.require("./PeoplesCasino.sol")

module.exports = function(deployer) {
  deployer.deploy(PeoplesCasino, { gas: 6721975 })
}
