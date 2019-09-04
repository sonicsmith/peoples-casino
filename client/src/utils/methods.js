const makeBet = ({
  web3,
  contract,
  accounts,
  oddsPercentage,
  betAmount,
  tokenId
}) => {
  if (contract) {
    const { methods } = contract
    const from = accounts[0]
    return methods
      .makeBet(tokenId, oddsPercentage)
      .send({ from, value: betAmount, gas: 300000 }, err => {
        return err && { canceled: true }
      })
      .then(({ events }) => events.BetResult.returnValues)
      .catch(e => e)
  }
  return { err: true }
}

const depositHouseReserve = ({ web3, contract, accounts, tokenId, amount }) => {
  if (contract) {
    const { methods } = contract
    const from = accounts[0]
    const value = web3.utils.toWei(amount, "ether")
    return methods
      .depositHouseReserve(tokenId)
      .send({ from, value, gas: 300000 }, res => !res)
      .then(() => true)
      .catch(() => false)
  }
  return false
}

const withdrawalHouseReserve = ({
  web3,
  contract,
  accounts,
  tokenId,
  amount
}) => {
  if (contract) {
    const { methods } = contract
    const from = accounts[0]
    const wei = web3.utils.toWei(amount, "ether")
    return methods
      .withdrawalHouseReserve(tokenId, wei)
      .send({ from, value: 0, gas: 300000 }, res => !res)
      .then(() => true)
      .catch(() => false)
  }
  return false
}

export { makeBet, depositHouseReserve, withdrawalHouseReserve }
