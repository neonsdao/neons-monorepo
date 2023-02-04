import { useShortAddress } from '../../utils/addressAndENSDisplayUtils';
import React from 'react';
import Identicon from '../Identicon';
import { useReadonlyProvider } from '../../hooks/useReadonlyProvider';
import { ChainId } from '@usedapp/core';
import classes from './ShortAddress.module.css';

const ShortAddress: React.FC<{ address: string; avatar?: boolean; size?: number }> = props => {
  const { address, avatar, size = 24 } = props;
  const shortAddress = useShortAddress(address);
  const mainnetProvider = useReadonlyProvider(ChainId.Mainnet);

  if (avatar) {
    return (
      <div className={classes.shortAddress}>
        {avatar && (
          <div key={address}>
            <Identicon size={size} address={address} provider={mainnetProvider} />
          </div>
        )}
        <span>{shortAddress}</span>
      </div>
    );
  }

  return <>{shortAddress}</>;
};

export default ShortAddress;
