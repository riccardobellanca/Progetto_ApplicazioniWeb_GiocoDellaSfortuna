import { useToast } from "./contexts/ToastContext";

const SERVER_URL = "http://localhost:5000/api";
export const API = {};

API.login = async (username, password, showSuccess, showError) => {
  try {
    const response = await fetch(SERVER_URL + "/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errMsg = await response.text();
      throw new Error(errMsg || "Errore durante il login");
    }

    const data = await response.json();
    showSuccess("Login effettuato con successo");
    return data;

  } catch (err) {
    showError(err.message);
    throw err;
  }
};
