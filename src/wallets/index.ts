import { IWallet } from "../helpers/types";
import { EthWallet } from "./eth";
import { NeoWallet } from "./neo";

const WALLET_CLASSES = {
  ETH: EthWallet,
  NEO: NeoWallet,
};

export function getWallet(chain: string): IWallet {
  const walletClass = WALLET_CLASSES[chain];
  if (!walletClass) {
    throw Error(`${chain} wallet in not supported`);
  }
  const wallet = new walletClass();
  return wallet;
}
