import React, { Component } from "react"
import {
  Grommet,
  Button,
  Heading,
  Text,
  RangeInput,
  TextInput,
  Box
} from "grommet"
import { TOKEN_ID } from "./../config"
import { getTokenMetadata } from "./../tokenMetadata/getTokenMetadata"
import TokenView from "./TokenView"

class Main extends Component {
  state = {
    oddsPercentage: 50,
    betAmount: 1,
    tokenMetadata: {}
  }

  constructor() {
    super()
    if (TOKEN_ID >= 0) {
      this.state.tokenMetadata = getTokenMetadata(TOKEN_ID)
    }
  }

  refresh = async () => {
    const { contract, web3 } = this.props
    if (contract) {
      const { methods } = contract
      console.log("contract", contract)
      const houseReserve = await methods.getHouseReserve(TOKEN_ID).call()
      const ownerOfToken = await methods.ownerOf(TOKEN_ID).call()
      console.log("houseReserve:", houseReserve)
      console.log("ownerOfToken:", ownerOfToken)
      const betAmount = web3.utils.fromWei(
        (houseReserve / 2).toString(),
        "ether"
      )
      this.setState({ houseReserve, ownerOfToken, betAmount })
    }
  }

  makeBet = () => {
    const { web3, contract, accounts } = this.props
    const { oddsPercentage, betAmount } = this.state
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

  addToHouseReserve = () => {
    const { web3, contract, accounts } = this.props
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

  subtractFromHouseReserve = () => {}

  mint = async () => {
    const { contract, accounts } = this.props
    if (contract) {
      const { methods } = contract
      const from = accounts[0]
      const res = await methods
        .mint(TOKEN_ID)
        .send({ from, value: 0, gas: 300000 })
      console.log(res)
      this.refresh()
    }
  }

  render() {
    const { web3, web3Error } = this.props

    if (TOKEN_ID >= 0) {
      return <TokenView {...this} {...this.props} />
    }

    if (!web3) {
      if (web3Error) {
        return <div>ERROR: Cannot connect to web3</div>
      } else {
        return <div>Loading Web3, accounts, and contract...</div>
      }
    }

    return (
      <div>
        <h1>Main page / no token</h1>
      </div>
    )
  }
}

export default Main
