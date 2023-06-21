import { AccountAddressType, KeyPair, NetworkQueriesProtocol, TonClient, signerKeys, signerNone } from '@eversdk/core';
import { libNode } from '@eversdk/lib-node';
import { EVER_HTTPS_ENDPOINTS } from '../../config/ton.config';
import { TnftDataAccount } from '../../contract-accounts/tnft-data.account';
import { AccountOptions, ContractPackage } from '@eversdk/appkit';
import { TnftOfferAccount } from './interfaces/tnft-offer.account';

export class ContractsService {
  readonly client: TonClient;
  readonly wsClient: TonClient;

  constructor() {
    TonClient.useBinaryLibrary(libNode);
    this.client = new TonClient({
      network: {
        endpoints: EVER_HTTPS_ENDPOINTS,
      },
    });
    this.wsClient = new TonClient({
      network: {
        endpoints: EVER_HTTPS_ENDPOINTS,
        queries_protocol: NetworkQueriesProtocol.WS,
      },
    });
    
  }

  async isAccountAddress(address: string): Promise<boolean> {
    try {
      const addressType = await this.client.utils.get_address_type({
        address,
      });
      return addressType.address_type === AccountAddressType.Hex;
    } catch (e) {
      return false;
    }
  }

  async isAccountDeployed(address: string): Promise<boolean> {
    const account = (
      await this.client.net.query_collection({
        collection: 'accounts',
        filter: {
          id: { eq: address },
          acc_type: { eq: 1 },
        },
        result: 'id',
      })
    ).result;

    return account.length > 0;
  }

  async waitForContractDeployment(address: string, timeout = 60000) {
    // Returns acc or waits for its creation.
    // @link https://tonlabs.gitbook.io/ton-sdk/reference/types-and-methods/mod_net#wait_for_collection
    try {
      return this.wsClient.net.wait_for_collection({
        collection: 'accounts',
        filter: {
          id: { eq: address },
          acc_type: { eq: 1 },
        },
        result: 'boc',
        timeout,
      });
    } catch (e) {
      return null;
    }
  }

  getTnftDataAccount(address: string, abi: string): TnftDataAccount {
    return new TnftDataAccount(...this.getAccountOptions(address, abi));
  }

  getAccountOptions(
    address: string,
    abi: string,
    keys?: KeyPair
  ): [contract: ContractPackage, accountOptions: AccountOptions] {
    return [
      { abi: JSON.parse(abi) },
      {
        client: this.client,
        address,
        signer: keys ? signerKeys(keys) : signerNone(),
      },
    ];
  }

  getTnftOfferAccount(address: string, abi: string): TnftOfferAccount {
    return new TnftOfferAccount(...this.getAccountOptions(address, abi));
  }
}
