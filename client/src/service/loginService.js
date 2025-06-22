/**
 * Consente di effettuare alcuni semplici controlli sui dati inseriti dall'utente in fase di Login
 */
export const checkInput = (username, password) => {
  username = username.trim();
  password = password.trim();
  if (!username || !password) {
    throw new Error("Tutti i campi sono obbligatori");
  }
  if (username.length < 4) {
    throw new Error("Username deve avere almeno 4 caratteri");
  }
  if (password.length < 6) {
    throw new Error("Password deve avere almeno 6 caratteri");
  }
  // Validazione username (solo lettere, numeri e underscore)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new Error("Username può contenere solo lettere, numeri e underscore");
  }
};
