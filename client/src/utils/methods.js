import { CONTRACT_ADDRESSES } from "./../config"

const commitBet = ({
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
      .commitBet(tokenId, oddsPercentage)
      .send({ from, value: betAmount, gas: 300000 }, (err, res) => {
        return { err, res }
      })
      .catch(e => e)
  }
  return { err: true }
}

const getResult = ({ contract, accounts, tokenId }) => {
  if (contract) {
    const { methods } = contract
    const from = accounts[0]
    return methods
      .getResult(tokenId)
      .send({ from, value: 0, gas: 300000 }, err => {
        return err && { canceled: true }
      })
      .then(({ events, transactionHash }) => ({
        ...events.BetResult.returnValues,
        transactionHash
      }))
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

const forceUpdateMetadata = tokenId => {
  const openSea = `https://api.opensea.io/asset/`
  const contract = `${CONTRACT_ADDRESSES[1]}`
  const force = `/${tokenId}/?force_update=true`
  fetch(`${openSea}${contract}${force}`)
}

export {
  commitBet,
  getResult,
  depositHouseReserve,
  withdrawalHouseReserve,
  forceUpdateMetadata
}
