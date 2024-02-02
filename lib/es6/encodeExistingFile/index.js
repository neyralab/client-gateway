var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import * as forge from 'node-forge';
import * as Base64 from 'base64-js';
import { downloadFile, encryptChunk, swapChunk } from '../index';
import { getCrypto } from '../utils/getCrypto';
import { chunkBuffer } from '../utils/chunkBuffer';
const crypto = getCrypto();
const fileKey = forge.random.getBytesSync(32); // 32 bytes for AES-256
const md = forge.md.sha512.create();
md.update(fileKey);
export const encodeExistingFile = ({ file, oneTimeToken, gateway, downloadToken, downloadEndpoint, callback, handlers, key, }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e;
    const clientsideKeySha3Hash = md.digest().toHex();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const startTime = Date.now();
    const base64iv = Base64.fromByteArray(iv);
    const totalProgress = { number: 0 };
    const controller = new AbortController();
    const { signal } = controller;
    let result;
    let currentIndex = 1;
    const fileBlob = yield downloadFile({
        file,
        oneTimeToken: downloadToken,
        signal,
        endpoint: downloadEndpoint,
        isEncrypted: false,
    });
    const arrayBuffer = yield fileBlob.arrayBuffer();
    handlers.includes('onStart') &&
        callback({
            type: 'onStart',
            params: { file, size: arrayBuffer.byteLength },
        });
    try {
        try {
            for (var _f = true, _g = __asyncValues(chunkBuffer({
                arrayBuffer,
                uploadChunkSize: gateway.upload_chunk_size,
            })), _h; _h = yield _g.next(), _a = _h.done, !_a; _f = true) {
                _c = _h.value;
                _f = false;
                const chunk = _c;
                const encryptedChunk = yield encryptChunk({ chunk, iv, key });
                result = yield swapChunk({
                    file,
                    gateway,
                    base64iv,
                    clientsideKeySha3Hash,
                    index: currentIndex,
                    oneTimeToken,
                    encryptedChunk,
                    fileSize: arrayBuffer.byteLength,
                    startTime,
                    totalProgress,
                    callback,
                    handlers,
                });
                if ((_e = (_d = result === null || result === void 0 ? void 0 : result.data) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.slug) {
                    totalProgress.number = 0;
                    const { data: responseFromIpfs } = result;
                    if (responseFromIpfs) {
                        const isCancelModalOpen = document.body.querySelector('.download__modal__button__cancel');
                        handlers.includes('onSuccess') &&
                            callback({
                                type: 'onSuccess',
                                params: { isCancelModalOpen, response: responseFromIpfs },
                            });
                        return responseFromIpfs;
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
    }
    catch (e) {
        handlers.includes('onError') &&
            callback({ type: 'onError', params: { slug: file.slug } });
        return;
    }
});
