const CasinoCollectables = artifacts.require("./CasinoCollectables.sol")

contract("CasinoCollectables", accounts => {
  it("do the thing it's meant to", async () => {
    const CasinoCollectablesInstance = await CasinoCollectables.deployed()

    // // Set value of 89
    // await CasinoCollectablesInstance.set(89, { from: accounts[0] })
    // // Get stored value
    // const storedData = await CasinoCollectablesInstance.get.call()

    assert.equal(storedData, 89, "The thing did not happen")
  })
})
