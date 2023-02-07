import { useEtherBalance } from '@usedapp/core';
import useTokenBuyerBalance from './useTokenBuyerBalance';
import { useCoingeckoPrice } from '@usedapp/coingecko';
import config from '../config';
import { BigNumber, ethers } from 'ethers';

/**
 * Computes treasury balance (CANTO)
 *
 * @returns Total balance of treasury (CANTO) as EthersBN
 */
export const useTreasuryBalance = () => {
  const ethBalance = useEtherBalance(config.addresses.nounsDaoExecutor);
  const tokenBuyerBalanceAsCANTO = useTokenBuyerBalance();

  const zero = BigNumber.from(0);
  return ethBalance?.add(tokenBuyerBalanceAsCANTO ?? zero) ?? zero;
};

/**
 * Computes treasury usd value of treasury assets (CANTO) at current CANTO-USD exchange rate
 *
 * @returns USD value of treasury assets (CANTO) at current exchange rate
 */
export const useTreasuryUSDValue = () => {
  const etherPrice = Number(useCoingeckoPrice('canto', 'usd'));
  const treasuryBalanceCANTO = Number(
    ethers.utils.formatEther(useTreasuryBalance()?.toString() || '0'),
  );
  return etherPrice * treasuryBalanceCANTO;
};
