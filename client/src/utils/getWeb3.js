import Web3 from "web3"
import { getNetworkId, POLYGON_NETWORK } from "./../config"

const getWeb3 = () =>
  new Promise((resolve) => {
    window.addEventListener("load", async () => {
      const networkId = getNetworkId()
      console.log("Intended NetworkId", networkId)
      // Polygon
      // if (networkId === POLYGON_NETWORK) {
      //   const web3 = new Web3(
      //     "https://rpc-mainnet.maticvigil.com/v1/aa8b0ffd459f69d3673291b7e00061a00cd60762"
      //   )
      //   console.log("returning polygon network")
      //   resolve(web3)
      // }
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        resolve(web3)
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3
        console.log("Injected web3 detected.")
        resolve(web3)
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const provider = new Web3.providers.HttpProvider(
          "http://127.0.0.1:9545"
        )
        const web3 = new Web3(provider)
        console.log("No web3 instance injected, using Local web3.")
        resolve(web3)
      }
    })
  })

export default getWeb3
