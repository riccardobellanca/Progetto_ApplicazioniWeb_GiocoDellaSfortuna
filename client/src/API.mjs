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
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const responseJson = await response.json();

  if (!responseJson.success) {
    throw new ApiError(
      responseJson.data?.message || "Errore API",
      responseJson.data?.code || response.status
    );
  }

  return responseJson.data;
};

/**
 * Consente di gestire le chiamate effettuate dal browser ed indirizzate al server
 */
export const API = {
  login: async (username, password) => {
    return handleApiCall(SERVER_URL + "/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  register: async (username, password, confirmPassword) => {
    return handleApiCall(SERVER_URL + "/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password, confirmPassword }),
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

  submitGuess: async (position) => {
    return handleApiCall(SERVER_URL + "/game/guess", {
      method: "POST",
      body: JSON.stringify({ position }),
    });
  },

  checkSession: async () => {
    return handleApiCall(SERVER_URL + "/session", {
      method: "GET",
    });
  },

  startDemo: async () => {
    return handleApiCall(SERVER_URL + `/demo`, {
      method: "GET",
    });
  },

  submitDemoGuess: async (position) => {
    return handleApiCall(SERVER_URL + "/demo/guess", {
      method: "POST",
      body: JSON.stringify({ position }),
    });
  },

  startGameTimer: async () => {
    const startTime = Date.now();
    return await handleApiCall(SERVER_URL + "/game/timer", {
      method: "POST",
      body: JSON.stringify({ startTime }),
    });
  },

  startDemoTimer: async () => {
    const startTime = Date.now();
    return await handleApiCall(SERVER_URL + "/demo/timer", {
      method: "POST",
      body: JSON.stringify({ startTime }),
    });
  },
};
