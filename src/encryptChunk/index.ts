export const encryptChunk = async (chunk: ArrayBuffer, iv: Uint8Array) => {
  console.log('gd-library ---> encryptChunk');
  return await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    window.key,
    chunk
  );
};
