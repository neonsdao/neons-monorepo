# neons-monorepo

Neons is a generative avatar art collective run by a group of crypto misfits.

## Packages

### neons-api

The [neons api](packages/neons-api) is an HTTP webserver that hosts token metadata. This is currently unused because on-chain, data URIs are enabled.

### neons-assets

The [neons assets](packages/neons-assets) package holds the Neon PNG and run-length encoded image data.

### neons-bots

The [neons bots](packages/neons-bots) package contains a bot that monitors for changes in Neon auction state and notifies everyone via Twitter and Discord.

### neons-contracts

The [neons contracts](packages/neons-contracts) is the suite of Solidity contracts powering Neons DAO.

### neons-sdk

The [neons sdk](packages/neons-sdk) exposes the Neons contract addresses, ABIs, and instances as well as image encoding and SVG building utilities.

### neons-subgraph

In order to make retrieving more complex data from the auction history, [neons subgraph](packages/neons-subgraph) contains subgraph manifests that are deployed onto [The Graph](https://thegraph.com).

### neons-webapp

The [neons webapp](packages/neons-webapp) is the frontend for interacting with Neon auctions as hosted at [neons.lol](https://neons.lol).

## Quickstart

### Install dependencies

```sh
yarn
```

### Build all packages

```sh
yarn build
```

### Run Linter

```sh
yarn lint
```

### Run Prettier

```sh
yarn format
```
