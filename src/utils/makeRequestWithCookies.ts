import axios from "axios";

export const postWithCookies = async (
  url,
  headers,
  cookieJar,
  signal,
  data = {}
) => {
  const cookieString = cookieJar.join("; ");
  const config = {
    method: "POST",
    url,
    headers: {
      Cookie: cookieString,
      ...headers,
    },
    signal,
    data,
  };
  return axios(config);
};
