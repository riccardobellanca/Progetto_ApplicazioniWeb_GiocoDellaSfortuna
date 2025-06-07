
export const checkInput = (username, password, showError) => {
  username = username.trim();
  password = password.trim();
  if (!username || !password) {
    showError("Tutti i campi sono obbligatori");
    return false;
  }
  if (username.length < 4) {
    showError("Username deve avere almeno 4 caratteri");
    return false;
  }
  if (password.length < 6) {
    showError("Password deve avere almeno 6 caratteri");
    return false;
  }
  // Validazione username (solo lettere, numeri e underscore)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    showError("Username può contenere solo lettere, numeri e underscore");
    return false;
  }
  return true;
};
