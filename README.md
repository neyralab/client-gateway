### USAGE EXAMPLE

## Example of 'callback' & 'handlers' parameters 

The 'callback' and 'handlers' parameters should always go together. Also, you cannot accept 'type' parameter of 'callback' function if it doesn't exist in 'handlers'.


```javascript
export const encodeFileData = {
  callbacks: {
    onStart: encryptExistingFileCallback,
    onSuccess: updateFilePropertyCallback,
    onError: catchErrorCallback,
    onProgress: updateProgressCallback,
  },
  handlers: ['onStart', 'onSuccess', 'onError', 'onProgress'],
};

const { handlers, callbacks } = encodeFileData; // use 'handlers' as parameter

const callback = ({ type, params }) => { // use 'callback' as parameter
  if (handlers.includes(type)) {
    callbacks[type]({ ...params, dispatch });
  } else {
    console.error(`Handler "${type}" isn't provided`);
  }
};
```

1. onStart - used to indicate that action (uploading/encoding/downloading) is started;
2. onSuccess - used at the end of execution if no errors appeared and function completed successfully;
3. onError - used to indicate that some error is happened;
4. onProgress - used to show progress updating after each successful iteration;

### Download file
```javascript
import { downloadFile } from 'gdgateway-client/lib/es5';

const blob = await downloadFile({
    file, 
    oneTimeToken, 
    signal, 
    endpoint, 
    isEncrypted, 
    key, 
    callback,
    handlers
})
```
1. Inside browser returns a file blob to be downloaded, else returns stream

Accepts:  
1. currentFile - file to be downloaded,
2. oneTimeToken - token from /generate/token request
3. signal - AbortController for downloading cancellation
4. endpoint - endpoint from /generate/token request
5. isEncrypted - boolean flag
6. key - a key got from getEncryptedFileKey function and used for file decryption or null is file is unencrypted
7. callback - callbacks that are responsible for UI updating; accepts 'type' and 'params' parameters;
8. handlers - an array with all possible handlers of callback function (should include 'type' param of callback function);

### Upload unencrypted file
```javascript
import { uploadFile } from 'gdgateway-client/lib/es5';

// How to create custom file object using node
class CustomFile {
  constructor(size, stream, filename, mimeType, fileFolderId) {
    this.stream = () => stream;
    this.name = filename;
    this.type = mimeType;
    this.folderId = fileFolderId;
    this.size = size;
    this.upload_id = `${filename}_${size}_${fileFolderId}`;
  }
}

  const filePath = "./src/file-from-node.png" // path to your file
  const filename = "file-from-node.png"; // name-of-your-file.[extension]
  const mimeType = "image/png"; // mime of your file
  const fileFolderId = "";
  const { size } = await fs.promises.stat(filePath);

  const stream = fs.createReadStream(filePath);

  const customFile = new CustomFile(
    size,
    stream,
    filename,
    mimeType,
    fileFolderId
  );

await uploadFile({
  file: customFile,
  oneTimeToken,
  endpoint,
  callback,
  handlers,
}) 
```
1. Returns response from the /chunked/uploadChunk request - the whole information about the file

For now there is issue with using node environment (for files with size > 1mb): despite of the fact that we send all chunks, later we get only half of them (for preview/downloading);

Accepts:
1. file - current file that is supposed to be uploaded; (if node environment and need to send stream - file object should have  stream: () => 'ReadableStream with data')
2. oneTimeToken - token from /generate/token request
3. endpoint - endpoint from /generate/token request
4. callback - callbacks that are responsible for UI updating; accepts 'type' and 'params' parameters;
5. handlers - an array with all possible handlers of callback function (should include 'type' param of callback function);

### Upload encrypted file
```javascript
import { uploadFile } from 'gdgateway-client/lib/es5';

// getOneTimeToken example: request for endpoint and token
const getOneTimeToken = ({ filesize = "", filename = "" }) => {
  const url = '/api/user/generate/token';
  return authRequest.post(url, { filesize, filename });
};

// How to create custom file object using node
class CustomFile {
  constructor(size, stream, filename, mimeType, fileFolderId) {
    this.stream = () => stream;
    this.name = filename;
    this.type = mimeType;
    this.folderId = fileFolderId;
    this.size = size;
    this.upload_id = `${filename}_${size}_${fileFolderId}`;
  }
}

  const filePath = "./src/file-from-node.png" // path to your file
  const filename = "file-from-node.png"; // name-of-your-file.[extension]
  const mimeType = "image/png"; // mime of your file
  const fileFolderId = "";
  const { size } = await fs.promises.stat(filePath);

  const stream = fs.createReadStream(filePath);

  const customFile = new CustomFile(
    size,
    stream,
    filename,
    mimeType,
    fileFolderId
  );

  await uploadFile({
      file: customFile,
      oneTimeToken,
      endpoint,
      callback,
      handlers,
      key,
      crypto
  }) 
