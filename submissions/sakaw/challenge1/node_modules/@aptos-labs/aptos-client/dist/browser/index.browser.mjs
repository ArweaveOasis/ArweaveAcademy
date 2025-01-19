// src/index.browser.ts
import axios from "axios";
async function aptosClient(options) {
  var _a;
  const { params, method, url, headers, body, overrides } = options;
  const requestConfig = {
    headers,
    method,
    url,
    params,
    data: body,
    withCredentials: (_a = overrides == null ? void 0 : overrides.WITH_CREDENTIALS) != null ? _a : true
  };
  try {
    const response = await axios(requestConfig);
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
      config: response.config
    };
  } catch (error) {
    const axiosError = error;
    if (axiosError.response) {
      return axiosError.response;
    }
    throw error;
  }
}
export {
  aptosClient as default
};
//# sourceMappingURL=index.browser.mjs.map