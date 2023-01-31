// SPDX-License-Identifier: GPL-3.0

/// @title The NounsToken pseudo-random seed generator

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.6;

import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { INounsDescriptorMinimal } from './interfaces/INounsDescriptorMinimal.sol';

contract NounsSeeder is INounsSeeder {
    /**
     * @notice Generate a pseudo-random Noun seed using the previous blockhash and noun ID.
     */
    // prettier-ignore
    function generateSeed(uint256 nounId, INounsDescriptorMinimal descriptor) external view override returns (Seed memory) {
        uint256 pseudorandomness = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))
        );

        uint256 backgroundCount = descriptor.backgroundCount();
        uint48 background = uint48(
            uint48(pseudorandomness) % backgroundCount
        );
        
        if (pseudorandomness % 1000 < 10) {
            // 1% chance to mint an agent
            uint48 _accessory = uint48(
                uint48(pseudorandomness >> 96) % 1
            );

            return Seed({
                background: background,
                body: uint48(2),
                accessory: _accessory == 0 ? uint48(2) : uint48(4),
                head: uint48(2),
                glasses: uint48(1)
            });
        }
        
        if (pseudorandomness % 1000 < 1) {
            // 0.1% chance to mint a neo

            return Seed({
                background: background,
                body: uint48(1),
                accessory: uint48(1),
                head: uint48(1),
                glasses: uint48(1)
            });
        }

        uint256 bodyCount = descriptor.bodyCount();
        uint256 accessoryCount = descriptor.accessoryCount();
        uint256 headCount = descriptor.headCount();

        uint48 body = uint48(
            uint48(pseudorandomness >> 48) % bodyCount
        );
        uint48 accessory = uint48(
            uint48(pseudorandomness >> 96) % accessoryCount
        );
        uint48 head = uint48(
            uint48(pseudorandomness >> 144) % headCount
        );

        // do not allow random mints of scott, neos, or agents
        while (body < 3) {
            unchecked {
                body = uint48((body + accessory + head + 1) % bodyCount); // @dev: overflow is fine
            }
        }

        while (accessory < 3) {
            unchecked {
                accessory = uint48((body + accessory + head + 1) % accessoryCount);
            }
        }

        while (head < 3) {
            unchecked {
                head = uint48((body + accessory + head + 1) % headCount);
            }
        }

        return Seed({
            background: background,
            body: body,
            accessory: accessory,
            head: head,
            glasses: uint48(0)
        });
    }
}
