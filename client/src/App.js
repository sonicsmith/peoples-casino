import React, { Component } from "react"
import getWeb3 from "./utils/getWeb3"
import CasinoCollectablesContract from "./contracts/CasinoCollectables.json"
import { NETWORK_ID } from "./config"
import { initializeAssist, onboardUser } from "./utils/assist"
import Main from "./components/Main"
import { TOKEN_ID } from "./config"
import TokenView from "./components/TokenView"

const CONTRACT_ADDRESSES = {
  1: "",
  4: "0x250eA3D088Ee3073B7594b4a3E76719fCe2442Fe"
}

const noAddress = "0x0000000000000000000000000000000000000000"

class App extends Component {
  state = {
    ownerOfToken: noAddress
  }

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
      this.setState({ web3, accounts, contract }, this.refresh)
    } catch (error) {
      // Catch any errors for any of the above operations.
      this.setState({
        web3Error: true
      })
      console.error(error)
    }
  }

  refresh = async () => {
    const { contract } = this.state
    if (contract) {
      const { methods } = contract
      const houseReserve = await methods.getHouseReserve(TOKEN_ID).call()
      const ownerOfToken = await methods.ownerOf(TOKEN_ID).call()
      console.log("houseReserve:", houseReserve)
      console.log("ownerOfToken:", ownerOfToken)
      this.setState({ houseReserve, ownerOfToken })
    }
  }

  render() {
    const { web3, accounts, web3Error, houseReserve, ownerOfToken } = this.state

    if (TOKEN_ID >= 0) {
      return (
        <TokenView
          ownerOfToken={ownerOfToken}
          houseReserve={houseReserve}
          web3={web3}
          accounts={accounts}
          web3Error={web3Error}
        />
      )
    }

    if (!web3) {
      if (web3Error) {
        return <div>ERROR: Cannot connect to web3</div>
      } else {
        return <div>Loading Web3, accounts, and contract...</div>
      }
    }

    return <Main />
  }
}

export default App
