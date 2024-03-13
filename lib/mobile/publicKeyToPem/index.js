import * as forge from "node-forge";
// @ts-ignore
const nodeForge = forge.default !== undefined ? forge.default : forge;
export const publicKeyToPem = ({ publicKey }) => {
    try {
        return nodeForge.pki.publicKeyToPem(publicKey);
    }
    catch (error) {
        throw new Error(error);
    }
};
