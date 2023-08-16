## USAGE EXAMPLE

### Download encrypted file

import { WebCrypto } from 'gdgateway-client/lib/es5';

const crypter = new WebCrypto();

const blob = await crypter.downloadFile(
    file,
    oneTimeToken,
    activationKey,
    signal,
    endpoint
);

1. Returns a file blob to be downloaded

Accepts:  
1. currentFile - file to be downloaded,
2. oneTimeToken - token from /generate/token request
3. activationKey - a key got from getEncryptedFileKey function and used for file decryption
4. signal - AbortController for downloading cancellation
5. endpoint - endpoint from /generate/token request
### Download unencrypted file

import { downloadFile } from 'gdgateway-client/lib/es5';

const blob = await downloadFile(file, oneTimeToken, signal, endpoint);

1. Returns a file blob to be downloaded

Accepts:  
1. currentFile - file to be downloaded,
2. oneTimeToken - token from /generate/token request
3. signal - AbortController for downloading cancellation
4. endpoint - endpoint from /generate/token request

### Upload unencrypted file

import { uploadFile } from 'gdgateway-client/lib/es5';

await uploadFile(
  file,
  startTime,
  oneTimeToken,
  endpoint,
  dispatch,
  updateProgressCallback,
  getProgressFromLSCallback,
  setProgressToLSCallback,
  clearProgressCallback
) 

1. Returns response from the /chunked/uploadChunk request - the whole information about the file

Accepts:
1. file - current file that is supposed to be uploaded
2. startTime - Date.now(), required to calculate how much time the file upload takes
3. oneTimeToken - token from /generate/token request
4. endpoint - endpoint from /generate/token request
5. dispatch - redux dispatch required for UI updates
6. updateProgressCallback - redux actions for updating file uploading progress (percent and time in seconds)
7. getProgressFromLSCallback - util that gets current progress percent from localStorage
8. setProgressToLSCallback - util that sets current progress percent to localStorage
9. clearProgressCallback - util that clears progress from localStorage in case file is uploaded successfully or failed to upload
### Upload encrypted file

import { WebCrypto } from 'gdgateway-client/lib/es5';

const crypter = new WebCrypto();

await crypter.encodeFile(
    file,
    oneTimeToken,
    dispatch,
    startTime,
    endpoint,
    getKeysByWorkspace,
    updateProgressCallback,
    getProgressFromLSCallback,
    setProgressToLSCallback,
    saveEncryptedFileKeys,
    getOneTimeToken
) 

1. Returns response from the /chunked/uploadChunk request - the whole information about the file

Accepts:
1. file - current file that is supposed to be encrypted and uploaded
2. oneTimeToken - token from /generate/token request
3. dispatch - redux dispatch required for UI updates
4. startTime - Date.now(), required to calculate how much time the file upload takes
5. endpoint - endpoint from /generate/token request
6. getKeysByWorkspace - callback function that gets user's public keys to be saved later with encrypted file key
7. updateProgressCallback - redux actions for updating file uploading progress (percent and time in seconds)
8. getProgressFromLSCallback - util that gets current progress percent from localStorage
9. setProgressToLSCallback - util that sets current progress percent to localStorage
10. saveEncryptedFileKeys - callback function that saves user's public keys with encrypted file key
11. getOneTimeToken - used to get OTT & endpoint for saving thumbnail on /chunked/thumb/{slug} if needed
### Encrypt already uploaded file

import { WebCrypto } from 'gdgateway-client/lib/es5';

const crypter = new WebCrypto();

await crypter.encodeExistingFile(
    file,
    dispatch,
    getFileContent,
    firstEncodeExistingCallback,
    secondEncodeExistingCallback,
    thirdEncodeExistingCallback,
    getImagePreviewEffect,
    getKeysByWorkspace,
    updateProgressCallback,
    getProgressFromLSCallback,
    setProgressToLSCallback,
    saveEncryptedFileKeys,
    getOneTimeToken
) 

1. Encrypts existing file and updates isClientsideEncrypted property of current file

Accepts:
1. file - current file that is supposed to be encrypted and updated
2. dispatch - redux dispatch required for UI updates
3. getFileContent - callback function that returns current file's content that is than chunked, encrypted and swapped
4. firstEncodeExistingCallback - first dispatch callback that update the following information when swapping is started - 
    handleEncryptFileError(undefined)
    uploadActions.uploadFile({ ...file, size: arrayBuffer.byteLength })
    encryptExistingFile(true)
5. secondEncodeExistingCallback - second dispatch callback that update the following information if any error occurs- 
    remove progress from localStorage
    handleEncryptFileError(slug)
    encryptExistingFile(undefined)
6. thirdEncodeExistingCallback - updates file's 'isClientsideEncrypted' property to true
7. getImagePreviewEffect - callback function that return current file thumbnail (image/video) to be generated on frontend and saved on /chunked/thumb/{slug}
6. getKeysByWorkspace - callback function that gets user's public keys to be saved later with encrypted file key
7. updateProgressCallback - redux actions for updating file uploading progress (percent and time in seconds)
8. getProgressFromLSCallback - util that gets current progress percent from localStorage
9. setProgressToLSCallback - util that sets current progress percent to localStorage
10. saveEncryptedFileKeys - callback function that saves user's public keys with encrypted file key
11. getOneTimeToken - used to get OTT & endpoint for saving thumbnail on /chunked/thumb/{slug} if needed and for swapping chunks on /chunked/swap/{slug};
