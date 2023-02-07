import React from 'react';
import { BigNumber } from 'ethers';
import { StandaloneNounImage } from '../../StandaloneNoun';

interface UserGridItemProps {
  nounId: number | null;
  imgSrc: string | undefined;
}

const UserGridItem: React.FC<UserGridItemProps> = props => {
  return (
    <>
      {/* If image can't be loaded, fetch Noun image internally */}
      {/* {isImageError && props.nounId && ( */}
      {props.nounId && <StandaloneNounImage nounId={BigNumber.from(props.nounId)} />}
    </>
  );
};

export default UserGridItem;
