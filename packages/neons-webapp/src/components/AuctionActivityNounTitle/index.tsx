import { BigNumber } from 'ethers';
import { isMobileScreen } from '../../utils/isMobile';
import classes from './AuctionActivityNounTitle.module.css';

const AuctionActivityNounTitle: React.FC<{ nounId: BigNumber; isCool?: boolean }> = props => {
  const { nounId, isCool } = props;
  return (
    <div className={classes.wrapper}>
      <h1 style={{ color: isMobileScreen() ? 'var(--brand-gray-dark-text)' : isCool ? 'var(--brand-cool-dark-text)' : 'var(--brand-warm-dark-text)' }}>
        Neon {nounId.toString()}
      </h1>
    </div>
  );
};
export default AuctionActivityNounTitle;
