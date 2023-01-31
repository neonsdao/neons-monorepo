import { Modal } from 'react-bootstrap';
import { CHAIN_ID } from '../../config';

const networkName = () => {
  switch (Number(CHAIN_ID)) {
    case 1:
      return 'Ethereum Mainnet';
    case 4:
      return 'the Rinkeby network';
    case 5:
      return 'the Goerli network';
    case 7700:
      return 'the Canto network';
    default:
      return `Network ${CHAIN_ID}`;
  }
};

const metamaskNetworkName = () => {
  switch (Number(CHAIN_ID)) {
    case 1:
      return 'Ethereum Mainnet';
    case 4:
      return 'Rinkeby Test Network';
    case 5:
      return 'Goerli Test Network';
    case 7700:
      return 'Canto Mainnet';
    default:
      return `Network ${CHAIN_ID}`;
  }
};

const NetworkAlert = () => {
  return (
    <>
      <Modal show={true} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Wrong Network Detected</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Neons auctions require you to switch over {networkName()} to be able to participate.
          </p>
          <p>
            <b>To get started, please switch your network by following the instructions below:</b>
          </p>
          <ol>
            <li>Open Metamask</li>
            <li>Click the network select dropdown</li>
            <li>Click on "{metamaskNetworkName()}"</li>
          </ol>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default NetworkAlert;
