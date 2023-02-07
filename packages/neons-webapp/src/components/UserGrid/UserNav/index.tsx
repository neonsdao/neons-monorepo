import { Trans } from '@lingui/macro';
import { motion } from 'framer-motion/dist/framer-motion';
import React from 'react';
import classes from './UserNav.module.css';

interface UserNavProps {
  nounCount: number;
}

const UserNav: React.FC<UserNavProps> = props => {
  return (
    <div className={classes.nav}>
      <h3>
        <span>
          <Trans>Your</Trans>
        </span>{' '}
        {props.nounCount >= 0 && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <strong>{props.nounCount}</strong> Neons
          </motion.span>
        )}
      </h3>
    </div>
  );
};

export default UserNav;
