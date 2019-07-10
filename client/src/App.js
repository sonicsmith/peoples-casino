import React, { Component } from "react"
import CasinoCollectablesContract from "./contracts/CasinoCollectables.json"
import getWeb3 from "./utils/getWeb3"
import { NETWORK_ID, TOKEN_ID } from "./config"
import { initializeAssist, onboardUser } from "./utils/assist"

import "./App.css"

const CONTRACT_ADDRESSES = {
  1: "",
  3: ""
}

class App extends Component {
  state = {
    web3Error: null,
    web3: null,
    accounts: null,
    contract: null,
    //
    ownerOfToken: false,
    oddsPercentage: 50,
    betAmount: 1
  }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3()
      const assistInstance = initializeAssist(web3)
      await onboardUser()
      const accounts = await web3.eth.getAccounts()
      const network = CasinoCollectablesContract.networks[NETWORK_ID]
      console.log(CasinoCollectablesContract.networks)
      console.log(network)
      const contractAddress = CONTRACT_ADDRESSES[NETWORK_ID]
      const contract = assistInstance.Contract(
        new web3.eth.Contract(
          CasinoCollectablesContract.abi,
          contractAddress || (network && network.address)
        )
      )
      console.log("Successfully connected to web3")
      try {
        window.ethereum.on("accountsChanged", newAccounts => {
          this.setState({
            accounts: newAccounts
          })
          this.refresh()
        })
      } catch (error) {
        // Skip account change action
      }
      this.setState(
        {
          web3,
          accounts,
          contract
        },
        this.refresh
      )
    } catch (error) {
      // Catch any errors for any of the above operations.
      this.setState({
        web3Error: true
      })
      console.error(error)
    }
  }

  refresh = async () => {
    const { contract, accounts } = this.state
    if (contract) {
      const { methods } = contract
      // do what needs to be refreshed here
      this.setState({ ownerOfToken: true })
    }
  }

  makeBet = () => {
    const { contract, accounts, oddsPercentage, betAmount } = this.state
    if (contract) {
      const { methods } = contract
      const from = accounts[0]
      const value = this.state.web3.utils.toWei(betAmount.toString(), "ether")
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
    const { contract, accounts } = this.state
    if (contract) {
      const { methods } = contract
      const from = accounts[0]
      const value = this.state.web3.utils.toWei("0.5", "ether")
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

  render() {
    // if (!this.state.web3) {
    //   return <div>Loading Web3, accounts, and contract...</div>
    // }
    const { oddsPercentage, betAmount, ownerOfToken } = this.state

    const payout = (betAmount * 98) / oddsPercentage
    return (
      <div className="App">
        <h1>Nic Smith's Wheel of fortune</h1>
        <h3>
          Welcome to Nic Smith's Wheel of fortune, where you can make your
          fortune by making a bet on the luck of my wheel!
        </h3>
        <h4>WIN CHANCE {oddsPercentage}%</h4>
        <div>
          <input
            type="range"
            min="1"
            max="97"
            value={oddsPercentage}
            onChange={event =>
              this.setState({ oddsPercentage: event.target.value })
            }
          />
        </div>
        <h4>BET AMOUNT {betAmount} ETH</h4>
        <div>
          <input
            type="number"
            value={betAmount}
            onChange={event => this.setState({ betAmount: event.target.value })}
          />
        </div>
        <h3>PAYOUT {payout} ETH</h3>
        <button onClick={this.makeBet}>BET</button>
        {ownerOfToken && (
          <div>
            <span>
              <button onClick={this.addToHouseReserve}>DEPOSIT</button>
              <button onClick={this.subtractFromHouseReserve}>WITHDRAWL</button>
            </span>
          </div>
        )}
      </div>
    )
  }
}

export default App
