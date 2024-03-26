import * as forge from 'node-forge';
// @ts-ignore
const nodeForge = forge.default !== undefined ? forge.default : forge;

import axios, {AxiosResponse} from "axios";
import {GetEncryptedFileDetailsEffect} from "./types.js";
import {getUserRSAKeys} from "../getUserRSAKeys/index.js";

export const getFileCids = async ({ slug }: { slug: string }) => {
  try {
    const response: any = await axios.get(
    `https://api.dev.ghostdrive.com/api/files/file/cid/${slug}/interim`
    );
    return response.data;
  } catch (e) {
    return []
  }
};

export const getEncryptedFileDetailsEffect = (
  slug: string,
): Promise<AxiosResponse<GetEncryptedFileDetailsEffect>> => {
  const url = `https://api.dev.ghostdrive.com/api/keys/get-encrypted-file-details?slug=${slug}`;
  return axios.get(url)
};

export const getEncryptedFileKey = async (slug: string, provider: any) => {
  const {
    data: { data: encryptedData, count },
  } = await getEncryptedFileDetailsEffect(slug);

  if (count) {
    const [userPublicAddress] = await provider?.request({
      method: 'eth_requestAccounts',
    });
    const userKey = encryptedData.find(
      (el) => el.user_public_address.public_address === userPublicAddress
    );
    return userKey?.encrypted_key;
  } else return null
};

export const getDecryptedKey = async ({ key, provider }: { key: string, provider: any }) => {
  const signer = provider.getSigner();
  const keypair = await getUserRSAKeys({ signer });
  const bytesKey = nodeForge.util.hexToBytes(key);
  return keypair.privateKey.decrypt(bytesKey);
};
