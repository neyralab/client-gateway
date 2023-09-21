import * as fs from "fs";

class LocalFile {
  public name: string;
  public type: string;
  public folderId: string;
  public size: number;
  public uploadId: string;

  constructor(
    size: number,
    filename: string,
    mimeType: string,
    fileFolderId: string
  ) {
    this.name = filename;
    this.type = mimeType;
    this.folderId = fileFolderId;
    this.size = size;
    this.uploadId = `${filename}_${size}_${fileFolderId}`;
  }
}

export class LocalFileStream extends LocalFile {
  public stream: () => fs.ReadStream;

  constructor(
    size: number,
    filename: string,
    mimeType: string,
    fileFolderId: string
  ) {
    super(size, filename, mimeType, fileFolderId);
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
    arrayBuffer: () => Promise<ArrayBuffer>
  ) {
    super(size, filename, mimeType, fileFolderId);
    this.arrayBuffer = arrayBuffer;
  }
}
