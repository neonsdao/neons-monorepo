import { useAppSelector } from '../../hooks';
import classes from './NavBar.module.css';
import logo from '../../assets/logo.svg';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { Nav, Navbar, Container } from 'react-bootstrap';
import testnetNoun from '../../assets/testnet-noun.png';
import config, { CANTO_CHAIN_ID, CHAIN_ID } from '../../config';
import { utils } from 'ethers';
import { buildEtherscanHoldingsLink } from '../../utils/etherscan';
import NavBarButton, { NavBarButtonStyle } from '../NavBarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import NavBarTreasury from '../NavBarTreasury';
import NavWallet from '../NavWallet';
import { Trans } from '@lingui/macro';
import { useState, useCallback } from 'react';
import NavDropdown from '../NavDropdown';
import { Dropdown } from 'react-bootstrap';
import navDropdownClasses from '../NavWallet/NavBarDropdown.module.css';
import responsiveUiUtilsClasses from '../../utils/ResponsiveUIUtils.module.css';
import { usePickByState } from '../../utils/colorResponsiveUIUtils';
import { ReactComponent as Noggles } from '../../assets/icons/Noggles.svg';
import { useTreasuryBalance } from '../../hooks/useTreasuryBalance';
import clsx from 'clsx';
import ReactAudioPlayer from 'react-audio-player';

const LOFI_SONGS = [
  'https://www.chosic.com/wp-content/uploads/2022/10/Lazy-Afternoon.mp3',
  'https://www.chosic.com/wp-content/uploads/2022/04/Cozy-Place-Chill-Background-Music.mp3',
  'https://www.chosic.com/wp-content/uploads/2021/09/On-My-Way-Lofi-Study-Music.mp3',
  'https://www.chosic.com/wp-content/uploads/2023/01/Ghostrifter-Official-Celestia.mp3',
  'https://www.chosic.com/wp-content/uploads/2022/03/SAX-LOFI-.mp3',
  'https://www.chosic.com/wp-content/uploads/2022/10/Contact.mp3',
  'https://www.chosic.com/wp-content/uploads/2022/10/City-Life.mp3',
  'https://www.chosic.com/wp-content/uploads/2022/10/Dream-Machine.mp3',
  'https://www.chosic.com/wp-content/uploads/2022/10/Violet.mp3',
  'https://www.chosic.com/wp-content/uploads/2022/10/Thunder-Nap.mp3',
  'https://www.chosic.com/wp-content/uploads/2022/10/Signs-of-Life.mp3',
  'https://www.chosic.com/wp-content/uploads/2022/10/Cats-Cradle.mp3',
];

