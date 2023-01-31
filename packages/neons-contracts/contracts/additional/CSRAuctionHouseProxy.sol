// SPDX-License-Identifier: MIT

pragma solidity ^0.8.6;

import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import { IWETH } from '../interfaces/IWETH.sol';
import { INounsToken } from '../interfaces/INounsToken.sol';
import { INounsAuctionHouse } from '../interfaces/INounsAuctionHouse.sol';

interface ITurnstile {
    function register(address _recipient) external returns (uint256 tokenId);
}

contract CSRAuctionHouseProxy {
    INounsToken public immutable nounsToken;
    INounsAuctionHouse public immutable auctionHouseProxy;

    // The address of the WETH contract
    address public weth;

    address lastBidder;
    uint256 lastNounId;

    constructor(
        address _weth,
        address _nounsToken,
        address _auctionHouseProxy,
        address _turnstile,
        address _treasury
    ) {
        weth = _weth;
        nounsToken = INounsToken(_nounsToken);
        auctionHouseProxy = INounsAuctionHouse(_auctionHouseProxy);

        ITurnstile(_turnstile).register(_treasury);
    }

    /**
     * @notice Settle the current auction, mint a new Noun, and put it up for auction.
     */
    function settleCurrentAndCreateNewAuction() external {
        auctionHouseProxy.settleCurrentAndCreateNewAuction();
        _settle();
    }

    /**
     * @notice Settle the current auction.
     * @dev This function can only be called when the contract is paused.
     */
    function settleAuction() external {
        auctionHouseProxy.settleAuction();
        _settle();
    }

    function _settle() internal {
        uint256 bal = address(this).balance;
        if (bal > 0) {
            _safeTransferETHWithFallback(lastBidder, bal);
        }

        address nounOwner = nounsToken.ownerOf(lastNounId);
        if (nounOwner == address(this)) {
            nounsToken.transferFrom(address(this), lastBidder, lastNounId);
        }
    }

    /**
     * @notice Create a bid for a Noun, with a given amount.
     * @dev This contract only accepts payment in ETH.
     */
    function createBid(uint256 nounId) external payable {
        auctionHouseProxy.createBid{ value: msg.value }(nounId);

        uint256 bal = address(this).balance;
        if (bal > 0) {
            _safeTransferETHWithFallback(lastBidder, bal);
        }

        lastBidder = msg.sender;
        lastNounId = nounId;
    }

    /**
     * @notice Transfer ETH. If the ETH transfer fails, wrap the ETH and try send it as WETH.
     */
    function _safeTransferETHWithFallback(address to, uint256 amount) internal {
        if (!_safeTransferETH(to, amount)) {
            IWETH(weth).deposit{ value: amount }();
            IERC20(weth).transfer(to, amount);
        }
    }

    /**
     * @notice Transfer ETH and return the success status.
     * @dev This function only forwards 30,000 gas to the callee.
     */
    function _safeTransferETH(address to, uint256 value) internal returns (bool) {
        (bool success, ) = to.call{ value: value, gas: 30_000 }(new bytes(0));
        return success;
    }
}
