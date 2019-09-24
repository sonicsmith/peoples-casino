const PeoplesCasino = artifacts.require("PeoplesCasino")

let instance

contract("PeoplesCasino token", accounts => {
  it("Should make first account an owner", async () => {
    instance = await PeoplesCasino.deployed()
    const owner = await instance.owner()
    assert.equal(owner, accounts[0])
  })
  it("Should mint a token with owner", async () => {
    await instance.mint(1)
    const totalSupply = await instance.totalSupply()
    assert.equal(totalSupply, 1)
    const owner = await instance.ownerOf(1)
    assert.equal(owner, accounts[0])
  })
  it("Should deposit to a minted token", async () => {
    await instance.depositHouseReserve(1, { value: 2000000 })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 2000000)
  })
  it("Should withdrawal from a minted token", async () => {
    await instance.withdrawalHouseReserve(1, 1000000)
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 1000000)
  })
  it("Should make and lose a bet", async () => {
    await instance.commitBet(1, 2, { value: 1000 })
    await instance.setExtraData(1, "TESTING", { value: 0 }) // NEEDED TO SPLIT
    await instance.getResult(1, { value: 0 })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 1001000)
  })
  it("Should make and win a bet", async () => {
    await instance.commitBet(1, 96, { value: 1000 })
    await instance.setExtraData(1, "TESTING", { value: 0 }) // NEEDED TO SPLIT
    await instance.getResult(1, { value: 0 })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 1001000)
  })
  it("Should display the correct house reserve", async () => {
    await instance.commitBet(1, 50, { value: 1000 })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 1000080)
  })
  it("Should lose bet after bet has expired", async () => {
    for (let i = 0; i < 257; i++) {
      await instance.setExtraData(1, "TESTING", { value: 0 })
    }
    await instance.getResult(1, { value: 0 })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 1002000)
  })
  /*
  it("Should rewrite bet after bet has expired", async () => {
    await instance.commitBet(1, 96, { value: 1000 })
    for (let i = 0; i < 257; i++) {
      await instance.setExtraData(1, "TESTING", { value: 0 })
    }
    await instance.commitBet(1, 2, { value: 1000, from: accounts[1] })
    await instance.setExtraData(1, "TESTING", { value: 0 })
    await instance.getResult(1, { value: 0, from: accounts[1] })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 1004000)
  })
  it("Should set data in token", async () => {
    await instance.setExtraData(1, "TESTING", { value: 0 })
    const data = await instance.getExtraData(1)
    assert.equal(data, "TESTING")
  })
  */
})
