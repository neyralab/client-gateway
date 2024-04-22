import * as forge from 'node-forge';
// @ts-ignore
const nodeForge = forge.default !== undefined ? forge.default : forge;

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { DownloadOTT, GetEncryptedFileDetailsEffect } from './types.js';
import { getUserRSAKeys } from '../getUserRSAKeys/index.js';

export class Api {
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

  async getEncryptedFileKey(
    slug: string,
    xToken: string,
    userPublicAddress: string
  ) {
    const {
      data: { data: encryptedData, count },
    } = await this.getEncryptedFileDetailsEffect(slug, xToken);

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
