// const refresh = async ({ contract, web3, setState }) => {
//   if (contract) {
//     const { methods } = contract
//     console.log("contract", contract)
//     const houseReserve = await methods.getHouseReserve(TOKEN_ID).call()
//     const ownerOfToken = await methods.ownerOf(TOKEN_ID).call()
//     console.log("houseReserve:", houseReserve)
//     console.log("ownerOfToken:", ownerOfToken)
//     const betAmount = web3.utils.fromWei((houseReserve / 2).toString(), "ether")
//     setState({ houseReserve, ownerOfToken, betAmount })
//   }
// }
import { TOKEN_ID } from "./../config"

const makeBet = ({ web3, contract, accounts, oddsPercentage, betAmount }) => {
  if (contract) {
    const { methods } = web3.contract
    const from = accounts[0]
    const value = web3.utils.toWei(betAmount.toString(), "ether")
    methods
      .makeBet(TOKEN_ID, oddsPercentage)
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

const addToHouseReserve = ({ web3, contract, accounts }) => {
  if (contract) {
    const { methods } = contract
    const from = accounts[0]
    const value = web3.utils.toWei("0.5", "ether")
    methods
      .addToHouseReserve(TOKEN_ID)
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

const subtractFromHouseReserve = () => {}

export { makeBet, addToHouseReserve, subtractFromHouseReserve }
