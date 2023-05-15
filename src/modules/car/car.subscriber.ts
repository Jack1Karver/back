
import { abiJson, MessageBodyType } from '@eversdk/core';
import { ResponseType } from '@eversdk/core/dist/bin';
import { ResultOfSubscribeCollection } from '@eversdk/core/dist/modules';


import { IMessage, IMessageResult } from '../contracts/interfaces/message.interface';
import { ContractsService } from '../contracts/contracts.service';
import { ROOTS } from '../../config/roots.config';

export class CarSubscriber {
  private rootAddresses: string[] = [];
  private rootsSubscription: ResultOfSubscribeCollection = {handle: 0}

  constructor(
    private readonly contractsService: ContractsService,
  ) {}

  async onModuleInit() {

      this.rootAddresses.push(ROOTS.nftRoot.address);


    this.subscribeToRoots();
  }

  private async subscribeToRoots(): Promise<void> {
    this.rootsSubscription = await this.contractsService.wsClient.net.subscribe_collection(
      {
        collection: 'messages',
        filter: {
          src: { in: this.rootAddresses },
          msg_type: { eq: 2 },
        },
        result: 'boc id src created_at',
      },
      async (message: IMessage, responseType: number) => {
       console.log(`NFT_ROOT_MESSAGE: ${JSON.stringify({ responseType, message })}`);

        try {
          if (responseType === ResponseType.Custom) {
            this.decodeAndProcessRootMessage(message.result);
          }
        } catch (err) {
          console.log(err);
        }
      }
    );

    console.log(`SUBSCRIBED_TO_NFT_ROOTS: ${JSON.stringify(this.rootAddresses)}`);
  }

  private async decodeAndProcessRootMessage(message: IMessageResult) {

    const nftRootAbi = abiJson(ROOTS.nftRoot.abi);

    const decoded = await this.contractsService.client.abi.decode_message({
      abi: nftRootAbi,
      message: message.boc,
    });

    console.log(
      `NFT_ROOT_MESSAGE_DATA: ${JSON.stringify({
        decodedName: decoded.name,
        decodedBodyType: decoded.body_type,
        decodedValue: decoded?.value,
      })}`
    );
  }
}
