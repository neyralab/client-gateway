import * as fs from "fs";

export class LocalFile {
  public stream: () => fs.ReadStream;

  public isStream: boolean;
  public name: string;
  public type: string;
  public folderId: string;
  public size: number;
  public uploadId: string;

  constructor(size, stream, filename, mimeType, fileFolderId) {
    this.stream = () => stream;
    this.isStream = true;
    this.name = filename;
    this.type = mimeType;
    this.folderId = fileFolderId;
    this.size = size;
    this.uploadId = `${filename}_${size}_${fileFolderId}`;
  }
}
