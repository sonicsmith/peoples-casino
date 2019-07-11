const CasinoCollectables = artifacts.require("CasinoCollectables")

contract("CasinoCollectables token", accounts => {
  it("Should make first account an owner", async () => {
    let instance = await CasinoCollectables.deployed()
    let owner = await instance.owner()
    assert.equal(owner, accounts[0])
  })
  // it("Should mint a token with owner", async () => {
  //   let instance = await CasinoCollectables.deployed()
  //   let owner = await instance.owner()
  //   assert.equal(owner, accounts[0])
  // })
})
