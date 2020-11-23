import { IJsonRpcRequest } from "@unifiedwalletconnect/types";
import { SUPPORTED_NETWORKS } from "../../constants";
import { IRequestRenderParams, IWallet } from "../../helpers/types";

export class NeoWallet implements IWallet {
  private _networkIndex = 0;
  private _accounts: string[] = [];
  private _accountIndex = 0;

  constructor() {
    this._accounts = ["aaaaaaaaaaaaaaaaaa", "bbbbbbbbbbbbbbbbbb"];
  }

  get networks() {
    return SUPPORTED_NETWORKS.filter(network => network.chain === "NEO").map(
      network => network.network,
    );
  }

  get network() {
    return this.networks[this._networkIndex];
  }

  get accounts() {
    return this._accounts;
  }

  get account() {
    return this.accounts[this._accountIndex];
  }

  public update(network: string, account: string): void {
    return;
  }

  public isSigningRequest(request: IJsonRpcRequest): boolean {
    return false;
  }

  public async handleNonSigningRequest(request: IJsonRpcRequest): Promise<any> {
    return 0;
  }

  public renderRequest(request: IJsonRpcRequest): IRequestRenderParams[] {
    return [{ label: "Hello", value: "World" }];
  }

  public async handleSigningRequest(request: IJsonRpcRequest): Promise<any> {
    return 0;
  }
}
