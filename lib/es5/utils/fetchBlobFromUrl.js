"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchBlobFromUrl = void 0;
var fetchBlobFromUrl = function (blobUrl) {
    return fetch(blobUrl)
        .then(function (response) { return response.blob(); })
        .catch(function (error) {
        throw new Error(error);
    });
};
exports.fetchBlobFromUrl = fetchBlobFromUrl;
