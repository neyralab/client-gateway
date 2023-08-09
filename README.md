## USAGE EXAMPLE

### Download encrypted file

import { WebCrypto, saveBlob } from 'gdgateaway-client/lib/es5';

const crypter = new WebCrypto();

const blob = await crypter.downloadFile(
    file,
    oneTimeToken,
    activationKey,
    signal,
    endpoint
);
saveBlob({ blob, name: file?.name, mime: file?.mime });

### Download unencrypted file

import { downloadFile, saveBlob } from 'gdgateaway-client/lib/es5';

const blob = await downloadFile(file, oneTimeToken, signal, endpoint);
saveBlob({ blob, name: file?.name, mime: file?.mime });