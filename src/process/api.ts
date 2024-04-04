import * as forge from 'node-forge';
// @ts-ignore
const nodeForge = forge.default !== undefined ? forge.default : forge;

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { DownloadOTT, GetEncryptedFileDetailsEffect } from './types.js';
import { getUserRSAKeys } from '../getUserRSAKeys/index.js';

class Api {
  private instance: AxiosInstance;
  constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
    });
  }

  async getFileCids({ slug }: { slug: string }) {
    try {
      const response: any = await this.instance.get(
        `/files/file/cid/${slug}/interim`
      );
      return response.data;
    } catch (e) {
      return [];
    }
  }

  getDownloadOTT = (
    body: { slug: string }[],
    xToken: string
  ): Promise<DownloadOTT> => {
    return this.instance.post(`/download/generate/token`, body, {
      headers: {
        'x-token': xToken,
      },
    });
  };

  getEncryptedFileDetailsEffect = (
    slug: string,
    xToken: string
  ): Promise<AxiosResponse<GetEncryptedFileDetailsEffect>> => {
    return this.instance.get(`/keys/get-encrypted-file-details?slug=${slug}`, {
      headers: {
        'x-token': xToken,
      },
    });
  };
}

export const api = new Api('https://api.dev.ghostdrive.com/api');

export const getEncryptedFileKey = async (
  slug: string,
  xToken: string,
  provider: any
) => {
  const {
    data: { data: encryptedData, count },
  } = await api.getEncryptedFileDetailsEffect(slug, xToken);

  if (count) {
    const [userPublicAddress] = await provider?.listAccounts();
    const userKey = encryptedData.find(
      (el) =>
        el.user_public_address.public_address.toLowerCase() ===
        userPublicAddress?.toLowerCase()
    );
    return userKey?.encrypted_key;
  } else return null;
};

export const getDecryptedKey = async ({
  key,
  provider,
}: {
  key: string;
  provider: any;
}) => {
  const signer = provider.getSigner();
  const keypair = await getUserRSAKeys({ signer });
  const bytesKey = nodeForge.util.hexToBytes(key);
  return keypair.privateKey.decrypt(bytesKey);
};