```
1. Returns response from the /chunked/uploadChunk request - the whole information about the file

Accepts:
1. file - current file that is supposed to be encrypted and uploaded
2. oneTimeToken - token from /generate/token request
3. endpoint - endpoint from /generate/token request
4. callback - callbacks that are responsible for UI updating; accepts 'type' and 'params' parameters;
5. handlers - an array with all possible handlers of callback function (should include 'type' param of callback function);
6. key - Crypto Key for file encryption;
7. crypto - temporary fix - only for node environment; need it to fix "Key is not of type CryptoKey" issue;

```javascript
  import { Crypto } from "@peculiar/webcrypto";
  const crypto = new Crypto();
```

### Encrypt already uploaded file
```javascript
import { encodeExistingFile } from 'gdgateway-client/lib/es5';

await encodeExistingFile({
    file,
    getOneTimeToken,
    getDownloadOTT,
    callback,
    handlers,
    key
}) 
```
1. Encrypts existing file and updates isClientsideEncrypted property of current file

Accepts:
1. file - current file that is supposed to be encrypted and updated
2. getOneTimeToken - used to get OTT & endpoint for saving thumbnail on /chunked/thumb/{slug} if needed and for swapping chunks on /chunked/swap/{slug};
3. getDownloadOTT - used to get OTT & endpoint for downloading previous unencrypted file;
4. callback - callbacks that are responsible for UI updating; accepts 'type' and 'params' parameters;
5. handlers - all possible handlers of callback functions (should include 'type' of callback function);
6. key - Crypto Key for file encryption;


### Decrypt chunk
```javascript
import * as Base64 from "base64-js";
import { decryptChunk } from 'gdgateway-client/lib/es5';
import { getCrypto } from 'gdgateway-client/lib/es5/utils/getCrypto';

await decryptChunk({chunk, iv, key})
```
1. Return decrypted chunk if correct key is provided

Accepts:
1. chunk - encrypted arraybuffer chunk of the file
2. iv - 
    const crypto = getCrypto();
    const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12));
    const ivBase64 = Base64.fromByteArray(iv) - this is hat should be used as iv; we convert is to base64 and pass it as headers when send encrypted chunk to backend; 
    when we need to decrypt chunk we get same iv from the information about the file (the iv when we encrypt a chunk should be same as we decrypt this chunk).
3. key - 
    When you encrypt a chunk, you should generate and export the key (also we save it(keyBase64) to backend)
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])
    const buffer = await crypto.subtle.exportKey("raw", key);
    const keyBase64 = convertArrayBufferToBase64(buffer); - this is what should be used as key; the key we use to encrypt file should be the same key we use when we decrypt this file;

### Encrypt chunk
```javascript
import * as Base64 from "base64-js";
import { encryptChunk } from 'gdgateway-client/lib/es5';
import { getCrypto } from 'gdgateway-client/lib/es5/utils/getCrypto';

await encryptChunk({chunk, iv, key, crypto})
```
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
4. crypto - temporary fix - only for node environment; need it to fix "Key is not of type CryptoKey" issue;

```javascript
  import { Crypto } from "@peculiar/webcrypto";
  const crypto = new Crypto();
```

### Chunk file
```javascript
import { chunkFile } from 'gdgateway-client/lib/es5';

File should be an object with all needed information 

const arrayBuffer = await file.arrayBuffer();
const chunks = chunkFile({arrayBuffer});
```
The chunkFile function returns an array of file chunks (each chunk is arraybuffer like and has 1mb size; only the last chunk can be smaller).

### Count chunks
```javascript
import { countChunks } from 'gdgateway-client/lib/es5';
```
The 'file' should be an object with all needed information; you should get this information from backend;
```javascript
const { slug } = file;

await countChunks({
    endpoint,
    oneTimeToken,
    slug,
    signal
});
```
1. The countChunk function returns the {count: 3, end: 4819} - 'count' is quantity of chunks and 'end' is size of the last chunk.

Accepts:
1. endpoint - endpoint from /generate/token request
2. oneTimeToken - token from /generate/token request
3. slug - slug we can get from the full information about the file
4. signal - AbortController for request cancellation

### Download chunk
```javascript
import { downloadChunk } from 'gdgateway-client/lib/es5';

await downloadChunk = async ({
  index,
  sha3_hash,
  oneTimeToken,
  signal,
  endpoint,
  file,
  startTime,
  totalProgress,
  callback,
  handlers,
})
```
1. The downloadChunk function returns arraybuffer chunk.

Accepts:
1. index - index of chunk to be downloaded; quantity of all chunks we get from countChunks function
2. sha3_hash - should be null if file is unencrypted; if file is encrypted we get sha3_hash from full information about the file (file.entry_clientside_key.sha3_hash)
3. oneTimeToken - token from /generate/token request
4. signal - AbortController for request cancellation
5. endpoint - endpoint from /generate/token request
6. file - current file that is supposed to be uploaded
7. startTime - Date.now(), required to calculate how much time the file upload takes
8. totalProgress - used to update and calculate progress;
9. callback - callbacks that are responsible for UI updating; accepts 'type' and 'params' parameters;
10. handlers - all possible handlers of callback functions (should include 'type' of callback function);

### Save blob and download url
```javascript
import { saveBlob } from 'gdgateway-client/lib/es5';

