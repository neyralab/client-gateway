export type ProcessDownload =
  | {
      error: string;
      data: null;
    }
  | {
      error: null;
      data: Blob | string;
    };

export type DownloadOTT = {
  data: {
    jwt_ott: string;
    user_tokens: {
      token: string;
    };
    gateway: {
      url: string;
      upload_chunk_size?: number;
    };
    upload_chunk_size: number;
  };
};

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

export type LocalProvider = {
  get: (slug: string) => Promise<string | undefined>;
  set: (slug: string, value: string) => Promise<string>;
};

export type Callbacks = Record<'onPrompt', () => Promise<string>> &
  Record<
    'onProgress',
    (data: {
      id: string;
      progress: string;
      timeLeft: string;
      downloadingPercent: string;
    }) => void
  >;

export interface IFile {
  id: number;
  type: number;
  user: {
    ghost_pass_exist: boolean;
    ghost_time_enable: boolean;
    trusted_wired_network_status: boolean;
    trusted_wifi_network_status: boolean;
    new_comment_notification_status: boolean;
    new_comment_sound_status: boolean;
    message_verification_status: boolean;
    user_secure_locations: any[];
    password_access: null;
    gps_location: boolean;
    id: number;
    username: string;
    displayed_name: null;
    email: null;
    color: null;
    logo: string | null;
    logo_type: null;
    platform: number;
    sharing_notification: boolean;
    workspace_notification: boolean;
    sharing_notification_sound: boolean;
    workspace_notification_sound: boolean;
    referral: string;
    referral_from: null;
    user_public_addresses: [
      {
        public_address: string;
        active: boolean;
        is_unstoppable: boolean;
      },
    ];
    created_at: null;
    updated_at: null;
  };
  name: string;
  ghost_mode: boolean;
  securities: any[];
  geo_securities: any[];
  shares: any[];
  color: any[];
  schedules: any[];
  tags: any[];
  is_public: boolean;
  is_denied: boolean;
  entry_clientside_key: null | string;
  is_printed: boolean;
  is_delegated: boolean;
  is_hidden: boolean;
  is_downloaded: boolean;
  isFavorite: boolean;
  can_delete: boolean;
  entry_meta: {
    value: number;
    time: number;
    energy: null;
    network: null;
    nft: null;
    trade: boolean;
  };
  hash: string;
  entry_groups: any[];
  created_at: number;
  updated_at: number;
  slug: string;
  preview_small: string | null;
  preview_large: string | null;
  convert_video: null;
  key: string;
  service: string;
  size: number;
  mime: string;
  extension: string;
  gateway?: string;
  is_clientside_encrypted?: boolean;
  is_on_storage_provider?: boolean;
}
