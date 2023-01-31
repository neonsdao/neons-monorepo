import { useMemo } from 'react';
import { useConfig } from '@usedapp/core';
import { providers } from 'ethers';
import { CHAIN_ID } from '../config';

/**
 * Returns a provider that's constructed using the readonly RPC URL.
 */
export function useReadonlyProvider(
  chainId: Number = CHAIN_ID,
): providers.JsonRpcProvider | undefined {
  const config = useConfig();
  const rpcURL = config?.readOnlyUrls?.[chainId as keyof typeof config.readOnlyUrls] as
    | string
    | undefined;
  return useMemo(() => {
    if (!rpcURL) {
      return;
    }
    return new providers.JsonRpcProvider(rpcURL);
  }, [rpcURL]);
}
