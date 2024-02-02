var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
