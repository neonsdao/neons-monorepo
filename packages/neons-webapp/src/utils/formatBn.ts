import { BigNumberish } from 'ethers';

export function bigNumberToString(bn: BigNumberish): string {
  return Math.floor(Number(bn))
    .toLocaleString('fullWide', { useGrouping: false })
    .replace(',', '.');
}
