import { __asyncValues, __awaiter } from "tslib";
import * as forge from 'node-forge';
// @ts-ignore
const nodeForge = forge.default !== undefined ? forge.default : forge;
import { sendChunk } from '../sendChunk/index.js';
import { encryptChunk } from '../encryptChunk/index.js';
import { chunkFile } from '../utils/chunkFile.js';
import { getCrypto } from '../utils/getCrypto.js';
import { LocalFileReactNativeStream } from '../types/File/index.js';
const fileControllers = {};
const cancelledFiles = new Set();
const MAX_PROMISES_LENGTH = 4;
const crypto = getCrypto();
export const uploadFile = ({ file, oneTimeToken, gateway, callback, handlers, key, progress, totalSize, startedAt, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e;
    const startTime = startedAt || Date.now();
    const controller = new AbortController();
    let clientsideKeySha3Hash;
    let iv;
    let totalProgress = { number: progress || 0 };
    let currentIndex = 1;
    const fileSize = file instanceof LocalFileReactNativeStream ? file.convertedSize || file.size : file.size;
    const lastChunkIndex = Math.ceil(fileSize / gateway.upload_chunk_size);
    let leftChunks = lastChunkIndex;
    const restMaxPromisesLength = (lastChunkIndex - 2) % MAX_PROMISES_LENGTH;
    const promises = [];
    fileControllers[file.uploadId] = controller;
    if (cancelledFiles.has(file.uploadId)) {
        fileControllers[file.uploadId].abort();
        cancelledFiles.delete(file.uploadId);
    }
    if (key) {
        const fileKey = nodeForge.random.getBytesSync(32); // 32 bytes for AES-256
        const md = nodeForge.md.sha512.create();
        md.update(fileKey);
        clientsideKeySha3Hash = md.digest().toHex();
        iv = crypto.getRandomValues(new Uint8Array(12));
    }
    try {
        for (var _f = true, _g = __asyncValues(chunkFile({
            file,
            uploadChunkSize: gateway.upload_chunk_size,
        })), _h; _h = yield _g.next(), _a = _h.done, !_a; _f = true) {
            _c = _h.value;
            _f = false;
            const chunk = _c;
            const allowedPromisesLength = leftChunks > 4 ? MAX_PROMISES_LENGTH : restMaxPromisesLength;
            let finalChunk = chunk;
            if (key) {
                const chunkArrayBuffer = typeof chunk === 'string' ? Buffer.from(chunk).buffer : chunk;
                finalChunk = yield encryptChunk({
                    chunk: chunkArrayBuffer,
                    iv,
                    key,
                });
            }
            const promise = sendChunk({
                chunk: finalChunk,
                index: currentIndex,
                file,
                startTime,
                oneTimeToken,
                gateway,
                iv,
                clientsideKeySha3Hash,
                totalProgress,
                callback,
                handlers,
                controller,
                totalSize,
            });
            promises.push(promise);
            if (currentIndex === 1 ||
                promises.length === MAX_PROMISES_LENGTH ||
                promises.length === allowedPromisesLength ||
                currentIndex === lastChunkIndex) {
                const results = yield Promise.all(promises);
                leftChunks = leftChunks - promises.length;
                promises.length = 0;
                for (const result of results) {
                    if ((result === null || result === void 0 ? void 0 : result.failed) || ((_e = (_d = result === null || result === void 0 ? void 0 : result.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.slug)) {
                        delete fileControllers[file.uploadId];
                        totalProgress.number = 0;
                        return result;
                    }
                }
            }
            currentIndex++;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_f && !_a && (_b = _g.return)) yield _b.call(_g);
        }
        finally { if (e_1) throw e_1.error; }
    }
});
export const cancelingUpload = (uploadId) => {
    if (fileControllers[uploadId]) {
        fileControllers[uploadId].abort();
    }
    else
        cancelledFiles.add(uploadId);
};
