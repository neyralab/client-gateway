import * as forge from 'node-forge';
// @ts-ignore
const nodeForge = forge.default !== undefined ? forge.default : forge;

import axios, { AxiosResponse } from 'axios';
import { DownloadOTT, GetEncryptedFileDetailsEffect } from './types.js';
import { getUserRSAKeys } from '../getUserRSAKeys/index.js';

const backendUrl = 'https://api.dev.ghostdrive.com/api';

export const getFileCids = async ({ slug }: { slug: string }) => {
  try {
    const response: any = await axios.get(
      `${backendUrl}/files/file/cid/${slug}/interim`
    );
    return response.data;
  } catch (e) {
    return [];
  }
};

export const getDownloadOTT = (
  body: { slug: string }[],
  xToken: string
): Promise<DownloadOTT> => {
  const url = `${process.env.REACT_APP_API_PATH}/download/generate/token`;
  return axios.post(url, body, {
    headers: {
      'x-token': xToken,
    },
  });
};

export const getEncryptedFileDetailsEffect = (
  slug: string,
  xToken: string
): Promise<AxiosResponse<GetEncryptedFileDetailsEffect>> => {
  const url = `${backendUrl}/keys/get-encrypted-file-details?slug=${slug}`;
  return axios.get(url, {
    headers: {
      'x-token': xToken,
    },
  });
};

export const getEncryptedFileKey = async (
  slug: string,
  xToken: string,
  provider: any
) => {
  const {
    data: { data: encryptedData, count },
  } = await getEncryptedFileDetailsEffect(slug, xToken);

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
