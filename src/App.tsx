import * as React from "react";
import styled from "styled-components";
import WalletConnect from "@unifiedwalletconnect/client";
import Button from "./components/Button";
import Card from "./components/Card";
import Input from "./components/Input";
import Header from "./components/Header";
import Column from "./components/Column";
import PeerMeta from "./components/PeerMeta";
import RequestDisplay from "./components/RequestDisplay";
import RequestButton from "./components/RequestButton";
import AccountDetails from "./components/AccountDetails";
import QRCodeScanner, { IQRCodeValidateResponse } from "./components/QRCodeScanner";
import { IWallet } from "./helpers/types";
import { getCachedSession } from "./helpers/utilities";
import { getAppConfig } from "./config";
import { getWallet } from "./wallets";

const SContainer = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 0;
`;

const SVersionNumber = styled.div`
  position: absolute;
  font-size: 12px;
  bottom: 6%;
  right: 0;
  opacity: 0.3;
  transform: rotate(-90deg);
`;

const SContent = styled.div`
  width: 100%;
  flex: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SLogo = styled.div`
  padding: 10px 0;
  display: flex;
  max-height: 100px;
  & img {
    width: 100%;
  }
`;

const SActions = styled.div`
  margin: 0;
  margin-top: 20px;

  display: flex;
  justify-content: space-around;
  & > * {
    margin: 0 5px;
  }
`;

const SActionsColumn = styled(SActions as any)`
  flex-direction: row;
  align-items: center;

  margin: 24px 0 6px;

  & > p {
    font-weight: 600;
  }
`;

const SButton = styled(Button)`
  width: 50%;
  height: 40px;
`;

const SInput = styled(Input)`
  width: 50%;
  margin: 10px;
  font-size: 14px;
  height: 40px;
`;

const SConnectedPeer = styled.div`
  display: flex;
  align-items: center;
  & img {
    width: 40px;
    height: 40px;
  }
  & > div {
    margin-left: 10px;
  }
`;

const SRequestButton = styled(RequestButton)`
  margin-bottom: 10px;
`;

export interface IAppState {
  scanner: boolean;
  uri: string;
  connected: boolean;
  connector: WalletConnect | null;
  wallet: IWallet | null;
  peerMeta: {
    description: string;
    url: string;
    icons: string[];
    name: string;
    ssl: boolean;
  };
  chain: string;
  networks: string[];
  network: string;
  accounts: string[];
  account: string;
  requests: any[];
  request: any;
}

export const INITIAL_STATE: IAppState = {
  scanner: false,
  uri: "",
  connected: false,
  connector: null,
  wallet: null,
  peerMeta: {
    description: "",
    url: "",
    icons: [],
    name: "",
    ssl: false,
  },
  chain: "",
  networks: [],
  network: "",
  accounts: [],
  account: "",
  requests: [],
  request: null,
};

