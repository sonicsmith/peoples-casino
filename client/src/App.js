import React, { Component } from "react"
import getWeb3 from "./utils/getWeb3"
import { getNetworkId, CONTRACT_ADDRESSES } from "./config"
import { abi as contractAbi } from "./contracts/PeoplesCasino.json"
import { initializeAssist, onboardUser } from "./utils/assist"
import { getIsTokenMinted } from "./utils/misc"
import NoToken from "./components/NoToken"
import TokenView from "./components/TokenView"

class App extends Component {
  state = {
    ownerOfToken: null,
    notificationEvent: () => {
      console.log("event swallowed")
    },
  }

  handleNotificationEvent = (event) => {
    return this.state.notificationEvent(event)
  }

  setNotificationEventListener = (callback) => {
    this.setState({ notificationEvent: callback })
  }

  componentDidMount = async () => {
    try {
      console.log("componentDidMount")
      const web3 = await getWeb3()
      const assistInstance = initializeAssist(
        web3,
        this.handleNotificationEvent
      )
      console.log("assist initialized")
      await onboardUser()
      console.log("User onboarded")
      const accounts = await web3.eth.getAccounts()
      const networkId = getNetworkId()
      const contractAddress = CONTRACT_ADDRESSES[networkId]
      const contract = assistInstance.Contract(
        new web3.eth.Contract(contractAbi, contractAddress)
      )
      console.log("Successfully connected to web3")
      try {
        window.ethereum.on("accountsChanged", (newAccounts) => {
          this.setState({
            accounts: newAccounts,
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
        web3Error: true,
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
      if (getIsTokenMinted(ownerOfToken)) {
        const houseReserve = await methods.getHouseReserve(tokenId).call()
        const ongoingBetSender = await methods
          .getOngoingBetSender(tokenId)
          .call()
        this.setState({ houseReserve, ownerOfToken, ongoingBetSender })
      } else {
        this.setState({ houseReserve: 0, ownerOfToken })
      }
    }
  }

  render() {
    const {
      web3,
      accounts,
      web3Error,
      houseReserve,
      ongoingBetSender,
      ownerOfToken,
      contract,
    } = this.state
    const { tokenId } = this.props

    if (tokenId >= 0 && getIsTokenMinted(ownerOfToken)) {
      return (
        <TokenView
          setNotificationEventListener={this.setNotificationEventListener}
          ownerOfToken={ownerOfToken}
          houseReserve={houseReserve}
          ongoingBetSender={ongoingBetSender}
          refreshData={this.refresh}
          web3={web3}
          accounts={accounts}
          contract={contract}
          web3Error={web3Error}
          tokenId={tokenId}
        />
      )
    }
    // If we can't connect to web3, or find the token
    if (!web3) {
      return <NoToken loading={!web3Error} web3Error={web3Error} />
    }
    return <NoToken loading={!ownerOfToken} />
  }
}

export default App
