import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import React from 'react';

const ShortAddress: React.FC<{ address: string; avatar?: boolean; size?: number }> = props => {
  const { address} = props;
  const shortAddress = useShortAddress(address);

  return <>{shortAddress}</>;
};

export default ShortAddress;