class App extends React.Component<{}> {
  public state: IAppState;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };
  }
  public componentDidMount() {
    this.init();
  }

  public init = async () => {
    const session = getCachedSession();

    if (session) {
      const connector = new WalletConnect({ session });

      const {
        connected,
        peerMeta,
        chain,
        network: connectorNetwork,
        accounts: [connectorAccount],
      } = connector;

      if (connected) {
        const wallet = getWallet(chain);
        wallet.update(connectorNetwork, connectorAccount);
        const { networks, network, accounts, account } = wallet;

        await this.setState({
          connected,
          connector,
          wallet,
          peerMeta,
          chain,
          networks,
          network,
          accounts,
          account,
        });

        this.subscribeToEvents();
        this.updateSession({});
      }
    }
  };

  public initWalletConnect = async () => {
    const { uri } = this.state;

    try {
      const connector = new WalletConnect({ uri });
      const chain = connector.chain;

      await this.setState({
        connector,
        uri: connector.uri,
        chain,
      });

      this.subscribeToEvents();
    } catch (error) {
      throw error;
    }
  };

  public approveSession = () => {
    console.log("ACTION", "approveSession");
    const { connector, chain } = this.state;
    const wallet = getWallet(chain);
    const { networks, network, accounts, account } = wallet;
    if (connector) {
      connector.approveSession({ network, accounts: [account] });
    }
    this.setState({ connector, wallet, networks, network, accounts, account });
  };

  public rejectSession = () => {
    console.log("ACTION", "rejectSession");
    const { connector } = this.state;
    if (connector) {
      connector.rejectSession();
    }
    this.setState({ connector });
  };

  public killSession = () => {
    console.log("ACTION", "killSession");
    const { connector } = this.state;
    if (connector) {
      connector.killSession();
    }
    this.resetApp();
  };

  public resetApp = async () => {
    await this.setState({ ...INITIAL_STATE });
    this.init();
  };

  public subscribeToEvents = () => {
    console.log("ACTION", "subscribeToEvents");
    const { connector } = this.state;

    if (connector) {
      connector.on("session_request", (error, payload) => {
        console.log("EVENT", "session_request");

        if (error) {
          throw error;
        }

        const { peerMeta } = payload.params[0];
        this.setState({ peerMeta });
      });

      connector.on("session_update", error => {
        console.log("EVENT", "session_update");

        if (error) {
          throw error;
        }
      });

      connector.on("call_request", async (error, payload) => {
        console.log(payload);
        // tslint:disable-next-line
        console.log("EVENT", "call_request", "method", payload.method);
        console.log("EVENT", "call_request", "params", payload.params);

        if (error) {
          throw error;
        }

        const { wallet } = this.state;
        if (wallet) {
          if (!wallet.isSigningRequest(payload)) {
            try {
              const result = await wallet.handleNonSigningRequest(payload);
              connector.approveRequest({ id: payload.id, result });
            } catch (error) {
              connector.rejectRequest({ id: payload.id, error });
            }
          } else {
            this.setState({ requests: [...this.state.requests, payload] });
          }
        }
      });

      connector.on("connect", (error, payload) => {
        console.log("EVENT", "connect");

        if (error) {
          throw error;
        }

        this.setState({ connected: true });
      });

      connector.on("disconnect", (error, payload) => {
        console.log("EVENT", "disconnect");

        if (error) {
          throw error;
        }

        this.resetApp();
      });

      if (connector.connected) {
        this.setState({ connected: true });
      }

      this.setState({ connector });
    }
  };

  public updateSession = async (sessionParams: { network?: string; account?: string }) => {
    const { connector, wallet, network, account } = this.state;
    const newNetwork = sessionParams.network || network;
    const newAccount = sessionParams.account || account;
    if (connector) {
      connector.updateSession({
        network: newNetwork,
        accounts: [newAccount],
      });
    }
    if (wallet) {
      wallet.update(network, account);
    }
    await this.setState({
      connector,
      network: newNetwork,
      account: newAccount,
    });
  };

  public updateNetwork = async (network: string) => {
    await this.updateSession({ network });
  };

  public updateAccount = async (account: string) => {
    await this.updateSession({ account });
  };

  public toggleScanner = () => {
    console.log("ACTION", "toggleScanner");
    this.setState({ scanner: !this.state.scanner });
  };

  public onQRCodeValidate = (data: string): IQRCodeValidateResponse => {
    const res: IQRCodeValidateResponse = {
      error: null,
      result: null,
    };
    try {
      res.result = data;
    } catch (error) {
      res.error = error;
    }

    return res;
  };

  public onQRCodeScan = async (data: any) => {
    const uri = typeof data === "string" ? data : "";
    if (uri) {
      await this.setState({ uri });
      await this.initWalletConnect();
      this.toggleScanner();
    }
  };

  public onURIPaste = async (e: any) => {
    const data = e.target.value;
    const uri = typeof data === "string" ? data : "";
    if (uri) {
      await this.setState({ uri });
      await this.initWalletConnect();
    }
  };

  public onQRCodeError = (error: Error) => {
    throw error;
  };

  public onQRCodeClose = () => this.toggleScanner();

  public openRequest = (request: any) => this.setState({ request });

  public closeRequest = async () => {
    const { requests, request } = this.state;
    const filteredRequests = requests.filter(request_ => request_.id !== request.id);
    await this.setState({
      requests: filteredRequests,
      request: null,
    });
  };

  public approveRequest = async () => {
    const { connector, wallet, request } = this.state;

    if (wallet && connector) {
      try {
        const result = await wallet.handleNonSigningRequest(request);
        connector.approveRequest({ id: request.id, result });
      } catch (error) {
        connector.rejectRequest({ id: request.id, error });
      }
    }

    this.closeRequest();
    await this.setState({ connector });
  };

  public rejectRequest = async () => {
    const { connector, request } = this.state;
    if (connector) {
      connector.rejectRequest({
        id: request.id,
        error: { message: "Request is rejected by user" },
      });
    }
    await this.closeRequest();
    await this.setState({ connector });
  };

  public render() {
    const {
      scanner,
      connected,
      wallet,
      peerMeta,
      chain,
      networks,
      network,
      accounts,
      account,
      requests,
      request,
    } = this.state;
    console.log(this.state);
    return (
      <React.Fragment>
        <SContainer>
          <Header
            connected={connected}
            chain={chain}
            network={network}
            account={account}
            killSession={this.killSession}
          />
          <SContent>
            <Card maxWidth={400}>
              <SLogo>
                <img src={getAppConfig().logo} alt={getAppConfig().name} />
              </SLogo>
              {!connected ? (
                peerMeta && peerMeta.name ? (
                  <Column>
                    <PeerMeta peerMeta={peerMeta} />
                    <SActions>
                      <Button onClick={this.approveSession}>{`Approve`}</Button>
                      <Button onClick={this.rejectSession}>{`Reject`}</Button>
                    </SActions>
                  </Column>
                ) : (
                  <Column>
                    <SActionsColumn>
                      <SButton onClick={this.toggleScanner}>{`Scan`}</SButton>
                      {getAppConfig().styleOpts.showPasteUri && (
                        <>
                          <p>{"OR"}</p>
                          <SInput onChange={this.onURIPaste} placeholder={"Paste wc: uri"} />
                        </>
                      )}
                    </SActionsColumn>
                  </Column>
                )
              ) : !request ? (
                <Column>
                  <AccountDetails
                    chain={chain}
                    networks={networks}
                    network={network}
                    accounts={accounts}
                    account={account}
                    updateNetwork={this.updateNetwork}
                    updateAccount={this.updateAccount}
                  />
                  {peerMeta && peerMeta.name && (
                    <>
                      <h6>{"Connected to"}</h6>
                      <SConnectedPeer>
                        <img src={peerMeta.icons[0]} alt={peerMeta.name} />
                        <div>{peerMeta.name}</div>
                      </SConnectedPeer>
                    </>
                  )}
                  <h6>{"Pending Call Requests"}</h6>
                  {requests.length ? (
                    requests.map(request => (
                      <SRequestButton key={request.id} onClick={() => this.openRequest(request)}>
                        <div>{request.method}</div>
                      </SRequestButton>
                    ))
                  ) : (
                    <div>
                      <div>{"No pending requests"}</div>
                    </div>
                  )}
                </Column>
              ) : (
                <RequestDisplay
                  request={request}
                  peerMeta={peerMeta}
                  renderRequest={(request: any) => (wallet ? wallet.renderRequest(request) : [])}
                  approveRequest={this.approveRequest}
                  rejectRequest={this.rejectRequest}
                />
              )}
            </Card>
          </SContent>
          {scanner && (
            <QRCodeScanner
              onValidate={this.onQRCodeValidate}
              onScan={this.onQRCodeScan}
              onError={this.onQRCodeError}
              onClose={this.onQRCodeClose}
            />
          )}
        </SContainer>
        {getAppConfig().styleOpts.showVersion && (
          <SVersionNumber>{`v${process.env.REACT_APP_VERSION}`} </SVersionNumber>
        )}
      </React.Fragment>
    );
  }
}

export default App;
