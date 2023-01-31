import {
  NounsTokenFactory,
  NounsAuctionHouseFactory,
  NounsDescriptorFactory,
  NounsSeederFactory,
  NounsDaoLogicV2Factory,
  CSRAuctionHouseProxyFactory,
} from '@neons/contracts';

export interface ContractAddresses {
  nounsToken: string;
  nounsSeeder: string;
  nounsDescriptor: string;
  nftDescriptor: string;
  nounsAuctionHouse: string;
  nounsAuctionHouseProxy: string;
  nounsAuctionHouseProxyAdmin: string;
  nounsDaoExecutor: string;
  nounsDAOProxy: string;
  nounsDAOLogicV1: string;
  nounsDAOLogicV2?: string;
  csrAuctionHouseProxy?: string;
}

export interface Contracts {
  nounsTokenContract: ReturnType<typeof NounsTokenFactory.connect>;
  nounsAuctionHouseContract: ReturnType<typeof NounsAuctionHouseFactory.connect>;
  nounsDescriptorContract: ReturnType<typeof NounsDescriptorFactory.connect>;
  nounsSeederContract: ReturnType<typeof NounsSeederFactory.connect>;
  nounsDaoContract: ReturnType<typeof NounsDaoLogicV2Factory.connect>;
  csrAuctionHouseProxy?: ReturnType<typeof CSRAuctionHouseProxyFactory.connect>;
}

export enum ChainId {
  Mainnet = 1,
  Canto = 7700,
  Ropsten = 3,
  Rinkeby = 4,
  Kovan = 42,
  Local = 31337,
}
