// API.mjs
const SERVER_URL = "http://localhost:5000";

export class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.message = message;
  }
  getMessage = () => {
    return this.message.message;
  };
}

const handleApiCall = async (url, options = {}) => {
  /*
  console.group(`🚀 ${options.method} ${url}`);
  console.log("📦 Body:", JSON.stringify(options.body,null,2));
  console.log("📋 Headers:", {
    "Content-Type": "application/json",
    credentials: "include",
    ...options.headers,
  });
  console.log("⚙️ Full Options:", JSON.stringify(options,null,2));
  console.groupEnd();
*/

  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const responseJson = await response.json();
  console.log("responseJson => " + JSON.stringify(responseJson,null,2));
  
  if (!responseJson.success) {
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

  getProfileHistory: async (profileId) => {
    return handleApiCall(SERVER_URL + `/profile/${profileId}/history`, {
      method: "GET",
    });
  },

  startGame: async () => {
    return handleApiCall(SERVER_URL + `/game`, {
      method: "GET",
    });
  },

  submitGuess: async (gameId, position) => {
    return handleApiCall(SERVER_URL + "/game/guess", {
      method: "POST",
      body: JSON.stringify({ gameId, position }),
    });
  },
};
