import assist from "bnc-assist"
import { getNetworkId, ASSIST_DAPP_ID, getCurrencyCode } from "../config"

let assistInstance

// Assist methods
export const initializeAssist = (web3, handleNotificationEvent) =>
  getAssist(web3, handleNotificationEvent) // Call this function as soon as web3 is initialized
export const onboardUser = () => getAssist().onboard()
export const decorateContract = (contract) => getAssist().Contract(contract)
export const decorateTransaction = (txObject) =>
  getAssist().Transaction(txObject)
export const getUserState = () => getAssist().getState()

const METHOD_TO_WORD = {
  commitBet: "bet",
  getResult: "spin",
  depositHouseReserve: "deposit",
  withdrawalHouseReserve: "withdrawal",
}

// Returns initialized assist object if previously initialized.
// Otherwise will initialize assist with the config object
export function getAssist(web3, handleNotificationEvent) {
  const networkId = getNetworkId()
  const coin = getCurrencyCode()
  if (!assistInstance) {
    assistInstance = assist.init({
      dappId: ASSIST_DAPP_ID,
      networkId,
      mobileBlocked: false,
      web3,
      style: {
        darkMode: false,
        notificationsPosition: { desktop: "topRight", mobile: "top" },
      },
      messages: {
        txRequest: () => "Waiting for you to confirm the transaction",
        nsfFail: ({ contract }) =>
          `You don't have enough ${coin} to make this ${
            METHOD_TO_WORD[contract.methodName]
          }`,
        txConfirmed: ({ contract }) =>
          `Your ${METHOD_TO_WORD[contract.methodName]} has been made!`,
        txFailed: ({ contract }) =>
          `The transaction to make your ${
            METHOD_TO_WORD[contract.methodName]
          } has failed`,
      },
      handleNotificationEvent,
      timeouts: {
        txStallPending: 600000, // The number of milliseconds after a transaction has been sent before showing a stall notification detected in the mempool
        txStallConfirmed: 600000, // The number of milliseconds after a transaction has been detected in the mempool before showing a stall notification if not confirmed
      },
    })
  }

  return assistInstance
}
