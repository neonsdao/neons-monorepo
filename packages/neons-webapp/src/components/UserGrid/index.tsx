import React, { useCallback, useEffect } from 'react';
import classes from './UserGrid.module.css';
import cx from 'classnames';
import UserGridItem from './UserGridItem';
import Placeholder from 'react-bootstrap/esm/Placeholder';

interface UserGridProps {
  nounCount: number;
  activeNoun: number;
  selectedNoun: number | undefined;
  setActiveNoun: Function;
  setSelectedNoun: Function;
  handleFocusNoun: Function;
  isNounHoverDisabled: boolean;
  nounsList: Noun[];
  visibleNounsList: Noun[];
  setVisibleNounsList: Function;
  buttonsRef: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  pageSize: number;
  page: number;
  setPage: Function;
}

type Noun = {
  id: number | null;
  imgSrc: string | undefined;
};

const placeholderNoun: Noun = { id: null, imgSrc: undefined };

const UserGrid: React.FC<UserGridProps> = props => {
  /* ---------------------------------- props --------------------------------- */
  const nounsCount = props.nounCount;
  const nounsList = props.nounsList;
  const setVisibleNounsList = props.setVisibleNounsList;
  const pageSize = props.pageSize;
  const page = props.page;
  const setPage = props.setPage;

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
    setVisibleNounsList(placeholderNounsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set nounsList on page change
  useEffect(() => {
    // check
    if (nounsCount <= 0) {
      setVisibleNounsList([]);
      return;
    }

    // set nouns for current page
    const nouns: Noun[] = [];

    for (let i = 0; i < pageSize && i < nounsList.length; i += 1) {
      nouns.push({
        id: nounsList[i].id,
        imgSrc: undefined,
      });
    }

    setVisibleNounsList(nouns);
  }, [nounsCount, nounsList, page, pageSize, setVisibleNounsList]);

  /* -------------------------------- callbacks ------------------------------- */
  const onPrevious = useCallback(() => {
    setPage((p: number) => {
      if (p <= 0) {
        return p;
      }
      return p - 1;
    });
  }, [setPage]);

  const onNext = useCallback(() => {
    setPage((p: number) => {
      if (p >= Math.ceil(nounsCount / pageSize) - 1) {
        return p;
      }
      return p + 1;
    });
  }, [nounsCount, pageSize, setPage]);

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
        {props.visibleNounsList.map((noun, i) => {
          return (
            <li className={noun.id === props.selectedNoun ? classes.activeNoun : ''} key={i}>
              <button
                ref={el => (props.buttonsRef.current[noun.id ? noun.id : -1] = el)}
                key={`${i}${noun.id}`}
                onClick={e => noun.id !== null && props.handleFocusNoun(noun.id)}
                onFocus={e => noun.id !== null && props.handleFocusNoun(noun.id)}
                onMouseOver={() =>
                  !props.isNounHoverDisabled && noun.id !== null && props.setActiveNoun(noun.id)
                }
                onMouseOut={() =>
                  props.selectedNoun !== undefined && props.setActiveNoun(props.selectedNoun)
                }
              >
                <UserGridItem nounId={noun.id} imgSrc={noun.imgSrc} />
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

export default UserGrid;
