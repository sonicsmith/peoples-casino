const PeoplesCasino = artifacts.require("./PeoplesCasino.sol")

module.exports = function(deployer, network) {
  deployer.deploy(PeoplesCasino, { gas: 5000000 })
}
