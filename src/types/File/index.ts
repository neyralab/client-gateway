import { CancelTokenSource } from "axios";
import * as fs from "fs";

export class LocalFile {
  public name: string;
  public type: string;
  public folderId: string;
  public size: number;
  public uploadId: string;
  public source?: CancelTokenSource;

  constructor(
    size: number,
    filename: string,
    mimeType: string,
    fileFolderId: string,
    source?: CancelTokenSource
  ) {
    this.name = filename;
    this.type = mimeType;
    this.folderId = fileFolderId;
    this.size = size;
    this.uploadId = `${filename}_${size}_${fileFolderId}`;
    this.source = source;
  }
}

export class LocalFileStream extends LocalFile {
  public stream: () => fs.ReadStream;
  public isStream: boolean;

  constructor(
    size: number,
    filename: string,
    mimeType: string,
    fileFolderId: string,
    source?: CancelTokenSource
  ) {
    super(size, filename, mimeType, fileFolderId, source);
    this.isStream = true;
    this.stream = () => fs.createReadStream(filename);
  }
}

export class LocalFileBuffer extends LocalFile {
  public arrayBuffer?: () => Promise<ArrayBuffer>;

  constructor(
    size: number,
    filename: string,
    mimeType: string,
    fileFolderId: string,
    arrayBuffer: () => Promise<ArrayBuffer>,
    source?: CancelTokenSource
  ) {
    super(size, filename, mimeType, fileFolderId, source);
    this.arrayBuffer = arrayBuffer;
  }
}
