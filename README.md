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
  oneTimeToken,
  endpoint,
  dispatch,
  updateProgressCallback
) 

1. Returns response from the /chunked/uploadChunk request - the whole information about the file

Accepts:
1. file - current file that is supposed to be uploaded
2. oneTimeToken - token from /generate/token request
3. endpoint - endpoint from /generate/token request
4. dispatch - redux dispatch required for UI updates
5. updateProgressCallback - redux actions for updating file uploading progress (percent and time in seconds)

### Upload encrypted file

import { WebCrypto } from 'gdgateway-client/lib/es5';

const crypter = new WebCrypto();

await crypter.encodeFile(
    file,
    oneTimeToken,
    dispatch,
    endpoint,
    getKeysByWorkspace,
    updateProgressCallback,
    saveEncryptedFileKeys,
    getOneTimeToken
) 

1. Returns response from the /chunked/uploadChunk request - the whole information about the file

Accepts:
1. file - current file that is supposed to be encrypted and uploaded
2. oneTimeToken - token from /generate/token request
3. dispatch - redux dispatch required for UI updates
4. endpoint - endpoint from /generate/token request
5. getKeysByWorkspace - callback function that gets user's public keys to be saved later with encrypted file key
6. updateProgressCallback - redux actions for updating file uploading progress (percent and time in seconds)
7. saveEncryptedFileKeys - callback function that saves user's public keys with encrypted file key
8. getOneTimeToken - used to get OTT & endpoint for saving thumbnail on /chunked/thumb/{slug} if needed

### Encrypt already uploaded file

import { WebCrypto } from 'gdgateway-client/lib/es5';

const crypter = new WebCrypto();

await crypter.encodeExistingFile(
    file,
    dispatch,
    getFileContent,
    encryptExistingFileCallback,
    catchErrorCallback,
    updateFilePropertyCallback,
    getImagePreviewEffect,
    getKeysByWorkspace,
    updateProgressCallback,
    saveEncryptedFileKeys,
    getOneTimeToken
) 

1. Encrypts existing file and updates isClientsideEncrypted property of current file

Accepts:
1. file - current file that is supposed to be encrypted and updated
2. dispatch - redux dispatch required for UI updates
3. getFileContent - callback function that returns current file's content that is than chunked, encrypted and swapped
4. encryptExistingFileCallback - first dispatch callback that update the following information when swapping is started - 
    handleEncryptFileError(undefined)
    uploadActions.uploadFile({ ...file, size: arrayBuffer.byteLength })
    encryptExistingFile(true)
5. catchErrorCallback - second dispatch callback that update the following information if any error occurs- 
    remove progress from localStorage
    handleEncryptFileError(slug)
    encryptExistingFile(undefined)
6. updateFilePropertyCallback - updates file's 'isClientsideEncrypted' property to true
7. getImagePreviewEffect - callback function that return current file thumbnail (image/video) to be generated on frontend and saved on /chunked/thumb/{slug}
8. getKeysByWorkspace - callback function that gets user's public keys to be saved later with encrypted file key
9. updateProgressCallback - redux actions for updating file uploading progress (percent and time in seconds)
10. saveEncryptedFileKeys - callback function that saves user's public keys with encrypted file key
11. getOneTimeToken - used to get OTT & endpoint for saving thumbnail on /chunked/thumb/{slug} if needed and for swapping chunks on /chunked/swap/{slug};

### Decrypt chunk

import * as Base64 from "base64-js";
import { decryptChunk } from 'gdgateway-client/lib/es5';
import { getCrypto } from 'gdgateway-client/lib/es5/utils/getCrypto';

await decryptChunk(chunk, iv, activationKey)

1. Return decrypted chunk if correct activationKey is provided

Accepts:
1. chunk - encrypted arraybuffer chunk of the file
2. iv - 
    const crypto = getCrypto();
    const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12));
    const ivBase64 = Base64.fromByteArray(iv) - this is hat should be used as iv; we convert is to base64 and pass it as headers when send encrypted chunk to backend; 
    when we need to decrypt chunk we get same iv from the information about the file (the iv when we encrypt a chunk should be same as we decrypt this chunk).
3. activationKey - 
    When you encrypt a chunk, you should generate and export the key (also we save it(keyBase64) to backend)
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])
    const buffer = await crypto.subtle.exportKey("raw", key);
    const keyBase64 = convertArrayBufferToBase64(buffer); - this is what should be used as activationKey; the key we use to encrypt file should be the same key we use when we decrypt this file;

### Encrypt chunk

import * as Base64 from "base64-js";
import { encryptChunk } from 'gdgateway-client/lib/es5';
import { getCrypto } from 'gdgateway-client/lib/es5/utils/getCrypto';

await encryptChunk(chunk, iv, key)

1. Return encrypted chunk if correct parameters are provided

Accepts:
1. chunk - simple arraybuffer chunk of the file
2. iv - 
    const crypto = getCrypto();
    const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12)); - this is what should be used as iv; the same iv should be used when you will need to decrypt this chunk later;
3. key - 
    When you encrypt a chunk, you should generate and export the key (also we save it(keyBase64) to backend)
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]) - generated key should be used as key parameter
    const buffer = await crypto.subtle.exportKey("raw", key);
    const keyBase64 = convertArrayBufferToBase64(buffer); - this is what should be used as activationKey for future decrypting;   

### Chunk file

import { chunkFile } from 'gdgateway-client/lib/es5';

File should be an object with all needed information 

const arrayBuffer = await file.arrayBuffer();
const chunks = chunkFile(arrayBuffer);

The chunkFile function returns an array of file chunks (each chunk is arraybuffer like and has 1mb size; only the last chunk can be smaller).

