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
    await instance.addToHouseReserve(1, { value: 2000000 })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 2000000)
  })
  it("Should withdrawl from a minted token", async () => {
    const instance = await PeoplesCasino.deployed()
    await instance.subtractFromHouseReserve(1, 1000000)
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 1000000)
  })
  it("Should make and lose a bet", async () => {
    const instance = await PeoplesCasino.deployed()
    const userBalanceBefore = await web3.eth.getBalance(accounts[0])
    await instance.makeBet(1, 48, { value: 100 })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 1000100)
    const userBalanceAfter = await web3.eth.getBalance(accounts[0])
    assert.isAbove(Number(userBalanceBefore), Number(userBalanceAfter))
  })
  it("Should make and win a bet", async () => {
    const instance = await PeoplesCasino.deployed()
    const userBalanceBefore = await web3.eth.getBalance(accounts[0])
    await instance.makeBet(1, 60, { value: 1000 })
    const houseReserve = await instance.getHouseReserve(1)
    assert.equal(houseReserve.toNumber(), 999450)
    const userBalanceAfter = await web3.eth.getBalance(accounts[0])
    assert.isBelow(Number(userBalanceBefore), Number(userBalanceAfter))
  })
})
