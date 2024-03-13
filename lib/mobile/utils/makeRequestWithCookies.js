import { __awaiter } from "tslib";
import axios from "axios";
export const postWithCookies = (url, headers, cookieJar, signal, data = {}) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieString = cookieJar.join("; ");
    const config = {
        method: "POST",
        url,
        headers: Object.assign({ Cookie: cookieString }, headers),
        signal,
        data,
    };
    return axios(config);
});
