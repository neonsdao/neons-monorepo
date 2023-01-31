# @neons/contracts

## Background

Neons are an experimental attempt to improve the formation of on-chain avatar communities. While projects such as Canto Longnecks have attempted to bootstrap digital community and identity, Neons attempt to bootstrap identity, community, governance and a treasury that can be used by the community for the creation of long-term value.

One Neon is generated and auctioned every 7 minutes, until 5,555 are minted. All Neon artwork is stored and rendered on-chain. See more information at [neons.lol](https://neons.lol/).

## Contracts

| Contract                                                        | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Address                                                                                                                        |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [NounsToken](./contracts/NounsToken.sol)                        | This is the Neons ERC721 Token contract. Unlike other Neons contracts, it cannot be replaced or upgraded. Beyond the responsibilities of a standard ERC721 token, it is used to lock and replace periphery contracts, store checkpointing data required by our Governance contracts, and control Noun minting/burning. This contract contains two main roles - `minter` and `owner`. The `minter` will be set to the Neons Auction House in the constructor and ownership will be transferred to the Neons Treasury following deployment.                                                                                               | [0x6F76c991F896B115AAaA9c40f240C6FBB5e25913](https://evm.explorer.canto.io/address/0x6F76c991F896B115AAaA9c40f240C6FBB5e25913) |
| [NounsSeeder](./contracts/NounsSeeder.sol)                      | This contract is used to determine Neon traits during the minting process. It can be replaced to allow for future trait generation algorithm upgrades. Additionally, it can be locked by the Neons Treasury to prevent any future updates. Currently, Neon traits are determined using pseudo-random number generation: `keccak256(abi.encodePacked(blockhash(block.number - 1), neonId))`. Trait generation is not truly random. Traits can be predicted when minting a Neon on the pending block.                                                                                                                                     | [0xf5F180480E243051BC9C9151263a3748a2A93129](https://evm.explorer.canto.io/address/0xf5F180480E243051BC9C9151263a3748a2A93129) |
| [NounsDescriptor](./contracts/NounsDescriptor.sol)              | This contract is used to store/render Neon artwork and build token URIs. Neon 'parts' are compressed in the following format before being stored in their respective byte arrays: `Palette Index, Bounds [Top (Y), Right (X), Bottom (Y), Left (X)] (4 Bytes), [Pixel Length (1 Byte), Color Index (1 Byte)][]`. When `tokenURI` is called, Neon parts are read from storage and converted into a series of SVG rects to build an SVG image on-chain. Once the entire SVG has been generated, it is base64 encoded. The token URI consists of base64 encoded data URI with the JSON contents directly inlined, including the SVG image. | [0x3650247746028D656659298681D8Efe0E0338050](https://evm.explorer.canto.io/address/0x3650247746028D656659298681D8Efe0E0338050) |
| [NounsAuctionHouse](./contracts/NounsAuctionHouse.sol)          | This contract acts as a self-sufficient neon generation and distribution mechanism, auctioning one neon every 7 minutes. 100% of auction proceeds (CANTO) are automatically deposited in the Neons Treasury treasury, where they are governed by neon owners. Each time an auction is settled, the settlement transaction will also cause a new neon to be minted and a new 7 minute auction to begin. While settlement is most heavily incentivized for the winning bidder, it can be triggered by anyone, allowing the system to trustlessly auction neons as long as Ethereum is operational and there are interested bidders.       | [0x4d84Ef9F5dB4dAdC106291A9367A23E56a79F407](https://evm.explorer.canto.io/address/0x4d84Ef9F5dB4dAdC106291A9367A23E56a79F407) |
| [NounsDAOExecutor](./contracts/governance/NounsDAOExecutor.sol) | This contract is a fork of Compound's `Timelock`. It acts as a timelocked treasury for the Neons Treasury. This contract is controlled by the governance contract (`NounsDAOProxy`).                                                                                                                                                                                                                                                                                                                                                                                                                                                    | [0xD10f179c2D1Cba52e862A02563f416fDA0401396](https://evm.explorer.canto.io/address/0xD10f179c2D1Cba52e862A02563f416fDA0401396) |
| [NounsDAOProxy](./contracts/governance/NounsDAOProxy.sol)       | This contract is a fork of Compound's `GovernorBravoDelegator`. It can be used to create, vote on, and execute governance proposals.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | [0x4A97Ab43916f844A7C5Aa39BaAc6ece3103C7231](https://evm.explorer.canto.io/address/0x4A97Ab43916f844A7C5Aa39BaAc6ece3103C7231) |
| [NounsDAOLogicV1](./contracts/governance/NounsDAOLogicV1.sol)   | This contract is a fork of Compound's `GovernorBravoDelegate`. It's the logic contract used by the `NounsDAOProxy`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | [0xD991027b55f18629ae1Fbde0D09F6362E8758169](https://evm.explorer.canto.io/address/0xD991027b55f18629ae1Fbde0D09F6362E8758169) |

## Development

### Install dependencies

```sh
yarn
```

### Compile typescript, contracts, and generate typechain wrappers

```sh
yarn build
```

### Run tests

```sh
yarn test
```

### Install forge dependencies

```sh
forge install
```

### Run forge tests

```sh
forge test -vvv
```

### Environment Setup

Copy `.env.example` to `.env` and fill in fields

### Commands

```sh
# Compile Solidity
yarn build:sol

# Command Help
yarn task:[task-name] --help

# Deploy & Configure for Local Development (Hardhat)
yarn task:run-local

# Deploy & Configure (Testnet/Mainnet)
# This task deploys and verifies the contracts, populates the descriptor, and transfers contract ownership.
# For parameter and flag information, run `yarn task:deploy-and-configure --help`.
yarn task:deploy-and-configure --network [network] --update-configs
```
