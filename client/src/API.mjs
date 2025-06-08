const SERVER_URL = "http://localhost:5000";
export const API = {};

API.login = async (username, password) => {
  try {
    const response = await fetch(SERVER_URL + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const response_json = await response.json();

    if (response_json.success) return response_json.data;
    else throw new Error(response_json.data.message);
  } catch (error) {
    if (error !== undefined) throw error;
    throw new Error("Impossibile connettersi al server");
  }
};

API.register = async (username, password) => {
  try {
    const response = await fetch(SERVER_URL + "/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    const response_json = await response.json();

    if (response_json.success) return response_json.data;
    else throw new Error(response_json.data.message);
  } catch (error) {
    if (error !== undefined) throw error;
    throw new Error("Impossibile connettersi al server");
  }
};

API.logout = async () => {
  try {
    const res = await fetch(SERVER_URL + "/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Logout fallito");
    }

    return true;
  } catch (err) {
    throw new Error(err.message || "Impossibile connettersi al server");
  }
};













