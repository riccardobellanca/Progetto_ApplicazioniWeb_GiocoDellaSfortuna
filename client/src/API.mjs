// API.mjs
const SERVER_URL = "http://localhost:5000";

class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}

const handleApiCall = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const responseJson = await response.json();

  if (!responseJson.success) {
    //console.log("responseJson => " + JSON.stringify(responseJson,null,2));
    throw new ApiError(
      responseJson.data?.message || "Errore API",
      responseJson.data?.code || response.status
    );
  }

  return responseJson.data;
};

export const API = {
  login: async (username, password) => {
    return handleApiCall(SERVER_URL + "/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  register: async (username, password) => {
    return handleApiCall(SERVER_URL + "/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  logout: async () => {
    return handleApiCall(SERVER_URL + "/auth/logout", {
      method: "POST",
    });
  },

  getProfileInfo: async (profileId) => {
    return handleApiCall(SERVER_URL + `/profile/${profileId}`, {
      method: "GET",
    });
  },
};
