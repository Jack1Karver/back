import { AccountAddressType, TonClient } from '@eversdk/core';
import { libNode } from '@eversdk/lib-node';
import { EVER_HTTPS_ENDPOINTS } from '../../config/ton.config';

export class ContractsService {
  readonly client: TonClient;

  constructor() {
    TonClient.useBinaryLibrary(libNode);
    this.client = new TonClient({
      network: {
        endpoints: EVER_HTTPS_ENDPOINTS,
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
}
