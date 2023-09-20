import axios from "axios";

export const postWithCookies = async (url, headers, cookieJar, data = {}) => {
  const cookieString = cookieJar.join("; ");
  const config = {
    method: "POST",
    url,
    headers: {
      Cookie: cookieString,
      ...headers,
    },
    data,
  };
  return axios(config);
};
