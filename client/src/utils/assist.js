import assist from "bnc-assist"
import { NETWORK_ID, ASSIST_DAPP_ID } from "../config"

let assistInstance

// Assist methods
export const initializeAssist = web3 => getAssist(web3) // Call this function as soon as web3 is initialized
export const onboardUser = () => getAssist().onboard()
export const decorateContract = contract => getAssist().Contract(contract)
export const decorateTransaction = txObject => getAssist().Transaction(txObject)
export const getUserState = () => getAssist().getState()

const METHOD_TO_WORD = {
  makeBet: "bet",
  addToHouseReserve: "deposit",
  subtractFromHouseReserve: "withdrawl"
}

// Returns initialized assist object if previously initialized.
// Otherwise will initialize assist with the config object
export function getAssist(web3) {
  if (!assistInstance) {
    assistInstance = assist.init({
      dappId: ASSIST_DAPP_ID,
      networkId: NETWORK_ID,
      mobileBlocked: false,
      web3,
      style: {
        darkMode: false,
        notificationsPosition: { desktop: "topRight", mobile: "top" }
      },

      messages: {
        txRequest: () => "Waiting for you to confirm the transaction",
        nsfFail: ({ contract }) =>
          `You don't have enough ETH to make this ${
            METHOD_TO_WORD[contract.methodName]
          }`,
        txStall: ({ contract }) =>
          `Your ${
            METHOD_TO_WORD[contract.methodName]
          } is taking a bit longer than expected`,
        txConfirmed: ({ contract }) =>
          `Your ${METHOD_TO_WORD[contract.methodName]} has been made!`,
        txFailed: ({ contract }) =>
          `The transaction to make your ${
            METHOD_TO_WORD[contract.methodName]
          } has failed`
      }
    })
  }

  return assistInstance
}
