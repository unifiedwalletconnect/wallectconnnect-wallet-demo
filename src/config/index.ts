import walletconnectLogo from "./assets/walletconnect-logo.png";
import { IAppConfig } from "../helpers/types";

const appConfig: IAppConfig = {
  name: "WalletConnect",
  logo: walletconnectLogo,
  colors: {
    defaultColor: "12, 12, 13",
    backgroundColor: "40, 44, 52",
  },
  styleOpts: {
    showPasteUri: true,
    showVersion: true,
  },
};

export function getAppConfig(): IAppConfig {
  return appConfig;
}
