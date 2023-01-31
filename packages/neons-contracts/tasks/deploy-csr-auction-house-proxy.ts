import { task } from 'hardhat/config';

task('deploy-csr-proxy', 'Deploy CSR Auction House Proxy')
  .addParam('weth', 'The WETH address on the chain.', '0x826551890Dc65655a0Aceca109aB11AbDbD7a07B')
  .addParam(
    'nounsToken',
    'The address of the NounsToken that should be used.',
    '0x6F76c991F896B115AAaA9c40f240C6FBB5e25913',
  )
  .addParam(
    'auctionHouseProxy',
    'The address of the AuctionHouseProxy that should be proxied.',
    '0x157B312d199031afC82D77a34269D3Da51436afd',
  )
  .addParam(
    'turnstile',
    'The address of the CSR Turnstile.',
    '0xEcf044C5B4b867CFda001101c617eCd347095B44',
  )
  .addParam(
    'treasury',
    'The address of the Neons Treasury.',
    '0xD10f179c2D1Cba52e862A02563f416fDA0401396',
  )
  .setAction(async ({ weth, nounsToken, auctionHouseProxy, turnstile, treasury }, { ethers }) => {
    const [deployer] = await ethers.getSigners();
    console.log(`Deploying from address ${deployer.address}`);

    const proxy = await (
      await ethers.getContractFactory('CSRAuctionHouseProxy', deployer)
    ).deploy(weth, nounsToken, auctionHouseProxy, turnstile, treasury);

    console.log('CSRAuctionHouseProxy address: ', proxy.address);
  });
