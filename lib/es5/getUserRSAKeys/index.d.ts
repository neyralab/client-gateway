import * as forge from "node-forge";
export declare const getUserRSAKeys: ({ signer }: {
    signer: any;
}) => Promise<forge.pki.rsa.KeyPair>;
