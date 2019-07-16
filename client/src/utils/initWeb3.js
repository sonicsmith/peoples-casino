import Web3 from "web3"
import CasinoCollectablesContract from "./../contracts/CasinoCollectables.json"
import { NETWORK_ID } from "./../config"
import { initializeAssist, onboardUser } from "./../utils/assist"

const CONTRACT_ADDRESSES = {
  1: "",
  3: ""
}

const getWeb3 = () => {
  if (window.ethereum) {
    return new Web3(window.ethereum)
  } else if (window.web3) {
    return window.web3
  } else {
    const provider = new Web3.providers.HttpProvider("http://127.0.0.1:9545")
    return new Web3(provider)
  }
}

const initWeb3 = async () => {
  try {
    console.log("Attempting to connect..")
    const web3 = getWeb3()
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
    console.log("Successfully connected to web3", contract)
    try {
      window.ethereum.on("accountsChanged", newAccounts => {
        return { accounts: newAccounts }
      })
    } catch (error) {
      // Skip account change action
    }
    return { web3, accounts, contract }
  } catch (error) {
    return { web3Error: true }
  }
}

export default initWeb3