const NavBar = () => {
  const activeAccount = useAppSelector(state => state.account.activeAccount);
  const stateBgColor = useAppSelector(state => state.application.stateBackgroundColor);
  const isCool = useAppSelector(state => state.application.isCoolBackground);
  const history = useHistory();
  const treasuryBalance = useTreasuryBalance();
  const daoEtherscanLink = buildEtherscanHoldingsLink(config.addresses.nounsDaoExecutor);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<any>(null);
  const [currentSong, setCurrentSong] = useState(
    LOFI_SONGS[Math.floor(Math.random() * LOFI_SONGS.length)],
  );

  const useStateBg =
    history.location.pathname === '/' ||
    history.location.pathname.includes('/neon/') ||
    history.location.pathname.includes('/auction/');

  const nonWalletButtonStyle = !useStateBg
    ? NavBarButtonStyle.WHITE_INFO
    : isCool
    ? NavBarButtonStyle.COOL_INFO
    : NavBarButtonStyle.WARM_INFO;

  const closeNav = () => setIsNavExpanded(false);
  const handleCanPlay = (event: any) => {
    setAudioPlayer(event.target);
  };

  const updateSong = useCallback(() => {
    const nextSong = LOFI_SONGS[Math.floor(Math.random() * LOFI_SONGS.length)];

    setCurrentSong(nextSong);

    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.src = nextSong;
      audioPlayer.play();
    }
  }, [audioPlayer]);

  return (
    <>
      <Navbar
        expand="xl"
        style={{ backgroundColor: `${useStateBg ? stateBgColor : 'white'}` }}
        className={classes.navBarCustom}
        expanded={isNavExpanded}
      >
        <Container style={{ maxWidth: 'unset' }}>
          <div className={classes.brandAndTreasuryWrapper}>
            <Navbar.Brand as={Link} to="/" className={classes.navBarBrand}>
              <img src={logo} className={classes.navBarLogo} alt="Neons logo" />
            </Navbar.Brand>
            {Number(CHAIN_ID) !== CANTO_CHAIN_ID && (
              <Nav.Item>
                <img className={classes.testnetImg} src={testnetNoun} alt="testnet noun" />
                TESTNET
              </Nav.Item>
            )}
            <Nav.Item>
              {treasuryBalance && (
                <Nav.Link
                  href={daoEtherscanLink}
                  className={classes.nounsNavLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <NavBarTreasury
                    treasuryBalance={Number(utils.formatEther(treasuryBalance)).toFixed(0)}
                    treasuryStyle={nonWalletButtonStyle}
                  />
                </Nav.Link>
              )}
            </Nav.Item>
          </div>
          <Navbar.Toggle
            className={classes.navBarToggle}
            aria-controls="basic-navbar-nav"
            onClick={() => setIsNavExpanded(!isNavExpanded)}
          />
          <Navbar.Collapse className="justify-content-end">
            <Nav.Link className={classes.nounsNavLink} onClick={closeNav}>
              <ReactAudioPlayer
                controls
                src={currentSong}
                onCanPlay={handleCanPlay}
                onEnded={updateSong}
              />
            </Nav.Link>
            <Nav.Link as={Link} to="/vote" className={classes.nounsNavLink} onClick={closeNav}>
              <NavBarButton
                buttonText={<Trans>DAO</Trans>}
                buttonIcon={<FontAwesomeIcon icon={faUsers} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link>
            {/* <Nav.Link
              href={externalURL(ExternalURL.nounsCenter)}
              className={classes.nounsNavLink}
              target="_blank"
              rel="noreferrer"
              onClick={closeNav}
            >
              <NavBarButton
                buttonText={<Trans>Docs</Trans>}
                buttonIcon={<FontAwesomeIcon icon={faBookOpen} />}
                buttonStyle={nonWalletButtonStyle}
              />
            </Nav.Link> */}
            <div className={clsx(responsiveUiUtilsClasses.mobileOnly)}>
              <Nav.Link
                as={Link}
                to="/playground"
                className={classes.nounsNavLink}
                onClick={closeNav}
              >
                <NavBarButton
                  buttonText={<Trans>Playground</Trans>}
                  buttonIcon={<FontAwesomeIcon icon={faPlay} />}
                  buttonStyle={nonWalletButtonStyle}
                />
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/explore"
                className={clsx(classes.nounsNavLink, classes.exploreButton)}
                onClick={closeNav}
              >
                <NavBarButton
                  buttonText={<Trans>Neons &amp; Traits</Trans>}
                  buttonIcon={<Noggles />}
                  buttonStyle={nonWalletButtonStyle}
                />
              </Nav.Link>
            </div>
            <div className={clsx(responsiveUiUtilsClasses.desktopOnly)}>
              <NavDropdown buttonIcon={<Noggles />} buttonStyle={nonWalletButtonStyle}>
                <Dropdown.Item
                  className={clsx(
                    usePickByState(
                      navDropdownClasses.whiteInfoSelectedBottom,
                      navDropdownClasses.coolInfoSelected,
                      navDropdownClasses.warmInfoSelected,
                      history,
                    ),
                  )}
                  href="/explore"
                >
                  Neons &amp; Traits
                </Dropdown.Item>
                <Dropdown.Item
                  className={clsx(
                    usePickByState(
                      navDropdownClasses.whiteInfoSelectedBottom,
                      navDropdownClasses.coolInfoSelected,
                      navDropdownClasses.warmInfoSelected,
                      history,
                    ),
                  )}
                  href="/playground"
                >
                  Playground
                </Dropdown.Item>
              </NavDropdown>
            </div>
            <NavWallet address={activeAccount || '0'} buttonStyle={nonWalletButtonStyle} />{' '}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
