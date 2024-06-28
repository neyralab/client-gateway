export class UUIDBase64Converter {
    private shortenerURL: string;
    private ghostdriveURL: string;

    constructor(shortenerURL: string, ghostdriveURL: string) {
        this.shortenerURL = shortenerURL;
        this.ghostdriveURL = ghostdriveURL;
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
        const currentURL = window.location.href;
        if (currentURL.startsWith(this.shortenerURL)) {
            const base64String = currentURL.slice(this.shortenerURL.length);
            const uuid = this.base64ToUuid(base64String);
            const newUrl = `${this.ghostdriveURL}/f/${uuid}`;
            window.location.replace(newUrl);
        }
    }

    generateShortenerURL(uuid): string {
        const base64String = this.uuidToBase64(uuid);
        return `${this.shortenerURL}${base64String}`;
    }
}
