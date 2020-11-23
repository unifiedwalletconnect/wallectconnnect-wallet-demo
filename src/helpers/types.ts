import { IJsonRpcRequest } from "@unifiedwalletconnect/types";

export interface IAppConfig {
  name: string;
  logo: string;
  colors: {
    defaultColor: string;
    backgroundColor: string;
  };
  styleOpts: {
    showPasteUri: boolean;
    showVersion: boolean;
  };
}

export interface IRequestRenderParams {
  label: string;
  value: string;
}

export interface IWallet {
  readonly networks: string[];
  readonly network: string;
  readonly accounts: string[];
  readonly account: string;
  update(network: string, account: string): void;
  isSigningRequest(request: IJsonRpcRequest): boolean;
  handleNonSigningRequest(request: IJsonRpcRequest): Promise<any>;
  renderRequest(request: IJsonRpcRequest): IRequestRenderParams[];
  handleSigningRequest(request: IJsonRpcRequest): Promise<any>;
}
