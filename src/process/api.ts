import * as forge from 'node-forge';
// @ts-ignore
const nodeForge = forge.default !== undefined ? forge.default : forge;

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { DownloadOTT, GetEncryptedFileDetailsEffect } from './types.js';
import { getUserRSAKeys } from '../getUserRSAKeys/index.js';

export class Api {
  private instance: AxiosInstance;
  private url: string;

  constructor(axiosInstance: AxiosInstance, url: string) {
    this.instance = axiosInstance;
    this.url = url;
  }

  async getFileCids({ slug }: { slug: string }) {
    try {
      const response: any = await this.instance.get(
        `${this.url}/files/file/cid/${slug}/interim`
      );
      return response.data;
    } catch (e) {
      return [];
    }
  }

  getDownloadOTT = (body: { slug: string }[]): Promise<DownloadOTT> => {
    return this.instance.post(`${this.url}/download/generate/token`, body);
  };

  getEncryptedFileDetailsEffect = (
    slug: string
  ): Promise<AxiosResponse<GetEncryptedFileDetailsEffect>> => {
    return this.instance.get(`${this.url}/keys/get-encrypted-file-details?slug=${slug}`);
  };

  async getEncryptedFileKey(slug: string, userPublicAddress: string) {
    const {
      data: { data: encryptedData, count },
    } = await this.getEncryptedFileDetailsEffect(slug);

    if (count) {
      const userKey = encryptedData.find(
        (el) =>
          el.user_public_address.public_address.toLowerCase() ===
          userPublicAddress?.toLowerCase()
      );
      return userKey?.encrypted_key;
    } else {
      return null;
    }
  }

  async getUnEncryptedFileKey(slug: string) {
    const { data } = await this.instance.get<{ encryption_key?: string }>(
      `${this.url}/keys/get_unencrypted_key?slug=${slug}`
    );
    return data?.encryption_key;
  }
}

export const getDecryptedKey = async ({
  key,
  provider,
  publicAddress,
  keys,
}: {
  key: string;
  publicAddress: string;
  provider: any;
  keys?: { privateKeyPem: string };
}) => {
  const signer = provider.getSigner(publicAddress);
  console.log({ signer, keys });
  let privateKeyFromPem = null;
  if (keys?.privateKeyPem) {
    privateKeyFromPem = nodeForge.pki.privateKeyFromPem(keys.privateKeyPem);
  } else {
    const keypair = await getUserRSAKeys({ signer });
    privateKeyFromPem = keypair.privateKey;
  }

  const bytesKey = nodeForge.util.hexToBytes(key);
  console.log({ privateKeyFromPem, bytesKey });
  return privateKeyFromPem.decrypt(bytesKey);
};
