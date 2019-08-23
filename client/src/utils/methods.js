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
    methods
      .makeBet(tokenId, oddsPercentage)
      .send({ from, value: betAmount, gas: 300000 }, res => {
        if (!res) {
          console.log("Transaction sent", res)
          // Transaction sent
        } else {
          console.log("Canceled", res)
          // Canceled
        }
      })
      .then(res => {
        const { BetResult } = res.events
        const { roll, win } = BetResult.returnValues
        console.log("Transaction went through")
        if (win) {
          // Show win result
          console.log("WINNER", roll)
        } else {
          // Show lose result
          console.log("LOSS", roll)
        }
      })
      .catch(e => {
        console.log("ERROR", e)
      })
  }
}

const addToHouseReserve = ({ web3, contract, accounts, tokenId, amount }) => {
  if (contract) {
    const { methods } = contract
    const from = accounts[0]
    const value = web3.utils.toWei(amount, "ether")
    methods
      .addToHouseReserve(tokenId)
      .send({ from, value, gas: 300000 }, res => {
        if (!res) {
          console.log("Transaction sent", res)
          // Transaction sent
        } else {
          console.log("Canceled", res)
          // Canceled
        }
      })
      .then(res => {
        console.log("Transaction went through", res)
        // Transaction went through
      })
      .catch(e => {
        //
      })
  }
}

const subtractFromHouseReserve = ({
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
    methods
      .subtractFromHouseReserve(tokenId, wei)
      .send({ from, value: 0, gas: 300000 }, res => {
        if (!res) {
          console.log("Transaction sent", res)
          // Transaction sent
        } else {
          console.log("Canceled", res)
          // Canceled
        }
      })
      .then(res => {
        console.log("Transaction went through", res)
        // Transaction went through
      })
      .catch(e => {
        //
      })
  }
}

export { makeBet, addToHouseReserve, subtractFromHouseReserve }
