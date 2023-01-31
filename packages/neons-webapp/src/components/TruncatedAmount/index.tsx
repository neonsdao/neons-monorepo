import BigNumber from 'bignumber.js';
import React from 'react';
import { ReactComponent as Canto } from '../../assets/icons/canto.svg';

const TruncatedAmount: React.FC<{ amount: BigNumber }> = props => {
  const { amount } = props;

  const eth = amount.div(1e18).toFixed(2);
  return (
    <>
      <Canto style={{ paddingBottom: 5 }} fill="white" /> {`${eth}`}
    </>
  );
};
export default TruncatedAmount;
