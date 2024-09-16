import { jwtDecode } from 'jwt-decode';
import { IUploadFile } from '../types/index.js';

interface DecodedToken {
  action: number;
  action_label: string;
  created_at: number;
  expired_at: number;
  filename: string;
  filesize: number;
  gateway: number;
  is_public: boolean | null;
  slug: string;
  token: string;
  user: number;
  workspace: number;
}

export const createFileInfoFromToken = (
  token: string,
  file: IUploadFile['file']
) => {
  const decoded: DecodedToken = jwtDecode(token);

  const mime = file.type;
  const extension = getExtensionFromFileName(file.name);

  return { ...decoded, mime, extension };
};

const getExtensionFromFileName = (fileName) => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop() : null;
};
