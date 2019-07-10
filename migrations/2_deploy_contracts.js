const CasinoCollectables = artifacts.require("./CasinoCollectables.sol")

module.exports = function(deployer, network) {
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress = ""
  if (network === "rinkeby") {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317"
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1"
  }

  deployer.deploy(CasinoCollectables, proxyRegistryAddress, { gas: 5000000 })

  // Uncomment this if you want initial item sale support.
  // deployer.deploy(CasinoCollectables, proxyRegistryAddress, {gas: 5000000}).then(() => {
  //   return deployer.deploy(CasinoCollectablesFactory, proxyRegistryAddress, CasinoCollectables.address, {gas: 7000000});
  // }).then(async() => {
  //   var CasinoCollectables = await CasinoCollectables.deployed();
  //   return CasinoCollectables.transferOwnership(CasinoCollectablesFactory.address);
  // })
}
