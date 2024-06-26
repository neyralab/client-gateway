export class UUIDBase64Converter {
    private prefix: string;
    private baseUrl: string;

    constructor(prefix: string, baseUrl: string) {
        this.prefix = prefix;
        this.baseUrl = baseUrl;
    }

    uuidToBase64(uuid: string): string {
        const hexString = uuid.replace(/-/g, '').slice(0, 32);
        const byteArray = [];
        for (let i = 0; i < hexString.length; i += 2) {
            byteArray.push(parseInt(hexString.substr(i, 2), 16));
        }
        return Buffer.from(byteArray).toString('base64');
    }

    base64ToUuid(base64: string): string {
        const byteArray = Buffer.from(base64, 'base64');
        const hexArray = Array.from(byteArray).map(byte => ('0' + byte.toString(16)).slice(-2));
        const uuid = [
            hexArray.slice(0, 4).join(''),
            hexArray.slice(4, 6).join(''),
            hexArray.slice(6, 8).join(''),
            hexArray.slice(8, 10).join(''),
            hexArray.slice(10, 16).join('')
        ].join('-');
        return uuid;
    }

    checkAndRedirect(): void {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith(this.prefix)) {
            const base64String = currentPath.slice(this.prefix.length);
            const uuid = this.base64ToUuid(base64String);
            const newUrl = `${this.baseUrl}/file/${uuid}`;
            window.location.replace(newUrl);
        }
    }
}
