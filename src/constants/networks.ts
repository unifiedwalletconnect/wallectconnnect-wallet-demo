export const SUPPORTED_NETWORKS = [
  {
    chain: "ETH",
    network: "mainnet",
    name: "Ethereum Mainnet",
    rpcUrl: "https://mainnet.infura.io/v3/%API_KEY%",
    chainId: 1,
    networkId: 1,
    nativeCurrency: {
      symbol: "ETH",
      name: "Ether",
      decimals: "18",
    },
  },
  {
    chain: "ETH",
    network: "ropsten",
    name: "Ethereum Ropsten",
    rpcUrl: "https://ropsten.infura.io/v3/%API_KEY%",
    chainId: 3,
    networkId: 3,
    nativeCurrency: {
      symbol: "ETH",
      name: "Ether",
      decimals: "18",
    },
  },
  {
    chain: "NEO",
    network: "mainnet",
    name: "NEO Mainnet",
    rpcUrl: "", // TODO
  },
  {
    chain: "NEO",
    network: "testnet",
    name: "NEO Testnet",
    rpcUrl: "", // TODO
  },
];
