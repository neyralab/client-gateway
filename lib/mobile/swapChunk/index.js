import { __awaiter } from "tslib";
import axios from 'axios';
export const swapChunk = ({ file, gateway, base64iv, clientsideKeySha3Hash, index, oneTimeToken, encryptedChunk, fileSize, startTime, totalProgress, callback, handlers, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const chunksLength = Math.ceil(file.size / gateway.upload_chunk_size);
    const url = `${gateway.url}/chunked/swap/${file.slug}`;
    const inst = axios.create({
        headers: {
            'x-iv': base64iv,
            'x-clientsideKeySha3Hash': clientsideKeySha3Hash,
            'x-last': `${index}/${chunksLength}`,
            'Content-Type': 'application/octet-stream',
            'one-time-token': oneTimeToken,
        },
        onUploadProgress: (event) => {
            if (event.loaded === encryptedChunk.byteLength) {
                const prevProgress = totalProgress.number || 0;
                const progress = +prevProgress + event.loaded;
                totalProgress.number = progress;
                const elapsedTime = Date.now() - startTime;
                const remainingBytes = fileSize - progress;
                const bytesPerMillisecond = progress / elapsedTime;
                const remainingTime = remainingBytes / bytesPerMillisecond;
                const timeLeft = Math.abs(Math.ceil(remainingTime / 1000));
                handlers.includes('onProgress') &&
                    callback({
                        type: 'onProgress',
                        params: { id: file.uploadId, progress, timeLeft },
                    });
            }
        },
        cancelToken: (_a = file.source) === null || _a === void 0 ? void 0 : _a.token,
    });
    return yield inst.post(url, encryptedChunk);
});
