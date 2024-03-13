import * as fs from "fs";
import * as path from "path";
class LocalFile {
    constructor(size, filename, mimeType, fileFolderId, uploadId) {
        this.name = filename;
        this.type = mimeType;
        this.folderId = fileFolderId;
        this.size = size;
        this.uploadId = uploadId;
    }
}
export class LocalFileStream extends LocalFile {
    constructor(size, filename, mimeType, fileFolderId, uploadId) {
        super(size, filename, mimeType, fileFolderId, uploadId);
        this.stream = () => fs.createReadStream(filename);
        this.name = path.basename(filename);
    }
}
export class LocalFileBuffer extends LocalFile {
    constructor(size, filename, mimeType, fileFolderId, uploadId, arrayBuffer) {
        super(size, filename, mimeType, fileFolderId, uploadId);
        this.arrayBuffer = arrayBuffer;
    }
}
export class LocalFileReactNativeStream extends LocalFile {
    constructor(size, filename, mimeType, fileFolderId, uploadId, chunks, convertedExtension, convertedMime, convertedSize) {
        super(size, filename, mimeType, fileFolderId, uploadId);
        this.chunks = chunks;
        this.convertedExtension = convertedExtension;
        this.convertedMime = convertedMime;
        this.convertedSize = convertedSize;
    }
}
