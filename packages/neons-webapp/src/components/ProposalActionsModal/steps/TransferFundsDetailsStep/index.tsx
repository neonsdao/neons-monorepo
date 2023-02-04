import { Trans } from '@lingui/macro';
import BigNumber from 'bignumber.js';
import { utils } from 'ethers';
import React, { useEffect, useState } from 'react';
import { ProposalActionModalStepProps } from '../..';
import BrandDropdown from '../../../BrandDropdown';
import BrandTextEntry from '../../../BrandTextEntry';
import BrandNumericEntry from '../../../BrandNumericEntry';
import ModalBottomButtonRow from '../../../ModalBottomButtonRow';
import ModalTitle from '../../../ModalTitle';

export enum SupportedCurrency {
  Canto = 'Canto',
  USDC = 'USDC',
}

const TransferFundsDetailsStep: React.FC<ProposalActionModalStepProps> = props => {
  const { onNextBtnClick, onPrevBtnClick, state, setState } = props;

  const [currency, setCurrency] = useState<SupportedCurrency>(
    state.TransferFundsCurrency ?? SupportedCurrency.Canto,
  );
  const [amount, setAmount] = useState<string>(state.amount ?? '');
  const [formattedAmount, setFormattedAmount] = useState<string>(state.amount ?? '');
  const [address, setAddress] = useState(state.address ?? '');
  const [isValidForNextStage, setIsValidForNextStage] = useState(false);

  useEffect(() => {
    if (utils.isAddress(address) && parseFloat(amount) > 0 && !isValidForNextStage) {
      setIsValidForNextStage(true);
    }
  }, [amount, address, isValidForNextStage]);

  return (
    <div>
      <ModalTitle>
        <Trans>Add Transfer Funds Action</Trans>
      </ModalTitle>

      <BrandDropdown
        label={'Currency'}
        value={currency === SupportedCurrency.Canto? 'Canto' : 'USDC'}
        onChange={e => {
          if (e.target.value === 'Canto') {
            setCurrency(SupportedCurrency.Canto);
          } else {
            setCurrency(SupportedCurrency.USDC);
          }
        }}
        chevronTop={38}
      >
        <option value="Canto">Canto</option>
        <option value="USDC">USDC</option>
      </BrandDropdown>

      <BrandNumericEntry
        label={'Amount'}
        value={formattedAmount}
        onValueChange={e => {
          setAmount(e.value);
          setFormattedAmount(e.formattedValue);
        }}
        placeholder={currency === SupportedCurrency.Canto ? '0 Canto' : '0 USDC'}
        isInvalid={parseFloat(amount) > 0 && new BigNumber(amount).isNaN()}
      />

      <BrandTextEntry
        label={'Recipient'}
        onChange={e => setAddress(e.target.value)}
        value={address}
        type="string"
        placeholder="0x..."
        isInvalid={address.length === 0 ? false : !utils.isAddress(address)}
      />

      <ModalBottomButtonRow
        prevBtnText={<Trans>Back</Trans>}
        onPrevBtnClick={onPrevBtnClick}
        nextBtnText={<Trans>Review and Add</Trans>}
        isNextBtnDisabled={!isValidForNextStage}
        onNextBtnClick={() => {
          setState(x => ({
            ...x,
            amount,
            address,
            TransferFundsCurrency: currency,
          }));
          onNextBtnClick();
        }}
      />
    </div>
  );
};

export default TransferFundsDetailsStep;
