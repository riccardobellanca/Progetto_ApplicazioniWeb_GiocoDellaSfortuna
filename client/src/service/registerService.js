export const checkInput = (username, passwordFirst, passwordSecond) => {
  if (!username || !passwordFirst || !passwordSecond) {
    throw new Error("Compila tutti i campi");
  }
  if (passwordFirst !== passwordSecond) {
    throw new Error("Le password non coincidono");
  }
  if (username.length < 4) {
    throw new Error("Lo username deve essere almeno 4 caratteri");
  }
  if (passwordFirst.length < 6) {
    throw new Error("La password deve essere almeno 6 caratteri");
  }
};
