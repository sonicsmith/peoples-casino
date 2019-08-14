import React, { Component } from "react"
import getWeb3 from "./utils/getWeb3"
import PeoplesCasinoContract from "./contracts/PeoplesCasino.json"
import { NETWORK_ID } from "./config"
import { initializeAssist, onboardUser } from "./utils/assist"
import Main from "./components/Main"
import TokenView from "./components/TokenView"

const CONTRACT_ADDRESSES = {
  1: "",
  4: "0xc9473767d6f357b5a0b9a50a3a2cc67768c59e1f"
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
      const network = PeoplesCasinoContract.networks[NETWORK_ID]
      const contractAddress = CONTRACT_ADDRESSES[NETWORK_ID]
      const contract = assistInstance.Contract(
        new web3.eth.Contract(
          PeoplesCasinoContract.abi,
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
    const { tokenId } = this.props
    if (contract) {
      const { methods } = contract
      const ownerOfToken = await methods.ownerOf(tokenId).call()
      if (ownerOfToken === noAddress) {
        this.setState({ houseReserve: 0, ownerOfToken })
      } else {
        const houseReserve = await methods.getHouseReserve(tokenId).call()
        console.log("houseReserve:", houseReserve)
        console.log("ownerOfToken:", ownerOfToken)
        this.setState({ houseReserve, ownerOfToken })
      }
    }
  }

  render() {
    const {
      web3,
      accounts,
      web3Error,
      houseReserve,
      ownerOfToken,
      contract
    } = this.state
    const { tokenId } = this.props
    if (tokenId >= 0) {
      return (
        <TokenView
          ownerOfToken={ownerOfToken}
          houseReserve={houseReserve}
          web3={web3}
          accounts={accounts}
          contract={contract}
          web3Error={web3Error}
          tokenId={tokenId}
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
