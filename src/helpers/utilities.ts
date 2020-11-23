import { SUPPORTED_CHAINS, SUPPORTED_NETWORKS } from "../constants";

export function ellipseAddress(address = "", width = 10): string {
  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export function getViewportDimensions() {
  const w = window;
  const d = document;
  const e = d.documentElement;
  const g = d.getElementsByTagName("body")[0];
  const x = w.innerWidth || e.clientWidth || g.clientWidth;
  const y = w.innerHeight || e.clientHeight || g.clientHeight;

  return { x, y };
}

export function getChainData(chain: string) {
  const chainData = SUPPORTED_CHAINS.filter(chainData => chainData.chain === chain)[0];

  if (!chainData) {
    throw new Error("Chain missing or not supported");
  }
  return chainData;
}

export function getNetworkData(chain: string, network: string) {
  const networkData = SUPPORTED_NETWORKS.filter(
    networkData => networkData.chain === chain && networkData.network === network,
  )[0];

  if (!networkData) {
    throw new Error("Chain or network missing or not supported");
  }
  return networkData;
}

export function prettyPrint(obj: any) {
  return JSON.stringify(obj, null, 2);
}

export function getCachedSession(): any {
  const local = localStorage ? localStorage.getItem("walletconnect") : null;

  let session = null;
  if (local) {
    try {
      session = JSON.parse(local);
    } catch (error) {
      throw error;
    }
  }
  return session;
}
