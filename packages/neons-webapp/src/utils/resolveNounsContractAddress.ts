import config from '../config';

export const resolveNounContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    case config.addresses.nounsDAOProxy.toLowerCase():
      return 'Neons Proxy';
    case config.addresses.nounsAuctionHouseProxy.toLowerCase():
      return 'Burned';
    case config.addresses.nounsDaoExecutor.toLowerCase():
      return 'Neons Treasury';
    default:
      return undefined;
  }
};