### Count chunks

import { countChunks } from 'gdgateway-client/lib/es5';

The 'file' should be an object with all needed information; you should get this information from backend;

const { slug } = file;

await countChunks(
    endpoint,
    oneTimeToken,
    slug,
    signal
);

1. The countChunk function returns the {count: 3, end: 4819} - 'count' is quantity of chunks and 'end' is size of the last chunk.

Accepts:
1. endpoint - endpoint from /generate/token request
2. oneTimeToken - token from /generate/token request
3. slug - slug we can get from the full information about the file
4. signal - AbortController for request cancellation

### Download chunk

import { downloadChunk } from 'gdgateway-client/lib/es5';

await downloadChunk = async (
  index,
  sha3_hash,
  slug,
  oneTimeToken,
  signal,
  endpoint,
  encrypted
)

1. The downloadChunk function returns arraybuffer chunk (browser) or stream (node).

Accepts:
1. index - index of chunk to be downloaded; quantity of all chunks we get from countChunks function
2. sha3_hash - should be null if file is unencrypted; if file is encrypted we get sha3_hash from full information about the file (file.entry_clientside_key.sha3_hash)
3. slug - slug we can get from the full information about the file (file.slug)
4. oneTimeToken - token from /generate/token request
5. signal - AbortController for request cancellation
6. endpoint - endpoint from /generate/token request
7. encrypted - should be true if encrypted and false if unencrypted;


### Save blob and download url

import { saveBlob } from 'gdgateway-client/lib/es5';

saveBlob({ blob, name: file?.name, mime: file?.mime });

1. Simulate user click, revoke url and download it. Used together with downloadFile function;

Accepts:
1. blob - blob data we get from downloadFile function (/chunked/downloadChunk api)
2. file - full information about the file we are trying to download

# Send chunk

import { sendChunk } from 'gdgateway-client/lib/es5';

await sendChunk(
    chunk,
    currentIndex,
    chunkLength,
    file,
    startTime,
    oneTimeToken,
    endpoint,
    iv, 
    clientsideKeySha3Hash,
    dispatch,
    totalProgress,
    updateProgressCallback
) 

1. If it is the last chunk returns the whole information about the file, else returns { success: true }

Accepts:
1. chunk - arraybuffer chunk to be send
2. currentIndex - current index chunk (get array of chunks from chunkFile function)
3. chunkLength - the length of arraybuffer chunk (chunk.byteLength)
4. file - current file that is supposed to be uploaded
5. startTime - Date.now(), required to calculate how much time the file upload takes
6. oneTimeToken - token from /generate/token request
7. endpoint - endpoint from /generate/token request
8. iv - should be null if file is unencrypted; if file is encrypted we get generate iv using crypto object 
    import { getCrypto } from 'gdgateway-client/lib/es5/utils/getCrypto';
    const crypto = getCrypto();
    const iv = crypto.getRandomValues(new Uint8Array(12));
9. clientsideKeySha3Hash - should be null if file is unencrypted; if file is encrypted we get generate clientsideKeySha3Hash using node-forge
    const fileKey = forge.random.getBytesSync(32);
    const md = forge.md.sha512.create();
    md.update(fileKey);
    const clientsideKeySha3Hash = md.digest().toHex();
10. dispatch - redux dispatch required for UI updates
11. totalProgress - used to update and calculate progress
12. updateProgressCallback - redux actions for updating file uploading progress (percent and time in seconds)

# Swap chunk (make simple chunk to be encrypted and send it to server)

import { swapChunk } from 'gdgateway-client/lib/es5';

await swapChunk(
  file,
  endpoint,
  base64iv,
  clientsideKeySha3Hash,
  currentIndex,
  chunksLength,
  oneTimeToken,
  encryptedChunk,
  arrayBuffer,
  startTime,
  dispatch,
  totalProgress,
  updateProgressCallback,
) 

1. If it is the last chunk returns the whole information about the file, else returns { success: true }

Accepts:
1. file - current file that is supposed to be swapped
2. endpoint - endpoint from /generate/token request
3. base64iv -  get generated iv using crypto object and convert it to base64
    import { getCrypto } from 'gdgateway-client/lib/es5/utils/getCrypto';
    const crypto = getCrypto();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const base64iv = Base64.fromByteArray(this.iv);
4. clientsideKeySha3Hash - should be null if file is unencrypted; if file is encrypted we get generate clientsideKeySha3Hash using node-forge
    const fileKey = forge.random.getBytesSync(32);
    const md = forge.md.sha512.create();
    md.update(fileKey);
    const clientsideKeySha3Hash = md.digest().toHex();
5. currentIndex - current index chunk (get array of chunks from chunkFile function)
6. chunkLength - the length of arraybuffer chunk (chunk.byteLength)
7. oneTimeToken - token from /generate/token request
8. encryptedChunk - encrypted arraybuffer chunk to be swapped
9. arrayBuffer - the whole arraybuffer of the file that is supposed to be swapped
10. startTime - Date.now(), required to calculate how much time the file upload takes
11. dispatch - redux dispatch required for UI updates
12. totalProgress - used to update and calculate progress
13. updateProgressCallback - redux actions for updating file uploading progress (percent and time in seconds)

### Get user's RSA keys

import { getUserRSAKeys } from 'gdgateway-client/lib/es5';

await getUserRSAKeys(signer);

1. Returns generated key pair using node-forge

Example of 'signer':

import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

### Convert public key to pem

1. Returns public key in pem format using node-forge

const keys = await getUserRSAKeys(signer);
const public_key = publicKeyToPem(keys.publicKey);

Accepts:
1. publicKey - generated public key using getUserRSAKeys function