saveBlob({ blob, name: file?.name });
```
1. Simulate user click, revoke url and download it. Used together with downloadFile function;

Accepts:
1. blob - blob data we get from downloadFile function (/chunked/downloadChunk api)
2. name - the name of the file to be downloaded

### Send chunk
```javascript
import { sendChunk } from 'gdgateway-client/lib/es5';

await sendChunk({
    chunk,
    index,
    file,
    startTime,
    oneTimeToken,
    endpoint,
    iv, 
    clientsideKeySha3Hash,
    totalProgress,
    callback,
    handlers,
    controller
}) 
```
1. If it is the last chunk returns the whole information about the file, else returns { success: true }

Accepts:
1. chunk - arraybuffer chunk to be send
2. index - current index chunk (get array of chunks from chunkFile function)
3. file - current file that is supposed to be uploaded
4. startTime - Date.now(), required to calculate how much time the file upload takes
5. oneTimeToken - token from /generate/token request
6. endpoint - endpoint from /generate/token request
7. iv - should be null if file is unencrypted; if file is encrypted we get generate iv using crypto object 
    import { getCrypto } from 'gdgateway-client/lib/es5/utils/getCrypto';
    const crypto = getCrypto();
    const iv = crypto.getRandomValues(new Uint8Array(12));
8. clientsideKeySha3Hash - should be null if file is unencrypted; if file is encrypted we get generate clientsideKeySha3Hash using node-forge
    const fileKey = forge.random.getBytesSync(32);
    const md = forge.md.sha512.create();
    md.update(fileKey);
    const clientsideKeySha3Hash = md.digest().toHex();
9. totalProgress - used to update and calculate progress;
10. callback - callbacks that are responsible for UI updating; accepts 'type' and 'params' parameters;
11. handlers - all possible handlers of callback functions (should include 'type' of callback function);
12. controller - AbortController is used to cancel file uploading process;

### Swap chunk (make simple chunk to be encrypted and send it to server)
```javascript
import { swapChunk } from 'gdgateway-client/lib/es5';

await swapChunk({
  file,
  endpoint,
  base64iv,
  clientsideKeySha3Hash,
  index,
  oneTimeToken,
  encryptedChunk,
  arrayBuffer,
  startTime,
  totalProgress,
  callback,
  handlers
}) 
```
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
5. index - current index chunk (get array of chunks from chunkFile function)
6. oneTimeToken - token from /generate/token request
7. encryptedChunk - encrypted arraybuffer chunk to be swapped
8. fileSize - the whole file's size
9. startTime - Date.now(), required to calculate how much time the file upload takes
10. totalProgress - used to update and calculate progress
11. callback - callbacks that are responsible for UI updating; accepts 'type' and 'params' parameters;
12. handlers - all possible handlers of callback functions (should include 'type' of callback function);

### Get user's RSA keys
```javascript
import { getUserRSAKeys } from 'gdgateway-client/lib/es5';

await getUserRSAKeys({signer});
```
1. Returns generated key pair using node-forge
```javascript
Example of 'signer':

import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
```
### Convert public key to pem

1. Returns public key in pem format using node-forge
```javascript
const keys = await getUserRSAKeys(signer);
const public_key = publicKeyToPem({publicKey: keys.publicKey});
```
Accepts:
1. publicKey - generated public key using getUserRSAKeys function


## How to generate and save thumbnails from node

```javascript
  import { getThumbnailImage, getThumbnailVideo } from 'gdgateway-client/lib/es5';

  // ..upload file and get response (you need file's slug from the response)

  // NODE EXAMPLE
  const filename = "./src/video.mp4"; // (30 chunks) - video
  const mimeType = "video/mp4";

  const folderId = "";

  const { size } = await fs.promises.stat(filename);

  const file = new LocalFileStream(size, filename, mimeType, folderId, getOneTimeToken, slug);

  const quality = 3; // 1 to 10 number where 1 is 10% quality and 10 is 100%;

  if (file.type.startsWith("image")) {
    await getThumbnailImage({ path: filename, file, quality: 3 });
  } else if (file.type.startsWith("video")) {
    const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
    const ffmpeg = require("fluent-ffmpeg");

    ffmpeg.setFfmpegPath(ffmpegPath);

    const currentPath = process.cwd();
    const ffmpegCommand = ffmpeg(`${currentPath}/${filename}`);

    await getThumbnailVideo({
        file,
        path: filename,
        ffmpegCommand,
        quality: 3,
        getOneTimeToken,
        slug,
    });
  }

  // BROWSER EXAMPLE
  const file = {...} // file object created by browser
  const quality = 3; // 1 to 10 number where 1 is 10% quality and 10 is 100%;

  if (file.type.startsWith('image')) {
    await getThumbnailImage({ file, quality, getOneTimeToken, slug });
  } else if (file.type.startsWith('video')) {
    await getThumbnailVideo({ file, quality, getOneTimeToken, slug });
  }
```