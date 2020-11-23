import { ethers } from "ethers";
import { IJsonRpcRequest } from "@unifiedwalletconnect/types";
import { NUMBER_OF_ACCOUNTS, SUPPORTED_NETWORKS } from "../../constants";
import { IRequestRenderParams, IWallet } from "../../helpers/types";
import { getMnemonic } from "../mnemonic";

const SIGNING_METHODS = [
  "eth_sendTransaction",
  "eth_signTransaction",
  "eth_sign",
  "eth_signTypedData",
  "eth_signTypedData_v1",
  "eth_signTypedData_v2",
  "eth_signTypedData_v3",
  "eth_signTypedData_v4",
  "personal_sign",
];

export class EthWallet implements IWallet {
  private _networkIndex = 0;
  private _wallets: ethers.Wallet[] = [];
  private _accountIndex = 0;

  constructor() {
    for (let i = 0; i < NUMBER_OF_ACCOUNTS; i++) {
      this._wallets.push(ethers.Wallet.fromMnemonic(getMnemonic(), `m/44'/60'/0'/0/${i}`));
    }
  }

  get networks() {
    return SUPPORTED_NETWORKS.filter(network => network.chain === "ETH").map(
      network => network.network,
    );
  }

  get network() {
    return this.networks[this._networkIndex];
  }

  get accounts() {
    return this._wallets.map(wallet => wallet.address);
  }

  get account() {
    return this.accounts[this._accountIndex];
  }

  public update(network: string, account: string): void {
    const networkIndex = this.networks.indexOf(network);
    if (networkIndex !== -1) {
      this._networkIndex = networkIndex;
    }
    const accountIndex = this.accounts.indexOf(account);
    if (accountIndex !== -1) {
      this._accountIndex = accountIndex;
    }
  }

  public isSigningRequest(request: IJsonRpcRequest): boolean {
    return SIGNING_METHODS.includes(request.method);
  }

  public async handleNonSigningRequest(request: IJsonRpcRequest): Promise<any> {
    // TODO
    return "Result";
  }

  public renderRequest(request: IJsonRpcRequest): IRequestRenderParams[] {
    // TODO
    return [{ label: "Label", value: "Value" }];
  }

  public async handleSigningRequest(request: IJsonRpcRequest): Promise<any> {
    // TODO
    return "Result";
  }
}
