import { useQuery } from '@apollo/client';
import { BigNumber } from '@ethersproject/bignumber';
import { Trans } from '@lingui/macro';
import React from 'react';
import { Spinner } from 'react-bootstrap';
import { auctionQuery } from '../../wrappers/subgraph';
import ShortAddress from '../ShortAddress';
import { StandaloneNounCircular } from '../StandaloneNoun';
import classes from './NounHoverCard.module.css';
import { HeartIcon, CakeIcon } from '@heroicons/react/solid';
import { i18n } from '@lingui/core';
import clsx from 'clsx';

interface NounHoverCardProps {
  nounId: string;
}

const NounHoverCard: React.FC<NounHoverCardProps> = props => {
  const { nounId } = props;

  const { loading, error, data } = useQuery(auctionQuery(parseInt(nounId)), {
    skip: nounId === null,
  });

  if (loading || !data || !nounId) {
    return (
      <div className={classes.spinnerWrapper}>
        <div className={classes.spinner}>
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  const startTime = data.auction.startTime;

  if (error || !startTime) {
    return <>Failed to fetch</>;
  }
  const birthday = new Date(Number(startTime) * 1000);

  return (
    <div className={classes.wrapper}>
      {/* First Row */}
      <div className={classes.titleWrapper}>
        <div className={classes.nounWrapper}>
          <StandaloneNounCircular nounId={BigNumber.from(nounId)} />
        </div>
        <div>
          <h1>Neon {nounId}</h1>
        </div>
      </div>

      {/* Noun birthday */}
      <div className={classes.nounInfoWrapper}>
        <CakeIcon height={20} width={20} className={classes.icon} />
        <Trans>Born</Trans> <span className={classes.bold}>{i18n.date(birthday)}</span>
      </div>

      {/* Current holder */}
      <div className={clsx(classes.nounInfoWrapper, classes.currentHolder)}>
        <HeartIcon height={20} width={20} className={classes.icon} />
        <span>
          <Trans>Held by</Trans>
        </span>
        <span className={classes.bold}>
          <ShortAddress address={data.auction.noun.owner.id} />
        </span>
      </div>
    </div>
  );
};

export default NounHoverCard;
