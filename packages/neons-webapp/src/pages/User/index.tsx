import React, { useState, useEffect, useRef } from 'react';
import classes from './User.module.css';
import cx from 'classnames';
import UserNounDetail from '../../components/UserGrid/UserNounDetail';
import { motion, AnimatePresence } from 'framer-motion/dist/framer-motion';
import { useKeyPress } from '../../hooks/useKeyPress';
import UserGrid from '../../components/UserGrid';
import UserNav from '../../components/UserGrid/UserNav';
import { useEthers } from '@usedapp/core';
import { useQuery, useApolloClient, ApolloError } from '@apollo/client';
import { userTokens, userNounsIndex } from '../../wrappers/subgraph';

interface UserPageProps {
  account: string
}

type Noun = {
  id: number | null;
  imgSrc: string | undefined;
};

const pageSize = 50

const UserDisplay: React.FC<UserPageProps> = props => {
  const [page, setPage] = useState(0)

  // Borrowed from /src/pages/Playground/NounModal/index.tsx
  const [width, setWidth] = useState<number>(window.innerWidth);
  const isMobile: boolean = width <= 991;
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  // Get user neons
  const client =  useApolloClient()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>()
  const [error, setError] = useState<ApolloError>()
  
  const { loading: totalNeonsLoading, error: totalNeonsError, data: totalNeonsData } = useQuery(userTokens(props.account));

  // Set state
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(!isMobile && true);
  const [nounsList, setNounsList] = useState<Noun[]>([]);
  const [visibleNounsList, setVisibleNounsList] = useState<Noun[]>([]);
  const [selectedNoun, setSelectedNoun] = useState<number | undefined>(undefined);
  const [activeNoun, setActiveNoun] = useState<number>(-1);
  const [totalNounsCount, setTotalNounsCount] = useState<number>(0);
  const [isNounHoverDisabled, setIsNounHoverDisabled] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<string>('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  // // Keyboard keys to listen for
  const keyboardPrev: boolean = useKeyPress('ArrowLeft');
  const keyboardNext: boolean = useKeyPress('ArrowRight');
  const keyboardUp: boolean = useKeyPress('ArrowUp');
  const keyboardDown: boolean = useKeyPress('ArrowDown');
  const keyboardEsc: boolean = useKeyPress('Escape');

  // Handle events
  const handleNounNavigation = (direction: string) => {
    const selectedNounIndex = nounsList.findIndex(o => o.id === selectedNoun);

    if (selectedNounIndex === -1) {
      return
    }

    if (direction === 'next') {
      setActiveNoun(nounsList[selectedNounIndex + 1].id || 0);
      setSelectedNoun(nounsList[selectedNounIndex + 1].id || 0);
    } else {
      setActiveNoun(nounsList[selectedNounIndex - 1].id || 0);
      setSelectedNoun(nounsList[selectedNounIndex - 1].id || 0);
    }
  };


  const handleCloseDetail = () => {
    setIsSidebarVisible(false);
    setActiveNoun(-1);
    setSelectedNoun(undefined);
    !isMobile && window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    if (isMobile) {
      const body = document.body;
      body.style.position = '';
      body.style.top = '';
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo({
        top: parseInt(scrollY),
        behavior: 'auto',
      });
    }
  };

  const handleScrollTo = (nounId: number) => {
    setIsNounHoverDisabled(true);
    nounId && buttonsRef.current[nounId]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFocusNoun = (nounId: number) => {
    nounId >= 0 && buttonsRef.current[nounId]?.focus();
    setActiveNoun(nounId);
    setSelectedNoun(nounId);
    setIsSidebarVisible(true);
    if (isMobile) {
      const body = document.body;
      setScrollY(document.documentElement.style.getPropertyValue('--scroll-y'));
      body.style.top = `-${scrollY}`;
    }
  };

  useEffect(() => {
    setIsNounHoverDisabled(true);
    let amountToMove = 10;
    if (width <= 400) {
      amountToMove = 3;
    }
    if (width <= 991) {
      amountToMove = 5;
    }
    if (width <= 1399) {
      amountToMove = 8;
    }

    if (selectedNoun !== undefined && selectedNoun >= 0) {
      if (keyboardEsc) {
        handleCloseDetail();
      }
      
      const selectedNounIndex = nounsList.findIndex(o => o.id === selectedNoun);
      if (keyboardPrev && selectedNounIndex - 1 >= 0) {
        handleFocusNoun(nounsList[selectedNounIndex - 1].id || 0);
      }
      if (keyboardNext && selectedNounIndex + 1 < nounsList.length) {
        handleFocusNoun(nounsList[selectedNounIndex + 1].id || 0);
      }
      if (keyboardUp && selectedNounIndex - amountToMove >= 0) {
        handleFocusNoun(nounsList[selectedNounIndex - amountToMove].id || 0);
      }
      if (keyboardDown && selectedNounIndex + amountToMove < nounsList.length) {
        handleFocusNoun(nounsList[selectedNounIndex + amountToMove].id || 0);
      } 
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboardPrev, keyboardNext, keyboardUp, keyboardDown, keyboardEsc]);

  // update query
  useEffect(() => {
    ;(async() => {
      const resp = await client.query({query: userNounsIndex(props.account, pageSize, page)})
      
      setData(resp.data)
      setLoading(resp.loading)
      setError(resp.error)
    })()
  }, [client, page, props.account])

  // Queried neons 
  useEffect(() => {
    if (!loading && !error && data) {
      const list = data.nouns.map((noun: any) => noun)
      
      setNounsList(list)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, error, loading]);

  // Queried neons count
  useEffect(() => {
    if (!totalNeonsLoading && !totalNeonsError && totalNeonsData.account !== null) {
      setTotalNounsCount(totalNeonsData.account.tokenBalance)
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalNeonsError, totalNeonsLoading]);

  // Once nounCount is known, run dependent functions
  useEffect(() => {
    if (nounsList && nounsList.length > 0) {
      // get latest noun id, then replace loading sidebar state with latest noun
      !isMobile && setSelectedNoun(nounsList[0].id || 0);
      !isMobile && setActiveNoun(nounsList[0].id || 0);
    } else if (nounsList && nounsList.length === 0) {
      !isMobile && setSelectedNoun(0);
      !isMobile && setActiveNoun(0);
    }
  }, [isMobile, nounsList]);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    window.addEventListener('scroll', () => {
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
    });

    // Remove block on hover over noun
    window.addEventListener('mousemove', event => {});
    onmousemove = () => {
      setIsNounHoverDisabled(false);
    };
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <div className={classes.exploreWrap} ref={containerRef}>
      <div className={classes.contentWrap}>
        <motion.div
          className={cx(classes.gridWrap, isNounHoverDisabled && classes.nounHoverDisabled)}
          animate={{
            maxWidth: !isMobile && selectedNoun ? '80%' : '100%',
            transition: {
              duration: 0.025,
            },
          }}
        >
          <UserNav
            nounCount={totalNounsCount}
          />
          <UserGrid
            nounCount={totalNounsCount}
            activeNoun={activeNoun}
            selectedNoun={selectedNoun}
            setActiveNoun={setActiveNoun}
            setSelectedNoun={setSelectedNoun}
            visibleNounsList={visibleNounsList}
            setVisibleNounsList={setVisibleNounsList}
            handleFocusNoun={handleFocusNoun}
            isNounHoverDisabled={isNounHoverDisabled}
            buttonsRef={buttonsRef}
            nounsList={nounsList}
            page={page}
            setPage={setPage}
            pageSize={pageSize}
          />
        </motion.div>

        <AnimatePresence initial={false}>
          {isSidebarVisible && (
            <UserNounDetail
              handleCloseDetail={() => handleCloseDetail()}
              handleNounNavigation={handleNounNavigation}
              noun={{ id: activeNoun, imgSrc: undefined }}
              nounId={activeNoun}
              nounCount={totalNounsCount}
              selectedNoun={selectedNoun}
              isVisible={isSidebarVisible}
              handleScrollTo={handleScrollTo}
              setIsNounHoverDisabled={setIsNounHoverDisabled}
              disablePrev={nounsList && nounsList.length > 0 && selectedNoun === nounsList[0].id}
              disableNext={nounsList && nounsList.length > 0 && selectedNoun === nounsList[nounsList.length - 1].id}
              handleFocusNoun={handleFocusNoun}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export const UserPage: React.FC<UserPageProps> = props => {
  const { account } = useEthers();

  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    if (account !== undefined) {      
      setUserAddress(account)
    }
  }, [account]);

  return (
    <div>
      {userAddress !== null && <UserDisplay account={userAddress} />}
    </div>
  ); 
}

export default UserPage;
