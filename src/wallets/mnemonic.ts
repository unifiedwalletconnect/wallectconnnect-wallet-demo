import * as ethers from "ethers";
import { getLocal, setLocal } from "../helpers/local";
import { MNEMONIC_KEY } from "../constants/default";

export function getMnemonic(): string {
  let mnemonic = getLocal(MNEMONIC_KEY);
  if (!mnemonic) {
    const entropy = ethers.utils.hexlify(ethers.utils.randomBytes(16));
    mnemonic = ethers.utils.entropyToMnemonic(entropy);
    setLocal(MNEMONIC_KEY, mnemonic);
  }
  return mnemonic;
}
