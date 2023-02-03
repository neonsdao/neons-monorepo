import {
  ContractAddresses as NounsContractAddresses,
  getContractAddressesForChainOrThrow,
} from '@neons/sdk';
import { ChainId } from '@usedapp/core';

interface ExternalContractAddresses {
  lidoToken: string | undefined;
  usdcToken: string | undefined;
  chainlinkEthUsdc: string | undefined;
  payerContract: string | undefined;
  tokenBuyer: string | undefined;
}

export type ContractAddresses = NounsContractAddresses & ExternalContractAddresses;

interface AppConfig {
  jsonRpcUri: string;
  wsRpcUri: string;
  subgraphApiUri: string;
  enableHistory: boolean;
}

export type CantoChain = 7700;
type SupportedChains = CantoChain | ChainId.Goerli;

interface CacheBucket {
  name: string;
  version: string;
}

export const cache: Record<string, CacheBucket> = {
  seed: {
    name: 'seed',
    version: 'v1',
  },
  ens: {
    name: 'ens',
    version: 'v1',
  },
};

export const cacheKey = (bucket: CacheBucket, ...parts: (string | number)[]) => {
  return [bucket.name, bucket.version, ...parts].join('-').toLowerCase();
};

export const CANTO_CHAIN_ID = 7700;

export const CHAIN_ID: SupportedChains = parseInt(process.env.REACT_APP_CHAIN_ID ?? '5');
export const SupportedChainIds = [CANTO_CHAIN_ID, ChainId.Goerli];

export const ETHERSCAN_API_KEY = process.env.REACT_APP_ETHERSCAN_API_KEY ?? '';

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const createNetworkHttpUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_JSONRPC`];
  return custom || `https://${network}.infura.io/v3/${INFURA_PROJECT_ID}`;
};

export const createNetworkWsUrl = (network: string): string => {
  const custom = process.env[`REACT_APP_${network.toUpperCase()}_WSRPC`];
  return custom || `wss://${network}.infura.io/ws/v3/${INFURA_PROJECT_ID}`;
};

export const CANTO_NETWORK_HTTPS_URL = 'https://gsgroupnodes.com/';
export const CANTO_NETWORK_WSS_URL = 'wss://canto.slingshot.finance/';

const app: Record<SupportedChains, AppConfig> = {
  [ChainId.Goerli]: {
    jsonRpcUri: createNetworkHttpUrl('goerli'),
    wsRpcUri: createNetworkWsUrl('goerli'),
    subgraphApiUri: 'https://api.thegraph.com/subgraphs/name/neonsdao/neons',
    enableHistory: process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
  [CANTO_CHAIN_ID]: {
    jsonRpcUri: CANTO_NETWORK_HTTPS_URL,
    wsRpcUri: CANTO_NETWORK_WSS_URL,
    subgraphApiUri: 'https://api2.alto.build/subgraphs/name/canto/froggie',
    enableHistory: false, // process.env.REACT_APP_ENABLE_HISTORY === 'true',
  },
};

const externalAddresses: Record<SupportedChains, ExternalContractAddresses> = {
  [ChainId.Goerli]: {
    lidoToken: '0x2DD6530F136D2B56330792D46aF959D9EA62E276',
    usdcToken: '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
    payerContract: '0xD4A3bf1dF54699E63A2ef7F490E8E22b27B945f0',
    tokenBuyer: '0x61Ec4584c5B5eBaaD9f21Aac491fBB5B2ff30779',
    chainlinkEthUsdc: undefined,
  },
  [CANTO_CHAIN_ID]: {
    lidoToken: undefined,
    usdcToken: undefined,
    payerContract: undefined,
    tokenBuyer: undefined,
    chainlinkEthUsdc: undefined,
  },
};

const getAddresses = (): ContractAddresses => {
  let nounsAddresses = {} as NounsContractAddresses;
  try {
    nounsAddresses = getContractAddressesForChainOrThrow(CHAIN_ID);
  } catch {}
  return { ...nounsAddresses, ...externalAddresses[CHAIN_ID] };
};

const config = {
  app: app[CHAIN_ID],
  addresses: getAddresses(),
};

export default config;

export const multicallOnLocalhost = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';
export const multicallCanto = '0x9787792A1020B00fb65191754c3D87c89Bf36444';
