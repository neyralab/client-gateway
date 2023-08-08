export var fetchBlobFromUrl = function (blobUrl) {
    return fetch(blobUrl)
        .then(function (response) { return response.blob(); })
        .catch(function (error) {
        throw new Error(error);
    });
};
