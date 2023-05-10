pragma ton-solidity ^0.46.0;
pragma AbiHeader expire;
pragma AbiHeader pubkey;
pragma AbiHeader time;

library RootDeployerErrors {
  uint8 constant message_sender_is_not_my_owner = 100;
  uint8 constant not_enough_value_to_deploy = 101;
  uint8 constant wrong_pubkey = 102;
}