import React, { useCallback, useEffect, useState } from 'react';
import classes from './ExploreGrid.module.css';
import cx from 'classnames';
import ExploreGridItem from './ExploreGridItem';
import Placeholder from 'react-bootstrap/esm/Placeholder';

interface ExploreGridProps {
  nounCount: number;
  activeNoun: number;
  selectedNoun: number | undefined;
  setActiveNoun: Function;
  setSelectedNoun: Function;
  setNounsList: Function;
  handleFocusNoun: Function;
  isNounHoverDisabled: boolean;
  nounsList: Noun[];
  sortOrder: string;
  buttonsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
}

type Noun = {
  id: number | null;
  imgSrc: string | undefined;
};

const placeholderNoun: Noun = { id: null, imgSrc: undefined };

const ExploreGrid: React.FC<ExploreGridProps> = props => {
  /* ---------------------------------- props --------------------------------- */
  const nounsCount = props.nounCount;
  const setNounsList = props.setNounsList;
  const sortOrder = props.sortOrder;

  /* --------------------------------- states --------------------------------- */
  const [page, setPage] = useState(0);

  // Range calls
  const pageSize = 50;

  /* --------------------------------- effects -------------------------------- */
  // set placeholder on initial load
  useEffect(() => {
    // placeholder nouns
    const placeholderNounsData = new Array(pageSize).fill(placeholderNoun).map((x, i): Noun => {
      return {
        id: null,
        imgSrc: undefined,
      };
    });
    setNounsList(placeholderNounsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set nounsList on page change
  useEffect(() => {
    // check
    if (nounsCount <= 0) {
      return;
    }

    // set nouns for current page
    const nouns: Noun[] = [];

    // - descending
    if (sortOrder === 'date-descending') {
      const firstIDOnPage = nounsCount - page * pageSize;
      
      for (let i = firstIDOnPage; i >= Math.max(firstIDOnPage - pageSize + 1, 1); i -= 1) {
        nouns.push({
          id: i,
          imgSrc: undefined,
        });
      }
    }

    // - ascending
    else {
      const firstIDOnPage = 1 + page * pageSize;
      for (let i = firstIDOnPage; i <= Math.min(firstIDOnPage + pageSize - 1, nounsCount); i += 1) {
        nouns.push({
          id: i,
          imgSrc: undefined,
        });
      }
    }
    setNounsList(nouns);
  }, [nounsCount, page, setNounsList, sortOrder]);

  /* -------------------------------- callbacks ------------------------------- */
  const onPrevious = useCallback(() => {
    setPage(p => {
      if (p <= 0) {
        return p;
      }
      return p - 1;
    });
  }, []);

  const onNext = useCallback(() => {
    setPage(p => {
      if (p >= Math.ceil(nounsCount / pageSize) - 1) {
        return p;
      }
      return p + 1;
    });
  }, [nounsCount]);

  /* ---------------------------------- main ---------------------------------- */
  return (
    <div
      className={cx(
        classes.exploreGrid,
        ((props.selectedNoun !== undefined && props.selectedNoun < 0) ||
          props.selectedNoun === undefined) &&
          props.nounCount >= 0 &&
          classes.sidebarHidden,
      )}
    >
      <ul style={{ marginBottom: '16px' }}>
        {props.nounsList.map((noun, i) => {
          return (
            <li className={noun.id === props.selectedNoun ? classes.activeNoun : ''} key={i}>
              <button
                ref={el => (props.buttonsRef.current[noun.id ? noun.id : -1] = el)}
                key={`${i}${noun.id}`}
                onClick={e => noun.id !== null && props.handleFocusNoun(noun.id)}
              >
                <ExploreGridItem nounId={noun.id} imgSrc={noun.imgSrc} />
                <p className={classes.nounIdOverlay}>
                  {noun.id != null ? noun.id : <Placeholder xs={12} animation="glow" />}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '16px',
          padding: '0px 12px',
          marginBottom: '20px',
        }}
      >
        <button
          style={{
            background: 'transparent',
            padding: '4px 16px 4px 16px',
            color: 'rgb(95, 95, 95)',
            fontWeight: 'bold',
            position: 'relative',
            appearance: 'none',
            borderRadius: '10px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
          onClick={onPrevious}
        >
          Previous
        </button>
        <div>Page {page + 1}</div>
        <button
          style={{
            background: 'transparent',
            padding: '4px 16px 4px 16px',
            color: 'rgb(95, 95, 95)',
            fontWeight: 'bold',
            position: 'relative',
            appearance: 'none',
            borderRadius: '10px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
          }}
          onClick={onNext}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExploreGrid;
