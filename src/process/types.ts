export type ProcessDownload = {
    error: string
    data: null
  } | {
  error:  null
  data: string
}

export type DownloadOTT = {
  data: {
    user_tokens: {
      token: string
    },
    gateway: {
      url: string
      upload_chunk_size?: number
    },
    upload_chunk_size: number,
  },
}

export interface GetEncryptedFileDetailsEffect {
  count: number;
  data: GetEncryptedFileDetails[];
}

type GetEncryptedFileDetails = {
  id: number;
  user_public_address: {
    public_address: string;
    public_key: string;
    active: boolean;
    is_unstoppable: boolean;
    is_coinbase: boolean;
  };
  encrypted_key: string;
};
