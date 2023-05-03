pragma ton-solidity ^0.47.0;

/**
    Reserved codes - 100-199
 */
library DataErrors {
    uint8 constant allowance_exists = 200;
    uint8 constant not_enough_allowance = 201;
    uint8 constant not_enough_allowance_or_not_owner = 202;
    uint8 constant sender_is_not_my_root = 203;
}