// import * as fs from "fs";
import * as path from "path";

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
    fileFolderId: string,
    uploadId: string
  ) {
    this.name = filename;
    this.type = mimeType;
    this.folderId = fileFolderId;
    this.size = size;
    this.uploadId = uploadId;
  }
}

// export class LocalFileStream extends LocalFile {
//   public stream: () => fs.ReadStream;

//   constructor(
//     size: number,
//     filename: string,
//     mimeType: string,
//     fileFolderId: string,
//     uploadId: string
//   ) {
//     super(size, filename, mimeType, fileFolderId, uploadId);
//     this.stream = () => fs.createReadStream(filename);
//     this.name = path.basename(filename);
//   }
// }

export class LocalFileBuffer extends LocalFile {
  public arrayBuffer?: () => Promise<ArrayBuffer>;
  public stream: () => ReadableStream<Uint8Array>;

  constructor(
    size: number,
    filename: string,
    mimeType: string,
    fileFolderId: string,
    uploadId: string,
    arrayBuffer: () => Promise<ArrayBuffer>,
    streamFunc: () => ReadableStream<Uint8Array>
  ) {
    super(size, filename, mimeType, fileFolderId, uploadId);
    this.arrayBuffer = arrayBuffer;
    this.stream = streamFunc;
  }
}

export class LocalFileReactNativeStream extends LocalFile {
  public chunks: ArrayBuffer[] | string[];
  public convertedExtension?: string;
  public convertedMime?: string;
  public convertedSize?: number;

  constructor(
    size: number,
    filename: string,
    mimeType: string,
    fileFolderId: string,
    uploadId: string,
    chunks: ArrayBuffer[] | string[],
    convertedExtension?: string,
    convertedMime?: string,
    convertedSize?: number
  ) {
    super(size, filename, mimeType, fileFolderId, uploadId);
    this.chunks = chunks;
    this.convertedExtension = convertedExtension;
    this.convertedMime = convertedMime;
    this.convertedSize = convertedSize;
  }
}
