var Migrations = artifacts.require("./Migrations.sol")

module.exports = function(deployer) {
  deployer.deploy(Migrations, { gas: 6721975 })
}
