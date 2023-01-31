import { BaseProvider } from '@ethersproject/providers';
import { Contract } from 'ethers';

/**
 * @internal Intended for internal use - use it on your own risk
 */
export function connectContractToSigner(
  contract: Contract,
  librarySigner?: BaseProvider,
): Contract {
  if (contract.signer) {
    return contract;
  }

  if (librarySigner) {
    return contract.connect(librarySigner);
  }

  throw new TypeError('No signer available in contract, options or library');
}
