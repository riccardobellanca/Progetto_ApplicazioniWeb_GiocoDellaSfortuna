import React, { createContext, useState, useContext, useEffect } from "react";

// Crea il contesto
const UserContext = createContext(null);

// Hook personalizzato per usare facilmente il contesto
export const useUser = () => useContext(UserContext);

// Provider
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Recupera l'utente al primo caricamento
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // 🔹 mancava questo
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // 🔹 rimuove i dati anche dal localStorage
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
