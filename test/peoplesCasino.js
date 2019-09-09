const PeoplesCasino = artifacts.require("PeoplesCasino")

// Hard code random number generator to 50 for tests

contract("PeoplesCasino token", accounts => {
  it("Should make first account an owner", async () => {
    const instance = await PeoplesCasino.deployed()
    const owner = await instance.owner()
    assert.equal(owner, accounts[0])
  })
  it("Should mint a token with owner", async () => {
    const instance = await PeoplesCasino.deployed()
    await instance.mint(1)
    const totalSupply = await instance.totalSupply()
    assert.equal(totalSupply, 1)
    const owner = await instance.ownerOf(1)
    assert.equal(owner, accounts[0])
  })
  it("Should deposit to a minted token", async () => {
    const instance = await PeoplesCasino.deployed()
    await instance.depositHouseReserve(1, { value: 2000000 })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 2000000)
  })
  it("Should withdrawal from a minted token", async () => {
    const instance = await PeoplesCasino.deployed()
    await instance.withdrawalHouseReserve(1, 1000000)
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 1000000)
  })
  it("Should make and lose a bet", async () => {
    const instance = await PeoplesCasino.deployed()
    await instance.makeBet(1, 40, { value: 100 })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 1000100)
  })
  it("Should make and win a bet", async () => {
    const instance = await PeoplesCasino.deployed()
    await instance.makeBet(1, 60, { value: 1000 })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 999500)
  })
  it("Should set data in token", async () => {
    const instance = await PeoplesCasino.deployed()
    await instance.setExtraData(1, "TESTING", { value: 1000 })
    const data = await instance.getExtraData(1)
    assert.equal(data, "TESTING")
  })
})
