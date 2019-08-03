import React, { Component } from "react"
import getWeb3 from "./utils/getWeb3"
import CasinoCollectablesContract from "./contracts/CasinoCollectables.json"
import { NETWORK_ID } from "./config"
import { initializeAssist, onboardUser } from "./utils/assist"
import Main from "./components/Main"

const CONTRACT_ADDRESSES = {
  1: "",
  3: ""
}

class App extends Component {
  state = {}

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3()
      const assistInstance = initializeAssist(web3)
      await onboardUser()
      const accounts = await web3.eth.getAccounts()
      const network = CasinoCollectablesContract.networks[NETWORK_ID]
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

  render() {
    const { web3, contract, accounts, web3Error } = this.state
    return (
      <Main
        web3={web3}
        contract={contract}
        accounts={accounts}
        web3Error={web3Error}
      />
    )
  }
}

export default App
