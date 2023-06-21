export interface IMessage {
  result: IMessageResult;
  created_at: number;
}

export interface IOutMessage {
  id: string;
  boc: string;
  msg_type: string;
}

export interface IMessageResult {
  boc: string;
  id: string;
  src: string;
  src_transaction: {
    out_messages: IOutMessage[];
  };
  created_at: number;
  dst: string;
}
